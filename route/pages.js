const router = require("express").Router();

const { verifyToken, preventPageAccess } = require("../controller/authController");
const { verifyOrder } = require('../controller/checkController');
const { renderStaticPage } = require("../controller/pageController");

router.get('/login', (req, res) => renderStaticPage(res, 'login.html'));
router.get('/register', (req, res) => renderStaticPage(res, 'register.html'));

router.get('/', (req, res) => renderStaticPage(res, 'index.html'));
router.get('/home', (req, res) => renderStaticPage(res, 'home.html'));

router.get('/products', (req, res) => renderStaticPage(res, 'shop.html'));
router.get('/products/:id', (req, res) => renderStaticPage(res, 'product.html'));

//PROTECTED ROUTES
router.get('/cart', (req, res) => renderStaticPage(res, 'cart.html'));

router.get('/checkout', verifyOrder, (req, res) => {
    const data = JSON.stringify(req.order)
    res.cookie('order', data, {
        secure:true,
        domain: 'https://herokuapp.com',
        httpOnly: true,
        path: '/',
        sameSite:"none"
    })
    renderStaticPage(res, 'checkout.html')
});

router.get('/account', (req, res) => renderStaticPage(res, 'account.html'));

router.get('/account/info', (req, res) => renderStaticPage(res, 'setting.html'));

router.get('/account/info/name', (req, res) => renderStaticPage(res, 'name.html'));
router.get('/account/info/email', (req, res) => renderStaticPage(res, 'email.html'));
router.get('/account/info/number', (req, res) => renderStaticPage(res, 'number.html'));
router.get('/account/info/contact', (req, res) => renderStaticPage(res, 'contact.html'));
router.get('/account/info/password', (req, res) => renderStaticPage(res, 'password.html'));

router.get('/account/orders', (req, res) => renderStaticPage(res, 'order.html'));

router.get('/account/address', (req, res) => renderStaticPage(res, 'address.html'));
router.get('/account/address/edit', (req, res) => renderStaticPage(res, 'newaddress.html'));

router.get('*', (req, res) => renderStaticPage(res, '404.html'));

module.exports = router;