const xhr = new XMLHttpRequest();
//API REQUESTS
function getAddress() {
  xhr.open("GET", `${origin}/api/v1/user?fields=address`);
  xhr.withCredentials = true;
  xhr.send();
}

function editAddress(data) {
  xhr.open("PUT", `${origin}/api/v1/user`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.withCredentials = true;
  xhr.send(JSON.stringify({ address: data }));
}

xhr.onload = function () {

  const res = JSON.parse(this.responseText);

  if (res.status === "error" || res.status === "fail") {
    showStatus(res);
    return;
  }

  if (res.data) {
    const address = document.querySelector(".address");
    for (let i = 0; i < 7; i++) {
      const field = address.children[i];
      field.children[1].textContent =
        res.data.address[field.id] || "mere dil mei";
    }
  }

  if (!res.data) {
    window.location.href = res.path;
    return;
  }

};

xhr.onerror = function () {
  showStatus({ status: "error", message: "some error occured" });
}

const getFormData = (e) => {
  e.preventDefault();
  const data = {};
  [...e.target.elements].forEach(
    ({ name, value }) => !name || (data[name] = value)
  );
  editAddress(data);
};
