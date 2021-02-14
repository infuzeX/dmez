const jwt = require('jsonwebtoken');
const { promisify } = require('util');

//verify token
exports.verifyToken = async (req, res, next) => {
   try {
      const token = req.cookies.token;
      if (token) {
         const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
         req['userId'] = decoded.userId;
      }
      next()
   } catch (err) {
      req.userId = null;
      next();
   }
}

//prevent unauth access to page
exports.preventPageAccess = async (req, res, next) => req.userId ? next() : res.redirect('/')

exports.logoutCont = (req, res) => {
   if (!req.cookies.token)
      return res.redirect('/');

   res.cookie('token', '', { maxAge: 1, expiresIn: 1 })
   res.redirect('/')
}