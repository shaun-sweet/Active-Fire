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

var d = user.findBy("username", "vasdfaivians")
console.log(d);
// var u = new User({})
// console.log(x.body);

function generateEntries(){

	user.create('vivianafdssadfasd', {
		username: 'vasdfaivians',
	})
	user.create('viviandasfasfdsa', {
		username: 'vivasdfasdians',
	})
	user.create('vivianasdfasdfads', {
		username: 'vivsdfasdfsaians',
	})
	user.create('viviafasdfadfan', {
		username: 'vivdsafdsians',
	})
	user.create('viviasdfasdan', {
		username: 'vivdsfadsfadsians',
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
