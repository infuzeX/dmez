const productId = window.location.pathname.split("/")[2];
const productEl = document.querySelectorAll(".product_details");
const gallery = document.querySelector(".xzoom-container");
const [title, id, price, description] = productEl;
origin = "https://admin.dmez.in";
function removeLoader() {
  const container = document.querySelector(".get-container");
  container.removeChild(container.children[0]);
}
//NOT ACTIVE
function formatImage(coverImage, images) {
  if (coverImage) {
    images.push(coverImage);
  }

  if (!images.length) {
    gallery.children[0].src = `/public/images/default.png`;
    gallery.children[0].src = `/public/images/default.png`;
    return;
  }

  images.forEach((image, index) => {
    const a = document.createElement("a");
    const img = document.createElement("img");
    a.href = `${origin}/${image}`;

    img.src = `${origin}/${image}`;
    img.classList.add = "xzoom-gallery";
    img.width = "90";

    if (index === 0) {
      gallery.children[0].src = `${origin}/${image}`;
      gallery.children[0].src = `${origin}/${image}`;
      img.xpreview = `${origin}/${image}`;
    }

    a.appendChild(img);
    gallery.children[1].appendChild(a);
  });
}

async function addToCart() {
  try {
    const res = await fetch(`/api/v1/cart/${productId}`, {
      method: "PATCH",
      credentials:"include"
    });
    const response = await res.json();
    showStatus(response);
    return;
  } catch (err) {
    showStatus(err);
    return;
  }
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

fetch(`/api/v1/products/${productId}?fields=${fieldlist.join(",")}`, {
  method: "GET",
})
  .then((res) => res.json())
  .then((res) => {
    if (res.status === "success") {
      const product = res.data.product;
      id.innerText = `ID: ${product.productId || "----"}`;
      title.innerText = product.title;
      description.innerText = product.description || "Not Available";
      //price
      if (product.discount) {
        price.children[0].innerText = `₹${product.price - product.discount}`;
        price.children[1].innerHTML = `&nbsp;<del>₹${product.price}</del>&nbsp;`;
        price.children[2].innerText = `${Math.round(
          (product.discount / product.price) * 100
        )}%`;
      } else {
        price.children[0].innerText = `₹${product.price}`;
      }
      formatImage(product.coverImage, product.images);
    } else showStatus(res);
  })
  .catch((err) => showStatus({ status: "error", message: err.message }));
