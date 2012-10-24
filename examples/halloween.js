var rtf = require('../lib/rtf'),
    Format = require('../lib/format'),
    Utils = require('../lib/rtf-utils');
var myDoc = new rtf(),
    format = new Format();

format.color = Utils.Colors.ORANGE;
myDoc.writeText("Happy Halloween", format);
myDoc.addPage();
myDoc.addLine();
myDoc.addTab();
myDoc.writeText("Cool RTF doc!");
console.log(myDoc.createDocument());