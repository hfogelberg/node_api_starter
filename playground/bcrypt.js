const bcrypt = require('bcryptjs');

let password = 'abc123!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedPassword = '$2a$10$ZGa6I8stSv.EOqoArlYcf.cP851wW2zOND4yk0xsyTMcJNK7fchWG';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
