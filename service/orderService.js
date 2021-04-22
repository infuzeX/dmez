const { Order } = require("../model/registerModel");
const APIFeatures = require("../utils/apifeatures");

exports.createOrder = async ({ customerId, address, cart, payment }) => {
  return await Order.create({
    customerId,

    orderId: payment.orderId,
    paymentId: payment.paymentId,

    products: cart.products,

    totalProducts: cart.totalProducts,
    totalPrice: cart.totalPrice,
    totalSavings: cart.totalSavings,
    delivery: cart.charge,
    coupon: cart.coupon ? cart.coupon.code : undefined,
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
      email: address.email,
      contact: address.contact,
    },

    status: [
      {
        state: "placed",
        date: Date.now(),
      },
    ],
    currentStatus:"placed",
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
    { status: 1, customerId: 1,currentStatus:1, address:1 }
  );
  if (!order) throw { message: "No order found", statusCode: 404 };

  if (!(order.customerId._id == customerId)) return;
  if (["cancelled", "returned"].includes(order.currentStatus)) return;
  if (order.currentStatus != "placed" && data.state === "cancelled") return;
  if (order.currentStatus != "delivered" && data.state === "returned") return;

  //update status
  order.status.push(data);
  order.currentStatus = data.state;
  return await order.save();
};

exports.fecthOrder = async (_id) => Order.findOne({ _id });