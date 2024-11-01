const express = require('express');

const router = express.Router();

const md5 = require('md5');

// Require the functions middleware
const functions = require('../Functions/functions');

const checkUser = require('../Functions/validate');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');


// Route to get user balances
router.get('/loadBalances', verifyToken.verifyToken, async(req, res)=>{
    try {
       // Fetch user details using username
       const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username); 

       // Create the user's affiliate balance view
       const createAffiliateBalanceView = await dashboardFunctions.createAffiliateBalanceView(fetchUserByUsername[0].user_id);

       // Get the user's total affiliate balance view
       const getTotalAffiliateBalanceView = await dashboardFunctions.getTotalAffiliateBalanceView();

       // Get the user's total direct referral balance
       const getTotalDirectReferralBalance = await dashboardFunctions.getTotalReferralBalanceView('Direct Referral');

       // Get the user's total indirect referral balance
       const getTotalIndirectReferralBalance = await dashboardFunctions.getTotalReferralBalanceView('InDirect Referral');

       // Create the user's zenpoints view
       const createZenpointsView = await dashboardFunctions.createZenpointsView(fetchUserByUsername[0].user_id);

       // Get the user's total zenpoints view
       const getTotalZenPointsView = await dashboardFunctions.getTotalZenPointsView();

       // Create the user's zencoins view
       const createZenCoinsView = await dashboardFunctions.createZenCoinsView(fetchUserByUsername[0].user_id);

       // Get the user's total zencoins view
       const getTotalZenCoinsView = await dashboardFunctions.getTotalZenCoinsView();

       res.status(200).json({getTotalAffiliateBalanceView, getTotalDirectReferralBalance, getTotalIndirectReferralBalance, getTotalZenPointsView, getTotalZenCoinsView})
    } catch (error) {
        console.log('Error: ', error);
        res.status(404).json(error);
    }
});

// Get the dashboard page
router.get('/user/dashboard', verifyToken.verifyToken, async(req, res)=>{
    console.log('req.user: ', req.user);

    try {
       // Fetch user details using username
       const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

       // Get the user's referrals
       const getReferrals = await dashboardFunctions.getReferrals(fetchUserByUsername[0].referral_code);

       // Get the user's total withdrawal
       const getTotalWithdrawal = await dashboardFunctions.getTotalWithdrawal(fetchUserByUsername[0].user_id);

       res.render('user-dashboard', {user: fetchUserByUsername[0], referrals: getReferrals[0].referrals, totalWithdrawal: getTotalWithdrawal[0].totalWithdrawal});

    } catch (error) {
        console.log(error);
    }
});

// Route for the withdrawals history page
router.get('/history/withdrawals', verifyToken.verifyToken, async(req, res)=>{
    console.log('withdrawals: ', req.user);

    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the user's withdrawal history
    connection.query('SELECT * FROM withdrawals WHERE user_id = ?', fetchUserByUsername[0].user_id, (err, withdrawals)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('withdrawals: ', withdrawals);
            res.render('withdrawals-history', {user: fetchUserByUsername[0], withdrawals});
        }
    })
});

// Route for the product upload page
router.get('/product/upload', verifyToken.verifyToken, (req, res)=>{
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('user: ', user[0]);
            res.render('upload-product', {user: user[0]});
        }
    })
});

// Route for the p2p-registration page
router.get('/registration/p2p', verifyToken.verifyToken, (req, res)=>{
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('user: ', user[0]);
            res.render('p2p-registration', {user: user[0]});
        }
    })
});

// Route for the Earning History page
router.get('/history/earnings', verifyToken.verifyToken, (req, res)=>{
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('user: ', user[0]);

            // Get the user's earning history
            connection.query('SELECT * FROM earning_history WHERE user_id = ? ORDER BY id DESC', user[0].user_id, (err, earnings)=>{
                if (err) {
                    console.log(err);
                } else{
                    console.log(earnings);
                    res.render('earning-history', {user: user[0], earnings});
                }
            });
        }
    });
});

// Route for the downlines page
router.get('/downlines', verifyToken.verifyToken, async(req, res)=>{
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // get the user's downlines
    connection.query('SELECT username FROM users WHERE referrer = ?', fetchUserByUsername[0].referral_code, (err, downlines)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('Downlines: ', downlines);
            res.render('downlines', {user: fetchUserByUsername[0], downlines});
        }
    })
});

