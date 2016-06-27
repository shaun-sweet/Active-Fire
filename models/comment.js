var config = require('../config')
var activeFire = config.activeFire;

class Comment extends activeFire.base {
  constructor(){
    super();
    this.modelName = 'comments';
    
  }

}

module.exports = Comment;
