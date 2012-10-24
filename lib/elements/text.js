module.exports = TextElement = function(text, format, colorPos, backgroundColorPos, fontPos){
    this.text=text,
    this.format=format,
    this._colorPos=colorPos,
    this._backgroundColorPos=backgroundColorPos,
    this._fontPos=fontPos;
};

TextElement.prototype.getRTFCode = function(){
  return this.format.formatText(this.text, this._colorPos, this._backgroundColorPos, this._fontPos);
};