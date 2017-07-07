/**
 * @module text
 * @overview Text element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    Element = require('./element'),
    Format = require('../format'),
    Utils = require('../rtf-utils'),
    inherit = require('inherit')
;

var TextElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function(text, format, options){
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        this.text = text;
        this.options = options || { filter : 'text' };
    },/*}}}*/

    /** getRTFCode ** {{{
     * @param {Object} jsRTF
     */
    getRTFCode : function(jsRTF) {

        var text = this.format.formatText(this.text, jsRTF, this.options);

        text = Utils.makeRtfCmd('', text, '', true);

        return text;

    },/*}}}*/

});

module.exports = TextElement;
