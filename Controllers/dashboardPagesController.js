const express = require('express');
const session = require('express-session');

const router = express.Router();

// Set up session middleware
router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const md5 = require('md5');

// Require the functions middleware
const functions = require('../Functions/functions');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');


// Route to get user balances
router.get('/loadBalances', verifyToken.verifyToken, async (req, res) => {
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

        res.status(200).json({ getTotalAffiliateBalanceView, getTotalDirectReferralBalance, getTotalIndirectReferralBalance, getTotalZenPointsView, getTotalZenCoinsView })
    } catch (error) {
        console.log('Error: ', error);
        res.status(404).json(error);
    }
});

// Get the dashboard page
router.get('/user/dashboard', verifyToken.verifyToken, async (req, res) => {
    console.log('req.user: ', req.user);

    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Get the user's referrals
        const getReferrals = await dashboardFunctions.getReferrals(fetchUserByUsername[0].referral_code);

        // Get the user's total withdrawal
        const getTotalWithdrawal = await dashboardFunctions.getTotalWithdrawal(fetchUserByUsername[0].user_id);

        // Get the mystery_box setting
        const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

        // Get the user's mystery earnings
        const getMysteryEarnings = await dashboardFunctions.mysteryBoxEarnings(fetchUserByUsername[0].user_id);

        // Get the user's free coupons
        const getFreeCoupons = await dashboardFunctions.freeCoupons(fetchUserByUsername[0].user_id);

        res.render('user-dashboard', { user: fetchUserByUsername[0], referrals: getReferrals[0].referrals, totalWithdrawal: getTotalWithdrawal[0].totalWithdrawal, getMysteryBoxSetting, getMysteryEarnings, getFreeCoupons });

    } catch (error) {
        console.log(error);
    }
});

// Route for the withdrawals history page
router.get('/history/withdrawals', verifyToken.verifyToken, async (req, res) => {
    console.log('withdrawals: ', req.user);

    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's withdrawal history
    connection.query('SELECT * FROM withdrawals WHERE user_id = ?', fetchUserByUsername[0].user_id, (err, withdrawals) => {
        if (err) {
            console.log(err);
        } else {
            console.log('withdrawals: ', withdrawals);
            res.render('withdrawals-history', { user: fetchUserByUsername[0], withdrawals, getMysteryBoxSetting });
        }
    })
});

// Route for the product upload page
router.get('/product/upload', verifyToken.verifyToken, async (req, res) => {
    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log('user: ', user[0]);
            res.render('upload-product', { user: user[0], getMysteryBoxSetting });
        }
    })
});

// Route for the p2p-registration page
router.get('/registration/p2p', verifyToken.verifyToken, async (req, res) => {
    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log('user: ', user[0]);
            res.render('p2p-registration', { user: user[0], getMysteryBoxSetting });
        }
    })
});

// Route for the Earning History page
router.get('/history/earnings', verifyToken.verifyToken, async (req, res) => {
    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log('user: ', user[0]);

            // Get the user's earning history
            connection.query('SELECT * FROM earning_history WHERE user_id = ? ORDER BY id DESC', user[0].user_id, (err, earnings) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(earnings);
                    res.render('earning-history', { user: user[0], earnings, getMysteryBoxSetting });
                }
            });
        }
    });
});

// Route for the downlines page
router.get('/downlines', verifyToken.verifyToken, async (req, res) => {
    // Get the user's details
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // get the user's downlines
    connection.query('SELECT username FROM users WHERE referrer = ?', fetchUserByUsername[0].referral_code, (err, downlines) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Downlines: ', downlines);
            res.render('downlines', { user: fetchUserByUsername[0], downlines, getMysteryBoxSetting });
        }
    })
});

// Route for the user profile page
router.get('/user/profile', verifyToken.verifyToken, async (req, res) => {
    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log('user: ', user[0]);
            res.render('update-profile', { user: user[0], getMysteryBoxSetting });
        }
    })
});

// Route for the place withdrawal page
router.get('/withdraw', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get withdrawal settings
    const getWithdrawalSettings = await dashboardFunctions.getWithdrawalSettings();

    res.render('submit-withdrawal', { user: fetchUserByUsername[0], getMysteryBoxSetting, settings: getWithdrawalSettings });
});

