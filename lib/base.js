var ActiveFire = require('./ActiveFire');

class Base extends ActiveFire {
	constructor(){
    super()
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
module.exports = Base;
