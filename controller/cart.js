const { Coupon, Cart } = require("../model/registerModel");
const cartService = require("../service/cartService");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.verifyCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCartDetails(req.userId);
  const message = "Your cart is empty";
  if (!cart) {
    if(req.method === "GET") {
      return next();
    }
    return next(new AppError(message, 400));
  }
  if(!cart.totalProducts) {
    if(req.method === "GET") {
      return next();
    }
    return next(new AppError(message, 400));
  }
  req.cart = cart;
  next();
});

exports.addProductInCart = catchAsync(async (req, res, next) => {
  const data = {
    productId: req.params.productId,
    title: req.body.title,
    coverImage: req.body.coverImage,
    price: req.body.price,
    discount: req.body.discount,
    quantity: 1,
  };
  await cartService.addProductToCart(req.userId, data);
  res
    .status(201)
    .json({ status: "success", message: "Item added successfully" });
});

exports.getCartProducts = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCartDetails(req.userId);
  res.status(200).json({
    status: "success",
    data: {
      cart,
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

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.params.coupon });
  if (!coupon || !coupon.active)
    return next(new AppError("Invalid coupon", 400));

  if (req.cart.coupon.code) {
    return next(
      new AppError(
        "Coupon already applied!, please remove applied coupon to apply new coupon",
        400
      )
    );
  }

  req.cart.coupon = {
    code: coupon.code,
    discount: coupon.discount,
    maxDiscount: coupon.maxDiscount,
  };

  await req.cart.save();

  coupon.users.push({
    cart: req.cart._id,
    user: req.userId,
    usedAt: Date.now(),
  });
  coupon.userCount += 1;
  await coupon.save();

  res.json({
    status: "success",
    message: "Coupon applied successfully",
    data: {
      coupon: req.cart.coupon,
    },
  });
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.updateOne(
    { code: req.cart.coupon.code },
    {
      $pull: { users: { cart: req.cart._id } },
    }
  );

  if (!coupon.nModified) {
    return next(new AppError("Failed to remove coupon", 400));
  }

  req.cart.coupon = {};
  await req.cart.save();
  res.json({
    status: "success",
    message: "Coupon removed successfully",
    data: {
      coupon: req.cart.coupon,
    },
  });
});
