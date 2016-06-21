"use strict";
var firebase = require('firebase');


class ActiveFire{

	constructor(serviceAccount, databaseURL){
		// holds authenticated firebase package object
		this.firebase = this._initializeApp(serviceAccount, databaseURL);
		var that = this.firebase;
		class Base {
			constructor(){
		  	this.firebase = that;
			}

			create(modelName, properties){
				//read the schema and do error checking on their entry
				this.firebase.database().ref('/schema/' + modelName).once('value', (schema) => {
					if (this._checkIfModelExists(schema.val()) && this._checkPropTypesAgainstSchema(schema.val(), properties)) {
						// Checks if modelName entry is unique
						this.firebase.database().ref(schema.val()._ref).once('value', (snapshot)=>{

								//write to firebase
								this.firebase.database().ref(schema.val()._ref).push(properties);
								console.log("Wrote new entry to " + modelName + ".")
						})
					}
				})
			}

		  _checkIfModelExists(schema){
				if(schema == null){
					try {
						throw new Error("Model not created for this entry type, try running activeFire.newModel(modelName, properties)");
					} catch (e) {
						console.log(e);
					}
					return false;
				}
				return true;
			}

		  _checkPropTypesAgainstSchema(schema, properties){
				for (var propertyName in properties) {
					var modelPropertyValue = properties[propertyName];
					//if they added a property that doesnt exist for that modelName, error out
					if (!schema.attributes.hasOwnProperty(propertyName)){
						console.log(properties);
						console.error('property ' + propertyName + ' is not a property of this model');
						return false;
					}else{
						//if they entered a property with the wrong type, error out
						if(typeof modelPropertyValue != schema.attributes[propertyName].type){
							console.error('the value given for property' + propertyName + ' has the incorrect type for this model');
							return false;
						}
					}
				}
				return true;
			}


		}
		this.base = Base;
	}


	newModel(modelName, properties){
		this._writeSchemaIfNoSchema().then(() => {
			this._checkForDuplicateModelAndCreate(modelName, properties)
		})
	}

	_initializeApp(serviceAccount, databaseURL){
		return firebase.initializeApp({
		  serviceAccount: serviceAccount,
		  databaseURL: databaseURL
		});
	}

	_writeSchemaIfNoSchema(){
		return new Promise((resolve, reject) => {
			this.firebase.database().ref('/').once('value', (snapshot) => {
				if (snapshot.child('schema').exists()) {
					resolve();
				}else{
					this.firebase.database().ref('/').child('schema').set('null');
					console.log("first time setup...making schema on firebase...")
					resolve();
				}
			})
		})
	}

	_checkForDuplicateModelAndCreate(modelName, properties){
		this.firebase.database().ref("/").once('value', (snapshot)=>{
			// if model exists, do this
			if (snapshot.child(modelName).exists()) {
				console.error("Model "+ modelName+" already exists on firebase, if you want to overwrite it, delete it first, then try this command again.")
				return false;
			}else{
				//create the model in firebase
				this.firebase.database().ref('/').child(modelName).set('null');
				console.log("Wrote model: "+ modelName)
				//set up the json and add it to the schema
				var schema = this._buildJsonSchema(modelName, properties);
				this._writeJsonToSchema(modelName, schema);
			}
		})
	}

	_buildJsonSchema(name, properties){
		var ref = "/" + name;
		var acceptableAttributes = {'string': true, 'number':true, 'boolean': true};
		var formattedProperties = {};
		for (var key in properties.attributes) {
			var submittedAttributes = properties.attributes[key];
			if (!acceptableAttributes.hasOwnProperty(submittedAttributes)){
				throw new Error('not an acceptable type for model property');
			}
			formattedProperties[key] = {name: key, type: submittedAttributes};
		}
		return {
				_relationships: properties.relationships,
				_ref: ref,
				attributes: formattedProperties
		};
	}

	_writeJsonToSchema(modelName, schema){
		console.log("writing to fb...")
		console.log("schema = ")
		console.log(schema);
		console.log("model name = ")
		console.log(modelName);
		this.firebase.database().ref('/schema').child(modelName).set(schema);
	}
// end of class
}

module.exports = ActiveFire;


	// 1. create
	// 	- INPUT: name of model they want to create a new instance of, value of each property
	// 	- iterate through the schema.json properties object of that model, and make sure the value of each property is valid
	// 	- go into the dependencies and add the entry to all dependent models in firebase (do we wanna error if the dependencies don't exist yet? left it blank for now)
	// 	- if shitty ? return error : else create a new instance in firebase
	//
	// 	3. relationships
	// 	belongs to
	// 	has many
	// 	many to many
	// 	create
	//
	//
	// 2. all
	// 	- INPUT: a reference (either to a model (all cats) or a relation (all kittens of a cat))
	// 	- snapshot the whole firebase entry under the reference
	// 	- return an array of objects (use exportval)
	//
	// 4. find by/where
	// 	- INPUT: a query
	// 	- very similar to 3, make firebase calls w/ queries (using equalto)
	//
	// 5. update
	// 	- INPUT: a property and a model
	// 	- check the schema.json to make sure it is a valid update
	// 	- check if it is a dependant update
	// 	- use set to update in firebase
	//
	// 6. delete
	// 	- INPUT: an instance of the model to delete
	// 	- check its dependencies
	// 	- use remove to delete in firebase


*/
