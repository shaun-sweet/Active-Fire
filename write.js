const fs = require('fs');

fs.rename('./butts/text.txt', '.butts/thiswaschanged.txt', (err) => {
  if (err) throw err;
  console.log('successfully renamed stuff');
});