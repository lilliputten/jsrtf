RGB = require("./rgb");
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

//helpers
var Align = {
  LEFT : "\\ql",
  RIGHT : "\\qr",
  CENTER : "\\qc",
  FULL : "\\qj"
};

var Fonts = {
  ARIAL : "Arial",
  COMIC_SANS : "Comic Sans MS",
  GEORGIA : "Georgia",
  IMPACT : "Impact",
  TAHOMA : "Tahoma",
  HELVETICA : "Helvetica",
  VERDANA : "Verdana",
  COURIER_NEW : "Courier New",
  PALATINO : "Palatino Linotype",
  TIMES_NEW_ROMAN : "Times New Roman"
};

var Language = {
  ENG_US : "1033",
  SP_MX : "2058",
  FR : "1036",
  NONE : "1024"
};

var Orientation = {
  PORTRAIT : false,
  LANDSCAPE : true
};
var Colors =
{
  BLACK : new RGB(0,0,0),
  WHITE : new RGB(255,255,255),
  RED : new RGB(255,0,0),
  BLUE : new RGB(0,0,255),
  LIME : new RGB(191,255,0),
  YELLOW : new RGB(255,255,0),
  MAROON : new RGB(128,0,0),
  GREEN : new RGB(0,255,0),
  GRAY : new RGB(80,80,80),
  ORANGE : new RGB(255,127,0)
};

exports.Colors = Colors;
exports.Align = Align;
exports.Fonts = Fonts;
exports.Language = Language;
exports.Orientation = Orientation;
exports.getRTFSafeText = getRTFSafeText;