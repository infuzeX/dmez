const mongoose = require("mongoose");

const productSchema = require('./product');
const userSchema = require('./user');
const cartSchema = require('./cart');
const orderSchema = require('./order');

exports.Product = mongoose.model('product', productSchema);
exports.User = mongoose.model('user', userSchema);
exports.Cart = mongoose.model('cart', cartSchema);
exports.Order = mongoose.model('order', orderSchema);
