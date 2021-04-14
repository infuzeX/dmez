const mongoose = require("mongoose");
const { Cart } = require("../model/registerModel");
const productService = require("./productService");

exports.addProductToCart = async (customerId, data) => {
  const isExist = await Cart.exists({
    customerId,
    "products.productId": data.productId,
  });
  if (isExist) return "Item already present in cart";

  const totalPrice = data.price * data.quantity;
  const totalSavings = data.discount * data.quantity;

  const d = await Cart.updateOne(
    { customerId },
    {
      $set: { customerId },
      $inc: {
        totalProducts: 1,
        totalPrice,
        totalSavings,
        subTotal: totalPrice - totalSavings,
      },
      $push: { products: data },
    },
    {
      upsert: true,
    }
  );

  if (d.nModified || d.upserted) {
    await productService.updateProduct(data.productId, {
      $inc: { quantity: -1 },
    });
  }
  return 1;
};

exports.manageProductQuanity = async (customerId, productId, qty) => {
  let m = null;

  const cart = await Cart.findOne(
    { customerId },
    { totalPrice:1, totalSavings:1, subTotal:1,products: { $elemMatch: { productId } } }
  );

  cart["products"][0].quantity += qty;

  const totalPrice = cart["products"][0].price * qty;
  const totalSavings = cart["products"][0].discount * qty;
  const subTotal = totalPrice - totalSavings;
  //remove product from cart if qty is 0
  if (!cart["products"][0].quantity) {
    m = (
      await Cart.updateOne(
        { customerId },
        {
          $pull: { products: { productId } },
          $inc: {
            totalProducts: -1,
            totalPrice:totalPrice,
            totalSavings:totalSavings,
            subTotal:subTotal
          },
        }
      )
    ).nModified;
  } else {
    cart["totalPrice"] += totalPrice;
    cart["totalSavings"] += totalSavings;
    cart["subTotal"] += subTotal;
    m = await cart.save();
  }

  if (m)
    await productService.updateProduct(
      productId,
      { $inc: { quantity: -qty } },
      {}
    );
  return 1;
};

exports.removeProductFromCart = async (customerId, productId) => {
  //find product to remove and extract quantity
  const cart = await Cart.findOne(
    { customerId },
    { products: { $elemMatch: { productId } } }
  );
  
  const { price, discount, quantity } = cart["products"][0];
  const totalPrice = price  * quantity;
  const totalSavings = discount * quantity;
  const subTotal = totalPrice - totalSavings;
  //remove product from cart
  const { nModified } = await Cart.updateOne(
    { customerId },
    {
      $inc: {
        totalProducts: -1,
        totalPrice: -totalPrice,
        totalSavings: -totalSavings,
        subTotal: -subTotal
      },
      $pull: { products: { productId } },
    }
  );
  if (nModified) {
    await productService.updateProduct(productId, { $inc: { quantity } });
  }
};

exports.getCartDetails = async (customerId) => {
  return await Cart.findOne({ customerId }).populate("customerId");
};

exports.deleteCart = async (_id) => await Cart.deleteOne({ _id });