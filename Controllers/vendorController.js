const express = require('express');

const router = express.Router();

const md5 = require('md5');

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

    res.render('vendor-dashboard', {user: fetchUserByUsername[0], getActiveCoupons, getUsedCoupons, referrals: getReferrals[0].referrals});
  }
});

module.exports = router;