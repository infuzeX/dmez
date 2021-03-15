const { catchAsync } = require("../utils/catchError");

const razorpay = require("../utils/pay").razorpayConfig();
const jwt = require("../utils/jwt");

//HANDLERS
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
  const token = await jwt.sign(req.cart, process.env.ORDER_SECRET);

  res
    .status(200)
    .cookie("_ciic_", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({ status: "success", path: "/cart/checkout" });
});
