const router = require("express").Router();

//MIDDLEWARES
const authMiddleware = require("../middleware/auth");
const checkoutMiddleware = require("../middleware/checkout");
//CONTROLLERS
const {
  renderStaticPage,
  renderCheckoutPage,
  renderOrderPage,
} = require("../controller/pageController");

router.get("/register", (req, res) => renderStaticPage(res, "register.html"));
router.get("/forgetpassword", (req, res) => renderStaticPage(res, "forgotpw.html"))

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

router.get("/success", (req, res) => {
  res.cookie("_ciic_", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  renderStaticPage(res, "order-success.html");
});

//PROTECTED ROUTES
router.get(
  "/login",
  authMiddleware.verifyToken,
  authMiddleware.preventLoginAccess,
  (req, res) => renderStaticPage(res, "login.html")
);

router.get(
  "/cart",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "cart.html")
);

router.get(
  "/cart/checkout",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  checkoutMiddleware.verifyCheckoutRequest,
  /*checkoutMiddleware.verifyOrder,
  checkoutMiddleware.verifyGETCart,
  checkoutMiddleware.verifyCheckout,*/
  renderCheckoutPage
);

router.get(
  "/account",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "account.html")
);

router.get(
  "/account/info",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "setting.html")
);

router.get(
  "/account/info/name",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "name.html")
);
router.get(
  "/account/info/email",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "email.html")
);
router.get(
  "/account/info/number",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "number.html")
);
router.get(
  "/account/info/password",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "password.html")
);

router.get(
  "/account/orders",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "order.html")
);

router.get(
  "/account/orders/:id",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  renderOrderPage
);

router.get(
  "/account/address",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
  (req, res) => renderStaticPage(res, "address.html")
);
router.get(
  "/account/address/edit",
  authMiddleware.verifyToken,
  authMiddleware.preventPageAccess,
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
