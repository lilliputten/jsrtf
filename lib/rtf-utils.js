var Fonts = require('./fonts');
/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 */
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
    var str = this.toString(), i = -1, _token;
    if(typeof token === "string") {
        if(ignoreCase === true) {
            _token = token.toLowerCase();
            while((i = str.toLowerCase().indexOf( token, i >= 0? i + newToken.length : 0 )) !== -1 ) {
                str = str.substring(0, i)
                        .concat(newToken)
                        .concat(str.substring(i + token.length));
            }
        } else {
            return this.split(token).join(newToken);
        }
    }
return str;
};

/**
 * makes text safe for RTF by escaping characters and it also converts linebreaks
 * also checks to see if safetext should be overridden by non-elements like "\line"
 */
function  getRTFSafeText(text){
  //if text is overridden not to be safe
  if(typeof text === "object" && text.hasOwnProperty("safe") && !text.safe){
    return text.text;
  }
  //this could probably all be replaced by a bit of regex
  return text.replaceAll('\\','\\\\')
             .replaceAll('{','\\{')
             .replaceAll('}','\\}')
             .replaceAll('~','\\~')
             .replaceAll('-','\\-')
             .replaceAll('_','\\_')
             //turns line breaks into \line commands
             .replaceAll('\n\r',' \\line ')
             .replaceAll('\n',' \\line ')
             .replaceAll('\r',' \\line ');
}

//gneerates a color table
function createColorTable(colorTable) {
  var table = "",
     c;
  table+="{\\colortbl;";
  for(c=0; c < colorTable.length; c++) {
    rgb = colorTable[c];
    table+="\\red" + rgb.red + "\\green" + rgb.green + "\\blue" + rgb.blue + ";";
  }
  table+="}";
  return table;
}

//gneerates a font table
function createFontTable(fontTable) {
  var table = "",
      f;
  table+="{\\fonttbl;";
  if(fontTable.length === 0) {
    table+="{\\f0 " + Fonts.ARIAL + "}"; //if no fonts are defined, use arial
  } else {
    for(f=0;f<fontTable.length;f++) {
        table+="{\\f" + f + " " + fontTable[f] + "}";
    }
  }
  table+="}";
  return table;
}

exports.getRTFSafeText = getRTFSafeText;
exports.createColorTable = createColorTable;
exports.createFontTable = createFontTable;