//thanks DTrejo for help using async
var Utils = require("../rtf-utils"),
    Element = require('./element'),
    async = require('async');

module.exports = GroupElement = function(name, format) {
  Element.apply(this, [format]);
  this.elements = [];
  this.name = name;
};

GroupElement.subclass(Element);

GroupElement.prototype.addElement = function(element){
  this.elements.push(element);
};

GroupElement.prototype.getRTFCode = function(colorTable, fontTable, callback){
  var tasks = [];
  var rtf = "";
  this.elements.forEach(function(el, i) {
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
    rtf = format.formatText(rtf, colorTable, fontTable, false);
    return callback(null, rtf);
  });
};