// Route for user bank details page
router.get('/user/bank-details', verifyToken.verifyToken, async (req, res) => {
    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log('user: ', user[0]);
            res.render('update-bank-details', { user: user[0], getMysteryBoxSetting });
        }
    });
});

// Route for the set pin page
router.get('/user/set-pin', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    res.render('set-pin', { user: fetchUserByUsername[0], getMysteryBoxSetting });
});

// Route for youtube earning page
router.get('/youtube-earning', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    // Get Youtube Video
    const getYoutubeVideo = await dashboardFunctions.getYoutubeVideo();

    res.render('youtube-earning', { user: fetchUserByUsername[0], getMysteryBoxSetting, getYoutubeVideo });
});

// Route for task page
router.get('/task', async (req, res) => {
    try {
        // Get all posts
        const getPosts = await dashboardFunctions.getPosts();

        // Get the mystery_box setting
        const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

        res.render('task', { getPosts, getMysteryBoxSetting });
    } catch (error) {
        console.log(error);
    }
});

// Route for post details
router.get('/post/:id', async (req, res) => {
    // Get the post details with the post_id
    const getSinglePost = await dashboardFunctions.getSinglePost(req.params.id);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    res.render('post details', { getSinglePost, getMysteryBoxSetting });
});

// Route to share post
router.get('/share-post', verifyToken.verifyPostToken, async (req, res) => {
    if (req.user) {
        console.log('User is logged in');

        // Get the user's details
        const user = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Check if the user has already been rewarded for the post
        if (user[0].has_shared_post == 1) {
            console.log('User has already been credited');
        } else {
            // Update the has_shared_post
            const updateColumn = await dashboardFunctions.updateHasSharedPostColumn(1, user[0].user_id);

            // Update the credited_task1 column
            const creditedTask1Column = await dashboardFunctions.creditedTask1Column(0, user[0].user_id);

        }

    } else {
        console.log('User is not logged in and will not be credited');
    }
});

// Route to join platform
router.get('/join-platform', verifyToken.verifyPostToken, async (req, res) => {
    if (req.user) {
        console.log('User is logged in');

        // Get the user's details
        const user = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Check if the user has already been rewarded for the post
        if (user[0].has_joined_platform == 1) {
            console.log('User has already been credited');
        } else {
            // Update the has_joined_platform
            const updateColumn = await dashboardFunctions.updateHasJoinedPlatform(1, user[0].user_id);

            // Update the credited_task2 column
            const creditedTask2Column = await dashboardFunctions.creditedTask2Column(0, user[0].user_id);
        }

    } else {
        console.log('User is not logged in and will not be credited');
    }
});

