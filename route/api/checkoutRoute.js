const router = require("express").Router();

const authMiddleware = require("../../middleware/auth");
const checkoutMiddleware = require('../../middleware/checkout');

const checkoutController = require("../../controller/checkoutController");

router
  .route("/")
  .post(
    authMiddleware.verifyToken,
    authMiddleware.preventApiAccess,
    checkoutMiddleware.validateCheckoutCart,
    checkoutController.createOrder
  )

module.exports = router;
