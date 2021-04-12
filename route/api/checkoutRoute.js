const router = require("express").Router();

const authController = require("../../controller/auth");
const checkoutController = require("../../controller/checkout");

router
  .route("/")
  .post(
    authController.verifyToken,
    authController.preventApiAccess,
    checkoutController.validateCheckoutCart,
    checkoutController.createOrder
  )

module.exports = router;
