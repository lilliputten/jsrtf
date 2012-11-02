var rtf = require('../lib/rtf'),
    Format = require('../lib/format'),
    Colors = require('../lib/colors'),
    fs  = require('fs');
var myDoc = new rtf(),
    format = new Format();

format.color = Colors.ORANGE;
myDoc.writeText("Happy Halloween", format);
myDoc.addPage();
myDoc.addLine();
myDoc.addTab();
myDoc.writeText("Trick or treat!");
myDoc.createDocument(
    function(err, output){
        console.log(output);
        fs.writeFile('halloween.rtf', output, function (err) {
          if (err) return console.log(err);
        });
    }
);