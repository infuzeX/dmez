const xhr = new XMLHttpRequest();

function getUserData() {
    xhr.open('GET', `${origin}/api/v1/user`);
    xhr.send();
}
function checkoutData() {
    xhr.open('GET', `${origin}/api/v1/checkout`);
    xhr.withCredentials = true;
    xhr.send();
}

checkoutData();
/*========================RESPONSE==========================*/
xhr.onload = function () {
    console.log(this.responseText);
    const res = JSON.parse(this.responseText);
    console.log(res);
}

xhr.onerror = function () {
    closeLoader(cartLoader);
    showStatus({ status: 'error', message: 'something went wrong' });
}
