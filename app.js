const express = require('express');
const cookieParser = require('cookie-parser');
const pages = require('./route/pages');
//controller modules
const globalErrorHandler = require('./controller/errorController');
const app = express();
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.disable("x-powered-by");

app.use('/', pages);
//global error handler in development
app.all("*", (req, res, next) => next(new AppError(`requested  url ${req.originalUrl} not found`, 404)));

app.use(globalErrorHandler);

module.exports = app;