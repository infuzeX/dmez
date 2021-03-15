const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require("./utils/appError");
//controller modules
const globalErrorHandler = require('./controller/errorController');
const pages = require('./route/pages');
const checkoutRoutes = require('./route/api/checkoutRoute');
const orderRoutes = require('./route/api/orderRoute');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.disable("x-powered-by");

app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use('/', pages);
//global error handler in development
app.all("*", (req, res, next) => next(new AppError(`requested  url ${req.originalUrl} not found`, 404)));

app.use(globalErrorHandler);

module.exports = app;