"use strict";
var express = require('express');
var app = express();
var User = require('./models/user')
var Comment = require('./models/comment')

var user = new User('pee');
var comment = new Comment();
// generateModels();
generateEntries();

function generateEntries(){
	user.create('users', {
		username: 'shaun',
	})
}
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});

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
