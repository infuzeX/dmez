const router = require("express").Router();

const productController = require("../../controller/productController");

router.get("/", productController.fetchProducts);
router.get("/:id", productController.fetchProduct);

module.exports = router;
