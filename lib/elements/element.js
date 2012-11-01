var Format = require('../format');
Function.prototype.subclass= function(base) {
    var c= Function.prototype.subclass.nonconstructor;
    c.prototype= base.prototype;
    this.prototype= new c();
};
Function.prototype.subclass.nonconstructor= function() {};

module.exports = Element = function(format){
    if(format === undefined) format = new Format();
    this.format = format;
};