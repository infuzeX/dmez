const path = require("path");
const orderService = require('../service/orderService');

exports.renderStaticPage = (res, page) => {
  const file = path.resolve(`public/${page}`);
  return res.sendFile(file);
};

exports.renderCheckoutPage = (req, res) => {
  data = {
    user:{
      name:req.cart.customerId.name,
      email:req.cart.customerId.email,
      contact:req.cart.customerId.contact
    },
    address:(req.cart.customerId.address || {}),
    isAddress:req.cart.customerId.address?true:false,
    totalAmount:req.cart.totalAmount,
    products:req.cart.products,
    key: process.env.KEY_ID,
    order: req.checkout.orderId,
    charge: req.checkout.charge,
    total: req.checkout.charge + req.checkout.totalAmount,
  };
  res.render("checkout.ejs", {
    data,
  });
};

exports.renderOrderPage = async (req, res) => {
  const order = await orderService.fecthOrder(req.params.id);
  res.render("order.ejs", { data: order });
};
