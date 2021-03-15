const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//describe structure of data
const orderSchema = new Schema({
  customerId: String,
  orderId: String,
  paymentId: String,
  products: [{
    productId: mongoose.Types.ObjectId,
    imageCover: String,
    title: String,
    brand: String,
    quantity: Number,
    price: Number,
    discount: Number
  }],
  totalProducts: Number, 
  totalAmount: Number,
  totalSavings: Number,
  address: {
    state: String,
    city: String,
    zipcode: Number,
    area:String,
    landmark: String,
    flatnumber: String,
    contact: Number
  },
  status: {
    type: String,
    default: 'placed',
    enum: ['placed','dispatched', 'canceled', 'returned', 'delivered']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  deliveredAt: Date
});

//create a model of schema
module.exports = mongoose.model("order", orderSchema);