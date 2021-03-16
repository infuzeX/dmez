const AppError = require("./appError");


exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.catchError = (url, method, msg, res, next) => {
  const path = (url === "/api/v1/orders") ? "/" : "/cart";
  if (method === "GET") {
    return res.redirect(path);
  } else {
    return next(
      new AppError(
        msg || "Some maliciuos attempt encountered, please contact to helpline",
        400
      )
    );
  }
};
