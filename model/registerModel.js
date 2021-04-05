const mongoose = require("mongoose");

exports.User = mongoose.model('user', require('./user'));
exports.Cart = mongoose.model('cart', require('./cart'));
exports.Order = mongoose.model('order', require('./order'));
