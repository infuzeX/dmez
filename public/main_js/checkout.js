const xhr = new XMLHttpRequest();

function placeOrder(res) {
  xhr.open("POST", `${origin}/api/v1/orders`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.withCredentials = true;
  xhr.send(
    JSON.stringify({
      address,
      payment: {
        paymentId: res.razorpay_payment_id,
        orderId: payload.orderId,
      },
    })
  );
}

payload["handler"] = placeOrder;
const razorpay = new Razorpay(payload);

const initPayment = () => razorpay.open();

razorpay.on("payment.failed", (res) => console.log(res));
/*========================RESPONSE==========================*/

xhr.onload = function () {
  const res = JSON.parse(this.responseText);
  if (res.status === "success") {
    window.location.href = "/success";
  }
};

xhr.onerror = function () {
  showStatus({ status: "error", message: "something went wrong" });
};
