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

var
    inherit = require('inherit'),
    lib = require('./lib/index'),
    isArray = Array.isArray,
    NL = '\n'
;

/**
 * @class
 * @name jsRTF
 */
var jsRTF = inherit(/** @lends jsRTF.prototype */{

    // Data...

    /** Stores the elements */
    elements: [],

    /** Stores the colors */
    colorTable: [],

    /** Stores the fonts */
    fontTable: [],

    // Methods...

    /** __constructor ** {{{
     * @param {Object} [params] - Optional parameters of document
     */
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

            // pageNumbering: false,
            marginLeft: 1800,
            marginRight: 1800,
            marginBottom: 1440,
            marginTop: 1440,

            language: jsRTF.Language.ENG_US,

            // columns: 0,//columns?
            // columnLines: false,//lines between columns
            // orientation: jsRTF.Orientation.PORTRAIT,
            landscape : true,

        };
    },/*}}}*/

    /** addPara ** {{{ Add paragraph break command (???)
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addPara : function (options, groupName) {
        this.addCommand('\n\\par', groupName, options);
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

    /** addElement ** {{{ adds a single element to a given group or as an element
     * @param {Object|Array} element
     * @param {String} [groupName]
     * @param {Object} [options]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addElement : function (element, groupName, options) {

        // Check for `(command, options)` passed...
        if ( options === undefined && typeof groupName === 'object' ) {
            options = groupName;
            groupName = undefined;
        }

        if ( !element ) {
            throw new Error('Element not defined');
        }
        else if ( isArray(element) ) {
            element = new lib.ContainerElement(element, options);
        }
        else if ( typeof element === 'string' || typeof element === 'number' ) {
            element = new lib.TextElement(element, options);
        }

        // Original code...
        if ( groupName !== undefined && this._groupIndex(groupName)>=0 ) {
            this.elements[this._groupIndex(groupName)].addElement(element);
        }
        else {
            this.elements.push(element);
        }

    },/*}}}*/

    /** writeText ** {{{ */
    writeText : function (text, format, groupName) {
        var element = new jsRTF.TextElement(text, format);
        this.addElement(element, groupName);
    },/*}}}*/

    /** addCommand ** {{{ adds a single command to a given group or as an element
     * @param {String} command
     * @param {String} [groupName]
     * @param {Object} [options]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addCommand : function (command, groupName, options) {

        if ( !command ) {
            throw new Error('Command not defined');
        }

        // Check for `(command, options)` passed...
        if ( options === undefined && typeof groupName === 'object' ) {
            options = groupName;
            groupName = undefined;
        }

        // If options, then adding them to command
        if ( options && typeof options === 'object' ) {
            if ( options instanceof lib.Format ) {
                options.updateTables(this.colorTable, this.fontTable);
            }
            command +=  ( new jsRTF.Options(options) ).compile();
        }

        var element = {
            text : command,
            safe : false,
        };

        return this.addElement(element);

    },/*}}}*/

    /** addPage ** {{{ page break shortcut */
    addPage : function (groupName) {
        this.addCommand('\\page', groupName);
    },/*}}}*/

    /** addLine ** {{{ line break shortcut */
    addLine : function (groupName) {
        this.addCommand('\\line', groupName);
    },/*}}}*/

    /** addTab ** {{{ tab shortcut */
    addTab : function (groupName) {
        this.addCommand('\\tab', groupName);
    },/*}}}*/

    /** addSection ** {{{ Adds section
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addSection : function (options, groupName) {
        this.addCommand('\\sect', groupName, options);
    },/*}}}*/

    /** addOptions ** {{{ Adds options (or styles) ???
     * @param {Object} options
     * @param {String} [groupName]
     */
    addOptions : function (options, groupName) {
        if ( !options ) {
            throw new Error('Options not defined');
        }
        if ( options && options instanceof lib.Format ) {
            options.updateTables(this.colorTable, this.fontTable);
        }
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

    /** getRTFCode ** {{{ */
    getRTFCode : function (item) {

        var result = '';

        if ( isArray(item) ) {
            result = item
                .map(this.getRTFCode, this)
                .join('\n')
            ;
        }
        else if ( item instanceof jsRTF.Element ) {
            result = item.getRTFCode(this.colorTable, this.fontTable);
        }
        else {
            result = jsRTF.Utils.getRTFSafeText(item);
        }

        return result;

    },/*}}}*/

    /** createDocument ** {{{ */
    createDocument : function () {

        // Opening document sequence
        var output = '\{\\rtf1\\ansi\\deff0\n';

        // Document parameters
        var options = new jsRTF.Options(this.params);
        output += options.compile() + NL;

        // Creating content
        var elemsContent = this.getRTFCode(this.elements);

        //now that the tasks are done running: create tables, data populated during element output
        output += jsRTF.Utils.createColorTable(this.colorTable) + NL;
        output += jsRTF.Utils.createFontTable(this.fontTable) + NL;

        // Finishing document
        output += elemsContent + '\n\}';

        return output;

    },/*}}}*/

},

/* Static properties... {{{ *//** @lends jsRTF */lib
/*}}}*/

);

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

