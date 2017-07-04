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
var RGB = __webpack_require__(2),
    Fonts = __webpack_require__(4),
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

    /** getRTFSafeText ** {{{ Makes text safe for RTF by escaping characters and it also converts linebreaks
     * Also checks to see if safetext should be overridden by non-elements like "\line"
     */
    getRTFSafeText: function getRTFSafeText(text) {
        //if text is overridden not to be safe
        if ((typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' && text.hasOwnProperty('safe') && !text.safe) {
            return text.text;
        }
        //this could probably all be replaced by a bit of regex
        return text.replaceAll('\\', '\\\\').replaceAll('\{', '\\\{').replaceAll('\}', '\\\}').replaceAll('~', '\\~').replaceAll('-', '\\-').replaceAll('_', '\\_')
        //turns line breaks into \line commands
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


module.exports = function (red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module element
 * @overview Base element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Format = __webpack_require__(5),
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
        if (format === undefined) {
            format = new Format();
        }
        this.format = format;
    } /*}}}*/

});

module.exports = Element;

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module format
 * @overview Formating
 * @author lilliputten <igor@lilliputten.ru>
 */

var RGB = __webpack_require__(2),
    Fonts = __webpack_require__(4),
    Colors = __webpack_require__(6),
    Utils = __webpack_require__(1),
    Options = __webpack_require__(7),
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

    /** updateTables ** {{{ */
    updateTables: function updateTables(colorTable, fontTable) {
        this.fontPos = fontTable.indexOf(this.font);
        this.colorPos = Utils.getColorPosition(colorTable, this.color);
        this.bgColorPos = Utils.getColorPosition(colorTable, this.bgColor);

        // if a font was defined, and it's not in a table, add it in!
        if (this.fontPos < 0 && this.font !== undefined && this.font) {
            this.fontPos = fontTable.length;
            fontTable.push(this.font);
        }
        //if a color was defined, and it's not in the table, add it as well
        if (this.colorPos < 0 && this.color !== undefined) {
            this.colorPos = colorTable.length;
            colorTable.push(this.color);
        }
        //background colors use the same table as color
        if (this.bgColorPos < 0 && this.bgColor !== undefined) {
            this.bgColorPos = colorTable.length;
            colorTable.push(this.bgColor);
        }
    }, /*}}}*/

    /** formatText ** {{{ Applies a format to some text
     * @param {String} text
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @param {Boolean} [safeText]
     */
    formatText: function formatText(text, colorTable, fontTable, safeText) {

        safeText === undefined && (safeText = true);

        this.updateTables(colorTable, fontTable);

        var options = new Options(this);
        var optionsStr = options.compile();

        // we don't escape text if there are other elements in it, so set a flag
        if (safeText) {
            text = Utils.getRTFSafeText(text);
        }

        var content = [optionsStr, text].join(' ');

        content = options.applyWrappers(content);

        return ['\{', content, '\}'].join('');
    } /*}}}*/

}, /*{{{ Static properties... */ /** @lends Format */{

    /** defaultOptions ** {{{
     * @type {Object}
     */
    defaultOptions: {

        // underline: false,
        // bold: false,
        // italic: false,
        // strike: false,
        //
        // superScript: false,
        // subScript: false,
        //
        // paragraph: false,
        //
        // align: '',
        //
        // leftIndent: 0,
        // rightIndent: 0,
        //
        font: Fonts.ARIAL
        // fontSize: 0,
        // //color: rgb,
        // //bgColor: rgb,
        //
        // colorPos: -1,
        // bgColorPos: -1,
        // fontPos: -1,

    } /*}}}*/

    /*}}}*/
}); // end inherit

module.exports = Format;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var RGB = __webpack_require__(2);
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
 * @module options
 * @overview Options
 * @author lilliputten <igor@lilliputten.ru>
 */
var OptionsData = __webpack_require__(14),
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
    var result = compare(a, b, OptionsData.optionsFirst) - compare(a, b, OptionsData.oprionsLast);
    return result;
} /*}}}*/

