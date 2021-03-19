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

/*
exports.verifyToken = (req, res, next) => {
  req.userId = process.env.NODE_ENV
    ? "60340b88f2cfb2bb9c0bf19f"
    : "602c03dda1718b2b3c73e553";
  next();
};*/

//prevent unauth access to page
exports.preventPageAccess = async (req, res, next) => {
  console.log(req.userId);
  if (req.userId) return next();

  res
    .cookie("path", req.originalUrl, {
      domain:process.env.DOMAIN,
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