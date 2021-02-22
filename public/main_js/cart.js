const xhr = new XMLHttpRequest();

const cart_products = document.querySelector('#products-list');
const cart_summary = document.querySelector('.cart-summary')
const cart = {
    products: [
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
    totalProducts: 3,
    shipping: 'free-shipping',
    shippingCharge: 0
}

/*========================TEMPLATES==========================*/
function cart_product_temp({ _id, title, brand, coverImage, price, discount, quantity }) {
    const imgUrl = coverImage || '/public/images/default.png';
    return `<tr id="${_id}">
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
    <button class="btn-remove"><i id="${_id}" onclick="removeItemFromCart(event)" class="icon-close"></i></button>
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
        cart_summary.children[5].children[1].textContent = `₹${cart['totalAmount'] + cart['shippingCharge']}`
    }
}

/*========================RESPONSE HELPER FUNCTION==========================*/
function fillCart() {
    let table_rows = "";
    if (cart['products'].length) {
        cart_products.innerHTML = table_rows;
        cart['products'].forEach(product => table_rows += cart_product_temp(product))
        cart_products.innerHTML = table_rows;
    } else {
        cart_products.innerHTML = "<tr><td>No products added in your cart</td></tr>"
    }
}

function fillSummary() {
    cart_summary.children[0].children[1].textContent = `₹${cart['totalAmount']}`;
    cart_summary.children[1].children[1].textContent = `₹${cart['totalSavings']}`;
    cart_summary.children[6].children[1].textContent = `₹${cart['totalAmount'] + cart['shippingCharge']}`
}

function removeItemFromCart(e) {
    const itemId = e.target.id;
    const index = cart['products'].findIndex(product => product._id == itemId);
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

function updateItemFromCart(itemId, qty) {
    const item = cart['products'].find(product => product._id == itemId);
    //update item state
    item['quantity'] += qty; //1 || -1;
    //update summary state
    cart['totalAmount'] += qty * (item.price - item.discount);
    cart['totalSavings'] += qty * item.discount;

    //update UI
    fillCart();
    fillSummary();
}
/*========================RESPONSE HANDLER==========================*/


/*========================REQUEST==========================*/
function getCartData() {
    xhr.open('GET', `${origins.getApi('api')[1]}/api/v1/cart`);
    xhr.send();
}

function updateCartQuantity() {

}

fillCart();
fillSummary();


/*========================RESPONSE==========================*/
xhr.onload = function () { }

