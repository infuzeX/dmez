const orderService = require("../service/orderService");
const { deleteCart } = require("../service/cartService");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { verifySignature, razorpayConfig } = require("../utils/pay");

//PLACE ORDER AFTER PAYMENT
exports.placeOrder = catchAsync(async (req, res, next) => {
  //VERIFY SIGNATURE

  //VERIFY CHECKOUT WITH CART
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

  await deleteCart(req.cart._id)
  res.cookie("_ciic_", true, {
    maxAge: 5 * 60,
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

  if(!state)
    return next(new AppError('Invalid request', 400));   

  const order = await orderService.updateOrderStatus({
    _id: req.params.orderId,
    customerId: req.userId,
    data: {
      state,
      date: Date.now(),
    },
  });

  if(!order)
    return next(new AppError(`Failed to ${req.params.state} order`, 400));  

  res.status(200).json({
    status: "success",
    data: order ? { order } : order,
  });
});