var Options = inherit({

    /** __constructor ** {{{ */
    __constructor: function __constructor(format) {
        // this.format = format;
        Object.assign(this, format);
    }, /*}}}*/

    /** _notEmptyKey ** {{{ */
    _notEmptyKey: function _notEmptyKey(key) {
        return OptionsData.options[key] && this[key] !== undefined && this[key] !== null && this[key] !== false;
    }, /*}}}*/

    /** compile ** {{{ */
    compile: function compile() {
        var _this = this;

        var result = Object.keys(this).filter(this._notEmptyKey, this).sort(sortKeys).map(function (key) {
            var ctx = OptionsData.options[key];
            if (ctx === true) {
                ctx = key;
            }
            if (typeof ctx === 'string') {
                ctx = {
                    key: key,
                    name: ctx,
                    prefix: '\\'
                    // value = this[ctx.key],
                };
            } else {
                ctx = Object.assign({
                    prefix: '\\',
                    key: key
                    // value : this[ctx.key],
                }, ctx);
            }
            return ctx;
        }, this).filter(function (ctx) {
            return !ctx.wrap;
        }).filter(function (ctx) {
            return typeof ctx.test !== 'function' || ctx.test.call(_this, _this[ctx.key]);
        }, this).map(function (ctx) {
            var value = _this[ctx.key] === true ? '' : _this[ctx.key];
            if (typeof ctx.value === 'function') {
                value = ctx.value.call(_this, _this[ctx.key]);
            }
            return [ctx.prefix, ctx.name, value, ctx.postfix].join('');
        }, this).join('');
        return result;
    }, /*}}}*/

    /** applyWrappers ** {{{ */
    applyWrappers: function applyWrappers(value) {
        var _this2 = this;

        var result = Object.keys(this).filter(function (key) {
            return _typeof(OptionsData.options[key]) === 'object' && OptionsData.options[key].wrap;
        }).sort(sortKeys).reverse().map(function (key) {
            var ctx = OptionsData.options[key];
            ctx = Object.assign({
                key: key,
                prefix: '\\' + ctx.name,
                postfix: '\\' + ctx.name + '0'
                // value : this[ctx.key],
            }, ctx);
            return ctx;
        }, this).filter(function (ctx) {
            return typeof ctx.test !== 'function' || ctx.test.call(_this2, value);
        }, this).reduce(function (value, ctx, i) {
            if (!i) {
                value = ' ' + value;
            }
            return [ctx.prefix, value, ctx.postfix].join('');
        }, value);
        return result;
    } /*}}}*/

});

module.exports = Options;

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

var inherit = __webpack_require__(0),
    lib = __webpack_require__(12),
    NL = '\n';

// {{{ resolveModules sample code
// var resolveModules = require('./lib/resolve-modules');
// resolveModules([
//     'inherit',
// ],
// function __jsRTFResolveSuccess (
//     inherit,
// __BASE) {
// }, /* {{{ Error... */function __jsRTFResolveError (err) {
//     // console.error('jsRTF error:', err);
//     // /*DEBUG*//*jshint -W087*/debugger;
//     throw new Error(err);
// }/*}}}*/
// ); // end resolveModules
// resolveModules sample code }}}

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

    /** writeText ** {{{ */
    writeText: function writeText(text, format, groupName) {
        var element = new jsRTF.TextElement(text, format);
        if (groupName !== undefined && this._groupIndex(groupName) >= 0) {
            this.elements[this._groupIndex(groupName)].push(element);
        } else {
            this.elements.push(element);
        }
    }, /*}}}*/

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

    /** addCommand ** {{{ adds a single command to a given group or as an element
     * @param {String} command
     * @param {String} [groupName]
     * @param {Object} [options]
     * TODO this should not be in prototype
     */
    addCommand: function addCommand(command, groupName, options) {
        // Options...
        if (options === undefined && (typeof groupName === 'undefined' ? 'undefined' : _typeof(groupName)) === 'object') {
            options = groupName;
            groupName = undefined;
        }
        if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            command += new jsRTF.Options(options).compile();
        }
        // Original code...
        if (groupName !== undefined && this._groupIndex(groupName) >= 0) {
            this.elements[this._groupIndex(groupName)].addElement({ text: command, safe: false });
        } else {
            this.elements.push({ text: command, safe: false });
        }
    }, /*}}}*/

    /** addPage ** {{{ page break shortcut */
    addPage: function addPage(groupName) {
        this.addCommand("\\page", groupName);
    }, /*}}}*/

    /** addLine ** {{{ line break shortcut */
    addLine: function addLine(groupName) {
        this.addCommand("\\line", groupName);
    }, /*}}}*/

    /** addTab ** {{{ tab shortcut */
    addTab: function addTab(groupName) {
        this.addCommand("\\tab", groupName);
    }, /*}}}*/

    /** addSection ** {{{ Adds section
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addSection: function addSection(options, groupName) {
        this.addCommand('\\sect', groupName, options);
    }, /*}}}*/

    /** addOptions ** {{{ Adds options (or styles) ???
     * @param {Object} [options]
     * @param {String} [groupName]
     */
    addOptions: function addOptions(options, groupName) {
        var command = new jsRTF.Options(options).compile();
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

    /** createDocument ** {{{ */
    createDocument: function createDocument() /* callback */{
        var _this = this;

        var output = '\{\\rtf1\\ansi\\deff0\n';

        var options = new jsRTF.Options(this.params);
        output += options.compile() + NL;

        var elemsContent = this.elements.map(function (el) {
            return el instanceof jsRTF.Element ? el.getRTFCode(_this.colorTable, _this.fontTable) : jsRTF.Utils.getRTFSafeText(el);
        }).join('\n');

        //now that the tasks are done running: create tables, data populated during element output
        output += jsRTF.Utils.createColorTable(this.colorTable) + NL;
        output += jsRTF.Utils.createFontTable(this.fontTable) + NL;

        output += elemsContent + '\n\}';

        return output;
    } /*}}}*/

},

