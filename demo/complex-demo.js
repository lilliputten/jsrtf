
const resultFile = __dirname + '/.results/complex-demo.rtf';

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
        defaultFontSize = 12,
        titleStyle = new jsRTF.Format({
            spaceBefore : 500,
            spaceAfter : 500,
            paragraph : true,
            align : 'center',
            fontSize : 30,
            color : jsRTF.Colors.ORANGE,
            border : { type : 'single', width : 10, color : jsRTF.Colors.RED },
            // borderColor : jsRTF.Colors.RED,
            borderTop : { type : 'double', width : 50, spacing : 100, color : jsRTF.Colors.GREEN },
        }),
        emphasisStyle = new jsRTF.Format({
            color : jsRTF.Colors.darkGreen, // Custom color added above
        }),
        textStyle = new jsRTF.Format({
            spaceBefore : 300,
            spaceAfter : 300,
            paragraph : true,
            fontSize : defaultFontSize,
            color : jsRTF.Colors.BLACK,
        })
    ;

    // Adding text styled with formatter
    myDoc.writeText('Title', titleStyle);

    // Adding complex element with inline and default stylings
    myDoc.addElement([
        new jsRTF.ContainerElement([
            new jsRTF.TextElement('Striked ', emphasisStyle),
            'content and',
        ], { strike : true }),
        new jsRTF.TextElement(' display `textStyle` variable: ', emphasisStyle),
        new jsRTF.TextElement(JSON.stringify(textStyle)), // TODO: Code coloring plugin?
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
                // tableBorder : 10,
                tableWidth : contentWidth,
            }),
            rowFormat : new jsRTF.Format(Object.assign({}, cellBaseProps, {
                // rowBorderTop : { type : 'single', width : 10, color : jsRTF.Colors.GREEN }, // ???
                // strike : true,
                // color : jsRTF.Colors.GRAY,
            })),
            firstRowFormat : new jsRTF.Format(Object.assign({}, cellBaseProps, {
                cellVerticalAlign : 'bottom',
                tableHeader : true,
                bold : false,
                color : jsRTF.Colors.WHITE,
                cellBgColor : jsRTF.Colors.RED,
            })),
            cellFormat : new jsRTF.Format({
                cellBorderRight : { type : 'single', width : 10, color : jsRTF.Colors.BLACK },
                cellBorderTop : { type : 'single', width : 10, color : jsRTF.Colors.BLACK },
                cellBorderLeft : { type : 'single', width : 10, color : jsRTF.Colors.BLACK },
                cellBorderBottom : { type : 'single', width : 10, color : jsRTF.Colors.BLACK },
            }),
            cellFormats : [
                new jsRTF.Format({ widthRatio : 0.2, strike : true, bold : true, color : jsRTF.Colors.GREEN }),
                new jsRTF.Format({ widthPercents : 80, underline : true, color : jsRTF.Colors.MAROON }),
            ],
        })
    ;
    // Add rows
    table.addRow([ 'Table row', 'with two\ncolumns' ]);
    table.addRow([ 'Second row', 'and the second column' ]);
    myDoc.addTable(table);

    myDoc.writeText('Demo text.', textStyle);

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

