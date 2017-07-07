/**
 * @module entities-data
 * @overview Definitions of rtf entities
 * @author lilliputten <igor@lilliputten.ru>
 */

var
    /** borderTypes ** {{{
     * @type {Object}
     */
    borderTypes = {
        single : 's',
        doubleThickness : 'th',
        shadowed : 'sh',
        double : 'db',
        dotted : 'dot',
        dashed : 'dash',
        hairline : 'hair',
        dashSmall : 'dashsm',
        dotDash : 'dashd',
        dotDotDash : 'dashdd',
        triple : 'triple',
        thickThinSmall : 'tnthsg',
        thinThickSmall : 'thtnsg',
        thinThickThinSmall : 'tnthtnsg',
        thickThinMedium : 'tnthmg',
        thinThickMedium : 'thtnmg',
        thinThickThinMedium : 'tnthtnmg',
        thickThinLarge : 'tnthlg',
        thinThickLarge : 'thtnlg',
        thinThickThinLarge : 'tnthtnlg',
        wavy : 'wavy',
        doubleWavy : 'wavydb',
        striped : 'dashdotstr',
        emboss : 'emboss',
        engrave : 'engrave',
    },/*}}}*/
    /** makeBorder ** {{{ Create border
     * @type {Function}
     * @param {Object} props - Border properties description props
     * @param {String} id - Border property id (eg 'borderLeft')
     * @param {Object} data - Border descriptions hash
     * @returns {String}
     */
    makeBorder = function (props, id, data) {
        var
            result = Object.keys(data)
                .filter(key => data[key] !== undefined && props[key] !== undefined)
                .map(key => {
                    var value = data[key];
                    var result = props[key];
                    if ( typeof result === 'object' && result.name ) {
                        if ( typeof result.value === 'object' && result.value[value] !== undefined ) {
                            value = result.value[value];
                            result = result.name;
                        }
                        else if ( typeof result.value === 'function' ) {
                            value = result.value.call(this, value, id);
                            result = result.name;
                        }
                    }
                    return '\\' + result + value;
                })
                .join('')
        ;
        return result;
    },/*}}}*/
    /** textBorderProps ** {{{ */
    textBorderProps = {
        spacing : 'brsp', // border spacing
        width : 'brdrw', // border spacing
        // border type
        type : { name : 'brdr', value : borderTypes },
        // color
        color : { name : 'brdrcf', value : function (v, id) {
            return this[id].colorPos + 1;
        } }
    },/*}}}*/
    /** cellBorderProps ** {{{ */
    // '\\clbrdrt\\brdrs\\brdrw' + this.format.tableBorder,
    cellBorderProps = {
        spacing : 'brsp', // border spacing
        width : 'brdrw', // border spacing
        // border type
        type : { name : 'brdr', value : borderTypes },
        // color
        color : { name : 'brdrcf', value : function (v, id) {
            return this[id].colorPos + 1;
        } }
    },/*}}}*/
    __DONE
;

