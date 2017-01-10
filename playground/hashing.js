const {SHA256} = require('crypto-js');
//
// let message = 'I am user number 3';
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}, \nHash: ${hash}`);

var data = {
  id: 5,
}


var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secret').toString()
}

token.data.id = 6;
token.hash = SHA256(JSON.stringify(token.data)).toString();


let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

if (resultHash === token.hash){
  console.log('Data was not changed');
} else {
  console.log('Data was changed');
}
