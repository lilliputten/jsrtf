var rtf = require('../lib/rtf'),
    TableElement = require('../lib/elements/table'),
    fs  = require('fs');
var myDoc = new rtf(),
    table = new TableElement(),
    table2 = new TableElement();

//add rows
table.addRow(["I'm a table row", "with two columns"]);
table.addRow(["This is the second row", "and the second column"]);

myDoc.addTable(table);

//You can manually set the data *overwrites any data in the table
table2.setData([
                  ["Name", "Price", "Sold"],
                  ["Rubber Ducky", "$10.00", "22"],
                  ["Widget", "$99.99", "42"],
                  ["Sproket", "$5.24", "11"]
              ]);
//adding a row to an existing data set
table2.addRow(["Banana", "$0.12", "1"]);

myDoc.createDocument(
    function(err, output){
        console.log(output);
        fs.writeFile('table-sample.rtf', output, function (err) {
          if (err) return console.log(err);
        });
    }
);