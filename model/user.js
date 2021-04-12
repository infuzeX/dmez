const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 15,
    minlength: 3,
    required: [true, "User name required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email required"],
    unique: true,
  },
  contact: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
    required:true,
    unique: true,
  },
  password: {
    type: String,
    required:true,
    select: false,
  },
  passwordResetToken:String,
  passwordChangedAt:Date,
  passwordResetExpires:Date,
  wishlists: [
    {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
  ],
  address: {
    name: {
      type: String,
      //minlength: [3, 'name must be more than 3 characters'],
      //maxlength: [15, 'name must be less than 15 character'],
      //required:[true, "Name is required"]
    },
    state: {
      type: String,
      //required:[true, "State is required"]
    },
    city: {
      type: String,
      //required:[true, "City is required"]
    },
    zipcode: {
      type: Number,
      //required:[true, "Zipcode is required"]
    },
    area: {
      type: String,
      //requred:[true, "Area is required"]
    },
    landmark: {
      type: String,
    },
    flatnumber: {
      type: String,
      //required:[true, "Flat or House number is required"]
    },
    contact: {
      type: Number,
      //required:[true, "Contact is required"]
    },
  },
  couponUsed:[{type:mongoose.Types.ObjectId, ref:'coupon'}]
});


//METHODS

//create reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = userSchema;