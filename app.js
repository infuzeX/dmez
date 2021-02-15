const express = require('express');
const cookieParser = require('cookie-parser');
const pages = require('./route/pages');

const app = express();

app.use(cookieParser());
app.use('/public', express.static('public'))
app.use('/', pages);

module.exports = app;