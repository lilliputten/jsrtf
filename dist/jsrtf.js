/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * node-inherit
 * Copyright(c) 2011 Dmitry Filatov <dfilatov@yandex-team.ru>
 * MIT Licensed
 */

module.exports = __webpack_require__(11);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module rtf-utils
 * @overview Misc utilities & helpers.
 * @author lilliputten <igor@lilliputten.ru>
 */
var RGB = __webpack_require__(4),
    Fonts = __webpack_require__(5),
    inherit = __webpack_require__(0);

/** String.prototype.replaceAll ** {{{ Replaces all occurrences of a substring in a string
 * ReplaceAll by Fagner Brack (MIT Licensed)
 */
String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var str = this.toString(),
        i = -1,
        _token;
    if (typeof token === "string") {
        if (ignoreCase === true) {
            _token = token.toLowerCase();
            while ((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1) {
                str = str.substring(0, i).concat(newToken).concat(str.substring(i + token.length));
            }
        } else {
            return this.split(token).join(newToken);
        }
    }
    return str;
}; /*}}}*/

module.exports = {

    dpi: 300,
    twipsPerMM: 56.6925562674,

    /** mm2twips ** {{{ Convert milimeters to twips
     * @see {@link https://en.wikipedia.org/wiki/Twip}
     * @see {@link http://www.convertunits.com/from/twip/to/mm}
     * @returns {Integer}
     */
    mm2twips: function mm2twips(mm) {
        return Math.round(this.twipsPerMM * mm);
    }, /*}}}*/

    /** isIndex ** {{{ Check is index is defined and positive (Number>=0)
     * @returns {Boolean}
     */
    isIndex: function isIndex(index) {
        return !isNaN(index) && index >= 0;
    }, /*}}}*/

    /** makeRtfCmd ** {{{
     * @param {String} prefix
     * @param {String} text
     * @param {String} [postfix]
     * @param {Boolean} [wrapInCurles]
     * @returns {String}
     */
    makeRtfCmd: function makeRtfCmd(prefix, text, postfix, wrapInCurles) {

        // postfix = postfix || '';

        if (prefix && String(prefix).match(/\\\w+$/) && text && !String(text).match(/^\\/)) {
            prefix += ' ';
        }

        var result = [prefix, text, postfix].join('');

        if (wrapInCurles && !result.match(/^\{.*\}$/)) {
            result = '\{' + result + '\}';
        }

        return result;
    }, /*}}}*/

    /** getRTFSafeText ** {{{ Makes text safe for RTF by escaping characters and it also converts linebreaks
     * Also checks to see if safetext should be overridden by non-elements like "\line"
     */
    getRTFSafeText: function getRTFSafeText(text) {
        //if text is overridden not to be safe
        if ((typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' && text.hasOwnProperty('text') && text.noEscape) {
            return text.text;
        } else if ((typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object') {
            throw new Error('Expecting text, not object');
        }
        // TODO: this could probably all be replaced by a bit of regex
        return String(text)
        // .replace(/([\\\{\}~_-])/g, '\\$1')
        .replaceAll('\\', '\\\\').replaceAll('\{', '\\\{').replaceAll('\}', '\\\}')
        // .replaceAll('~','\\~')
        // .replaceAll('-','\\-')
        // .replaceAll('_','\\_')
        //turns line breaks into \line commands
        // .replaceAll(/(\n\r|\n|\r)/g,' \\line ')
        .replaceAll('\n\r', ' \\line ').replaceAll('\n', ' \\line ').replaceAll('\r', ' \\line ');
    }, /*}}}*/

    /** createColorTable ** {{{ Generates a color table */
    createColorTable: function createColorTable(colorTable) {
        var table = '',
            c;
        table += '\{\\colortbl;\n';
        for (c = 0; c < colorTable.length; c++) {
            var rgb = colorTable[c];
            table += '\\red' + rgb.red + '\\green' + rgb.green + '\\blue' + rgb.blue + ';\n';
        }
        table += '\}';
        return table;
    }, /*}}}*/

    /** createFontTable ** {{{ Generates a font table */
    createFontTable: function createFontTable(fontTable) {
        var table = '',
            f;
        table += '\{\\fonttbl;\n';
        if (fontTable.length === 0) {
            table += '\{\\f0 ' + Fonts.ARIAL + '\}\n'; //if no fonts are defined, use arial
        } else {
            for (f = 0; f < fontTable.length; f++) {
                table += '\{\\f' + f + ' ' + fontTable[f] + '\}\n';
            }
        }
        table += '\}';
        return table;
    }, /*}}}*/

    /** getColorPosition ** {{{ find color position in table
     * @param {Array} table
     * @param {RGB} find
     */
    getColorPosition: function getColorPosition(table, find) {
        var resultIndex = -1;
        if (Array.isArray(table) && find && find instanceof RGB) {
            table.map(function (color, index) {
                if (color.red === find.red && color.green === find.green && color.blue === find.blue) {
                    resultIndex = index;
                }
            });
        }
        return resultIndex;
    } /*}}}*/

};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module format
 * @overview Formating
 * @author lilliputten <igor@lilliputten.ru>
 */

var RGB = __webpack_require__(4),
    Fonts = __webpack_require__(5),
    Colors = __webpack_require__(6),
    Utils = __webpack_require__(1),
    Entities = __webpack_require__(7),
    inherit = __webpack_require__(0);

/** wrap ** {{{ some RTF elements require that they are wrapped, closed by a trailing 0 and must have a spacebefore the text
 */
function wrap(text, prefix, postfix) {
    postfix = postfix || prefix + '0';
    return prefix + ' ' + text + postfix;
} /*}}}*/

/**
 * @class
 * @name Format
 */
var Format = inherit( /** @lends Format.prototype */{

    /** __constructor ** {{{
     * @param {Object} [options]
     */
    __constructor: function __constructor(options) {
        Object.assign(this, Format.defaultOptions, options);
    }, /*}}}*/

    /** updateTables ** {{{
     * @param {Object} jsRTF
     */
    updateTables: function updateTables(jsRTF) {

        var colorTable = jsRTF.colorTable,
            fontTable = jsRTF.fontTable;

        // font...
        this.fontPos = fontTable.indexOf(this.font);
        // if a font was defined, and it's not in a table, add it in!
        if (this.fontPos < 0 && this.font !== undefined && this.font) {
            this.fontPos = fontTable.length;
            fontTable.push(this.font);
        }

        // colors...
        [{ obj: this, key: 'color' }, { obj: this, key: 'bgColor' }, { obj: this, key: 'borderColor' }, { obj: this, key: 'cellBgColor' }, { obj: this.border, key: 'color' }, { obj: this.borderLeft, key: 'color' }, { obj: this.borderRight, key: 'color' }, { obj: this.borderTop, key: 'color' }, { obj: this.borderBottom, key: 'color' }, { obj: this.cellBorder, key: 'color' }, { obj: this.cellBorderLeft, key: 'color' }, { obj: this.cellBorderRight, key: 'color' }, { obj: this.cellBorderTop, key: 'color' }, { obj: this.cellBorderBottom, key: 'color' }, { obj: this.rowBorderLeft, key: 'color' }, { obj: this.rowBorderRight, key: 'color' }, { obj: this.rowBorderTop, key: 'color' }, { obj: this.rowBorderBottom, key: 'color' }, { obj: this.rowBorderHorizontal, key: 'color' }, { obj: this.rowBorderVertical, key: 'color' }].map(function (item) {
            var obj = item.obj,
                key = item.key;
            if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj[key]) {
                var keyPos = key + 'Pos';
                obj[keyPos] = Utils.getColorPosition(colorTable, obj[key]);
                if (obj[keyPos] < 0 && obj[key]) {
                    obj[keyPos] = colorTable.length;
                    colorTable.push(obj[key]);
                }
            }
        });
    }, /*}}}*/

    /** formatText ** {{{ Applies a format to some text
     * @param {String} text
     * @param {Object} jsRTF
     * @param {Object} params
     * @param {Boolean} [params.noEscape]
     */
    formatText: function formatText(text, jsRTF, params) {

        params = params || {};

        this.updateTables(jsRTF);

        var entities = this instanceof Entities ? this : new Entities(this);
        var styles = entities.compile(params);

        // we don't escape text if there are other elements in it, so set a flag
        if (!params.noEscape && typeof text === 'string') {
            text = Utils.getRTFSafeText(text);
        }

        text = Utils.makeRtfCmd(styles, text);

        var result = entities.applyWrappers(text, params);

        if (params.wrapInCurles && !result.match(/^\{.*\}$/)) {
            result = '\{' + result + '\}';
        }

        return result;
    } /*}}}*/

}, /*{{{ Static properties... */ /** @lends Format */{

    /** defaultOptions ** {{{
     * @type {Object}
     */
    defaultOptions: {

        // font: Fonts.ARIAL,

    } /*}}}*/

    /*}}}*/
}); // end inherit

module.exports = Format;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module element
 * @overview Base element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Format = __webpack_require__(2),
    inherit = __webpack_require__(0);

// Function.prototype.subclass = function(base) {
//     var c = Function.prototype.subclass.nonconstructor;
//     c.prototype= base.prototype;
//     this.prototype= new c ();
// };
// Function.prototype.subclass.nonconstructor = function() {};

var Element = inherit({

    /** __constructor ** {{{ */
    __constructor: function __constructor(format) {
        if (format && (typeof format === 'undefined' ? 'undefined' : _typeof(format)) === 'object' && !(format instanceof Format)) {
            format = new Format(format);
        }
        if (!format || format === undefined) {
            format = new Format();
        }
        this.format = format;
    }, /*}}}*/

    /** getRTFCode ** {{{
     * @param {Object} jsRTF
     */
    getRTFCode: function getRTFCode(jsRTF) {
        return '';
    } /*}}}*/

});

module.exports = Element;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    ARIAL: 'Arial',
    COMIC_SANS: 'Comic Sans MS',
    GEORGIA: 'Georgia',
    IMPACT: 'Impact',
    TAHOMA: 'Tahoma',
    HELVETICA: 'Helvetica',
    VERDANA: 'Verdana',
    COURIER_NEW: 'Courier New',
    PALATINO: 'Palatino Linotype',
    TIMES_NEW_ROMAN: 'Times New Roman'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var RGB = __webpack_require__(4);
module.exports = {
    BLACK: new RGB(0, 0, 0),
    WHITE: new RGB(255, 255, 255),
    RED: new RGB(255, 0, 0),
    BLUE: new RGB(0, 0, 255),
    LIME: new RGB(191, 255, 0),
    YELLOW: new RGB(255, 255, 0),
    MAROON: new RGB(128, 0, 0),
    GREEN: new RGB(0, 255, 0),
    GRAY: new RGB(80, 80, 80),
    ORANGE: new RGB(255, 127, 0)
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module entities
 * @overview Entities
 * @author lilliputten <igor@lilliputten.ru>
 */
var EntitiesData = __webpack_require__(13),
    Utils = __webpack_require__(1),
    isArray = Array.isArray,
    inherit = __webpack_require__(0);

/** compare ** {{{ */
function compare(a, b, order) {
    if (!Array.isArray(order)) {
        return 0;
    }
    var max = order.length,
        makeIndex = function makeIndex(x) {
        return x < 0 ? max : x;
    },
        ax = makeIndex(order.indexOf(a)),
        bx = makeIndex(order.indexOf(b)),
        result = ax - bx;
    return result;
} /*}}}*/
/** sortKeys ** {{{ */
function sortKeys(a, b) {
    var result = compare(a, b, EntitiesData.entitiesFirst) - compare(a, b, EntitiesData.oprionsLast);
    return result;
} /*}}}*/

var Entities = inherit({

    /** __constructor ** {{{ */
    __constructor: function __constructor(format) {
        // this.format = format;
        Object.assign(this, format);
    }, /*}}}*/

    /** _notEmptyKey ** {{{ */
    _notEmptyKey: function _notEmptyKey(key) {
        return EntitiesData.entities[key] && this[key] !== undefined && this[key] !== null && this[key] !== false;
    }, /*}}}*/

    /** testFilter ** {{{ Check filter pass status for entity context
     * @param {Object} ctx
     * @param {String} [filter]
     * @param {Boolean} [strict]
     * @returns {Boolean}
     */
    testFilter: function testFilter(ctx, filter, strict) {

        if (!filter) {
            return true;
        }

        var cmpFilter = ctx.filter;
        if (!cmpFilter) {
            return !strict;
        }
        isArray(cmpFilter) || (cmpFilter = [cmpFilter]);
        isArray(filter) || (filter = [filter]);

        return filter.some(function (filter) {
            return cmpFilter.includes(filter);
        });
    }, /*}}}*/

    /** compile ** {{{ Create rtf entities for description
     * @param {Object} [params] - Parameters
     * @param {String} [params.filter] - Condition filter (eg 'tableCellDef' for table cells)
     * @returns {String}
     */
    compile: function compile(params) {
        var _this = this;

        params = params || {};
        var filter = params.filter || this.filter;
        var strictFilter = params.strictFilter || this.strictFilter;
        var result = Object.keys(this).filter(this._notEmptyKey, this).sort(sortKeys).map(function (key) {
            var ctx = EntitiesData.entities[key];
            if (ctx === true) {
                ctx = key;
            }
            // in any case cloning original entities data
            if (typeof ctx === 'string') {
                ctx = {
                    key: key,
                    name: ctx,
                    prefix: '\\'
                };
            } else {
                ctx = Object.assign({
                    prefix: '\\',
                    key: key
                }, ctx);
            }
            return ctx;
        }, this).filter(function (ctx) {
            return !ctx.wrap;
        }).filter(function (ctx) {
            return _this.testFilter(ctx, filter, strictFilter);
        }) // TODO: Add to wrappers?
        .filter(function (ctx) {
            return typeof ctx.test !== 'function' || ctx.test.call(_this, _this[ctx.key]);
        }, this).map(function (ctx) {
            var value = _this[ctx.key] === true ? '' : _this[ctx.key];
            if (typeof ctx.value === 'function') {
                value = ctx.value.call(_this, _this[ctx.key]);
            } else if (_typeof(ctx.value) === 'object' && ctx.value[_this[ctx.key]]) {
                value = ctx.value[_this[ctx.key]];
            }
            var prefix = [ctx.prefix, ctx.name, value].join('');
            var result = Utils.makeRtfCmd(prefix, '', ctx.postfix);

            return result;
            // return [ ctx.prefix, ctx.name, value, ctx.postfix ].join('');
        }, this).join('');
        return result;
    }, /*}}}*/

    /** applyWrappers ** {{{ Create wrappers for description
     * @param {String} [content] - Text
     * @param {Object} [params] - Parameters
     */
    applyWrappers: function applyWrappers(content, params) {
        var _this2 = this;

        params = params || {};
        var filter = params.filter || this.filter;
        var strictFilter = params.strictFilter || this.strictFilter;
        var result = Object.keys(this).filter(function (key) {
            return _typeof(EntitiesData.entities[key]) === 'object' && EntitiesData.entities[key].wrap;
        }).sort(sortKeys).reverse().map(function (key) {
            var ctx = EntitiesData.entities[key];
            ctx = Object.assign({
                key: key,
                prefix: '\\' + ctx.name,
                postfix: '\\' + ctx.name + '0'
            }, ctx);
            return ctx;
        }, this).filter(function (ctx) {
            return _this2.testFilter(ctx, filter, strictFilter);
        }) // TODO: Add to wrappers?
        .filter(function (ctx) {
            return typeof ctx.test !== 'function' || ctx.test.call(_this2, content);
        }, this).reduce(function (content, ctx, i) {
            // var result = [ ctx.prefix, content, ctx.postfix ].join('');
            var result = Utils.makeRtfCmd(ctx.prefix, content, ctx.postfix);
            return result;
        }, content);
        return result;
    } /*}}}*/

});

module.exports = Entities;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var Utils = __webpack_require__(1),
    Fonts = __webpack_require__(5),
    Colors = __webpack_require__(6),
    RGB = __webpack_require__(4),
    Language = __webpack_require__(12),
    Format = __webpack_require__(2),
    Entities = __webpack_require__(7),
    Element = __webpack_require__(3),
    ContainerElement = __webpack_require__(14),
    TextElement = __webpack_require__(15),
    TableElement = __webpack_require__(16),
    GroupElement = __webpack_require__(17),


// ImageElement : require('./elements/image'), // NOTE: Not used awhile (used loading of image contents from `fs`) TODO: need migrating to more universal methods)

inherit = __webpack_require__(0),
    isArray = Array.isArray,
    NL = '\n';

/**
 * @class
 * @name jsRTF
 */
var jsRTF = inherit( /** @lends jsRTF.prototype */{

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
    __constructor: function __constructor(params) {
        // params...
        this.params = this.params || {};
        if (typeof this._getDefaultParams === 'function') {
            Object.assign(this.params, this._getDefaultParams());
        }
        Object.assign(this.params, params);

        // Stores the elements
        this.elements = [];

        // Stores the colors
        this.colorTable = [];

        // Stores the fonts
        this.fontTable = [];
    }, /*}}}*/

    /** cascadeFormats ** {{{
     * @param {String} content
     * @param {Object[]} formats
     * @param {Object} [params]
     * @returns {String}
     */
    cascadeFormats: function cascadeFormats(content, formats) {
        var _this = this;

        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


        if (!isArray(formats)) {
            throw new Error('Formats must be an array!');
        }

        if (params.reverseCascade) {
            formats = formats.reverse();
        }

        var result = formats.filter(function (fmt) {
            return !!fmt;
        }).map(function (fmt) {
            return fmt instanceof Format ? fmt : new Format(fmt);
        }).reduce(function (content, fmt) {
            var result = fmt.formatText(content, _this, params);
            return result;
        }, content);

        return result;
    }, /*}}}*/

    /** _getDefaultParams ** {{{ */
    _getDefaultParams: function _getDefaultParams() {
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
            landscape: true

        };
    }, /*}}}*/

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
    addTable: function addTable(table) {
        this.elements.push(table);
    }, /*}}}*/

    /** addTextGroup ** {{{ */
    addTextGroup: function addTextGroup(name, format) {
        if (this._groupIndex(name) < 0) {
            //make sure we don't have duplicate groups!
            var formatGroup = new jsRTF.GroupElement(name, format);
            this.elements.push(formatGroup);
        }
    }, /*}}}*/

    /** addElement ** {{{ adds a single element to a given group or as an element
     * @param {Object|Array} element
     * @param {String} [groupName]
     * @param {Object} [format]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addElement: function addElement(element, groupName, format) {

        // Check for `(command, format)` passed...
        if (format === undefined && (typeof groupName === 'undefined' ? 'undefined' : _typeof(groupName)) === 'object') {
            format = groupName;
            groupName = undefined;
        }

        if (element === undefined || element === null) {
            throw new Error('Element not defined');
        } else if (isArray(element)) {
            element = new ContainerElement(element, format);
        } else if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
            // 'string' || typeof element === 'number' ) {
            element = new TextElement(element, format);
        }

        // Original code...
        if (groupName !== undefined && this._groupIndex(groupName) >= 0) {
            this.elements[this._groupIndex(groupName)].addElement(element);
        } else {
            this.elements.push(element);
        }
    }, /*}}}*/

    /** writeText ** {{{ Adds a text string
     * @param {String} text
     * @param {Object} [format]
     * @param {String} [groupName]
     */
    writeText: function writeText(text, format, groupName) {
        var element = new jsRTF.TextElement(text, format);
        this.addElement(element, groupName);
    }, /*}}}*/

    /** addCommand ** {{{ adds a single command to a given group or as an element
     * @param {String} command
     * @param {String} [groupName]
     * @param {Object} [format]
     * TODO this should not be in prototype (NOTE: from maintainer?)
     */
    addCommand: function addCommand(command, groupName, format) {

        if (!command) {
            throw new Error('Command not defined');
        }

        // Check for `(command, format)` passed...
        if (format === undefined && (typeof groupName === 'undefined' ? 'undefined' : _typeof(groupName)) === 'object') {
            format = groupName;
            groupName = undefined;
        }

        // If format, then adding them to command
        if (format && (typeof format === 'undefined' ? 'undefined' : _typeof(format)) === 'object') {
            if (format instanceof Format) {
                format.updateTables(this.colorTable, this.fontTable);
            }
            command += new jsRTF.Entities(format).compile();
        }

        var element = {
            text: command,
            // safe : false,
            noEscape: true
        };

        return this.addElement(element);
    }, /*}}}*/

    /** addPage ** {{{ page break shortcut */
    addPage: function addPage(groupName) {
        this.addCommand('\\page', groupName);
    }, /*}}}*/

    /** addLine ** {{{ line break shortcut */
    addLine: function addLine(groupName) {
        this.addCommand('\\line', groupName);
    }, /*}}}*/

    /** addTab ** {{{ tab shortcut */
    addTab: function addTab(groupName) {
        this.addCommand('\\tab', groupName);
    }, /*}}}*/

    /** addSection ** {{{ Adds section
     * @param {Object} [format]
     * @param {String} [groupName]
     */
    addSection: function addSection(format, groupName) {
        this.addCommand('\\sect', groupName, format);
    }, /*}}}*/

    /** addStyles ** {{{ Adds format (or styles) ???
     * @param {Object} format
     * @param {String} [groupName]
     */
    addStyles: function addStyles(format, groupName) {
        if (!format) {
            throw new Error('Entities not defined');
        }
        if (format && format instanceof Format) {
            format.updateTables(this.colorTable, this.fontTable);
        }
        var command = new jsRTF.Entities(format).compile();
        if (command) {
            this.addCommand(command, groupName);
        }
    }, /*}}}*/

    /** _groupIndex ** {{{ gets the index of a group
     * TODO: make this more private by removing it from prototype and passing elements
     */
    _groupIndex: function _groupIndex(name) {
        this.elements.forEach(function (el, i) {
            if (el instanceof jsRTF.GroupElement && el.name === name) {
                return i;
            }
        });
        return -1;
    }, /*}}}*/

    /** getRTFCodeRoot ** {{{ */
    getRTFCodeRoot: function getRTFCodeRoot(item) {

        var result = '';

        if (isArray(item)) {
            result = item.map(this.getRTFCodeRoot, this).join('\n');
        } else if (item instanceof jsRTF.Element) {
            result = item.getRTFCode(this); //this.colorTable, this.fontTable);
        } else {
            result = jsRTF.Utils.getRTFSafeText(item);
        }

        return result;
    }, /*}}}*/

    /** createDocument ** {{{ */
    createDocument: function createDocument() {

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
    } /*}}}*/

},

/* Static properties... {{{ */ /** @lends jsRTF */{

    Utils: Utils,

    Fonts: Fonts,
    Colors: Colors,
    RGB: RGB,
    Language: Language,

    Format: Format,
    Entities: Entities,

    Element: Element,

    ContainerElement: ContainerElement,
    TextElement: TextElement,
    TableElement: TableElement,
    GroupElement: GroupElement
    // ImageElement : ImageElement,

    /*}}}*/

});

/*{{{ Provide... */

var defineAsGlobal = true;

// Provide with CommonJS
if (( false ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = jsRTF;
    defineAsGlobal = false;
}

// Provide to YModules
if ((typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object') {
    modules.define('jsrtf', function (provide) {
        provide(jsRTF);
    });
    defineAsGlobal = false;
}

// Provide to global scope
if (defineAsGlobal) {
    (typeof window !== 'undefined' ? window : global).jsrtf = jsRTF;
}

/*}}}*/
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module), __webpack_require__(10)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module inherit
 * @version 2.2.6
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 * @description This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.
 */

(function (global) {

    var hasIntrospection = function () {
        return '_';
    }.toString().indexOf('_') > -1,
        emptyBase = function emptyBase() {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function (ptp) {
        var inheritance = function inheritance() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
        objKeys = Object.keys || function (obj) {
        var res = [];
        for (var i in obj) {
            hasOwnProperty.call(obj, i) && res.push(i);
        }
        return res;
    },
        extend = function extend(o1, o2) {
        for (var i in o2) {
            hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
        }

        return o1;
    },
        toStr = Object.prototype.toString,
        isArray = Array.isArray || function (obj) {
        return toStr.call(obj) === '[object Array]';
    },
        isFunction = function isFunction(obj) {
        return toStr.call(obj) === '[object Function]';
    },
        noOp = function noOp() {},
        needCheckProps = true,
        testPropObj = { toString: '' };

    for (var i in testPropObj) {
        // fucking ie hasn't toString, valueOf in for
        testPropObj.hasOwnProperty(i) && (needCheckProps = false);
    }

    var specProps = needCheckProps ? ['toString', 'valueOf'] : null;

    function getPropList(obj) {
        var res = objKeys(obj);
        if (needCheckProps) {
            var specProp,
                i = 0;
            while (specProp = specProps[i++]) {
                obj.hasOwnProperty(specProp) && res.push(specProp);
            }
        }

        return res;
    }

    function override(base, res, add) {
        var addList = getPropList(add),
            j = 0,
            len = addList.length,
            name,
            prop;
        while (j < len) {
            if ((name = addList[j++]) === '__self') {
                continue;
            }
            prop = add[name];
            if (isFunction(prop) && (!prop.prototype || !prop.prototype.__self) && ( // check to prevent wrapping of "class" functions
            !hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
                res[name] = function (name, prop) {
                    var baseMethod = base[name] ? base[name] : name === '__constructor' ? // case of inheritance from plain function
                    res.__self.__parent : noOp,
                        result = function result() {
                        var baseSaved = this.__base;

                        this.__base = result.__base;
                        var res = prop.apply(this, arguments);
                        this.__base = baseSaved;

                        return res;
                    };
                    result.__base = baseMethod;

                    return result;
                }(name, prop);
            } else {
                res[name] = prop;
            }
        }
    }

    function applyMixins(mixins, res) {
        var i = 1,
            mixin;
        while (mixin = mixins[i++]) {
            res ? isFunction(mixin) ? inherit.self(res, mixin.prototype, mixin) : inherit.self(res, mixin) : res = isFunction(mixin) ? inherit(mixins[0], mixin.prototype, mixin) : inherit(mixins[0], mixin);
        }
        return res || mixins[0];
    }

    /**
    * Creates class
    * @exports
    * @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
    * @param {Object} prototypeFields
    * @param {Object} [staticFields]
    * @returns {Function} class
    */
    function inherit() {
        var args = arguments,
            withMixins = isArray(args[0]),
            hasBase = withMixins || isFunction(args[0]),
            base = hasBase ? withMixins ? applyMixins(args[0]) : args[0] : emptyBase,
            props = args[hasBase ? 1 : 0] || {},
            staticProps = args[hasBase ? 2 : 1],
            res = props.__constructor || hasBase && base.prototype && base.prototype.__constructor ? function () {
            return this.__constructor.apply(this, arguments);
        } : hasBase ? function () {
            return base.apply(this, arguments);
        } : function () {};

        if (!hasBase) {
            res.prototype = props;
            res.prototype.__self = res.prototype.constructor = res;
            return extend(res, staticProps);
        }

        extend(res, base);

        res.__parent = base;

        var basePtp = base.prototype,
            resPtp = res.prototype = objCreate(basePtp);

        resPtp.__self = resPtp.constructor = res;

        props && override(basePtp, resPtp, props);
        staticProps && override(base, res, staticProps);

        return res;
    }

    inherit.self = function () {
        var args = arguments,
            withMixins = isArray(args[0]),
            base = withMixins ? applyMixins(args[0], args[0][0]) : args[0],
            props = args[1],
            staticProps = args[2],
            basePtp = base.prototype;

        props && override(basePtp, basePtp, props);
        staticProps && override(base, base, staticProps);

        return base;
    };

    var defineAsGlobal = true;
    if (( false ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = inherit;
        defineAsGlobal = false;
    }

    if ((typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object' && typeof modules.define === 'function') {
        modules.define('inherit', function (provide) {
            provide(inherit);
        });
        defineAsGlobal = false;
    }

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
            module.exports = inherit;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.inherit = inherit);
})(undefined);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    ENG_US: 1033,
    SP_MX: 2058,
    FR: 1036,
    RU: 1049,
    NONE: 1024
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module entities-data
 * @overview Definitions of rtf entities
 * @author lilliputten <igor@lilliputten.ru>
 */

var
/** borderTypes ** {{{
 * @type {Object}
 */
borderTypes = {
    single: 's',
    doubleThickness: 'th',
    shadowed: 'sh',
    double: 'db',
    dotted: 'dot',
    dashed: 'dash',
    hairline: 'hair',
    dashSmall: 'dashsm',
    dotDash: 'dashd',
    dotDotDash: 'dashdd',
    triple: 'triple',
    thickThinSmall: 'tnthsg',
    thinThickSmall: 'thtnsg',
    thinThickThinSmall: 'tnthtnsg',
    thickThinMedium: 'tnthmg',
    thinThickMedium: 'thtnmg',
    thinThickThinMedium: 'tnthtnmg',
    thickThinLarge: 'tnthlg',
    thinThickLarge: 'thtnlg',
    thinThickThinLarge: 'tnthtnlg',
    wavy: 'wavy',
    doubleWavy: 'wavydb',
    striped: 'dashdotstr',
    emboss: 'emboss',
    engrave: 'engrave'
},
    /*}}}*/
/** makeBorder ** {{{ Create border
 * @type {Function}
 * @param {Object} props - Border properties description props
 * @param {String} id - Border property id (eg 'borderLeft')
 * @param {Object} data - Border descriptions hash
 * @returns {String}
 */
makeBorder = function makeBorder(props, id, data) {
    var _this = this;

    var result = Object.keys(data).filter(function (key) {
        return data[key] !== undefined && props[key] !== undefined;
    }).map(function (key) {
        var value = data[key];
        var result = props[key];
        if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && result.name) {
            if (_typeof(result.value) === 'object' && result.value[value] !== undefined) {
                value = result.value[value];
                result = result.name;
            } else if (typeof result.value === 'function') {
                value = result.value.call(_this, value, id);
                result = result.name;
            }
        }
        return '\\' + result + value;
    }).join('');
    return result;
},
    /*}}}*/
/** textBorderProps ** {{{ */
textBorderProps = {
    spacing: 'brsp', // border spacing
    width: 'brdrw', // border spacing
    // border type
    type: { name: 'brdr', value: borderTypes },
    // color
    color: { name: 'brdrcf', value: function value(v, id) {
            return this[id].colorPos + 1;
        } }
},
    /*}}}*/
/** cellBorderProps ** {{{ */
// '\\clbrdrt\\brdrs\\brdrw' + this.format.tableBorder,
cellBorderProps = {
    spacing: 'brsp', // border spacing
    width: 'brdrw', // border spacing
    // border type
    type: { name: 'brdr', value: borderTypes },
    // color
    color: { name: 'brdrcf', value: function value(v, id) {
            return this[id].colorPos + 1;
        } }
},
    /*}}}*/
__DONE;

module.exports = {

    /** entities ** {{{ List of all entities */
    entities: {

        // space & indents
        spaceBefore: 'sb',
        spaceAfter: 'sa',
        leftIndent: 'li',
        rightIndent: 'ri',

        // horizontal align
        alignLeft: 'ql',
        alignRight: 'qr',
        alignCenter: 'qc',
        alignFull: 'qj',
        align: { name: 'q', value: function value(v) {
                return String(v).toLowerCase().charAt(0);
            } }, // 'center' => 'qc', 'left' => 'ql' etc...

        // vertical align
        verticalAlignTop: 'vertalt',
        verticalAlignBottom: 'vertalb',
        verticalAlignCenter: 'vertalc',
        verticalAlignJustify: 'vertalj',
        verticalAlign: { name: 'vertal', value: function value(v) {
                return String(v).toLowerCase().charAt(0);
            } }, // 'top' => 'vertalt', 'center' => 'vertalc' etc...

        // table header row
        tableHeader: { filter: ['rowDef'], name: 'trhdr' },

        // cell vertical align
        cellVerticalAlign: { filter: ['cellDef'], name: 'clvertal', value: function value(v) {
                return String(v).toLowerCase().charAt(0);
            } }, // 'top' => 'clvertalt', 'center' => 'clvertalc' etc...

        // fontPos : { name : 'f', test : (v) => v >= 0 },
        // colorPos : { name : 'cf', test : (v) => v >= 0 },
        // bgColorPos : { name : 'cb', test : (v) => v >= 0, value : (v) => isNaN(v) ? v : String( v + 1 ) },

        font: { filter: ['text'], name: 'f', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.fontPos;
            } }, // NOTE: using non-arrow function for catch `this` value
        color: { filter: ['text'], name: 'cf', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.colorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value
        bgColor: { filter: ['text'], name: 'cb', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.bgColorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value
        cellBgColor: { filter: ['cellDef'], name: 'clcbpat', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.cellBgColorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value
        borderColor: { name: 'brdrcf', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.borderColorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value

        // row borders
        rowBorderLeft: { filter: 'rowDef', name: 'trbrdrl', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderLeft', v);
            } },
        rowBorderRight: { filter: 'rowDef', name: 'trbrdrr', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderRight', v);
            } },
        rowBorderTop: { filter: 'rowDef', name: 'trbrdrt', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderTop', v);
            } },
        rowBorderBottom: { filter: 'rowDef', name: 'trbrdrb', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderBottom', v);
            } },
        rowBorderHorizontal: { filter: 'rowDef', name: 'trbrdrh', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderTop', v);
            } },
        rowBorderVertical: { filter: 'rowDef', name: 'trbrdrv', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'rowBorderBottom', v);
            } },

        // cell borders
        cellBorderLeft: { filter: 'cellDef', name: 'clbrdrl', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'cellBorderLeft', v);
            } },
        cellBorderRight: { filter: 'cellDef', name: 'clbrdrr', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'cellBorderRight', v);
            } },
        cellBorderTop: { filter: 'cellDef', name: 'clbrdrt', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'cellBorderTop', v);
            } },
        cellBorderBottom: { filter: 'cellDef', name: 'clbrdrb', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'cellBorderBottom', v);
            } },

        // custom borders
        border: { prefix: null, name: null, value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'border', v);
            } },
        borderLeft: { name: 'brdrl', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'borderLeft', v);
            } },
        borderRight: { name: 'brdrr', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'borderRight', v);
            } },
        borderTop: { name: 'brdrt', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'borderTop', v);
            } },
        borderBottom: { name: 'brdrb', value: function value(v) {
                return makeBorder.call(this, textBorderProps, 'borderBottom', v);
            } },

        // common border properties (may be overriden by borderLeft etc)
        borderSpacing: 'brsp', // border spacing
        borderWidth: 'brdrw', // border spacing
        // border type
        borderType: { name: 'brdr', value: borderTypes },

        // tableHeader : 'trhdr',

        // makeParagraph : 'pard',
        fontSize: { name: 'fs', value: function value(v) {
                return isNaN(v) ? v : v * 2;
            } },

        landscape: 'lndscpsxn', // ???

        pageWidth: 'pgwsxn',
        pageHeight: 'pghsxn',

        marginLeft: 'margl',
        marginRight: 'margr',
        marginTop: 'margt',
        marginBottom: 'margb',
        language: 'deflang',

        pageNumbering: { prefix: '', value: '\{\\header\\pard\\qr\\plain\\f0\\chpgn\\par\}' },
        columns: 'cols',
        columnLines: 'linebetcol',

        paragraph: { wrap: true, prefix: '\\pard', postfix: '\\par' },

        bold: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\b', postfix: '\\b0' },
        italic: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\i', postfix: '\\i0' },
        underline: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\ul', postfix: '\\ul0' },
        strike: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\strike', postfix: '\\strike0' },
        subScript: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\sub', postfix: '\\sub0' },
        superScript: { wrap: true, test: function test(v) {
                return v;
            }, prefix: '\\super', postfix: '\\super0' }
    }, /*}}}*/

    /** entitiesFirst ** {{{ Entities sort order: first items */
    entitiesFirst: ['paragraph'], /*}}}*/
    /** oprionsLast ** {{{ Entities sort order: last items */
    oprionsLast: ['bold', 'italic', 'underline', 'strike', 'subScript', 'superScript'] /*}}}*/

};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module container
 * @overview Container element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Element = __webpack_require__(3),
    Format = __webpack_require__(2),
    Utils = __webpack_require__(1),
    inherit = __webpack_require__(0),
    isArray = Array.isArray;

var ContainerElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor: function __constructor(data, format) {
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        if (this.format && _typeof(this.format) === 'object' && !(this.format instanceof Format)) {
            this.format = new Format(this.format);
        }
        this.data = data;
    }, /*}}}*/

    /** getItemRTFCode ** {{{ Get single object rtf code
     * @param {*} item
     * @param {Object} jsRTF
     * @returns {String}
     */
    getItemRTFCode: function getItemRTFCode(item, jsRTF) {
        var _this = this;

        var result = '';

        if (isArray(item)) {
            result = item.map(function (item) {
                return _this.getItemRTFCode(item, jsRTF);
            }).join('\n');
        } else if (item instanceof Element) {
            result = item.getRTFCode(jsRTF);
        } else {
            result = this.format.formatText(item, jsRTF);
        }

        return result;
    }, /*}}}*/

    /** getRTFCode ** {{{ Get element rtf code
     * @param {Object} jsRTF
     * @returns {String}
     */
    getRTFCode: function getRTFCode(jsRTF) {

        var data = this.getItemRTFCode(this.data, jsRTF);

        data = this.format.formatText(data, jsRTF, { noEscape: true });

        data = Utils.makeRtfCmd('', data, '', true);

        return data;
    } /*}}}*/

});

module.exports = ContainerElement;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module text
 * @overview Text element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Element = __webpack_require__(3),
    Format = __webpack_require__(2),
    Utils = __webpack_require__(1),
    inherit = __webpack_require__(0);

var TextElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor: function __constructor(text, format, options) {
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        this.text = text;
        this.options = options || { filter: 'text' };
    }, /*}}}*/

    /** getRTFCode ** {{{
     * @param {Object} jsRTF
     */
    getRTFCode: function getRTFCode(jsRTF) {

        var text = this.format.formatText(this.text, jsRTF, this.options);

        text = Utils.makeRtfCmd('', text, '', true);

        return text;
    } /*}}}*/

});

module.exports = TextElement;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var Utils = __webpack_require__(1),
    Format = __webpack_require__(2),
    Element = __webpack_require__(3),
    inherit = __webpack_require__(0),
    isArray = Array.isArray;

var TableElement = inherit(Element, {

    /** __constructor ** {{{
     * @param {Object} options
     * @param {Object} [options.format]
     * @param {Object} [options.rowFormat]
     * @param {Object} [options.firstRowFormat]
     * @param {Object[]} [options.cellFormats]
     */
    __constructor: function __constructor(options) {
        this.__base.call(this, options && options.format);
        this.data = [];
        Object.assign(this, options);
        this.data || (this.data = []);
        this.format || (this.format = new Format());
        this.rowFormat || (this.rowFormat = new Format());
        this.cellFormats || (this.cellFormats = []);
    }, /*}}}*/

    /** addRow ** {{{ Append one row data
     */
    addRow: function addRow(row) {
        this.data.push(row);
    }, /*}}}*/

    /** setData ** {{{ Set all table data
     */
    setData: function setData(data) {
        this.data = data;
    }, /*}}}*/

    /** columnsCount ** {{{ Calculate columns count (max columns count in all rows)
     */
    columnsCount: function columnsCount() {
        var max = this.data.reduce(function (max, row) {
            return Math.max(max, row.length);
        }, 0);
        return max;
    }, /*}}}*/

    /** getRowContent ** {{{ Get row content
     * @param {Object} jsRTF
     * @param {Array} row - Row data
     * @param {Number} rowNo - Row number
     * @returns {String}
     */
    getRowContent: function getRowContent(jsRTF, row, rowNo) {
        var _this = this;

        var columnsCount = row.length;
        var rowCascade = [this.format, this.rowFormat];
        if (!rowNo && this.firstRowFormat) {
            rowCascade.push(this.firstRowFormat);
        }
        var cellCascade = rowCascade.concat([this.cellFormat]);
        var rowContent = row.map(function (cell) {
            return cell instanceof Element ? cell.getRTFCode(jsRTF) : Utils.getRTFSafeText(cell);
        }).map(function (cellContent, n) {
            var lastCellCascade = cellCascade.concat([isArray(_this.cellFormats) && _this.cellFormats[n]]);
            cellContent = jsRTF.cascadeFormats(cellContent, lastCellCascade, {
                reverseCascade: true,
                noEscape: true,
                filter: 'text',
                strictFilter: false
            });
            return cellContent;
        }).map(function (cellContent) {
            return cellContent + '\\cell';
        }).join(' ');
        rowContent = jsRTF.cascadeFormats(rowContent, rowCascade, {
            reverseCascade: true,
            noEscape: true,
            filter: 'row',
            strictFilter: true
        });

        var rowPlus = '\{\\trowd\\trautofit1\\intbl';
        rowPlus += jsRTF.cascadeFormats('', rowCascade, {
            reverseCascade: true,
            noEscape: true,
            filter: 'rowDef',
            strictFilter: true
        });

        var lastRatio = 0;
        row.map(function (cell, n) {
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
            rowPlus += jsRTF.cascadeFormats('', cellCascade.concat([isArray(_this.cellFormats) && _this.cellFormats[n]]), {
                reverseCascade: true,
                noEscape: true,
                filter: 'cellDef',
                strictFilter: true
            });
            // Evaluate cell width
            // TODO: Normalize cells widths?
            var cellFormat = _this.cellFormats[n] || _this.cellFormat;
            var width;
            if (cellFormat && cellFormat.width) {
                width = cellFormat.width;
            } else {
                var ratio = (n + 1) / columnsCount;
                if (cellFormat && cellFormat.widthPercents) {
                    ratio = lastRatio + cellFormat.widthPercents / 100;
                }
                if (cellFormat && cellFormat.widthRatio) {
                    ratio = lastRatio + cellFormat.widthRatio;
                }
                lastRatio = ratio;
                width = Math.round(_this.format.tableWidth ? _this.format.tableWidth * ratio : columnsCount * ratio);
            }
            rowPlus += '\n\\cellx' + width;
        });
        rowPlus += '\n\\row\}';
        rowContent += '\n' + rowPlus;
        return rowContent;
    }, /*}}}*/

    /** updateFormats ** {{{ Update all using formats
     * @param {Object} jsRTF
     */
    updateFormats: function updateFormats(jsRTF) {

        var formats = (this.cellFormats || []).concat([this.format, this.rowFormat, this.firstRowsFormat]);

        formats.filter(function (fmt) {
            return fmt;
        }).map(function (fmt) {
            return fmt.updateTables(jsRTF);
        });
    }, /*}}}*/

    /** getRTFCode ** {{{ Get rtf content for entire table
     * @param {Object} jsRTF
     * @returns {String}
     */
    getRTFCode: function getRTFCode(jsRTF) {
        var _this2 = this;

        this.updateFormats(jsRTF);

        var content = this.data.filter(function (row) {
            return isArray(row);
        }).map(function (row, rowNo) {
            return _this2.getRowContent(jsRTF, row, rowNo);
        }, this).join('\n');

        return content;
    } /*}}}*/

}); // end inherit

module.exports = TableElement;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var Utils = __webpack_require__(1),

// async = require('async'),
Element = __webpack_require__(3),
    inherit = __webpack_require__(0);

var GroupElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor: function __constructor(name, format) {
        this.__base.call(this, format);
        this.elements = [];
        this.name = name;
    }, /*}}}*/

    /** addElement ** {{{ */
    addElement: function addElement(element) {
        this.elements.push(element);
    }, /*}}}*/

    /** getRTFCode ** {{{
     * @param {Object} jsRTF
     */
    getRTFCode: function getRTFCode(jsRTF) {
        var content = this.elements.map(function (el) {
            return el instanceof Element ? el.getRTFCode(jsRTF) : Utils.getRTFSafeText(el);
        }).join('\n');
        content = this.format.formatText(content, jsRTF, { noEscape: true });
        return content;
    } /*}}}*/

});

module.exports = GroupElement;

/***/ })
/******/ ]);
//# sourceMappingURL=jsrtf.js.map