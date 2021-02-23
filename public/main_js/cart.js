const xhr = new XMLHttpRequest();

const cart_products = document.querySelector('#products-list');
const cart_summary = document.querySelector('.cart-summary')
let cart = {
    /*products: [
        {
            _id: 1,
            title: "dhdjgdf-1",
            brand: "ikon",
            coverImage: "",
            price: 60,
            discount: 0,
            quantity: 5
        },
        {
            _id: 2,
            title: "dhdjgdf-2",
            brand: "ikon",
            coverImage: "",
            price: 250,
            discount: 100,
            quantity: 3
        },
        {
            _id: 3,
            title: "dhdjgdf-3",
            brand: "ikon",
            coverImage: "",
            price: 150,
            discount: 25,
            quantity: 2
        }
    ],
    totalAmount: 1000,
    totalSavings: 350,
    totalProducts: 3,*/
    shipping: 'free-shipping',
    shippingCharge: 0
}

/*========================TEMPLATES==========================*/
function cart_product_temp({ productId, title, brand, coverImage, price, discount, quantity }) {
    const imgUrl = coverImage || '/public/images/default.png';
    return `<tr id="${productId}">
    <td class="product-col">
        <div class="product">

            <figure class="product-media">
                <a href="#">
                    <img src="${imgUrl}" alt="Product image">
                </a>
            </figure>

            <h3 class="product-title">
                <a href="#">${title}</a>
            </h3>
        </div>
    </td>

    <td class="price-col">₹${price}</td>
    <td class="price-col">₹${discount}</td>
   
    <td class="quantity-col">
        <div class="cart-product-quantity">
            <input type="number" class="form-control" value="${quantity}" min="1" max="10"
                step="1" data-decimals="0" required>
        </div><!-- End .cart-product-quantity -->

    </td>

    <td class="total-col">₹${quantity * (price - discount)}</td>

    <td class="remove-col">
    <button class="btn-remove"><i id="${productId}" onclick="deleteCartItem(event)" class="icon-close"></i></button>
    </td>
</tr>`
}

/*========================DOM FUNCTION==========================*/
function getShipping(e) {
    const shippingCharge = {
        'free-shipping': 0,
        'standart-shipping': 50,
        'express-shipping': 100
    }
    if (e.target.id) {
        cart['shipping'] = e.target.id;
        cart['shippingCharge'] = shippingCharge[e.target.id];
        cart_summary.children[6].children[1].textContent = `₹${cart['totalAmount'] + cart['shippingCharge']}`
    }
}

/*========================RESPONSE HANDLER==========================*/
function handleEmptySection(msg) {
    cart_products.classList.toggle('empty');
    cart_products.innerHTML = msg;
}

function fillCart() {
    let table_rows = "";
    if (cart['products'].length) {
        handleEmptySection('');
        cart['products'].forEach(product => table_rows += cart_product_temp(product))
        cart_products.innerHTML = table_rows;
    } else {
        handleEmptySection(`<tr><td>No products added in your cart</td></tr>`);
    }
}

function fillSummary() {
    cart_summary.children[0].children[1].textContent = `₹${cart['totalAmount']}`;
    cart_summary.children[1].children[1].textContent = `₹${cart['totalSavings']}`;
    cart_summary.children[6].children[1].textContent = `₹${cart['totalAmount'] + cart['shippingCharge']}`
}

function removeItemFromCart(itemId) {
    const index = cart['products'].findIndex(product => product.productId == itemId);
    const item = cart['products'][index];
    //update cart state
    cart['totalAmount'] -= item.quantity * (item.price - item.discount);
    cart['totalSavings'] -= item.quantity * item.discount;
    cart['totalProducts'] -= 1;
    //remove item from cart
    cart['products'].splice(index, 1);
    //update UI
    fillCart();
    fillSummary();
}

function updateItemQuantity(itemId, qty) {
    const item = cart['products'].find(product => product.productId == itemId);
    //update item state
    item['quantity'] += qty; //1 || -1;
    //update summary state
    cart['totalAmount'] += qty * (item.price - item.discount);
    cart['totalSavings'] += qty * item.discount;
    //update UI
    fillCart();
    fillSummary();
}


/*========================API REQUESTS==========================*/
const origin = origins['shop'][1];

function getCartData() {
    xhr.open('GET', `${origin}/api/v1/cart`);
    xhr.send();
}

function updateCartQuantity(e) {
    const productId = e.target.id;
    xhr.open('PATCH', `${origin}/api/v1/cart/${productId}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ inc }));
}

function deleteCartItem(e) {
    const productId = e.target.id;
    console.log(productId);
    xhr.open('DELETE', `${origin}/api/v1/cart/${productId}`);
    xhr.send();
}

function proceedToCheckout() {
    xhr.open('POST', `${origin}/api/v1/checkout`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ shipping: cart['shipping'] }));
}


/*========================RESPONSE==========================*/
xhr.onload = function () {
    console.log(this.responseText);
    const res = JSON.parse(this.responseText);

    //if any error occured;
    if (res.status === 'fail' || res.status === 'error') {
        showStatus(res);
        return
    }

    //if cart data present
    if (res.data['cart']) {
        cart = { ...cart, ...res.data.cart };
        res.data.cart = null;
        fillCart();
        fillSummary();
        return
    }

    //if related to item
    if (res.data['quantity']) {
        updateItemQuantity(res.data.productId, req.data.quantity);
        showStatus(res);
        return;
    }

    if (res.data['productId']) {
        removeItemFromCart(res.data.productId);
        showStatus(res);
        return;
    }

    //else checkout page
    //window.location.href = "/checkout";
}

window.addEventListener('DOMContentLoaded', () => getCartData());