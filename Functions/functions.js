// Require file system
const fs = require('fs');

// Require sql connection
const connection = require('../db/db');

const md5 = require('md5');

// Require the registrationprocesses js
const registrationprocesses = require('./registrationprocesses');

// Function to get current timestamp
function current_timestamp (){
    const date = new Date().toISOString();
    
    var currentTimestamp = `${date}`;

    return currentTimestamp;
}

// Function to validate email
function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to generate random unique referral codes
function generateReferralCode(username){
    // Define the length of the random part
    const randomPartLength = 6;

    // Generate a random string of specified length
    const randomString = Math.random().toString(36).substr(2, randomPartLength);

    // Concatenate the username and random string
    const referralCode = `${username}-${randomString}`;
    let trimmedStr = referralCode.replace(/\s/g, "");
    return trimmedStr;
}

// Function to separate two numbers
function separateId(input) {
    // Split the input string by '&'
    var numbers = input.split('&');
    
    // Convert each string element to a number
    var num1 = parseInt(numbers[0]);
    var num2 = parseInt(numbers[1]);
    
    return [num1, num2];
}

// Function to check if email has already been used
async function checkEmail(email) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM users WHERE email = ?', email, (err, result)=>{
            if (err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

// Function to check if username has already been used
async function checkUsername(username) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM users WHERE username = ?', username, (err, result)=>{
            if (err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

// Function to check if coupon code is valid
async function checkCoupon(coupon) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM registeration_tokens WHERE token = ? AND is_used = FALSE', coupon, (err, result)=>{
            if (err){
                reject(err);
            } else{
                resolve(result);
            }
        })
    })
}

// Function to check free coupon code
// Function to check if coupon code is valid
async function checkFreeCoupon(coupon) {
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM free_coupons WHERE token = ? AND is_used = FALSE', coupon, (err, result)=>{
            if (err){
                reject(err);
            } else{
                resolve(result);
            }
        });
    });
}


// Function to insert into the user's table for unreferred user
async function createUnreferredUser(res, firstName, lastName, email, username, phone, password, referralCode, coupon){
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO users (first_name, last_name, email, username, phone_number, password, referral_code, registeration_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, username, phone, md5(password), referralCode, coupon], async (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully created user');

                try {
                    // Update the is_used column of the registeration_tokens to TRUE
                    const updateIsUsedColumn = await registrationprocesses.updateIsUsedColumn(res, coupon);

                    // Set the used_id of the registeration_token
                    const setUserId = await registrationprocesses.setUserId(res, coupon, result.insertId);

                    // Set the usage date of the registeration_token
                    const setUsageDate = await registrationprocesses.setUsageDate(res, coupon);

                    // Credit the newly created user with the welcome bonus
                    const creditNewUser = await registrationprocesses.creditNewUser(res, result.insertId);

                    resolve(result);
                    console.log(result);
                } catch (error) {
                    console.log('registrationprocesses error: ', error);
                    return res.render('signup', {message: 'Internal server error', messageStyle: 'show', messageColor: 'danger'});
                }

            }
        })
    })
}

// Function to insert into the user's table for unreferred user
async function createUnreferredUser2(res, firstName, lastName, email, username, phone, password, referralCode, coupon){
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO users (first_name, last_name, email, username, phone_number, password, referral_code, registeration_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, username, phone, md5(password), referralCode, coupon], async (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully created user');

                try {
                    // Update the is_used column of the free_coupons to TRUE
                    const updateIsUsedColumn = await registrationprocesses.updateIsUsedColumn2(res, coupon);

                    // Set the used_id of the free_coupons
                    const setUserId = await registrationprocesses.setUserId2(res, coupon, result.insertId);

                    // Set the usage date of the free_coupons
                    const setUsageDate = await registrationprocesses.setUsageDate2(res, coupon);

                    // Credit the newly created user with the welcome bonus
                    const creditNewUser = await registrationprocesses.creditNewUser(res, result.insertId);

                    resolve(result);
                    console.log(result);
                } catch (error) {
                    console.log('registrationprocesses error: ', error);
                    return res.render('signup', {message: 'Internal server error', messageStyle: 'show', messageColor: 'danger'});
                }

            }
        })
    })
}


