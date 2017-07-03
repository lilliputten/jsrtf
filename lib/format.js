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
        this.colorPos = Utils.getColorPosition(colorTable, this.color);
        this.bgColorPos = Utils.getColorPosition(colorTable, this.bgColor);

        // if a font was defined, and it's not in a table, add it in!
        if ( this.fontPos < 0 && this.font !== undefined && this.font ) {
            this.fontPos = fontTable.length;
            fontTable.push(this.font);
        }
        //if a color was defined, and it's not in the table, add it as well
        if ( this.colorPos < 0 && this.color !== undefined ) {
            this.colorPos = colorTable.length;
            colorTable.push(this.color);
        }
        //background colors use the same table as color
        if ( this.bgColorPos < 0 && this.bgColor !== undefined ) {
            this.bgColorPos = colorTable.length;
            colorTable.push(this.bgColor);
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
        // //bgColor: rgb,
        //
        // colorPos: -1,
        // bgColorPos: -1,
        // fontPos: -1,

    },/*}}}*/

}/*}}}*/
); // end inherit

module.exports = Format;

