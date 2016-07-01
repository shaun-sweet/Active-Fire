"use strict";
var express = require('express');
var app = express();
var User = require('./models/user')
var Comment = require('./models/comment')
var config = require('./config')

var activeFire = config.activeFire;
var user = new User();
var comment = new Comment();


// generateModels();
// generateEntries();


comment.create("this doesn't work",{
  body: "this is a fucking comment",
  user: 'shaun', })
// var u = new User({})
// console.log(x.body);

function generateEntries(){

	user.create('vivian', {
		username: 'vivians',
	})



  // comment.create({
  //   body: "this is a fucking comment",
  //   user: 'shaun',
  // })
  //
  // comment.create({
  //   body: 'this is vivians comment',
  //   user: 'vivian'
  // })

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
