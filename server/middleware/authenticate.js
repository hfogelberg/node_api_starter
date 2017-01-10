let {User} = require('../models/user');

let authenticate = (req, res, next) =>{
  console.log('authenticate');
  let token = req.header('x-auth');
  console.log(token);

  User.findByToken(token)
       .then((user) => {
         if (!user) {
           console.log('User with token not found');
           return Promise.reject();
         }

         req.user = user;
         req,token = token;
         next();
       })
       .catch((err) => {
         console.log((err));
         res.status(401).send();
       });
}

module.exports = {authenticate}
