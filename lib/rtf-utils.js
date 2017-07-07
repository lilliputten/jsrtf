/**
 * @module rtf-utils
 * @overview Misc utilities & helpers.
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    RGB = require('./data/rgb'),
    Fonts = require('./data/fonts'),
    inherit = require('inherit')
;

/** String.prototype.replaceAll ** {{{ Replaces all occurrences of a substring in a string
 * ReplaceAll by Fagner Brack (MIT Licensed)
 */
String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var str = this.toString(), i = -1, _token;
    if(typeof token === "string") {
        if(ignoreCase === true) {
            _token = token.toLowerCase();
            while((i = str.toLowerCase().indexOf( token, i >= 0? i + newToken.length : 0 )) !== -1 ) {
                str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
            }
        } else {
            return this.split(token).join(newToken);
        }
    }
    return str;
};/*}}}*/

module.exports = {

    dpi : 300,
    twipsPerMM : 56.6925562674,

    /** mm2twips ** {{{ Convert milimeters to twips
     * @see {@link https://en.wikipedia.org/wiki/Twip}
     * @see {@link http://www.convertunits.com/from/twip/to/mm}
     * @returns {Integer}
     */
    mm2twips : function (mm) {
        return Math.round( this.twipsPerMM * mm );
    },/*}}}*/

    /** isIndex ** {{{ Check is index is defined and positive (Number>=0)
     * @returns {Boolean}
     */
    isIndex : function (index) {
        return ( !isNaN(index) && index >= 0 );
    },/*}}}*/

    /** makeRtfCmd ** {{{
     * @param {String} prefix
     * @param {String} text
     * @param {String} [postfix]
     * @param {Boolean} [wrapInCurles]
     * @returns {String}
     */
    makeRtfCmd : function (prefix, text, postfix, wrapInCurles) {

        // postfix = postfix || '';

        if ( prefix && String(prefix).match(/\\\w+$/) && text && !String(text).match(/^\\/) ) {
            prefix += ' ';
        }

        var result = [ prefix, text, postfix ].join('');

        if ( wrapInCurles && !result.match(/^\{.*\}$/) ) {
            result = '\{' + result +'\}';
        }

        return result;


    },/*}}}*/

    /** getRTFSafeText ** {{{ Makes text safe for RTF by escaping characters and it also converts linebreaks
     * Also checks to see if safetext should be overridden by non-elements like "\line"
     */
    getRTFSafeText : function (text){
        //if text is overridden not to be safe
        if ( typeof text === 'object' && text.hasOwnProperty('text') && text.noEscape ) {
            return text.text;
        }
        else if ( typeof text === 'object' ) {
            throw new Error('Expecting text, not object');
        }
        // TODO: this could probably all be replaced by a bit of regex
        return String(text)
            // .replace(/([\\\{\}~_-])/g, '\\$1')
            .replaceAll('\\','\\\\')
            .replaceAll('\{','\\\{')
            .replaceAll('\}','\\\}')
            // .replaceAll('~','\\~')
            // .replaceAll('-','\\-')
            // .replaceAll('_','\\_')
            //turns line breaks into \line commands
            // .replaceAll(/(\n\r|\n|\r)/g,' \\line ')
            .replaceAll('\n\r',' \\line ')
            .replaceAll('\n',' \\line ')
            .replaceAll('\r',' \\line ')
        ;
    },/*}}}*/

    /** createColorTable ** {{{ Generates a color table */
    createColorTable : function (colorTable) {
        var table = '',
             c;
        table+='\{\\colortbl;\n';
        for(c=0; c < colorTable.length; c++) {
            var rgb = colorTable[c];
            table+='\\red' + rgb.red + '\\green' + rgb.green + '\\blue' + rgb.blue + ';\n';
        }
        table+='\}';
        return table;
    },/*}}}*/

    /** createFontTable ** {{{ Generates a font table */
    createFontTable : function (fontTable) {
        var table = '',
                f;
        table+='\{\\fonttbl;\n';
        if(fontTable.length === 0) {
            table+='\{\\f0 ' + Fonts.ARIAL + '\}\n'; //if no fonts are defined, use arial
        } else {
            for(f=0;f<fontTable.length;f++) {
                    table+='\{\\f' + f + ' ' + fontTable[f] + '\}\n';
            }
        }
        table+='\}';
        return table;
    },/*}}}*/

    /** getColorPosition ** {{{ find color position in table
     * @param {Array} table
     * @param {RGB} find
     */
    getColorPosition : function (table, find) {
        var resultIndex = -1;
        if ( Array.isArray(table) && find && find instanceof RGB ) {
            table.map(function(color, index){
                if ( color.red === find.red && color.green === find.green && color.blue === find.blue ) {
                    resultIndex = index;
                }
            });
        }
        return resultIndex;
    }/*}}}*/

};
