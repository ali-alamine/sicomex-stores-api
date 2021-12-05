const http = require('http');
const cors = require('cors');

const fs = require('fs');
const express = require('express'),
  app = express();
app.use(cors());
/*var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.petitemonnaie.online/privkey.p                                                                                                             em'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.petitemonnaie.online/fullchai                                                                                                             n.pem')
};*/
bodyParser = require('body-parser');
port = process.env.PORT || 4000;


console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route

var is_prod=false;

if(is_prod){
  http.createServer({
    //key: fs.readFileSync('./key.pem'),
    //cert: fs.readFileSync('./cert.pem'),
    //passphrase: 'pm12'
  }, app).listen(4000);
  var nginx = require('nginx-server');

var options = {
        // config: __dirname + '/etc/nginx/site-available/api.petitemonnaie.onli                                                                                                             ne.conf',
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
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);
