const xhr = new XMLHttpRequest();
const userEl = document.querySelectorAll(".product");

function displayInfo(data) {
  userEl[0].children[1].textContent = data["name"] || "N/A";
  userEl[1].children[1].textContent = data["email"] || "N/A";
  userEl[2].children[1].textContent = data["contact"] || "N/A";
}
//API REQUESTS
function getUserData() {
  xhr.open("GET", `/api/v1/user?fields=name,email,contact`);
  xhr.withCredentials = true;
  xhr.send();
}
function updateData(url, data) {
  xhr.open("PUT", url);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

xhr.onload = function () {
  const res = JSON.parse(this.responseText);
  if (res.status === "error" || res.status === "fail") {
    showStatus(res);
    return;
  }
  if (res.data) {
    displayInfo(res.data);
    return;
  }
  if (!res.data) {
    window.location.href = "/account/info";
    return;
  }
};

function formData(raw) {
  const data = {};
  raw.forEach(({ name, value }) => name && (data[name] = value));
  return data;
}

function updateUserPassword(e) {
  e.preventDefault();
  const data = formData([...e.target.elements]);
  updateData(`/api/v1/user/password`, data);
}

function updateUserData(e) {
  e.preventDefault();
  const data = formData([...e.target.elements]);
  updateData(`/api/v1/user`, data);
}
