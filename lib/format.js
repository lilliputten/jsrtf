/**
 * @module format
 * @overview Formating
 * @author lilliputten <igor@lilliputten.ru>
 */

var

    RGB = require('./data/rgb'),
    Fonts = require('./data/fonts'),
    Colors = require('./data/colors'),

    Utils = require('./rtf-utils'),
    Options = require('./options'),

    inherit = require('inherit')
;

/** wrap ** {{{ some RTF elements require that they are wrapped, closed by a trailing 0 and must have a spacebefore the text
 */
function wrap (text, prefix, postfix) {
    postfix = postfix || ( prefix + '0' );
    return prefix + ' ' + text + postfix;
}/*}}}*/

/** getColorPosition ** {{{ because JS doesn't have .equalsTo
 * @param {Array} table
 * @param {RGB} find
 */
function getColorPosition (table, find) {
    if ( Array.isArray(table) && find && find instanceof RGB ) {
        table.forEach(function(color, index){
            if ( color.red === find.red && color.green === find.green && color.blue === find.blue ) {
                return index;
            }
        });
    }
    return -1;
}/*}}}*/

// var testTable = [
//     Colors.BLACK,
//     Colors.WHITE,
//     Colors.RED,
// ];
// var testIndex = getColorPosition(testTable, Colors.WHITE);
// console.info('testIndex', testIndex);

/**
 * @class
 * @name Format
 */
var Format = inherit(/** @lends Format.prototype */{

    /** __constructor ** {{{
     * @param {Object} [options]
     */
    __constructor : function (options) {
        Object.assign(this, Format.defaultOptions, options);
    },/*}}}*/

    /** updateTables ** {{{ */
    updateTables : function (colorTable, fontTable) {
        this.fontPos = fontTable.indexOf(this.font);
        this.colorPos = getColorPosition(colorTable, this.color);
        this.backgroundColorPos = getColorPosition(colorTable, this.backgroundColor);

        // if a font was defined, and it's not in a table, add it in!
        if(this.fontPos < 0 && this.font !== undefined && this.font.length > 0) {
            fontTable.push(this.font);
            this.fontPos = fontTable.length-1;
        }
        //if a color was defined, and it's not in the table, add it as well
        if(this.colorPos < 0 && this.color !== undefined) {
            colorTable.push(this.color);
            this.colorPos = colorTable.length;
        }
        //background colors use the same table as color
        if(this.backgroundColorPos < 0 && this.backgroundColor !== undefined) {
            colorTable.push(this.backgroundColor);
            this.backgroundColorPos = colorTable.length;
        }
    },/*}}}*/

    /** formatText ** {{{ Applies a format to some text
     * @param {String} text
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @param {Boolean} [safeText]
     */
    formatText : function (text, colorTable, fontTable, safeText) {

        ( safeText === undefined ) && ( safeText = true );

        this.updateTables(colorTable, fontTable);

        var options = new Options(this);
        var optionsStr = options.compile();

        // we don't escape text if there are other elements in it, so set a flag
        if ( safeText ){
            text = Utils.getRTFSafeText(text);
        }

        var content = [ optionsStr, text ].join(' ');

        content = options.applyWrappers(content);

        return [ '\{', content, '\}' ].join('');

    },/*}}}*/

}, /*{{{ Static properties... *//** @lends Format */{

    /** defaultOptions ** {{{
     * @type {Object}
     */
    defaultOptions : {

        // underline: false,
        // bold: false,
        // italic: false,
        // strike: false,
        //
        // superScript: false,
        // subScript: false,
        //
        // paragraph: false,
        //
        // align: '',
        //
        // leftIndent: 0,
        // rightIndent: 0,
        //
        font: Fonts.ARIAL,
        // fontSize: 0,
        // //color: rgb,
        // //backgroundColor: rgb,
        //
        // colorPos: -1,
        // backgroundColorPos: -1,
        // fontPos: -1,

    },/*}}}*/

}/*}}}*/
); // end inherit

module.exports = Format;

