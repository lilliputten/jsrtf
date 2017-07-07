
const resultFile = __dirname + '/.results/simple-demo.rtf';

// YM (DEBUG)
const modules = global.modules = require('ym');
// Preload modules required by jsRTF (in real emnvironment need to be loaded before using jsRTF)...
if ( typeof modules === 'object' ) {
    require('inherit');
}

const jsRTF = require('../lib/index');

if ( typeof modules === 'object' ) {
    console.log('Run demo using YM...');
    modules.require([
        'jsrtf',
    ], testRTF);
}
else {
    console.log('Run demo using commonJS...');
    testRTF(jsRTF);
}

function testRTF (jsRTF) {

    // Create RTF object
    var myDoc = new jsRTF({
        // Language: Russian
        language : jsRTF.Language.RU,
        // Set page size: A4 horizontal
        pageWidth : jsRTF.Utils.mm2twips(297),
        pageHeight : jsRTF.Utils.mm2twips(210),
        // Landscape page format -- which effect it making?
        landscape : true,
    });

    // Formatter object
    var textFormat = new jsRTF.Format({
        spaceBefore : 300,
        spaceAfter : 300,
        paragraph : true,
        align : 'center',
    });

    // Adding text styled with formatter
    myDoc.writeText('demo', textFormat);

    // Add table
    var table = new jsRTF.TableElement({
        format : new jsRTF.Format({ tableBorder : 10 }),
        cellFormats : [
            new jsRTF.Format({ bold : true }), // #0
            new jsRTF.Format({ color : jsRTF.Colors.RED }), // #1
        ],
        firstRowFormat : new jsRTF.Format({ italic : true }),
    });
    // Add rows
    table.addRow(['Table row', 'with two columns']);
    table.addRow(['Second row', 'and the second column']);
    myDoc.addTable(table);

    // Make content...
    var content = myDoc.createDocument();

    // Write file...
    writeResult(content);
}

function writeResult (content) {

    const
        // nodejs core...
        path  = require('path'),
        fs  = require('fs-extra')
    ;

    // writing file
    fs.ensureDirSync(path.dirname(resultFile));
    fs.writeFile(resultFile, content, function (error) {
        if ( !error ) {
            console.info('Created file ' + resultFile);
        }
        else {
            console.error(error);
        }
    });

}

