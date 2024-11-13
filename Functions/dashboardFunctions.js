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


// Function to create the user zenpoints view
async function createZenpointsView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW zenpoints AS SELECT amount, transaction_date FROM activity_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating zenpoints view: ', err);
                reject(err);
            } else {
                console.log('zenpoints: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total zenpoints view
async function getTotalZenPointsView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS ZenPoints FROM zenpoints', (err, result)=>{
            if (err) {
                console.log('Error fetching the total zenpoints: ', err);
                reject(err);
            } else{
                console.log('Total zenpoints: ', result);
                resolve(result);
            }
        })
    })
}

// Function to create the user zencoins view
async function createZenCoinsView(userId) {
    return new Promise((resolve, reject) => {
        connection.query('CREATE OR REPLACE VIEW zencoins AS SELECT amount, transaction_type, transaction_date FROM non_affiliate_transactions WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                console.log('Error creating zencoins view: ', err);
                reject(err);
            } else {
                console.log('zencoins: ', result);
                resolve(result);
            }
        })
    })
}

// Function to get the user total zencoins view
async function getTotalZenCoinsView() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS zenCoins FROM zencoins', (err, result)=>{
            if (err) {
                console.log('Error fetching the total zencoins: ', err);
                reject(err);
            } else{
                console.log('Total zencoins: ', result);
                resolve(result);
            }
        })
    })
}

// Function to insert into affiliate transactions table
async function insertIntoAffiliateTransactions(amount, transactionType, type, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amount, transactionType, type, userId], (err, result)=>{
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
async function insertIntoNonAffiliateTransactions(amount, transactionType, type, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type,type, user_id) VALUES (?, ?, ?, ?)', [amount, transactionType, type, userId], (err, result)=>{
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

// Function to insert into activity_transactions table
async function insertIntoActivityTransactions(amount, transactionType, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO activity_transactions (amount, type, user_id) VALUES (?, ?, ?)', [amount, transactionType, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into activity_transactions table: ', err);
                reject(err);
            } else {
                console.log('Successfully inserted into the activity_transactions table');
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


// Function to update the user's has_completed_yt_reward column to true
async function updateYtStatus(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_completed_yt_reward = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(`Successfully updated the has_completed_yt_reward column of the user to ${status}`);
                resolve(result);
            }
        })
    });
}

// Function to get all posts from the database
async function getPosts() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM zenwealth_posts WHERE post_type IS NOT NULL', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('All posts: ', result);
                resolve(result);
            }
        });
    });
} 

// Function to get single post with the post_id
async function getSinglePost(postId) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM zenwealth_posts WHERE post_id = ?', postId, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Post: ', result);
                resolve(result);
            }
        });
    })
}

// Function to update the has_shared_post colum
async function updateHasSharedPostColumn(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_shared_post = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the column: ', err);
                reject(err);
            } else{
                console.log('Successfully updated the has_shared_post column');
                resolve(result);
            }
        });
    });
}

// Function to update the has_joined_platform colum
async function updateHasJoinedPlatform(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_joined_platform = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the column: ', err);
                reject(err);
            } else{
                console.log('Successfully updated the has_joined_platform column');
                resolve(result);
            }
        });
    });
}

// Function to update the credited_task1 colum
async function creditedTask1Column(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET credited_task1 = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the column: ', err);
                reject(err);
            } else{
                console.log('Successfully updated the credited_task2 column');
                resolve(result);
            }
        });
    });
}

// Function to update the credited_task2 colum
async function creditedTask2Column(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET credited_task2 = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the column: ', err);
                reject(err);
            } else{
                console.log('Successfully updated the credited_task2 column');
                resolve(result);
            }
        });
    });
}

// Function to get the mystery_box setting
async function getMysteryBoxSetting() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT active_status FROM settings WHERE setting = ?', 'mystery_box', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Mystery Box setting: ', result);
                resolve(result);
            }
        });
    });
}

// Function to update the has_claimed_gift column of the user
async function updateHasClaimedColumn(status, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_claimed_gift = ? WHERE user_id = ?', [status, userId], (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(`Successfully updated the has_claimed_gift column to ${status}`);
                resolve(result);
            }
        });
    });
}

// Function to generate free coupon for the user
async function assignFreeCoupon(userId, coupon) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO free_coupons (created_for, token) VALUES (?, ?)', [userId, coupon], (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Successfully assigned coupon code to the user: ', coupon);
                resolve(result);
            }
        });
    });
}

// Function to get the youtube video
async function getYoutubeVideo() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM youtube_video', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('YouTube video: ', result);
                resolve(result);
            }
        });
    });
}


module.exports = {fetchUserByUsername, getReferrals, getTotalWithdrawal, createAffiliateBalanceView, getTotalAffiliateBalanceView, getTotalReferralBalanceView, createZenpointsView, getTotalZenPointsView, createZenCoinsView, getTotalZenCoinsView, insertIntoAffiliateTransactions, insertIntoNonAffiliateTransactions, insertIntoActivityTransactions, insertIntoWithdrawals, getCoupons, getYoutubeVideoCode, updateYtStatus, getPosts, getSinglePost, updateHasSharedPostColumn, updateHasJoinedPlatform, creditedTask1Column, creditedTask2Column, getMysteryBoxSetting, updateHasClaimedColumn, assignFreeCoupon, getYoutubeVideo};