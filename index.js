"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/ActiveFire');
var Base = require('./lib/Base')


var activeFire = new fb('./ENV/service.json', 'https://active-record.firebaseio.com');
var base = new activeFire.base();
class User extends activeFire.base {
  constructor(){
    super()
  }


}
var u = new User('pee');


// generateModels();
generateEntries();

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});

// function seed(){
// 	return new Promise((resolve,reject)=>{
// 		generateModels();
// 		resolve();
// 	})
// }
function generateModels(){
	activeFire.newModel('comments',{
		attributes: {
			user: 'string',
			body: 'string',
		},
		relationships: {
			users: 'belongs_to'
		}
	})

	activeFire.newModel('users',{
		attributes: {
			username: 'string'
		},
		relationships: {
			comments: 'has_many'
		}
	})
}



function generateEntries(){
	u.create('comments', {
		user: 'vivian',
		body: 'this is vivians fucking comment'
	})

	// activeFire.newEntry('users', {
	// 	username: 'shaun'
	// })
  //
	// activeFire.newEntry('comments', {
	// 	user: 'shaun',
	// 	body: 'this is shauns fucking comment'
	// })
  //
	// activeFire.newEntry('users', {
	// 	username: 'vivian',
	// })
}
