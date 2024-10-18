require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;

    if (!token){
        return res.status(403).json({message: 'Token is not provided'});
    }

    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            return res.status(401).json({message: 'Invalid token'});
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;