// Route to claim task 1
router.get('/claim-task/:type', verifyToken.verifyToken, async (req, res) => {
    // Get the user's details
    const user = await dashboardFunctions.fetchUserByUsername(req.user.username);

    let type = req.params.type;

    // Check the type of task to claim
    if (type == '1') {
        console.log('Claim task 1');

        // Check if user has already claimed task 1
        if (user[0].credited_task1 == 1) {
            return res.json({ error: 'Task already claimed' });
        }

        // Credit the user
        const creditUser = await dashboardFunctions.insertIntoNonAffiliateTransactions(500, 'Trend Post', 'CREDIT', user[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Trend Post', 500, user[0].user_id);

        // Update the credited_task1 column
        const creditedTask1Column = await dashboardFunctions.creditedTask1Column(1, user[0].user_id);

        return res.json({ success: 'successfully credited the user' });
    } else if (type == '2') {
        console.log('Claim task 2');

        // Check if user has already claimed task 1
        if (user[0].credited_task2 == 1) {
            return res.json({ error: 'Task already claimed' });
        }

        // Credit the user
        const creditUser = await dashboardFunctions.insertIntoNonAffiliateTransactions(300, 'Advert Post', 'CREDIT', user[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Advert Post', 300, user[0].user_id);

        // Update the credited_task2 column
        const creditedTask2Column = await dashboardFunctions.creditedTask2Column(1, user[0].user_id);

        return res.json({ success: 'successfully credited the user' });
    } else if (type == 'all') {
        console.log('Claim all tasks');

        // Check if user has already claimed task 1
        if (user[0].credited_task1 == 1 && user[0].credited_task2 == 1) {
            return res.json({ error: 'Task already claimed' });
        }

        // Credit the user
        const creditTrend = await dashboardFunctions.insertIntoNonAffiliateTransactions(500, 'Trend Post', 'CREDIT', user[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Trend Post', 500, user[0].user_id);

        const creditAdvert = await dashboardFunctions.insertIntoNonAffiliateTransactions(300, 'Advert Post', 'CREDIT', user[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory2 = await functions.insertIntoEarningHistory('Advert Post', 300, user[0].user_id);

        // Update the credited_task1 column
        const creditedTask1Column = await dashboardFunctions.creditedTask1Column(1, user[0].user_id);

        // Update the credited_task2 column
        const creditedTask2Column = await dashboardFunctions.creditedTask2Column(1, user[0].user_id);

        return res.json({ success: 'successfully credited the user' });
    } else {
        console.log('Invalid task type');

        return res.json({ error: 'Invalid task type' });
    }
});

// Route to claim mystery box reward
router.get('/claim-mystery-reward', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Check if the user has already claimed his/her reward
    if (fetchUserByUsername[0].has_claimed_gift == 1) {
        console.log('User has already claimed reward');

        return res.status(500).json({ error: 'Already claimed reward' });
    }

    try {
        // Check the user's reward
        if (fetchUserByUsername[0].mystery_value > 0 && fetchUserByUsername[0].mystery_value < 51) {
            console.log('User is about to claim 100 naira');

            // Insert into the activity transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(100, 'Mystery Box Reward', fetchUserByUsername[0].user_id);

            // Insert into earning history
            const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 100, fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else if (fetchUserByUsername[0].mystery_value > 50 && fetchUserByUsername[0].mystery_value < 71) {
            console.log('User is about to claim 200 naira');

            // Insert into the activity transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(200, 'Mystery Box Reward', fetchUserByUsername[0].user_id);

            // Insert into earning history
            const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 200, fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else if (fetchUserByUsername[0].mystery_value > 70 && fetchUserByUsername[0].mystery_value < 81) {
            console.log('User is about to claim 300 naira');

            // Insert into the activity transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(300, 'Mystery Box Reward', fetchUserByUsername[0].user_id);

            // Insert into earning history
            const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 300, fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else if (fetchUserByUsername[0].mystery_value > 80 && fetchUserByUsername[0].mystery_value < 86) {
            console.log('User is about to claim 400 naira');

            // Insert into the activity transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(400, 'Mystery Box Reward', fetchUserByUsername[0].user_id);

            // Insert into earning history
            const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 400, fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else if (fetchUserByUsername[0].mystery_value > 85 && fetchUserByUsername[0].mystery_value < 91) {
            console.log('User is about to claim 500 naira');

            // Insert into the activity transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(500, 'Mystery Box Reward', fetchUserByUsername[0].user_id);

            // Insert into earning history
            const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 500, fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else if (fetchUserByUsername[0].mystery_value > 90 && fetchUserByUsername[0].mystery_value < 101) {
            console.log('User is about to claim a free coupon code');

            // Generate the free coupon for the user
            const generateFreeCoupon = await functions.generatedFreeCouponCode();

            // Now assign it to the user
            const assignFreeCoupon = await dashboardFunctions.assignFreeCoupon(fetchUserByUsername[0].user_id, generateFreeCoupon);

            // Insert into earning history
            // const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Mystery Box Reward', 'Free Coupon', fetchUserByUsername[0].user_id);

            // Update the has_claimed_gift column of the user to 1
            const updateHasClaimedColumn = await dashboardFunctions.updateHasClaimedColumn(true, fetchUserByUsername[0].user_id);
        } else {
            console.log('Invalid reward type');

            return res.status(500).json({ error: 'Invalid reward type' });
        }

        return res.status(200).json({ message: 'Successfully claimed mystery box reward!' });
    } catch (error) {
        console.log('Internal Server error: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for zen mining
router.get('/zen-mining', verifyToken.verifyToken, async (req, res) => {
    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        const miningBalance = await dashboardFunctions.getUsersMiningBalance(fetchUserByUsername[0].user_id);

        res.render('mining', { user: fetchUserByUsername[0], miningBalance });
    } catch (error) {
        console.log(error);

        res.render('mining', { user: 'null', miningBalance: 'null' });
    }
})

// Route for withdrawal recepit
router.get('/withdrawal-receipt', (req, res) => {
    let withdrawalDetails = session.withdrawalDetails;

    res.render('receipt', { withdrawalDetails });
});


// POST ROUTES
// Route for p2p-registration
router.post('/p2p', verifyToken.verifyToken, async (req, res) => {
    const { firstName, lastName, username, phoneNo, email, password, passwordConfirmation } = req.body;
    console.log('req.body: ', req.body);
    // Get the user's details
    connection.query('SELECT * FROM users WHERE username = ?', req.user.username, async (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result[0]);

            const loggedInUser = result[0];
            const balance = loggedInUser.total_activities_balance;
            try {
                // First Make sure there is no empty field
                if (!firstName || !lastName || !username || !phoneNo || !email || !password || !passwordConfirmation) {
                    console.log('Please provide all fields');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Please provide all fields', messageStyle: 'show', messageColor: 'danger' });
                }

                // check the user's balance
                if (balance < 5000) {
                    console.log('Insufficient Account Balance');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Insufficient Account Balance', messageStyle: 'show', messageColor: 'danger' });
                }

                // Check password length
                if (password.length < 8) {
                    console.log('Password must be 8 characters or more');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Password must be 8 characters or more', messageStyle: 'show', messageColor: 'danger' });
                }

                // Check if passwords match
                if (password !== passwordConfirmation) {
                    console.log('Passwords do not match');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Passwords do not match', messageStyle: 'show', messageColor: 'danger' });
                }


                // Now check if username already exist
                const checkTheUsername = await functions.checkUsername(username);
                if (checkTheUsername.length > 0) {
                    console.log('Username has already been used');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Username has already been used', messageStyle: 'show', messageColor: 'danger' });
                }


                // Now check if username already exist
                const checkTheEmail = await functions.checkEmail(email);
                if (checkTheEmail.length > 0) {
                    console.log('Email has already been used');
                    return res.render('p2p-registration', { user: loggedInUser, message: 'Email has already been used', messageStyle: 'show', messageColor: 'danger' });
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


                return res.render('p2p-registration', { user: loggedInUser, message: 'Successfully created the user', messageStyle: 'show', messageColor: 'success' });
            } catch (error) {
                console.log('Internal Server Error: ', error);
                return res.render('p2p-registration', { user: loggedInUser, message: 'Internal Server Error', messageStyle: 'show', messageColor: 'danger' });
            }
        }
    })
});

// POST route to update bank details
router.post('/update-bank-details', verifyToken.verifyToken, async (req, res) => {
    console.log(req.body);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    const { userId, bank, accountName, accountNumber } = req.body;

    let split = bank.split('-');

    const bankDetails = {
        bankName: split[0],
        bankCode: split[1]
    };

    console.log(bankDetails);

    // update bank details
    connection.query('UPDATE users SET account_number = ?, account_name = ?, bank_name = ?, bank_code = ? WHERE user_id = ?', [accountNumber, accountName, bankDetails.bankName, bankDetails.bankCode, userId], async (err) => {
        if (err) {
            console.log(err);

            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            res.render('update-bank-details', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'error updating bank details', alertColor: 'red' });
        } else {
            console.log('Successfully updated bank details');

            // Fetch user details using username
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            res.render('update-bank-details', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Success: ', alertMessage: 'successfully updated bank details', alertColor: 'green' });
        }
    })
});

// POST route to place withdrawal
router.post('/submit-withdrawal', verifyToken.verifyToken, async (req, res) => {
    const { withdrawalType, amount, pin } = req.body;
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
            return res.status(200).json({ error: 'Please update bank details' });
        }

        // Check if user has set pin
        if (!fetchUserByUsername[0].withdrawal_pin) {
            console.log('Please set pin');
            return res.status(200).json({ error: 'Please set pin' });
        }

        // Check withdrawal type
        if (withdrawalType == 'affiliate') {
            // Perform operations for affiliate withdrawal

            // Ensure that affiliate withdrawal is $8 and above
            if ((amount * 1500) < 12000) {
                console.log('Affiliate withdrawal must be 8000 and above');
                return res.status(404).json({ error: 'Affiliate withdrawal must be $8 and above' });
            }

            // Check if user balance is up to 8000
            if (getTotalAffiliateBalanceView[0].affiliateBalance < 12000) {
                console.log('Insufficient Balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Ensure that withdrawal affiliate amount is not more than user's balance
            if ((amount * 1500) > getTotalAffiliateBalanceView[0].affiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Check if pin is correct
            if (md5(pin) !== fetchUserByUsername[0].withdrawal_pin) {
                console.log('Incorrect pin');
                return res.status(404).json({ error: 'Incorrect pin' });
            }

            // Insert into the affiliate transactions table
            const insertIntoAffiliateTransactions = await dashboardFunctions.insertIntoAffiliateTransactions(`${-(amount * 1500)}`, 'Affiliate Withdrawal', 'DEBIT', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1500), 'Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of $${amount}`);

            // Send the withdrawal details to the session
            session.withdrawalDetails = {
                type: withdrawalType,
                date: functions.formatDate(),
                date2: functions.formatDate2(),
                account: fetchUserByUsername[0].account_number,
                beneficiary: fetchUserByUsername[0].account_name,
                bank: fetchUserByUsername[0].bank_name,
                amount: `$${amount}`
            }

            return res.status(200).json({ success: `Your withdrawal of $${amount} to ${fetchUserByUsername[0].account_number} was successfull` });
        } else if (withdrawalType == 'nonAffiliate') {
            // Perform operations for nonAffiliate withdrawal

            // Ensure that nonAffiliate withdrawal is 45000 and above
            if (amount < 45000) {
                console.log('Non Affiliate withdrawal must be 45000 or above');
                return res.status(404).json({ error: 'Non Affiliate withdrawal must be 45000 and above' });
            }

            // Check if user balance is up to 45000
            if (getTotalZenPointsView[0].nonAffiliateBalance < 45000) {
                console.log('Insufficient Balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Ensure that nonAffiliate amount is not more than user's balance
            if (amount > getTotalZenPointsView[0].nonAffiliateBalance) {
                console.log('You cannot withdraw more than your affiliate balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Check if pin is correct
            if (md5(pin) !== fetchUserByUsername[0].withdrawal_pin) {
                console.log('Incorrect pin');
                return res.status(404).json({ error: 'Incorrect pin' });
            }

            // Insert into the non affiliate transactions table
            const insertIntoNonAffiliateTransactions = await dashboardFunctions.insertIntoNonAffiliateTransactions(`${-(amount)}`, 'Non Affiliate Withdrawal', 'DEBIT', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount), 'Non Affiliate Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of ${amount}ZC`);

            // Send the withdrawal details to the session
            session.withdrawalDetails = {
                type: withdrawalType,
                date: functions.formatDate(),
                date2: functions.formatDate2(),
                account: fetchUserByUsername[0].account_number,
                beneficiary: fetchUserByUsername[0].account_name,
                bank: fetchUserByUsername[0].bank_name,
                amount: `${amount}ZC`
            }

            return res.status(200).json({ success: `Your withdrawal of ${amount}ZC to ${fetchUserByUsername[0].account_number} was successfull` });
        } else if (withdrawalType == 'activity') {
            // Perform operations for activity withdrawal

            // Ensure that activity withdrawal is $3 and above
            if ((amount * 1500) < 4500) {
                console.log('Affiliate withdrawal must be $3 and above');
                return res.status(404).json({ error: 'Activity withdrawal must be $3 and above' });
            }

            // Check if user balance is up to 8000
            if (getTotalZenPointsView[0].ZenPoints < 4500) {
                console.log('Insufficient Balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Ensure that withdrawal amount is not more than user's balance
            if ((amount * 1500) > getTotalZenPointsView[0].ZenPoints) {
                console.log('You cannot withdraw more than your activity balance');
                return res.status(404).json({ error: 'Insufficient Balance' });
            }

            // Check if pin is correct
            if (md5(pin) !== fetchUserByUsername[0].withdrawal_pin) {
                console.log('Incorrect pin');
                return res.status(404).json({ error: 'Incorrect pin' });
            }

            // Insert into the affiliate transactions table
            const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(`${-(amount * 1500)}`, 'Activity Withdrawal', fetchUserByUsername[0].user_id);

            // Insert into the withdrawals table
            const insertIntoWithdrawals = await dashboardFunctions.insertIntoWithdrawals(fetchUserByUsername[0].user_id, fetchUserByUsername[0].username, (amount * 1500), 'Activity Withdrawal', fetchUserByUsername[0].bank_name, fetchUserByUsername[0].account_number, fetchUserByUsername[0].account_name);

            console.log(`Successfully placed withdrawal of $${amount}`);

            // Send the withdrawal details to the session
            session.withdrawalDetails = {
                type: withdrawalType,
                date: functions.formatDate(),
                date2: functions.formatDate2(),
                account: fetchUserByUsername[0].account_number,
                beneficiary: fetchUserByUsername[0].account_name,
                bank: fetchUserByUsername[0].bank_name,
                amount: `$${amount}`
            }

            return res.status(200).json({ success: `Your withdrawal of$${amount} to ${fetchUserByUsername[0].account_number} was successfull` });
        } else {
            console.log('Invalid Withdrawal type');
            return res.status(404).json({ error: 'Invalid Withdrawal type' });
        }
    } catch (error) {
        console.log('Internal server error: ', error);
        return res.status(503).json({ error: 'Internal server error' });
    }
});

// POST route to update withdrawal pin
router.post('/set-pin', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    console.log(req.body);

    const { userId, pin } = req.body;

    // update withdrawal pin
    connection.query('UPDATE users SET withdrawal_pin = ? WHERE user_id = ?', [md5(pin), userId], async (err) => {
        if (err) {
            console.log(err);

            res.render('set-pin', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'error updating bank details', alertColor: 'red' });
        } else {
            console.log('Successfully updated withdrawal pin');

            res.render('set-pin', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Success: ', alertMessage: 'successfully updated withdrawal pin', alertColor: 'green' });
        }
    })
});

// POST route to update profile
router.post('/update-profile', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    // Get the mystery_box setting
    const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

    console.log(req.body);
    const { userId, firstName, lastName, email, phoneNo, currentPassword, newPassword, confirmPassword } = req.body;

    // Make sure every data was sent
    if (!firstName || !lastName || !email || !phoneNo || !currentPassword || !newPassword || !confirmPassword) {
        console.log('Please provide all details');

        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Please provide all details', alertColor: 'red' });
    }

    // Check if current password is correct
    if (fetchUserByUsername[0].password !== md5(currentPassword)) {
        console.log('Incorrect Password');

        return res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Incorrect Password', alertColor: 'red' });
    }

    // Check if the two new password matches
    if (newPassword !== confirmPassword) {
        console.log('New passwords dont match');
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'New Passwords do not match', alertColor: 'red' });
    }

    // Check if password is 8 characters or above
    if (newPassword.length < 8) {
        console.log('Password must be 8 characters or above');
        // Get the user's details
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        return res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Password must be 8 characters or above', alertColor: 'red' });
    }

    // If every check has been performed
    // Update the database
    connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? , password = ? WHERE user_id = ?', [firstName, lastName, email, phoneNo, md5(newPassword), fetchUserByUsername[0].user_id], async (err) => {
        if (err) {
            console.log('Error updating the user profile: ', err);
            res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Internal server error', alertColor: 'red' });
        } else {
            // Get the user's details
            const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

            console.log('Successfully updated profile');
            res.render('update-profile', { user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Success: ', alertMessage: 'Successfully updated profile', alertColor: 'green' });
        }
    });
});

// POST route to confirm youtube video code
router.post('/youtube-reward', verifyToken.verifyToken, async (req, res) => {
    // Fetch user details using username
    const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

    const videoCode = req.body.code;

    // Check if there is an uploaded video
    const getYoutubeVideo = await dashboardFunctions.getYoutubeVideo();

    if (getYoutubeVideo[0].video_link == null) {
        console.log('No video available');
        return res.json({ error: 'No video available' });
    }

    // Check if user has already completed yt task
    if (fetchUserByUsername[0].has_completed_yt_reward == true) {
        console.log('User has already gotten youtube reward');
        return res.json({ error: 'You have already completed this task' });
    }

    // Check if code was provided
    if (!videoCode) {
        console.log('Please provide a code');
        return res.json({ error: 'Code not provided' });
    }
    console.log(videoCode);

    // Get correct video code from the database
    const correctVideoCode = await dashboardFunctions.getYoutubeVideoCode();


    // Check if the code provided is correct
    if (videoCode === correctVideoCode) {
        console.log('Video Code is correct.');

        // Insert into the activity transactions table
        const insertIntoActivityTransactions = await dashboardFunctions.insertIntoActivityTransactions(600, 'Youtube Earning', fetchUserByUsername[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Youtube Earning', 600, fetchUserByUsername[0].user_id);

        // Update the user's has_completed_yt_reward column to true
        const updateYtStatus = await dashboardFunctions.updateYtStatus(true, fetchUserByUsername[0].user_id);
        return res.json({ success: 'Video Code is correct' });
    } else {
        console.log('Video Code is not correct');
        return res.json({ error: 'Video Code is not correct' });
    }
});

// POST route to claim zen mining reward
router.post('/claim-zen-mining-reward', verifyToken.verifyToken, async (req, res) => {
    const amount = req.body.amount;

    console.log(`User is about to claim ${amount} for Zen mining`);

    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Credit the user
        const creditUser = await dashboardFunctions.insertIntoNonAffiliateTransactions(amount, 'Zen Mining', 'CREDIT', fetchUserByUsername[0].user_id);

        // Insert into earning history
        const insertIntoEarningHistory = await functions.insertIntoEarningHistory('Zen Mining', amount, fetchUserByUsername[0].user_id);

        // Update has_claimed_taps column
        const updateHasClaimedTapsColumn = await dashboardFunctions.updateHasClaimedTapsColumn(true, fetchUserByUsername[0].user_id);

        // Check if mining was 600, if so, reward Gem
        if (amount > 599) {
            // Reward Gems
            const rewardGems = await dashboardFunctions.rewardGems(fetchUserByUsername[0].user_id, 1);
        }

        // Get user's new mining balance
        const miningBalance = await dashboardFunctions.getUsersMiningBalance(fetchUserByUsername[0].user_id);

        // Get user's new gems
        const getGems = await dashboardFunctions.getGems(fetchUserByUsername[0].user_id);

        return res.status(200).json({ success: 'Successfully credited the user', miningBalance: miningBalance.amount, getGems: getGems.gems });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: 'An error ocurred' });
    }
});

// POST route to boost account
router.post('/boost-account', verifyToken.verifyToken, async (req, res) => {
    try {
        // Fetch user details using username
        const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

        // Create the user's affiliate balance view
        const createAffiliateBalanceView = await dashboardFunctions.createAffiliateBalanceView(fetchUserByUsername[0].user_id);

        // Get the user's total affiliate balance view
        const getTotalAffiliateBalanceView = await dashboardFunctions.getTotalAffiliateBalanceView();

        // Check if user's affiliate account balance is sufficient
        if (getTotalAffiliateBalanceView[0].affiliateBalance < 500) {
            console.log('Insufficient Affiliate Balance, unable to boost account');

            return res.status(500).json({ error: 'Insufficient Affiliate Balance, unable to boost account' });
        }

        // Debit the user
        const debitUser = await dashboardFunctions.insertIntoAffiliateTransactions(-500, 'Boosting levy', 'DEBIT', fetchUserByUsername[0].user_id);

        // Update the has_boosted_acct column of the user
        const updateHasBoostedColumn = await dashboardFunctions.updateHasBoostedColumn(true, fetchUserByUsername[0].user_id);

        res.status(200).json({ success: 'Successfully updated the has_boosted_acct column of the user', userStand: 1 });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: 'An error occurred' });
    }
})

module.exports = router;