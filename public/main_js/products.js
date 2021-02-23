const xhr = new XMLHttpRequest();
const dom = new DOMParser();

const container = document.querySelector('#main_container');
const products_Div = container.children[1];
const nav = container.children[2];

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
  const imgUrl = coverImage ? `${origins['img'][1]}/${coverImage}` : `/public/images/default.png`;
  return `
    <div class="col-sm-4" id="${_id}">
      <div class="product-image-wrapper">
        <div class="single-products">
          <div class="productinfo text-center">
            <img src="${imgUrl}" alt="" />
            <h2>₹ ${price}</h2>
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

function handleEmptySection(msg, add) {
  products_Div.innerHTML = msg;
  products_Div.classList[add ? 'add' : 'remove']('empty');
}
function buildProducts(products) {
  if (!products.length) {
    //replace loader with message
    handleEmptySection("<p>No products found</p>", true);
    return;
  }
  //replace loader with product
  handleEmptySection('', false);
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
  handleEmptySection("<div class='loader'></div>", true)
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
const origin = origins['shop'][1];
function getProducts() {
  const queryString = new URLSearchParams(state['settings']).toString();
  xhr.open('GET', `${origin}/api/v1/products?${queryString}`);
  xhr.send();
}

function addToCart(e) {
  const productId = e.path[4].id;
  xhr.open('PATCH', `${origin}/api/v1/cart/${productId}`);
  xhr.send();
}

//RESPONSE HANDLER
xhr.onload = function () {

  const res = JSON.parse(this.responseText);

  if (res.status === 'fail' || res.status === 'error') {
    showStatus(res);
    return;
  }

  //handle product response
  if (res.data) {
    state['products'] = res.data.products;
    state['results'] = res.data.products.length;
    buildProducts(state['products']);
    updateNavigation();
  } else {
    //handle cart response
    //show success message to user;
    showStatus(res);
  }

}

//INIT PRODUCTS API CALL
window.addEventListener('DOMContentLoaded', () => getProducts());