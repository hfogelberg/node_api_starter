let api = (app, mongoose) => {
  let {userApi} = require('./userApi'),
        {todoApi} = require('./todoApi');

  userApi(app, mongoose);
  todoApi(app, mongoose);

  // quick test
  app.get('/api', (req, res) => {
    res.send({'message': 'API is alive'});
  });
};

module.exports = {api};
