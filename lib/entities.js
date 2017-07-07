/**
 * @module entities
 * @overview Entities
 * @author lilliputten <igor@lilliputten.ru>
 */
var
    EntitiesData = require('./entities-data'),

    Utils = require('./rtf-utils'),

    isArray = Array.isArray,

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
    var result = compare(a, b, EntitiesData.entitiesFirst) - compare(a, b, EntitiesData.oprionsLast);
    return result;
}/*}}}*/

var Entities = inherit({

    /** __constructor ** {{{ */
    __constructor : function(format){
        // this.format = format;
        Object.assign(this, format);
    },/*}}}*/

    /** _notEmptyKey ** {{{ */
    _notEmptyKey : function (key) {
        return EntitiesData.entities[key] && this[key] !== undefined && this[key] !== null && this[key] !== false;
    },/*}}}*/

    /** testFilter ** {{{ Check filter pass status for entity context
     * @param {Object} ctx
     * @param {String} [filter]
     * @param {Boolean} [strict]
     * @returns {Boolean}
     */
    testFilter : function (ctx, filter, strict) {

        if ( !filter ) {
            return true;
        }

        var cmpFilter = ctx.filter;
        if ( !cmpFilter ) {
            return !strict;
        }
        isArray(cmpFilter) || ( cmpFilter = [cmpFilter] );
        isArray(filter) || ( filter = [filter] );

        return filter.some(filter => cmpFilter.includes(filter));

    },/*}}}*/

    /** compile ** {{{ Create rtf entities for description
     * @param {Object} [params] - Parameters
     * @param {String} [params.filter] - Condition filter (eg 'tableCellDef' for table cells)
     * @returns {String}
     */
    compile : function (params) {
        params = params || {};
        var filter = params.filter || this.filter;
        var strictFilter = params.strictFilter || this.strictFilter;
        var result = Object.keys(this)
            .filter(this._notEmptyKey, this)
            .sort(sortKeys)
            .map(key => {
                var ctx = EntitiesData.entities[key];
                if ( ctx === true ) {
                    ctx = key;
                }
                // in any case cloning original entities data
                if ( typeof ctx === 'string' ) {
                    ctx = {
                        key : key,
                        name : ctx,
                        prefix : '\\',
                    };
                }
                else {
                    ctx = Object.assign({
                            prefix : '\\',
                            key : key,
                        }, ctx)
                    ;
                }
                return ctx;
            }, this)
            .filter(ctx => !ctx.wrap)
            .filter(ctx => this.testFilter(ctx, filter, strictFilter)) // TODO: Add to wrappers?
            .filter(ctx => typeof ctx.test !== 'function' || ctx.test.call(this, this[ctx.key]), this)
            .map(ctx => {
                var
                    value = ( this[ctx.key] === true ) ? '' : this[ctx.key]
                ;
                if ( typeof ctx.value === 'function' ) {
                    value = ctx.value.call(this, this[ctx.key]);
                }
                else if ( typeof ctx.value === 'object' && ctx.value[this[ctx.key]] ) {
                    value = ctx.value[this[ctx.key]];
                }
                var prefix = [ ctx.prefix, ctx.name, value ].join('');
                var result = Utils.makeRtfCmd(prefix, '', ctx.postfix);

                return result;
                // return [ ctx.prefix, ctx.name, value, ctx.postfix ].join('');
            }, this)
            .join('')
        ;
        return result;
    },/*}}}*/

    /** applyWrappers ** {{{ Create wrappers for description
     * @param {String} [content] - Text
     * @param {Object} [params] - Parameters
     */
    applyWrappers : function (content, params) {
        params = params || {};
        var filter = params.filter || this.filter;
        var strictFilter = params.strictFilter || this.strictFilter;
        var result = Object.keys(this)
            .filter(key => typeof EntitiesData.entities[key] === 'object' && EntitiesData.entities[key].wrap)
            .sort(sortKeys)
            .reverse()
            .map(key => {
                var ctx = EntitiesData.entities[key];
                ctx = Object.assign({
                        key : key,
                        prefix : '\\'+ctx.name,
                        postfix : '\\'+ctx.name+'0',
                    }, ctx)
                ;
                return ctx;
            }, this)
            .filter(ctx => this.testFilter(ctx, filter, strictFilter)) // TODO: Add to wrappers?
            .filter(ctx => typeof ctx.test !== 'function' || ctx.test.call(this, content), this)
            .reduce((content,ctx,i) => {
                // var result = [ ctx.prefix, content, ctx.postfix ].join('');
                var result = Utils.makeRtfCmd(ctx.prefix, content, ctx.postfix);
                return result;
            }, content)
        ;
        return result;
    },/*}}}*/

});

module.exports = Entities;
