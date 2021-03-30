const xhr = new XMLHttpRequest();
const productId = window.location.pathname.split("/")[2];
const productEl = document.querySelectorAll(".product_details");

const [title, id, price, description] = productEl;

function removeLoader() {
  const container = document.querySelector(".get-container");
  container.removeChild(container.children[0]);
}
//not active
function formatImage(coverImage, images) {
  if (coverImage) images.push(coverImage);

  images.forEach((image) => {
    const a = document.createElement("a");
    const img = document.createElement("img");
    a.classList.add = "product-gallery-item";

    a.setAttribute("data-image", image);
    a.setAttribute("data-zoom", image);

    img.src = image;
    img.alt = "product side";

    a.appendChild(img);
    gallery.appendChild(a);
  });

  images.children[1].classList.add("active");
}

function formatPrice(price, discount) {
  if (discount) {
    discounts.innerHTML = `<div class="product-price product-element">₹${
      price - discount
    }</div> 
        <h5 style="color: #9797A3;"><del>₹${price}</del></h5> 
        <p id="off" style="color: #00A500;">${
          (discount / price) * 100
        }%off</p>`;
  } else {
    discounts.innerHTML = `<div class="product-price product-element">₹${
      price - discount
    }</div>`;
  }
}

function addToCart() {
  xhr.open("PATCH", `${origin}/api/v1/cart/${productId}`);
  xhr.withCredentials = true;
  xhr.send();
}

//FETCH PRODUCT DETAILS
const fieldlist = [
    "productId",
    "title",
    "price",
    "discount",
    "description",
    "images",
    "coverImages",
];

fetch(`${origin}/api/v1/products/${productId}?fields=${fieldlist.join(",")}`, {
      method: "GET",})
    .then(res => res.json())
    .then(data => {
    const product = data.product;

    if (data.status === "success") {
      id.innerText = `ID: ${product.productId}`;
      title.innerText = product.title;
      description.innerText = product.description || "Not Available";
      //price
      if (product.discount) {
        price.children[0].innerText = `₹${product.price - product.discount}`;
        price.children[1].innerHTML = `&nbsp;<del>₹${product.price}</del>&nbsp;`;
        price.children[2].innerText = `${Math.round((product.discount / product.price) * 100)}%`;
      } else {
        price.children[0].innerText = `₹${product.price}`;
      }
    } else showStatus(data);
})
.catch(err => show({status:"error", message:err.message}))
