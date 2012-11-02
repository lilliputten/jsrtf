var Utils = require("../rtf-utils"),
    Element = require('./element'),
    async = require('async');

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

function rowTask(row, numCols, colorTable, fontTable){
  return function(rowcb){
    var rowTasks = [];
    //generate tasks for each column
    row.forEach(function(el, i) {
      if (el instanceof Element){
          rowTasks.push(function(cb) { el.getRTFCode(colorTable, fontTable, cb); });
      } else {
          rowTasks.push(function(cb) { cb(null, Utils.getRTFSafeText(el)); });
      }
    });

    //process the row
    return async.parallel(rowTasks, function(err, results) {
      var out = "";
      results.forEach(function(result) {
          out += (result + "\\cell ");
      });
      return rowcb(null, out);
    });
  };
}

TableElement.prototype.getRTFCode = function(colorTable, fontTable, callback){
  var rtf = "",
      i, j,
      tasks = [];

  this._rows = this._data.length;
  this._cols = columnCount(this._data);

  //eaech row requires all this data about columns
  var pre = "\\trowd\\trautofit1\\intbl";
  var post = "{\\trowd\\trautofit1\\intbl";
  //now do the first \cellx things
  for(j = 0; j<this._cols; j++){
    pre += "\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10";
    pre += "\\cellx" + (j+1).toString();
    post += "\\cellx" + (j+1).toString();
  }
  post += "\\row }";

  //generate tasks for each row
  for(i = 0; i < this._rows; i++){
    if(this._data[i]){
      tasks.push(rowTask(this._data[i], this._cols, colorTable, fontTable));
    }
  }

  return async.parallel(tasks, function(err, results) {
    var rows = "";
    results.forEach(function(result) {
        rows += (pre + "{" + result + " }" + post);
    });
    rtf = "\\par" + rows + "\\pard";
    return callback(null, rtf);
  });
};