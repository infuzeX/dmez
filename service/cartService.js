const mongoose = require("mongoose");
const { Cart } = require("../model/registerModel");
const productService = require('./productService');

exports.cartSummary = async (customerId) => {
  return await Cart.aggregate([
    {
      $match: { customerId: mongoose.Types.ObjectId(customerId) },
    },
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: "$_id",
        totalProducts: { $sum: 1 },
        totalAmount: {
          $sum: {
            $multiply: [
              "$products.quantity",
              { $subtract: ["$products.price", "$products.discount"] },
            ],
          },
        },
      },
    },
  ]);
};

exports.cartDetails = async (customerId) => {
  return await Cart.findOne({ customerId }, { __v: 0 }).populate("customerId");
};

exports.addProductToCart = async (customerId, data) => {
    //prevent similar product in cart
    const isExist = await Cart.exists({
        customerId,
        "products.productId": data.productId,
    });
    if (isExist) return "Item already present in cart";
    //update cart with new product
    const d = await Cart.updateOne(
        { customerId },
        {
            $set: { customerId },
            $push: { products: data },
        },
        {
            upsert: true,
        }
    );
    //prevent stock update when cart update failed
    if (d.nModified || d.upserted) {
        //update product stock
        await productService.updateProduct(data.productId, { $inc: { quantity: -1 } }, {});
    }
    return "Item Added to cart";
};

exports.manageProductQuanity = async (customerId, productId, qty) => {
    let m = null;
    //find product
    const cart = await Cart.findOne(
        { customerId },
        { products: { $elemMatch: { productId } } }
    );
    //update product quantity
    cart["products"][0].quantity += qty;
    //remove product from cart if qty is 0
    if (!(cart["products"][0].quantity)) {
        m = (
            await Cart.updateOne(
                { customerId },
                { $pull: { products: { productId } } }
            )
        ).nModified;
    }
    //save updated quantity in cart
    else m = await cart.save();
    //update stock from product collection
    if (m) await productService.updateProduct(productId, { $inc: { quantity: -qty } }, {});

    return 1;
};

exports.removeProductFromCart = async (customerId, productId) => {
    //find product to remove and extract quantity
    const cart = await Cart.findOne(
        { customerId },
        { _id: 0, products: { $elemMatch: { productId } } }
    );
    //recover reserved quantity of product
    const qty = cart["products"][0].quantity;
    //remove product from cart
    const { nModified } = await Cart.updateOne(
        { customerId },
        { $pull: { products: { productId } } }
    );
    //restore reserved quantity of product
    if (nModified) {
        await productService.updateProduct(productId, { $inc: { quantity: qty } });
    }
};

exports.getCartDetails = async (customerId) => {

    return await Cart.aggregate([
        {
            $match: { customerId: mongoose.Types.ObjectId(customerId) },
        },
        {
            $unwind: "$products",
        },
        {
            $group: {
                _id: "$_id",
                products: {
                    $push: "$products",
                },
                totalSavings: {
                    $sum: { $multiply: ["$products.quantity", "$products.discount"] },
                },
                totalProducts: { $sum: 1 },
                totalAmount: {
                    $sum: {
                        $multiply: [
                            "$products.quantity",
                            { $subtract: ["$products.price", "$products.discount"] },
                        ],
                    },
                },
                //add delivery charge here
            },
        },
    ]);
};

//get cart total Amount
exports.getCartAmount = async (cartId) => {

    return await Cart.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(cartId) },
        },
        {
            $unwind: "$products",
        },
        {
            $group: {
                _id: "$_id",
                totalAmount: {
                    $sum: {
                        $multiply: [
                            "$products.quantity",
                            { $subtract: ["$products.price", "$products.discount"] },
                        ],
                    },
                },
            },
        },
    ]);
};

exports.deleteCart = async (_id) => await Cart.deleteOne({ _id });