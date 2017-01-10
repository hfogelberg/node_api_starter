let {SHA256} = require('crypto-js'),
      jwt = require('jsonwebtoken');


var data = {
  id: 5
}

let token = jwt.sign(data, 'secret12345');
console.log(token);

let decoded = jwt.verify(token, 'secret1234');
console.log(decoded);
