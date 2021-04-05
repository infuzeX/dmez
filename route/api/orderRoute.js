const router = require("express").Router();

const authMiddleware = require("../../middleware/auth");
const checkoutMiddleware = require("../../middleware/checkout");

const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(checkoutMiddleware.verifyCheckoutRequest, orderController.placeOrder)
  .get(
    authMiddleware.verifyToken,
    authMiddleware.preventApiAccess,
    orderController.fetchOrders
  );

router
  .route("/:orderId/:state")
  .patch(
    authMiddleware.verifyToken,
    authMiddleware.preventApiAccess,
    orderController.updateOrderStatus
  );

module.exports = router;
