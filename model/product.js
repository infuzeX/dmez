const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: String,
  brand: String,
  title: String,
  Number: String,
  price: Number,
  discount: Number,
  quantity: Number,
  description: String,
  coverImage: String,
  images: Array,
  diseases: [String],
  ingredients: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = productSchema;