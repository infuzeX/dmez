const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();
const jwt = require("../utils/jwt");
const cartService = require("../service/cartService");
//ENVIRONMENT VARIABLES
const { NODE_ENV, SECRET, KEYID, DOMAIN } = process.env;

exports.checkCart = catchAsync(async (req, res, next) => {
  const cart = (await cartService.cartSummary(req.userId))[0];
  if (!cart) return next(new AppError("No Item added in cart", 404));
  req.cart = {
    ...cart,
    customerId: req.userId.toString(),
  };
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  if (req.body.cod) return next();

  req.cart["charge"] = req.cart["totalAmount"] >= 400 ? 0 : 80;

  const order = await razorpay.orders.create({
    amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
    currency: "INR",
  });

  const token = await jwt.sign(req.cart, SECRET);
  res
    .status(200)
    .cookie("_ciic_", token, {
      domain: DOMAIN,
      httpOnly: true,
      secure: NODE_ENV,
    })
    .json({ status: "success", path: "/cart/checkout" });
});

//PREVENT EMPTY CART FOR GET ORDER
exports.verifyGETCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.cartDetails_new(req.userId);

  if (!cart) res.redirect("/cart");

  cart["totalAmount"] = 0;
  cart["totalProducts"] = 0;

  cart.products.forEach(({ price, discount, quantity }) => {
    cart["totalAmount"] += quantity * (price - discount);
    cart["totalProducts"] += 1;
  });

  cart["cartId"] = cart["_id"].toString();
  delete cart["_id"];
  req.cart = cart;
  next();
});

//VERIFY ORDER BEFORE RENDERING CHECKOUT PAGE
exports.verifyOrder = catchAsync(async (req, res, next) => {
  const token = req.cookies._ciic_;
  const checkout = jwt.verify(token, SECRET);
  req.checkout = checkout;
  next();
});

//PREVENT ILLEGAL MODIFICATION OF CART
exports.verifyCheckout = catchAsync(async (req, res, next) => {
  //CART PROP SHOULD MATCH ORDER PROP
  const verifyUser = req.checkout.customerId == req.userId;
  const verifyCart = req.checkout.cartId == req.cart.cartId;
  const verifyCartAmount = req.order.totalAmount == req.cart.totalAmount;
  const verifyProducts = req.order.totalProducts == req.cart.totalProducts;

  if (!verifyUser || !verifyCart || !verifyCartAmount || !verifyProducts)
    return res.redirect("/cart");

  next();
});

exports.renderCheckoutPage = (req, res) => {
  res.render("checkout.ejs", {
    data: {
      ...req.cart,
      key: KEY_ID,
      amount: req.order.amount,
      order: req.order.orderId,
    },
  });
};
