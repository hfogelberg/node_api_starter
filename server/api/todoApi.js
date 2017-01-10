let todoApi = (app, mongoose) => {
  let {User} = require('../models/user'),
        {errLogger} = require('../utils/errLogger'),
        {authenticate} = require('../middleware/authenticate');

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

}

module.exports = {todoApi};
