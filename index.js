"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/activefire');

var activeFire = new fb.activefire('./service.json', 'https://active-record.firebaseio.com');
activeFire.newModel('vivian',
						{ name: 'string',
							age: 'number',
							breed: "string",
							kittens: 'kitten'
							})
// activeFire.create('cat','pee',{
// 	name: 'fluffers',
// 	age: 20
// })

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});
