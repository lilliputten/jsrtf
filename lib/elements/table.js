/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var
    Utils = require('../rtf-utils'),
    Format = require('../format'),

    Element = require('./element'),
    inherit = require('inherit')
;

// TableElement.subclass(Element);

var TableElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor : function (options) {
        this.__base.apply(this, arguments);
        this.data = [];
        Object.assign(this, options);
        this.data || ( this.data = [] );
        this.format || ( this.format = new Format () );
    },/*}}}*/

    /** addRow ** {{{ */
    addRow : function(row){
        this.data.push(row);
    },/*}}}*/

    /** setData ** {{{ */
    setData : function(data){
        this.data = data;
    },/*}}}*/

    /** columnsCount ** {{{
     */
    columnsCount : function () {
        var max = this.data.reduce((max, row) => Math.max(max, row.length), 0);
        return max;
    },/*}}}*/

    /** rowTask ** {{{ */
    rowTask : function (row, numCols, colorTable, fontTable) {
        var content = row
            .map((el) => ( el instanceof Element ) ? el.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(el) )
            .map((result) => result + '\\cell')
            .join(' ')
        ;
        return content;
    },/*}}}*/

    /** getRTFCode ** {{{ */
    getRTFCode : function (colorTable, fontTable) {

        var columnsCount = this.columnsCount();

        //eaech row requires all this data about columns
        var rowPrefix = '';//'\\trowd\\trautofit1\\intbl';
        var post = '\{\\trowd\\trautofit1\\intbl';
        //now do the first \cellx things
        Array.from(Array(columnsCount)).map(function(undef,n){
            // rowPrefix += '';//'\\clbrdrt\\brdrs\\brdrw10\\clbrdrl\\brdrs\\brdrw10\\clbrdrb\\brdrs\\brdrw10\\clbrdrr\\brdrs\\brdrw10';
            // rowPrefix += '\\cellx' + String(n+1) + '\n';
            if ( this.format && this.format.tableBorder ) {
                post += [
                    '',
                    '\\clbrdrt\\brdrs\\brdrw'+this.format.tableBorder,
                    '\\clbrdrb\\brdrs\\brdrw'+this.format.tableBorder,
                    '\\clbrdrl\\brdrs\\brdrw'+this.format.tableBorder,
                    '\\clbrdrr\\brdrs\\brdrw'+this.format.tableBorder,
                ].join('\n');
            }
            post += '\n\\cellx' + String(n+1);
        }, this);
        // for ( var n = 0; n<columnsCount; n++ ) {
        // }
        post += '\n\\row\}';

        var content = this.data
            .filter(row => row)
            .map(row => this.rowTask(row, this._cols, colorTable, fontTable), this)
            .map(result => rowPrefix + '\{' + result + '\}' + '\n' + post)
            .join('\n')
        ;
        // content = '\\par' + content + '\\pard'; // ???
        return content;

    },/*}}}*/

}); // end inherit

module.exports = TableElement;
