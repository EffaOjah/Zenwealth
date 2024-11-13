const express = require('express');

const router = express.Router();

const md5 = require('md5');

// Require multer for file upload
const multer = require('multer');

const upload = multer({
    dest: 'public/uploads/profile-pics',
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

// Require the functions middleware
const functions = require('../Functions/functions');

const dashboardFunctions = require('../Functions/dashboardFunctions');

// Middleware to verify JWT token
const verifyToken = require('../Functions/verifyToken');

const connection = require('../db/db');

// Route to get vendor dashboard
router.get('/vendor/dashboard', verifyToken.verifyToken, async(req, res)=>{
  // Fetch user details using username
  const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username); 

  // Get the mystery_box setting
  const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

  // Check if the user is a vendor, before allowing access
  if (fetchUserByUsername[0].is_a_vendor == 0) {
    console.log('User is not a vendor');
    res.send('You are not a vendor');
  } else{
    console.log('User is a vendor');

    // Get the vendor's active coupon codes
    const getActiveCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 0);

    // Get the vendor's used coupon codes
    const getUsedCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 1);

    // Get the user's referrals
    const getReferrals = await dashboardFunctions.getReferrals(fetchUserByUsername[0].referral_code);

    res.render('vendor-dashboard', {user: fetchUserByUsername[0], getMysteryBoxSetting, getActiveCoupons, getUsedCoupons, referrals: getReferrals[0].referrals});
  }
});

// Route for vendor file upload
router.post('/upload-pic', upload.single('image'), verifyToken.verifyToken, async(req, res)=>{
  // Get the user's details
  const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);
  console.log('user: ', fetchUserByUsername[0]);

  // Get the mystery_box setting
  const getMysteryBoxSetting = await dashboardFunctions.getMysteryBoxSetting();

  // Get the vendor's active coupon codes
  // const getActiveCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 0);

  // Get the vendor's used coupon codes
  // const getUsedCoupons = await dashboardFunctions.getCoupons(fetchUserByUsername[0].user_id, 1);

   // Check if file was uploaded
   if (!req.file) {
      console.log('Please provide an image');

      return res.render('update-profile', {user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Please provide an image', alertColor: 'red'});
  }

  // Ensure the file uploaded is of type: image
  if (!req.file.mimetype.startsWith('image/')) {
      console.log('Only image files are allowed!');

      return res.render('update-profile', {user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'Only image files are allowed!', alertColor: 'red'});
  }
  console.log('File uploaded successfully: ', req.file);

  // If file upload was successful, update the database
  connection.query('UPDATE users SET display_image = ? WHERE user_id = ?', [req.file.filename, fetchUserByUsername[0].user_id], async (err)=>{
      if (err) {
          console.log('Error updating the display_image column of the user: ', err);

          return res.render('update-profile', {user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Error: ', alertMessage: 'An error ocurred!', alertColor: 'red'});
      } else{
          console.log('Successfully updated the display_image column of the user');

          // Get the user's details
          const fetchUserByUsername = await dashboardFunctions.fetchUserByUsername(req.user.username);

          return res.render('update-profile', {user: fetchUserByUsername[0], getMysteryBoxSetting, alertTitle: 'Success: ', alertMessage: 'Successfully updated display image', alertColor: 'green'});
      }
  });
});

module.exports = router;