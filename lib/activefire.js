"use strict";
var firebase = require('firebase');

class ActiveFire{

	constructor(serviceAccount, databaseURL){
		// holds authenticated firebase package object
		this.firebase = this._initializeFirebaseApp(serviceAccount, databaseURL);
	}

	newModel(modelName, properties){
		this._writeSchemaIfNoSchema()
		if (this._checkForDuplicateModelAndCreate(modelName)) {
			//set up the json and add it to the schema
			var schema = this._buildJsonSchema(modelName, properties);
			this._writeJsonToSchema(modelName, schema);
		}
	}

	newEntry(modelName, entryName, properties){
		//read the schema and do error checking on their entry
		this.firebase.database().ref('/schema/' + modelName).once('value', (schema) => {
			if (this._checkIfModelExists(schema.val()) && this._checkPropTypesAgainstSchema(schema.val(), properties)) {
				// Checks if modelName entry is unique
				this.firebase.database().ref(schema.val()._ref).once('value', (snapshot)=>{
					if (snapshot.child(entryName).exists()) {
						console.error(""+ entryName+" already exists in "+modelName+", if you want to overwrite it, delete it first, then try this command again.")
					}else{
						//write to firebase
						this.firebase.database().ref(schema.val()._ref).child(entryName).set(properties);
						console.log("Wrote to " + modelName + ", entry: "+ entryName +" to firebase!")
					}
				})
			}
		})
	}

	_checkIfModelExists(schema){
		if(schema == null){
			console.error("Model not created for this entry type, try running activeFire.newModel(modelName, properties)");
			return false;
		}
		return true;
	}

	_checkPropTypesAgainstSchema(schema, properties){
		for (var propertyName in properties) {
			var modelPropertyValue = properties[propertyName];
			//if they added a property that doesnt exist for that modelName, error out
			if (!schema.properties.hasOwnProperty(propertyName)){
				console.error('property ' + propertyName + ' is not a property of this model');
				return false;
			}else{
				//if they entered a property with the wrong type, error out
				if(typeof modelPropertyValue != schema.properties[propertyName].type){
					console.error('the value given for property' + propertyName + ' has the incorrect type for this model');
					return false;
				}
			}
		}
		return true;
	}

	_initializeFirebaseApp(serviceAccount, databaseURL){
		return firebase.initializeApp({
		  serviceAccount: serviceAccount,
		  databaseURL: databaseURL
		});
	}

	_writeSchemaIfNoSchema(){
		this.firebase.database().ref('/').once('value', (snapshot) => {
			if (snapshot.child('schema').exists()) {
				return;
			}else{
				this.firebase.database().ref('/').child('schema').set('null');
				console.log("first time setup...making schema on firebase...")
			}
		})
	}

	_checkForDuplicateModelAndCreate(name){
		this.firebase.database().ref("/").once('value', (snapshot)=>{
			if (snapshot.child(name).exists()) {
				console.error("Model "+ name+" already exists on firebase, if you want to overwrite it, delete it first, then try this command again.")
				return false;
			}else{
				//create the model in firebase
				this.firebase.database().ref('/').child(name).set('null');
				console.log("Wrote model: "+ name)
				return true;
			}
		})
	}

	_buildJsonSchema(name, properties){
		var ref = "/" + name;
		var primitives = {'string': true, 'number':true, 'boolean': true};
		var dependencies = {};
		var formattedProperties = {};
		for (var key in properties) {
			var val = properties[key];
			if (!primitives.hasOwnProperty(val)){
				dependencies[val] = true;
			}
			formattedProperties[key] = {name: key, type: val};
		}
		return {
				_dependencies: dependencies,
				_ref: ref,
				properties: formattedProperties
		};
	}

	_writeJsonToSchema(modelName, schema){
		this.firebase.database().ref('/schema').child(modelName).set(schema);
	}
// end of class
}

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

module.exports = {activefire: ActiveFire, base: Base};

//do we even need the base class anymore?
//if we store each schema as json then we would only need FUNCTIONS that access each json object. we could just as well put these functions inside the ActiveFire class what do you think?

//***********************************************

//proposed structure of schema.json:

