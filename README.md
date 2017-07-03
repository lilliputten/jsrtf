jsrtf
=====

An RTF document creation library for javascript.

Based on Jonathan Rowny's [node-rtf](https://github.com/jrowny/node-rtf).

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
Using YModules:
```javascript
    // require('jsrtf'); // if required
    modules.require(['jsrtf'], (jsRTF) => {
        // ...
    });
```

Creating RTF
------------

```javascript
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
        cellsFormat : [
            new jsRTF.Format({ bold : true }), // #0
            new jsRTF.Format({ color : jsRTF.Colors.RED }), // #1
        ],
        firstRowFormat : [
            new jsRTF.Format({ italic : true }),
        ],
    });
    // Add rows
    table.addRow(['Table row', 'with two columns']);
    table.addRow(['Second row', 'and the second column']);
    myDoc.addTable(table);

    // Make content...
    var content = myDoc.createDocument();

    // ...
```

See more examples in [demo](demo) folder.

Documentation
-------------

- [Rich Text Format (RTF) Version 1.5 Specification](http://www.biblioscape.com/rtf15_spec.htm)

