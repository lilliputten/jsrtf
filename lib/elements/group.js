/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var Utils = require('../rtf-utils'),
    // async = require('async'),
    Element = require('./element'),
    inherit = require('inherit')
;

var GroupElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function(name, format) {
        this.__base.call(this, format);
        this.elements = [];
        this.name = name;
    },/*}}}*/

    /** addElement ** {{{ */
    addElement : function(element){
        this.elements.push(element);
    },/*}}}*/

    /** getRTFCode ** {{{
     * @param {Object} jsRTF
     */
    getRTFCode : function(jsRTF){
        var content = this.elements
            .map(el => ( el instanceof Element ) ? el.getRTFCode(jsRTF) : Utils.getRTFSafeText(el))
            .join('\n')
        ;
        content = this.format.formatText(content, jsRTF, { noEscape : true });
        return content;
    },/*}}}*/

});

module.exports = GroupElement;
