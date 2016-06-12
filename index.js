"use strict";
var express = require('express');
var app = express();
var fb = require('./lib/activefire');

var activeFire = new fb.activefire('./service.json', 'https://active-record.firebaseio.com');
activeFire.create({'cat': 'vivian'});
// new Model(Cats, [new Property('name', 'String'), new Property('age', 'Integer'), new Property('toys', 'toys')])

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('IM LISTENING!!!!!!!!!');
});