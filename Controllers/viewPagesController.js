const express = require('express');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');

// Require the functions middleware
const functions = require('../Functions/functions');

// Middleware to restrict users from accesing the site before launch
// router.use(verifyToken.verifyToken);

// Route for the home page
router.get('/', (req, res)=>{
    res.render('index');
});

// Route to purchase coupon code
router.get('/coupon-code/purchase', async (req, res)=>{
    // Get all vendors
    const vendors = await functions.getVendors();

    // Shuffle the arraynof vendors
    const shuffledArray = functions.shuffleArray(vendors);
    console.log('Shuffled Array: ', shuffledArray);
    
    res.render('buy-coupon-code', {vendors: shuffledArray});
});

// Route to verify coupon code
router.get('/coupon-code/verify', (req, res)=>{
    res.render('verify-coupon');
});

// Route for top earners
router.get('/top-earners', (req, res)=>{
    // Get the top earners
    connection.query(`SELECT u.username, u.display_image, SUM(t.amount) AS total_amount FROM affiliate_transactions t JOIN users u ON t.user_id = u.user_id WHERE t.type = 'CREDIT' GROUP BY u.username, u.user_id ORDER BY	total_amount DESC LIMIT 15`, (err, result)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('Result: ', result);
            res.render('top-earners', {earners: result});
        }
    });
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


// Route for coupon code verification
router.post('/coupon-code/result', (req, res)=>{
    const coupon = req.body.coupon;
    console.log(req.body);
    

    // Check if the coupon is valid
    connection.query('SELECT * FROM registeration_tokens WHERE token = ?', coupon, (err, result)=>{
        if (err) {
            console.log(err);
            
        } else{
            console.log('Coupon Info: ', result);

            // Get the username of the user with inner join
            connection.query('SELECT * FROM users INNER JOIN registeration_tokens ON users.user_id = registeration_tokens.user_id WHERE token = ?', coupon, (err, info)=>{
                if (err) {
                    console.log(err);
                } else{
                    console.log('Info: ', info);
                    if (info.length > 0) {

                        // Check if the user has an upline
                        if (info[0].referrer) {
                            // Get the upline of the person that used the coupon code
                            connection.query('SELECT username FROM users WHERE referral_code = ?', info[0].referrer, (err, upline)=>{
                                if (err) {
                                    console.log(err);
                                } else{
                                    if (upline.length > 0) {
                                        info[0].upline = upline[0].username;   
                                    }
                                    console.log('Info: ', info);
                                    res.render('coupon-verification-result', {coupon: result, info});
                                }
                            });
                        } else{
                            console.log('Info: ', info);
                            res.render('coupon-verification-result', {coupon: result, info});
                        }
                    } else{
                        console.log('Info: ', info);
                        res.render('coupon-verification-result', {coupon: result, info});
                    }
                }
            });
        }
    });
});



module.exports = router;
  