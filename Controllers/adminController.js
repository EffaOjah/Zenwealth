const express = require('express');

const router = express.Router();

const md5 = require('md5');

const path = require('path');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const adminFunctions = require('../Functions/adminFunctions');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Require JWT middleware
const jwt = require('../Functions/jwt');

// Require database connection
const connection = require('../db/db');

// Require multer for file upload
const multer = require('multer');

const upload = multer({
    dest: 'public/uploads/admin',
    fileFilter: (req, file, cb) => {
    //   // Check if the uploaded file is an image
    //   if (!file.mimetype.startsWith('image/')) {
    //     // return cb(new Error('Only image files are allowed!'), false);
    //     return console.log('Only image files are allowed!');
    //     // ({error: 'Only image files are allowed!'});
    //   }
      cb(null, true);
    }
  });


// GET ROUTES
// Route to get user balances
router.get('/admin-loadBalances/:username', verifyToken.verifyAdminToken, async(req, res)=>{
    try {
       // Fetch user details using username
       const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.params.username); 

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

// Route to get admin dashboard
router.get('/admin/dashboard', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get total no. of users
    const totalUsers = await adminFunctions.numberOfUsers();

    // Get total no. of unused coupon codes
    const unusedCouponCodes = await adminFunctions.couponCodes(false);

    // Get total no. of used coupon codes
    const usedCouponCodes = await adminFunctions.couponCodes(true);

    // Get sum of pending withdrawals
    const pendingWithdrawals = await adminFunctions.sumOfWithdrawals('PENDING');

    // Get sum of completed withdrawals
    const completedWithdrawals = await adminFunctions.sumOfWithdrawals('COMPLETED');
    
    res.render(path.join(__dirname , '../views/Admin Pages/Admin Dashboard'), {totalUsers, unusedCouponCodes, usedCouponCodes, pendingWithdrawals, completedWithdrawals});
});

// Route for website settings
router.get('/website-settings', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the notification
    const getNotification = await adminFunctions.getNotification();

    // Get settings
    const getSettings = await adminFunctions.getSettings();

    // Get withdrawal settings
    const getWithdrawalSettings = await adminFunctions.getWithdrawalSettings();

    const affiliateWithdrawalSetting = getWithdrawalSettings[0].active_status;
    const nonAffiliateWithdrawalSetting = getWithdrawalSettings[1].active_status;
    const gameWithdrawalSetting = getWithdrawalSettings[2].active_status;

    const mysteryBoxSetting = getSettings[0].active_status;

    res.render(path.join(__dirname , '../views/Admin Pages/Website Settings'), {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting, mysteryBoxSetting});
});

// Route to generate coupon codes
router.get('/coupon/generate', verifyToken.verifyAdminToken, async(req, res)=>{
    // Fetch * vendors
    const vendors = await adminFunctions.allVendors();

    res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors});
})

// Route to get all coupon codes
router.get('/coupon-codes', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all coupon codes
    const allCouponCodes = await adminFunctions.allCouponCodes();

    res.render(path.join(__dirname , '../views/Admin Pages/Admin Coupons'), {allCouponCodes})
});

// Route to get all active users
router.get('/active-users', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all users
    const allUsers = await adminFunctions.allUsers();

    res.render(path.join(__dirname , '../views/Admin Pages/Active Users'), {allUsers});
});

// Route to get all vendors
router.get('/all-vendors', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all users
    const allVendors = await adminFunctions.allVendors();

    res.render(path.join(__dirname , '../views/Admin Pages/Active Vendors'), {allVendors});
});

// Route to get all pending affiliate withdrawals
router.get('/pending-affiliate-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const pendingWithdrawals = await adminFunctions.withdrawals('Affiliate Withdrawal', 'PENDING');

    res.render(path.join(__dirname , '../views/Admin Pages/Pending Affiliate Withdrawals'), {pendingWithdrawals});
});

// Route to get all pending non affiliate withdrawals
router.get('/pending-earnings-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const pendingWithdrawals = await adminFunctions.withdrawals('Non Affiliate Withdrawal', 'PENDING');

    res.render(path.join(__dirname , '../views/Admin Pages/Pending Earnings Withdrawals'), {pendingWithdrawals});
});

