let userApi = (app, mongoose) => {
  let {User} = require('../models/user'),
        {errLogger} = require('../utils/errLogger'),
        {authenticate} = require('../middleware/authenticate');

  // POST - sign up
  app.post('/api/users', (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    var user = new User({email, password});

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      errLogger(e)
       .then(() => {res.status(400).send();})
       .catch(()=>{console.log('Cannot write to log file');
      });
     });
  });

  // POST - login
  app.post('/api/users/login', (req, res) => {
    let email = req.body.email.trim();
    let password = req.body.password.trim();

    console.log(req.body);

    User.findByCredentials(email, password)
           .then((user) => {
             return user.generateAuthToken().then((token) => {
               res.header('x-auth', token).send(user);
             });
           })
           .catch((e) => {
             console.log('Error returning token ', e);
             res.status(400).send();
           });

  });

  // GET me. Authenticated route
  app.get('/api/me', authenticate, (req, res) =>{
    res.send({'message': 'Authenticated'});
  });


}

module.exports = {userApi}