// Route for the user profile page
router.get('/user/profile', verifyToken.verifyToken, (req, res)=>{
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('user: ', user[0]);
            res.render('update-profile', {user: user[0]});
        }
    })
});

// Route for the place withdrawal page
router.get('/withdraw', verifyToken.verifyToken, async(req, res)=>{
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    res.render('submit-withdrawal', {user: fetchUserByUsername[0]});
});

// Route for user bank details page
router.get('/user/bank-details', verifyToken.verifyToken, (req, res)=>{
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('user: ', user[0]);
            res.render('update-bank-details', {user: user[0]});
        }
    });
});

// Route for the set pin page
router.get('/user/set-pin', verifyToken.verifyToken, async(req, res)=>{
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    res.render('set-pin', {user: fetchUserByUsername[0]});
});

// Route for youtube earning page
router.get('/youtube-earning', verifyToken.verifyToken, (req, res)=>{
    res.render('youtube-earning');
});

// POST ROUTES
// Route for p2p-registration
router.post('/p2p', verifyToken.verifyToken, async (req, res)=>{
    const {firstName, lastName, username, phoneNo, email, password, passwordConfirmation} = req.body;
    console.log('req.body: ', req.body);
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, async (err, result)=>{
        if (err) {
            console.log(err);
        } else{
            console.log(result[0]);

            const loggedInUser = result[0];
            const balance = loggedInUser.total_activities_balance;
            try {
            // First Make sure there is no empty field
            if(!firstName || !lastName || !username || !phoneNo || !email || !password || !passwordConfirmation){
            console.log('Please provide all fields');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Please provide all fields', messageStyle: 'show', messageColor: 'danger'});
            }
        
            // check the user's balance
            if (balance < 5000) {
            console.log('Insufficient Account Balance');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Insufficient Account Balance', messageStyle: 'show', messageColor: 'danger'});
            }
        
            // Check password length
            if (password.length < 8) {
            console.log('Password must be 8 characters or more');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Password must be 8 characters or more', messageStyle: 'show', messageColor: 'danger'});
            }
        
            // Check if passwords match
            if (password !== passwordConfirmation) {
            console.log('Passwords do not match');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Passwords do not match', messageStyle: 'show', messageColor: 'danger'});
            }
        
        
            // Now check if username already exist
            const checkTheUsername = await functions.checkUsername(username);
            if (checkTheUsername.length > 0) {
            console.log('Username has already been used');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Username has already been used', messageStyle: 'show', messageColor: 'danger'});
            }
        
        
            // Now check if username already exist
            const checkTheEmail = await functions.checkEmail(email);
            if (checkTheEmail.length > 0) {
            console.log('Email has already been used');
            return res.render('p2p-registration', {user: loggedInUser, message: 'Email has already been used', messageStyle: 'show', messageColor: 'danger'});
            }
        
            console.log('Validation passed');
        
        
            // Now create the user
            const createTheUser = await functions.createUserp2P(firstName, lastName, username, phoneNo, email, password, functions.generateReferralCode(username))
        
            const newUserId = await createTheUser.insertId;
            console.log(newUserId);
            
            // After registering the new person, debit the user
            const debitTheUser = await functions.debitUser(loggedInUser.user_id);
        
            // Then credit the newly registered user the welcome bonus
            const creditNewUser = await functions.creditNewUser(newUserId);
            console.log(creditNewUser);


            return res.render('p2p-registration', {user: loggedInUser, message: 'Successfully created the user', messageStyle: 'show', messageColor: 'success'});
            } catch (error) {
            console.log('Internal Server Error: ', error);
            return res.render('p2p-registration', {user: loggedInUser, message: 'Internal Server Error', messageStyle: 'show', messageColor: 'danger'});
            }
                }
    })
});

  // POST route to update bank details
  router.post('/update-bank-details', verifyToken.verifyToken, async(req, res)=>{
    console.log(req.body);

    const {userId, bank, accountName, accountNumber} = req.body;

    let split = bank.split('-');
   
    const bankDetails = {
        bankName: split[0],
        bankCode: split[1]
    };

    console.log(bankDetails);
    
    // update bank details
    connection.query('UPDATE users SET account_number = ?, account_name = ?, bank_name = ?, bank_code = ? WHERE user_id = ?', [accountNumber, accountName, bankDetails.bankName, bankDetails.bankCode, userId], async(err)=>{
        if (err) {
            console.log(err);

            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            res.render('update-bank-details', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'error updating bank details', alertColor: 'red'});
        } else{
            console.log('Successfully updated bank details');

            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            res.render('update-bank-details', {user: fetchUserByUsername[0], alertTitle: 'Success: ', alertMessage: 'successfully updated bank details', alertColor: 'green'});
        }
    })
  });

  // POST route to place withdrawal
  router.post('/submit-withdrawal', verifyToken.verifyToken, async(req, res)=>{
    const {withdrawalType, amount, pin} = req.body;
    console.log('Withdrawal details :', req.body);
    
    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Create the user's affiliate balance view
        const createAffiliateBalanceView = await dashboardFunctions.createAffiliateBalanceView(fetchUserByUsername[0].user_id);

        // Get the user's total affiliate balance view
        const getTotalAffiliateBalanceView = await dashboardFunctions.getTotalAffiliateBalanceView();

        // Create the user's zenpoints view
        const createZenpointsView = await dashboardFunctions.createZenpointsView(fetchUserByUsername[0].user_id);

        // Get the user's total zenpoints view
        const getTotalZenPointsView = await dashboardFunctions.getTotalZenPointsView();

        // Create the user's zencoins view
        const createZenCoinsView = await dashboardFunctions.createZenCoinsView(fetchUserByUsername[0].user_id);

        // Get the user's total zencoins view
        const getTotalZenCoinsView = await dashboardFunctions.getTotalZenCoinsView();


        // Check if user has updated his/her bank details
        if (!fetchUserByUsername[0].account_number || !fetchUserByUsername[0].account_name || !fetchUserByUsername[0].bank_name || !fetchUserByUsername[0].bank_code) {
            console.log('Please update bank details');
            return res.status(200).json({error: 'Please update bank details'});
        } 
    
        // Check if user has set pin
        if (!fetchUserByUsername[0].withdrawal_pin) {
            console.log('Please set pin');
            return res.status(200).json({error: 'Please set pin'});
        }

        // Check withdrawal type
        if (withdrawalType == 'affiliate') {
            // Perform operations for affiliate withdrawal
            
            // Ensure that affiliate withdrawal is 8000 and above
            if ((amount * 1000) < 8000) {
                console.log('Affiliate withdrawal must be 8000 and above');
                return res.status(404).json({error: 'Affiliate withdrawal must be $8 and above'});
            }

            // Check if user balance is up to 8000
            if (getTotalAffiliateBalanceView[0].affiliateBalance < 8000) {
                console.log('Insufficient Balance');
                return res.status(404).json({error: 'Insufficient Balance'});
            }

            // Ensure that withdrawal affiliate amount is not more than user's balance
            if ((amount * 1000) > getTotalAffiliateBalanceView[0].affiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.status(404).json({error: 'Insufficient Balance'});
            }

            // Check if pin is correct
            if(md5(pin) !== fetchUserByUsername[0].withdrawal_pin){
                console.log('Incorrect pin');
                return res.status(404).json({error: 'Incorrect pin'});
            }

            // Insert into the affiliate transactions table
            const insertIntoAffiliateTransactions = await dashboardFunctions.insertIntoAffiliateTransactions(`${-(amount * 1000)}`, 'Affiliate Withdrawal', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1000), 'Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of $${amount}`);
            return res.status(200).json({success: `Successfully placed withdrawal of $${amount}`});
        } else if (withdrawalType == 'earnings') {
            // Perform operations for earnings withdrawal

            // Ensure that earnings withdrawal is 45000 and above
            if (amount < 45000) {
                console.log('Earnings withdrawal must be 45000 or above');
                return res.status(404).json({error: 'Earnings withdrawal must be 45000 and above'});
            }

            // Check if user balance is up to 45000
            if (getTotalZenPointsView[0].nonAffiliateBalance < 45000) {
                console.log('Insufficient Balance');
                return res.status(404).json({error: 'Insufficient Balance'});
            }

            // Ensure that earnings affiliate amount is not more than user's balance
            if (amount > getTotalZenPointsView[0].nonAffiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.status(404).json({error: 'You cannot withdraw more than your affiliate balance'});
            }

            // Check if pin is correct
            if(md5(pin) !== fetchUserByUsername[0].withdrawal_pin){
                console.log('Incorrect pin');
                return res.status(404).json({error: 'Incorrect pin'});
            }

            // Insert into the affiliate transactions table
            const insertIntoNonAffiliateTransactions = await dashboardFunctions.insertIntoNonAffiliateTransactions(`${-(amount)}`, 'Non Affiliate Withdrawal', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1000), 'Non Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of ${amount}ZP`);
            return res.status(200).json({success: `Successfully placed withdrawal of ${amount}ZP`});
        } else{
            console.log('Invalid Withdrawal type');
            return res.status(404).json({error: 'Invalid Withdrawal type'});
        }
    } catch (error) {
        console.log('Internal server error: ', error);
        return res.status(503).json({error: 'Internal server error'});
    }
  });
  
  // POST route to update withdrawal pin
  router.post('/set-pin', verifyToken.verifyToken, async(req, res)=>{
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    console.log(req.body);

    const {userId, pin} = req.body;
    
    // update withdrawal pin
    connection.query('UPDATE users SET withdrawal_pin = ? WHERE user_id = ?', [md5(pin), userId], async(err)=>{
        if (err) {
            console.log(err);

            res.render('set-pin', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'error updating bank details', alertColor: 'red'});
        } else{
            console.log('Successfully updated withdrawal pin');
           
            res.render('set-pin', {user: fetchUserByUsername[0], alertTitle: 'Success: ', alertMessage: 'successfully updated withdrawal pin', alertColor: 'green'});
        }
    })
  });

