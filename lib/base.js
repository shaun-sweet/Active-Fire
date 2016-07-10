class Base {
	constructor(){
		this.firebase = that;
		this.queryObject;
	}

	create(entryName, properties){
		//read the schema and do error checking on their entry
		this.firebase.database().ref('/schema/' + this.modelName).once('value', (snapshot) => {
			if (this._checkIfModelExists(snapshot.val()) && this._checkPropTypesAgainstSchema(snapshot.val(), properties)) {

				this.firebase.database().ref('/' + this.modelName).once('value', (modelSnap) => {
					// Checks if modelName entry is unique
					if (modelSnap.child(entryName).exists()) {
						try {
							throw new Error(""+ entryName+" already exists in "+ this.modelName+", if you want to overwrite it, delete it first, then try this command again.")
						} catch(e){
							console.log(e);
						}

					}else{
						//write to firebase
						this.firebase.database().ref(snapshot.val()._ref).child(entryName).set(properties);
						this.queryObject = {entryName: properties};
						console.log("Wrote new entry to " + this.modelName + ".");
					}
				})
			}
		})
		return new ActiveFireObject(properties);
	}

	query(){
		f.database().ref('/comments/-KKqJo32t-SvptWt8wO-/user').once('value', (snap) => {
			f.database().ref('/users/'+snap.val()+'/username').once('value', (snapshot) => {snapshot.val()})
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
module.exports = Base;