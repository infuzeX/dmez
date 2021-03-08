const Razorpay = require('razorpay');

function razorpayConfig() {
    const config = {
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    }
    return new Razorpay(config)
}

//VERIFY PAYMENT BEFORE PLACING ORDER
function verifySignature({ orderId, paymentId, signature }) {
    const generatedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");

    return generatedSignature === signature;
}

module.exports = {
    razorpayConfig,
    verifySignature
}