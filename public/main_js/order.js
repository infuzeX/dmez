const orderEl = document.querySelector(".orders-panel");
//const controls = document.querySelector(".controls");

const state = {
  query: {
    page: 1,
    limit: 10,
    fields: ["totalAmount", "products", "address", "status", "currentStatus"],
  },
};

function orderTemplate({
  totalAmount,
  address,
  products,
  status,
  currentStatus,
  _id,
  createdAt,
}) {
  const statusObj = {};
  status.forEach(({ state, date }) => {
    statusObj[state] = {
      name: state,
      date,
    };
  });
  if (!statusObj["placed"]) {
    statusObj["placed"] = {
      name: "placed",
      date: createdAt,
    };
  }
  status = null;
  return `
 <div id="${_id}"> 
  <div class="panel1" >
    <div class="">
      <p>ORDER ${statusObj[currentStatus || "placed"].name.toUpperCase()}</p>
      <p>${new Date(
        statusObj[currentStatus || "placed"].date
      ).toDateString()}</p>
    </div>

    <div>
      <p>TOTAL</p>
      <p>₹${totalAmount}</p>
    </div>

    <div>
      <p>SHIP TO</p>
      <p>${address.flatnumber || ""} ${address.area || ""} ${
    address.city || ""
  } 
      ${address.state || ""}</p>
    </div>

    <div>
      <p>ORDER ID</p>
      <p>Ref:${_id}</p>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;"> 
     
     <div class="product">
      
      ${popuplateProducts(products)}
   
     </div>
     <div class="action" style="width:30%">
       <button>
       <a style="text-decoration:none;color:#333" href="/account/orders/${_id}">
       View details
       </a>
       </button>
       ${updateButton(currentStatus)}
     </div>

  </div>
 </div>`;
}

function popuplateProducts(products) {
  let productsEl = "";
  products.forEach((product) => (productsEl += `<p>${product.title}</p><br/>`));
  return productsEl;
}

function updateButton(status) {
  if (status === "placed") {
    return '<button id="cancel" onclick="manageOrder(event)">Cancel</button>';
  }
  if (status === "delivered") {
    return '<button id="return" onclick="manageOrder(event)">Return</button>';
  }
  return "";
}

function handleEmptySection(msg, add) {
  orderEl.innerHTML = msg;
  orderEl.classList[add ? "add" : "remove"]("empty");
}

//NAVIGATE
//controls.addEventListener("click", (e) => {
// if (e.target.className) {
//   state["query"].status = e.target.className;
// }
//});

//API REQUEST
async function fetchOrders() {
  const query = new URLSearchParams(state["query"]).toString();
  const rawResponse = await fetch(`/api/v1/orders?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return rawResponse.json();
}

async function manageOrder(e) {
  try {
    const rawRes = await fetch(
      `/api/v1/orders/${e.path[3].id}/${e.target.id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const res = await rawRes.json();
    showStatus(res);
    if (res.status === "success") {
      window.location.reload();
    }
    return true;
  } catch (err) {
    showStatus({ status: "error", message: err.message });
  }
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
      showStatus({ status: "error", message: err.message });
    });
};
