const router = require("express").Router();

//MIDDLEWARES
const cartController = require("../controller/cart");
//CONTROLLERS
const authController = require("../controller/auth");
const {
  renderStaticPage,
  renderCheckoutPage,
  renderOrderPage,
} = require("../controller/pageController");

router.get("/register", (req, res) => renderStaticPage(res, "register.html"));
router.get("/forgetpassword", (req, res) =>
  renderStaticPage(res, "forgotpw.html")
);
router.get("/resetpassword/:id", (req, res) =>
  renderStaticPage(res, "reset.html")
);

router.get("/", (req, res) => renderStaticPage(res, "index.html"));
router.get("/career", (req, res) => renderStaticPage(res, "career.html"));
router.get("/contact", (req, res) => renderStaticPage(res, "contact.html"));
router.get("/term&conditions", (req, res) => renderStaticPage(res, "tnc.html"));
router.get("/privacy&policy", (req, res) =>
  renderStaticPage(res, "privacy-policy.html")
);
router.get("/partner-dmez", (req, res) =>
  renderStaticPage(res, "partner-dmez.html")
);
router.get("/aboutus", (req, res) => renderStaticPage(res, "aboutus.html"));
router.get("/track", (req, res) => renderStaticPage(res, "track.html"));
router.get("/bulk-order", (req, res) =>
  renderStaticPage(res, "bulk-order.html")
);

router.get("/products", (req, res) => renderStaticPage(res, "shop.html"));
router.get("/products/:id", (req, res) =>
  renderStaticPage(res, "product.html")
);

router.get("/success", (req, res) => renderStaticPage(res, "order-success.html"));

//PROTECTED ROUTES
router.get(
  "/login",
  authController.verifyToken,
  authController.preventLoginAccess,
  (req, res) => renderStaticPage(res, "login.html")
);

router.get(
  "/cart",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "cart.html")
);

router.get(
  "/cart/checkout",
  authController.verifyToken,
  authController.preventPageAccess,
  authController.verifyOrderToken,
  cartController.verifyCart,
  renderCheckoutPage
);

router.get(
  "/account",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "account.html")
);

router.get(
  "/account/info",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "setting.html")
);

router.get(
  "/account/info/name",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "name.html")
);
router.get(
  "/account/info/email",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "email.html")
);
router.get(
  "/account/info/number",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "number.html")
);
router.get(
  "/account/info/password",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "password.html")
);

router.get(
  "/account/orders",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "order.html")
);

router.get(
  "/account/orders/:id",
  authController.verifyToken,
  authController.preventPageAccess,
  renderOrderPage
);

router.get(
  "/account/address",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "address.html")
);
router.get(
  "/account/address/edit",
  authController.verifyToken,
  authController.preventPageAccess,
  (req, res) => renderStaticPage(res, "newaddress.html")
);

router.get("/career", (req, res) => renderStaticPage(res, "career.html"));

router.get("/aboutus", (req, res) => renderStaticPage(res, "aboutus.html"));

router.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 60 });
  res.redirect("/login");
});

router.get("*", (req, res) => renderStaticPage(res, "404.html"));

module.exports = router;
