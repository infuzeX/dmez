const AppError = require("../utils/appError");
const jwt = require("../utils/jwt");

//verify token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
      req["userId"] = decoded.userId;
    }
    next();
  } catch (err) {
    req.userId = null;
    next();
  }
};

//prevent unauth access to page
exports.preventPageAccess = async (req, res, next) => {
  if (req.userId) return next();

  res
    .cookie("path", req.originalUrl, {
      domain: process.env.COOKIE_ORIGIN,
      httpOnly: true,
    })
    .redirect("/login");
};
//prevent auth access to login page
exports.preventLoginAccess = async (req, res, next) =>
  req.userId ? res.redirect("/") : next();

//prevent unauth access to api
exports.preventApiAccess = async (req, res, next) =>
  req.userId ? next() : next(new AppError("Unauthorized access", 401));

//Logout user
exports.logout = async (req, res, next) => {
  res.cookie("token", "", { 
    maxAge: 0, 
    httpOnly:true,
    domain:process.env.COOKIE_ORIGIN || 'dmez.in' 
  }).redirect("/");
};
