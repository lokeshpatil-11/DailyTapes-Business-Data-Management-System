var mysql = require('mysql2')
var constants = require("../constants");

module.exports = dbpool = mysql.createPool({
  host: 'localhost',
  user: constants.DATABASE_USER,
  password: constants.DATABASE_PASS,
  database: 'inv_db',
  multipleStatements: true
})