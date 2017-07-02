/**
 * RTF Library, for making rich text documents from scratch!
 * by Jonathan Rowny
 */

var
    // RGB = require('./lib/rgb'),
    Element = require('./lib/elements/element'),
    // Format = require('./lib/format'),
    Utils = require('./lib/rtf-utils'),
    Language = require('./lib/language'),
    Orientation = require('./lib/orientation'),
    TextElement = require('./lib/elements/text'),
    GroupElement = require('./lib/elements/group'),
    async = require('async'),
    Options = require('./lib/options'),

    NL = '\n'
;

/** RTF ** {{{ Constructor */
var RTF = function () {

    //Options
    this.pageNumbering = false;
    this.marginLeft = 1800;
    this.marginRight = 1800;
    this.marginBottom = 1440;
    this.marginTop = 1440;

    this.language = Language.ENG_US;

    this.columns = 0;//columns?
    this.columnLines = false;//lines between columns
    this.orientation = Orientation.PORTRAIT;

    //stores the elemnts
    this.elements = [];
    //stores the colors
    this.colorTable = [];
    //stores the fonts
    this.fontTable = [];

};/*}}}*/

/** writeText ** {{{ */
RTF.prototype.writeText = function (text, format, groupName) {
        var element = new TextElement(text, format);
        if(groupName !== undefined && this._groupIndex(groupName) >= 0) {
            this.elements[this._groupIndex(groupName)].push(element);
        } else {
            this.elements.push(element);
        }
};/*}}}*/

/** addTable ** {{{
 * TODO: not sure why this function exists... probably to validate incoming tables later on
 */
RTF.prototype.addTable = function (table) {
    this.elements.push(table);
};/*}}}*/

/** addTextGroup ** {{{ */
RTF.prototype.addTextGroup = function (name, format) {
    if(this._groupIndex(name)<0) {//make sure we don't have duplicate groups!
        var formatGroup = new GroupElement(name, format);
        this.elements.push(formatGroup);
    }
};/*}}}*/

/** addCommand ** {{{ adds a single command to a given group or as an element
 * @param {String} command
 * @param {String} [groupName]
 * @param {Object} [options]
 * TODO this should not be in prototype
 */
RTF.prototype.addCommand = function (command, groupName, options) {
    // Options...
    if ( options === undefined && typeof groupName === 'object' ) {
        options = groupName;
        groupName = undefined;
    }
    if ( options && typeof options === 'object' ) {
        command +=  ( new Options(options) ).compile();
    }
    // Original code...
    if(groupName !== undefined && this._groupIndex(groupName)>=0) {
        this.elements[this._groupIndex(groupName)].addElement({text:command, safe:false});
    } else {
        this.elements.push({text:command, safe:false});
    }
};/*}}}*/
// /** addCommand ** {{{ Добавляем команду RTF
//  * @param {String} command
//  * @param {String} [groupName]
//  * @param {Object} [options]
//  */
// RTF.prototype.addCommand2 = function (command, groupName, options) {
//     if ( options === undefined && typeof groupName === 'object' ) {
//         options = groupName;
//         groupName = undefined;
//     }
//     if ( options && typeof options === 'object' ) {
//         command +=  ( new Options(options) ).compile();
//     }
//     // this.addCommand('\\par\\sb1000', groupName);
//     NodeRTF.prototype.addCommand.apply(this, [ command, groupName ]);
// };/*}}}*/

/** addPage ** {{{ page break shortcut */
RTF.prototype.addPage = function (groupName) {
    this.addCommand("\\page", groupName);
};/*}}}*/

/** addLine ** {{{ line break shortcut */
RTF.prototype.addLine = function (groupName) {
    this.addCommand("\\line", groupName);
};/*}}}*/

/** addTab ** {{{ tab shortcut */
RTF.prototype.addTab = function (groupName) {
    this.addCommand("\\tab", groupName);
};/*}}}*/

/** addSection ** {{{ Добавляем секцию
 * @param {Object} [options]
 * @param {String} [groupName]
 */
RTF.prototype.addSection = function (options, groupName) {
    this.addCommand('\n\\sect', groupName, options);
};/*}}}*/

/** addPara ** {{{ Добавляем параграф
 * @param {Object} [options]
 * @param {String} [groupName]
 */
RTF.prototype.addPara = function (options, groupName) {
    this.addCommand('\n\\par', groupName, options);
};/*}}}*/

/** addOptions ** {{{ Добавляем параметры (стили)
 * @param {Object} [options]
 * @param {String} [groupName]
 */
RTF.prototype.addOptions = function (options, groupName) {
    var command = ( new Options(options) ).compile();
    if ( command ) {
        this.addCommand(command, groupName);
    }
};/*}}}*/

/** _groupIndex ** {{{ gets the index of a group
 * TODO: make this more private by removing it from prototype and passing elements
 */
RTF.prototype._groupIndex = function (name) {
    this.elements.forEach(function(el, i){
        if(el instanceof GroupElement && el.name===name) {
            return i;
        }
    });
    return -1;
};/*}}}*/

/** createDocument ** {{{ */
RTF.prototype.createDocument = function (callback) {
        var output = '{\\rtf1\\ansi\\deff0';
        if(this.orientation === Orientation.LANDSCAPE) { output += '\\landscape'; }
        //margins
        if(this.marginLeft > 0) { output += '\\margl' + this.marginLeft; }
        if(this.marginRight > 0) { output += '\\margr' + this.marginRight; }
        if(this.marginTop > 0) { output += '\\margt' + this.marginTop; }
        if(this.marginBottom > 0) { output += '\\margb' + this.marginBottom; }
        output += '\\deflang' + this.language;

        var ct = this.colorTable;
        var ft = this.fontTable;

        //now that the tasks are done running: create tables, data populated during element output
        output += Utils.createColorTable(ct);
        output += Utils.createFontTable(ft);

        //other options
        if(this.pageNumbering) {
            output += '{\\header\\pard\\qr\\plain\\f0\\chpgn\\par}' + NL;
        }
        if(this.columns > 0) {
            output += '\\cols' + this.columns + NL;
        }
        if(this.columnLines) {
            output += '\\linebetcol' + NL;
        }

        if ( callback ) {
            var tasks = [];
            this.elements.forEach(function(el) {
                if (el instanceof Element){
                    tasks.push(function(cb) { el.getRTFCode(ct, ft, cb); });
                } else {
                    tasks.push(function(cb) { cb(null, Utils.getRTFSafeText(el)); });
                }
            });
            return async.parallel(tasks, function(err, results) {
                var elementOutput = '';
                results.forEach(function(result) {
                         elementOutput += result;
                });

                //final output
                output += elementOutput+'}';

                return callback(null, output);
            });
        }
        else {
            var elemsContent = this.elements
                .map(el => ( el instanceof Element ) ? el.getRTFCode(ct, ft) : Utils.getRTFSafeText(el))
                .join('\n')
            ;
            output += elemsContent + '}';
            return output;
        }
};/*}}}*/

module.exports = RTF;
