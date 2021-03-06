const mongoose = require("mongoose");
const { Cart } = require("../model/cart");

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
        _id: "$_id",
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
        _id: "$_id",
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

exports.cartDetails_new = async (customerId) => {
  return await Cart.findOne({ customerId }, { __v: 0 })
    .populate("customerId")
    .lean();
};
