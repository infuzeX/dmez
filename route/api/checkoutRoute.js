const router = require("express").Router();

const checkoutMiddleware = require('../../middleware/checkout');
const authController = require("../../controller/auth");
const checkoutController = require("../../controller/checkoutController");

router
  .route("/")
  .post(
    authController.verifyToken,
    authController.preventApiAccess,
    checkoutMiddleware.validateCheckoutCart,
    checkoutController.createOrder
  )

module.exports = router;
