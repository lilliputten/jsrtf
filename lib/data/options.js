/**
 * @module options-data
 * @overview Definitions of rtf options
 * @author lilliputten <igor@lilliputten.ru>
 */
module.exports = {

    /** List of all entities */
    options : {

        spaceBefore : 'sb',
        spaceAfter : 'sa',
        leftIndent : 'li',
        rightIndent : 'ri',

        alignLeft : 'ql',
        alignRight : 'qr',
        alignCenter : 'qc',
        alignFull : 'qj',
        align : { name : 'q', value : (v) => String(v).toLowerCase().charAt(0) }, // 'center' => 'qc', 'left' => 'ql' etc...

        // fontPos : { name : 'f', test : (v) => v >= 0 },
        // colorPos : { name : 'cf', test : (v) => v >= 0 },
        // bgColorPos : { name : 'cb', test : (v) => v >= 0, value : (v) => isNaN(v) ? v : String( v + 1 ) },

        font : { name : 'f', test : v => v, value : function (v) { return this.fontPos; } }, // NOTE: using non-arrow function for catch `this` value
        color : { name : 'cf', test : v => v, value : function (v) { return this.colorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value
        bgColor : { name : 'cb', test : v => v, value : function (v) { return this.bgColorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value

        // tableHeader : 'trhdr',

        // makeParagraph : 'pard',
        fontSize : { name : 'fs', value : (v) => isNaN(v) ? v : v * 2 },

        landscape : 'lndscpsxn', // ???

        pageWidth : 'pgwsxn',
        pageHeight : 'pghsxn',

        marginLeft : 'margl',
        marginRight : 'margr',
        marginTop : 'margt',
        marginBottom : 'margb',
        language : 'deflang',

        pageNumbering : { prefix : '', value : '\{\\header\\pard\\qr\\plain\\f0\\chpgn\\par\}' },
        columns : 'cols',
        columnLines : 'linebetcol',

        paragraph : { wrap : true, prefix : '\\pard', postfix : '\\par' },

        bold : { wrap : true, prefix : '\\b', postfix : '\\b0' },
        italic : { wrap : true, prefix : '\\i', postfix : '\\i0' },
        underline : { wrap : true, prefix : '\\ul', postfix : '\\ul0' },
        strike : { wrap : true, prefix : '\\strike', postfix : '\\strike0' },
        subScript : { wrap : true, prefix : '\\sub', postfix : '\\sub0' },
        superScript : { wrap : true, prefix : '\\super', postfix : '\\super0' },
    },

    /** Entities sort order: first items */
    optionsFirst : [
        'paragraph',
    ],
    /** Entities sort order: last items */
    oprionsLast : [
        'bold',
        'italic',
        'underline',
        'strike',
        'subScript',
        'superScript',
    ],

};
