const xhr = new XMLHttpRequest();

async function placeOrder(res) {
  const order = await fetch("http://localhost:3001/api/v1/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      address,
      payment: {
        paymentId: res.razorpay_payment_id,
        orderId: payload.orderId,
      },
    }),
  });
  return order.json();
}

payload["handler"] = async function (res) {
  try {
    const response = await placeOrder(res);
    if (response.status === "success") window.location.href = "/success";
    else showStatus(response);
  } catch (err) {
    showStatus({ status: "error", message: err.message });
  }
};

const razorpay = new Razorpay(payload);

const initPayment = () => razorpay.open();

razorpay.on("payment.failed", (res) => console.log(res));
/*========================RESPONSE==========================*/
xhr.onerror = function () {
  showStatus({ status: "error", message: "something went wrong" });
};