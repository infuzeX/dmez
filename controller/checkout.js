const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();
const jwt = require("../utils/jwt");

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await razorpay.orders.create({
    amount: req.cart["totalAmount"] * 100,
    currency: "INR",
  });
  const cartOrdertoken = await jwt.encode(
    {
      cartId: req.cart._id,
      orderId: order.id,
      customerId: req.userId,
      couponDiscount: req.cart.couponDiscount,
      charge: req.cart.charge,
      totalAmount: req.cart.totalAmount,
    },
    process.env.ORDER_SECRET
  );
  res
    .status(200)
    .cookie("cart", cartOrdertoken, {
      domain: process.env.COOKIE_ORIGIN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({ status: "success", path: "/cart/checkout" });
});