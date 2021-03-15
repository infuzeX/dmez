const orderService = require("../service/orderService");
const { deleteCart } = require("../service/cartService");

const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchError");
const { verifySignature, razorpayConfig } = require("../utils/pay");

//PLACE ORDER AFTER PAYMENT
exports.placeOrderCont = catchAsync(async (req, res, next) => {

  //VERIFY SIGNATURE

  //VERIFY CHECKOUT WITH CART
  const order = await orderService.placeOrder({
    customerId: req.checkout.customerId,
    cart: req.cart,
    address: req.body.address,
    payment: req.body.payment,
  });

  if (order) await deleteCart(req.cart._id);
  else
    return next(
      new AppError(
        "failed to place order, if you paid please contact to owner with orderId and paymentId",
        400
      )
    );

  res.cookie("_ciic_", true, { maxAge: 5 * 60, httpOnly:true, secure:process.env.NODE_ENV });
  res.status(200).json({ status: "success", path: "/success" });
});

//GET ALL ORDERS
exports.getOrdersCont = catchAsync(async (req, res, next) => {
  const orders = await orderService.getOrders(req.userId, req.query);
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});
