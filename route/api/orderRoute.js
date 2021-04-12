const router = require("express").Router();

const authController = require("../../controller/auth");
const checkoutController = require("../../controller/checkout");

const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(checkoutController.verifyCheckoutRequest, orderController.placeOrder)
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    orderController.fetchOrders
  );

router
  .route("/:orderId/:state")
  .patch(
    authController.verifyToken,
    authController.preventApiAccess,
    orderController.updateOrderStatus
  );

module.exports = router;