// Route to get all approved withdrawals
router.get('/approved-withdrawals', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get the withdrawals
    const approvedWithdrawals = await adminFunctions.approvedWithdrawals();

    res.render(path.join(__dirname , '../views/Admin Pages/Approved Withdrawals'), {approvedWithdrawals});
});

// Route to select post type
router.get('/add-post', (req, res)=>{
    res.render(path.join(__dirname, '../views/Admin Pages/Select Post Type'));
});

// Route to add sponsored post
router.get('/admin/add-advert-post', verifyToken.verifyAdminToken, (req, res)=>{
    res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'));
});

// Route to add sponsored post
router.get('/admin/add-sponsored-post', verifyToken.verifyAdminToken, (req, res)=>{
    res.render(path.join(__dirname , '../views/Admin Pages/Add Post2'));
});

// Route to get all sponsored post
router.get('/admin/all-sponsored-post', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all sponsored posts
    const sponsoredPosts = await adminFunctions.sponsoredPosts();

    res.render(path.join(__dirname , '../views/Admin Pages/All Posts'), {sponsoredPosts});
});

// Route to upload youtube video
router.get('/admin/upload-yt-video', verifyToken.verifyAdminToken, (req, res)=>{
    res.render(path.join(__dirname , '../views/Admin Pages/Upload Yt Video'));
})

// Route to add product
router.get('/admin/upload-product', verifyToken.verifyAdminToken, (req, res)=>{
    res.send('Page to uplaod product');
});

// Route to get all products
router.get('/admin/all-products', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all products
    const allProducts = await adminFunctions.allProducts();

    res.status(200).json({
        page: 'All products page',
        allProducts
    });
});

// Route to add courses
router.get('/admin/add-course', verifyToken.verifyAdminToken, (req, res)=>{
    res.send('Page to add course');
});

// Route to get all courses
router.get('/admin/all-courses', verifyToken.verifyAdminToken, async(req, res)=>{
    // Get all products
    const allCourses = await adminFunctions.allCourses();

    res.status(200).json({
        page: 'All courses page',
        allCourses
    });
});

// Route to get users details
router.get('/user/:username', verifyToken.verifyAdminToken, async(req, res)=>{
    let username = req.params.username;
    console.log('Username: ', username);
    
    // Fetch the user's details
    const userDetails = await dashboardFunctions.fetchUserByUsername(username);

    res.render(path.join(__dirname , '../views/Admin Pages/User Detail'), {userDetails});
});

// Route to send notifications to all users
router.get('/admin/send-notifications', verifyToken.verifyAdminToken, (req, res)=>{
    res.send('Page to send notifications');
});

// Route to login as user
router.get('/admin/user/:username', verifyToken.verifyAdminToken, async(req, res)=>{
    const username = req.params.username;

    // Generate the JWT
    const generateJwt = await jwt.generateJwt(username);

    // Set the cookie
    const setCookie = await jwt.setCookie(res, generateJwt);

    res.redirect('/user/dashboard');
});

// Route for tiktok details
router.get('/admin/tiktok-details', verifyToken.verifyAdminToken, (req, res)=>{
    // Get all the user's tiktok details
    connection.query('SELECT username, tiktok_full_name, tiktok_username, tiktok_profile_link FROM users WHERE tiktok_profile_link IS NOT NULL', (err, result)=>{
        if (err) {
            console.log(err);
        } else{
            console.log('Tiktok details: ', result);
            console.log(result.length);
            
            res.render(path.join(__dirname , '../views/Admin Pages/Tiktok details'), {details: result});
        }
    });
});

// Route to delete posts
router.get('/delete-post', verifyToken.verifyAdminToken, (req, res)=>{
    // Extract the 'id' from the URL parameters
    const id = parseInt(req.query.id);
    console.log('parsedInt: ', id);
  
    // delete the post
    connection.query('UPDATE zenwealth_posts SET post_title = null, contact_link = null, post_description = null, post_image = null, post_type = null WHERE post_id = ?', id, (err)=>{
      if (err){
        console.log(err);
        res.redirect('/admin/all-sponsored-post');
      } else{
        console.log('Successfully deleted post');
        res.redirect('/admin/all-sponsored-post');
      }
    });
  });



