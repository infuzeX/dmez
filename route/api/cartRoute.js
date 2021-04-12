const router = require("express").Router();

const authController = require("../../controller/auth");
const product = require("../../controller/productController");
const cartController = require("../../controller/cart");

router
  .route("/")
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    cartController.getCartProducts
  );

router
  .route("/coupon/:coupon")
  .patch(
    authController.verifyToken,
    authController.preventApiAccess,
    cartController.verifyCart,
    cartController.applyCoupon
  )
  .delete(
    authController.verifyToken,
    authController.preventApiAccess,
    cartController.verifyCart,
    cartController.removeCoupon
  );

router
  .route("/:productId")
  .patch(
    authController.verifyToken,
    authController.preventApiAccess,
    product.verifyProductEligiblity,
    cartController.addProductInCart
  )
  .put(
    authController.verifyToken,
    authController.preventApiAccess,
    product.checkProductQuantity,
    cartController.manageQuantity
  )
  .delete(
    authController.verifyToken,
    authController.preventApiAccess,
    cartController.deleteProductFromCart
  );

module.exports = router;
