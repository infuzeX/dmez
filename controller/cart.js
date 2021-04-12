const cartService = require("../service/cartService");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addProductInCart = catchAsync(async (req, res, next) => {
  const data = {
    productId: req.params.productId,
    title: req.body.title,
    coverImage: req.body.coverImage,
    price: req.body.price,
    discount: req.body.discount,
    quantity: 1,
  };
  const message = await cartService.addProductToCart(req.userId, data);
  res.status(201).json({ status: "success", message });
});

exports.getCartProducts = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCartDetails(req.userId);
  res.status(200).json({
    status: "success",
    data: {
      cart: cart[0],
    },
  });
});

exports.manageQuantity = catchAsync(async (req, res, next) => {
  const qty = req.body.inc ? 1 : -1;
  await cartService.manageProductQuanity(req.userId, req.params.productId, qty);
  res.status(201).json({
    status: "success",
    message: "product updated successfully",
    data: {
      productId: req.params.productId,
      quantity: qty,
    },
  });
});

exports.deleteProductFromCart = catchAsync(async (req, res, next) => {
  await cartService.removeProductFromCart(req.userId, req.params.productId);
  res.status(200).json({
    status: "success",
    message: "Product removed successfully",
    data: {
      productId: req.params.productId,
    },
  });
});

exports.verifyCart = catchAsync(async (req, res, next) => {
  const cart = (await cartService.getCartDetails(req.userId))[0];
  if (cart && cart.totalAmount) {
    req.cart = cart;
  }
  next();
});