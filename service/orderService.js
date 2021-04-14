const { Order } = require("../model/registerModel");
const APIFeatures = require("../utils/apifeatures");

exports.createOrder = async ({ customerId, address, code, cart, payment }) => {
  return await Order.create({
    customerId,

    orderId: payment.orderId,
    paymentId: payment.paymentId,

    products: cart.products,

    totalProducts: cart.totalProducts,
    totalPrice: cart.totalPrice,
    totalSavings: cart.totalSavings,
    delivery: cart.charge,
    coupon: code,
    couponDiscount: cart.couponDiscount,
    totalAmount: cart.totalAmount,

    address: {
      name: address.name,
      state: address.state,
      city: address.city,
      zipcode: address.zipcode,
      area: address.zipcode,
      landmark: address.landmark,
      flatnumber: address.flatnumber,
      contact: address.contact,
    },

    status: [
      {
        state: "placed",
        date: Date.now(),
      },
    ],
    createdAt: Date.now(),
  });
};

exports.getOrders = async (customerId, queryString) => {
  const features = new APIFeatures(Order.find({ customerId }), queryString);
  return await features.query;
};

exports.updateOrderStatus = async ({ _id, customerId, data }) => {
  const order = await Order.findOne(
    { _id },
    { status: 1, customerId: 1 }
  ).populate({
    path: "customerId",
    select: "email",
  });
  if (!order) throw { message: "No order found", statusCode: 404 };
  //match user with customerId
  if (!(order.customerId._id == customerId))
    throw { message: "Invalid request", statusCode: 400 };
  //check same status or cancelled or returned
  let isEligible = true;
  for (let i = 0; i < order.status.length; i++) {
    if (
      order.status[i].state === data.state ||
      order.status[i].state === "cancelled" ||
      order.status[i].state === "returned"
    ) {
      isEligible = false;
      break;
    }
  }
  if (!isEligible) return;

  order.status.push(data);
  order.currentStatus = data.state;
  return await order.save();
};

exports.fecthOrder = async (_id) => Order.findOne({ _id });
