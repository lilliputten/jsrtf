/**
 * RTF
 * by
 */
/**
 *
 * @module RTF
 * @overview Library, for making rich text documents from scratch!
 * @author lilliputten <igor@lilliputten.ru>
 *
 * Original maintainer Jonathan Rowny (https://github.com/jrowny/node-rtf)
 *
 * @since 2016.08.19, 14:00
 * @version 2017.05.05, 20:08
 *
 * $Id: Report.js 8619 2017-06-22 12:21:55Z miheev $
 * $Date: 2017-06-22 15:21:55 +0300 (Thu, 22 Jun 2017) $
 *
 * Created by Михаил on 21.11.2016.
 *
 * @class Report
 * @classdesc Клиентский класс компонента создания отчётов
 *
 * TODO
 * ====
 *
 * - Загрузка библиотек.
 * - Попробовать найти rtf.
 * - Рефакторить код, сделать нормальную передачу данных, подключать бибилиотеки когда надо.
 *
 * ОПИСАНИЕ
 * ========
 *
 * (См. Report.md)
 *
 * Подмодули
 * =========
 *
 * См. зависимости, создание сущностей в onInited, соотв. модули.
 *
 * Инициализиурются на текущем DOM (см. инициализацию в onInited по списку из params.useModules, см. _getDefaultParams).
 *
 * (Если в модуле задан метод `asyncInitModule`, он вызывается
 * сразу после после инициализации модуля. Ожидается Promise,
 * дальнейшее выполнение зависит от результа промиса.)
 *
 * - ReportPrint: Подготовка представления отчёта для печати. Разворачивается в открывающемся всплывающем окне. См. Report__Print.printReportAction.
 *
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
    inherit = require('inherit'),

    NL = '\n'
;

/**
 * @class
 * @name RTF
 */
var RTF = inherit({

    //Options
    pageNumbering: false,
    marginLeft: 1800,
    marginRight: 1800,
    marginBottom: 1440,
    marginTop: 1440,

    language: Language.ENG_US,

    columns: 0,//columns?
    columnLines: false,//lines between columns
    orientation: Orientation.PORTRAIT,

    //stores the elemnts
    elements: [],
    //stores the colors
    colorTable: [],
    //stores the fonts
    fontTable: [],

    /** writeText ** {{{ */
    writeText : function (text, format, groupName) {
            var element = new TextElement(text, format);
            if(groupName !== undefined && this._groupIndex(groupName) >= 0) {
                this.elements[this._groupIndex(groupName)].push(element);
            } else {
                this.elements.push(element);
            }
    },/*}}}*/

    /** addTable ** {{{
     * TODO: not sure why this function exists... probably to validate incoming tables later on
     */
    addTable : function (table) {
        this.elements.push(table);
    },/*}}}*/

    /** addTextGroup ** {{{ */
    addTextGroup : function (name, format) {
        if(this._groupIndex(name)<0) {//make sure we don't have duplicate groups!
            var formatGroup = new GroupElement(name, format);
            this.elements.push(formatGroup);
        }
    },/*}}}*/

    /** addCommand ** {{{ adds a single command to a given group or as an element
     * @param {String} command
     * @param {String} [groupName]
     * @param {Object} [options]
     * TODO this should not be in prototype
     */
    addCommand : function (command, groupName, options) {
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
    },/*}}}*/
    // /** addCommand ** {{{ Добавляем команду RTF
    //  * @param {String} command
    //  * @param {String} [groupName]
    //  * @param {Object} [options]
    //  */
    // addCommand2 : function (command, groupName, options) {
    //     if ( options === undefined && typeof groupName === 'object' ) {
    //         options = groupName;
    //         groupName = undefined;
    //     }
    //     if ( options && typeof options === 'object' ) {
    //         command +=  ( new Options(options) ).compile();
    //     }
    //     // this.addCommand('\\par\\sb1000', groupName);
    //     NodeRTF.prototype.addCommand.apply(this, [ command, groupName ]);
    // },/*}}}*/

    /** addPage ** {{{ page break shortcut */
    addPage : function (groupName) {
        this.addCommand("\\page", groupName);
    },/*}}}*/

    /** addLine ** {{{ line break shortcut */
    addLine : function (groupName) {
        this.addCommand("\\line", groupName);
    },/*}}}*/

    /** addTab ** {{{ tab shortcut */
    addTab : function (groupName) {
        this.addCommand("\\tab", groupName);
    },/*}}}*/

    /** addSection ** {{{ Добавляем секцию
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addSection : function (options, groupName) {
        this.addCommand('\n\\sect', groupName, options);
    },/*}}}*/

    /** addPara ** {{{ Добавляем параграф
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addPara : function (options, groupName) {
        this.addCommand('\n\\par', groupName, options);
    },/*}}}*/

    /** addOptions ** {{{ Добавляем параметры (стили)
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addOptions : function (options, groupName) {
        var command = ( new Options(options) ).compile();
        if ( command ) {
            this.addCommand(command, groupName);
        }
    },/*}}}*/

    /** _groupIndex ** {{{ gets the index of a group
     * TODO: make this more private by removing it from prototype and passing elements
     */
    _groupIndex : function (name) {
        this.elements.forEach(function(el, i){
            if(el instanceof GroupElement && el.name===name) {
                return i;
            }
        });
        return -1;
    },/*}}}*/

    /** createDocument ** {{{ */
    createDocument : function (callback) {
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
    },/*}}}*/

});

