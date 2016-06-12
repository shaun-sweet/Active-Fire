var jsonfile = require('jsonfile')
var file = './butts/text.json'
var obj = {name: 'JP'}
 
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})

jsonfile.readFile(file, function(err, obj) {
  console.dir(obj)
})