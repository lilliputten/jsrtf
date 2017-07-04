/**
 * @module container
 * @overview Container element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    Element = require('./element'),
    Format = require('../format'),
    inherit = require('inherit'),

    isArray = Array.isArray
;

var ContainerElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function(data, format){
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        if ( this.format && typeof this.format === 'object' && !(this.format instanceof Format) ) {
            this.format = new Format(this.format);
        }
        this.data = data;
    },/*}}}*/

    /** getItemRTFCode ** {{{ Get single object rtf code
     * @param {*} item
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    getItemRTFCode : function (item, colorTable, fontTable) {

        var result = '';

        if ( isArray(item) ) {
            result = item
                .map(item => this.getItemRTFCode(item, colorTable, fontTable))
                .join('\n')
            ;
        }
        else if ( item instanceof Element ) {
            result = item.getRTFCode(colorTable, fontTable);
        }
        else {
            result = this.format.formatText(item, colorTable, fontTable);
        }

        return result;

    },/*}}}*/

    /** getRTFCode ** {{{ Get element rtf code
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    getRTFCode : function(colorTable, fontTable){

        var data = this.getItemRTFCode(this.data, colorTable, fontTable);

        data = this.format.formatText(data, colorTable, fontTable, false);

        return data;

    },/*}}}*/

});

module.exports = ContainerElement;
