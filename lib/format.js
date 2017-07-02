var Utils = require('./rtf-utils'),
    // Align = require('./align'),
    RGB = require('./rgb'),
    Fonts = require('./fonts')
;

var defaultOptions = {
    underline: false,
    bold: false,
    italic: false,
    strike: false,

    superScript: false,
    subScript: false,

    makeParagraph: false,

    align: '',

    leftIndent: 0,
    rightIndent: 0,

    font: Fonts.ARIAL,
    fontSize: 0,
    //color: rgb,
    //backgroundColor: rgb,

    colorPos: -1,
    backgroundColorPos: -1,
    fontPos: -1,
};

var Format = function(options){
    Object.assign(this, defaultOptions, options);
};

//because JS doesn't have .equalsTo
function getColorPosition(table, find){
    if(find !== undefined && find instanceof RGB){
        table.forEach(function(color, index){
            if(color.red === find.red &&
                 color.green === find.green &&
                 color.blue === find.blue){
                return index;
            }
        });
    }
    return -1;
}

Format.prototype.updateTables = function(colorTable, fontTable){
    this.fontPos = fontTable.indexOf(this.font);
    this.colorPos = getColorPosition(colorTable, this.color);
    this.backgroundColorPos = getColorPosition(colorTable, this.backgroundColor);

    //if a a font was defined, and it's not in a table, add it in!
    if(this.fontPos < 0 && this.font !== undefined && this.font.length > 0) {
        fontTable.push(this.font);
        this.fontPos = fontTable.length-1;
    }
    //if a color was defined, and it's not in the table, add it as well
    if(this.colorPos < 0 && this.color !== undefined) {
        colorTable.push(this.color);
        this.colorPos = colorTable.length;
    }
    //background colors use the same table as color
    if(this.backgroundColorPos < 0 && this.backgroundColor !== undefined) {
        colorTable.push(this.backgroundColor);
        this.backgroundColorPos = colorTable.length;
    }
};

//some RTF elements require that they are wrapped, closed by a trailing 0 and must have a spacebefore the text.
function wrap(text, rtfwrapper){
    return rtfwrapper + ' ' + text + rtfwrapper + '0';
}

/**
 * Applies a format to some text
 */
Format.prototype.formatText = function(text, colorTable, fontTable, safeText){
    this.updateTables(colorTable, fontTable);
    var rtf = '{';
    if(this.makeParagraph) {
            rtf+='\\pard';
    }

    if(this.fontPos !== undefined && this.fontPos>=0) {
            rtf+='\\f' + this.fontPos;
    }
    //Add one because color 0 is null
    if(this.backgroundColorPos !== undefined && this.backgroundColorPos >= 0) {
            rtf+='\\cb' + String(this.backgroundColorPos+1);
    }
    //Add one because color 0 is null
    if(this.colorPos !== undefined && this.colorPos>=0) {
            rtf+='\\cf' + this.colorPos;
    }
    if(this.fontSize >0) {
            rtf += '\\fs' + String(this.fontSize*2);
    }
    if(this.align.length > 0) {
            rtf += this.align;
    }
    if(this.leftIndent>0) {
            rtf += '\\li' + String(this.leftIndent*20);
    }
    if(this.rightIndent>0) {
            rtf += '\\ri' + this.rightIndent;
    }

    //we don't escape text if there are other elements in it, so set a flag
    var content = '';
    if(safeText === undefined || safeText){
        content += Utils.getRTFSafeText(text);
    }else{
        content += text;
    }

    if(this.bold) {
            content = wrap(content, '\\b') ;
    }
    if(this.italic) {
            content = wrap(content, '\\i');
    }
    if(this.underline) {
            content = wrap(content, '\\ul');
    }
    if(this.strike) {
            content = wrap(content, '\\strike');
    }
    if(this.subScript) {
            content = wrap(content, '\\sub');
    }
    if(this.superScript) {
            content = wrap(content, '\\super');
    }
    rtf += content;

    //close paragraph
    if(this.makeParagraph) {
            rtf += '\\par';
    }

    //close doc
    rtf+='}';

    return rtf;
};

module.exports = Format;
