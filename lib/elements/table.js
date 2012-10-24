Utils = require("./rtf-utils");

module.exports = TableElement = function(rows, cols){
  this.rows=rows;
  this.cols=cols;
  this._tableRows = [];
};

TableElement.prototype.addRow = function(row){
    this._tableRows.push(row);
};

TableElement.prototype.getRTFCode = function(){
  var rtf = "\\par",
      i, j, c, x;
  
  for(i = 0; i<this.rows.length; i++){
    if(this._tableRows[i]){
      rtf += "\\trowd\\trautofit1\\intbl";
      //now do the first \cellx things
      for(j = 0; j<this.cols.length; j++){
        rtf += "\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10";
        rtf += "\\cellx" + (j+1).toString();
      }
      //now create the content
      rtf += "{";
      for(c = 0; c<this.cols.length; c++){
        if(this._tableRows[i][c]){
          rtf += Utils.getRTFSafeText(this._tableRows[i][c]);
        }
        rtf += "\\cell ";
      }
      rtf += " }";
      //now for some reason we need to do part of it over again, I think it's for backwards compatibility
      rtf += "{\\trowd\\trautofit1\\intbl";
      for( x=0; x<this.col.length; x++){
        rtf += "\\cellx" + (x+1).toString();
      }
      rtf += "\\row }";
    }
  }
  rtf += "\\pard";
  return rtf;
};