let mongoose = require('mongoose');

// Set up Mongo
mongoose.Promise = global. Promise;
mongoose.connect('mongodb://localhost:27017/test', () => {
  console.log('DB connection open');
});

mongoose.export = {mongoose};
