require('dotenv').config();
const express = require('express');
const session = require('express-session');
const moment = require('moment');
const md5 = require('md5');
const router = express.Router();

// Require sql connection
const connection = require('../db/db');

// Require JWT middleware
const jwt = require('../Functions/jwt');

// Require verify token middleware
const verifyToken = require('../Functions/verifyToken');

// Require the functions middleware
const functions = require('../Functions/functions');

const registrationProcesses = require('../Functions/registrationprocesses');

// REGISTER ROUTE (METHOD: GET)
router.get('/user/register', (req, res)=>{
    res.render('signup');
});

// LOGIN ROUTE (METHOD: GET)
router.get('/user/login', (req, res)=>{
    res.render('login');
});


// REGISTER ROUTE (METHOD: POST)
router.post('/register', async (req, res)=>{
    console.log('registration details: ', req.body);
    const {firstName, lastName, username, email, phone, country, coupon, password, passwordConfirmation, referrer} = req.body;

    try {
            // First, make sure that there's no null field
        if (!firstName || !lastName || !username || !email || !phone || !country || !coupon || !password || !passwordConfirmation) {
            console.log('Please provide all details');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Please Provide all details', alertColor: 'red'});
        }

        // Check if email is valid
        if (!functions.validateEmail(email)) {
            console.log('Please insert valid email');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Please insert valid email', alertColor: 'red'});
        }

        // Check that the password is not less than 8 characters
        if (password.length < 8) {
            console.log('Password must be 8 characters or above');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Password must be 8 characters or above', alertColor: 'red'});
        }

        // Check if the password match
        if (password !== passwordConfirmation) {
            console.log('Passwords do not match');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Passwords do not match', alertColor: 'red'});
        }

        // Check if email exists
        const checkEmail = await functions.checkEmail(email);
        console.log(checkEmail);
        
        if (checkEmail.length > 0) {
            console.log('Email has already been used by another user');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Email has already been used by another user', alertColor: 'red'});
        }

        // Check if username exists
        const checkUsername = await functions.checkUsername(username);
        console.log(username);
        
        if (checkUsername.length > 0) {
            console.log('Username has already been used by another user');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'Username has already been used by another user', alertColor: 'red'});
        }

        // Check if coupon code is valid for the selected country
        if (country !== coupon.slice(0, 3)) {
            console.log('This coupon code is not for your country');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'This coupon code is not for your country', alertColor: 'red'});
        }

        // Check if coupon code is valid
        const checkCoupon = await functions.checkCoupon(coupon);
        console.log(checkCoupon);
        
        if (checkCoupon.length < 1) {
            console.log('Please insert a valid coupon code');
            return res.render('signup', {alertTitle: 'Error', alertMessage: 'TPlease insert a valid coupon code', alertColor: 'red'});
        }

        // Check if there's a referral code
        if (referrer == '') {
            console.log('No referral code provided');

            // Now insert the user's details into the users table
            const createUnreferredUser = await functions.createUnreferredUser(res, firstName, lastName, email, username, phone, password, functions.generateReferralCode(username), coupon);

             /* Finish up the registration 
            Then authenticate the user */

             // Generate the JWT
             const generateJwt = await jwt.generateJwt(username);

             const currentDate = moment().format('YYYY-MM-DD');
             console.log(currentDate);

             // Update the last login date of the user
             const updateLastLoginDate = await functions.updateLastLoginDate(currentDate, createUnreferredUser.insertId);

             // Set the cookie
             const setCookie = await jwt.setCookie(res, generateJwt);

             res.redirect('/user/dashboard');

            console.log('You have successfully passed through all the registration process');

        } else{
            // Check if referral code is valid
            const checkReferralCode = await registrationProcesses.getReferrer(referrer);

            if (checkReferralCode.length < 1) {
                console.log('Invalid referral code');
                return res.render('signup', {alertTitle: 'Error', alertMessage: 'Invalid referral code', alertColor: 'red'});
            }

            // Now insert the user's details into the users table
            const createReferredUser = await functions.createReferredUser(res, firstName, lastName, email, username, phone, password, functions.generateReferralCode(username), referrer, coupon);

            // Run the crediting process of the uplines
            // Credit direct referral
            const creditDirectReferral = await functions.creditDirectReferral(res, referrer);

            // Check if the referrer also has a referrer
            if (creditDirectReferral[0].referrer) {
                // Credit first indirect referral
                const creditFirstIndirectReferral = await functions.creditFirstIndirectReferral(res, creditDirectReferral[0].referrer);

                // Check if the referrer's referrer also has a referrer
                if (creditFirstIndirectReferral[0].referrer) {
                    // Credit second indirect referral
                    const creditSecondIndirectReferral = await functions.creditSecondIndirectReferral(res, creditFirstIndirectReferral[0].referrer);

                     /* Finish up the registration 
                    Then authenticate the user */

                    // Generate the JWT
                    const generateJwt = await jwt.generateJwt(username);

                    // Set the cookie
                    const setCookie = await jwt.setCookie(res, generateJwt);

                    const currentDate = moment().format('YYYY-MM-DD');
                    console.log(currentDate);

                    // Update the last login date of the user
                    const updateLastLoginDate = await functions.updateLastLoginDate(currentDate, createReferredUser.insertId);

                    res.redirect('/user/dashboard');

                    console.log('You have successfully passed through all the registration process');
                } else{
                    console.log("Referrer's referrer does not have a referrer");
                    /* Finish up the registration 
                    Then authenticate the user */

                     // Generate the JWT
                     const generateJwt = await jwt.generateJwt(username);

                     // Set the cookie
                     const setCookie = await jwt.setCookie(res, generateJwt);
 
                     const currentDate = moment().format('YYYY-MM-DD');
                     console.log(currentDate);

                     // Update the last login date of the user
                     const updateLastLoginDate = await functions.updateLastLoginDate(currentDate, createReferredUser.insertId);

                     res.redirect('/user/dashboard');

                    console.log('You have successfully passed through all the registration process');
                }
            } else{
                console.log('User does not have a referrer');
                /* Finish up the registration 
                Then authenticate the user */

                 // Generate the JWT
                 const generateJwt = await jwt.generateJwt(username);

                 // Set the cookie
                 const setCookie = await jwt.setCookie(res, generateJwt);

                 const currentDate = moment().format('YYYY-MM-DD');
                    console.log(currentDate);

                 // Update the last login date of the user
                 const updateLastLoginDate = await functions.updateLastLoginDate(currentDate, createReferredUser.insertId);

                 res.redirect('/user/dashboard');

                console.log('You have successfully passed through all the registration process');
            }
        }
    } catch (error) {
        console.log('An error occurred: ', error);
        return res.render('signup', {alertTitle: 'Error', alertMessage: 'An error occurred', alertColor: 'red'});
    }
});