// POST route to update profile
router.post('/update-profile', verifyToken.verifyToken, async(req, res)=>{
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    console.log(req.body);
    const {userId, firstName, lastName, email, currentPassword, newPassword, confirmPassword} = req.body;

    // Make sure every data was sent
    if (!firstName || !lastName || !email || !currentPassword || !newPassword || !confirmPassword) {
        console.log('Please provide all details');

        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'Please provide all details', alertColor: 'red'});
    }

    // Check if current password is correct
    if (fetchUserByUsername[0].password !== md5(currentPassword)) {
        console.log('Incorrect Password');
        
        return res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'Incorrect Password', alertColor: 'red'});
    }

    // Check if the two new password matches
    if (newPassword !== confirmPassword) {
        console.log('New passwords dont match');
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'New Passwords do not match', alertColor: 'red'});
    }

    // Check if password is 8 characters or above
    if (newPassword.length < 8) {
        console.log('Password must be 8 characters or above');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'Password must be 8 characters or above', alertColor: 'red'});
    }

    // If every check has been performed
    // Update the database
    connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE user_id = ?', [firstName, lastName, email, md5(newPassword), fetchUserByUsername[0].user_id], (err)=>{
        if (err) {
            console.log('Error updating the user profile: ', err);
            res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Error: ', alertMessage: 'Internal server error', alertColor: 'red'});
        } else{
            console.log('Successfully updated profile');
            res.render('update-profile', {user: fetchUserByUsername[0], alertTitle: 'Success: ', alertMessage: 'Successfully updated profile', alertColor: 'green'});
        }
    });
});

// POST route to confirm youtube video code
router.post('/youtube-reward', verifyToken.verifyToken, async(req, res)=>{
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const videoCode = req.body.code;

    // Check if user has already completed yt task
    if (fetchUserByUsername[0].has_completed_yt_reward == true) {
        console.log('User has already gotten youtube reward');
        return res.json({error: 'You have already completed this task'});
    }

    // Check if code was provided
    if(!videoCode){
        console.log('Please provide a code');
        return res.json({error: 'Code not provided'});
    }
    console.log(videoCode);

    // Get correct video code from the database
    const correctVideoCode = await dashboardFunctions.getYoutubeVideoCode();
    

    // Check if the code provided is correct
    if (videoCode === correctVideoCode) {
        console.log('Video Code is correct.');

        // Insert into the activity transactions table
        const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(600, 'Youtube Earning', fetchUserByUsername[0].user_id);

        // Update the user's has_completed_yt_reward column to true
        const updateYtStatus = await dashboardFunctions.updateYtStatus(true, fetchUserByUsername[0].user_id);
        return res.json({success: 'Video Code is correct'});
    } else{
        console.log('Video Code is not correct');
        return res.json({error: 'Video Code is not correct'});
    }
});


module.exports = router;