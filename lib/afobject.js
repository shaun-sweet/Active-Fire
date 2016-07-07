class ActiveFireObject {
	constructor(obj) {
		this._collectProps(obj);
	}



	_collectProps(obj){
		for(var props in obj){
			this[props] = obj[props];
		}
	}

}
module.exports = ActiveFireObject;