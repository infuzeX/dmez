const xhr = new XMLHttpRequest();
const dom = new DOMParser();
const pdts = document.querySelector('.features_items')

function parseString(temp) {
    const doc = dom.parseFromString(temp, 'text/html');
    return doc.body.children[0];
}

function getProducts() {
    xhr.open('GET', 'http://127.0.0.1:3000/api/v1/products');
    xhr.send();
}

function addToCart(e) {
    const productId = e.path[4].id;
    xhr.open('PATCH', `http://127.0.0.1:3000/api/v1/cart/${productId}`)
    xhr.send();
}

function productTemp({ _id, title, price, discount, discountInPer, coverImage }) {
    const imgUrl = coverImage ? `http://127.0.0.1:3000/${coverImage}` : `/images/default.png`;
    return `
    <div class="col-sm-4" id="${_id}">
      <div class="product-image-wrapper">
        <div class="single-products">
          <div class="productinfo text-center">
            <img src="${imgUrl}" alt="" />
            <h2>Rs ${price}</h2>
            <p>${title}</p>
            <span onclick="addToCart(event)" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</span>
          </div>
                            
        </div>
      <div class="choose">
      <ul class="nav nav-pills nav-justified">
        <li><a href=""><i class="fa fa-plus-square"></i>Add to wishlist</a></li>
      </ul>
     </div>
     </div>
    </div>`
}

function buildProducts(products) {
    products.forEach(product => {
        pdts.appendChild(parseString(productTemp(product)));
    })
}

xhr.onload = function () {
    const res = JSON.parse(this.responseText);
    if (res.status === 'fail' || res.status === 'error') {
        console.log(res);
        return
    }
    if (res.data) {
        buildProducts(res.data.products);
        return;
    }
    console.log(res);
}

getProducts();

