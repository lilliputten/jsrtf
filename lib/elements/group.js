//thanks DTrejo for help using async
var Utils = require('../rtf-utils'),
    Element = require('./element'),
    async = require('async');

var GroupElement = function(name, format) {
    Element.apply(this, [format]);
    this.elements = [];
    this.name = name;
};

GroupElement.subclass(Element);

GroupElement.prototype.addElement = function(element){
    this.elements.push(element);
};

GroupElement.prototype.getRTFCode = function(colorTable, fontTable, callback){
    if ( callback ) {
        var tasks = [];
        var rtf = '';
        this.elements.forEach(function(el) {
            if (el instanceof Element){
                tasks.push(function(cb) { el.getRTFCode(colorTable, fontTable, cb); });
            } else {
                tasks.push(function(cb) { cb(null, Utils.getRTFSafeText(el)); });
            }
        });
        return async.parallel(tasks, function(err, results) {
            results.forEach(function(result) {
                rtf += result;
            });
            //formats the whole group
            rtf = this.format.formatText(rtf, colorTable, fontTable, false);
            return callback(null, rtf);
        });
    }
    else {
        var content = this.elements
            .map(el => ( el instanceof Element ) ? el.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(el))
            .join('\n')
        ;
        content = this.format.formatText(content, colorTable, fontTable, false);
        return content;
    }
};

module.exports = GroupElement;
