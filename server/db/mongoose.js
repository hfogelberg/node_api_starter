let mongoose = require('mongoose');

// Set up Mongo
mongoose.Promise = global. Promise;
mongoose.connect('mongodb://localhost:27017/todoapp', () => {
  console.log('DB connection open');
});

mongoose.export = {mongoose};
