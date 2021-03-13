const Order = require('../model/order');
const APIFeatures = require("../utils/apifeatures");

exports.placeOrder = async ({customerId, address, cart, payment}) => {

    return await Order.create({
        customerId,

        orderId: payment.orderId,
        paymentId: payment.paymentId,

        products: cart.products,
        totalProducts: cart.totalProducts,
        totalAmount: cart.totalAmount,
        totalSavings: cart.totalSavings,

        address: {
            name: address.name,
            state: address.state,
            city: address.city,
            zipcode: address.zipcode,
            landmark: address.landmark,
            flatnumber: address.flatnumber,
            contact: address.contact
        },
    })

}

exports.getOrders = async (customerId, queryString) => {
    const features = new APIFeatures(Order.find({ customerId }), queryString)
        .filter()
        .limitFields()
        .sort()
        .paginate();
    return await features.query;
}