// POST ROUTES
// Route to update pop up ad
router.post('/popUpAd/update', upload.single('image'), verifyToken.verifyAdminToken, async(req, res)=>{
    // Get settings
    const getSettings = await adminFunctions.getSettings();

    const affiliateWithdrawalSetting = getSettings[0].active_status;
    const nonAffiliateWithdrawalSetting = getSettings[1].active_status;
    const gameWithdrawalSetting = getSettings[2].active_status;

    const {title, link, details, button} = req.body;
    console.log('req.body: ', req.body);

    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        // Get the notification
        const getNotification = await adminFunctions.getNotification();

        return res.render(path.join(__dirname , '../views/Admin Pages/Website Settings'), {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting, alertTitle: 'Error: ', alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        // Get the notification
        const getNotification = await adminFunctions.getNotification();

        // Get settings
        const getSettings = await adminFunctions.getSettings();

        const affiliateWithdrawalSetting = getSettings[0].active_status;
        const nonAffiliateWithdrawalSetting = getSettings[1].active_status;
        const gameWithdrawalSetting = getSettings[2].active_status;

        return res.render(path.join(__dirname , '../views/Admin Pages/Website Settings'), {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting, alertTitle: 'Error: ', alertMessage: 'Only image files are allowed', alertColor: 'red'});
    }

    console.log('File uploaded successfully: ', req.file);

    // Update the database
        connection.query('UPDATE pop_up_ad SET notification_image = ?, notification_title = ?, notification_link = ?, notification_details = ?, button_name = ?', [req.file.filename, title, link, details, button], async(err)=>{
            if (err) {
                console.log('Error Updating Ad!: ', err);

                // Get the notification
                const getNotification = await adminFunctions.getNotification();

                return res.render(path.join(__dirname , '../views/Admin Pages/Website Settings'), {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting, alertTitle: 'Error: ', alertMessage: 'Error updating Ad!', alertColor: 'red'});
            } else {
                // Get the notification
                const getNotification = await adminFunctions.getNotification();

                return res.render(path.join(__dirname , '../views/Admin Pages/Website Settings'), {getNotification, affiliateWithdrawalSetting, nonAffiliateWithdrawalSetting, gameWithdrawalSetting, alertTitle: 'Success', alertMessage: 'Ad updated successfully!', alertColor: 'green'});
            }
        });
});

// Route to turn on/off withdrawal (affiliate, non_affiliate, game)
router.post('/update-withdrawal-status', verifyToken.verifyAdminToken, (req, res)=>{
    const {withdrawalType, status} = req.body;
    console.log(req.body);
    
    // Update the status of the withdrawal
    connection.query('UPDATE withdrawalsettings SET active_status = ? WHERE setting = ?', [status, withdrawalType], async(err)=>{
        if (err) {
            console.log('Error updating the active_status of the withdrawal: ', err);
            return res.status(500).json({error: `Error updating the active_status of the withdrawal: ${err}`});
        }
        // Check the withdrawal status
        if(status == 'ON'){
            // Update the has_withdrawn column of the user to 1
            const updateHasWithdrawnColumn = await dashboardFunctions.updateHasWithdrawnColumn(false, fetchUserByUsername[0].user_id);
        }
        console.log(`Successfully updated the active status of the ${withdrawalType} to ${status}`);
        return res.status(200).json({success: `Successfully updated the active status of the ${withdrawalType} to ${status}`});
    });
});

// Route to make user a vendor
router.post('/make-vendor', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username, vlink} = req.body;
    console.log(req.body);
    

    connection.query('UPDATE users SET is_a_vendor = true, vendor_link = ? WHERE user_id = ?', [vlink, userId], (err, result)=>{
        if (err) {
            console.log('Error updating the vendor status of the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully updated the vendor status of the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to remove user as a vendor
router.post('/remove-vendor', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_a_vendor = false, vendor_link = NULL WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error updating the vendor status of the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully updated the vendor status of the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to ban user
router.post('/ban-user', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_banned = true WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error banning the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully banned the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to unban user
router.post('/unban-user', verifyToken.verifyAdminToken, async(req, res)=>{
    const {userId, username} = req.body;

    connection.query('UPDATE users SET is_banned = false WHERE user_id = ?', userId, (err, result)=>{
        if (err) {
            console.log('Error unbanning the user: ', err);
            res.redirect(`/user/${username}`);
        } else {
            console.log('Successfully unbanned the user: ', result);
            res.redirect(`/user/${username}`);
        }
    });
});

// Route to update user's details
router.post('/update-user-details', verifyToken.verifyAdminToken, (req, res)=>{
    const {userId, firstName, lastName, email, mobileNumber, newPassword, username} = req.body;
    console.log(req.body);
    
    if (!newPassword) {
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?', [firstName, lastName, email, mobileNumber, userId], async (err, result)=>{
            if (err) {
                console.log(err);

                res.redirect(`/user/${username}`);
            } else {
                console.log('Successfully updated the user details');
                
                res.redirect(`/user/${username}`);
            }
        });
    } else {
        connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, password = ? WHERE user_id = ?', [firstName, lastName, email, mobileNumber, md5(newPassword), userId], async (err, result)=>{
            if (err) {
                console.log(err);
                
                res.redirect(`/user/${username}`);
            } else {
                console.log('Successfully updated the user details');
                
                res.redirect(`/user/${username}`);
            }
        });
    }
});

// Route to generate coupon code
router.post('/generate-coupon-code', verifyToken.verifyAdminToken, async(req, res)=>{
    // Fetch * vendors
    const vendors = await adminFunctions.allVendors();

    const {vendor, noOfCoupons, country} = req.body;
    console.log(req.body);

    // Check if a valid vendor was selected
    if (!vendor) {
        console.log('Please select a valid vendor');

        return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Error', alertMessage: 'Please select a vendor', alertColor: 'red'});
    }
    
    // Check if valid country was selected
    if (!country) {
        console.log('Please select a valid country');

        return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Error', alertMessage: 'Please select a country', alertColor: 'red'});
    }
    
    let split = vendor.split('*');
    
    var vendorDetails = {
        vendorId: split[1],
        vendorUsername: split[0]
    };

    console.log(vendorDetails);
    
    let vendorInitials = (vendorDetails.vendorUsername.slice(0, 4)).toUpperCase();
    console.log('Vendor Initials: ', vendorInitials);
    
    var arrOfGeneratedCodes = [];
    // Function to generate random coupon codes
    async function generateCouponCodes(){
        var insertData = [];
  
          for(let i = 1; i <= noOfCoupons; i++){
              // Define the length of the random part
              const randomPartLength = 15;
      
              // Generate a random string of specified length
              let randomString = Math.random().toString(36).substr(2, randomPartLength);
      
              //  Pad the random string with additional characters if its length is less than 16
              while (randomString.length < randomPartLength) {
                  randomString += Math.random().toString(36).substr(2);
              }
      
              // Take the first 16 characters to ensure length is exactly 16
              randomString = (randomString.substr(0, randomPartLength)).toUpperCase();
      
              // Concatenate the username and random string
              const couponCode = `${country}${randomString}${vendorInitials}`;
              
              arrOfGeneratedCodes.push(couponCode);
          }
          const couponCodesGenerated = arrOfGeneratedCodes;
         console.log('generatedCouponCodes :', couponCodesGenerated);

         // Push the array of generated codes and the vendorId into the insertData array
         for (let j = 0; j < couponCodesGenerated.length; j++) {
            const holder = 
              [vendorDetails.vendorId, couponCodesGenerated[j]];
    
             insertData.push(holder)
           }
           console.log(insertData);

           // Insert into the databases
           connection.beginTransaction((err) => {
            if (err) {
                console.log('Error starting transaction: ' , err);
                
                return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Error', alertMessage: 'An error ocurred', alertColor: 'red'});
            }
        
            connection.query('INSERT INTO registeration_tokens (vendor_id, token) VALUES ?', [insertData], (err, result)=>{
                if (err) {
                    return connection.rollback(() => {
                        console.log('Error creating coupon code(Transaction rolled back): ' , err);

                        return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Error', alertMessage: 'Operation failed', alertColor: 'red'});
                    });
                }
        
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.log('Error committing transaction: ' , err);
                            
                            return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Error', alertMessage: 'An error ocurred', alertColor: 'red'});
                        });
                    }
        
                    console.log('Successfully created coupon code: ' + result);

                    return res.render(path.join(__dirname , '../views/Admin Pages/Generate Coupons'), {vendors, alertTitle: 'Success', alertMessage: `Successfully generated ${noOfCoupons} codes for ${vendorDetails.vendorUsername}`, alertColor: 'green'});
                });
            });
        });
        
      }
      
      generateCouponCodes();
});

