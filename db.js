var mysql = require('mysql');

var con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "project"
});


module.exports = con;