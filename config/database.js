var mysql = require('mysql');
var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'project_nodejs_react'
});
module.exports = connection;