// Route to add youtube video
router.post('/add-youtube-video', verifyToken.verifyAdminToken, (req, res)=>{
    const {videoDescription, videoLink, videoCode} = req.body;
    console.log('req.body: ', req.body);
    
    // Check if all details were provided
    if(!videoDescription || !videoLink || !videoCode){
        console.log('Please provide all details');
        
        return res.render(path.join(__dirname , '../views/Admin Pages/Upload Yt Video'), {alertTitle: 'Error:', alertMessage: 'Please provide all details', alertColor: 'red'});
    } 

    // Update the database
    connection.query('UPDATE youtube_video SET video_description = ?, video_link = ?, video_code = ? WHERE id = ?', [videoDescription, videoLink, videoCode, 1], async (err)=>{
        if (err) {
            console.log('Error adding youtube video: ', err);
            
            return res.render(path.join(__dirname , '../views/Admin Pages/Upload Yt Video'), {alertTitle: 'Error: ', alertMessage: 'Error adding youtube video', alertColor: 'red'});
        } else{
            console.log('Successfully added the youtube video');
           
            try {
                // Set all users has_completed_yt_reward column to false
                const updateYtStatus = await adminFunctions.updateYtStatus(false); 

                return res.render(path.join(__dirname , '../views/Admin Pages/Upload Yt Video'), {alertTitle: 'Success: ', alertMessage: 'Successfully added youtube video', alertColor: 'green'});
            } catch (error) {
                console.log(error);
                
                return res.render(path.join(__dirname , '../views/Admin Pages/Upload Yt Video'), {alertTitle: 'Error: ', alertMessage: 'An error ocurred', alertColor: 'red'});
            }
        }
    });

});

