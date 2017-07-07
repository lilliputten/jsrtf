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

    Utils = require('./rtf-utils'),

    Fonts = require('./data/fonts'),
    Colors = require('./data/colors'),
    RGB = require('./data/rgb'),
    Language = require('./data/language'),

    Format = require('./format'),
    Entities = require('./entities'),

    Element = require('./elements/element'),

    ContainerElement = require('./elements/container'),
    TextElement = require('./elements/text'),
    TableElement = require('./elements/table'),
    GroupElement = require('./elements/group'),

    // ImageElement : require('./elements/image'), // NOTE: Not used awhile (used loading of image contents from `fs`) TODO: need migrating to more universal methods)

    inherit = require('inherit'),
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
    elements : [],

    /** Stores the colors */
    colorTable : [],

    /** Stores the fonts */
    fontTable : [],

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

        // Stores the elements
        this.elements = [];

        // Stores the colors
        this.colorTable = [];

        // Stores the fonts
        this.fontTable = [];

    },/*}}}*/

    /** cascadeFormats ** {{{
     * @param {String} content
     * @param {Object[]} formats
     * @param {Object} [params]
     * @returns {String}
     */
    cascadeFormats : function (content, formats, params={}) {

        if ( !isArray(formats) ) {
            throw new Error('Formats must be an array!');
        }

        if ( params.reverseCascade ) {
            formats = formats.reverse();
        }

        var result = formats
            .filter(fmt => !!fmt)
            .map(fmt => ( fmt instanceof Format ) ? fmt : new Format(fmt))
            .reduce((content,fmt) => {
                var result = fmt.formatText(content, this, params);
                return result;
            }, content)
        ;

        return result;

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

    // /** addPara ** {{{ Add paragraph break command (???)
    //  * @param {Object} [format]
    //  * @param {String} [groupName]
    //  */
    // addPara : function (format, groupName) {
    //     this.addCommand('\n\\par', groupName, format);
    // },/*}}}*/

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
     * @param {Object} [format]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addElement : function (element, groupName, format) {

        // Check for `(command, format)` passed...
        if ( format === undefined && typeof groupName === 'object' ) {
            format = groupName;
            groupName = undefined;
        }

        if ( element === undefined || element === null ) {
            throw new Error('Element not defined');
        }
        else if ( isArray(element) ) {
            element = new ContainerElement(element, format);
        }
        else if ( typeof element !== 'object' ) { // 'string' || typeof element === 'number' ) {
            element = new TextElement(element, format);
        }

        // Original code...
        if ( groupName !== undefined && this._groupIndex(groupName)>=0 ) {
            this.elements[this._groupIndex(groupName)].addElement(element);
        }
        else {
            this.elements.push(element);
        }

    },/*}}}*/

    /** writeText ** {{{ Adds a text string
     * @param {String} text
     * @param {Object} [format]
     * @param {String} [groupName]
     */
    writeText : function (text, format, groupName) {
        var element = new jsRTF.TextElement(text, format);
        this.addElement(element, groupName);
    },/*}}}*/

    /** addCommand ** {{{ adds a single command to a given group or as an element
     * @param {String} command
     * @param {String} [groupName]
     * @param {Object} [format]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addCommand : function (command, groupName, format) {

        if ( !command ) {
            throw new Error('Command not defined');
        }

        // Check for `(command, format)` passed...
        if ( format === undefined && typeof groupName === 'object' ) {
            format = groupName;
            groupName = undefined;
        }

        // If format, then adding them to command
        if ( format && typeof format === 'object' ) {
            if ( format instanceof Format ) {
                format.updateTables(this.colorTable, this.fontTable);
            }
            command +=  ( new jsRTF.Entities(format) ).compile();
        }

        var element = {
            text : command,
            // safe : false,
            noEscape : true,
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
     * @param {Object} [format]
     * @param {String} [groupName]
     */
    addSection : function (format, groupName) {
        this.addCommand('\\sect', groupName, format);
    },/*}}}*/

    /** addStyles ** {{{ Adds format (or styles) ???
     * @param {Object} format
     * @param {String} [groupName]
     */
    addStyles : function (format, groupName) {
        if ( !format ) {
            throw new Error('Entities not defined');
        }
        if ( format && format instanceof Format ) {
            format.updateTables(this.colorTable, this.fontTable);
        }
        var command = ( new jsRTF.Entities(format) ).compile();
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

    /** getRTFCodeRoot ** {{{ */
    getRTFCodeRoot : function (item) {

        var result = '';

        if ( isArray(item) ) {
            result = item
                .map(this.getRTFCodeRoot, this)
                .join('\n')
            ;
        }
        else if ( item instanceof jsRTF.Element ) {
            result = item.getRTFCode(this);//this.colorTable, this.fontTable);
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
        var entities = new jsRTF.Entities(this.params);
        output += entities.compile() + NL;

        // Creating content
        var elemsContent = this.getRTFCodeRoot(this.elements);

        //now that the tasks are done running: create tables, data populated during element output
        output += jsRTF.Utils.createColorTable(this.colorTable) + NL;
        output += jsRTF.Utils.createFontTable(this.fontTable) + NL;

        // Finishing document
        output += elemsContent + '\n\}';

        return output;

    },/*}}}*/

},

/* Static properties... {{{ *//** @lends jsRTF */{

    Utils : Utils,

    Fonts : Fonts,
    Colors : Colors,
    RGB : RGB,
    Language : Language,

    Format : Format,
    Entities : Entities,

    Element : Element,

    ContainerElement : ContainerElement,
    TextElement : TextElement,
    TableElement : TableElement,
    GroupElement : GroupElement,
    // ImageElement : ImageElement,

}/*}}}*/

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

