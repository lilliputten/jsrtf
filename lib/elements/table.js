/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var
    Utils = require('../rtf-utils'),
    Format = require('../format'),

    Element = require('./element'),
    inherit = require('inherit'),

    isArray = Array.isArray
;

var TableElement = inherit(Element, {

    /** __constructor ** {{{
     * @param {Object} options
     * @param {Object} [options.format]
     * @param {Object} [options.rowFormat]
     * @param {Object} [options.firstRowFormat]
     * @param {Object[]} [options.cellsFormats]
     */
    __constructor : function (options) {
        this.__base.apply(this, arguments);
        this.data = [];
        Object.assign(this, options);
        this.data || ( this.data = [] );
        this.format || ( this.format = new Format () );
        this.rowFormat || ( this.rowFormat = new Format () );
        this.cellsFormats || ( this.cellsFormats = [] );
    },/*}}}*/

    /** addRow ** {{{ Append one row data
     */
    addRow : function(row){
        this.data.push(row);
    },/*}}}*/

    /** setData ** {{{ Set all table data
     */
    setData : function(data){
        this.data = data;
    },/*}}}*/

    /** columnsCount ** {{{ Calculate columns count (max columns count in all rows)
     */
    columnsCount : function () {
        var max = this.data.reduce((max, row) => Math.max(max, row.length), 0);
        return max;
    },/*}}}*/

    /** rowContent ** {{{ Get row content
     * @param {Array} row - Row data
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    rowContent : function (row, rowNo, colorTable, fontTable) {
        var columnsCount = row.length;
        var tableFormat = this.format;
        var rowFormat = ( rowNo || !this.firstRowFormat ) ? this.rowFormat : this.firstRowFormat;
        var rowContent = row
            .map(cell => ( cell instanceof Element ) ? cell.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(cell) )
            .map((cellContent,n) => {
                var cellFormat = this.cellsFormats[n];
                if ( cellFormat ) {
                    cellContent = cellFormat.formatText(cellContent, colorTable, fontTable, false);
                }
                return cellContent;
            })
            .map(cellContent => cellContent + '\\cell')
            .join(' ')
        ;
        rowContent = rowFormat.formatText(rowContent, colorTable, fontTable, false);
        var rowPlus = '\{\\trowd\\trautofit1\\intbl';
        var lastRatio = 0;
        row.map((cell,n) => {
            if ( rowFormat.tableHeader ) {
                rowPlus += '\\trhdr';
            }
            if ( tableFormat.tableBorder ) {
                rowPlus += [
                    '',
                    '\\clbrdrt\\brdrs\\brdrw' + tableFormat.tableBorder,
                    '\\clbrdrb\\brdrs\\brdrw' + tableFormat.tableBorder,
                    '\\clbrdrl\\brdrs\\brdrw' + tableFormat.tableBorder,
                    '\\clbrdrr\\brdrs\\brdrw' + tableFormat.tableBorder,
                ].join('\n');
            }
            var cellFormat = this.cellsFormats[n];
            var bgColorPos = ( cellFormat && Utils.isIndex(cellFormat.bgColorPos) ) ? cellFormat.bgColorPos : rowFormat.bgColorPos;
            if ( Utils.isIndex(bgColorPos) ) {
                rowPlus += '\n\\clcbpat' + ( bgColorPos + 1 );
            }
            // Evaluate cell width
            // TODO: Normalize cells widths?
            var width;
            if ( cellFormat && cellFormat.width ) {
                width = cellFormat.width;
            }
            else {
                var ratio = ( n + 1 ) / columnsCount;
                if ( cellFormat && cellFormat.widthPercents ) {
                    ratio = lastRatio + cellFormat.widthPercents / 100;
                }
                if ( cellFormat && cellFormat.widthRatio ) {
                    ratio = lastRatio + cellFormat.widthRatio;
                }
                lastRatio = ratio;
                width = Math.round( tableFormat.tableWidth ? tableFormat.tableWidth * ratio : columnsCount * ratio );
            }
            rowPlus += '\n\\cellx' + width;
        });
        rowPlus += '\n\\row\}';
        rowContent += '\n' + rowPlus;
        return rowContent;
    },/*}}}*/

    /** updateFormats ** {{{ Update all using formats
     * @param {Object} colorTable
     * @param {Object} fontTable
     */
    updateFormats : function (colorTable, fontTable) {

        var formats = ( this.cellsFormats || [] ).concat([
            this.format,
            this.rowFormat,
            this.firstRowsFormat,
        ]);

        formats
            .filter(fmt => fmt)
            .map(fmt => fmt.updateTables(colorTable, fontTable))
        ;

    },/*}}}*/

    /** getRTFCode ** {{{ Get rtf content for entire table
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    getRTFCode : function (colorTable, fontTable) {

        this.updateFormats(colorTable, fontTable);

        var content = this.data
            .filter(row => isArray(row))
            .map((row,rowNo) => this.rowContent(row, rowNo, colorTable, fontTable), this)
            .join('\n')
        ;

        return content;

    },/*}}}*/

}); // end inherit

module.exports = TableElement;
