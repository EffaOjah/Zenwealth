const express = require('express');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

// Middleware to restrict users from accesing the site before launch
// router.use(verifyToken.verifyToken);

// Route for the home page
router.get('/', (req, res)=>{
    res.render('index');
});

// Route to purchase coupon code
router.get('/coupon-code/purchase', (req, res)=>{
    res.render('buy-coupon-code');
});

// Route to verify coupon code
router.get('/coupon-code/verify', (req, res)=>{
    res.render('verify-coupon');
});

// Route for top earners
router.get('/top-earners', (req, res)=>{
    res.render('top-earners');
});

// Route for about page
router.get('/about', (req, res)=>{
    res.render('about');
});

// Route for zenwealth posts
router.get('/blog', (req, res)=>{
    res.render('zenwealth-posts');
});

// Route for policy
router.get('/policy', (req, res)=>{
    res.render('policy');
});

module.exports = router;
  