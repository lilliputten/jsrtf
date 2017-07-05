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

        // font...
        this.fontPos = fontTable.indexOf(this.font);
        // if a font was defined, and it's not in a table, add it in!
        if ( this.fontPos < 0 && this.font !== undefined && this.font ) {
            this.fontPos = fontTable.length;
            fontTable.push(this.font);
        }

        // colors...
        [
            { obj : this, key : 'color' },
            { obj : this, key : 'bgColor' },
            { obj : this, key : 'borderColor' },
            { obj : this.borderLeft, key : 'color' },
            { obj : this.borderRight, key : 'color' },
            { obj : this.borderTop, key : 'color' },
            { obj : this.borderBottom, key : 'color' },
        ].map(item => {
            var obj = item.obj, key = item.key;
            if ( obj && typeof obj === 'object' && obj[key] ) {
                var keyPos = key + 'Pos';
                obj[keyPos] = Utils.getColorPosition(colorTable, obj[key]);
                if ( obj[keyPos] < 0 && obj[key] ) {
                    obj[keyPos] = colorTable.length;
                    colorTable.push(obj[key]);
                }
            }
        });

    },/*}}}*/

    /** formatText ** {{{ Applies a format to some text
     * @param {String} text
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @param {Boolean} [escapeText]
     */
    formatText : function (text, colorTable, fontTable, escapeText) {

        ( escapeText === undefined ) && ( escapeText = true );

        this.updateTables(colorTable, fontTable);

        var options = new Options(this);
        var optionsStr = options.compile();

        // we don't escape text if there are other elements in it, so set a flag
        if ( escapeText && typeof text === 'string' ){
            text = Utils.getRTFSafeText(text);
        }

        if ( text && !text.match(/^\{.*\}$/) ) {
            text = '{' + text + '}';
        }

        var content = optionsStr + text;

        content = options.applyWrappers(content);

        return [ '\{', content, '\}' ].join('');

    },/*}}}*/

}, /*{{{ Static properties... *//** @lends Format */{

    /** defaultOptions ** {{{
     * @type {Object}
     */
    defaultOptions : {

        // font: Fonts.ARIAL,

    },/*}}}*/

}/*}}}*/
); // end inherit

module.exports = Format;