// Function to insert into the user's table for referred user
async function createReferredUser(res, firstName, lastName, email, username, phone, password, referralCode, referrer, coupon){
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO users (first_name, last_name, email, username, phone_number, password, referral_code, referrer, registeration_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, username, phone, md5(password), referralCode, referrer, coupon], async (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully created user');

                try {
                    // Update the is_used column of the registeration_tokens to TRUE
                    const updateIsUsedColumn = await registrationprocesses.updateIsUsedColumn(res, coupon);

                    // Set the used_id of the registeration_token
                    const setUserId = await registrationprocesses.setUserId(res, coupon, result.insertId);

                    // Set the usage date of the registeration_token
                    const setUsageDate = await registrationprocesses.setUsageDate(res, coupon);

                    // Credit the newly created user with the welcome bonus
                    const creditNewUser = await registrationprocesses.creditNewUser(res, result.insertId);

                    resolve(result);
                    console.log(result);
                } catch (error) {
                    console.log('registrationprocesses error: ', error);
                    return res.render('signup', {message: 'Internal server error', messageStyle: 'show', messageColor: 'danger'});
                }

            }
        })
    })
}

// Function to credit direct referral
async function creditDirectReferral(res, referrer){
    try {
        return new Promise((resolve, reject) => {
            let amountToAdd = 5200;
    
            // Get the referrer's user_id
            connection.query('SELECT user_id FROM users WHERE referral_code = ?', referrer, (err, details)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else{
                    console.log("Referrer's id: ", details[0].user_id);

                    // Check if the
                    // Insert into the transactions table
                    connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'Direct Referral', 'CREDIT', details[0].user_id], async (err2)=>{
                        if (err2){
                            console.log(err2);
                            reject(err2);
                        } else{
                            console.log('Successfully inserted into the transactions table');
        
                            // Insert into the earning_history table
                            connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['Direct referral bonus', amountToAdd, details[0].user_id], async (err3)=>{
                                if (err3) {
                                    console.log(err3);
                                    reject(err3);
                                } else{
                                    console.log('Successfully inserted into the earning_history table');

                                    // Get the refferer's details
                                    const referrerDetails = await registrationprocesses.getReferrer(referrer);
                                    console.log('Referrer(step 1): ', referrerDetails);
                                    
                                    resolve(referrerDetails);
                                }
                            });
                            
                            
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log('getUserDetails error: ', error);
        return res.render('signup', {message: 'Internal server error', messageStyle: 'show', messageColor: 'danger'});
    }
}

// Function to credit first Indirect referral
async function creditFirstIndirectReferral(res, referrer){
    return new Promise((resolve, reject) => {
        let amountToAdd = 350;

       // Get the user_id of the referrer
       connection.query('SELECT * FROM users WHERE referral_code = ?', referrer, (err2, details)=>{
        if (err2) {
            console.log(err2);
            reject(err2);
        } else{
            console.log("Referrer's id: ", details[0].user_id);
            
            // Insert into the transactions table
            connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'Indirect Referral', 'CREDIT', details[0].user_id], async (err2)=>{
                if (err2){
                    console.log(err2);
                    reject(err2);
                } else{
                    console.log('Successfully inserted into the transactions table');

                    // Insert into the earning_history table
                    connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['First Indirect referral bonus', amountToAdd, details[0].user_id], async (err3)=>{
                        if (err3) {
                            console.log(err3);
                            reject(err3);
                        } else{
                            console.log('Successfully inserted into the earning_history table');
                            // Get the refferer's details
                            const reffererDetails = await registrationprocesses.getReferrer(referrer);
                            console.log('Referrer(step 1): ', reffererDetails);
                            
                            resolve(reffererDetails);
                        }
                    })
                    
                    
                }
            });
        }
    });
    })
}

// Function to credit second Indirect referral
async function creditSecondIndirectReferral(res, referrer){
    return new Promise((resolve, reject) => {
        let amountToAdd = 100;

        // Get the user_id of the referrer
        connection.query('SELECT * FROM users WHERE referral_code = ?', referrer, (err2, details)=>{
            if (err2) {
                console.log(err2);
                reject(err2);
            } else{
                console.log("Referrer's id: ", details[0].user_id);
                
                // Insert into the transactions table
                connection.query('INSERT INTO affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'Indirect Referral', 'CREDIT', details[0].user_id], async (err2)=>{
                    if (err2){
                        console.log(err2);
                        reject(err2);
                    } else{
                        console.log('Successfully inserted into the transactions table');
    
                        // Insert into the earning_history table
                        connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['Second Indirect referral bonus', amountToAdd, details[0].user_id], async (err3)=>{
                            if (err3) {
                                console.log(err3);
                                reject(err3);
                            } else{
                                console.log('Successfully inserted into the earning_history table');
                                // Get the refferer's details
                                const reffererDetails = await registrationprocesses.getReferrer(referrer);
                                console.log('Referrer(step 1): ', reffererDetails);
                                
                                resolve(reffererDetails);
                            }
                        });   
                    }
                });
            }
        });
    });
}


