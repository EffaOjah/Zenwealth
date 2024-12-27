require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Setup MySQL connection
const connection = require('./db/db.js');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

// Set view engine
app.set('view engine', 'ejs');

// Initialize body parser
app.use(bodyParser.urlencoded({extended: true}));

// Use express.json
app.use(express.json());


// Set up session middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));


// Connect database
connection.connect(err => {
    if(err){
        console.log('Database connection failed');
    } else {
        console.log('Database connection successful');
    }
});

// Serve static files
app.use(express.static('public'));

// Require controllers
const authController = require('./Controllers/authController.js');
const viewPagesController = require('./Controllers/viewPagesController.js');
const dashboardPagesController = require('./Controllers/dashboardPagesController.js');
const vendorController = require('./Controllers/vendorController.js');
const adminController = require('./Controllers/adminController.js');

// Use the route
app.use(authController);
app.use(viewPagesController);
app.use(dashboardPagesController);
app.use(vendorController);
app.use(adminController);


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})