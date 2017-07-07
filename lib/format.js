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
    Entities = require('./entities'),

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

    /** updateTables ** {{{
     * @param {Object} jsRTF
     */
    updateTables : function (jsRTF) {

        var
            colorTable = jsRTF.colorTable,
            fontTable = jsRTF.fontTable
        ;

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
            { obj : this, key : 'cellBgColor' },
            { obj : this.border, key : 'color' },
            { obj : this.borderLeft, key : 'color' },
            { obj : this.borderRight, key : 'color' },
            { obj : this.borderTop, key : 'color' },
            { obj : this.borderBottom, key : 'color' },
            { obj : this.cellBorder, key : 'color' },
            { obj : this.cellBorderLeft, key : 'color' },
            { obj : this.cellBorderRight, key : 'color' },
            { obj : this.cellBorderTop, key : 'color' },
            { obj : this.cellBorderBottom, key : 'color' },
            { obj : this.rowBorderLeft, key : 'color' },
            { obj : this.rowBorderRight, key : 'color' },
            { obj : this.rowBorderTop, key : 'color' },
            { obj : this.rowBorderBottom, key : 'color' },
            { obj : this.rowBorderHorizontal, key : 'color' },
            { obj : this.rowBorderVertical, key : 'color' },
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
     * @param {Object} jsRTF
     * @param {Object} params
     * @param {Boolean} [params.noEscape]
     */
    formatText : function (text, jsRTF, params) {

        params = params || {};

        this.updateTables(jsRTF);

        var entities = ( this instanceof Entities ) ? this : new Entities(this);
        var styles = entities.compile(params);

        // we don't escape text if there are other elements in it, so set a flag
        if ( !params.noEscape && typeof text === 'string' ){
            text = Utils.getRTFSafeText(text);
        }

        text = Utils.makeRtfCmd(styles, text);

        var result = entities.applyWrappers(text, params);

        if ( params.wrapInCurles && !result.match(/^\{.*\}$/) ) {
            result = '\{' + result +'\}';
        }

        return result;

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

