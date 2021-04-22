const orderService = require("../service/orderService");
const { deleteCart } = require("../service/cartService");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mail = require("../utils/email");

const { verifySignature, razorpayConfig } = require("../utils/pay");

//PLACE ORDER AFTER PAYMENT
exports.placeOrder = catchAsync(async (req, res, next) => {
  //VERIFY SIGNATURE

  //VERIFY CHECKOUT WITH CART
  if (
    !(req.checkout["cartId"] == req.cart["_id"].toString()) ||
    !(req.checkout["totalAmount"] == req.cart["totalAmount"])
  ) {
    return next(
      new AppError(
        "failed to place order, if you paid please contact to owner with orderId and paymentId",
        400
      )
    );
  }
  //CREATE NEW ORDER
  const order = await orderService.createOrder({
    customerId: req.checkout.customerId,
    cart: req.cart,
    address: req.body.address,
    payment: req.body.payment,
  });

  if (!order) {
    return next(
      new AppError(
        "failed to place order, if you paid please contact to owner with orderId and paymentId",
        400
      )
    );
  }

  await deleteCart(req.cart._id);

  mail.sendMailToClient({
    subject: "New order placed",
    email: req.cart.customerId.email,
    message: `We got your order of ${req.cart.totalProducts} Items of rs ${req.checkout.totalAmount}. We will inform you about order dispatch. THANK YOU`,
  });

  mail.sendMailToAdmin({
    subject: "New order placed",
    email: req.cart.customerId.email,
    message: `New order of ${req.cart.totalProducts} Items of rs ${req.checkout.totalAmount}.`,
  });

  res.cookie("cart", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV,
  });
  res.status(200).json({ status: "success", path: "/success" });
});

//FETCH ALL ORDERS
exports.fetchOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getOrders(req.userId, {});
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

//cancel order
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const state = {
    cancel: "cancelled",
    return: "returned",
  }[req.params.state];

  if (!state) return next(new AppError("Invalid request", 400));

  const order = await orderService.updateOrderStatus({
    _id: req.params.orderId,
    customerId: req.userId,
    data: {
      state,
      date: Date.now(),
    },
  });

  if (!order)
    return next(new AppError(`Failed to ${req.params.state} order`, 400));

  mail.sendMailToClient({
    subject: `Order ${state}`,
    email: order.address.email,
    message: `We got your order ${req.params.state} request. We will inform you about the progress. THANK YOU`,
  });

  mail.sendMailToAdmin({
    subject: `Order ${state} by user`,
    email: order.address.email,
    message: `${order.address.name} ${state} the order. Order details <a href="${req.protocol}://admin.dmez.in/orders/${order._id}">here</a>`,
  });

  res.status(200).json({
    status: "success",
    data: order ? { order } : order,
  });
});