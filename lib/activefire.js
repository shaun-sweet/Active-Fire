"use strict";
var firebase = require('firebase');

class ActiveFire{

	constructor(serviceAccount, databaseURL){
		// holds authenticated firebase package object
		this.firebase = this._initializeFirebaseApp(serviceAccount, databaseURL)
	}

	_initializeFirebaseApp(serviceAccount, databaseURL){
		return firebase.initializeApp({
		  serviceAccount: serviceAccount,
		  databaseURL: databaseURL
		});
	}

	newModel(name, properties){
		
		return var name = new Base(name, properties);
	}

}


cat.all()

class Base{

	constructor(name, properties, ref){
		this.name = name;
		//all properties of the model
		this.properties = properties;
		//full path in firebase
		this.ref = ref;
	}

	create(obj){
		this.firebase.database().ref('/').push(obj);
		return true;
	}

	query(){
		return this.firebase.database().ref('/');
	}

}

class Property{

	constructor(name, type){
		this.name = name;
		this.type = type;
	}

}

module.exports = {activefire: ActiveFire, base: Base};