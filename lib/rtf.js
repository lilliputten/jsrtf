/**
 * RTF Library, for making rich text documents from scratch!
 * by Jonathan Rowny
 *
 * Far from perfect:
 * TODO: stop passing the font/color table positions all over the place, just get them when you need them (on doc generation)
 * TODO: make image element
 * TODO: write tests
 * TODO: move this todo list into an actual issue queue
 */

var RGB = require("./rgb"),
    Format = require("./format"),
    Utils = require("./rtf-utils"),
    TextElement = require("./elements/text"),
    GroupElement = require("./elements/group");

  

module.exports = RTF = function () {
  //Options
    this.pageNumbering = false;
    this.marginLeft = 1800;
    this.marginRight = 1800;
    this.marginBottom = 1440;
    this.marginTop = 1440;
    
    this.language = Utils.Language.ENG_US;
    
    this.columns = 0;//columns?
    this.columnLines = false;//lines between columns
    this.orientation = Utils.Orientation.PORTRAIT;
    
    //stores the elemnts
    this.elements = [];
    //stores the colors
    this.colorTable = [];
    //stores the fonts
    this.fontTable = [];
};

RTF.prototype.writeText = function (text, format, groupName) {
    if(format === undefined) format = new Format();
    this._updateTables(format);
    var fontPos = this.fontTable.indexOf(format.font), //should return -1 if not found
        colorPos = this.colorTable.indexOf(format.color),
        backgroundColorPos = this.colorTable.indexOf(format.backgroundColor);
  
    element = new TextElement(text, format, colorPos, backgroundColorPos, fontPos);
    if(groupName !== undefined && this._groupIndex(groupName) >= 0) {
      this.elements[this._groupIndex(groupName)].push(element);
    } else {
      this.elements.push(element);
    }
};

//TODO: not sure why this function exists... probably to validate incoming tables later on
RTF.prototype.addTableElement = function (table) {
  this.elements.push(table);
};

RTF.prototype.addTextGroup = function (name, format) {
  if(this._groupIndex(name)<0) {//make sure we don't have duplicate groups!
    this._updateTables(format);
    var fontPos = this.fontTable.indexOf(format.font),
        colorPos = this.colorTable.indexOf(format.color),
        backgroundColorPos = this.colorTable.indexOf(format.backgroundColor);
    formatGroup = new GroupElement(name, format, colorPos, backgroundColorPos, fontPos);
    this.elements.push(formatGroup);
  }
};

//adds a single command to a given group or as an element
//TODO this should not be in prototype.
RTF.prototype.addCommand = function (command, groupName) {
  if(groupName !== undefined && this._groupIndex(groupName)>=0) {
    this.elements[this._groupIndex(groupName)].addElement(command);
  } else {
    this.elements.push(command);
  }
};

//page break shortcut
RTF.prototype.addPage = function (groupName) {
  this.addCommand("\\page", groupName);
};

//line break shortcut
RTF.prototype.addLine = function (groupName) {
  this.addCommand("\\line", groupName);
};

//tab shortcut
RTF.prototype.addTab = function (groupName) {
  this.addCommand("\\tab", groupName);
};


//gets the index of a group
//TODO: make this more private by removing it from prototype and passing elements
RTF.prototype._groupIndex = function (name) {
  var j;
  for(j=0;j<this.elements.length;j++) {
    if(this.elements[j].hasOwnProperty('elements') && this.elements[j].name==name) {
      return j;
    }
  }
  return -1;
};

//TODO: make this more private by removing it from prototype and passing tables
RTF.prototype._updateTables = function (format) {
  var fontPos = this.fontTable.indexOf(format.font),
      colorPos = this.colorTable.indexOf(format.color),
      backgroundColorPos = this.colorTable.indexOf(format.backgroundColor);
  if(fontPos < 0 && format.font.length > 0) {
    this.fontTable.push(format.font);
  }
  if(colorPos < 0 && format.color !== undefined) {
    this.colorTable.push(format.color);
  }
  if(backgroundColorPos<0 && format.backgroundColor !== undefined) {
    this.colorTable.push(format.backgroundColor);
  }
};


//gneerates the color table
//TODO: this should probably be private, not in prototype
RTF.prototype.createColorTable = function () {
   var table = "",
       c;
   table+="{\\colortbl;";
   for(c=0;c< this.colorTable.length; c++) {
    rgb = this.colorTable[c];
    table+="\\red" + rgb.red + "\\green" + rgb.green + "\\blue" + rgb.blue;
   }
   table+="}";
   return table;
 };

//TODO: this should probably be private, not in prototype
 RTF.prototype.createFontTable = function () {
  var table = "",
      f;
  table+="{\\fonttbl;";
  if(this.fontTable.length === 0) {
    table+="{\\f0 " + Utils.Fonts.ARIAL + "}"; //if no fonts are defined, use arial
  } else {
    for(f=0;f<this.fontTable.length;f++) {
        table+="{\\f" + f + " " + this.fontTable[f] + "}";
    }
  }
  table+="}";
  return table;
 };

 RTF.prototype.createDocument = function () {
    var output = "{\\rtf1\\ansi\\deff0",
      i;
    if(this.orientation == Utils.Orientation.LANDSCAPE) output+="\\landscape";
    //margins
    if(this.marginLeft > 0) output+="\\margl" + this.marginLeft;
    if(this.marginRight > 0) output+="\\margr" + this.marginRight;
    if(this.marginTop > 0) output+="\\margt" + this.marginTop;
    if(this.marginBottom > 0) output+="\\margb" + this.marginBottom;
    output+="\\deflang" + this.language;
    //create tables
    output+=this.createColorTable();
    output+=this.createFontTable();
    //other options
    if(this.pageNumbering) output+="{\\header\\pard\\qr\\plain\\f0\\chpgn\\par}";
    if(this.columns > 0) output+="\\cols" + this.columns;
    if(this.columnLines) output+="\\linebetcol";

    //outputs the this.elements
    for(i = 0; i<this.elements.length; i++) {
      //todo: can I use hasownproperty on a function name?
      if(this.elements[i].hasOwnProperty("format") || this.elements[i].hasOwnProperty("rows")) {
        output+=this.elements[i].getRTFCode();
      } else {
        output+=this.elements[i];
      }
    }

    output+="}";
    return output;
 };