//to check if the person is instantiating a cat with a name of correct type see if the type = cat.properties.name.type

/* REASONING: redundantly add the key so that it becomes easy to look things up in firebase dynamically with code.

firebase-query(ref + '/' + cat.name.key)

(function names to be determined, this is just an example for explanation's sake) */

/*
{
	cat: {
		properties: {
			name: {
				key: 'name',
				type: 'string'
			},
			age:{
				key: 'age',
				type: 'number'
			},
			kittens:{
				key: 'kittens',
				type: 'kitten'
			}
		}
		_dependencies: {kitten:true},
		_ref: '/cat'
	}

	kitten: {
		properties: {
			name: {
				key: 'name',
				type: 'string'
			},
			age:{
				key: 'age',
				type: 'number'
			},
			cats:{
				key: 'cats',
				type: 'cat'
			}
		}
		_dependencies: {cat:true},
		_ref: '/kitten'
	}

}

*/



//***********************************************

//proposed structure of THE FIREBASE DATABASE

/*

{
	cats: {

		catName: {
			name: 'Whiskers',
			age: 5,
			kittens: {
				mittens: true;
				boots: true;

				//this allows us both to check quickly for membership (is boots a kitten of whiskers? ===> does whiskers/kittens/boots exist??)

				//AND allows us to easily check the properties of that kitten (what are the ages of whiskers' kittens? ===> for each key in kittens, ('/kitten/' + key + '/age'))

			}
		}

	}

	kittens:{

		mittens: {
			name: 'Mittens',
			age: 0,
			cats:{
				whiskers: true;
			}
		}

		boots:{
			name: 'Boots',
			age: 0,
			cats:{
				whiskers: true;
			}
		}

	}

}

*/
//**************************************************
//FIREBASE CAPABILITIES

//(for quick lookup + easy planning)

/*

1. SNAPSHOT STUFF
(gives you a copy of the current json at the reference you specify and lets you do stuff with it)

// KEY + REF - properties of a snapshot that help u figure out where it was taken

--- AVAILABLE METHODS

// CHILD - Takes in a key, allows you to traverse to that child key

// VAL - Return the value at a location (the whole value object) returns null if the location doesn't exist (not a valid key etc etc)

// EXISTS - Does this key exist k lol

// FOREACH - Loop through all children in order

// EXPORTVAL - holy shit.... exports the whole json as a javascript object alsdkjflaksjdfkj

2. QUERY STUFF
(lets you filter your query so you only get what you need)
(returns your stuff as a datasnapshot)

//LIMIT TO FIRST/LIMIT TO LAST - get the first or last X children

//EQUALTO - Find all dinosaurs whose height is exactly 25 meters

//ORDERBY - order by child, key, etc

3. REFERENCE STUFF

//PUSH - generates unique key and adds as child

//REMOVE - remove data including children

//SET - write data to a location (overwrites the value at that key) (we will probably be using this a lot)


*/

//**************************************************

//we mimic the following active record functions:

/*
	0. make model
		- INPUT: user enters the schema they want
		- create a new top level key (using the name of the model that the user provided)
		- then store the schema in json format in a new entry under schema.json
			- store the reference to the key we created in firebase under _ref
			- any non-primitive property types the user specified will be stored under _dependencies

	1. create
		- INPUT: name of model they want to create a new instance of, value of each property
		- iterate through the schema.json properties object of that model, and make sure the value of each property is valid
		- go into the dependencies and add the entry to all dependent models in firebase (do we wanna error if the dependencies don't exist yet? left it blank for now)
		- if shitty ? return error : else create a new instance in firebase

		3. relationships
		belongs to
		has many
		many to many
		create


	2. all
		- INPUT: a reference (either to a model (all cats) or a relation (all kittens of a cat))
		- snapshot the whole firebase entry under the reference
		- return an array of objects (use exportval)

	4. find by/where
		- INPUT: a query
		- very similar to 3, make firebase calls w/ queries (using equalto)

	5. update
		- INPUT: a property and a model
		- check the schema.json to make sure it is a valid update
		- check if it is a dependant update
		- use set to update in firebase

	6. delete
		- INPUT: an instance of the model to delete
		- check its dependencies
		- use remove to delete in firebase


*/
