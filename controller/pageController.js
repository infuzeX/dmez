const path = require("path");

exports.renderStaticPage = (res, page) => {
    const file = path.resolve(`public/${page}`);
    return res.sendFile(file);
}