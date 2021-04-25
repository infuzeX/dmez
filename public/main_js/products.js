const xhr = new XMLHttpRequest();
const dom = new DOMParser();

const searchbar = document.querySelectorAll(".search-container");
const container = document.querySelector("#main_container");
const products_Div = container.children[1];
const nav = container.children[2];

//STATE
let state = {
  results: 0,
  loaded:true,
  products: [],
  settings: {
    limit: 15,
    page: 1,
    fields: ["title", "price", "discount", "coverImage"],
    sort: ["-price", "discount"],
  },
};

//HTML TEMPLATES
function checkDiscount(price, discount) {
  if (discount) {
    return `<div class="discounts">
    <h2>₹${price - discount}</h2>
    <h5 style="color: #9797A3;"><del>₹${price}</del></h5>
    <p id="off" style="color: #00A500;"> ${Math.round((discount / price) * 100)}%off</p>
    <style>
    .discounts h2, h5, #off {
      display: inline-block;
    }
    </style>
  </div>`;
  }

  return `<h2>₹${price}</h2>`;
}

function productTemp({ _id, title, price, discount, coverImage }) {
  const imgUrl = coverImage
    ? `https://admin.dmez.in/${coverImage}`
    : `/public/images/default.png`;
  return `
    <div class="col-sm-4" id="${_id}">
      <div class="product-image-wrapper">
        <div class="single-products">
          <div class="productinfo text-center">
            <img src="${imgUrl}" alt="" />
            ${checkDiscount(price, discount)}
            <p>${title}</p>
            <a href="/products/${_id}"></a>
          </div>
          <center>
          <span onclick="addToCart(event)" class="btn btn-default add-to-cart"><i
          class="fa fa-shopping-cart"></i>Add to cart</span>
        </center>            
        </div>
    
     </div>
    </div>`;
}

/*==========DOM MANIPULATORS==========*/
function handleEmptySection(msg, add) {
  products_Div.innerHTML = msg;
  products_Div.classList[add ? "add" : "remove"]("empty");
}
function buildProducts(products) {
  if (!products.length) {
    //replace loader with message
    handleEmptySection("<p>No products found</p>", true);
    return;
  }
  //replace loader with product
  handleEmptySection("", false);
  products.forEach((product) =>
    products_Div.appendChild(parseString(productTemp(product)))
  );
}

//product navigation
function navigateToPage(e) {
  if(!loaded) return;
  if (e.target.id === "prev" && state["settings"].page === 1) return;
  //check if result is less than limit means no more item available
  if (e.target.id === "next" && state["settings"].limit > state["results"])
    return;
  //update page number then request for next page product
  handleEmptySection("<div class='loader'></div>", true);
  state["settings"].page += e.target.id === "next" ? 1 : -1; //increment page
  loaded = false;
  getProducts();
}

//update navigation : change nav color or page number on products log
function updateNavigation() {
  const { page, limit } = state["settings"];
  nav.children[0].style.color = page > 1 ? "#333" : "grey";
  nav.children[1].textContent = page;
  nav.children[2].style.color = limit > state["results"] ? "grey" : "#333";
}

function parseString(temp) {
  const doc = dom.parseFromString(temp, "text/html");
  return doc.body.children[0];
}

function parseCookie() {
  const cookies = document.cookie.split(" ");
  const index = cookies.findIndex((cookie) => cookie.startsWith("search"));
  if (index < 0) return 0;
  const search = cookies.splice(index, 1)[0].split("=")[1];
  document.cookie = "search='';expires=Thu, 01 Jan 1970 00:00:00 GMT";
  return search;
}

function updateSearchSetting(search) {
  state["settings"].page = 1;
  state["settings"].search = search.split(" ").join("_");
}


//GET PRODUCTS API
async function getProducts() {
  try {
    const queryString = new URLSearchParams(state["settings"]).toString();
    const response = await fetch(`${origin}/api/v1/products?${queryString}`, {
      method: "GET",
    });
    loaded = true;
    const res = await response.json();
    if (res.status === "success") {
      state["products"] = res.data.products;
      state["results"] = res.data.products.length;
      buildProducts(state["products"]);
      updateNavigation();
      return;
    }
    showStatus(res);
  } catch (err) {
    loaded = true;
    showStatus({ status: "error", message: err.message });
  }
}

//ADD TO CART API
function setButtonState(button, state) {
  button.id = state ? "" : "adding";
  button.innerHTML = `<i class='fas fa-shopping-cart'></i>${
    state ? "Add to cart" : "please wait! Adding..."
  }`;
}

async function addToCart(e) {
  try {
    const button = e.target;
    if (button.id === "adding") throw { message: "please wait" };

    setButtonState(button, false);
    const response = await fetch(`${origin}/api/v1/cart/${e.path[4].id}`, {
      method: "PATCH",
      credentials:'include'
    });
    const res = await response.json();
    setButtonState(button, true);
    showStatus(res);
  } catch (err) {
    setButtonState(button, true);
    showStatus({ status: "fail", message: err.message });
  }
}

//FETCH PRODUCTS
window.addEventListener("DOMContentLoaded", async () => {
  //check & update search cookie
  const search = parseCookie();
  if (search) updateSearchSetting(search);
  await getProducts();
});

//FETCH SEARCH PRODUCTS
searchbar.forEach((bar) => {
  bar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const search = e.target.elements.data.value;
    if (!search || search === "") {
      return;
    }
    handleEmptySection("<div class='loader'></div>", true);
    updateSearchSetting(search);
    await getProducts();
  });
});
