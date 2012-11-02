var Element = require('./element');

module.exports = TextElement = function(text, format){
    Element.apply(this, [format]);
    this.text=text;
};

TextElement.subclass(Element);

TextElement.prototype.getRTFCode = function(colorTable, fontTable, callback){
  return callback(null, this.format.formatText(this.text, colorTable, fontTable));
};