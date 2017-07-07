/**
 * @module container
 * @overview Container element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    Element = require('./element'),
    Format = require('../format'),
    Utils = require('../rtf-utils'),

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
     * @param {Object} jsRTF
     * @returns {String}
     */
    getItemRTFCode : function (item, jsRTF) {

        var result = '';

        if ( isArray(item) ) {
            result = item
                .map(item => this.getItemRTFCode(item, jsRTF))
                .join('\n')
            ;
        }
        else if ( item instanceof Element ) {
            result = item.getRTFCode(jsRTF);
        }
        else {
            result = this.format.formatText(item, jsRTF);
        }

        return result;

    },/*}}}*/

    /** getRTFCode ** {{{ Get element rtf code
     * @param {Object} jsRTF
     * @returns {String}
     */
    getRTFCode : function(jsRTF){

        var data = this.getItemRTFCode(this.data, jsRTF);

        data = this.format.formatText(data, jsRTF, { noEscape : true });

        data = Utils.makeRtfCmd('', data, '', true);

        return data;

    },/*}}}*/

});

module.exports = ContainerElement;
