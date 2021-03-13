const path = require("path");

exports.renderStaticPage = (res, page) => {
  const file = path.resolve(`public/${page}`);
  return res.sendFile(file);
};

exports.renderCheckoutPage = (req, res) => {
  res.render("checkout.ejs", {
    data: {
      ...req.cart,
      key: process.env.KEY_ID,
      order: req.checkout.orderId,
      charge: req.checkout.charge,
      total: req.checkout.charge + req.checkout.totalAmount,
    },
  });
};

exports.renderOrderPage = async (req, res) => {
  const order = await order.getOrder(req.params.id);
  res.render("order.ejs", { data: order });
};
