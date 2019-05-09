var mysql = require('mysql');

var con = mysql.createPool({
  host: "us-cdbr-iron-east-02.cleardb.net",
  user: "bad8119fff86d4",
  password: "0a0ab0a6",
  database: "heroku_d2d4fb60e781177"
});


module.exports = con;