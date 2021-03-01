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
  .get(
    auth.verifyToken,
    auth.preventApiAccess,
    checkout.verifyCart,
    checkout.verifyOrder,
    checkout.verifyCheckout,
    checkout.renderCheckoutPage
  );

module.exports = router;
