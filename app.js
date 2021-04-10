const express = require('express');
const cookieParser = require('cookie-parser');
//SECURITY MODULES
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
//UTILITY MODULES
const AppError = require("./utils/appError");
//CONTROLLERS
const globalErrorHandler = require('./controller/errorController');
//PAGE ROUTES
const pages = require('./route/pages');
//API ROUTES
const productRoutes = require('./route/api/productRoute');
const formRoutes = require('./route/api/formRoute');
const authRoutes = require('./route/api/authRoute');
const userRoutes = require('./route/api/userRoute');
const cartRoutes = require('./route/api/cartRoute');
const checkoutRoutes = require('./route/api/checkoutRoute');
const orderRoutes = require('./route/api/orderRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//security middleware
app.disable("x-powered-by");
app.use(hpp())
app.use(mongoSanitize())
app.use(xss())

//static file config
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

//mounting sub app
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/forms', formRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use('/', pages);

//global error handler in development
app.all("*", (req, res, next) => next(new AppError(`requested  url ${req.originalUrl} not found`, 404)));

app.use(globalErrorHandler);

module.exports = app;