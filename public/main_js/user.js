const xhr = new XMLHttpRequest();
const userEl = document.querySelectorAll('.product');

function displayInfo(data) {
    userEl[0].children[1].textContent = data['name'] || 'N/A';
    userEl[1].children[1].textContent = data['email'] || 'N/A';
    userEl[2].children[1].textContent = data['contact'] || 'N/A';
}
//API REQUESTS
function getData() {
    xhr.open('GET', `${origin}/api/v1/user?fields=name,email,contact`);
    xhr.send();
}

xhr.onload = function () {
    const res = JSON.parse(this.responseText);
    console.log(res);
    if (res.status === "error" || res.status === "fail") {
        showStatus(res);
        return;
    }
    displayInfo(res.data);
}
getData();