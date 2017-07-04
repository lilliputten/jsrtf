/**
 * @module options-data
 * @overview Definitions of rtf options
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
     * @param {Object} baseObject - Parent Format or Options object
     * @param {String} id - Border property id (eg 'borderLeft')
     * @param {Object} data - Border descriptions hash
     * @returns {String}
     */
    makeBorder = function (baseObject, id, data) {
        var options = {
                spacing : 'brsp', // border spacing
                width : 'brdrw', // border spacing
                // border type
                type : { name : 'brdr', value : borderTypes },
                // color
                color : { name : 'brdrcf', value : (v) => {
                    return baseObject[id].colorPos + 1;
                } }
            },
            result = Object.keys(data)
                .filter(key => data[key] !== undefined && options[key] !== undefined)
                .map(key => {
                    var value = data[key];
                    var result = options[key];
                    if ( typeof result === 'object' && result.name ) {
                        if ( typeof result.value === 'object' && result.value[value] !== undefined ) {
                            value = result.value[value];
                            result = result.name;
                        }
                        else if ( typeof result.value === 'function' ) {
                            value = result.value.call(baseObject, value);
                            result = result.name;
                        }
                    }
                    return '\\' + result + value;
                })
                .join('')
        ;
        return result;
    }/*}}}*/
;

module.exports = {

    /** options ** {{{ List of all entities */
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
        borderColor : { name : 'brdrcf', test : v => v, value : function (v) { return this.borderColorPos + 1; } }, // NOTE: using non-arrow function for catch `this` value

        // custom borders
        borderLeft : { name : 'brdrl', value : function(v) { return makeBorder(this, 'borderLeft', v); } },
        borderRight : { name : 'brdrr', value : function(v) { return makeBorder(this, 'borderRight', v); } },
        borderTop : { name : 'brdrt', value : function(v) { return makeBorder(this, 'borderTop', v); } },
        borderBottom : { name : 'brdrb', value : function(v) { return makeBorder(this, 'borderBottom', v); } },

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

        bold : { wrap : true, prefix : '\\b', postfix : '\\b0' },
        italic : { wrap : true, prefix : '\\i', postfix : '\\i0' },
        underline : { wrap : true, prefix : '\\ul', postfix : '\\ul0' },
        strike : { wrap : true, prefix : '\\strike', postfix : '\\strike0' },
        subScript : { wrap : true, prefix : '\\sub', postfix : '\\sub0' },
        superScript : { wrap : true, prefix : '\\super', postfix : '\\super0' },
    },/*}}}*/

    /** optionsFirst ** {{{ Entities sort order: first items */
    optionsFirst : [
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
