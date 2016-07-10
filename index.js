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
generateEntries();
// user.findBy("username", "vasdfaivians").then((snapshot) => {
// 	console.log(snapshot);
// })


user.find("vivian").then((snapshot) => {
	snapshot.comments
})

// var u = new User({})
// console.log(x.body);

function generateEntries(){

	user.create('jim', {
		username: 'jimbob',
		comments: {

		}
	})
	user.create('bib', {
		username: 'bib5464',
	})
	user.create('shaun', {
		username: 'ssweet06',
		comments: {
			comment1: true
		}
	})
	user.create('vivianita', {
		username: 'carlos',
		comments: {

		}
	})
	user.create('vivian', {
		username: 'rules',
		comments: {
			comment2: true
		}
	})


  comment.create("comment1", {
    body: "this is shauns comment",
    user: 'shaun',
  })
  
  comment.create("comment2", {
    body: 'this is vivians comment',
    user: 'vivian'
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
