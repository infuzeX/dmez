const router = require("express").Router();

const checkoutMiddleware = require('../../middleware/checkout');
const authController = require("../../controller/authController");
const checkoutController = require("../../controller/checkoutController");

router
  .route("/")
  .post(
    authController.verifyToken,
    authController.preventApiAccess,
    checkoutMiddleware.checkCart,
    checkoutController.createOrder
  )

module.exports = router;
