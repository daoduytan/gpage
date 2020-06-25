const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10) || 10;

module.exports = {
  password_hash: password => bcrypt.hashSync(password, salt),

  password_valid: (password, password_hash) =>
    bcrypt.compareSync(password, password_hash),
};
