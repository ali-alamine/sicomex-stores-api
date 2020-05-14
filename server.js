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

// function clientErrorHandler (err, req, res, next) {
//   if (req.xhr) {
//      res.status(500).send({ error: 'Something failed!' })
//    } else {
//      next(err)
//   }
// }

// app.use(clientErrorHandler);

var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route