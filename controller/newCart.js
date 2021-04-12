const { Coupon, newCart, Product } = require("../model/registerModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addProduct = catchAsync(async (req, res, next) => {
  
  const product = await Product.findOne({ _id: req.params.productId });
  if (!product.quantity) return next(new AppError("product out of stock", 400));

  const cart = await newCart.findOne({customer:req.userId});

  if(cart.isProductExistInCart(product._id)) return next(new AppError("Product already exist in cart. view cart", 400));

  productData = {
      title:product.title,
      coverImage:product.coverImage,
      price:product.price,
      discount:product.discount,
      quantity:1
  }

  if(!cart) {
      await newCart.create({
          customer:req.userId,
          product:[productData],
          totalItems:1,
          subTotal:productData.price - productData.discount
      })
  }

});

exports.updateProduct = catchAsync(async (req, res, next) => {});

exports.removeProduct = catchAsync(async (req, res, next) => {});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.params.code });
  if (!coupon || !coupon.active)
    return next(new AppError("Invalid coupon", 400));

  const cart = await newCart.findOne({ customerId: req.userId });
  if (!cart || !cart.totalProducts)
    return next(new AppError("Invalid Request", 400));

  if (cart.coupon) {
    return next(
      new AppError(
        "Coupon already applied!, please remove this coupon to apply new coupon",
        400
      )
    );
  }

  cart.couponDiscount = coupon.applyDiscount(cart.totalAmount);
  cart.coupon = coupon.code;

  await cart.save();

  coupon.users.push({
    cart: cart._id,
    user: req.userId,
    usedAt: Date.now(),
  });

  coupon.userCount += 1;
  await coupon.save();
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  const cart = await newCart.findOne({ customerId: req.userId });
  if (!cart || !cart.totalProducts)
    return next(new AppError("Invalid Request", 400));

  const coupon = await Coupon.updateOne(
    { code: cart.code },
    {
      $pull: { users: { cart: cart._id } },
    }
  );

  if (!coupon.nModified) {
    return next(new AppError("Failed to remove coupon", 400));
  }

  cart.couponDiscount = 0;
  cart.coupon = undefined;
  await cart.save();
});
