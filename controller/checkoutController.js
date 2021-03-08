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
  req.cart["charge"] = req.cart["totalAmount"] >= 400 ? 0 : 80;
  const order = await razorpay.orders.create({
    amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
    currency: "INR",
  });

  req.cart["orderId"] = order.id;

  console.log(req.cart);
  const token = await jwt.sign(req.cart, ORDER_SECRET);
  res
    .status(200)
    .cookie("_ciic_", token, {
      domain: DOMAIN,
      httpOnly: true,
      secure: NODE_ENV,
    })
    .json({ status: "success", path: "/cart/checkout" });
});

//VERIFY ORDER BEFORE RENDERING CHECKOUT PAGE
exports.verifyOrder = async (req, res, next) => {
  console.log("in verify order");
  try {
    const token = req.cookies._ciic_;
    if (!token) throw "err";
    req.checkout = await jwt.verify(token, ORDER_SECRET);
    next();
  } catch (err) {
    res.redirect("/cart");
  }
};

//VERIFY CART BEFORE RENDERING CHECKOUT PAGE
exports.verifyGETCart = async (req, res, next) => {
  console.log("In verify get cart");
  const cart = await cartService.cartDetails(req.userId);
  if (!cart) return res.redirect("/cart");
  cart["_id"] = cart["_id"].toString();
  req.cart = cart.toJSON();
  next();
};

exports.verifyCheckout = catchAsync(async (req, res, next) => {
  const { _id, customerId, totalAmount } = req.checkout;
  if (
    customerId == req.userId &&
    _id == req.cart.id &&
    totalAmount == req.cart.totalAmount
  ) {
    return next();
  }
  res.redirect("/cart");
});

exports.renderCheckoutPage = (req, res) => { 
  res.render("checkout.ejs", {data: {
      ...req.cart,
      key: KEY_ID,
      order: req.checkout.orderId,
      charge:req.checkout.charge,
      total:(req.checkout.charge + req.checkout.totalAmount)
  }});
};
