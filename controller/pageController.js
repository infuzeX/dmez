const path = require("path");
const pages = {
    //urlname:htmlfile
    "/":"index.html",
    "/products": "shop.html"
}

exports.renderStaticPage = (req, res) => {
    let page = pages[req.originalUrl];
    if(!page) {
       page = req.originalUrl.startsWith('/products') ? 'product.html':'404.html';
    }
    const file = path.resolve(`public/${page}`);
    res.sendFile(file);
}