/* Static properties... {{{ */ /** @lends jsRTF */lib
/*}}}*/

);

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


/**
 * @module index
 * @overview Export library interface
 * @author lilliputten <igor@lilliputten.ru>
 */
module.exports = {

    Utils: __webpack_require__(1),

    Fonts: __webpack_require__(4),
    Colors: __webpack_require__(6),
    RGB: __webpack_require__(2),
    Language: __webpack_require__(13),

    Format: __webpack_require__(5),

    Element: __webpack_require__(3),

    TableElement: __webpack_require__(15),
    TextElement: __webpack_require__(16),
    // ImageElement : require('./elements/image'),
    GroupElement: __webpack_require__(17),

    Options: __webpack_require__(7)

};

/***/ }),
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module options-data
 * @overview Definitions of rtf options
 * @author lilliputten <igor@lilliputten.ru>
 */
module.exports = {

    /** List of all entities */
    options: {

        spaceBefore: 'sb',
        spaceAfter: 'sa',
        leftIndent: 'li',
        rightIndent: 'ri',

        alignLeft: 'ql',
        alignRight: 'qr',
        alignCenter: 'qc',
        alignFull: 'qj',
        align: { name: 'q', value: function value(v) {
                return String(v).toLowerCase().charAt(0);
            } }, // 'center' => 'qc', 'left' => 'ql' etc...

        // fontPos : { name : 'f', test : (v) => v >= 0 },
        // colorPos : { name : 'cf', test : (v) => v >= 0 },
        // bgColorPos : { name : 'cb', test : (v) => v >= 0, value : (v) => isNaN(v) ? v : String( v + 1 ) },

        font: { name: 'f', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.fontPos;
            } }, // NOTE: using non-arrow function for catch `this` value
        color: { name: 'cf', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.colorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value
        bgColor: { name: 'cb', test: function test(v) {
                return v;
            }, value: function value(v) {
                return this.bgColorPos + 1;
            } }, // NOTE: using non-arrow function for catch `this` value

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

        bold: { wrap: true, prefix: '\\b', postfix: '\\b0' },
        italic: { wrap: true, prefix: '\\i', postfix: '\\i0' },
        underline: { wrap: true, prefix: '\\ul', postfix: '\\ul0' },
        strike: { wrap: true, prefix: '\\strike', postfix: '\\strike0' },
        subScript: { wrap: true, prefix: '\\sub', postfix: '\\sub0' },
        superScript: { wrap: true, prefix: '\\super', postfix: '\\super0' }
    },

    /** Entities sort order: first items */
    optionsFirst: ['paragraph'],
    /** Entities sort order: last items */
    oprionsLast: ['bold', 'italic', 'underline', 'strike', 'subScript', 'superScript']

};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module table
 * @overview Table element class
 * @author lilliputten <igor@lilliputten.ru>
 */

var Utils = __webpack_require__(1),
    Format = __webpack_require__(5),
    Element = __webpack_require__(3),
    inherit = __webpack_require__(0),
    isArray = Array.isArray;

