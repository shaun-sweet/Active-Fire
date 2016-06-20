"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/activefire');

var activeFire = new fb.activefire('./ENV/service.json', 'https://active-record.firebaseio.com');

activeFire.newModel('vivianita',
						{ name: 'string',
							age: 'number',
							breed: "string",
							kittens: 'kitten'
							})

// activeFire.newEntry('viviand','katty',{
// 	name: 'flufferss',
// 	age: 1
// })

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});
