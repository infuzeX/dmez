const { catchAsync, handleRequestMethodError } = require("../utils/catchError");
const jwt = require("../utils/jwt");

const cartService = require("../service/cartService");

exports.checkCart = catchAsync(async (req, res, next) => {
  const cart = (await cartService.cartSummary(req.userId))[0];
  if (!cart) return next(new AppError("No Item added in cart", 404));
  req.cart = {
    ...cart,
    customerId: req.userId.toString(),
  };
  next();
});

//VERIFY CART BEFORE RENDERING CHECKOUT PAGE
exports.verifyGETCart = async (req, res, next) => {
  const cart = await cartService.cartDetails(req.userId);
  console.log(cart);
  if (!cart) return res.redirect("/cart");
  cart["_id"] = cart["_id"].toString();
  req.cart = cart.toJSON();
  next();
};

//VERIFY ORDER BEFORE RENDERING CHECKOUT PAGE
exports.verifyOrder = async (req, res, next) => {
  try {
    const token = req.cookies._ciic_;
    req.checkout = await jwt.verify(token, process.env.ORDER_SECRET);
    next();
  } catch (err) {
    return handleRequestMethodError(
      req.originalUrl,
      req.method,
      err.message,
      res,
      next
    );
  }
};

exports.verifyCheckout = async (req, res, next) => {
  const { _id, customerId, totalAmount } = req.checkout;
  //VERIFY CHECKOUT
  if (
    customerId == req.userId &&
    _id == req.cart._id &&
    totalAmount == req.cart.totalAmount
  ) {
    return next();
  }
  //RESPONSE RELATED TO METHOD
  return handleRequestMethodError(req.originalUrl, req.method, null, res, next);
};
