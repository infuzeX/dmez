const status = document.querySelector('.status');

function showStatus(data) {
 
    const color = {
        'success': "green",
        'fail': "brown",
        'error': "brown"
    }[data.status];

    status.style.backgroundColor = color;
    status.children[0].textContent = data.message;
    status.classList.add('status-up');
}

function closeStatus() {
    status.classList.remove('status-up');
    status.children[0].textContent = ""
}

function showEmpty(el, bool, message) {
    if (bool) {
        el.classList.remove('nothing')
        el.classList.add('products')
        el.innerHTML = "";
    } else {
        el.classList.add('nothing');
        el.classList.remove('products')
        el.innerHTML = `<p>${message}</p>`;
    }
}

function handleLoader(loader, msg) {
    loader.classList.toggle('cart-active');
    loader.innerHTML = `<p style="font-size:1.2rem !important;">${msg}</p>`
}

function closeLoader(loader){
    loader.classList.remove('cart-active');
}