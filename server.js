const cors = require('cors');
const https = require('https');
const fs = require('fs');
const express = require('express'),
  app = express(),

bodyParser = require('body-parser');
port = process.env.PORT || 4000;
app.use(cors())

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route

var is_prod=true;

if(is_prod){
  https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'pm12'
  }, app).listen(4000);
  var nginx = require('nginx-server');
 
var options = {
    config: __dirname + '/test/stubs/nginx.conf',
};
 
  var server = nginx(options);
  
  server.start(function () {
      console.log('started');
  });
  
  server.stop(function () {
      console.log('stopped');
  });
}else{
  app.listen(4000);
}