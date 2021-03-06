const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//verify token
exports.verifyToken_OFF = async (req, res, next) => {
   try {
      const token = req.cookies.token;
      if (token) {
         const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
         req["userId"] = decoded.userId;
      }
      next();
   } catch (err) {
      req.userId = null;
      next();
   }
};

exports.verifyToken = (req, res, next) => {
   req.userId = "603e8acbd514f9b2020dcd79"
   next();
};

//prevent unauth access to page
exports.preventPageAccess = async (req, res, next) =>
   req.userId ? next() : res.redirect("/");
//prevent auth access to login page
exports.preventLoginAccess = async (req, res, next) =>
   req.userId ? res.redirect("/home") : next();
//prevent unauth access to api
exports.preventApiAccess = async (req, res, next) =>
   req.userId ? next() : next(new AppError("Unauthorized access", 401));
//Logout user
exports.logoutCont = (req, res) => {
   if (!req.cookies.token) return res.redirect("/");

   res.cookie("token", "", { maxAge: 1, expiresIn: 1 });
   res.redirect("/");
};
