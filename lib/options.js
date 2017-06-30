/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger */
var
    OptionsList = require('./options-list'),
    __DONE
;

var Options = function(optionsData){
    Object.assign(this, optionsData);
};

/** process ** {{{ */
Options.prototype.compile = function () {
    var result = Object.keys(this)
        .filter(function(key){
            return OptionsList[key];
        })
        .map(function(key){
            var value = this[key];
            return '\\' + OptionsList[key] + value;
        }, this)
        .join('')
    ;
    return result;
};/*}}}*/

module.exports = Options;
