// Require sql connection
const router = require('../Controllers/dashboardPagesController');
const connection = require('../db/db');

const md5 = require('md5');

// Function to get total number of users
async function numberOfUsers() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(user_id) AS totalUsers FROM users', (err, result)=>{
            if (err) {
                console.log('Error getting total number of users: ', err);
                reject(err);
            } else{
                console.log('Total No. of Users: ', result);
                resolve(result[0].totalUsers);
            }
        });
    });
}

// Function to get no. coupon codes(used or unused)
async function couponCodes(is_used) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(token_id) AS totalCodes FROM registeration_tokens WHERE is_used = ?', is_used, (err, result)=>{
            if (err) {
                console.log('Error fetch total number of coupon codes: ', err);
                reject(err);
            } else {
                console.log(`Total No. of coupon codes where "is_used" = ${is_used}: `, result);
                resolve(result[0].totalCodes);
            }
        });
    });
}

// Function to get the sum of withdrawals(pending, approved or declined)
async function sumOfWithdrawals(status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT SUM(amount) AS sumOfWithdrawals FROM withdrawals WHERE status = ?', status, (err, result)=>{
            if (err) {
                console.log('Error fetching the sum of withdrawals: ', err);
                reject(err);
            } else {
                console.log(`Sum of ${status} withdrawals: `, result);
                resolve(result[0].sumOfWithdrawals);
            }
        });
    });
}

// Function to fetch all vendors
async function allVendors() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE is_a_vendor = TRUE ORDER BY user_id DESC', (err, result)=>{
            if (err) {
                console.log('Error fetching all vendors: ', err);
                reject(err);
            } else{
                console.log('All vendors: ', result);
                resolve(result);
            }
        });
    });
}

// Function to fetch all coupon codes
async function allCouponCodes() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM registeration_tokens ORDER BY token_id DESC', (err, result)=>{
            if (err) {
                console.log('Error fetching all coupon codes: ', err);
                reject(err);
            } else{
                console.log('All coupon codes: ', result);
                resolve(result);
            }
        });
    });
}

// Function to fetch all active users
async function allUsers() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users ORDER BY user_id DESC', (err, result)=>{
            if (err) {
                console.log('Error fetching all users: ', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to fetch all withdrawals(pending/completed)
async function withdrawals(withdrawalType, status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM withdrawals WHERE withdrawal_type = ? AND status = ? ORDER BY withdrawal_id DESC', [withdrawalType, status], (err, result)=>{
            if (err) {
                console.log('Error fetching withdrawals: ', err);
                reject(err);
            } else {
               console.log(`${status} ${withdrawalType}: `, result);
               resolve(result);
                
            }
        });
    });
}

// Function to get all sponsored posts
async function sponsoredPosts() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM zenwealth_posts WHERE post_title IS NOT NULL', (err, result)=>{
            if (err) {
                console.log('Error fetching all sponsored posts: ', err);
                reject(err);
            } else {
                console.log('All sponsored posts: ', result);
                resolve(result);
            }
        });
    });
}

// Function to get all products
async function allProducts() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', (err, result)=>{
            if (err) {
                console.log('Error fetching all products: ', err);
                reject(err);
            } else {
                console.log('All products: ', result);
                resolve(result);
            }
        });
    });
}

// Function to get all courses
async function allCourses() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM courses', (err, result)=>{
            if (err) {
                console.log('Error fetching all courses: ', err);
                reject(err);
            } else {
                console.log('All courses: ', result);
                resolve(result);
            }
        });
    });
}

// Function to toggle vendor verification
async function toggleVendorVerification(userId, state) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET is_a_vendor = ? WHERE user_id = ?', [state, userId], (err, result)=>{
            if (err) {
                console.log('Error updating the vendor status of the user: ', err);
                reject(err);
            } else {
                console.log('Successfully updated the vendor status of the user: ', result);
                resolve(result);
            }
        })
    });
}

// Function to get notification
async function getNotification() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pop_up_ad', (err, result)=>{
            if (err) {
                console.log('Error fetching the notification: ', err);
                reject(err);
            } else{
                console.log('Notification: ', result);
                resolve(result[0]);
            }
        });
    });
}


// Function to get settings
async function getSettings() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM withdrawalsettings', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Settings: ', result);
                resolve(result);
            }
        });
    });
}

// Function to get approved withdrawals
async function approvedWithdrawals() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM approved_withdrawals  ORDER BY withdrawal_id DESC', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Approved Withdrawals: ', result);
                resolve(result);
            }
        });
    });
}

// Function to update has_shared_post column of the users table to 0
async function updateHasSharedPostColumn() {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_shared_post = 0', (err, result)=>{
            if (err) {
                console.log('Error updating has_shared_post column of the users');
                reject(err);
            } else{
                console.log('Successfully updated has_shared_post column of the users');
                resolve(result);
            }
        });
    });
}

// Function to update has_joined_platform column of the users table to 0
async function updateHasJoinedPlatformColumn() {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET has_joined_platform = 0', (err, result)=>{
            if (err) {
                console.log('Error updating has_joined_platform column of the users');
                reject(err);
            } else{
                console.log('Successfully updated has_joined_platform column of the users');
                resolve(result);
            }
        });
    });
}

// Function to toggle setting (ON/OFF)
async function toggleSetting(setting, status) {
    return new Promise((resolve, reject)=>{
        connection.query('UPDATE settings SET active_status = ? WHERE setting = ?', [status, setting], (err, result)=>{
            if (err) {
                console.log('Error toggling setting: ', err);
                reject(err);
            } else{
                console.log(`Successfully turned ${status} ${setting}`);
                resolve(result);
            }
        });
    });
}

module.exports = {numberOfUsers, couponCodes, sumOfWithdrawals, allVendors, allCouponCodes, allUsers, withdrawals, sponsoredPosts, allProducts, allCourses, toggleVendorVerification, getNotification, getSettings, approvedWithdrawals, updateHasSharedPostColumn, updateHasJoinedPlatformColumn, toggleSetting};