// LOGIN ROUTE (METHOD: POST)
router.post('/login', (req, res)=>{
    const ip = req.socket.remoteAddress;
    console.log('User IP address:', ip);
    console.log(req.body);

    const {username, password} = req.body

    // Query to check the user's details in the database
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, md5(password)], async (err, result)=>{
        if (err) {
            console.log(err);
            return res.render('login', {alertTitle: 'Error', alertMessage: 'Internal server error', alertColor: 'red'});
        } else {
            console.log(result[0]);
            if (result.length < 1) {
                console.log('Invalid login credentials');
                return res.render('login', {alertTitle: 'Error', alertMessage: 'Invalid login credentials', alertColor: 'red'});
            } else{
                console.log('Login Successful');

                 // Generate the JWT
                 const generateJwt = await jwt.generateJwt(username);

                 // Set the cookie
                 const setCookie = await jwt.setCookie(res, generateJwt);

                 // Now credit the user for daily bonus

                 const currentDate = moment().format('YYYY-MM-DD');
                 console.log(currentDate);

                 // First check if the user has already logged in
                 const checkDate = await functions.checkDate(result[0].user_id);
    
                 if (checkDate === currentDate) {
                    console.log('You have already logged in today');
                 } else {
                    console.log('You are eligible for the bonus');

                    // Update the last login date of the user
                    const updateLastLoginDate = await functions.updateLastLoginDate(currentDate, result[0].user_id);

                    // Now credit the user
                    const creditLoginBonus = await functions.creditLoginBonus(result[0].user_id)
                 }
                 res.redirect('/user/dashboard');
            }          
        }
    });
});



// ADMIN LOGIN
router.get('/zenwealth-admin/login', (req, res)=>{
    // res.send('Admin Login');
    res.render('Admin Login');
});

router.post('/admin-login', (req, res)=>{
    const {username, password} = req.body;
    console.log(req.body);
    
    // Check if details are correct
    connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], async (err, result)=>{
        if (err) {
            console.log(err);
            return res.render('Admin Login', {alertTitle: 'Error', alertMessage: 'An error occurred', alertColor: 'red'});
        } else {
            console.log('Admin details: ', result);

            if (result.length < 1) {
                console.log('Invalid credentials');
                return res.render('Admin Login', {alertTitle: 'Error', alertMessage: 'Invalid credentials', alertColor: 'red'});
            }

            // Generate the JWT
            const generateJwt = await jwt.generateJwt(username);

            // Set the cookie
            const setCookie = await jwt.setAdminCookie(res, generateJwt);

            res.redirect('/admin/dashboard');
        }
    })
});



router.get('/logout', (req, res)=>{
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
});

module.exports = router;