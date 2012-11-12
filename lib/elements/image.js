var Element   = require('./element'),
    fs        = require('fs'),
    imageinfo = require('imageinfo');

module.exports = ImageElement = function(path){
    Element.apply(this, arguments);
    this.path=path;
    this.dpi=300;
};

ImageElement.subclass(Element);

ImageElement.prototype.getRTFCode = function(colorTable, fontTable, callback){
  var self = this;

  //read image file
  return fs.readFile(this.path, function(err, buffer){

    if(err) throw err;

    //get image information and calculate twips based on DPI
    var info = imageinfo(buffer);
    var twipRatio = ((72/self.dpi) * 20);
    var twipWidth = Math.round(info.width * twipRatio),
        twipHeight = Math.round(info.height * twipRatio);

    //output image information
    var output = "{\\pict\\pngblip\\picw" + info.width + "\\pich" + info.height +
                 "\\picwgoal" + twipWidth + "\\pichgoal" + twipHeight + " ";

    //output buffer to base16 (hex) and ensure prefixed 0 if single digit
    var bufSize = buffer.length;
    for(var i = 0; i < bufSize; i++){
      var hex = buffer[i].toString(16);
      output += (hex.length === 2) ? hex : "0" + hex;
    }

    output += "}";
    return callback(null, output);
  });
};