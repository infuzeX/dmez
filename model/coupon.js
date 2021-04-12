const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code:  String,
  discount: Number,
  maxDiscount: Number,
  users: [
    {
      cart:{ type: mongoose.Types.ObjectId, ref: "cart" },
      user: { type: mongoose.Types.ObjectId, ref: "user" },
      usedAt: Date,
    },
  ],
  userCount:Number,
  active: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = couponSchema;