/**
 * @module text
 * @overview Text element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    Element = require('./element'),
    Format = require('../format'),
    inherit = require('inherit')
;

var TextElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function(text, format, options){
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        this.text = text;
        this.options = options || {};
    },/*}}}*/

    /** getRTFCode ** {{{ */
    getRTFCode : function(colorTable, fontTable){
        return this.format.formatText(this.text, colorTable, fontTable, this.options.escapeText);
    },/*}}}*/

});

module.exports = TextElement;
