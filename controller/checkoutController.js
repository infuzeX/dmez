const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const razorpay = require("../utils/pay").razorpayConfig();

const cartService = require("../service/cartService");

//PREVENT EMPTY CART FOR CREATE ORDER
exports.verifyCart = catchAsync(async (req, res, next) => {
    const cart = (await cartService.cartSummary(req.userId))[0];

    if (!cart && !cart.totalProducts)
        return next(new AppError("No Item added in cart", 404));

    cart["customerId"] = req.userId.toString();
    cart["cartId"] = cart["_id"].toString();
    delete cart["_id"];
    req.cart = cart;

    next();
});

//CREATE PAYMENT ORDER IN RAZORPAY
exports.createOrder = catchAsync(async (req, res, next) => {
    const domain = ['127.0.0.1', 'https://dmezshop.herokuapp' ]
    //CHECK DELIVERY CHARGES
    req.cart["charge"] = req.cart["totalAmount"] >= 400 ? 0 : 80;
    //CREATE ORDER
    const order = await razorpay.orders.create({
        amount: (req.cart["totalAmount"] + req.cart["charge"]) * 100,
        currency: "INR",
        //offer_id: req['body'] || req['body']['offer_id'] || null,
        notes: req.cart,
    });
    const isProd = (process.env.NODE_ENV === "production");
    res
        .status(200)
        .cookie("order", order.id, {
            maxAge: 15 * 60 * 1000,
            domain: domain[(isProd + 0)],
            httpOnly: true,
            secure: isProd,
        })
        .json({ status: "success", path:'/cart/checkout' });
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
    //CHECK ORDER IS AVAILABLE IN COOKIE
    const orderId = req.cookies.order;
    if (!orderId) return res.redirect("/cart");
    const order = await razorpay.orders.fetch(orderId);
    //CHECK ORDER IS INVALID OR AMOUNT IS PAID
    if (!order || order.amount_paid) return res.redirect("/cart");
    req.order = { orderId, amount: order.amount_due, ...order.notes };
    next();
});

//PREVENT ILLEGAL MODIFICATION OF CART
exports.verifyCheckout = catchAsync(async (req, res, next) => {
    //CART PROP SHOULD MATCH ORDER PROP
    const verifyUser = req.order.customerId == req.cart.customerId._id;
    const verifyCart = req.order.cartId == req.cart.cartId;
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
            key: process.env.KEY_ID,
            amount: req.order.amount,
            order: req.order.orderId,
        },
    });
};
