const express = require('express');
const cookieParser = require('cookie-parser');
const pages = require('./controller/pageController');

const app = express();

app.use(cookieParser());
app.use('/public', express.static('public'))
app.use('/', pages);

module.exports = app;