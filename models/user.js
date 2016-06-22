var config = require('../config')
var activeFire = config.activeFire;

class User extends activeFire.base {
  constructor(){
    super();
    this.modelName = 'users';
  }

}

module.exports = User;