// Function to check user's last login date
async function checkDate(userId){
    return new Promise((resolve, reject) => {
        connection.query('SELECT last_login_date AS lastLoginDate FROM users WHERE user_id = ?', userId, (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Last login date: ', result[0].lastLoginDate);
                resolve(result[0].lastLoginDate);
            }
        })
    })
}


// Function to update the user's last login date
async function updateLastLoginDate(currentDate, userId) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET last_login_date = ? WHERE user_id = ?', [currentDate, userId], (err, result)=>{
            if (err) {
                reject(err);
            } else{
                console.log('Successfully updated the last login date of the user');
                resolve(result);
            }
        })
    })
}

// Function to credit the user for daily loggin bonus
async function creditLoginBonus(userId) {
    let amountToAdd = 500;
    return new Promise((resolve, reject) => {
        // Insert into the transactions table
        connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'Login Bonus', 'CREDIT', userId], async (err2)=>{
            if (err2){
                console.log(err2);
                reject(err2);
            } else{
                console.log('Successfully credited the user for login');
                console.log('Successfully inserted into the transactions table');

                // Insert into the earning_history table
                connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['Daily login bonus', amountToAdd, userId], (err2)=>{
                    if (err2) {
                        console.log(err2);
                        reject(err2);
                    } else{
                        console.log('Successfully inserted into the earning_history table');
                        resolve('success');
                    }
                });
            }
        })
    })
}

// Function to create the new user for P2P
async function createUserp2P(firstName, lastName, username, phoneNumber, email, password, referralCode){
    return new Promise((resolve, reject)=>{
      const hashedPassword = md5(password);

      connection.query('INSERT INTO users (first_name, last_name, username, phone_number, email, password, referral_code) VALUES(?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, username, phoneNumber, email, hashedPassword, referralCode], (err, result)=>{
        if (err) {
          console.log(err);
          reject(err);
        } else{
          console.log('Successfully Created the user: ', result);
          resolve(result);
        }
      })
      })
}

// Function to debit the user, after the P2P registration
async function debitUser(userId){
    return new Promise((resolve, reject)=>{
      const amountToDebit = -5000;
      
      // Insert into the transactions table
      connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'P2P Debit', 'DEBIT', userId], async (err2)=>{
        if (err2){
            console.log(err2);
            reject(err2);
        } else{
            console.log('Successfully inserted into the transactions table');

            resolve('success');
        }
    });
    })
}

