const cors = require('cors');

const express = require('express'),
  app = express(),

bodyParser = require('body-parser');
port = process.env.PORT || 4000;
app.use(cors())

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route