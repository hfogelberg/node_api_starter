let express = require('express'),
          app = express(),
          fs = require('fs')
          jwt = require('jsonwebtoken'),
          bodyParser = require('body-parser'),
          _ = require('lodash'),
          bcrypt = require('bcrypt'),
          {authenticate} = require('./middleware/authenticate'),
          {mongoose} = require('./db/mongoose'),
          {User} = require('../models/user'),
          {Todo} = require('../models/todo');

// Server settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

//  *** API
// users
//login
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

// sign up
app.post('/api/users', (req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// private route
app.get('/api/me', authenticate, (req, res) =>{
  res.send(req.user);
});

// todos
app.post('/api/todos', authenticate, (req, res) => {
    console.log('POST todo');
    let message = req.body.message;
    let todo = new Todo({
      message,
      _creator: req.user._id
    });
    console.log(todo);
    todo.save()
          .then((doc)=>{
            console.log(`Saved todo: {doc}`);
            res.send({status: 'OK', body: doc})
          })
          .catch((e) => {
            console.log('ERROR', e);
            res.status(404).send();
          });
});

app.get('/api/todos', authenticate, (req, res) => {
  Todo.find({_id: req.user._id})
        .then((doc)=>{
          res.send({status: 'OK', body: doc})
        })
        .catch( (e)=>{
          console.log('ERROR', e);
          res.status(404).send();
        });
});

app.get('/api/todos/:id', (req, res) => {
  let id = req.params.id;
  console.log(`GET dogs by id ${id}`);
  Todo.find({_id: id})
      .then((doc)=>{
        res.send({status: 'OK', body: doc});
      })
      .catch((e)=>{
        console.log('ERROR', e);
        res.status(404).send();
      });
});

app.delete('/api/todos/:id', (req, res) => {
  let id = req.params.id;
  console.log('Delete');
  Todo.remove({_id: id})
      .then((doc)=>{
        res.send({status: 'OK'});
      })
      .catch( (e)=>{
        console.log('ERROR', e);
        res.status(404).send();
      });
});

app.post('/api/todos/:id/edit', (req, res)=>{
  let id = req.params.id;
  let body = _.pick(req.body, ['message', 'completed']);
  console.log(body);

  if(body.completed == 'true' || body.completed == true) {
    body.completedAt = new Date().getTime();
    body.completed = true;
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  console.log('Will update db', body);
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
      .then((todo)=>{
        console.log('Updating');
        if(!todo) {
          return res.status(404).send();
        }
        console.log('Update ok');
        res.send({status: 'OK', body: todo});
      })
      .catch((e)=>{
        res.status(400).send
      });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
