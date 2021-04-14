const router = require("express").Router();

const authController = require("../../controller/auth");
const cartController = require("../../controller/cart");
const checkoutController = require("../../controller/checkout");

router
  .route("/")
  .post(
    authController.verifyToken,
    authController.preventApiAccess,
    cartController.verifyCart,
    checkoutController.createOrder
  )

module.exports = router;
