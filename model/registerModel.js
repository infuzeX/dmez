const mongoose = require("mongoose");

const productSchema = require('./product');
const userSchema = require('./user');
const newCartSchema = require('./newCart');
const cartSchema = require('./cart');
const couponSchema = require('./coupon');
const orderSchema = require('./order');

exports.Product = mongoose.model('product', productSchema);
exports.User = mongoose.model('user', userSchema);
exports.Cart = mongoose.model('cart', cartSchema);
exports.newCart = mongoose.model('newCart', newCartSchema);
exports.Coupon = mongoose.model('coupon', couponSchema);
exports.Order = mongoose.model('order', orderSchema);