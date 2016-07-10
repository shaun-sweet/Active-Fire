# Active-Fire
In Development

#Installing
* npm install firebase-relational-orm

# Setup
* Download your service.json from google [Instructions here](https://firebase.google.com/docs/server/setup#add_firebase_to_your_app)
* In the root directory of your app, make an ENV folder and put the file you got from google (service.json) in that folder
* initialize Active Fire with var activeFire = new fb.activefire('./ENV/service.json', 'https://your-apps-url-here.firebaseio.com');

# Config
In a separate file add the following: 
//config.js
```javascript
var af = require('activefire')
module.exports = {activeFive: new af(*service.json*, https://*yourURL*.firebaseio.com)}
```

*Where you want to run the code:*
*imports the object with the ActiveFire instance/Firebase Connection*
var config = require('./config')
var activeFire = config.activeFire;

Note: Because firebase uses websockets with MongoDB it doesn't open and close database connections on every call, it stays open.  For that reason you have to have the same connection open throughout your application.

# Usage

### Creating a model

Create a new javascript constructor or class.  I will be using examples in [ECMAScript 6](http://es6-features.org/).

```javascript
var config = require('../config')
var activeFire = config.activeFire;

class User extends activeFire.base {
  constructor(){
    super();
    this.modelName = 'users';

  }

}

module.exports = User;
```

Another example:

```javascript
var config = require('../config')
var activeFire = config.activeFire;

class Comment extends activeFire.base {
  constructor(){
    super();
    this.modelName = 'comments';
    
  }

}

module.exports = Comment;
```

**IMPORTANT: this.modelName value MUST be a string that matches the following step**

```javascript
activeFire.newModel('users',{
		attributes: {
			username: 'string'
		},
		relationships: {
			comments: 'has_many'
		}
	})
```
comments belonging to the users:

```javascript
activeFire.newModel('comments',{
		attributes: {
			user: 'string',
			body: 'string',
		},
		relationships: {
			users: 'belongs_to'
		}
	})
```







