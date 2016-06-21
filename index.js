"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/activefire');

var activeFire = new fb.activefire('./ENV/service.json', 'https://active-record.firebaseio.com');


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
	activeFire.newEntry('comments', {
		user: 'vivian',
		body: 'this is vivians fucking comment'
	})

	activeFire.newEntry('users', {
		username: 'vivian',
	})
}