// Function to credit the newly registered user with the welcome bonus
async function creditNewUser(userId){
    return new Promise((resolve, reject)=>{
      const amountToAdd = 4000;
      
      // Insert into the transactions table
      connection.query('INSERT INTO non_affiliate_transactions (amount, transaction_type, type, user_id) VALUES (?, ?, ?, ?)', [amountToAdd, 'Welcome Bonus', 'CREDIT', userId], async (err2)=>{
        if (err2){
            console.log(err2);
            reject(err2);
        } else{
            console.log('Successfully inserted into the transactions table');

            // Insert into the earning_history table
            connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', ['Welcome bonus', amountToAdd, userId], (err2)=>{
                if (err2) {
                    console.log(err2);
                    reject(err2);
                } else{
                    console.log('Successfully inserted into the earning_history table');
                    resolve(result);
                }
            });
        }
    });
    })
  }

// Function to generate coupon code
async function generatedFreeCouponCode() {
    // Define the length of the random part
    const randomPartLength = 10;
      
    // Generate a random string of specified length
    let randomString = Math.random().toString(36).substr(2, randomPartLength);

    //  Pad the random string with additional characters if its length is less than 16
    while (randomString.length < randomPartLength) {
        randomString += Math.random().toString(36).substr(2);
    }

    // Take the first 16 characters to ensure length is exactly 16
    randomString = (randomString.substr(0, randomPartLength)).toUpperCase();

    // Concatenate the username and random string
    const couponCode = randomString;

    console.log(couponCode);
    
    return couponCode;
}

// Function to get all vendors
async function getVendors() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE is_a_vendor = 1', (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log('Vendors: ', result);
                resolve(result)
            }
        });
    });
}

// Function to shuffle array
function shuffleArray(array) {
    // Create a copy of the array to avoid mutating the original array
    let shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the random index
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }

    return shuffledArray;
}

// Function to insert into earning history
async function insertIntoEarningHistory(earning, amount, userId) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO earning_history (earning, amount, user_id) VALUES (?, ?, ?)', [earning, amount, userId], (err, result)=>{
            if (err) {
                console.log('Error inserting into earning history: ', err);
                reject(err);
            } else{
                console.log('Successfully inserted into earning history');
                resolve(result);
            }
        });
    });
}

function formatDate() {
    const date = new Date();  // Get current date and time
  
    // Array for month names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Get day, month, year, hours, minutes, and seconds
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;  // the hour '0' should be '12'
    
    // Add leading zero to minutes and seconds if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  
    // Format the final string
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  
    return formattedDate;
  }
  
  function formatDate2() {
    const date = new Date();  // Get current date and time
  
    // Array for day names and month names
    const daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", 
      "October", "November", "December"
    ];
  
    // Get day, month, year, and weekday name
    const dayOfWeek = daysOfWeek[date.getDay()];  // Get the day of the week (0-6)
    const day = date.getDate();
    const month = months[date.getMonth()];  // Get the month name (0-11)
    const year = date.getFullYear();
  
    // Format the date string as "Thursday, November 7, 2024"
    const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;
  
    return formattedDate;
  }
  
// Function to read file
async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(`Successfully read file, contents: ${data}`);
                resolve(JSON.parse(data));
            }
        });
    });
}
  
// Function to write into file
async function writeIntoFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(content), (err, data)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(`Successfully written into file: ${content.count}`);
                resolve(data);
            }
        });
    });
}

// Function to increase the contest count of a user
async function increaseContestCount(referralCode, value) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET contest_count = contest_count + ? WHERE referral_code = ?', [value, referralCode], (err, result)=>{
            if (err) {
                console.log(err);
                reject(err);
            } else{
                console.log(`Successfully increased the contest_count of the user by ${value}`);
                resolve(value);
            }
        });
    });
}

module.exports = {current_timestamp, validateEmail, generateReferralCode, separateId, checkEmail, checkUsername, checkCoupon, checkFreeCoupon, createUnreferredUser, createUnreferredUser2, createReferredUser, creditDirectReferral, creditFirstIndirectReferral, creditSecondIndirectReferral, checkDate, updateLastLoginDate, creditLoginBonus, createUserp2P, debitUser, creditNewUser, generatedFreeCouponCode, getVendors, shuffleArray, insertIntoEarningHistory, formatDate, formatDate2, readFile, writeIntoFile, increaseContestCount};