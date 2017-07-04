

const resultFile = __dirname + '/.results/demo.rtf';

// YM (DEBUG)
const modules = global.modules = require('ym');
// Preload modules required by jsRTF (in real emnvironment need to be loaded before using jsRTF)...
if ( typeof modules === 'object' ) {
    require('inherit');
}

const jsRTF = require('../jsrtf');

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

    // Extending color table
    Object.assign(jsRTF.Colors, {
        darkGreen : new jsRTF.RGB(0,64,0),
    });

    var
        // Default page margin size (twips)
        pageMargin = 3000,
        // Page options
        pageOptions = {
            // Language: Russian
            language : jsRTF.Language.RU,
            // Set page size: A4 horizontal
            pageWidth : jsRTF.Utils.mm2twips(297),
            pageHeight : jsRTF.Utils.mm2twips(210),
            // Landscape page format -- which effect it making?
            landscape : true,
            // Margins:
            marginLeft : pageMargin,
            marginTop : pageMargin,
            marginBottom : pageMargin,
            marginRight : pageMargin,
        },
        // Calculate content width (for 100% tables, for example)
        contentWidth = pageOptions.pageWidth - pageOptions.marginLeft - pageOptions.marginRight,
        // Create RTF object
        myDoc = new jsRTF(pageOptions)
    ;

    // Formatter object
    var
        titleStyle = new jsRTF.Format({
            spaceBefore : 500,
            spaceAfter : 500,
            paragraph : true,
            align : 'center',
            fontSize : 30,
            color : jsRTF.Colors.ORANGE,
        })
        emphasisStyle = new jsRTF.Format({
            color : jsRTF.Colors.darkGreen, // Custom color added above
        }),
        textStyle = new jsRTF.Format({
            spaceBefore : 300,
            spaceAfter : 300,
            paragraph : true,
        })
    ;

    // Adding text styled with formatter
    myDoc.writeText('Title', titleStyle);

    // Adding complex element with inline and default stylings
    myDoc.addElement([
        new jsRTF.ContainerElement([
            new jsRTF.TextElement('Striked ', emphasisStyle),
            'content',
        ], { strike : true }),
        new jsRTF.TextElement(' textStyle ', emphasisStyle),
        new jsRTF.TextElement(JSON.stringify(textStyle)),
    ], {
        paragraph : true,
        spaceBefore : 500,
        spaceAfter : 500,
    });

    // Add table
    var cellPadding = 100,
        cellBaseProps = {
            spaceBefore : cellPadding,
            spaceAfter : cellPadding,
            leftIndent : cellPadding,
            rightIndent : cellPadding,
        },
        table = new jsRTF.TableElement({
            format : new jsRTF.Format({
                tableBorder : 10,
                tableWidth : contentWidth,
            }),
            rowFormat : new jsRTF.Format(Object.assign({}, cellBaseProps, {
                // strike : true,
                // color : jsRTF.Colors.GRAY,
            })),
            firstRowFormat : new jsRTF.Format(Object.assign({}, cellBaseProps, {
                tableHeader : true,
                bold : false,
                color : jsRTF.Colors.WHITE,
                bgColor : jsRTF.Colors.RED,
            })),
            cellsFormats : [
                new jsRTF.Format({ widthRatio : 0.2, strike : true, bold : true, color : jsRTF.Colors.GREEN }),
                new jsRTF.Format({ widthPercents : 80, underline : true, color : jsRTF.Colors.MAROON }),
            ],
        })
    ;
    // Add rows
    table.addRow([ 'Table row', 'with two columns' ]);
    table.addRow([ 'Second row', 'and the second column' ]);
    myDoc.addTable(table);

    myDoc.writeText('Demo text.', textStyle);
    // myDoc.writeText('demo3', textStyle);
    //
    // // add table
    // var table2 = new TableElement();
    // // You can manually set the data *overwrites any data in the table
    // table2.setData([
    //     ['Name', 'Price', 'Sold'],
    //     ['Rubber Ducky', '$10.00', '22'],
    //     ['Widget', '$99.99', '42'],
    //     ['Sproket', '$5.24', '11']
    // ]);
    // //adding a row to an existing data set
    // table2.addRow(['Banana', '$0.12', '1']);
    // myDoc.addTable(table2);

    // Make content
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

