const router = require("express").Router();

const { verifyToken, preventPageAccess } = require("../controller/authController");
const { renderStaticPage } = require("../controller/pageController");


router.get('/*', renderStaticPage);

module.exports = router;