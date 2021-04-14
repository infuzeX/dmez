const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "user" },
    products: [
      {
        _id: false,
        productId: { type: mongoose.Types.ObjectId, ref: "products" },
        title: String,
        quantity: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        discount: {
          type: Number,
          default: 0,
        },
        coverImage: String,
        addedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ], 
    coupon:{
      code:String,
      maxDiscount:Number,
      discount:Number
    },
    totalProducts:Number,
    totalPrice:Number,
    totalSavings:Number,
    subTotal:Number
  },{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

cartSchema.virtual('couponDiscount').get(function () {
  if(!this.coupon.code) return 0;
  let couponDiscount = (this.subTotal * (this.coupon.discount / 100));
  if(this.coupon.maxDiscount) {
    return couponDiscount > this.coupon.maxDiscount ? this.coupon.maxDiscount : couponDiscount;
  }
  return couponDiscount;
})

cartSchema.virtual('charge').get(function () {
  let charge = 0;
  const subtotal = this.subTotal - this.couponDiscount;
  if (subtotal <= 200) charge = 100;
  else if (subtotal > 200 && subtotal <= 400) charge = 50;
  return charge;
})

cartSchema.virtual('totalAmount').get(function () {
  return (this.subTotal - this.couponDiscount) + this.charge
})

module.exports = cartSchema;