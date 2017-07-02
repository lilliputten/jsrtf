/* globals window, define, exports, module, modules */
/**
 *
 * @module jsRTF
 * @overview Library for making rich text documents
 * @author lilliputten <igor@lilliputten.ru>
 *
 * Original maintainer Jonathan Rowny (https://github.com/jrowny/node-rtf)
 *
 */

const resolveModules = require('./lib/resolve-modules');

resolveModules([
    'inherit',
],
function __jsRTFResolve (
    inherit,
__BASE) {

    const
        NL = '\n'
    ;

    /**
     * @class
     * @name jsRTF
     */
    var jsRTF = inherit(/** @lends jsRTF.prototype */{

        // Data...

        /** Stores the elemnts */
        elements: [],

        /** Stores the colors */
        colorTable: [],

        /** Stores the fonts */
        fontTable: [],

        // Methods...

        /** __constructor ** {{{ */
        __constructor : function (params) {
            // params...
            this.params = this.params || {};
            if ( typeof this._getDefaultParams === 'function' ) {
                Object.assign(this.params, this._getDefaultParams());
            }
            Object.assign(this.params, params);
        },/*}}}*/

        /** _getDefaultParams ** {{{ */
        _getDefaultParams : function () {
            return {

                pageNumbering: false,
                marginLeft: 1800,
                marginRight: 1800,
                marginBottom: 1440,
                marginTop: 1440,

                language: jsRTF.Language.ENG_US,

                columns: 0,//columns?
                columnLines: false,//lines between columns
                orientation: jsRTF.Orientation.PORTRAIT,

            };
        },/*}}}*/

        /** writeText ** {{{ */
        writeText : function (text, format, groupName) {
                var element = new jsRTF.TextElement(text, format);
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
                var formatGroup = new jsRTF.GroupElement(name, format);
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
                command +=  ( new jsRTF.Options(options) ).compile();
            }
            // Original code...
            if(groupName !== undefined && this._groupIndex(groupName)>=0) {
                this.elements[this._groupIndex(groupName)].addElement({text:command, safe:false});
            } else {
                this.elements.push({text:command, safe:false});
            }
        },/*}}}*/

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
            var command = ( new jsRTF.Options(options) ).compile();
            if ( command ) {
                this.addCommand(command, groupName);
            }
        },/*}}}*/

        /** _groupIndex ** {{{ gets the index of a group
         * TODO: make this more private by removing it from prototype and passing elements
         */
        _groupIndex : function (name) {
            this.elements.forEach(function(el, i){
                if ( el instanceof jsRTF.GroupElement && el.name===name ) {
                    return i;
                }
            });
            return -1;
        },/*}}}*/

        /** createDocument ** {{{ */
        createDocument : function (/* callback */) {

            var output = '\{\\rtf1\\ansi\\deff0';

            if ( this.params.orientation === jsRTF.Orientation.LANDSCAPE ) { output += '\\landscape'; }
            //margins
            if ( this.params.marginLeft > 0 ) { output += '\\margl' + this.params.marginLeft; }
            if ( this.params.marginRight > 0 ) { output += '\\margr' + this.params.marginRight; }
            if ( this.params.marginTop > 0 ) { output += '\\margt' + this.params.marginTop; }
            if ( this.params.marginBottom > 0 ) { output += '\\margb' + this.params.marginBottom; }
            output += '\\deflang' + this.params.language;

            //now that the tasks are done running: create tables, data populated during element output
            output += jsRTF.Utils.createColorTable(this.colorTable);
            output += jsRTF.Utils.createFontTable(this.fontTable);

            //other options
            if ( this.params.pageNumbering ) {
                output += '\{\\header\\pard\\qr\\plain\\f0\\chpgn\\par\}' + NL;
            }
            if ( this.params.columns > 0 ) {
                output += '\\cols' + this.params.columns + NL;
            }
            if ( this.params.columnLines ) {
                output += '\\linebetcol' + NL;
            }

            var elemsContent = this.elements
                .map(el => ( el instanceof jsRTF.Element ) ? el.getRTFCode(this.colorTable, this.fontTable) : jsRTF.Utils.getRTFSafeText(el))
                .join('\n')
            ;
            output += elemsContent + '\}';
            return output;

        },/*}}}*/

    }, /* Static properties... {{{ *//** @lends jsRTF */{

        RGB : require('./lib/rgb'),
        Element : require('./lib/elements/element'),
        Format : require('./lib/format'),
        Utils : require('./lib/rtf-utils'),
        Language : require('./lib/language'),
        Orientation : require('./lib/orientation'),
        TableElement : require('./lib/elements/table'),
        TextElement : require('./lib/elements/text'),
        ImageElement : require('./lib/elements/image'),
        GroupElement : require('./lib/elements/group'),
        Options : require('./lib/options'),

    }/*}}}*/); // end inherit

    /*{{{ Provide... */

    var defineAsGlobal = true;

    // Provide with CommonJS
    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = jsRTF;
        defineAsGlobal = false;
    }

    // Provide to YModules
    if ( typeof modules === 'object' ) {
        modules.define('jsrtf', function(provide) {
            provide(jsRTF);
        });
        defineAsGlobal = false;
    }

    // Provide to global scope
    if ( defineAsGlobal ) {
        ( typeof window !== 'undefined' ? window : global ).jsrtf = jsRTF;
    }

    /*}}}*/

}, function __jsRTFError (err) {
    console.error('jsRTF error:', err);
    // /*DEBUG*//*jshint -W087*/debugger;
    throw new Error(err);
});
