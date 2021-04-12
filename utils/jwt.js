const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.decode = async (token, secret) => await promisify(jwt.verify)(token, secret);

exports.encode = async (payload, secret) => await promisify(jwt.sign)(payload, secret);
