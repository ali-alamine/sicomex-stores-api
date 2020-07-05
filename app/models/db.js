'user strict';

var mysql = require('mysql');

//local mysql db connection
var is_prod = true;
if(is_prod){
  var connection = mysql.createConnection({
      host     : 'sicomex-stores-new.czgv9lejumuk.us-east-1.rds.amazonaws.com',
      user     : 'root',
      password : 'sicomex_stores',
      database : 'sicomex_stores_new'
  });
}else{
  var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'sicomex-stores-new'
  });
}

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection;