const router = require("express").Router();
const authController = require("../../controller/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/resetpassword/:token", authController.resetPassword);

module.exports = router;