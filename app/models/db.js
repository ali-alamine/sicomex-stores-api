'user strict';

var mysql = require('mysql');
//local mysql db connection

var connection = mysql.createConnection({
      host     : 'localhost',// 'database-2.chrjj6sace1q.af-south-1.rds.amazonaws.com',
      user     : 'petitem',
      password : 'U<U[{Bc+C!3sdRn2{{2t}?#m',
      database : 'sicomex-stores-new'//'sicomex_stores_new'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
module.exports = connection;