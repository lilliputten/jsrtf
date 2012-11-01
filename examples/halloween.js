var rtf = require('../lib/rtf'),
    Format = require('../lib/format'),
    Utils = require('../lib/rtf-utils'),
    fs  = require('fs');
var myDoc = new rtf(),
    format = new Format();

format.color = Utils.Colors.ORANGE;
myDoc.writeText("Happy Halloween", format);
myDoc.addPage();
myDoc.addLine();
myDoc.addTab();
myDoc.writeText("Trick or treat!");
var output = myDoc.createDocument();
console.log(output);
fs.writeFile('halloween.rtf', output, function (err) {
  if (err) return console.log(err);
});