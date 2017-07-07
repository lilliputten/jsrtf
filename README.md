[![GitHub Release](https://img.shields.io/github/release/lilliputten/jsrtf.svg)](https://github.com/lilliputten/jsrtf/releases)
[![Build Status](https://api.travis-ci.org/lilliputten/jsrtf.svg?branch=master)](https://travis-ci.org/lilliputten/jsrtf)
[![npm version](https://badge.fury.io/js/jsrtf.svg)](https://badge.fury.io/js/jsrtf)

jsRTF
=====

An RTF document creation library for javascript.

Based on Jonathan Rowny's [node-rtf](https://github.com/jrowny/node-rtf).

Features
--------

> TODO

Installation
------------

```shell
npm install --save jsrtf
```

Usage
-----

Using CommonJS:
```javascript
    var jsRTF = require('jsrtf');
```
Using [YModules](https://www.npmjs.com/package/ym):
```javascript
    // require('jsrtf'); // if required
    modules.require(['jsrtf'], (jsRTF) => {
        // ...
    });
```

Examples
--------

### Simple

```javascript
    // Create RTF object
    var myDoc = new jsRTF();

    // Formatter object
    var textFormat = new jsRTF.Format({
        spaceBefore : 300,
        spaceAfter : 300,
        paragraph : true,
    });

    // Adding text styled with formatter
    myDoc.writeText('Demo text.', textFormat);

    // Make content...
    var content = myDoc.createDocument();

```
### A little more complex sample
```javascript
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
```
See section below for tips about document saving.

See more examples in [demo](demo) folder.

Saving & encoding documents
---------------------------

When you save a document it is necessary to keep in mind that the rtf documents to use 8-bit encoding, while JavaScript uses Unicode. Thus, before saving you need to convert your data to binary buffer (if it contains some non-latin1 characters, see below for decoding from unicode samples):
```javascript
    var data = myDoc.createDocument();
    var buffer = new Buffer(data, 'binary');
    fs.ensureDirSync(path.dirname(resultFile));
    fs.writeFile(resultFile, buffer, function (error) {
        if ( !error ) {
            console.info('Created file', resultFile);
        }
        else {
            console.error(error);
        }
    });
```
Moreover, it is necessary to properly convert the encoding. For example, using [iconv](https://github.com/bnoordhuis/node-iconv):

```javascript
    var Iconv = require('iconv').Iconv;
    var conv = new Iconv('utf8', 'windows-1251');
    data = conv.convert(data);
```
...or [iconv-lite](https://github.com/ashtuchkin/iconv-lite):
```javascript
    var iconvLite = require('iconv-lite');
    data = iconvLite.encode(data, 'win1251');
```
Or write your own encode function like this (for default windows' cyrillic *windows-1251*):
```javascript
    function utf8_decode_to_win1251 (srcStr) {
        var tgtStr = '', c = 0;
        for ( var i = 0; i < srcStr.length; i++ ) {
            c = srcStr.charCodeAt(i);
            if ( c > 127 ) {
                if ( c > 1024 ) {
                    if ( c === 1025 ) { c = 1016; }
                    else if ( c === 1105 ) { c = 1032; }
                    c -= 848;
                }
                // c = c % 256; // ???
            }
            tgtStr += String.fromCharCode(c);
        }
        return tgtStr;
    }
    data = utf8_decode_to_win1251(data);
```
See also possible codepage-related rtf entities:

- `\ansicpgN`: N = codepage number (eg 1251 for samples above). Not used now but may be implemented.

To save documents directly from the browser you can use [FileSaver](https://github.com/eligrey/FileSaver.js/) or [StreamSaver](https://github.com/jimmywarting/StreamSaver.js).

Documentation
-------------

- [Rich Text Format (RTF) Version 1.5 Specification](http://www.biblioscape.com/rtf15_spec.htm)

