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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.virtual("totalAmount").get(function () {
  let totalAmount = 0;
  this.products.forEach(({ price, quantity, discount }) => totalAmount += (quantity * (price - discount)));
  return totalAmount;
});

module.exports = cartSchema;