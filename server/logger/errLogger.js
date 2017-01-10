const fs = require('fs');

let errLogger = (errMsg) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toString();
    const log = `${now}: ${errMsg}\n`;

    fs.appendFile('errors.log', log, (err) => {
      if(err) {
        reject('Unable to find log file');
      } else {
        resolve();
      }
    });
  });
};

module.exports = {errLogger};
