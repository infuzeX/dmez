const xhr = new XMLHttpRequest();

const orderEl = document.querySelector(".orders-panel");
const controls = document.querySelector(".controls");

const state = {
  query: {
    page: 1,
    limit: 10,
    status: "",
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
  return `<div class="panel">

<div class="panel1">
  <div class="">
    <p>ORDER PLACED</p>
    <p>${Date.now(createdAt)}</p>
  </div>
  <div>
    <P>TOTAL</P>
    <p>₹${totalAmount}</p>
  </div>
  <div>
    <P>SHIP TO</P>
    <p>${address.flatnumber} ${address.area} ${address.city} ${
    address.state
  }</p>
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

  return `<div class="panel2" style="border-top: 1px solid grey;">

    <div class="product">
      <p>${title}</p>
      <img style="width:80px;" src="${imgUrl}"></img>
    </div>
  
    <div class="action">
      <button>Track Package</button><br>
      <button>Return</button><br>
      <button>Cancel</button>
    </div>
  
  </div>`;
}

function handleEmptySection(msg, add) {
  orderEl.innerHTML = msg;
  orderEl.classList[add ? "add" : "remove"]("empty");
}

function fillOrder(orders, add) {
  let lists = "";
  if (!order.length) {
    handleEmptySection("<p>No order found</p>", true);
    return;
  }
  handleEmptySection("", false);
  orders.forEach((order) => (lists += orderTemplate(order)));
  orderEl.innerHTML = lists;
}

//NAVIGATE
controls.addEventListener("click", (e) => {
  if (e.target.className) {
    state["query"].status = e.target.className;
  }
});

//API REQUEST
function getOrders() {
  const query = new URLSearchParams(state["query"]).toString();
  xhr.open("GET", `${origin}/api/v1/orders?${query}`);
  xhr.send();
}

xhr.onload = function () {
  console.log(this.responseText);
  const res = JSON.parse(this.responseText);
  if (res.status === "success") {
    fillOrders(res.data.orders);
  }
};

getOrders();

/**
 *  <div class="panel">

      <div class="panel1">
        <div class="">
          <p>ORDER PLACED</p>
          <p>1614528784029</p>
        </div>
        <div>
          <p>TOTAL</p>
          <p>₹600</p>
        </div>
        <div>
          <p>SHIP TO</p>
          <p>8A/3D/K kareli Allahabad Uttar pradesh</p>
        </div>
        <div>
          <p>ORDER ID</p>
          <p>Ref:6039018f3bab401055c3c552</p>
        </div>
      </div>
      <div class="panel2" style="border-top: 1px solid grey;">

        <div class="product">
          <p>ACECLOFENAC 100MG 10'S</p>
          <img style="width:80px;" src="/public/images/default.png">
        </div>

        <div class="action">
          <button>Track Package</button><br>
          <button>Return</button><br>
          <button>Cancel</button>
        </div>

      </div>
      <div class="panel2" style="border-top: 1px solid grey;">

        <div class="product">
          <p>ACECLOFENAC 100MG 10'S</p>
          <img style="width:80px;" src="/public/images/default.png">
        </div>

        <div class="action">
          <button>Track Package</button><br>
          <button>Return</button><br>
          <button>Cancel</button>
        </div>

      </div>
    </div>
 */
