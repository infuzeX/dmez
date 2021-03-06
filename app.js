const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require("./utils/appError");
//controller modules
const globalErrorHandler = require('./controller/errorController');
const pages = require('./route/pages');
const checkoutRoutes = require('./route/api/checkoutRoute');

const app = express();

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.disable("x-powered-by");

app.use('/', pages);

app.use('/api/v1/checkout', checkoutRoutes);
//global error handler in development
app.all("*", (req, res, next) => next(new AppError(`requested  url ${req.originalUrl} not found`, 404)));

app.use(globalErrorHandler);

module.exports = app;