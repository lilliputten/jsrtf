var Element = require('./element');

var TextElement = function(text, format){
    Element.apply(this, [format]);
    this.text=text;
};

TextElement.subclass(Element);

TextElement.prototype.getRTFCode = function(colorTable, fontTable/* , callback */){
    // // {{{ OLD ASYNC CODE
    // return callback ? callback(null, this.format.formatText(this.text, colorTable, fontTable)) : this.format.formatText(this.text, colorTable, fontTable);
    // // OLD ASYNC CODE }}}
    return this.format.formatText(this.text, colorTable, fontTable);
};

module.exports = TextElement;
