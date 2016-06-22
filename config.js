var fb = require('./lib/ActiveFire');
module.exports = {activeFire: new fb('./ENV/service.json', 'https://active-record.firebaseio.com')}
