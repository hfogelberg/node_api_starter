const express = require('express'),
          app = express(),
          cors = require('cors'),
          bodyParser = require('body-parser'),
          mongoose = require('./server/db/mongoose'),
          fs = require('fs'),
          {api} = require('./server/api/api');

// *** App config ***
// Server settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//  Register api
api(app, mongoose);

// logging
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}\n`;
  fs.appendFile('server.log', log, (err) => {
    if(err) {
      console.log('Unable to find log file');
    }
  });
  next();
});

// Default route to static html page
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
