const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "user" },
    products: [
      {
        _id: false,
        productId: { type: mongoose.Types.ObjectId, ref: "products" },
        title: String,
        quantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        discount: {
          type: Number,
          default: 0,
        },
        coverImage: String,
        addedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ], 
    coupon:{
      code:String,
      maxDiscount:Number,
      discount:Number
    },
    totalProducts:Number,
    totalPrice:Number,
    totalSavings:Number,
    subTotal:Number
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = cartSchema;