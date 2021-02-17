const xhr = new XMLHttpRequest();
const dom = new DOMParser();

const container = document.querySelector('#main_container');
const products_Div = container.children[1];
const nav = container.children[2];

//replace localhost origin with https://dmezapi,herokuapp.com
const origin = "http://127.0.0.1:3000"
const imgOrgin = "https://dmez.herokuapp.com"

//STATE
let state = {
  results: 0,
  products: [],
  settings: {
    limit: 10,
    page: 1,
    fields: ['title', 'price', 'discount', 'coverImage'],
    sort: ['price', 'discount']
  }
}

//HTML TEMPLATES
function productTemp({ _id, title, price, discount, discountInPer, coverImage }) {
  const imgUrl = coverImage ? `${imgOrgin}/${coverImage}` : `/public/images/default.png`;
  return `
    <div class="col-sm-4" id="${_id}">
      <div class="product-image-wrapper">
        <div class="single-products">
          <div class="productinfo text-center">
            <img src="${imgUrl}" alt="" />
            <h2>Rs ${price}</h2>
            <p>${title}</p>
            <a href="/products/${_id}"></a>
          </div>
          <center>
          <span onclick="addToCart(event)" class="btn btn-default add-to-cart"><i
          class="fa fa-shopping-cart"></i>Add to cart</span>
        </center>            
        </div>
      <div class="choose">
      <ul class="nav nav-pills nav-justified">
        <li><a href=""><i class="fa fa-plus-square"></i>Add to wishlist</a></li>
      </ul>
     </div>
     </div>
    </div>`
}

/*==========DOM MANIPULATORS==========*/
function buildProducts(products) {
  products_Div.innerHTML = "";
  products.forEach(product => products_Div.appendChild(parseString(productTemp(product))))
}

//product navigation
function navigateToPage(e) {
  if (e.target.id === "prev" && state['settings'].page === 1)
    return;
  //check if result is less than limit means no more item available
  if (e.target.id === "next" && state['settings'].limit > state['results'])
    return;
  //update page number then request for next page product
  state['settings'].page += (e.target.id === "next") ? 1 : -1; //increment page
  getProducts();
}

//update navigation : change nav color or page number on products log
function updateNavigation() {
  const { page, limit } = state['settings'];
  nav.children[0].style.color = (page > 1) ? "#333" : "grey"
  nav.children[1].textContent = page;
  nav.children[2].style.color = limit > state['results'] ? "grey" : "#333";
}

function parseString(temp) {
  const doc = dom.parseFromString(temp, 'text/html');
  return doc.body.children[0];
}

//API REQUESTS
function getProducts() {
  const queryString = new URLSearchParams(state['settings']).toString();
  xhr.open('GET', `${origin}/api/v1/products?${queryString}`);
  xhr.send();
}

function addToCart(e) {
  const productId = e.path[4].id;
  xhr.open('PATCH', `${origin}/api/v1/cart/${productId}`)
  xhr.send();
}

//RESPONSE HANDLER
xhr.onload = function () {
  const res = JSON.parse(this.responseText);

  if (res.status === 'fail' || res.status === 'error') {
    console.log(res);
    return
  }
  if (res.data.products) {
    state['products'] = res.data.products;
    state['results'] = res.data.products.length;
    buildProducts(state['products']);
    updateNavigation();
    return;
  }

}

//INIT PRODUCTS API CALL
window.addEventListener('DOMContentLoaded', () => getProducts());