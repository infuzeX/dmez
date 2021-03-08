const Cart = require("../model/cart");
const mongoose = require("mongoose");

exports.cartSummary = async (customerId) => {
    return await Cart.aggregate([
        {
            $match: { customerId: mongoose.Types.ObjectId(customerId) },
        },
        {
            $unwind: "$products",
        },
        {
            $group: {
                cartId: "$_id",
                totalProducts: { $sum: 1 },
                totalAmount: {
                    $sum: {
                        $multiply: [
                            "$products.quantity",
                            { $subtract: ["$products.price", "$products.discount"] },
                        ],
                    },
                },
            },
        },
    ]);
}

exports.cartDetails = async (customerId) => {

    return await Cart.aggregate([
        {
            $match: { customerId: mongoose.Types.ObjectId(customerId) },
        },
        {
            $unwind: "$products",
        },
        {
            $group: {
                cartId: "$_id",
                products: {
                    $push: "$products",
                },
                totalSavings: {
                    $sum: { $multiply: ["$products.quantity", "$products.discount"] },
                },
                totalProducts: { $sum: 1 },
                totalAmount: {
                    $sum: {
                        $multiply: [
                            "$products.quantity",
                            { $subtract: ["$products.price", "$products.discount"] },
                        ],
                    },
                },
            },
        },
    ]);
};