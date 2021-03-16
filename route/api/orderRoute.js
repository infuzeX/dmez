const router = require("express").Router();

const authMiddleware = require("../../middleware/auth");
const checkoutMiddleware = require("../../middleware/checkout");

const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(
    /*checkoutMiddleware.verifyOrder,
    checkoutMiddleware.verifyGETCart,
    checkoutMiddleware.verifyCheckout,*/
    checkoutMiddleware.verifyCheckoutRequest,
    orderController.placeOrder
  )
  .get(
    authMiddleware.verifyToken,
    authMiddleware.preventApiAccess,
    orderController.fetchOrders
  );

module.exports = router;
