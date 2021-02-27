const xhr = new XMLHttpRequest();
const productId = window.location.pathname.split('/')[2];
const productEl = document.querySelectorAll('.product-element');
const [photo, gallery, title, price, description, information] = productEl;

function removeLoader() {
    const container = document.querySelector('.get-container');
    container.removeChild(container.children[0]);
}
//not active
function formatImage(coverImage, images) {

    if (coverImage)
        images.push(coverImage);

    images.forEach((image) => {
        const a = document.createElement('a');
        const img = document.createElement('img');
        a.classList.add = "product-gallery-item";

        a.setAttribute('data-image', image);
        a.setAttribute('data-zoom', image);

        img.src = image;
        img.alt = "product side";

        a.appendChild(img);
        gallery.appendChild(a);
    })

    images.children[1].classList.add('active');
}

function formatProductData(_title, _price, _description) {
    title.textContent = _title;
    price.textContent = `₹${_price}`;
    description.textContent = _description;
}
function formatInfo(sideEffects, ingredients) {

    let no_info = true;

    information.innerText = "";
    const h3 = document.createElement('h3');

    if (ingredients.length) {
        h3.textContent = 'Ingredients';
        const ul = document.createElement('ul');
        ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = ing;
            ul.appendChild(li);
        })

        information.appendChild(h3);
        information.appendChild(ul);
        no_info = false;
    }

    if (sideEffects) {
        h3.textContent = "Side Effects";
        const p = document.createElement('p');
        p.textContent = sideEffects;

        information.appendChild(h3);
        information.appendChild(p);
        no_info = false;
    }

    if (no_info) {
        const p = document.createElement('p');
        p.textContent = "Information not available";
        information.appendChild(p);
    }

}

function getProductDetails() {
    xhr.open('GET', `${origin}/api/v1/products/${productId}`);
    xhr.send();
}

function addToCart() {
    xhr.open('PATCH', `${origin}/api/v1/cart/${productId}`);
    xhr.send();
}

xhr.onload = function () {
    const res = JSON.parse(this.responseText);
    if (res.status === 'fail' || res.status === 'error') {
        showStatus(res);
        return;
    }
    if (res.data) {
        const { title, price, description, sideEffects, ingredients } = res.data.product;
        formatProductData(title, price, description);
        formatInfo(sideEffects, ingredients);
        removeLoader();
    } else
        showStatus(res);
}

window.addEventListener('DOMContentLoaded', () => getProductDetails());