module.exports = {

    /** entities ** {{{ List of all entities */
    entities : {

        // space & indents
        spaceBefore : 'sb',
        spaceAfter : 'sa',
        leftIndent : 'li',
        rightIndent : 'ri',

        // horizontal align
        alignLeft : 'ql',
        alignRight : 'qr',
        alignCenter : 'qc',
        alignFull : 'qj',
        align : { name : 'q', value : (v) => String(v).toLowerCase().charAt(0) }, // 'center' => 'qc', 'left' => 'ql' etc...

        // vertical align
        verticalAlignTop : 'vertalt',
        verticalAlignBottom : 'vertalb',
        verticalAlignCenter : 'vertalc',
        verticalAlignJustify : 'vertalj',
        verticalAlign : { name : 'vertal', value : (v) => String(v).toLowerCase().charAt(0) }, // 'top' => 'vertalt', 'center' => 'vertalc' etc...

        // table header row
        tableHeader : { filter : ['rowDef'], name : 'trhdr' },

        // cell vertical align
        cellVerticalAlign : { filter : ['cellDef'], name : 'clvertal', value : (v) => String(v).toLowerCase().charAt(0) }, // 'top' => 'clvertalt', 'center' => 'clvertalc' etc...

        // fontPos : { name : 'f', test : (v) => v >= 0 },
        // colorPos : { name : 'cf', test : (v) => v >= 0 },
        // bgColorPos : { name : 'cb', test : (v) => v >= 0, value : (v) => isNaN(v) ? v : String( v + 1 ) },

        font : { filter : ['text'], name : 'f', test : v => v, value : function (v) { return this.fontPos; } }, // NOTE: using non-arrow function for catch `this` value
        color : { filter : ['text'], name : 'cf', test : v => v, value : function (v) { return this.colorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value
        bgColor : { filter : ['text'], name : 'cb', test : v => v, value : function (v) { return this.bgColorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value
        cellBgColor : { filter : ['cellDef'], name : 'clcbpat', test : v => v, value : function (v) { return this.cellBgColorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value
        borderColor : { name : 'brdrcf', test : v => v, value : function (v) { return this.borderColorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value

        // row borders
        rowBorderLeft : { filter : 'rowDef', name : 'trbrdrl', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderLeft', v); } },
        rowBorderRight : { filter : 'rowDef', name : 'trbrdrr', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderRight', v); } },
        rowBorderTop : { filter : 'rowDef', name : 'trbrdrt', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderTop', v); } },
        rowBorderBottom : { filter : 'rowDef', name : 'trbrdrb', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderBottom', v); } },
        rowBorderHorizontal : { filter : 'rowDef', name : 'trbrdrh', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderTop', v); } },
        rowBorderVertical : { filter : 'rowDef', name : 'trbrdrv', value : function(v) { return makeBorder.call(this, textBorderProps, 'rowBorderBottom', v); } },

        // cell borders
        cellBorderLeft : { filter : 'cellDef', name : 'clbrdrl', value : function(v) { return makeBorder.call(this, textBorderProps, 'cellBorderLeft', v); } },
        cellBorderRight : { filter : 'cellDef', name : 'clbrdrr', value : function(v) { return makeBorder.call(this, textBorderProps, 'cellBorderRight', v); } },
        cellBorderTop : { filter : 'cellDef', name : 'clbrdrt', value : function(v) { return makeBorder.call(this, textBorderProps, 'cellBorderTop', v); } },
        cellBorderBottom : { filter : 'cellDef', name : 'clbrdrb', value : function(v) { return makeBorder.call(this, textBorderProps, 'cellBorderBottom', v); } },

        // custom borders
        border : { prefix : null, name : null, value : function(v) { return makeBorder.call(this, textBorderProps, 'border', v); } },
        borderLeft : { name : 'brdrl', value : function(v) { return makeBorder.call(this, textBorderProps, 'borderLeft', v); } },
        borderRight : { name : 'brdrr', value : function(v) { return makeBorder.call(this, textBorderProps, 'borderRight', v); } },
        borderTop : { name : 'brdrt', value : function(v) { return makeBorder.call(this, textBorderProps, 'borderTop', v); } },
        borderBottom : { name : 'brdrb', value : function(v) { return makeBorder.call(this, textBorderProps, 'borderBottom', v); } },

        // common border properties (may be overriden by borderLeft etc)
        borderSpacing : 'brsp', // border spacing
        borderWidth : 'brdrw', // border spacing
        // border type
        borderType : { name : 'brdr', value : borderTypes },

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

        bold : { wrap : true, test : v => v, prefix : '\\b', postfix : '\\b0' },
        italic : { wrap : true, test : v => v, prefix : '\\i', postfix : '\\i0' },
        underline : { wrap : true, test : v => v, prefix : '\\ul', postfix : '\\ul0' },
        strike : { wrap : true, test : v => v, prefix : '\\strike', postfix : '\\strike0' },
        subScript : { wrap : true, test : v => v, prefix : '\\sub', postfix : '\\sub0' },
        superScript : { wrap : true, test : v => v, prefix : '\\super', postfix : '\\super0' },
    },/*}}}*/

    /** entitiesFirst ** {{{ Entities sort order: first items */
    entitiesFirst : [
        'paragraph',

        // // make border type first
        // 'borderTop',
        // 'borderBottom',
        // 'borderLeft',
        // 'borderRight',
        // 'borderSpacing',
        // 'borderWidth',
        // 'borderType',
        // 'borderColor',
    ],/*}}}*/
    /** oprionsLast ** {{{ Entities sort order: last items */
    oprionsLast : [
        'bold',
        'italic',
        'underline',
        'strike',
        'subScript',
        'superScript',
    ],/*}}}*/

};
