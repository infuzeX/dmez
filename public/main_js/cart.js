const xhr = new XMLHttpRequest();

const couponForm = document.querySelector("#coupon-apply");
const cartLoader = document.querySelector(".cart-loader");
const cart_products = document.querySelector("#products-list");
const cart_summary = document.querySelector(".cart-summary");

let cart = {};

/*========================TEMPLATES==========================*/
function cart_product_temp({
  productId,
  title,
  brand,
  coverImage,
  price,
  discount,
  quantity,
}) {
  const imgUrl = coverImage || "/public/images/default.png";
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
    <button id="dec_${productId}" style="font: size 1.3rem;" onclick="modify_qty(event)">-</button>
    <span id="qty">${quantity}</span>
    <button id="inc_${productId}" style="font: size 1.3rem;" onclick="modify_qty(event)">+</button>
</div>

    </td>

    <td class="total-col">₹${quantity * (price - discount)}</td>

    <td class="remove-col">
    <button class="btn-remove"><i id="${productId}" onclick="deleteCartItem(event)" class="icon-close"></i></button>
    </td>
</tr>`;
}

/*========================RESPONSE HANDLER==========================*/
function handleEmptySection(msg, isEmpty) {
  cart_products.classList[isEmpty ? "add" : "remove"]("empty");
  cart_products.innerHTML = msg;
}

function calculateSubTotal(products) {
  subTotal = 0;
  products.forEach((item) => {
    cart["totalPrice"]
  });
}

function calculateCouponDiscount(subtotal) {
  //coupon discount
  if (cart["coupon"] && cart["coupon"].code) {
    const { discount, maxDiscount } = cart.coupon;
    let couponDiscount = subtotal * (discount / 100);
    if (maxDiscount)
      cart["couponDiscount"] =
        couponDiscount > maxDiscount ? maxDiscount : couponDiscount
  } else {
    cart["couponDiscount"] = 0;
  }
}

function calculateDeliveryCharge(subTotal) {
  //delivery charge
  if (subTotal <= 200) cart["charge"] = 100;
  else if (subTotal > 200 && subTotal <= 400)
    cart["charge"] = 50;
  else cart["charge"] = 0;
}

function fillCart(isEmpty) {
  let table_rows = "";
  if (cart["products"].length) {
    handleEmptySection("", isEmpty);
    cart["products"].forEach(
      (product) => (table_rows += cart_product_temp(product))
    );
    cart_products.innerHTML = table_rows;
  } else {
    handleEmptySection(
      `<tr><td>No products added in your cart</td></tr>`,
      true
    );
  }
}

function fillSummary() {
 
  //calculateSubTotal(cart["products"]);
  calculateCouponDiscount(cart["subTotal"]);
  calculateDeliveryCharge(cart["subTotal"] - cart["couponDiscount"]);

  cart_summary.children[0].children[1].textContent = `₹${cart["totalPrice"]}`;
  cart_summary.children[1].children[1].textContent = `₹${cart["totalSavings"]}`;
  cart_summary.children[2].children[1].textContent = `₹${cart["couponDiscount"]}`;
  cart_summary.children[3].children[1].textContent = `₹${cart["subTotal"] - cart["couponDiscount"]}`;
  cart_summary.children[4].children[1].textContent = `₹${cart["charge"]}`;
  cart_summary.children[5].children[1].textContent = `₹${
    (cart["subTotal"] - cart["couponDiscount"]) + cart["charge"]
  }`;
}

function removeItemFromCart(itemId) {
  const index = cart["products"].findIndex(
    (product) => product.productId == itemId
  );
  const item = cart["products"][index];
  //update cart state
  cart["totalPrice"] -= item.quantity * item.price;
  cart["totalSavings"] -= item.quantity * item.discount;
  cart["subTotal"] = cart["totalPrice"] - cart["totalSavings"];
  cart["totalProducts"] -= 1;
  //remove item from cart
  cart["products"].splice(index, 1);
  //update UI
  fillCart(false);
  fillSummary();
}

function modify_qty(e) {
  const pdata = e.target.id.split("_");
  updateCartQuantity({ inc: pdata[0] === "inc" }, pdata[1]);
}

function updateItemQuantity(itemId, qty) {
  const item = cart["products"].find((product) => product.productId == itemId);
  //delete item if quantity 0
  if (item["quantity"] === 1 && qty === -1) {
    removeItemFromCart(itemId);
    return;
  }
  //update item state
  item["quantity"] += qty;
  //update summary state
  cart["totalPrice"] += qty * item.price;
  cart["totalSavings"] += qty * item.discount;
  cart["subTotal"] = cart["totalPrice"] - cart["totalSavings"];
  //update UI
  fillCart();
  fillSummary();
}

/*========================API REQUESTS==========================*/
function getCartData() {
  //handleLoader(cartLoader, 'fetching cart item', 'active')
  xhr.open("GET", `/api/v1/cart`);
  xhr.withCredentials = true;
  xhr.send();
}

function updateCartQuantity(data, productId) {
  handleLoader(cartLoader, "updating item quantity", "active");
  xhr.open("PUT", `/api/v1/cart/${productId}`);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

function deleteCartItem(e) {
  handleLoader(cartLoader, "deleting item from cart", "active");
  const productId = e.target.id;
  xhr.open("DELETE", `/api/v1/cart/${productId}`);
  xhr.send();
}

function proceedToCheckout() {
  handleLoader(cartLoader, "proceeding to checkout", "active");
  xhr.open("POST", "/api/v1/checkout");
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ offer_id: null }));
}

/*========================RESPONSE==========================*/
xhr.onload = function () {
  const res = JSON.parse(this.responseText);
  //close loader
  closeLoader(cartLoader);
  //if any error occured;
  if (res.status === "fail" || res.status === "error") {
    showStatus(res);
    return;
  }

  if (res.path) {
    window.location.href = res.path;
    return;
  }

  if (res.data.cart) {
    cart = { ...res.data.cart };
    res.data.cart = null;
    fillCart(false);
    fillSummary();
    updateCouponForm();
    return;
  }

  //if related to item
  if (res.data.quantity) {
    updateItemQuantity(res.data.productId, res.data.quantity);
    showStatus(res);
    return;
  }

  if (res.data.productId) {
    removeItemFromCart(res.data.productId);
    showStatus(res);
    return;
  }
};

xhr.onerror = function () {
  closeLoader(cartLoader);
  showStatus({ status: "error", message: "something went wrong" });
};

window.addEventListener("DOMContentLoaded", () => getCartData());

//COUPON
function updateCouponForm() {
  const isApplied = cart.coupon.code ? true : false;
  const form = couponForm.children[0];
  const input = form.children[0];
  const button = form.children[1].children[0];

  button.innerHTML = isApplied
    ? '<i class="fas fa-window-close"></i>'
    : '<i class="fas fa-chevron-right"></i>';
  input.id = isApplied ? "applied" : "apply";
  input.value = cart.coupon.code || "";

  if (isApplied) {
    input.setAttribute("readonly", true);
  } else {
    input.removeAttribute("readonly");
  }
}

couponForm.addEventListener("submit", async (e) => {
  try {
    handleLoader(cartLoader, "Applying coupon", "active");
    e.preventDefault();
    const coupon = e.target.elements.coupon;

    const methods = {
      apply: "PATCH",
      applied: "DELETE",
    };
    const rawRes = await fetch(`/api/v1/cart/coupon/${coupon.value}`, {
      method: methods[coupon.id],
      credentials: "include",
    });

    const res = await rawRes.json();
    if (res.status === "success") {
      cart["coupon"] = res.data.coupon;
      updateCouponForm();
      fillSummary();
    }

    showStatus(res);
  } catch (err) {
    showStatus({ status: "error", message: "something went wrong" });
  }
  closeLoader(cartLoader);
});
