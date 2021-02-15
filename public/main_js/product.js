const xhr = new XMLHttpRequest();
const id = window.location.pathname.split('/')[2];

//replace localhost origin with https://dmezapi,herokuapp.com
const origin = "http://127.0.0.1:3000"

function getProductDetails() {
    xhr.open('GET', `${origin}/api/v1/products/${id}`);
    xhr.send();
}

xhr.onload = function () {
    console.log(this.responseText);
}

window.addEventListener('DOMContentLoaded', () => getProductDetails());