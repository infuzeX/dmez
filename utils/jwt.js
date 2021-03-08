const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.verify = async (token, secret) => await promisify(jwt.verify)(token, secret);

exports.sign = async (payload, secret) => await promisify(jwt.sign)(payload, secret);
