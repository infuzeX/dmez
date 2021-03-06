const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();

const cartService = require("../service/cartService");

//PREVENT EMPTY CART
exports.verifyCart = catchAsync(async (req, res, next) => {
    const isPost = req.methods === "POST";
    const service = isPost ? "cartSummary" : "cartDetails";
    const cart = (await cartService[service](req.userId))[0];

    if (!cart && !cart.totalProducts) {
        return isPost
            ? next(new AppError("No Item added in cart", 404))
            : res.redirect("/cart");
    }

    cart["customerId"] = req.userId;
    req.cart = cart;

    next();
});

//CREATE PAYMENT ORDER IN RAZORPAY
exports.createOrder = catchAsync(async (req, res, next) => {
    //CHECK DELIVERY CHARGES
    req.cart["charge"] = req.cart["totalAmount"] >= 400 ? 0 : 80;
    //CREATE ORDER
    const order = await razorpay.orders.create({
        amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
        currency: "INR",
        offer_id: req.body.offer_id,
        notes: req.cart,
    });

    res
        .status(200)
        .cookie("order", order.id, {
            maxAge: 15 * 60 * 1000,
            domain: "127.0.0.1",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .json({ status: "success", data: null });
});

//VERIFY ORDER BEFORE RENDERING CHECKOUT PAGE
exports.verifyOrder = async (req, res, next) => {
    //CHECK ORDER IS AVAILABLE IN COOKIE
    const orderId = req.cookies.order;
    if (orderId) return res.redirect("/cart");
    const order = await razorpay.orders.fetch(orderId);
    //CHECK ORDER IS INVALID OR AMOUNT IS PAID
    if (!order || order.amount_paid) return res.redirect("/cart");

    req.order = { orderId, ...order.notes };
    next();
};

//PREVENT ILLEGAL MODIFICATION OF CART
exports.verifyCheckout = catchAsync(async (req, res, next) => {
    if (!order) res.redirect('/cart');
    //CART PROP SHOULD MATCH ORDER PROP
    const verifyUser = req.order.customerId == req.cart.customerId;
    const verifyCart = req.order.cartId == req.cart.cartId;
    const verifyCartAmount = req.order.totalAmount == req.cart.totalAmount;
    const verifyProducts = req.order.totalProducts == req.cart.totalProducts;

    if (!verifyUser || !verifyCart || !verifyCartAmount || !verifyProducts)
        return req.message = "Invalid request please checkout your cart again"

    next();
});

exports.renderCheckoutPage = (req, res, next) => {
    /**
     * render checkout page
     */
};