var TableElement = inherit(Element, {

    /** __constructor ** {{{
     * @param {Object} options
     * @param {Object} [options.format]
     * @param {Object} [options.rowFormat]
     * @param {Object} [options.firstRowFormat]
     * @param {Object[]} [options.cellsFormats]
     */
    __constructor: function __constructor(options) {
        this.__base.apply(this, arguments);
        this.data = [];
        Object.assign(this, options);
        this.data || (this.data = []);
        this.format || (this.format = new Format());
        this.rowFormat || (this.rowFormat = new Format());
        this.cellsFormats || (this.cellsFormats = []);
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

    /** rowContent ** {{{ Get row content
     * @param {Array} row - Row data
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    rowContent: function rowContent(row, rowNo, colorTable, fontTable) {
        var _this = this;

        var columnsCount = row.length;
        var tableFormat = this.format;
        var rowFormat = rowNo || !this.firstRowFormat ? this.rowFormat : this.firstRowFormat;
        var rowContent = row.map(function (cell) {
            return cell instanceof Element ? cell.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(cell);
        }).map(function (cellContent, n) {
            var cellFormat = _this.cellsFormats[n];
            if (cellFormat) {
                cellContent = cellFormat.formatText(cellContent, colorTable, fontTable, false);
            }
            return cellContent;
        }).map(function (cellContent) {
            return cellContent + '\\cell';
        }).join(' ');
        rowContent = rowFormat.formatText(rowContent, colorTable, fontTable, false);
        var rowPlus = '\{\\trowd\\trautofit1\\intbl';
        var lastRatio = 0;
        row.map(function (cell, n) {
            if (rowFormat.tableHeader) {
                rowPlus += '\\trhdr';
            }
            if (tableFormat.tableBorder) {
                rowPlus += ['', '\\clbrdrt\\brdrs\\brdrw' + tableFormat.tableBorder, '\\clbrdrb\\brdrs\\brdrw' + tableFormat.tableBorder, '\\clbrdrl\\brdrs\\brdrw' + tableFormat.tableBorder, '\\clbrdrr\\brdrs\\brdrw' + tableFormat.tableBorder].join('\n');
            }
            var cellFormat = _this.cellsFormats[n];
            var bgColorPos = cellFormat && Utils.isIndex(cellFormat.bgColorPos) ? cellFormat.bgColorPos : rowFormat.bgColorPos;
            if (Utils.isIndex(bgColorPos)) {
                rowPlus += '\n\\clcbpat' + (bgColorPos + 1);
            }
            // Evaluate cell width
            // TODO: Normalize cells widths?
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
                width = Math.round(tableFormat.tableWidth ? tableFormat.tableWidth * ratio : columnsCount * ratio);
            }
            rowPlus += '\n\\cellx' + width;
        });
        rowPlus += '\n\\row\}';
        rowContent += '\n' + rowPlus;
        return rowContent;
    }, /*}}}*/

    /** updateFormats ** {{{ Update all using formats
     * @param {Object} colorTable
     * @param {Object} fontTable
     */
    updateFormats: function updateFormats(colorTable, fontTable) {

        var formats = (this.cellsFormats || []).concat([this.format, this.rowFormat, this.firstRowsFormat]);

        formats.filter(function (fmt) {
            return fmt;
        }).map(function (fmt) {
            return fmt.updateTables(colorTable, fontTable);
        });
    }, /*}}}*/

    /** getRTFCode ** {{{ Get rtf content for entire table
     * @param {Object} colorTable
     * @param {Object} fontTable
     * @returns {String}
     */
    getRTFCode: function getRTFCode(colorTable, fontTable) {
        var _this2 = this;

        this.updateFormats(colorTable, fontTable);

        var content = this.data.filter(function (row) {
            return isArray(row);
        }).map(function (row, rowNo) {
            return _this2.rowContent(row, rowNo, colorTable, fontTable);
        }, this).join('\n');

        return content;
    } /*}}}*/

}); // end inherit

module.exports = TableElement;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @module text
 * @overview Text element class
 * @author lilliputten <igor@lilliputten.ru>
 */
var Element = __webpack_require__(3),
    inherit = __webpack_require__(0);

var TextElement = inherit(Element, {

    /** __constructor ** {{{ */
    __constructor: function __constructor(text, format) {
        // Element.apply(this, [format]);
        this.__base.call(this, format);
        this.text = text;
    }, /*}}}*/

    /** getRTFCode ** {{{ */
    getRTFCode: function getRTFCode(colorTable, fontTable /* , callback */) {
        // // {{{ OLD ASYNC CODE
        // return callback ? callback(null, this.format.formatText(this.text, colorTable, fontTable)) : this.format.formatText(this.text, colorTable, fontTable);
        // // OLD ASYNC CODE }}}
        return this.format.formatText(this.text, colorTable, fontTable);
    } /*}}}*/

});

module.exports = TextElement;

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

    /** getRTFCode ** {{{ */
    getRTFCode: function getRTFCode(colorTable, fontTable /* , callback */) {
        // // {{{ OLD ASYNC CODE
        // if ( callback ) {
        //     var tasks = [];
        //     var rtf = '';
        //     this.elements.forEach(function(el) {
        //         if ( el instanceof Element ) {
        //             tasks.push(function(cb) { el.getRTFCode(colorTable, fontTable, cb); });
        //         } else {
        //             tasks.push(function(cb) { cb(null, Utils.getRTFSafeText(el)); });
        //         }
        //     });
        //     return async.parallel(tasks, function(err, results) {
        //         results.forEach(function(result) {
        //             rtf += result;
        //         });
        //         //formats the whole group
        //         rtf = this.format.formatText(rtf, colorTable, fontTable, false);
        //         return callback(null, rtf);
        //     });
        // }
        // else {
        // }
        // // OLD ASYNC CODE }}}
        var content = this.elements.map(function (el) {
            return el instanceof Element ? el.getRTFCode(colorTable, fontTable) : Utils.getRTFSafeText(el);
        }).join('\n');
        content = this.format.formatText(content, colorTable, fontTable, false);
        return content;
    } /*}}}*/

});

module.exports = GroupElement;

/***/ })
/******/ ]);
//# sourceMappingURL=jsrtf.js.map