"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/activefire');

var activeFire = new fb.activefire('./ENV/service.json', 'https://active-record.firebaseio.com');





generateModels(){
	activeFire.newModel('comments',{
		user: 'string',
		body: 'string'
	})

	activeFire.newModel('users',{
		username: 'string'
	})
}

generateEntries(){
	activeFire.newEntry('comments', 'comment3', {
		user: 'vivian',
		body: 'this is vivians fucking comment'
	})

	activeFire.newEntry('users','vivian',{
		username: 'vivian',
	})
}
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});
