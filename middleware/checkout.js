const { catchError } = require("../utils/catchError");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("../utils/jwt");

const cartService = require("../service/cartService");

//validate cart for checkout
exports.validateCheckoutCart = catchAsync(async (req, res, next) => {
  const cart = (await cartService.cartSummary(req.userId))[0];
  if (!cart) return next(new AppError("No Item added in cart", 404));
  req.cart = {
    ...cart,
    customerId: req.userId,
  };
  next();
});

//validate checkout and cart for order
exports.verifyCheckoutRequest = async (req, res, next) => {
  try {
    //validate checkout token
    const checkoutToken = req.cookies._ciic_;
    req["checkout"] = await jwt.verify(checkoutToken, process.env.ORDER_SECRET);
    req["userId"] = req["userId"] || req.checkout["customerId"];
    //validate cart
    req["cart"] = (await cartService.cartDetails(req.userId)).toJSON();

    if (!req["cart"]) throw { message: "Cart is empty!" };

    if (
      !(req.checkout["_id"] == req.cart["_id"].toString()) &&
      !(req.checkout["totalAmount"] == req.cart["totalAmount"])
    ) {
      throw { message: "Something went wrong!" };
    }

    next();
  } catch (error) {
    const { originalUrl, method } = req;
    return catchError(originalUrl, method, error.message, res, next);
  }
};
