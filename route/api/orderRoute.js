const router = require("express").Router();

const checkoutMiddleware = require("../../middleware/checkout");

const authController = require("../../controller/authController");
const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(
    checkoutMiddleware.verifyOrder,
    checkoutMiddleware.verifyCheckout,
    checkoutMiddleware.verifyGETCart,
    orderController.placeOrderCont
  )
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    orderController.getOrdersCont
  );

module.exports = router;
