'user strict';

var mysql = require('mysql');
//local mysql db connection

var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '91j3funfidiuayfihun243unf78J@',
      database : 'sicomex-stores-new'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection;