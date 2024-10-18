const mysql = require('mysql');

// Setup MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zenwealthDB',
  });

module.exports = connection;