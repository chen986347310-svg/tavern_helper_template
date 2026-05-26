var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/lodash.js
var require_lodash = __commonJS({
  "node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/lodash.js"(exports, module) {
    (function() {
      var undefined2;
      var VERSION = "4.18.1";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`", INVALID_TEMPL_IMPORTS_ERROR_TEXT = "Invalid `imports` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG],
        ["bind", WRAP_BIND_FLAG],
        ["bindKey", WRAP_BIND_KEY_FLAG],
        ["curry", WRAP_CURRY_FLAG],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG],
        ["flip", WRAP_FLIP_FLAG],
        ["partial", WRAP_PARTIAL_FLAG],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
        ["rearg", WRAP_REARG_FLAG]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        // Latin-1 Supplement block.
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        // Latin Extended-A block.
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = (function() {
        try {
          var types = freeModule && freeModule.require && freeModule.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      })();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          var value = array[index];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEachRight(array, iteratee) {
        var length = array == null ? 0 : array.length;
        while (length--) {
          if (iteratee(array[length], length, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEvery(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayIncludes(array, value) {
        var length = array == null ? 0 : array.length;
        return !!length && baseIndexOf(array, value, 0) > -1;
      }
      function arrayIncludesWith(array, value, comparator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (comparator(value, array[index])) {
            return true;
          }
        }
        return false;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array[length], length, array);
        }
        return accumulator;
      }
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      var asciiSize = baseProperty("length");
      function asciiToArray(string) {
        return string.split("");
      }
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key, collection2) {
          if (predicate(value, key, collection2)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      function baseIndexOfWith(array, value, fromIndex, comparator) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (comparator(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function baseMean(array, iteratee) {
        var length = array == null ? 0 : array.length;
        return length ? baseSum(array, iteratee) / length : NAN;
      }
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined2 : object[key];
        };
      }
      function basePropertyOf(object) {
        return function(key) {
          return object == null ? undefined2 : object[key];
        };
      }
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
        });
        return accumulator;
      }
      function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
      function baseSum(array, iteratee) {
        var result, index = -1, length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== undefined2) {
            result = result === undefined2 ? current : result + current;
          }
        }
        return result;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function baseToPairs(object, props) {
        return arrayMap(props, function(key) {
          return [key, object[key]];
        });
      }
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      function baseValues(object, props) {
        return arrayMap(props, function(key) {
          return object[key];
        });
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1, length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function countHolders(array, placeholder) {
        var length = array.length, result = 0;
        while (length--) {
          if (array[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      function getValue(object, key) {
        return object == null ? undefined2 : object[key];
      }
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index] = PLACEHOLDER;
            result[resIndex++] = index;
          }
        }
        return result;
      }
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      function setToPairs(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = [value, value];
        });
        return result;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function strictLastIndexOf(array, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return index;
      }
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {
        }
        return index;
      }
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      var runInContext = (function runInContext2(context) {
        context = context == null ? root : _4.defaults(root.Object(), context, _4.pick(root, contextProps));
        var Array2 = context.Array, Date = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = (function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid ? "Symbol(src)_1." + uid : "";
        })();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2(
          "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
        );
        var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
        var defineProperty = (function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e) {
          }
        })();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap && new WeakMap();
        var realNames = {};
        var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
        var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
        function lodash(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        var baseCreate = /* @__PURE__ */ (function() {
          function object() {
          }
          return function(proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined2;
            return result2;
          };
        })();
        function baseLodash() {
        }
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined2;
        }
        lodash.templateSettings = {
          /**
           * Used to detect `data` property values to be HTML-escaped.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "escape": reEscape,
          /**
           * Used to detect code to be evaluated.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "evaluate": reEvaluate,
          /**
           * Used to detect `data` property values to inject.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "interpolate": reInterpolate,
          /**
           * Used to reference the data object in the template text.
           *
           * @memberOf _.templateSettings
           * @type {string}
           */
          "variable": "",
          /**
           * Used to import variables into the compiled template.
           *
           * @memberOf _.templateSettings
           * @type {Object}
           */
          "imports": {
            /**
             * A reference to the `lodash` function.
             *
             * @memberOf _.templateSettings.imports
             * @type {Function}
             */
            "_": lodash
          }
        };
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }
        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }
        function lazyValue() {
          var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length && takeCount == length) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1, value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        function hashDelete(key) {
          var result2 = this.has(key) && delete this.__data__[key];
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key];
            return result2 === HASH_UNDEFINED ? undefined2 : result2;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined2;
        }
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
        }
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
          return this;
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        function listCacheDelete(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          --this.size;
          return true;
        }
        function listCacheGet(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          return index < 0 ? undefined2 : data[index][1];
        }
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            ++this.size;
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }
        function mapCacheDelete(key) {
          var result2 = getMapData(this, key)["delete"](key);
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
          var data = getMapData(this, key), size2 = data.size;
          data.set(key, value);
          this.size += data.size == size2 ? 0 : 1;
          return this;
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values2) {
          var index = -1, length = values2 == null ? 0 : values2.length;
          this.__data__ = new MapCache();
          while (++index < length) {
            this.add(values2[index]);
          }
        }
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        function stackDelete(key) {
          var data = this.__data__, result2 = data["delete"](key);
          this.size = data.size;
          return result2;
        }
        function stackGet(key) {
          return this.__data__.get(key);
        }
        function stackHas(key) {
          return this.__data__.has(key);
        }
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
            (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
            isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
            isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
            isIndex(key, length)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function arraySample(array) {
          var length = array.length;
          return length ? array[baseRandom(0, length - 1)] : undefined2;
        }
        function arraySampleSize(array, n) {
          return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
        }
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        function assignMergeValue(object, key, value) {
          if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }
        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }
        function baseAssignValue(object, key, value) {
          if (key == "__proto__" && defineProperty) {
            defineProperty(object, key, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key] = value;
          }
        }
        function baseAt(object, paths) {
          var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
          while (++index < length) {
            result2[index] = skip ? undefined2 : get(object, paths[index]);
          }
          return result2;
        }
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined2) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined2) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        function baseClone(value, bitmask, customizer, key, object, stack) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key, object, stack) : customizer(value);
          }
          if (result2 !== undefined2) {
            return result2;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result2);
          if (isSet(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
            });
          } else if (isMap(value)) {
            value.forEach(function(subValue, key2) {
              result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined2 : keysFunc(value);
          arrayEach(props || value, function(subValue, key2) {
            if (props) {
              key2 = subValue;
              subValue = value[key2];
            }
            assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
          return result2;
        }
        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }
        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (length--) {
            var key = props[length], predicate = source[key], value = object[key];
            if (value === undefined2 && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout(function() {
            func.apply(undefined2, args);
          }, wait);
        }
        function baseDifference(array, values2, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
          if (!length) {
            return result2;
          }
          if (iteratee2) {
            values2 = arrayMap(values2, baseUnary(iteratee2));
          }
          if (comparator) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values2.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values2 = new SetCache(values2);
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values2[valuesIndex] === computed) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values2, computed, comparator)) {
                result2.push(value);
              }
            }
          return result2;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index, collection2) {
            result2 = !!predicate(value, index, collection2);
            return result2;
          });
          return result2;
        }
        function baseExtremum(array, iteratee2, comparator) {
          var index = -1, length = array.length;
          while (++index < length) {
            var value = array[index], current = iteratee2(value);
            if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current, result2 = value;
            }
          }
          return result2;
        }
        function baseFill(array, value, start, end) {
          var length = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined2 || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array[start++] = value;
          }
          return array;
        }
        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index, collection2) {
            if (predicate(value, index, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }
        function baseFlatten(array, depth, predicate, isStrict, result2) {
          var index = -1, length = array.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index < length) {
            var value = array[index];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }
        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }
        function baseFunctions(object, props) {
          return arrayFilter(props, function(key) {
            return isFunction(object[key]);
          });
        }
        function baseGet(object, path) {
          path = castPath(path, object);
          var index = 0, length = path.length;
          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return index && index == length ? object : undefined2;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }
        function baseGetTag(value) {
          if (value == null) {
            return value === undefined2 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
        }
        function baseGt(value, other) {
          return value > other;
        }
        function baseHas(object, key) {
          return object != null && hasOwnProperty.call(object, key);
        }
        function baseHasIn(object, key) {
          return object != null && key in Object2(object);
        }
        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }
        function baseIntersection(arrays, iteratee2, comparator) {
          var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee2) {
              array = arrayMap(array, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
          }
          array = arrays[0];
          var index = -1, seen = caches[0];
          outer:
            while (++index < length && result2.length < maxLength) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key, object2) {
            setter(accumulator, iteratee2(value), key, object2);
          });
          return accumulator;
        }
        function baseInvoke(object, path, args) {
          path = castPath(path, object);
          object = parent(object, path);
          var func = object == null ? object : object[toKey(last(path))];
          return func == null ? undefined2 : apply(func, object, args);
        }
        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }
        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }
        function baseIsEqual(value, other, bitmask, customizer, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
          var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
          objTag = objTag == argsTag ? objectTag : objTag;
          othTag = othTag == argsTag ? objectTag : othTag;
          var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
          if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) {
              return false;
            }
            objIsArr = true;
            objIsObj = false;
          }
          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length, length = index, noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined2 && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                return false;
              }
            }
          }
          return true;
        }
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key in Object2(object)) {
            if (hasOwnProperty.call(object, key) && key != "constructor") {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key in object) {
            if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseLt(value, other) {
          return value < other;
        }
        function baseMap(collection, iteratee2) {
          var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key, collection2) {
            result2[++index] = iteratee2(value, key, collection2);
          });
          return result2;
        }
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get(object, path);
            return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }
        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
              if (newValue === undefined2) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          }, keysIn);
        }
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
          var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
          var isCommon = newValue === undefined2;
          if (isCommon) {
            var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else {
                newValue = [];
              }
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || isFunction(objValue)) {
                newValue = initCloneObject(srcValue);
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
            stack["delete"](srcValue);
          }
          assignMergeValue(object, key, newValue);
        }
        function baseNth(array, n) {
          var length = array.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array[n] : undefined2;
        }
        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [identity];
          }
          var index = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return { "criteria": criteria, "index": ++index, "value": value };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path) {
            return hasIn(object, path);
          });
        }
        function basePickBy(object, paths, predicate) {
          var index = -1, length = paths.length, result2 = {};
          while (++index < length) {
            var path = paths[index], value = baseGet(object, path);
            if (predicate(value, path)) {
              baseSet(result2, castPath(path, object), value);
            }
          }
          return result2;
        }
        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }
        function basePullAll(array, values2, iteratee2, comparator) {
          var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
          if (array === values2) {
            values2 = copyArray(values2);
          }
          if (iteratee2) {
            seen = arrayMap(array, baseUnary(iteratee2));
          }
          while (++index < length) {
            var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0, lastIndex = length - 1;
          while (length--) {
            var index = indexes[length];
            if (length == lastIndex || index !== previous) {
              var previous = index;
              if (isIndex(index)) {
                splice.call(array, index, 1);
              } else {
                baseUnset(array, index);
              }
            }
          }
          return array;
        }
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        function baseRange(start, end, step, fromRight) {
          var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
          while (length--) {
            result2[fromRight ? length : ++index] = start;
            start += step;
          }
          return result2;
        }
        function baseRepeat(string, n) {
          var result2 = "";
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n % 2) {
              result2 += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result2;
        }
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }
        function baseSample(collection) {
          return arraySample(values(collection));
        }
        function baseSampleSize(collection, n) {
          var array = values(collection);
          return shuffleSelf(array, baseClamp(n, 0, array.length));
        }
        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = castPath(path, object);
          var index = -1, length = path.length, lastIndex = length - 1, nested = object;
          while (nested != null && ++index < length) {
            var key = toKey(path[index]), newValue = value;
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              return object;
            }
            if (index != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined2;
              if (newValue === undefined2) {
                newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty ? identity : function(func, string) {
          return defineProperty(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }
        function baseSlice(array, start, end) {
          var index = -1, length = array.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length);
          while (++index < length) {
            result2[index] = array[index + start];
          }
          return result2;
        }
        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index, collection2) {
            result2 = predicate(value, index, collection2);
            return !result2;
          });
          return !!result2;
        }
        function baseSortedIndex(array, value, retHighest) {
          var low = 0, high = array == null ? low : array.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed = array[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        function baseSortedIndexBy(array, value, iteratee2, retHighest) {
          var low = 0, high = array == null ? 0 : array.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function baseSortedUniq(array, iteratee2) {
          var index = -1, length = array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            if (!index || !eq(computed, seen)) {
              var seen = computed;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }
        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }
        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function baseUniq(array, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
          if (comparator) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set2 = iteratee2 ? null : createSet(array);
            if (set2) {
              return setToArray(set2);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed);
                }
                result2.push(value);
              } else if (!includes2(seen, computed, comparator)) {
                if (seen !== result2) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseUnset(object, path) {
          path = castPath(path, object);
          var index = -1, length = path.length;
          if (!length) {
            return true;
          }
          while (++index < length) {
            var key = toKey(path[index]);
            if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) {
              return false;
            }
            if ((key === "constructor" || key === "prototype") && index < length - 1) {
              return false;
            }
          }
          var obj = parent(object, path);
          return obj == null || delete obj[toKey(last(path))];
        }
        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length = array.length, index = fromRight ? length : -1;
          while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
          }
          return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([result3], action.args));
          }, result2);
        }
        function baseXor(arrays, iteratee2, comparator) {
          var length = arrays.length;
          if (length < 2) {
            return length ? baseUniq(arrays[0]) : [];
          }
          var index = -1, result2 = Array2(length);
          while (++index < length) {
            var array = arrays[index], othIndex = -1;
            while (++othIndex < length) {
              if (othIndex != index) {
                result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
        }
        function baseZipObject(props, values2, assignFunc) {
          var index = -1, length = props.length, valsLength = values2.length, result2 = {};
          while (++index < length) {
            var value = index < valsLength ? values2[index] : undefined2;
            assignFunc(result2, props[index], value);
          }
          return result2;
        }
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }
        function castPath(value, object) {
          if (isArray(value)) {
            return value;
          }
          return isKey(value, object) ? [value] : stringToPath(toString(value));
        }
        var castRest = baseRest;
        function castSlice(array, start, end) {
          var length = array.length;
          end = end === undefined2 ? length : end;
          return !start && end >= length ? array : baseSlice(array, start, end);
        }
        var clearTimeout = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result2);
          return result2;
        }
        function cloneArrayBuffer(arrayBuffer) {
          var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
          return result2;
        }
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        function compareMultiple(object, other, orders) {
          var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
          while (++index < length) {
            var result2 = compareAscending(objCriteria[index], othCriteria[index]);
            if (result2) {
              if (index >= ordersLength) {
                return result2;
              }
              var order = orders[index];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }
        function copyArray(source, array) {
          var index = -1, length = source.length;
          array || (array = Array2(length));
          while (++index < length) {
            array[index] = source[index];
          }
          return array;
        }
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index = -1, length = props.length;
          while (++index < length) {
            var key = props[index];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
            if (newValue === undefined2) {
              newValue = source[key];
            }
            if (isNew) {
              baseAssignValue(object, key, newValue);
            } else {
              assignValue(object, key, newValue);
            }
          }
          return object;
        }
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }
        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }
        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined2 : customizer;
              length = 1;
            }
            object = Object2(object);
            while (++index < length) {
              var source = sources[index];
              if (source) {
                assigner(object, source, index, customizer);
              }
            }
            return object;
          });
        }
        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
            while (fromRight ? index-- : ++index < length) {
              if (iteratee2(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee2(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          return wrapper;
        }
        function createCaseFirst(methodName) {
          return function(string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }
        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject(result2) ? result2 : thisBinding;
          };
        }
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
            while (index--) {
              args[index] = arguments[index];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(
                func,
                bitmask,
                createHybrid,
                wrapper.placeholder,
                undefined2,
                args,
                holders,
                undefined2,
                undefined2,
                arity - length
              );
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }
          return wrapper;
        }
        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function(key) {
                return iteratee2(iterable[key], key, iterable);
              };
            }
            var index = findIndexFunc(collection, predicate, fromIndex);
            return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
          };
        }
        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index--) {
              var func = funcs[index];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index = wrapper ? index : length;
            while (++index < length) {
              func = funcs[index];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper && args.length == 1 && isArray(value)) {
                return wrapper.plant(value).value();
              }
              var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
              while (++index2 < length) {
                result2 = funcs[index2].call(this, result2);
              }
              return result2;
            };
          });
        }
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length;
            while (index--) {
              args[index] = arguments[index];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(
                func,
                bitmask,
                createHybrid,
                wrapper.placeholder,
                thisArg,
                args,
                newHolders,
                argPos,
                ary2,
                arity - length
              );
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          return wrapper;
        }
        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }
        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined2 && other === undefined2) {
              return defaultValue;
            }
            if (value !== undefined2) {
              result2 = value;
            }
            if (other !== undefined2) {
              if (result2 === undefined2) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }
        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply(iteratee2, thisArg, args);
              });
            });
          });
        }
        function createPadding(length, chars) {
          chars = chars === undefined2 ? " " : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
          }
          var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
        }
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }
          return wrapper;
        }
        function createRange(fromRight) {
          return function(start, end, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
              end = step = undefined2;
            }
            start = toFinite(start);
            if (end === undefined2) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }
        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined2, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }
        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values2) {
          return new Set2(values2);
        };
        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined2;
          }
          ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined2 ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined2;
          }
          var data = isBindKey ? undefined2 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined2, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }
        function customDefaultsAssignIn(objValue, srcValue, key, object) {
          if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
            stack["delete"](srcValue);
          }
          return objValue;
        }
        function customOmitClone(value) {
          return isPlainObject(value) ? undefined2 : value;
        }
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack.get(array);
          var othStacked = stack.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array;
          }
          var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
          stack.set(array, other);
          stack.set(other, array);
          while (++index < arrLength) {
            var arrValue = array[index], othValue = other[index];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
            }
            if (compared !== undefined2) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              result2 = false;
              break;
            }
          }
          stack["delete"](array);
          stack["delete"](other);
          return result2;
        }
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + "";
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          var objStacked = stack.get(object);
          var othStacked = stack.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key], othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            }
            if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack["delete"](object);
          stack["delete"](other);
          return result2;
        }
        function flatRest(func) {
          return setToString(overRest(func, undefined2, flatten), func + "");
        }
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        var getData = !metaMap ? noop : function(func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
          while (length--) {
            var data = array[length], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }
        function getHolder(func) {
          var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
          return object.placeholder;
        }
        function getIteratee() {
          var result2 = lodash.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }
        function getMapData(map2, key) {
          var data = map2.__data__;
          return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
        }
        function getMatchData(object) {
          var result2 = keys(object), length = result2.length;
          while (length--) {
            var key = result2[length], value = object[key];
            result2[length] = [key, value, isStrictComparable(value)];
          }
          return result2;
        }
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined2;
        }
        function getRawTag(value) {
          var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined2;
            var unmasked = true;
          } catch (e) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
          getTag = function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result2;
          };
        }
        function getView(start, end, transforms) {
          var index = -1, length = transforms.length;
          while (++index < length) {
            var data = transforms[index], size2 = data.size;
            switch (data.type) {
              case "drop":
                start += size2;
                break;
              case "dropRight":
                end -= size2;
                break;
              case "take":
                end = nativeMin(end, start + size2);
                break;
              case "takeRight":
                start = nativeMax(start, end - size2);
                break;
            }
          }
          return { "start": start, "end": end };
        }
        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }
        function hasPath(object, path, hasFunc) {
          path = castPath(path, object);
          var index = -1, length = path.length, result2 = false;
          while (++index < length) {
            var key = toKey(path[index]);
            if (!(result2 = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result2 || ++index != length) {
            return result2;
          }
          length = object == null ? 0 : object.length;
          return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
        }
        function initCloneArray(array) {
          var length = array.length, result2 = new array.constructor(length);
          if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
            result2.index = array.index;
            result2.input = array.input;
          }
          return result2;
        }
        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }
        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        function isIndex(value, length) {
          var type = typeof value;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
        }
        function isIterateeCall(value, index, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index;
          if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
            return eq(object[index], value);
          }
          return false;
        }
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }
        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }
        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        var isMaskable = coreJsData ? isFunction : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
          };
        }
        function memoizeCapped(func) {
          var result2 = memoize(func, function(key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result2.cache;
          return result2;
        }
        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key in Object2(object)) {
              result2.push(key);
            }
          }
          return result2;
        }
        function objectToString(value) {
          return nativeObjectToString.call(value);
        }
        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
            while (++index < length) {
              array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array2(start + 1);
            while (++index < start) {
              otherArgs[index] = args[index];
            }
            otherArgs[start] = transform2(array);
            return apply(func, this, otherArgs);
          };
        }
        function parent(object, path) {
          return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
        }
        function reorder(array, indexes) {
          var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
          while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
          }
          return array;
        }
        function safeGet(object, key) {
          if (key === "constructor" && typeof object[key] === "function") {
            return;
          }
          if (key == "__proto__") {
            return;
          }
          return object[key];
        }
        var setData = shortOut(baseSetData);
        var setTimeout = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        function shortOut(func) {
          var count = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined2, arguments);
          };
        }
        function shuffleSelf(array, size2) {
          var index = -1, length = array.length, lastIndex = length - 1;
          size2 = size2 === undefined2 ? length : size2;
          while (++index < size2) {
            var rand = baseRandom(index, lastIndex), value = array[rand];
            array[rand] = array[index];
            array[index] = value;
          }
          array.length = size2;
          return array;
        }
        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
          });
          return result2;
        });
        function toKey(value) {
          if (typeof value == "string" || isSymbol(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {
            }
            try {
              return func + "";
            } catch (e) {
            }
          }
          return "";
        }
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result2.__actions__ = copyArray(wrapper.__actions__);
          result2.__index__ = wrapper.__index__;
          result2.__values__ = wrapper.__values__;
          return result2;
        }
        function chunk(array, size2, guard) {
          if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
            size2 = 1;
          } else {
            size2 = nativeMax(toInteger(size2), 0);
          }
          var length = array == null ? 0 : array.length;
          if (!length || size2 < 1) {
            return [];
          }
          var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
          while (index < length) {
            result2[resIndex++] = baseSlice(array, index, index += size2);
          }
          return result2;
        }
        function compact(array) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }
        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array2(length - 1), array = arguments[0], index = length;
          while (index--) {
            args[index - 1] = arguments[index];
          }
          return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
        }
        var difference = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array, values2) {
          var iteratee2 = last(values2);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array, values2) {
          var comparator = last(values2);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
        });
        function drop2(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function dropRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        function fill(array, value, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array, value, start, end);
        }
        function findIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index);
        }
        function findLastIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length - 1;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index, true);
        }
        function flatten(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, 1) : [];
        }
        function flattenDeep(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, INFINITY) : [];
        }
        function flattenDepth(array, depth) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        function fromPairs(pairs) {
          var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index < length) {
            var pair = pairs[index];
            baseAssignValue(result2, pair[0], pair[1]);
          }
          return result2;
        }
        function head(array) {
          return array && array.length ? array[0] : undefined2;
        }
        function indexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseIndexOf(array, value, index);
        }
        function initial(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 0, -1) : [];
        }
        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last(mapped)) {
            iteratee2 = undefined2;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          if (comparator) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
        });
        function join(array, separator) {
          return array == null ? "" : nativeJoin.call(array, separator);
        }
        function last(array) {
          var length = array == null ? 0 : array.length;
          return length ? array[length - 1] : undefined2;
        }
        function lastIndexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
        }
        function nth(array, n) {
          return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
        }
        var pull = baseRest(pullAll);
        function pullAll(array, values2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
        }
        function pullAllBy(array, values2, iteratee2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
        }
        function pullAllWith(array, values2, comparator) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
        }
        var pullAt = flatRest(function(array, indexes) {
          var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function(index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending));
          return result2;
        });
        function remove(array, predicate) {
          var result2 = [];
          if (!(array && array.length)) {
            return result2;
          }
          var index = -1, indexes = [], length = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result2.push(value);
              indexes.push(index);
            }
          }
          basePullAt(array, indexes);
          return result2;
        }
        function reverse(array) {
          return array == null ? array : nativeReverse.call(array);
        }
        function slice(array, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined2 ? length : toInteger(end);
          }
          return baseSlice(array, start, end);
        }
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        function sortedIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
        }
        function sortedIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value);
            if (index < length && eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        function sortedLastIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
        }
        function sortedLastIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        function sortedUniqBy(array, iteratee2) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function tail(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 1, length) : [];
        }
        function take(array, n, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function takeRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
        });
        function uniq4(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        function uniqBy(array, iteratee2) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function uniqWith(array, comparator) {
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return array && array.length ? baseUniq(array, undefined2, comparator) : [];
        }
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length = 0;
          array = arrayFilter(array, function(group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function(index) {
            return arrayMap(array, baseProperty(index));
          });
        }
        function unzipWith(array, iteratee2) {
          if (!(array && array.length)) {
            return [];
          }
          var result2 = unzip(array);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply(iteratee2, undefined2, group);
          });
        }
        var without = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values2) {
          return baseZipObject(props || [], values2 || [], assignValue);
        }
        function zipObjectDeep(props, values2) {
          return baseZipObject(props || [], values2 || [], baseSet);
        }
        var zipWith = baseRest(function(arrays) {
          var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
          return unzipWith(arrays, iteratee2);
        });
        function chain(value) {
          var result2 = lodash(value);
          result2.__chain__ = true;
          return result2;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function thru(value, interceptor) {
          return interceptor(value);
        }
        var wrapperAt = flatRest(function(paths) {
          var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
            return baseAt(object, paths);
          };
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [interceptor],
            "thisArg": undefined2
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array) {
            if (length && !array.length) {
              array.push(undefined2);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperNext() {
          if (this.__values__ === undefined2) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
          return { "done": done, "value": value };
        }
        function wrapperToIterator() {
          return this;
        }
        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone2 = wrapperClone(parent2);
            clone2.__index__ = 0;
            clone2.__values__ = undefined2;
            if (result2) {
              previous.__wrapped__ = clone2;
            } else {
              result2 = clone2;
            }
            var previous = clone2;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [reverse],
              "thisArg": undefined2
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var countBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            ++result2[key];
          } else {
            baseAssignValue(result2, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), 1);
        }
        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), INFINITY);
        }
        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee2), depth);
        }
        function forEach(collection, iteratee2) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function forEachRight(collection, iteratee2) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }
        var groupBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            result2[key].push(value);
          } else {
            baseAssignValue(result2, key, [value]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }
        var invokeMap = baseRest(function(collection, path, args) {
          var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
          });
          return result2;
        });
        var keyBy = createAggregator(function(result2, value, key) {
          baseAssignValue(result2, key, value);
        });
        function map(collection, iteratee2) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined2 : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        var partition = createAggregator(function(result2, value, key) {
          result2[key ? 0 : 1].push(value);
        }, function() {
          return [[], []];
        });
        function reduce(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }
        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }
        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }
        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }
        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }
        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };
        function after(n, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function ary(func, n, guard) {
          n = guard ? undefined2 : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
        }
        function before(n, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined2;
            }
            return result2;
          };
        }
        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }
        function curryRight(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }
        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined2;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
          }
          function trailingEdge(time) {
            timerId = undefined2;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined2;
            return result2;
          }
          function cancel() {
            if (timerId !== undefined2) {
              clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined2;
          }
          function flush() {
            return timerId === undefined2 ? result2 : trailingEdge(now());
          }
          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined2) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined2) {
              timerId = setTimeout(timerExpired, wait);
            }
            return result2;
          }
          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }
        function memoize(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key, result2) || cache;
            return result2;
          };
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }
        memoize.Cache = MapCache;
        function negate(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        function once(func) {
          return before(2, func);
        }
        var overArgs = castRest(function(func, transforms) {
          transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function(args) {
            var index = -1, length = nativeMin(args.length, funcsLength);
            while (++index < length) {
              args[index] = transforms[index].call(this, args[index]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
        });
        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined2 ? start : toInteger(start);
          return baseRest(func, start);
        }
        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array = args[start], otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply(func, this, otherArgs);
          });
        }
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }
        function unary(func) {
          return ary(func, 1);
        }
        function wrap(value, wrapper) {
          return partial(castFunction(wrapper), value);
        }
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }
        function clone(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }
        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }
        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
          return arguments;
        })()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
        }
        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          var result2 = customizer ? customizer(value, other) : undefined2;
          return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
        }
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
        }
        function isFinite2(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }
        function isFunction(value) {
          if (!isObject(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }
        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isObject(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }
        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        function isNaN2(value) {
          return isNumber(value) && value != +value;
        }
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error2(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        function isNull(value) {
          return value === null;
        }
        function isNil(value) {
          return value == null;
        }
        function isNumber(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }
        function isPlainObject(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString(value) {
          return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        function isSymbol(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined2;
        }
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });
        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }
        function toString(value) {
          return value == null ? "" : baseToString(value);
        }
        var assign = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create(prototype, properties) {
          var result2 = baseCreate(prototype);
          return properties == null ? result2 : baseAssign(result2, properties);
        }
        var defaults = baseRest(function(object, sources) {
          object = Object2(object);
          var index = -1;
          var length = sources.length;
          var guard = length > 2 ? sources[2] : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length = 1;
          }
          while (++index < length) {
            var source = sources[index];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key = props[propsIndex];
              var value = object[key];
              if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                object[key] = source[key];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined2, customDefaultsMerge);
          return apply(mergeWith, undefined2, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }
        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        function get(object, path, defaultValue) {
          var result2 = object == null ? undefined2 : baseGet(object, path);
          return result2 === undefined2 ? defaultValue : result2;
        }
        function has(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }
        var invert = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty.call(result2, value)) {
            result2[value].push(key);
          } else {
            result2[value] = [key];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, iteratee2(value, key, object2), value);
          });
          return result2;
        }
        function mapValues(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, key, iteratee2(value, key, object2));
          });
          return result2;
        }
        var merge = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path) {
            path = castPath(path, object);
            isDeep || (isDeep = path.length > 1);
            return path;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length = paths.length;
          while (length--) {
            baseUnset(result2, paths[length]);
          }
          return result2;
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }
        var pick = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });
        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [prop];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path) {
            return predicate(value, path[0]);
          });
        }
        function result(object, path, defaultValue) {
          path = castPath(path, object);
          var index = -1, length = path.length;
          if (!length) {
            length = 1;
            object = undefined2;
          }
          while (++index < length) {
            var value = object == null ? undefined2 : object[toKey(path[index])];
            if (value === undefined2) {
              index = length;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }
        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }
        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseSet(object, path, value, customizer);
        }
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee2, accumulator) {
          var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject(object)) {
              accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
            return iteratee2(accumulator, value, index, object2);
          });
          return accumulator;
        }
        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }
        function update(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }
        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }
        function values(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        function clamp(number, lower, upper) {
          if (upper === undefined2) {
            upper = lower;
            lower = undefined2;
          }
          if (upper !== undefined2) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined2) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }
        function random(lower, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined2;
          }
          if (floating === undefined2) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined2;
            } else if (typeof lower == "boolean") {
              floating = lower;
              lower = undefined2;
            }
          }
          if (lower === undefined2 && upper === undefined2) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined2) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        var camelCase = createCompounder(function(result2, word, index) {
          word = word.toLowerCase();
          return result2 + (index ? capitalize(word) : word);
        });
        function capitalize(string) {
          return upperFirst(toString(string).toLowerCase());
        }
        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }
        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }
        function escape(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }
        var kebabCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");
        function pad(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        function padEnd(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
        }
        function padStart(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
        }
        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
        }
        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }
        function replace() {
          var args = arguments, string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        var snakeCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "_" : "") + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined2;
          }
          limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        var startCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + upperFirst(word);
        });
        function startsWith(string, target, position) {
          string = toString(string);
          position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }
        function template(string, options, guard) {
          var settings = lodash.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined2;
          }
          string = toString(string);
          options = assignWith({}, options, settings, customDefaultsAssignIn);
          var imports = assignWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          arrayEach(importsKeys, function(key) {
            if (reForbiddenIdentifierChars.test(key)) {
              throw new Error2(INVALID_TEMPL_IMPORTS_ERROR_TEXT);
            }
          });
          var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2(
            (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
            "g"
          );
          var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = hasOwnProperty.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }
        function toLower(value) {
          return toString(value).toLowerCase();
        }
        function toUpper(value) {
          return toString(value).toUpperCase();
        }
        function trim(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return baseTrim(string);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join("");
        }
        function trimEnd(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end).join("");
        }
        function trimStart(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join("");
        }
        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length = "length" in options ? toInteger(options.length) : length;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
          if (separator === undefined2) {
            return result2 + omission;
          }
          if (strSymbols) {
            end += result2.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index = result2.lastIndexOf(separator);
            if (index > -1) {
              result2 = result2.slice(0, index);
            }
          }
          return result2 + omission;
        }
        function unescape(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        var upperCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");
        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined2 : pattern;
          if (pattern === undefined2) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        var attempt = baseRest(function(func, args) {
          try {
            return apply(func, undefined2, args);
          } catch (e) {
            return isError(e) ? e : new Error2(e);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function(args) {
            var index = -1;
            while (++index < length) {
              var pair = pairs[index];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }
        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }
        function constant(value) {
          return function() {
            return value;
          };
        }
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }
        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }
        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
        }
        var method = baseRest(function(path, args) {
          return function(object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path) {
            return baseInvoke(object, path, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({ "func": func, "args": arguments, "thisArg": object });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        function noop() {
        }
        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function(args) {
            return baseNth(args, n);
          });
        }
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        function propertyOf(object) {
          return function(path) {
            return object == null ? undefined2 : baseGet(object, path);
          };
        }
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        function stubFalse() {
          return false;
        }
        function stubObject() {
          return {};
        }
        function stubString() {
          return "";
        }
        function stubTrue() {
          return true;
        }
        function times(n, iteratee2) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length, iteratee2);
          while (++index < n) {
            iteratee2(index);
          }
          return result2;
        }
        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
        }
        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }
        var add = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
        }
        function maxBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
        }
        function mean(array) {
          return baseMean(array, identity);
        }
        function meanBy(array, iteratee2) {
          return baseMean(array, getIteratee(iteratee2, 2));
        }
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
        }
        function minBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
        }
        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound("round");
        var subtract = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        function sumBy(array, iteratee2) {
          return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
        }
        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.assignIn = assignIn;
        lodash.assignInWith = assignInWith;
        lodash.assignWith = assignWith;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.castArray = castArray;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.concat = concat;
        lodash.cond = cond;
        lodash.conforms = conforms;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defaultsDeep = defaultsDeep;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.differenceBy = differenceBy;
        lodash.differenceWith = differenceWith;
        lodash.drop = drop2;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatMap = flatMap;
        lodash.flatMapDeep = flatMapDeep;
        lodash.flatMapDepth = flatMapDepth;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flattenDepth = flattenDepth;
        lodash.flip = flip;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.fromPairs = fromPairs;
        lodash.functions = functions;
        lodash.functionsIn = functionsIn;
        lodash.groupBy = groupBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.intersectionBy = intersectionBy;
        lodash.intersectionWith = intersectionWith;
        lodash.invert = invert;
        lodash.invertBy = invertBy;
        lodash.invokeMap = invokeMap;
        lodash.iteratee = iteratee;
        lodash.keyBy = keyBy;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.mergeWith = mergeWith;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.nthArg = nthArg;
        lodash.omit = omit;
        lodash.omitBy = omitBy;
        lodash.once = once;
        lodash.orderBy = orderBy;
        lodash.over = over;
        lodash.overArgs = overArgs;
        lodash.overEvery = overEvery;
        lodash.overSome = overSome;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick;
        lodash.pickBy = pickBy;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAll = pullAll;
        lodash.pullAllBy = pullAllBy;
        lodash.pullAllWith = pullAllWith;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rangeRight = rangeRight;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.reverse = reverse;
        lodash.sampleSize = sampleSize;
        lodash.set = set;
        lodash.setWith = setWith;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortedUniq = sortedUniq;
        lodash.sortedUniqBy = sortedUniqBy;
        lodash.split = split;
        lodash.spread = spread;
        lodash.tail = tail;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.toArray = toArray;
        lodash.toPairs = toPairs;
        lodash.toPairsIn = toPairsIn;
        lodash.toPath = toPath;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.unary = unary;
        lodash.union = union;
        lodash.unionBy = unionBy;
        lodash.unionWith = unionWith;
        lodash.uniq = uniq4;
        lodash.uniqBy = uniqBy;
        lodash.uniqWith = uniqWith;
        lodash.unset = unset;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.update = update;
        lodash.updateWith = updateWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.without = without;
        lodash.words = words;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.xorBy = xorBy;
        lodash.xorWith = xorWith;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipObjectDeep = zipObjectDeep;
        lodash.zipWith = zipWith;
        lodash.entries = toPairs;
        lodash.entriesIn = toPairsIn;
        lodash.extend = assignIn;
        lodash.extendWith = assignInWith;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.ceil = ceil;
        lodash.clamp = clamp;
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.cloneDeepWith = cloneDeepWith;
        lodash.cloneWith = cloneWith;
        lodash.conformsTo = conformsTo;
        lodash.deburr = deburr;
        lodash.defaultTo = defaultTo;
        lodash.divide = divide;
        lodash.endsWith = endsWith;
        lodash.eq = eq;
        lodash.escape = escape;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.floor = floor;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.get = get;
        lodash.gt = gt;
        lodash.gte = gte;
        lodash.has = has;
        lodash.hasIn = hasIn;
        lodash.head = head;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.invoke = invoke;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isArrayBuffer = isArrayBuffer;
        lodash.isArrayLike = isArrayLike;
        lodash.isArrayLikeObject = isArrayLikeObject;
        lodash.isBoolean = isBoolean;
        lodash.isBuffer = isBuffer;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isEqualWith = isEqualWith;
        lodash.isError = isError;
        lodash.isFinite = isFinite2;
        lodash.isFunction = isFunction;
        lodash.isInteger = isInteger;
        lodash.isLength = isLength;
        lodash.isMap = isMap;
        lodash.isMatch = isMatch;
        lodash.isMatchWith = isMatchWith;
        lodash.isNaN = isNaN2;
        lodash.isNative = isNative;
        lodash.isNil = isNil;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isObjectLike = isObjectLike;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isSafeInteger = isSafeInteger;
        lodash.isSet = isSet;
        lodash.isString = isString;
        lodash.isSymbol = isSymbol;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.isWeakMap = isWeakMap;
        lodash.isWeakSet = isWeakSet;
        lodash.join = join;
        lodash.kebabCase = kebabCase;
        lodash.last = last;
        lodash.lastIndexOf = lastIndexOf;
        lodash.lowerCase = lowerCase;
        lodash.lowerFirst = lowerFirst;
        lodash.lt = lt;
        lodash.lte = lte;
        lodash.max = max;
        lodash.maxBy = maxBy;
        lodash.mean = mean;
        lodash.meanBy = meanBy;
        lodash.min = min;
        lodash.minBy = minBy;
        lodash.stubArray = stubArray;
        lodash.stubFalse = stubFalse;
        lodash.stubObject = stubObject;
        lodash.stubString = stubString;
        lodash.stubTrue = stubTrue;
        lodash.multiply = multiply;
        lodash.nth = nth;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padEnd = padEnd;
        lodash.padStart = padStart;
        lodash.parseInt = parseInt2;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.replace = replace;
        lodash.result = result;
        lodash.round = round;
        lodash.runInContext = runInContext2;
        lodash.sample = sample;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedIndexBy = sortedIndexBy;
        lodash.sortedIndexOf = sortedIndexOf;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.sortedLastIndexBy = sortedLastIndexBy;
        lodash.sortedLastIndexOf = sortedLastIndexOf;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.subtract = subtract;
        lodash.sum = sum;
        lodash.sumBy = sumBy;
        lodash.template = template;
        lodash.times = times;
        lodash.toFinite = toFinite;
        lodash.toInteger = toInteger;
        lodash.toLength = toLength;
        lodash.toLower = toLower;
        lodash.toNumber = toNumber;
        lodash.toSafeInteger = toSafeInteger;
        lodash.toString = toString;
        lodash.toUpper = toUpper;
        lodash.trim = trim;
        lodash.trimEnd = trimEnd;
        lodash.trimStart = trimStart;
        lodash.truncate = truncate;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.upperCase = upperCase;
        lodash.upperFirst = upperFirst;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.first = head;
        mixin(lodash, (function() {
          var source = {};
          baseForOwn(lodash, function(func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        })(), { "chain": false });
        lodash.VERSION = VERSION;
        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
          lodash[methodName].placeholder = lodash;
        });
        arrayEach(["drop", "take"], function(methodName, index) {
          LazyWrapper.prototype[methodName] = function(n) {
            n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
            var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
          var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach(["head", "last"], function(methodName, index) {
          var takeName = "take" + (index ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(["initial", "tail"], function(methodName, index) {
          var dropName = "drop" + (index ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
          if (typeof path == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end !== undefined2) {
            end = toInteger(end);
            result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
            var interceptor = function(value2) {
              var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
              return isTaker && chainAll ? result3[0] : result3;
            };
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + "";
            if (!hasOwnProperty.call(realNames, key)) {
              realNames[key] = [];
            }
            realNames[key].push({ "name": methodName, "func": lodashFunc });
          }
        });
        realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
          "name": "wrapper",
          "func": undefined2
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.at = wrapperAt;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.next = wrapperNext;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.first = lodash.prototype.head;
        if (symIterator) {
          lodash.prototype[symIterator] = wrapperToIterator;
        }
        return lodash;
      });
      var _4 = runInContext();
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        root._ = _4;
        define(function() {
          return _4;
        });
      } else if (freeModule) {
        (freeModule.exports = _4)._ = _4;
        freeExports._ = _4;
      } else {
        root._ = _4;
      }
    }).call(exports);
  }
});

// src/雌堕合欢宗/脚本/后端校验/validate.ts
var import_lodash = __toESM(require_lodash());

// src/雌堕合欢宗/界面/guards.ts
var \u653B\u7565\u94FE = ["\u767D\u82B7", "\u82CF\u82B8", "\u7EAA\u5170", "\u6C88\u6708\u79CB", "\u67F3\u7D20\u8863"];
var \u597D\u611F\u5EA6\u95E8\u69DB = {
  0: ["\u94C3\u94DB\u9879\u5708", "\u773C\u7F69", "\u7F9E\u7389\u5760", "\u542C\u547D\u8033\u5760", "\u6E29\u606F\u4E39", "\u51DD\u9999\u4E38", "\u4F53\u9999\u4E39", "\u5F00\u88C6\u88E4", "\u6742\u5F79\u670D"],
  30: [
    "\u53E3\u585E",
    "\u542B\u9999\u820C\u6263",
    "\u675F\u7F1A\u7EF3",
    "\u4E73\u5939\u94FE",
    "\u9189\u7738\u4E39",
    "\u67D4\u9AA8\u6563",
    "\u542C\u4EE4\u4E38",
    "\u7389\u808C\u4E39",
    "\u67D4\u8170\u4E39",
    "\u6DA6\u58F0\u4E39",
    "\u900F\u89C6\u7EB1\u8863",
    "\u900F\u89C6\u809A\u515C",
    "\u5F00\u80F8\u8966\u88D9",
    "\u809B\u585E",
    "\u4E73\u5934\u5939",
    "\u5E08\u59D0\u88C5",
    "\u836F\u5E90\u5236\u670D",
    "\u7ECF\u9601\u5236\u670D",
    "\u94C3\u94DB\u88C5"
  ],
  50: [
    "\u9634\u8482\u73AF",
    "\u8D1E\u64CD\u5E26",
    "\u4E73\u70ED\u4E39",
    "\u711A\u606F\u4E39",
    "\u7F04\u6F6E\u4E39",
    "\u5A9A\u4F53\u4E39",
    "\u56FA\u654F\u4E39",
    "\u542B\u60C5\u4E39",
    "\u955C\u7F9E\u4E39",
    "\u900F\u89C6\u7F57\u88D9",
    "\u5F00\u80CC\u957F\u88D9",
    "\u7ED1\u5E26\u88C5",
    "\u91D1\u5C5E\u8170\u94FE",
    "\u7EB1\u5E54\u88C5",
    "\u9634\u9053\u7403",
    "\u5C3E\u5DF4\u585E",
    "\u7275\u819D\u7389\u6263"
  ],
  70: ["\u6DEB\u7EB9", "\u5B50\u5BAB\u542C\u6F6E\u5760", "\u4E73\u6CC9\u5F15", "\u663E\u60C5\u4E39", "\u68A6\u6F6E\u4E38", "\u4E71\u8109\u4E39", "\u50AC\u4E73\u4E39", "\u50AC\u60C5\u4E39", "\u7F9E\u9608\u4E39", "\u9F9F\u7532\u7F1A\u8863", "\u540A\u5E26\u675F\u7F1A\u88D9", "\u91D1\u5C5E\u94FE\u8863", "\u91D1\u5C5E\u80F8\u7F69", "\u6DEB\u7EB9\u7ED8\u8863", "\u7B26\u6587\u809A\u515C", "\u82B1\u74E3\u8863"],
  90: ["\u547D\u94C3\u9501\u5589\u73AF", "\u7167\u5FC3\u7F1A\u9B42\u7D22", "\u83B2\u5370\u7981\u5951\u9489", "\u638C\u5FC3\u7275\u4E1D\u6212", "\u5F52\u4E3B\u7389\u724C", "\u5408\u6B22\u9501\u9B42\u94C3", "\u7167\u6B32\u4E39", "\u5851\u5F62\u4E39", "\u638C\u95E8\u793C\u670D"]
};
function checkItemThreshold(npc\u597D\u611F\u5EA6, \u9053\u5177\u540D\u79F0) {
  const thresholds = Object.keys(\u597D\u611F\u5EA6\u95E8\u69DB).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (npc\u597D\u611F\u5EA6 >= threshold) {
      if (\u597D\u611F\u5EA6\u95E8\u69DB[threshold].includes(\u9053\u5177\u540D\u79F0)) {
        return true;
      }
    }
  }
  return false;
}
function calculate\u653B\u7565\u503C\u589E\u91CF(\u57FA\u7840\u503C, \u597D\u611F\u5EA6) {
  return Math.floor(\u57FA\u7840\u503C * \u597D\u611F\u5EA6 / 50);
}
function getCurrentNpc(npcStates) {
  for (const npc of \u653B\u7565\u94FE) {
    if (npcStates[npc]?.\u72B6\u6001 !== "\u5DF2\u5B8C\u6210") {
      return npc;
    }
  }
  return null;
}
function canIncrease\u653B\u7565\u503C(npcName, currentNpc, \u597D\u611F\u5EA6) {
  if (\u597D\u611F\u5EA6 < 30) return false;
  return npcName === currentNpc;
}
function getP2\u5165\u573A\u65E5\u8BFE(data) {
  const scene = data.\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F || data.\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587?.\u5730\u70B9 || "";
  const time = data.\u7CFB\u7EDF.\u65F6\u8FB0;
  if (scene.includes("\u9634\u9633\u6C60") || time === "\u9149\u65F6") {
    return { \u65E5\u8BFE: "\u9634\u9633\u6C60\u9A8C\u8EAB", \u652F\u914D\u8005: "\u6C88\u6708\u79CB", \u5F85\u6267\u884C\u65E5\u8BFE: ["\u9A8C\u8EAB", "\u767B\u8BB0", "\u725D\u5370\u5524\u9192"] };
  }
  if (time === "\u6668\u65F6") {
    return { \u65E5\u8BFE: "\u6668\u8BFE\u70B9\u540D", \u652F\u914D\u8005: "\u7EAA\u5170", \u5F85\u6267\u884C\u65E5\u8BFE: ["\u70B9\u540D", "\u9A8C\u8EAB", "\u725D\u5370\u5524\u9192"] };
  }
  if (time === "\u5348\u65F6") {
    return { \u65E5\u8BFE: "\u6267\u4E8B\u767B\u8BB0", \u652F\u914D\u8005: "\u7EAA\u5170", \u5F85\u6267\u884C\u65E5\u8BFE: ["\u767B\u8BB0", "\u95EE\u5951", "\u670D\u4ECE\u590D\u6838"] };
  }
  return { \u65E5\u8BFE: "\u5BDD\u524D\u590D\u547D", \u652F\u914D\u8005: "\u67F3\u7D20\u8863", \u5F85\u6267\u884C\u65E5\u8BFE: ["\u590D\u547D", "\u725D\u5370\u590D\u6838", "\u5BDD\u5F79\u5019\u547D"] };
}
function initializePhase2(data) {
  data.\u7CFB\u7EDF.\u9636\u6BB5 = "\u725D\u5974\u671F";
  data.\u7CFB\u7EDF.\u7075\u77F3 = 0;
  const p2Entry = getP2\u5165\u573A\u65E5\u8BFE(data);
  const currentDay = data.\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001?.\u5F53\u524D\u65E5 ?? 1;
  const currentTime = data.\u7CFB\u7EDF.\u65F6\u8FB0 ?? "\u6668\u65F6";
  const entrySummary = `\u725D\u5974\u671F\u5165\u573A\uFF1A${p2Entry.\u65E5\u8BFE}\uFF0C\u725D\u5370\u5F00\u59CB\u63A5\u7BA1\u65E5\u8BFE\u3002`;
  data.\u725D\u5974.\u5165\u573A\u65E5 = data.\u725D\u5974.\u5165\u573A\u65E5 || currentDay;
  data.\u725D\u5974.\u5F53\u524D\u65E5\u8BFE = data.\u725D\u5974.\u5F53\u524D\u65E5\u8BFE && data.\u725D\u5974.\u5F53\u524D\u65E5\u8BFE !== "\u5019\u547D" ? data.\u725D\u5974.\u5F53\u524D\u65E5\u8BFE : p2Entry.\u65E5\u8BFE;
  data.\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005 = data.\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005 || p2Entry.\u652F\u914D\u8005;
  data.\u725D\u5974.\u5F53\u524D\u547D\u4EE4 = data.\u725D\u5974.\u5F53\u524D\u547D\u4EE4 || "\u8DEA\u5019\u725D\u5370\u70B9\u540D";
  data.\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6 = Math.max(data.\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6 ?? 0, 45);
  data.\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570 ??= 0;
  data.\u725D\u5974.\u5F85\u6267\u884C\u65E5\u8BFE = data.\u725D\u5974.\u5F85\u6267\u884C\u65E5\u8BFE?.length ? data.\u725D\u5974.\u5F85\u6267\u884C\u65E5\u8BFE : p2Entry.\u5F85\u6267\u884C\u65E5\u8BFE;
  data.\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97 = data.\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97 || entrySummary;
  data.\u725D\u5974.\u8C03\u6559\u8BB0\u5F55 = [
    ...(data.\u725D\u5974.\u8C03\u6559\u8BB0\u5F55 ?? []).slice(-9),
    {
      id: `p2_entry_${currentDay}_${currentTime}`,
      \u65F6\u8FB0: currentTime,
      \u652F\u914D\u8005: p2Entry.\u652F\u914D\u8005,
      \u6458\u8981: entrySummary,
      \u7F9E\u540D\u7B49\u7EA7: "\u5FAE\u95FB"
    }
  ];
  if (p2Entry.\u652F\u914D\u8005) {
    data.\u725D\u5974.\u4E0A\u6B21\u652F\u914D\u8005 = p2Entry.\u652F\u914D\u8005;
    data.\u725D\u5974.\u652F\u914D\u6B21\u6570[p2Entry.\u652F\u914D\u8005] = data.\u725D\u5974.\u652F\u914D\u6B21\u6570[p2Entry.\u652F\u914D\u8005] ?? 0;
  }
  const \u62E5\u6709\u5217\u8868 = Object.entries(data.\u9053\u5177.\u62E5\u6709).filter(([_4, count]) => count > 0).map(([name]) => name);
  for (const target of Object.keys(data.\u9053\u5177.\u88C5\u5907)) {
    data.\u9053\u5177.\u88C5\u5907[target] = [];
  }
  if (data.\u9053\u5177.\u88C5\u5907["\u73A9\u5BB6"].length > 0) return;
  const shuffled = \u62E5\u6709\u5217\u8868.sort(() => Math.random() - 0.5);
  const toEquip = shuffled.slice(0, 5);
  data.\u9053\u5177.\u88C5\u5907["\u73A9\u5BB6"] = toEquip;
}

// src/雌堕合欢宗/界面/data/items.ts
var NSFW\u9053\u5177 = [
  { \u540D\u79F0: "\u94C3\u94DB\u9879\u5708", \u663E\u793A\u540D: "\u542C\u94C3\u9888\u73AF", \u4EF7\u683C: 500, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u542C\u547D\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9888\u9879", \u7F9E\u803B\u89E6\u53D1: ["\u94C3\u58F0\u6CC4\u9732", "\u88AB\u70B9\u540D", "\u5FEB\u6B65", "\u4F4E\u5934\u884C\u793C"], AI\u77ED\u63D0\u793A: "\u7EC6\u94C3\u8D34\u5728\u9888\u4FA7\uFF0C\u8D8A\u60F3\u7AEF\u4F4F\u4EEA\u6001\uFF0C\u94C3\u58F0\u8D8A\u4F1A\u66FF\u5979\u6CC4\u9732\u52A8\u4F5C\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6234\u5728\u8116\u9888\u4E0A\u7684\u7EC6\u73AF\uFF0C\u5782\u7740\u5C0F\u94C3\u3002\u8D70\u8DEF\u3001\u4F4E\u5934\u3001\u88AB\u558A\u540D\u5B57\u65F6\u90FD\u4F1A\u8F7B\u54CD\uFF0C\u8BA9\u65C1\u4EBA\u77E5\u9053\u5979\u8EAB\u4E0A\u88AB\u5B89\u4E86\u4E1C\u897F\u3002", \u6548\u679C: "\u8BA9\u9888\u9879\u6210\u4E3A\u53EF\u88AB\u542C\u89C1\u7684\u7F9E\u803B\u6807\u8BB0\uFF0C\u884C\u52A8\u548C\u60C5\u7EEA\u6CE2\u52A8\u66F4\u5BB9\u6613\u66B4\u9732\u3002" },
  { \u540D\u79F0: "\u773C\u7F69", \u663E\u793A\u540D: "\u906E\u7075\u7EE1\u773C", \u4EF7\u683C: 500, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u906E\u611F\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u7075\u8BC6", \u7F9E\u803B\u89E6\u53D1: ["\u770B\u4E0D\u89C1\u8DEF", "\u88AB\u7275\u5F15", "\u542C\u89C1\u811A\u6B65", "\u88AB\u65C1\u89C2"], AI\u77ED\u63D0\u793A: "\u7EE1\u5E26\u906E\u4F4F\u89C6\u7EBF\uFF0C\u5374\u653E\u5927\u8033\u8FB9\u547C\u5438\u3001\u8863\u6599\u6469\u64E6\u548C\u65C1\u4EBA\u7684\u6CE8\u89C6\u611F\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u8986\u5728\u773C\u4E0A\u7684\u8584\u7EE1\uFF0C\u4F1A\u906E\u4F4F\u89C6\u7EBF\uFF0C\u8BA9\u5979\u53EA\u80FD\u9760\u58F0\u97F3\u548C\u7075\u8BC6\u5224\u65AD\u5468\u56F4\u3002\u88AB\u4EBA\u770B\u7740\u5374\u770B\u4E0D\u56DE\u53BB\uFF0C\u4F1A\u66F4\u5BB9\u6613\u614C\u3002", \u6548\u679C: "\u906E\u853D\u89C6\u89C9\u5E76\u653E\u5927\u88AB\u6CE8\u89C6\u611F\uFF0C\u9002\u5408\u516C\u5F00\u6216\u534A\u79C1\u5BC6\u573A\u666F\u5236\u9020\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u53E3\u585E", \u663E\u793A\u540D: "\u7F04\u58F0\u7389\u679A", \u4EF7\u683C: 800, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u7F04\u53E3\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u53E3\u820C", \u7F9E\u803B\u89E6\u53D1: ["\u8FA9\u89E3\u5931\u8D25", "\u53E3\u9F7F\u542B\u6DF7", "\u88AB\u8BE2\u95EE", "\u53EA\u80FD\u70B9\u5934"], AI\u77ED\u63D0\u793A: "\u7389\u679A\u538B\u4F4F\u820C\u9762\uFF0C\u8BA9\u5979\u4E0D\u80FD\u5B8C\u6574\u8FA9\u89E3\uFF0C\u53EA\u80FD\u7528\u773C\u795E\u548C\u542B\u6DF7\u58F0\u97F3\u56DE\u5E94\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u542B\u5728\u53E3\u4E2D\u7684\u5C0F\u7389\u679A\uFF0C\u4F1A\u538B\u4F4F\u820C\u5934\uFF0C\u8BA9\u8BF4\u8BDD\u53D8\u542B\u6DF7\u3002\u8D8A\u60F3\u89E3\u91CA\u81EA\u5DF1\u4E3A\u4F55\u4F69\u7740\u7981\u5668\uFF0C\u8D8A\u89E3\u91CA\u4E0D\u6E05\u3002", \u6548\u679C: "\u8BA9\u53E3\u820C\u53D8\u6210\u7F9E\u803B\u90E8\u4F4D\uFF0C\u9650\u5236\u5B8C\u6574\u8BED\u8A00\u8868\u8FBE\u3002" },
  { \u540D\u79F0: "\u7F9E\u7389\u5760", \u663E\u793A\u540D: "\u663E\u7F9E\u7389\u5760", \u4EF7\u683C: 650, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u663E\u60C5\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u5FC3\u53E3", \u7F9E\u803B\u89E6\u53D1: ["\u5FC3\u8DF3\u52A0\u5FEB", "\u88AB\u6CE8\u89C6", "\u6492\u8C0E", "\u516C\u5F00\u573A\u666F"], AI\u77ED\u63D0\u793A: "\u7389\u5760\u8D34\u8FD1\u5FC3\u53E3\uFF0C\u5FC3\u7EEA\u4E00\u4E71\u5C31\u6CDB\u7C89\uFF0C\u8BA9\u7F9E\u610F\u53D8\u6210\u770B\u5F97\u89C1\u7684\u989C\u8272\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6302\u5728\u5FC3\u53E3\u7684\u5C0F\u7389\u5760\uFF0C\u4F1A\u968F\u5FC3\u8DF3\u548C\u7F9E\u610F\u53D8\u8272\u3002\u5979\u8D8A\u60F3\u88C5\u4F5C\u65E0\u4E8B\uFF0C\u7389\u8272\u8D8A\u5BB9\u6613\u51FA\u5356\u5979\u3002", \u6548\u679C: "\u628A\u5FC3\u7EEA\u6CE2\u52A8\u5916\u663E\u4E3A\u7389\u8272\u53D8\u5316\uFF0C\u5F3A\u5316\u516C\u5F00\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u542B\u9999\u820C\u6263", \u663E\u793A\u540D: "\u542B\u9999\u820C\u6263", \u4EF7\u683C: 900, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u7F04\u53E3\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u53E3\u820C", \u7F9E\u803B\u89E6\u53D1: ["\u8BF4\u8BDD\u5E26\u9999", "\u820C\u5C16\u53D1\u9EBB", "\u88AB\u8FD1\u8DDD\u79BB\u542C\u89C1", "\u8FA9\u89E3"], AI\u77ED\u63D0\u793A: "\u820C\u6263\u8BA9\u5979\u8BF4\u8BDD\u5E26\u51FA\u6DE1\u9999\uFF0C\u820C\u5C16\u8D8A\u7D27\u5F20\u8D8A\u654F\u611F\uFF0C\u8FDE\u8FA9\u89E3\u90FD\u50CF\u5728\u6CC4\u9732\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6263\u5728\u820C\u5C16\u6216\u820C\u4E0B\u7684\u5C0F\u6CD5\u5668\uFF0C\u4F1A\u8BA9\u820C\u5934\u53D8\u654F\u611F\uFF0C\u8BF4\u8BDD\u65F6\u5E26\u51FA\u836F\u9999\u548C\u542B\u6DF7\u5C3E\u97F3\u3002", \u6548\u679C: "\u8BA9\u53E3\u820C\u6210\u4E3A\u53EF\u88AB\u55C5\u89C1\u548C\u542C\u89C1\u7684\u7F9E\u803B\u5668\u5B98\u3002" },
  { \u540D\u79F0: "\u542C\u547D\u8033\u5760", \u663E\u793A\u540D: "\u542C\u547D\u8033\u5760", \u4EF7\u683C: 700, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5668\u9636: "\u542F\u7F9E\u5668\u9636", \u7CFB\u5217: "\u542C\u547D\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u7075\u8BC6", \u7F9E\u803B\u89E6\u53D1: ["\u542C\u89C1\u547D\u4EE4", "\u88AB\u53EB\u540D\u5B57", "\u8033\u5C16\u53D1\u70ED", "\u65C1\u4EBA\u9760\u8FD1"], AI\u77ED\u63D0\u793A: "\u8033\u5760\u4F1A\u5728\u5979\u542C\u89C1\u547D\u4EE4\u6216\u540D\u5B57\u65F6\u8F7B\u9707\uFF0C\u50CF\u8EAB\u4F53\u5148\u66FF\u5979\u5E94\u4E86\u4E00\u58F0\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u5782\u5728\u8033\u4FA7\u7684\u5C0F\u5760\uFF0C\u542C\u89C1\u547D\u4EE4\u3001\u540D\u5B57\u6216\u66A7\u6627\u8BDD\u8BED\u65F6\u4F1A\u8F7B\u9707\uFF0C\u8BA9\u8033\u5C16\u53D1\u70ED\u3002", \u6548\u679C: "\u628A\u542C\u89C9\u548C\u670D\u4ECE\u53CD\u5E94\u7ED1\u5B9A\uFF0C\u9002\u5408\u547D\u4EE4\u3001\u70B9\u540D\u548C\u65C1\u542C\u573A\u666F\u3002" },
  { \u540D\u79F0: "\u675F\u7F1A\u7EF3", \u663E\u793A\u540D: "\u7F1A\u5F71\u7384\u7EF3", \u4EF7\u683C: 1e3, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u7275\u7F1A\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u8170\u8179", \u7F9E\u803B\u89E6\u53D1: ["\u884C\u793C", "\u62AC\u624B", "\u8F6C\u8EAB", "\u59FF\u6001\u88AB\u7275\u5F15"], AI\u77ED\u63D0\u793A: "\u7384\u7EF3\u4E0D\u5FC5\u7ED1\u6B7B\uFF0C\u53EA\u8981\u5979\u52A8\u4F5C\u504F\u79BB\uFF0C\u5C31\u4F1A\u7275\u4F4F\u8170\u80A2\u548C\u624B\u8155\u7EA0\u6B63\u59FF\u6001\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u7F20\u5728\u8170\u3001\u8155\u6216\u817F\u4FA7\u7684\u8F6F\u7EF3\uFF0C\u4F1A\u5728\u5979\u62AC\u624B\u3001\u8F6C\u8EAB\u3001\u884C\u793C\u65F6\u6536\u7D27\uFF0C\u628A\u59FF\u6001\u7275\u56DE\u6307\u5B9A\u89D2\u5EA6\u3002", \u6548\u679C: "\u9650\u5236\u52A8\u4F5C\u5E76\u5236\u9020\u88AB\u7275\u5F15\u611F\uFF0C\u8BA9\u65E5\u5E38\u52A8\u4F5C\u5E26\u4E0A\u8C03\u6559\u75D5\u8FF9\u3002" },
  { \u540D\u79F0: "\u4E73\u5939\u94FE", \u663E\u793A\u540D: "\u7275\u4E73\u94F6\u94FE", \u4EF7\u683C: 1200, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u4E73\u94C3\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u4E73\u9996", \u7F9E\u803B\u89E6\u53D1: ["\u62AC\u624B", "\u8863\u6599\u6469\u64E6", "\u8F6C\u8EAB", "\u94C3\u94FE\u8F7B\u54CD"], AI\u77ED\u63D0\u793A: "\u94F6\u94FE\u7275\u4F4F\u4E73\u9996\uFF0C\u62AC\u624B\u548C\u8F6C\u8EAB\u90FD\u4F1A\u62C9\u51FA\u7EC6\u54CD\uFF0C\u8BA9\u80F8\u524D\u53CD\u5E94\u96BE\u4EE5\u85CF\u4F4F\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u5939\u5728\u4E73\u5934\u4E0A\u7684\u7EC6\u94FE\u6CD5\u5668\uFF0C\u52A8\u4F5C\u8D8A\u5927\u62C9\u626F\u8D8A\u660E\u663E\uFF0C\u9694\u7740\u8863\u670D\u4E5F\u80FD\u770B\u51FA\u80F8\u524D\u4E0D\u81EA\u7136\u3002", \u6548\u679C: "\u8BA9\u4E73\u9996\u88AB\u52A8\u4F5C\u7275\u8FDE\uFF0C\u884C\u8D70\u548C\u62AC\u624B\u65F6\u6301\u7EED\u4EA7\u751F\u7F9E\u803B\u611F\u3002" },
  { \u540D\u79F0: "\u809B\u585E", \u663E\u793A\u540D: "\u540E\u5EAD\u83B2\u9489", \u4EF7\u683C: 800, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u540E\u5EAD\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u540E\u5EAD", \u7F9E\u803B\u89E6\u53D1: ["\u4E45\u5750", "\u5FEB\u6B65", "\u8DEA\u5750", "\u8D77\u8EAB"], AI\u77ED\u63D0\u793A: "\u83B2\u9489\u8BA9\u540E\u5EAD\u5728\u5750\u4E0B\u3001\u8D77\u8EAB\u3001\u884C\u793C\u65F6\u90FD\u88AB\u63D0\u9192\uFF0C\u8D8A\u7AEF\u5E84\u8D8A\u96BE\u5FFD\u7565\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u5B89\u5728\u540E\u5EAD\u7684\u5C0F\u578B\u6CD5\u5668\uFF0C\u4E0D\u4E00\u5B9A\u5916\u9732\uFF0C\u4F46\u5750\u4E0B\u3001\u8D77\u8EAB\u3001\u8DEA\u62DC\u65F6\u90FD\u4F1A\u8BA9\u5979\u610F\u8BC6\u5230\u90A3\u91CC\u88AB\u5360\u7740\u3002", \u6548\u679C: "\u8BA9\u540E\u5EAD\u5728\u65E5\u5E38\u52A8\u4F5C\u4E2D\u6301\u7EED\u4EA7\u751F\u5B58\u5728\u611F\u3002" },
  { \u540D\u79F0: "\u4E73\u5934\u5939", \u663E\u793A\u540D: "\u4E73\u94C3\u5BD2\u6263", \u4EF7\u683C: 600, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u4E73\u94C3\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u4E73\u9996", \u7F9E\u803B\u89E6\u53D1: ["\u5BD2\u610F", "\u8863\u6599\u6469\u64E6", "\u633A\u7ACB", "\u88AB\u6CE8\u89C6"], AI\u77ED\u63D0\u793A: "\u5BD2\u6263\u56FA\u5B9A\u4E73\u5C16\uFF0C\u8863\u6599\u4E00\u8E6D\u5C31\u8BA9\u80F8\u524D\u53CD\u5E94\u53D8\u5F97\u660E\u663E\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6263\u5728\u4E73\u5934\u4E0A\u7684\u5C0F\u5BD2\u6263\uFF0C\u4F1A\u8BA9\u4E73\u5934\u4FDD\u6301\u654F\u611F\uFF0C\u8863\u6599\u6469\u64E6\u3001\u51B7\u98CE\u6216\u65C1\u4EBA\u89C6\u7EBF\u90FD\u4F1A\u8BA9\u5979\u7D27\u5F20\u3002", \u6548\u679C: "\u5F3A\u5316\u4E73\u9996\u7684\u53EF\u89C1\u53CD\u5E94\uFF0C\u8BA9\u906E\u63A9\u672C\u8EAB\u53D8\u6210\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u5C3E\u5DF4\u585E", \u663E\u793A\u540D: "\u6B65\u6447\u5C3E\u5760", \u4EF7\u683C: 1200, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u540E\u5EAD\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u540E\u5EAD", \u7F9E\u803B\u89E6\u53D1: ["\u5C3E\u5760\u6447\u52A8", "\u56DE\u5934\u906E\u63A9", "\u516C\u5F00\u884C\u8D70", "\u65C1\u4EBA\u8BEF\u4F1A"], AI\u77ED\u63D0\u793A: "\u5C3E\u5760\u968F\u6B65\u6447\u52A8\uFF0C\u628A\u540E\u5EAD\u6CD5\u5668\u4F2A\u88C5\u6210\u88C5\u9970\uFF0C\u4E5F\u628A\u7F9E\u803B\u6446\u5230\u8EAB\u540E\u7ED9\u4EBA\u770B\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u63D2\u5165\u540E\u5EAD\u5E76\u5E26\u6709\u5C3E\u5760\u7684\u6CD5\u5668\uFF0C\u5916\u8868\u50CF\u8352\u5510\u88C5\u9970\uFF0C\u8D70\u8DEF\u65F6\u4F1A\u6447\uFF0C\u8BA9\u8EAB\u540E\u7684\u4EBA\u5F88\u96BE\u4E0D\u6CE8\u610F\u3002", \u6548\u679C: "\u628A\u540E\u5EAD\u5360\u6709\u611F\u8F6C\u5316\u4E3A\u53EF\u89C1\u88C5\u9970\uFF0C\u5F3A\u5316\u516C\u5F00\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u7275\u819D\u7389\u6263", \u663E\u793A\u540D: "\u7275\u819D\u7389\u6263", \u4EF7\u683C: 1400, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5668\u9636: "\u7F1A\u8EAB\u5668\u9636", \u7CFB\u5217: "\u7275\u7F1A\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u8170\u8179", \u7F9E\u803B\u89E6\u53D1: ["\u5E76\u819D", "\u6162\u6B65", "\u8DEA\u5750", "\u88AB\u50AC\u4FC3"], AI\u77ED\u63D0\u793A: "\u7389\u6263\u4F1A\u7275\u4F4F\u819D\u4FA7\u548C\u8170\u7EBF\uFF0C\u8BA9\u5979\u6B65\u5B50\u53D8\u5C0F\uFF0C\u59FF\u6001\u50CF\u88AB\u8BAD\u7EC3\u8FC7\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6263\u5728\u817F\u4FA7\u6216\u8170\u95F4\u7684\u5C0F\u7389\u6263\uFF0C\u4F1A\u9650\u5236\u6B65\u5E45\uFF0C\u8BA9\u5979\u8D70\u8DEF\u3001\u8DEA\u5750\u548C\u8D77\u8EAB\u90FD\u663E\u5F97\u4E0D\u81EA\u7136\u3002", \u6548\u679C: "\u6539\u53D8\u6B65\u6001\u4E0E\u5750\u59FF\uFF0C\u8BA9\u8EAB\u4F53\u50CF\u88AB\u89C4\u8BAD\u8FC7\u3002" },
  { \u540D\u79F0: "\u9634\u9053\u7403", \u663E\u793A\u540D: "\u7389\u6DA1\u542B\u73E0", \u4EF7\u683C: 1e3, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u9634\u6237\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9634\u6237", \u7F9E\u803B\u89E6\u53D1: ["\u884C\u8D70", "\u4E0A\u53F0\u9636", "\u8FD0\u6C14", "\u5939\u817F"], AI\u77ED\u63D0\u793A: "\u542B\u73E0\u85CF\u5728\u9634\u6237\u5185\uFF0C\u8D70\u52A8\u548C\u8FD0\u6C14\u65F6\u6EDA\u52A8\uFF0C\u8BA9\u5979\u5728\u516C\u5F00\u573A\u666F\u4E5F\u4E0D\u5F97\u4E0D\u610F\u8BC6\u5230\u90A3\u91CC\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u585E\u5165\u9634\u6237\u5185\u7684\u7389\u73E0\uFF0C\u4F1A\u5728\u8D70\u8DEF\u3001\u4E0A\u53F0\u9636\u3001\u8FD0\u529F\u65F6\u6EDA\u52A8\uFF0C\u903C\u5979\u65F6\u523B\u6CE8\u610F\u4E0B\u8EAB\u53CD\u5E94\u3002", \u6548\u679C: "\u628A\u9634\u6237\u8F6C\u5316\u6210\u968F\u52A8\u4F5C\u88AB\u89E6\u53D1\u7684\u7F9E\u803B\u5668\u5B98\u3002" },
  { \u540D\u79F0: "\u9634\u8482\u73AF", \u663E\u793A\u540D: "\u547D\u95E8\u6B32\u73AF", \u4EF7\u683C: 1500, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u9634\u8482\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9634\u8482", \u7F9E\u803B\u89E6\u53D1: ["\u5FC3\u7EEA\u6CE2\u52A8", "\u5939\u817F", "\u88AB\u547D\u4EE4", "\u8863\u6599\u538B\u8FEB"], AI\u77ED\u63D0\u793A: "\u6B32\u73AF\u6263\u4F4F\u547D\u95E8\u5C0F\u5904\uFF0C\u5FC3\u7EEA\u8D8A\u4E71\u8D8A\u53D1\u70ED\uFF0C\u8BA9\u5979\u77E5\u9053\u8EAB\u4F53\u5148\u4E71\u4E86\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6263\u5728\u9634\u8482\u9644\u8FD1\u7684\u5C0F\u73AF\uFF0C\u4F1A\u968F\u7F9E\u610F\u3001\u547D\u4EE4\u6216\u8863\u6599\u538B\u8FEB\u53D1\u70ED\uFF0C\u8BA9\u5979\u5F88\u96BE\u5047\u88C5\u65E0\u4E8B\u3002", \u6548\u679C: "\u8BA9\u9634\u8482\u6210\u4E3A\u5FC3\u7EEA\u89E6\u53D1\u70B9\uFF0C\u516C\u5F00\u573A\u666F\u4E2D\u4E5F\u80FD\u5236\u9020\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u8D1E\u64CD\u5E26", \u663E\u793A\u540D: "\u9501\u9634\u5BD2\u7389\u5E26", \u4EF7\u683C: 2e3, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u9634\u6237\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9634\u6237", \u7F9E\u803B\u89E6\u53D1: ["\u843D\u9501\u58F0", "\u8863\u4E0B\u51B7\u610F", "\u88AB\u68C0\u67E5", "\u884C\u793C"], AI\u77ED\u63D0\u793A: "\u5BD2\u7389\u5E26\u9501\u4F4F\u4E0B\u8EAB\uFF0C\u843D\u9501\u58F0\u50CF\u628A\u5979\u7684\u79C1\u5904\u4EA4\u7ED9\u522B\u4EBA\u4FDD\u7BA1\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u9501\u5728\u4E0B\u8EAB\u7684\u5BD2\u7389\u5E26\uFF0C\u4F1A\u906E\u4F4F\u5E76\u9650\u5236\u9634\u6237\u3002\u91D1\u5C5E\u548C\u7389\u7247\u8D34\u7740\u76AE\u80A4\uFF0C\u8D70\u52A8\u65F6\u6709\u6E05\u695A\u7684\u9501\u611F\u3002", \u6548\u679C: "\u628A\u9634\u6237\u53D8\u6210\u88AB\u5C01\u5B58\u548C\u88AB\u7BA1\u7406\u7684\u90E8\u4F4D\uFF0C\u5F3A\u8C03\u5F52\u5C5E\u4E0E\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u6DEB\u7EB9", \u663E\u793A\u540D: "\u566C\u5FC3\u6DEB\u7EB9", \u4EF7\u683C: 2500, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u663E\u60C5\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u808C\u80A4", \u7F9E\u803B\u89E6\u53D1: ["\u5FC3\u8DF3", "\u8C0E\u8A00", "\u88AB\u6CE8\u89C6", "\u6B32\u5FF5"], AI\u77ED\u63D0\u793A: "\u6DEB\u7EB9\u8D34\u7740\u808C\u80A4\u6E38\u8D70\uFF0C\u5FC3\u8DF3\u3001\u8C0E\u8A00\u548C\u7F9E\u610F\u90FD\u4F1A\u8BA9\u7EB9\u8DEF\u53D8\u4EAE\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u523B\u5728\u808C\u80A4\u4E0A\u7684\u50AC\u60C5\u7B26\u7EB9\uFF0C\u4F1A\u968F\u5FC3\u7EEA\u548C\u6B32\u5FF5\u6E38\u52A8\u53D1\u4EAE\uFF0C\u8BA9\u8EAB\u4F53\u53CD\u5E94\u76F4\u63A5\u5199\u5728\u76AE\u80A4\u4E0A\u3002", \u6548\u679C: "\u628A\u808C\u80A4\u53D8\u6210\u53EF\u8BFB\u7684\u60C5\u6B32\u5377\u9762\uFF0C\u9002\u5408\u5FC3\u97F3\u548C\u98CE\u58F0\u8054\u52A8\u3002" },
  { \u540D\u79F0: "\u5B50\u5BAB\u542C\u6F6E\u5760", \u663E\u793A\u540D: "\u542C\u6F6E\u5760", \u4EF7\u683C: 2600, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u4E39\u7530\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u4E39\u7530", \u7F9E\u803B\u89E6\u53D1: ["\u7075\u6C14\u6CE2\u52A8", "\u8179\u5185\u53D1\u70ED", "\u8FD0\u529F", "\u88AB\u9760\u8FD1"], AI\u77ED\u63D0\u793A: "\u542C\u6F6E\u5760\u7275\u52A8\u4E39\u7530\u6DF1\u5904\uFF0C\u7075\u6C14\u4E00\u4E71\uFF0C\u8179\u5185\u70ED\u6F6E\u5C31\u5148\u66FF\u5979\u56DE\u5E94\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u8D34\u5728\u5C0F\u8179\u6216\u4E39\u7530\u9644\u8FD1\u7684\u5760\u9970\uFF0C\u4F1A\u628A\u7075\u6C14\u6CE2\u52A8\u8F6C\u6210\u8179\u5185\u70ED\u610F\uFF0C\u8BA9\u5979\u5728\u8FD0\u529F\u65F6\u611F\u5230\u4E0B\u8179\u88AB\u7275\u52A8\u3002", \u6548\u679C: "\u628A\u4E39\u7530\u548C\u751F\u6B96\u7F9E\u803B\u8FDE\u63A5\u8D77\u6765\uFF0C\u8BA9\u4FEE\u70BC\u573A\u666F\u4E5F\u80FD\u89E6\u53D1\u8EAB\u4F53\u53CD\u5E94\u3002" },
  { \u540D\u79F0: "\u4E73\u6CC9\u5F15", \u663E\u793A\u540D: "\u4E73\u6CC9\u5F15", \u4EF7\u683C: 2400, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5668\u9636: "\u5316\u5668\u5668\u9636", \u7CFB\u5217: "\u4E73\u94C3\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u4E73\u623F", \u7F9E\u803B\u89E6\u53D1: ["\u80F8\u53E3\u53D1\u80C0", "\u8863\u6599\u6E7F\u75D5", "\u88AB\u95FB\u89C1", "\u60C5\u7EEA\u52A8\u6447"], AI\u77ED\u63D0\u793A: "\u4E73\u6CC9\u5F15\u8BA9\u80F8\u53E3\u53D8\u5F97\u5BB9\u6613\u53D1\u80C0\uFF0C\u8863\u6599\u4E0A\u7684\u7EC6\u5FAE\u6E7F\u75D5\u4F1A\u8BA9\u5979\u614C\u5FD9\u906E\u63A9\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u8D34\u5728\u4E73\u623F\u9644\u8FD1\u7684\u5F15\u6CC9\u6CD5\u5668\uFF0C\u4F1A\u8BA9\u80F8\u53E3\u66F4\u654F\u611F\uFF0C\u60C5\u7EEA\u6CE2\u52A8\u65F6\u53EF\u80FD\u51FA\u73B0\u80C0\u611F\u6216\u7EC6\u5FAE\u6E7F\u75D5\u3002", \u6548\u679C: "\u628A\u4E73\u623F\u8F6C\u5316\u6210\u4F1A\u88AB\u60C5\u7EEA\u548C\u7075\u6C14\u8BF1\u53D1\u7684\u7F9E\u803B\u5668\u5B98\u3002" },
  { \u540D\u79F0: "\u547D\u94C3\u9501\u5589\u73AF", \u663E\u793A\u540D: "\u547D\u94C3\u9501\u5589\u73AF", \u4EF7\u683C: 4200, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u5F52\u4E3B\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9888\u9879", \u7F9E\u803B\u89E6\u53D1: ["\u4E3B\u4EBA\u9760\u8FD1", "\u547D\u4EE4", "\u516C\u5F00\u8EAB\u4EFD", "\u94C3\u58F0\u5E94\u547D"], AI\u77ED\u63D0\u793A: "\u547D\u94C3\u4E0D\u662F\u666E\u901A\u94C3\u58F0\uFF0C\u800C\u50CF\u8EAB\u4EFD\u5BA3\u544A\uFF1B\u4E3B\u4EBA\u9760\u8FD1\u6216\u4E0B\u4EE4\u65F6\u4F1A\u8F7B\u54CD\u5E94\u547D\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u9501\u5728\u5589\u4E0B\u7684\u547D\u94C3\u73AF\uFF0C\u94C3\u58F0\u4F1A\u5BF9\u7279\u5B9A\u6C14\u606F\u6216\u547D\u4EE4\u4F5C\u51FA\u53CD\u5E94\uFF0C\u8BA9\u65C1\u4EBA\u770B\u51FA\u5979\u88AB\u8C01\u7275\u7740\u3002", \u6548\u679C: "\u628A\u9888\u9879\u3001\u58F0\u97F3\u548C\u5F52\u5C5E\u7ED1\u5B9A\uFF0C\u5F3A\u5316\u547D\u5951\u8EAB\u4EFD\u7F9E\u803B\u3002" },
  { \u540D\u79F0: "\u7167\u5FC3\u7F1A\u9B42\u7D22", \u663E\u793A\u540D: "\u7167\u5FC3\u7F1A\u9B42\u7D22", \u4EF7\u683C: 4500, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u7075\u8BC6\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u7075\u8BC6", \u7F9E\u803B\u89E6\u53D1: ["\u5FC3\u9632\u52A8\u6447", "\u7075\u8BC6\u805A\u7126", "\u5FC3\u97F3\u5916\u6CC4", "\u88AB\u8FFD\u95EE"], AI\u77ED\u63D0\u793A: "\u9B42\u7D22\u8D34\u7740\u7075\u8BC6\uFF0C\u5FC3\u9632\u4E00\u677E\u5C31\u663E\u51FA\u88C2\u9699\uFF0C\u50CF\u628A\u5FC3\u97F3\u9012\u5230\u4EBA\u624B\u8FB9\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u7F20\u5728\u7075\u8BC6\u8FB9\u7F18\u7684\u7EC6\u7D22\uFF0C\u4F1A\u5728\u5FC3\u9632\u52A8\u6447\u65F6\u53D1\u4EAE\uFF0C\u8BA9\u5979\u7684\u72B9\u8C6B\u3001\u7F9E\u610F\u548C\u5FC3\u97F3\u66F4\u5BB9\u6613\u88AB\u5BDF\u89C9\u3002", \u6548\u679C: "\u8BA9\u7075\u8BC6\u6210\u4E3A\u53EF\u88AB\u7275\u5F15\u548C\u7AA5\u770B\u7684\u7F9E\u803B\u90E8\u4F4D\u3002" },
  { \u540D\u79F0: "\u83B2\u5370\u7981\u5951\u9489", \u663E\u793A\u540D: "\u83B2\u5370\u7981\u5951\u9489", \u4EF7\u683C: 4800, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u5F52\u4E3B\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u9634\u6237", \u7F9E\u803B\u89E6\u53D1: ["\u83B2\u5370\u53D1\u70ED", "\u88AB\u8BA4\u4E3B", "\u5408\u6B22\u6C14\u606F", "\u516C\u5F00\u906E\u63A9"], AI\u77ED\u63D0\u793A: "\u7981\u5951\u9489\u8BA9\u79C1\u5904\u4E0E\u83B2\u5370\u76F8\u8FDE\uFF0C\u5408\u6B22\u6C14\u606F\u4E00\u8FD1\uFF0C\u5370\u7EB9\u4FBF\u50CF\u8BA4\u4E3B\u822C\u53D1\u70ED\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u5B89\u5728\u79C1\u5904\u9644\u8FD1\u7684\u83B2\u5370\u9489\uFF0C\u4F1A\u4E0E\u547D\u5951\u6C14\u606F\u547C\u5E94\u3002\u4E0D\u662F\u4E3A\u4E86\u906E\u63A9\uFF0C\u800C\u662F\u8BA9\u5979\u77E5\u9053\u90A3\u91CC\u5DF2\u7ECF\u88AB\u6807\u8BB0\u3002", \u6548\u679C: "\u628A\u9634\u6237\u548C\u547D\u5951\u5F52\u5C5E\u7ED1\u5B9A\uFF0C\u9002\u5408\u9AD8\u653B\u7565\u4E0E\u4ED9\u5974\u7EBF\u53D9\u4E8B\u3002" },
  { \u540D\u79F0: "\u638C\u5FC3\u7275\u4E1D\u6212", \u663E\u793A\u540D: "\u638C\u5FC3\u7275\u4E1D\u6212", \u4EF7\u683C: 4e3, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u7275\u7F1A\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u5FC3\u53E3", \u7F9E\u803B\u89E6\u53D1: ["\u7275\u4E1D\u611F\u5E94", "\u9760\u8FD1", "\u4F38\u624B", "\u88AB\u547D\u4EE4"], AI\u77ED\u63D0\u793A: "\u6212\u4E2D\u7275\u4E1D\u8FDE\u7740\u5FC3\u53E3\u548C\u6307\u5C16\uFF0C\u5979\u4F38\u624B\u65F6\u50CF\u4E3B\u52A8\u628A\u81EA\u5DF1\u9012\u8FC7\u53BB\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6234\u5728\u624B\u4E0A\u7684\u7EC6\u6212\uFF0C\u4F1A\u5728\u5979\u9760\u8FD1\u4E3B\u4EBA\u6216\u542C\u89C1\u547D\u4EE4\u65F6\u4EA7\u751F\u7275\u4E1D\u611F\uFF0C\u50CF\u6709\u4EBA\u4ECE\u5FC3\u53E3\u8F7B\u8F7B\u62C9\u4F4F\u5979\u3002", \u6548\u679C: "\u628A\u624B\u3001\u5FC3\u53E3\u548C\u670D\u4ECE\u53CD\u5E94\u8FDE\u63A5\u8D77\u6765\u3002" },
  { \u540D\u79F0: "\u5F52\u4E3B\u7389\u724C", \u663E\u793A\u540D: "\u5F52\u4E3B\u7389\u724C", \u4EF7\u683C: 3800, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u5F52\u4E3B\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u8EAB\u4EFD", \u7F9E\u803B\u89E6\u53D1: ["\u8170\u724C\u6643\u52A8", "\u88AB\u8BA4\u51FA", "\u767B\u8BB0", "\u516C\u5F00\u573A\u666F"], AI\u77ED\u63D0\u793A: "\u7389\u724C\u50CF\u5B97\u95E8\u8170\u724C\uFF0C\u5374\u5199\u7740\u5F52\u5C5E\uFF1B\u8D8A\u6B63\u5F0F\u7684\u573A\u5408\uFF0C\u8D8A\u50CF\u516C\u5F00\u7F9E\u8FB1\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6302\u5728\u8170\u95F4\u7684\u7389\u724C\uFF0C\u5916\u5F62\u50CF\u5B97\u95E8\u8170\u724C\uFF0C\u5B9E\u5219\u523B\u7740\u5F52\u5C5E\u7981\u7EB9\u3002\u516C\u5F00\u573A\u5408\u6700\u5BB9\u6613\u88AB\u770B\u89C1\u3002", \u6548\u679C: "\u628A\u8EAB\u4EFD\u672C\u8EAB\u53D8\u6210\u7F9E\u803B\u6807\u8BB0\uFF0C\u9002\u5408\u98CE\u58F0\u4F20\u64AD\u3002" },
  { \u540D\u79F0: "\u5408\u6B22\u9501\u9B42\u94C3", \u663E\u793A\u540D: "\u5408\u6B22\u9501\u9B42\u94C3", \u4EF7\u683C: 5e3, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5668\u9636: "\u547D\u5951\u5668\u9636", \u7CFB\u5217: "\u7075\u8BC6\u7CFB", \u4F5C\u7528\u90E8\u4F4D: "\u7075\u8BC6", \u7F9E\u803B\u89E6\u53D1: ["\u5FC3\u97F3\u56DE\u54CD", "\u98CE\u58F0\u4F20\u64AD", "\u547D\u5951\u9707\u52A8", "\u4E3B\u4EBA\u6CE8\u89C6"], AI\u77ED\u63D0\u793A: "\u9501\u9B42\u94C3\u4F1A\u628A\u5FC3\u97F3\u3001\u98CE\u58F0\u548C\u547D\u5951\u9707\u52A8\u8FDE\u5728\u4E00\u8D77\uFF0C\u8BA9\u5979\u7684\u5F52\u5C5E\u611F\u6709\u4E86\u58F0\u97F3\u3002", \u7C7B\u578B: "\u88C5\u5907", \u63CF\u8FF0: "\u6302\u5728\u547D\u5951\u6C14\u606F\u4E0A\u7684\u9B42\u94C3\uFF0C\u4E0D\u4E00\u5B9A\u4EBA\u4EBA\u770B\u5F97\u89C1\uFF0C\u4F46\u5FC3\u97F3\u52A8\u6447\u6216\u98CE\u58F0\u63D0\u53CA\u65F6\u4F1A\u8F7B\u54CD\u3002", \u6548\u679C: "\u628A\u7075\u8BC6\u3001\u98CE\u58F0\u548C\u5F52\u5C5E\u53D9\u4E8B\u8FDE\u63A5\u8D77\u6765\uFF0C\u4F5C\u4E3A\u540E\u671F\u7981\u5668\u951A\u70B9\u3002" }
];
var \u6C38\u4E45\u4E39\u836F = [
  { \u540D\u79F0: "\u6E29\u606F\u4E39", \u663E\u793A\u540D: "\u6E29\u606F\u4E39", \u4EF7\u683C: 600, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u4F2A\u88C5\u6210\u8C03\u606F\u836F\uFF0C\u8BA9\u4F4E\u597D\u611F NPC \u6709\u7406\u7531\u63A5\u53D7\u3002", \u5373\u65F6\u53CD\u5E94: "\u5589\u95F4\u5FAE\u6696\uFF0C\u4F53\u6E29\u4E0A\u6D6E\uFF0C\u8033\u6839\u6CDB\u7EA2\u3002", \u573A\u666F\u5916\u663E: "\u547C\u5438\u6BD4\u5E73\u65F6\u8F6F\uFF0C\u7AD9\u8FD1\u65F6\u80FD\u5BDF\u89C9\u70ED\u610F\u3002", \u957F\u671F\u75D5\u8FF9: "\u65E0\u957F\u671F\u75D5\u8FF9\uFF0C\u53EA\u7559\u4E0B\u90A3\u836F\u6709\u4E9B\u4E0D\u5BF9\u7684\u8BB0\u5FC6\u3002", AI\u77ED\u63D0\u793A: "\u8C03\u606F\u540D\u4E49\u4E0B\u8BA9\u4F53\u6E29\u548C\u547C\u5438\u5148\u6CC4\u9732\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u6E29\u517B\u6C14\u606F\uFF0C\u8BA9\u4F53\u6E29\u548C\u547C\u5438\u53D8\u5F97\u67D4\u8F6F\u3002", \u6548\u679C: "\u77ED\u65F6\u6539\u53D8NPC\u4F53\u6001\u53CD\u5E94" },
  { \u540D\u79F0: "\u51DD\u9999\u4E38", \u663E\u793A\u540D: "\u51DD\u9999\u4E38", \u4EF7\u683C: 700, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u77ED\u65F6\u95F4\u653E\u5927\u4F53\u9999\uFF0C\u5236\u9020\u9760\u8FD1\u548C\u88AB\u95FB\u89C1\u7684\u7F9E\u803B\u3002", \u5373\u65F6\u53CD\u5E94: "\u53D1\u95F4\u3001\u9888\u4FA7\u5148\u900F\u51FA\u9999\u6C14\u3002", \u573A\u666F\u5916\u663E: "\u7D27\u5F20\u3001\u51FA\u6C57\u3001\u9760\u8FD1\u65F6\u9999\u6C14\u53D8\u6D53\u3002", \u957F\u671F\u75D5\u8FF9: "\u65E0\u957F\u671F\u75D5\u8FF9\uFF0C\u53EF\u5F15\u51FA\u65C1\u4EBA\u8BEF\u4F1A\u3002", AI\u77ED\u63D0\u793A: "\u9999\u6C14\u5728\u516C\u5F00\u573A\u666F\u66FF\u5979\u66B4\u9732\u7D27\u5F20\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u51DD\u805A\u4F53\u9999\uFF0C\u8BA9\u9760\u8FD1\u65F6\u66F4\u5BB9\u6613\u88AB\u5BDF\u89C9\u3002", \u6548\u679C: "\u77ED\u65F6\u653E\u5927NPC\u4F53\u9999" },
  { \u540D\u79F0: "\u9189\u7738\u4E39", \u663E\u793A\u540D: "\u9189\u7738\u4E39", \u4EF7\u683C: 900, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u773C\u795E\u4E0E\u53CD\u5E94\u6162\u534A\u62CD\uFF0C\u65B9\u4FBF\u66A7\u6627\u3001\u8BEF\u8BFB\u548C\u5FC3\u97F3\u63A8\u8FDB\u3002", \u5373\u65F6\u53CD\u5E94: "\u773C\u5C3E\u5FAE\u7EA2\uFF0C\u89C6\u7EBF\u505C\u7559\u53D8\u4E45\u3002", \u573A\u666F\u5916\u663E: "\u88AB\u95EE\u8BDD\u65F6\u53CD\u5E94\u6162\uFF0C\u50CF\u85CF\u4E86\u5FC3\u4E8B\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u7559\u4E0B\u5FC3\u97F3\u6CE2\u52A8\u6216\u56DE\u907F\u884C\u4E3A\u3002", AI\u77ED\u63D0\u793A: "\u773C\u795E\u53D8\u8F6F\uFF0C\u8BA9\u5426\u8BA4\u663E\u5F97\u4E0D\u53EF\u9760\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u8F6F\u5316\u773C\u795E\u4E0E\u53CD\u5E94\uFF0C\u8BA9\u5FC3\u7EEA\u66F4\u5BB9\u6613\u9732\u51FA\u3002", \u6548\u679C: "\u77ED\u65F6\u6539\u53D8NPC\u601D\u7EF4\u53CD\u5E94" },
  { \u540D\u79F0: "\u67D4\u9AA8\u6563", \u663E\u793A\u540D: "\u67D4\u9AA8\u6563", \u4EF7\u683C: 1e3, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u6B65\u6001\u3001\u5750\u59FF\u3001\u884C\u793C\u66F4\u67D4\u987A\uFF0C\u516C\u5F00\u573A\u666F\u80FD\u770B\u51FA\u5F02\u6837\u3002", \u5373\u65F6\u53CD\u5E94: "\u7B4B\u9AA8\u677E\u8F6F\uFF0C\u8170\u819D\u53D1\u8F7B\u3002", \u573A\u666F\u5916\u663E: "\u884C\u793C\u3001\u8DEA\u5750\u3001\u8F6C\u8EAB\u65F6\u59FF\u6001\u8FC7\u5206\u987A\u4ECE\u3002", \u957F\u671F\u75D5\u8FF9: "\u65E0\u957F\u671F\u75D5\u8FF9\uFF0C\u53EF\u4F5C\u4E3A\u8C03\u6559\u9884\u6F14\u3002", AI\u77ED\u63D0\u793A: "\u59FF\u6001\u53D8\u8F6F\uFF0C\u8BA9\u5979\u50CF\u88AB\u8BAD\u7EC3\u8FC7\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u8F6F\u5316\u7B4B\u9AA8\uFF0C\u8BA9\u59FF\u6001\u53D8\u5F97\u67D4\u987A\u3002", \u6548\u679C: "\u77ED\u65F6\u6539\u53D8NPC\u59FF\u6001" },
  { \u540D\u79F0: "\u542C\u4EE4\u4E38", \u663E\u793A\u540D: "\u542C\u4EE4\u4E38", \u4EF7\u683C: 1100, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u540D\u5B57\u548C\u547D\u4EE4\u6210\u4E3A\u77ED\u671F\u89E6\u53D1\u6E90\u3002", \u5373\u65F6\u53CD\u5E94: "\u542C\u89C1\u540D\u5B57\u65F6\u5FC3\u53E3\u4E00\u9707\u3002", \u573A\u666F\u5916\u663E: "\u88AB\u70B9\u540D\u6216\u542C\u89C1\u547D\u4EE4\u4F1A\u5148\u505C\u987F\u518D\u56DE\u5E94\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u89E6\u53D1\u4E00\u6B21\u5FC3\u97F3\u6216\u7F9E\u803B\u56DE\u60F3\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u5148\u4E8E\u7406\u667A\u5E94\u547D\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u8BA9\u79F0\u547C\u4E0E\u547D\u4EE4\u66F4\u5BB9\u6613\u89E6\u52A8\u5FC3\u795E\u3002", \u6548\u679C: "\u77ED\u65F6\u5F3A\u5316NPC\u542C\u4EE4\u53CD\u5E94" },
  { \u540D\u79F0: "\u4E73\u70ED\u4E39", \u663E\u793A\u540D: "\u4E73\u70ED\u4E39", \u4EF7\u683C: 1300, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u6E29\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u80F8\u53E3\u77ED\u65F6\u654F\u611F\uFF0C\u5236\u9020\u906E\u63A9\u5931\u8D25\u3002", \u5373\u65F6\u53CD\u5E94: "\u80F8\u53E3\u53D1\u70ED\u53D1\u80C0\uFF0C\u8863\u6599\u5B58\u5728\u611F\u589E\u5F3A\u3002", \u573A\u666F\u5916\u663E: "\u62AC\u624B\u3001\u8F6C\u8EAB\u3001\u8863\u6599\u6469\u64E6\u65F6\u4F1A\u4E0D\u81EA\u7136\u3002", \u957F\u671F\u75D5\u8FF9: "\u65E0\u957F\u671F\u75D5\u8FF9\uFF0C\u4F46\u53EF\u7559\u4E0B\u88AB\u770B\u89C1\u7684\u7F9E\u803B\u3002", AI\u77ED\u63D0\u793A: "\u80F8\u524D\u53CD\u5E94\u77ED\u65F6\u53D8\u5F97\u96BE\u85CF\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u8BA9\u80F8\u524D\u70ED\u610F\u548C\u8863\u6599\u89E6\u611F\u53D8\u5F97\u660E\u663E\u3002", \u6548\u679C: "\u77ED\u65F6\u5F3A\u5316NPC\u80F8\u524D\u53CD\u5E94" },
  { \u540D\u79F0: "\u711A\u606F\u4E39", \u663E\u793A\u540D: "\u711A\u606F\u4E39", \u4EF7\u683C: 1700, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u5236\u9020\u5FC5\u987B\u5904\u7406\u7684\u8EAB\u4F53\u5371\u673A\uFF0C\u63A8\u52A8\u8C03\u606F\u3001\u62A4\u6CD5\u6216\u8EB2\u907F\u5267\u60C5\u3002", \u5373\u65F6\u53CD\u5E94: "\u706B\u610F\u4ECE\u4E39\u7530\u70E7\u8D77\uFF0C\u547C\u5438\u548C\u7075\u6C14\u7D0A\u4E71\u3002", \u573A\u666F\u5916\u663E: "\u5FC5\u987B\u627E\u5730\u65B9\u538B\u5236\u6216\u8BA9\u4EBA\u62A4\u6CD5\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u7559\u4E0B\u88AB\u8C01\u62A4\u6CD5\u3001\u5982\u4F55\u538B\u5236\u7684\u5173\u7CFB\u94A9\u5B50\u3002", AI\u77ED\u63D0\u793A: "\u836F\u706B\u903C\u5979\u8FDB\u5165\u5FC5\u987B\u5904\u7406\u7684\u5931\u8861\u573A\u666F\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u70C8\u6027\u836F\u706B\u6270\u52A8\u6C14\u606F\uFF0C\u903C\u51FA\u77ED\u65F6\u5931\u8861\u3002", \u6548\u679C: "\u5236\u9020NPC\u836F\u706B\u5931\u8861\u573A\u666F" },
  { \u540D\u79F0: "\u7F04\u6F6E\u4E39", \u663E\u793A\u540D: "\u7F04\u6F6E\u4E39", \u4EF7\u683C: 1800, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406/\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u5236\u9020\u89E3\u91CA\u5931\u8D25\u3001\u5BA1\u95EE\u5931\u8D25\u548C\u8BEF\u4F1A\u73B0\u573A\u3002", \u5373\u65F6\u53CD\u5E94: "\u820C\u6839\u53D1\u8F6F\uFF0C\u58F0\u97F3\u5E26\u6F6E\u610F\u3002", \u573A\u666F\u5916\u663E: "\u8D8A\u60F3\u8FA9\u89E3\u8D8A\u8BF4\u4E0D\u6E05\uFF0C\u5C3E\u97F3\u5931\u63A7\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u5F15\u51FA\u7EAA\u5170\u8BB0\u5F55\u3001\u82CF\u82B8\u5632\u5F04\u3001\u6C88\u6708\u79CB\u8FFD\u95EE\u3002", AI\u77ED\u63D0\u793A: "\u5979\u6CA1\u6709\u88AB\u78B0\uFF0C\u5374\u8FDE\u8BDD\u90FD\u5B88\u4E0D\u4F4F\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u6270\u4E71\u58F0\u97F3\u4E0E\u8FA9\u89E3\uFF0C\u8BA9\u89E3\u91CA\u53D8\u5F97\u53EF\u7591\u3002", \u6548\u679C: "\u5236\u9020NPC\u8A00\u8BED\u5931\u63A7\u573A\u666F" },
  { \u540D\u79F0: "\u663E\u60C5\u4E39", \u663E\u793A\u540D: "\u663E\u60C5\u4E39", \u4EF7\u683C: 2300, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u516C\u5F00\u6233\u7834\u6211\u6CA1\u4E8B\u7684\u4F2A\u88C5\u3002", \u5373\u65F6\u53CD\u5E94: "\u5FC3\u8DF3\u52A0\u5FEB\uFF0C\u808C\u80A4\u6CDB\u7C89\u3002", \u573A\u666F\u5916\u663E: "\u6492\u8C0E\u3001\u88AB\u70B9\u540D\u3001\u770B\u89C1\u73A9\u5BB6\u65F6\u9999\u6C14\u6216\u80A4\u8272\u5916\u663E\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u5F15\u53D1\u98CE\u58F0\u4F20\u64AD\u3002", AI\u77ED\u63D0\u793A: "\u5FC3\u8DF3\u548C\u7F9E\u610F\u4F1A\u5199\u5728\u8EAB\u4E0A\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u8BA9\u5FC3\u7EEA\u548C\u7F9E\u610F\u5916\u663E\u5728\u4F53\u6001\u4E0A\u3002", \u6548\u679C: "\u77ED\u65F6\u5916\u663ENPC\u60C5\u7EEA" },
  { \u540D\u79F0: "\u68A6\u6F6E\u4E38", \u663E\u793A\u540D: "\u68A6\u6F6E\u4E38", \u4EF7\u683C: 2400, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u5236\u9020\u9694\u591C\u540E\u679C\uFF0C\u63A8\u52A8\u6B21\u65E5\u5267\u60C5\u3002", \u5373\u65F6\u53CD\u5E94: "\u5F53\u591C\u68A6\u5883\u5931\u5B88\uFF0C\u9192\u540E\u5FC3\u795E\u4E0D\u7A33\u3002", \u573A\u666F\u5916\u663E: "\u6B21\u65E5\u56DE\u907F\u3001\u8FFD\u95EE\u3001\u5FC3\u97F3\u6CC4\u9732\u6216\u8EAB\u4F53\u4F59\u97F5\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u5199\u5165\u5FC3\u97F3\u56DE\u54CD\u6216\u98CE\u58F0\u7EBF\u7D22\u3002", AI\u77ED\u63D0\u793A: "\u68A6\u5883\u66FF\u5979\u627F\u8BA4\u767D\u65E5\u4E0D\u80AF\u627F\u8BA4\u7684\u4E8B\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u70C8\u6027\u5165\u68A6\u836F\uFF0C\u5F15\u51FA\u9694\u591C\u5FC3\u795E\u6CE2\u52A8\u3002", \u6548\u679C: "\u5236\u9020NPC\u68A6\u5883\u540E\u7EED" },
  { \u540D\u79F0: "\u4E71\u8109\u4E39", \u663E\u793A\u540D: "\u4E71\u8109\u4E39", \u4EF7\u683C: 2600, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u903C\u51FA\u62A4\u6CD5\u4F9D\u8D56\u548C\u5267\u60C5\u9009\u62E9\u3002", \u5373\u65F6\u53CD\u5E94: "\u7075\u6C14\u4E0E\u60C5\u6B32\u77ED\u65F6\u9519\u8109\u3002", \u573A\u666F\u5916\u663E: "\u5FC5\u987B\u6709\u4EBA\u62A4\u6CD5\uFF0C\u8C01\u6765\u62A4\u6CD5\u4F1A\u6539\u53D8\u5173\u7CFB\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u5F62\u6210\u6B20\u4E0B\u62A4\u6CD5\u56E0\u679C\u7684\u540E\u7EED\u94A9\u5B50\u3002", AI\u77ED\u63D0\u793A: "\u836F\u6027\u4E71\u8109\uFF0C\u8BA9\u4F9D\u8D56\u6210\u4E3A\u5267\u60C5\u9009\u62E9\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u77ED\u65F6\u9519\u4E71\u7075\u8109\uFF0C\u8BA9\u62A4\u6CD5\u4E0E\u4F9D\u8D56\u6210\u4E3A\u573A\u666F\u6838\u5FC3\u3002", \u6548\u679C: "\u5236\u9020NPC\u4E71\u8109\u62A4\u6CD5\u573A\u666F" },
  { \u540D\u79F0: "\u7167\u6B32\u4E39", \u663E\u793A\u540D: "\u7167\u6B32\u4E39", \u4EF7\u683C: 3200, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5206\u7C7B: "\u4E34\u65F6\u4E39\u836F", \u836F\u9636: "\u70C8\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4/\u547D\u5951", \u72B6\u6001\u95E8\u69DB: "\u5DF2\u5B8C\u6210", \u8BBE\u8BA1\u9A71\u52A8: "\u9AD8\u597D\u611F\u644A\u724C\u836F\uFF0C\u7167\u51FA\u88AB\u538B\u4E0B\u7684\u6B32\u5FF5\u548C\u5F52\u5C5E\u51B2\u52A8\u3002", \u5373\u65F6\u53CD\u5E94: "\u5FC3\u9632\u77ED\u6682\u53D8\u8584\uFF0C\u6B32\u5FF5\u548C\u7F9E\u610F\u4E0A\u6D6E\u3002", \u573A\u666F\u5916\u663E: "\u5979\u4F1A\u610F\u8BC6\u5230\u81EA\u5DF1\u5DF2\u7ECF\u53D8\u4E86\uFF0C\u53EF\u80FD\u8D28\u95EE\u6216\u6C89\u9ED8\u3002", \u957F\u671F\u75D5\u8FF9: "\u53EF\u63A8\u52A8\u547D\u5951\u524D\u591C\u3001\u653B\u7565\u5B8C\u6210\u524D\u644A\u724C\u3002", AI\u77ED\u63D0\u793A: "\u7167\u51FA\u5979\u4E0D\u613F\u627F\u8BA4\u7684\u5F52\u5C5E\u51B2\u52A8\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u9AD8\u9636\u70C8\u836F\uFF0C\u77ED\u65F6\u7167\u51FA\u5FC3\u5E95\u88AB\u538B\u4E0B\u7684\u51B2\u52A8\u3002", \u6548\u679C: "\u63A8\u52A8NPC\u547D\u5951\u644A\u724C\u573A\u666F" },
  { \u540D\u79F0: "\u4F53\u9999\u4E39", \u663E\u793A\u540D: "\u5F15\u9999\u4E39", \u4EF7\u683C: 1500, \u597D\u611F\u5EA6\u95E8\u69DB: 0, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001/\u793E\u4EA4", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u4F53\u9999\u6210\u4E3A\u957F\u671F\u8EAB\u4F53\u6807\u8BC6\u3002", \u5373\u65F6\u53CD\u5E94: "\u5589\u95F4\u5FAE\u751C\uFF0C\u9888\u4FA7\u548C\u53D1\u95F4\u900F\u9999\u3002", \u573A\u666F\u5916\u663E: "\u7D27\u5F20\u3001\u9760\u8FD1\u3001\u51FA\u6C57\u3001\u88AB\u70B9\u540D\u65F6\u9999\u6C14\u66F4\u660E\u663E\u3002", \u957F\u671F\u75D5\u8FF9: "\u4F53\u9999\u6210\u4E3A\u5979\u7684\u8EAB\u4F53\u6807\u7B7E\uFF0C\u53EF\u88AB\u65C1\u4EBA\u8BB0\u4F4F\u3002", AI\u77ED\u63D0\u793A: "\u4F53\u9999\u957F\u671F\u6807\u8BB0\u5979\u7684\u53D8\u5316\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u4F53\u9999\u6210\u4E3A\u957F\u671F\u8EAB\u4F53\u6807\u8BC6\u3002", \u6548\u679C: "NPC\u4F53\u9999\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u7389\u808C\u4E39", \u663E\u793A\u540D: "\u7559\u75D5\u4E39", \u4EF7\u683C: 1800, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u808C\u80A4\u66F4\u5BB9\u6613\u6CDB\u7EA2\u3001\u663E\u75D5\u3001\u7559\u5370\uFF0C\u8BA9\u8EAB\u4F53\u7559\u4E0B\u8BC1\u636E\u3002", \u5373\u65F6\u53CD\u5E94: "\u808C\u80A4\u53D1\u70ED\uFF0C\u89E6\u78B0\u5904\u7EA2\u5F97\u66F4\u4E45\u3002", \u573A\u666F\u5916\u663E: "\u88AB\u770B\u3001\u88AB\u68C0\u67E5\u3001\u8863\u6599\u6469\u64E6\u540E\u75D5\u8FF9\u66F4\u660E\u663E\u3002", \u957F\u671F\u75D5\u8FF9: "\u808C\u80A4\u6210\u4E3A\u7F9E\u803B\u8BC1\u636E\uFF0C\u4E0D\u6613\u5426\u8BA4\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u66F4\u5BB9\u6613\u7559\u4E0B\u88AB\u89E6\u53D1\u8FC7\u7684\u8BC1\u636E\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u6539\u53D8\u808C\u80A4\u663E\u75D5\u548C\u6CDB\u7EA2\u53CD\u5E94\u3002", \u6548\u679C: "NPC\u808C\u80A4\u7559\u75D5\u53CD\u5E94\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u67D4\u8170\u4E39", \u663E\u793A\u540D: "\u4F0F\u8EAB\u4E39", \u4EF7\u683C: 1900, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u8BBE\u8BA1\u9A71\u52A8: "\u6539\u53D8\u8170\u8179\u3001\u5750\u59FF\u3001\u8DEA\u59FF\u548C\u884C\u793C\u59FF\u6001\u3002", \u5373\u65F6\u53CD\u5E94: "\u8170\u8179\u53D1\u8F6F\uFF0C\u819D\u4FA7\u53D1\u8F7B\u3002", \u573A\u666F\u5916\u663E: "\u884C\u793C\u3001\u8DEA\u5750\u3001\u8F6C\u8EAB\u65F6\u81EA\u7136\u5E26\u51FA\u987A\u4ECE\u59FF\u6001\u3002", \u957F\u671F\u75D5\u8FF9: "\u65E5\u5E38\u52A8\u4F5C\u9010\u6E10\u50CF\u88AB\u89C4\u8BAD\u8FC7\u3002", AI\u77ED\u63D0\u793A: "\u8170\u819D\u59FF\u6001\u957F\u671F\u53D8\u5F97\u67D4\u987A\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u8F6F\u5316\u8170\u819D\u4E0E\u884C\u793C\u59FF\u6001\u3002", \u6548\u679C: "NPC\u59FF\u6001\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u6DA6\u58F0\u4E39", \u663E\u793A\u540D: "\u8F6F\u58F0\u4E39", \u4EF7\u683C: 1900, \u597D\u611F\u5EA6\u95E8\u69DB: 30, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4/\u793E\u4EA4", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u58F0\u97F3\u6210\u4E3A\u60C5\u7EEA\u548C\u987A\u4ECE\u7684\u6CC4\u9732\u53E3\u3002", \u5373\u65F6\u53CD\u5E94: "\u5589\u95F4\u6DA6\u70ED\uFF0C\u5C3E\u97F3\u53D8\u8F6F\u3002", \u573A\u666F\u5916\u663E: "\u5426\u8BA4\u3001\u8FA9\u89E3\u3001\u53EB\u4EBA\u540D\u5B57\u65F6\u4F1A\u5E26\u51FA\u66A7\u6627\u5C3E\u97F3\u3002", \u957F\u671F\u75D5\u8FF9: "\u58F0\u97F3\u88AB\u65C1\u4EBA\u8BB0\u4F4F\uFF0C\u5BB9\u6613\u5F15\u53D1\u8BEF\u4F1A\u3002", AI\u77ED\u63D0\u793A: "\u8BF4\u8BDD\u4E5F\u4F1A\u66FF\u5979\u6CC4\u9732\u5FC3\u7EEA\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u6539\u53D8\u58F0\u97F3\u5C3E\u97F3\u4E0E\u60C5\u7EEA\u6CC4\u9732\u3002", \u6548\u679C: "NPC\u58F0\u97F3\u53CD\u5E94\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u5A9A\u4F53\u4E39", \u663E\u793A\u540D: "\u9192\u89E6\u4E39", \u4EF7\u683C: 2200, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u65E7\u4E39\u91CD\u6784\uFF0C\u8BA9\u65E5\u5E38\u8863\u6599\u3001\u6E29\u5EA6\u3001\u89C6\u7EBF\u3001\u9760\u8FD1\u90FD\u80FD\u89E6\u53D1\u654F\u611F\u3002", \u5373\u65F6\u53CD\u5E94: "\u808C\u80A4\u548C\u795E\u7ECF\u50CF\u88AB\u5524\u9192\u3002", \u573A\u666F\u5916\u663E: "\u8863\u6599\u6469\u64E6\u3001\u9760\u8FD1\u3001\u88AB\u770B\u89C1\u90FD\u4F1A\u8BA9\u5979\u4E0D\u81EA\u7136\u3002", \u957F\u671F\u75D5\u8FF9: "\u8EAB\u4F53\u957F\u671F\u53D8\u5F97\u66F4\u5BB9\u6613\u88AB\u73AF\u5883\u89E6\u53D1\u3002", AI\u77ED\u63D0\u793A: "\u654F\u611F\u4ECE\u79C1\u5BC6\u573A\u666F\u6269\u5C55\u5230\u65E5\u5E38\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u8EAB\u4F53\u957F\u671F\u66F4\u5BB9\u6613\u88AB\u73AF\u5883\u89E6\u53D1\u3002", \u6548\u679C: "NPC\u8EAB\u4F53\u654F\u611F\u5EA6\u6C38\u4E45\u63D0\u5347" },
  { \u540D\u79F0: "\u56FA\u654F\u4E39", \u663E\u793A\u540D: "\u9501\u89E6\u4E39", \u4EF7\u683C: 2200, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u65E7\u4E39\u91CD\u6784\uFF0C\u56FA\u5B9A\u4E00\u5230\u4E24\u4E2A\u957F\u671F\u654F\u611F\u89E6\u53D1\u6E90\u3002", \u5373\u65F6\u53CD\u5E94: "\u67D0\u5904\u8EAB\u4F53\u53CD\u5E94\u88AB\u836F\u6027\u9501\u5B9A\u3002", \u573A\u666F\u5916\u663E: "\u9888\u4FA7\u3001\u4E73\u9996\u3001\u8170\u8179\u3001\u9634\u6237\u3001\u540E\u5EAD\u6216\u8033\u5C16\u6210\u4E3A\u5F31\u70B9\u3002", \u957F\u671F\u75D5\u8FF9: "\u654F\u611F\u70B9\u6210\u4E3A\u957F\u671F\u53D9\u4E8B\u951A\u70B9\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u5F62\u6210\u7A33\u5B9A\u7F9E\u803B\u89E6\u53D1\u6E90\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u56FA\u5B9A\u957F\u671F\u654F\u611F\u89E6\u53D1\u6E90\u3002", \u6548\u679C: "NPC\u654F\u611F\u70B9\u6C38\u4E45\u56FA\u5B9A" },
  { \u540D\u79F0: "\u542B\u60C5\u4E39", \u663E\u793A\u540D: "\u542B\u60C5\u4E39", \u4EF7\u683C: 2300, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u5634\u786C\u65F6\u795E\u6001\u5148\u80CC\u53DB\u5979\u3002", \u5373\u65F6\u53CD\u5E94: "\u773C\u795E\u6E7F\u8F6F\uFF0C\u547C\u5438\u53D8\u6162\u3002", \u573A\u666F\u5916\u663E: "\u8D8A\u60F3\u538B\u4F4F\u60C5\u7EEA\uFF0C\u773C\u795E\u548C\u8BED\u6C14\u8D8A\u6CC4\u9732\u3002", \u957F\u671F\u75D5\u8FF9: "\u5FC3\u97F3\u548C\u8868\u60C5\u66F4\u5BB9\u6613\u51FA\u5356\u5979\u3002", AI\u77ED\u63D0\u793A: "\u5426\u8BA4\u65F6\u773C\u795E\u5148\u4E71\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u8BA9\u773C\u795E\u4E0E\u8868\u60C5\u66F4\u5BB9\u6613\u6CC4\u9732\u5FC3\u7EEA\u3002", \u6548\u679C: "NPC\u795E\u6001\u53CD\u5E94\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u955C\u7F9E\u4E39", \u663E\u793A\u540D: "\u955C\u7F9E\u4E39", \u4EF7\u683C: 2400, \u597D\u611F\u5EA6\u95E8\u69DB: 50, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4/\u7F9E\u803B", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u5979\u88AB\u81EA\u5DF1\u7684\u53D8\u5316\u51FB\u4E2D\u3002", \u5373\u65F6\u53CD\u5E94: "\u770B\u89C1\u5012\u5F71\u65F6\u5FC3\u53E3\u53D1\u7D27\u3002", \u573A\u666F\u5916\u663E: "\u955C\u9762\u3001\u6C34\u9762\u3001\u7075\u8BC6\u5C4F\u5E55\u6216\u65C1\u4EBA\u76EE\u5149\u4F1A\u653E\u5927\u7F9E\u803B\u3002", \u957F\u671F\u75D5\u8FF9: "\u770B\u89C1\u81EA\u5DF1\u53D8\u4E86\u6210\u4E3A\u957F\u671F\u7F9E\u803B\u6E90\u3002", AI\u77ED\u63D0\u793A: "\u5979\u4F1A\u88AB\u81EA\u5DF1\u7684\u53D8\u5316\u53CD\u590D\u523A\u4E2D\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u8BA9\u5012\u5F71\u4E0E\u81EA\u6211\u5BDF\u89C9\u6210\u4E3A\u7F9E\u803B\u89E6\u53D1\u3002", \u6548\u679C: "NPC\u81EA\u6211\u7F9E\u803B\u53CD\u5E94\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u50AC\u4E73\u4E39", \u663E\u793A\u540D: "\u5F15\u6CC9\u4E39", \u4EF7\u683C: 2800, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u65E7\u4E39\u91CD\u6784\uFF0C\u8BA9\u4E73\u623F\u6210\u4E3A\u60C5\u7EEA\u3001\u7075\u6C14\u3001\u7F9E\u803B\u5916\u663E\u5668\u5B98\u3002", \u5373\u65F6\u53CD\u5E94: "\u80F8\u53E3\u53D1\u80C0\uFF0C\u4E73\u5C16\u53D1\u70ED\u3002", \u573A\u666F\u5916\u663E: "\u60C5\u7EEA\u3001\u7075\u6C14\u3001\u88AB\u6CE8\u89C6\u65F6\u80F8\u524D\u53CD\u5E94\u660E\u663E\u3002", \u957F\u671F\u75D5\u8FF9: "\u4E73\u623F\u6210\u4E3A\u957F\u671F\u5916\u663E\u5668\u5B98\u3002", AI\u77ED\u63D0\u793A: "\u80F8\u524D\u53CD\u5E94\u88AB\u836F\u6027\u957F\u671F\u5199\u5165\u8EAB\u4F53\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u80F8\u524D\u53CD\u5E94\u4E0E\u60C5\u7EEA\u7075\u6C14\u957F\u671F\u76F8\u8FDE\u3002", \u6548\u679C: "NPC\u6C38\u4E45\u6CCC\u4E73" },
  { \u540D\u79F0: "\u50AC\u60C5\u4E39", \u663E\u793A\u540D: "\u71C3\u6F6E\u4E39", \u4EF7\u683C: 2800, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u751F\u7406", \u8BBE\u8BA1\u9A71\u52A8: "\u65E7\u4E39\u91CD\u6784\uFF0C\u5F62\u6210\u5468\u671F\u6027\u6F6E\u70ED\u548C\u6B32\u5FF5\u6CE2\u52A8\u3002", \u5373\u65F6\u53CD\u5E94: "\u4E39\u7530\u70ED\u6F6E\u5468\u671F\u6027\u4E0A\u6D8C\u3002", \u573A\u666F\u5916\u663E: "\u5979\u80FD\u9884\u611F\u836F\u6F6E\uFF0C\u5374\u4E0D\u4E00\u5B9A\u80FD\u5B8C\u5168\u538B\u4F4F\u3002", \u957F\u671F\u75D5\u8FF9: "\u5468\u671F\u6027\u836F\u6F6E\u6210\u4E3A\u5267\u60C5\u65F6\u949F\u3002", AI\u77ED\u63D0\u793A: "\u6B32\u5FF5\u6CE2\u52A8\u4F1A\u5468\u671F\u6027\u627E\u4E0A\u5979\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u5F62\u6210\u957F\u671F\u5468\u671F\u6027\u6F6E\u70ED\u3002", \u6548\u679C: "NPC\u6C38\u4E45\u5904\u4E8E\u5468\u671F\u6027\u53D1\u60C5\u72B6\u6001" },
  { \u540D\u79F0: "\u7F9E\u9608\u4E39", \u663E\u793A\u540D: "\u964D\u7F9E\u4E39", \u4EF7\u683C: 3e3, \u597D\u611F\u5EA6\u95E8\u69DB: 70, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u8BBE\u8BA1\u9A71\u52A8: "\u6539\u5199\u7F9E\u803B\u9608\u503C\uFF0C\u8BA9\u88AB\u770B\u89C1\u3001\u88AB\u70B9\u540D\u3001\u88AB\u68C0\u67E5\u4E5F\u80FD\u89E6\u53D1\u8EAB\u4F53\u53CD\u5E94\u3002", \u5373\u65F6\u53CD\u5E94: "\u5FC3\u53E3\u53D1\u70ED\uFF0C\u7F9E\u610F\u6765\u5F97\u66F4\u5FEB\u3002", \u573A\u666F\u5916\u663E: "\u88AB\u5938\u5956\u3001\u8BEF\u4F1A\u3001\u68C0\u67E5\u65F6\u53CD\u5E94\u66F4\u5F3A\u3002", \u957F\u671F\u75D5\u8FF9: "\u7F9E\u803B\u548C\u8EAB\u4F53\u53CD\u5E94\u957F\u671F\u7ED1\u5B9A\u3002", AI\u77ED\u63D0\u793A: "\u7F9E\u803B\u9608\u503C\u88AB\u5408\u6B22\u5B97\u836F\u6027\u6539\u4F4E\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u957F\u671F\u964D\u4F4E\u7F9E\u803B\u9608\u503C\uFF0C\u8BA9\u516C\u5F00\u573A\u666F\u66F4\u6613\u89E6\u53D1\u53CD\u5E94\u3002", \u6548\u679C: "NPC\u7F9E\u803B\u9608\u503C\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u5851\u5F62\u4E39", \u663E\u793A\u540D: "\u7389\u9AA8\u5851\u5F62\u4E39", \u4EF7\u683C: 3800, \u597D\u611F\u5EA6\u95E8\u69DB: 90, \u5206\u7C7B: "\u6C38\u4E45\u4E39\u836F", \u836F\u9636: "\u6C38\u4E45\u836F", \u670D\u52A1\u5BF9\u8C61: "NPC", \u4F5C\u7528\u7EBF: "\u4F53\u6001/\u7EFC\u5408", \u8BBE\u8BA1\u9A71\u52A8: "\u65E7\u4E39\u91CD\u6784\uFF0C\u5FAE\u8C03\u4E73\u623F\u3001\u8170\u81C0\u3001\u808C\u80A4\u3001\u817F\u7EBF\uFF0C\u4F7F\u8EAB\u4F53\u66F4\u7B26\u5408\u5408\u6B22\u5B97\u5BA1\u7F8E\u548C\u8C03\u6559\u7528\u9014\u3002", \u5373\u65F6\u53CD\u5E94: "\u9AA8\u8089\u5FAE\u70ED\uFF0C\u7075\u6C14\u6CBF\u66F2\u7EBF\u6E38\u8D70\u3002", \u573A\u666F\u5916\u663E: "\u8EAB\u6BB5\u3001\u8863\u6599\u8D34\u5408\u3001\u6B65\u6001\u90FD\u51FA\u73B0\u957F\u671F\u53D8\u5316\u3002", \u957F\u671F\u75D5\u8FF9: "\u8EAB\u4F53\u66F2\u7EBF\u6210\u4E3A\u53EF\u89C1\u6539\u9020\u6210\u679C\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u88AB\u5851\u6210\u66F4\u9002\u5408\u5C55\u793A\u548C\u8C03\u6559\u7684\u5F62\u6001\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u670D\u7528\u540E\u8EAB\u4F53\u66F2\u7EBF\u4E0E\u4F53\u6001\u957F\u671F\u5FAE\u8C03\u3002", \u6548\u679C: "NPC\u8EAB\u4F53\u5F62\u72B6\u6C38\u4E45\u6539\u53D8" },
  { \u540D\u79F0: "\u5949\u8EAB\u4E39", \u663E\u793A\u540D: "\u5949\u8EAB\u4E39", \u4EF7\u683C: 4200, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u7EFC\u5408", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u4ED9\u5974\u57FA\u7840\u8C03\u5236", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u4ED9\u5974\u8EAB\u4F53\u9ED8\u8BA4\u628A\u4E3B\u4EBA\u9760\u8FD1\u548C\u547D\u4EE4\u89C6\u4F5C\u4F18\u5148\u4FE1\u53F7\u3002", \u8EAB\u4F53\u6539\u5199: "\u8EAB\u4F53\u9ED8\u8BA4\u628A\u4E3B\u4EBA\u9760\u8FD1\u548C\u547D\u4EE4\u89C6\u4F5C\u4F18\u5148\u4FE1\u53F7\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u629A\u89E6\u3001\u547D\u4EE4\u3001\u53EC\u5524\u66F4\u5BB9\u6613\u5F15\u53D1\u987A\u4ECE\u548C\u671F\u5F85\u3002", \u7F9E\u803B\u5916\u663E: "\u88AB\u70B9\u540D\u6216\u68C0\u67E5\u65F6\u53CD\u5E94\u6BD4\u666E\u901A\u4EBA\u66F4\u660E\u663E\u3002", \u957F\u671F\u73A9\u6CD5: "\u4F5C\u4E3A\u4ED9\u5974\u8EAB\u4F53\u91CD\u5199\u7684\u57FA\u7840\u951A\u70B9\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u628A\u53D6\u60A6\u4E3B\u4EBA\u5F53\u6210\u4F18\u5148\u53CD\u5E94\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u57FA\u7840\u8C03\u5236\u4E39\uFF0C\u8BA9\u8EAB\u4F53\u4F18\u5148\u56DE\u5E94\u4E3B\u4EBA\u3002", \u6548\u679C: "\u4ED9\u5974\u8EAB\u4F53\u57FA\u7840\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u4F8D\u5BDD\u6E29\u8EAB\u4E39", \u663E\u793A\u540D: "\u6E29\u8EAB\u4E39", \u4EF7\u683C: 4400, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u4F8D\u5BDD", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u6696\u8EAB\u3001\u5907\u5BDD", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u808C\u80A4\u3001\u4F53\u6E29\u3001\u547C\u5438\u66F4\u9002\u5408\u4EB2\u5BC6\u63A5\u89E6\u3002", \u8EAB\u4F53\u6539\u5199: "\u808C\u80A4\u3001\u4F53\u6E29\u3001\u547C\u5438\u66F4\u9002\u5408\u4EB2\u5BC6\u63A5\u89E6\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u4E3B\u4EBA\u9760\u8FD1\u65F6\u8EAB\u4F53\u50CF\u63D0\u524D\u88AB\u517B\u70ED\u3002", \u7F9E\u803B\u5916\u663E: "\u547C\u5438\u548C\u80A4\u8272\u4F1A\u66B4\u9732\u5979\u5DF2\u7ECF\u51C6\u5907\u597D\u3002", \u957F\u671F\u73A9\u6CD5: "\u4F8D\u5BDD\u3001\u53EC\u89C1\u3001\u591C\u95F4\u573A\u666F\u53CD\u590D\u5F15\u7528\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u4F53\u50CF\u63D0\u524D\u88AB\u517B\u70ED\uFF0C\u9002\u5408\u4F8D\u5BDD\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u6696\u8EAB\u5907\u5BDD\u4E39\uFF0C\u8BA9\u4F53\u6E29\u4E0E\u547C\u5438\u66F4\u5BB9\u6613\u56DE\u5E94\u53EC\u89C1\u3002", \u6548\u679C: "\u4ED9\u5974\u4F8D\u5BDD\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u7389\u9AA8\u9A6F\u5F62\u4E39", \u663E\u793A\u540D: "\u9A6F\u5F62\u4E39", \u4EF7\u683C: 4600, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u59FF\u52BF\u4E0E\u8EAB\u6BB5", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u8170\u81C0\u3001\u817F\u7EBF\u3001\u8DEA\u5750\u3001\u4F0F\u8EAB\u59FF\u6001\u66F4\u67D4\u987A\u3002", \u8EAB\u4F53\u6539\u5199: "\u8170\u81C0\u3001\u817F\u7EBF\u3001\u8DEA\u5750\u3001\u4F0F\u8EAB\u59FF\u6001\u66F4\u67D4\u987A\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u66F4\u5BB9\u6613\u6446\u51FA\u9002\u5408\u5C55\u793A\u3001\u670D\u4F8D\u548C\u6446\u5F04\u7684\u59FF\u6001\u3002", \u7F9E\u803B\u5916\u663E: "\u516C\u5F00\u884C\u793C\u6216\u8DEA\u5750\u65F6\u80FD\u770B\u51FA\u88AB\u8C03\u6559\u8FC7\u3002", \u957F\u671F\u73A9\u6CD5: "\u4E0E\u670D\u88C5\u3001\u7981\u5668\u3001\u68C0\u67E5\u573A\u666F\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u8EAB\u6BB5\u548C\u59FF\u52BF\u88AB\u8C03\u6210\u66F4\u6613\u6446\u5F04\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u9A6F\u5F62\u4E39\uFF0C\u8BA9\u8EAB\u6BB5\u4E0E\u59FF\u52BF\u66F4\u9002\u5408\u5C55\u793A\u548C\u670D\u4F8D\u3002", \u6548\u679C: "\u4ED9\u5974\u4F53\u6001\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u9999\u80CE\u5F52\u4E3B\u4E39", \u663E\u793A\u540D: "\u9999\u80CE\u4E39", \u4EF7\u683C: 4600, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u4F53\u6001", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u6C14\u5473\u5F52\u5C5E", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u4F53\u9999\u5E26\u4E0A\u4E3B\u4EBA\u6C14\u606F\u3002", \u8EAB\u4F53\u6539\u5199: "\u4F53\u9999\u5E26\u4E0A\u4E3B\u4EBA\u6C14\u606F\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u4EB2\u5BC6\u540E\u9999\u6C14\u66F4\u660E\u663E\uFF0C\u66F4\u50CF\u88AB\u6807\u8BB0\u3002", \u7F9E\u803B\u5916\u663E: "\u65C1\u4EBA\u80FD\u4ECE\u6C14\u5473\u5BDF\u89C9\u5979\u7684\u5F52\u5C5E\u3002", \u957F\u671F\u73A9\u6CD5: "\u98CE\u58F0\u3001\u65C1\u4EBA\u8BEF\u4F1A\u3001\u516C\u5F00\u7F9E\u803B\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u4F53\u9999\u5E26\u6709\u5F52\u5C5E\u6C14\u606F\uFF0C\u85CF\u4E0D\u5E72\u51C0\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u5F52\u4E3B\u9999\u4E39\uFF0C\u8BA9\u4F53\u9999\u5E26\u6709\u5F52\u5C5E\u75D5\u8FF9\u3002", \u6548\u679C: "\u4ED9\u5974\u4F53\u9999\u5F52\u5C5E\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u83B2\u4E73\u5316\u6CC9\u4E39", \u663E\u793A\u540D: "\u83B2\u4E73\u4E39", \u4EF7\u683C: 5e3, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u4E73\u623F", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u4E73\u623F\u53EF\u73A9\u4E50\u5316", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u4E73\u623F\u4E0E\u60C5\u7EEA\u3001\u547D\u4EE4\u3001\u7F9E\u803B\u3001\u7075\u6C14\u76F8\u8FDE\u3002", \u8EAB\u4F53\u6539\u5199: "\u4E73\u623F\u4E0E\u60C5\u7EEA\u3001\u547D\u4EE4\u3001\u7F9E\u803B\u3001\u7075\u6C14\u76F8\u8FDE\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u629A\u89E6\u3001\u547D\u4EE4\u6216\u6CE8\u89C6\u4F1A\u8BA9\u80F8\u524D\u53CD\u5E94\u66F4\u660E\u663E\u3002", \u7F9E\u803B\u5916\u663E: "\u80F8\u53E3\u53CD\u5E94\u6210\u4E3A\u906E\u63A9\u5931\u8D25\u7684\u6765\u6E90\u3002", \u957F\u671F\u73A9\u6CD5: "\u4E73\u623F\u6210\u4E3A\u957F\u671F\u53D6\u4E50\u70B9\u3002", AI\u77ED\u63D0\u793A: "\u4E73\u623F\u88AB\u6539\u5199\u6210\u60C5\u7EEA\u548C\u547D\u4EE4\u7684\u5916\u663E\u5668\u5B98\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u4E73\u623F\u6539\u5199\u4E39\uFF0C\u8BA9\u80F8\u524D\u53CD\u5E94\u957F\u671F\u670D\u52A1\u547D\u5951\u53D9\u4E8B\u3002", \u6548\u679C: "\u4ED9\u5974\u4E73\u623F\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u4E73\u5370\u542B\u7F9E\u4E39", \u663E\u793A\u540D: "\u4E73\u5370\u4E39", \u4EF7\u683C: 5e3, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u4E73\u623F", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u80F8\u524D\u7F9E\u803B\u5916\u663E", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u80F8\u524D\u6DE1\u5370\u968F\u547D\u5951\u53D1\u70ED\u3002", \u8EAB\u4F53\u6539\u5199: "\u4E73\u6655\u3001\u4E73\u5C16\u6216\u80F8\u524D\u6DE1\u5370\u968F\u547D\u5951\u53D1\u70ED\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u80F8\u524D\u5370\u8BB0\u53EF\u968F\u4EB2\u5BC6\u6216\u547D\u4EE4\u53D8\u5316\u3002", \u7F9E\u803B\u5916\u663E: "\u8863\u4E0B\u53D1\u70ED\u3001\u6E7F\u75D5\u3001\u906E\u63A9\u52A8\u4F5C\u66F4\u660E\u663E\u3002", \u957F\u671F\u73A9\u6CD5: "\u4E0E\u8584\u8863\u3001\u4E73\u94C3\u3001\u98CE\u58F0\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u80F8\u524D\u5370\u8BB0\u4F1A\u66FF\u5979\u6CC4\u9732\u7F9E\u610F\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u80F8\u524D\u5370\u8BB0\u4E39\uFF0C\u8BA9\u8863\u4E0B\u53CD\u5E94\u66F4\u5BB9\u6613\u5916\u663E\u3002", \u6548\u679C: "\u4ED9\u5974\u4E73\u5370\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u7389\u6237\u542C\u547D\u4E39", \u663E\u793A\u540D: "\u7389\u6237\u4E39", \u4EF7\u683C: 5400, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u9634\u6237", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u79C1\u5904\u547D\u4EE4\u53CD\u5E94", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u79C1\u5904\u5BF9\u4E3B\u4EBA\u58F0\u97F3\u3001\u6C14\u606F\u3001\u547D\u4EE4\u548C\u7F9E\u803B\u573A\u666F\u5F62\u6210\u53CD\u5E94\u3002", \u8EAB\u4F53\u6539\u5199: "\u9634\u6237\u5BF9\u4E3B\u4EBA\u58F0\u97F3\u3001\u6C14\u606F\u3001\u547D\u4EE4\u548C\u7F9E\u803B\u573A\u666F\u5F62\u6210\u53CD\u5E94\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u547D\u4EE4\u4E0D\u5FC5\u89E6\u78B0\u4E5F\u80FD\u5F15\u8D77\u79C1\u5904\u53CD\u5E94\u3002", \u7F9E\u803B\u5916\u663E: "\u5979\u5728\u516C\u5F00\u573A\u666F\u4E5F\u4F1A\u56E0\u58F0\u97F3\u6216\u6C14\u606F\u5939\u817F\u906E\u63A9\u3002", \u957F\u671F\u73A9\u6CD5: "\u540E\u671F\u547D\u4EE4\u3001\u68C0\u67E5\u3001\u7981\u5668\u8054\u52A8\u6838\u5FC3\u3002", AI\u77ED\u63D0\u793A: "\u79C1\u5904\u6210\u4E3A\u547D\u4EE4\u548C\u6C14\u606F\u7684\u89E6\u53D1\u5668\u5B98\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u79C1\u5904\u542C\u547D\u4E39\uFF0C\u8BA9\u547D\u4EE4\u548C\u6C14\u606F\u6210\u4E3A\u8EAB\u4F53\u89E6\u53D1\u3002", \u6548\u679C: "\u4ED9\u5974\u79C1\u5904\u547D\u4EE4\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u547D\u95E8\u5316\u4E39", \u663E\u793A\u540D: "\u5316\u95E8\u4E39", \u4EF7\u683C: 5600, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u9634\u6237", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u79C1\u5904\u529F\u80FD\u6539\u5199", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u79C1\u5BC6\u90E8\u4F4D\u88AB\u5B9A\u4E49\u4E3A\u5408\u6B22\u547D\u5951\u5668\u5B98\u3002", \u8EAB\u4F53\u6539\u5199: "\u79C1\u5BC6\u90E8\u4F4D\u88AB\u5B9A\u4E49\u4E3A\u5408\u6B22\u547D\u5951\u5668\u5B98\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u66F4\u5BB9\u6613\u88AB\u5524\u9192\u3001\u68C0\u67E5\u3001\u8C03\u6559\u548C\u73A9\u4E50\u3002", \u7F9E\u803B\u5916\u663E: "\u88AB\u63D0\u53CA\u3001\u88AB\u770B\u89C1\u3001\u88AB\u547D\u4EE4\u65F6\u8EAB\u4F53\u4F1A\u9732\u9985\u3002", \u957F\u671F\u73A9\u6CD5: "\u9AD8\u9636\u8EAB\u4F53\u53EF\u73A9\u4E50\u5316\u951A\u70B9\u3002", AI\u77ED\u63D0\u793A: "\u547D\u95E8\u88AB\u6539\u5199\u4E3A\u66F4\u6613\u89E6\u53D1\u7684\u5408\u6B22\u5668\u5B98\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u547D\u95E8\u6539\u5199\u4E39\uFF0C\u8BA9\u79C1\u5BC6\u90E8\u4F4D\u6210\u4E3A\u547D\u5951\u5668\u5B98\u3002", \u6548\u679C: "\u4ED9\u5974\u547D\u95E8\u529F\u80FD\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u540E\u5EAD\u517B\u83B2\u4E39", \u663E\u793A\u540D: "\u517B\u83B2\u4E39", \u4EF7\u683C: 5200, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u540E\u5EAD", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u540E\u5EAD\u8BAD\u7EC3", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u540E\u5EAD\u6210\u4E3A\u53EF\u957F\u671F\u8BAD\u7EC3\u3001\u53EF\u6807\u8BB0\u3001\u53EF\u88AB\u59FF\u6001\u63D0\u9192\u7684\u4ED9\u5974\u90E8\u4F4D\u3002", \u8EAB\u4F53\u6539\u5199: "\u540E\u5EAD\u6210\u4E3A\u53EF\u957F\u671F\u8BAD\u7EC3\u3001\u53EF\u6807\u8BB0\u3001\u53EF\u88AB\u59FF\u6001\u63D0\u9192\u7684\u4ED9\u5974\u90E8\u4F4D\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u5750\u4E0B\u3001\u8D77\u8EAB\u3001\u8DEA\u5750\u3001\u7981\u5668\u4F69\u6234\u66F4\u6709\u5B58\u5728\u611F\u3002", \u7F9E\u803B\u5916\u663E: "\u6B65\u6001\u3001\u5750\u59FF\u3001\u906E\u63A9\u52A8\u4F5C\u66B4\u9732\u8BAD\u7EC3\u75D5\u8FF9\u3002", \u957F\u671F\u73A9\u6CD5: "\u4E0E\u540E\u5EAD\u7981\u5668\u3001\u6B65\u6001\u7F9E\u803B\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u540E\u5EAD\u4E0D\u518D\u53EA\u662F\u79C1\u5BC6\u5904\uFF0C\u800C\u662F\u957F\u671F\u8BAD\u7EC3\u90E8\u4F4D\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u540E\u5EAD\u8BAD\u7EC3\u4E39\uFF0C\u8BA9\u5750\u59FF\u6B65\u6001\u7559\u4E0B\u957F\u671F\u75D5\u8FF9\u3002", \u6548\u679C: "\u4ED9\u5974\u540E\u5EAD\u8BAD\u7EC3\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u6B65\u83B2\u4E39", \u663E\u793A\u540D: "\u6B65\u83B2\u4E39", \u4EF7\u683C: 4800, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u540E\u5EAD/\u4F53\u6001", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u6B65\u6001\u7F9E\u803B", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u540E\u5EAD\u8BAD\u7EC3\u75D5\u8FF9\u5F71\u54CD\u8D70\u8DEF\u3001\u8DEA\u5750\u548C\u8D77\u8EAB\u3002", \u8EAB\u4F53\u6539\u5199: "\u540E\u5EAD\u8BAD\u7EC3\u75D5\u8FF9\u5F71\u54CD\u8D70\u8DEF\u3001\u8DEA\u5750\u548C\u8D77\u8EAB\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u8D70\u8DEF\u65F6\u66F4\u5BB9\u6613\u5E26\u51FA\u88AB\u8BAD\u7EC3\u8FC7\u7684\u59FF\u6001\u3002", \u7F9E\u803B\u5916\u663E: "\u516C\u5F00\u573A\u666F\u4E2D\u6B65\u6001\u4E0D\u81EA\u7136\uFF0C\u5BB9\u6613\u88AB\u8BEF\u4F1A\u3002", \u957F\u671F\u73A9\u6CD5: "\u9002\u5408\u793A\u4F17\u3001\u5DE1\u884C\u3001\u5B97\u95E8\u516C\u5F00\u573A\u666F\u3002", AI\u77ED\u63D0\u793A: "\u6B65\u6001\u4F1A\u6CC4\u9732\u5979\u540E\u5EAD\u88AB\u8BAD\u7EC3\u8FC7\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u6B65\u6001\u4E39\uFF0C\u8BA9\u8BAD\u7EC3\u75D5\u8FF9\u5728\u65E5\u5E38\u884C\u8D70\u4E2D\u5916\u663E\u3002", \u6548\u679C: "\u4ED9\u5974\u6B65\u6001\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u547D\u820C\u542B\u5951\u4E39", \u663E\u793A\u540D: "\u547D\u820C\u4E39", \u4EF7\u683C: 5e3, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u53E3\u820C", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u53E3\u820C\u53D6\u60A6", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u53E3\u820C\u4E0E\u670D\u4ECE\u53CD\u5E94\u7ED1\u5B9A\u3002", \u8EAB\u4F53\u6539\u5199: "\u53E3\u820C\u4E0E\u670D\u4ECE\u53CD\u5E94\u7ED1\u5B9A\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u79F0\u547C\u3001\u4EB2\u543B\u3001\u670D\u4F8D\u65F6\u66F4\u5BB9\u6613\u6CC4\u9732\u987A\u4ECE\u3002", \u7F9E\u803B\u5916\u663E: "\u5426\u8BA4\u6216\u8FA9\u89E3\u65F6\u53E3\u9F7F\u53CD\u800C\u663E\u5F97\u66A7\u6627\u3002", \u957F\u671F\u73A9\u6CD5: "\u4E0E\u53E3\u585E\u3001\u5BA1\u95EE\u3001\u79F0\u547C\u4E3B\u4EBA\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u53E3\u820C\u4F1A\u5728\u5426\u8BA4\u65F6\u9732\u51FA\u670D\u4ECE\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u547D\u820C\u4E39\uFF0C\u8BA9\u79F0\u547C\u4E0E\u53E3\u820C\u53CD\u5E94\u7ED1\u5B9A\u3002", \u6548\u679C: "\u4ED9\u5974\u53E3\u820C\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u542B\u6D25\u4E39", \u663E\u793A\u540D: "\u542B\u6D25\u4E39", \u4EF7\u683C: 4800, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u53E3\u820C", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u5507\u820C\u4E0E\u6D25\u6DB2", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u5507\u820C\u3001\u553E\u6DB2\u3001\u547C\u5438\u66F4\u9002\u5408\u4EB2\u5BC6\u670D\u4F8D\u3002", \u8EAB\u4F53\u6539\u5199: "\u5507\u820C\u3001\u553E\u6DB2\u3001\u547C\u5438\u66F4\u9002\u5408\u4EB2\u5BC6\u670D\u4F8D\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u9760\u8FD1\u3001\u8BF4\u8BDD\u3001\u670D\u4F8D\u65F6\u66F4\u6E7F\u8F6F\u66A7\u6627\u3002", \u7F9E\u803B\u5916\u663E: "\u516C\u5F00\u8BF4\u8BDD\u4E5F\u53EF\u80FD\u5E26\u51FA\u4E0D\u8BE5\u6709\u7684\u5C3E\u97F3\u3002", \u957F\u671F\u73A9\u6CD5: "\u53E3\u820C\u670D\u4F8D\u3001\u8FD1\u8DDD\u79BB\u5BF9\u8BDD\u3001\u98CE\u58F0\u8BEF\u4F1A\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u5507\u820C\u548C\u547C\u5438\u88AB\u8C03\u6210\u66F4\u9002\u5408\u670D\u4F8D\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u542B\u6D25\u4E39\uFF0C\u8BA9\u8FD1\u8DDD\u79BB\u5BF9\u8BDD\u548C\u547C\u5438\u66F4\u5BB9\u6613\u6CC4\u9732\u72B6\u6001\u3002", \u6548\u679C: "\u4ED9\u5974\u5507\u820C\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u542C\u4E3B\u4E39", \u663E\u793A\u540D: "\u542C\u4E3B\u4E39", \u4EF7\u683C: 5200, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u547D\u4EE4\u53CD\u5C04", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u4E3B\u4EBA\u547D\u4EE4\u6210\u4E3A\u5FC3\u795E\u548C\u8EAB\u4F53\u53CC\u91CD\u89E6\u53D1\u3002", \u8EAB\u4F53\u6539\u5199: "\u4E3B\u4EBA\u547D\u4EE4\u6210\u4E3A\u5FC3\u795E\u548C\u8EAB\u4F53\u53CC\u91CD\u89E6\u53D1\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u4E0D\u5FC5\u5F3A\u8FEB\u4E5F\u4F1A\u5148\u4E00\u6B65\u56DE\u5E94\u3002", \u7F9E\u803B\u5916\u663E: "\u88AB\u65C1\u4EBA\u542C\u89C1\u547D\u4EE4\u65F6\uFF0C\u5979\u7684\u53CD\u5E94\u4F1A\u66B4\u9732\u5173\u7CFB\u3002", \u957F\u671F\u73A9\u6CD5: "\u547D\u4EE4\u3001\u70B9\u540D\u3001\u5FC3\u97F3\u56DE\u54CD\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u547D\u4EE4\u4E00\u843D\uFF0C\u8EAB\u4F53\u548C\u5FC3\u97F3\u5148\u56DE\u5E94\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u542C\u4E3B\u4E39\uFF0C\u8BA9\u547D\u4EE4\u6210\u4E3A\u5FC3\u795E\u4E0E\u8EAB\u4F53\u89E6\u53D1\u6E90\u3002", \u6548\u679C: "\u4ED9\u5974\u547D\u4EE4\u53CD\u5C04\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u7F9E\u8D4F\u4E39", \u663E\u793A\u540D: "\u7F9E\u8D4F\u4E39", \u4EF7\u683C: 5200, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u601D\u7EF4", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u7F9E\u803B\u5956\u52B1\u5316", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u88AB\u770B\u89C1\u3001\u88AB\u70B9\u540D\u3001\u88AB\u68C0\u67E5\u548C\u88AB\u5938\u5956\u7ED1\u5B9A\u6210\u5956\u52B1\u3002", \u8EAB\u4F53\u6539\u5199: "\u7F9E\u803B\u4E0E\u671F\u5F85\u88AB\u836F\u6027\u91CD\u65B0\u7ED1\u5B9A\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u516C\u5F00\u7F9E\u803B\u9010\u6E10\u53D8\u6210\u590D\u6742\u671F\u5F85\u3002", \u7F9E\u803B\u5916\u663E: "\u5979\u4F1A\u5BF9\u88AB\u770B\u89C1\u4EA7\u751F\u7F9E\u803B\u548C\u671F\u5F85\u6DF7\u5408\u53CD\u5E94\u3002", \u957F\u671F\u73A9\u6CD5: "\u516C\u5F00\u7F9E\u803B\u8BAD\u7EC3\u3001\u98CE\u58F0\u3001\u793A\u4F17\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u7F9E\u803B\u88AB\u836F\u6027\u6539\u9020\u6210\u5956\u52B1\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u7F9E\u8D4F\u4E39\uFF0C\u8BA9\u516C\u5F00\u7F9E\u803B\u548C\u5956\u52B1\u611F\u957F\u671F\u7ED1\u5B9A\u3002", \u6548\u679C: "\u4ED9\u5974\u7F9E\u803B\u5956\u52B1\u53CD\u5E94\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u7275\u5FC3\u4E39", \u663E\u793A\u540D: "\u7275\u5FC3\u4E39", \u4EF7\u683C: 6e3, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u547D\u5951", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u4F9D\u8D56\u4E0E\u5B89\u629A", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u5FC3\u53E3\u4E0E\u4E3B\u4EBA\u6C14\u606F\u76F8\u8FDE\u3002", \u8EAB\u4F53\u6539\u5199: "\u5FC3\u53E3\u4E0E\u4E3B\u4EBA\u6C14\u606F\u76F8\u8FDE\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u8FDC\u79BB\u65F6\u7A7A\u843D\uFF0C\u9760\u8FD1\u65F6\u5B89\u5B9A\u53C8\u7F9E\u803B\u3002", \u7F9E\u803B\u5916\u663E: "\u65C1\u4EBA\u63D0\u5230\u4E3B\u4EBA\u4E5F\u53EF\u80FD\u8BA9\u5979\u5FC3\u53E3\u53D1\u70ED\u3002", \u957F\u671F\u73A9\u6CD5: "\u547D\u5951\u3001\u5FC3\u97F3\u3001\u68A6\u5883\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u5FC3\u53E3\u88AB\u4E3B\u4EBA\u6C14\u606F\u7275\u4F4F\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u7275\u5FC3\u4E39\uFF0C\u8BA9\u5FC3\u53E3\u4E0E\u4E3B\u4EBA\u6C14\u606F\u957F\u671F\u76F8\u8FDE\u3002", \u6548\u679C: "\u4ED9\u5974\u547D\u5951\u4F9D\u8D56\u6C38\u4E45\u6539\u5199" },
  { \u540D\u79F0: "\u5949\u540D\u4E39", \u663E\u793A\u540D: "\u5949\u540D\u4E39", \u4EF7\u683C: 6200, \u597D\u611F\u5EA6\u95E8\u69DB: 100, \u5206\u7C7B: "\u4ED9\u5974\u4E39", \u836F\u9636: "\u4ED9\u5974\u836F", \u670D\u52A1\u5BF9\u8C61: "\u4ED9\u5974", \u4F5C\u7528\u7EBF: "\u547D\u5951/\u793A\u4F17", \u72B6\u6001\u95E8\u69DB: "\u4ED9\u5974", \u670D\u52A1\u7528\u9014: "\u8EAB\u4EFD\u89E6\u53D1", \u8BBE\u8BA1\u9A71\u52A8: "\u8BA9\u5979\u7684\u540D\u5B57\u4E0E\u4E3B\u4EBA\u3001\u4ED9\u5974\u8EAB\u4EFD\u3001\u98CE\u58F0\u7ED1\u5B9A\u3002", \u8EAB\u4F53\u6539\u5199: "\u540D\u5B57\u4E0E\u4E3B\u4EBA\u3001\u4ED9\u5974\u8EAB\u4EFD\u3001\u98CE\u58F0\u7ED1\u5B9A\u3002", \u6027\u529F\u80FD\u53D8\u5316: "\u542C\u89C1\u540D\u5B57\u548C\u4E3B\u4EBA\u5E76\u5217\u65F6\u8EAB\u4F53\u6709\u53CD\u5E94\u3002", \u7F9E\u803B\u5916\u663E: "\u4F53\u9999\u3001\u59FF\u6001\u3001\u5FC3\u97F3\u6216\u5370\u8BB0\u4F1A\u66B4\u9732\u5F52\u5C5E\u3002", \u957F\u671F\u73A9\u6CD5: "\u98CE\u58F0\u3001\u516C\u5F00\u79F0\u547C\u3001\u8EAB\u4EFD\u7F9E\u803B\u8054\u52A8\u3002", AI\u77ED\u63D0\u793A: "\u540D\u5B57\u548C\u4E3B\u4EBA\u5E76\u5217\u65F6\uFF0C\u5979\u4F1A\u85CF\u4E0D\u4F4F\u5F52\u5C5E\u53CD\u5E94\u3002", \u7C7B\u578B: "\u6D88\u8017\u54C1", \u63CF\u8FF0: "\u4ED9\u5974\u5949\u540D\u4E39\uFF0C\u8BA9\u540D\u5B57\u4E0E\u5F52\u5C5E\u8EAB\u4EFD\u957F\u671F\u7ED1\u5B9A\u3002", \u6548\u679C: "\u4ED9\u5974\u8EAB\u4EFD\u89E6\u53D1\u6C38\u4E45\u6539\u5199" }
];
var \u7279\u6B8A\u9053\u5177 = [
  {
    \u540D\u79F0: "\u65F6\u95F4\u5EF6\u957F",
    \u663E\u793A\u540D: "\u65F6\u95F4\u5EF6\u957F",
    \u4EF7\u683C: 1e4,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7C7B\u578B: "\u6D88\u8017\u54C1",
    \u63CF\u8FF0: "\u589E\u52A0\u5269\u4F59\u5929\u6570\uFF0C\u6709\u66F4\u591A\u65F6\u95F4\u653B\u7565NPC",
    \u6548\u679C: "\u5269\u4F59\u5929\u6570\u589E\u52A0",
    AI\u77ED\u63D0\u793A: "\u8BA9\u73A9\u5BB6\u83B7\u5F97\u989D\u5916\u4FEE\u884C\u5929\u6570\uFF0C\u53EF\u5728\u88AB\u6B32\u6D77\u5B9A\u4F4D\u524D\u4E89\u53D6\u65F6\u95F4\u63A8\u8FDB\u672A\u7ADF\u5267\u60C5\u3002"
  },
  {
    \u540D\u79F0: "\u6539\u53D8\u9635\u6CD5",
    \u663E\u793A\u540D: "\u6539\u53D8\u9635\u6CD5",
    \u4EF7\u683C: 5e5,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7C7B\u578B: "\u6D88\u8017\u54C1",
    \u63CF\u8FF0: "\u6D88\u9664\u725D\u5974\u5371\u673A\uFF0C\u8FBE\u6210GOOD END\u771F\u7ED3\u5C40",
    \u6548\u679C: "\u89E6\u53D1GOOD END",
    AI\u77ED\u63D0\u793A: "\u73A9\u5BB6\u4E0E\u67F3\u7D20\u8863\u5171\u540C\u6539\u5199\u5B97\u95E8\u6838\u5FC3\u9635\u6CD5\uFF0C\u6B32\u6D77\u6838\u5FC3\u7184\u706D\u3001\u7384\u5A9A\u4ED9\u5974\u53CD\u5411\u540C\u5316\u5B8C\u6210\uFF0C\u8FDB\u5165 GOOD END\u3002"
  },
  {
    \u540D\u79F0: "\u6B32\u6D77\u906E\u853D\u7B26",
    \u663E\u793A\u540D: "\u6B32\u6D77\u906E\u853D\u7B26",
    \u4EF7\u683C: 8e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7C7B\u578B: "\u6D88\u8017\u54C1",
    \u63CF\u8FF0: "\u9752\u4E91\u5B97\u9057\u6563\u7684\u6C14\u606F\u906E\u853D\u7B26\u7B93\u3002\u4F7F\u7528\u540E\u77ED\u65F6\u95F4\u5185\u4E5D\u5929\u9A6D\u5974\u8BC0\u4E0D\u4F1A\u5411\u6B32\u6D77\u6838\u5FC3\u91CA\u653E\u6C14\u606F\uFF0C\u67F3\u7D20\u8863\u65E0\u6CD5\u501F\u6B64\u5012\u8BA1\u65F6\u5B9A\u4F4D\u73A9\u5BB6\u3002",
    \u6548\u679C: "\u4F7F\u7528\u65F6\u77ED\u65F6\u906E\u853D\u6C14\u606F\uFF0C\u6B32\u6D77\u5012\u8BA1\u65F6\u4E0D\u524D\u8FDB",
    AI\u77ED\u63D0\u793A: "\u73A9\u5BB6\u77ED\u6682\u906E\u853D\u4E5D\u5929\u9A6D\u5974\u8BC0\u7684\u6C14\u606F\uFF0C\u6B32\u6D77\u6838\u5FC3\u6682\u65F6\u5931\u55C5\uFF1B\u73A9\u5BB6\u53EF\u5728\u6B64\u7A97\u53E3\u5185\u653E\u5FC3 NSFW \u800C\u4E0D\u88AB\u6B32\u6D77\u8BB0\u5F55\u3002"
  },
  {
    \u540D\u79F0: "\u6B32\u6D77\u56DE\u58F0",
    \u663E\u793A\u540D: "\u6B32\u6D77\u56DE\u58F0",
    \u4EF7\u683C: 3e4,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7C7B\u578B: "\u6D88\u8017\u54C1",
    \u63CF\u8FF0: "\u4E00\u679A\u51B7\u50F5\u7684\u9752\u94DC\u6B8B\u949F\u3002\u8D34\u5728\u9634\u9633\u6C60\u9635\u773C\u4E0A\u77ED\u6682\u63A5\u901A\u6B32\u6D77\u6838\u5FC3\uFF0C\u542C\u89C1\u9547\u538B\u5728\u5185\u7684\u9752\u4E91\u9053\u4EBA\u6B8B\u5B58\u610F\u8BC6\u3002",
    \u6548\u679C: "\u4E00\u6B21\u6027\u4E8B\u4EF6\uFF1A\u73A9\u5BB6\u77ED\u6682\u63A5\u901A\u6B32\u6D77\u6838\u5FC3\uFF0C\u542C\u89C1\u9752\u4E91\u9053\u4EBA\u6B8B\u5B58\u610F\u8BC6",
    AI\u77ED\u63D0\u793A: "\u73A9\u5BB6\u77ED\u6682\u63A5\u901A\u6B32\u6D77\u6838\u5FC3\u3001\u542C\u89C1\u9752\u4E91\u9053\u4EBA\u6B8B\u5B58\u610F\u8BC6\uFF1B\u4ED6\u53EF\u80FD\u590D\u4EC7\u3001\u6C42\u6551\u3001\u51B7\u6F20\u6216\u63ED\u793A\u73A9\u5BB6\u81EA\u8EAB\u56E0\u679C\u6839\u6E90\uFF0C\u662F\u4E16\u754C\u771F\u76F8\u63ED\u793A\u7EA7\u5267\u60C5\u7206\u70B9\u3002"
  },
  {
    \u540D\u79F0: "\u6295\u6B32\u94A5",
    \u663E\u793A\u540D: "\u6295\u6B32\u94A5",
    \u4EF7\u683C: 1e5,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7C7B\u578B: "\u6D88\u8017\u54C1",
    \u63CF\u8FF0: "\u4E00\u67C4\u6C89\u7538\u7538\u7684\u9752\u94DC\u94A5\u5319\uFF0C\u523B\u6709\u5408\u6B22\u5B97\u6295\u6B32\u4EEA\u8F68\u3002\u4E3B\u52A8\u6FC0\u6D3B\u540E\u73A9\u5BB6\u6C14\u606F\u5C06\u9AA4\u7136\u66B4\u9732\uFF0C\u88AB\u6B32\u6D77\u6838\u5FC3\u7CBE\u786E\u5B9A\u4F4D\u2014\u2014\u67F3\u7D20\u8863\u4F1A\u7ACB\u5373\u4F9D\u725D\u5974\u8BC0\u4EEA\u8F68\u5C06\u73A9\u5BB6\u6295\u5165\u9634\u9633\u6C60\u3002",
    \u6548\u679C: "\u4E00\u6B21\u6027\u4E8B\u4EF6\uFF1A\u73A9\u5BB6\u4E3B\u52A8\u6FC0\u6D3B\u6C14\u606F\u8BA9\u6B32\u6D77\u6838\u5FC3\u5B9A\u4F4D\u81EA\u5DF1\uFF0C\u89E6\u53D1\u67F3\u7D20\u8863\u6295\u9634\u9633\u6C60\u4EEA\u8F68\u8FDB\u5165\u725D\u5974\u671F BAD END",
    AI\u77ED\u63D0\u793A: "\u73A9\u5BB6\u4E3B\u52A8\u6FC0\u6D3B\u6C14\u606F\uFF0C\u8BA9\u6B32\u6D77\u6838\u5FC3\u5B9A\u4F4D\u81EA\u5DF1\uFF1B\u67F3\u7D20\u8863\u4F9D\u4EEA\u8F68\u5C06\u73A9\u5BB6\u6295\u5165\u9634\u9633\u6C60\u7C89\u788E\u7EC3\u9633\u8BC0\u3001\u5F3A\u704C\u725D\u5974\u8BC0\uFF0C\u76F4\u63A5\u8FDB\u5165\u725D\u5974\u671F BAD END\u3002\u8FD9\u662F\u73A9\u5BB6\u4E3B\u52A8\u9009\u62E9\u7684\u547D\u8FD0\u3002"
  }
];
var \u725D\u5974\u9053\u5177 = [
  {
    \u540D\u79F0: "\u725D\u5370",
    \u4EF7\u683C: 3e3,
    \u7C7B\u578B: "\u88C5\u5907",
    \u63CF\u8FF0: "\u523B\u5728\u725D\u5974\u8EAB\u4E0A\u7684\u4E3B\u4EBA\u6807\u8BB0\uFF0C\u91D1\u8272\u7B26\u6587\u707C\u70ED",
    \u6548\u679C: "\u88C5\u5907\u540E\u5815\u843D\u5EA6\u589E\u901F+15%",
    \u725D\u5974\u4E13\u5C5E: true
  },
  {
    \u540D\u79F0: "\u725D\u73AF",
    \u4EF7\u683C: 2500,
    \u7C7B\u578B: "\u88C5\u5907",
    \u63CF\u8FF0: "\u7A7F\u8FC7\u8EAB\u4F53\u7684\u94F6\u8272\u73AF\u94FE\uFF0C\u51B0\u51C9\u800C\u654F\u611F",
    \u6548\u679C: "\u88C5\u5907\u540E\u89E3\u9501\u7279\u6B8A\u6539\u9020\u884C\u4E3A\u5E76\u63D0\u5347\u654F\u611F\u5EA6",
    \u725D\u5974\u4E13\u5C5E: true
  },
  {
    \u540D\u79F0: "\u725D\u94C3",
    \u4EF7\u683C: 2e3,
    \u7C7B\u578B: "\u88C5\u5907",
    \u63CF\u8FF0: "\u6302\u5728\u725D\u5974\u8EAB\u4E0A\u7684\u5C0F\u94C3\u94DB\uFF0C\u6BCF\u4E00\u6B65\u90FD\u4F1A\u53D1\u51FA\u58F0\u54CD",
    \u6548\u679C: "\u88C5\u5907\u540E\u589E\u52A0\u7F9E\u803B\u611F\u5E76\u5F71\u54CDNPC\u884C\u4E3A\u6A21\u5F0F",
    \u725D\u5974\u4E13\u5C5E: true
  },
  {
    \u540D\u79F0: "\u725D\u94FE",
    \u4EF7\u683C: 3500,
    \u7C7B\u578B: "\u88C5\u5907",
    \u63CF\u8FF0: "\u675F\u7F1A\u725D\u5974\u7684\u7EC6\u94FE\uFF0C\u53EF\u6536\u7D27\u6216\u653E\u677E",
    \u6548\u679C: "\u88C5\u5907\u540E\u9650\u5236\u6216\u89E3\u9501\u7279\u5B9A\u52A8\u4F5C\uFF0C\u63A7\u5236\u884C\u4E3A\u8FB9\u754C",
    \u725D\u5974\u4E13\u5C5E: true
  }
];
var \u6240\u6709\u9053\u5177 = [...NSFW\u9053\u5177, ...\u6C38\u4E45\u4E39\u836F, ...\u7279\u6B8A\u9053\u5177, ...\u725D\u5974\u9053\u5177];
var \u725D\u5974\u671F\u53EF\u7528\u9053\u5177 = \u725D\u5974\u9053\u5177.map((i) => i.\u540D\u79F0);

// src/雌堕合欢宗/界面/data/outfits.ts
var \u670D\u88C5\u5143\u6570\u636E = {
  \u6742\u5F79\u670D: { \u663E\u793A\u540D: "\u7D20\u9EBB\u5916\u95E8\u8863", \u697C\u5C42: "\u51E1\u8863\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u7C97\u9EBB\u65E7\u8863\u538B\u4F4F\u8EAB\u5F62\uFF0C\u4ECD\u50CF\u672A\u8131\u5916\u95E8\u8EAB\u4EFD\u3002" },
  \u5F00\u88C6\u88E4: { \u663E\u793A\u540D: "\u88C2\u88FE\u542F\u7F9E\u88E4", \u697C\u5C42: "\u51E1\u8863\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u8863\u88FE\u6697\u85CF\u7F3A\u53E3\uFF0C\u884C\u52A8\u95F4\u66B4\u9732\u98CE\u9669\u589E\u52A0\u3002" },
  \u5E08\u59D0\u88C5: { \u663E\u793A\u540D: "\u7EDB\u7EB1\u6B32\u6388\u88F3", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u5E08\u59D0\u5236\u5F0F\u88AB\u6539\u88C1\uFF0C\u7AEF\u5E84\u4E0E\u66A7\u6627\u5E76\u5B58\u3002" },
  \u836F\u5E90\u5236\u670D: { \u663E\u793A\u540D: "\u836F\u9999\u8D34\u6C57\u8863", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u836F\u9999\u4E0E\u4F53\u6E29\u6DF7\u5408\uFF0C\u8863\u6599\u5BB9\u6613\u8D34\u80A4\u3002" },
  \u7ECF\u9601\u5236\u670D: { \u663E\u793A\u540D: "\u58A8\u9999\u534A\u63A9\u88F3", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u58A8\u9999\u538B\u4F4F\u4F53\u9999\uFF0C\u8863\u895F\u534A\u63A9\u3002" },
  \u900F\u89C6\u7EB1\u8863: { \u663E\u793A\u540D: "\u6708\u6D8E\u900F\u9AA8\u7EB1", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u8584\u7EB1\u5982\u6708\u6D8E\u8986\u8EAB\uFF0C\u706F\u4E0B\u663E\u51FA\u7075\u6C14\u8F6E\u5ED3\u3002" },
  \u900F\u89C6\u809A\u515C: { \u663E\u793A\u540D: "\u6843\u606F\u534A\u63A9\u515C", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u6843\u606F\u8584\u515C\u53EA\u4F5C\u8C61\u5F81\u906E\u63A9\uFF0C\u5FC3\u8DF3\u4E71\u65F6\u7075\u7EB9\u5FAE\u4EAE\u3002" },
  \u900F\u89C6\u7F57\u88D9: { \u663E\u793A\u540D: "\u6E7F\u96FE\u8D34\u8EAB\u88D9", \u697C\u5C42: "\u8BF1\u5F62\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u96FE\u7EE1\u9047\u70ED\u8D34\u8EAB\uFF0C\u884C\u52A8\u65F6\u663E\u51FA\u8EAB\u4F53\u8F6E\u5ED3\u3002" },
  \u5F00\u80CC\u957F\u88D9: { \u663E\u793A\u540D: "\u88F8\u810A\u7559\u75D5\u88D9", \u697C\u5C42: "\u8BF1\u5F62\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u80CC\u540E\u5927\u5F00\uFF0C\u8863\u5E26\u5728\u810A\u7EBF\u7559\u4E0B\u6D45\u75D5\u3002" },
  \u7ED1\u5E26\u88C5: { \u663E\u793A\u540D: "\u7EDB\u7EEB\u7F20\u4E73\u8863", \u697C\u5C42: "\u8BF1\u5F62\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u7EDB\u7EEB\u4EA4\u9519\u7F20\u8EAB\uFF0C\u8D8A\u52A8\u8D8A\u7D27\u3002" },
  \u91D1\u5C5E\u8170\u94FE: { \u663E\u793A\u540D: "\u5782\u9999\u788E\u91D1\u94FE", \u697C\u5C42: "\u8BF1\u5F62\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u8170\u95F4\u788E\u91D1\u5782\u843D\uFF0C\u52A8\u4F5C\u65F6\u7EC6\u54CD\u66B4\u9732\u5B58\u5728\u611F\u3002" },
  \u7EB1\u5E54\u88C5: { \u663E\u793A\u540D: "\u4E91\u5E54\u6CC4\u6625\u8863", \u697C\u5C42: "\u8BF1\u5F62\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u5C42\u5C42\u4E91\u5E54\u906E\u8986\u53C8\u6CC4\u9732\uFF0C\u9002\u5408\u534A\u79C1\u5BC6\u573A\u666F\u3002" },
  \u9F9F\u7532\u7F1A\u8863: { \u663E\u793A\u540D: "\u7384\u7EF3\u9501\u6B32\u8863", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u7384\u7EF3\u7ED3\u6210\u9501\u6B32\u9635\uFF0C\u675F\u7F1A\u672C\u8EAB\u6210\u4E3A\u8863\u88C5\u3002" },
  \u540A\u5E26\u675F\u7F1A\u88D9: { \u663E\u793A\u540D: "\u60AC\u94C3\u7275\u8EAB\u88D9", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u94C3\u4E0E\u540A\u5E26\u7275\u4F4F\u8EAB\u4F53\u91CD\u5FC3\uFF0C\u52A8\u4F5C\u4F1A\u88AB\u58F0\u97F3\u66B4\u9732\u3002" },
  \u91D1\u5C5E\u94FE\u8863: { \u663E\u793A\u540D: "\u51B7\u94FE\u8D34\u8089\u8863", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u51B7\u94FE\u8D34\u8EAB\u800C\u91CD\uFF0C\u884C\u52A8\u8FDF\u7F13\u3002" },
  \u91D1\u5C5E\u80F8\u7F69: { \u663E\u793A\u540D: "\u5BD2\u91D1\u6258\u6708\u7532", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u5BD2\u91D1\u6258\u8D77\u80F8\u524D\u6708\u5F71\uFF0C\u5E26\u51B7\u610F\u4E0E\u4EEA\u5F0F\u611F\u3002" },
  \u6DEB\u7EB9\u7ED8\u8863: { \u663E\u793A\u540D: "\u6DEB\u7EB9\u566C\u5FC3\u8863", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u6DEB\u7EB9\u968F\u5FC3\u7EEA\u6E38\u8D70\uFF0C\u60C5\u7EEA\u8D8A\u4E71\u7B26\u5149\u8D8A\u6DF1\u3002" },
  \u7B26\u6587\u809A\u515C: { \u663E\u793A\u540D: "\u5A9A\u7B26\u70D9\u5FC3\u515C", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u5A9A\u7B26\u8D34\u8FD1\u5FC3\u53E3\uFF0C\u5FC3\u8DF3\u8D8A\u4E71\u7B26\u5149\u8D8A\u6DF1\u3002" },
  \u82B1\u74E3\u8863: { \u663E\u793A\u540D: "\u843D\u82F1\u8D34\u854A\u88F3", \u697C\u5C42: "\u7F1A\u5FC3\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u82B1\u74E3\u968F\u4F53\u6E29\u5FAE\u8737\uFF0C\u9999\u6C14\u9010\u6E10\u53D8\u6D53\u3002" },
  \u638C\u95E8\u793C\u670D: { \u663E\u793A\u540D: "\u638C\u95E8\u732E\u5951\u793C\u88F3", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u638C\u95E8\u89C4\u683C\u793C\u670D\u5E26\u6743\u4F4D\u4E0E\u732E\u5951\u4EEA\u5F0F\u611F\u3002" },
  \u5F00\u80F8\u8966\u88D9: { \u663E\u793A\u540D: "\u7EFD\u895F\u542B\u6625\u8966", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u8966\u88D9\u8863\u895F\u88AB\u6539\u88C1\uFF0C\u7AEF\u5E84\u793C\u5236\u91CC\u9732\u51FA\u7834\u7EFD\u3002" },
  \u94C3\u94DB\u88C5: { \u663E\u793A\u540D: "\u788E\u94C3\u60CA\u5FC3\u8863", \u697C\u5C42: "\u5FAE\u9732\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", AI\u77ED\u63D0\u793A: "\u7EC6\u94C3\u968F\u6B65\u8F7B\u54CD\uFF0C\u8BA9\u5B89\u9759\u573A\u666F\u66F4\u96BE\u906E\u63A9\u3002" },
  \u725D\u5974\u7D20\u8863: { \u663E\u793A\u540D: "\u725D\u5370\u521D\u67D3\u8863", \u697C\u5C42: "\u725D\u5974\u5C42", \u9002\u7528\u5BF9\u8C61: "\u73A9\u5BB6", AI\u77ED\u63D0\u793A: "\u725D\u5974\u671F\u521D\u59CB\u663E\u5316\uFF0C\u50CF\u7B2C\u4E00\u9053\u8EAB\u4EFD\u5370\u75D5\u3002" },
  \u725D\u5974\u7EB9\u8863: { \u663E\u793A\u540D: "\u725D\u7EB9\u566C\u8EAB\u8863", \u697C\u5C42: "\u725D\u5974\u5C42", \u9002\u7528\u5BF9\u8C61: "\u73A9\u5BB6", AI\u77ED\u63D0\u793A: "\u725D\u7EB9\u8D34\u8EAB\u6E38\u8D70\uFF0C\u4F1A\u968F\u5815\u843D\u5EA6\u4E0E\u5FC3\u7EEA\u660E\u706D\u3002" },
  \u725D\u5974\u94FE\u7532: { \u663E\u793A\u540D: "\u725D\u9501\u8D34\u8EAB\u94FE\u7532", \u697C\u5C42: "\u725D\u5974\u5C42", \u9002\u7528\u5BF9\u8C61: "\u73A9\u5BB6", AI\u77ED\u63D0\u793A: "\u7EC6\u94FE\u8D34\u8EAB\u6210\u7532\uFF0C\u884C\u52A8\u88AB\u94FE\u58F0\u4E0E\u91CD\u91CF\u89C4\u8BAD\u3002" },
  \u725D\u5974\u793C\u670D: { \u663E\u793A\u540D: "\u725D\u5974\u732E\u5951\u793C\u88F3", \u697C\u5C42: "\u725D\u5974\u5C42", \u9002\u7528\u5BF9\u8C61: "\u73A9\u5BB6", AI\u77ED\u63D0\u793A: "\u725D\u5974\u671F\u7EC8\u5C40\u793C\u670D\uFF0C\u8C61\u5F81\u73A9\u5BB6\u5F7B\u5E95\u88AB\u547D\u5951\u6536\u675F\u3002" },
  \u767D\u82B7\u4ED9\u5974\u670D: { \u663E\u793A\u540D: "\u6668\u9732\u7F1A\u5FC3\u4ED9\u5974\u8863", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", \u4E13\u5C5ENPC: "\u767D\u82B7", AI\u77ED\u63D0\u793A: "\u51B7\u9732\u8272\u8584\u8863\u675F\u4F4F\u5FC3\u53E3\u4E0E\u8155\u95F4\uFF0C\u50CF\u628A\u5979\u6700\u540E\u7684\u6212\u5907\u51DD\u6210\u53EF\u89C1\u971C\u75D5\u3002" },
  \u82CF\u82B8\u4ED9\u5974\u670D: { \u663E\u793A\u540D: "\u9A84\u9633\u732E\u836F\u4ED9\u5974\u88D9", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", \u4E13\u5C5ENPC: "\u82CF\u82B8", AI\u77ED\u63D0\u793A: "\u6696\u91D1\u836F\u7EB9\u6CBF\u88D9\u8EAB\u6D41\u52A8\uFF0C\u836F\u9999\u4E0E\u81E3\u670D\u611F\u6DF7\u5728\u4E00\u8D77\u3002" },
  \u7EAA\u5170\u4ED9\u5974\u670D: { \u663E\u793A\u540D: "\u66AE\u972D\u9501\u5377\u4ED9\u5974\u88F3", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", \u4E13\u5C5ENPC: "\u7EAA\u5170", AI\u77ED\u63D0\u793A: "\u7D2B\u96FE\u4E66\u7EB9\u7F20\u4F4F\u8863\u895F\uFF0C\u50CF\u7981\u4E66\u628A\u5979\u7684\u5FC3\u7EEA\u4E00\u9875\u9875\u7FFB\u5F00\u3002" },
  \u6C88\u6708\u79CB\u4ED9\u5974\u670D: { \u663E\u793A\u540D: "\u7089\u706B\u70D9\u9B42\u4ED9\u5974\u7532", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", \u4E13\u5C5ENPC: "\u6C88\u6708\u79CB", AI\u77ED\u63D0\u793A: "\u8D64\u91D1\u7089\u7EB9\u8D34\u7740\u9501\u7532\u660E\u706D\uFF0C\u5F3A\u52BF\u4E0E\u5C48\u670D\u5728\u706B\u5149\u91CC\u4E92\u76F8\u6495\u626F\u3002" },
  \u67F3\u7D20\u8863\u4ED9\u5974\u670D: { \u663E\u793A\u540D: "\u638C\u95E8\u5815\u5951\u4ED9\u5974\u793C\u88F3", \u697C\u5C42: "\u547D\u5951\u5C42", \u9002\u7528\u5BF9\u8C61: "NPC", \u4E13\u5C5ENPC: "\u67F3\u7D20\u8863", AI\u77ED\u63D0\u793A: "\u638C\u95E8\u793C\u5236\u88AB\u547D\u5951\u6539\u5199\uFF0C\u534E\u8D35\u8863\u6446\u50CF\u5B97\u95E8\u6743\u67C4\u4EB2\u81EA\u5782\u843D\u3002" }
};
function withMeta(outfit) {
  const meta = \u670D\u88C5\u5143\u6570\u636E[outfit.\u540D\u79F0];
  if (!meta) throw new Error(`\u7F3A\u5C11\u670D\u88C5\u5143\u6570\u636E: ${outfit.\u540D\u79F0}`);
  return { ...outfit, ...meta };
}
var \u670D\u88C5\u5217\u8868 = [
  // 透视系
  withMeta({
    \u540D\u79F0: "\u900F\u89C6\u7EB1\u8863",
    \u4EF7\u683C: 800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u900F\u89C6\u7CFB",
    \u63CF\u8FF0: "\u8584\u5982\u8749\u7FFC\u7684\u7EB1\u8863\uFF0C\u7A7F\u4E0A\u540E\u8EAB\u4F53\u82E5\u9690\u82E5\u73B0"
  }),
  withMeta({
    \u540D\u79F0: "\u900F\u89C6\u7F57\u88D9",
    \u4EF7\u683C: 1200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u7CFB\u5217: "\u900F\u89C6\u7CFB",
    \u63CF\u8FF0: "\u7F57\u88D9\u6750\u8D28\u6781\u8584\uFF0C\u5149\u7EBF\u4E0B\u8EAB\u4F53\u8F6E\u5ED3\u6E05\u6670\u53EF\u89C1"
  }),
  withMeta({
    \u540D\u79F0: "\u900F\u89C6\u809A\u515C",
    \u4EF7\u683C: 600,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u900F\u89C6\u7CFB",
    \u63CF\u8FF0: "\u7EE3\u82B1\u809A\u515C\uFF0C\u4F46\u5E03\u6599\u900F\u660E\uFF0C\u906E\u4E0D\u4F4F\u4EFB\u4F55\u4E1C\u897F"
  }),
  // 开露系
  withMeta({
    \u540D\u79F0: "\u5F00\u88C6\u88E4",
    \u4EF7\u683C: 500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u5F00\u9732\u7CFB",
    \u63CF\u8FF0: "\u4F20\u7EDF\u5F00\u88C6\u8BBE\u8BA1\uFF0C\u65B9\u4FBF\u968F\u65F6\u4F7F\u7528"
  }),
  withMeta({
    \u540D\u79F0: "\u5F00\u80F8\u8966\u88D9",
    \u4EF7\u683C: 800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u5F00\u9732\u7CFB",
    \u63CF\u8FF0: "\u80F8\u53E3\u5927\u5F00\u7684\u8966\u88D9\uFF0C\u53CC\u4E73\u5B8C\u5168\u66B4\u9732"
  }),
  withMeta({
    \u540D\u79F0: "\u5F00\u80CC\u957F\u88D9",
    \u4EF7\u683C: 1e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u7CFB\u5217: "\u5F00\u9732\u7CFB",
    \u63CF\u8FF0: "\u80CC\u90E8\u5168\u88F8\u7684\u957F\u88D9\uFF0C\u4ECE\u9888\u5230\u8170\u53EA\u6709\u4E00\u6839\u7CFB\u5E26"
  }),
  // 束缚系
  withMeta({
    \u540D\u79F0: "\u7ED1\u5E26\u88C5",
    \u4EF7\u683C: 1200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u7CFB\u5217: "\u675F\u7F1A\u7CFB",
    \u63CF\u8FF0: "\u4E1D\u5E26\u7F20\u7ED5\u5168\u8EAB\uFF0C\u91CD\u70B9\u90E8\u4F4D\u53EA\u9760\u4EA4\u53C9\u7684\u5E26\u5B50\u906E\u6321"
  }),
  withMeta({
    \u540D\u79F0: "\u9F9F\u7532\u7F1A\u8863",
    \u4EF7\u683C: 1500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u675F\u7F1A\u7CFB",
    \u63CF\u8FF0: "\u9884\u8BBE\u597D\u7684\u9F9F\u7532\u7F1A\u6837\u5F0F\uFF0C\u7A7F\u4E0A\u5373\u6210\u675F\u7F1A\u72B6\u6001"
  }),
  withMeta({
    \u540D\u79F0: "\u540A\u5E26\u675F\u7F1A\u88D9",
    \u4EF7\u683C: 1800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u675F\u7F1A\u7CFB",
    \u63CF\u8FF0: "\u540A\u5E26\u4E0E\u675F\u7F1A\u7ED3\u5408\uFF0C\u62AC\u624B\u65F6\u88D9\u6446\u4E0A\u63D0\uFF0C\u9732\u51FA\u4E0B\u4F53"
  }),
  // 金属系
  withMeta({
    \u540D\u79F0: "\u91D1\u5C5E\u94FE\u8863",
    \u4EF7\u683C: 2e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u91D1\u5C5E\u7CFB",
    \u63CF\u8FF0: "\u7EC6\u91D1\u5C5E\u94FE\u7F16\u7EC7\u6210\u7684\u8863\u670D\uFF0C\u51B0\u51C9\u6C89\u91CD\uFF0C\u53EE\u5F53\u4F5C\u54CD"
  }),
  withMeta({
    \u540D\u79F0: "\u91D1\u5C5E\u80F8\u7F69",
    \u4EF7\u683C: 1500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u91D1\u5C5E\u7CFB",
    \u63CF\u8FF0: "\u91D1\u5C5E\u534A\u7F69\uFF0C\u6258\u8D77\u4E73\u623F\uFF0C\u4E73\u5934\u4ECE\u5B54\u6D1E\u4E2D\u7A7F\u51FA"
  }),
  withMeta({
    \u540D\u79F0: "\u91D1\u5C5E\u8170\u94FE",
    \u4EF7\u683C: 800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u7CFB\u5217: "\u91D1\u5C5E\u7CFB",
    \u63CF\u8FF0: "\u8170\u95F4\u91D1\u5C5E\u94FE\uFF0C\u5782\u4E0B\u7684\u94FE\u5B50\u521A\u597D\u906E\u4F4F\u79C1\u5904"
  }),
  // 绘纹系
  withMeta({
    \u540D\u79F0: "\u6DEB\u7EB9\u7ED8\u8863",
    \u4EF7\u683C: 2500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u7ED8\u7EB9\u7CFB",
    \u63CF\u8FF0: "\u8863\u670D\u4E0A\u7ED8\u6EE1\u6DEB\u7EB9\uFF0C\u7A7F\u4E0A\u540E\u6DEB\u7EB9\u4F1A\u5FAE\u5FAE\u53D1\u5149"
  }),
  withMeta({
    \u540D\u79F0: "\u7B26\u6587\u809A\u515C",
    \u4EF7\u683C: 1800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u7ED8\u7EB9\u7CFB",
    \u63CF\u8FF0: "\u7ED8\u6709\u50AC\u60C5\u7B26\u6587\u7684\u809A\u515C\uFF0C\u6301\u7EED\u6563\u53D1\u5FAE\u5F31\u5A9A\u6C14"
  }),
  // 角色系
  withMeta({
    \u540D\u79F0: "\u5E08\u59D0\u88C5",
    \u4EF7\u683C: 1e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u89D2\u8272\u7CFB",
    \u63CF\u8FF0: "\u5408\u6B22\u5B97\u5185\u95E8\u5E08\u59D0\u7684\u6B63\u5F0F\u670D\u9970\uFF0C\u7AEF\u5E84\u4E2D\u900F\u7740\u5A9A\u610F"
  }),
  withMeta({
    \u540D\u79F0: "\u6742\u5F79\u670D",
    \u4EF7\u683C: 500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u89D2\u8272\u7CFB",
    \u63CF\u8FF0: "\u767D\u82B7\u66FE\u7ECF\u7A7F\u8FC7\u7684\u7C97\u9EBB\u5E03\u8863\u670D\uFF0C\u5BBD\u5927\u770B\u4E0D\u51FA\u6027\u522B"
  }),
  withMeta({
    \u540D\u79F0: "\u638C\u95E8\u793C\u670D",
    \u4EF7\u683C: 3500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 90,
    \u7CFB\u5217: "\u89D2\u8272\u7CFB",
    \u63CF\u8FF0: "\u67F3\u7D20\u8863\u540C\u6B3E\u638C\u95E8\u793C\u670D\uFF0C\u534E\u8D35\u800C\u66B4\u9732"
  }),
  // 制服系
  withMeta({
    \u540D\u79F0: "\u836F\u5E90\u5236\u670D",
    \u4EF7\u683C: 800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u5236\u670D\u7CFB",
    \u63CF\u8FF0: "\u82CF\u82B8\u540C\u6B3E\u836F\u5E90\u5236\u670D\uFF0C\u8170\u95F4\u836F\u56CA\u53EE\u5F53"
  }),
  withMeta({
    \u540D\u79F0: "\u7ECF\u9601\u5236\u670D",
    \u4EF7\u683C: 800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u5236\u670D\u7CFB",
    \u63CF\u8FF0: "\u7EAA\u5170\u540C\u6B3E\u7ECF\u9601\u5236\u670D\uFF0C\u58A8\u9999\u4E0E\u4F53\u9999\u6DF7\u5408"
  }),
  // 特殊系
  withMeta({
    \u540D\u79F0: "\u94C3\u94DB\u88C5",
    \u4EF7\u683C: 1200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u7CFB\u5217: "\u7279\u6B8A\u7CFB",
    \u63CF\u8FF0: "\u5168\u8EAB\u6302\u6EE1\u5C0F\u94C3\u94DB\uFF0C\u4E00\u52A8\u5C31\u53EE\u53EE\u5F53\u5F53"
  }),
  withMeta({
    \u540D\u79F0: "\u7EB1\u5E54\u88C5",
    \u4EF7\u683C: 1500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u7CFB\u5217: "\u7279\u6B8A\u7CFB",
    \u63CF\u8FF0: "\u5C42\u5C42\u7EB1\u5E54\u7F20\u8EAB\uFF0C\u98CE\u5439\u5373\u8D77\uFF0C\u906E\u4E0D\u4F4F\u4EC0\u4E48"
  }),
  withMeta({
    \u540D\u79F0: "\u82B1\u74E3\u8863",
    \u4EF7\u683C: 2e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u7CFB\u5217: "\u7279\u6B8A\u7CFB",
    \u63CF\u8FF0: "\u65B0\u9C9C\u82B1\u74E3\u4E32\u6210\u7684\u8863\u670D\uFF0C\u4F1A\u968F\u65F6\u95F4\u67AF\u840E"
  }),
  // 牝奴系（Phase 2 专属）
  withMeta({
    \u540D\u79F0: "\u725D\u5974\u7D20\u8863",
    \u4EF7\u683C: 0,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u725D\u5974\u7CFB",
    \u63CF\u8FF0: "\u8FDB\u5165\u725D\u5974\u671F\u65F6\u81EA\u52A8\u7A7F\u7740\u7684\u7D20\u8272\u8584\u8863\uFF0C\u80F8\u53E3\u7EE3\u6709\u725D\u5B57"
  }),
  withMeta({
    \u540D\u79F0: "\u725D\u5974\u7EB9\u8863",
    \u4EF7\u683C: 2e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u725D\u5974\u7CFB",
    \u63CF\u8FF0: "\u7ED8\u6EE1\u6DEB\u7EB9\u7684\u7D27\u8EAB\u8863\uFF0C\u6DEB\u7EB9\u4F1A\u968F\u5815\u843D\u5EA6\u53D1\u5149\u53D8\u8272"
  }),
  withMeta({
    \u540D\u79F0: "\u725D\u5974\u94FE\u7532",
    \u4EF7\u683C: 3e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u725D\u5974\u7CFB",
    \u63CF\u8FF0: "\u7EC6\u5BC6\u91D1\u5C5E\u94FE\u7F16\u7EC7\u7684\u94FE\u7532\uFF0C\u906E\u4E0D\u4F4F\u4EFB\u4F55\u4E1C\u897F\u5374\u5145\u6EE1\u675F\u7F1A\u611F"
  }),
  withMeta({
    \u540D\u79F0: "\u725D\u5974\u793C\u670D",
    \u4EF7\u683C: 5e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 0,
    \u7CFB\u5217: "\u725D\u5974\u7CFB",
    \u63CF\u8FF0: "\u725D\u5974\u671F\u6700\u7EC8\u5F62\u6001\u7684\u534E\u670D\uFF0C\u8C61\u5F81\u5F7B\u5E95\u63A5\u53D7\u725D\u5974\u8EAB\u4EFD"
  }),
  withMeta({
    \u540D\u79F0: "\u767D\u82B7\u4ED9\u5974\u670D",
    \u4EF7\u683C: 7e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 100,
    \u7CFB\u5217: "\u547D\u5951\u4E13\u5C5E",
    \u63CF\u8FF0: "\u767D\u82B7\u4ED9\u5974\u72B6\u6001\u7684\u547D\u5951\u4E13\u5C5E\u670D\u3002"
  }),
  withMeta({
    \u540D\u79F0: "\u82CF\u82B8\u4ED9\u5974\u670D",
    \u4EF7\u683C: 8e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 100,
    \u7CFB\u5217: "\u547D\u5951\u4E13\u5C5E",
    \u63CF\u8FF0: "\u82CF\u82B8\u4ED9\u5974\u72B6\u6001\u7684\u547D\u5951\u4E13\u5C5E\u670D\u3002"
  }),
  withMeta({
    \u540D\u79F0: "\u7EAA\u5170\u4ED9\u5974\u670D",
    \u4EF7\u683C: 8500,
    \u597D\u611F\u5EA6\u95E8\u69DB: 100,
    \u7CFB\u5217: "\u547D\u5951\u4E13\u5C5E",
    \u63CF\u8FF0: "\u7EAA\u5170\u4ED9\u5974\u72B6\u6001\u7684\u547D\u5951\u4E13\u5C5E\u670D\u3002"
  }),
  withMeta({
    \u540D\u79F0: "\u6C88\u6708\u79CB\u4ED9\u5974\u670D",
    \u4EF7\u683C: 9e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 100,
    \u7CFB\u5217: "\u547D\u5951\u4E13\u5C5E",
    \u63CF\u8FF0: "\u6C88\u6708\u79CB\u4ED9\u5974\u72B6\u6001\u7684\u547D\u5951\u4E13\u5C5E\u670D\u3002"
  }),
  withMeta({
    \u540D\u79F0: "\u67F3\u7D20\u8863\u4ED9\u5974\u670D",
    \u4EF7\u683C: 12e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 100,
    \u7CFB\u5217: "\u547D\u5951\u4E13\u5C5E",
    \u63CF\u8FF0: "\u67F3\u7D20\u8863\u4ED9\u5974\u72B6\u6001\u7684\u547D\u5951\u4E13\u5C5E\u670D\u3002"
  })
];
var \u725D\u5974\u670D\u88C5\u5217\u8868 = \u670D\u88C5\u5217\u8868.filter((o) => o.\u7CFB\u5217 === "\u725D\u5974\u7CFB");
var \u670D\u88C5\u7CFB\u5217 = [...new Set(\u670D\u88C5\u5217\u8868.map((o) => o.\u7CFB\u5217))];

// src/雌堕合欢宗/界面/data/scenes.ts
var \u7279\u6B8A\u573A\u666F = [
  {
    \u540D\u79F0: "\u9634\u9633\u6C60",
    \u663E\u793A\u540D: "\u5408\u5951\u6D74\u4EE4",
    \u4EF7\u683C: 1800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u4E3B\u7528\u9014: "\u8C03\u6559/\u8EAB\u4F53\u53CD\u5E94\u653E\u5927",
    \u5173\u8054NPC: ["\u767D\u82B7", "\u6C88\u6708\u79CB"],
    \u9002\u914D\u9053\u5177: ["\u6E7F\u8EAB\u670D\u88C5", "\u7981\u5668", "\u4E34\u65F6\u4E39\u836F"],
    \u8FDB\u5165\u7406\u7531: "\u6301\u6D74\u4EE4\u53EF\u5728\u591C\u95F4\u501F\u7528\u9634\u9633\u6C60\u504F\u6C60\uFF0C\u540D\u4E49\u4E0A\u662F\u8C03\u606F\uFF0C\u5B9E\u9645\u9002\u5408\u89C2\u5BDF\u8EAB\u4F53\u53CD\u5E94\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u6C60\u8FB9\u6C34\u6C7D\u5FFD\u7136\u5E26\u4E0A\u964C\u751F\u4F53\u9999\uFF0C\u6709\u5F1F\u5B50\u770B\u89C1\u504F\u6C60\u7981\u5236\u88AB\u4EBA\u63D0\u524D\u89E3\u5F00\u3002",
    AI\u77ED\u63D0\u793A: "\u6C34\u6C7D\u4F1A\u653E\u5927\u8863\u6599\u8D34\u8EAB\u3001\u7981\u5668\u9707\u98A4\u548C\u836F\u6027\u53CD\u5E94\uFF0C\u9002\u5408\u7F9E\u803B\u8C03\u6559\u3002",
    \u63CF\u8FF0: "\u5408\u5951\u6D74\u4EE4\u53EF\u5F00\u542F\u9634\u9633\u6C60\u504F\u6C60\uFF0C\u6C34\u6C7D\u4F1A\u653E\u5927\u8863\u6599\u8D34\u8EAB\u3001\u7981\u5668\u9707\u98A4\u548C\u836F\u6027\u53CD\u5E94\u3002"
  },
  {
    \u540D\u79F0: "\u7ECF\u9601\u5BC6\u5BA4",
    \u663E\u793A\u540D: "\u6B8B\u5377\u5BC6\u94A5",
    \u4EF7\u683C: 2200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u4E3B\u7528\u9014: "\u5BA1\u95EE/\u5FC3\u97F3/\u7981\u5FCC\u77E5\u8BC6",
    \u5173\u8054NPC: ["\u7EAA\u5170", "\u767D\u82B7"],
    \u9002\u914D\u9053\u5177: ["\u7075\u8BC6\u7981\u5668", "\u53E3\u820C\u7981\u5668", "\u5FC3\u97F3\u56DE\u54CD"],
    \u8FDB\u5165\u7406\u7531: "\u5BC6\u94A5\u53EF\u5F00\u542F\u7ECF\u9601\u6B8B\u5377\u5BA4\uFF0C\u9002\u5408\u501F\u67E5\u9605\u4E4B\u540D\u903C\u51FA\u9690\u79D8\u5FC3\u58F0\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u6B8B\u5377\u5BA4\u706F\u706B\u672A\u706D\uFF0C\u6709\u4EBA\u628A\u4E00\u518C\u5408\u6B22\u7981\u5F55\u5012\u6263\u5728\u6848\u4E0A\u3002",
    AI\u77ED\u63D0\u793A: "\u7981\u4E66\u3001\u9759\u5BA4\u548C\u5BC6\u8C08\u4F1A\u538B\u4F4E\u58F0\u97F3\uFF0C\u9002\u5408\u5BA1\u95EE\u3001\u5FC3\u97F3\u548C\u7F9E\u803B\u8BB0\u5F55\u3002",
    \u63CF\u8FF0: "\u6B8B\u5377\u5BC6\u94A5\u53EF\u5F00\u542F\u7ECF\u9601\u6DF1\u5904\u5BC6\u5BA4\uFF0C\u9002\u5408\u7981\u4E66\u5BA1\u95EE\u3001\u5FC3\u97F3\u8BB0\u5F55\u548C\u79D8\u5BC6\u63ED\u793A\u3002"
  },
  {
    \u540D\u79F0: "\u638C\u95E8\u6BBF\u504F\u6BBF",
    \u663E\u793A\u540D: "\u504F\u6BBF\u542C\u5BA3\u724C",
    \u4EF7\u683C: 3600,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u4E3B\u7528\u9014: "\u547D\u5951/\u6743\u529B\u7F9E\u803B",
    \u5173\u8054NPC: ["\u67F3\u7D20\u8863", "\u6C88\u6708\u79CB"],
    \u9002\u914D\u9053\u5177: ["\u547D\u5951\u5C42\u670D\u88C5", "\u547D\u5951\u5668\u9636\u7981\u5668", "\u4ED9\u5974\u4E39"],
    \u8FDB\u5165\u7406\u7531: "\u542C\u5BA3\u724C\u4EE3\u8868\u638C\u95E8\u6BBF\u504F\u6BBF\u4E34\u65F6\u53EC\u89C1\u6743\uFF0C\u8D8A\u6B63\u5F0F\u8D8A\u5BB9\u6613\u628A\u7F9E\u803B\u53D8\u6210\u4EEA\u5F0F\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u504F\u6BBF\u7389\u9636\u65B0\u64E6\u8FC7\uFF0C\u638C\u95E8\u5370\u5149\u5728\u95E8\u7F1D\u91CC\u4EAE\u4E86\u4E00\u77AC\u3002",
    AI\u77ED\u63D0\u793A: "\u6743\u4F4D\u3001\u793C\u5236\u548C\u547D\u5951\u611F\u6700\u5F3A\uFF0C\u9002\u5408\u5F52\u5C5E\u3001\u5BA3\u544A\u3001\u4ED9\u5974\u8EAB\u4EFD\u63A8\u8FDB\u3002",
    \u63CF\u8FF0: "\u504F\u6BBF\u542C\u5BA3\u724C\u53EF\u8FDB\u5165\u638C\u95E8\u6BBF\u4FA7\u6BBF\uFF0C\u6743\u529B\u4E0E\u793C\u5236\u4F1A\u628A\u547D\u5951\u7F9E\u803B\u653E\u5230\u53F0\u9762\u4E0A\u3002"
  },
  {
    \u540D\u79F0: "\u6E0A\u5E95\u7075\u8109",
    \u663E\u793A\u540D: "\u6E0A\u8109\u6C89\u5951\u7B26",
    \u4EF7\u683C: 3200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u4E3B\u7528\u9014: "\u8BD5\u836F/\u5931\u63A7/\u9AD8\u98CE\u9669\u4E8B\u4EF6",
    \u5173\u8054NPC: ["\u82CF\u82B8", "\u6C88\u6708\u79CB"],
    \u9002\u914D\u9053\u5177: ["\u70C8\u836F", "\u6C38\u4E45\u4E39\u836F", "\u9635\u6CD5\u9053\u5177"],
    \u8FDB\u5165\u7406\u7531: "\u6C89\u5951\u7B26\u53EF\u4E34\u65F6\u538B\u4F4F\u6E0A\u5E95\u7075\u538B\uFF0C\u5141\u8BB8\u5E26\u4EBA\u4E0B\u63A2\u7075\u8109\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u6E0A\u5E95\u7075\u6F6E\u63D0\u524D\u7FFB\u6D8C\uFF0C\u50CF\u6709\u4EC0\u4E48\u836F\u6027\u6216\u9635\u7EB9\u88AB\u7075\u8109\u50AC\u52A8\u3002",
    AI\u77ED\u63D0\u793A: "\u6D53\u70C8\u7075\u538B\u4F1A\u50AC\u5316\u836F\u6027\u3001\u9635\u6CD5\u548C\u8EAB\u4F53\u6539\u5199\uFF0C\u9002\u5408\u5931\u63A7\u5267\u60C5\u3002",
    \u63CF\u8FF0: "\u6E0A\u8109\u6C89\u5951\u7B26\u53EF\u8FDB\u5165\u6E0A\u5E95\u7075\u8109\uFF0C\u6D53\u70C8\u7075\u6C14\u4F1A\u50AC\u5316\u836F\u6027\u548C\u8EAB\u4F53\u6539\u5199\u3002"
  },
  {
    \u540D\u79F0: "\u836F\u5E90\u6696\u9601",
    \u663E\u793A\u540D: "\u6696\u7089\u8BD5\u9999\u4EE4",
    \u4EF7\u683C: 2400,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u4E3B\u7528\u9014: "\u8BD5\u836F/\u4E39\u836F\u5267\u60C5",
    \u5173\u8054NPC: ["\u82CF\u82B8"],
    \u9002\u914D\u9053\u5177: ["\u4E34\u65F6\u4E39\u836F", "\u6C38\u4E45\u4E39\u836F", "\u4F53\u9999\u7C7B\u6548\u679C"],
    \u8FDB\u5165\u7406\u7531: "\u8BD5\u9999\u4EE4\u53EF\u501F\u7528\u836F\u5E90\u6696\u9601\uFF0C\u540D\u4E49\u4E0A\u662F\u89C2\u706B\u8BD5\u9999\uFF0C\u5B9E\u9645\u9002\u5408\u89C2\u5BDF\u4E39\u836F\u53CD\u5E94\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u6696\u9601\u4E39\u7089\u5C01\u6CE5\u672A\u5E72\uFF0C\u7089\u8FB9\u7559\u7740\u4E00\u53EA\u5199\u9519\u5242\u91CF\u7684\u836F\u7B7E\u3002",
    AI\u77ED\u63D0\u793A: "\u8BD5\u836F\u3001\u4F53\u9999\u3001\u836F\u6C57\u548C\u8BEF\u670D\u90FD\u66F4\u81EA\u7136\uFF0C\u9002\u5408\u82CF\u82B8\u7EBF\u4E0E\u4E39\u836F\u627F\u63A5\u3002",
    \u63CF\u8FF0: "\u6696\u7089\u8BD5\u9999\u4EE4\u53EF\u5F00\u542F\u836F\u5E90\u6696\u9601\uFF0C\u9002\u5408\u8BD5\u836F\u3001\u95FB\u9999\u3001\u89C2\u706B\u548C\u4E39\u836F\u5267\u60C5\u63A8\u8FDB\u3002"
  },
  {
    \u540D\u79F0: "\u542C\u98CE\u5ECA",
    \u663E\u793A\u540D: "\u542C\u98CE\u793A\u4F17\u7B7E",
    \u4EF7\u683C: 1600,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u4E3B\u7528\u9014: "\u516C\u5F00\u7F9E\u803B/\u98CE\u58F0\u4F20\u64AD",
    \u5173\u8054NPC: ["\u767D\u82B7", "\u7EAA\u5170", "\u67F3\u7D20\u8863"],
    \u9002\u914D\u9053\u5177: ["\u94C3\u7CFB\u7981\u5668", "\u516C\u5F00\u670D\u88C5", "\u98CE\u58F0\u8FFD\u67E5"],
    \u8FDB\u5165\u7406\u7531: "\u793A\u4F17\u7B7E\u5141\u8BB8\u5728\u542C\u98CE\u5ECA\u505C\u7559\u95EE\u8BAF\uFF0C\u6240\u6709\u7EC6\u54CD\u548C\u4F20\u95FB\u90FD\u4F1A\u88AB\u653E\u5927\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u5ECA\u4E0B\u98CE\u94C3\u65E0\u98CE\u81EA\u54CD\uFF0C\u6709\u5F1F\u5B50\u4F4E\u58F0\u63D0\u8D77\u67D0\u4EBA\u8EAB\u4E0A\u7684\u94C3\u58F0\u3002",
    AI\u77ED\u63D0\u793A: "\u98CE\u58F0\u3001\u94C3\u58F0\u548C\u65C1\u89C2\u89C6\u7EBF\u4F1A\u653E\u5927\u516C\u5F00\u7F9E\u803B\uFF0C\u9002\u5408\u6D41\u8A00\u4E0E\u793A\u4F17\u3002",
    \u63CF\u8FF0: "\u542C\u98CE\u793A\u4F17\u7B7E\u53EF\u8FDB\u5165\u542C\u98CE\u5ECA\uFF0C\u98CE\u58F0\u4E0E\u65C1\u89C2\u89C6\u7EBF\u4F1A\u8BA9\u7F9E\u803B\u66F4\u96BE\u906E\u63A9\u3002"
  },
  {
    \u540D\u79F0: "\u9501\u5FC3\u9759\u5BA4",
    \u663E\u793A\u540D: "\u9501\u5FC3\u95EE\u5951\u724C",
    \u4EF7\u683C: 2800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u4E3B\u7528\u9014: "\u7981\u5668\u8C03\u8BD5/\u5FC3\u9632\u63A8\u8FDB",
    \u5173\u8054NPC: ["\u767D\u82B7", "\u7EAA\u5170", "\u6C88\u6708\u79CB"],
    \u9002\u914D\u9053\u5177: ["\u7075\u8BC6\u7981\u5668", "\u547D\u5951\u7981\u5668", "\u5FC3\u97F3\u56DE\u54CD"],
    \u8FDB\u5165\u7406\u7531: "\u95EE\u5951\u724C\u53EF\u5F00\u542F\u9694\u97F3\u9759\u5BA4\uFF0C\u9002\u5408\u8C03\u8BD5\u7981\u5668\u548C\u903C\u8FD1\u5FC3\u9632\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u9759\u5BA4\u95E8\u4E0A\u7684\u9501\u5FC3\u7EB9\u53D1\u70ED\uFF0C\u50CF\u521A\u521A\u8BB0\u5F55\u8FC7\u4E00\u6BB5\u4E0D\u80AF\u51FA\u53E3\u7684\u5FC3\u58F0\u3002",
    AI\u77ED\u63D0\u793A: "\u9694\u97F3\u3001\u9501\u5FC3\u7EB9\u548C\u7981\u5668\u611F\u5E94\u4F1A\u63A8\u8FDB\u5FC3\u9632\u4E0E\u547D\u5951\uFF0C\u9002\u5408\u5355\u4EBA\u6DF1\u8C08\u3002",
    \u63CF\u8FF0: "\u9501\u5FC3\u95EE\u5951\u724C\u53EF\u5F00\u542F\u9694\u97F3\u9759\u5BA4\uFF0C\u9002\u5408\u7981\u5668\u8C03\u8BD5\u3001\u5FC3\u97F3\u903C\u95EE\u548C\u547D\u5951\u63A8\u8FDB\u3002"
  },
  {
    \u540D\u79F0: "\u83B2\u7EB9\u6D74\u623F",
    \u663E\u793A\u540D: "\u83B2\u7EB9\u51C0\u8EAB\u724C",
    \u4EF7\u683C: 2e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 30,
    \u4E3B\u7528\u9014: "\u6362\u8863/\u75D5\u8FF9\u68C0\u67E5/\u7F9E\u803B\u6E05\u6D17",
    \u5173\u8054NPC: ["\u767D\u82B7", "\u82CF\u82B8", "\u67F3\u7D20\u8863"],
    \u9002\u914D\u9053\u5177: ["\u670D\u88C5", "\u4F53\u9999\u4E39\u836F", "\u7559\u75D5\u6548\u679C"],
    \u8FDB\u5165\u7406\u7531: "\u51C0\u8EAB\u724C\u53EF\u501F\u7528\u83B2\u7EB9\u6D74\u623F\uFF0C\u9002\u5408\u66F4\u8863\u3001\u6E05\u6D17\u548C\u68C0\u67E5\u8863\u4E0B\u75D5\u8FF9\u3002",
    \u98CE\u58F0\u94A9\u5B50: "\u6D74\u623F\u83B2\u7EB9\u6D6E\u8D77\u5FAE\u5149\uFF0C\u6C34\u9762\u6F02\u7740\u4E0D\u5C5E\u4E8E\u6B64\u5904\u7684\u836F\u9999\u3002",
    AI\u77ED\u63D0\u793A: "\u6E05\u6D17\u3001\u6362\u8863\u3001\u4F53\u9999\u548C\u7559\u75D5\u68C0\u67E5\u90FD\u66F4\u81EA\u7136\uFF0C\u9002\u5408\u670D\u88C5\u4E0E\u4E39\u836F\u8054\u52A8\u3002",
    \u63CF\u8FF0: "\u83B2\u7EB9\u51C0\u8EAB\u724C\u53EF\u5F00\u542F\u6D74\u623F\uFF0C\u9002\u5408\u6362\u8863\u3001\u6E05\u6D17\u3001\u4F53\u9999\u4E0E\u8863\u4E0B\u75D5\u8FF9\u68C0\u67E5\u3002"
  }
];
var \u7279\u6B8A\u5267\u60C5 = [
  {
    \u540D\u79F0: "\u767D\u82B7\u65E7\u8A93\u7EBF",
    \u663E\u793A\u540D: "\u65AD\u9E22\u7389\u6263",
    NPC: "\u767D\u82B7",
    \u4EF7\u683C: 2200,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u5267\u60C5\u7EBF: "\u767D\u82B7\u65E7\u8A93\u7EBF",
    \u79D8\u5BC6\u4E3B\u9898: "\u65E7\u8A93/\u4F9D\u8D56/\u88AB\u4FDD\u62A4\u6B32",
    \u63A8\u8350\u573A\u666F: ["\u542C\u98CE\u5ECA", "\u9501\u5FC3\u9759\u5BA4", "\u9634\u9633\u6C60"],
    \u5173\u8054\u9053\u5177: ["\u7075\u8BC6\u7981\u5668", "\u94C3\u7CFB\u7981\u5668", "\u6E29\u836F"],
    \u89E3\u9501\u63D0\u793A: "\u7389\u6263\u7275\u51FA\u767D\u82B7\u65E7\u65E5\u8A93\u8A00\uFF0C\u540E\u7EED\u98CE\u58F0\u4E0E\u5FC3\u97F3\u4F1A\u66F4\u5BB9\u6613\u89E6\u5230\u5979\u4E0D\u6562\u627F\u8BA4\u7684\u4F9D\u8D56\u3002",
    AI\u77ED\u63D0\u793A: "\u767D\u82B7\u65E7\u8A93\u4F1A\u8BA9\u4FDD\u62A4\u6B32\u8F6C\u5411\u7F9E\u803B\u4F9D\u8D56\uFF0C\u9002\u5408\u6E29\u67D4\u903C\u8FD1\u548C\u5FC3\u9632\u677E\u52A8\u3002"
  },
  {
    \u540D\u79F0: "\u82CF\u82B8\u9519\u7089\u7EBF",
    \u663E\u793A\u540D: "\u9519\u7089\u836F\u7B7E",
    NPC: "\u82CF\u82B8",
    \u4EF7\u683C: 2600,
    \u597D\u611F\u5EA6\u95E8\u69DB: 50,
    \u5267\u60C5\u7EBF: "\u82CF\u82B8\u9519\u7089\u7EBF",
    \u79D8\u5BC6\u4E3B\u9898: "\u836F\u5E90\u5931\u63A7/\u9A84\u7EB5\u53CD\u566C/\u8BD5\u836F\u7F9E\u803B",
    \u63A8\u8350\u573A\u666F: ["\u836F\u5E90\u6696\u9601", "\u6E0A\u5E95\u7075\u8109", "\u83B2\u7EB9\u6D74\u623F"],
    \u5173\u8054\u9053\u5177: ["\u4E34\u65F6\u4E39\u836F", "\u6C38\u4E45\u4E39\u836F", "\u4F53\u9999\u7C7B\u6548\u679C"],
    \u89E3\u9501\u63D0\u793A: "\u836F\u7B7E\u6307\u5411\u82CF\u82B8\u66FE\u7ECF\u906E\u63A9\u7684\u9519\u7089\u8BB0\u5F55\uFF0C\u540E\u7EED\u8BD5\u836F\u4E0E\u836F\u6027\u53CD\u566C\u4F1A\u66F4\u5BB9\u6613\u88AB\u89E6\u53D1\u3002",
    AI\u77ED\u63D0\u793A: "\u82CF\u82B8\u7684\u9519\u7089\u8BB0\u5F55\u4F1A\u628A\u9A84\u7EB5\u53D8\u6210\u53CD\u566C\uFF0C\u9002\u5408\u8BD5\u836F\u3001\u8BEF\u670D\u548C\u836F\u6027\u5931\u63A7\u3002"
  },
  {
    \u540D\u79F0: "\u7EAA\u5170\u7981\u5F55\u7EBF",
    \u663E\u793A\u540D: "\u6731\u6279\u7981\u5F55",
    NPC: "\u7EAA\u5170",
    \u4EF7\u683C: 3e3,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u5267\u60C5\u7EBF: "\u7EAA\u5170\u7981\u5F55\u7EBF",
    \u79D8\u5BC6\u4E3B\u9898: "\u7981\u5F55\u5BA1\u95EE/\u6267\u4E8B\u7834\u6212/\u8BB0\u5F55\u7F9E\u803B",
    \u63A8\u8350\u573A\u666F: ["\u7ECF\u9601\u5BC6\u5BA4", "\u9501\u5FC3\u9759\u5BA4", "\u542C\u98CE\u5ECA"],
    \u5173\u8054\u9053\u5177: ["\u7075\u8BC6\u7981\u5668", "\u53E3\u820C\u7981\u5668", "\u5FC3\u97F3\u56DE\u54CD"],
    \u89E3\u9501\u63D0\u793A: "\u6731\u6279\u7981\u5F55\u8BA9\u7EAA\u5170\u7684\u516C\u6B63\u5916\u58F3\u51FA\u73B0\u88C2\u7F1D\uFF0C\u540E\u7EED\u5BA1\u95EE\u4E0E\u8BB0\u5F55\u4F1A\u7275\u51FA\u5979\u7684\u7834\u6212\u8FB9\u754C\u3002",
    AI\u77ED\u63D0\u793A: "\u7EAA\u5170\u4F1A\u5728\u8BB0\u5F55\u4E0E\u88AB\u8BB0\u5F55\u4E4B\u95F4\u5931\u8861\uFF0C\u9002\u5408\u5BA1\u95EE\u3001\u5FC3\u97F3\u548C\u6267\u4E8B\u7834\u6212\u3002"
  },
  {
    \u540D\u79F0: "\u6C88\u6708\u79CB\u5931\u8861\u7EBF",
    \u663E\u793A\u540D: "\u88C2\u7B97\u7389\u7B79",
    NPC: "\u6C88\u6708\u79CB",
    \u4EF7\u683C: 3600,
    \u597D\u611F\u5EA6\u95E8\u69DB: 70,
    \u5267\u60C5\u7EBF: "\u6C88\u6708\u79CB\u5931\u8861\u7EBF",
    \u79D8\u5BC6\u4E3B\u9898: "\u6570\u636E\u8C03\u6559/\u957F\u8001\u5931\u8861/\u7406\u6027\u7834\u9632",
    \u63A8\u8350\u573A\u666F: ["\u6E0A\u5E95\u7075\u8109", "\u9501\u5FC3\u9759\u5BA4", "\u9634\u9633\u6C60"],
    \u5173\u8054\u9053\u5177: ["\u547D\u5951\u7981\u5668", "\u70C8\u836F", "\u9635\u6CD5\u9053\u5177"],
    \u89E3\u9501\u63D0\u793A: "\u7389\u7B79\u8BB0\u5F55\u7740\u6C88\u6708\u79CB\u7B97\u9519\u7684\u4E00\u6B21\u8EAB\u4F53\u53CD\u5E94\uFF0C\u540E\u7EED\u7406\u6027\u63A8\u6F14\u4F1A\u88AB\u7F9E\u803B\u6570\u636E\u53CD\u566C\u3002",
    AI\u77ED\u63D0\u793A: "\u6C88\u6708\u79CB\u8D8A\u60F3\u7CBE\u5BC6\u63A7\u5236\uFF0C\u8D8A\u5BB9\u6613\u88AB\u8EAB\u4F53\u6570\u636E\u53CD\u8BC1\uFF0C\u9002\u5408\u7406\u6027\u7834\u9632\u3002"
  },
  {
    \u540D\u79F0: "\u67F3\u7D20\u8863\u547D\u5951\u7EBF",
    \u663E\u793A\u540D: "\u7D20\u5370\u6B8B\u5951",
    NPC: "\u67F3\u7D20\u8863",
    \u4EF7\u683C: 4800,
    \u597D\u611F\u5EA6\u95E8\u69DB: 90,
    \u5267\u60C5\u7EBF: "\u67F3\u7D20\u8863\u547D\u5951\u7EBF",
    \u79D8\u5BC6\u4E3B\u9898: "\u638C\u95E8\u771F\u76F8/\u547D\u5951\u5F52\u5C5E/\u5B97\u95E8\u6743\u529B",
    \u63A8\u8350\u573A\u666F: ["\u638C\u95E8\u6BBF\u504F\u6BBF", "\u542C\u98CE\u5ECA", "\u83B2\u7EB9\u6D74\u623F"],
    \u5173\u8054\u9053\u5177: ["\u547D\u5951\u5C42\u670D\u88C5", "\u547D\u5951\u5668\u9636\u7981\u5668", "\u4ED9\u5974\u4E39"],
    \u89E3\u9501\u63D0\u793A: "\u6B8B\u5951\u7275\u51FA\u67F3\u7D20\u8863\u771F\u6B63\u60F3\u91CD\u5199\u7684\u5B97\u95E8\u79E9\u5E8F\uFF0C\u540E\u7EED\u547D\u5951\u3001\u6743\u4F4D\u4E0E\u5F52\u5C5E\u4F1A\u5F00\u59CB\u4E92\u76F8\u54AC\u5408\u3002",
    AI\u77ED\u63D0\u793A: "\u67F3\u7D20\u8863\u7684\u638C\u95E8\u5A01\u4E25\u4F1A\u4E0E\u547D\u5951\u771F\u76F8\u51B2\u7A81\uFF0C\u9002\u5408\u6743\u529B\u7F9E\u803B\u548C\u6700\u7EC8\u5F52\u5C5E\u63A8\u8FDB\u3002"
  }
];

// src/雌堕合欢宗/界面/data/itemLifecycle.ts
var \u670D\u88C5\u540D\u79F0 = new Set([...\u670D\u88C5\u5217\u8868, ...\u725D\u5974\u670D\u88C5\u5217\u8868].map((item) => item.\u540D\u79F0));
var \u88C5\u5907\u540D\u79F0 = new Set([...NSFW\u9053\u5177, ...\u725D\u5974\u9053\u5177].map((item) => item.\u540D\u79F0));
var \u6C38\u4E45\u4E39\u836F\u540D\u79F0 = new Set(\u6C38\u4E45\u4E39\u836F.map((item) => item.\u540D\u79F0));
var \u8D2D\u4E70\u5373\u751F\u6548\u7279\u6B8A\u9053\u5177 = /* @__PURE__ */ new Set(["\u6539\u53D8\u9635\u6CD5", "\u6B32\u6D77\u56DE\u58F0", "\u6295\u6B32\u94A5"]);
var \u81EA\u7528\u6D88\u8017\u540D\u79F0 = new Set(\u7279\u6B8A\u9053\u5177.filter((item) => !\u8D2D\u4E70\u5373\u751F\u6548\u7279\u6B8A\u9053\u5177.has(item.\u540D\u79F0)).map((item) => item.\u540D\u79F0));
var \u573A\u666F\u540D\u79F0 = new Set(\u7279\u6B8A\u573A\u666F.map((item) => item.\u540D\u79F0));
var \u5267\u60C5\u540D\u79F0 = new Set(\u7279\u6B8A\u5267\u60C5.map((item) => item.\u540D\u79F0));
function getItemLifecycle(name) {
  if (\u8D2D\u4E70\u5373\u751F\u6548\u7279\u6B8A\u9053\u5177.has(name)) return "\u8D2D\u4E70\u5373\u751F\u6548";
  if (\u573A\u666F\u540D\u79F0.has(name)) return "\u89E3\u9501\u573A\u666F";
  if (\u5267\u60C5\u540D\u79F0.has(name)) return "\u89E3\u9501\u5267\u60C5";
  if (\u6C38\u4E45\u4E39\u836F\u540D\u79F0.has(name)) return "\u76EE\u6807\u6D88\u8017";
  if (\u81EA\u7528\u6D88\u8017\u540D\u79F0.has(name)) return "\u81EA\u7528\u6D88\u8017";
  if (\u670D\u88C5\u540D\u79F0.has(name) || \u88C5\u5907\u540D\u79F0.has(name)) return "\u53EF\u88C5\u5907";
  return "\u672A\u77E5";
}

// src/雌堕合欢宗/界面/data/phase2Rumor.ts
function inferRoutine(event) {
  if (event.\u6458\u8981.includes("\u542C\u98CE\u590D\u540D")) return "\u542C\u98CE\u590D\u540D";
  if (event.\u6458\u8981.includes("\u9634\u9633\u6C60\u9A8C\u8EAB")) return "\u9634\u9633\u6C60\u9A8C\u8EAB";
  if (event.\u6458\u8981.includes("\u6668\u8BFE\u70B9\u540D")) return "\u6668\u8BFE\u70B9\u540D";
  if (event.\u6458\u8981.includes("\u5BDD\u524D\u590D\u547D")) return "\u5BDD\u524D\u590D\u547D";
  return event.\u7C7B\u578B === "P2\u65E5\u8BFE" ? "\u5019\u547D\u542C\u8BAD" : event.\u7C7B\u578B;
}
function inferSource(event) {
  if (event.\u516C\u5F00\u5EA6 === "\u516C\u5F00" || event.\u540E\u679C\u6807\u7B7E.includes("\u516C\u5F00\u793A\u4F17")) return "\u516C\u5F00\u793A\u4F17";
  if (event.\u516C\u5F00\u5EA6 === "\u534A\u79C1\u5BC6") return "\u8C03\u6559\u4F59\u6CE2";
  if (event.\u540E\u679C\u6807\u7B7E.includes("\u652F\u914D\u8005\u4F20\u5524")) return "\u652F\u914D\u8005\u4F20\u5524";
  if (event.\u540E\u679C\u6807\u7B7E.includes("\u725D\u5370\u547D\u4EE4")) return "\u725D\u5370\u547D\u4EE4";
  return null;
}
function inferGaze(event) {
  if (event.\u6D89\u53CANPC.includes("\u67F3\u7D20\u8863")) return "\u638C\u95E8\u6CE8\u89C6";
  if (event.\u516C\u5F00\u5EA6 === "\u516C\u5F00" || event.\u540E\u679C\u6807\u7B7E.includes("\u516C\u5F00\u793A\u4F17")) return "\u5F1F\u5B50\u4F4E\u8BED";
  if (event.\u516C\u5F00\u5EA6 === "\u534A\u79C1\u5BC6") return "\u6267\u4E8B\u8BB0\u5F55";
  if (event.\u540E\u679C\u6807\u7B7E.includes("\u725D\u5370\u53D1\u70ED")) return "\u725D\u5370\u56DE\u54CD";
  return "NPC\u76EE\u5149";
}
function inferShameLevel(event) {
  if (event.\u540E\u679C\u6807\u7B7E.includes("\u70D9\u540D") || event.\u516C\u5F00\u5EA6 === "\u7981\u5730") return "\u70D9\u540D";
  if (event.\u540E\u679C\u6807\u7B7E.includes("\u516C\u5F00\u793A\u4F17") || event.\u516C\u5F00\u5EA6 === "\u516C\u5F00") return "\u6302\u724C";
  if (event.\u516C\u5F00\u5EA6 === "\u534A\u79C1\u5BC6") return "\u4F20\u5F00";
  return "\u5FAE\u95FB";
}
function urgentFor(level) {
  if (level === "\u6302\u724C" || level === "\u793A\u4F17" || level === "\u70D9\u540D") return "\u9AD8";
  if (level === "\u4F20\u5F00") return "\u4E2D";
  return "\u4F4E";
}
function buildRumorText(event, level) {
  const npc = event.\u6D89\u53CANPC[0] ?? "\u6267\u4E8B";
  if (level === "\u6302\u724C") return `${event.\u5730\u70B9}\u7684\u4F4E\u8BED\u5DF2\u7ECF\u6302\u4E0A\u540D\u518C\uFF0C${npc}\u7559\u4E0B\u7684\u6731\u6279\u8BA9\u4F60\u7684\u7F9E\u540D\u88AB\u4EBA\u53CD\u590D\u5FF5\u8D77\u3002`;
  if (level === "\u4F20\u5F00") return `${event.\u5730\u70B9}\u7684\u4F59\u6CE2\u5C1A\u672A\u6563\u53BB\uFF0C${npc}\u8BB0\u5F55\u4E0B\u90A3\u4E00\u6B21\u725D\u5370\u53D1\u70ED\u540E\u7684\u7EC6\u8282\u3002`;
  if (level === "\u70D9\u540D") return `${event.\u5730\u70B9}\u7684\u70D9\u75D5\u88AB\u725D\u5370\u8BB0\u4F4F\uFF0C${npc}\u7684\u76EE\u5149\u50CF\u4E00\u679A\u843D\u5B9A\u7684\u5370\u3002`;
  return `${event.\u5730\u70B9}\u6709\u4EBA\u4F4E\u58F0\u63D0\u8D77\u4F60\u7684\u65E5\u8BFE\uFF0C\u8BDD\u5C3E\u5E26\u7740\u672A\u6563\u7684\u725D\u5370\u4F59\u6E29\u3002`;
}
function createP2ShameRumorFromEvent(event) {
  if (!event.\u5DF2\u751F\u6210\u98CE\u58F0 && event.\u516C\u5F00\u5EA6 === "\u79C1\u5BC6") return null;
  const source = inferSource(event);
  if (!source) return null;
  const shameLevel = inferShameLevel(event);
  const routine = inferRoutine(event);
  const gaze = inferGaze(event);
  const tags = event.\u540E\u679C\u6807\u7B7E.slice(0, 8);
  return {
    id: `p2_shame_${event.id}`,
    \u6765\u6E90: source,
    \u5730\u70B9: event.\u5730\u70B9,
    \u5B50\u533A\u57DF: "",
    \u76F8\u5173NPC: event.\u6D89\u53CANPC,
    \u7D27\u6025\u5EA6: urgentFor(shameLevel),
    \u98CE\u58F0\u6587\u672C: buildRumorText(event, shameLevel),
    \u6545\u4E8B\u94A9\u5B50: `${routine}\u7559\u4E0B${gaze}\uFF0C\u53EF\u627F\u63A5\u4E3A\u4F20\u5524\u3001\u65E5\u8BFE\u5F02\u52A8\u3001\u516C\u5F00\u51DD\u89C6\u6216\u652F\u914D\u4E8B\u4EF6\u3002`,
    \u72B6\u6001: "\u672A\u8BFB",
    \u51DD\u89C6\u6765\u6E90: gaze,
    \u7F9E\u540D\u7B49\u7EA7: shameLevel,
    \u7F9E\u540D\u6807\u7B7E: tags,
    \u53CD\u566C\u65E5\u8BFE: routine,
    \u662F\u5426\u53EF\u627F\u63A5: true
  };
}

// src/雌堕合欢宗/界面/data/worldTime.ts
function createWorldEventRecord(input) {
  const type = input.action.\u7C7B\u578B ?? "\u672A\u77E5\u4E8B\u4EF6";
  const location = input.context.\u5730\u70B9 || "\u83B2\u706F\u524D\u82D1";
  return {
    id: `event_${input.time.\u5F53\u524D\u65E5}_${input.time.\u65F6\u8FB0}_${type}_${location}`,
    \u7C7B\u578B: type,
    \u6458\u8981: input.summary,
    \u65E5: input.time.\u5F53\u524D\u65E5,
    \u65F6\u8FB0: input.time.\u65F6\u8FB0,
    \u5730\u70B9: location,
    \u6D89\u53CANPC: input.context.\u5728\u573ANPC ?? [],
    \u516C\u5F00\u5EA6: input.context.\u516C\u5F00\u5EA6 ?? "\u516C\u5F00",
    \u540E\u679C\u6807\u7B7E: input.tags,
    \u5DF2\u751F\u6210\u98CE\u58F0: input.generatedRumor ?? false
  };
}

// src/雌堕合欢宗/界面/data/phase2Runtime.ts
var DEFAULT_ROUTINE = {
  \u65E5\u8BFE: "\u5019\u547D\u542C\u8BAD",
  \u652F\u914D\u8005: "\u7EAA\u5170",
  \u9ED8\u8BA4\u547D\u4EE4: "\u5782\u9996\u5019\u547D\uFF0C\u7B49\u5F85\u725D\u5370\u70B9\u540D"
};
var ROUTINES = [
  { \u65F6\u8FB0: "\u6668\u65F6", \u5730\u70B9: "\u83B2\u706F\u524D\u82D1", \u65E5\u8BFE: "\u6668\u8BFE\u70B9\u540D", \u652F\u914D\u8005: "\u7EAA\u5170", \u9ED8\u8BA4\u547D\u4EE4: "\u5728\u540D\u518C\u524D\u5E94\u58F0\uFF0C\u4E0D\u51C6\u8FDF\u7591" },
  { \u65F6\u8FB0: "\u5348\u65F6", \u5730\u70B9: "\u542C\u98CE\u5ECA", \u65E5\u8BFE: "\u542C\u98CE\u590D\u540D", \u652F\u914D\u8005: "\u7EAA\u5170", \u9ED8\u8BA4\u547D\u4EE4: "\u590D\u8FF0\u4ECA\u65E5\u7F9E\u540D\uFF0C\u8BB0\u5165\u98CE\u58F0" },
  { \u65F6\u8FB0: "\u9149\u65F6", \u5730\u70B9: "\u9634\u9633\u6C60", \u65E5\u8BFE: "\u9634\u9633\u6C60\u9A8C\u8EAB", \u652F\u914D\u8005: "\u6C88\u6708\u79CB", \u9ED8\u8BA4\u547D\u4EE4: "\u8DEA\u5019\u9A8C\u8EAB\uFF0C\u4E0D\u51C6\u906E\u4F4F\u725D\u5370" },
  { \u65F6\u8FB0: "\u4EA5\u65F6", \u5730\u70B9: "\u638C\u95E8\u6BBF\u504F\u6BBF", \u65E5\u8BFE: "\u5BDD\u524D\u590D\u547D", \u652F\u914D\u8005: "\u67F3\u7D20\u8863", \u9ED8\u8BA4\u547D\u4EE4: "\u8DEA\u524D\u590D\u547D\uFF0C\u4EA4\u4EE3\u4ECA\u65E5\u8C03\u6559\u4F59\u6CE2" }
];
function isSamePlace(expected, actual) {
  return expected.includes(actual) || actual.includes(expected);
}
function shameLevelFor(publicity, tags) {
  if (tags.includes("\u516C\u5F00\u793A\u4F17") || publicity === "\u516C\u5F00") return "\u6302\u724C";
  if (publicity === "\u534A\u79C1\u5BC6") return "\u4F20\u5F00";
  if (publicity === "\u7981\u5730") return "\u70D9\u540D";
  return "\u5FAE\u95FB";
}
function commandStrengthFor(publicity, tags) {
  if (tags.includes("\u516C\u5F00\u793A\u4F17") || publicity === "\u516C\u5F00") return 70;
  if (publicity === "\u534A\u79C1\u5BC6") return 55;
  if (publicity === "\u7981\u5730") return 80;
  return 40;
}
function getP2RoutineByTime(input) {
  const location = input.\u5730\u70B9 ?? "";
  const exact = ROUTINES.find((routine) => routine.\u65F6\u8FB0 === input.\u65F6\u8FB0 && location && isSamePlace(routine.\u5730\u70B9, location));
  if (exact) return { \u65E5\u8BFE: exact.\u65E5\u8BFE, \u652F\u914D\u8005: exact.\u652F\u914D\u8005, \u9ED8\u8BA4\u547D\u4EE4: exact.\u9ED8\u8BA4\u547D\u4EE4 };
  const byTime = ROUTINES.find((routine) => routine.\u65F6\u8FB0 === input.\u65F6\u8FB0);
  if (byTime) return { \u65E5\u8BFE: byTime.\u65E5\u8BFE, \u652F\u914D\u8005: byTime.\u652F\u914D\u8005, \u9ED8\u8BA4\u547D\u4EE4: byTime.\u9ED8\u8BA4\u547D\u4EE4 };
  return DEFAULT_ROUTINE;
}
function appendTrainingRecord(existing, record) {
  return [...existing, record].slice(-10);
}
function settleP2TrainingEvent(input) {
  const routine = getP2RoutineByTime({ \u65F6\u8FB0: input.event.\u65F6\u8FB0, \u5730\u70B9: input.event.\u5730\u70B9 });
  const dominator = input.event.\u652F\u914D\u8005 ?? routine.\u652F\u914D\u8005;
  const summary = `${dominator}\u5728${input.event.\u5730\u70B9}\u6267\u884C${routine.\u65E5\u8BFE}\uFF1A${input.event.\u547D\u4EE4}\u3002`;
  const shameLevel = shameLevelFor(input.event.\u516C\u5F00\u5EA6, input.event.\u540E\u679C\u6807\u7B7E);
  const generatedRumor = input.event.\u516C\u5F00\u5EA6 === "\u516C\u5F00" || input.event.\u540E\u679C\u6807\u7B7E.includes("\u516C\u5F00\u793A\u4F17");
  const record = {
    id: `p2_${input.event.\u65F6\u8FB0}_${input.event.\u5730\u70B9}_${dominator}_${input.state.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570 + 1}`,
    \u65F6\u8FB0: input.event.\u65F6\u8FB0,
    \u652F\u914D\u8005: dominator,
    \u6458\u8981: summary,
    \u7F9E\u540D\u7B49\u7EA7: shameLevel
  };
  const next = {
    ...input.state,
    \u5F53\u524D\u65E5\u8BFE: routine.\u65E5\u8BFE,
    \u5F53\u524D\u652F\u914D\u8005: dominator,
    \u5F53\u524D\u547D\u4EE4: input.event.\u547D\u4EE4,
    \u547D\u4EE4\u5F3A\u5EA6: commandStrengthFor(input.event.\u516C\u5F00\u5EA6, input.event.\u540E\u679C\u6807\u7B7E),
    \u4ECA\u65E5\u8C03\u6559\u6B21\u6570: input.state.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570 + 1,
    \u6700\u8FD1\u8C03\u6559\u7ED3\u7B97: summary,
    \u8C03\u6559\u8BB0\u5F55: appendTrainingRecord(input.state.\u8C03\u6559\u8BB0\u5F55, record),
    \u652F\u914D\u6B21\u6570: {
      ...input.state.\u652F\u914D\u6B21\u6570,
      [dominator]: (input.state.\u652F\u914D\u6B21\u6570[dominator] ?? 0) + 1
    }
  };
  const worldEvent = createWorldEventRecord({
    action: { \u7C7B\u578B: "P2\u65E5\u8BFE" },
    time: { \u5F53\u524D\u65E5: 1, \u65F6\u8FB0: input.event.\u65F6\u8FB0 },
    context: { \u5730\u70B9: input.event.\u5730\u70B9, \u516C\u5F00\u5EA6: input.event.\u516C\u5F00\u5EA6, \u5728\u573ANPC: [dominator] },
    tags: input.event.\u540E\u679C\u6807\u7B7E,
    summary,
    generatedRumor
  });
  return { next, worldEvent, shameRumor: createP2ShameRumorFromEvent(worldEvent) };
}

// src/雌堕合欢宗/脚本/后端校验/validate.ts
var NPC\u5217\u8868 = ["\u767D\u82B7", "\u82CF\u82B8", "\u7EAA\u5170", "\u6C88\u6708\u79CB", "\u67F3\u7D20\u8863"];
var NPC_SET = new Set(NPC\u5217\u8868);
var TIME_NAMES = ["\u6668\u65F6", "\u5348\u65F6", "\u9149\u65F6", "\u4EA5\u65F6"];
var TIME_NAME_SET = new Set(TIME_NAMES);
function coerceNumeric(value, max = 100, min = 0) {
  if (value === null || value === void 0) return min;
  if (typeof value === "number") {
    if (isNaN(value)) return min;
    if (!isFinite(value)) return max;
    return Math.max(min, Math.min(max, value));
  }
  if (typeof value === "string") {
    const num = Number(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }
  return min;
}
function normalizeTimeName(value, fallback = "\u6668\u65F6") {
  if (typeof value !== "string") return TIME_NAME_SET.has(fallback) ? fallback : "\u6668\u65F6";
  if (TIME_NAME_SET.has(value)) return value;
  if (/卯|辰|巳|早|晨/.test(value)) return "\u6668\u65F6";
  if (/午|未|昼/.test(value)) return "\u5348\u65F6";
  if (/申|酉|戌|暮|晚/.test(value)) return "\u9149\u65F6";
  if (/亥|子|丑|寅|夜/.test(value)) return "\u4EA5\u65F6";
  return TIME_NAME_SET.has(fallback) ? fallback : "\u6668\u65F6";
}
function normalizeTimeFields(new_data, old_data) {
  const fallback = normalizeTimeName(import_lodash.default.get(old_data, "\u7CFB\u7EDF.\u65F6\u8FB0", "\u6668\u65F6"));
  const currentTime = normalizeTimeName(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0"), fallback);
  import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0", currentTime);
  const events = import_lodash.default.get(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", []);
  if (Array.isArray(events)) {
    for (const event of events) {
      if (import_lodash.default.isPlainObject(event)) {
        event.\u65F6\u8FB0 = normalizeTimeName(event.\u65F6\u8FB0, currentTime);
      }
    }
  }
  const trainingRecords = import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  if (Array.isArray(trainingRecords)) {
    for (const record of trainingRecords) {
      if (import_lodash.default.isPlainObject(record)) {
        record.\u65F6\u8FB0 = normalizeTimeName(record.\u65F6\u8FB0, currentTime);
      }
    }
  }
}
function ensureV4SystemFields(new_data) {
  if (!import_lodash.default.has(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0")) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0", "\u6668\u65F6");
  if (!import_lodash.default.has(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F")) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F", "\u83B2\u706F\u524D\u82D1");
  if (!Array.isArray(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92"))) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92", []);
  if (!import_lodash.default.isPlainObject(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001"))) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001", {
      \u5F53\u524D\u65E5: 1,
      \u65F6\u6BB5\u8FDB\u5EA6: 0,
      \u6700\u8FD1\u8017\u65F6: "",
      \u6700\u8FD1\u7ED3\u7B97\u539F\u56E0: "",
      \u6700\u8FD1\u4E8B\u4EF6\u7C7B\u578B: "",
      \u662F\u5426\u8FC7\u591C: false
    });
  }
  if (!import_lodash.default.isPlainObject(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001"))) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001", {
      \u641C\u5BFB\u8FDB\u5EA6: 0,
      \u8B66\u6212\u7B49\u7EA7: "\u5E73\u9759",
      \u906E\u853D\u5269\u4F59\u65F6\u6BB5: 0,
      \u906E\u853D\u6765\u6E90: "",
      \u6700\u8FD1\u66B4\u9732\u539F\u56E0: "",
      \u5DF2\u88AB\u5B9A\u4F4D: false
    });
  }
  if (!import_lodash.default.isPlainObject(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587"))) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587", {
      \u5730\u70B9: import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F", "\u83B2\u706F\u524D\u82D1"),
      \u5B50\u533A\u57DF: "",
      \u573A\u666F\u6765\u6E90: "\u6838\u5FC3\u5730\u70B9",
      \u516C\u5F00\u5EA6: "\u516C\u5F00",
      \u5728\u573ANPC: [],
      NPC\u6D3B\u52A8: {},
      \u6C1B\u56F4: [],
      \u6545\u4E8B\u94A9\u5B50: [],
      \u7279\u6B8A\u4E8B\u4EF6: ""
    });
  }
  if (!Array.isArray(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u98CE\u58F0\u5217\u8868"))) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u98CE\u58F0\u5217\u8868", []);
  if (!Array.isArray(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD"))) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD", []);
  if (!import_lodash.default.has(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID")) import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID", "");
  if (!Array.isArray(import_lodash.default.get(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55"))) import_lodash.default.set(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", []);
  if (!Array.isArray(import_lodash.default.get(new_data, "\u5267\u60C5.\u5DF2\u89E3\u9501"))) import_lodash.default.set(new_data, "\u5267\u60C5.\u5DF2\u89E3\u9501", []);
  if (!import_lodash.default.isPlainObject(import_lodash.default.get(new_data, "\u5267\u60C5.\u7EBF\u7D22\u72B6\u6001"))) import_lodash.default.set(new_data, "\u5267\u60C5.\u7EBF\u7D22\u72B6\u6001", {});
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE") || import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE", "\u5019\u547D");
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005") || import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005", "");
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u5F53\u524D\u547D\u4EE4") || import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u547D\u4EE4") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u5F53\u524D\u547D\u4EE4", "");
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6") || import_lodash.default.get(new_data, "\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6", 0);
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570") || import_lodash.default.get(new_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", 0);
  if (!Array.isArray(import_lodash.default.get(new_data, "\u725D\u5974.\u5F85\u6267\u884C\u65E5\u8BFE"))) import_lodash.default.set(new_data, "\u725D\u5974.\u5F85\u6267\u884C\u65E5\u8BFE", []);
  if (!import_lodash.default.has(new_data, "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97") || import_lodash.default.get(new_data, "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97") === null) import_lodash.default.set(new_data, "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", "");
  if (!Array.isArray(import_lodash.default.get(new_data, "\u725D\u5974.\u7F9E\u540D\u6807\u7B7E"))) import_lodash.default.set(new_data, "\u725D\u5974.\u7F9E\u540D\u6807\u7B7E", []);
  if (!Array.isArray(import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55"))) import_lodash.default.set(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
}
function mergeEventLedger(new_data, old_data) {
  const oldEvents = import_lodash.default.get(old_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", []);
  const newEvents = import_lodash.default.get(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", []);
  if (!Array.isArray(oldEvents) || !Array.isArray(newEvents)) return;
  const byId = /* @__PURE__ */ new Map();
  const merged = [];
  for (const event of [...oldEvents, ...newEvents]) {
    if (!import_lodash.default.isPlainObject(event)) continue;
    const id = typeof event.id === "string" && event.id.trim() ? event.id : JSON.stringify(event);
    const existingIndex = byId.get(id);
    if (existingIndex === void 0) {
      byId.set(id, merged.length);
      merged.push(event);
    } else {
      merged[existingIndex] = event;
    }
  }
  import_lodash.default.set(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", merged.slice(-20));
}
function getSoulEchoSemanticKey(echo) {
  if (!import_lodash.default.isPlainObject(echo)) return "";
  const npc = typeof echo.npc === "string" ? echo.npc.trim() : "";
  const text = typeof echo.text === "string" ? echo.text.trim() : "";
  const scene = typeof echo.scene === "string" ? echo.scene.trim() : "";
  const time = typeof echo.time === "string" ? echo.time.trim() : "";
  return npc && text && scene && time ? `${npc}\0${text}\0${scene}\0${time}` : "";
}
function normalizeSoulEchoLedger(new_data) {
  const echoes = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD", []);
  if (!Array.isArray(echoes)) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD", []);
    return;
  }
  const seenIds = /* @__PURE__ */ new Set();
  const seenSemanticKeys = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const echo of echoes) {
    if (!import_lodash.default.isPlainObject(echo)) continue;
    const id = typeof echo.id === "string" ? echo.id.trim() : "";
    if (id && seenIds.has(id)) continue;
    const semanticKey = getSoulEchoSemanticKey(echo);
    if (semanticKey && seenSemanticKeys.has(semanticKey)) continue;
    if (id) seenIds.add(id);
    if (semanticKey) seenSemanticKeys.add(semanticKey);
    normalized.push(echo);
  }
  import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD", normalized.slice(-12));
}
function isEmptyP2Runtime(new_data) {
  return (import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE", "\u5019\u547D") === "\u5019\u547D" || !import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE")) && !import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005") && !import_lodash.default.get(new_data, "\u725D\u5974.\u5F53\u524D\u547D\u4EE4") && coerceNumeric(import_lodash.default.get(new_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", 0), 99, 0) === 0 && Array.isArray(import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", [])) && import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []).length === 0;
}
function findLatestP2TrainingEvent(new_data) {
  const events = import_lodash.default.get(new_data, "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", []);
  if (!Array.isArray(events)) return null;
  for (const event of [...events].reverse()) {
    if (!import_lodash.default.isPlainObject(event)) continue;
    const tags = Array.isArray(event.\u540E\u679C\u6807\u7B7E) ? event.\u540E\u679C\u6807\u7B7E.map(String) : [];
    const haystack = [event.\u7C7B\u578B, event.\u6458\u8981, event.\u5730\u70B9, ...tags].filter(Boolean).join(" ");
    if (/调教|羞辱|服从|深度亲密|NSFW|欲海/.test(haystack)) return event;
  }
  const sceneEvent = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u7279\u6B8A\u4E8B\u4EF6", "");
  if (typeof sceneEvent === "string" && /调教|羞辱|服从|深度亲密|NSFW|欲海/.test(sceneEvent)) {
    return {
      \u7C7B\u578B: sceneEvent,
      \u6458\u8981: sceneEvent,
      \u65F6\u8FB0: import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0", "\u6668\u65F6"),
      \u5730\u70B9: import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u5730\u70B9", import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F", "\u83B2\u706F\u524D\u82D1")),
      \u6D89\u53CANPC: import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u5728\u573ANPC", []),
      \u516C\u5F00\u5EA6: import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u516C\u5F00\u5EA6", "\u534A\u79C1\u5BC6"),
      \u540E\u679C\u6807\u7B7E: [sceneEvent]
    };
  }
  return null;
}
function pickP2Dominator(event, new_data) {
  const candidates = [
    ...Array.isArray(event.\u6D89\u53CANPC) ? event.\u6D89\u53CANPC : [],
    ...Array.isArray(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u5728\u573ANPC")) ? import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u5728\u573ANPC") : []
  ];
  const npc = candidates.find((name) => typeof name === "string" && NPC_SET.has(name));
  return npc;
}
function inferP2Command(event, new_data) {
  const summary = typeof event.\u6458\u8981 === "string" ? event.\u6458\u8981 : "";
  if (summary) return summary;
  const npcActivities = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.NPC\u6D3B\u52A8", {});
  if (import_lodash.default.isPlainObject(npcActivities)) {
    const activity = Object.values(npcActivities).find((value) => typeof value === "string" && value.trim());
    if (typeof activity === "string") return activity;
  }
  const hook = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u6545\u4E8B\u94A9\u5B50.0", "");
  if (typeof hook === "string" && hook) return hook;
  return "\u5782\u9996\u670D\u4ECE\u5F53\u524D\u725D\u5370\u547D\u4EE4";
}
function autoSettleP2TrainingFallback(new_data) {
  if (import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u9636\u6BB5") !== "\u725D\u5974\u671F") return;
  if (!isEmptyP2Runtime(new_data)) return;
  const event = findLatestP2TrainingEvent(new_data);
  if (!event) return;
  const result = settleP2TrainingEvent({
    state: import_lodash.default.get(new_data, "\u725D\u5974"),
    event: {
      \u65F6\u8FB0: import_lodash.default.get(event, "\u65F6\u8FB0", import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u65F6\u8FB0", "\u6668\u65F6")),
      \u5730\u70B9: import_lodash.default.get(event, "\u5730\u70B9", import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u5730\u70B9", import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F", "\u83B2\u706F\u524D\u82D1"))),
      \u652F\u914D\u8005: pickP2Dominator(event, new_data),
      \u547D\u4EE4: inferP2Command(event, new_data),
      \u516C\u5F00\u5EA6: import_lodash.default.get(event, "\u516C\u5F00\u5EA6", import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.\u516C\u5F00\u5EA6", "\u534A\u79C1\u5BC6")),
      \u540E\u679C\u6807\u7B7E: Array.isArray(event.\u540E\u679C\u6807\u7B7E) ? event.\u540E\u679C\u6807\u7B7E.map(String) : []
    }
  });
  import_lodash.default.set(new_data, "\u725D\u5974", result.next);
}
function normalizeP2DominanceCounts(new_data, old_data) {
  if (import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u9636\u6BB5") !== "\u725D\u5974\u671F") return;
  const oldRecords = import_lodash.default.get(old_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  const newRecords = import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  if (!Array.isArray(oldRecords) || !Array.isArray(newRecords)) return;
  const oldIds = oldRecords.map((record) => import_lodash.default.isPlainObject(record) ? record.id : "").filter(Boolean);
  const newIds = newRecords.map((record) => import_lodash.default.isPlainObject(record) ? record.id : "").filter(Boolean);
  const hasNewTrainingRecord = newIds.some((id) => !oldIds.includes(id));
  if (hasNewTrainingRecord) return;
  for (const npc of NPC\u5217\u8868) {
    import_lodash.default.set(new_data, `\u725D\u5974.\u652F\u914D\u6B21\u6570.${npc}`, coerceNumeric(import_lodash.default.get(old_data, `\u725D\u5974.\u652F\u914D\u6B21\u6570.${npc}`, 0), 99, 0));
  }
}
function preserveP2TrainingLedger(new_data, old_data) {
  if (import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u9636\u6BB5") !== "\u725D\u5974\u671F") return;
  const oldRecords = import_lodash.default.get(old_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  const newRecords = import_lodash.default.get(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  if (!Array.isArray(oldRecords) || !Array.isArray(newRecords)) return;
  if (oldRecords.length === 0 || newRecords.length > 0) return;
  import_lodash.default.set(new_data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", oldRecords);
  import_lodash.default.set(new_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", coerceNumeric(import_lodash.default.get(old_data, "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", oldRecords.length), 99, 0));
  import_lodash.default.set(new_data, "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", import_lodash.default.get(old_data, "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", ""));
}
function validateVariables(new_data, old_data) {
  ensureV4SystemFields(new_data);
  normalizeSoulEchoLedger(new_data);
  mergeEventLedger(new_data, old_data);
  normalizeTimeFields(new_data, old_data);
  for (const npc of NPC\u5217\u8868) {
    import_lodash.default.set(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, coerceNumeric(import_lodash.default.get(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0), 100, 0));
    import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, coerceNumeric(import_lodash.default.get(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0), 100, 0));
    import_lodash.default.set(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, coerceNumeric(import_lodash.default.get(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, 0), 3, 0));
  }
  import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u7075\u77F3", coerceNumeric(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u7075\u77F3", 0), Infinity, 0));
  import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", coerceNumeric(import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", 30), 30, 0));
  import_lodash.default.set(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", coerceNumeric(import_lodash.default.get(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", 0), 100, 0));
  import_lodash.default.set(new_data, "\u725D\u5974.\u725D\u9634\u51B3\u5C42\u6570", coerceNumeric(import_lodash.default.get(new_data, "\u725D\u5974.\u725D\u9634\u51B3\u5C42\u6570", 0), 9, 0));
  const \u5269\u4F59\u5929\u6570 = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", 30);
  const old_\u9636\u6BB5 = import_lodash.default.get(old_data, "\u7CFB\u7EDF.\u9636\u6BB5", "\u653B\u7565\u671F");
  if (\u5269\u4F59\u5929\u6570 <= 0 && old_\u9636\u6BB5 === "\u653B\u7565\u671F") {
    initializePhase2(new_data);
    return;
  }
  const \u5F53\u524D\u9636\u6BB5 = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u9636\u6BB5", "\u653B\u7565\u671F");
  if (\u5F53\u524D\u9636\u6BB5 === "\u725D\u5974\u671F") {
    for (const npc of NPC\u5217\u8868) {
      import_lodash.default.set(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, import_lodash.default.get(old_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0));
      import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, import_lodash.default.get(old_data, `NPC.${npc}.\u653B\u7565\u503C`, 0));
      import_lodash.default.set(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, import_lodash.default.get(old_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, 0));
    }
    autoSettleP2TrainingFallback(new_data);
    preserveP2TrainingLedger(new_data, old_data);
    normalizeP2DominanceCounts(new_data, old_data);
  }
  const npcStates = {};
  for (const npc of NPC\u5217\u8868) {
    npcStates[npc] = { \u72B6\u6001: import_lodash.default.get(new_data, `NPC.${npc}.\u72B6\u6001`, "\u672A\u5F00\u59CB") };
  }
  const currentNpc = getCurrentNpc(npcStates);
  for (const npc of NPC\u5217\u8868) {
    const old_\u597D\u611F\u5EA6 = import_lodash.default.get(old_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0);
    const new_\u597D\u611F\u5EA6 = import_lodash.default.get(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0);
    const old_\u653B\u7565\u503C = import_lodash.default.get(old_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
    const new_\u653B\u7565\u503C = import_lodash.default.get(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
    if (new_\u597D\u611F\u5EA6 < 30 && new_\u653B\u7565\u503C !== 0) {
      import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
      continue;
    }
    if (new_\u653B\u7565\u503C < old_\u653B\u7565\u503C) {
      import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, old_\u653B\u7565\u503C);
      continue;
    }
    if (new_\u653B\u7565\u503C > old_\u653B\u7565\u503C) {
      if (!canIncrease\u653B\u7565\u503C(npc, currentNpc, new_\u597D\u611F\u5EA6)) {
        import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, old_\u653B\u7565\u503C);
      }
    }
  }
  const \u88C5\u5907\u76EE\u6807 = ["\u73A9\u5BB6", "\u767D\u82B7", "\u82CF\u82B8", "\u7EAA\u5170", "\u6C88\u6708\u79CB", "\u67F3\u7D20\u8863"];
  for (const target of \u88C5\u5907\u76EE\u6807) {
    const new_equipped = import_lodash.default.get(new_data, `\u9053\u5177.\u88C5\u5907.${target}`, []);
    if (!Array.isArray(new_equipped) || new_equipped.length === 0) continue;
    const npc\u597D\u611F\u5EA6 = target === "\u73A9\u5BB6" ? 100 : import_lodash.default.get(new_data, `NPC.${target}.\u597D\u611F\u5EA6`, 0);
    const valid = new_equipped.filter((item) => {
      if (target === "\u73A9\u5BB6") return true;
      return checkItemThreshold(npc\u597D\u611F\u5EA6, item);
    });
    if (valid.length !== new_equipped.length) {
      import_lodash.default.set(new_data, `\u9053\u5177.\u88C5\u5907.${target}`, valid);
    }
  }
  const old_\u62E5\u6709\u6539\u53D8\u9635\u6CD5 = import_lodash.default.get(old_data, "\u9053\u5177.\u62E5\u6709.\u6539\u53D8\u9635\u6CD5", 0);
  const new_\u62E5\u6709\u6539\u53D8\u9635\u6CD5 = import_lodash.default.get(new_data, "\u9053\u5177.\u62E5\u6709.\u6539\u53D8\u9635\u6CD5", 0);
  if (old_\u62E5\u6709\u6539\u53D8\u9635\u6CD5 === 0 && new_\u62E5\u6709\u6539\u53D8\u9635\u6CD5 >= 1) {
    const \u67F3\u7D20\u8863\u653B\u7565\u503C = import_lodash.default.get(new_data, "NPC.\u67F3\u7D20\u8863.\u653B\u7565\u503C", 0);
    if (\u67F3\u7D20\u8863\u653B\u7565\u503C < 100) {
      import_lodash.default.set(new_data, "\u9053\u5177.\u62E5\u6709.\u6539\u53D8\u9635\u6CD5", 0);
      const \u5F53\u524D\u7075\u77F3 = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u7075\u77F3", 0);
      import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u7075\u77F3", \u5F53\u524D\u7075\u77F3 + 5e5);
    }
  }
  for (const npc of NPC\u5217\u8868) {
    const \u7C98\u6EDE\u8BA1\u6570 = import_lodash.default.get(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, 0);
    const \u597D\u611F\u5EA6 = import_lodash.default.get(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0);
    const \u5F53\u524D\u653B\u7565\u503C = import_lodash.default.get(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
    if (\u7C98\u6EDE\u8BA1\u6570 > 3) {
      import_lodash.default.set(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, 0);
      continue;
    }
    if (\u7C98\u6EDE\u8BA1\u6570 >= 3 && \u597D\u611F\u5EA6 >= 30) {
      const \u589E\u91CF = calculate\u653B\u7565\u503C\u589E\u91CF(10, \u597D\u611F\u5EA6);
      const \u65B0\u653B\u7565\u503C = Math.min(\u5F53\u524D\u653B\u7565\u503C + \u589E\u91CF, 100);
      import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, \u65B0\u653B\u7565\u503C);
      import_lodash.default.set(new_data, `NPC.${npc}.\u7C98\u6EDE\u8BA1\u6570`, 0);
    }
  }
  const \u7075\u77F3 = import_lodash.default.get(new_data, "\u7CFB\u7EDF.\u7075\u77F3", 0);
  if (\u7075\u77F3 < 0) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u7075\u77F3", 0);
  }
  if (\u5F53\u524D\u9636\u6BB5 === "\u725D\u5974\u671F") {
    const old_\u5815\u843D\u5EA6 = import_lodash.default.get(old_data, "\u725D\u5974.\u5815\u843D\u5EA6", 0);
    const new_\u5815\u843D\u5EA6 = import_lodash.default.get(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", 0);
    if (new_\u5815\u843D\u5EA6 < old_\u5815\u843D\u5EA6) {
      import_lodash.default.set(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", old_\u5815\u843D\u5EA6);
    }
  }
  const \u725D\u9634\u51B3\u5C42\u6570 = import_lodash.default.get(new_data, "\u725D\u5974.\u725D\u9634\u51B3\u5C42\u6570", 0);
  if (\u725D\u9634\u51B3\u5C42\u6570 > 9) {
    import_lodash.default.set(new_data, "\u725D\u5974.\u725D\u9634\u51B3\u5C42\u6570", 9);
  }
  const \u5929\u6570\u53D6\u6574 = Math.floor(\u5269\u4F59\u5929\u6570);
  if (\u5929\u6570\u53D6\u6574 !== \u5269\u4F59\u5929\u6570) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", \u5929\u6570\u53D6\u6574);
  }
  if (\u5929\u6570\u53D6\u6574 < 0) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", 0);
  }
  if (\u5929\u6570\u53D6\u6574 > 30) {
    import_lodash.default.set(new_data, "\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570", 30);
  }
  for (const npc of NPC\u5217\u8868) {
    const \u597D\u611F\u5EA6 = import_lodash.default.get(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0);
    const \u653B\u7565\u503C = import_lodash.default.get(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
    if (\u597D\u611F\u5EA6 < 0) import_lodash.default.set(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 0);
    if (\u597D\u611F\u5EA6 > 100) import_lodash.default.set(new_data, `NPC.${npc}.\u597D\u611F\u5EA6`, 100);
    if (\u653B\u7565\u503C < 0) import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 0);
    if (\u653B\u7565\u503C > 100) import_lodash.default.set(new_data, `NPC.${npc}.\u653B\u7565\u503C`, 100);
  }
  const \u5815\u843D\u5EA6 = import_lodash.default.get(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", 0);
  if (\u5815\u843D\u5EA6 < 0) import_lodash.default.set(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", 0);
  if (\u5815\u843D\u5EA6 > 100) import_lodash.default.set(new_data, "\u725D\u5974.\u5815\u843D\u5EA6", 100);
}

// src/雌堕合欢宗/界面/data/itemDisplay.ts
var outfitByName = new Map(\u670D\u88C5\u5217\u8868.map((outfit) => [outfit.\u540D\u79F0, outfit]));
var contrabandByName = new Map(NSFW\u9053\u5177.map((item) => [item.\u540D\u79F0, item]));
var pillByName = new Map(\u6C38\u4E45\u4E39\u836F.map((item) => [item.\u540D\u79F0, item]));
var sceneByName = new Map(\u7279\u6B8A\u573A\u666F.map((scene) => [scene.\u540D\u79F0, scene]));
var storyByName = new Map(\u7279\u6B8A\u5267\u60C5.map((story) => [story.\u540D\u79F0, story]));
var specialByName = new Map(\u7279\u6B8A\u9053\u5177.map((special) => [special.\u540D\u79F0, special]));
var p2ArtifactNames = new Set([...NSFW\u9053\u5177, ...\u725D\u5974\u9053\u5177, ...\u725D\u5974\u670D\u88C5\u5217\u8868].map((item) => item.\u540D\u79F0));
function getItemDisplayName(logicName) {
  return outfitByName.get(logicName)?.\u663E\u793A\u540D ?? contrabandByName.get(logicName)?.\u663E\u793A\u540D ?? pillByName.get(logicName)?.\u663E\u793A\u540D ?? sceneByName.get(logicName)?.\u663E\u793A\u540D ?? storyByName.get(logicName)?.\u663E\u793A\u540D ?? specialByName.get(logicName)?.\u663E\u793A\u540D ?? logicName;
}
function getItemShortHint(logicName) {
  return outfitByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? contrabandByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? pillByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? sceneByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? storyByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? specialByName.get(logicName)?.AI\u77ED\u63D0\u793A ?? "";
}
function getContrabandTier(logicName) {
  return contrabandByName.get(logicName)?.\u5668\u9636 ?? "";
}
function getContrabandBodyPart(logicName) {
  return contrabandByName.get(logicName)?.\u4F5C\u7528\u90E8\u4F4D ?? "";
}

// src/雌堕合欢宗/脚本/服装叙事注入/contrabandPrompt.ts
var PROMPT_ID_VISIBLE = "hehuan-current-contraband-summary";
var PROMPT_ID_SCAN = "hehuan-current-contraband-scan";
var contrabandNames = new Set(NSFW\u9053\u5177.map((item) => item.\u540D\u79F0));
function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}
function isContraband(item) {
  return contrabandNames.has(item);
}
function formatEquippedLine(target, items) {
  const names = items.map((item) => `${getItemDisplayName(item)}\uFF08${item}\uFF0C${getContrabandTier(item)}/${getContrabandBodyPart(item)}\uFF09`).join("\u3001");
  const hints = items.map((item) => getItemShortHint(item)).filter(Boolean).join("\uFF1B");
  return hints ? `${target}\uFF1A${names}\u3002${hints}` : `${target}\uFF1A${names}\u3002`;
}
function buildContrabandPrompt(data) {
  const equipment = data.\u9053\u5177?.\u88C5\u5907 ?? {};
  const presentNpcs = data.\u7CFB\u7EDF?.\u573A\u666F\u4E0A\u4E0B\u6587?.\u5728\u573ANPC ?? [];
  const targets = uniq(["\u73A9\u5BB6", ...presentNpcs]);
  const entries = targets.map((target) => ({ target, items: (equipment[target] ?? []).filter(isContraband) })).filter((entry) => entry.items.length > 0);
  if (entries.length === 0) return null;
  const lines = entries.map((entry) => formatEquippedLine(entry.target, entry.items));
  const equippedItems = targets.flatMap((target) => (equipment[target] ?? []).filter(isContraband));
  const actionItems = (data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? []).filter((action) => ["\u88C5\u5907\u9053\u5177", "\u5378\u4E0B"].includes(action.\u7C7B\u578B ?? "")).map((action) => action.\u9053\u5177 ?? "").filter(isContraband);
  const scanNames = uniq([...equippedItems, ...actionItems]);
  const scanTokens = uniq([
    "\u7981\u5668\u53D9\u4E8B\u89C4\u5219",
    "\u7981\u5668",
    "\u5668\u9636",
    "\u4F5C\u7528\u90E8\u4F4D",
    "\u9053\u5177.\u88C5\u5907",
    ...(data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? []).map((action) => action.\u7C7B\u578B ?? "").filter((type) => ["\u88C5\u5907\u9053\u5177", "\u5378\u4E0B"].includes(type)),
    ...scanNames,
    ...scanNames.map(getItemDisplayName),
    ...scanNames.map(getContrabandTier),
    ...scanNames.map(getContrabandBodyPart)
  ]);
  return {
    visible: {
      id: PROMPT_ID_VISIBLE,
      position: "in_chat",
      depth: 0,
      role: "system",
      content: `\u5F53\u524D\u7981\u5668\u951A\u70B9\uFF1A${lines.join(" ")}\u6309\u573A\u666F\u516C\u5F00\u5EA6\u5199\u58F0\u97F3\u3001\u59FF\u6001\u3001\u8863\u6599\u75D5\u8FF9\u3001\u5668\u5B98\u89E6\u53D1\u548C\u88AB\u770B\u89C1\u7684\u7F9E\u803B\uFF1B\u4E0D\u8981\u6BCF\u56DE\u5408\u673A\u68B0\u590D\u8FF0\uFF0C\u4E0D\u76F4\u63A5\u6539\u53D8\u91CF\u3002`,
      should_scan: false
    },
    scan: {
      id: PROMPT_ID_SCAN,
      position: "none",
      depth: 0,
      role: "system",
      content: scanTokens.join(" "),
      should_scan: true
    }
  };
}

// src/雌堕合欢宗/脚本/服装叙事注入/outfitPrompt.ts
var PROMPT_ID_VISIBLE2 = "hehuan-current-outfit-summary";
var PROMPT_ID_SCAN2 = "hehuan-current-outfit-scan";
function uniq2(items) {
  return Array.from(new Set(items.filter(Boolean)));
}
function formatEquippedLine2(target, items) {
  const names = items.map((item) => `${getItemDisplayName(item)}\uFF08${item}\uFF09`).join("\u3001");
  const hints = items.map((item) => getItemShortHint(item)).filter(Boolean).join("\uFF1B");
  return hints ? `${target}\uFF1A${names}\u3002${hints}` : `${target}\uFF1A${names}\u3002`;
}
function buildOutfitPrompt(data) {
  const equipment = data.\u9053\u5177?.\u88C5\u5907 ?? {};
  const presentNpcs = data.\u7CFB\u7EDF?.\u573A\u666F\u4E0A\u4E0B\u6587?.\u5728\u573ANPC ?? [];
  const targets = uniq2(["\u73A9\u5BB6", ...presentNpcs]);
  const lines = targets.map((target) => ({ target, items: equipment[target] ?? [] })).filter((entry) => entry.items.length > 0).map((entry) => formatEquippedLine2(entry.target, entry.items));
  if (lines.length === 0) return null;
  const equippedItems = targets.flatMap((target) => equipment[target] ?? []);
  const actionItems = (data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? []).filter((action) => ["\u88C5\u5907\u9053\u5177", "\u5378\u4E0B"].includes(action.\u7C7B\u578B ?? "")).map((action) => action.\u9053\u5177 ?? "");
  const scanNames = uniq2([...equippedItems, ...actionItems]);
  const scanTokens = uniq2([
    "\u670D\u88C5\u53D9\u4E8B\u89C4\u5219",
    "\u9053\u5177.\u88C5\u5907",
    ...(data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? []).map((action) => action.\u7C7B\u578B ?? "").filter((type) => ["\u88C5\u5907\u9053\u5177", "\u5378\u4E0B"].includes(type)),
    ...scanNames,
    ...scanNames.map(getItemDisplayName)
  ]);
  return {
    visible: {
      id: PROMPT_ID_VISIBLE2,
      position: "in_chat",
      depth: 0,
      role: "system",
      content: `\u5F53\u524D\u670D\u88C5\u951A\u70B9\uFF1A${lines.join(" ")}\u53EA\u5728\u5165\u573A\u3001\u52A8\u4F5C\u3001\u88AB\u6CE8\u89C6\u3001\u5FC3\u7EEA\u6CE2\u52A8\u3001\u516C\u5F00\u5EA6\u53D8\u5316\u6216\u65B0\u88C5\u5907/\u5378\u4E0B\u540E\u81EA\u7136\u5E26\u51FA\uFF1B\u4E0D\u8981\u6BCF\u56DE\u5408\u673A\u68B0\u590D\u8FF0\uFF0C\u4E0D\u76F4\u63A5\u6539\u53D8\u91CF\u3002`,
      should_scan: false
    },
    scan: {
      id: PROMPT_ID_SCAN2,
      position: "none",
      depth: 0,
      role: "system",
      content: scanTokens.join(" "),
      should_scan: true
    }
  };
}

// src/雌堕合欢宗/脚本/服装叙事注入/pendingActionPrompt.ts
var PROMPT_ID_VISIBLE3 = "hehuan-pending-action-summary";
var PROMPT_ID_SCAN3 = "hehuan-pending-action-scan";
function uniq3(items) {
  return Array.from(new Set(items.filter(Boolean)));
}
function isInstantItem(name) {
  return getItemLifecycle(name) === "\u8D2D\u4E70\u5373\u751F\u6548";
}
function isPhase2(data) {
  return data.\u7CFB\u7EDF?.\u9636\u6BB5 === "\u725D\u5974\u671F";
}
function isPlayerTarget(target) {
  return target === "\u73A9\u5BB6" || target === "\u5DF1\u8EAB" || target === "";
}
function buildActionLine(action, data) {
  const type = action.\u7C7B\u578B ?? "";
  const target = action.\u76EE\u6807 ?? "";
  const logicName = action.\u9053\u5177 ?? "";
  const displayName = action.\u9053\u5177\u663E\u793A\u540D || getItemDisplayName(logicName);
  const hint = action.AI\u77ED\u63D0\u793A || getItemShortHint(logicName);
  switch (type) {
    case "\u8D2D\u4E70\u7269\u54C1": {
      if (isInstantItem(logicName)) {
        return `\u3010\u9AD8\u4F18\u5148\u7EA7\u627F\u63A5\u3011\u73A9\u5BB6\u8D2D\u4E70\u4E86\u300C${displayName}\u300D(${logicName})\uFF0C${getItemLifecycle(logicName)}\uFF0C${hint}\u3002\u8FD9\u662F\u8D2D\u4E70\u5373\u751F\u6548\u7684\u4E8B\u4EF6\u79CD\u5B50\uFF0C\u5FC5\u987B\u5728\u672C\u697C\u5C42\u6B63\u6587\u53D9\u4E8B\u4E2D\u7ACB\u5373\u627F\u63A5\uFF0C\u4E0D\u5F97\u88AB\u5F00\u573A\u53D9\u4E8B\u6216NPC\u4E92\u52A8\u538B\u8FC7\u3002`;
      }
      return `\u73A9\u5BB6\u8D2D\u4E70\u4E86\u300C${displayName}\u300D(${logicName})\uFF0C${hint}\u3002\u6B63\u6587\u5FC5\u987B\u81F3\u5C11\u4E00\u53E5\u627F\u8BA4\u8BE5\u9053\u5177\u5DF2\u5165\u624B\u6216\u6FC0\u6D3B\uFF1B\u7981\u6B62"\u961F\u5217\u6E05\u7A7A\u4F46\u6B63\u6587\u4E00\u5B57\u672A\u63D0"\u3002`;
    }
    case "\u9886\u53D7\u6CD5\u5668":
      return `\u725D\u5974\u671F\u73A9\u5BB6\u4ECE\u6267\u4E8B\u5E93\u9886\u53D7\u300C${displayName}\u300D(${logicName})\uFF0C${hint}\u3002\u8FD9\u662F\u5B97\u95E8\u53D1\u4ED8\u6216\u65E5\u8BFE\u9886\u53D7\uFF0C\u4E0D\u662F\u8D2D\u7269\u6216\u7075\u77F3\u4EA4\u6613\uFF1B\u6B63\u6587\u5FC5\u987B\u627F\u63A5\u53D1\u4ED8\u6765\u6E90\u3001\u5F53\u524D\u65E5\u8BFE\u5173\u7CFB\u3001\u6267\u4E8B\u6216\u652F\u914D\u8005\u8BB0\u5F55\u3002\u53D8\u91CF\u4E0A\u627F\u8BA4\u524D\u7AEF\u5DF2\u5199\u5165 \u9053\u5177.\u62E5\u6709\uFF0C\u4E0D\u8981\u91CD\u590D\u589E\u52A0\u5E93\u5B58\u3002`;
    case "\u4F7F\u7528\u7269\u54C1":
      return `\u73A9\u5BB6\u5BF9${target}\u4F7F\u7528\u4E86\u300C${displayName}\u300D(${logicName})\uFF0C${hint}\u3002\u6B63\u6587\u5FC5\u987B\u5728\u672C\u697C\u5C42\u5199\u51FA\u4F7F\u7528\u6548\u679C\uFF1A\u8EAB\u4F53\u53D8\u5316\u3001\u6C14\u606F\u6CE2\u52A8\u3001\u573A\u666F\u53CD\u5E94\u6216\u76EE\u6807\u53CD\u5E94\u3002`;
    case "\u88C5\u5907\u9053\u5177":
      if (isPhase2(data) && isPlayerTarget(target)) {
        return `\u725D\u5974\u671F\u73A9\u5BB6\u5C06\u300C${displayName}\u300D(${logicName})\u6263\u5230\u5DF1\u8EAB\uFF0C${hint}\u3002\u8FD9\u662F\u6CD5\u5668\u5323\u627F\u547D\uFF0C\u4E0D\u662F\u8D2D\u7269\u6216\u666E\u901A\u7A7F\u6234\uFF1B\u6B63\u6587\u5FC5\u987B\u5199\u51FA\u6CD5\u5668\u5BF9\u8EAB\u4F53\u7684\u5373\u65F6\u56DE\u54CD\u3001\u5BF9\u5F53\u524D\u65E5\u8BFE\u7684\u5F71\u54CD\uFF0C\u4EE5\u53CA\u662F\u5426\u88AB\u6267\u4E8B\u6216\u652F\u914D\u8005\u8BB0\u5165\u7F9E\u540D/\u627F\u547D\u75D5\u3002\u53D8\u91CF\u4E0A\u53EA\u627F\u8BA4\u524D\u7AEF\u5DF2\u5B8C\u6210\u7684 \u9053\u5177.\u88C5\u5907.\u73A9\u5BB6\uFF0C\u4E0D\u8981\u91CD\u590D\u63D2\u5165\u88C5\u5907\u3002`;
      }
      return `\u73A9\u5BB6\u5C06\u300C${displayName}\u300D(${logicName})\u88C5\u5907\u5230${target}\u8EAB\u4E0A\uFF0C${hint}\u3002\u6B63\u6587\u5FC5\u987B\u5199\u51FA\u76EE\u6807\u7684\u53CD\u5E94\uFF1A\u987A\u4ECE\u3001\u6297\u62D2\u3001\u7F9E\u607C\u6216\u6C89\u9ED8\u3002`;
    case "\u5378\u4E0B":
      if (isPhase2(data) && isPlayerTarget(target)) {
        return `\u725D\u5974\u671F\u73A9\u5BB6\u8BD5\u56FE\u89E3\u9664\u5DF1\u8EAB\u300C${displayName}\u300D(${logicName})\u3002\u6B63\u6587\u5E94\u5199\u51FA\u6CD5\u5668\u6B8B\u75D5\u3001\u65E5\u8BFE\u8FDD\u4EE4\u98CE\u9669\u3001\u6267\u4E8B\u65A5\u8D23\u6216\u7F9E\u540D\u4F59\u6CE2\uFF1B\u53D8\u91CF\u4E0A\u53EA\u627F\u8BA4\u524D\u7AEF\u5DF2\u5B8C\u6210\u7684\u5378\u4E0B\u7ED3\u679C\uFF0C\u4E0D\u8981\u91CD\u590D\u6539\u5199 \u9053\u5177.\u88C5\u5907.\u73A9\u5BB6\u3002`;
      }
      return `\u73A9\u5BB6\u89E3\u9664\u4E86${target}\u8EAB\u4E0A\u7684\u300C${displayName}\u300D(${logicName})\u3002\u6B63\u6587\u5E94\u5199\u51FA\u6B8B\u75D5\u9000\u53BB\u3001\u538B\u529B\u6D88\u6563\u6216\u76EE\u6807\u53CD\u5E94\u3002`;
    case "\u8FFD\u67E5\u98CE\u58F0": {
      const location = action.\u573A\u666F || action.\u5730\u70B9 || "";
      const hook = action.\u6545\u4E8B\u94A9\u5B50 || "";
      if (action.\u5267\u60C5\u7EBF === "\u725D\u5974\u7F9E\u540D" || action.AI\u77ED\u63D0\u793A?.includes("P2\u7F9E\u540D")) {
        return `${action.AI\u77ED\u63D0\u793A || "P2\u7F9E\u540D\u98CE\u58F0\u5FC5\u987B\u88AB\u627F\u63A5"} \u5730\u70B9\uFF1A${location || "\u5F53\u524D\u573A\u666F"}${hook ? `\uFF0C\u7EBF\u7D22\uFF1A${hook}` : ""}\u3002\u6B63\u6587\u5FC5\u987B\u627F\u63A5\u4E3A\u4F20\u5524\u3001\u65E5\u8BFE\u5F02\u52A8\u3001\u516C\u5F00\u51DD\u89C6\u6216\u652F\u914D\u4E8B\u4EF6\uFF0C\u5E76\u5728\u540C\u6B21JSONPatch\u4E2D\u66F4\u65B0\u725D\u5974.\u5F53\u524D\u65E5\u8BFE\u3001\u725D\u5974.\u5F53\u524D\u547D\u4EE4\u3001\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005\u3001\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570\u6216\u725D\u5974.\u8C03\u6559\u8BB0\u5F55\u4E2D\u7684\u81F3\u5C11\u4E00\u9879\u3002`;
      }
      return `\u73A9\u5BB6\u524D\u5F80${location}\u8FFD\u67E5\u98CE\u58F0${hook ? `\uFF0C\u7EBF\u7D22\uFF1A${hook}` : ""}\u3002\u6B63\u6587\u5FC5\u987B\u627F\u63A5\u4E3A\u573A\u666F\u906D\u9047\uFF0C\u5199\u51FA\u63A2\u7D22\u8FC7\u7A0B\u4E0E\u53D1\u73B0\u3002`;
    }
    case "\u7075\u8BC6\u7A83\u53D6":
      return `\u73A9\u5BB6\u4EE5\u5408\u6B22\u5FC3\u5178\u7AA5\u63A2${target}\u5FC3\u7EEA\u3002\u6B63\u6587\u5FC5\u987B\u5199\u51FA\u7AA5\u63A2\u7ED3\u679C\uFF1A\u6210\u529F\u7AA5\u89C1\u5FC3\u97F3\u3001\u5FC3\u9632\u53CD\u9707\u6216\u5FC3\u97F3\u6B8B\u7247\u3002`;
    default:
      return `\u73A9\u5BB6\u6267\u884C\u4E86\u300C${type}\u300D\u64CD\u4F5C${logicName ? `\uFF0C\u6D89\u53CA\u300C${displayName}\u300D` : ""}\u3002\u6B63\u6587\u5FC5\u987B\u5728\u672C\u697C\u5C42\u627F\u8BA4\u5E76\u627F\u63A5\u6B64\u64CD\u4F5C\u3002`;
  }
}
function build\u7075\u77F3\u7EA2\u7EBF(data) {
  const \u7075\u77F3 = data.\u7CFB\u7EDF?.\u7075\u77F3 ?? 0;
  if (\u7075\u77F3 > 5e5) {
    return "\u7075\u77F3\u6570\u503C\u8FDC\u8D85\u5E38\u89C4\u83B7\u53D6\u4E0A\u9650\uFF0C\u6B64\u4E3A\u73A9\u5BB6\u8C03\u8BD5\u884C\u4E3A\uFF1BAI\u7981\u6B62\u7528replace\u5C06\u7075\u77F3\u4FEE\u6B63\u56DE\u521D\u59CB\u503C\u6216\u4EFB\u4F55\u4F4E\u503C\uFF0C\u5FC5\u987B\u4FDD\u7559\u5F53\u524D\u6570\u503C\u7EE7\u7EED\u53D9\u4E8B\u3002";
  }
  return null;
}
function buildPatchFormatLines() {
  return [
    "\u3010\u53D8\u91CF\u8F93\u51FA\u683C\u5F0F\u786C\u7EA6\u675F\u3011\u53EA\u80FD\u8F93\u51FA\u4E00\u4E2A<UpdateVariable>\uFF0C\u4E14\u5176\u4E2D\u53EA\u80FD\u8F93\u51FA\u4E00\u4E2A\u5B8C\u6574<JSONPatch>\uFF1B\u7981\u6B62\u8F93\u51FA\u7B2C\u4E8C\u4E2A<UpdateVariable>\u3001\u7B2C\u4E8C\u4E2A<JSONPatch>\u3001\u91CD\u590DAnalysis\u6216\u8865\u5199\u53D8\u91CF\u5757\u3002",
    "\u3010JSONPatch\u5B89\u5168\u7EA6\u675F\u3011JSONPatch\u5FC5\u987B\u662F\u5B8C\u6574JSON\u6570\u7EC4\u5E76\u6B63\u5E38\u95ED\u5408\uFF1B\u7981\u6B62\u4F7F\u7528insert\uFF0C\u6570\u7EC4\u8FFD\u52A0\u7EDF\u4E00\u4F7F\u7528add\u5230/-\uFF0C\u5B57\u6BB5\u6539\u5199\u4F7F\u7528replace\uFF1B\u4E0D\u786E\u5B9A\u8DEF\u5F84\u5B58\u5728\u65F6\u4F18\u5148replace\u5DF2\u6709\u5BF9\u8C61\u6216\u7528add\u8FFD\u52A0\u6570\u7EC4\u9879\u3002",
    '\u3010\u6700\u77ED\u95ED\u73AF\u4F18\u5148\u3011\u7B2C\u4E00\u4F18\u5148\u7EA7\u53EA\u5199\u95ED\u73AF\u5FC5\u9700\u8865\u4E01\uFF1A\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92=[]\u3001\u7CFB\u7EDF.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID=""\u3001\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001\u3001\u725D\u5974.\u5F53\u524D\u65E5\u8BFE/\u5F53\u524D\u652F\u914D\u8005/\u5F53\u524D\u547D\u4EE4/\u4ECA\u65E5\u8C03\u6559\u6B21\u6570/\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97\u3001\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55\u3002\u98CE\u58F0\u5217\u8868\u3001\u5FC3\u97F3\u3001\u989D\u5916\u7EC6\u8282\u653E\u5728\u8FD9\u4E9B\u4E4B\u540E\uFF0C\u8F93\u51FA\u7A7A\u95F4\u4E0D\u8DB3\u65F6\u7701\u7565\u989D\u5916\u9879\u3002'
  ];
}
function buildWorldRuntimeLines(actions) {
  const lines = [
    ...buildPatchFormatLines(),
    "\u3010\u4E16\u754C\u8FD0\u884C\u7ED3\u7B97\u3011\u672C\u697C\u5C42\u5904\u7406\u5F85\u5904\u7406\u4EA4\u4E92\u65F6\uFF0C\u5FC5\u987B\u540C\u6B65\u8FDB\u884C\u65F6\u95F4\u7ED3\u7B97\uFF1A\u5224\u65AD\u8017\u65F6\uFF0C\u5FC5\u8981\u65F6\u66F4\u65B0\u7CFB\u7EDF.\u65F6\u8FB0\u548C\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570\uFF0C\u5E76\u5199\u5165\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u6700\u8FD1\u8017\u65F6\u3001\u6700\u8FD1\u7ED3\u7B97\u539F\u56E0\u3001\u6700\u8FD1\u4E8B\u4EF6\u7C7B\u578B\u3001\u662F\u5426\u8FC7\u591C\u3002\u7981\u6B62\u53EA\u6E05\u7A7A\u961F\u5217\u4E0D\u5199\u65F6\u95F4\u7ED3\u7B97\u3002",
    "\u82E5\u4E8B\u4EF6\u6D89\u53CA\u4EB2\u5BC6\u3001NSFW\u3001\u6B32\u6D77\u6C14\u606F\u3001\u6295\u6B32\u94A5\u6216\u6539\u53D8\u9635\u6CD5\uFF0C\u5FC5\u987B\u540C\u6B65\u66F4\u65B0\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001\uFF1B\u82E5\u4E8B\u4EF6\u91CD\u8981\uFF0C\u5199\u5165\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55\uFF0C\u8BB0\u5F55\u6458\u8981\u3001\u65E5\u3001\u65F6\u8FB0\u3001\u5730\u70B9\u3001\u6D89\u53CANPC\u3001\u516C\u5F00\u5EA6\u548C\u540E\u679C\u6807\u7B7E\u3002"
  ];
  for (const action of actions) {
    const item = action.\u9053\u5177 ?? "";
    if (item === "\u65F6\u95F4\u5EF6\u957F") {
      lines.push("\u3010\u65F6\u95F4\u5EF6\u957F\u3011\u5FC5\u987B\u589E\u52A0\u7CFB\u7EDF.\u5269\u4F59\u5929\u6570\uFF0C\u5E76\u5728\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001\u5199\u660E\u6700\u8FD1\u7ED3\u7B97\u539F\u56E0\uFF1B\u7981\u6B62\u53EA\u63CF\u5199\u9053\u5177\u751F\u6548\u5374\u4E0D\u6539\u5929\u6570\u3002");
    }
    if (item === "\u6B32\u6D77\u906E\u853D\u7B26") {
      lines.push("\u3010\u6B32\u6D77\u906E\u853D\u7B26\u3011\u5FC5\u987B\u5199\u5165\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001.\u906E\u853D\u5269\u4F59\u65F6\u6BB5\u548C\u906E\u853D\u6765\u6E90\uFF1B\u906E\u853D\u671F\u95F4\u82E5\u53D1\u751FNSFW\uFF0C\u4E0D\u5F97\u660E\u663E\u589E\u52A0\u641C\u5BFB\u8FDB\u5EA6\u3002");
    }
    if (item === "\u6295\u6B32\u94A5") {
      lines.push("\u3010\u6295\u6B32\u94A5\u3011\u5FC5\u987B\u5C06\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001\u63A8\u5411\u9501\u5B9A\u6216\u5DF2\u88AB\u5B9A\u4F4D\uFF0C\u5E76\u8FDB\u5165\u725D\u5974\u671F\u627F\u63A5\uFF1B\u7981\u6B62\u5199\u6210\u666E\u901A\u8D2D\u4E70\u3002");
    }
    if (item === "\u6539\u53D8\u9635\u6CD5" || action.\u7C7B\u578B === "\u6539\u53D8\u9635\u6CD5") {
      lines.push("\u3010\u6539\u53D8\u9635\u6CD5\u3011\u5FC5\u987B\u6539\u5199\u6216\u5173\u95ED\u6B32\u6D77\u538B\u529B\uFF0C\u66F4\u65B0\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001\uFF0C\u5E76\u5199\u5165\u4E8B\u4EF6\u540E\u679C\u8D26\u672C\u3002");
    }
  }
  return lines;
}
function needsP2Runtime(data, actions) {
  if (data.\u7CFB\u7EDF?.\u9636\u6BB5 === "\u725D\u5974\u671F") return true;
  return actions.some((action) => action.\u5267\u60C5\u7EBF === "\u725D\u5974\u7F9E\u540D" || action.\u7C7B\u578B === "P2\u65E5\u8BFE" || action.\u7C7B\u578B === "\u725D\u5974\u8C03\u6559");
}
function buildP2RuntimeLines() {
  return [
    "\u3010\u725D\u5974\u671F\u8FD0\u884C\u7ED3\u7B97\u3011\u672C\u697C\u5C42\u82E5\u627F\u63A5\u725D\u5974\u671F\u4EA4\u4E92\uFF0C\u5FC5\u987B\u540C\u6B65\u5224\u65AD\u5F53\u524D\u65E5\u8BFE\u3001\u5F53\u524D\u652F\u914D\u8005\u3001\u725D\u5370\u547D\u4EE4\u4E0E\u8C03\u6559\u540E\u679C\uFF0C\u5E76\u5199\u5165\u725D\u5974.\u5F53\u524D\u65E5\u8BFE\u3001\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005\u3001\u725D\u5974.\u5F53\u524D\u547D\u4EE4\u3001\u725D\u5974.\u547D\u4EE4\u5F3A\u5EA6\u3001\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570\u548C\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97\u3002",
    "\u725D\u5974\u671F\u7684\u91CD\u8981\u7F9E\u540D\u3001\u65E5\u8BFE\u3001\u516C\u5F00\u793A\u4F17\u6216\u652F\u914D\u4E8B\u4EF6\u5FC5\u987B\u8FFD\u52A0\u725D\u5974.\u8C03\u6559\u8BB0\u5F55\uFF0C\u5E76\u540C\u6B65\u5199\u5165\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55\uFF1B\u82E5\u516C\u5F00\u5EA6\u4E3A\u516C\u5F00\u6216\u6D89\u53CA\u7F9E\u540D\u6D41\u4F20\uFF0C\u5E94\u751F\u6210\u6216\u627F\u63A5\u4E00\u6761\u7F9E\u540D\u98CE\u58F0\u3002",
    "\u725D\u5974\u671F\u5FC5\u987B\u8BFB\u53D6 \u9053\u5177.\u88C5\u5907.\u73A9\u5BB6 \u5224\u65AD\u6CD5\u5668\u5BF9\u8EAB\u4F53\u3001\u65E5\u8BFE\u548C\u7F9E\u540D\u7684\u5F71\u54CD\uFF1A\u7F3A\u5C11\u65E5\u8BFE\u6240\u9700\u6CD5\u5668\u65F6\uFF0C\u53EF\u5199\u65A5\u8D23\u3001\u7F9E\u540D\u6807\u7B7E\u548C\u66F4\u91CD\u65E5\u8BFE\uFF1B\u5DF2\u6263\u6CD5\u5668\u65F6\uFF0C\u5E94\u5199\u627F\u547D\u3001\u8EAB\u4F53\u56DE\u54CD\u548C\u88AB\u8BB0\u5F55\u7684\u538B\u529B\u3002",
    "\u725D\u5974\u671F\u6CA1\u6709\u5546\u57CE\u8D2D\u7269\u8BED\u4E49\uFF1B\u6267\u4E8B\u5E93\u53D1\u4ED8\u53EA\u4EE3\u8868\u5B97\u95E8\u4E0B\u53D1\u6216\u65E5\u8BFE\u9886\u53D7\uFF0CAI\u4E0D\u5F97\u53D9\u8FF0\u73A9\u5BB6\u7528\u7075\u77F3\u8D2D\u4E70\u725D\u5974\u671F\u6CD5\u5668\u3002"
  ];
}
function buildScanTokens(actions) {
  const tokens = ["\u5F85\u5904\u7406\u4EA4\u4E92", "\u6700\u4F4E\u627F\u8BA4\u5E95\u7EBF", "\u65F6\u95F4\u7ED3\u7B97", "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001", "\u4E8B\u4EF6\u540E\u679C\u8D26\u672C"];
  for (const action of actions) {
    const type = action.\u7C7B\u578B ?? "";
    const logicName = action.\u9053\u5177 ?? "";
    const displayName = action.\u9053\u5177\u663E\u793A\u540D || getItemDisplayName(logicName);
    tokens.push(type);
    if (logicName) tokens.push(logicName);
    if (displayName && displayName !== logicName) tokens.push(displayName);
    if (type === "\u8D2D\u4E70\u7269\u54C1" || type === "\u4F7F\u7528\u7269\u54C1" || type === "\u9886\u53D7\u6CD5\u5668") {
      tokens.push("\u9053\u5177AI\u627F\u63A5\u95ED\u73AF");
      if (isInstantItem(logicName)) tokens.push("\u7279\u6B8A\u9053\u5177\u4E8B\u4EF6\u89C4\u5219");
      if (action.\u4E39\u836F\u5206\u7C7B) tokens.push("\u4E39\u836F\u53D9\u4E8B\u89C4\u5219");
      if (logicName === "\u65F6\u95F4\u5EF6\u957F") tokens.push("\u65F6\u95F4\u5EF6\u957F", "\u5269\u4F59\u5929\u6570");
      if (logicName === "\u6B32\u6D77\u906E\u853D\u7B26") tokens.push("\u6B32\u6D77\u72B6\u6001", "\u906E\u853D\u5269\u4F59\u65F6\u6BB5");
      if (logicName === "\u6295\u6B32\u94A5") tokens.push("\u6B32\u6D77\u72B6\u6001", "\u9501\u5B9A", "\u725D\u5974\u671F");
    }
    if (type === "\u9886\u53D7\u6CD5\u5668") tokens.push("\u6267\u4E8B\u5E93", "\u53D1\u4ED8", "\u65E5\u8BFE\u9886\u53D7", "\u9053\u5177.\u62E5\u6709", "\u6CD5\u5668\u5323");
    if (type === "\u88C5\u5907\u9053\u5177" || type === "\u5378\u4E0B") {
      const tier = action.\u5668\u9636 || getContrabandTier(logicName);
      if (tier) tokens.push("\u7981\u5668\u53D9\u4E8B\u89C4\u5219", tier);
      tokens.push("\u670D\u88C5\u53D9\u4E8B\u89C4\u5219");
      tokens.push("\u9053\u5177.\u88C5\u5907.\u73A9\u5BB6", "\u6CD5\u5668\u5323", "\u627F\u547D\u75D5");
    }
    if (type === "\u8FFD\u67E5\u98CE\u58F0") tokens.push("\u98CE\u58F0");
    if (action.\u5267\u60C5\u7EBF === "\u725D\u5974\u7F9E\u540D" || action.AI\u77ED\u63D0\u793A?.includes("P2\u7F9E\u540D")) {
      tokens.push("\u725D\u5974\u7F9E\u540D", "\u4F20\u5524", "\u65E5\u8BFE\u5F02\u52A8", "\u516C\u5F00\u51DD\u89C6", "\u652F\u914D\u4E8B\u4EF6", "\u725D\u5974\u671F\u540E\u679C\u8D26\u672C");
    }
    if (type === "\u7075\u8BC6\u7A83\u53D6") tokens.push("\u5FC3\u97F3\u56DE\u54CD", "\u7075\u8BC6\u7A83\u53D6");
    if (action.\u5267\u60C5\u7EBF === "\u725D\u5974\u7F9E\u540D" || type === "P2\u65E5\u8BFE" || type === "\u725D\u5974\u8C03\u6559") tokens.push("\u725D\u5974\u65E5\u8BFE", "\u725D\u5370\u547D\u4EE4", "\u8C03\u6559\u8BB0\u5F55", "\u7F9E\u540D\u98CE\u58F0");
  }
  return tokens;
}
function buildPendingActionPrompt(data) {
  const actions = data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? [];
  if (actions.length === 0) return null;
  const actionLines = actions.map((action) => buildActionLine(action, data));
  actionLines.push(...buildWorldRuntimeLines(actions));
  if (needsP2Runtime(data, actions)) actionLines.push(...buildP2RuntimeLines());
  const \u7075\u77F3\u7EA2\u7EBF = build\u7075\u77F3\u7EA2\u7EBF(data);
  if (\u7075\u77F3\u7EA2\u7EBF) actionLines.push(\u7075\u77F3\u7EA2\u7EBF);
  const visibleContent = `\u5F85\u5904\u7406\u4EA4\u4E92\u961F\u5217\uFF08\u672C\u697C\u5C42\u5FC5\u987B\u9010\u6761\u53D9\u4E8B\u627F\u63A5\uFF0C\u7981\u6B62\u53EA\u6E05\u961F\u5217\u4E0D\u5199\u5267\u60C5\uFF09\uFF1A
${actionLines.map((line, i) => `${i + 1}. ${line}`).join("\n")}
\u627F\u63A5\u540E\u5FC5\u987B\u5728\u540C\u4E00\u6B21JSONPatch\u4E2D\u6E05\u7A7A\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92\u4E3A[]\u3002`;
  const scanTokens = uniq3(buildScanTokens(actions));
  if (needsP2Runtime(data, actions)) scanTokens.push("\u725D\u5974\u65E5\u8BFE", "\u725D\u5370\u547D\u4EE4", "\u8C03\u6559\u8BB0\u5F55", "\u7F9E\u540D\u98CE\u58F0");
  return {
    visible: {
      id: PROMPT_ID_VISIBLE3,
      position: "in_chat",
      depth: 0,
      role: "system",
      content: visibleContent,
      should_scan: false
    },
    scan: {
      id: PROMPT_ID_SCAN3,
      position: "none",
      depth: 0,
      role: "system",
      content: scanTokens.join(" "),
      should_scan: true
    }
  };
}

// src/雌堕合欢宗/脚本/服装叙事注入/worldRuntimePrompt.ts
var PROMPT_ID_VISIBLE4 = "hehuan-world-runtime-summary";
var PROMPT_ID_SCAN4 = "hehuan-world-runtime-scan";
var EVENT_TYPES = ["\u79FB\u52A8", "\u63A2\u7D22", "\u79FB\u52A8\u4E0E\u89C2\u5BDF", "\u5BF9\u8BDD", "\u8FFD\u67E5\u7EBF\u7D22", "\u4E8B\u52A1", "\u65E5\u8BFE"];
function hasPendingAction(data) {
  return (data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92 ?? []).length > 0;
}
function hasStoryHook(data) {
  return (data.\u7CFB\u7EDF?.\u573A\u666F\u4E0A\u4E0B\u6587?.\u6545\u4E8B\u94A9\u5B50 ?? []).length > 0;
}
function hasRuntimeEventType(data) {
  const eventType = data.\u7CFB\u7EDF?.\u65F6\u95F4\u72B6\u6001?.\u6700\u8FD1\u4E8B\u4EF6\u7C7B\u578B ?? "";
  return EVENT_TYPES.some((type) => eventType.includes(type));
}
function shouldInject(data) {
  if (hasPendingAction(data)) return false;
  if (data.\u7CFB\u7EDF?.\u9636\u6BB5 === "\u725D\u5974\u671F") return true;
  if (data.\u7CFB\u7EDF?.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID) return true;
  if (hasStoryHook(data)) return true;
  return hasRuntimeEventType(data);
}
function buildWorldRuntimePrompt(data) {
  if (!shouldInject(data)) return null;
  const isP2 = data.\u7CFB\u7EDF?.\u9636\u6BB5 === "\u725D\u5974\u671F";
  const p2Line = isP2 ? "\u725D\u5974\u671F\u82E5\u53D1\u751F\u65E5\u8BFE\u3001\u652F\u914D\u3001\u516C\u5F00\u8C03\u6559\u3001\u7F9E\u540D\u51DD\u89C6\u6216\u725D\u5370\u547D\u4EE4\uFF0C\u5FC5\u987B\u540C\u6B65\u5199\u725D\u5974.\u5F53\u524D\u65E5\u8BFE\u3001\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005\u3001\u725D\u5974.\u5F53\u524D\u547D\u4EE4\u3001\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570\u3001\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97\uFF0C\u6216\u7528add /\u725D\u5974/\u8C03\u6559\u8BB0\u5F55/-\u8FFD\u52A0\u725D\u5974.\u8C03\u6559\u8BB0\u5F55\u3002\u725D\u5974\u671F\u5FC5\u987B\u8BFB\u53D6\u9053\u5177.\u88C5\u5907.\u73A9\u5BB6\u5224\u65AD\u5DF2\u6263\u6CD5\u5668\u5BF9\u65E5\u8BFE\u3001\u8EAB\u4F53\u56DE\u54CD\u548C\u7F9E\u540D\u98CE\u58F0\u7684\u5F71\u54CD\uFF1B\u6267\u4E8B\u5E93\u53D1\u4ED8\u4E0D\u662F\u5546\u57CE\u8D2D\u4E70\uFF0C\u4E0D\u8981\u53D9\u8FF0\u7075\u77F3\u4EA4\u6613\u3002" : "";
  const content = `\u4E16\u754C\u8FD0\u884C\u8D26\u672C\uFF1A\u82E5\u672C\u697C\u5C42\u53D1\u751F\u79FB\u52A8\u3001\u63A2\u7D22\u3001\u89C2\u5BDF\u3001NPC\u53E3\u8C15\u3001\u4E8B\u52A1\u627F\u63A5\u3001\u98CE\u58F0\u8FFD\u67E5\u6216P2\u65E5\u8BFE\uFF0C\u5FC5\u987B\u540C\u6B65\u5199\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001\uFF1B\u573A\u666F\u53D8\u5316\u5199\u5B8C\u6574\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587\uFF1B\u5E76\u7528add /\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55/-\u8FFD\u52A0\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55\uFF0C\u8BB0\u5F55\u6458\u8981\u3001\u65E5\u3001\u65F6\u8FB0\u3001\u5730\u70B9\u3001\u6D89\u53CANPC\u3001\u516C\u5F00\u5EA6\u548C\u540E\u679C\u6807\u7B7E\u3002${p2Line}`;
  const scanTokens = [
    "\u4E16\u754C\u8FD0\u884C\u8D26\u672C",
    "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001",
    "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587",
    "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55",
    "add /\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55/-",
    "\u79FB\u52A8",
    "\u63A2\u7D22",
    "NPC\u53E3\u8C15",
    "\u4E8B\u52A1\u627F\u63A5",
    ...isP2 ? ["P2\u65E5\u8BFE", "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE", "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005", "\u725D\u5974.\u5F53\u524D\u547D\u4EE4", "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", "\u8C03\u6559\u8BB0\u5F55", "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", "\u9053\u5177.\u88C5\u5907.\u73A9\u5BB6", "\u6CD5\u5668\u5323", "\u6267\u4E8B\u5E93\u53D1\u4ED8", "\u7F9E\u540D\u98CE\u58F0"] : []
  ];
  return {
    visible: {
      id: PROMPT_ID_VISIBLE4,
      position: "in_chat",
      depth: 0,
      role: "system",
      content,
      should_scan: false
    },
    scan: {
      id: PROMPT_ID_SCAN4,
      position: "none",
      depth: 0,
      role: "system",
      content: Array.from(new Set(scanTokens)).join(" "),
      should_scan: true
    }
  };
}

// src/雌堕合欢宗/脚本/后端校验/narrativePromptRuntime.ts
function getPendingActions(data) {
  const actions = data.\u7CFB\u7EDF?.\u5F85\u5904\u7406\u4EA4\u4E92;
  return Array.isArray(actions) ? actions : [];
}
function hasP2PendingAction(actions) {
  return actions.some((action) => action.\u5267\u60C5\u7EBF === "\u725D\u5974\u7F9E\u540D" || String(action.AI\u77ED\u63D0\u793A ?? "").includes("P2\u7F9E\u540D"));
}
function hasValidWorldRuntimeState(data) {
  const system = data?.\u7CFB\u7EDF;
  if (!system || typeof system !== "object") return false;
  if (system.\u9636\u6BB5 === "\u725D\u5974\u671F") return true;
  if (typeof system.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID === "string" && system.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID.trim()) return true;
  if (typeof system.\u5F53\u524D\u573A\u666F === "string" && system.\u5F53\u524D\u573A\u666F.trim()) return true;
  return false;
}
function findStatDataForNarrativePrompt(getByMessageId) {
  const latest = getByMessageId("latest") ?? {};
  if (getPendingActions(latest).length > 0) return latest;
  for (const messageId of [-1, -2, -3, -4, -5]) {
    const data = getByMessageId(messageId);
    if (data && getPendingActions(data).length > 0) return data;
  }
  if (hasValidWorldRuntimeState(latest)) return latest;
  for (const messageId of [-1, -2, -3, -4, -5]) {
    const data = getByMessageId(messageId);
    if (hasValidWorldRuntimeState(data)) return data;
  }
  return latest;
}
function createNarrativePromptRuntime(deps) {
  let uninjectCurrent = null;
  let snapshot = {
    reason: "init",
    pendingCount: 0,
    promptIds: [],
    hasP2PendingAction: false,
    hasWorldRuntimePrompt: false,
    injected: false
  };
  const ids = {
    outfit: ["hehuan-current-outfit-summary", "hehuan-current-outfit-scan"],
    contraband: ["hehuan-current-contraband-summary", "hehuan-current-contraband-scan"],
    pending: ["hehuan-pending-action-summary", "hehuan-pending-action-scan"],
    worldRuntime: ["hehuan-world-runtime-summary", "hehuan-world-runtime-scan"]
  };
  function clear() {
    uninjectCurrent?.();
    uninjectCurrent = null;
    deps.uninjectPrompts(ids.outfit);
    deps.uninjectPrompts(ids.contraband);
    deps.uninjectPrompts(ids.pending);
    deps.uninjectPrompts(ids.worldRuntime);
  }
  function refresh(reason = "refresh") {
    const data = deps.getStatData();
    const actions = getPendingActions(data);
    const prompts = [buildOutfitPrompt(data), buildContrabandPrompt(data), buildPendingActionPrompt(data), buildWorldRuntimePrompt(data)].filter(Boolean).flatMap((prompt) => [prompt.visible, prompt.scan]);
    clear();
    snapshot = {
      reason,
      pendingCount: actions.length,
      promptIds: prompts.map((prompt) => prompt.id),
      hasP2PendingAction: hasP2PendingAction(actions),
      hasWorldRuntimePrompt: prompts.some((prompt) => ids.worldRuntime.includes(prompt.id)),
      injected: prompts.length > 0
    };
    if (prompts.length === 0) return;
    uninjectCurrent = deps.injectPrompts(prompts).uninject;
  }
  function getSnapshot() {
    return { ...snapshot, promptIds: [...snapshot.promptIds] };
  }
  return { refresh, clear, getSnapshot };
}

// src/雌堕合欢宗/脚本/后端校验/mvuCommandSanitizer.ts
var DISALLOWED_COMMAND_TYPES = /* @__PURE__ */ new Set(["insert", "add"]);
var SAFE_APPEND_PATHS = /* @__PURE__ */ new Set([
  "/\u725D\u5974/\u8C03\u6559\u8BB0\u5F55",
  "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55",
  "/\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55",
  "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55",
  "/\u7CFB\u7EDF/\u98CE\u58F0\u5217\u8868",
  "\u7CFB\u7EDF.\u98CE\u58F0\u5217\u8868",
  "/\u7CFB\u7EDF/\u5FC3\u97F3\u56DE\u54CD",
  "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD"
]);
var CRITICAL_PATHS = /* @__PURE__ */ new Set([
  "/\u7CFB\u7EDF/\u5F53\u524D\u573A\u666F",
  "/\u7CFB\u7EDF/\u5F85\u5904\u7406\u4EA4\u4E92",
  "/\u7CFB\u7EDF/\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001",
  "/\u7CFB\u7EDF/\u6B32\u6D77\u72B6\u6001",
  "/\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55",
  "/\u725D\u5974/\u5F53\u524D\u65E5\u8BFE",
  "/\u725D\u5974/\u5F53\u524D\u652F\u914D\u8005",
  "/\u725D\u5974/\u5F53\u524D\u547D\u4EE4",
  "/\u725D\u5974/\u4ECA\u65E5\u8C03\u6559\u6B21\u6570",
  "/\u725D\u5974/\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97",
  "/\u725D\u5974/\u8C03\u6559\u8BB0\u5F55",
  "/\u725D\u5974/\u7F9E\u540D\u6807\u7B7E",
  "\u7CFB\u7EDF.\u5F53\u524D\u573A\u666F",
  "\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92",
  "\u7CFB\u7EDF.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001",
  "\u7CFB\u7EDF.\u6B32\u6D77\u72B6\u6001",
  "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55",
  "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE",
  "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005",
  "\u725D\u5974.\u5F53\u524D\u547D\u4EE4",
  "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570",
  "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97",
  "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55",
  "\u725D\u5974.\u7F9E\u540D\u6807\u7B7E"
]);
var BUSINESS_PATH_WEIGHTS = /* @__PURE__ */ new Map([
  ["/\u7CFB\u7EDF/\u5F85\u5904\u7406\u4EA4\u4E92", 8],
  ["\u7CFB\u7EDF.\u5F85\u5904\u7406\u4EA4\u4E92", 8],
  ["/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001", 40],
  ["\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001", 40],
  ["/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587", 14],
  ["\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587", 14],
  ["/\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55", 40],
  ["\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55", 40],
  ["/\u725D\u5974/\u5F53\u524D\u65E5\u8BFE", 8],
  ["\u725D\u5974.\u5F53\u524D\u65E5\u8BFE", 8],
  ["/\u725D\u5974/\u5F53\u524D\u547D\u4EE4", 8],
  ["\u725D\u5974.\u5F53\u524D\u547D\u4EE4", 8],
  ["/\u725D\u5974/\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", 8],
  ["\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570", 8],
  ["/\u725D\u5974/\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", 4],
  ["\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97", 4],
  ["/\u725D\u5974/\u8C03\u6559\u8BB0\u5F55", 4],
  ["\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", 4],
  ["/\u7CFB\u7EDF/\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID", 3],
  ["\u7CFB\u7EDF.\u5F53\u524D\u8FFD\u67E5\u98CE\u58F0ID", 3]
]);
var FALLBACK_PATHS = /* @__PURE__ */ new Set([
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u6700\u8FD1\u8017\u65F6",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/\u6700\u8FD1\u8017\u65F6",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u6700\u8FD1\u7ED3\u7B97\u539F\u56E0",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/\u6700\u8FD1\u7ED3\u7B97\u539F\u56E0",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u6700\u8FD1\u4E8B\u4EF6\u7C7B\u578B",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/\u6700\u8FD1\u4E8B\u4EF6\u7C7B\u578B",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u65F6\u6BB5\u8FDB\u5EA6",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/\u65F6\u6BB5\u8FDB\u5EA6",
  "\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.\u662F\u5426\u8FC7\u591C",
  "/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/\u662F\u5426\u8FC7\u591C",
  "\u5267\u60C5.\u4E8B\u4EF6\u8BB0\u5F55",
  "/\u5267\u60C5/\u4E8B\u4EF6\u8BB0\u5F55",
  "\u725D\u5974.\u5F53\u524D\u65E5\u8BFE",
  "/\u725D\u5974/\u5F53\u524D\u65E5\u8BFE",
  "\u725D\u5974.\u5F53\u524D\u652F\u914D\u8005",
  "/\u725D\u5974/\u5F53\u524D\u652F\u914D\u8005",
  "\u725D\u5974.\u5F53\u524D\u547D\u4EE4",
  "/\u725D\u5974/\u5F53\u524D\u547D\u4EE4",
  "\u725D\u5974.\u4ECA\u65E5\u8C03\u6559\u6B21\u6570",
  "/\u725D\u5974/\u4ECA\u65E5\u8C03\u6559\u6B21\u6570",
  "\u725D\u5974.\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97",
  "/\u725D\u5974/\u6700\u8FD1\u8C03\u6559\u7ED3\u7B97",
  "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55",
  "/\u725D\u5974/\u8C03\u6559\u8BB0\u5F55"
]);
var SOUL_PROBE_RESULT_STATES = /* @__PURE__ */ new Set(["\u5DF2\u6355\u83B7", "\u53CD\u9707", "\u9501\u95ED"]);
var VALID_ECHO_RESULT_STATES = /* @__PURE__ */ new Set(["\u6355\u83B7", "\u53CD\u9707", "\u9501\u95ED"]);
var SELECTABLE_PATHS = /* @__PURE__ */ new Set([
  ...CRITICAL_PATHS,
  ...BUSINESS_PATH_WEIGHTS.keys(),
  ...FALLBACK_PATHS,
  "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587",
  "/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587",
  "\u7CFB\u7EDF.\u65F6\u8FB0",
  "/\u7CFB\u7EDF/\u65F6\u8FB0"
]);
function getAppendBasePath(command) {
  const path = getCommandPath(command);
  if (command.type === "insert") {
    const indexOrKey = command.args?.[1];
    return SAFE_APPEND_PATHS.has(path) && (indexOrKey === "'-'" || indexOrKey === "-" || indexOrKey === '"-"') ? path : "";
  }
  if (command.type !== "add") return "";
  if (SAFE_APPEND_PATHS.has(path)) {
    const indexOrKey = command.args?.[1];
    return indexOrKey === "'-'" || indexOrKey === "-" || indexOrKey === '"-"' ? path : "";
  }
  if (path.endsWith("/-")) {
    const basePath = path.slice(0, -2);
    return SAFE_APPEND_PATHS.has(basePath) ? basePath : "";
  }
  if (path.endsWith(".-")) {
    const basePath = path.slice(0, -2);
    return SAFE_APPEND_PATHS.has(basePath) ? basePath : "";
  }
  return "";
}
function normalizeSafeAppendCommand(command) {
  const basePath = getAppendBasePath(command);
  if (!basePath) return command;
  return {
    ...command,
    args: [basePath, "'-'", command.args?.at(-1)]
  };
}
function getCommandPath(command) {
  const firstArg = command.args?.[0];
  return typeof firstArg === "string" ? firstArg : "";
}
function drop(command, reason) {
  return { ...command, reason };
}
function getCommandValueLiteral(command) {
  const value = command.args?.at(-1);
  return typeof value === "string" ? value.trim() : JSON.stringify(value ?? null);
}
function normalizePath(path) {
  return path.startsWith("/") ? path.slice(1).replaceAll("/", ".") : path;
}
function parseLiteral(literal) {
  try {
    return JSON.parse(literal);
  } catch {
    return literal.replace(/^['"]|['"]$/g, "");
  }
}
function getSoulEchoNpc(command) {
  if (!isSafeAppendCommand(command)) return "";
  const path = getAppendBasePath(command);
  if (path !== "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD" && path !== "/\u7CFB\u7EDF/\u5FC3\u97F3\u56DE\u54CD") return "";
  const value = parseLiteral(getCommandValueLiteral(command));
  return isPlainRecord(value) && typeof value.npc === "string" ? value.npc : "";
}
function getSoulEchoSemanticKey2(value) {
  if (!isPlainRecord(value)) return "";
  const npc = typeof value.npc === "string" ? value.npc.trim() : "";
  const text = typeof value.text === "string" ? value.text.trim() : "";
  const scene = typeof value.scene === "string" ? value.scene.trim() : "";
  const time = typeof value.time === "string" ? value.time.trim() : "";
  return npc && text && scene && time ? `${npc}\0${text}\0${scene}\0${time}` : "";
}
function getSoulEchoCommandSemanticKey(command) {
  const path = getAppendBasePath(command);
  if (path !== "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD" && path !== "/\u7CFB\u7EDF/\u5FC3\u97F3\u56DE\u54CD") return "";
  return getSoulEchoSemanticKey2(parseLiteral(getCommandValueLiteral(command)));
}
function getTrustedSoulEchoNpcs(commands) {
  return new Set(commands.map(getSoulEchoNpc).filter(Boolean));
}
function getProbeNpcFromPath(path) {
  const normalized = normalizePath(path);
  const match = /^NPC\.([^\.]+)\.心声探测态$/.exec(normalized);
  return match?.[1] ?? "";
}
function isTrustedSoulCompanionSet(command, trustedSoulNpcs) {
  if (command.type !== "set" || trustedSoulNpcs.size === 0) return false;
  const path = getCommandPath(command);
  const value = parseLiteral(getCommandValueLiteral(command));
  if ((path === "\u7CFB\u7EDF.\u5F53\u524D\u805A\u7126\u5FC3\u58F0NPC" || path === "/\u7CFB\u7EDF/\u5F53\u524D\u805A\u7126\u5FC3\u58F0NPC") && typeof value === "string") {
    return trustedSoulNpcs.has(value);
  }
  const npc = getProbeNpcFromPath(path);
  if (!npc || !trustedSoulNpcs.has(npc) || typeof value !== "string") return false;
  return SOUL_PROBE_RESULT_STATES.has(value);
}
function isPlainRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function setByPath(target, path, value) {
  const parts = normalizePath(path).split(".").filter(Boolean);
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== "object" || cursor[part] === null || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  cursor[parts.at(-1)] = value;
}
function appendByPath(target, path, value) {
  const parts = normalizePath(path).split(".").filter(Boolean);
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== "object" || cursor[part] === null || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  const leaf = parts.at(-1);
  if (!Array.isArray(cursor[leaf])) {
    cursor[leaf] = [];
  }
  if (isPlainRecord(value) && typeof value.id === "string") {
    const id = value.id;
    const alreadyExists = cursor[leaf].some((item) => isPlainRecord(item) && item.id === id);
    if (alreadyExists) return;
  }
  if (path === "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD" || path === "/\u7CFB\u7EDF/\u5FC3\u97F3\u56DE\u54CD") {
    const semanticKey = getSoulEchoSemanticKey2(value);
    if (semanticKey) {
      const alreadyExists = cursor[leaf].some((item) => getSoulEchoSemanticKey2(item) === semanticKey);
      if (alreadyExists) return;
    }
  }
  cursor[leaf].push(value);
  if (path === "\u7CFB\u7EDF.\u5FC3\u97F3\u56DE\u54CD" || path === "/\u7CFB\u7EDF/\u5FC3\u97F3\u56DE\u54CD") {
    cursor[leaf] = cursor[leaf].slice(-12);
  }
}
function snapshotCommand(command) {
  return {
    type: command.type,
    full_match: command.full_match,
    args: command.args ? [...command.args] : void 0
  };
}
function pathDepth(command) {
  return normalizePath(getCommandPath(command)).split(".").filter(Boolean).length;
}
function sortParentPathsFirst(commands) {
  return commands.map((command, index) => ({ command, index })).sort((a, b) => {
    const depthDiff = pathDepth(a.command) - pathDepth(b.command);
    return depthDiff === 0 ? a.index - b.index : depthDiff;
  }).map((item) => item.command);
}
function pruneSceneContextChildren(commands, droppedCommands) {
  const hasFullSceneContext = commands.some((command) => {
    const path = getCommandPath(command);
    return path === "\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587" || path === "/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587";
  });
  if (!hasFullSceneContext) return commands;
  return commands.filter((command) => {
    const path = getCommandPath(command);
    const isSceneContextChild = path.startsWith("\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.") || path.startsWith("/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587/");
    if (isSceneContextChild) {
      droppedCommands.push(drop(command, "covered_by_full_scene_context"));
      return false;
    }
    return true;
  });
}
function isSelectableCommand(command) {
  const path = getCommandPath(command);
  return SELECTABLE_PATHS.has(path) || path.startsWith("\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.") || path.startsWith("/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587/") || path.startsWith("\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.") || path.startsWith("/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/");
}
function isSafeAppendCommand(command) {
  return Boolean(getAppendBasePath(command));
}
function valueScore(command) {
  const literal = getCommandValueLiteral(command);
  if (!literal || literal === "null" || literal === "undefined") return -20;
  if (literal === "[]" || literal === "{}" || literal === '""') return 0;
  if (/^\[\s*\]/.test(literal) || /^\{\s*\}/.test(literal)) return 0;
  return Math.min(20, literal.length);
}
function commandScore(command) {
  const path = getCommandPath(command);
  if (path.startsWith("\u7CFB\u7EDF.\u573A\u666F\u4E0A\u4E0B\u6587.") || path.startsWith("/\u7CFB\u7EDF/\u573A\u666F\u4E0A\u4E0B\u6587/")) {
    return Math.min(4, valueScore(command));
  }
  if (path.startsWith("\u7CFB\u7EDF.\u65F6\u95F4\u72B6\u6001.") || path.startsWith("/\u7CFB\u7EDF/\u65F6\u95F4\u72B6\u6001/")) {
    return 3 + Math.min(6, valueScore(command));
  }
  const base = BUSINESS_PATH_WEIGHTS.get(path) ?? 1;
  return base + valueScore(command);
}
function dedupeCriticalPaths(commands, droppedCommands) {
  const indexesByPath = /* @__PURE__ */ new Map();
  const kept = [];
  for (const command of commands) {
    const path = getCommandPath(command);
    if (!CRITICAL_PATHS.has(path)) {
      kept.push(command);
      continue;
    }
    const existingIndex = indexesByPath.get(path);
    if (existingIndex === void 0) {
      indexesByPath.set(path, kept.length);
      kept.push(command);
      continue;
    }
    const existing = kept[existingIndex];
    if (commandScore(command) > commandScore(existing)) {
      droppedCommands.push(drop(existing, "duplicate_critical_path"));
      kept[existingIndex] = command;
    } else {
      droppedCommands.push(drop(command, "duplicate_critical_path"));
    }
  }
  return kept;
}
function sanitizeMvuCommands(commands) {
  if (!Array.isArray(commands)) {
    return {
      strategy: "path_scoring_v2",
      scanned: 0,
      kept: 0,
      dropped: 0,
      droppedCommands: [],
      keptCommands: [],
      selectedPathCount: 0
    };
  }
  const originalLength = commands.length;
  const droppedCommands = [];
  const bestByPath = /* @__PURE__ */ new Map();
  const keptSafeAppends = [];
  const keptSoulEchoKeys = /* @__PURE__ */ new Set();
  const trustedSoulNpcs = getTrustedSoulEchoNpcs(commands);
  for (const command of commands) {
    if (isSafeAppendCommand(command)) {
      const appendCommand = normalizeSafeAppendCommand(command);
      const soulEchoKey = getSoulEchoCommandSemanticKey(appendCommand);
      if (soulEchoKey) {
        if (keptSoulEchoKeys.has(soulEchoKey)) {
          droppedCommands.push(drop(appendCommand, "duplicate_soul_echo_semantic_key"));
          continue;
        }
        keptSoulEchoKeys.add(soulEchoKey);
      }
      const echoValue = parseLiteral(getCommandValueLiteral(appendCommand));
      if (isPlainRecord(echoValue) && typeof echoValue.result === "string" && !VALID_ECHO_RESULT_STATES.has(echoValue.result)) {
        droppedCommands.push(drop(appendCommand, "invalid_soul_echo_result"));
        continue;
      }
      keptSafeAppends.push(appendCommand);
      continue;
    }
    const commandType = String(command.type ?? "");
    if (DISALLOWED_COMMAND_TYPES.has(commandType)) {
      droppedCommands.push(drop(command, "disallowed_command_type"));
      continue;
    }
    if (!isSelectableCommand(command) && !isTrustedSoulCompanionSet(command, trustedSoulNpcs)) {
      droppedCommands.push(drop(command, "untrusted_path"));
      continue;
    }
    const path = getCommandPath(command);
    const existing = bestByPath.get(path);
    if (!existing || commandScore(command) > commandScore(existing)) {
      if (existing) droppedCommands.push(drop(existing, "lower_scored_path_candidate"));
      bestByPath.set(path, command);
    } else {
      droppedCommands.push(drop(command, "lower_scored_path_candidate"));
    }
  }
  const kept = sortParentPathsFirst(
    pruneSceneContextChildren(dedupeCriticalPaths([...bestByPath.values(), ...keptSafeAppends], droppedCommands), droppedCommands)
  );
  commands.splice(0, commands.length, ...kept);
  return {
    strategy: "path_scoring_v2",
    scanned: originalLength,
    kept: kept.length,
    dropped: droppedCommands.length,
    droppedCommands,
    keptCommands: kept.map(snapshotCommand),
    selectedPathCount: bestByPath.size
  };
}
function applySanitizedCommandFallback(newData, diagnostics) {
  if (!newData || diagnostics?.strategy !== "path_scoring_v2" || !Array.isArray(diagnostics.keptCommands)) return;
  const trustedSoulNpcs = getTrustedSoulEchoNpcs(diagnostics.keptCommands);
  for (const command of diagnostics.keptCommands) {
    const path = getCommandPath(command);
    if (command.type === "set") {
      if (!FALLBACK_PATHS.has(path) && !isTrustedSoulCompanionSet(command, trustedSoulNpcs)) continue;
      setByPath(newData, path, parseLiteral(getCommandValueLiteral(command)));
      continue;
    }
    if (isSafeAppendCommand(command)) {
      appendByPath(newData, getAppendBasePath(command), parseLiteral(getCommandValueLiteral(command)));
    }
  }
}

// src/雌堕合欢宗/脚本/后端校验/p2DominanceBaseline.ts
var import_lodash2 = __toESM(require_lodash());
var NPC\u5217\u88682 = ["\u767D\u82B7", "\u82CF\u82B8", "\u7EAA\u5170", "\u6C88\u6708\u79CB", "\u67F3\u7D20\u8863"];
function getTrainingRecordIds(data) {
  const records = import_lodash2.default.get(data, "\u725D\u5974.\u8C03\u6559\u8BB0\u5F55", []);
  if (!Array.isArray(records)) return [];
  return records.map((record) => import_lodash2.default.isPlainObject(record) && typeof record.id === "string" ? record.id : "").filter(Boolean);
}
function hasSameTrainingRecords(a, b) {
  const aIds = getTrainingRecordIds(a);
  const bIds = getTrainingRecordIds(b);
  return aIds.length > 0 && aIds.length === bIds.length && aIds.every((id, index) => id === bIds[index]);
}
function dominanceTotal(data) {
  return NPC\u5217\u88682.reduce((sum, npc) => sum + Number(import_lodash2.default.get(data, `\u725D\u5974.\u652F\u914D\u6B21\u6570.${npc}`, 0) || 0), 0);
}
function hasLowerDominance(candidate, target) {
  return NPC\u5217\u88682.some((npc) => Number(import_lodash2.default.get(candidate, `\u725D\u5974.\u652F\u914D\u6B21\u6570.${npc}`, 0) || 0) < Number(import_lodash2.default.get(target, `\u725D\u5974.\u652F\u914D\u6B21\u6570.${npc}`, 0) || 0));
}
function findNonEmptyLedgerCandidate(input) {
  if (getTrainingRecordIds(input.newData).length > 0 || getTrainingRecordIds(input.eventOldData).length > 0) return null;
  return input.candidateHistory.find((candidate) => import_lodash2.default.isPlainObject(candidate) && import_lodash2.default.get(candidate, "\u7CFB\u7EDF.\u9636\u6BB5") === "\u725D\u5974\u671F" && getTrainingRecordIds(candidate).length > 0) ?? null;
}
function selectP2DominanceBaseline(input) {
  if (import_lodash2.default.get(input.newData, "\u7CFB\u7EDF.\u9636\u6BB5") !== "\u725D\u5974\u671F") return input.eventOldData;
  const nonEmptyLedgerCandidate = findNonEmptyLedgerCandidate(input);
  if (nonEmptyLedgerCandidate) return nonEmptyLedgerCandidate;
  if (!hasSameTrainingRecords(input.newData, input.eventOldData)) return input.eventOldData;
  const lowerCandidates = input.candidateHistory.filter((candidate) => import_lodash2.default.isPlainObject(candidate)).filter((candidate) => hasSameTrainingRecords(input.newData, candidate)).filter((candidate) => hasLowerDominance(candidate, input.newData));
  if (lowerCandidates.length === 0) return input.eventOldData;
  return lowerCandidates.reduce((best, candidate) => dominanceTotal(candidate) < dominanceTotal(best) ? candidate : best);
}

// src/雌堕合欢宗/脚本/后端校验/index.ts
var narrativePromptRuntime = createNarrativePromptRuntime({
  getStatData: () => findStatDataForNarrativePrompt((message_id) => Mvu.getMvuData({ type: "message", message_id })?.stat_data),
  injectPrompts,
  uninjectPrompts
});
await waitGlobalInitialized("Mvu");
function getRecentStatDataHistory() {
  const history = [];
  for (let offset = -1; offset >= -8; offset--) {
    try {
      const statData = _.get(Mvu.getMvuData({ type: "message", message_id: offset }), "stat_data");
      if (statData && typeof statData === "object") history.push(statData);
    } catch {
    }
  }
  return history;
}
eventOn(tavern_events.MESSAGE_SENT, () => narrativePromptRuntime.refresh("message_sent"));
eventOn(tavern_events.GENERATION_STARTED, () => narrativePromptRuntime.refresh("generation_started"));
eventOn(tavern_events.GENERATE_BEFORE_COMBINE_PROMPTS, () => narrativePromptRuntime.refresh("before_combine_prompts"));
eventOn(tavern_events.GENERATION_ENDED, narrativePromptRuntime.clear);
eventOn(tavern_events.CHAT_CHANGED, narrativePromptRuntime.clear);
eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, (data) => {
  if (data && data.message_content && typeof data.message_content === "string") {
    if (!data.message_content.includes("<StatusPlaceHolderImpl/>")) {
      data.message_content += "\n<StatusPlaceHolderImpl/>";
    }
  }
});
eventOn(Mvu.events.COMMAND_PARSED, (...args) => {
  const commands = args.find((arg) => Array.isArray(arg));
  const diagnostics = sanitizeMvuCommands(commands);
  if (typeof window !== "undefined") {
    window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__ = diagnostics;
  }
});
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
  const new_data = _.get(new_variables, "stat_data");
  const event_old_data = _.get(old_variables, "stat_data");
  if (!new_data || !event_old_data) return;
  const old_data = selectP2DominanceBaseline({
    newData: new_data,
    eventOldData: event_old_data,
    candidateHistory: getRecentStatDataHistory()
  });
  applySanitizedCommandFallback(new_data, window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__);
  validateVariables(new_data, old_data);
  applySanitizedCommandFallback(new_data, window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__);
});
if (typeof window !== "undefined") {
  let __TEST_computeDiff = function(before, after) {
    const changes = [];
    const bObj = JSON.parse(before);
    const aObj = JSON.parse(after);
    function walk(b, a, path) {
      if (typeof b === "object" && b !== null && typeof a === "object" && a !== null && !Array.isArray(b) && !Array.isArray(a)) {
        const bRecord = b;
        const aRecord = a;
        const keys = /* @__PURE__ */ new Set([...Object.keys(bRecord), ...Object.keys(aRecord)]);
        for (const k of keys) {
          walk(bRecord[k], aRecord[k], path ? path + "." + k : k);
        }
      } else if (JSON.stringify(b) !== JSON.stringify(a)) {
        changes.push({ path, from: b, to: a });
      }
    }
    walk(bObj, aObj, "");
    return changes;
  };
  __TEST_computeDiff2 = __TEST_computeDiff;
  window.__HEHUAN_MVU_COMMAND_SANITIZER_LAST__ = {
    strategy: "path_scoring_v2",
    scanned: 0,
    kept: 0,
    dropped: 0,
    droppedCommands: [],
    keptCommands: [],
    selectedPathCount: 0
  };
  window.__HEHUAN_NARRATIVE_PROMPT_SNAPSHOT__ = () => narrativePromptRuntime.getSnapshot();
  window.__TEST_refreshNarrativePrompts = (reason = "test_manual_refresh") => {
    narrativePromptRuntime.refresh(reason);
    return narrativePromptRuntime.getSnapshot();
  };
  window.__TEST_applyValidatedUpdate = async function(pairs) {
    const event_old_data = structuredClone(_.get(Mvu.getMvuData({ type: "message", message_id: "latest" }), "stat_data"));
    const old_data = selectP2DominanceBaseline({
      newData: event_old_data,
      eventOldData: event_old_data,
      candidateHistory: getRecentStatDataHistory()
    });
    const new_data = structuredClone(event_old_data);
    for (let i = 0; i < pairs.length; i++) {
      _.set(new_data, pairs[i][0], pairs[i][1]);
    }
    const before = JSON.stringify(new_data);
    validateVariables(new_data, old_data);
    const after = JSON.stringify(new_data);
    const trace = before !== after ? __TEST_computeDiff(before, after) : [];
    const mvuData = Mvu.getMvuData({ type: "message", message_id: "latest" });
    const clone = structuredClone(mvuData);
    clone.stat_data = new_data;
    await Mvu.replaceMvuData(clone, { type: "message", message_id: "latest" });
    return { stat_data: new_data, trace };
  };
}
var __TEST_computeDiff2;
/*! Bundled license information:

lodash/lodash.js:
  (**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
