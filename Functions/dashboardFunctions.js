// Require sql connection
const connection = require('../db/db');

// Function to fetch user by username
async function fetchUserByUsername(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE username = ?', username, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('fetch user details: ', result);
                resolve(result);                
            }
        })
    })
}

// Function to get user's referrals
async function getReferrals(referralCode) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(username) AS referrals FROM users WHERE referrer = ?', referralCode, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Total referrals: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get user's total withdrawal
async function getTotalWithdrawal(userId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS totalWithdrawal FROM withdrawals WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else {
               console.log('Total withdrawal: ', result);
               resolve(result) 
            }
        })
    })
}

// Function to create the user affiliate balance view
async function createAffiliateBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW affiliate_balance AS SELECT amount, transaction_type, transaction_date FROM affiliate_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating affiliate_balance view: ', err);
                reject(err);
            } else {
                console.log('Affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total affiliate balance view
async function getTotalAffiliateBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS affiliateBalance FROM affiliate_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total affiliate balance: ', err);
                reject(err);
            } else{
                console.log('Total affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total direct referral balance
async function getTotalReferralBalanceView(type) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS balance FROM affiliate_balance WHERE transaction_type = ?', type, (err, result)=>{
            if (err) {
                console.log('Error fetching the total referral balance: ', err);
                reject(err);
            } else{
                console.log('Total referral balance: ', result);
                resolve(result);
            }
        })
    })
}


// Function to create the user non affiliate balance view
async function createNonAffiliateBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW non_affiliate_balance AS SELECT amount, transaction_type, transaction_date FROM non_affiliate_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating non_affiliate_balance view: ', err);
                reject(err);
            } else {
                console.log('Non Affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total non affiliate balance view
async function getTotalNonAffiliateBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS nonAffiliateBalance FROM non_affiliate_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total non affiliate balance: ', err);
                reject(err);
            } else{
                console.log('Total non affiliate balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to create the user game balance view
async function createGameBalanceView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW game_balance AS SELECT amount, transaction_date FROM game_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating game_balance view: ', err);
                reject(err);
            } else {
                console.log('Game balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total game balance view
async function getTotalGameBalanceView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS gameBalance FROM game_balance', (err, result)=>{
            if (err) {
                console.log('Error fetching the total game balance: ', err);
                reject(err);
            } else{
                console.log('Total game balance: ', result);
                resolve(result);
            }
        })
    })
}

// Function to insert into affiliate transactions table
async function insertIntoAffiliateTransactions(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into affiliate_transactions table: ', err);
                reject(err);
            } else {
                console.log('Successfully inserted into the affiliate transactions table');
                resolve(result);
            }
        })
    })
}

// Function to insert into non affiliate transactions table
async function insertIntoNonAffiliateTransactions(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into non_affiliate_transactions table: ', err);
                reject(err);
            } else {
                console.log('Successfully inserted into the non affiliate transactions table');
                resolve(result);
            }
        })
    })
}

// Function to insert into the withdrawals table
async function insertIntoWithdrawals(userId, username, amount, withdrawalType, bank, accountNumber, accountName) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO withdrawals (user_id, user, amount, withdrawal_type, bank, account_number, account_name) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, username, amount, withdrawalType, bank, accountNumber, accountName], (err, result)=>{
            if (err) {
                console.log('Error inserting into withdrawals table: ', err);
                reject(err);
            } else{
                console.log('Successfully inserted into the withdrawals table');
                resolve(result);
            }
        })
    })
}

// Function to get the vendor's coupon codes
async function getCoupons(userId, isUsed) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM registeration_tokens WHERE vendor_id = ? AND is_used = ?', [userId, isUsed], (err, result)=>{
          if (err) {
              console.log('Error getting vendor coupons: ', err);
              reject(err);
          } else {
              console.log('Vendor coupons: ', result);
              resolve(result);
          }
      });
    });  
  } 


// Function to get the youtube video correct code
async function getYoutubeVideoCode() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT video_code FROM youtube_video WHERE id = 1', (err, result)=>{
            if (err) {
                console.log('Error getting correct code for youtube video: ', err);
                reject(err);
            } else{
                console.log('YouTube video code: ', result[0].video_code);
                resolve(result[0].video_code);
            }
        });
    });
}

module.exports = {fetchUserByUsername, getReferrals, getTotalWithdrawal, createAffiliateBalanceView, getTotalAffiliateBalanceView, getTotalReferralBalanceView, createNonAffiliateBalanceView, getTotalNonAffiliateBalanceView, createGameBalanceView, getTotalGameBalanceView, insertIntoAffiliateTransactions, insertIntoNonAffiliateTransactions, insertIntoWithdrawals, getCoupons, getYoutubeVideoCode};