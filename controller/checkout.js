const { catchError } = require("../utils/catchError");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();
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

exports.createOrder = catchAsync(async (req, res, next) => {
  //SET DELIVERY CHARGE
  const totalAmount = req.cart["totalAmount"];
  if (totalAmount <= 200) req.cart["charge"] = 100;
  else if (totalAmount > 200 && totalAmount <= 400) req.cart["charge"] = 50;
  else req.cart["charge"] = 0;
  //CREATE ORDERS
  const order = await razorpay.orders.create({
    amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
    currency: "INR",
  });
  req.cart["orderId"] = order.id;
  const token = await jwt.encode(req.cart, process.env.ORDER_SECRET);
  res
    .status(200)
    .cookie("_ciic_", token, {
      domain:process.env.COOKIE_ORIGIN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({ status: "success", path: "/cart/checkout" });
});

//validate checkout and cart for order
exports.verifyCheckoutRequest = async (req, res, next) => {
  try {
    //validate checkout token
    const checkoutToken = req.cookies._ciic_;
    req["checkout"] = await jwt.decode(checkoutToken, process.env.ORDER_SECRET);
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