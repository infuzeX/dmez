const router = require("express").Router();

const auth = require("../../controller/authController");
const checkout = require("../../controller/checkoutController");

router
  .route("/")
  .post(
    auth.verifyToken,
    auth.preventApiAccess,
    checkout.verifyCart,
    checkout.createOrder
  )

module.exports = router;
