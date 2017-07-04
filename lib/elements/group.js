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

    /** getRTFCode ** {{{ */
    getRTFCode : function(colorTable, fontTable/* , callback */){
        var content = this.elements
            .map(el => ( el instanceof Element ) ? el.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(el))
            .join('\n')
        ;
        content = this.format.formatText(content, colorTable, fontTable, false);
        return content;
    },/*}}}*/

});

module.exports = GroupElement;
