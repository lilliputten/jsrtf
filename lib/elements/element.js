/**
 * @module element
 * @overview Base element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    Format = require('../format'),
    inherit = require('inherit')
;

// Function.prototype.subclass = function(base) {
//     var c = Function.prototype.subclass.nonconstructor;
//     c.prototype= base.prototype;
//     this.prototype= new c ();
// };
// Function.prototype.subclass.nonconstructor = function() {};

var Element = inherit({

    /** __constructor ** {{{ */
    __constructor : function (format) {
        if ( format === undefined ) {
            format = new Format();
        }
        this.format = format;
    },/*}}}*/

});

module.exports = Element;