// Route to add advert post
router.post('/add-advert-post', verifyToken.verifyAdminToken, upload.single('image'), verifyToken.verifyAdminToken, (req, res)=>{
    const {postTitle, description} = req.body;
    console.log(req.body);

    // Check if all details were provded
    if (!postTitle || !description) {
        console.log('Please provide all details');
        
        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Please provide all details', alertColor: 'red'});
    }

    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }

    // Insert into the database
    connection.query('UPDATE zenwealth_posts SET post_title = ?, post_description = ?, post_image = ?, post_type = ? WHERE post_id = ?', [postTitle, description, req.file.filename, 'advert', 1], async (err)=>{
        if (err) {
            console.log('Error adding advert post: ', err);
            return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error: ', alertMessage: 'Error adding advert post', alertColor: 'red'});
        } else{
            console.log('Successfully added advert post 1');

            // Update the has_shared_post column of the user
            try {
                const updateHasSharedPostColumn = await adminFunctions.updateHasSharedPostColumn();

                // Update the credited_task1 column
                const creditedTask1Column = await adminFunctions.creditedTask1Column(1);

                return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Success: ', alertMessage: 'Successfully added advert post', alertColor: 'green'});
            } catch (error) {
                console.log(error);
                
                return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error: ', alertMessage: 'An error ocurred', alertColor: 'red'});
            }
        }
    });
});

// Route to add sponsored post
router.post('/add-sponsored-post', verifyToken.verifyAdminToken, upload.single('image'), verifyToken.verifyAdminToken, (req, res)=>{
    const {postTitle, description, contactLink} = req.body;
    console.log(req.body);

    // Check if all details were provded
    if (!postTitle || !description) {
        console.log('Please provide all details');
        
        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Please provide all details', alertColor: 'red'});
    }

    // Check if file was uploaded
    if (!req.file) {
        console.log('Please provide an image');

        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Please provide an image', alertColor: 'red'});
    }
    if (!req.file.mimetype.startsWith('image/')) {
        console.log('Only image files are allowed!');

        return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error:', alertMessage: 'Only image files are allowed!', alertColor: 'red'});
    }

    // Insert into the database
    connection.query('UPDATE zenwealth_posts SET post_title = ?, contact_link = ?, post_description = ?, post_image = ?, post_type = ? WHERE post_id = ?', [postTitle, contactLink, description, req.file.filename, 'sponsored', 2], async (err)=>{
        if (err) {
            console.log('Error adding sponsored post: ', err);
            return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error: ', alertMessage: 'Error adding sponsored post', alertColor: 'red'});
        } else{
            console.log('Successfully added sponsored post');

            try {
                // Update the has_shared_post column of the user
                const updateHasJoinedPlatformColumn = await adminFunctions.updateHasJoinedPlatformColumn();

                // Update the credited_task2 column
                const creditedTask2Column = await adminFunctions.creditedTask2Column(1);

                return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Success: ', alertMessage: 'Successfully added sponsored post', alertColor: 'green'});
            } catch (error) {
                return res.render(path.join(__dirname , '../views/Admin Pages/Add Post1'), {alertTitle: 'Error: ', alertMessage: 'An error ocurred', alertColor: 'red'});
            }
        }
    });
});