// // OLD CODE {{{
//
// /** writeText ** {{{ */
// RTF.prototype.writeText = function (text, format, groupName) {
//         var element = new TextElement(text, format);
//         if(groupName !== undefined && this._groupIndex(groupName) >= 0) {
//             this.elements[this._groupIndex(groupName)].push(element);
//         } else {
//             this.elements.push(element);
//         }
// };/*}}}*/
//
// /** addTable ** {{{
//  * TODO: not sure why this function exists... probably to validate incoming tables later on
//  */
// RTF.prototype.addTable = function (table) {
//     this.elements.push(table);
// };/*}}}*/
//
// /** addTextGroup ** {{{ */
// RTF.prototype.addTextGroup = function (name, format) {
//     if(this._groupIndex(name)<0) {//make sure we don't have duplicate groups!
//         var formatGroup = new GroupElement(name, format);
//         this.elements.push(formatGroup);
//     }
// };/*}}}*/
//
// /** addCommand ** {{{ adds a single command to a given group or as an element
//  * @param {String} command
//  * @param {String} [groupName]
//  * @param {Object} [options]
//  * TODO this should not be in prototype
//  */
// RTF.prototype.addCommand = function (command, groupName, options) {
//     // Options...
//     if ( options === undefined && typeof groupName === 'object' ) {
//         options = groupName;
//         groupName = undefined;
//     }
//     if ( options && typeof options === 'object' ) {
//         command +=  ( new Options(options) ).compile();
//     }
//     // Original code...
//     if(groupName !== undefined && this._groupIndex(groupName)>=0) {
//         this.elements[this._groupIndex(groupName)].addElement({text:command, safe:false});
//     } else {
//         this.elements.push({text:command, safe:false});
//     }
// };/*}}}*/
// // /** addCommand ** {{{ Добавляем команду RTF
// //  * @param {String} command
// //  * @param {String} [groupName]
// //  * @param {Object} [options]
// //  */
// // RTF.prototype.addCommand2 = function (command, groupName, options) {
// //     if ( options === undefined && typeof groupName === 'object' ) {
// //         options = groupName;
// //         groupName = undefined;
// //     }
// //     if ( options && typeof options === 'object' ) {
// //         command +=  ( new Options(options) ).compile();
// //     }
// //     // this.addCommand('\\par\\sb1000', groupName);
// //     NodeRTF.prototype.addCommand.apply(this, [ command, groupName ]);
// // };/*}}}*/
//
// /** addPage ** {{{ page break shortcut */
// RTF.prototype.addPage = function (groupName) {
//     this.addCommand("\\page", groupName);
// };/*}}}*/
//
// /** addLine ** {{{ line break shortcut */
// RTF.prototype.addLine = function (groupName) {
//     this.addCommand("\\line", groupName);
// };/*}}}*/
//
// /** addTab ** {{{ tab shortcut */
// RTF.prototype.addTab = function (groupName) {
//     this.addCommand("\\tab", groupName);
// };/*}}}*/
//
// /** addSection ** {{{ Добавляем секцию
//  * @param {Object} [options]
//  * @param {String} [groupName]
//  */
// RTF.prototype.addSection = function (options, groupName) {
//     this.addCommand('\n\\sect', groupName, options);
// };/*}}}*/
//
// /** addPara ** {{{ Добавляем параграф
//  * @param {Object} [options]
//  * @param {String} [groupName]
//  */
// RTF.prototype.addPara = function (options, groupName) {
//     this.addCommand('\n\\par', groupName, options);
// };/*}}}*/
//
// /** addOptions ** {{{ Добавляем параметры (стили)
//  * @param {Object} [options]
//  * @param {String} [groupName]
//  */
// RTF.prototype.addOptions = function (options, groupName) {
//     var command = ( new Options(options) ).compile();
//     if ( command ) {
//         this.addCommand(command, groupName);
//     }
// };/*}}}*/
//
// /** _groupIndex ** {{{ gets the index of a group
//  * TODO: make this more private by removing it from prototype and passing elements
//  */
// RTF.prototype._groupIndex = function (name) {
//     this.elements.forEach(function(el, i){
//         if(el instanceof GroupElement && el.name===name) {
//             return i;
//         }
//     });
//     return -1;
// };/*}}}*/
//
// /** createDocument ** {{{ */
// RTF.prototype.createDocument = function (callback) {
//         var output = '{\\rtf1\\ansi\\deff0';
//         if(this.orientation === Orientation.LANDSCAPE) { output += '\\landscape'; }
//         //margins
//         if(this.marginLeft > 0) { output += '\\margl' + this.marginLeft; }
//         if(this.marginRight > 0) { output += '\\margr' + this.marginRight; }
//         if(this.marginTop > 0) { output += '\\margt' + this.marginTop; }
//         if(this.marginBottom > 0) { output += '\\margb' + this.marginBottom; }
//         output += '\\deflang' + this.language;
//
//         var ct = this.colorTable;
//         var ft = this.fontTable;
//
//         //now that the tasks are done running: create tables, data populated during element output
//         output += Utils.createColorTable(ct);
//         output += Utils.createFontTable(ft);
//
//         //other options
//         if(this.pageNumbering) {
//             output += '{\\header\\pard\\qr\\plain\\f0\\chpgn\\par}' + NL;
//         }
//         if(this.columns > 0) {
//             output += '\\cols' + this.columns + NL;
//         }
//         if(this.columnLines) {
//             output += '\\linebetcol' + NL;
//         }
//
//         if ( callback ) {
//             var tasks = [];
//             this.elements.forEach(function(el) {
//                 if (el instanceof Element){
//                     tasks.push(function(cb) { el.getRTFCode(ct, ft, cb); });
//                 } else {
//                     tasks.push(function(cb) { cb(null, Utils.getRTFSafeText(el)); });
//                 }
//             });
//             return async.parallel(tasks, function(err, results) {
//                 var elementOutput = '';
//                 results.forEach(function(result) {
//                          elementOutput += result;
//                 });
//
//                 //final output
//                 output += elementOutput+'}';
//
//                 return callback(null, output);
//             });
//         }
//         else {
//             var elemsContent = this.elements
//                 .map(el => ( el instanceof Element ) ? el.getRTFCode(ct, ft) : Utils.getRTFSafeText(el))
//                 .join('\n')
//             ;
//             output += elemsContent + '}';
//             return output;
//         }
// };/*}}}*/
//
// // OLD CODE }}}

module.exports = RTF;
