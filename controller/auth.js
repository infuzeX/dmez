const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("../utils/jwt");
const sendEmail = require("../utils/email");

const userService = require("../service/userService");

exports.register = catchAsync(async (req, res, next) => {
  req.body.password =
    req.body.password && (await bcrypt.hash(req.body.password, 8));

  const user = await userService.register({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password,
  });

  const token = await jwt.encode(
    { userId: user._id },
    process.env.TOKEN_SECRET
  );

  res.cookie("token", token, {
    domain: process.env.COOKIE_ORIGIN,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({
    status: "success",
    message: "registration completed",
    path: "/",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const prop = isNaN(Number(req.body.username)) ? "email" : "contact";
  const user = await userService.getUserPassword({ [prop]: req.body.username });

  if (!user) {
    return next(new AppError(`User not registered with ${prop}`, 400));
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError(`Incorrect ${prop} or password`));
  }

  const token = await jwt.encode(
    { userId: user._id },
    process.env.TOKEN_SECRET
  );

  const redirectTo = req.cookies.path || "/";

  res.cookie("path", "", { maxAge: 0 });
  res.cookie("token", token, {
    domain: process.env.COOKIE_ORIGIN,
    path: "/",
    maxAge: 90 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({
    status: "success",
    message: "login completed",
    path: redirectTo,
  });
});

exports.verifyToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const decoded = await jwt.decode(token, process.env.TOKEN_SECRET);
    req["userId"] = decoded.userId;
  }
  next();
});

exports.verifyOrderToken = catchAsync(async (req, res, next) => {
  const cartOrderToken = req.cookies.cart;
  if(cartOrderToken){
    req["checkout"] = await jwt.decode(cartOrderToken, process.env.ORDER_SECRET);
    req["userId"] = req["userId"] || req["checkout"].customerId;
  }
  next();
});

//prevent auth access to login page
exports.preventLoginAccess = async (req, res, next) =>
  req.userId ? res.redirect("/") : next();

exports.preventPageAccess = async (req, res, next) => {
  if (req.userId) return next();
  res
    .cookie("path", req.originalUrl, {
      domain: process.env.COOKIE_ORIGIN,
      httpOnly: true,
    })
    .redirect("/login");
};

exports.preventApiAccess = async (req, res, next) => {
  return req.userId
    ? next()
    : next(new AppError("unauthorized access please login again", 401));
};

//FORGET PASSWORD
exports.forgetPassword = catchAsync(async (req, res, next) => {
  //GET USER BASED ON EMAIL
  const user = await userService.fetchUser({ email: req.body.email }, {});
  if (!user) return next(new AppError("User not found", 404));
  //GENERATE TOKEN AND SEND AS EMAIL
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //SEND TOKEN
  const resetUrl = `${req.protocol}://${process.env.COOKIE_ORIGIN}/resetpassword/${resetToken}`;
  const message = `Forget your password please click ${resetUrl} to change your password.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for 10min",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "Error while sending token to your mail. Please try again later",
        500
      )
    );
  }

  res.json({
    status: "success",
    message: "Token sent to mail",
  });
});

//RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userService.fetchUser(
    {
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    },
    {}
  );

  if (!user) {
    return next(
      new AppError("Password reset token is expired or invalid", 400)
    );
  }

  //update password
  if (req.body.password === req.body.passwordConfirm) {
    user.password = await bcrypt.hash(req.body.password, 8);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  } else {
    return next(new AppError("password does not match", 400));
  }

  //LOGGED USER
  const token = await jwt.encode(
    { userId: user._id },
    process.env.TOKEN_SECRET
  );
  const redirectTo = req.cookies.path || "/";
  res.cookie("path", "", { maxAge: 0 });
  res.cookie("token", token, {
    domain: process.env.COOKIE_ORIGIN,
    path: "/",
    maxAge: 90 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({
    status: "success",
    message: "password changed successfully",
    path: redirectTo,
  });
});
