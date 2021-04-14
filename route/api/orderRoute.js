const router = require("express").Router();

const authController = require("../../controller/auth");
const cartController = require("../../controller/cart");
const orderController = require("../../controller/orderController");

router
  .route("/")
  .post(
    authController.verifyOrderToken,
    cartController.verifyCart,
    orderController.placeOrder
  )
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
