const xhr = new XMLHttpRequest();

function placeOrder(res) {
 alert("payment successful.");
}

payload['handler'] = placeOrder;
const razorpay = new Razorpay(payload);

function initPayment() {
    razorpay.open();
}

razorpay.on('payment.failed', (res) => console.log(res));
/*========================RESPONSE==========================
function getUserData() {
    xhr.open('GET', `${origin}/api/v1/user`);
    xhr.send();
}


xhr.onload = function () {
    const res = JSON.parse(this.responseText);

}

xhr.onerror = function () {
    showStatus({ status: 'error', message: 'something went wrong' });
}
*/