var rtf = require('../lib/rtf'),
    Format = require('../lib/format'),
    Colors = require('../lib/colors'),
    RGB = require('../lib/rgb'),
    fs  = require('fs');
var myDoc = new rtf(),
    red_underline = new Format(),
    blue_strike = new Format(),
    green_bold = new Format(),
    maroon_super = new Format(),
    gray_sub = new Format(),
    lime_indent = new Format(),
    custom_blue = new Format();

red_underline.color = Colors.RED;
red_underline.underline = true;
red_underline.fontSize = 20;
myDoc.writeText("Red underlined", red_underline);
myDoc.addLine();
blue_strike.color = Colors.RED;
blue_strike.strike = true;
myDoc.writeText("Strikeout Blue", blue_strike);
myDoc.addLine();
green_bold.color = Colors.GREEN;
green_bold.bold = true;
myDoc.writeText("Bold Green", green_bold);
myDoc.addLine();
maroon_super.color = Colors.MAROON;
maroon_super.superScript = true;
myDoc.writeText("Superscripted Maroon", maroon_super);
myDoc.addLine();
gray_sub.color = Colors.GRAY;
gray_sub.subScript = true;
myDoc.writeText("Subscripted Gray", gray_sub);
myDoc.addLine();
lime_indent.color = Colors.LIME;
lime_indent.backgroundColor = Colors.Gray;
lime_indent.leftIndent = 50;
myDoc.writeText("Left indented Lime", lime_indent);
myDoc.addLine();
custom_blue.color = new RGB(3, 80, 150);
myDoc.writeText("Custom blue color", custom_blue);

myDoc.createDocument(
    function(err, output){
        console.log(output);
        fs.writeFile('formatting.rtf', output, function (err) {
          if (err) return console.log(err);
        });
    }
);
