/**
 * @module text
 * @overview Text element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Element = require('./element'),
    inherit = require('inherit')
;

var TextElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function(text, format){
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        this.text = text;
    },/*}}}*/

    /** getRTFCode ** {{{ */
    getRTFCode : function(colorTable, fontTable){
        return this.format.formatText(this.text, colorTable, fontTable);
    },/*}}}*/

});

module.exports = TextElement;
