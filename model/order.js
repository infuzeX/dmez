const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//describe structure of data
const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "user" },
  orderId: String,
  paymentId: String,
  products: [
    {
      productId: Schema.Types.ObjectId,
      imageCover: String,
      title: String,
      brand: String,
      quantity: Number,
      price: Number,
      discount: Number,
    },
  ],
  totalProducts: Number,
  totalAmount: Number,
  totalSavings: {
    type:Number,
    default:0
  },
  coupon:String,
  delivery: {
    type: Number,
    default: 0,
  },
  address: {
    name:String,
    state: String,
    city: String,
    zipcode: Number,
    area: String,
    landmark: String,
    flatnumber: String,
    contact: Number,
  },
  status: [
    {
      _id: false,
      state: {
        type: String,
        enum: ["placed", "dispatched", "cancelled", "returned", "delivered"],
      },
      date: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  currentStatus: {
    type: String,
    enum: ["placed", "dispatched", "cancelled", "returned", "delivered"],
  },
});

module.exports = orderSchema;
