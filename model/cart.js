const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    customerId: { type: mongoose.Types.ObjectId, ref: "user" },
    products: [
        {
            _id: false,
            productId: { type: mongoose.Types.ObjectId, ref: "product" },
            title: String,
            quantity: {
                type: Number,
                default: 0
            },
            price: {
                type: Number,
                default: 0
            },
            discount: {
                type: Number,
                default: 0
            },
            coverImage: String,
            addedAt: {
                type: Date,
                default: Date.now()
            }
        },
    ]
})


module.exports = mongoose.model("cart", cartSchema);
