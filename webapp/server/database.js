const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '0775808024Em', 
    database: 'user_database',
});

module.exports = pool.promise();