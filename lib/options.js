/**
 * @module options
 * @overview Options
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    OptionsData = require('./data/options'),
    inherit = require('inherit')
;

/** compare ** {{{ */
function compare (a, b, order) {
    if ( !Array.isArray(order) ) { return 0; }
    var
        max = order.length,
        makeIndex = (x) => ( x < 0 ) ? max : x,
        ax = makeIndex(order.indexOf(a)),
        bx = makeIndex(order.indexOf(b)),
        result = ax - bx
    ;
    return result;
}/*}}}*/
/** sortKeys ** {{{ */
function sortKeys (a, b) {
    var result = compare(a, b, OptionsData.optionsFirst) - compare(a, b, OptionsData.oprionsLast);
    // console.log('sortKeys', a, b, '=>', result);
    return result;
}/*}}}*/

var Options = inherit({

    /** __constructor ** {{{ */
    __constructor : function(format){
        // this.format = format;
        Object.assign(this, format);
    },/*}}}*/

    /** _notEmptyKey ** {{{ */
    _notEmptyKey : function (key) {
        return OptionsData.options[key] && this[key] !== undefined && this[key] !== null && this[key] !== false;
    },/*}}}*/

    /** compile ** {{{ */
    compile : function () {
        var result = Object.keys(this)
            .filter(this._notEmptyKey, this)
            .sort(sortKeys)
            .map(key => {
                var ctx = OptionsData.options[key];
                if ( ctx === true ) {
                    ctx = key;
                }
                if ( typeof ctx === 'string' ) {
                    ctx = {
                        key : key,
                        name : ctx,
                        prefix : '\\',
                        // value = this[ctx.key],
                    };
                }
                else {
                    ctx = Object.assign({
                            prefix : '\\',
                            key : key,
                            // value : this[ctx.key],
                        }, ctx)
                    ;
                }
                return ctx;
            }, this)
            .filter(ctx => !ctx.wrap)
            .filter(ctx => typeof ctx.test !== 'function' || ctx.test.call(this, this[ctx.key]), this)
            .map(ctx => {
                var
                    value = ( this[ctx.key] === true ) ? '' : this[ctx.key]
                ;
                if ( typeof ctx.value === 'function' ) {
                    value = ctx.value.call(this, this[ctx.key]);
                }
                return [ ctx.prefix, ctx.name, value, ctx.postfix ].join('');
            }, this)
            .join('')
        ;
        return result;
    },/*}}}*/

    /** applyWrappers ** {{{ */
    applyWrappers : function (value) {
        var result = Object.keys(this)
            .filter(key => typeof OptionsData.options[key] === 'object' && OptionsData.options[key].wrap)
            .sort(sortKeys)
            .reverse()
            .map(key => {
                var ctx = OptionsData.options[key];
                ctx = Object.assign({
                        key : key,
                        prefix : '\\'+ctx.name,
                        postfix : '\\'+ctx.name+'0',
                        // value : this[ctx.key],
                    }, ctx)
                ;
                return ctx;
            }, this)
            .filter(ctx => typeof ctx.test !== 'function' || ctx.test.call(this, value), this)
            .reduce((value,ctx,i) => {
                if ( !i ) {
                    value = ' ' + value;
                }
                return [ ctx.prefix, value, ctx.postfix ].join('');
            }, value)
        ;
        return result;
    },/*}}}*/

});

module.exports = Options;