// Route to turn on mystery_box
router.post('/toggle-on-mystery-box', verifyToken.verifyAdminToken, async (req, res) => {
    const status = req.body.status;

    // Promisify connection.query for easier async handling
    const queryAsync = (query, params) => new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    // Begin the transaction
    connection.beginTransaction(async (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ err: 'An error occurred' });
        }

        try {
            // Update the settings table to toggle the mystery box
            await queryAsync('UPDATE settings SET active_status = ? WHERE setting = ?', [status, 'mystery_box']);
            console.log(`Successfully turned ${status} mystery_box`);

            // Update the users table, resetting has_claimed and assigning random mystery_value
            await queryAsync('UPDATE users SET has_claimed_gift = FALSE, mystery_value = FLOOR(1 + RAND() * 100)');
            console.log('Successfully assigned random numbers to users');

            // Commit the changes if both queries succeed
            connection.commit((commitErr) => {
                if (commitErr) {
                    console.error('Error committing transaction:', commitErr);
                    return connection.rollback(() => {
                        res.status(500).json({ err: 'An error occurred while committing' });
                    });
                }
                console.log('Successfully committed transaction');
                res.status(200).json({ success: `Successfully turned ${status} mystery_box` });
            });

        } catch (queryErr) {
            console.error('Error in transaction, rolling back:', queryErr);
            connection.rollback(() => {
                res.status(500).json({ err: 'An error occurred during the transaction' });
            });
        }
    });
});

// Route to turn off mystery_box
router.post('/toggle-off-mystery-box', verifyToken.verifyAdminToken, async (req, res) => {
    const status = req.body.status;

    // Promisify connection.query for easier async handling
    const queryAsync = (query, params) => new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });

    // Begin the transaction
    connection.beginTransaction(async (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ err: 'An error occurred' });
        }

        try {
            // Update the settings table to toggle the mystery box
            await queryAsync('UPDATE settings SET active_status = ? WHERE setting = ?', [status, 'mystery_box']);
            console.log(`Successfully turned ${status} mystery_box`);

            // Update the users table, resetting has_claimed and assigning random mystery_value
            await queryAsync('UPDATE users SET has_claimed_gift = TRUE, mystery_value = NULL');
            console.log('Successfully set has_claimed_gift to TRUE and set mystery_value to NULL');

            // Commit the changes if both queries succeed
            connection.commit((commitErr) => {
                if (commitErr) {
                    console.error('Error committing transaction:', commitErr);
                    return connection.rollback(() => {
                        res.status(500).json({ err: 'An error occurred while committing' });
                    });
                }
                console.log('Successfully committed transaction');
                res.status(200).json({ success: `Successfully turned ${status} mystery_box` });
            });

        } catch (queryErr) {
            console.error('Error in transaction, rolling back:', queryErr);
            connection.rollback(() => {
                res.status(500).json({ err: 'An error occurred during the transaction' });
            });
        }
    });
});

// Route to approve withdrawal
router.get('/withdrawal/approve/:id', async(req, res)=>{
    let withdrawalId = req.params.id;
    console.log('Withdarwal Id: ', withdrawalId);
    
    try {
        
        // Use id to fetch withdrawal details
        const withdrawal = await adminFunctions.specificWithdrawal(withdrawalId);

        // Now insert into the approved withdrawals table
        const insertDetails = await adminFunctions.insertIntoApprovedWithdrawals(withdrawalId, withdrawal.user_id, withdrawal.user, withdrawal.amount, withdrawal.withdrawal_date, withdrawal.withdrawal_type, withdrawal.bank, withdrawal.account_number, withdrawal.account_name);

        res.redirect('/pending-affiliate-withdrawals');
    } catch (error) {
        console.log('Internal server error: ', error);
        res.redirect('/pending-affiliate-withdrawals');
    }

    
});

module.exports = router;