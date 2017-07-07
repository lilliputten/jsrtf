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
     * @param {Object[]} [options.cellFormats]
     */
    __constructor : function (options) {
        this.__base.call(this, options && options.format);
        this.data = [];
        Object.assign(this, options);
        this.data || ( this.data = [] );
        this.format || ( this.format = new Format () );
        this.rowFormat || ( this.rowFormat = new Format () );
        this.cellFormats || ( this.cellFormats = [] );
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

    /** getRowContent ** {{{ Get row content
     * @param {Object} jsRTF
     * @param {Array} row - Row data
     * @param {Number} rowNo - Row number
     * @returns {String}
     */
    getRowContent : function (jsRTF, row, rowNo) {
        var columnsCount = row.length;
        var rowCascade = [ this.format, this.rowFormat ];
        if ( !rowNo && this.firstRowFormat ) {
            rowCascade.push(this.firstRowFormat);
        }
        var cellCascade = rowCascade.concat([ this.cellFormat ]);
        var rowContent = row
            .map(cell => ( cell instanceof Element ) ? cell.getRTFCode(jsRTF) : Utils.getRTFSafeText(cell) )
            .map((cellContent,n) => {
                var lastCellCascade = cellCascade.concat([ isArray(this.cellFormats) && this.cellFormats[n] ]);
                cellContent = jsRTF.cascadeFormats(cellContent, lastCellCascade, {
                    reverseCascade : true,
                    noEscape : true,
                    filter : 'text',
                    strictFilter : false,
                });
                return cellContent;
            })
            .map(cellContent => cellContent + '\\cell')
            .join(' ')
        ;
        rowContent = jsRTF.cascadeFormats(rowContent, rowCascade, {
                    reverseCascade : true,
            noEscape : true,
            filter : 'row',
            strictFilter : true,
        });

        var rowPlus = '\{\\trowd\\trautofit1\\intbl';
        rowPlus += jsRTF.cascadeFormats('', rowCascade, {
                    reverseCascade : true,
            noEscape : true,
            filter : 'rowDef',
            strictFilter : true,
        });

        var lastRatio = 0;
        row.map((cell,n) => {
            // ???
            // if ( this.format.tableBorder ) {
            //     rowPlus += [
            //         '',
            //         // TODO: border type, color?
            //         '\\clbrdrt\\brdrs\\brdrw' + this.format.tableBorder,
            //         '\\clbrdrb\\brdrs\\brdrw' + this.format.tableBorder,
            //         '\\clbrdrl\\brdrs\\brdrw' + this.format.tableBorder,
            //         '\\clbrdrr\\brdrs\\brdrw' + this.format.tableBorder,
            //     ].join('\n');
            // }
            rowPlus += jsRTF.cascadeFormats('', cellCascade.concat([ isArray(this.cellFormats) && this.cellFormats[n] ]), {
                reverseCascade : true,
                noEscape : true,
                filter : 'cellDef',
                strictFilter : true,
            });
            // Evaluate cell width
            // TODO: Normalize cells widths?
            var cellFormat = this.cellFormats[n] || this.cellFormat;
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
                width = Math.round( this.format.tableWidth ? this.format.tableWidth * ratio : columnsCount * ratio );
            }
            rowPlus += '\n\\cellx' + width;
        });
        rowPlus += '\n\\row\}';
        rowContent += '\n' + rowPlus;
        return rowContent;
    },/*}}}*/

    /** updateFormats ** {{{ Update all using formats
     * @param {Object} jsRTF
     */
    updateFormats : function (jsRTF) {

        var formats = ( this.cellFormats || [] ).concat([
            this.format,
            this.rowFormat,
            this.firstRowsFormat,
        ]);

        formats
            .filter(fmt => fmt)
            .map(fmt => fmt.updateTables(jsRTF))
        ;

    },/*}}}*/

    /** getRTFCode ** {{{ Get rtf content for entire table
     * @param {Object} jsRTF
     * @returns {String}
     */
    getRTFCode : function (jsRTF) {

        this.updateFormats(jsRTF);

        var content = this.data
            .filter(row => isArray(row))
            .map((row,rowNo) => this.getRowContent(jsRTF, row, rowNo), this)
            .join('\n')
        ;

        return content;

    },/*}}}*/

}); // end inherit

module.exports = TableElement;
