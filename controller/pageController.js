const path = require("path");
const pages = {
    //urlname:htmlfile
}

exports.renderStaticPage = (req, res) => {
    const page = pages[req.originalUrl] || '404.html';
    const file = path.resolve(`public/${page}`);
    res.sendFile(file);
}