const products = document.querySelector('#products-list');
const dom = new DOMParser();

const cart_products = [
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
]

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

    <td class="price-col">₹${discount}</td>
    <td class="price-col">₹${price}</td>

    <td class="quantity-col">
        <div class="cart-product-quantity">
            <input type="number" class="form-control" value="${quantity}" min="1" max="10"
                step="1" data-decimals="0" required>
        </div><!-- End .cart-product-quantity -->
    </td>

    <td class="total-col">₹${quantity * (price - discount)}</td>

    <td class="remove-col">
    <button class="btn-remove"><i class="icon-close"></i></button>
    </td>
</tr>`
}


function insertElements() {
    let table_rows = "";
    cart_products.forEach(product => table_rows += cart_product_temp(product))
    console.log(table_rows);
    products.innerHTML = table_rows;
}

insertElements();

function getShipping(e) {
    console.log(e.target.id);
}