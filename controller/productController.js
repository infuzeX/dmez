const productService = require("../service/productService");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.fetchProducts = catchAsync(async (req, res, next) => {
  const products = await productService.fetchProducts(req.query);
  res
    .status(200)
    .json({ status: "success", result: products.length, data: { products } });
});

exports.fetchProduct = catchAsync(async (req, res, next) => {
  const product = await productService.fetchProduct(req.params.id, req.query);
  res.status(200).json({ status: "success", data: { product } });
});

exports.verifyProductEligiblity = catchAsync(async (req, res, next) => {
  const product = await productService.fetchProduct(req.params.productId, {
    fields: "title, quantity, discount, price, coverImage",
  });
  if (!product || !product.quantity)
    return next(new AppError("Product out of stock", 404));
  req.body = product;
  next();
});

//check product stock is available to increase qty in cart
exports.checkProductQuantity = catchAsync(async (req, res, next) => {
  const product = await productService.fetchProduct(req.params.productId, {
    fields: "quantity",
  });
  //check is present or not
  if (req.body.inc) {
    return !product || !product.quantity >= 1
      ? next(new AppError("Product out of stock", 404))
      : next();
  }
  next();
});
