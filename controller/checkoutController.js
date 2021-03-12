const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();
const jwt = require("../utils/jwt");

const cartService = require("../service/cartService");

//ENVIRONMENT VARIABLES
const { NODE_ENV, ORDER_SECRET, KEY_ID, DOMAIN } = process.env;

exports.checkCart = catchAsync(async (req, res, next) => {
  const cart = (await cartService.cartSummary(req.userId))[0];
  if (!cart) return next(new AppError("No Item added in cart", 404));
  req.cart = {
    ...cart,
    customerId: req.userId.toString(),
  };
  next();
});

//HANDLERS
exports.createOrder = catchAsync(async (req, res, next) => {
  //SET DELIVERY CHARGE
  const totalAmount = req.cart["totalAmount"];
  if (totalAmount <= 200) req.cart["charge"] = 100;
  if (totalAmount > 200 && totalAmount <= 400) req.cart["charge"] = 50;
  else req.cart["charge"] = 0;

  const order = await razorpay.orders.create({
    amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
    currency: "INR",
  });
  req.cart["orderId"] = order.id;

  const token = await jwt.sign(req.cart, ORDER_SECRET);
  res
    .status(200)
    .cookie("_ciic_", token, {
      httpOnly: true,
      secure: (NODE_ENV === "production"),
    })
    .json({ status: "success", path: "/cart/checkout" });
});

//VERIFY ORDER BEFORE RENDERING CHECKOUT PAGE
exports.verifyOrder = async (req, res, next) => {
  try {
    const token = req.cookies._ciic_;
    req.checkout = await jwt.verify(token, ORDER_SECRET);
    next();
  } catch (err) {
    res.redirect("/cart");
  }
};

//VERIFY CART BEFORE RENDERING CHECKOUT PAGE
exports.verifyGETCart = async (req, res, next) => {
  const cart = await cartService.cartDetails(req.userId);
  if (!cart) return res.redirect("/cart");
  cart["_id"] = cart["_id"].toString();
  req.cart = cart.toJSON();
  next();
};

exports.verifyCheckout = async (req, res, next) => {
  const { _id, customerId, totalAmount } = req.checkout;
  if (
    customerId == req.userId &&
    _id == req.cart._id &&
    totalAmount == req.cart.totalAmount
  ) {
    return next();
  }
  res.redirect("/cart");
};

exports.renderCheckoutPage = (req, res) => {
  res.render("checkout.ejs", {
    data: {
      ...req.cart,
      key: KEY_ID,
      order: req.checkout.orderId,
      charge: req.checkout.charge,
      total: req.checkout.charge + req.checkout.totalAmount,
    },
  });
};
