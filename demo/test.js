
var rtf = require('../rtf'),
    TableElement = require('../lib/elements/table'),
    Language = require('../lib/language'),
    path  = require('path'),
    fs  = require('fs-extra')
;

// create rtf
var myDoc = new rtf();
myDoc.language = Language.RU;

myDoc.writeText('demo');

// add table
var table = new TableElement();
//add rows
table.addRow(['Table row', 'with two columns']);
table.addRow(['Second row', 'and the second column']);
myDoc.addTable(table);

// add table
var table2 = new TableElement();
// You can manually set the data *overwrites any data in the table
table2.setData([
    ['Name', 'Price', 'Sold'],
    ['Rubber Ducky', '$10.00', '22'],
    ['Widget', '$99.99', '42'],
    ['Sproket', '$5.24', '11']
]);
//adding a row to an existing data set
table2.addRow(['Banana', '$0.12', '1']);
myDoc.addTable(table2);

// writing file
var resultFile = __dirname + '/.results/demo.rtf';
var content = myDoc.createDocument();
fs.ensureDirSync(path.dirname(resultFile));
fs.writeFile(resultFile, content, function (error) {
    if ( !error ) {
        console.info('Created file ' + resultFile);
    }
    else {
        console.error(error);
    }
});
