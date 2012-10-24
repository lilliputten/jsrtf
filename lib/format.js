Utils = require("./rtf-utils");

module.exports = Format = function(){
  this.underline=false;
  this.bold=false;
  this.italic=false;
  this.strike=false;

  this.superScript=false;
  this.subScript=false;

  this.makeParagraph=false;

  this.align = "";

  this.leftIndent=0;
  this.rightIndent=0;

  this.font = Utils.Fonts.ARIAL;
  this.fontSize=0;
  this.color = -1;
  this.backgroundColor = -1;

  //if defined, this element will become a link to this url
  //TODO: not implemented
  //this.url;
};

/**
 * Applies a format to some text
 */
Format.prototype.formatText = function(text, colorPos, backgroundColorPos, fontPos, safeText){
    var rtf = "{";
    if(this.makeParagraph) rtf+="\\pard";
    
    if(fontPos !== undefined && fontPos>=0) rtf+="\\f" + fontPos.toString();
    //Add one because color 0 is null
    if(backgroundColorPos !== undefined && backgroundColorPos >= 0) rtf+="\\cb" + (backgroundColorPos+1).toString();
    //Add one because color 0 is null
    if(colorPos !== undefined && colorPos>=0) rtf+="\\cf" + (colorPos+1).toString();
    if(this.fontSize >0) rtf += "\\fs" + (fontSize*2).toString();
    if(this.align.length > 0) rtf += align;
    if(this.bold) rtf += "\\b";
    if(this.italic) rtf += "\\i";
    if(this.underline) rtf += "\\ul";
    if(this.strike) rtf += "\\strike";
    if(this.leftIndent>0) rtf += "\\li" + this.leftIndent.toString();
    if(this.rightIndent>0) rtf += "\\ri" + this.rightIndent.toString();
    if(this.subScript) rtf += "\\sub";
    if(this.superScript) rtf += "\\super";
    
    //we don't escape text if there are other elements in it, so set a flag
    if(safeText !== undefined && safeText){
      rtf += Utils.getRTFSafeText(text);
    }else{
      rtf += text;
    }
    //close paragraph
    if(this.makeParagraph) rtf += "\\par";

    //close doc
    rtf+="}";

    return rtf;
};