const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});

exports.verifyOrder = async (req, res, next) => {

    const orderId = req.params.id;
    if (!orderId)
        return res.redirect('/cart');

    const order = await razorpay.orders.fetch(orderId);

    //CHECK ORDER IS INVALID OR AMOUNT IS PAID
    if (!order || order.amount_paid)
        return res.redirect('/cart');

    req.order = { orderId, ...order.notes }
    next();
}