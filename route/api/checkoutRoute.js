const router = require("express").Router();

const auth = require("../../controller/authController");
const checkout = require("../../controller/checkoutController");

router
  .route("/")
  .post(
    auth.verifyToken,
    auth.preventApiAccess,
    checkout.checkCart,
    checkout.createOrder
  )

module.exports = router;
