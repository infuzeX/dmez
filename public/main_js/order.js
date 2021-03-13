const orderEl = document.querySelector(".orders-panel");
const controls = document.querySelector(".controls");

const state = {
  query: {
    page: 1,
    limit: 10,
    status: "placed",
  },
  /*orders: [{
        "_id": "6039018f3bab401055c3c552",
        "status": "placed",
        "createdAt": "1614348673886",
        "orderId": "orderId",
        "paymentId": "paymentId",
        "products": [{
            "_id": "6039018f3bab401055c3c553",
            "quantity": "4",
            "price": "200",
            "discount": "50",
            "productId": "6028217097c5142cba61df3a",
            "title": "ACECLOFENAC 100MG 10'S"
        },
        {
            "_id": "6039018f3bab401055c3c553",
            "quantity": "4",
            "price": "200",
            "discount": "50",
            "productId": "6028217097c5142cba61df3a",
            "title": "ACECLOFENAC 100MG 10'S"
        }],
        "totalProducts": "2",
        "totalAmount": "600",
        "totalSavings": "200",
        "address": {
            "state": "Uttar pradesh",
            "city": "Allahabad",
            "zipcode": "211016",
            "area": "kareli",
            "flatnumber": "8A/3D/K",
            "contact": "7618956489"
        },
        "__v": "0"
    }]*/
};
function orderTemplate({ totalAmount, address, products, createdAt, _id }) {
  console.log(address);
  return `
  <div class="panel1">
    <div class="">
      <p>ORDER PLACED</p>
      <p>${createdAt}</p>
    </div>
    <div>
      <p>TOTAL</p>
      <p>₹${totalAmount}</p>
    </div>
    <div>
      <p>SHIP TO</p>
      <p>${address.flatnumber} ${address.area} ${address.city} 
      ${address.state}</p>
    </div>
    <div>
      <p>ORDER ID</p>
      <p>Ref:${_id}</p>
    </div>
  </div>
  ${popuplateProducts(products)}
</div>`;
}

function popuplateProducts(products) {
  let productsEl = "";
  products.forEach((product) => (productsEl += orderedProductTemp(product)));
  return productsEl;
}

function orderedProductTemp({ title, coverImage }) {
  const imgUrl = coverImage ? coverImage : "/public/images/default.png";

  return `  <div class="panel2" style="border-top: 1px solid grey;">

  <div class="product">
    <p>${title}</p>
    <img style="width:80px;" src=${imgUrl}>
  </div>

  <div class="action">
    <button><a href="/track">Track Package</a></button><br>
    <button>Return</button><br>
    <button>Cancel</button>
  </div>

</div>`;
}

function handleEmptySection(msg, add) {
  orderEl.innerHTML = msg;
  orderEl.classList[add ? "add" : "remove"]("empty");
}

//NAVIGATE
controls.addEventListener("click", (e) => {
  if (e.target.className) {
    state["query"].status = e.target.className;
  }
});

//API REQUEST
async function fetchOrders() {
  const query = new URLSearchParams(state["query"]).toString();
  const rawResponse = await fetch(
    `http://127.0.0.1:3001/api/v1/orders?${query}`,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return rawResponse.json();
}

window.onload = function () {
  fetchOrders()
    .then((response) => {
      if (response.status === "success") {
        const orders = response.data.orders;
        let lists = "";
        if (!orders.length) {
          handleEmptySection("<p>No order found</p>", true);
          return;
        }
        handleEmptySection("", false);
        orders.forEach((order) => (lists += orderTemplate(order)));
        orderEl.innerHTML = lists;
        return;
      }

      showStatus(response);
    })
    .catch((err) => {
      console.log(err);
      showStatus({ status: "error", message: err.message });
    });
};
