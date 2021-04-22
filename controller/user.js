const userService = require("../service/userService");

const bcrypt = require("bcryptjs");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.fetchUser = catchAsync(async (req, res, next) => {
  const data = await userService.fetchUser({_id: req.userId}, req.query);
  res.status(200).json({ status: "success", data });
});

exports.updateUserDetails = catchAsync(async (req, res, next) => {
  
  //remove malicious field
  const allowedFields = ["name", "email", "contact", "address"];
  Object.keys(req.body).forEach(
    (field) => !allowedFields.includes(field) && delete req.body[field]
  );

  const path =
    req.body.address && req.cookies.cart
      ? "/cart/checkout"
      : "/account/address";

  await userService.updateUser({ _id: req.userId }, req.body);
  res.status(201).json({ status: "success", data: null, path });
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
    
  const { password, newPassword, confirmPassword } = req.body;
  const user = await userService.getUserPassword({_id:req.userId});
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return next(new AppError("Incorrect password", 401));

  if (newPassword != confirmPassword)
    return next(new AppError("Password does not match", 400));

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await userService.updateUser(
    { _id: req.userId },
    { password: hashedPassword }
  );
  res.status(201).json({ status: "success", data: null });
});

//USER WHISLIST CONTROLLER : UPDATE, DELETE
exports.addProductInWishlist = catchAsync(async (req, res, next) => {
  const query = {
    $addToSet: { wishlists: req.params.productId },
  };
  await userService.updateUser({ _id: req.userId }, query);
  res
    .status(200)
    .json({ status: "success", message: "Product added to whislist" });
});

exports.deleteProductFromWishlist = catchAsync(async (req, res, next) => {
  const query = {
    $pull: { wishlists: req.params.productId },
  };
  await userService.updateUser({ _id: req.userId }, query);
  res
    .status(200)
    .json({ status: "success", message: "Product removed from whislist" });
});

/*EXTRA FEATURES WORKED WITH ARRAY OF ADDRESSES: ADD, UPDATE, DELETE*/
exports.addUserAddress = catchAsync(async (req, res, next) => {
  const data = { $push: { addresses: req.body } };
  await userService.updateUser({ _id: req.userId }, data);
  res.status(201).json({ status: "success", data: null });
});

exports.updateUserAddresses = catchAsync(async (req, res, next) => {
  const query = {
    _id: req.userId,
    "address._id": req.body.addressId,
  };
  const data = { $set: { "addresses.$": req.body.data } };
  await userService.updateUser(query, data);
  res.status(204).json({ status: "success", data: null });
});

exports.deleteUserAddress = catchAsync(async (req, res, next) => {
  const data = { $pull: { addresses: { _id: req.body.addressId } } };
  await userService.updateUser({ _id: req.userId }, data);
  res.status(204).json({ status: "success", data: null });
});
