const router = require("express").Router();

const authController = require("../../controller/auth");
const checkoutMiddleware = require("../../middleware/checkout");

const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(checkoutMiddleware.verifyCheckoutRequest, orderController.placeOrder)
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
