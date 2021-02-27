//const config = require('./config');
const crecry = require('./CreCry');
const mysql = require('mysql');

const conn = mysql.createConnection({
    host     : crecry.dbhost,
    user     : crecry.dbusername,
    password : crecry.dbpassword,
    database : crecry.db
});

module.exports = conn;