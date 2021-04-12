const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newCartSchema = new Schema({
  customer: { type: mongoose.Types.ObjectId, ref: "user" },
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
  coupon: {
      code:String,
      discount:Number,
      maxDiscount:Number
  },

  totalItems: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  totalSavings: {
    type: Number,
    default: 0,
  },
  createdAt:Date
});

//METHODS
newCartSchema.methods.applyDiscount = function (amount) {
  dicountedPrice = amount * (this.discount / 100);
  if (this.maxDiscount) {
    discountPrice =
      discountedPrice > this.maxDiscount ? this.maxDiscount : discountedPrice;
  }
  return discountedPrice;
};


newCartSchema.methods.isProductExistInCart = function (id) {
    return this.products.findIndex(product => product._id === id);
}

//MIDDLEWARE
newCartSchema.pre("save", function (next) {
    
   if(this.subTotal <= 200) {
       this.deliveryCharge = 100;
       return next();
   }
   if(this.subTotal > 200 && this.subTotal < 400){
       this.deliveryCharge = 50;
       return next();
   }
});
