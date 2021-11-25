'user strict';

var mysql = require('mysql');
//local mysql db connection

var connection = mysql.createConnection({
      host     : 'database-2.chrjj6sace1q.af-south-1.rds.amazonaws.com',
      user     : 'admin',
      password : 'sicomex-stores',//'91j3funfidiuayfihun243unf78J@',
      database : 'sicomex_stores_new'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection;