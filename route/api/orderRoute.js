const router = require("express").Router();

const checkoutMiddleware = require("../../middleware/checkout");

const authController = require("../../controller/authController");
const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(
    checkoutMiddleware.verifyOrder,
    checkoutMiddleware.verifyGETCart,
    checkoutMiddleware.verifyCheckout,
    orderController.placeOrderCont
  )
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    orderController.getOrdersCont
  );

module.exports = router;
