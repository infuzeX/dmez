const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//validators
function validateEmail(email) {
  return email.includes("@") && email.endsWith(".com");
}

const contactSchema = Schema({
  name: {
    type: String,
    minLength: [3, "name should be greater than 3 character"],
    maxLength: [15, "name should be less than 15 character"],
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    validate: [validateEmail, "Please provide a valid email"],
    required: [true, "email is required"],
  },
  contact: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  message: {
    type: String,
    trim: true,
    minLength: [10, "message should be greater than 10 character"],
    maxLength: [200, "messagae should be less than 200 character"],
    required: [true, "message is required"],
  },
  createAt:{
    type:Date,
    default:Date.now()
  }
});

const suggestionSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minLength: [3, "name should be greater than 3 character"],
    maxLength: [15, "name should be less than 15 character"],
  },
  suggestion: {
    type: String,
    required: [true, "please tell us your suggestion"],
    minLength: [10, "suggestion should be greater than 10 character"],
    maxLength: [200, "suggestion should be less than 200 character"],
  },
  createAt:{
    type:Date,
    default:Date.now()
  }
});

//BULKD ORDER
const bulkOrderSchema = Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    minLength: [3, "name should be greater than 3 character"],
    maxLength: [15, "name should be less than 15 character"],
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    validate: [validateEmail, "Please provide a valid email"],
    required: [true, "email is required"],
  },
  contact: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  address: {
    type: String,
  },
  createAt:{
    type:Date,
    default:Date.now()
  }
});

//PARTNER WITH DMEZ
const partnerSchema = Schema({
  name: {
    type: String,
    minLength: [3, "name should be greater than 3 character"],
    maxLength: [15, "name should be less than 15 character"],
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    validate: [validateEmail, "Please provide a valid email"],
    required: [true, "email is required"],
  },
  contact: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  createAt:{
    type:Date,
    default:Date.now()
  }
});

const Contact = mongoose.model("contact", contactSchema);
const Suggestion = mongoose.model("suggestion", suggestionSchema);
const BulkOrder = mongoose.model("bulkOrder", bulkOrderSchema);
const Partner = mongoose.model("partner", partnerSchema);

module.exports = {
  Contact,
  Suggestion,
  BulkOrder,
  Partner,
};
