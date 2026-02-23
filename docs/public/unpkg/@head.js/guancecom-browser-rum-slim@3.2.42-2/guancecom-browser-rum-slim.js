/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

// UNUSED EXPORTS: datafluxRum

;// CONCATENATED MODULE: ../core/esm/helper/display.js

var ConsoleApiName = {
  log: 'log',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error'
};
var globalConsole = console;
var originalConsoleMethods = {};
Object.keys(ConsoleApiName).forEach(function (name) {
  originalConsoleMethods[name] = globalConsole[name] || tools_noop;
});
var PREFIX = 'GUANCE Browser SDK:';
var display = {
  debug: originalConsoleMethods.debug.bind(globalConsole, PREFIX),
  log: originalConsoleMethods.log.bind(globalConsole, PREFIX),
  info: originalConsoleMethods.info.bind(globalConsole, PREFIX),
  warn: originalConsoleMethods.warn.bind(globalConsole, PREFIX),
  error: originalConsoleMethods.error.bind(globalConsole, PREFIX)
};
;// CONCATENATED MODULE: ../core/esm/helper/monitor.js

var onMonitorErrorCollected;
var debugMode = false;
function startMonitorErrorCollection(newOnMonitorErrorCollected) {
  onMonitorErrorCollected = newOnMonitorErrorCollected;
}
function setDebugMode(newDebugMode) {
  debugMode = newDebugMode;
}
function resetMonitor() {
  onMonitorErrorCollected = undefined;
  debugMode = false;
}
function monitor(fn) {
  return function () {
    return callMonitored(fn, this, arguments);
  };
}
function callMonitored(fn, context, args) {
  try {
    return fn.apply(context, args);
  } catch (e) {
    displayIfDebugEnabled(e);
    if (onMonitorErrorCollected) {
      try {
        onMonitorErrorCollected(e);
      } catch (e) {
        displayIfDebugEnabled(e);
      }
    }
  }
}
function displayIfDebugEnabled() {
  var args = [].slice.call(arguments);
  //   display.error.apply(null, ['[MONITOR]'].concat(args))
  if (debugMode) {
    display.error.apply(null, ['[MONITOR]'].concat(args));
  }
}
;// CONCATENATED MODULE: ../core/esm/helper/catchUserErrors.js

function catchUserErrors(fn, errorMsg) {
  return function () {
    var args = [].slice.call(arguments);
    try {
      return fn.apply(this, args);
    } catch (err) {
      display.error(errorMsg, err);
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/init.js



function makePublicApi(stub) {
  var publicApi = tools_assign({
    // 把 snippet 定义的 onReady 覆盖掉，但保留了 q
    onReady: function (callback) {
      callback();
    }
  }, stub);

  // Add an "hidden" property to set debug mode. We define it that way to hide it
  // as much as possible but of course it's not a real protection.
  Object.defineProperty(publicApi, '_setDebug', {
    get: function () {
      return setDebugMode;
    },
    enumerable: false
  });
  return publicApi;
}
function defineGlobal(global, name, api) {
  var existingGlobalVariable = global[name];
  global[name] = api;
  if (existingGlobalVariable && existingGlobalVariable.q) {
    each(existingGlobalVariable.q, function (fn) {
      catchUserErrors(fn, 'onReady callback threw an error:')();
    });
  }
}
function getGlobalObject() {
  if (typeof globalThis === 'object') {
    return globalThis;
  }
  Object.defineProperty(Object.prototype, '_gc_temp_', {
    get: function () {
      return this;
    },
    configurable: true
  });
  // @ts-ignore
  var globalObject = _gc_temp_;
  // @ts-ignore
  delete Object.prototype._gc_temp_;
  if (typeof globalObject !== 'object') {
    // on safari _gc_temp_ is available on window but not globally
    // fallback on other browser globals check
    if (typeof self === 'object') {
      globalObject = self;
    } else if (typeof window === 'object') {
      globalObject = window;
    } else {
      globalObject = {};
    }
  }
  return globalObject;
}
;// CONCATENATED MODULE: ../core/esm/helper/getZoneJsOriginalValue.js

/**
 * Gets the original value for a DOM API that was potentially patched by Zone.js.
 *
 * Zone.js[1] is a library that patches a bunch of JS and DOM APIs. It usually stores the original
 * value of the patched functions/constructors/methods in a hidden property prefixed by
 * __zone_symbol__.
 *
 * In multiple occasions, we observed that Zone.js is the culprit of important issues leading to
 * browser resource exhaustion (memory leak, high CPU usage). This method is used as a workaround to
 * use the original DOM API instead of the one patched by Zone.js.
 *
 * [1]: https://github.com/angular/angular/tree/main/packages/zone.js
 */
function getZoneJsOriginalValue(target, name) {
  var browserWindow = getGlobalObject();
  var original;
  if (browserWindow.Zone && typeof browserWindow.Zone.__symbol__ === 'function') {
    original = target[browserWindow.Zone.__symbol__(name)];
  }
  if (!original) {
    original = target[name];
  }
  return original;
}
;// CONCATENATED MODULE: ../core/esm/helper/timer.js



function timer_setTimeout(callback, delay) {
  return getZoneJsOriginalValue(getGlobalObject(), 'setTimeout')(monitor(callback), delay);
}
function timer_clearTimeout(timeoutId) {
  getZoneJsOriginalValue(getGlobalObject(), 'clearTimeout')(timeoutId);
}
function timer_setInterval(callback, delay) {
  return getZoneJsOriginalValue(getGlobalObject(), 'setInterval')(monitor(callback), delay);
}
function timer_clearInterval(timeoutId) {
  getZoneJsOriginalValue(getGlobalObject(), 'clearInterval')(timeoutId);
}
;// CONCATENATED MODULE: ../core/esm/helper/tools.js


var ArrayProto = Array.prototype;
// var FuncProto = Function.prototype
var ObjProto = Object.prototype;
var slice = ArrayProto.slice;
var tools_toString = ObjProto.toString;
var tools_hasOwnProperty = ObjProto.hasOwnProperty;
var nativeForEach = ArrayProto.forEach;
var nativeIsArray = Array.isArray;
var breaker = false;
var each = function (obj, iterator, context) {
  if (obj === null) return false;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (tools_hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return false;
        }
      }
    }
  }
};
function tools_assign(target) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  });
  return target;
}
function shallowClone(object) {
  return tools_assign({}, object);
}
var extend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};
var extend2Lev = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};
var coverExtend = function (obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};
var isArray = nativeIsArray || function (obj) {
  return tools_toString.call(obj) === '[object Array]';
};
var isFunction = function (f) {
  if (!f) {
    return false;
  }
  try {
    return /^\s*\bfunction\b/.test(f);
  } catch (err) {
    return false;
  }
};
var isArguments = function (obj) {
  return !!(obj && tools_hasOwnProperty.call(obj, 'callee'));
};
var toArray = function (iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (isArray(iterable)) {
    return slice.call(iterable);
  }
  if (isArguments(iterable)) {
    return slice.call(iterable);
  }
  return values(iterable);
};
var values = function (obj) {
  var results = [];
  if (obj === null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
};
var keys = function (obj) {
  var results = [];
  if (obj === null) {
    return results;
  }
  each(obj, function (value, key) {
    results[results.length] = key;
  });
  return results;
};
var indexOf = function (arr, target) {
  var indexOf = arr.indexOf;
  if (indexOf) {
    return indexOf.call(arr, target);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        return i;
      }
    }
    return -1;
  }
};
var hasAttribute = function (ele, attr) {
  if (ele.hasAttribute) {
    return ele.hasAttribute(attr);
  } else {
    return !!(ele.attributes[attr] && ele.attributes[attr].specified);
  }
};
var filter = function (arr, fn, self) {
  if (arr.filter) {
    return arr.filter(fn);
  }
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!tools_hasOwnProperty.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    if (fn.call(self, val, i, arr)) {
      ret.push(val);
    }
  }
  return ret;
};
var tools_map = function (arr, fn, self) {
  if (arr.map) {
    return arr.map(fn);
  }
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!tools_hasOwnProperty.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    ret.push(fn.call(self, val, i, arr));
  }
  return ret;
};
var some = function (arr, fn, self) {
  if (arr.some) {
    return arr.some(fn);
  }
  var flag = false;
  for (var i = 0; i < arr.length; i++) {
    if (!tools_hasOwnProperty.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    if (fn.call(self, val, i, arr)) {
      flag = true;
      break;
    }
  }
  return flag;
};
var every = function (arr, fn, self) {
  if (arr.every) {
    return arr.every(fn);
  }
  var flag = true;
  for (var i = 0; i < arr.length; i++) {
    if (!tools_hasOwnProperty.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    if (!fn.call(self, val, i, arr)) {
      flag = false;
      break;
    }
  }
  return flag;
};
var matchList = function (list, value, useStartsWith) {
  if (useStartsWith === undefined) {
    useStartsWith = false;
  }
  return some(list, function (item) {
    try {
      if (typeof item === 'function') {
        return item(value);
      } else if (item instanceof RegExp) {
        return item.test(value);
      } else if (typeof item === 'string') {
        return useStartsWith ? startsWith(value, item) : item === value;
      }
    } catch (e) {
      display.error(e);
    }
    return false;
  });
};
// https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/selector/escapeSelector.js
var cssEscape = function (str) {
  str = str + '';
  if (window.CSS && window.CSS.escape) {
    return window.CSS.escape(str);
  }

  // eslint-disable-next-line no-control-regex
  return str.replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, function (ch, asCodePoint) {
    if (asCodePoint) {
      // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
      if (ch === '\0') {
        return '\uFFFD';
      }
      // Control characters and (dependent upon position) numbers get escaped as code points
      return ch.slice(0, -1) + '\\' + ch.charCodeAt(ch.length - 1).toString(16) + ' ';
    }
    // Other potentially-special ASCII characters get backslash-escaped
    return '\\' + ch;
  });
};
var inherit = function (subclass, superclass) {
  var F = function () {};
  F.prototype = superclass.prototype;
  subclass.prototype = new F();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass;
};
var tirm = function (str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
var isObject = function (obj) {
  if (obj === null) return false;
  return tools_toString.call(obj) === '[object Object]';
};
var isEmptyObject = function (obj) {
  if (isObject(obj)) {
    for (var key in obj) {
      if (tools_hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};
var objectEntries = function (object) {
  var res = [];
  each(object, function (value, key) {
    res.push([key, value]);
  });
  return res;
};
var isUndefined = function (obj) {
  return obj === void 0;
};
var isString = function (obj) {
  return tools_toString.call(obj) === '[object String]';
};
var isDate = function (obj) {
  return tools_toString.call(obj) === '[object Date]';
};
var isBoolean = function (obj) {
  return tools_toString.call(obj) === '[object Boolean]';
};
var isNumber = function (obj) {
  return tools_toString.call(obj) === '[object Number]' && /[\d\.]+/.test(String(obj));
};
var isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};
var isJSONString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
var safeJSONParse = function (str) {
  var val = null;
  try {
    val = JSON.parse(str);
  } catch (e) {
    return false;
  }
  return val;
};

// export var encodeDates = function (obj) {
//   each(obj, function (v, k) {
//     if (isDate(v)) {
//       obj[k] = formatDate(v)
//     } else if (isObject(v)) {
//       obj[k] = encodeDates(v)
//     }
//   })
//   return obj
// }
var mediaQueriesSupported = function () {
  return typeof window.matchMedia !== 'undefined' || typeof window.msMatchMedia !== 'undefined';
};
var getScreenOrientation = function () {
  var screenOrientationAPI = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
  var screenOrientation = 'unknown';
  if (screenOrientationAPI) {
    screenOrientation = screenOrientationAPI.indexOf('landscape') > -1 ? 'landscape' : 'portrait';
  } else if (mediaQueriesSupported()) {
    var matchMediaFunc = window.matchMedia || window.msMatchMedia;
    if (matchMediaFunc('(orientation: landscape)').matches) {
      screenOrientation = 'landscape';
    } else if (matchMediaFunc('(orientation: portrait)').matches) {
      screenOrientation = 'portrait';
    }
  }
  return screenOrientation;
};
var now = Date.now || function () {
  return new Date().getTime();
};
var throttle = function (fn, wait, options) {
  var needLeadingExecution = options && options.leading !== undefined ? options.leading : true;
  var needTrailingExecution = options && options.trailing !== undefined ? options.trailing : true;
  let inWaitPeriod = false;
  let pendingExecutionWithParameters;
  let pendingTimeoutId;
  var context = this;
  return {
    throttled: function () {
      if (inWaitPeriod) {
        pendingExecutionWithParameters = arguments;
        return;
      }
      if (needLeadingExecution) {
        fn.apply(context, arguments);
      } else {
        pendingExecutionWithParameters = arguments;
      }
      inWaitPeriod = true;
      pendingTimeoutId = timer_setTimeout(function () {
        if (needTrailingExecution && pendingExecutionWithParameters) {
          fn.apply(context, pendingExecutionWithParameters);
        }
        inWaitPeriod = false;
        pendingExecutionWithParameters = undefined;
      }, wait);
    },
    cancel: function () {
      timer_clearTimeout(pendingTimeoutId);
      inWaitPeriod = false;
      pendingExecutionWithParameters = undefined;
    }
  };
};
var hashCode = function (str) {
  if (typeof str !== 'string') {
    return 0;
  }
  var hash = 0;
  var char = null;
  if (str.length == 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};
// export var formatDate = function (d) {
//   function pad(n) {
//     return n < 10 ? '0' + n : n
//   }

//   return (
//     d.getFullYear() +
//     '-' +
//     pad(d.getMonth() + 1) +
//     '-' +
//     pad(d.getDate()) +
//     ' ' +
//     pad(d.getHours()) +
//     ':' +
//     pad(d.getMinutes()) +
//     ':' +
//     pad(d.getSeconds()) +
//     '.' +
//     pad(d.getMilliseconds())
//   )
// }
// export var searchObjDate = function (o) {
//   if (isObject(o)) {
//     each(o, function (a, b) {
//       if (isObject(a)) {
//         searchObjDate(o[b])
//       } else {
//         if (isDate(a)) {
//           o[b] = formatDate(a)
//         }
//       }
//     })
//   }
// }
// export var formatJsonString = function (obj) {
//   try {
//     return JSON.stringify(obj, null, '  ')
//   } catch (e) {
//     return JSON.stringify(obj)
//   }
// }

// export var searchObjString = function (o) {
//   if (isObject(o)) {
//     each(o, function (a, b) {
//       if (isObject(a)) {
//         searchObjString(o[b])
//       } else {
//         if (isString(a)) {
//           o[b] = formatString(a)
//         }
//       }
//     })
//   }
// }
var unique = function (ar) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < ar.length; i++) {
    temp = ar[i];
    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
};
var strip_empty_properties = function (p) {
  var ret = {};
  each(p, function (v, k) {
    if (v != null) {
      ret[k] = v;
    }
  });
  return ret;
};
var utf8Encode = function (string) {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  var utftext = '',
    start,
    end;
  var stringl = 0,
    n;
  start = end = 0;
  stringl = string.length;
  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;
    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
    } else {
      enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start) {
    utftext += string.substring(start, string.length);
  }
  return utftext;
};
var base64Encode = function (data) {
  if (typeof btoa === 'function') {
    return btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }
  data = String(data);
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);
    bits = o1 << 16 | o2 << 8 | o3;
    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);
  enc = tmp_arr.join('');
  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }
  return enc;
};
/**
 * UUID v4
 * from https://gist.github.com/jed/982883
 */
function UUID(placeholder) {
  return placeholder ?
  // eslint-disable-next-line  no-bitwise
  (parseInt(placeholder, 10) ^ Math.random() * 16 >> parseInt(placeholder, 10) / 4).toString(16) : "".concat(1e7, "-", 1e3, "-", 4e3, "-", 8e3, "-", 1e11).replace(/[018]/g, UUID);
}

/**
 * 替换url包含数字的路由, e.g.
 * 
 * /authors/345             ->  /authors/?
 * /authors/abc             ->  /authors/abc
 * /authors/a4c             ->  /authors/?
 * /v2/authors/345          ->  /?/authors/?
 * /authors/abc#/books/678  ->  /authors/abc#/books/?
 * /authors/345#/books/678  ->  /authors/?/books/?
 */
function replaceNumberCharByPath(path) {
  var pathGroup = '';
  if (path) {
    pathGroup = path.replace(/\/([^\/]*)\d([^\/]*)/g, '/?').replace(/\/$/g, '');
  }
  return pathGroup || '/';
}
var urlParse = function (para) {
  var URLParser = function (a) {
    this._fields = {
      Username: 4,
      Password: 5,
      Port: 7,
      Protocol: 2,
      Host: 6,
      Path: 8,
      URL: 0,
      QueryString: 9,
      Fragment: 10
    };
    this._values = {};
    this._regex = null;
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
    if (typeof a != 'undefined') {
      this._parse(a);
    }
  };
  URLParser.prototype.setUrl = function (a) {
    this._parse(a);
  };
  URLParser.prototype._initValues = function () {
    for (var a in this._fields) {
      this._values[a] = '';
    }
  };
  URLParser.prototype.addQueryString = function (queryObj) {
    if (typeof queryObj !== 'object') {
      return false;
    }
    var query = this._values.QueryString || '';
    for (var i in queryObj) {
      if (new RegExp(i + '[^&]+').test(query)) {
        query = query.replace(new RegExp(i + '[^&]+'), i + '=' + queryObj[i]);
      } else {
        if (query.slice(-1) === '&') {
          query = query + i + '=' + queryObj[i];
        } else {
          if (query === '') {
            query = i + '=' + queryObj[i];
          } else {
            query = query + '&' + i + '=' + queryObj[i];
          }
        }
      }
    }
    this._values.QueryString = query;
  };
  URLParser.prototype.getParse = function () {
    return this._values;
  };
  URLParser.prototype.getUrl = function () {
    var url = '';
    url += this._values.Origin;
    // url += this._values.Port ? ':' + this._values.Port : ''
    url += this._values.Path;
    url += this._values.QueryString ? '?' + this._values.QueryString : '';
    return url;
  };
  URLParser.prototype._parse = function (a) {
    this._initValues();
    var b = this._regex.exec(a);
    if (!b) {
      throw 'DPURLParser::_parse -> Invalid URL';
    }
    for (var c in this._fields) {
      if (typeof b[this._fields[c]] != 'undefined') {
        this._values[c] = b[this._fields[c]];
      }
    }
    this._values['Path'] = this._values['Path'] || '/';
    this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '');
    this._values['Origin'] = this._values['Protocol'] + '://' + this._values['Hostname'] + (this._values.Port ? ':' + this._values.Port : '');
    // this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '')
    // this._values['Origin'] =
    //   this._values['Protocol'] + '://' + this._values['Hostname']
  };
  return new URLParser(para);
};
function elementMatches(element, selector) {
  if (element.matches) {
    return element.matches(selector);
  }
  // IE11 support
  if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  }
  return false;
}

// export var localStorage = {
//   get: function (name) {
//     return window.localStorage.getItem(name)
//   },

//   parse: function (name) {
//     var storedValue
//     try {
//       storedValue = JSON.parse(localStorage.get(name)) || null
//     } catch (err) {
//       sd.log(err)
//     }
//     return storedValue
//   },

//   set: function (name, value) {
//     window.localStorage.setItem(name, value)
//   },

//   remove: function (name) {
//     window.localStorage.removeItem(name)
//   },

//   isSupport: function () {
//     var supported = true
//     try {
//       var key = '__sensorsdatasupport__'
//       var val = 'testIsSupportStorage'
//       localStorage.set(key, val)
//       if (localStorage.get(key) !== val) {
//         supported = false
//       }
//       localStorage.remove(key)
//     } catch (err) {
//       supported = false
//     }
//     return supported
//   }
// }
// export var sessionStorage = {
//   isSupport: function () {
//     var supported = true

//     var key = '__sensorsdatasupport__'
//     var val = 'testIsSupportStorage'
//     try {
//       if (sessionStorage && sessionStorage.setItem) {
//         sessionStorage.setItem(key, val)
//         sessionStorage.removeItem(key, val)
//         supported = true
//       } else {
//         supported = false
//       }
//     } catch (e) {
//       supported = false
//     }
//     return supported
//   }
// }
// export var isSupportCors = function () {
//   if (typeof window.XMLHttpRequest === 'undefined') {
//     return false
//   }
//   if ('withCredentials' in new XMLHttpRequest()) {
//     return true
//   } else if (typeof XDomainRequest !== 'undefined') {
//     return true
//   } else {
//     return false
//   }
// }
var xhr = function (cors) {
  if (cors) {
    if (typeof window.XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest()) {
      return new XMLHttpRequest();
    } else if (typeof XDomainRequest !== 'undefined') {
      return new XDomainRequest();
    } else {
      return null;
    }
  } else {
    if (typeof window.XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (d) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (d) {
          console.log(d);
        }
      }
    }
  }
};
var ajax = function (para) {
  para.timeout = para.timeout || 20000;
  para.credentials = typeof para.credentials === 'undefined' ? true : para.credentials;
  function getJSON(data) {
    if (!data) {
      return '';
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  var g = xhr(para.cors);
  if (!g) {
    return false;
  }
  if (!para.type) {
    para.type = para.data ? 'POST' : 'GET';
  }
  para = extend({
    success: function () {},
    error: function () {}
  }, para);
  try {
    if (typeof g === 'object' && 'timeout' in g) {
      g.timeout = para.timeout;
    } else {
      setTimeout(function () {
        g.abort();
      }, para.timeout + 500);
    }
  } catch (e) {
    try {
      setTimeout(function () {
        g.abort();
      }, para.timeout + 500);
    } catch (e2) {}
  }
  g.onreadystatechange = function () {
    try {
      if (g.readyState == 4) {
        if (g.status >= 200 && g.status < 300 || g.status == 304) {
          para.success(getJSON(g.responseText));
        } else {
          para.error(getJSON(g.responseText), g.status);
        }
        g.onreadystatechange = null;
        g.onload = null;
      }
    } catch (e) {
      g.onreadystatechange = null;
      g.onload = null;
    }
  };
  g.open(para.type, para.url, true);
  try {
    if (para.credentials) {
      g.withCredentials = true;
    }
    if (isObject(para.header)) {
      for (var i in para.header) {
        g.setRequestHeader(i, para.header[i]);
      }
    }
    if (para.data) {
      if (!para.cors) {
        g.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      if (para.contentType === 'application/json') {
        g.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      } else {
        g.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
    }
  } catch (e) {}
  g.send(para.data || null);
};
var loadScript = function (para) {
  para = extend({
    success: function () {},
    error: function () {},
    appendCall: function (g) {
      document.getElementsByTagName('head')[0].appendChild(g);
    }
  }, para);
  var g = null;
  if (para.type === 'css') {
    g = document.createElement('link');
    g.rel = 'stylesheet';
    g.href = para.url;
  }
  if (para.type === 'js') {
    g = document.createElement('script');
    g.async = 'async';
    g.setAttribute('charset', 'UTF-8');
    g.src = para.url;
    g.type = 'text/javascript';
  }
  g.onload = g.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      para.success();
      g.onload = g.onreadystatechange = null;
    }
  };
  g.onerror = function () {
    para.error();
    g.onerror = null;
  };
  para.appendCall(g);
};
var getHostname = function (url, defaultValue) {
  if (!defaultValue || typeof defaultValue !== 'string') {
    defaultValue = 'hostname expception!';
  }
  var hostname = null;
  try {
    hostname = URL(url).hostname;
  } catch (e) {}
  return hostname || defaultValue;
};
var getQueryParamsFromUrl = function (url) {
  var result = {};
  var arr = url.split('?');
  var queryString = arr[1] || '';
  if (queryString) {
    result = getURLSearchParams('?' + queryString);
  }
  return result;
};
var getURLSearchParams = function (queryString) {
  queryString = queryString || '';
  var decodeParam = function (str) {
    return decodeURIComponent(str);
  };
  var args = {};
  var query = queryString.substring(1);
  var pairs = query.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos === -1) continue;
    var name = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    name = decodeParam(name);
    value = decodeParam(value);
    args[name] = value;
  }
  return args;
};
function createCircularReferenceChecker() {
  if (typeof WeakSet !== 'undefined') {
    var set = new WeakSet();
    return {
      hasAlreadyBeenSeen: function (value) {
        var has = set.has(value);
        if (!has) {
          set.add(value);
        }
        return has;
      }
    };
  }
  var array = [];
  return {
    hasAlreadyBeenSeen: function (value) {
      var has = array.indexOf(value) >= 0;
      if (!has) {
        array.push(value);
      }
      return has;
    }
  };
}
/**
 * Similar to `typeof`, but distinguish plain objects from `null` and arrays
 */
function getType(value) {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}
/**
 * Iterate over source and affect its sub values into destination, recursively.
 * If the source and destination can't be merged, return source.
 */
function mergeInto(destination, source, circularReferenceChecker) {
  // ignore the source if it is undefined
  if (typeof circularReferenceChecker === 'undefined') {
    circularReferenceChecker = createCircularReferenceChecker();
  }
  if (source === undefined) {
    return destination;
  }
  if (typeof source !== 'object' || source === null) {
    // primitive values - just return source
    return source;
  } else if (source instanceof Date) {
    return new Date(source.getTime());
  } else if (source instanceof RegExp) {
    var flags = source.flags ||
    // old browsers compatibility
    [source.global ? 'g' : '', source.ignoreCase ? 'i' : '', source.multiline ? 'm' : '', source.sticky ? 'y' : '', source.unicode ? 'u' : ''].join('');
    return new RegExp(source.source, flags);
  }
  if (circularReferenceChecker.hasAlreadyBeenSeen(source)) {
    // remove circular references
    return undefined;
  } else if (Array.isArray(source)) {
    var merged = Array.isArray(destination) ? destination : [];
    for (var i = 0; i < source.length; ++i) {
      merged[i] = mergeInto(merged[i], source[i], circularReferenceChecker);
    }
    return merged;
  }
  var merged = getType(destination) === 'object' ? destination : {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      merged[key] = mergeInto(merged[key], source[key], circularReferenceChecker);
    }
  }
  return merged;
}

/**
 * A simplistic implementation of a deep clone algorithm.
 * Caveats:
 * - It doesn't maintain prototype chains - don't use with instances of custom classes.
 * - It doesn't handle Map and Set
 */
function deepClone(value) {
  return mergeInto(undefined, value);
}
var getCurrentDomain = function (url) {
  var cookieTopLevelDomain = getCookieTopLevelDomain();
  if (url === '') {
    return 'URL parsing failed';
  } else if (cookieTopLevelDomain === '') {
    return 'URL parsing failed';
  } else {
    return cookieTopLevelDomain;
  }
};
var getCookieTopLevelDomain = function (hostname) {
  hostname = hostname || window.location.hostname;
  var splitResult = hostname.split('.');
  if (isArray(splitResult) && splitResult.length >= 2 && !/^(\d+\.)+\d+$/.test(hostname)) {
    var domainStr = '.' + splitResult.splice(splitResult.length - 1, 1);
    while (splitResult.length > 0) {
      domainStr = '.' + splitResult.splice(splitResult.length - 1, 1) + domainStr;
      document.cookie = 'domain_test=true; path=/; domain=' + domainStr;
      if (document.cookie.indexOf('domain_test=true') !== -1) {
        var now = new Date();
        now.setTime(now.getTime() - 1000);
        document.cookie = 'domain_test=true; expires=' + now.toGMTString() + '; path=/; domain=' + domainStr;
        return domainStr;
      }
    }
  }
  return '';
};
var strToUnicode = function (str) {
  if (typeof str !== 'string') {
    return str;
  }
  var nstr = '';
  for (var i = 0; i < str.length; i++) {
    nstr += '\\' + str.charCodeAt(i).toString(16);
  }
  return nstr;
};
var autoExeQueue = function () {
  var queue = {
    items: [],
    enqueue: function (val) {
      this.items.push(val);
      this.start();
    },
    dequeue: function () {
      return this.items.shift();
    },
    getCurrentItem: function () {
      return this.items[0];
    },
    isRun: false,
    start: function () {
      if (this.items.length > 0 && !this.isRun) {
        this.isRun = true;
        this.getCurrentItem().start();
      }
    },
    close: function () {
      this.dequeue();
      this.isRun = false;
      this.start();
    }
  };
  return queue;
};
var strip_sa_properties = function (p) {
  if (!isObject(p)) {
    return p;
  }
  each(p, function (v, k) {
    if (isArray(v)) {
      var temp = [];
      each(v, function (arrv) {
        if (isString(arrv)) {
          temp.push(arrv);
        } else {}
      });
      if (temp.length !== 0) {
        p[k] = temp;
      } else {
        delete p[k];
      }
    }
    if (!(isString(v) || isNumber(v) || isDate(v) || isBoolean(v) || isArray(v) || isFunction(v) || k === '$option')) {
      delete p[k];
    }
  });
  return p;
};
var searchConfigData = function (data) {
  if (typeof data === 'object' && data.$option) {
    var data_config = data.$option;
    delete data.$option;
    return data_config;
  } else {
    return {};
  }
};

// abcd=1&b=1&c=3;
// abdc=1;b=1;a=3;
var stringSplice = function (src, k, e, sp) {
  if (src === '') {
    return '';
  }
  sp = sp === '' ? '=' : sp;
  k += sp;
  var ps = src.indexOf(k);
  if (ps < 0) {
    return '';
  }
  ps += k.length;
  var pe = pe < ps ? src.length : src.indexOf(e, ps);
  return src.substring(ps, pe);
};
function getStatusGroup(status) {
  if (!status) return status === 0 ? undefined : status;
  return String(status).substr(0, 1) + String(status).substr(1).replace(/\d*/g, 'x');
}
var getReferrer = function () {
  var ref = document.referrer.toLowerCase();
  var re = /^[^\?&#]*.swf([\?#])?/;
  if (ref === '' || ref.match(re)) {
    ref = stringSplice(window.location.href, 'ref', '&', '');
    if (ref !== '') {
      return encodeURIComponent(ref);
    }
  }
  return encodeURIComponent(ref);
};
var typeDecide = function (o, type) {
  return tools_toString.call(o) === '[object ' + type + ']';
};
function tools_noop() {}
var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;
var ONE_HOUR = 60 * ONE_MINUTE;
var ONE_DAY = 24 * ONE_HOUR;
var ONE_YEAR = 365 * ONE_DAY;

/**
 * Return true if the draw is successful
 * @param threshold between 0 and 100
 */
function performDraw(threshold) {
  return threshold !== 0 && Math.random() * 100 <= threshold;
}
function round(num, decimals) {
  return +num.toFixed(decimals);
}
function msToNs(duration) {
  if (typeof duration !== 'number') {
    return duration;
  }
  return round(duration * 1e6, 0);
}
function mapValues(object, fn) {
  var newObject = {};
  each(object, function (value, key) {
    newObject[key] = fn(value);
  });
  return newObject;
}
function toServerDuration(duration) {
  if (!isNumber(duration)) {
    return duration;
  }
  return round(duration * 1e6, 0);
}
function getRelativeTime(timestamp) {
  return timestamp - getNavigationStart();
}
function preferredNow() {
  return tools_relativeNow();
}
function getTimestamp(relativeTime) {
  return Math.round(getNavigationStart() + relativeTime);
}
function tools_relativeNow() {
  return performance.now();
}
function clocksNow() {
  return {
    relative: tools_relativeNow(),
    timeStamp: timeStampNow()
  };
}
function timeStampNow() {
  return dateNow();
}
function looksLikeRelativeTime(time) {
  return time < ONE_YEAR;
}
function dateNow() {
  // Do not use `Date.now` because sometimes websites are wrongly "polyfilling" it. For example, we
  // had some users using a very old version of `datejs`, which patched `Date.now` to return a Date
  // instance instead of a timestamp[1]. Those users are unlikely to fix this, so let's handle this
  // case ourselves.
  // [1]: https://github.com/datejs/Datejs/blob/97f5c7c58c5bc5accdab8aa7602b6ac56462d778/src/core-debug.js#L14-L16
  return new Date().getTime();
}
function tools_elapsed(start, end) {
  return end - start;
}
function clocksOrigin() {
  return {
    relative: 0,
    timeStamp: getNavigationStart()
  };
}
function preferredClock(clocks) {
  return clocks.relative;
}
function preferredTimeStamp(clocks) {
  return getTimestamp(clocks.relative);
}
function relativeToClocks(relative) {
  return {
    relative: relative,
    timeStamp: getCorrectedTimeStamp(relative)
  };
}
function currentDrift() {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return Math.round(dateNow() - (getNavigationStart() + performance.now()));
}
function addDuration(a, b) {
  return a + b;
}
function getCorrectedTimeStamp(relativeTime) {
  var correctedOrigin = dateNow() - performance.now();
  // apply correction only for positive drift
  if (correctedOrigin > getNavigationStart()) {
    return Math.round(correctedOrigin + relativeTime);
  }
  return getTimestamp(relativeTime);
}
/**
 * Navigation start slightly change on some rare cases
 */
var navigationStart;
function getNavigationStart() {
  if (navigationStart === undefined) {
    navigationStart = performance.timing.navigationStart;
  }
  return navigationStart;
}
var COMMA_SEPARATED_KEY_VALUE = /([\w-]+)\s*=\s*([^;]+)/g;
function findCommaSeparatedValue(rawString, name) {
  COMMA_SEPARATED_KEY_VALUE.lastIndex = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    var match = COMMA_SEPARATED_KEY_VALUE.exec(rawString);
    if (match) {
      if (match[1] === name) {
        return match[2];
      }
    } else {
      break;
    }
  }
}
function tools_findCommaSeparatedValues(rawString) {
  var result = new Map();
  COMMA_SEPARATED_KEY_VALUE.lastIndex = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    var match = COMMA_SEPARATED_KEY_VALUE.exec(rawString);
    if (match) {
      result.set(match[1], match[2]);
    } else {
      break;
    }
  }
  return result;
}
function findByPath(source, path) {
  var pathArr = path.split('.');
  while (pathArr.length) {
    var key = pathArr.shift();
    if (source && isObject(source) && key in source && tools_hasOwnProperty.call(source, key)) {
      source = source[key];
    } else {
      return undefined;
    }
  }
  return source;
}
function safeTruncate(candidate, length) {
  var lastChar = candidate.charCodeAt(length - 1);
  // check if it is the high part of a surrogate pair
  if (lastChar >= 0xd800 && lastChar <= 0xdbff) {
    return candidate.slice(0, length + 1);
  }
  return candidate.slice(0, length);
}
function isMatchOption(item) {
  const itemType = getType(item);
  return itemType === 'string' || itemType === 'function' || item instanceof RegExp;
}
function includes(candidate, search) {
  // tslint:disable-next-line: no-unsafe-any
  return candidate.indexOf(search) !== -1;
}
function find(array, predicate) {
  for (var i = 0; i < array.length; i += 1) {
    var item = array[i];
    if (predicate(item, i, array)) {
      return item;
    }
  }
  return undefined;
}
function arrayFrom(arrayLike) {
  if (Array.from) {
    return Array.from(arrayLike);
  }
  var array = [];
  if (arrayLike instanceof Set) {
    arrayLike.forEach(function (item) {
      array.push(item);
    });
  } else {
    for (var i = 0; i < arrayLike.length; i++) {
      array.push(arrayLike[i]);
    }
  }
  return array;
}
function findLast(array, predicate) {
  for (var i = array.length - 1; i >= 0; i -= 1) {
    var item = array[i];
    if (predicate(item, i, array)) {
      return item;
    }
  }
  return undefined;
}
function isPercentage(value) {
  return isNumber(value) && value >= 0 && value <= 100;
}
function getLocationOrigin() {
  return tools_getLinkElementOrigin(window.location);
}
var Browser = {
  IE: 0,
  CHROMIUM: 1,
  SAFARI: 2,
  OTHER: 3
};
function isIE() {
  return detectBrowserCached() === Browser.IE;
}
function isChromium() {
  return detectBrowserCached() === Browser.CHROMIUM;
}
function isSafari() {
  return detectBrowserCached() === Browser.SAFARI;
}
var browserCache;
function detectBrowserCached() {
  return isNullUndefinedDefaultValue(browserCache, browserCache = detectBrowser());
}
function detectBrowser(browserWindow) {
  var _browserWindow, _browserWindow$naviga;
  if (typeof browserWindow === 'undefined') {
    browserWindow = window || {};
  }
  var userAgent = ((_browserWindow = browserWindow) === null || _browserWindow === void 0 || (_browserWindow = _browserWindow.navigator) === null || _browserWindow === void 0 ? void 0 : _browserWindow.userAgent) || '';
  if (browserWindow.chrome || /HeadlessChrome/.test(userAgent)) {
    return Browser.CHROMIUM;
  }
  if (
  // navigator.vendor is deprecated, but it is the most resilient way we found to detect
  // "Apple maintained browsers" (AKA Safari). If one day it gets removed, we still have the
  // useragent test as a semi-working fallback.
  ((_browserWindow$naviga = browserWindow.navigator.vendor) === null || _browserWindow$naviga === void 0 ? void 0 : _browserWindow$naviga.indexOf('Apple')) === 0 || /safari/i.test(userAgent) && !/chrome|android/i.test(userAgent)) {
    return Browser.SAFARI;
  }
  if (browserWindow.document.documentMode) {
    return Browser.IE;
  }
  return Browser.OTHER;
}

/**
 * IE fallback
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/origin
 */
function tools_getLinkElementOrigin(element) {
  if (element.origin && element.origin !== 'null') {
    return element.origin;
  }
  var sanitizedHost = element.host.replace(/(:80|:443)$/, '');
  return element.protocol + '//' + sanitizedHost;
}
function withSnakeCaseKeys(candidate) {
  var result = {};
  each(candidate, function (value, key) {
    result[toSnakeCase(key)] = deepSnakeCase(value);
  });
  return result;
}
function deepSnakeCase(candidate) {
  if (isArray(candidate)) {
    return tools_map(candidate, function (value) {
      return deepSnakeCase(value);
    });
  }
  if (typeof candidate === 'object' && candidate !== null) {
    return withSnakeCaseKeys(candidate);
  }
  return candidate;
}
function toSnakeCase(word) {
  return word.replace(/[A-Z]/g, function (uppercaseLetter, index) {
    return (index !== 0 ? '_' : '') + uppercaseLetter.toLowerCase();
  }).replace(/-/g, '_');
}
function isNullUndefinedDefaultValue(data, defaultValue) {
  if (data !== null && data !== void 0) {
    return data;
  } else {
    return defaultValue;
  }
}
function objectHasValue(object, value) {
  return some(keys(object), function (key) {
    return object[key] === value;
  });
}
function startsWith(candidate, search) {
  return candidate.slice(0, search.length) === search;
}
function endsWith(candidate, search) {
  return candidate.slice(-search.length) === search;
}
function removeDuplicates(array) {
  var set = new Set();
  array.forEach(function (item) {
    set.add(item);
  });
  return arrayFrom(set);
}
function removeItem(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
  }
}
function tryToClone(response) {
  try {
    return response.clone();
  } catch (e) {
    // clone can throw if the response has already been used by another instrumentation or is disturbed
    return;
  }
}
function isHashAnAnchor(hash) {
  var correspondingId = hash.substr(1);
  if (!correspondingId) return false;
  return !!document.getElementById(correspondingId);
}
function getPathFromHash(hash) {
  var index = hash.indexOf('?');
  return index < 0 ? hash : hash.slice(0, index);
}
function discardNegativeDuration(duration) {
  return isNumber(duration) && duration < 0 ? undefined : duration;
}
;// CONCATENATED MODULE: ../core/esm/helper/boundedBuffer.js

var BUFFER_LIMIT = 500;
function createBoundedBuffer() {
  var buffer = [];
  var add = function (callback) {
    var length = buffer.push(callback);
    if (length > BUFFER_LIMIT) {
      buffer.splice(0, 1);
    }
  };
  var remove = function (callback) {
    removeItem(buffer, callback);
  };
  const drain = function (arg) {
    buffer.forEach(function (callback) {
      callback(arg);
    });
    buffer.length = 0;
  };
  return {
    add: add,
    remove: remove,
    drain: drain
  };
}
;// CONCATENATED MODULE: ../core/esm/helper/valueHistory.js


var END_OF_TIMES = Infinity;
var CLEAR_OLD_VALUES_INTERVAL = ONE_MINUTE;
let cleanupHistoriesInterval = null;
const cleanupTasks = new Set();
function cleanupHistories() {
  cleanupTasks.forEach(task => task());
}
/**
 *
 * @param {expireDelay,maxEntries } params
 * @returns
 */
function createValueHistory(params) {
  var expireDelay = params.expireDelay;
  var maxEntries = params.maxEntries;
  var entries = [];
  if (cleanupHistoriesInterval) {
    cleanupHistoriesInterval = timer_setInterval(function () {
      return clearExpiredValues();
    }, CLEAR_OLD_VALUES_INTERVAL);
  }
  function clearExpiredValues() {
    var oldTimeThreshold = tools_relativeNow() - expireDelay;
    while (entries.length > 0 && entries[entries.length - 1].endTime < oldTimeThreshold) {
      entries.pop();
    }
  }
  cleanupTasks.add(clearExpiredValues);
  function add(value, startTime) {
    var entry = {
      value: value,
      startTime: startTime,
      endTime: END_OF_TIMES,
      remove: function () {
        removeItem(entries, entry);
      },
      close: function (endTime) {
        entry.endTime = endTime;
      }
    };
    if (maxEntries && entries.length >= maxEntries) {
      entries.pop();
    }
    entries.unshift(entry);
    return entry;
  }
  function find(startTime, options) {
    if (typeof startTime === 'undefined') {
      startTime = END_OF_TIMES;
    }
    if (typeof options === 'undefined') {
      options = {
        returnInactive: false
      };
    }
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      if (entry.startTime <= startTime) {
        if (options.returnInactive || startTime <= entry.endTime) {
          return entry.value;
        }
        break;
      }
    }
  }
  function closeActive(endTime) {
    var latestEntry = entries[0];
    if (latestEntry && latestEntry.endTime === END_OF_TIMES) {
      latestEntry.close(endTime);
    }
  }
  function findAll(startTime, duration) {
    if (startTime === undefined) {
      startTime = END_OF_TIMES;
    }
    if (duration === undefined) {
      duration = 0;
    }
    var endTime = addDuration(startTime, duration);
    return entries.filter(function (entry) {
      return entry.startTime <= endTime && startTime <= entry.endTime;
    }).map(function (entry) {
      return entry.value;
    });
  }

  /**
   * Remove all entries from this collection.
   */
  function reset() {
    entries = [];
  }

  /**
   * Stop internal garbage collection of past entries.
   */
  function stop() {
    cleanupTasks.delete(clearExpiredValues);
    if (cleanupTasks.size === 0 && cleanupHistoriesInterval) {
      timer_clearInterval(cleanupHistoriesInterval);
      cleanupHistoriesInterval = null;
    }
  }
  return {
    add: add,
    find: find,
    closeActive: closeActive,
    findAll: findAll,
    reset: reset,
    stop: stop
  };
}
;// CONCATENATED MODULE: ../core/esm/helper/deviceInfo.js

var VariableLibrary = {
  navigator: typeof window !== 'undefined' && typeof window.navigator != 'undefined' ? window.navigator : {}
};
var MethodLibrary = {
  getNetwork: monitor(function () {
    var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
    var result = 'unknown';
    var type = connection ? connection.type || connection.effectiveType : null;
    if (type && typeof type === 'string') {
      switch (type) {
        // possible type values
        case 'bluetooth':
        case 'cellular':
          result = 'cellular';
          break;
        case 'none':
          result = 'none';
          break;
        case 'ethernet':
        case 'wifi':
        case 'wimax':
          result = 'wifi';
          break;
        case 'other':
        case 'unknown':
          result = 'unknown';
          break;
        // possible effectiveType values
        case 'slow-2g':
        case '2g':
        case '3g':
          result = 'cellular';
          break;
        case '4g':
          result = 'wifi';
          break;
        default:
          break;
      }
    }
    return result;
  }),
  getLanguage: monitor(function () {
    var _this = this;
    _this.language = function () {
      var language = VariableLibrary.navigator.browserLanguage || VariableLibrary.navigator.language || '';
      var arr = language.split('-');
      if (arr[1]) {
        arr[1] = arr[1].toUpperCase();
      }
      return arr.join('_');
    }();
    return _this.language;
  }),
  getTimeZone: monitor(function () {
    try {
      const intl = new Intl.DateTimeFormat();
      return intl.resolvedOptions().timeZone;
    } catch (_unused) {
      return undefined;
    }
  })
};
var _deviceInfo = {};
if (typeof window !== 'undefined') {
  _deviceInfo = {
    screenSize: window.screen.width + '*' + window.screen.height,
    networkType: MethodLibrary.getNetwork(),
    userAgent: VariableLibrary.navigator.userAgent || '',
    timeZone: MethodLibrary.getTimeZone()
  };
}
var deviceInfo = _deviceInfo;
;// CONCATENATED MODULE: ../core/esm/helper/enums.js
var DOM_EVENT = {
  BEFORE_UNLOAD: 'beforeunload',
  CLICK: 'click',
  DBL_CLICK: 'dblclick',
  KEY_DOWN: 'keydown',
  LOAD: 'load',
  POP_STATE: 'popstate',
  SCROLL: 'scroll',
  TOUCH_START: 'touchstart',
  TOUCH_END: 'touchend',
  TOUCH_MOVE: 'touchmove',
  VISIBILITY_CHANGE: 'visibilitychange',
  PAGE_SHOW: 'pageshow',
  FREEZE: 'freeze',
  RESUME: 'resume',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  POINTER_DOWN: 'pointerdown',
  POINTER_UP: 'pointerup',
  POINTER_CANCEL: 'pointercancel',
  HASH_CHANGE: 'hashchange',
  PAGE_HIDE: 'pagehide',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_MOVE: 'mousemove',
  FOCUS: 'focus',
  BLUR: 'blur',
  CONTEXT_MENU: 'contextmenu',
  RESIZE: 'resize',
  CHANGE: 'change',
  INPUT: 'input',
  PLAY: 'play',
  PAUSE: 'pause',
  SECURITY_POLICY_VIOLATION: 'securitypolicyviolation',
  SELECTION_CHANGE: 'selectionchange',
  STORAGE: 'storage'
};
var ResourceType = {
  DOCUMENT: 'document',
  XHR: 'xhr',
  BEACON: 'beacon',
  FETCH: 'fetch',
  CSS: 'css',
  JS: 'js',
  IMAGE: 'image',
  FONT: 'font',
  MEDIA: 'media',
  OTHER: 'other',
  CUSTOM: 'custom'
};
var ActionType = {
  CLICK: 'click',
  CUSTOM: 'custom'
};
var FrustrationType = {
  RAGE_CLICK: 'rage_click',
  ERROR_CLICK: 'error_click',
  DEAD_CLICK: 'dead_click'
};
var RumEventType = {
  ACTION: 'action',
  ERROR: 'error',
  LONG_TASK: 'long_task',
  VIEW: 'view',
  RESOURCE: 'resource',
  LOGGER: 'logger'
};
var RumLongTaskEntryType = {
  LONG_TASK: 'long-task',
  LONG_ANIMATION_FRAME: 'long-animation-frame'
};
var ViewLoadingType = {
  INITIAL_LOAD: 'initial_load',
  ROUTE_CHANGE: 'route_change'
};
var RequestType = {
  FETCH: ResourceType.FETCH,
  XHR: ResourceType.XHR
};
var TraceType = {
  DDTRACE: 'ddtrace',
  ZIPKIN_MULTI_HEADER: 'zipkin',
  ZIPKIN_SINGLE_HEADER: 'zipkin_single_header',
  W3C_TRACEPARENT: 'w3c_traceparent',
  W3C_TRACEPARENT_64: 'w3c_traceparent_64bit',
  SKYWALKING_V3: 'skywalking_v3',
  JAEGER: 'jaeger'
};
var enums_ErrorHandling = {
  HANDLED: 'handled',
  UNHANDLED: 'unhandled'
};
var NonErrorPrefix = {
  UNCAUGHT: 'Uncaught',
  PROVIDED: 'Provided'
};
;// CONCATENATED MODULE: ../core/esm/helper/serialisation/jsonStringify.js


/**
 * Custom implementation of JSON.stringify that ignores some toJSON methods. We need to do that
 * because some sites badly override toJSON on certain objects. Removing all toJSON methods from
 * nested values would be too costly, so we just detach them from the root value, and native classes
 * used to build JSON values (Array and Object).
 *
 * Note: this still assumes that JSON.stringify is correct.
 */
function jsonStringify_jsonStringify(value, replacer, space) {
  if (typeof value !== 'object' || value === null) {
    return JSON.stringify(value);
  }

  // Note: The order matter here. We need to detach toJSON methods on parent classes before their
  // subclasses.
  var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype);
  var restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype);
  var restoreValuePrototypeToJson = detachToJsonMethod(Object.getPrototypeOf(value));
  var restoreValueToJson = detachToJsonMethod(value);
  try {
    return JSON.stringify(value, replacer, space);
  } catch (_unused) {
    return '<error: unable to serialize object>';
  } finally {
    restoreObjectPrototypeToJson();
    restoreArrayPrototypeToJson();
    restoreValuePrototypeToJson();
    restoreValueToJson();
  }
}
function detachToJsonMethod(value) {
  const object = value;
  const objectToJson = object.toJSON;
  if (objectToJson) {
    delete object.toJSON;
    return function () {
      object.toJSON = objectToJson;
    };
  }
  return tools_noop;
}
;// CONCATENATED MODULE: ../core/esm/tracekit/computeStackTrace.js

var UNKNOWN_FUNCTION = '?';

/**
 * Computes a stack trace for an exception.
 */
function computeStackTrace(ex) {
  var stack = [];
  var stackProperty = tryToGetString(ex, 'stack');
  var exString = String(ex);
  if (stackProperty && stackProperty.startsWith(exString)) {
    stackProperty = stackProperty.slice(exString.length);
  }
  if (stackProperty) {
    each(stackProperty.split('\n'), function (line) {
      var stackFrame = parseChromeLine(line) || parseChromeAnonymousLine(line) || parseWinLine(line) || parseGeckoLine(line);
      if (stackFrame) {
        if (!stackFrame.func && stackFrame.line) {
          stackFrame.func = UNKNOWN_FUNCTION;
        }
        stack.push(stackFrame);
      }
    });
  }
  return {
    message: tryToGetString(ex, 'message'),
    name: tryToGetString(ex, 'name'),
    stack: stack
  };
}
var fileUrl = '((?:file|https?|blob|chrome-extension|electron|native|eval|webpack|<anonymous>|\\w+\\.|\\/).*?)';
var filePosition = '(?::(\\d+))';
var CHROME_LINE_RE = new RegExp('^\\s*at (.*?) ?\\(' + fileUrl + filePosition + '?' + filePosition + '?\\)?\\s*$', 'i');
var CHROME_EVAL_RE = new RegExp('\\((\\S*)' + filePosition + filePosition + '\\)');
function parseChromeLine(line) {
  var parts = CHROME_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
  var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
  var submatch = CHROME_EVAL_RE.exec(parts[2]);
  if (isEval && submatch) {
    // throw out eval line/column and use top-most line/column number
    parts[2] = submatch[1]; // url
    parts[3] = submatch[2]; // line
    parts[4] = submatch[3]; // column
  }
  return {
    args: isNative ? [parts[2]] : [],
    column: parts[4] ? +parts[4] : undefined,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: parts[3] ? +parts[3] : undefined,
    url: !isNative ? parts[2] : undefined
  };
}
var CHROME_ANONYMOUS_FUNCTION_RE = new RegExp('^\\s*at ?' + fileUrl + filePosition + '?' + filePosition + '??\\s*$', 'i');
function parseChromeAnonymousLine(line) {
  var parts = CHROME_ANONYMOUS_FUNCTION_RE.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[3] ? +parts[3] : undefined,
    func: UNKNOWN_FUNCTION,
    line: parts[2] ? +parts[2] : undefined,
    url: parts[1]
  };
}
var WINJS_LINE_RE = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function parseWinLine(line) {
  var parts = WINJS_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  return {
    args: [],
    column: parts[4] ? +parts[4] : undefined,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: +parts[3],
    url: parts[2]
  };
}
var GECKO_LINE_RE = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle|\[wasm code\])(?::(\d+))?(?::(\d+))?\s*$/i;
var GECKO_EVAL_RE = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function parseGeckoLine(line) {
  var parts = GECKO_LINE_RE.exec(line);
  if (!parts) {
    return;
  }
  var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
  var submatch = GECKO_EVAL_RE.exec(parts[3]);
  if (isEval && submatch) {
    // throw out eval line/column and use top-most line number
    parts[3] = submatch[1];
    parts[4] = submatch[2];
    parts[5] = undefined; // no column when eval
  }
  return {
    args: parts[2] ? parts[2].split(',') : [],
    column: parts[5] ? +parts[5] : undefined,
    func: parts[1] || UNKNOWN_FUNCTION,
    line: parts[4] ? +parts[4] : undefined,
    url: parts[3]
  };
}
function tryToGetString(candidate, property) {
  if (typeof candidate !== 'object' || !candidate || !(property in candidate)) {
    return undefined;
  }
  var value = candidate[property];
  return typeof value === 'string' ? value : undefined;
}
;// CONCATENATED MODULE: ../core/esm/tracekit/tracekit.js




// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?([\s\S]*)$/;
/**
 * Cross-browser collection of unhandled errors
 *
 * Supports:
 * - Firefox: full stack trace with line numbers, plus column number
 * on top frame; column number is not guaranteed
 * - Opera: full stack trace with line and column numbers
 * - Chrome: full stack trace with line and column numbers
 * - Safari: line and column number for the top frame only; some frames
 * may be missing, and column number is not guaranteed
 * - IE: line and column number for the top frame only; some frames
 * may be missing, and column number is not guaranteed
 *
 * In theory, TraceKit should work on all of the following versions:
 * - IE5.5+ (only 8.0 tested)
 * - Firefox 0.9+ (only 3.5+ tested)
 * - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
 * Exceptions Have Stacktrace to be enabled in opera:config)
 * - Safari 3+ (only 4+ tested)
 * - Chrome 1+ (only 5+ tested)
 * - Konqueror 3.5+ (untested)
 *
 * Tries to catch all unhandled errors and report them to the
 * callback.
 *
 * Callbacks receive a StackTrace object as described in the
 * computeStackTrace docs.
 *
 * @memberof TraceKit
 * @namespace
 */

function startUnhandledErrorCollection(callback) {
  var _instrumentOnError = instrumentOnError(callback);
  var _instrumentUnhandledRejection = instrumentUnhandledRejection(callback);
  return {
    stop: function () {
      _instrumentOnError.stop();
      _instrumentUnhandledRejection.stop();
    }
  };
}

/**
 * Install a global onerror handler
 */
function instrumentOnError(callback) {
  return instrumentMethod(window, 'onerror', function (params) {
    var parameters = params.parameters;
    var messageObj = parameters[0];
    var url = parameters[1];
    var line = parameters[2];
    var column = parameters[3];
    var errorObj = parameters[4];
    var stackTrace;
    if (errorObj instanceof Error) {
      stackTrace = computeStackTrace(errorObj);
    } else {
      var location = {
        url: url,
        column: column,
        line: line
      };
      var parse = tryToParseMessage(messageObj);
      stackTrace = {
        name: parse.name,
        message: parse.message,
        stack: [location]
      };
    }
    callback(stackTrace, isNullUndefinedDefaultValue(errorObj, messageObj));
  });
}
function tryToParseMessage(messageObj) {
  let name;
  let message;
  if ({}.toString.call(messageObj) === '[object String]') {
    var groups = ERROR_TYPES_RE.exec(messageObj);
    if (groups) {
      name = groups[1];
      message = groups[2];
    }
  }
  return {
    name: name,
    message: message
  };
}
/**
 * Install a global onunhandledrejection handler
 */
function instrumentUnhandledRejection(callback) {
  return instrumentMethod(window, 'onunhandledrejection', function (params) {
    var parameters = params.parameters;
    var e = parameters[0];
    var reason = e.reason || 'Empty reason';
    var stack = computeStackTrace(reason);
    callback(stack, reason);
  });
}
;// CONCATENATED MODULE: ../core/esm/tracekit/index.js


;// CONCATENATED MODULE: ../core/esm/helper/byteUtils.js
var ONE_KIBI_BYTE = 1024;
var ONE_MEBI_BYTE = 1024 * ONE_KIBI_BYTE;
// eslint-disable-next-line no-control-regex
var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
function computeBytesCount(candidate) {
  // Accurate bytes count computations can degrade performances when there is a lot of events to process
  if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
    return candidate.length;
  }
  if (window.TextEncoder !== undefined) {
    return new TextEncoder().encode(candidate).length;
  }
  return new Blob([candidate]).size;
}
function concatBuffers(buffers) {
  var length = buffers.reduce(function (total, buffer) {
    return total + buffer.length;
  }, 0);
  var result = new Uint8Array(length);
  var offset = 0;
  for (var _i = 0, buffers_1 = buffers; _i < buffers_1.length; _i++) {
    var buffer = buffers_1[_i];
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}
;// CONCATENATED MODULE: ../core/esm/helper/sanitize.js




// The maximum size of a single event is 256KiB. By default, we ensure that user-provided data
// going through sanitize fits inside our events, while leaving room for other contexts, metadata, ...
var SANITIZE_DEFAULT_MAX_CHARACTER_COUNT = 220 * ONE_KIBI_BYTE;

// Symbol for the root element of the JSONPath used for visited objects
var JSON_PATH_ROOT_ELEMENT = '$';

// When serializing (using JSON.stringify) a key of an object, { key: 42 } gets wrapped in quotes as "key".
// With the separator (:), we need to add 3 characters to the count.
var KEY_DECORATION_LENGTH = 3;

/**
 * Ensures user-provided data is 'safe' for the SDK
 * - Deep clones data
 * - Removes cyclic references
 * - Transforms unserializable types to a string representation
 *
 * LIMITATIONS:
 * - Size is in characters, not byte count (may differ according to character encoding)
 * - Size does not take into account indentation that can be applied to JSON.stringify
 * - Non-numerical properties of Arrays are ignored. Same behavior as JSON.stringify
 *
 * @param source              User-provided data meant to be serialized using JSON.stringify
 * @param maxCharacterCount   Maximum number of characters allowed in serialized form
 */

function sanitize(source, maxCharacterCount) {
  if (maxCharacterCount === undefined) {
    maxCharacterCount = SANITIZE_DEFAULT_MAX_CHARACTER_COUNT;
  }
  // Unbind any toJSON function we may have on [] or {} prototypes
  var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype);
  var restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype);

  // Initial call to sanitizeProcessor - will populate containerQueue if source is an Array or a plain Object
  var containerQueue = [];
  var visitedObjectsWithPath = new WeakMap();
  var sanitizedData = sanitizeProcessor(source, JSON_PATH_ROOT_ELEMENT, undefined, containerQueue, visitedObjectsWithPath);
  var accumulatedCharacterCount = JSON.stringify(sanitizedData) && JSON.stringify(sanitizedData).length || 0;
  if (accumulatedCharacterCount > maxCharacterCount) {
    warnOverCharacterLimit(maxCharacterCount, 'discarded', source);
    return undefined;
  }
  while (containerQueue.length > 0 && accumulatedCharacterCount < maxCharacterCount) {
    var containerToProcess = containerQueue.shift();
    var separatorLength = 0; // 0 for the first element, 1 for subsequent elements

    // Arrays and Objects have to be handled distinctly to ensure
    // we do not pick up non-numerical properties from Arrays
    if (Array.isArray(containerToProcess.source)) {
      for (var key = 0; key < containerToProcess.source.length; key++) {
        var targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath);
        if (targetData !== undefined) {
          accumulatedCharacterCount += JSON.stringify(targetData).length;
        } else {
          // When an element of an Array (targetData) is undefined, it is serialized as null:
          // JSON.stringify([undefined]) => '[null]' - This accounts for 4 characters
          accumulatedCharacterCount += 4;
        }
        accumulatedCharacterCount += separatorLength;
        separatorLength = 1;
        if (accumulatedCharacterCount > maxCharacterCount) {
          warnOverCharacterLimit(maxCharacterCount, 'truncated', source);
          break;
        }
        containerToProcess.target[key] = targetData;
      }
    } else {
      for (var key in containerToProcess.source) {
        if (Object.prototype.hasOwnProperty.call(containerToProcess.source, key)) {
          var targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath);
          // When a property of an object has an undefined value, it will be dropped during serialization:
          // JSON.stringify({a:undefined}) => '{}'
          if (targetData !== undefined) {
            accumulatedCharacterCount += JSON.stringify(targetData).length + separatorLength + key.length + KEY_DECORATION_LENGTH;
            separatorLength = 1;
          }
          if (accumulatedCharacterCount > maxCharacterCount) {
            warnOverCharacterLimit(maxCharacterCount, 'truncated', source);
            break;
          }
          containerToProcess.target[key] = targetData;
        }
      }
    }
  }

  // Rebind detached toJSON functions
  restoreObjectPrototypeToJson();
  restoreArrayPrototypeToJson();
  return sanitizedData;
}

/**
 * Internal function to factorize the process common to the
 * initial call to sanitize, and iterations for Arrays and Objects
 *
 */
function sanitizeProcessor(source, parentPath, key, queue, visitedObjectsWithPath) {
  // Start by handling toJSON, as we want to sanitize its output
  var sourceToSanitize = tryToApplyToJSON(source);
  if (!sourceToSanitize || typeof sourceToSanitize !== 'object') {
    return sanitizePrimitivesAndFunctions(sourceToSanitize);
  }
  var sanitizedSource = sanitizeObjects(sourceToSanitize);
  if (sanitizedSource !== '[Object]' && sanitizedSource !== '[Array]' && sanitizedSource !== '[Error]') {
    return sanitizedSource;
  }

  // Handle potential cyclic references
  // We need to use source as sourceToSanitize could be a reference to a new object
  // At this stage, we know the source is an object type
  var sourceAsObject = source;
  if (visitedObjectsWithPath.has(sourceAsObject)) {
    return '[Reference seen at ' + visitedObjectsWithPath.get(sourceAsObject) + ']';
  }

  // Add processed source to queue
  var currentPath = key !== undefined ? parentPath + '.' + key : parentPath;
  var target = Array.isArray(sourceToSanitize) ? [] : {};
  visitedObjectsWithPath.set(sourceAsObject, currentPath);
  queue.push({
    source: sourceToSanitize,
    target,
    path: currentPath
  });
  return target;
}

/**
 * Handles sanitization of simple, non-object types
 *
 */
function sanitizePrimitivesAndFunctions(value) {
  // BigInt cannot be serialized by JSON.stringify(), convert it to a string representation
  if (typeof value === 'bigint') {
    return '[BigInt] ' + value.toString();
  }
  // Functions cannot be serialized by JSON.stringify(). Moreover, if a faulty toJSON is present, it needs to be converted
  // so it won't prevent stringify from serializing later
  if (typeof value === 'function') {
    return '[Function] ' + value.name || 0;
  }
  // JSON.stringify() does not serialize symbols.
  if (typeof value === 'symbol') {
    // symbol.description is part of ES2019+
    return '[Symbol] ' + value.description || 0;
  }
  return value;
}

/**
 * Handles sanitization of object types
 *
 * LIMITATIONS
 * - If a class defines a toStringTag Symbol, it will fall in the catch-all method and prevent enumeration of properties.
 * To avoid this, a toJSON method can be defined.
 * - IE11 does not return a distinct type for objects such as Map, WeakMap, ... These objects will pass through and their
 * properties enumerated if any.
 *
 */
function sanitizeObjects(value) {
  try {
    // Handle events - Keep a simple implementation to avoid breaking changes
    if (value instanceof Event) {
      return sanitizeEvent(value);
    }
    if (value instanceof RegExp) {
      return "[RegExp] ".concat(value.toString());
    }
    // Handle all remaining object types in a generic way
    var result = Object.prototype.toString.call(value);
    var match = result.match(/\[object (.*)\]/);
    if (match && match[1]) {
      return '[' + match[1] + ']';
    }
  } catch (_unused) {
    // If the previous serialization attempts failed, and we cannot convert using
    // Object.prototype.toString, declare the value unserializable
  }
  return '[Unserializable]';
}
function sanitizeEvent(event) {
  return {
    type: event.type,
    isTrusted: event.isTrusted,
    currentTarget: event.currentTarget ? sanitizeObjects(event.currentTarget) : null,
    target: event.target ? sanitizeObjects(event.target) : null
  };
}
/**
 * Checks if a toJSON function exists and tries to execute it
 *
 */
function tryToApplyToJSON(value) {
  var object = value;
  if (object && typeof object.toJSON === 'function') {
    try {
      return object.toJSON();
    } catch (_unused2) {
      // If toJSON fails, we continue by trying to serialize the value manually
    }
  }
  return value;
}

/**
 * Helper function to display the warning when the accumulated character count is over the limit
 */
function warnOverCharacterLimit(maxCharacterCount, changeType, source) {
  display.warn('The data provided has been ' + changeType + ' as it is over the limit of ' + maxCharacterCount + ' characters:', source);
}
;// CONCATENATED MODULE: ../core/esm/helper/errorTools.js





var NO_ERROR_STACK_PRESENT_MESSAGE = 'No stack, consider using an instance of Error';
var errorTools_ErrorSource = {
  AGENT: 'agent',
  CONSOLE: 'console',
  NETWORK: 'network',
  SOURCE: 'source',
  LOGGER: 'logger',
  CUSTOM: 'custom',
  REPORT: 'report'
};
function computeRawError(data) {
  var stackTrace = data.stackTrace;
  var originalError = data.originalError;
  var handlingStack = data.handlingStack;
  var startClocks = data.startClocks;
  var nonErrorPrefix = data.nonErrorPrefix;
  var source = data.source;
  var handling = data.handling;
  var isErrorInstance = originalError instanceof Error;
  var message = computeMessage(stackTrace, isErrorInstance, nonErrorPrefix, originalError);
  var stack = hasUsableStack(isErrorInstance, stackTrace) ? toStackTraceString(stackTrace) : NO_ERROR_STACK_PRESENT_MESSAGE;
  var causes = isErrorInstance ? flattenErrorCauses(originalError, source) : undefined;
  var type = stackTrace && stackTrace.name;
  return {
    startClocks: startClocks,
    source: source,
    handling: handling,
    originalError: originalError,
    message: message,
    stack: stack,
    handlingStack: handlingStack,
    type: type,
    causes: causes
  };
}
function computeMessage(stackTrace, isErrorInstance, nonErrorPrefix, originalError) {
  // Favor stackTrace message only if tracekit has really been able to extract something meaningful (message + name)
  // TODO rework tracekit integration to avoid scattering error building logic
  return stackTrace && stackTrace.message && stackTrace && stackTrace.name ? stackTrace.message : !isErrorInstance ? nonErrorPrefix + ' ' + jsonStringify_jsonStringify(sanitize(originalError)) : 'Empty message';
}
function hasUsableStack(isErrorInstance, stackTrace) {
  if (stackTrace === undefined) {
    return false;
  }
  if (isErrorInstance) {
    return true;
  }
  // handle cases where tracekit return stack = [] or stack = [{url: undefined, line: undefined, column: undefined}]
  // TODO rework tracekit integration to avoid generating those unusable stack
  return stackTrace.stack.length > 0 && (stackTrace.stack.length > 1 || stackTrace.stack[0].url !== undefined);
}
function formatUnknownError(stackTrace, errorObject, nonErrorPrefix, handlingStack) {
  if (!stackTrace || stackTrace.message === undefined && !(errorObject instanceof Error)) {
    return {
      message: nonErrorPrefix + '' + jsonStringify(errorObject),
      stack: 'No stack, consider using an instance of Error',
      handlingStack: handlingStack,
      type: stackTrace && stackTrace.name
    };
  }
  return {
    message: stackTrace.message || 'Empty message',
    stack: toStackTraceString(stackTrace),
    handlingStack: handlingStack,
    type: stackTrace.name
  };
}
/**
 Creates a stacktrace without SDK internal frames.
 
 Constraints:
 - Has to be called at the utmost position of the call stack.
 - No internal monitoring should encapsulate the function, that is why we need to use callMonitored inside of it.
 */
function createHandlingStack() {
  /**
   * Skip the two internal frames:
   * - SDK API (console.error, ...)
   * - this function
   * in order to keep only the user calls
   */
  var internalFramesToSkip = 2;
  var error = new Error();
  var formattedStack;

  // IE needs to throw the error to fill in the stack trace
  if (!error.stack) {
    try {
      throw error;
    } catch (e) {
      tools_noop();
    }
  }
  callMonitored(function () {
    var stackTrace = computeStackTrace(error);
    stackTrace.stack = stackTrace.stack.slice(internalFramesToSkip);
    formattedStack = toStackTraceString(stackTrace);
  });
  return formattedStack;
}
function toStackTraceString(stack) {
  var result = formatErrorMessage(stack);
  each(stack.stack, function (frame) {
    var func = frame.func === '?' ? '<anonymous>' : frame.func;
    var args = frame.args && frame.args.length > 0 ? '(' + frame.args.join(', ') + ')' : '';
    var line = frame.line ? ':' + frame.line : '';
    var column = frame.line && frame.column ? ':' + frame.column : '';
    result += '\n  at ' + func + args + ' @ ' + frame.url + line + column;
  });
  return result;
}
function formatErrorMessage(stack) {
  return (stack.name || 'Error') + ': ' + stack.message;
}
function getFileFromStackTraceString(stack) {
  var execResult = /@ (.+)/.exec(stack);
  return execResult && execResult[1];
}
function flattenErrorCauses(error, parentSource) {
  var currentError = error;
  var causes = [];
  while (currentError && currentError.cause instanceof Error && causes.length < 10) {
    var stackTrace = computeStackTrace(currentError.cause);
    causes.push({
      message: currentError.cause.message,
      source: parentSource,
      type: stackTrace && stackTrace.name,
      stack: stackTrace && toStackTraceString(stackTrace)
    });
    currentError = currentError.cause;
  }
  return causes.length ? causes : undefined;
}
;// CONCATENATED MODULE: ../core/esm/helper/instrumentMethod.js




function instrumentMethod(targetPrototype, method, onPreCall, opts) {
  var computeHandlingStack = opts && opts.computeHandlingStack;
  var original = targetPrototype[method];
  if (typeof original !== 'function') {
    if (startsWith(method, 'on')) {
      original = tools_noop;
    } else {
      return {
        stop: tools_noop
      };
    }
  }
  var stopped = false;
  var instrumentation = function () {
    if (stopped) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return original.apply(this, arguments);
    }
    var parameters = arrayFrom(arguments);
    var postCallCallback;
    callMonitored(onPreCall, null, [{
      target: this,
      parameters: parameters,
      onPostCall: function (callback) {
        postCallCallback = callback;
      },
      handlingStack: computeHandlingStack ? createHandlingStack() : undefined
    }]);
    var result = original.apply(this, parameters);
    if (postCallCallback) {
      callMonitored(postCallCallback, null, [result]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  };
  targetPrototype[method] = instrumentation;
  return {
    stop: function () {
      stopped = true;
      // If the instrumentation has been removed by a third party, keep the last one
      if (targetPrototype[method] === instrumentation) {
        targetPrototype[method] = original;
      }
    }
  };
}
function instrumentSetter(targetPrototype, property, after) {
  var originalDescriptor = Object.getOwnPropertyDescriptor(targetPrototype, property);
  if (!originalDescriptor || !originalDescriptor.set || !originalDescriptor.configurable) {
    return {
      stop: noop
    };
  }
  var stoppedInstrumentation = noop;
  var instrumentation = function (target, value) {
    // put hooked setter into event loop to avoid of set latency
    setTimeout(function () {
      if (instrumentation !== stoppedInstrumentation) {
        after(target, value);
      }
    }, 0);
  };
  var instrumentationWrapper = function (value) {
    originalDescriptor.set.call(this, value);
    instrumentation(this, value);
  };
  Object.defineProperty(targetPrototype, property, {
    set: instrumentationWrapper
  });
  return {
    stop: function () {
      if (Object.getOwnPropertyDescriptor(targetPrototype, property) && Object.getOwnPropertyDescriptor(targetPrototype, property).set === instrumentationWrapper) {
        Object.defineProperty(targetPrototype, property, originalDescriptor);
      }
      instrumentation = stoppedInstrumentation;
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/error/trackRuntimeError.js




function trackRuntimeError(errorObservable) {
  return startUnhandledErrorCollection(function (stackTrace, originalError) {
    errorObservable.notify(computeRawError({
      stackTrace: stackTrace,
      originalError: originalError,
      startClocks: clocksNow(),
      nonErrorPrefix: NonErrorPrefix.UNCAUGHT,
      source: errorTools_ErrorSource.SOURCE,
      handling: enums_ErrorHandling.UNHANDLED
    }));
  });
}
;// CONCATENATED MODULE: ../core/esm/helper/observable.js

var _Observable = function (onFirstSubscribe) {
  this.observers = [];
  this.onLastUnsubscribe = undefined;
  this.onFirstSubscribe = onFirstSubscribe;
};
_Observable.prototype = {
  subscribe: function (f) {
    this.observers.push(f);
    if (this.observers.length === 1 && this.onFirstSubscribe) {
      this.onLastUnsubscribe = this.onFirstSubscribe(this) || undefined;
    }
    var _this = this;
    return {
      unsubscribe: function () {
        _this.observers = filter(_this.observers, function (other) {
          return f !== other;
        });
        if (!_this.observers.length && _this.onLastUnsubscribe) {
          _this.onLastUnsubscribe();
        }
      }
    };
  },
  notify: function (data) {
    each(this.observers, function (observer) {
      observer(data);
    });
  }
};
var Observable = _Observable;
function mergeObservables() {
  var observables = [].slice.call(arguments);
  return new Observable(function (globalObservable) {
    var subscriptions = tools_map(observables, function (observable) {
      return observable.subscribe(function (data) {
        return globalObservable.notify(data);
      });
    });
    return function () {
      return each(subscriptions, function (subscription) {
        return subscription.unsubscribe();
      });
    };
  });
}
;// CONCATENATED MODULE: ../core/esm/console/consoleObservable.js









var consoleObservablesByApi = {};
function initConsoleObservable(apis) {
  var consoleObservables = tools_map(apis, function (api) {
    if (!consoleObservablesByApi[api]) {
      consoleObservablesByApi[api] = createConsoleObservable(api);
    }
    return consoleObservablesByApi[api];
  });
  return mergeObservables.apply(this, consoleObservables);
}
function resetConsoleObservable() {
  consoleObservablesByApi = {};
}
/* eslint-disable no-console */
function createConsoleObservable(api) {
  return new Observable(function (observable) {
    var originalConsoleApi = console[api];
    console[api] = function () {
      var params = [].slice.call(arguments);
      originalConsoleApi.apply(console, arguments);
      var handlingStack = createHandlingStack();
      callMonitored(function () {
        observable.notify(buildConsoleLog(params, api, handlingStack));
      });
    };
    return function () {
      console[api] = originalConsoleApi;
    };
  });
}
function buildConsoleLog(params, api, handlingStack) {
  var message = tools_map(params, function (param) {
    return formatConsoleParameters(param);
  }).join(' ');
  var error;
  if (api === ConsoleApiName.error) {
    var firstErrorParam = find(params, function (param) {
      return param instanceof Error;
    });
    error = {
      stack: firstErrorParam ? toStackTraceString(computeStackTrace(firstErrorParam)) : undefined,
      causes: firstErrorParam ? flattenErrorCauses(firstErrorParam, 'console') : undefined,
      startClocks: clocksNow(),
      message: message,
      source: errorTools_ErrorSource.CONSOLE,
      handling: enums_ErrorHandling.HANDLED,
      handlingStack: handlingStack
    };
  }
  return {
    api: api,
    message: message,
    error: error,
    handlingStack: handlingStack
  };
}
function formatConsoleParameters(param) {
  if (typeof param === 'string') {
    return param;
  }
  if (param instanceof Error) {
    return formatErrorMessage(computeStackTrace(param));
  }
  return jsonStringify_jsonStringify(param, undefined, 2);
}
;// CONCATENATED MODULE: ../core/esm/browser/addEventListener.js



function addEventListener(eventTarget, event, listener, options) {
  return addEventListeners(eventTarget, [event], listener, options);
}

/**
 * Add event listeners to an event emitter object (Window, Element, mock object...).  This provides
 * a few conveniences compared to using `element.addEventListener` directly:
 *
 * * supports IE11 by:
 *   * using an option object only if needed
 *   * emulating the `once` option
 *
 * * wraps the listener with a `monitor` function
 *
 * * returns a `stop` function to remove the listener
 *
 * * with `once: true`, the listener will be called at most once, even if different events are
 *   listened
 */

function addEventListeners(eventTarget, eventNames, listener, options) {
  var wrappedListener = monitor(options && options.once ? function (event) {
    stop();
    listener(event);
  } : listener);
  options = options && options.passive ? {
    capture: options.capture,
    passive: options.passive
  } : options && options.capture;
  // Use the window.EventTarget.prototype when possible to avoid wrong overrides (e.g: https://github.com/salesforce/lwc/issues/1824)
  //   const istarget = Object.prototype.toString.call(window)
  //   const listenerTarget =
  //     window.EventTarget && eventTarget instanceof EventTarget
  //       ? window.EventTarget.prototype
  //       : eventTarget
  //   var add = getZoneJsOriginalValue(listenerTarget, 'addEventListener')

  //   eventNames.forEach((eventName) => {
  //     add.call(eventTarget, eventName, wrappedListener, options)
  //   })
  each(eventNames, function (eventName) {
    withOriginalOrZoneJsPatchedMethod(eventTarget, 'addEventListener', method => method.call(eventTarget, eventName, wrappedListener, options));
    // add.call(eventTarget, eventName, wrappedListener, options)
  });
  var stop = function () {
    // var remove = getZoneJsOriginalValue(listenerTarget, 'removeEventListener')
    each(eventNames, function (eventName) {
      withOriginalOrZoneJsPatchedMethod(eventTarget, 'removeEventListener', method => method.call(eventTarget, eventName, wrappedListener, options));
      //   remove.call(eventTarget, eventName, wrappedListener, options)
    });
  };
  return {
    stop: stop
  };
}
function isIllegalInvocationError(error, methodName) {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.message.includes('Illegal invocation') ||
  // chrome
  error.message.includes("'".concat(methodName, "' called on an object that does not implement interface EventTarget.")) ||
  // firefox
  error.message.includes("Can only call EventTarget.".concat(methodName, " on instances of EventTarget")) // safari
  ;
}
function withOriginalOrZoneJsPatchedMethod(eventTarget, methodName, cb) {
  // Use the window.EventTarget.prototype when possible to avoid wrong overrides (e.g: https://github.com/salesforce/lwc/issues/1824)
  const listenerTarget = window.EventTarget && eventTarget instanceof EventTarget ? window.EventTarget.prototype : eventTarget;
  const originalMethod = getZoneJsOriginalValue(listenerTarget, methodName);
  try {
    // In some cases this call fails with an Illegal invocation error, we then catch the error and use the zone.js
    // patched method
    cb(originalMethod);
  } catch (error) {
    if (isIllegalInvocationError(error, methodName)) {
      return cb(eventTarget[methodName]);
    }
    throw error;
  }
}
;// CONCATENATED MODULE: ../core/esm/report/reportObservable.js






var RawReportType = {
  intervention: 'intervention',
  deprecation: 'deprecation',
  cspViolation: 'csp_violation'
};
function initReportObservable(configuration, apis) {
  var observables = [];
  if (includes(apis, RawReportType.cspViolation)) {
    observables.push(createCspViolationReportObservable(configuration));
  }
  var reportTypes = filter(apis, function (api) {
    return api !== RawReportType.cspViolation;
  });
  if (reportTypes.length) {
    observables.push(createReportObservable(reportTypes));
  }
  return mergeObservables.apply(this, observables);
}
function createReportObservable(reportTypes) {
  return new Observable(function (observable) {
    if (!window.ReportingObserver) {
      return;
    }
    var handleReports = monitor(function (reports) {
      each(reports, function (report) {
        observable.notify(buildRawReportErrorFromReport(report));
      });
    });
    var observer = new window.ReportingObserver(handleReports, {
      types: reportTypes,
      buffered: true
    });
    observer.observe();
    return function () {
      observer.disconnect();
    };
  });
}
function createCspViolationReportObservable(configuration) {
  return new Observable(function (observable) {
    var _addEventListener = addEventListener(document, DOM_EVENT.SECURITY_POLICY_VIOLATION, function (event) {
      observable.notify(buildRawReportErrorFromCspViolation(event));
    });
    return _addEventListener.stop;
  });
}
function buildRawReportErrorFromReport(report) {
  var body = report.body;
  var type = report.type;
  return buildRawReportError({
    type: body.id,
    message: type + ': ' + body.message,
    originalError: report,
    stack: buildStack(body.id, body.message, body.sourceFile, body.lineNumber, body.columnNumber)
  });
}
function buildRawReportError(partial) {
  return tools_assign({
    startClocks: clocksNow(),
    source: ErrorSource.REPORT,
    handling: ErrorHandling.UNHANDLED
  }, partial);
}
function buildRawReportErrorFromCspViolation(event) {
  var message = "'" + event.blockedURI + "' blocked by '" + event.effectiveDirective + "' directive";
  return buildRawReportError({
    type: event.effectiveDirective,
    message: RawReportType.cspViolation + ': ' + message,
    originalError: event,
    csp: {
      disposition: event.disposition
    },
    stack: buildStack(event.effectiveDirective, event.originalPolicy ? "".concat(message, " of the policy \"").concat(safeTruncate(event.originalPolicy, 100, '...'), "\"") : 'no policy', event.sourceFile, event.lineNumber, event.columnNumber)
  });
}
function buildStack(name, message, sourceFile, lineNumber, columnNumber) {
  return sourceFile && toStackTraceString({
    name: name,
    message: message,
    stack: [{
      func: '?',
      url: sourceFile,
      line: lineNumber,
      column: columnNumber
    }]
  });
}
;// CONCATENATED MODULE: ../core/esm/helper/lifeCycle.js

var LifeCycleEventType = {
  AUTO_ACTION_COMPLETED: 'AUTO_ACTION_COMPLETED',
  BEFORE_VIEW_CREATED: 'BEFORE_VIEW_CREATED',
  VIEW_CREATED: 'VIEW_CREATED',
  VIEW_UPDATED: 'VIEW_UPDATED',
  BEFORE_VIEW_UPDATED: 'BEFORE_VIEW_UPDATED',
  VIEW_ENDED: 'VIEW_ENDED',
  AFTER_VIEW_ENDED: 'AFTER_VIEW_ENDED',
  SESSION_RENEWED: 'SESSION_RENEWED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  PAGE_EXITED: 'PAGE_EXITED',
  REQUEST_STARTED: 'REQUEST_STARTED',
  REQUEST_COMPLETED: 'REQUEST_COMPLETED',
  RAW_RUM_EVENT_COLLECTED: 'RAW_RUM_EVENT_COLLECTED',
  RUM_EVENT_COLLECTED: 'RUM_EVENT_COLLECTED',
  RAW_ERROR_COLLECTED: 'RAW_ERROR_COLLECTED',
  RAW_LOG_COLLECTED: 'RAW_LOG_COLLECTED',
  LOG_COLLECTED: 'LOG_COLLECTED'
};
function LifeCycle() {
  this.callbacks = {};
}
LifeCycle.prototype = {
  notify: function (eventType, data) {
    var eventCallbacks = this.callbacks[eventType];
    if (eventCallbacks) {
      each(eventCallbacks, function (callback) {
        callback(data);
      });
    }
  },
  subscribe: function (eventType, callback) {
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }
    this.callbacks[eventType].push(callback);
    var _this = this;
    return {
      unsubscribe: function () {
        _this.callbacks[eventType] = filter(_this.callbacks[eventType], function (other) {
          return other !== callback;
        });
      }
    };
  }
};
;// CONCATENATED MODULE: ../core/esm/helper/limitModification.js


function limitModification(object, modifiableFieldPaths, modifier) {
  const clone = deepClone(object);
  const result = modifier(clone);
  objectEntries(modifiableFieldPaths).forEach(_ref => {
    let [fieldPath, fieldType] = _ref;
    return (
      // Traverse both object and clone simultaneously up to the path and apply the modification from the clone to the original object when the type is valid
      setValueAtPath(object, clone, fieldPath.split(/\.|(?=\[\])/), fieldType)
    );
  });
  return result;
}
function setValueAtPath(object, clone, pathSegments, fieldType) {
  const [field, ...restPathSegments] = pathSegments;
  if (field === '[]') {
    if (Array.isArray(object) && Array.isArray(clone)) {
      object.forEach((item, i) => setValueAtPath(item, clone[i], restPathSegments, fieldType));
    }
    return;
  }
  if (!isValidObject(object) || !isValidObject(clone)) {
    return;
  }
  if (restPathSegments.length > 0) {
    return setValueAtPath(object[field], clone[field], restPathSegments, fieldType);
  }
  setNestedValue(object, field, clone[field], fieldType);
}
function setNestedValue(object, field, value, fieldType) {
  const newType = getType(value);
  if (newType === fieldType) {
    object[field] = sanitize(value);
  } else if (fieldType === 'object' && (newType === 'undefined' || newType === 'null')) {
    object[field] = {};
  }
}
function isValidObject(object) {
  return getType(object) === 'object';
}
;// CONCATENATED MODULE: ../core/esm/helper/createEventRateLimiter.js



function createEventRateLimiter(eventType, limit, onLimitReached) {
  var eventCount = 0;
  var allowNextEvent = false;
  return {
    isLimitReached: function () {
      if (eventCount === 0) {
        timer_setTimeout(function () {
          eventCount = 0;
        }, ONE_MINUTE);
      }
      eventCount += 1;
      if (eventCount <= limit || allowNextEvent) {
        allowNextEvent = false;
        return false;
      }
      if (eventCount === limit + 1) {
        allowNextEvent = true;
        try {
          onLimitReached({
            message: 'Reached max number of ' + eventType + 's by minute: ' + limit,
            source: errorTools_ErrorSource.AGENT,
            startClocks: clocksNow()
          });
        } finally {
          allowNextEvent = false;
        }
      }
      return true;
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/helper/urlPolyfill.js

function normalizeUrl(url) {
  return buildUrl(url, getLocationOrigin()).href;
}
function isValidUrl(url) {
  try {
    return !!buildUrl(url);
  } catch (e) {
    return false;
  }
}

// export function haveSameOrigin(url1, url2) {
//   return getOrigin(url1) === getOrigin(url2)
// }

function getOrigin(url) {
  return getLinkElementOrigin(buildUrl(url));
}
function getPathName(url) {
  var pathname = buildUrl(url).pathname;
  return pathname[0] === '/' ? pathname : '/' + pathname;
}
function getSearch(url) {
  return buildUrl(url).search;
}
function getHash(url) {
  return buildUrl(url).hash;
}
function buildUrl(url, base) {
  if (checkURLSupported()) {
    return base !== undefined ? new URL(url, base) : new URL(url);
  }
  if (base === undefined && !/:/.test(url)) {
    throw new Error('Invalid URL: ' + url);
  }
  var doc = document;
  var anchorElement = doc.createElement('a');
  if (base !== undefined) {
    doc = document.implementation.createHTMLDocument('');
    var baseElement = doc.createElement('base');
    baseElement.href = base;
    doc.head.appendChild(baseElement);
    doc.body.appendChild(anchorElement);
  }
  anchorElement.href = url;
  return anchorElement;
}
var isURLSupported;
function checkURLSupported() {
  if (isURLSupported !== undefined) {
    return isURLSupported;
  }
  try {
    var url = new URL('http://test/path');
    isURLSupported = url.href === 'http://test/path';
    return isURLSupported;
  } catch (e) {
    isURLSupported = false;
  }
  return isURLSupported;
}
;// CONCATENATED MODULE: ../core/esm/helper/readBytesFromStream.js


/**
 * Read bytes from a ReadableStream until at least `limit` bytes have been read (or until the end of
 * the stream). The callback is invoked with the at most `limit` bytes, and indicates that the limit
 * has been exceeded if more bytes were available.
 */
function readBytesFromStream(stream, callback, options) {
  var reader = stream.getReader();
  var chunks = [];
  var readBytesCount = 0;
  readMore();
  function readMore() {
    reader.read().then(monitor(function (result) {
      if (result.done) {
        onDone();
        return;
      }
      if (options.collectStreamBody) {
        chunks.push(result.value);
      }
      readBytesCount += result.value.length;
      if (readBytesCount > options.bytesLimit) {
        onDone();
      } else {
        readMore();
      }
    }), monitor(function (error) {
      callback(error);
    }));
  }
  function onDone() {
    reader.cancel().catch(
    // we don't care if cancel fails, but we still need to catch the error to avoid reporting it
    // as an unhandled rejection
    tools_noop);
    var bytes;
    var limitExceeded;
    if (options.collectStreamBody) {
      var completeBuffer;
      if (chunks.length === 1) {
        // optimization: if the response is small enough to fit in a single buffer (provided by the browser), just
        // use it directly.
        completeBuffer = chunks[0];
      } else {
        // else, we need to copy buffers into a larger buffer to concatenate them.
        completeBuffer = new Uint8Array(readBytesCount);
        var offset = 0;
        each(chunks, function (chunk) {
          completeBuffer.set(chunk, offset);
          offset += chunk.length;
        });
      }
      bytes = completeBuffer.slice(0, options.bytesLimit);
      limitExceeded = completeBuffer.length > options.bytesLimit;
    }
    callback(undefined, bytes, limitExceeded);
  }
}
;// CONCATENATED MODULE: ../core/esm/helper/requestIdleCallback.js




/**
 * 'requestIdleCallback' with a shim.
 */
function requestIdleCallback(callback, opts) {
  // Note: check both 'requestIdleCallback' and 'cancelIdleCallback' existence because some polyfills only implement 'requestIdleCallback'.
  if (window.requestIdleCallback && window.cancelIdleCallback) {
    const id = window.requestIdleCallback(monitor(callback), opts);
    return function () {
      return window.cancelIdleCallback(id);
    };
  }
  return requestIdleCallbackShim(callback);
}
const MAX_TASK_TIME = 50;

/*
 * Shim from https://developer.chrome.com/blog/using-requestidlecallback#checking_for_requestidlecallback
 * Note: there is no simple way to support the "timeout" option, so we ignore it.
 */
function requestIdleCallbackShim(callback) {
  const start = dateNow();
  const timeoutId = timer_setTimeout(function () {
    callback({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, MAX_TASK_TIME - (dateNow() - start));
      }
    });
  }, 0);
  return function () {
    return timer_clearTimeout(timeoutId);
  };
}
;// CONCATENATED MODULE: ../core/esm/helper/taskQueue.js



/**
 * Maximum delay before starting to execute tasks in the queue. We don't want to wait too long
 * before running tasks, as it might hurt reliability (ex: if the user navigates away, we might lose
 * the opportunity to send some data). We also don't want to run tasks too often, as it might hurt
 * performance.
 */
const IDLE_CALLBACK_TIMEOUT = ONE_SECOND;

/**
 * Maximum amount of time allocated to running tasks when a timeout (`IDLE_CALLBACK_TIMEOUT`) is
 * reached. We should not run tasks for too long as it will hurt performance, but we should still
 * run some tasks to avoid postponing them forever.
 *
 * Rational: Running tasks for 30ms every second (IDLE_CALLBACK_TIMEOUT) should be acceptable.
 */
const MAX_EXECUTION_TIME_ON_TIMEOUT = 30;
function createTaskQueue() {
  const pendingTasks = [];
  function run(deadline) {
    let executionTimeRemaining;
    if (deadline.didTimeout) {
      const start = performance.now();
      executionTimeRemaining = function () {
        return MAX_EXECUTION_TIME_ON_TIMEOUT - (performance.now() - start);
      };
    } else {
      executionTimeRemaining = deadline.timeRemaining.bind(deadline);
    }
    while (executionTimeRemaining() > 0 && pendingTasks.length) {
      pendingTasks.shift()();
    }
    if (pendingTasks.length) {
      scheduleNextRun();
    }
  }
  function scheduleNextRun() {
    requestIdleCallback(run, {
      timeout: IDLE_CALLBACK_TIMEOUT
    });
  }
  return {
    push: function (task) {
      if (pendingTasks.push(task) === 1) {
        scheduleNextRun();
      }
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/configuration/transportConfiguration.js

var TRIM_REGIX = /^\s+|\s+$/g;
var typeMap = {
  rum: '/rum',
  log: '/logging',
  sessionReplay: '/rum/replay'
};
function getEndPointUrl(configuration, type) {
  // type: rum, log,replay
  var subUrl = typeMap[type];
  if (!subUrl) return '';
  var url = configuration.datakitOrigin || configuration.datakitUrl || configuration.site;
  if (url.indexOf('/') === 0) {
    url = location.origin + trim(url);
  }
  var endpoint = url;
  if (url.lastIndexOf('/') === url.length - 1) {
    endpoint = trim(url) + 'v1/write' + subUrl;
  } else {
    endpoint = trim(url) + '/v1/write' + subUrl;
  }
  if (configuration.site && configuration.clientToken) {
    endpoint = endpoint + '?token=' + configuration.clientToken + '&to_headless=true';
  }
  return endpoint;
}
function trim(str) {
  return str.replace(TRIM_REGIX, '');
}
function computeTransportConfiguration(initConfiguration) {
  var isIntakeUrl = function (url) {
    return false;
  };
  if ('isIntakeUrl' in initConfiguration && isArray(initConfiguration.isIntakeUrl)) {
    isIntakeUrl = function (url) {
      return some(initConfiguration.isIntakeUrl, function (takeUrl) {
        return url.indexOf(takeUrl) === 0;
      });
    };
  } else if ('isIntakeUrl' in initConfiguration && isFunction(initConfiguration.isIntakeUrl) && isBoolean(initConfiguration.isIntakeUrl())) {
    isIntakeUrl = initConfiguration.isIntakeUrl;
  }
  var isServerError = function (request) {
    return false;
  };
  if ('isServerError' in initConfiguration && isFunction(initConfiguration.isServerError) && isBoolean(initConfiguration.isServerError())) {
    isServerError = initConfiguration.isServerError;
  }
  return {
    rumEndpoint: getEndPointUrl(initConfiguration, 'rum'),
    logsEndpoint: getEndPointUrl(initConfiguration, 'log'),
    sessionReplayEndPoint: getEndPointUrl(initConfiguration, 'sessionReplay'),
    isIntakeUrl: isIntakeUrl,
    isServerError: isServerError
  };
}
function isIntakeRequest(url, configuration) {
  var notTakeRequest = [configuration.rumEndpoint];
  if (configuration.logsEndpoint) {
    notTakeRequest.push(configuration.logsEndpoint);
  }
  if (configuration.sessionReplayEndPoint) {
    notTakeRequest.push(configuration.sessionReplayEndPoint);
  }
  return some(notTakeRequest, function (takeUrl) {
    return url.indexOf(takeUrl) === 0;
  }) || configuration.isIntakeUrl(url);
}
;// CONCATENATED MODULE: ../core/esm/browser/cookie.js

function getCookieName(name, options) {
  return "".concat(name, "_").concat(options && options.crossSite ? 'cs1' : 'cs0', "_").concat(options && options.domain ? 'd1' : 'd0', "_").concat(options && options.secure ? 'sec1' : 'sec0', "_").concat(options && options.partitioned ? 'part1' : 'part0');
}
function setCookie(name, value, expireDelay, options) {
  var date = new Date();
  date.setTime(date.getTime() + expireDelay);
  var expires = 'expires=' + date.toUTCString();
  var sameSite = options && options.crossSite ? 'none' : 'strict';
  var domain = options && options.domain ? ';domain=' + options.domain : '';
  var secure = options && options.secure ? ';secure' : '';
  var partitioned = options && options.partitioned ? ';partitioned' : '';
  document.cookie = getCookieName(name, options) + '=' + value + ';' + expires + ';path=/;samesite=' + sameSite + domain + secure + partitioned;
}
function cookie_getCookie(name, options) {
  return findCommaSeparatedValue(document.cookie, getCookieName(name, options));
}
var initCookieParsed;
/**
 * Returns a cached value of the cookie. Use this during SDK initialization (and whenever possible)
 * to avoid accessing document.cookie multiple times.
 */
function getInitCookie(name) {
  if (!initCookieParsed) {
    initCookieParsed = findCommaSeparatedValues(document.cookie);
  }
  return initCookieParsed.get(name);
}
function resetInitCookies() {
  initCookieParsed = undefined;
}
function deleteCookie(name, options) {
  setCookie(name, '', 0, options);
}
function areCookiesAuthorized(options) {
  if (document.cookie === undefined || document.cookie === null) {
    return false;
  }
  try {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    var testCookieName = "gc_cookie_test_".concat(UUID());
    var testCookieValue = 'test';
    setCookie(testCookieName, testCookieValue, ONE_MINUTE, options);
    const isCookieCorrectlySet = cookie_getCookie(testCookieName, options) === testCookieValue;
    deleteCookie(testCookieName, options);
    return isCookieCorrectlySet;
  } catch (error) {
    return false;
  }
}

/**
 * No API to retrieve it, number of levels for subdomain and suffix are unknown
 * strategy: find the minimal domain on which cookies are allowed to be set
 * https://web.dev/same-site-same-origin/#site
 */
var getCurrentSiteCache;
function getCurrentSite() {
  if (getCurrentSiteCache === undefined) {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    const testCookieName = "gc_site_test_".concat(UUID());
    const testCookieValue = 'test';
    const domainLevels = window.location.hostname.split('.');
    let candidateDomain = domainLevels.pop();
    while (domainLevels.length && !cookie_getCookie(testCookieName, {
      domain: candidateDomain
    })) {
      candidateDomain = "".concat(domainLevels.pop(), ".").concat(candidateDomain);
      setCookie(testCookieName, testCookieValue, ONE_SECOND, {
        domain: candidateDomain
      });
    }
    deleteCookie(testCookieName, {
      domain: candidateDomain
    });
    getCurrentSiteCache = candidateDomain;
  }
  return getCurrentSiteCache;
}
;// CONCATENATED MODULE: ../core/esm/session/sessionConstants.js

var SESSION_TIME_OUT_DELAY = 4 * ONE_HOUR;
var SESSION_EXPIRATION_DELAY = 15 * ONE_MINUTE;
var SESSION_STORE_KEY = '_gc_s';
const SESSION_NOT_TRACKED = '0';
const SessionPersistence = {
  COOKIE: 'cookie',
  LOCAL_STORAGE: 'local-storage'
};
;// CONCATENATED MODULE: ../core/esm/session/sessionState.js


const SESSION_ENTRY_REGEXP = /^([a-zA-Z]+)=([a-z0-9-]+)$/;
const SESSION_ENTRY_SEPARATOR = '&';
const EXPIRED = '1';
function getExpiredSessionState() {
  return {
    isExpired: EXPIRED
  };
}
function isSessionInNotStartedState(session) {
  return isEmptyObject(session);
}
function isSessionStarted(session) {
  return !isSessionInNotStartedState(session);
}
function isSessionInExpiredState(session) {
  return session.isExpired !== undefined || !isActiveSession(session);
}
function isActiveSession(sessionState) {
  return (sessionState.created === undefined || dateNow() - Number(sessionState.created) < SESSION_TIME_OUT_DELAY) && (sessionState.expire === undefined || dateNow() < Number(sessionState.expire));
}
function expandSessionState(session) {
  session.expire = String(dateNow() + SESSION_EXPIRATION_DELAY);
}
function toSessionString(session) {
  return tools_map(objectEntries(session), function (item) {
    return item[0] + '=' + item[1];
  }).join(SESSION_ENTRY_SEPARATOR);
}
function toSessionState(sessionString) {
  const session = {};
  if (isValidSessionString(sessionString)) {
    sessionString.split(SESSION_ENTRY_SEPARATOR).forEach(function (entry) {
      const matches = SESSION_ENTRY_REGEXP.exec(entry);
      if (matches !== null) {
        const [, key, value] = matches;
        session[key] = value;
      }
    });
  }
  return session;
}
function isValidSessionString(sessionString) {
  return !!sessionString && (sessionString.indexOf(SESSION_ENTRY_SEPARATOR) !== -1 || SESSION_ENTRY_REGEXP.test(sessionString));
}
;// CONCATENATED MODULE: ../core/esm/session/sessionInCookie.js




function selectCookieStrategy(initConfiguration) {
  const cookieOptions = buildCookieOptions(initConfiguration);
  return areCookiesAuthorized(cookieOptions) ? {
    type: SessionPersistence.COOKIE,
    cookieOptions
  } : undefined;
}
function initCookieStrategy(cookieOptions) {
  const cookieStore = {
    /**
     * Lock strategy allows mitigating issues due to concurrent access to cookie.
     * This issue concerns only chromium browsers and enabling this on firefox increases cookie write failures.
     */
    isLockEnabled: isChromium(),
    persistSession: persistSessionCookie(cookieOptions),
    retrieveSession: retrieveSessionCookie(cookieOptions),
    expireSession: function () {
      return expireSessionCookie(cookieOptions);
    }
  };
  return cookieStore;
}
function persistSessionCookie(options) {
  return function (session) {
    setCookie(SESSION_STORE_KEY, toSessionString(session), SESSION_EXPIRATION_DELAY, options);
  };
}
function expireSessionCookie(options) {
  setCookie(SESSION_STORE_KEY, toSessionString(getExpiredSessionState()), SESSION_TIME_OUT_DELAY, options);
}
function retrieveSessionCookie(options) {
  return function () {
    var sessionString = cookie_getCookie(SESSION_STORE_KEY, options);
    return toSessionState(sessionString);
  };
}
function buildCookieOptions(initConfiguration) {
  const cookieOptions = {};
  cookieOptions.secure = !!initConfiguration.useSecureSessionCookie || !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
  cookieOptions.crossSite = !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
  cookieOptions.partitioned = !!initConfiguration.usePartitionedCrossSiteSessionCookie;
  if (initConfiguration.trackSessionAcrossSubdomains) {
    cookieOptions.domain = getCurrentSite();
  }
  return cookieOptions;
}
;// CONCATENATED MODULE: ../core/esm/session/sessionInLocalStorage.js



const LOCAL_STORAGE_TEST_KEY = '_gc_test_';
function selectLocalStorageStrategy() {
  try {
    const id = UUID();
    const testKey = "".concat(LOCAL_STORAGE_TEST_KEY).concat(id);
    localStorage.setItem(testKey, id);
    const retrievedId = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return id === retrievedId ? {
      type: SessionPersistence.LOCAL_STORAGE
    } : undefined;
  } catch (e) {
    return undefined;
  }
}
function initLocalStorageStrategy() {
  return {
    isLockEnabled: false,
    persistSession: persistInLocalStorage,
    retrieveSession: retrieveSessionFromLocalStorage,
    expireSession: expireSessionFromLocalStorage
  };
}
function persistInLocalStorage(sessionState) {
  localStorage.setItem(SESSION_STORE_KEY, toSessionString(sessionState));
}
function retrieveSessionFromLocalStorage() {
  const sessionString = localStorage.getItem(SESSION_STORE_KEY);
  return toSessionState(sessionString);
}
function expireSessionFromLocalStorage() {
  persistInLocalStorage(getExpiredSessionState());
}
;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}

;// CONCATENATED MODULE: ../core/esm/session/sessionStoreOperations.js

const _excluded = ["lock"];



// import { addTelemetryDebug } from '../telemetry/telemetry'
const LOCK_RETRY_DELAY = 10;
const LOCK_MAX_TRIES = 100;

// Locks should be hold for a few milliseconds top, just the time it takes to read and write a
// cookie. Using one second should be enough in most situations.
const LOCK_EXPIRATION_DELAY = ONE_SECOND;
const LOCK_SEPARATOR = '--';
const bufferedOperations = [];
let ongoingOperations;
function processSessionStoreOperations(operations, sessionStoreStrategy) {
  let numberOfRetries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const {
    isLockEnabled,
    persistSession,
    expireSession
  } = sessionStoreStrategy;
  const persistWithLock = function (session) {
    return persistSession(tools_assign({}, session, {
      lock: currentLock
    }));
  };
  const retrieveStore = function () {
    const _sessionStoreStrategy = sessionStoreStrategy.retrieveSession(),
      {
        lock
      } = _sessionStoreStrategy,
      session = _objectWithoutProperties(_sessionStoreStrategy, _excluded);
    return {
      session,
      lock: lock && !isLockExpired(lock) ? lock : undefined
    };
  };
  if (!ongoingOperations) {
    ongoingOperations = operations;
  }
  if (operations !== ongoingOperations) {
    bufferedOperations.push(operations);
    return;
  }
  if (isLockEnabled && numberOfRetries >= LOCK_MAX_TRIES) {
    // addTelemetryDebug('Aborted session operation after max lock retries', {
    //   currentStore: retrieveStore()
    // })
    next(sessionStoreStrategy);
    return;
  }
  let currentLock;
  let currentStore = retrieveStore();
  if (isLockEnabled) {
    // if someone has lock, retry later
    if (currentStore.lock) {
      retryLater(operations, sessionStoreStrategy, numberOfRetries);
      return;
    }
    // acquire lock
    currentLock = createLock();
    persistWithLock(currentStore.session);
    // if lock is not acquired, retry later
    currentStore = retrieveStore();
    if (currentStore.lock !== currentLock) {
      retryLater(operations, sessionStoreStrategy, numberOfRetries);
      return;
    }
  }
  let processedSession = operations.process(currentStore.session);
  if (isLockEnabled) {
    // if lock corrupted after process, retry later
    currentStore = retrieveStore();
    if (currentStore.lock !== currentLock) {
      retryLater(operations, sessionStoreStrategy, numberOfRetries);
      return;
    }
  }
  if (processedSession) {
    if (isSessionInExpiredState(processedSession)) {
      expireSession();
    } else {
      expandSessionState(processedSession);
      isLockEnabled ? persistWithLock(processedSession) : persistSession(processedSession);
    }
  }
  if (isLockEnabled) {
    // correctly handle lock around expiration would require to handle this case properly at several levels
    // since we don't have evidence of lock issues around expiration, let's just not do the corruption check for it
    if (!(processedSession && isSessionInExpiredState(processedSession))) {
      // if lock corrupted after persist, retry later
      currentStore = retrieveStore();
      if (currentStore.lock !== currentLock) {
        retryLater(operations, sessionStoreStrategy, numberOfRetries);
        return;
      }
      persistSession(currentStore.session);
      processedSession = currentStore.session;
    }
  }
  // call after even if session is not persisted in order to perform operations on
  // up-to-date session state value => the value could have been modified by another tab
  if (operations.after) {
    operations.after(processedSession || currentStore.session);
  }
  next(sessionStoreStrategy);
}
function retryLater(operations, sessionStore, currentNumberOfRetries) {
  timer_setTimeout(function () {
    processSessionStoreOperations(operations, sessionStore, currentNumberOfRetries + 1);
  }, LOCK_RETRY_DELAY);
}
function next(sessionStore) {
  ongoingOperations = undefined;
  const nextOperations = bufferedOperations.shift();
  if (nextOperations) {
    processSessionStoreOperations(nextOperations, sessionStore);
  }
}
function createLock() {
  return UUID() + LOCK_SEPARATOR + timeStampNow();
}
function isLockExpired(lock) {
  const [, timeStamp] = lock.split(LOCK_SEPARATOR);
  return !timeStamp || tools_elapsed(Number(timeStamp), timeStampNow()) > LOCK_EXPIRATION_DELAY;
}
;// CONCATENATED MODULE: ../core/esm/session/sessionStore.js










/**
 * Every second, the storage will be polled to check for any change that can occur
 * to the session state in another browser tab, or another window.
 * This value has been determined from our previous cookie-only implementation.
 */
const STORAGE_POLL_DELAY = ONE_SECOND;

/**
 * Checks if cookies are available as the preferred storage
 * Else, checks if LocalStorage is allowed and available
 */
function selectSessionStoreStrategyType(initConfiguration) {
  switch (initConfiguration.sessionPersistence) {
    case SessionPersistence.COOKIE:
      return selectCookieStrategy(initConfiguration);
    case SessionPersistence.LOCAL_STORAGE:
      return selectLocalStorageStrategy();
    case undefined:
      {
        let sessionStoreStrategyType = selectCookieStrategy(initConfiguration);
        if (!sessionStoreStrategyType && initConfiguration.allowFallbackToLocalStorage) {
          sessionStoreStrategyType = selectLocalStorageStrategy();
        }
        return sessionStoreStrategyType;
      }
    default:
      display.error("Invalid session persistence '".concat(String(initConfiguration.sessionPersistence), "'"));
  }
}

/**
 * Different session concepts:
 * - tracked, the session has an id and is updated along the user navigation
 * - not tracked, the session does not have an id but it is updated along the user navigation
 * - inactive, no session in store or session expired, waiting for a renew session
 */
function startSessionStore(sessionStoreStrategyType, productKey, computeSessionState) {
  const renewObservable = new Observable();
  const expireObservable = new Observable();
  const sessionStateUpdateObservable = new Observable();
  const sessionStoreStrategy = sessionStoreStrategyType.type === SessionPersistence.COOKIE ? initCookieStrategy(sessionStoreStrategyType.cookieOptions) : initLocalStorageStrategy();
  const {
    expireSession
  } = sessionStoreStrategy;
  const watchSessionTimeoutId = timer_setInterval(watchSession, STORAGE_POLL_DELAY);
  let sessionCache;
  startSession();
  const {
    throttled: throttledExpandOrRenewSession,
    cancel: cancelExpandOrRenewSession
  } = throttle(function () {
    processSessionStoreOperations({
      process: function (sessionState) {
        if (isSessionInNotStartedState(sessionState)) {
          return;
        }
        const synchronizedSession = synchronizeSession(sessionState);
        expandOrRenewSessionState(synchronizedSession);
        return synchronizedSession;
      },
      after: function (sessionState) {
        if (isSessionStarted(sessionState) && !hasSessionInCache()) {
          renewSessionInCache(sessionState);
        }
        sessionCache = sessionState;
      }
    }, sessionStoreStrategy);
  }, STORAGE_POLL_DELAY);
  function expandSession() {
    processSessionStoreOperations({
      process: function (sessionState) {
        return hasSessionInCache() ? synchronizeSession(sessionState) : undefined;
      }
    }, sessionStoreStrategy);
  }

  /**
   * allows two behaviors:
   * - if the session is active, synchronize the session cache without updating the session store
   * - if the session is not active, clear the session store and expire the session cache
   */
  function watchSession() {
    processSessionStoreOperations({
      process: function (sessionState) {
        return isSessionInExpiredState(sessionState) ? getExpiredSessionState() : undefined;
      },
      after: synchronizeSession
    }, sessionStoreStrategy);
  }
  function synchronizeSession(sessionState) {
    if (isSessionInExpiredState(sessionState)) {
      sessionState = getExpiredSessionState();
    }
    if (hasSessionInCache()) {
      if (isSessionInCacheOutdated(sessionState)) {
        expireSessionInCache();
      } else {
        sessionStateUpdateObservable.notify({
          previousState: sessionCache,
          newState: sessionState
        });
        sessionCache = sessionState;
      }
    }
    return sessionState;
  }
  function startSession() {
    processSessionStoreOperations({
      process: function (sessionState) {
        if (isSessionInNotStartedState(sessionState)) {
          return getExpiredSessionState();
        }
      },
      after: function (sessionState) {
        sessionCache = sessionState;
      }
    }, sessionStoreStrategy);
  }
  function expandOrRenewSessionState(sessionState) {
    if (isSessionInNotStartedState(sessionState)) {
      return false;
    }
    const {
      trackingType,
      isTracked
    } = computeSessionState(sessionState[productKey]);
    sessionState[productKey] = trackingType;
    delete sessionState.isExpired;
    if (isTracked && !sessionState.id) {
      sessionState.id = UUID();
      sessionState.created = String(dateNow());
    }
  }
  function hasSessionInCache() {
    return sessionCache[productKey] !== undefined;
  }
  function isSessionInCacheOutdated(sessionState) {
    return sessionCache.id !== sessionState.id || sessionCache[productKey] !== sessionState[productKey];
  }
  function expireSessionInCache() {
    sessionCache = getExpiredSessionState();
    expireObservable.notify();
  }
  function renewSessionInCache(sessionState) {
    sessionCache = sessionState;
    renewObservable.notify();
  }
  function updateSessionState(partialSessionState) {
    processSessionStoreOperations({
      process: function (sessionState) {
        return tools_assign({}, sessionState, partialSessionState);
      },
      after: synchronizeSession
    }, sessionStoreStrategy);
  }
  return {
    expandOrRenewSession: throttledExpandOrRenewSession,
    expandSession,
    getSession: function () {
      return sessionCache;
    },
    renewObservable,
    expireObservable,
    sessionStateUpdateObservable,
    restartSession: startSession,
    expire: function () {
      cancelExpandOrRenewSession();
      expireSession();
      synchronizeSession(getExpiredSessionState());
    },
    stop: function () {
      timer_clearInterval(watchSessionTimeoutId);
    },
    updateSessionState
  };
}
;// CONCATENATED MODULE: ../core/esm/configuration/configuration.js






var DefaultPrivacyLevel = {
  ALLOW: 'allow',
  MASK: 'mask',
  MASK_USER_INPUT: 'mask-user-input'
};
function validateAndBuildConfiguration(initConfiguration) {
  if (initConfiguration.sampleRate !== undefined && !isPercentage(initConfiguration.sampleRate)) {
    display.error('Sample Rate should be a number between 0 and 100');
    return;
  }
  if (initConfiguration.sessionSampleRate !== undefined && !isPercentage(initConfiguration.sessionSampleRate)) {
    display.error('Sample Rate should be a number between 0 and 100');
    return;
  }
  if (initConfiguration.telemetrySampleRate !== undefined && !isPercentage(initConfiguration.telemetrySampleRate)) {
    display.error('Telemetry Sample Rate should be a number between 0 and 100');
    return;
  }
  var sessionSampleRate = isNullUndefinedDefaultValue(initConfiguration.sessionSampleRate, initConfiguration.sampleRate);
  return tools_assign({
    beforeSend: initConfiguration.beforeSend && catchUserErrors(initConfiguration.beforeSend, 'beforeSend threw an error:'),
    sessionStoreStrategyType: selectSessionStoreStrategyType(initConfiguration),
    isOpenWay: initConfiguration.site && initConfiguration.clientToken,
    sessionSampleRate: isNullUndefinedDefaultValue(sessionSampleRate, 100),
    service: initConfiguration.service,
    version: initConfiguration.version,
    env: initConfiguration.env,
    telemetrySampleRate: isNullUndefinedDefaultValue(initConfiguration.telemetrySampleRate, 100),
    telemetryEnabled: isNullUndefinedDefaultValue(initConfiguration.telemetryEnabled, false),
    silentMultipleInit: !!initConfiguration.silentMultipleInit,
    /**
     * beacon payload max queue size implementation is 64kb
     * ensure that we leave room for logs, rum and potential other users
     */
    batchBytesLimit: 16 * ONE_KIBI_BYTE,
    eventRateLimiterThreshold: 3000,
    maxTelemetryEventsPerPage: 15,
    /**
     * flush automatically, aim to be lower than ALB connection timeout
     * to maximize connection reuse.
     */
    flushTimeout: 30 * ONE_SECOND,
    /**
     * Logs intake limit
     */
    batchMessagesLimit: 50,
    messageBytesLimit: 256 * ONE_KIBI_BYTE,
    resourceUrlLimit: 5 * ONE_KIBI_BYTE,
    storeContextsToLocal: !!initConfiguration.storeContextsToLocal,
    // localstorage key ，default auto gen
    storeContextsKey: initConfiguration.storeContextsKey,
    sendContentTypeByJson: !!initConfiguration.sendContentTypeByJson,
    retryMaxSize: isNullUndefinedDefaultValue(initConfiguration.retryMaxSize, -1)
  }, computeTransportConfiguration(initConfiguration));
}
function validatePostRequestRequireParamsConfiguration(initConfiguration) {
  if (!initConfiguration.site && !initConfiguration.datakitOrigin && !initConfiguration.datakitUrl) {
    display.error('datakitOrigin or site is not configured, no RUM data will be collected.');
    return false;
  }
  //   if (!initConfiguration.datakitUrl && !initConfiguration.datakitOrigin) {
  //     display.error(
  //       'datakitOrigin is not configured, no RUM data will be collected.'
  //     )
  //     return false
  //   }
  if (initConfiguration.site && !initConfiguration.clientToken) {
    display.error('clientToken is not configured, no RUM data will be collected.');
    return false;
  }
  return true;
}
;// CONCATENATED MODULE: ../core/esm/browser/fetchObservable.js





var fetchObservable;
function initFetchObservable() {
  if (!fetchObservable) {
    fetchObservable = createFetchObservable();
  }
  return fetchObservable;
}
function resetFetchObservable() {
  fetchObservable = undefined;
}
function createFetchObservable() {
  return new Observable(function (observable) {
    if (!window.fetch) {
      return;
    }
    var fetchMethod = instrumentMethod(window, 'fetch', function (call) {
      return beforeSend(call, observable);
    }, {
      computeHandlingStack: true
    });
    return fetchMethod.stop;
  });
}
function beforeSend(params, observable) {
  var parameters = params.parameters;
  var onPostCall = params.onPostCall;
  var handlingStack = params.handlingStack;
  var input = parameters[0];
  var init = parameters[1];
  //   var method =
  //       (init && init.method) || (input instanceof Request && input.method) || 'GET'
  //     const methodFromParams =
  //       (init && init.method) || (input instanceof Request && input.method)
  //     const method = methodFromParams ? methodFromParams.toUpperCase() : 'GET'
  var methodFromParams = init && init.method;
  if (methodFromParams === undefined && input instanceof Request) {
    methodFromParams = input.method;
  }
  var method = methodFromParams !== undefined ? String(methodFromParams).toUpperCase() : 'GET';
  var url = input instanceof Request ? input.url : normalizeUrl(String(input));
  var startClocks = clocksNow();
  var context = {
    state: 'start',
    init: init,
    input: input,
    method: method,
    startClocks: startClocks,
    url: url,
    handlingStack: handlingStack
  };
  observable.notify(context);
  parameters[0] = context.input;
  parameters[1] = context.init;
  onPostCall(function (responsePromise) {
    return afterSend(observable, responsePromise, context);
  });
}
function afterSend(observable, responsePromise, startContext) {
  var context = startContext;
  var reportFetch = function (partialContext) {
    context.state = 'resolve';
    tools_assign(context, partialContext);
    // context.duration = elapsed(context.startClocks.timeStamp, timeStampNow())
    // if ('stack' in response || response instanceof Error) {
    //   context.status = 0
    //   context.isAborted =
    //     response instanceof DOMException &&
    //     response.code === DOMException.ABORT_ERR
    //   context.error = response
    // } else if ('status' in response) {
    //   context.response = response
    //   try {
    //     context.responseType =
    //       (response.constructor === Response && response.type) || '' // issue The Response type getter can only be used on instances of Response
    //   } catch (err) {
    //     context.responseType = ''
    //   }

    //   context.status = response.status
    //   context.isAborted = false
    // }
    observable.notify(context);
  };
  responsePromise.then(monitor(function (response) {
    var responseType = '';
    try {
      responseType = response.constructor === Response && response.type || ''; // issue The Response type getter can only be used on instances of Response
    } catch (err) {
      responseType = '';
    }
    reportFetch({
      response: response,
      responseType: responseType,
      status: response.status,
      isAborted: false
    });
  }), monitor(function (error) {
    reportFetch({
      status: 0,
      isAborted: context.init && context.init.signal && context.init.signal.aborted || error instanceof DOMException && error.code === DOMException.ABORT_ERR,
      error: error
    });
  }));
}
;// CONCATENATED MODULE: ../core/esm/browser/xhrObservable.js





var xhrObservable;
var xhrContexts = new WeakMap();
function initXhrObservable() {
  if (!xhrObservable) {
    xhrObservable = createXhrObservable();
  }
  return xhrObservable;
}
function createXhrObservable() {
  return new Observable(function (observable) {
    var openInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, 'open', openXhr);
    var sendInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, 'send', function (call) {
      sendXhr(call, observable);
    }, {
      computeHandlingStack: true
    });
    var setRequestHeaderInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, 'setRequestHeader', setRequestHeaderXhr);
    var abortInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, 'abort', abortXhr);
    return function () {
      openInstrumentMethod.stop();
      sendInstrumentMethod.stop();
      abortInstrumentMethod.stop();
      setRequestHeaderInstrumentMethod.stop();
    };
  });
}
function openXhr(params) {
  var xhr = params.target;
  var method = params.parameters[0];
  var url = params.parameters[1];
  xhrContexts.set(xhr, {
    state: 'open',
    method: String(method).toUpperCase(),
    url: normalizeUrl(String(url))
  });
}
function setRequestHeaderXhr(params) {
  var xhr = params.target;
  var headerKey = params.parameters[0];
  var headerValue = params.parameters[1];
  var context = xhrContexts.get(xhr);
  if (context && headerKey) {
    var requestHeaderContexts = context.requestHeaderContexts || {};
    requestHeaderContexts[headerKey] = headerValue;
    context.requestHeaderContexts = requestHeaderContexts;
  }
}
function sendXhr(params, observable) {
  var xhr = params.target;
  var handlingStack = params.handlingStack;
  var context = xhrContexts.get(xhr);
  if (!context) {
    return;
  }
  var startContext = context;
  startContext.state = 'start';
  startContext.startClocks = clocksNow();
  startContext.isAborted = false;
  startContext.xhr = xhr;
  startContext.handlingStack = handlingStack;
  var hasBeenReported = false;
  var stopInstrumentingOnReadyStateChange = instrumentMethod(xhr, 'onreadystatechange', function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Try to report the XHR as soon as possible, because the XHR may be mutated by the
      // application during a future event. For example, Angular is calling .abort() on
      // completed requests during a onreadystatechange event, so the status becomes '0'
      // before the request is collected.
      onEnd();
    }
  }).stop;
  var onEnd = function () {
    unsubscribeLoadEndListener();
    stopInstrumentingOnReadyStateChange();
    if (hasBeenReported) {
      return;
    }
    hasBeenReported = true;
    var completeContext = context;
    completeContext.state = 'complete';
    completeContext.duration = tools_elapsed(startContext.startClocks.timeStamp, timeStampNow());
    completeContext.status = xhr.status;
    observable.notify(shallowClone(completeContext));
  };
  var unsubscribeLoadEndListener = addEventListener(xhr, 'loadend', onEnd).stop;
  observable.notify(startContext);
}
function abortXhr(params) {
  var xhr = params.target;
  var context = xhrContexts.get(xhr);
  if (context) {
    context.isAborted = true;
  }
}
;// CONCATENATED MODULE: ../core/esm/browser/pageExitObservable.js




var PageExitReason = {
  HIDDEN: 'visibility_hidden',
  UNLOADING: 'before_unload',
  PAGEHIDE: 'page_hide',
  FROZEN: 'page_frozen'
};
function createPageExitObservable() {
  return new Observable(function (observable) {
    /**
     * Only event that guarantee to fire on mobile devices when the page transitions to background state
     * (e.g. when user switches to a different application, goes to homescreen, etc), or is being unloaded.
     */
    var visibilityChangeListener = addEventListeners(window, [DOM_EVENT.VISIBILITY_CHANGE, DOM_EVENT.FREEZE], function (event) {
      if (event.type === DOM_EVENT.VISIBILITY_CHANGE && document.visibilityState === 'hidden') {
        /**
         * Only event that guarantee to fire on mobile devices when the page transitions to background state
         * (e.g. when user switches to a different application, goes to homescreen, etc), or is being unloaded.
         */
        observable.notify({
          reason: PageExitReason.HIDDEN
        });
      } else if (event.type === DOM_EVENT.FREEZE) {
        /**
         * After transitioning in background a tab can be freezed to preserve resources. (cf: https://developer.chrome.com/blog/page-lifecycle-api)
         * Allow to collect events happening between hidden and frozen state.
         */
        observable.notify({
          reason: PageExitReason.FROZEN
        });
      }
    }, {
      capture: true
    });

    /**
     * Safari does not support yet to send a request during:
     * - a visibility change during doc unload (cf: https://bugs.webkit.org/show_bug.cgi?id=194897)
     * - a page hide transition (cf: https://bugs.webkit.org/show_bug.cgi?id=188329)
     */
    var beforeUnloadListener = addEventListener(window, DOM_EVENT.BEFORE_UNLOAD, function () {
      observable.notify({
        reason: PageExitReason.UNLOADING
      });
    });
    return function () {
      visibilityChangeListener.stop();
      beforeUnloadListener.stop();
    };
  });
}
function isPageExitReason(reason) {
  return includes(values(PageExitReason), reason);
}
;// CONCATENATED MODULE: ../core/esm/browser/htmlDomUtils.js
function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE;
}
function isCommentNode(node) {
  return node.nodeType === Node.COMMENT_NODE;
}
function isElementNode(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
function isNodeShadowHost(node) {
  return isElementNode(node) && Boolean(node.shadowRoot);
}
function isNodeShadowRoot(node) {
  var shadowRoot = node;
  return !!shadowRoot.host && shadowRoot.nodeType === Node.DOCUMENT_FRAGMENT_NODE && isElementNode(shadowRoot.host);
}
function hasChildNodes(node) {
  return node.childNodes.length > 0 || isNodeShadowHost(node);
}
// export function getChildNodes(node) {
//   return isNodeShadowHost(node) ? node.shadowRoot.childNodes : node.childNodes
// }
function forEachChildNodes(node, callback) {
  // node.childNodes.forEach(callback)
  var child = node.firstChild;
  while (child) {
    callback(child);
    child = child.nextSibling;
  }
  if (isNodeShadowHost(node)) {
    callback(node.shadowRoot);
  }
}
/**
 * Return `host` in case if the current node is a shadow root otherwise will return the `parentNode`
 */
function getParentNode(node) {
  return isNodeShadowRoot(node) ? node.host : node.parentNode;
}
;// CONCATENATED MODULE: ../core/esm/browser/runOnReadyState.js



function runOnReadyState(expectedReadyState, callback) {
  if (document.readyState === expectedReadyState || document.readyState === 'complete') {
    callback();
    return {
      stop: tools_noop
    };
  } else {
    var eventName = expectedReadyState === 'complete' ? DOM_EVENT.LOAD : DOM_EVENT.DOM_CONTENT_LOADED;
    return addEventListener(window, eventName, callback, {
      once: true
    });
  }
}
;// CONCATENATED MODULE: ../core/esm/browser/scroll.js
function getScrollX() {
  var scrollX;
  var visual = window.visualViewport;
  if (visual) {
    scrollX = visual.pageLeft - visual.offsetLeft;
  } else if (window.scrollX !== undefined) {
    scrollX = window.scrollX;
  } else {
    scrollX = window.pageXOffset || 0;
  }
  return Math.round(scrollX);
}
function getScrollY() {
  var scrollY;
  var visual = window.visualViewport;
  if (visual) {
    scrollY = visual.pageTop - visual.offsetTop;
  } else if (window.scrollY !== undefined) {
    scrollY = window.scrollY;
  } else {
    scrollY = window.pageYOffset || 0;
  }
  return Math.round(scrollY);
}
;// CONCATENATED MODULE: ../core/esm/dataMap.js

var commonTags = {
  sdk_name: '_gc.sdk_name',
  sdk_version: '_gc.sdk_version',
  app_id: 'application.id',
  env: 'env',
  service: 'service',
  version: 'version',
  source: 'source',
  userid: 'user.id',
  user_email: 'user.email',
  user_name: 'user.name',
  session_id: 'session.id',
  session_type: 'session.type',
  session_is_forced: 'session.is_forced_session',
  session_sampling: 'session.is_sampling',
  is_signin: 'user.is_signin',
  os: 'device.os',
  os_version: 'device.os_version',
  os_version_major: 'device.os_version_major',
  browser: 'device.browser',
  browser_version: 'device.browser_version',
  browser_version_major: 'device.browser_version_major',
  b2owser: 'device.b2owser',
  b2owser_version: 'device.b2owser_version',
  b2owser_version_major: 'device.b2owser_version_major',
  webview: 'webview.webview',
  webview_version: 'webview.webview_version',
  webview_version_major: 'webview.webview_version_major',
  screen_size: 'device.screen_size',
  network_type: 'device.network_type',
  time_zone: 'device.time_zone',
  device: 'device.device',
  device_vendor: 'device.device_vendor',
  device_model: 'device.device_model',
  user_agent: 'device.user_agent',
  view_id: 'view.id',
  view_referrer: 'view.referrer',
  view_url: 'view.url',
  view_host: 'view.host',
  view_path: 'view.path',
  view_name: 'view.name',
  view_path_group: 'view.path_group',
  view_path_name: 'view.pathname'
};
var commonFields = {
  view_url_query: 'view.url_query',
  action_id: 'action.id',
  action_ids: 'action.ids',
  view_in_foreground: 'view.in_foreground',
  display: 'display',
  session_has_replay: 'session.has_replay',
  is_login: 'user.is_login',
  page_states: '_gc.page_states',
  session_sample_rate: '_gc.configuration.session_sample_rate',
  session_replay_sample_rate: '_gc.configuration.session_replay_sample_rate',
  session_on_error_sample_rate: '_gc.configuration.session_on_error_sample_rate',
  session_replay_on_error_sample_rate: '_gc.configuration.session_replay_on_error_sample_rate',
  drift: '_gc.drift'
};
var dataMap = {
  view: {
    type: RumEventType.VIEW,
    tags: {
      view_loading_type: 'view.loading_type',
      view_apdex_level: 'view.apdex_level',
      view_privacy_replay_level: 'privacy.replay_level'
    },
    fields: {
      view_update_time: '_gc.view_update_time',
      sampled_for_replay: 'session.sampled_for_replay',
      sampled_for_error_replay: 'session.sampled_for_error_replay',
      sampled_for_error_session: 'session.sampled_for_error_session',
      session_error_timestamp: 'session.error_timestamp_for_session',
      is_active: 'view.is_active',
      session_replay_stats: '_gc.replay_stats',
      session_is_active: 'session.is_active',
      view_error_count: 'view.error.count',
      view_resource_count: 'view.resource.count',
      view_long_task_count: 'view.long_task.count',
      view_action_count: 'view.action.count',
      first_contentful_paint: 'view.first_contentful_paint',
      largest_contentful_paint: 'view.largest_contentful_paint',
      largest_contentful_paint_element_selector: 'view.largest_contentful_paint_element_selector',
      cumulative_layout_shift: 'view.cumulative_layout_shift',
      cumulative_layout_shift_time: 'view.cumulative_layout_shift_time',
      cumulative_layout_shift_target_selector: 'view.cumulative_layout_shift_target_selector',
      first_input_delay: 'view.first_input_delay',
      loading_time: 'view.loading_time',
      dom_interactive: 'view.dom_interactive',
      dom_content_loaded: 'view.dom_content_loaded',
      dom_complete: 'view.dom_complete',
      load_event: 'view.load_event',
      first_input_time: 'view.first_input_time',
      first_input_target_selector: 'view.first_input_target_selector',
      first_paint_time: 'view.fpt',
      interaction_to_next_paint: 'view.interaction_to_next_paint',
      interaction_to_next_paint_target_selector: 'view.interaction_to_next_paint_target_selector',
      resource_load_time: 'view.resource_load_time',
      time_to_interactive: 'view.tti',
      dom: 'view.dom',
      dom_ready: 'view.dom_ready',
      time_spent: 'view.time_spent',
      first_byte: 'view.first_byte',
      frustration_count: 'view.frustration.count',
      custom_timings: 'view.custom_timings'
    }
  },
  resource: {
    type: RumEventType.RESOURCE,
    tags: {
      trace_id: '_gc.trace_id',
      span_id: '_gc.span_id',
      resource_id: 'resource.id',
      resource_status: 'resource.status',
      resource_status_group: 'resource.status_group',
      resource_method: 'resource.method'
    },
    fields: {
      duration: 'resource.duration',
      resource_size: 'resource.size',
      resource_url: 'resource.url',
      resource_url_host: 'resource.url_host',
      resource_url_path: 'resource.url_path',
      resource_url_path_group: 'resource.url_path_group',
      resource_url_query: 'resource.url_query',
      resource_delivery_type: 'resource.delivery_type',
      resource_type: 'resource.type',
      resource_protocol: 'resource.protocol',
      resource_encode_size: 'resource.encoded_body_size',
      resource_decode_size: 'resource.decoded_body_size',
      resource_transfer_size: 'resource.transfer_size',
      resource_render_blocking_status: 'resource.render_blocking_status',
      resource_dns: 'resource.dns',
      resource_tcp: 'resource.tcp',
      resource_ssl: 'resource.ssl',
      resource_ttfb: 'resource.ttfb',
      resource_trans: 'resource.trans',
      resource_redirect: 'resource.redirect',
      resource_first_byte: 'resource.firstbyte',
      resource_dns_time: 'resource.dns_time',
      resource_download_time: 'resource.download_time',
      resource_first_byte_time: 'resource.first_byte_time',
      resource_connect_time: 'resource.connect_time',
      resource_ssl_time: 'resource.ssl_time',
      resource_redirect_time: 'resource.redirect_time'
    }
  },
  error: {
    type: RumEventType.ERROR,
    tags: {
      error_id: 'error.id',
      trace_id: '_gc.trace_id',
      span_id: '_gc.span_id',
      error_source: 'error.source',
      error_type: 'error.type',
      error_handling: 'error.handling'
      //   resource_url: 'error.resource.url',
      //   resource_url_host: 'error.resource.url_host',
      //   resource_url_path: 'error.resource.url_path',
      //   resource_url_path_group: 'error.resource.url_path_group',
      //   resource_status: 'error.resource.status',
      //   resource_status_group: 'error.resource.status_group',
      //   resource_method: 'error.resource.method'
    },
    fields: {
      error_message: ['string', 'error.message'],
      error_stack: ['string', 'error.stack'],
      error_causes: ['string', 'error.causes'],
      error_handling_stack: ['string', 'error.handling_stack']
    }
  },
  long_task: {
    type: RumEventType.LONG_TASK,
    tags: {
      long_task_id: 'long_task.id'
    },
    fields: {
      duration: 'long_task.duration',
      blocking_duration: 'long_task.blocking_duration',
      first_ui_event_timestamp: 'long_task.first_ui_event_timestamp',
      render_start: 'long_task.render_start',
      style_and_layout_start: 'long_task.style_and_layout_start',
      long_task_start_time: 'long_task.start_time',
      scripts: ['string', 'long_task.scripts']
    }
  },
  action: {
    type: RumEventType.ACTION,
    tags: {
      action_type: 'action.type'
    },
    fields: {
      action_name: 'action.target.name',
      duration: 'action.loading_time',
      action_error_count: 'action.error.count',
      action_resource_count: 'action.resource.count',
      action_frustration_types: 'action.frustration.type',
      action_long_task_count: 'action.long_task.count',
      action_target: '_gc.action.target',
      action_position: '_gc.action.position'
    }
  },
  telemetry: {
    type: 'telemetry',
    fields: {
      status: 'telemetry.status',
      message: ['string', 'telemetry.message'],
      type: 'telemetry.type',
      error_stack: ['string', 'telemetry.error.stack'],
      error_kind: ['string', 'telemetry.error.kind'],
      connectivity: ['string', 'telemetry.connectivity'],
      runtime_env: ['string', 'telemetry.runtime_env'],
      usage: ['string', 'telemetry.usage'],
      configuration: ['string', 'telemetry.configuration']
    }
  },
  browser_log: {
    type: RumEventType.LOGGER,
    tags: {
      error_source: 'error.source',
      error_type: 'error.type',
      error_resource_url: 'http.url',
      error_resource_url_host: 'http.url_host',
      error_resource_url_path: 'http.url_path',
      error_resource_url_path_group: 'http.url_path_group',
      error_resource_status: 'http.status_code',
      error_resource_status_group: 'http.status_group',
      error_resource_method: 'http.method',
      action_id: 'user_action.id',
      service: 'service',
      status: 'status'
    },
    fields: {
      message: ['string', 'message'],
      error_message: ['string', 'error.message'],
      error_stack: ['string', 'error.stack']
    }
  }
};
;// CONCATENATED MODULE: ../core/esm/session/sessionManagement.js








const VISIBILITY_CHECK_DELAY = ONE_MINUTE;
const SESSION_CONTEXT_TIMEOUT_DELAY = SESSION_TIME_OUT_DELAY;
let stopCallbacks = [];
function startSessionManager(configuration, productKey, computeSessionState) {
  const renewObservable = new Observable();
  const expireObservable = new Observable();
  const sessionStore = startSessionStore(configuration.sessionStoreStrategyType, productKey, computeSessionState);
  stopCallbacks.push(function () {
    return sessionStore.stop();
  });
  const sessionContextHistory = createValueHistory({
    expireDelay: SESSION_CONTEXT_TIMEOUT_DELAY
  });
  stopCallbacks.push(function () {
    return sessionContextHistory.stop();
  });
  sessionStore.renewObservable.subscribe(function () {
    sessionContextHistory.add(buildSessionContext(), tools_relativeNow());
    renewObservable.notify();
  });
  sessionStore.expireObservable.subscribe(function () {
    expireObservable.notify();
    sessionContextHistory.closeActive(tools_relativeNow());
  });

  // manager is started.
  sessionStore.expandOrRenewSession();
  sessionContextHistory.add(buildSessionContext(), clocksOrigin().relative);
  trackActivity(function () {
    sessionStore.expandOrRenewSession();
  });
  trackVisibility(function () {
    return sessionStore.expandSession();
  });
  trackResume(function () {
    sessionStore.restartSession();
  });
  function buildSessionContext() {
    const session = sessionStore.getSession();
    if (!session) {
      return {
        id: 'invalid',
        trackingType: SESSION_NOT_TRACKED,
        isSessionForced: false,
        hasError: false
      };
    }
    return {
      id: session.id,
      trackingType: session[productKey],
      hasError: !!session.hasError,
      isSessionForced: !!session.forcedSession
    };
  }
  return {
    findSession: function (startTime, options) {
      return sessionContextHistory.find(startTime, options);
    },
    renewObservable,
    expireObservable,
    sessionStateUpdateObservable: sessionStore.sessionStateUpdateObservable,
    expire: sessionStore.expire,
    updateSessionState: sessionStore.updateSessionState
  };
}
function stopSessionManager() {
  stopCallbacks.forEach(function (e) {
    e();
  });
  stopCallbacks = [];
}
function trackActivity(expandOrRenewSession) {
  const {
    stop
  } = addEventListeners(window, [DOM_EVENT.CLICK, DOM_EVENT.TOUCH_START, DOM_EVENT.KEY_DOWN, DOM_EVENT.SCROLL], expandOrRenewSession, {
    capture: true,
    passive: true
  });
  stopCallbacks.push(stop);
}
function trackVisibility(expandSession) {
  const expandSessionWhenVisible = function () {
    if (document.visibilityState === 'visible') {
      expandSession();
    }
  };
  const {
    stop
  } = addEventListener(document, DOM_EVENT.VISIBILITY_CHANGE, expandSessionWhenVisible);
  stopCallbacks.push(stop);
  const visibilityCheckInterval = timer_setInterval(expandSessionWhenVisible, VISIBILITY_CHECK_DELAY);
  stopCallbacks.push(function () {
    timer_clearInterval(visibilityCheckInterval);
  });
}
function trackResume(cb) {
  const {
    stop
  } = addEventListener(window, DOM_EVENT.RESUME, cb, {
    capture: true
  });
  stopCallbacks.push(stop);
}
;// CONCATENATED MODULE: ../core/esm/transport/sendWithRetryStrategy.js




var MAX_ONGOING_BYTES_COUNT = 80 * ONE_KIBI_BYTE;
var MAX_ONGOING_REQUESTS = 32;
var MAX_QUEUE_BYTES_COUNT = 20 * ONE_MEBI_BYTE;
var MAX_BACKOFF_TIME = 256 * ONE_SECOND;
var INITIAL_BACKOFF_TIME = ONE_SECOND;
var TransportStatus = {
  UP: 0,
  FAILURE_DETECTED: 1,
  DOWN: 2
};
var RetryReason = {
  AFTER_SUCCESS: 0,
  AFTER_RESUME: 1
};
function sendWithRetryStrategy(payload, state, sendStrategy, endpointUrl, reportError) {
  if (state.transportStatus === TransportStatus.UP && state.queuedPayloads.size() === 0 && state.bandwidthMonitor.canHandle(payload)) {
    send(payload, state, sendStrategy, {
      onSuccess: function () {
        return retryQueuedPayloads(RetryReason.AFTER_SUCCESS, state, sendStrategy, endpointUrl, reportError);
      },
      onFailure: function () {
        state.queuedPayloads.enqueue(payload);
        scheduleRetry(state, sendStrategy, endpointUrl, reportError);
      }
    });
  } else {
    state.queuedPayloads.enqueue(payload);
  }
}
function scheduleRetry(state, sendStrategy, endpointUrl, reportError) {
  if (state.transportStatus !== TransportStatus.DOWN) {
    return;
  }
  timer_setTimeout(function () {
    var payload = state.queuedPayloads.first();
    send(payload, state, sendStrategy, {
      onSuccess: function () {
        state.queuedPayloads.dequeue();
        state.currentBackoffTime = INITIAL_BACKOFF_TIME;
        retryQueuedPayloads(RetryReason.AFTER_RESUME, state, sendStrategy, endpointUrl, reportError);
      },
      onFailure: function () {
        state.currentBackoffTime = Math.min(MAX_BACKOFF_TIME, state.currentBackoffTime * 2);
        scheduleRetry(state, sendStrategy, endpointUrl, reportError);
      }
    });
  }, state.currentBackoffTime);
}
function send(payload, state, sendStrategy, responseData) {
  var onSuccess = responseData.onSuccess;
  var onFailure = responseData.onFailure;
  state.bandwidthMonitor.add(payload);
  sendStrategy(payload, function (response) {
    state.bandwidthMonitor.remove(payload);
    if (!shouldRetryRequest(response, state, payload)) {
      state.transportStatus = TransportStatus.UP;
      onSuccess();
    } else {
      // do not consider transport down if another ongoing request could succeed
      state.transportStatus = state.bandwidthMonitor.ongoingRequestCount > 0 ? TransportStatus.FAILURE_DETECTED : TransportStatus.DOWN;
      payload.retry = {
        count: payload.retry ? payload.retry.count + 1 : 1,
        lastFailureStatus: response.status
      };
      onFailure();
    }
  });
}
function retryQueuedPayloads(reason, state, sendStrategy, endpointUrl, reportError) {
  if (reason === RetryReason.AFTER_SUCCESS && state.queuedPayloads.isFull() && !state.queueFullReported) {
    reportError({
      message: 'Reached max ' + endpointUrl + ' events size queued for upload: ' + MAX_QUEUE_BYTES_COUNT / ONE_MEBI_BYTE + 'MiB',
      source: errorTools_ErrorSource.AGENT,
      startClocks: clocksNow()
    });
    state.queueFullReported = true;
  }
  var previousQueue = state.queuedPayloads;
  state.queuedPayloads = newPayloadQueue();
  while (previousQueue.size() > 0) {
    sendWithRetryStrategy(previousQueue.dequeue(), state, sendStrategy, endpointUrl, reportError);
  }
}
function shouldRetryRequest(response, state, payload) {
  if (state.retryMaxSize > -1 && payload.retry && payload.retry.count > state.retryMaxSize) return false;
  return response.type !== 'opaque' && (response.status === 0 && !navigator.onLine || response.status === 408 || response.status === 429 || response.status >= 500);
}
function newRetryState(retryMaxSize) {
  return {
    transportStatus: TransportStatus.UP,
    currentBackoffTime: INITIAL_BACKOFF_TIME,
    bandwidthMonitor: newBandwidthMonitor(),
    queuedPayloads: newPayloadQueue(),
    queueFullReported: false,
    retryMaxSize: retryMaxSize
  };
}
function newPayloadQueue() {
  var queue = [];
  return {
    bytesCount: 0,
    enqueue: function (payload) {
      if (this.isFull()) {
        return;
      }
      queue.push(payload);
      this.bytesCount += payload.bytesCount;
    },
    first: function () {
      return queue[0];
    },
    dequeue: function () {
      var payload = queue.shift();
      if (payload) {
        this.bytesCount -= payload.bytesCount;
      }
      return payload;
    },
    size: function () {
      return queue.length;
    },
    isFull: function () {
      return this.bytesCount >= MAX_QUEUE_BYTES_COUNT;
    }
  };
}
function newBandwidthMonitor() {
  return {
    ongoingRequestCount: 0,
    ongoingByteCount: 0,
    canHandle: function (payload) {
      return this.ongoingRequestCount === 0 || this.ongoingByteCount + payload.bytesCount <= MAX_ONGOING_BYTES_COUNT && this.ongoingRequestCount < MAX_ONGOING_REQUESTS;
    },
    add: function (payload) {
      this.ongoingRequestCount += 1;
      this.ongoingByteCount += payload.bytesCount;
    },
    remove: function (payload) {
      this.ongoingRequestCount -= 1;
      this.ongoingByteCount -= payload.bytesCount;
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/transport/httpRequest.js



// import { addTelemetryError } from '../telemetry/telemetry'
/**
 * Use POST request without content type to:
 * - avoid CORS preflight requests
 * - allow usage of sendBeacon
 *
 * multiple elements are sent separated by \n in order
 * to be parsed correctly without content type header
 */
function addBatchPrecision(url, encoding) {
  if (!url) return url;
  url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'precision=ms';
  if (encoding) {
    url = url + '&encoding=' + encoding;
  }
  return url;
}
function createHttpRequest(endpointUrl, bytesLimit, retryMaxSize, reportError) {
  if (retryMaxSize === undefined) {
    retryMaxSize = -1;
  }
  var retryState = newRetryState(retryMaxSize);
  var sendStrategyForRetry = function (payload, onResponse) {
    return fetchKeepAliveStrategy(endpointUrl, bytesLimit, payload, onResponse);
  };
  return {
    send: function (payload) {
      sendWithRetryStrategy(payload, retryState, sendStrategyForRetry, endpointUrl, reportError);
    },
    /**
     * Since fetch keepalive behaves like regular fetch on Firefox,
     * keep using sendBeaconStrategy on exit
     */
    sendOnExit: function (payload) {
      sendBeaconStrategy(endpointUrl, bytesLimit, payload);
    }
  };
}
function sendBeaconStrategy(endpointUrl, bytesLimit, payload) {
  var data = payload.data;
  var bytesCount = payload.bytesCount;
  var url = addBatchPrecision(endpointUrl, payload.encoding);
  var canUseBeacon = !!navigator.sendBeacon && bytesCount < bytesLimit;
  if (canUseBeacon) {
    try {
      var beaconData;
      if (payload.type) {
        beaconData = new Blob([data], {
          type: payload.type
        });
      } else {
        beaconData = data;
      }
      var isQueued = navigator.sendBeacon(url, beaconData);
      if (isQueued) {
        return;
      }
    } catch (e) {
      reportBeaconError(e);
    }
  }
  sendXHR(url, payload);
}
var hasReportedBeaconError = false;
function reportBeaconError(e) {
  if (!hasReportedBeaconError) {
    hasReportedBeaconError = true;
    // addTelemetryError(e)
  }
}
function fetchKeepAliveStrategy(endpointUrl, bytesLimit, payload, onResponse) {
  var data = payload.data;
  var bytesCount = payload.bytesCount;
  var url = addBatchPrecision(endpointUrl, payload.encoding);
  var canUseKeepAlive = isKeepAliveSupported() && bytesCount < bytesLimit;
  if (canUseKeepAlive) {
    var fetchOption = {
      method: 'POST',
      body: data,
      keepalive: true,
      mode: 'cors'
    };
    const headers = {
      'x-client-timestamp': Date.now().toString()
    };
    if (payload.type) {
      headers['Content-Type'] = payload.type;
    }
    fetchOption.headers = headers;
    fetch(url, fetchOption).then(monitor(function (response) {
      if (typeof onResponse === 'function') {
        onResponse({
          status: response.status,
          type: response.type
        });
      }
    })).catch(monitor(function () {
      fetchStrategy(url, payload, onResponse);
    }));
  } else {
    sendXHR(url, payload, onResponse);
  }
}
function isKeepAliveSupported() {
  // Request can throw, cf https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#errors
  try {
    return window.Request && 'keepalive' in new Request('http://a');
  } catch (_unused) {
    return false;
  }
}
function sendXHR(url, payload, onResponse) {
  const data = payload.data;
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  if (data instanceof Blob) {
    request.setRequestHeader('Content-Type', data.type);
  } else if (payload.type) {
    request.setRequestHeader('Content-Type', payload.type);
  }
  request.setRequestHeader('x-client-timestamp', Date.now().toString());
  addEventListener(request, 'loadend', function () {
    if (typeof onResponse === 'function') {
      onResponse({
        status: request.status
      });
    }
  }, {
    once: true
  });
  request.send(data);
}
function fetchStrategy(url, payload, onResponse) {
  const fetchOption = {
    method: 'POST',
    body: payload.data,
    keepalive: true,
    mode: 'cors'
  };
  const headers = {
    'x-client-timestamp': Date.now().toString()
  };
  if (payload.type) {
    headers['Content-Type'] = payload.type;
  }
  fetchOption.headers = headers;
  fetch(url, fetchOption).then(monitor(function (response) {
    if (typeof onResponse === 'function') {
      onResponse({
        status: response.status,
        type: response.type
      });
    }
  })).catch(monitor(function () {
    if (typeof onResponse === 'function') {
      onResponse({
        status: 0
      });
    }
  }));
}
;// CONCATENATED MODULE: ../core/esm/helper/serialisation/rowData.js


function escapeRowData(str) {
  if (typeof str === 'object' && str) {
    str = jsonStringify_jsonStringify(str);
  } else if (!isString(str)) {
    return str;
  }
  var reg = /[\s=,"]/g;
  return String(str).replace(reg, function (word) {
    return '\\' + word;
  });
}
function escapeJsonValue(value, isTag) {
  if (typeof value === 'object' && value) {
    value = jsonStringify_jsonStringify(value);
  } else if (isTag) {
    value = '' + value;
  }
  return value;
}
function escapeFieldValueStr(str) {
  return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}
function escapeRowField(value) {
  if (typeof value === 'object' && value) {
    return escapeFieldValueStr(jsonStringify_jsonStringify(value));
  } else if (isString(value)) {
    return escapeFieldValueStr(value);
  } else {
    return value;
  }
}
;// CONCATENATED MODULE: ../core/esm/transport/batch.js








// https://en.wikipedia.org/wiki/UTF-8
// eslint-disable-next-line no-control-regex
var CUSTOM_KEYS = 'custom_keys';
var processedMessageByDataMap = function (message) {
  if (!message || !message.type) return {
    rowStr: '',
    rowData: undefined
  };
  var rowData = {
    tags: {},
    fields: {}
  };
  var hasFileds = false;
  var rowStr = '';
  each(dataMap, function (value, key) {
    if (value.type === message.type) {
      rowStr += key + ',';
      rowData.measurement = key;
      var tagsStr = [];
      var tags = extend({}, commonTags, value.tags);
      var filterFileds = ['date', 'type', CUSTOM_KEYS];
      each(tags, function (value_path, _key) {
        var _value = findByPath(message, value_path);
        filterFileds.push(_key);
        if (_value || isNumber(_value)) {
          rowData.tags[_key] = escapeJsonValue(_value, true);
          tagsStr.push(escapeRowData(_key) + '=' + escapeRowData(_value));
        }
      });
      var fieldsStr = [];
      var fields = extend({}, commonFields, value.fields);
      each(fields, function (_value, _key) {
        if (isArray(_value) && _value.length === 2) {
          var value_path = _value[1];
          var _valueData = findByPath(message, value_path);
          filterFileds.push(_key);
          if (_valueData !== undefined && _valueData !== null) {
            rowData.fields[_key] = escapeJsonValue(_valueData);
            fieldsStr.push(escapeRowData(_key) + '=' + escapeRowField(_valueData));
          }
        } else if (isString(_value)) {
          var _valueData = findByPath(message, _value);
          filterFileds.push(_key);
          if (_valueData !== undefined && _valueData !== null) {
            rowData.fields[_key] = escapeJsonValue(_valueData);
            fieldsStr.push(escapeRowData(_key) + '=' + escapeRowField(_valueData));
          }
        }
      });
      if (message.context && isObject(message.context) && !isEmptyObject(message.context)) {
        var _tagKeys = [];
        each(message.context, function (_value, _key) {
          if (filterFileds.indexOf(_key) > -1) return;
          filterFileds.push(_key);
          if (_value !== undefined && _value !== null) {
            _tagKeys.push(_key);
            rowData.fields[_key] = escapeJsonValue(_value);
            fieldsStr.push(escapeRowData(_key) + '=' + escapeRowField(_value));
          }
        });
        if (_tagKeys.length) {
          rowData.fields[CUSTOM_KEYS] = escapeJsonValue(_tagKeys);
          fieldsStr.push(escapeRowData(CUSTOM_KEYS) + '=' + escapeRowField(_tagKeys));
        }
      }
      if (message.type === RumEventType.LOGGER) {
        each(message, function (value, key) {
          if (filterFileds.indexOf(key) === -1 && value !== undefined && value !== null) {
            rowData.fields[key] = escapeJsonValue(value);
            fieldsStr.push(escapeRowData(key) + '=' + escapeRowField(value));
          }
        });
      }
      if (tagsStr.length) {
        rowStr += tagsStr.join(',');
      }
      if (fieldsStr.length) {
        rowStr += ' ';
        rowStr += fieldsStr.join(',');
        hasFileds = true;
      }
      rowStr = rowStr + ' ' + message.date;
      rowData.time = message.date;
    }
  });
  return {
    rowStr: hasFileds ? rowStr : '',
    rowData: hasFileds ? rowData : undefined
  };
};
function createBatch(options) {
  var encoder = options.encoder;
  var request = options.request;
  var messageBytesLimit = options.messageBytesLimit;
  var sendContentTypeByJson = options.sendContentTypeByJson;
  var flushController = options.flushController;
  var upsertBuffer = {};
  var flushSubscription = flushController.flushObservable.subscribe(function (event) {
    flush(event);
  });
  function getMessageText(messages) {
    let isEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (sendContentTypeByJson) {
      if (isEmpty) {
        return '[' + messages.join(',');
      } else {
        return ',' + messages.join(',');
      }
    } else {
      if (isEmpty) {
        return messages.join('\n');
      } else {
        return '\n' + messages.join('\n');
      }
    }
  }
  function push(serializedMessage, estimatedMessageBytesCount, key) {
    flushController.notifyBeforeAddMessage(estimatedMessageBytesCount);
    if (key !== undefined) {
      upsertBuffer[key] = serializedMessage;
      flushController.notifyAfterAddMessage();
    } else {
      encoder.write(getMessageText([serializedMessage], encoder.isEmpty()), function (realMessageBytesCount) {
        flushController.notifyAfterAddMessage(realMessageBytesCount - estimatedMessageBytesCount);
      });
    }
  }
  function hasMessageFor(key) {
    return key !== undefined && upsertBuffer[key] !== undefined;
  }
  function remove(key) {
    var removedMessage = upsertBuffer[key];
    delete upsertBuffer[key];
    var messageBytesCount = encoder.estimateEncodedBytesCount(removedMessage);
    flushController.notifyAfterRemoveMessage(messageBytesCount);
  }
  function process(message) {
    var processedMessage = '';
    if (sendContentTypeByJson) {
      processedMessage = jsonStringify_jsonStringify(processedMessageByDataMap(message).rowData);
    } else {
      processedMessage = processedMessageByDataMap(message).rowStr;
    }
    return processedMessage;
  }
  function addOrUpdate(message, key) {
    const serializedMessage = process(message);
    const estimatedMessageBytesCount = encoder.estimateEncodedBytesCount(serializedMessage);
    if (estimatedMessageBytesCount >= messageBytesLimit) {
      display.warn("Discarded a message whose size was bigger than the maximum allowed size ".concat(messageBytesLimit, "KB."));
      return;
    }
    if (hasMessageFor(key)) {
      remove(key);
    }
    push(serializedMessage, estimatedMessageBytesCount, key);
  }
  function flush(event) {
    var upsertMessages = values(upsertBuffer).join(sendContentTypeByJson ? ',' : '\n');
    upsertBuffer = {};
    var isPageExit = isPageExitReason(event.reason);
    var send = isPageExit ? request.sendOnExit : request.send;
    if (isPageExit &&
    // Note: checking that the encoder is async is not strictly needed, but it's an optimization:
    // if the encoder is async we need to send two requests in some cases (one for encoded data
    // and the other for non-encoded data). But if it's not async, we don't have to worry about
    // it and always send a single request.
    encoder.isAsync) {
      var encoderResult = encoder.finishSync();

      // Send encoded messages
      if (encoderResult.outputBytesCount) {
        send(formatPayloadFromEncoder(encoderResult, sendContentTypeByJson));
      }
      // Send messages that are not yet encoded at this point
      var pendingMessages = [...encoderResult.pendingData, upsertMessages].filter(Boolean).join('\n');
      if (pendingMessages) {
        send({
          data: pendingMessages,
          bytesCount: computeBytesCount(pendingMessages)
        });
      }
    } else {
      if (upsertMessages) {
        var text = getMessageText([upsertMessages], encoder.isEmpty());
        if (sendContentTypeByJson) {
          text += ']';
        }
        encoder.write(text);
      } else {
        if (sendContentTypeByJson) {
          encoder.write(']');
        }
      }
      encoder.finish(function (encoderResult) {
        send(formatPayloadFromEncoder(encoderResult));
      });
    }
  }
  return {
    flushController: flushController,
    add: addOrUpdate,
    upsert: addOrUpdate,
    stop: flushSubscription.unsubscribe
  };
}
function formatPayloadFromEncoder(encoderResult, sendContentTypeByJson) {
  var data;
  if (typeof encoderResult.output === 'string') {
    data = encoderResult.output;
  } else {
    data = new Blob([encoderResult.output], {
      // This will set the 'Content-Type: text/plain' header. Reasoning:
      // * The intake rejects the request if there is no content type.
      // * The browser will issue CORS preflight requests if we set it to 'application/json', which
      // could induce higher intake load (and maybe has other impacts).
      // * Also it's not quite JSON, since we are concatenating multiple JSON objects separated by
      // new lines.
      type: 'text/plain'
    });
  }
  return {
    data: data,
    type: sendContentTypeByJson ? 'application/json;UTF-8' : undefined,
    bytesCount: encoderResult.outputBytesCount,
    encoding: encoderResult.encoding
  };
}
;// CONCATENATED MODULE: ../core/esm/transport/flushController.js



// type FlushReason = PageExitReason | 'duration_limit' | 'bytes_limit' | 'messages_limit' | 'session_expire'

/**
 * Returns a "flush controller", responsible of notifying when flushing a pool of pending data needs
 * to happen. The implementation is designed to support both synchronous and asynchronous usages,
 * but relies on invariants described in each method documentation to keep a coherent state.
 */
function createFlushController(_ref) {
  let {
    messagesLimit,
    bytesLimit,
    durationLimit,
    pageExitObservable,
    sessionExpireObservable
  } = _ref;
  var pageExitSubscription = pageExitObservable.subscribe(function (event) {
    return flush(event.reason);
  });
  var sessionExpireSubscription = sessionExpireObservable.subscribe(function () {
    return flush('session_expire');
  });
  var flushObservable = new Observable(function () {
    return function () {
      pageExitSubscription.unsubscribe();
      sessionExpireSubscription.unsubscribe();
    };
  });
  var currentBytesCount = 0;
  var currentMessagesCount = 0;
  function flush(flushReason) {
    if (currentMessagesCount === 0) {
      return;
    }
    var messagesCount = currentMessagesCount;
    var bytesCount = currentBytesCount;
    currentMessagesCount = 0;
    currentBytesCount = 0;
    cancelDurationLimitTimeout();
    flushObservable.notify({
      reason: flushReason,
      messagesCount: messagesCount,
      bytesCount: bytesCount
    });
  }
  var durationLimitTimeoutId;
  function scheduleDurationLimitTimeout() {
    if (durationLimitTimeoutId === undefined) {
      durationLimitTimeoutId = timer_setTimeout(function () {
        flush('duration_limit');
      }, durationLimit);
    }
  }
  function cancelDurationLimitTimeout() {
    timer_clearTimeout(durationLimitTimeoutId);
    durationLimitTimeoutId = undefined;
  }
  return {
    flushObservable: flushObservable,
    getMessagesCount: function () {
      return currentMessagesCount;
    },
    /**
     * Notifies that a message will be added to a pool of pending messages waiting to be flushed.
     *
     * This function needs to be called synchronously, right before adding the message, so no flush
     * event can happen after `notifyBeforeAddMessage` and before adding the message.
     */
    notifyBeforeAddMessage: function (estimatedMessageBytesCount) {
      if (currentBytesCount + estimatedMessageBytesCount >= bytesLimit) {
        flush('bytes_limit');
      }
      // Consider the message to be added now rather than in `notifyAfterAddMessage`, because if no
      // message was added yet and `notifyAfterAddMessage` is called asynchronously, we still want
      // to notify when a flush is needed (for example on page exit).
      currentMessagesCount += 1;
      currentBytesCount += estimatedMessageBytesCount;
      scheduleDurationLimitTimeout();
    },
    /**
     * Notifies that a message *was* added to a pool of pending messages waiting to be flushed.
     *
     * This function can be called asynchronously after the message was added, but in this case it
     * should not be called if a flush event occurred in between.
     */
    notifyAfterAddMessage: function (messageBytesCountDiff) {
      if (messageBytesCountDiff === undefined) {
        messageBytesCountDiff = 0;
      }
      currentBytesCount += messageBytesCountDiff;
      if (currentMessagesCount >= messagesLimit) {
        flush('messages_limit');
      } else if (currentBytesCount >= bytesLimit) {
        flush('bytes_limit');
      }
    },
    /**
     * Notifies that a message was removed from a pool of pending messages waiting to be flushed.
     *
     * This function needs to be called synchronously, right after removing the message, so no flush
     * event can happen after removing the message and before `notifyAfterRemoveMessage`.
     *
     * @param messageBytesCount: the message bytes count that was added to the pool. Should
     * correspond to the sum of bytes counts passed to `notifyBeforeAddMessage` and
     * `notifyAfterAddMessage`.
     */
    notifyAfterRemoveMessage: function (messageBytesCount) {
      currentBytesCount -= messageBytesCount;
      currentMessagesCount -= 1;
      if (currentMessagesCount === 0) {
        cancelDurationLimitTimeout();
      }
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/transport/startBatchWithReplica.js



function startBatchWithReplica(configuration, primary, reportError, pageExitObservable, sessionExpireObservable, batchFactoryImp) {
  if (batchFactoryImp === undefined) {
    batchFactoryImp = createBatch;
  }
  var primaryBatch = createBatchFromConfig(configuration, primary);
  function createBatchFromConfig(configuration, batchConfiguration) {
    return batchFactoryImp({
      encoder: batchConfiguration.encoder,
      request: createHttpRequest(batchConfiguration.endpoint, configuration.batchBytesLimit, configuration.retryMaxSize, reportError),
      flushController: createFlushController({
        messagesLimit: configuration.batchMessagesLimit,
        bytesLimit: configuration.batchBytesLimit,
        durationLimit: configuration.flushTimeout,
        pageExitObservable: pageExitObservable,
        sessionExpireObservable: sessionExpireObservable
      }),
      messageBytesLimit: configuration.messageBytesLimit,
      sendContentTypeByJson: configuration.sendContentTypeByJson
    });
  }
  return {
    flushObservable: primaryBatch.flushController.flushObservable,
    add: function (message) {
      primaryBatch.add(message);
    },
    upsert: function (message, key) {
      primaryBatch.upsert(message, key);
    },
    stop: function () {
      primaryBatch.stop();
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/transport/eventBridge.js

function getEventBridgeGlobal() {
  // return getGlobalObject().FTWebViewJavascriptBridge
  return null;
}
function getEventBridge() {
  var eventBridgeGlobal = getEventBridgeGlobal();
  if (!eventBridgeGlobal) {
    return;
  }

  // return {
  //   getCapabilities() {
  //     return JSON.parse(
  //       (eventBridgeGlobal.getCapabilities &&
  //         eventBridgeGlobal.getCapabilities()) ||
  //         '[]'
  //     )
  //   },
  //   getPrivacyLevel() {
  //     return (
  //       eventBridgeGlobal.getPrivacyLevel && eventBridgeGlobal.getPrivacyLevel()
  //     )
  //   },
  //   getAllowedWebViewHosts() {
  //     return JSON.parse(
  //       (eventBridgeGlobal.getAllowedWebViewHosts &&
  //         eventBridgeGlobal.getAllowedWebViewHosts()) ||
  //         '[]'
  //     )
  //   },
  //   send(eventType, event, viewId) {
  //     const view = viewId ? { id: viewId } : undefined
  //     eventBridgeGlobal.sendEvent(
  //       JSON.stringify({ name: eventType, data: event, view })
  //     )
  //   }
  // }
}
const BridgeCapability = {
  RECORDS: 'records'
};
function bridgeSupports(capability) {
  const bridge = getEventBridge();
  return !!bridge && bridge.getCapabilities().includes(capability);
}
function canUseEventBridge() {
  var _getGlobalObject$loca;
  let currentHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_getGlobalObject$loca = getGlobalObject().location) === null || _getGlobalObject$loca === void 0 ? void 0 : _getGlobalObject$loca.hostname;
  return false;
  // const eventBridgeGlobal = getEventBridgeGlobal()
  // if (
  //   eventBridgeGlobal &&
  //   eventBridgeGlobal.getAllowedWebViewHosts === undefined
  // ) {
  //   return true
  // }
  // if (
  //   eventBridgeGlobal &&
  //   eventBridgeGlobal.getAllowedWebViewHosts &&
  //   (eventBridgeGlobal.getAllowedWebViewHosts() === null ||
  //     eventBridgeGlobal.getAllowedWebViewHosts() === undefined)
  // ) {
  //   return true
  // }
  // var bridge = getEventBridge()
  // return (
  //   !!bridge &&
  //   bridge
  //     .getAllowedWebViewHosts()
  //     .some(
  //       (allowedHost) =>
  //         currentHost === allowedHost || currentHost.endsWith(`.${allowedHost}`)
  //     )
  // )
}
;// CONCATENATED MODULE: ../core/esm/transport/index.js





;// CONCATENATED MODULE: ../core/esm/synthetics/syntheticsWorkerValues.js

var SYNTHETICS_TEST_ID_COOKIE_NAME = 'guance-synthetics-public-id';
var SYNTHETICS_RESULT_ID_COOKIE_NAME = 'guance-synthetics-result-id';
var SYNTHETICS_INJECTS_RUM_COOKIE_NAME = 'guance-synthetics-injects-rum';
function willSyntheticsInjectRum() {
  return Boolean(window._GUANCE_SYNTHETICS_INJECTS_RUM || cookie_getCookie(SYNTHETICS_INJECTS_RUM_COOKIE_NAME));
}
function getSyntheticsTestId() {
  var value = window._GUANCE_SYNTHETICS_PUBLIC_ID || getCookie(SYNTHETICS_TEST_ID_COOKIE_NAME);
  return typeof value === 'string' ? value : undefined;
}
function getSyntheticsResultId() {
  var value = window._GUANCE_SYNTHETICS_RESULT_ID || getCookie(SYNTHETICS_RESULT_ID_COOKIE_NAME);
  return typeof value === 'string' ? value : undefined;
}
;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

;// CONCATENATED MODULE: ../../node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

;// CONCATENATED MODULE: ../core/esm/helper/serialisation/contextManager.js

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}




function ensureProperties(context, propertiesConfig, name) {
  const newContext = _objectSpread({}, context);
  for (const [key, {
    required,
    type
  }] of Object.entries(propertiesConfig)) {
    /**
     * Ensure specified properties are strings as defined here:
     */
    if (type === 'string' && key in newContext) {
      newContext[key] = String(newContext[key]);
    }
    if (required && !(key in context)) {
      display.warn("The property ".concat(key, " of ").concat(name, " context is required; context will not be sent to the intake."));
    }
  }
  return newContext;
}
function createContextManager() {
  let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let {
    customerDataTracker,
    propertiesConfig = {}
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let context = {};
  const changeObservable = new Observable();
  const contextManager = {
    getContext: () => deepClone(context),
    setContext: newContext => {
      if (getType(newContext) === 'object') {
        context = sanitize(ensureProperties(newContext, propertiesConfig, name));
        customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
      } else {
        contextManager.clearContext();
      }
      changeObservable.notify();
    },
    setContextProperty: (key, property) => {
      context[key] = sanitize(ensureProperties({
        [key]: property
      }, propertiesConfig, name)[key]);
      customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
      changeObservable.notify();
    },
    removeContextProperty: key => {
      delete context[key];
      customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
      ensureProperties(context, propertiesConfig, name);
      changeObservable.notify();
    },
    clearContext: () => {
      context = {};
      customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.resetCustomerData();
      changeObservable.notify();
    },
    changeObservable
  };
  return contextManager;
}
;// CONCATENATED MODULE: ../core/esm/helper/serialisation/const.js
// RUM and logs batch bytes limit is 16KB
// ensure that we leave room for other event attributes and maintain a decent amount of event per batch
// (3KB (customer data) + 1KB (other attributes)) * 4 (events per batch) = 16KB

var CustomerDataType = {
  FeatureFlag: 'feature flag evaluation',
  User: 'user',
  GlobalContext: 'global context',
  View: 'view'
};
;// CONCATENATED MODULE: ../core/esm/helper/serialisation/storedContextManager.js



var CONTEXT_STORE_KEY_PREFIX = '_gc_s';
var storageListeners = [];
function storeContextManager(configuration, contextManager, productKey, customerDataType) {
  var storageKey = buildStorageKey(configuration, productKey, customerDataType);
  storageListeners.push(addEventListener(window, DOM_EVENT.STORAGE, function (params) {
    if (storageKey === params.key) {
      synchronizeWithStorage();
    }
  }));
  contextManager.changeObservable.subscribe(dumpToStorage);
  contextManager.setContext(extend2Lev(getFromStorage(), contextManager.getContext()));
  function synchronizeWithStorage() {
    contextManager.setContext(getFromStorage());
  }
  function dumpToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(contextManager.getContext()));
  }
  function getFromStorage() {
    const rawContext = localStorage.getItem(storageKey);
    return rawContext !== null ? JSON.parse(rawContext) : {};
  }
  return contextManager;
}
function buildStorageKey(configuration, productKey, customerDataType) {
  // storeContextsKey
  if (configuration.storeContextsKey && isString(configuration.storeContextsKey)) {
    return CONTEXT_STORE_KEY_PREFIX + '_' + productKey + '_' + customerDataType + '_' + configuration.storeContextsKey;
  } else {
    return CONTEXT_STORE_KEY_PREFIX + '_' + productKey + '_' + customerDataType;
  }
}
function removeStorageListeners() {
  map(storageListeners, function (listener) {
    listener.stop();
  });
}
;// CONCATENATED MODULE: ../core/esm/helper/serialisation/customerDataTracker.js





// RUM and logs batch bytes limit is 16KB
// ensure that we leave room for other event attributes and maintain a decent amount of event per batch
// (3KB (customer data) + 1KB (other attributes)) * 4 (events per batch) = 16KB
const CUSTOMER_DATA_BYTES_LIMIT = 3 * ONE_KIBI_BYTE;

// We observed that the compression ratio is around 8 in general, but we also want to keep a margin
// because some data might not be compressed (ex: last view update on page exit). We chose 16KiB
// because it is also the limit of the 'batchBytesCount' that we use for RUM and Logs data, but this
// is a bit arbitrary.
const CUSTOMER_COMPRESSED_DATA_BYTES_LIMIT = 16 * ONE_KIBI_BYTE;
const BYTES_COMPUTATION_THROTTLING_DELAY = 200;
const CustomerDataCompressionStatus = {
  Unknown: 0,
  Enabled: 1,
  Disabled: 2
};
function createCustomerDataTrackerManager() {
  let compressionStatus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CustomerDataCompressionStatus.Disabled;
  const customerDataTrackers = new Map();
  let alreadyWarned = false;
  function checkCustomerDataLimit() {
    let initialBytesCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (alreadyWarned || compressionStatus === CustomerDataCompressionStatus.Unknown) {
      return;
    }
    const bytesCountLimit = compressionStatus === CustomerDataCompressionStatus.Disabled ? CUSTOMER_DATA_BYTES_LIMIT : CUSTOMER_COMPRESSED_DATA_BYTES_LIMIT;
    let bytesCount = initialBytesCount;
    customerDataTrackers.forEach(tracker => {
      bytesCount += tracker.getBytesCount();
    });
    if (bytesCount > bytesCountLimit) {
      displayCustomerDataLimitReachedWarning(bytesCountLimit);
      alreadyWarned = true;
    }
  }
  return {
    /**
     * Creates a detached tracker. The manager will not store a reference to that tracker, and the
     * bytes count will be counted independently from other detached trackers.
     *
     * This is particularly useful when we don't know when the tracker will be unused, so we don't
     * leak memory (ex: when used in Logger instances).
     */
    createDetachedTracker: () => {
      const tracker = createCustomerDataTracker(() => checkCustomerDataLimit(tracker.getBytesCount()));
      return tracker;
    },
    /**
     * Creates a tracker if it doesn't exist, and returns it.
     */
    getOrCreateTracker: type => {
      if (!customerDataTrackers.has(type)) {
        customerDataTrackers.set(type, createCustomerDataTracker(checkCustomerDataLimit));
      }
      return customerDataTrackers.get(type);
    },
    setCompressionStatus: newCompressionStatus => {
      if (compressionStatus === CustomerDataCompressionStatus.Unknown) {
        compressionStatus = newCompressionStatus;
        checkCustomerDataLimit();
      }
    },
    getCompressionStatus: () => compressionStatus,
    stop: () => {
      customerDataTrackers.forEach(tracker => tracker.stop());
      customerDataTrackers.clear();
    }
  };
}
function createCustomerDataTracker(checkCustomerDataLimit) {
  let bytesCountCache = 0;

  // Throttle the bytes computation to minimize the impact on performance.
  // Especially useful if the user call context APIs synchronously multiple times in a row
  const {
    throttled: computeBytesCountThrottled,
    cancel: cancelComputeBytesCount
  } = throttle(context => {
    bytesCountCache = computeBytesCount(jsonStringify_jsonStringify(context));
    checkCustomerDataLimit();
  }, BYTES_COMPUTATION_THROTTLING_DELAY);
  const resetBytesCount = () => {
    cancelComputeBytesCount();
    bytesCountCache = 0;
  };
  return {
    updateCustomerData: context => {
      if (isEmptyObject(context)) {
        resetBytesCount();
      } else {
        computeBytesCountThrottled(context);
      }
    },
    resetCustomerData: resetBytesCount,
    getBytesCount: () => bytesCountCache,
    stop: () => {
      cancelComputeBytesCount();
    }
  };
}
function displayCustomerDataLimitReachedWarning(bytesCountLimit) {
  display.warn("Customer data exceeds the recommended ".concat(bytesCountLimit / ONE_KIBI_BYTE, "KiB threshold."));
}
;// CONCATENATED MODULE: ../core/esm/helper/encoder.js

function createIdentityEncoder() {
  var output = '';
  var outputBytesCount = 0;
  return {
    isAsync: false,
    isEmpty: function () {
      return !output;
    },
    write: function (data, callback) {
      var additionalEncodedBytesCount = computeBytesCount(data);
      outputBytesCount += additionalEncodedBytesCount;
      output += data;
      if (callback) {
        callback(additionalEncodedBytesCount);
      }
    },
    finish: function (callback) {
      callback(this.finishSync());
    },
    finishSync: function () {
      var result = {
        output: output,
        outputBytesCount: outputBytesCount,
        rawBytesCount: outputBytesCount,
        pendingData: []
      };
      output = '';
      outputBytesCount = 0;
      return result;
    },
    estimateEncodedBytesCount: function (data) {
      return data.length;
    }
  };
}
;// CONCATENATED MODULE: ../core/esm/user/user.js



/**
 * Clone input data and ensure known user properties (id, name, email)
 * are strings, as defined here:
 */
function sanitizeUser(newUser) {
  // We shallow clone only to prevent mutation of user data.
  var user = tools_assign({}, newUser);
  var keys = ['id', 'name', 'email'];
  each(keys, function (key) {
    if (key in user) {
      user[key] = String(user[key]);
    }
  });
  return user;
}

/**
 * Simple check to ensure user is valid
 */
function checkUser(newUser) {
  var isValid = getType(newUser) === 'object';
  if (!isValid) {
    display.error('Unsupported user:', newUser);
  }
  return isValid;
}
;// CONCATENATED MODULE: ../core/esm/user/index.js

;// CONCATENATED MODULE: ../core/esm/helper/polyfills.js
// ie11 supports WeakMap but not WeakSet
var PLACEHOLDER = 1;
function polyfills_WeakSet(initialValues) {
  this.map = new WeakMap();
  if (initialValues) {
    initialValues.forEach(function (value) {
      this.map.set(value, PLACEHOLDER);
    });
  }
}
polyfills_WeakSet.prototype.add = function (value) {
  this.map.set(value, PLACEHOLDER);
  return this;
};
polyfills_WeakSet.prototype.delete = function (value) {
  return this.map.delete(value);
};
polyfills_WeakSet.prototype.has = function (value) {
  return this.map.has(value);
};
;// CONCATENATED MODULE: ../core/esm/helper/displayAlreadyInitializedError.js

function displayAlreadyInitializedError(sdkName, initConfiguration) {
  if (!initConfiguration.silentMultipleInit) {
    display.error(sdkName + ' is already initialized.');
  }
}
;// CONCATENATED MODULE: ../core/esm/index.js



















// export * from './helper/mobileUtil'








// export * from './configuration/remoteConfiguration'
























// export * from './telemetry/telemetry'



;// CONCATENATED MODULE: ./src/domain/rumSessionManager.js

var RUM_SESSION_KEY = 'rum';
var RumSessionPlan = {
  WITHOUT_SESSION_REPLAY: 1,
  WITH_SESSION_REPLAY: 2,
  WITH_ERROR_SESSION_REPLAY: 3
};
const ERROR_SESSION = '1';
var RumTrackingType = {
  NOT_TRACKED: SESSION_NOT_TRACKED,
  // Note: the "tracking type" value (stored in the session cookie) does not match the "session
  // plan" value (sent in RUM events). This is expected, and was done to keep retrocompatibility
  // with active sessions when upgrading the SDK.

  TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY: '1',
  TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY: '2',
  TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY: '3',
  TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY: '4',
  TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY: '5',
  TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY: '6'
};
function startRumSessionManager(configuration, lifeCycle) {
  var sessionManager = startSessionManager(configuration, RUM_SESSION_KEY, function (rawTrackingType) {
    return computeSessionState(configuration, rawTrackingType);
  });
  sessionManager.expireObservable.subscribe(function () {
    lifeCycle.notify(LifeCycleEventType.SESSION_EXPIRED);
  });
  sessionManager.renewObservable.subscribe(function () {
    lifeCycle.notify(LifeCycleEventType.SESSION_RENEWED);
  });
  sessionManager.sessionStateUpdateObservable.subscribe(_ref => {
    let {
      previousState,
      newState
    } = _ref;
    if (!previousState.hasError && newState.hasError) {
      const sessionEntity = sessionManager.findSession();
      if (sessionEntity) {
        sessionEntity.hasError = true;
        sessionEntity.ets = newState.ets || timeStampNow();
      }
    }
    if (!previousState.forcedSession && newState.forcedSession) {
      const sessionEntity = sessionManager.findSession();
      if (sessionEntity) {
        sessionEntity.isSessionForced = true;
      }
    }
  });
  return {
    findTrackedSession: function (startTime) {
      var session = sessionManager.findSession(startTime);
      if (!session) {
        return;
      }
      if (!isTypeTracked(session.trackingType) && !session.isSessionForced) {
        return;
      }
      const isErrorSession = session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY;
      let plan = RumSessionPlan.WITHOUT_SESSION_REPLAY;
      if (session.trackingType === RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY) {
        plan = RumSessionPlan.WITH_SESSION_REPLAY;
      } else if (session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY) {
        plan = RumSessionPlan.WITH_ERROR_SESSION_REPLAY;
      }
      return {
        id: session.id,
        plan: plan,
        errorSessionReplayAllowed: plan === RumSessionPlan.WITH_ERROR_SESSION_REPLAY,
        sessionHasError: session.hasError,
        isErrorSession: isErrorSession,
        sessionErrorTimestamp: session.ets,
        isSessionForced: session.isSessionForced,
        sessionReplayAllowed: plan === RumSessionPlan.WITH_SESSION_REPLAY || plan === RumSessionPlan.WITH_ERROR_SESSION_REPLAY || session.isSessionForced
      };
    },
    expire: sessionManager.expire,
    expireObservable: sessionManager.expireObservable,
    sessionStateUpdateObservable: sessionManager.sessionStateUpdateObservable,
    setErrorForSession: () => sessionManager.updateSessionState({
      hasError: '1',
      ets: timeStampNow()
    }),
    setForcedSession: () => {
      sessionManager.updateSessionState({
        forcedSession: '1'
      });
    }
  };
}

/**
 * Start a tracked replay session stub
 * It needs to be a premium plan in order to get long tasks
 */
function startRumSessionManagerStub() {
  // var session = {
  //   id: '00000000-aaaa-0000-aaaa-000000000000',
  //   isErrorSession: false,
  //   sessionErrorTimestamp: 0,
  //   sessionReplayAllowed: bridgeSupports(BridgeCapability.RECORDS)
  //     ? true
  //     : false,
  //   errorSessionReplayAllowed: false,
  //   sessionHasError: false,
  //   isSessionForced: false
  // }
  // return {
  //   findTrackedSession: function () {
  //     return session
  //   },
  //   expire: noop,
  //   expireObservable: new Observable(),
  //   setErrorForSession: function () {
  //     session.sessionErrorTimestamp = timeStampNow()
  //     session.sessionHasError = true
  //     session.isErrorSession = true
  //     session.errorSessionReplayAllowed = true
  //   },
  //   setForcedSession: noop
  // }
}
function computeSessionState(configuration, rawTrackingType) {
  const {
    sessionSampleRate,
    sessionOnErrorSampleRate,
    sessionReplaySampleRate,
    sessionReplayOnErrorSampleRate
  } = configuration;
  const isSession = performDraw(sessionSampleRate);
  const isErrorSession = performDraw(sessionOnErrorSampleRate);
  const isSessionReplay = performDraw(sessionReplaySampleRate);
  const isErrorSessionReplay = performDraw(sessionReplayOnErrorSampleRate);
  var trackingType;
  if (hasValidRumSession(rawTrackingType)) {
    trackingType = rawTrackingType;
  } else if (!isErrorSession && !isSession) {
    trackingType = RumTrackingType.NOT_TRACKED;
  } else if (isSession && isSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY;
  } else if (isSession && isErrorSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY;
  } else if (isSession && !isSessionReplay && !isErrorSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY;
  } else if (isErrorSession && isSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY;
  } else if (isErrorSession && isErrorSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY;
  } else if (isErrorSession && !isSessionReplay && !isErrorSessionReplay) {
    trackingType = RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY;
  }
  //   if (hasValidRumSession(rawTrackingType)) {
  //     trackingType = rawTrackingType
  //   } else if (
  //     !performDraw(configuration.sessionSampleRate) &&
  //     !performDraw(configuration.sessionOnErrorSampleRate)
  //   ) {
  //     trackingType = RumTrackingType.NOT_TRACKED
  //   } else if (
  //     !performDraw(configuration.sessionReplaySampleRate) &&
  //     !performDraw(configuration.sessionReplayOnErrorSampleRate)
  //   ) {
  //     trackingType = RumTrackingType.TRACKED_WITHOUT_SESSION_REPLAY
  //   } else if (performDraw(configuration.sessionReplayOnErrorSampleRate)) {
  //     trackingType = RumTrackingType.TRACKED_WITH_ERROR_SESSION_REPLAY
  //   } else {
  //     trackingType = RumTrackingType.TRACKED_WITH_SESSION_REPLAY
  //   }
  return {
    trackingType: trackingType,
    isTracked: isTypeTracked(trackingType)
  };
}
function hasValidRumSession(trackingType) {
  return trackingType === RumTrackingType.NOT_TRACKED || trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY || trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY || trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY || trackingType === RumTrackingType.TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY || trackingType === RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY || trackingType === RumTrackingType.TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY;
}
function isTypeTracked(rumSessionType) {
  return rumSessionType !== RumTrackingType.NOT_TRACKED;
}
;// CONCATENATED MODULE: ./src/domain/usr/index.js

var USR_ID_COOKIE_NAME = '_gc_usr_id';
var ANONYMOUS_ID_EXPIRATION = 60 * 24 * ONE_HOUR;
function initUsrCookie(cookieOptions) {
  var usrCacheId = cookie_getCookie(USR_ID_COOKIE_NAME, cookieOptions);
  if (!usrCacheId) {
    usrCacheId = UUID();
    setCookie(USR_ID_COOKIE_NAME, usrCacheId, ANONYMOUS_ID_EXPIRATION, cookieOptions);
  }
  return usrCacheId;
}
function initUsrLocalStorage() {
  var usrCacheId = localStorage.getItem(USR_ID_COOKIE_NAME);
  if (!usrCacheId) {
    usrCacheId = UUID();
    localStorage.setItem(USR_ID_COOKIE_NAME, usrCacheId);
  }
  return usrCacheId;
}
var startCacheUsrCache = function (configuration) {
  if (!configuration.sessionStoreStrategyType) {
    return {
      getId: tools_noop
    };
  }
  let usrCacheId;
  if (configuration.sessionStoreStrategyType.type === SessionPersistence.COOKIE) {
    usrCacheId = initUsrCookie(configuration.sessionStoreStrategyType.cookieOptions);
  } else {
    usrCacheId = initUsrLocalStorage();
  }
  return {
    getId: function () {
      return usrCacheId;
    }
  };
};
;// CONCATENATED MODULE: ./src/domain/domMutationObservable.js

function createDOMMutationObservable() {
  var MutationObserver = getMutationObserverConstructor();
  return new Observable(function (observable) {
    if (!MutationObserver) {
      return;
    }
    var observer = new MutationObserver(monitor(function () {
      return observable.notify();
    }));
    observer.observe(document, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
    return function () {
      return observer.disconnect();
    };
  });
}
function getMutationObserverConstructor() {
  var constructor;
  var browserWindow = window;

  // Angular uses Zone.js to provide a context persisting across async tasks.  Zone.js replaces the
  // global MutationObserver constructor with a patched version to support the context propagation.
  // There is an ongoing issue[1][2] with this setup when using a MutationObserver within a Angular
  // component: on some occasions, the callback is being called in an infinite loop, causing the
  // page to freeze (even if the callback is completely empty).
  //
  // To work around this issue, we try to get the original MutationObserver constructor stored by
  // Zone.js.
  //
  // [1] https://github.com/angular/angular/issues/26948
  // [2] https://github.com/angular/angular/issues/31712
  if (browserWindow.Zone) {
    // Zone.js 0.8.6+ is storing original class constructors into the browser 'window' object[3].
    //
    // [3] https://github.com/angular/angular/blob/6375fa79875c0fe7b815efc45940a6e6f5c9c9eb/packages/zone.js/lib/common/utils.ts#L288
    constructor = getZoneJsOriginalValue(browserWindow, 'MutationObserver');
    if (browserWindow.MutationObserver && constructor === browserWindow.MutationObserver) {
      // Anterior Zone.js versions (used in Angular 2) does not expose the original MutationObserver
      // in the 'window' object. Luckily, the patched MutationObserver class is storing an original
      // instance in its properties[4]. Let's get the original MutationObserver constructor from
      // there.
      //
      // [4] https://github.com/angular/zone.js/blob/v0.8.5/lib/common/utils.ts#L412

      var patchedInstance = new browserWindow.MutationObserver(tools_noop);
      var originalInstance = getZoneJsOriginalValue(patchedInstance, 'originalInstance');
      constructor = originalInstance && originalInstance.constructor;
    }
  }
  if (!constructor) {
    constructor = browserWindow.MutationObserver;
  }
  return constructor;
}
;// CONCATENATED MODULE: ./src/domain/locationChangeObservable.js

function createLocationChangeObservable(location) {
  var currentLocation = shallowClone(location);
  return new Observable(function (observable) {
    var _trackHistory = trackHistory(onLocationChange);
    var _trackHash = trackHash(onLocationChange);
    function onLocationChange() {
      if (currentLocation.href === location.href) {
        return;
      }
      var newLocation = shallowClone(location);
      observable.notify({
        newLocation: newLocation,
        oldLocation: currentLocation
      });
      currentLocation = newLocation;
    }
    return function () {
      _trackHistory.stop();
      _trackHash.stop();
    };
  });
}
function trackHistory(onHistoryChange) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  var pushState = instrumentMethod(getHistoryInstrumentationTarget('pushState'), 'pushState', function (params) {
    var onPostCall = params.onPostCall;
    onPostCall(onHistoryChange);
  });
  var replaceState = instrumentMethod(getHistoryInstrumentationTarget('replaceState'), 'replaceState', function (params) {
    var onPostCall = params.onPostCall;
    onPostCall(onHistoryChange);
  });
  var popState = addEventListener(window, DOM_EVENT.POP_STATE, onHistoryChange);
  return {
    stop: function () {
      pushState.stop();
      replaceState.stop();
      popState.stop();
    }
  };
}
function trackHash(onHashChange) {
  return addEventListener(window, DOM_EVENT.HASH_CHANGE, onHashChange);
}
function getHistoryInstrumentationTarget(methodName) {
  // Ideally we should always instument the method on the prototype, however some frameworks (e.g [Next.js](https://github.com/vercel/next.js/blob/d3f5532065f3e3bb84fb54bd2dfd1a16d0f03a21/packages/next/src/client/components/app-router.tsx#L429))
  // are wrapping the instance method. In that case we should also wrap the instance method.
  return Object.prototype.hasOwnProperty.call(history, methodName) ? history : History.prototype;
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/resource/resourceUtils.js

var FAKE_INITIAL_DOCUMENT = 'initial_document';
var RESOURCE_TYPES = [[ResourceType.DOCUMENT, function (initiatorType) {
  return FAKE_INITIAL_DOCUMENT === initiatorType;
}], [ResourceType.XHR, function (initiatorType) {
  return 'xmlhttprequest' === initiatorType;
}], [ResourceType.FETCH, function (initiatorType) {
  return 'fetch' === initiatorType;
}], [ResourceType.BEACON, function (initiatorType) {
  return 'beacon' === initiatorType;
}], [ResourceType.CSS, function (_, path) {
  return path.match(/\.css$/i) !== null;
}], [ResourceType.JS, function (_, path) {
  return path.match(/\.js$/i) !== null;
}], [ResourceType.IMAGE, function (initiatorType, path) {
  return includes(['image', 'img', 'icon'], initiatorType) || path.match(/\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i) !== null;
}], [ResourceType.FONT, function (_, path) {
  return path.match(/\.(woff|eot|woff2|ttf)$/i) !== null;
}], [ResourceType.MEDIA, function (initiatorType, path) {
  return includes(['audio', 'video'], initiatorType) || path.match(/\.(mp3|mp4)$/i) !== null;
}]];
function computeResourceEntryType(entry) {
  var url = entry.name;
  if (!isValidUrl(url)) {
    return ResourceType.OTHER;
  }
  var path = getPathName(url);
  var type = ResourceType.OTHER;
  each(RESOURCE_TYPES, function (res) {
    var _type = res[0],
      isType = res[1];
    if (isType(entry.initiatorType, path)) {
      type = _type;
      return false;
    }
  });
  return type;
}
function areInOrder() {
  var numbers = toArray(arguments);
  for (var i = 1; i < numbers.length; i += 1) {
    if (numbers[i - 1] > numbers[i]) {
      return false;
    }
  }
  return true;
}
/**
 * Handles the 'deliveryType' property to distinguish between supported values ('cache', 'navigational-prefetch'),
 * undefined (unsupported in some browsers), and other cases ('other' for unknown or unrecognized values).
 * see: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/deliveryType
 */
function computeResourceEntryDeliveryType(entry) {
  return entry.deliveryType === '' ? 'other' : entry.deliveryType;
}
/**
 * The 'nextHopProtocol' is an empty string for cross-origin resources without CORS headers,
 * meaning the protocol is unknown, and we shouldn't report it.
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/nextHopProtocol#cross-origin_resources
 */
function computeResourceEntryProtocol(entry) {
  return entry.nextHopProtocol === '' ? undefined : entry.nextHopProtocol;
}
function isResourceEntryRequestType(entry) {
  return entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch';
}
var resourceUtils_HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
function getStrSize(candidate) {
  if (!resourceUtils_HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
    return candidate.length;
  }
  if (window.TextEncoder !== undefined) {
    return new TextEncoder().encode(candidate).length;
  }
  return new Blob([candidate]).size;
}
function isResourceUrlLimit(name, limitSize) {
  return getStrSize(name) > limitSize;
}
function computeResourceEntryDuration(entry) {
  // Safari duration is always 0 on timings blocked by cross origin policies.
  if (entry.duration === 0 && entry.startTime < entry.responseEnd) {
    return msToNs(entry.responseEnd - entry.startTime);
  }
  return msToNs(entry.duration);
}
function is304(entry) {
  if (entry.encodedBodySize > 0 && entry.transferSize > 0 && entry.transferSize < entry.encodedBodySize) {
    return true;
  }

  // unknown
  return null;
}
function isCacheHit(entry) {
  // if we transferred bytes, it must not be a cache hit
  // (will return false for 304 Not Modified)
  if (entry.transferSize > 0) return false;

  // if the body size is non-zero, it must mean this is a
  // ResourceTiming2 browser, this was same-origin or TAO,
  // and transferSize was 0, so it was in the cache
  if (entry.decodedBodySize > 0) return true;

  // fall back to duration checking (non-RT2 or cross-origin)
  return entry.duration < 30;
}
function computePerformanceResourceDetails(entry) {
  if (!hasValidResourceEntryTimings(entry)) {
    return undefined;
  }
  var startTime = entry.startTime,
    fetchStart = entry.fetchStart,
    redirectStart = entry.redirectStart,
    redirectEnd = entry.redirectEnd,
    domainLookupStart = entry.domainLookupStart,
    domainLookupEnd = entry.domainLookupEnd,
    connectStart = entry.connectStart,
    secureConnectionStart = entry.secureConnectionStart,
    connectEnd = entry.connectEnd,
    requestStart = entry.requestStart,
    responseStart = entry.responseStart,
    responseEnd = entry.responseEnd;
  var details = {
    firstbyte: msToNs(responseStart - requestStart),
    trans: msToNs(responseEnd - responseStart),
    downloadTime: formatTiming(startTime, responseStart, responseEnd),
    firstByteTime: formatTiming(startTime, requestStart, responseStart)
  };
  if (responseStart > 0 && responseStart <= preferredNow()) {
    details.ttfb = msToNs(responseStart - requestStart);
  }
  // Make sure a connection occurred
  if (connectEnd !== fetchStart) {
    details.tcp = msToNs(connectEnd - connectStart);
    details.connectTime = formatTiming(startTime, connectStart, connectEnd);
    // Make sure a secure connection occurred
    if (areInOrder(connectStart, secureConnectionStart, connectEnd)) {
      details.ssl = msToNs(connectEnd - secureConnectionStart);
      details.sslTime = formatTiming(startTime, secureConnectionStart, connectEnd);
    }
  }

  // Make sure a domain lookup occurred
  if (domainLookupEnd !== fetchStart) {
    details.dns = msToNs(domainLookupEnd - domainLookupStart);
    details.dnsTime = formatTiming(startTime, domainLookupStart, domainLookupEnd);
  }
  if (hasRedirection(entry)) {
    details.redirect = msToNs(redirectEnd - redirectStart);
    details.redirectTime = formatTiming(startTime, redirectStart, redirectEnd);
  }
  // renderBlockstatus
  if (entry.renderBlockingStatus) {
    details.renderBlockingStatus = entry.renderBlockingStatus;
  }
  return details;
}
function hasValidResourceEntryDuration(entry) {
  return entry.duration >= 0;
}
function hasValidResourceEntryTimings(entry) {
  var areCommonTimingsInOrder = areInOrder(entry.startTime, entry.fetchStart, entry.domainLookupStart, entry.domainLookupEnd, entry.connectStart, entry.connectEnd, entry.requestStart, entry.responseStart, entry.responseEnd);
  var areRedirectionTimingsInOrder = hasRedirection(entry) ? areInOrder(entry.startTime, entry.redirectStart, entry.redirectEnd, entry.fetchStart) : true;
  return areCommonTimingsInOrder && areRedirectionTimingsInOrder;
}
function hasRedirection(entry) {
  return entry.redirectEnd > entry.startTime;
}
function formatTiming(origin, start, end) {
  return {
    duration: msToNs(end - start),
    start: msToNs(start - origin)
  };
}
function computeResourceEntrySize(entry) {
  // Make sure a request actually occurred
  if (entry.startTime < entry.responseStart) {
    return {
      size: entry.decodedBodySize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
      transferSize: entry.transferSize
    };
    // return {
    //   size: entry.decodedBodySize,
    //   encodeSize:
    //     Number.MAX_SAFE_INTEGER < entry.encodedBodySize
    //       ? 0
    //       : entry.encodedBodySize // max safe interger
    // }
  }
  return {
    size: undefined,
    encodedBodySize: undefined,
    decodedBodySize: undefined,
    transferSize: undefined
  };
}
function isAllowedRequestUrl(configuration, url) {
  return url && !isIntakeRequest(url, configuration);
}
var DATA_URL_REGEX = /data:(.+)?(;base64)?,/g;
var MAX_ATTRIBUTE_VALUE_CHAR_LENGTH = 24000;
function isLongDataUrl(url) {
  if (url.length <= MAX_ATTRIBUTE_VALUE_CHAR_LENGTH) {
    return false;
  } else if (url.substring(0, 5) === 'data:') {
    // Avoid String.match RangeError: Maximum call stack size exceeded
    url = url.substring(0, MAX_ATTRIBUTE_VALUE_CHAR_LENGTH);
    return true;
  }
  return false;
}
function sanitizeDataUrl(url) {
  return url.match(DATA_URL_REGEX)[0] + '[...]';
}
;// CONCATENATED MODULE: ./src/domain/firstInputPolyfill.js

/**
 * first-input timing entry polyfill based on
 * https://github.com/GoogleChrome/web-vitals/blob/master/src/lib/polyfills/firstInputPolyfill.ts
 */
function retrieveFirstInputTiming(configuration, callback) {
  var startTimeStamp = dateNow();
  var timingSent = false;
  var _addEventListeners = addEventListeners(window, [DOM_EVENT.CLICK, DOM_EVENT.MOUSE_DOWN, DOM_EVENT.KEY_DOWN, DOM_EVENT.TOUCH_START, DOM_EVENT.POINTER_DOWN], function (evt) {
    // Only count cancelable events, which should trigger behavior important to the user.
    if (!evt.cancelable) {
      return;
    }

    // This timing will be used to compute the "first Input delay", which is the delta between
    // when the system received the event (e.g. evt.timeStamp) and when it could run the callback
    // (e.g. performance.now()).
    var timing = {
      entryType: 'first-input',
      processingStart: tools_relativeNow(),
      processingEnd: tools_relativeNow(),
      startTime: evt.timeStamp,
      duration: 0,
      // arbitrary value to avoid nullable duration and simplify INP logic
      name: '',
      cancelable: false,
      target: null,
      toJSON: function () {
        return {};
      }
    };
    if (evt.type === DOM_EVENT.POINTER_DOWN) {
      sendTimingIfPointerIsNotCancelled(timing);
    } else {
      sendTiming(timing);
    }
  }, {
    passive: true,
    capture: true
  });
  var removeEventListeners = _addEventListeners.stop;
  return {
    stop: removeEventListeners
  };

  /**
   * Pointer events are a special case, because they can trigger main or compositor thread behavior.
   * We differentiate these cases based on whether or not we see a pointercancel event, which are
   * fired when we scroll. If we're scrolling we don't need to report input delay since FID excludes
   * scrolling and pinch/zooming.
   */
  function sendTimingIfPointerIsNotCancelled(timing) {
    addEventListeners(window, [DOM_EVENT.POINTER_UP, DOM_EVENT.POINTER_CANCEL], function (event) {
      if (event.type === DOM_EVENT.POINTER_UP) {
        sendTiming(timing);
      }
    }, {
      once: true
    });
  }
  function sendTiming(timing) {
    if (!timingSent) {
      timingSent = true;
      removeEventListeners();
      // In some cases the recorded delay is clearly wrong, e.g. it's negative or it's larger than
      // the time between now and when the page was loaded.
      // - https://github.com/GoogleChromeLabs/first-input-delay/issues/4
      // - https://github.com/GoogleChromeLabs/first-input-delay/issues/6
      // - https://github.com/GoogleChromeLabs/first-input-delay/issues/7
      var delay = timing.processingStart - timing.startTime;
      if (delay >= 0 && delay < dateNow() - startTimeStamp) {
        callback(timing);
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/domain/performanceObservable.js



// We want to use a real enum (i.e. not a const enum) here, to be able to check whether an arbitrary
// string is an expected performance entry
// eslint-disable-next-line no-restricted-syntax
var RumPerformanceEntryType = {
  EVENT: 'event',
  FIRST_INPUT: 'first-input',
  LARGEST_CONTENTFUL_PAINT: 'largest-contentful-paint',
  LAYOUT_SHIFT: 'layout-shift',
  LONG_TASK: 'longtask',
  LONG_ANIMATION_FRAME: 'long-animation-frame',
  NAVIGATION: 'navigation',
  PAINT: 'paint',
  RESOURCE: 'resource',
  VISIBILITY_STATE: 'visibility-state'
};
function createPerformanceObservable(configuration, options) {
  return new Observable(function (observable) {
    if (!window.PerformanceObserver) {
      return;
    }
    var handlePerformanceEntries = function (entries) {
      var rumPerformanceEntries = filterRumPerformanceEntries(configuration, entries);
      if (rumPerformanceEntries.length > 0) {
        observable.notify(rumPerformanceEntries);
      }
    };
    var timeoutId;
    var isObserverInitializing = true;
    const observer = new PerformanceObserver(monitor(function (entries) {
      // In Safari the performance observer callback is synchronous.
      // Because the buffered performance entry list can be quite large we delay the computation to prevent the SDK from blocking the main thread on init
      if (isObserverInitializing) {
        timeoutId = timer_setTimeout(function () {
          handlePerformanceEntries(entries.getEntries());
        });
      } else {
        handlePerformanceEntries(entries.getEntries());
      }
    }));
    try {
      observer.observe(options);
    } catch (_unused) {
      // Some old browser versions (<= chrome 74 ) don't support the PerformanceObserver type and buffered options
      // In these cases, fallback to getEntriesByType and PerformanceObserver with entryTypes
      // TODO: remove this fallback in the next major version
      var fallbackSupportedEntryTypes = [RumPerformanceEntryType.RESOURCE, RumPerformanceEntryType.NAVIGATION, RumPerformanceEntryType.LONG_TASK, RumPerformanceEntryType.PAINT];
      if (includes(fallbackSupportedEntryTypes, options.type)) {
        if (options.buffered) {
          timeoutId = timer_setTimeout(function () {
            handlePerformanceEntries(performance.getEntriesByType(options.type));
          });
        }
        try {
          observer.observe({
            entryTypes: [options.type]
          });
        } catch (_unused2) {
          // Old versions of Safari are throwing "entryTypes contained only unsupported types"
          // errors when observing only unsupported entry types.
          //
          // We could use `supportPerformanceTimingEvent` to make sure we don't invoke
          // `observer.observe` with an unsupported entry type, but Safari 11 and 12 don't support
          // `Performance.supportedEntryTypes`, so doing so would lose support for these versions
          // even if they do support the entry type.
          return;
        }
      }
    }
    isObserverInitializing = false;
    manageResourceTimingBufferFull(configuration);
    var stopFirstInputTiming;
    if (!supportPerformanceTimingEvent(RumPerformanceEntryType.FIRST_INPUT) && options.type === RumPerformanceEntryType.FIRST_INPUT) {
      var _retrieveFirstInputTiming = retrieveFirstInputTiming(configuration, function (timing) {
        handlePerformanceEntries([timing]);
      });
      stopFirstInputTiming = _retrieveFirstInputTiming.stop;
    }
    return function () {
      observer.disconnect();
      if (stopFirstInputTiming) {
        stopFirstInputTiming();
      }
      timer_clearTimeout(timeoutId);
    };
  });
}
var resourceTimingBufferFullListener;
function manageResourceTimingBufferFull(configuration) {
  if (!resourceTimingBufferFullListener && supportPerformanceObject() && 'addEventListener' in performance) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1559377
    resourceTimingBufferFullListener = addEventListener(performance, 'resourcetimingbufferfull', function () {
      performance.clearResourceTimings();
    });
  }
  return function () {
    resourceTimingBufferFullListener && resourceTimingBufferFullListener.stop();
  };
}
function supportPerformanceObject() {
  return window.performance !== undefined && 'getEntries' in performance;
}
function supportPerformanceTimingEvent(entryType) {
  return window.PerformanceObserver && PerformanceObserver.supportedEntryTypes !== undefined && PerformanceObserver.supportedEntryTypes.includes(entryType);
}
function filterRumPerformanceEntries(configuration, entries) {
  return entries.filter(function (entry) {
    return !isForbiddenResource(configuration, entry);
  });
}
function isForbiddenResource(configuration, entry) {
  return entry.entryType === RumPerformanceEntryType.RESOURCE && (!isAllowedRequestUrl(configuration, entry.name) || !hasValidResourceEntryDuration(entry));
}
;// CONCATENATED MODULE: ./src/domain/contexts/pageStateHistory.js


// Arbitrary value to cap number of element for memory consumption in the browser
var MAX_PAGE_STATE_ENTRIES = 4000;
// Arbitrary value to cap number of element for backend & to save bandwidth
var MAX_PAGE_STATE_ENTRIES_SELECTABLE = 500;
var PAGE_STATE_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
var PageState = {
  ACTIVE: 'active',
  PASSIVE: 'passive',
  HIDDEN: 'hidden',
  FROZEN: 'frozen',
  TERMINATED: 'terminated'
};
function startPageStateHistory(maxPageStateEntriesSelectable) {
  if (maxPageStateEntriesSelectable === undefined) {
    maxPageStateEntriesSelectable = MAX_PAGE_STATE_ENTRIES_SELECTABLE;
  }
  var pageStateEntryHistory = createValueHistory({
    expireDelay: PAGE_STATE_CONTEXT_TIME_OUT_DELAY,
    maxEntries: MAX_PAGE_STATE_ENTRIES
  });
  var currentPageState;
  if (supportPerformanceTimingEvent(RumPerformanceEntryType.VISIBILITY_STATE)) {
    const visibilityEntries = performance.getEntriesByType(RumPerformanceEntryType.VISIBILITY_STATE);
    visibilityEntries.forEach(entry => {
      const state = entry.name === 'hidden' ? PageState.HIDDEN : PageState.ACTIVE;
      addPageState(state, entry.startTime);
    });
  }
  addPageState(getPageState(), tools_relativeNow());
  var _addEventListeners = addEventListeners(window, [DOM_EVENT.PAGE_SHOW, DOM_EVENT.FOCUS, DOM_EVENT.BLUR, DOM_EVENT.VISIBILITY_CHANGE, DOM_EVENT.RESUME, DOM_EVENT.FREEZE, DOM_EVENT.PAGE_HIDE], function (event) {
    // Only get events fired by the browser to avoid false currentPageState changes done with custom events
    addPageState(computePageState(event), event.timeStamp);
  }, {
    capture: true
  });
  var stopEventListeners = _addEventListeners.stop;
  function addPageState(nextPageState, startTime) {
    if (startTime === undefined) {
      startTime = tools_relativeNow();
    }
    if (nextPageState === currentPageState) {
      return;
    }
    currentPageState = nextPageState;
    pageStateEntryHistory.closeActive(startTime);
    pageStateEntryHistory.add({
      state: currentPageState,
      startTime: startTime
    }, startTime);
  }
  const pageStateHistory = {
    findAll: function (startTime, duration) {
      var pageStateEntries = pageStateEntryHistory.findAll(startTime, duration);
      return processPageStates(pageStateEntries, startTime, maxPageStateEntriesSelectable);
    },
    wasInPageStateAt: function (state, startTime) {
      return pageStateHistory.wasInPageStateDuringPeriod(state, startTime, 0);
    },
    wasInPageStateDuringPeriod: function (state, startTime, duration) {
      return pageStateEntryHistory.findAll(startTime, duration).some(function (pageState) {
        return pageState.state === state;
      });
    },
    addPageState: addPageState,
    stop: function () {
      stopEventListeners();
      pageStateEntryHistory.stop();
    }
  };
  return pageStateHistory;
}
function processPageStates(pageStateEntries, eventStartTime, maxPageStateEntriesSelectable) {
  if (pageStateEntries.length === 0) {
    return;
  }
  return pageStateEntries.slice(-maxPageStateEntriesSelectable).reverse().map(_ref => {
    let {
      state,
      startTime
    } = _ref;
    return {
      state,
      start: toServerDuration(tools_elapsed(eventStartTime, startTime))
    };
  });
}
function computePageState(event) {
  if (event.type === DOM_EVENT.FREEZE) {
    return PageState.FROZEN;
  } else if (event.type === DOM_EVENT.PAGE_HIDE) {
    return event.persisted ? PageState.FROZEN : PageState.TERMINATED;
  }
  return getPageState();
}
function getPageState() {
  if (document.visibilityState === 'hidden') {
    return PageState.HIDDEN;
  }
  if (document.hasFocus()) {
    return PageState.ACTIVE;
  }
  return PageState.PASSIVE;
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/actions/actionCollection.js

// import { trackClickActions } from './trackClickActions'

function startActionCollection(lifeCycle, domMutationObservable, configuration, pageStateHistory) {
  lifeCycle.subscribe(LifeCycleEventType.AUTO_ACTION_COMPLETED, function (action) {
    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processAction(action, pageStateHistory));
  });
  var actionContexts = {
    findActionId: tools_noop,
    findAllActionId: tools_noop
  };
  // if (configuration.trackUserInteractions) {
  //   actionContexts = trackClickActions(
  //     lifeCycle,
  //     domMutationObservable,
  //     configuration
  //   ).actionContexts
  // }
  return {
    actionContexts: actionContexts,
    addAction: function (action, savedCommonContext) {
      lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, extend({
        savedCommonContext: savedCommonContext
      }, processAction(action, pageStateHistory)));
    }
  };
}
function processAction(action, pageStateHistory) {
  var _action$context;
  var autoActionProperties = isAutoAction(action) ? {
    action: {
      error: {
        count: action.counts.errorCount
      },
      id: action.id,
      loadingTime: discardNegativeDuration(toServerDuration(action.duration)),
      frustration: {
        type: action.frustrationTypes
      },
      long_task: {
        count: action.counts.longTaskCount
      },
      resource: {
        count: action.counts.resourceCount
      }
    },
    _gc: {
      action: {
        target: action.target,
        position: action.position
      }
    }
  } : {
    action: {
      loadingTime: ((_action$context = action.context) === null || _action$context === void 0 ? void 0 : _action$context.duration) || 0
    }
  };
  var customerContext = !isAutoAction(action) ? action.context : undefined;
  var actionEvent = extend2Lev({
    action: {
      id: UUID(),
      target: {
        name: action.name
      },
      type: action.type
    },
    date: action.startClocks.timeStamp,
    type: RumEventType.ACTION,
    view: {
      in_foreground: pageStateHistory.wasInPageStateAt(PageState.ACTIVE, action.startClocks.relative)
    }
  }, autoActionProperties);
  return {
    customerContext: customerContext,
    rawRumEvent: actionEvent,
    startTime: action.startClocks.relative,
    domainContext: isAutoAction(action) ? {
      event: action.event,
      events: action.events
    } : {}
  };
}
function isAutoAction(action) {
  return action.type === ActionType.CLICK;
  //   return action.type !== ActionType.CUSTOM
}
;// CONCATENATED MODULE: ./src/transport/startRumBatch.js

// import { DeflateEncoderStreamId } from '../domain/deflate'
function startRumBatch(configuration, lifeCycle, telemetryEventObservable, reportError, pageExitObservable, sessionExpireObservable, createEncoder) {
  const batch = startBatchWithReplica(configuration, {
    endpoint: configuration.rumEndpoint,
    encoder: createEncoder(2) // DeflateEncoderStreamId.RUM
  }, reportError, pageExitObservable, sessionExpireObservable);
  lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_COLLECTED, function (serverRumEvent) {
    // NOTE: upsert 和 add 其实是同一个方法；只是 upsert 会根据 key 来覆盖之前的内容
    if (serverRumEvent.type === RumEventType.VIEW) {
      batch.upsert(serverRumEvent, serverRumEvent.view.id);
    } else {
      batch.add(serverRumEvent);
    }
  });
  // telemetryEventObservable.subscribe(function (event) {
  //   batch.add(event)
  // })
  return batch;
}
;// CONCATENATED MODULE: ./src/domain/assembly.js

function assembly_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function assembly_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? assembly_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : assembly_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

var SessionType = {
  SYNTHETICS: 'synthetics',
  USER: 'user'
};
var VIEW_MODIFIABLE_FIELD_PATHS = {
  'view.url': 'string',
  'view.referrer': 'string'
};
var USER_CUSTOMIZABLE_FIELD_PATHS = {
  context: 'object'
};
const ROOT_MODIFIABLE_FIELD_PATHS = {
  service: 'string',
  version: 'string'
};
var modifiableFieldPathsByEvent = {};
function startRumAssembly(configuration, lifeCycle, sessionManager, userSessionManager, viewContexts, urlContexts, actionContexts, displayContext, getCommonContext, reportError) {
  modifiableFieldPathsByEvent[RumEventType.VIEW] = assembly_objectSpread(assembly_objectSpread({}, USER_CUSTOMIZABLE_FIELD_PATHS), VIEW_MODIFIABLE_FIELD_PATHS);
  modifiableFieldPathsByEvent[RumEventType.ERROR] = tools_assign({
    'error.message': 'string',
    'error.stack': 'string',
    'error.resource.url': 'string'
  }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
  modifiableFieldPathsByEvent[RumEventType.RESOURCE] = tools_assign({
    'resource.url': 'string'
  }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
  modifiableFieldPathsByEvent[RumEventType.ACTION] = tools_assign({
    'action.target.name': 'string'
  }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
  modifiableFieldPathsByEvent[RumEventType.LONG_TASK] = tools_assign({}, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS);
  var eventRateLimiters = {};
  eventRateLimiters[RumEventType.ERROR] = createEventRateLimiter(RumEventType.ERROR, configuration.eventRateLimiterThreshold, reportError);
  eventRateLimiters[RumEventType.ACTION] = createEventRateLimiter(RumEventType.ACTION, configuration.eventRateLimiterThreshold, reportError);
  lifeCycle.subscribe(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, function (data) {
    var startTime = data.startTime;
    var rawRumEvent = data.rawRumEvent;
    var savedCommonContext = data.savedCommonContext;
    var customerContext = data.customerContext;
    var domainContext = data.domainContext;
    var viewContext = viewContexts.findView(startTime);
    var urlContext = urlContexts.findUrl(startTime);
    var session = sessionManager.findTrackedSession(startTime);
    if (session && session.isErrorSession && !session.sessionHasError) return;
    if (session && viewContext && urlContext) {
      var actionId = actionContexts.findActionId(startTime);
      var actionIds = actionContexts.findAllActionId(startTime);
      var commonContext = savedCommonContext || getCommonContext();
      var rumContext = {
        _gc: {
          sdkName: configuration.sdkName,
          sdkVersion: configuration.sdkVersion,
          drift: currentDrift(),
          configuration: {
            session_sample_rate: round(configuration.sessionSampleRate, 3),
            session_replay_sample_rate: round(configuration.sessionReplaySampleRate, 3),
            session_on_error_sample_rate: round(configuration.sessionOnErrorSampleRate, 3),
            session_replay_on_error_sample_rate: round(configuration.sessionReplayOnErrorSampleRate, 3)
          }
        },
        terminal: {
          type: 'web'
        },
        application: {
          id: configuration.applicationId
        },
        device: deviceInfo,
        webview: {},
        env: configuration.env || '',
        service: viewContext.service || configuration.service || 'browser',
        version: viewContext.version || configuration.version || '',
        source: 'browser',
        date: timeStampNow(),
        user: {
          id: userSessionManager.getId(),
          is_signin: 'F',
          is_login: false
        },
        session: {
          // must be computed on each event because synthetics instrumentation can be done after sdk execution
          // cf https://github.com/puppeteer/puppeteer/issues/3667
          type: getSessionType(),
          id: session.id,
          is_forced_session: session.isSessionForced
        },
        view: {
          id: viewContext.id,
          name: viewContext.name || urlContext.path,
          url: urlContext.url,
          referrer: urlContext.referrer,
          host: urlContext.host,
          path: urlContext.path,
          pathGroup: urlContext.pathGroup,
          pathname: urlContext.pathname,
          urlQuery: urlContext.urlQuery
        },
        action: needToAssembleWithAction(rawRumEvent) && actionId ? {
          id: actionId,
          ids: actionIds
        } : undefined,
        display: displayContext.get()
      };
      var rumEvent = extend2Lev(rumContext, viewContext, rawRumEvent);
      var serverRumEvent = withSnakeCaseKeys(rumEvent);
      var context = extend2Lev({}, commonContext.context, viewContext.context, customerContext);
      if (!isEmptyObject(context)) {
        serverRumEvent.context = context;
      }
      if (!('has_replay' in serverRumEvent.session)) {
        serverRumEvent.session.has_replay = commonContext.hasReplay;
      }
      if (session.errorSessionReplayAllowed) {
        serverRumEvent.session.has_replay = serverRumEvent.session.has_replay && session.sessionHasError;
      }
      if (serverRumEvent.type === 'view') {
        serverRumEvent.session.sampled_for_error_replay = session.errorSessionReplayAllowed;
        serverRumEvent.session.sampled_for_error_session = session.isErrorSession;
        serverRumEvent.session.error_timestamp_for_session = session.sessionErrorTimestamp;
      }
      if (!isEmptyObject(commonContext.context.device)) {
        serverRumEvent.device = extend2Lev(serverRumEvent.device, commonContext.context.device);
      }
      if (!isEmptyObject(commonContext.context.webview)) {
        serverRumEvent.webview = extend2Lev(serverRumEvent.webview, commonContext.context.webview);
      }
      if (!isEmptyObject(commonContext.user)) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        serverRumEvent.user = extend2Lev(serverRumEvent.user, {
          is_signin: 'T',
          is_login: true
        }, commonContext.user);
      }
      if (shouldSend(serverRumEvent, configuration.beforeSend, domainContext, eventRateLimiters)) {
        if (isEmptyObject(serverRumEvent.context)) {
          delete serverRumEvent.context;
        }
        lifeCycle.notify(LifeCycleEventType.RUM_EVENT_COLLECTED, serverRumEvent);
      }
    }
  });
}
function shouldSend(event, beforeSend, domainContext, eventRateLimiters) {
  if (beforeSend) {
    var result = limitModification(event, modifiableFieldPathsByEvent[event.type], function (event) {
      return beforeSend(event, domainContext);
    });
    if (result === false && event.type !== RumEventType.VIEW) {
      return false;
    }
    if (result === false) {
      display.warn("Can't dismiss view events using beforeSend!");
    }
  }
  var rateLimitReached = false;
  if (eventRateLimiters[event.type]) {
    rateLimitReached = eventRateLimiters[event.type].isLimitReached();
  }
  return !rateLimitReached;
}
function needToAssembleWithAction(event) {
  return [RumEventType.ERROR, RumEventType.RESOURCE, RumEventType.LONG_TASK].indexOf(event.type) !== -1;
}
function getSessionType() {
  return window._DATAFLUX_SYNTHETICS_BROWSER === undefined ? SessionType.USER : SessionType.SYNTHETICS;
}
;// CONCATENATED MODULE: ./src/domain/initViewportObservable.js

var viewportObservable;
function initViewportObservable() {
  if (!viewportObservable) {
    viewportObservable = createViewportObservable();
  }
  return viewportObservable;
}
function createViewportObservable() {
  return new Observable(function (observable) {
    var _throttledUpdateDimension = throttle(function () {
      observable.notify(getViewportDimension());
    }, 200);
    var updateDimension = _throttledUpdateDimension.throttled;
    return addEventListener(window, DOM_EVENT.RESIZE, updateDimension, {
      capture: true,
      passive: true
    }).stop;
  });
}

// excludes the width and height of any rendered classic scrollbar that is fixed to the visual viewport
function getViewportDimension() {
  var visual = window.visualViewport;
  if (visual) {
    return {
      width: Number(visual.width * visual.scale),
      height: Number(visual.height * visual.scale)
    };
  }
  return {
    width: Number(window.innerWidth || 0),
    height: Number(window.innerHeight || 0)
  };
}
;// CONCATENATED MODULE: ./src/domain/contexts/displayContext.js

function startDisplayContext() {
  var viewport = getViewportDimension();
  var unsubscribeViewport = initViewportObservable().subscribe(function (viewportDimension) {
    viewport = viewportDimension;
  }).unsubscribe;
  return {
    get: function () {
      return {
        viewport: viewport
      };
    },
    stop: unsubscribeViewport
  };
}
;// CONCATENATED MODULE: ./src/domain/contexts/internalContext.js
/**
 * Internal context keep returning v1 format
 * to not break compatibility with logs data format
 */
function startInternalContext(applicationId, sessionManager, viewContexts, actionContexts, urlContexts) {
  return {
    get: function (startTime) {
      var viewContext = viewContexts.findView(startTime);
      var urlContext = urlContexts.findUrl(startTime);
      var session = sessionManager.findTrackedSession(startTime);
      if (session && viewContext && urlContext) {
        var actionId = actionContexts.findActionId(startTime);
        var actionIds = actionContexts.findAllActionId(startTime);
        return {
          application: {
            id: applicationId
          },
          session: {
            id: session.id
          },
          userAction: actionId ? {
            id: actionId,
            ids: actionIds
          } : undefined,
          view: {
            id: viewContext.id,
            name: viewContext.name || urlContext.path,
            url: urlContext.url,
            referrer: urlContext.referrer,
            host: urlContext.host,
            path: urlContext.path,
            pathGroup: urlContext.pathGroup,
            pathname: urlContext.pathname,
            urlQuery: urlContext.urlQuery
          }
        };
      }
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/contexts/urlContexts.js


/**
 * We want to attach to an event:
 * - the url corresponding to its start
 * - the referrer corresponding to the previous view url (or document referrer for initial view)
 */

var URL_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
function startUrlContexts(lifeCycle, locationChangeObservable, location) {
  var urlContextHistory = createValueHistory({
    expireDelay: URL_CONTEXT_TIME_OUT_DELAY
  });
  var previousViewUrl;
  lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_CREATED, function (data) {
    var viewUrl = location.href;
    urlContextHistory.add(buildUrlContext({
      url: viewUrl,
      location: location,
      referrer: !previousViewUrl ? document.referrer : previousViewUrl
    }), data.startClocks.relative);
    previousViewUrl = viewUrl;
  });
  lifeCycle.subscribe(LifeCycleEventType.AFTER_VIEW_ENDED, function (data) {
    urlContextHistory.closeActive(data.endClocks.relative);
  });
  var locationChangeSubscription = locationChangeObservable.subscribe(function (data) {
    var current = urlContextHistory.find();
    if (current) {
      var changeTime = tools_relativeNow();
      urlContextHistory.closeActive(changeTime);
      urlContextHistory.add(buildUrlContext({
        url: data.newLocation.href,
        location: data.newLocation,
        referrer: current.referrer
      }, true), changeTime);
    }
  });
  function buildUrlContext(data) {
    let isLocationChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var pathname = data.location.pathname;
    var path = pathname;
    var hash = data.location.hash;
    if (hash && hash.indexOf('#/') === 0) {
      path = '/' + getPathFromHash(hash);
    }
    return {
      url: data.url,
      referrer: data.referrer,
      host: data.location.host,
      path: path,
      pathGroup: replaceNumberCharByPath(path),
      urlQuery: getQueryParamsFromUrl(data.location.href),
      pathname: pathname
    };
  }
  return {
    findUrl: function (startTime) {
      return urlContextHistory.find(startTime);
    },
    stop: function () {
      locationChangeSubscription.unsubscribe();
      urlContextHistory.stop();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/contexts/viewContexts.js

var VIEW_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
function startViewContexts(lifeCycle) {
  var viewContextHistory = createValueHistory({
    expireDelay: VIEW_CONTEXT_TIME_OUT_DELAY
  });
  lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_CREATED, function (view) {
    viewContextHistory.add(buildViewContext(view), view.startClocks.relative);
  });
  lifeCycle.subscribe(LifeCycleEventType.AFTER_VIEW_ENDED, function (data) {
    viewContextHistory.closeActive(data.endClocks.relative);
  });
  lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_UPDATED, viewUpdate => {
    const currentView = viewContextHistory.find(viewUpdate.startClocks.relative);
    if (currentView && viewUpdate.name) {
      currentView.name = viewUpdate.name;
    }
    if (currentView && viewUpdate.context) {
      currentView.context = viewUpdate.context;
    }
  });
  lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, function () {
    viewContextHistory.reset();
  });
  function buildViewContext(view) {
    return {
      service: view.service,
      version: view.version,
      context: view.context,
      id: view.id,
      name: view.name,
      startClocks: view.startClocks
    };
  }
  return {
    findView: function (startTime) {
      return viewContextHistory.find(startTime);
    },
    stop: function () {
      viewContextHistory.stop();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/error/trackConsoleError.js

function trackConsoleError(errorObservable) {
  var subscription = initConsoleObservable([ConsoleApiName.error]).subscribe(function (consoleLog) {
    errorObservable.notify(consoleLog.error);
  });
  return {
    stop: function () {
      subscription.unsubscribe();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/error/trackReportError.js

function trackReportError(configuration, errorObservable) {
  var subscription = initReportObservable(configuration, [(RawReportType.cspViolation, RawReportType.intervention)]).subscribe(function (reportError) {
    errorObservable.notify({
      startClocks: clocksNow(),
      message: reportError.message,
      stack: reportError.stack,
      type: reportError.subtype,
      source: errorTools_ErrorSource.REPORT,
      handling: enums_ErrorHandling.UNHANDLED
    });
  });
  return {
    stop: function () {
      subscription.unsubscribe();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/error/errorCollection.js




function startErrorCollection(lifeCycle, configuration, sessionManager, pageStateHistory) {
  var errorObservable = new Observable();
  trackConsoleError(errorObservable);
  trackRuntimeError(errorObservable);
  trackReportError(configuration, errorObservable);
  var session = sessionManager.findTrackedSession();
  let hasError = session && session.isErrorSession && session.sessionHasError;
  if (session && session.isErrorSession) {
    lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, function () {
      hasError = false;
    });
  }
  errorObservable.subscribe(function (error) {
    if (session && session.isErrorSession && !hasError) {
      sessionManager.setErrorForSession();
      hasError = true;
    }
    lifeCycle.notify(LifeCycleEventType.RAW_ERROR_COLLECTED, {
      error: error
    });
  });
  return doStartErrorCollection(lifeCycle, pageStateHistory);
}
function doStartErrorCollection(lifeCycle, pageStateHistory) {
  lifeCycle.subscribe(LifeCycleEventType.RAW_ERROR_COLLECTED, function (error) {
    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, tools_assign({
      customerContext: error.customerContext,
      savedCommonContext: error.savedCommonContext
    }, processError(error.error, pageStateHistory)));
  });
  return {
    addError: function (providedError, savedCommonContext) {
      var error = providedError.error;
      var stackTrace = error instanceof Error ? computeStackTrace(error) : undefined;
      var rawError = computeRawError({
        stackTrace,
        originalError: error,
        handlingStack: providedError.handlingStack,
        startClocks: providedError.startClocks,
        nonErrorPrefix: NonErrorPrefix.PROVIDED,
        source: errorTools_ErrorSource.CUSTOM,
        handling: enums_ErrorHandling.HANDLED
      });
      lifeCycle.notify(LifeCycleEventType.RAW_ERROR_COLLECTED, {
        customerContext: providedError.context,
        savedCommonContext: savedCommonContext,
        error: rawError
      });
    }
  };
}
function processError(error, pageStateHistory) {
  var rawRumEvent = {
    date: error.startClocks.timeStamp,
    error: {
      id: UUID(),
      message: error.message,
      source: error.source,
      stack: error.stack,
      handling_stack: error.handlingStack,
      type: error.type,
      handling: error.handling,
      causes: error.causes,
      source_type: 'browser'
    },
    type: RumEventType.ERROR,
    view: {
      in_foreground: pageStateHistory.wasInPageStateAt(PageState.ACTIVE, error.startClocks.relative)
    }
  };
  return {
    rawRumEvent: rawRumEvent,
    startTime: error.startClocks.relative,
    domainContext: {
      error: error.originalError
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackFirstContentfulPaint.js


var TIMING_MAXIMUM_DELAY = 10 * ONE_MINUTE;
function trackFirstContentfulPaint(configuration, firstHidden, callback) {
  var performanceSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.PAINT,
    buffered: true
  }).subscribe(function (entries) {
    var fcpEntry = find(entries, function (entry) {
      return entry.entryType === RumPerformanceEntryType.PAINT && entry.name === 'first-contentful-paint' && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < TIMING_MAXIMUM_DELAY;
    });
    if (fcpEntry) {
      callback(fcpEntry.startTime);
    }
  });
  return {
    stop: performanceSubscription.unsubscribe
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/actions/__constants.js
var DEFAULT_PROGRAMMATIC_ACTION_NAME_ATTRIBUTE = 'data-guance-action-name';

/**
 * Stable attributes are attributes that are commonly used to identify parts of a UI (ex:
 * component). Those attribute values should not be generated randomly (hardcoded most of the time)
 * and stay the same across deploys. They are not necessarily unique across the document.
 */
var STABLE_ATTRIBUTES = [DEFAULT_PROGRAMMATIC_ACTION_NAME_ATTRIBUTE,
// Common test attributes (list provided by google recorder)
'data-testid', 'data-test', 'data-qa', 'data-cy', 'data-test-id', 'data-qa-id', 'data-testing',
// FullStory decorator attributes:
'data-component', 'data-element', 'data-source-file'];
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/actions/getSelectorsFromElement.js



// Selectors to use if they target a single element on the whole document. Those selectors are
// considered as "stable" and uniquely identify an element regardless of the page state. If we find
// one, we should consider the selector "complete" and stop iterating over ancestors.
var GLOBALLY_UNIQUE_SELECTOR_GETTERS = [getStableAttributeSelector, getIDSelector];

// Selectors to use if they target a single element among an element descendants. Those selectors
// are more brittle than "globally unique" selectors and should be combined with ancestor selectors
// to improve specificity.
var UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS = [getStableAttributeSelector, getClassSelector, getTagNameSelector];
function getSelectorFromElement(targetElement, actionNameAttribute) {
  if (!isConnected(targetElement)) {
    // We cannot compute a selector for a detached element, as we don't have access to all of its
    // parents, and we cannot determine if it's unique in the document.
    return;
  }
  let targetElementSelector;
  let currentElement = targetElement;
  while (currentElement && currentElement.nodeName !== 'HTML') {
    const globallyUniqueSelector = findSelector(currentElement, GLOBALLY_UNIQUE_SELECTOR_GETTERS, isSelectorUniqueGlobally, actionNameAttribute, targetElementSelector);
    if (globallyUniqueSelector) {
      return globallyUniqueSelector;
    }
    const uniqueSelectorAmongChildren = findSelector(currentElement, UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS, isSelectorUniqueAmongSiblings, actionNameAttribute, targetElementSelector);
    targetElementSelector = uniqueSelectorAmongChildren || combineSelector(getPositionSelector(currentElement), targetElementSelector);
    currentElement = currentElement.parentElement;
  }
  //   while (element && element.nodeName !== 'HTML') {
  //     var globallyUniqueSelector = findSelector(
  //       element,
  //       GLOBALLY_UNIQUE_SELECTOR_GETTERS,
  //       isSelectorUniqueGlobally,
  //       actionNameAttribute,
  //       targetElementSelector
  //     )
  //     if (globallyUniqueSelector) {
  //       return globallyUniqueSelector
  //     }

  //     var uniqueSelectorAmongChildren = findSelector(
  //       element,
  //       UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS,
  //       isSelectorUniqueAmongSiblings,
  //       actionNameAttribute,
  //       targetElementSelector
  //     )
  //     targetElementSelector =
  //       uniqueSelectorAmongChildren ||
  //       combineSelector(getPositionSelector(element), targetElementSelector)

  //     element = element.parentElement
  //   }

  return targetElementSelector;
}
function isGeneratedValue(value) {
  // To compute the "URL path group", the backend replaces every URL path parts as a question mark
  // if it thinks the part is an identifier. The condition it uses is to checks whether a digit is
  // present.
  //
  // Here, we use the same strategy: if a the value contains a digit, we consider it generated. This
  // strategy might be a bit naive and fail in some cases, but there are many fallbacks to generate
  // CSS selectors so it should be fine most of the time. We might want to allow customers to
  // provide their own `isGeneratedValue` at some point.
  return /[0-9]/.test(value);
}
function getIDSelector(element) {
  if (element.id && !isGeneratedValue(element.id)) {
    return '#' + cssEscape(element.id);
  }
}
function getClassSelector(element) {
  if (element.tagName === 'BODY') {
    return;
  }
  if (element.classList.length > 0) {
    for (var i = 0; i < element.classList.length; i += 1) {
      var className = element.classList[i];
      if (isGeneratedValue(className)) {
        continue;
      }
      return cssEscape(element.tagName) + '.' + cssEscape(className);
    }
  }
}
function getTagNameSelector(element) {
  return cssEscape(element.tagName);
}
function getStableAttributeSelector(element, actionNameAttribute) {
  if (actionNameAttribute) {
    var selector = getAttributeSelector(actionNameAttribute);
    if (selector) {
      return selector;
    }
  }
  for (var i = 0; i < STABLE_ATTRIBUTES.length; i++) {
    var attributeName = STABLE_ATTRIBUTES[i];
    var selector = getAttributeSelector(attributeName);
    if (selector) {
      return selector;
    }
  }
  function getAttributeSelector(attributeName) {
    if (element.hasAttribute(attributeName)) {
      return cssEscape(element.tagName) + '[' + attributeName + '="' + cssEscape(element.getAttribute(attributeName)) + '"]';
    }
  }
}
function getPositionSelector(element) {
  var sibling = element.parentElement && element.parentElement.firstElementChild;
  var elementIndex = 1;
  while (sibling && sibling !== element) {
    if (sibling.tagName === element.tagName) {
      elementIndex += 1;
    }
    sibling = sibling.nextElementSibling;
  }
  var tagName = cssEscape(element.tagName);
  if (/^::/.test(tagName)) {
    return tagName;
  }
  return tagName + ':nth-of-type(' + elementIndex + ')';
}
function findSelector(element, selectorGetters, predicate, actionNameAttribute, childSelector) {
  for (var i = 0; i < selectorGetters.length; i++) {
    var selectorGetter = selectorGetters[i];
    var elementSelector = selectorGetter(element, actionNameAttribute);
    if (!elementSelector) {
      continue;
    }
    if (predicate(element, elementSelector, childSelector)) {
      return combineSelector(elementSelector, childSelector);
    }
  }
}
function isSelectorUniqueGlobally(element, elementSelector, childSelector) {
  return element.ownerDocument.querySelectorAll(combineSelector(elementSelector, childSelector)).length === 1;
}
/**
 * Check whether the selector is unique among the element siblings. In other words, it returns true
 * if "ELEMENT_PARENT > SELECTOR" returns a single element.
 *
 * The result will be less accurate on browsers that don't support :scope (i. e. IE): it will check
 * for any element matching the selector contained in the parent (in other words,
 * "ELEMENT_PARENT SELECTOR" returns a single element), regardless of whether the selector is a
 * direct descendent of the element parent. This should not impact results too much: if it
 * inaccurately returns false, we'll just fall back to another strategy.
 */
function isSelectorUniqueAmongSiblings(currentElement, currentElementSelector, childSelector) {
  let isSiblingMatching;
  if (childSelector === undefined) {
    // If the child selector is undefined (meaning `currentElement` is the target element, not one
    // of its ancestor), we need to use `matches` to check if the sibling is matching the selector,
    // as `querySelector` only returns a descendant of the element.
    isSiblingMatching = sibling => sibling.matches(currentElementSelector);
  } else {
    const scopedSelector = supportScopeSelector() ? combineSelector("".concat(currentElementSelector, ":scope"), childSelector) : combineSelector(currentElementSelector, childSelector);
    isSiblingMatching = sibling => sibling.querySelector(scopedSelector) !== null;
  }
  const parent = currentElement.parentElement;
  let sibling = parent.firstElementChild;
  while (sibling) {
    if (sibling !== currentElement && isSiblingMatching(sibling)) {
      return false;
    }
    sibling = sibling.nextElementSibling;
  }
  return true;
}
function combineSelector(parent, child) {
  return child ? parent + '>' + child : parent;
}
var supportScopeSelectorCache;
function supportScopeSelector() {
  if (supportScopeSelectorCache === undefined) {
    try {
      document.querySelector(':scope');
      supportScopeSelectorCache = true;
    } catch (_unused) {
      supportScopeSelectorCache = false;
    }
  }
  return supportScopeSelectorCache;
}

/**
 * Polyfill-utility for the `isConnected` property not supported in IE11
 */
function isConnected(element) {
  if ('isConnected' in element
  // cast is to make sure `element` is not inferred as `never` after the check
  ) {
    return element.isConnected;
  }
  return element.ownerDocument.documentElement.contains(element);
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackFirstInput.js



/**
 * Track the first input occurring during the initial View to return:
 * - First Input Delay
 * - First Input Time
 * Callback is called at most one time.
 * Documentation: https://web.dev/fid/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts
 */
function trackFirstInput(configuration, firstHidden, callback) {
  const performanceFirstInputSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.FIRST_INPUT,
    buffered: true
  }).subscribe(function (entries) {
    var firstInputEntry = find(entries, function (entry) {
      return entry.entryType === RumPerformanceEntryType.FIRST_INPUT && entry.startTime < firstHidden.getTimeStamp();
    });
    if (firstInputEntry) {
      var firstInputDelay = tools_elapsed(firstInputEntry.startTime, firstInputEntry.processingStart);
      var firstInputTargetSelector;
      if (firstInputEntry.target && isElementNode(firstInputEntry.target)) {
        firstInputTargetSelector = getSelectorFromElement(firstInputEntry.target, configuration.actionNameAttribute);
      }
      callback({
        // Ensure firstInputDelay to be positive, see
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1185815
        delay: firstInputDelay >= 0 ? firstInputDelay : 0,
        time: firstInputEntry.startTime,
        targetSelector: firstInputTargetSelector
      });
    }
  });
  return {
    stop: function () {
      performanceFirstInputSubscription.unsubscribe();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/performanceUtils.js


function getNavigationEntry() {
  if (supportPerformanceTimingEvent(RumPerformanceEntryType.NAVIGATION)) {
    var navigationEntry = performance.getEntriesByType(RumPerformanceEntryType.NAVIGATION)[0];
    if (navigationEntry) {
      return navigationEntry;
    }
  }
  var timings = computeTimingsFromDeprecatedPerformanceTiming();
  var entry = tools_assign({
    entryType: RumPerformanceEntryType.NAVIGATION,
    initiatorType: 'navigation',
    name: window.location.href,
    startTime: 0,
    duration: timings.responseEnd,
    decodedBodySize: 0,
    encodedBodySize: 0,
    transferSize: 0,
    toJSON: function () {
      return tools_assign({}, entry, {
        toJSON: undefined
      });
    }
  }, timings);
  return entry;
}
function computeTimingsFromDeprecatedPerformanceTiming() {
  var result = {};
  var timing = performance.timing;
  for (var key in timing) {
    if (isNumber(timing[key])) {
      var numberKey = key;
      var timingElement = timing[numberKey];
      result[numberKey] = timingElement === 0 ? 0 : getRelativeTime(timingElement);
    }
  }
  return result;
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackNavigationTimings.js


function trackNavigationTimings(configuration, callback, getNavigationEntryImpl) {
  if (getNavigationEntryImpl === undefined) {
    getNavigationEntryImpl = getNavigationEntry;
  }
  return waitAfterLoadEvent(function () {
    var entry = getNavigationEntryImpl();
    if (!isIncompleteNavigation(entry)) {
      callback(processNavigationEntry(entry));
    }
  });
}
function processNavigationEntry(entry) {
  return {
    fetchStart: entry.fetchStart,
    responseEnd: entry.responseEnd,
    domComplete: entry.domComplete,
    domContentLoaded: entry.domContentLoadedEventEnd,
    domInteractive: entry.domInteractive,
    loadEvent: entry.loadEventEnd,
    loadEventEnd: entry.loadEventEnd,
    loadEventStart: entry.loadEventStart,
    domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
    domContentLoadedEventStart: entry.domContentLoadedEventStart,
    // In some cases the value reported is negative or is larger
    // than the current page time. Ignore these cases:
    // https://github.com/GoogleChrome/web-vitals/issues/137
    // https://github.com/GoogleChrome/web-vitals/issues/162
    firstByte: entry.responseStart >= 0 && entry.responseStart <= tools_relativeNow() ? entry.responseStart : undefined
  };
}
function isIncompleteNavigation(entry) {
  return entry.loadEventEnd <= 0;
}
function waitAfterLoadEvent(callback) {
  var timeoutId;
  var _runOnReadyState = runOnReadyState('complete', function () {
    // Invoke the callback a bit after the actual load event, so the "loadEventEnd" timing is accurate
    timeoutId = timer_setTimeout(function () {
      callback();
    });
  });
  return {
    stop: function () {
      _runOnReadyState.stop();
      timer_clearTimeout(timeoutId);
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackLargestContentfulPaint.js



/**
 * Track the largest contentful paint (LCP) occurring during the initial View.  This can yield
 * multiple values, only the most recent one should be used.
 * Documentation: https://web.dev/lcp/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts
 */
// It happens in some cases like sleep mode or some browser implementations
var LCP_MAXIMUM_DELAY = 10 * ONE_MINUTE;
function trackLargestContentfulPaint(configuration, firstHidden, eventTarget, callback) {
  // Ignore entries that come after the first user interaction.  According to the documentation, the
  // browser should not send largest-contentful-paint entries after a user interact with the page,
  // but the web-vitals reference implementation uses this as a safeguard.
  var firstInteractionTimestamp = Infinity;
  var _addEventListeners = addEventListeners(eventTarget, [DOM_EVENT.POINTER_DOWN, DOM_EVENT.KEY_DOWN], function (event) {
    firstInteractionTimestamp = event.timeStamp;
  }, {
    capture: true,
    once: true
  });
  var stopEventListener = _addEventListeners.stop;
  var biggestLcpSize = 0;
  var performanceLcpSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.LARGEST_CONTENTFUL_PAINT,
    buffered: true
  }).subscribe(function (entries) {
    var lcpEntry = findLast(entries, function (entry) {
      return entry.entryType === RumPerformanceEntryType.LARGEST_CONTENTFUL_PAINT && entry.startTime < firstInteractionTimestamp && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < LCP_MAXIMUM_DELAY &&
      // Ensure to get the LCP entry with the biggest size, see
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1516655
      entry.size > biggestLcpSize;
    });
    if (lcpEntry) {
      var lcpTargetSelector;
      if (lcpEntry.element) {
        lcpTargetSelector = getSelectorFromElement(lcpEntry.element, configuration.actionNameAttribute);
      }
      callback({
        value: lcpEntry.startTime,
        targetSelector: lcpTargetSelector
      });
      biggestLcpSize = lcpEntry.size;
    }
  });
  return {
    stop: function () {
      stopEventListener();
      performanceLcpSubscription.unsubscribe();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackFirstHidden.js


function trackFirstHidden(viewStart, eventTarget) {
  if (typeof eventTarget === 'undefined') {
    eventTarget = window;
  }
  if (document.visibilityState === 'hidden') {
    return {
      getTimeStamp: () => 0,
      stop: tools_noop
    };
  }
  if (supportPerformanceTimingEvent(RumPerformanceEntryType.VISIBILITY_STATE)) {
    const firstHiddenEntry = performance.getEntriesByType(RumPerformanceEntryType.VISIBILITY_STATE).filter(entry => entry.name === 'hidden').find(entry => entry.startTime >= viewStart.relative);
    if (firstHiddenEntry) {
      return {
        getTimeStamp: () => firstHiddenEntry.startTime,
        stop: tools_noop
      };
    }
  }
  let timeStamp = Infinity;
  const {
    stop
  } = addEventListeners(eventTarget, [DOM_EVENT.PAGE_HIDE, DOM_EVENT.VISIBILITY_CHANGE], event => {
    if (event.type === DOM_EVENT.PAGE_HIDE || document.visibilityState === 'hidden') {
      timeStamp = event.timeStamp;
      stop();
    }
  }, {
    capture: true
  });
  return {
    getTimeStamp: function () {
      return timeStamp;
    },
    stop: function () {
      stop();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackInitialViewTimings.js






var KEEP_TRACKING_TIMINGS_AFTER_VIEW_DELAY = 5 * ONE_MINUTE;
function trackInitialViewMetrics(configuration, viewStart, setLoadEvent, scheduleViewUpdate) {
  var initialViewMetrics = {};
  var _trackNavigationTimings = trackNavigationTimings(configuration, function (navigationTimings) {
    setLoadEvent(navigationTimings.loadEvent);
    initialViewMetrics.navigationTimings = navigationTimings;
    scheduleViewUpdate();
  });
  var firstHidden = trackFirstHidden(viewStart);
  var stopNavigationTracking = _trackNavigationTimings.stop;
  var _trackFirstContentfulPaint = trackFirstContentfulPaint(configuration, firstHidden, function (firstContentfulPaint) {
    initialViewMetrics.firstContentfulPaint = firstContentfulPaint;
    scheduleViewUpdate();
  });
  var stopFCPTracking = _trackFirstContentfulPaint.stop;
  var _trackLargestContentfulPaint = trackLargestContentfulPaint(configuration, firstHidden, window, function (largestContentfulPaint) {
    initialViewMetrics.largestContentfulPaint = largestContentfulPaint;
    scheduleViewUpdate();
  });
  var stopLCPTracking = _trackLargestContentfulPaint.stop;
  var _trackFirstInput = trackFirstInput(configuration, firstHidden, function (firstInput) {
    initialViewMetrics.firstInput = firstInput;
    scheduleViewUpdate();
  });
  var stopFIDTracking = _trackFirstInput.stop;
  function stop() {
    stopNavigationTracking();
    stopFCPTracking();
    stopLCPTracking();
    stopFIDTracking();
    firstHidden.stop();
  }
  return {
    stop: stop,
    initialViewMetrics: initialViewMetrics
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackScrollMetrics.js



/** Arbitrary scroll throttle duration */
var THROTTLE_SCROLL_DURATION = ONE_SECOND;
function trackScrollMetrics(configuration, viewStart, callback, scrollValues) {
  if (scrollValues === undefined) {
    scrollValues = createScrollValuesObservable(configuration);
  }
  var maxScrollDepth = 0;
  var maxScrollHeight = 0;
  var maxScrollHeightTime = 0;
  var subscription = scrollValues.subscribe(function (data) {
    var scrollDepth = data.scrollDepth;
    var scrollTop = data.scrollTop;
    var scrollHeight = data.scrollHeight;
    var shouldUpdate = false;
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      shouldUpdate = true;
    }
    if (scrollHeight > maxScrollHeight) {
      maxScrollHeight = scrollHeight;
      var now = tools_relativeNow();
      maxScrollHeightTime = tools_elapsed(viewStart.relative, now);
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      callback({
        maxDepth: Math.min(maxScrollDepth, maxScrollHeight),
        maxDepthScrollTop: scrollTop,
        maxScrollHeight: maxScrollHeight,
        maxScrollHeightTime: maxScrollHeightTime
      });
    }
  });
  return {
    stop: function () {
      return subscription.unsubscribe();
    }
  };
}
function computeScrollValues() {
  var scrollTop = getScrollY();
  var viewport = getViewportDimension();
  var height = viewport.height;
  var scrollHeight = Math.round((document.scrollingElement || document.documentElement).scrollHeight);
  var scrollDepth = Math.round(height + scrollTop);
  return {
    scrollHeight: scrollHeight,
    scrollDepth: scrollDepth,
    scrollTop: scrollTop
  };
}
function createScrollValuesObservable(configuration, throttleDuration) {
  if (throttleDuration === undefined) {
    throttleDuration = THROTTLE_SCROLL_DURATION;
  }
  return new Observable(function (observable) {
    function notify() {
      observable.notify(computeScrollValues());
    }
    if (window.ResizeObserver) {
      var throttledNotify = throttle(notify, throttleDuration, {
        leading: false,
        trailing: true
      });
      var observerTarget = document.scrollingElement || document.documentElement;
      var resizeObserver = new ResizeObserver(monitor(throttledNotify.throttled));
      if (observerTarget) {
        resizeObserver.observe(observerTarget);
      }
      var eventListener = addEventListener(window, DOM_EVENT.SCROLL, throttledNotify.throttled, {
        passive: true
      });
      return function () {
        throttledNotify.cancel();
        resizeObserver.unobserve(observerTarget);
        eventListener.stop();
      };
    }
  });
}
;// CONCATENATED MODULE: ./src/domain/waitPageActivityEnd.js


// Delay to wait for a page activity to validate the tracking process
var PAGE_ACTIVITY_VALIDATION_DELAY = 100;
// Delay to wait after a page activity to end the tracking process
var PAGE_ACTIVITY_END_DELAY = 100;

/**
 * Wait for the page activity end
 *
 * Detection lifecycle:
 * ```
 *                        Wait page activity end
 *              .-------------------'--------------------.
 *              v                                        v
 *     [Wait for a page activity ]          [Wait for a maximum duration]
 *     [timeout: VALIDATION_DELAY]          [  timeout: maxDuration     ]
 *          /                  \                           |
 *         v                    v                          |
 *  [No page activity]   [Page activity]                   |
 *         |                   |,----------------------.   |
 *         v                   v                       |   |
 *     (Discard)     [Wait for a page activity]        |   |
 *                   [   timeout: END_DELAY   ]        |   |
 *                       /                \            |   |
 *                      v                  v           |   |
 *             [No page activity]    [Page activity]   |   |
 *                      |                 |            |   |
 *                      |                 '------------'   |
 *                      '-----------. ,--------------------'
 *                                   v
 *                                 (End)
 * ```
 *
 * Note: by assuming that maxDuration is greater than VALIDATION_DELAY, we are sure that if the
 * process is still alive after maxDuration, it has been validated.
 */
function waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, pageActivityEndCallback, maxDuration) {
  var pageActivityObservable = createPageActivityObservable(lifeCycle, domMutationObservable, configuration);
  return doWaitPageActivityEnd(pageActivityObservable, pageActivityEndCallback, maxDuration);
}
function doWaitPageActivityEnd(pageActivityObservable, pageActivityEndCallback, maxDuration) {
  var pageActivityEndTimeoutId;
  var hasCompleted = false;
  var validationTimeoutId = timer_setTimeout(function () {
    complete({
      hadActivity: false
    });
  }, PAGE_ACTIVITY_VALIDATION_DELAY);
  var maxDurationTimeoutId = maxDuration !== undefined ? timer_setTimeout(function () {
    return complete({
      hadActivity: true,
      end: timeStampNow()
    });
  }, maxDuration) : undefined;
  var pageActivitySubscription = pageActivityObservable.subscribe(function (data) {
    var isBusy = data.isBusy;
    timer_clearTimeout(validationTimeoutId);
    timer_clearTimeout(pageActivityEndTimeoutId);
    var lastChangeTime = timeStampNow();
    if (!isBusy) {
      pageActivityEndTimeoutId = timer_setTimeout(function () {
        complete({
          hadActivity: true,
          end: lastChangeTime
        });
      }, PAGE_ACTIVITY_END_DELAY);
    }
  });
  var stop = function () {
    hasCompleted = true;
    timer_clearTimeout(validationTimeoutId);
    timer_clearTimeout(pageActivityEndTimeoutId);
    timer_clearTimeout(maxDurationTimeoutId);
    pageActivitySubscription.unsubscribe();
  };
  function complete(event) {
    if (hasCompleted) {
      return;
    }
    stop();
    pageActivityEndCallback(event);
  }
  return {
    stop: stop
  };
}
function createPageActivityObservable(lifeCycle, domMutationObservable, configuration) {
  return new Observable(function (observable) {
    var subscriptions = [];
    var firstRequestIndex;
    var pendingRequestsCount = 0;
    subscriptions.push(domMutationObservable.subscribe(() => {
      notifyPageActivity();
    }), createPerformanceObservable(configuration, {
      type: RumPerformanceEntryType.RESOURCE
    }).subscribe(function (entries) {
      if (some(entries, function (entry) {
        return !isExcludedUrl(configuration, entry.name);
      })) {
        notifyPageActivity();
      }
    }), lifeCycle.subscribe(LifeCycleEventType.REQUEST_STARTED, function (startEvent) {
      if (isExcludedUrl(configuration, startEvent.url)) {
        return;
      }
      if (firstRequestIndex === undefined) {
        firstRequestIndex = startEvent.requestIndex;
      }
      pendingRequestsCount += 1;
      notifyPageActivity();
    }), lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, function (request) {
      if (isExcludedUrl(configuration, request.url) || firstRequestIndex === undefined ||
      // If the request started before the tracking start, ignore it
      request.requestIndex < firstRequestIndex) {
        return;
      }
      pendingRequestsCount -= 1;
      notifyPageActivity();
    }));
    var _trackWindowOpen = trackWindowOpen(notifyPageActivity);
    var stopTrackingWindowOpen = _trackWindowOpen.stop;
    return function () {
      stopTrackingWindowOpen();
      each(subscriptions, function (s) {
        s.unsubscribe();
      });
    };
    function notifyPageActivity() {
      observable.notify({
        isBusy: pendingRequestsCount > 0
      });
    }
  });
}
function isExcludedUrl(configuration, requestUrl) {
  return matchList(configuration.excludedActivityUrls, requestUrl);
}
function trackWindowOpen(callback) {
  return instrumentMethod(window, 'open', callback);
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackLoadingTime.js



function trackLoadingTime(lifeCycle, domMutationObservable, configuration, loadType, viewStart, callback) {
  var isWaitingForLoadEvent = loadType === ViewLoadingType.INITIAL_LOAD;
  var isWaitingForActivityLoadingTime = true;
  var loadingTimeCandidates = [];
  var firstHidden = trackFirstHidden(viewStart);
  function invokeCallbackIfAllCandidatesAreReceived() {
    if (!isWaitingForActivityLoadingTime && !isWaitingForLoadEvent && loadingTimeCandidates.length > 0) {
      var loadingTime = Math.max.apply(Math, loadingTimeCandidates);
      if (loadingTime < firstHidden.getTimeStamp() - viewStart.relative) {
        callback(loadingTime);
      }
    }
  }
  var _waitPageActivityEnd = waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, function (event) {
    if (isWaitingForActivityLoadingTime) {
      isWaitingForActivityLoadingTime = false;
      if (event.hadActivity) {
        loadingTimeCandidates.push(tools_elapsed(viewStart.timeStamp, event.end));
      }
      invokeCallbackIfAllCandidatesAreReceived();
    }
  });
  var stop = _waitPageActivityEnd.stop;
  return {
    setLoadEvent: function (loadEvent) {
      if (isWaitingForLoadEvent) {
        isWaitingForLoadEvent = false;
        loadingTimeCandidates.push(loadEvent);
        invokeCallbackIfAllCandidatesAreReceived();
      }
    },
    stop: function () {
      stop();
      firstHidden.stop();
      if (isWaitingForActivityLoadingTime) {
        isWaitingForActivityLoadingTime = false;
        invokeCallbackIfAllCandidatesAreReceived();
      }
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackCumulativeLayoutShift.js



/**
 * Track the cumulative layout shifts (CLS).
 * Layout shifts are grouped into session windows.
 * The minimum gap between session windows is 1 second.
 * The maximum duration of a session window is 5 second.
 * The session window layout shift value is the sum of layout shifts inside it.
 * The CLS value is the max of session windows values.
 *
 * This yields a new value whenever the CLS value is updated (a higher session window value is computed).
 *
 * See isLayoutShiftSupported to check for browser support.
 *
 * Documentation:
 * https://web.dev/cls/
 * https://web.dev/evolving-cls/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts
 */
function trackCumulativeLayoutShift(configuration, viewStart, callback) {
  if (!isLayoutShiftSupported()) {
    return {
      stop: tools_noop
    };
  }
  var maxClsValue = 0;
  // WeakRef is not supported in IE11 and Safari mobile, but so is the layout shift API, so this code won't be executed in these browsers
  var maxClsTarget;
  var maxClsStartTime;

  // if no layout shift happen the value should be reported as 0
  callback({
    value: 0
  });
  var window = slidingSessionWindow();
  var performanceSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.LAYOUT_SHIFT,
    buffered: true
  }).subscribe(function (entries) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      if (entry.hadRecentInput || entry.startTime < viewStart) {
        continue;
      }
      var _update = window.update(entry);
      var cumulatedValue = _update.cumulatedValue;
      var isMaxValue = _update.isMaxValue;
      if (isMaxValue) {
        var target = getTargetFromSource(entry.sources);
        maxClsTarget = target ? new WeakRef(target) : undefined;
        maxClsStartTime = tools_elapsed(viewStart, entry.startTime);
      }
      if (cumulatedValue > maxClsValue) {
        maxClsValue = cumulatedValue;
        var target = maxClsTarget && maxClsTarget.deref();
        callback({
          value: round(maxClsValue, 4),
          targetSelector: target && getSelectorFromElement(target, configuration.actionNameAttribute),
          time: maxClsStartTime
        });
      }
    }
  });
  return {
    stop: function () {
      performanceSubscription.unsubscribe();
    }
  };
}
function getTargetFromSource(sources) {
  if (!sources) {
    return;
  }
  var source = find(sources, function (source) {
    return !!source.node && isElementNode(source.node);
  });
  return source && source.node;
}
var MAX_WINDOW_DURATION = 5 * ONE_SECOND;
var MAX_UPDATE_GAP = ONE_SECOND;
function slidingSessionWindow() {
  var cumulatedValue = 0;
  var startTime;
  var endTime;
  var maxValue = 0;
  return {
    update: function (entry) {
      var shouldCreateNewWindow = startTime === undefined || entry.startTime - endTime >= MAX_UPDATE_GAP || entry.startTime - startTime >= 5 * MAX_WINDOW_DURATION;
      var isMaxValue;
      if (shouldCreateNewWindow) {
        startTime = endTime = entry.startTime;
        maxValue = cumulatedValue = entry.value;
        isMaxValue = true;
      } else {
        cumulatedValue += entry.value;
        endTime = entry.startTime;
        isMaxValue = entry.value > maxValue;
        if (isMaxValue) {
          maxValue = entry.value;
        }
      }
      return {
        cumulatedValue: cumulatedValue,
        isMaxValue: isMaxValue
      };
    }
  };
}

/**
 * Check whether `layout-shift` is supported by the browser.
 */
function isLayoutShiftSupported() {
  return supportPerformanceTimingEvent(RumPerformanceEntryType.LAYOUT_SHIFT) && 'WeakRef' in window;
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/interactionCountPolyfill.js
/**
 * performance.interactionCount polyfill
 *
 * The interactionCount is an integer which counts the total number of distinct user interactions,
 * for which there was a unique interactionId.
 *
 * The interactionCount polyfill is an estimate based on a convention specific to Chrome. Cf: https://github.com/GoogleChrome/web-vitals/pull/213
 * This is currently not an issue as the polyfill is only used for INP which is currently only supported on Chrome.
 * Hopefully when/if other browsers will support INP, they will also implement performance.interactionCount at the same time, so we won't need that polyfill.
 *
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/polyfills/interactionCountPolyfill.ts
 */


var observer;
var interactionCountEstimate = 0;
var minKnownInteractionId = Infinity;
var maxKnownInteractionId = 0;
function initInteractionCountPolyfill() {
  if ('interactionCount' in performance || observer) {
    return;
  }
  observer = new window.PerformanceObserver(monitor(function (entries) {
    entries.getEntries().forEach(function (e) {
      const entry = e;
      if (entry.interactionId) {
        minKnownInteractionId = Math.min(minKnownInteractionId, entry.interactionId);
        maxKnownInteractionId = Math.max(maxKnownInteractionId, entry.interactionId);
        interactionCountEstimate = (maxKnownInteractionId - minKnownInteractionId) / 7 + 1;
      }
    });
  }));
  observer.observe({
    type: 'event',
    buffered: true,
    durationThreshold: 0
  });
}

/**
 * Returns the `interactionCount` value using the native API (if available)
 * or the polyfill estimate in this module.
 */
var getInteractionCount = function () {
  return observer ? interactionCountEstimate : window.performance.interactionCount || 0;
};
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/actions/interactionSelectorCache.js


// Maximum duration for click actions
const CLICK_ACTION_MAX_DURATION = 10 * ONE_SECOND;
const interactionSelectorCache = new Map();
function getInteractionSelector(relativeTimestamp) {
  const selector = interactionSelectorCache.get(relativeTimestamp);
  interactionSelectorCache.delete(relativeTimestamp);
  return selector;
}
function updateInteractionSelector(relativeTimestamp, selector) {
  interactionSelectorCache.set(relativeTimestamp, selector);
  interactionSelectorCache.forEach(function (_, relativeTimestamp) {
    if (elapsed(relativeTimestamp, relativeNow()) > CLICK_ACTION_MAX_DURATION) {
      interactionSelectorCache.delete(relativeTimestamp);
    }
  });
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackInteractionToNextPaint.js





// Arbitrary value to prevent unnecessary memory usage on views with lots of interactions.
var MAX_INTERACTION_ENTRIES = 10;
var MAX_INP_VALUE = 1 * ONE_MINUTE;

/**
 * Track the interaction to next paint (INP).
 * To avoid outliers, return the p98 worst interaction of the view.
 * Documentation: https://web.dev/inp/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/main/src/onINP.ts
 */
function trackInteractionToNextPaint(configuration, viewStart, viewLoadingType) {
  if (!isInteractionToNextPaintSupported()) {
    return {
      getInteractionToNextPaint: function () {
        return undefined;
      },
      setViewEnd: tools_noop,
      stop: tools_noop
    };
  }
  var _trackViewInteractionCount = trackViewInteractionCount(viewLoadingType);
  var getViewInteractionCount = _trackViewInteractionCount.getViewInteractionCount;
  var stopViewInteractionCount = _trackViewInteractionCount.stopViewInteractionCount;
  let viewEnd = Infinity;
  var longestInteractions = trackLongestInteractions(getViewInteractionCount);
  var interactionToNextPaint = -1;
  var interactionToNextPaintTargetSelector;
  var interactionToNextPaintStartTime;
  function handleEntries(entries) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      if (entry.interactionId && entry.startTime >= viewStart && entry.startTime <= viewEnd) {
        longestInteractions.process(entry);
      }
    }
    var newInteraction = longestInteractions.estimateP98Interaction();
    if (newInteraction && newInteraction.duration !== interactionToNextPaint) {
      interactionToNextPaint = newInteraction.duration;
      interactionToNextPaintStartTime = tools_elapsed(viewStart, newInteraction.startTime);
      interactionToNextPaintTargetSelector = getInteractionSelector(newInteraction.startTime);
      if (!interactionToNextPaintTargetSelector && newInteraction.target && isElementNode(newInteraction.target)) {
        interactionToNextPaintTargetSelector = getSelectorFromElement(newInteraction.target, configuration.actionNameAttribute);
      }
    }
  }
  var firstInputSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.FIRST_INPUT,
    buffered: true
  }).subscribe(handleEntries);
  var eventSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.EVENT,
    // durationThreshold only impact PerformanceEventTiming entries used for INP computation which requires a threshold at 40 (default is 104ms)
    // cf: https://github.com/GoogleChrome/web-vitals/blob/3806160ffbc93c3c4abf210a167b81228172b31c/src/onINP.ts#L202-L210
    durationThreshold: 40,
    buffered: true
  }).subscribe(handleEntries);
  return {
    getInteractionToNextPaint: function () {
      // If no INP duration where captured because of the performanceObserver 40ms threshold
      // but the view interaction count > 0 then report 0
      if (interactionToNextPaint >= 0) {
        return {
          value: Math.min(interactionToNextPaint, MAX_INP_VALUE),
          targetSelector: interactionToNextPaintTargetSelector,
          time: interactionToNextPaintStartTime
        };
      } else if (getViewInteractionCount()) {
        return {
          value: 0
        };
      }
    },
    setViewEnd: function (viewEndTime) {
      viewEnd = viewEndTime;
      stopViewInteractionCount();
    },
    stop: function () {
      eventSubscription.unsubscribe();
      firstInputSubscription.unsubscribe();
    }
  };
}
function trackLongestInteractions(getViewInteractionCount) {
  var longestInteractions = [];
  function sortAndTrimLongestInteractions() {
    longestInteractions.sort(function (a, b) {
      return b.duration - a.duration;
    }).splice(MAX_INTERACTION_ENTRIES);
  }
  return {
    /**
     * Process the performance entry:
     * - if its duration is long enough, add the performance entry to the list of worst interactions
     * - if an entry with the same interaction id exists and its duration is lower than the new one, then replace it in the list of worst interactions
     */
    process: function (entry) {
      var interactionIndex = longestInteractions.findIndex(function (interaction) {
        return entry.interactionId === interaction.interactionId;
      });
      var minLongestInteraction = longestInteractions[longestInteractions.length - 1];
      if (interactionIndex !== -1) {
        if (entry.duration > longestInteractions[interactionIndex].duration) {
          longestInteractions[interactionIndex] = entry;
          sortAndTrimLongestInteractions();
        }
      } else if (longestInteractions.length < MAX_INTERACTION_ENTRIES || entry.duration > minLongestInteraction.duration) {
        longestInteractions.push(entry);
        sortAndTrimLongestInteractions();
      }
    },
    /**
     * Compute the p98 longest interaction.
     * For better performance the computation is based on 10 longest interactions and the interaction count of the current view.
     */
    estimateP98Interaction: function () {
      var interactionIndex = Math.min(longestInteractions.length - 1, Math.floor(getViewInteractionCount() / 50));
      return longestInteractions[interactionIndex];
    }
  };
}
function trackViewInteractionCount(viewLoadingType) {
  initInteractionCountPolyfill();
  var previousInteractionCount = viewLoadingType === ViewLoadingType.INITIAL_LOAD ? 0 : getInteractionCount();
  var state = {
    stopped: false
  };
  function computeViewInteractionCount() {
    return getInteractionCount() - previousInteractionCount;
  }
  return {
    getViewInteractionCount: function () {
      if (state.stopped) {
        return state.interactionCount;
      }
      return computeViewInteractionCount();
    },
    stopViewInteractionCount: function () {
      state = {
        stopped: true,
        interactionCount: computeViewInteractionCount()
      };
    }
  };
}
function isInteractionToNextPaintSupported() {
  return supportPerformanceTimingEvent('event') && window.PerformanceEventTiming && 'interactionId' in PerformanceEventTiming.prototype;
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackCommonViewMetrics.js




function trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, viewStart) {
  var commonViewMetrics = {};
  var _trackLoadingTime = trackLoadingTime(lifeCycle, domMutationObservable, configuration, loadingType, viewStart, function (newLoadingTime) {
    commonViewMetrics.loadingTime = newLoadingTime;
    scheduleViewUpdate();
  });
  var stopLoadingTimeTracking = _trackLoadingTime.stop;
  var setLoadEvent = _trackLoadingTime.setLoadEvent;
  var _trackScrollMetrics = trackScrollMetrics(configuration, viewStart, function (newScrollMetrics) {
    commonViewMetrics.scroll = newScrollMetrics;
  });
  var stopScrollMetricsTracking = _trackScrollMetrics.stop;
  var stopCLSTracking;
  var _trackCumulativeLayoutShift = trackCumulativeLayoutShift(configuration, viewStart.relative, function (cumulativeLayoutShift) {
    commonViewMetrics.cumulativeLayoutShift = cumulativeLayoutShift;
    scheduleViewUpdate();
  });
  var stopCLSTracking = _trackCumulativeLayoutShift.stop;
  var _trackInteractionToNextPaint = trackInteractionToNextPaint(configuration, viewStart.relative, loadingType);
  var stopINPTracking = _trackInteractionToNextPaint.stop;
  var getInteractionToNextPaint = _trackInteractionToNextPaint.getInteractionToNextPaint;
  var setViewEnd = _trackInteractionToNextPaint.setViewEnd;
  return {
    stop: function () {
      stopLoadingTimeTracking();
      stopCLSTracking();
      stopScrollMetricsTracking();
    },
    stopINPTracking: stopINPTracking,
    setLoadEvent: setLoadEvent,
    setViewEnd: setViewEnd,
    getCommonViewMetrics: function () {
      commonViewMetrics.interactionToNextPaint = getInteractionToNextPaint();
      return commonViewMetrics;
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/trackEventCounts.js

function trackEventCounts(data) {
  var lifeCycle = data.lifeCycle;
  var isChildEvent = data.isChildEvent;
  var callback = data.onChange;
  if (callback === undefined) {
    callback = tools_noop;
  }
  var eventCounts = {
    errorCount: 0,
    longTaskCount: 0,
    resourceCount: 0,
    actionCount: 0,
    frustrationCount: 0
  };
  var subscription = lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_COLLECTED, function (event) {
    if (event.type === RumEventType.VIEW || !isChildEvent(event)) {
      return;
    }
    switch (event.type) {
      case RumEventType.ERROR:
        eventCounts.errorCount += 1;
        callback();
        break;
      case RumEventType.ACTION:
        if (event.action.frustration) {
          eventCounts.frustrationCount += event.action.frustration.type.length;
        }
        eventCounts.actionCount += 1;
        callback();
        break;
      case RumEventType.LONG_TASK:
        eventCounts.longTaskCount += 1;
        callback();
        break;
      case RumEventType.RESOURCE:
        eventCounts.resourceCount += 1;
        callback();
        break;
    }
  });
  return {
    stop: function () {
      subscription.unsubscribe();
    },
    eventCounts: eventCounts
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackViewEventCounts.js

function trackViewEventCounts(lifeCycle, viewId, onChange) {
  var _trackEventCounts = trackEventCounts({
    lifeCycle: lifeCycle,
    isChildEvent: function (event) {
      return event.view.id === viewId;
    },
    onChange: onChange
  });
  return {
    stop: _trackEventCounts.stop,
    eventCounts: _trackEventCounts.eventCounts
  };
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/trackViews.js




var THROTTLE_VIEW_UPDATE_PERIOD = 3000;
var SESSION_KEEP_ALIVE_INTERVAL = 5 * ONE_MINUTE;
var KEEP_TRACKING_AFTER_VIEW_DELAY = 5 * ONE_MINUTE;
function trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, areViewsTrackedAutomatically, initialViewOptions) {
  var activeViews = new Set();
  function startNewView(loadingType, startClocks, viewOptions) {
    var newlyCreatedView = newView(lifeCycle, domMutationObservable, configuration, location, loadingType, startClocks, viewOptions);
    activeViews.add(newlyCreatedView);
    newlyCreatedView.stopObservable.subscribe(function () {
      activeViews.delete(newlyCreatedView);
    });
    return newlyCreatedView;
  }
  var currentView = startNewView(ViewLoadingType.INITIAL_LOAD, clocksOrigin(), initialViewOptions);
  startViewLifeCycle();
  var locationChangeSubscription;
  if (areViewsTrackedAutomatically) {
    locationChangeSubscription = renewViewOnLocationChange(locationChangeObservable);
  }
  function startViewLifeCycle() {
    lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, function () {
      currentView = startNewView(ViewLoadingType.ROUTE_CHANGE, undefined, {
        name: currentView.name,
        service: currentView.service,
        version: currentView.version,
        context: currentView.contextManager.getContext()
      });
    });
    lifeCycle.subscribe(LifeCycleEventType.SESSION_EXPIRED, function () {
      currentView.end({
        sessionIsActive: false
      });
    });
    // // End the current view on page unload
    // lifeCycle.subscribe(
    //   LifeCycleEventType.PAGE_EXITED,
    //   function (pageExitEvent) {
    //     if (pageExitEvent.reason === PageExitReason.UNLOADING) {
    //       currentView.end()
    //     }
    //   }
    // )
  }
  function renewViewOnLocationChange(locationChangeObservable) {
    return locationChangeObservable.subscribe(function (params) {
      var oldLocation = params.oldLocation;
      var newLocation = params.newLocation;
      if (areDifferentLocation(oldLocation, newLocation)) {
        currentView.end();
        currentView = startNewView(ViewLoadingType.ROUTE_CHANGE);
        return;
      }
    });
  }
  return {
    addTiming: function (name, time) {
      if (typeof time === 'undefined') {
        time = timeStampNow();
      }
      currentView.addTiming(name, time);
    },
    startView: function (options, startClocks) {
      currentView.end({
        endClocks: startClocks
      });
      currentView = startNewView(ViewLoadingType.ROUTE_CHANGE, startClocks, options);
    },
    setViewContext: context => {
      currentView.contextManager.setContext(context);
    },
    setViewContextProperty: (key, value) => {
      currentView.contextManager.setContextProperty(key, value);
    },
    setViewName: name => {
      currentView.setViewName(name);
    },
    getViewContext: () => currentView.contextManager.getContext(),
    stop: function () {
      if (locationChangeSubscription) {
        locationChangeSubscription.unsubscribe();
      }
      currentView.end();
      activeViews.forEach(function (view) {
        view.stop();
      });
    }
  };
}
function newView(lifeCycle, domMutationObservable, configuration, initialLocation, loadingType, startClocks, viewOptions) {
  // Setup initial values
  if (startClocks === undefined) {
    startClocks = clocksNow();
  }
  var id = UUID();
  var stopObservable = new Observable();
  var customTimings = {};
  var documentVersion = 0;
  var endClocks;
  var location = shallowClone(initialLocation);
  const contextManager = createContextManager();
  var sessionIsActive = true;
  var name;
  var service;
  var version;
  var context;
  if (viewOptions) {
    name = viewOptions.name;
    service = viewOptions.service;
    version = viewOptions.version;
    context = viewOptions.context;
  }
  if (context) {
    contextManager.setContext(context);
  }
  var viewCreatedEvent = {
    id: id,
    name: name,
    startClocks: startClocks,
    service: service,
    version: version
  };
  lifeCycle.notify(LifeCycleEventType.BEFORE_VIEW_CREATED, viewCreatedEvent);
  lifeCycle.notify(LifeCycleEventType.VIEW_CREATED, viewCreatedEvent);

  // Update the view every time the measures are changing
  var _scheduleViewUpdate = throttle(triggerViewUpdate, THROTTLE_VIEW_UPDATE_PERIOD, {
    leading: false
  });
  var throttled = _scheduleViewUpdate.throttled;
  var cancelScheduleViewUpdate = _scheduleViewUpdate.cancel;
  var _trackCommonViewMetrics = trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, startClocks);
  var setLoadEvent = _trackCommonViewMetrics.setLoadEvent;
  var stopCommonViewMetricsTracking = _trackCommonViewMetrics.stop;
  var getCommonViewMetrics = _trackCommonViewMetrics.getCommonViewMetrics;
  var stopINPTracking = _trackCommonViewMetrics.stopINPTracking;
  var setViewEnd = _trackCommonViewMetrics.setViewEnd;
  var _trackInitialViewTimings = loadingType === ViewLoadingType.INITIAL_LOAD ? trackInitialViewMetrics(configuration, startClocks, setLoadEvent, scheduleViewUpdate) : {
    stop: tools_noop,
    initialViewMetrics: {}
  };
  var stopInitialViewMetricsTracking = _trackInitialViewTimings.stop;
  var initialViewMetrics = _trackInitialViewTimings.initialViewMetrics;
  var _trackViewEventCounts = trackViewEventCounts(lifeCycle, id, scheduleViewUpdate);
  var stopEventCountsTracking = _trackViewEventCounts.stop;
  var eventCounts = _trackViewEventCounts.eventCounts;

  // Session keep alive
  var keepAliveIntervalId = timer_setInterval(triggerViewUpdate, SESSION_KEEP_ALIVE_INTERVAL);
  const pageMayExitSubscription = lifeCycle.subscribe(LifeCycleEventType.PAGE_EXITED, pageMayExitEvent => {
    if (pageMayExitEvent.reason === PageExitReason.UNLOADING) {
      triggerViewUpdate();
    }
  });
  triggerViewUpdate();
  // View context update should always be throttled
  contextManager.changeObservable.subscribe(scheduleViewUpdate);
  function triggerBeforeViewUpdate() {
    lifeCycle.notify(LifeCycleEventType.BEFORE_VIEW_UPDATED, {
      id,
      name,
      context: contextManager.getContext(),
      startClocks
    });
  }
  function scheduleViewUpdate() {
    triggerBeforeViewUpdate();
    throttled();
  }
  function triggerViewUpdate() {
    cancelScheduleViewUpdate();
    triggerBeforeViewUpdate();
    documentVersion += 1;
    var currentEnd = endClocks === undefined ? timeStampNow() : endClocks.timeStamp;
    lifeCycle.notify(LifeCycleEventType.VIEW_UPDATED, {
      customTimings: customTimings,
      documentVersion: documentVersion,
      id: id,
      name: name,
      service: service,
      version: version,
      context: contextManager.getContext(),
      loadingType: loadingType,
      location: location,
      startClocks: startClocks,
      commonViewMetrics: getCommonViewMetrics(),
      initialViewMetrics: initialViewMetrics,
      duration: tools_elapsed(startClocks.timeStamp, currentEnd),
      isActive: endClocks === undefined,
      sessionIsActive: sessionIsActive,
      eventCounts: eventCounts
    });
  }
  var result = {
    name: name,
    service: service,
    version: version,
    contextManager: contextManager,
    stopObservable: stopObservable,
    end: function (options) {
      if (endClocks) {
        // view already ended
        return;
      }
      endClocks = isNullUndefinedDefaultValue(options && options.endClocks, clocksNow());
      sessionIsActive = isNullUndefinedDefaultValue(options && options.sessionIsActive, true);
      lifeCycle.notify(LifeCycleEventType.VIEW_ENDED, {
        endClocks: endClocks
      });
      lifeCycle.notify(LifeCycleEventType.AFTER_VIEW_ENDED, {
        endClocks: endClocks
      });
      timer_clearInterval(keepAliveIntervalId);
      setViewEnd(endClocks.relative);
      stopCommonViewMetricsTracking();
      pageMayExitSubscription.unsubscribe();
      triggerViewUpdate();
      timer_setTimeout(function () {
        result.stop();
      }, KEEP_TRACKING_AFTER_VIEW_DELAY);
    },
    stop: function () {
      stopInitialViewMetricsTracking();
      stopEventCountsTracking();
      stopINPTracking();
      stopObservable.notify();
    },
    addTiming: function (name, time) {
      if (endClocks) {
        return;
      }
      var relativeTime = looksLikeRelativeTime(time) ? time : tools_elapsed(startClocks.timeStamp, time);
      customTimings[sanitizeTiming(name)] = relativeTime;
      scheduleViewUpdate();
    },
    setViewName(updatedName) {
      name = updatedName;
      triggerViewUpdate();
    }
  };
  return result;
}

/**
 * Timing name is used as facet path that must contain only letters, digits, or the characters - _ . @ $
 */
function sanitizeTiming(name) {
  var sanitized = name.replace(/[^a-zA-Z0-9-_.@$]/g, '_');
  if (sanitized !== name) {
    console.warn('Invalid timing name: ' + name + ', sanitized to: ' + sanitized);
  }
  return sanitized;
}
function areDifferentLocation(currentLocation, otherLocation) {
  return currentLocation.pathname !== otherLocation.pathname || !isHashAnAnchor(otherLocation.hash) && getPathFromHash(otherLocation.hash) !== getPathFromHash(currentLocation.hash);
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/view/viewCollection.js


function startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions) {
  lifeCycle.subscribe(LifeCycleEventType.VIEW_UPDATED, function (view) {
    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processViewUpdate(view, configuration, recorderApi, pageStateHistory));
  });
  return trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, !configuration.trackViewsManually, initialViewOptions);
}
function computePerformanceViewDetails(navigationTimings) {
  if (!navigationTimings) {
    return undefined;
  }
  var fetchStart = navigationTimings.fetchStart,
    responseEnd = navigationTimings.responseEnd,
    domInteractive = navigationTimings.domInteractive,
    domContentLoaded = navigationTimings.domContentLoaded,
    domComplete = navigationTimings.domComplete,
    loadEventEnd = navigationTimings.loadEventEnd,
    loadEventStart = navigationTimings.loadEventStart,
    domContentLoadedEventEnd = navigationTimings.domContentLoadedEventEnd;
  var details = {};
  if (isNumber(responseEnd) && isNumber(fetchStart) && responseEnd !== fetchStart && responseEnd > fetchStart) {
    details.fpt = toServerDuration(responseEnd - fetchStart);
    var apdexLevel = parseInt((responseEnd - fetchStart) / 1000);
    details.apdexLevel = apdexLevel > 9 ? 9 : apdexLevel;
  }
  if (isNumber(domInteractive) && isNumber(fetchStart) && domInteractive !== fetchStart && domInteractive > fetchStart) {
    details.tti = toServerDuration(domInteractive - fetchStart);
  }
  if (isNumber(domContentLoaded) && isNumber(fetchStart) && domContentLoaded !== fetchStart && domContentLoaded > fetchStart) {
    details.dom_ready = toServerDuration(domContentLoaded - fetchStart);
  }
  // Make sure a connection occurred
  if (isNumber(loadEventEnd) && isNumber(fetchStart) && loadEventEnd !== fetchStart && loadEventEnd > fetchStart) {
    details.load = toServerDuration(loadEventEnd - fetchStart);
  }
  if (isNumber(loadEventStart) && isNumber(domContentLoadedEventEnd) && loadEventStart !== domContentLoadedEventEnd && loadEventStart > domContentLoadedEventEnd) {
    details.resource_load_time = toServerDuration(loadEventStart - domContentLoadedEventEnd);
  }
  if (isNumber(domComplete) && isNumber(domInteractive) && domComplete !== domInteractive && domComplete > domInteractive) {
    details.dom = toServerDuration(domComplete - domInteractive);
  }
  return details;
}
function processViewUpdate(view, configuration, recorderApi, pageStateHistory) {
  // var replayStats = recorderApi.getReplayStats(view.id)
  var pageStates = pageStateHistory.findAll(view.startClocks.relative, view.duration);
  var viewEvent = {
    _gc: {
      document_version: view.documentVersion,
      // replay_stats: replayStats,
      page_states: pageStates,
      view_update_time: view.documentVersion
    },
    date: view.startClocks.timeStamp,
    type: RumEventType.VIEW,
    view: {
      action: {
        count: view.eventCounts.actionCount
      },
      frustration: {
        count: view.eventCounts.frustrationCount
      },
      cumulative_layout_shift: findByPath(view.commonViewMetrics, 'cumulativeLayoutShift.value'),
      cumulative_layout_shift_time: findByPath(view.commonViewMetrics, 'cumulativeLayoutShift.time'),
      cumulative_layout_shift_target_selector: findByPath(view.commonViewMetrics, 'cumulativeLayoutShift.targetSelector'),
      first_byte: toServerDuration(findByPath(view.initialViewMetrics, 'navigationTimings.firstByte')),
      dom_complete: toServerDuration(findByPath(view.initialViewMetrics, 'navigationTimings.domComplete')),
      dom_content_loaded: toServerDuration(findByPath(view.initialViewMetrics, 'navigationTimings.domContentLoaded')),
      dom_interactive: toServerDuration(findByPath(view.initialViewMetrics, 'navigationTimings.domInteractive')),
      error: {
        count: view.eventCounts.errorCount
      },
      first_contentful_paint: toServerDuration(findByPath(view.initialViewMetrics, 'firstContentfulPaint')),
      first_input_delay: toServerDuration(findByPath(view.initialViewMetrics, 'firstInput.delay')),
      first_input_time: toServerDuration(findByPath(view.initialViewMetrics, 'firstInput.time')),
      first_input_target_selector: findByPath(view.initialViewMetrics, 'firstInput.targetSelector'),
      interaction_to_next_paint: toServerDuration(findByPath(view.commonViewMetrics, 'interactionToNextPaint.value')),
      interaction_to_next_paint_target_selector: findByPath(view.commonViewMetrics, 'interactionToNextPaint.targetSelector'),
      is_active: view.isActive,
      name: view.name,
      largest_contentful_paint: toServerDuration(findByPath(view.initialViewMetrics, 'largestContentfulPaint.value')),
      largest_contentful_paint_element_selector: findByPath(view.initialViewMetrics, 'largestContentfulPaint.targetSelector'),
      load_event: toServerDuration(findByPath(view.initialViewMetrics, 'navigationTimings.loadEvent')),
      loading_time: discardNegativeDuration(toServerDuration(view.commonViewMetrics.loadingTime)),
      loading_type: view.loadingType,
      long_task: {
        count: view.eventCounts.longTaskCount
      },
      resource: {
        count: view.eventCounts.resourceCount
      },
      time_spent: toServerDuration(view.duration)
    },
    display: view.commonViewMetrics.scroll ? {
      scroll: {
        max_depth: view.commonViewMetrics.scroll.maxDepth,
        max_depth_scroll_top: view.commonViewMetrics.scroll.maxDepthScrollTop,
        max_scroll_height: view.commonViewMetrics.scroll.maxScrollHeight,
        max_scroll_height_time: toServerDuration(view.commonViewMetrics.scroll.maxScrollHeightTime)
      }
    } : undefined,
    session: {
      // has_replay: replayStats ? true : undefined,
      is_active: view.sessionIsActive ? undefined : false
    },
    privacy: {
      replay_level: configuration.defaultPrivacyLevel
    }
  };
  if (!isEmptyObject(view.customTimings)) {
    viewEvent.view.custom_timings = mapValues(view.customTimings, toServerDuration);
  }
  viewEvent = extend2Lev(viewEvent, {
    view: computePerformanceViewDetails(view.initialViewMetrics.navigationTimings)
  });
  return {
    rawRumEvent: viewEvent,
    startTime: view.startClocks.relative,
    domainContext: {
      location: view.location
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/tracing/tracer.js

// import { DDtraceTracer } from './ddtraceTracer'
// import { SkyWalkingTracer } from './skywalkingTracer'
// import { JaegerTracer } from './jaegerTracer'
// import { ZipkinSingleTracer } from './zipkinSingleTracer'
// import { ZipkinMultiTracer } from './zipkinMultiTracer'
// import { W3cTraceParentTracer } from './w3cTraceParentTracer'
// import { isTraceSampled } from './sampler'
function isTracingOption(item) {
  var expectedItem = item;
  return getType(expectedItem) === 'object' && isMatchOption(expectedItem.match) && isString(expectedItem.traceType);
}
function clearTracingIfNeeded(context) {
  if (context.status === 0 && !context.isAborted) {
    context.traceId = undefined;
    context.spanId = undefined;
    context.traceSampled = undefined;
  }
}
function startTracer(configuration, sessionManager) {
  return {
    clearTracingIfNeeded: clearTracingIfNeeded,
    traceFetch: function (context) {
      return injectHeadersIfTracingAllowed(configuration, context, sessionManager, function (tracingHeaders) {
        if (context.input instanceof Request && (!context.init || !context.init.headers)) {
          context.input = new Request(context.input);
          each(tracingHeaders, function (value, key) {
            context.input.headers.append(key, value);
          });
        } else {
          context.init = shallowClone(context.init);
          var headers = [];
          if (context.init.headers instanceof Headers) {
            context.init.headers.forEach(function (value, key) {
              headers.push([key, value]);
            });
          } else if (isArray(context.init.headers)) {
            each(context.init.headers, function (header) {
              headers.push(header);
            });
          } else if (context.init.headers) {
            each(context.init.headers, function (value, key) {
              headers.push([key, value]);
            });
          }
          // context.init.headers = headers.concat(objectEntries(tracingHeaders))
          var headersMap = {};
          each(headers.concat(objectEntries(tracingHeaders)), function (header) {
            headersMap[header[0]] = header[1];
          });
          context.init.headers = headersMap;
        }
      });
    },
    traceXhr: function (context, xhr) {
      return injectHeadersIfTracingAllowed(configuration, context, sessionManager, function (tracingHeaders) {
        each(tracingHeaders, function (value, name) {
          xhr.setRequestHeader(name, value);
        });
      });
    }
  };
}
function injectHeadersIfTracingAllowed(configuration, context, sessionManager, inject) {
  return;
  // const session = sessionManager.findTrackedSession()
  // if (!session) {
  //   return
  // }
  // var tracingOption = find(
  //   configuration.allowedTracingUrls,
  //   function (tracingOption) {
  //     return matchList([tracingOption.match], context.url, true)
  //   }
  // )
  // if (!tracingOption) {
  //   return
  // }
  // const traceSampled = isTraceSampled(
  //   session.id,
  //   configuration.tracingSampleRate
  // )

  // if (!traceSampled) return
  // var tracer,
  //   traceType = tracingOption.traceType
  // switch (traceType) {
  //   case TraceType.DDTRACE:
  //     tracer = new DDtraceTracer(configuration, traceSampled)
  //     break
  //   case TraceType.SKYWALKING_V3:
  //     tracer = new SkyWalkingTracer(configuration, context.url, traceSampled)
  //     break
  //   case TraceType.ZIPKIN_MULTI_HEADER:
  //     tracer = new ZipkinMultiTracer(configuration, traceSampled)
  //     break
  //   case TraceType.JAEGER:
  //     tracer = new JaegerTracer(configuration, traceSampled)
  //     break
  //   case TraceType.W3C_TRACEPARENT:
  //     tracer = new W3cTraceParentTracer(configuration, traceSampled)
  //     break
  //   case TraceType.W3C_TRACEPARENT_64:
  //     tracer = new W3cTraceParentTracer(configuration, traceSampled, true)
  //     break
  //   case TraceType.ZIPKIN_SINGLE_HEADER:
  //     tracer = new ZipkinSingleTracer(configuration, traceSampled)
  //     break
  //   default:
  //     break
  // }
  // if (!tracer || !tracer.isTracingSupported()) {
  //   return
  // }

  // context.traceId = tracer.getTraceId()
  // context.spanId = tracer.getSpanId()
  // context.traceSampled = traceSampled
  // var headers = tracer.makeTracingHeaders()
  // if (configuration.injectTraceHeader) {
  //   var result = configuration.injectTraceHeader(shallowClone(context))
  //   if (getType(result) === 'object') {
  //     each(result, function (value, key) {
  //       if (getType(value) === 'string') {
  //         headers[key] = value
  //       }
  //     })
  //   }
  // }
  // inject(headers)
}
;// CONCATENATED MODULE: ./src/domain/requestCollection.js



var nextRequestIndex = 1;
function startRequestCollection(lifeCycle, configuration, sessionManager) {
  var tracer = startTracer(configuration, sessionManager);
  trackXhr(lifeCycle, configuration, tracer);
  trackFetch(lifeCycle, configuration, tracer);
}
function trackXhr(lifeCycle, configuration, tracer) {
  var subscription = initXhrObservable().subscribe(function (rawContext) {
    var context = rawContext;
    if (!isAllowedRequestUrl(configuration, context.url)) {
      return;
    }
    switch (context.state) {
      case 'start':
        tracer.traceXhr(context, context.xhr);
        context.requestIndex = getNextRequestIndex();
        lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
          requestIndex: context.requestIndex,
          url: context.url
        });
        break;
      case 'complete':
        tracer.clearTracingIfNeeded(context);
        lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
          duration: context.duration,
          method: context.method,
          requestIndex: context.requestIndex,
          spanId: context.spanId,
          startClocks: context.startClocks,
          status: context.status,
          traceId: context.traceId,
          traceSampled: context.traceSampled,
          type: RequestType.XHR,
          url: context.url,
          xhr: context.xhr,
          isAborted: context.isAborted,
          requestHeaderContexts: context.requestHeaderContexts,
          handlingStack: context.handlingStack
        });
        break;
    }
  });
  return {
    stop: function () {
      return subscription.unsubscribe();
    }
  };
}
function trackFetch(lifeCycle, configuration, tracer) {
  var subscription = initFetchObservable().subscribe(function (rawContext) {
    var context = rawContext;
    if (!isAllowedRequestUrl(configuration, context.url)) {
      return;
    }
    switch (context.state) {
      case 'start':
        tracer.traceFetch(context);
        context.requestIndex = getNextRequestIndex();
        lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
          requestIndex: context.requestIndex,
          url: context.url
        });
        break;
      case 'resolve':
        waitForResponseToComplete(context, function (duration) {
          var _context$init;
          tracer.clearTracingIfNeeded(context);
          lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
            duration: duration,
            method: context.method,
            requestIndex: context.requestIndex,
            responseType: context.responseType,
            spanId: context.spanId,
            startClocks: context.startClocks,
            status: context.status,
            traceId: context.traceId,
            traceSampled: context.traceSampled,
            requestHeaderContexts: (_context$init = context.init) === null || _context$init === void 0 ? void 0 : _context$init.headers,
            type: RequestType.FETCH,
            url: context.url,
            response: context.response,
            init: context.init,
            input: context.input,
            isAborted: context.isAborted,
            handlingStack: context.handlingStack
          });
        });
        break;
    }
  });
  return {
    stop: function () {
      return subscription.unsubscribe();
    }
  };
}
function getNextRequestIndex() {
  var result = nextRequestIndex;
  nextRequestIndex += 1;
  return result;
}
function waitForResponseToComplete(context, callback) {
  var clonedResponse = context.response && tryToClone(context.response);
  if (!clonedResponse || !clonedResponse.body) {
    // do not try to wait for the response if the clone failed, fetch error or null body
    callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
  } else {
    readBytesFromStream(clonedResponse.body, function () {
      callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
    }, {
      bytesLimit: Number.POSITIVE_INFINITY,
      collectStreamBody: false
    });
  }
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/resource/matchRequestResourceEntry.js


var alreadyMatchedEntries = new polyfills_WeakSet();
/**
 * Look for corresponding timing in resource timing buffer
 *
 * Observations:
 * - Timing (start, end) are nested inside the request (start, end)
 * - Browsers generate a timing entry for OPTIONS request
 *
 * Strategy:
 * - from valid nested entries
 * - if a single timing match, return the timing
 * - if two following timings match (OPTIONS request), return the timing for the actual request
 * - otherwise we can't decide, return undefined
 */
function matchRequestResourceEntry(request) {
  if (!performance || !('getEntriesByName' in performance)) {
    return;
  }
  var sameNameEntries = performance.getEntriesByName(request.url, 'resource');
  if (!sameNameEntries.length || !('toJSON' in sameNameEntries[0])) {
    return;
  }
  var candidates = filter(sameNameEntries, function (entry) {
    return !alreadyMatchedEntries.has(entry);
  });
  candidates = filter(candidates, function (entry) {
    return hasValidResourceEntryDuration(entry) && hasValidResourceEntryTimings(entry);
  });
  candidates = filter(candidates, function (entry) {
    return isBetween(entry, request.startClocks.relative, endTime({
      startTime: request.startClocks.relative,
      duration: request.duration
    }));
  });
  let lastEntry = undefined;
  if (candidates.length > 1) {
    let startTimeDuration = Number.MAX_SAFE_INTEGER;
    candidates.forEach(entry => {
      const _startTimeDuration = Math.abs(entry.startTime - request.startClocks.relative);
      if (_startTimeDuration < startTimeDuration) {
        startTimeDuration = _startTimeDuration;
        lastEntry = entry;
      }
    });
  } else if (candidates.length === 1) {
    lastEntry = candidates[0];
  }
  if (lastEntry) {
    alreadyMatchedEntries.add(lastEntry);
    return lastEntry.toJSON();
  }
  return;
}
function endTime(timing) {
  return addDuration(timing.startTime, timing.duration);
}
function isBetween(timing, start, end) {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  var errorMargin = 1;
  return timing.startTime >= start - errorMargin && endTime(timing) <= addDuration(end, errorMargin);
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/resource/retrieveInitialDocumentResourceTiming.js




function retrieveInitialDocumentResourceTiming(configuration, callback) {
  runOnReadyState('interactive', function () {
    var entry = tools_assign(getNavigationEntry().toJSON(), {
      entryType: RumPerformanceEntryType.RESOURCE,
      initiatorType: FAKE_INITIAL_DOCUMENT,
      toJSON: function () {
        return tools_assign({}, entry, {
          toJSON: undefined
        });
      }
    });
    callback(entry);
  });
}
;// CONCATENATED MODULE: ./src/domain/rumEventsCollection/resource/resourceCollection.js






function startResourceCollection(lifeCycle, configuration, pageStateHistory, taskQueue, retrieveInitialDocumentResourceTimingImpl) {
  if (taskQueue === undefined) {
    taskQueue = createTaskQueue();
  }
  if (typeof retrieveInitialDocumentResourceTimingImpl === 'undefined') {
    retrieveInitialDocumentResourceTimingImpl = retrieveInitialDocumentResourceTiming;
  }
  lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, function (request) {
    handleResource(function () {
      return processRequest(request, pageStateHistory);
    });
  });
  var performanceResourceSubscription = createPerformanceObservable(configuration, {
    type: RumPerformanceEntryType.RESOURCE,
    buffered: true
  }).subscribe(function (entries) {
    var loop = function (entry) {
      if (!isResourceEntryRequestType(entry) && !isResourceUrlLimit(entry.name, configuration.resourceUrlLimit)) {
        handleResource(function () {
          return processResourceEntry(entry, configuration);
        });
      }
    };
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
      var entry = entries_1[_i];
      loop(entry);
    }
  });
  retrieveInitialDocumentResourceTimingImpl(configuration, function (timing) {
    handleResource(function () {
      return processResourceEntry(timing, configuration);
    });
  });
  function handleResource(computeRawEvent) {
    taskQueue.push(function () {
      const rawEvent = computeRawEvent();
      if (rawEvent) {
        lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, rawEvent);
      }
    });
  }
  return {
    stop: function () {
      performanceResourceSubscription.unsubscribe();
    },
    addResource: (resource, savedCommonContext) => {
      handleResource(function () {
        return extend({
          savedCommonContext: savedCommonContext
        }, processCustomResource(resource));
      });
    }
  };
}
function processRequest(request, pageStateHistory) {
  var matchingTiming = matchRequestResourceEntry(request);
  var startClocks = matchingTiming ? relativeToClocks(matchingTiming.startTime) : request.startClocks;
  var tracingInfo = computeRequestTracingInfo(request);
  var type = request.type === RequestType.XHR ? ResourceType.XHR : ResourceType.FETCH;
  var correspondingTimingOverrides = matchingTiming ? computeResourceEntryMetrics(matchingTiming) : undefined;
  var duration = computeRequestDuration(pageStateHistory, startClocks, request.duration);
  var urlObj = urlParse(request.url).getParse();
  var resourceEvent = extend2Lev({
    date: startClocks.timeStamp,
    resource: {
      id: UUID(),
      type: type,
      duration: duration,
      method: request.method,
      status: request.status,
      statusGroup: getStatusGroup(request.status),
      url: isLongDataUrl(request.url) ? sanitizeDataUrl(request.url) : request.url,
      urlHost: urlObj.Host,
      urlPath: urlObj.Path,
      urlPathGroup: replaceNumberCharByPath(urlObj.Path),
      urlQuery: getQueryParamsFromUrl(request.url),
      deliveryType: matchingTiming && computeResourceEntryDeliveryType(matchingTiming),
      protocol: matchingTiming && computeResourceEntryProtocol(matchingTiming)
    },
    type: RumEventType.RESOURCE
  }, tracingInfo, correspondingTimingOverrides);
  return {
    startTime: startClocks.relative,
    rawRumEvent: resourceEvent,
    domainContext: {
      performanceEntry: matchingTiming,
      xhr: request.xhr,
      requestHeaderContexts: request.requestHeaderContexts,
      response: request.response,
      requestInput: request.input,
      requestInit: request.init,
      error: request.error,
      isAborted: request.isAborted,
      handlingStack: request.handlingStack
    }
  };
}
function processResourceEntry(entry, configuration) {
  var startClocks = relativeToClocks(entry.startTime);
  var tracingInfo = computeResourceEntryTracingInfo(entry);
  var type = computeResourceEntryType(entry);
  var entryMetrics = computeResourceEntryMetrics(entry);
  var urlObj = urlParse(entry.name).getParse();
  var resourceEvent = extend2Lev({
    date: startClocks.timeStamp,
    resource: {
      id: UUID(),
      type: type,
      url: entry.name,
      urlHost: urlObj.Host,
      urlPath: urlObj.Path,
      urlPathGroup: replaceNumberCharByPath(urlObj.Path),
      urlQuery: getQueryParamsFromUrl(entry.name),
      method: 'GET',
      status: discardZeroStatus(entry.responseStatus),
      statusGroup: getStatusGroup(entry.responseStatus),
      deliveryType: computeResourceEntryDeliveryType(entry),
      protocol: computeResourceEntryProtocol(entry)
    },
    type: RumEventType.RESOURCE
  }, tracingInfo, entryMetrics);
  return {
    startTime: startClocks.relative,
    rawRumEvent: resourceEvent,
    domainContext: {
      performanceEntry: entry
    }
  };
}
function processCustomResource(resource) {
  var resourceEvent = {
    date: resource.startClocks.timeStamp,
    resource: {
      id: UUID(),
      type: resource.type
    },
    type: RumEventType.RESOURCE
  };
  return {
    customerContext: resource.context,
    startTime: resource.startClocks.relative,
    rawRumEvent: resourceEvent,
    domainContext: {
      resource: resource
    }
  };
}
function computeResourceEntryMetrics(entry) {
  return {
    resource: extend2Lev({}, {
      duration: computeResourceEntryDuration(entry)
    }, computeResourceEntrySize(entry), computePerformanceResourceDetails(entry))
  };
}
function computeRequestTracingInfo(request) {
  var hasBeenTraced = request.traceSampled && request.traceId && request.spanId;
  if (!hasBeenTraced) {
    return undefined;
  }
  return {
    _gc: {
      spanId: request.spanId,
      traceId: request.traceId
    },
    resource: {
      id: UUID()
    }
  };
}
function computeRequestDuration(pageStateHistory, startClocks, duration) {
  return !pageStateHistory.wasInPageStateDuringPeriod(PageState.FROZEN, startClocks.relative, duration) ? toServerDuration(duration) : undefined;
}
function computeResourceEntryTracingInfo(entry) {
  return entry.traceId ? {
    _gc: {
      traceId: entry.traceId
    }
  } : undefined;
}
/**
 * The status is 0 for cross-origin resources without CORS headers, so the status is meaningless, and we shouldn't report it
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/responseStatus#cross-origin_response_status_codes
 */
function discardZeroStatus(statusCode) {
  return statusCode === 0 ? undefined : statusCode;
}
;// CONCATENATED MODULE: ./src/boot/rum.js





// import { startLongTaskCollection } from '../domain/rumEventsCollection/longTask/longTaskCollection'
// import { startLongAnimationFrameCollection } from '../domain/rumEventsCollection/longTask/longAnimationFrameCollection'
// import { RumPerformanceEntryType } from '../domain/performanceObservable'


// import { startRumEventBridge } from '../transport/startRumEventBridge'










function startRum(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, createEncoder) {
  var cleanupTasks = [];
  var lifeCycle = new LifeCycle();
  // var telemetry = startRumTelemetry(configuration)

  var reportError = function (error) {
    lifeCycle.notify(LifeCycleEventType.RAW_ERROR_COLLECTED, {
      error: error
    });
  };
  var pageExitObservable = createPageExitObservable();
  var pageExitSubscription = pageExitObservable.subscribe(function (event) {
    lifeCycle.notify(LifeCycleEventType.PAGE_EXITED, event);
  });
  cleanupTasks.push(function () {
    pageExitSubscription.unsubscribe();
  });
  var session = !canUseEventBridge() ? startRumSessionManager(configuration, lifeCycle) : startRumSessionManagerStub();
  if (!canUseEventBridge()) {
    var batch = startRumBatch(configuration, lifeCycle, 'telemetry.observable', reportError, pageExitObservable, session.expireObservable, createEncoder);
    cleanupTasks.push(function () {
      batch.stop();
    });
    // } else {
    //   startRumEventBridge(lifeCycle)
  }
  var userSession = startCacheUsrCache(configuration);
  var domMutationObservable = createDOMMutationObservable();
  var locationChangeObservable = createLocationChangeObservable(location);
  var pageStateHistory = startPageStateHistory();
  var _startRumEventCollection = startRumEventCollection(lifeCycle, configuration, location, session, userSession, pageStateHistory, locationChangeObservable, domMutationObservable, getCommonContext, reportError);
  var viewContexts = _startRumEventCollection.viewContexts;
  var urlContexts = _startRumEventCollection.urlContexts;
  var actionContexts = _startRumEventCollection.actionContexts;
  var stopRumEventCollection = _startRumEventCollection.stop;
  var addAction = _startRumEventCollection.addAction;
  cleanupTasks.push(stopRumEventCollection);
  // drainPreStartTelemetry()

  // telemetry.setContextProvider(function () {
  //   return {
  //     application: {
  //       id: configuration.applicationId
  //     },
  //     session: {
  //       id: session.findTrackedSession() && session.findTrackedSession().id
  //     },
  //     view: {
  //       id: viewContexts.findView() && viewContexts.findView().id
  //     },
  //     action: {
  //       id: actionContexts.findActionId(),
  //       ids: actionContexts.findAllActionId()
  //     }
  //   }
  // })
  const {
    addTiming,
    startView,
    setViewName,
    setViewContext,
    setViewContextProperty,
    getViewContext,
    stop: stopViewCollection
  } = startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions);
  cleanupTasks.push(stopViewCollection);
  const _startResourceCollection = startResourceCollection(lifeCycle, configuration, pageStateHistory);
  var addResource = _startResourceCollection.addResource;
  cleanupTasks.push(_startResourceCollection.stop);
  // if (
  //   PerformanceObserver.supportedEntryTypes &&
  //   PerformanceObserver.supportedEntryTypes.includes(
  //     RumPerformanceEntryType.LONG_ANIMATION_FRAME
  //   )
  // ) {
  //   var longAnimationFrameCollection = startLongAnimationFrameCollection(
  //     lifeCycle,
  //     configuration
  //   )
  //   cleanupTasks.push(longAnimationFrameCollection.stop)
  // } else {
  //   startLongTaskCollection(lifeCycle, configuration)
  // }

  var _startErrorCollection = startErrorCollection(lifeCycle, configuration, session, pageStateHistory);
  var addError = _startErrorCollection.addError;
  startRequestCollection(lifeCycle, configuration, session);
  var internalContext = startInternalContext(configuration.applicationId, session, viewContexts, actionContexts, urlContexts);
  return {
    addResource: addResource,
    addAction: addAction,
    addError: addError,
    addTiming: addTiming,
    configuration: configuration,
    startView,
    setViewContext,
    setViewContextProperty,
    getViewContext,
    setViewName,
    lifeCycle: lifeCycle,
    viewContexts: viewContexts,
    session: session,
    setForcedSession: function () {
      session.setForcedSession();
    },
    stopSession: function () {
      session.expire();
    },
    getInternalContext: internalContext.get,
    stop: function () {
      cleanupTasks.forEach(function (task) {
        task();
      });
    }
  };
}
// function startRumTelemetry(configuration) {
//   const telemetry = startTelemetry(TelemetryService.RUM, configuration)
//   //   if (canUseEventBridge()) {
//   //     const bridge = getEventBridge()
//   //     telemetry.observable.subscribe((event) =>
//   //       bridge.send('internal_telemetry', event)
//   //     )
//   //   }
//   return telemetry
// }

function startRumEventCollection(lifeCycle, configuration, location, sessionManager, userSessionManager, pageStateHistory, locationChangeObservable, domMutationObservable, getCommonContext, reportError) {
  var viewContexts = startViewContexts(lifeCycle);
  var urlContexts = startUrlContexts(lifeCycle, locationChangeObservable, location);
  var _startActionCollection = startActionCollection(lifeCycle, domMutationObservable, configuration, pageStateHistory);
  var actionContexts = _startActionCollection.actionContexts;
  var addAction = _startActionCollection.addAction;
  var displayContext = startDisplayContext();
  startRumAssembly(configuration, lifeCycle, sessionManager, userSessionManager, viewContexts, urlContexts, actionContexts, displayContext, getCommonContext, reportError);
  return {
    viewContexts: viewContexts,
    urlContexts: urlContexts,
    pageStateHistory: pageStateHistory,
    addAction: addAction,
    actionContexts: actionContexts,
    stop: function () {
      displayContext.stop();
      pageStateHistory.stop();
      urlContexts.stop();
      viewContexts.stop();
    }
  };
}
;// CONCATENATED MODULE: ./src/domain/contexts/commonContext.js
function buildCommonContext(globalContextManager, userContextManager, recorderApi) {
  return {
    context: globalContextManager.getContext(),
    user: userContextManager.getContext(),
    hasReplay: false // recorderApi.isRecording() ? true : undefined
  };
}
;// CONCATENATED MODULE: ./src/boot/buildEnv.js
var buildEnv = {
  sdkVersion: "3.2.42",
  sdkName: 'df_web_rum_sdk'
};
;// CONCATENATED MODULE: ./src/domain/configuration.js



function validateAndBuildRumConfiguration(initConfiguration) {
  if (!initConfiguration.applicationId) {
    display.error('Application ID is not configured, no RUM data will be collected.');
    return;
  }
  var requireParamsValidate = validatePostRequestRequireParamsConfiguration(initConfiguration);
  if (!requireParamsValidate) return;
  if (initConfiguration.sessionOnErrorSampleRate !== undefined && !isPercentage(initConfiguration.sessionOnErrorSampleRate)) {
    display.error('Error Session  Sample Rate should be a number between 0 and 100');
    return;
  }
  if (initConfiguration.sessionReplaySampleRate !== undefined && !isPercentage(initConfiguration.sessionReplaySampleRate)) {
    display.error('Session Replay Sample Rate should be a number between 0 and 100');
    return;
  }
  if (initConfiguration.sessionReplayOnErrorSampleRate !== undefined && !isPercentage(initConfiguration.sessionReplayOnErrorSampleRate)) {
    display.error('Error Session Replay Sample Rate should be a number between 0 and 100');
    return;
  }
  var allowedTracingUrls = validateAndBuildTracingOptions(initConfiguration);
  if (!allowedTracingUrls) {
    return;
  }
  //   if (initConfiguration.allowedTracingOrigins !== undefined) {
  //     if (!isArray(initConfiguration.allowedTracingOrigins)) {
  //       display.error('Allowed Tracing Origins should be an array')
  //       return
  //     }
  //   }
  //   if (initConfiguration.allowedDDTracingOrigins !== undefined) {
  //     if (!isArray(initConfiguration.allowedDDTracingOrigins)) {
  //       display.error('Allowed Tracing Origins should be an array')
  //       return
  //     }
  //   }
  if (initConfiguration.tracingSampleRate !== undefined && !isPercentage(initConfiguration.tracingSampleRate)) {
    display.error('Tracing Sample Rate should be a number between 0 and 100');
    return;
  }
  if (initConfiguration.excludedActivityUrls !== undefined && !isArray(initConfiguration.excludedActivityUrls)) {
    display.error('Excluded Activity Urls should be an array');
    return;
  }
  var baseConfiguration = validateAndBuildConfiguration(initConfiguration);
  if (!baseConfiguration) {
    return;
  }
  var trackUserInteractions = !!isNullUndefinedDefaultValue(initConfiguration.trackUserInteractions, initConfiguration.trackInteractions);
  return tools_assign({
    applicationId: initConfiguration.applicationId,
    actionNameAttribute: initConfiguration.actionNameAttribute,
    sessionReplaySampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionReplaySampleRate, 100),
    sessionOnErrorSampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionOnErrorSampleRate, 0),
    sessionReplayOnErrorSampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionReplayOnErrorSampleRate, 0),
    tracingSampleRate: isNullUndefinedDefaultValue(initConfiguration.tracingSampleRate, 100),
    allowedTracingUrls: allowedTracingUrls,
    injectTraceHeader: initConfiguration.injectTraceHeader && catchUserErrors(initConfiguration.injectTraceHeader, 'injectTraceHeader threw an error:'),
    generateTraceId: initConfiguration.generateTraceId && catchUserErrors(initConfiguration.generateTraceId, 'generateTraceId threw an error:'),
    excludedActivityUrls: isNullUndefinedDefaultValue(initConfiguration.excludedActivityUrls, []),
    workerUrl: initConfiguration.workerUrl,
    compressIntakeRequests: !!initConfiguration.compressIntakeRequests,
    trackUserInteractions: trackUserInteractions,
    enableLongAnimationFrame: !!initConfiguration.enableLongAnimationFrame,
    trackViewsManually: !!initConfiguration.trackViewsManually,
    traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType.DDTRACE),
    traceId128Bit: !!initConfiguration.traceId128Bit,
    defaultPrivacyLevel: objectHasValue(DefaultPrivacyLevel, initConfiguration.defaultPrivacyLevel) ? initConfiguration.defaultPrivacyLevel : DefaultPrivacyLevel.MASK_USER_INPUT,
    shouldMaskNode: initConfiguration.shouldMaskNode && catchUserErrors(initConfiguration.shouldMaskNode, 'shouldMaskNode threw an error:')
  }, baseConfiguration, buildEnv);
}
/**
 * Handles allowedTracingUrls and processes legacy allowedTracingOrigins
 */
function validateAndBuildTracingOptions(initConfiguration) {
  // Advise about parameters precedence.
  if (initConfiguration.allowedTracingUrls !== undefined && initConfiguration.allowedTracingOrigins !== undefined) {
    display.warn('Both allowedTracingUrls and allowedTracingOrigins (deprecated) have been defined. The parameter allowedTracingUrls will override allowedTracingOrigins.');
  }
  // Handle allowedTracingUrls first
  if (initConfiguration.allowedTracingUrls !== undefined) {
    if (!isArray(initConfiguration.allowedTracingUrls)) {
      display.error('Allowed Tracing URLs should be an array');
      return;
    }
    // if (initConfiguration.allowedTracingUrls.length !== 0 && initConfiguration.service === undefined) {
    //   display.error('Service needs to be configured when tracing is enabled')
    //   return
    // }
    // Convert from (MatchOption | TracingOption) to TracingOption, remove unknown properties
    var tracingOptions = [];
    each(initConfiguration.allowedTracingUrls, function (option) {
      if (isMatchOption(option)) {
        tracingOptions.push({
          match: option,
          traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType.DDTRACE)
        });
      } else if (isTracingOption(option)) {
        tracingOptions.push(option);
      } else {
        display.warn('Allowed Tracing Urls parameters should be a string, RegExp, function, or an object. Ignoring parameter', option);
      }
    });
    return tracingOptions;
  }

  // // Handle conversion of allowedTracingOrigins to allowedTracingUrls
  // if (initConfiguration.allowedTracingOrigins !== undefined) {
  //   if (!isArray(initConfiguration.allowedTracingOrigins)) {
  //     display.error('Allowed Tracing Origins should be an array')
  //     return
  //   }

  //   var tracingOptions = []
  //   each(initConfiguration.allowedTracingOrigins, function (legacyMatchOption) {
  //     var tracingOption = convertLegacyMatchOptionToTracingOption(
  //       legacyMatchOption,
  //       isNullUndefinedDefaultValue(
  //         initConfiguration.traceType,
  //         TraceType.DDTRACE
  //       )
  //     )
  //     if (tracingOption) {
  //       tracingOptions.push(tracingOption)
  //     }
  //   })

  //   return tracingOptions
  // }
  // // Handle conversion of allowedDDTracingOrigins to allowedTracingUrls
  // if (initConfiguration.allowedDDTracingOrigins !== undefined) {
  //   if (!isArray(initConfiguration.allowedDDTracingOrigins)) {
  //     display.error('Allowed Tracing Origins should be an array')
  //     return
  //   }

  //   var tracingOptions = []
  //   each(
  //     initConfiguration.allowedDDTracingOrigins,
  //     function (legacyMatchOption) {
  //       var tracingOption = convertLegacyMatchOptionToTracingOption(
  //         legacyMatchOption,
  //         isNullUndefinedDefaultValue(
  //           initConfiguration.traceType,
  //           TraceType.DDTRACE
  //         )
  //       )
  //       if (tracingOption) {
  //         tracingOptions.push(tracingOption)
  //       }
  //     }
  //   )

  //   return tracingOptions
  // }

  return [];
}

/**
 * Converts parameters from the deprecated allowedTracingOrigins
 * to allowedTracingUrls. Handles the change from origin to full URLs.
 */
// function convertLegacyMatchOptionToTracingOption(item, traceType) {
//   var match
//   if (typeof item === 'string') {
//     match = item
//   } else if (item instanceof RegExp) {
//     match = function (url) {
//       return item.test(getOrigin(url))
//     }
//   } else if (typeof item === 'function') {
//     match = function (url) {
//       return item(getOrigin(url))
//     }
//   }

//   if (match === undefined) {
//     display.warn(
//       'Allowed Tracing Origins parameters should be a string, RegExp or function. Ignoring parameter',
//       item
//     )
//     return undefined
//   }

//   return { match: match, traceType: traceType }
// }
;// CONCATENATED MODULE: ./src/boot/perStartRum.js


// import { getType } from '@cloudcare/browser-core/src/helper/tools'

function createPreStartStrategy(rumPublicApiOptions, getCommonContext, doStartRum) {
  var ignoreInitIfSyntheticsWillInjectRum = rumPublicApiOptions.ignoreInitIfSyntheticsWillInjectRum;
  // var startDeflateWorker = rumPublicApiOptions.startDeflateWorker
  var bufferApiCalls = createBoundedBuffer();
  // var remoteConfigrationCallbacks = createBoundedBuffer()
  var firstStartViewCall;
  var deflateWorker;
  var cachedInitConfiguration;
  var cachedConfiguration;
  // var cachedRemoteConfiguration
  function tryStartRum() {
    if (!cachedInitConfiguration || !cachedConfiguration) {
      return;
    }
    var initialViewOptions;
    if (cachedConfiguration.trackViewsManually) {
      if (!firstStartViewCall) {
        return;
      }
      // An initial view is always created when starting RUM.
      // When tracking views automatically, any startView call before RUM start creates an extra
      // view.
      // When tracking views manually, we use the ViewOptions from the first startView call as the
      // initial view options, and we remove the actual startView call so we don't create an extra
      // view.
      bufferApiCalls.remove(firstStartViewCall.callback);
      initialViewOptions = firstStartViewCall.options;
    }
    var startRumResult = doStartRum(cachedConfiguration, deflateWorker, initialViewOptions);
    bufferApiCalls.drain(startRumResult);
  }
  function doInit(initConfiguration, remoteConfiguration) {
    // var eventBridgeAvailable = canUseEventBridge()
    // if (eventBridgeAvailable) {
    //   initConfiguration = overrideInitConfigurationForBridge(initConfiguration)
    // }

    // Update the exposed initConfiguration to reflect the bridge and remote configuration overrides
    cachedInitConfiguration = initConfiguration;
    // cachedRemoteConfiguration = remoteConfiguration
    // remoteConfigrationCallbacks.drain(cachedRemoteConfiguration)
    // addTelemetryConfiguration(deepClone(initConfiguration))
    if (cachedConfiguration) {
      displayAlreadyInitializedError('DATAFLUX_RUM', initConfiguration);
      return;
    }
    var configuration = validateAndBuildRumConfiguration(initConfiguration);
    if (!configuration) {
      return;
    }

    // if (!eventBridgeAvailable && !configuration.sessionStoreStrategyType) {
    //   display.warn(
    //     'No storage available for session. We will not send any data.'
    //   )
    //   return
    // }

    // if (
    //   configuration.compressIntakeRequests &&
    //   !configuration.sendContentTypeByJson &&
    //   !eventBridgeAvailable &&
    //   startDeflateWorker
    // ) {
    //   deflateWorker = startDeflateWorker(
    //     configuration,
    //     'RUM',
    //     // Worker initialization can fail asynchronously, especially in Firefox where even CSP
    //     // issues are reported asynchronously. For now, the SDK will continue its execution even if
    //     // data won't be sent to Datadog. We could improve this behavior in the future.
    //     noop
    //   )
    //   if (!deflateWorker) {
    //     // `startDeflateWorker` should have logged an error message explaining the issue
    //     return
    //   }
    // }

    cachedConfiguration = configuration;
    // Instrumuent fetch to track network requests
    // This is needed in case the consent is not granted and some cutsomer
    // library (Apollo Client) is storing uninstrumented fetch to be used later
    // The subscrption is needed so that the instrumentation process is completed
    initFetchObservable().subscribe(tools_noop);
    tryStartRum();
  }
  return {
    init: function (initConfiguration) {
      if (!initConfiguration) {
        display.error('Missing configuration');
        return;
      }
      // Set the experimental feature flags as early as possible, so we can use them in most places

      // Expose the initial configuration regardless of initialization success.
      cachedInitConfiguration = initConfiguration;
      // If we are in a Synthetics test configured to automatically inject a RUM instance, we want
      // to completely discard the customer application RUM instance by ignoring their init() call.
      // But, we should not ignore the init() call from the Synthetics-injected RUM instance, so the
      // internal `ignoreInitIfSyntheticsWillInjectRum` option is here to bypass this condition.
      if (ignoreInitIfSyntheticsWillInjectRum && willSyntheticsInjectRum()) {
        return;
      }
      if (initConfiguration.remoteConfiguration) {
        // fetchAndApplyRemoteConfiguration(initConfiguration, doInit)
      } else {
        doInit(initConfiguration);
      }
    },
    getInitConfiguration: function () {
      return cachedInitConfiguration;
    },
    // getRemoteConfiguration: function (callback) {
    //   if (getType(callback) === 'function') {
    //     if (cachedRemoteConfiguration) {
    //       callback(cachedRemoteConfiguration)
    //     } else {
    //       remoteConfigrationCallbacks.add(callback)
    //     }
    //   }
    // },
    getInternalContext: tools_noop,
    stopSession: tools_noop,
    setForcedSession: tools_noop,
    addTiming: function (name, time) {
      if (time === undefined) {
        time = timeStampNow();
      }
      bufferApiCalls.add(function (startRumResult) {
        startRumResult.addTiming(name, time);
      });
    },
    startView: function (options, startClocks) {
      if (startClocks === undefined) {
        startClocks = clocksNow();
      }
      const callback = function (startRumResult) {
        startRumResult.startView(options, startClocks);
      };
      bufferApiCalls.add(callback);
      if (!firstStartViewCall) {
        firstStartViewCall = {
          options: options,
          callback: callback
        };
        tryStartRum();
      }
    },
    setViewName(name) {
      bufferApiCalls.add(startRumResult => startRumResult.setViewName(name));
    },
    setViewContext(context) {
      bufferApiCalls.add(startRumResult => startRumResult.setViewContext(context));
    },
    setViewContextProperty(key, value) {
      bufferApiCalls.add(startRumResult => startRumResult.setViewContextProperty(key, value));
    },
    getViewContext: () => {},
    addTypeAction: function (action, type, commonContext) {
      if (commonContext === undefined) {
        commonContext = getCommonContext();
      }
      bufferApiCalls.add(function (startRumResult) {
        startRumResult.addTypeAction(action, type, commonContext);
      });
    },
    addAction: function (action, commonContext) {
      if (commonContext === undefined) {
        commonContext = getCommonContext();
      }
      bufferApiCalls.add(function (startRumResult) {
        startRumResult.addAction(action, commonContext);
      });
    },
    addResource: function (resource, commonContext) {
      if (commonContext === undefined) {
        commonContext = getCommonContext();
      }
      bufferApiCalls.add(function (startRumResult) {
        startRumResult.addResource(resource, commonContext);
      });
    },
    addError: function (providedError, commonContext) {
      if (commonContext === undefined) {
        commonContext = getCommonContext();
      }
      bufferApiCalls.add(function (startRumResult) {
        startRumResult.addError(providedError, commonContext);
      });
    }
  };
}

// function overrideInitConfigurationForBridge(initConfiguration) {
//   return assign({}, initConfiguration, {
//     applicationId: '00000000-aaaa-0000-aaaa-000000000000',
//     clientToken: 'empty',
//     sessionSampleRate: 100,
//     defaultPrivacyLevel:
//       initConfiguration.defaultPrivacyLevel ??
//       getEventBridge()?.getPrivacyLevel()
//   })
// }
;// CONCATENATED MODULE: ./src/boot/rumPublicApi.js



var RUM_STORAGE_KEY = 'rum';
function makeRumPublicApi(startRumImpl, recorderApi, options) {
  if (options === undefined) {
    options = {};
  }
  const customerDataTrackerManager = createCustomerDataTrackerManager(CustomerDataCompressionStatus.Unknown);
  const globalContextManager = createContextManager('global', {
    customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType.GlobalContext)
  });
  const userContextManager = createContextManager('user', {
    customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType.User),
    propertiesConfig: {
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  });
  function getCommonContext() {
    return buildCommonContext(globalContextManager, userContextManager, recorderApi);
  }
  let strategy = createPreStartStrategy(options, getCommonContext, function doStartRum(configuration, deflateWorker, initialViewOptions) {
    if (configuration.storeContextsToLocal) {
      storeContextManager(configuration, globalContextManager, RUM_STORAGE_KEY, CustomerDataType.GlobalContext);
      storeContextManager(configuration, userContextManager, RUM_STORAGE_KEY, CustomerDataType.User);
    }
    customerDataTrackerManager.setCompressionStatus(deflateWorker ? CustomerDataCompressionStatus.Enabled : CustomerDataCompressionStatus.Disabled);
    var startRumResult = startRumImpl(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, deflateWorker && options.createDeflateEncoder ? function (streamId) {
      return options.createDeflateEncoder(deflateWorker, streamId);
    } : createIdentityEncoder);
    // recorderApi.onRumStart(
    //   startRumResult.lifeCycle,
    //   configuration,
    //   startRumResult.session,
    //   startRumResult.viewContexts,
    //   deflateWorker
    // )

    strategy = createPostStartStrategy(strategy, startRumResult);
    return startRumResult;
  });
  const startView = monitor(function (options) {
    const sanitizedOptions = typeof options === 'object' ? options : {
      name: options
    };
    strategy.startView(sanitizedOptions);
    if (sanitizedOptions.context) {
      customerDataTrackerManager.getOrCreateTracker(CustomerDataType.View).updateCustomerData(sanitizedOptions.context);
    }
    // addTelemetryUsage({ feature: 'start-view' })
  });
  var rumPublicApi = makePublicApi({
    init: monitor(function (initConfiguration) {
      strategy.init(initConfiguration);
    }),
    setViewName: monitor(name => {
      strategy.setViewName(name);
      // addTelemetryUsage({ feature: 'set-view-name' })
    }),
    setViewContext: monitor(context => {
      strategy.setViewContext(context);
      // addTelemetryUsage({ feature: 'set-view-context' })
    }),
    setViewContextProperty: monitor((key, value) => {
      strategy.setViewContextProperty(key, value);
      // addTelemetryUsage({ feature: 'set-view-context-property' })
    }),
    getViewContext: monitor(() => {
      // addTelemetryUsage({ feature: 'set-view-context-property' })
      return strategy.getViewContext();
    }),
    // /** @deprecated: use setGlobalContextProperty instead */
    // addRumGlobalContext: monitor(function (key, value) {
    //   globalContextManager.setContextProperty(key, value)
    //   addTelemetryUsage({ feature: 'set-global-context' })
    // }),
    setGlobalContextProperty: monitor(function (key, value) {
      globalContextManager.setContextProperty(key, value);
      // addTelemetryUsage({ feature: 'set-global-context' })
    }),
    // /** @deprecated: use removeGlobalContextProperty instead */
    // removeRumGlobalContext: monitor(function (key) {
    //   return globalContextManager.removeContextProperty(key)
    // }),
    removeGlobalContextProperty: monitor(function (key) {
      return globalContextManager.removeContextProperty(key);
    }),
    // /** @deprecated: use getGlobalContext instead */
    // getRumGlobalContext: monitor(function () {
    //   return globalContextManager.getContext()
    // }),
    getGlobalContext: monitor(function () {
      return globalContextManager.getContext();
    }),
    // /** @deprecated: use setGlobalContext instead */
    // setRumGlobalContext: monitor(function (context) {
    //   globalContextManager.setContext(context)
    //   addTelemetryUsage({ feature: 'set-global-context' })
    // }),
    setGlobalContext: monitor(function (context) {
      globalContextManager.setContext(context);
      // addTelemetryUsage({ feature: 'set-global-context' })
    }),
    clearGlobalContext: monitor(function () {
      return globalContextManager.clearContext();
    }),
    getInitConfiguration: monitor(function () {
      return deepClone(strategy.initConfiguration);
    }),
    // getRemoteConfiguration: monitor(function (callback) {
    //   return strategy.getRemoteConfiguration(callback)
    // }),
    getInternalContext: monitor(function (startTime) {
      return strategy.getInternalContext(startTime);
    }),
    // addDebugSession: monitor(function (id) {}),
    // clearDebugSession: monitor(function () {}),
    // getDebugSession: monitor(function () {}),
    addResource: monitor(function (context) {
      const handlingStack = createHandlingStack();
      callMonitored(function () {
        strategy.addResource({
          context: sanitize(context),
          startClocks: clocksNow(),
          type: ResourceType.CUSTOM,
          handlingStack: handlingStack
        });
        // addTelemetryUsage({ feature: 'add-resource' })
      });
    }),
    addTypeAction: monitor(function (name, type, context) {
      const handlingStack = createHandlingStack();
      callMonitored(function () {
        const sourceType = sanitize(type);
        strategy.addAction({
          name: sanitize(name),
          context: sanitize(context),
          startClocks: clocksNow(),
          type: getType(sourceType) === 'string' ? sourceType : ActionType.CUSTOM,
          handlingStack: handlingStack
        });
        // addTelemetryUsage({ feature: 'add-type-action' })
      });
    }),
    addAction: monitor(function (name, context) {
      const handlingStack = createHandlingStack();
      callMonitored(function () {
        strategy.addAction({
          name: sanitize(name),
          context: sanitize(context),
          startClocks: clocksNow(),
          type: ActionType.CUSTOM,
          handlingStack: handlingStack
        });
        // addTelemetryUsage({ feature: 'add-action' })
      });
    }),
    addError: monitor(function (error, context) {
      var handlingStack = createHandlingStack();
      callMonitored(function () {
        strategy.addError({
          error,
          // Do not sanitize error here, it is needed unserialized by computeRawError()
          handlingStack,
          context: sanitize(context),
          startClocks: clocksNow()
        });
        // addTelemetryUsage({ feature: 'add-error' })
      });
    }),
    addTiming: monitor(function (name, time) {
      strategy.addTiming(sanitize(name), time);
    }),
    setUser: monitor(function (newUser) {
      if (checkUser(newUser)) {
        userContextManager.setContext(sanitizeUser(newUser));
      }
      // addTelemetryUsage({ feature: 'set-user' })
    }),
    getUser: monitor(function () {
      return userContextManager.getContext();
    }),
    setUserProperty: monitor(function (key, property) {
      var newUser = {};
      newUser[key] = property;
      var sanitizedProperty = sanitizeUser(newUser)[key];
      userContextManager.setContextProperty(key, sanitizedProperty);
      // addTelemetryUsage({ feature: 'set-user' })
    }),
    removeUserProperty: monitor(function (key) {
      return userContextManager.removeContextProperty(key);
    }),
    // /** @deprecated: renamed to clearUser */
    // removeUser: monitor(function () {
    //   return userContextManager.clearContext()
    // }),
    clearUser: monitor(function () {
      return userContextManager.clearContext();
    }),
    startView: startView,
    stopSession: monitor(function () {
      strategy.stopSession();
      // addTelemetryUsage({ feature: 'stop-session' })
    }),
    setForcedSession: monitor(function () {
      strategy.setForcedSession();
      addTelemetryUsage({
        feature: 'set-forced-session'
      });
    })
    // startSessionReplayRecording: monitor(function (options) {
    //   recorderApi.start(options)
    //   addTelemetryUsage({
    //     feature: 'start-session-replay-recording',
    //     force: options && options.force
    //   })
    // }),
    // stopSessionReplayRecording: monitor(recorderApi.stop),
    // takeSubsequentFullSnapshot: monitor(recorderApi.takeSubsequentFullSnapshot)
  });
  return rumPublicApi;
}
function createPostStartStrategy(preStartStrategy, startRumResult) {
  return tools_assign({
    init: function (initConfiguration) {
      displayAlreadyInitializedError('DATAFLUX_RUM', initConfiguration);
    },
    initConfiguration: preStartStrategy.getInitConfiguration()
  }, startRumResult);
}
;// CONCATENATED MODULE: ./src/boot/rum.entry.js



// import { startRecording } from './startRecording'
// import { makeRecorderApi } from './recorderApi'
// import { createDeflateEncoder, startDeflateWorker } from '../domain/deflate'
// var recorderApi = makeRecorderApi(startRecording)
var datafluxRum = makeRumPublicApi(startRum, 'recorderApi', {
  startDeflateWorker: null,
  createDeflateEncoder: null
});
defineGlobal(getGlobalObject(), 'DATAFLUX_RUM', datafluxRum);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
