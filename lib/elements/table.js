var Utils = require("../rtf-utils"),
    Element = require('./element');

//TODO: probably replace this with something from underscore
function columnCount(target){
    var rows = target.length, max = 0, i;
    for(i = 0; i < rows; i++){
      if(target[i].length > max) max = target[i].length;
    }
    return max;
}

module.exports = TableElement = function(){
  Element.apply(this, arguments);
  this._data = [];
  this._rows = 0;
  this._cols = 0;
};

TableElement.subclass(Element);

TableElement.prototype.addRow = function(row){
    this._data.push(row);
};

TableElement.prototype.setData = function(data){
    this._data = data;
};

TableElement.prototype.getRTFCode = function(colorTable, fontTable){
  var rtf = "\\par",
      i, j, c, x;

  this._rows = this._data.length;
  this._cols = columnCount(this._data);
  for(i = 0; i<this._rows; i++){
    if(this._data[i]){
      rtf += "\\trowd\\trautofit1\\intbl";
      //now do the first \cellx things
      for(j = 0; j<this._cols; j++){
        rtf += "\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10";
        rtf += "\\cellx" + (j+1).toString();
      }
      //now create the content
      rtf += "{";
      for(c = 0; c<this._cols; c++){
        if(this._data[i][c]){
          if(this._data[i][c] instanceof Element){
            rtf += this._data[i][c].getRTFCode(colorTable, fontTable);
          }else{
            rtf += Utils.getRTFSafeText(this._data[i][c]);
          }
        }
        rtf += "\\cell ";
      }
      rtf += " }";
      //now for some reason we need to do part of it over again, I think it's for backwards compatibility
      rtf += "{\\trowd\\trautofit1\\intbl";
      for( x=0; x<this._cols; x++){
        rtf += "\\cellx" + (x+1).toString();
      }
      rtf += "\\row }";
    }
  }
  rtf += "\\pard";
  return rtf;
};