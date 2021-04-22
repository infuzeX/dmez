const path = require("path");
const orderService = require("../service/orderService");
const util = require("../utils/catchError");

exports.renderStaticPage = (res, page) => {
  const file = path.resolve(`public/${page}`);
  return res.sendFile(file);
};

exports.renderCheckoutPage = (req, res) => {
  //VERIFY CHECKOUT WITH CART
  if (!req.checkout) {
    res.redirect("/cart");
  }

  if(!req.cart){
    return res.render("checkout.ejs", {
      data:{
        success: false,
        message: "Your cart is empty",
      }
    });
  }
  if (
    !(req.checkout["cartId"] == req.cart["_id"].toString()) ||
    !(req.checkout["totalAmount"] == req.cart["totalAmount"])
  ) {
    return res.render("checkout.ejs", {
      data:{
        success: false,
        message: "Some went wrong please retry again",
      }
    });
  }
  res.render("checkout.ejs", {
    data:{
      success: true,
      isAddress: util.verifyAddress(req.cart.customerId.address || {}),
      user: {
        name: req.cart.customerId.name,
        email: req.cart.customerId.email,
        contact: req.cart.customerId.contact,
      },
      address: req.cart.customerId.address || {},
      subTotal: req.cart.totalPrice - req.cart.totalSavings,
      products: req.cart.products,
      key: process.env.KEY_ID,
      order: req.checkout.orderId,
      couponDiscount: req.cart.couponDiscount,
      charge: req.checkout.charge,
      total: req.checkout.totalAmount,
    }
  });
};

exports.renderOrderPage = async (req, res) => {
  const order = await orderService.fecthOrder(req.params.id);
  res.render("order.ejs", { data: order });
};
