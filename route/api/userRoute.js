const router = require("express").Router();

const authController = require("../../controller/auth");
const userController = require("../../controller/user");

router
  .route("/")
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.fetchUser
  )
  .put(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.updateUserDetails
  );

router.put(
  "/password",
  authController.verifyToken,
  authController.preventApiAccess,
  userController.updateUserPassword
);

router
  .route("/wishlists/:productId")
  .patch(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.addProductInWishlist
  )
  .delete(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.deleteProductFromWishlist
  );

router
  .route("/addresses")
  .get(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.fetchUser
  )
  .post(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.addUserAddress
  );

router
  .route("/addresses/:addressId")
  .patch(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.updateUserAddresses
  )
  .delete(
    authController.verifyToken,
    authController.preventApiAccess,
    userController.deleteUserAddress
  );

module.exports = router;
