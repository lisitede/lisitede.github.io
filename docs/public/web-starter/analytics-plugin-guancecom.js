var AnalyticsPluginGuancecom = function() {
    "use strict";
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P ? value : new P((function(resolve) {
                resolve(value);
            }));
        }
        return new (P || (P = Promise))((function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    }
    function __generator(thisArg, body) {
        var _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        }, f, y, t, g;
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
        }), g;
        function verb(n) {
            return function(v) {
                return step([ n, v ]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
                0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [ op[0] & 2, t.value ];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;

                  case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };

                  case 5:
                    _.label++;
                    y = op[1];
                    op = [ 0 ];
                    continue;

                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;

                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [ 6, e ];
                y = 0;
            } finally {
                f = t = 0;
            }
            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }
    var __webpack_require__ = {};
    !function() {
        __webpack_require__.d = function(exports, definition) {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    }();
    !function() {
        __webpack_require__.o = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };
    }();
    var __webpack_exports__ = {};
    __webpack_require__.d(__webpack_exports__, {
        E: function() {
            return datafluxRum;
        }
    });
    function typeof_typeof(o) {
        "@babel/helpers - typeof";
        return typeof_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
            return typeof o;
        } : function(o) {
            return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
        }, typeof_typeof(o);
    }
    var ConsoleApiName = {
        log: "log",
        debug: "debug",
        info: "info",
        warn: "warn",
        error: "error"
    };
    var globalConsole = console;
    var originalConsoleMethods = {};
    Object.keys(ConsoleApiName).forEach((function(name) {
        originalConsoleMethods[name] = globalConsole[name];
    }));
    var PREFIX = "GUANCE Browser SDK:";
    var display = {
        debug: originalConsoleMethods.debug.bind(globalConsole, PREFIX),
        log: originalConsoleMethods.log.bind(globalConsole, PREFIX),
        info: originalConsoleMethods.info.bind(globalConsole, PREFIX),
        warn: originalConsoleMethods.warn.bind(globalConsole, PREFIX),
        error: originalConsoleMethods.error.bind(globalConsole, PREFIX)
    };
    var debugMode = false;
    function setDebugMode(newDebugMode) {
        debugMode = newDebugMode;
    }
    function monitor(fn) {
        return function() {
            return callMonitored(fn, this, arguments);
        };
    }
    function callMonitored(fn, context, args) {
        try {
            return fn.apply(context, args);
        } catch (e) {
            displayIfDebugEnabled(e);
        }
    }
    function displayIfDebugEnabled() {
        var args = [].slice.call(arguments);
        if (debugMode) {
            display.error.apply(null, [ "[MONITOR]" ].concat(args));
        }
    }
    function catchUserErrors_catchUserErrors(fn, errorMsg) {
        return function() {
            var args = [].slice.call(arguments);
            try {
                return fn.apply(this, args);
            } catch (err) {
                display.error(errorMsg, err);
            }
        };
    }
    function makePublicApi(stub) {
        var publicApi = tools_assign({
            onReady: function onReady(callback) {
                callback();
            }
        }, stub);
        Object.defineProperty(publicApi, "_setDebug", {
            get: function get() {
                return setDebugMode;
            },
            enumerable: false
        });
        return publicApi;
    }
    function getGlobalObject() {
        if ((typeof globalThis === "undefined" ? "undefined" : typeof_typeof(globalThis)) === "object") {
            return globalThis;
        }
        Object.defineProperty(Object.prototype, "_gc_temp_", {
            get: function get() {
                return this;
            },
            configurable: true
        });
        var globalObject = _gc_temp_;
        delete Object.prototype._gc_temp_;
        if (typeof_typeof(globalObject) !== "object") {
            if ((typeof self === "undefined" ? "undefined" : typeof_typeof(self)) === "object") {
                globalObject = self;
            } else if ((typeof window === "undefined" ? "undefined" : typeof_typeof(window)) === "object") {
                globalObject = window;
            } else {
                globalObject = {};
            }
        }
        return globalObject;
    }
    function getZoneJsOriginalValue(target, name) {
        var browserWindow = getGlobalObject();
        var original;
        if (browserWindow.Zone && typeof browserWindow.Zone.__symbol__ === "function") {
            original = target[browserWindow.Zone.__symbol__(name)];
        }
        if (!original) {
            original = target[name];
        }
        return original;
    }
    function timer_setTimeout(callback, delay) {
        return getZoneJsOriginalValue(getGlobalObject(), "setTimeout")(monitor(callback), delay);
    }
    function timer_clearTimeout(timeoutId) {
        getZoneJsOriginalValue(getGlobalObject(), "clearTimeout")(timeoutId);
    }
    function timer_setInterval(callback, delay) {
        return getZoneJsOriginalValue(getGlobalObject(), "setInterval")(monitor(callback), delay);
    }
    function timer_clearInterval(timeoutId) {
        getZoneJsOriginalValue(getGlobalObject(), "clearInterval")(timeoutId);
    }
    var ArrayProto = Array.prototype;
    var ObjProto = Object.prototype;
    var slice = ArrayProto.slice;
    var tools_toString = ObjProto.toString;
    var tools_hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeForEach = ArrayProto.forEach;
    var nativeIsArray = Array.isArray;
    var breaker = false;
    var tools_each = function each(obj, iterator, context) {
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
        tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }));
        return target;
    }
    function shallowClone(object) {
        return tools_assign({}, object);
    }
    var extend = function extend(obj) {
        tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) {
                if (source[prop] !== void 0) {
                    obj[prop] = source[prop];
                }
            }
        }));
        return obj;
    };
    var extend2Lev = function extend2Lev(obj) {
        tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) {
                if (source[prop] !== void 0) {
                    if (isObject(source[prop]) && isObject(obj[prop])) {
                        extend(obj[prop], source[prop]);
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        }));
        return obj;
    };
    var isArray = nativeIsArray || function(obj) {
        return tools_toString.call(obj) === "[object Array]";
    };
    var isFunction = function isFunction(f) {
        if (!f) {
            return false;
        }
        try {
            return /^\s*\bfunction\b/.test(f);
        } catch (err) {
            return false;
        }
    };
    var isArguments = function isArguments(obj) {
        return !!(obj && tools_hasOwnProperty.call(obj, "callee"));
    };
    var toArray = function toArray(iterable) {
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
    var values = function values(obj) {
        var results = [];
        if (obj === null) {
            return results;
        }
        tools_each(obj, (function(value) {
            results[results.length] = value;
        }));
        return results;
    };
    var keys = function keys(obj) {
        var results = [];
        if (obj === null) {
            return results;
        }
        tools_each(obj, (function(value, key) {
            results[results.length] = key;
        }));
        return results;
    };
    var filter = function filter(arr, fn, self) {
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
    var tools_map = function map(arr, fn, self) {
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
    var some = function some(arr, fn, self) {
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
    var matchList = function matchList(list, value, useStartsWith) {
        if (useStartsWith === undefined) {
            useStartsWith = false;
        }
        return some(list, (function(item) {
            try {
                if (typeof item === "function") {
                    return item(value);
                } else if (item instanceof RegExp) {
                    return item.test(value);
                } else if (typeof item === "string") {
                    return useStartsWith ? startsWith(value, item) : item === value;
                }
            } catch (e) {
                display.error(e);
            }
            return false;
        }));
    };
    var cssEscape = function cssEscape(str) {
        str = str + "";
        if (window.CSS && window.CSS.escape) {
            return window.CSS.escape(str);
        }
        return str.replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, (function(ch, asCodePoint) {
            if (asCodePoint) {
                if (ch === "\0") {
                    return "�";
                }
                return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
            }
            return "\\" + ch;
        }));
    };
    var isObject = function isObject(obj) {
        if (obj === null) return false;
        return tools_toString.call(obj) === "[object Object]";
    };
    var isEmptyObject = function isEmptyObject(obj) {
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
    var objectEntries = function objectEntries(object) {
        var res = [];
        tools_each(object, (function(value, key) {
            res.push([ key, value ]);
        }));
        return res;
    };
    var isString = function isString(obj) {
        return tools_toString.call(obj) === "[object String]";
    };
    var isBoolean = function isBoolean(obj) {
        return tools_toString.call(obj) === "[object Boolean]";
    };
    var isNumber = function isNumber(obj) {
        return tools_toString.call(obj) === "[object Number]" && /[\d\.]+/.test(String(obj));
    };
    var throttle = function throttle(fn, wait, options) {
        var needLeadingExecution = options && options.leading !== undefined ? options.leading : true;
        var needTrailingExecution = options && options.trailing !== undefined ? options.trailing : true;
        var inWaitPeriod = false;
        var pendingExecutionWithParameters;
        var pendingTimeoutId;
        var context = this;
        return {
            throttled: function throttled() {
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
                pendingTimeoutId = timer_setTimeout((function() {
                    if (needTrailingExecution && pendingExecutionWithParameters) {
                        fn.apply(context, pendingExecutionWithParameters);
                    }
                    inWaitPeriod = false;
                    pendingExecutionWithParameters = undefined;
                }), wait);
            },
            cancel: function cancel() {
                timer_clearTimeout(pendingTimeoutId);
                inWaitPeriod = false;
                pendingExecutionWithParameters = undefined;
            }
        };
    };
    function UUID(placeholder) {
        return placeholder ? (parseInt(placeholder, 10) ^ Math.random() * 16 >> parseInt(placeholder, 10) / 4).toString(16) : "".concat(1e7, "-", 1e3, "-", 4e3, "-", 8e3, "-", 1e11).replace(/[018]/g, UUID);
    }
    function replaceNumberCharByPath(path) {
        var pathGroup = "";
        if (path) {
            pathGroup = path.replace(/\/([^\/]*)\d([^\/]*)/g, "/?").replace(/\/$/g, "");
        }
        return pathGroup || "/";
    }
    var urlParse = function urlParse(para) {
        var URLParser = function URLParser(a) {
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
            if (typeof a != "undefined") {
                this._parse(a);
            }
        };
        URLParser.prototype.setUrl = function(a) {
            this._parse(a);
        };
        URLParser.prototype._initValues = function() {
            for (var a in this._fields) {
                this._values[a] = "";
            }
        };
        URLParser.prototype.addQueryString = function(queryObj) {
            if (typeof_typeof(queryObj) !== "object") {
                return false;
            }
            var query = this._values.QueryString || "";
            for (var i in queryObj) {
                if (new RegExp(i + "[^&]+").test(query)) {
                    query = query.replace(new RegExp(i + "[^&]+"), i + "=" + queryObj[i]);
                } else {
                    if (query.slice(-1) === "&") {
                        query = query + i + "=" + queryObj[i];
                    } else {
                        if (query === "") {
                            query = i + "=" + queryObj[i];
                        } else {
                            query = query + "&" + i + "=" + queryObj[i];
                        }
                    }
                }
            }
            this._values.QueryString = query;
        };
        URLParser.prototype.getParse = function() {
            return this._values;
        };
        URLParser.prototype.getUrl = function() {
            var url = "";
            url += this._values.Origin;
            url += this._values.Path;
            url += this._values.QueryString ? "?" + this._values.QueryString : "";
            return url;
        };
        URLParser.prototype._parse = function(a) {
            this._initValues();
            var b = this._regex.exec(a);
            if (!b) {
                throw "DPURLParser::_parse -> Invalid URL";
            }
            for (var c in this._fields) {
                if (typeof b[this._fields[c]] != "undefined") {
                    this._values[c] = b[this._fields[c]];
                }
            }
            this._values["Path"] = this._values["Path"] || "/";
            this._values["Hostname"] = this._values["Host"].replace(/:\d+$/, "");
            this._values["Origin"] = this._values["Protocol"] + "://" + this._values["Hostname"] + (this._values.Port ? ":" + this._values.Port : "");
        };
        return new URLParser(para);
    };
    var getQueryParamsFromUrl = function getQueryParamsFromUrl(url) {
        var result = {};
        var arr = url.split("?");
        var queryString = arr[1] || "";
        if (queryString) {
            result = getURLSearchParams("?" + queryString);
        }
        return result;
    };
    var getURLSearchParams = function getURLSearchParams(queryString) {
        queryString = queryString || "";
        var decodeParam = function decodeParam(str) {
            return decodeURIComponent(str);
        };
        var args = {};
        var query = queryString.substring(1);
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
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
        if (typeof WeakSet !== "undefined") {
            var set = new WeakSet;
            return {
                hasAlreadyBeenSeen: function hasAlreadyBeenSeen(value) {
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
            hasAlreadyBeenSeen: function hasAlreadyBeenSeen(value) {
                var has = array.indexOf(value) >= 0;
                if (!has) {
                    array.push(value);
                }
                return has;
            }
        };
    }
    function getType(value) {
        if (value === null) {
            return "null";
        }
        if (Array.isArray(value)) {
            return "array";
        }
        return typeof_typeof(value);
    }
    function mergeInto(destination, source, circularReferenceChecker) {
        if (typeof circularReferenceChecker === "undefined") {
            circularReferenceChecker = createCircularReferenceChecker();
        }
        if (source === undefined) {
            return destination;
        }
        if (typeof_typeof(source) !== "object" || source === null) {
            return source;
        } else if (source instanceof Date) {
            return new Date(source.getTime());
        } else if (source instanceof RegExp) {
            var flags = source.flags || [ source.global ? "g" : "", source.ignoreCase ? "i" : "", source.multiline ? "m" : "", source.sticky ? "y" : "", source.unicode ? "u" : "" ].join("");
            return new RegExp(source.source, flags);
        }
        if (circularReferenceChecker.hasAlreadyBeenSeen(source)) {
            return undefined;
        } else if (Array.isArray(source)) {
            var merged = Array.isArray(destination) ? destination : [];
            for (var i = 0; i < source.length; ++i) {
                merged[i] = mergeInto(merged[i], source[i], circularReferenceChecker);
            }
            return merged;
        }
        var merged = getType(destination) === "object" ? destination : {};
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                merged[key] = mergeInto(merged[key], source[key], circularReferenceChecker);
            }
        }
        return merged;
    }
    function deepClone(value) {
        return mergeInto(undefined, value);
    }
    function getStatusGroup(status) {
        if (!status) return status === 0 ? undefined : status;
        return String(status).substr(0, 1) + String(status).substr(1).replace(/\d*/g, "x");
    }
    function tools_noop() {}
    var ONE_SECOND = 1e3;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR = 60 * ONE_MINUTE;
    var ONE_DAY = 24 * ONE_HOUR;
    var ONE_YEAR = 365 * ONE_DAY;
    function performDraw(threshold) {
        return threshold !== 0 && Math.random() * 100 <= threshold;
    }
    function round(num, decimals) {
        return +num.toFixed(decimals);
    }
    function msToNs(duration) {
        if (typeof duration !== "number") {
            return duration;
        }
        return round(duration * 1e6, 0);
    }
    function mapValues(object, fn) {
        var newObject = {};
        tools_each(object, (function(value, key) {
            newObject[key] = fn(value);
        }));
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
        return (new Date).getTime();
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
    function relativeToClocks(relative) {
        return {
            relative: relative,
            timeStamp: getCorrectedTimeStamp(relative)
        };
    }
    function currentDrift() {
        return Math.round(dateNow() - (getNavigationStart() + performance.now()));
    }
    function addDuration(a, b) {
        return a + b;
    }
    function getCorrectedTimeStamp(relativeTime) {
        var correctedOrigin = dateNow() - performance.now();
        if (correctedOrigin > getNavigationStart()) {
            return Math.round(correctedOrigin + relativeTime);
        }
        return getTimestamp(relativeTime);
    }
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
    function findByPath(source, path) {
        var pathArr = path.split(".");
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
        if (lastChar >= 55296 && lastChar <= 56319) {
            return candidate.slice(0, length + 1);
        }
        return candidate.slice(0, length);
    }
    function isMatchOption(item) {
        var itemType = getType(item);
        return itemType === "string" || itemType === "function" || item instanceof RegExp;
    }
    function includes(candidate, search) {
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
            arrayLike.forEach((function(item) {
                array.push(item);
            }));
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
    function isChromium() {
        return detectBrowserCached() === Browser.CHROMIUM;
    }
    var browserCache;
    function detectBrowserCached() {
        return isNullUndefinedDefaultValue(browserCache, browserCache = detectBrowser());
    }
    function detectBrowser(browserWindow) {
        var _browserWindow$naviga;
        if (typeof browserWindow === "undefined") {
            browserWindow = window;
        }
        var userAgent = browserWindow.navigator.userAgent;
        if (browserWindow.chrome || /HeadlessChrome/.test(userAgent)) {
            return Browser.CHROMIUM;
        }
        if (((_browserWindow$naviga = browserWindow.navigator.vendor) === null || _browserWindow$naviga === void 0 ? void 0 : _browserWindow$naviga.indexOf("Apple")) === 0 || /safari/i.test(userAgent) && !/chrome|android/i.test(userAgent)) {
            return Browser.SAFARI;
        }
        if (browserWindow.document.documentMode) {
            return Browser.IE;
        }
        return Browser.OTHER;
    }
    function tools_getLinkElementOrigin(element) {
        if (element.origin && element.origin !== "null") {
            return element.origin;
        }
        var sanitizedHost = element.host.replace(/(:80|:443)$/, "");
        return element.protocol + "//" + sanitizedHost;
    }
    function withSnakeCaseKeys(candidate) {
        var result = {};
        tools_each(candidate, (function(value, key) {
            result[toSnakeCase(key)] = deepSnakeCase(value);
        }));
        return result;
    }
    function deepSnakeCase(candidate) {
        if (isArray(candidate)) {
            return tools_map(candidate, (function(value) {
                return deepSnakeCase(value);
            }));
        }
        if (typeof_typeof(candidate) === "object" && candidate !== null) {
            return withSnakeCaseKeys(candidate);
        }
        return candidate;
    }
    function toSnakeCase(word) {
        return word.replace(/[A-Z]/g, (function(uppercaseLetter, index) {
            return (index !== 0 ? "_" : "") + uppercaseLetter.toLowerCase();
        })).replace(/-/g, "_");
    }
    function isNullUndefinedDefaultValue(data, defaultValue) {
        if (data !== null && data !== void 0) {
            return data;
        } else {
            return defaultValue;
        }
    }
    function objectHasValue(object, value) {
        return some(keys(object), (function(key) {
            return object[key] === value;
        }));
    }
    function startsWith(candidate, search) {
        return candidate.slice(0, search.length) === search;
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
            return;
        }
    }
    function isHashAnAnchor(hash) {
        var correspondingId = hash.substr(1);
        if (!correspondingId) return false;
        return !!document.getElementById(correspondingId);
    }
    function getPathFromHash(hash) {
        var index = hash.indexOf("?");
        return index < 0 ? hash : hash.slice(0, index);
    }
    function discardNegativeDuration(duration) {
        return isNumber(duration) && duration < 0 ? undefined : duration;
    }
    var BUFFER_LIMIT = 500;
    function createBoundedBuffer() {
        var buffer = [];
        var add = function add(callback) {
            var length = buffer.push(callback);
            if (length > BUFFER_LIMIT) {
                buffer.splice(0, 1);
            }
        };
        var remove = function remove(callback) {
            removeItem(buffer, callback);
        };
        var drain = function drain(arg) {
            buffer.forEach((function(callback) {
                callback(arg);
            }));
            buffer.length = 0;
        };
        return {
            add: add,
            remove: remove,
            drain: drain
        };
    }
    var END_OF_TIMES = Infinity;
    var CLEAR_OLD_VALUES_INTERVAL = ONE_MINUTE;
    var cleanupHistoriesInterval = null;
    var cleanupTasks = new Set;
    function createValueHistory(params) {
        var expireDelay = params.expireDelay;
        var maxEntries = params.maxEntries;
        var entries = [];
        if (cleanupHistoriesInterval) {
            cleanupHistoriesInterval = timer_setInterval((function() {
                return clearExpiredValues();
            }), CLEAR_OLD_VALUES_INTERVAL);
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
                remove: function remove() {
                    removeItem(entries, entry);
                },
                close: function close(endTime) {
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
            if (typeof startTime === "undefined") {
                startTime = END_OF_TIMES;
            }
            if (typeof options === "undefined") {
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
            return entries.filter((function(entry) {
                return entry.startTime <= endTime && startTime <= entry.endTime;
            })).map((function(entry) {
                return entry.value;
            }));
        }
        function reset() {
            entries = [];
        }
        function stop() {
            cleanupTasks["delete"](clearExpiredValues);
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
    var VariableLibrary = {
        navigator: typeof window !== "undefined" && typeof window.navigator != "undefined" ? window.navigator : {}
    };
    var MethodLibrary = {
        getLanguage: monitor((function() {
            var _this = this;
            _this.language = function() {
                var language = VariableLibrary.navigator.browserLanguage || VariableLibrary.navigator.language || "";
                var arr = language.split("-");
                if (arr[1]) {
                    arr[1] = arr[1].toUpperCase();
                }
                return arr.join("_");
            }();
            return _this.language;
        })),
        getNetwork: monitor((function() {
            var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
            var result = "unknown";
            var type = connection ? connection.type || connection.effectiveType : null;
            if (type && typeof type === "string") {
                switch (type) {
                  case "bluetooth":
                  case "cellular":
                    result = "cellular";
                    break;

                  case "none":
                    result = "none";
                    break;

                  case "ethernet":
                  case "wifi":
                  case "wimax":
                    result = "wifi";
                    break;

                  case "other":
                  case "unknown":
                    result = "unknown";
                    break;

                  case "slow-2g":
                  case "2g":
                  case "3g":
                    result = "cellular";
                    break;

                  case "4g":
                    result = "wifi";
                    break;
                }
            }
            return result;
        })),
        getTimeZone: monitor((function() {
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return timeZone;
        }))
    };
    var _deviceInfo = {};
    if (typeof window !== "undefined") {
        _deviceInfo = {
            screenSize: window.screen.width + "*" + window.screen.height,
            networkType: MethodLibrary.getNetwork(),
            timeZone: MethodLibrary.getTimeZone()
        };
    }
    var deviceInfo = _deviceInfo;
    var DOM_EVENT = {
        BEFORE_UNLOAD: "beforeunload",
        CLICK: "click",
        DBL_CLICK: "dblclick",
        KEY_DOWN: "keydown",
        LOAD: "load",
        POP_STATE: "popstate",
        SCROLL: "scroll",
        TOUCH_START: "touchstart",
        TOUCH_END: "touchend",
        TOUCH_MOVE: "touchmove",
        VISIBILITY_CHANGE: "visibilitychange",
        PAGE_SHOW: "pageshow",
        FREEZE: "freeze",
        RESUME: "resume",
        DOM_CONTENT_LOADED: "DOMContentLoaded",
        POINTER_DOWN: "pointerdown",
        POINTER_UP: "pointerup",
        POINTER_CANCEL: "pointercancel",
        HASH_CHANGE: "hashchange",
        PAGE_HIDE: "pagehide",
        MOUSE_DOWN: "mousedown",
        MOUSE_UP: "mouseup",
        MOUSE_MOVE: "mousemove",
        FOCUS: "focus",
        BLUR: "blur",
        CONTEXT_MENU: "contextmenu",
        RESIZE: "resize",
        CHANGE: "change",
        INPUT: "input",
        PLAY: "play",
        PAUSE: "pause",
        SECURITY_POLICY_VIOLATION: "securitypolicyviolation",
        SELECTION_CHANGE: "selectionchange",
        STORAGE: "storage"
    };
    var ResourceType = {
        DOCUMENT: "document",
        XHR: "xhr",
        BEACON: "beacon",
        FETCH: "fetch",
        CSS: "css",
        JS: "js",
        IMAGE: "image",
        FONT: "font",
        MEDIA: "media",
        OTHER: "other"
    };
    var ActionType = {
        CLICK: "click",
        CUSTOM: "custom"
    };
    var RumEventType = {
        ACTION: "action",
        ERROR: "error",
        LONG_TASK: "long_task",
        VIEW: "view",
        RESOURCE: "resource",
        LOGGER: "logger"
    };
    var ViewLoadingType = {
        INITIAL_LOAD: "initial_load",
        ROUTE_CHANGE: "route_change"
    };
    var RequestType = {
        FETCH: ResourceType.FETCH,
        XHR: ResourceType.XHR
    };
    var TraceType = {
        DDTRACE: "ddtrace",
        ZIPKIN_MULTI_HEADER: "zipkin",
        ZIPKIN_SINGLE_HEADER: "zipkin_single_header",
        W3C_TRACEPARENT: "w3c_traceparent",
        W3C_TRACEPARENT_64: "w3c_traceparent_64bit",
        SKYWALKING_V3: "skywalking_v3",
        JAEGER: "jaeger"
    };
    var enums_ErrorHandling = {
        HANDLED: "handled",
        UNHANDLED: "unhandled"
    };
    var NonErrorPrefix = {
        UNCAUGHT: "Uncaught",
        PROVIDED: "Provided"
    };
    function jsonStringify_jsonStringify(value, replacer, space) {
        if (typeof_typeof(value) !== "object" || value === null) {
            return JSON.stringify(value);
        }
        var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype);
        var restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype);
        var restoreValuePrototypeToJson = detachToJsonMethod(Object.getPrototypeOf(value));
        var restoreValueToJson = detachToJsonMethod(value);
        try {
            return JSON.stringify(value, replacer, space);
        } catch (_unused) {
            return "<error: unable to serialize object>";
        } finally {
            restoreObjectPrototypeToJson();
            restoreArrayPrototypeToJson();
            restoreValuePrototypeToJson();
            restoreValueToJson();
        }
    }
    function detachToJsonMethod(value) {
        var object = value;
        var objectToJson = object.toJSON;
        if (objectToJson) {
            delete object.toJSON;
            return function() {
                object.toJSON = objectToJson;
            };
        }
        return tools_noop;
    }
    var UNKNOWN_FUNCTION = "?";
    function computeStackTrace(ex) {
        var stack = [];
        var stackProperty = tryToGetString(ex, "stack");
        var exString = String(ex);
        if (stackProperty && stackProperty.startsWith(exString)) {
            stackProperty = stackProperty.slice(exString.length);
        }
        if (stackProperty) {
            tools_each(stackProperty.split("\n"), (function(line) {
                var stackFrame = parseChromeLine(line) || parseChromeAnonymousLine(line) || parseWinLine(line) || parseGeckoLine(line);
                if (stackFrame) {
                    if (!stackFrame.func && stackFrame.line) {
                        stackFrame.func = UNKNOWN_FUNCTION;
                    }
                    stack.push(stackFrame);
                }
            }));
        }
        return {
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
            stack: stack
        };
    }
    var fileUrl = "((?:file|https?|blob|chrome-extension|electron|native|eval|webpack|<anonymous>|\\w+\\.|\\/).*?)";
    var filePosition = "(?::(\\d+))";
    var CHROME_LINE_RE = new RegExp("^\\s*at (.*?) ?\\(" + fileUrl + filePosition + "?" + filePosition + "?\\)?\\s*$", "i");
    var CHROME_EVAL_RE = new RegExp("\\((\\S*)" + filePosition + filePosition + "\\)");
    function parseChromeLine(line) {
        var parts = CHROME_LINE_RE.exec(line);
        if (!parts) {
            return;
        }
        var isNative = parts[2] && parts[2].indexOf("native") === 0;
        var isEval = parts[2] && parts[2].indexOf("eval") === 0;
        var submatch = CHROME_EVAL_RE.exec(parts[2]);
        if (isEval && submatch) {
            parts[2] = submatch[1];
            parts[3] = submatch[2];
            parts[4] = submatch[3];
        }
        return {
            args: isNative ? [ parts[2] ] : [],
            column: parts[4] ? +parts[4] : undefined,
            func: parts[1] || UNKNOWN_FUNCTION,
            line: parts[3] ? +parts[3] : undefined,
            url: !isNative ? parts[2] : undefined
        };
    }
    var CHROME_ANONYMOUS_FUNCTION_RE = new RegExp("^\\s*at ?" + fileUrl + filePosition + "?" + filePosition + "??\\s*$", "i");
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
        var isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
        var submatch = GECKO_EVAL_RE.exec(parts[3]);
        if (isEval && submatch) {
            parts[3] = submatch[1];
            parts[4] = submatch[2];
            parts[5] = undefined;
        }
        return {
            args: parts[2] ? parts[2].split(",") : [],
            column: parts[5] ? +parts[5] : undefined,
            func: parts[1] || UNKNOWN_FUNCTION,
            line: parts[4] ? +parts[4] : undefined,
            url: parts[3]
        };
    }
    function tryToGetString(candidate, property) {
        if (typeof_typeof(candidate) !== "object" || !candidate || !(property in candidate)) {
            return undefined;
        }
        var value = candidate[property];
        return typeof value === "string" ? value : undefined;
    }
    var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?([\s\S]*)$/;
    function startUnhandledErrorCollection(callback) {
        var _instrumentOnError = instrumentOnError(callback);
        var _instrumentUnhandledRejection = instrumentUnhandledRejection(callback);
        return {
            stop: function stop() {
                _instrumentOnError.stop();
                _instrumentUnhandledRejection.stop();
            }
        };
    }
    function instrumentOnError(callback) {
        return instrumentMethod(window, "onerror", (function(params) {
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
                    stack: [ location ]
                };
            }
            callback(stackTrace, isNullUndefinedDefaultValue(errorObj, messageObj));
        }));
    }
    function tryToParseMessage(messageObj) {
        var name;
        var message;
        if ({}.toString.call(messageObj) === "[object String]") {
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
    function instrumentUnhandledRejection(callback) {
        return instrumentMethod(window, "onunhandledrejection", (function(params) {
            var parameters = params.parameters;
            var e = parameters[0];
            var reason = e.reason || "Empty reason";
            var stack = computeStackTrace(reason);
            callback(stack, reason);
        }));
    }
    var ONE_KIBI_BYTE = 1024;
    var ONE_MEBI_BYTE = 1024 * ONE_KIBI_BYTE;
    var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
    function computeBytesCount(candidate) {
        if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
            return candidate.length;
        }
        if (window.TextEncoder !== undefined) {
            return (new TextEncoder).encode(candidate).length;
        }
        return new Blob([ candidate ]).size;
    }
    var SANITIZE_DEFAULT_MAX_CHARACTER_COUNT = 220 * ONE_KIBI_BYTE;
    var JSON_PATH_ROOT_ELEMENT = "$";
    var KEY_DECORATION_LENGTH = 3;
    function sanitize(source, maxCharacterCount) {
        if (maxCharacterCount === undefined) {
            maxCharacterCount = SANITIZE_DEFAULT_MAX_CHARACTER_COUNT;
        }
        var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype);
        var restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype);
        var containerQueue = [];
        var visitedObjectsWithPath = new WeakMap;
        var sanitizedData = sanitizeProcessor(source, JSON_PATH_ROOT_ELEMENT, undefined, containerQueue, visitedObjectsWithPath);
        var accumulatedCharacterCount = JSON.stringify(sanitizedData) && JSON.stringify(sanitizedData).length || 0;
        if (accumulatedCharacterCount > maxCharacterCount) {
            warnOverCharacterLimit(maxCharacterCount, "discarded", source);
            return undefined;
        }
        while (containerQueue.length > 0 && accumulatedCharacterCount < maxCharacterCount) {
            var containerToProcess = containerQueue.shift();
            var separatorLength = 0;
            if (Array.isArray(containerToProcess.source)) {
                for (var key = 0; key < containerToProcess.source.length; key++) {
                    var targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath);
                    if (targetData !== undefined) {
                        accumulatedCharacterCount += JSON.stringify(targetData).length;
                    } else {
                        accumulatedCharacterCount += 4;
                    }
                    accumulatedCharacterCount += separatorLength;
                    separatorLength = 1;
                    if (accumulatedCharacterCount > maxCharacterCount) {
                        warnOverCharacterLimit(maxCharacterCount, "truncated", source);
                        break;
                    }
                    containerToProcess.target[key] = targetData;
                }
            } else {
                for (var key in containerToProcess.source) {
                    if (Object.prototype.hasOwnProperty.call(containerToProcess.source, key)) {
                        var targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath);
                        if (targetData !== undefined) {
                            accumulatedCharacterCount += JSON.stringify(targetData).length + separatorLength + key.length + KEY_DECORATION_LENGTH;
                            separatorLength = 1;
                        }
                        if (accumulatedCharacterCount > maxCharacterCount) {
                            warnOverCharacterLimit(maxCharacterCount, "truncated", source);
                            break;
                        }
                        containerToProcess.target[key] = targetData;
                    }
                }
            }
        }
        restoreObjectPrototypeToJson();
        restoreArrayPrototypeToJson();
        return sanitizedData;
    }
    function sanitizeProcessor(source, parentPath, key, queue, visitedObjectsWithPath) {
        var sourceToSanitize = tryToApplyToJSON(source);
        if (!sourceToSanitize || typeof_typeof(sourceToSanitize) !== "object") {
            return sanitizePrimitivesAndFunctions(sourceToSanitize);
        }
        var sanitizedSource = sanitizeObjects(sourceToSanitize);
        if (sanitizedSource !== "[Object]" && sanitizedSource !== "[Array]" && sanitizedSource !== "[Error]") {
            return sanitizedSource;
        }
        var sourceAsObject = source;
        if (visitedObjectsWithPath.has(sourceAsObject)) {
            return "[Reference seen at " + visitedObjectsWithPath.get(sourceAsObject) + "]";
        }
        var currentPath = key !== undefined ? parentPath + "." + key : parentPath;
        var target = Array.isArray(sourceToSanitize) ? [] : {};
        visitedObjectsWithPath.set(sourceAsObject, currentPath);
        queue.push({
            source: sourceToSanitize,
            target: target,
            path: currentPath
        });
        return target;
    }
    function sanitizePrimitivesAndFunctions(value) {
        if (typeof value === "bigint") {
            return "[BigInt] " + value.toString();
        }
        if (typeof value === "function") {
            return "[Function] " + value.name || 0;
        }
        if (typeof_typeof(value) === "symbol") {
            return "[Symbol] " + value.description || 0;
        }
        return value;
    }
    function sanitizeObjects(value) {
        try {
            if (value instanceof Event) {
                return sanitizeEvent(value);
            }
            if (value instanceof RegExp) {
                return "[RegExp] ".concat(value.toString());
            }
            var result = Object.prototype.toString.call(value);
            var match = result.match(/\[object (.*)\]/);
            if (match && match[1]) {
                return "[" + match[1] + "]";
            }
        } catch (_unused) {}
        return "[Unserializable]";
    }
    function sanitizeEvent(event) {
        return {
            type: event.type,
            isTrusted: event.isTrusted,
            currentTarget: event.currentTarget ? sanitizeObjects(event.currentTarget) : null,
            target: event.target ? sanitizeObjects(event.target) : null
        };
    }
    function tryToApplyToJSON(value) {
        var object = value;
        if (object && typeof object.toJSON === "function") {
            try {
                return object.toJSON();
            } catch (_unused2) {}
        }
        return value;
    }
    function warnOverCharacterLimit(maxCharacterCount, changeType, source) {
        display.warn("The data provided has been " + changeType + " as it is over the limit of " + maxCharacterCount + " characters:", source);
    }
    var NO_ERROR_STACK_PRESENT_MESSAGE = "No stack, consider using an instance of Error";
    var errorTools_ErrorSource = {
        AGENT: "agent",
        CONSOLE: "console",
        NETWORK: "network",
        SOURCE: "source",
        LOGGER: "logger",
        CUSTOM: "custom"
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
        return stackTrace && stackTrace.message && stackTrace && stackTrace.name ? stackTrace.message : !isErrorInstance ? nonErrorPrefix + " " + jsonStringify_jsonStringify(sanitize(originalError)) : "Empty message";
    }
    function hasUsableStack(isErrorInstance, stackTrace) {
        if (stackTrace === undefined) {
            return false;
        }
        if (isErrorInstance) {
            return true;
        }
        return stackTrace.stack.length > 0 && (stackTrace.stack.length > 1 || stackTrace.stack[0].url !== undefined);
    }
    function createHandlingStack() {
        var internalFramesToSkip = 2;
        var error = new Error;
        var formattedStack;
        if (!error.stack) {
            try {
                throw error;
            } catch (e) {}
        }
        callMonitored((function() {
            var stackTrace = computeStackTrace(error);
            stackTrace.stack = stackTrace.stack.slice(internalFramesToSkip);
            formattedStack = toStackTraceString(stackTrace);
        }));
        return formattedStack;
    }
    function toStackTraceString(stack) {
        var result = formatErrorMessage(stack);
        tools_each(stack.stack, (function(frame) {
            var func = frame.func === "?" ? "<anonymous>" : frame.func;
            var args = frame.args && frame.args.length > 0 ? "(" + frame.args.join(", ") + ")" : "";
            var line = frame.line ? ":" + frame.line : "";
            var column = frame.line && frame.column ? ":" + frame.column : "";
            result += "\n  at " + func + args + " @ " + frame.url + line + column;
        }));
        return result;
    }
    function formatErrorMessage(stack) {
        return (stack.name || "Error") + ": " + stack.message;
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
    function instrumentMethod(targetPrototype, method, onPreCall, opts) {
        var computeHandlingStack = opts && opts.computeHandlingStack;
        var original = targetPrototype[method];
        if (typeof original !== "function") {
            if (startsWith(method, "on")) {
                original = tools_noop;
            } else {
                return {
                    stop: tools_noop
                };
            }
        }
        var stopped = false;
        var instrumentation = function instrumentation() {
            if (stopped) {
                return original.apply(this, arguments);
            }
            var parameters = arrayFrom(arguments);
            var postCallCallback;
            callMonitored(onPreCall, null, [ {
                target: this,
                parameters: parameters,
                onPostCall: function onPostCall(callback) {
                    postCallCallback = callback;
                },
                handlingStack: computeHandlingStack ? createHandlingStack() : undefined
            } ]);
            var result = original.apply(this, parameters);
            if (postCallCallback) {
                callMonitored(postCallCallback, null, [ result ]);
            }
            return result;
        };
        targetPrototype[method] = instrumentation;
        return {
            stop: function stop() {
                stopped = true;
                if (targetPrototype[method] === instrumentation) {
                    targetPrototype[method] = original;
                }
            }
        };
    }
    function trackRuntimeError(errorObservable) {
        return startUnhandledErrorCollection((function(stackTrace, originalError) {
            errorObservable.notify(computeRawError({
                stackTrace: stackTrace,
                originalError: originalError,
                startClocks: clocksNow(),
                nonErrorPrefix: NonErrorPrefix.UNCAUGHT,
                source: errorTools_ErrorSource.SOURCE,
                handling: enums_ErrorHandling.UNHANDLED
            }));
        }));
    }
    var _Observable = function _Observable(onFirstSubscribe) {
        this.observers = [];
        this.onLastUnsubscribe = undefined;
        this.onFirstSubscribe = onFirstSubscribe;
    };
    _Observable.prototype = {
        subscribe: function subscribe(f) {
            this.observers.push(f);
            if (this.observers.length === 1 && this.onFirstSubscribe) {
                this.onLastUnsubscribe = this.onFirstSubscribe(this) || undefined;
            }
            var _this = this;
            return {
                unsubscribe: function unsubscribe() {
                    _this.observers = filter(_this.observers, (function(other) {
                        return f !== other;
                    }));
                    if (!_this.observers.length && _this.onLastUnsubscribe) {
                        _this.onLastUnsubscribe();
                    }
                }
            };
        },
        notify: function notify(data) {
            tools_each(this.observers, (function(observer) {
                observer(data);
            }));
        }
    };
    var Observable = _Observable;
    function mergeObservables() {
        var observables = [].slice.call(arguments);
        return new Observable((function(globalObservable) {
            var subscriptions = tools_map(observables, (function(observable) {
                return observable.subscribe((function(data) {
                    return globalObservable.notify(data);
                }));
            }));
            return function() {
                return tools_each(subscriptions, (function(subscription) {
                    return subscription.unsubscribe();
                }));
            };
        }));
    }
    var consoleObservablesByApi = {};
    function initConsoleObservable(apis) {
        var consoleObservables = tools_map(apis, (function(api) {
            if (!consoleObservablesByApi[api]) {
                consoleObservablesByApi[api] = createConsoleObservable(api);
            }
            return consoleObservablesByApi[api];
        }));
        return mergeObservables.apply(this, consoleObservables);
    }
    function createConsoleObservable(api) {
        return new Observable((function(observable) {
            var originalConsoleApi = console[api];
            console[api] = function() {
                var params = [].slice.call(arguments);
                originalConsoleApi.apply(console, arguments);
                var handlingStack = createHandlingStack();
                callMonitored((function() {
                    observable.notify(buildConsoleLog(params, api, handlingStack));
                }));
            };
            return function() {
                console[api] = originalConsoleApi;
            };
        }));
    }
    function buildConsoleLog(params, api, handlingStack) {
        var message = tools_map(params, (function(param) {
            return formatConsoleParameters(param);
        })).join(" ");
        var error;
        if (api === ConsoleApiName.error) {
            var firstErrorParam = find(params, (function(param) {
                return param instanceof Error;
            }));
            error = {
                stack: firstErrorParam ? toStackTraceString(computeStackTrace(firstErrorParam)) : undefined,
                causes: firstErrorParam ? flattenErrorCauses(firstErrorParam, "console") : undefined,
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
        if (typeof param === "string") {
            return param;
        }
        if (param instanceof Error) {
            return formatErrorMessage(computeStackTrace(param));
        }
        return jsonStringify_jsonStringify(param, undefined, 2);
    }
    function addEventListener(eventTarget, event, listener, options) {
        return addEventListeners(eventTarget, [ event ], listener, options);
    }
    function addEventListeners(eventTarget, eventNames, listener, options) {
        var wrappedListener = monitor(options && options.once ? function(event) {
            stop();
            listener(event);
        } : listener);
        options = options && options.passive ? {
            capture: options.capture,
            passive: options.passive
        } : options && options.capture;
        var listenerTarget = window.EventTarget && eventTarget instanceof EventTarget ? window.EventTarget.prototype : eventTarget;
        var add = getZoneJsOriginalValue(listenerTarget, "addEventListener");
        tools_each(eventNames, (function(eventName) {
            add.call(eventTarget, eventName, wrappedListener, options);
        }));
        var stop = function stop() {
            var remove = getZoneJsOriginalValue(listenerTarget, "removeEventListener");
            tools_each(eventNames, (function(eventName) {
                remove.call(eventTarget, eventName, wrappedListener, options);
            }));
        };
        return {
            stop: stop
        };
    }
    var RawReportType = {
        intervention: "intervention",
        deprecation: "deprecation",
        cspViolation: "csp_violation"
    };
    function initReportObservable(configuration, apis) {
        var observables = [];
        if (includes(apis, RawReportType.cspViolation)) {
            observables.push(createCspViolationReportObservable());
        }
        var reportTypes = filter(apis, (function(api) {
            return api !== RawReportType.cspViolation;
        }));
        if (reportTypes.length) {
            observables.push(createReportObservable(reportTypes));
        }
        return mergeObservables.apply(this, observables);
    }
    function createReportObservable(reportTypes) {
        return new Observable((function(observable) {
            if (!window.ReportingObserver) {
                return;
            }
            var handleReports = monitor((function(reports) {
                tools_each(reports, (function(report) {
                    observable.notify(buildRawReportErrorFromReport(report));
                }));
            }));
            var observer = new window.ReportingObserver(handleReports, {
                types: reportTypes,
                buffered: true
            });
            observer.observe();
            return function() {
                observer.disconnect();
            };
        }));
    }
    function createCspViolationReportObservable(configuration) {
        return new Observable((function(observable) {
            var _addEventListener = addEventListener(document, DOM_EVENT.SECURITY_POLICY_VIOLATION, (function(event) {
                observable.notify(buildRawReportErrorFromCspViolation(event));
            }));
            return _addEventListener.stop;
        }));
    }
    function buildRawReportErrorFromReport(report) {
        var body = report.body;
        var type = report.type;
        return buildRawReportError({
            type: body.id,
            message: type + ": " + body.message,
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
            message: RawReportType.cspViolation + ": " + message,
            originalError: event,
            csp: {
                disposition: event.disposition
            },
            stack: buildStack(event.effectiveDirective, event.originalPolicy ? "".concat(message, ' of the policy "').concat(safeTruncate(event.originalPolicy, 100), '"') : "no policy", event.sourceFile, event.lineNumber, event.columnNumber)
        });
    }
    function buildStack(name, message, sourceFile, lineNumber, columnNumber) {
        return sourceFile && toStackTraceString({
            name: name,
            message: message,
            stack: [ {
                func: "?",
                url: sourceFile,
                line: lineNumber,
                column: columnNumber
            } ]
        });
    }
    var LifeCycleEventType = {
        AUTO_ACTION_COMPLETED: "AUTO_ACTION_COMPLETED",
        BEFORE_VIEW_CREATED: "BEFORE_VIEW_CREATED",
        VIEW_CREATED: "VIEW_CREATED",
        VIEW_UPDATED: "VIEW_UPDATED",
        BEFORE_VIEW_UPDATED: "BEFORE_VIEW_UPDATED",
        VIEW_ENDED: "VIEW_ENDED",
        AFTER_VIEW_ENDED: "AFTER_VIEW_ENDED",
        SESSION_RENEWED: "SESSION_RENEWED",
        SESSION_EXPIRED: "SESSION_EXPIRED",
        PAGE_EXITED: "PAGE_EXITED",
        REQUEST_STARTED: "REQUEST_STARTED",
        REQUEST_COMPLETED: "REQUEST_COMPLETED",
        RAW_RUM_EVENT_COLLECTED: "RAW_RUM_EVENT_COLLECTED",
        RUM_EVENT_COLLECTED: "RUM_EVENT_COLLECTED",
        RAW_ERROR_COLLECTED: "RAW_ERROR_COLLECTED",
        RAW_LOG_COLLECTED: "RAW_LOG_COLLECTED",
        LOG_COLLECTED: "LOG_COLLECTED"
    };
    function LifeCycle() {
        this.callbacks = {};
    }
    LifeCycle.prototype = {
        notify: function notify(eventType, data) {
            var eventCallbacks = this.callbacks[eventType];
            if (eventCallbacks) {
                tools_each(eventCallbacks, (function(callback) {
                    callback(data);
                }));
            }
        },
        subscribe: function subscribe(eventType, callback) {
            if (!this.callbacks[eventType]) {
                this.callbacks[eventType] = [];
            }
            this.callbacks[eventType].push(callback);
            var _this = this;
            return {
                unsubscribe: function unsubscribe() {
                    _this.callbacks[eventType] = filter(_this.callbacks[eventType], (function(other) {
                        return other !== callback;
                    }));
                }
            };
        }
    };
    function _arrayWithHoles(r) {
        if (Array.isArray(r)) return r;
    }
    function _iterableToArray(r) {
        if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
    }
    function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
    }
    function _unsupportedIterableToArray(r, a) {
        if (r) {
            if ("string" == typeof r) return _arrayLikeToArray(r, a);
            var t = {}.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
        }
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _toArray(r) {
        return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
    }
    function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
            var e, n, i, u, a = [], f = !0, o = !1;
            try {
                if (i = (t = t.call(r)).next, 0 === l) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else for (;!(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) ;
            } catch (r) {
                o = !0, n = r;
            } finally {
                try {
                    if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
                } finally {
                    if (o) throw n;
                }
            }
            return a;
        }
    }
    function _slicedToArray(r, e) {
        return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }
    function limitModification_arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
    }
    function limitModification(object, modifiableFieldPaths, modifier) {
        var clone = deepClone(object);
        var result = modifier(clone);
        objectEntries(modifiableFieldPaths).forEach((function(_ref) {
            var _ref2 = _slicedToArray(_ref, 2), fieldPath = _ref2[0], fieldType = _ref2[1];
            return setValueAtPath(object, clone, fieldPath.split(/\.|(?=\[\])/), fieldType);
        }));
        return result;
    }
    function setValueAtPath(object, clone, pathSegments, fieldType) {
        var _pathSegments = _toArray(pathSegments), field = _pathSegments[0], restPathSegments = limitModification_arrayLikeToArray(_pathSegments).slice(1);
        if (field === "[]") {
            if (Array.isArray(object) && Array.isArray(clone)) {
                object.forEach((function(item, i) {
                    return setValueAtPath(item, clone[i], restPathSegments, fieldType);
                }));
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
        var newType = getType(value);
        if (newType === fieldType) {
            object[field] = sanitize(value);
        } else if (fieldType === "object" && (newType === "undefined" || newType === "null")) {
            object[field] = {};
        }
    }
    function isValidObject(object) {
        return getType(object) === "object";
    }
    function createEventRateLimiter(eventType, limit, onLimitReached) {
        var eventCount = 0;
        var allowNextEvent = false;
        return {
            isLimitReached: function isLimitReached() {
                if (eventCount === 0) {
                    timer_setTimeout((function() {
                        eventCount = 0;
                    }), ONE_MINUTE);
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
                            message: "Reached max number of " + eventType + "s by minute: " + limit,
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
    function getPathName(url) {
        var pathname = buildUrl(url).pathname;
        return pathname[0] === "/" ? pathname : "/" + pathname;
    }
    function buildUrl(url, base) {
        if (checkURLSupported()) {
            return base !== undefined ? new URL(url, base) : new URL(url);
        }
        if (base === undefined && !/:/.test(url)) {
            throw new Error("Invalid URL: " + url);
        }
        var doc = document;
        var anchorElement = doc.createElement("a");
        if (base !== undefined) {
            doc = document.implementation.createHTMLDocument("");
            var baseElement = doc.createElement("base");
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
            var url = new URL("http://test/path");
            isURLSupported = url.href === "http://test/path";
            return isURLSupported;
        } catch (e) {
            isURLSupported = false;
        }
        return isURLSupported;
    }
    function readBytesFromStream(stream, callback, options) {
        var reader = stream.getReader();
        var chunks = [];
        var readBytesCount = 0;
        readMore();
        function readMore() {
            reader.read().then(monitor((function(result) {
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
            })), monitor((function(error) {
                callback(error);
            })));
        }
        function onDone() {
            reader.cancel()["catch"](tools_noop);
            var bytes;
            var limitExceeded;
            if (options.collectStreamBody) {
                var completeBuffer;
                if (chunks.length === 1) {
                    completeBuffer = chunks[0];
                } else {
                    completeBuffer = new Uint8Array(readBytesCount);
                    var offset = 0;
                    tools_each(chunks, (function(chunk) {
                        completeBuffer.set(chunk, offset);
                        offset += chunk.length;
                    }));
                }
                bytes = completeBuffer.slice(0, options.bytesLimit);
                limitExceeded = completeBuffer.length > options.bytesLimit;
            }
            callback(undefined, bytes, limitExceeded);
        }
    }
    function requestIdleCallback(callback, opts) {
        if (window.requestIdleCallback && window.cancelIdleCallback) {
            var id = window.requestIdleCallback(monitor(callback), opts);
            return function() {
                return window.cancelIdleCallback(id);
            };
        }
        return requestIdleCallbackShim(callback);
    }
    var MAX_TASK_TIME = 50;
    function requestIdleCallbackShim(callback) {
        var start = dateNow();
        var timeoutId = timer_setTimeout((function() {
            callback({
                didTimeout: false,
                timeRemaining: function timeRemaining() {
                    return Math.max(0, MAX_TASK_TIME - (dateNow() - start));
                }
            });
        }), 0);
        return function() {
            return timer_clearTimeout(timeoutId);
        };
    }
    var IDLE_CALLBACK_TIMEOUT = ONE_SECOND;
    var MAX_EXECUTION_TIME_ON_TIMEOUT = 30;
    function createTaskQueue() {
        var pendingTasks = [];
        function run(deadline) {
            var executionTimeRemaining;
            if (deadline.didTimeout) {
                var start = performance.now();
                executionTimeRemaining = function executionTimeRemaining() {
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
            push: function push(task) {
                if (pendingTasks.push(task) === 1) {
                    scheduleNextRun();
                }
            }
        };
    }
    var TRIM_REGIX = /^\s+|\s+$/g;
    var typeMap = {
        rum: "/rum",
        log: "/logging",
        sessionReplay: "/rum/replay"
    };
    function getEndPointUrl(configuration, type) {
        var subUrl = typeMap[type];
        if (!subUrl) return "";
        var url = configuration.datakitOrigin || configuration.datakitUrl || configuration.site;
        if (url.indexOf("/") === 0) {
            url = location.origin + trim(url);
        }
        var endpoint = url;
        if (url.lastIndexOf("/") === url.length - 1) {
            endpoint = trim(url) + "v1/write" + subUrl;
        } else {
            endpoint = trim(url) + "/v1/write" + subUrl;
        }
        if (configuration.site && configuration.clientToken) {
            endpoint = endpoint + "?token=" + configuration.clientToken + "&to_headless=true";
        }
        return endpoint;
    }
    function trim(str) {
        return str.replace(TRIM_REGIX, "");
    }
    function computeTransportConfiguration(initConfiguration) {
        var isIntakeUrl = function isIntakeUrl(url) {
            return false;
        };
        if ("isIntakeUrl" in initConfiguration && isFunction(initConfiguration.isIntakeUrl) && isBoolean(initConfiguration.isIntakeUrl())) {
            isIntakeUrl = initConfiguration.isIntakeUrl;
        }
        var isServerError = function isServerError(request) {
            return false;
        };
        if ("isServerError" in initConfiguration && isFunction(initConfiguration.isServerError) && isBoolean(initConfiguration.isServerError())) {
            isServerError = initConfiguration.isServerError;
        }
        return {
            rumEndpoint: getEndPointUrl(initConfiguration, "rum"),
            logsEndpoint: getEndPointUrl(initConfiguration, "log"),
            sessionReplayEndPoint: getEndPointUrl(initConfiguration, "sessionReplay"),
            isIntakeUrl: isIntakeUrl,
            isServerError: isServerError
        };
    }
    function isIntakeRequest(url, configuration) {
        var notTakeRequest = [ configuration.rumEndpoint ];
        if (configuration.logsEndpoint) {
            notTakeRequest.push(configuration.logsEndpoint);
        }
        if (configuration.sessionReplayEndPoint) {
            notTakeRequest.push(configuration.sessionReplayEndPoint);
        }
        return some(notTakeRequest, (function(takeUrl) {
            return url.indexOf(takeUrl) === 0;
        })) || configuration.isIntakeUrl(url);
    }
    function getCookieName(name, options) {
        return "".concat(name, "_").concat(options && options.crossSite ? "cs1" : "cs0", "_").concat(options && options.domain ? "d1" : "d0", "_").concat(options && options.secure ? "sec1" : "sec0", "_").concat(options && options.partitioned ? "part1" : "part0");
    }
    function setCookie(name, value, expireDelay, options) {
        var date = new Date;
        date.setTime(date.getTime() + expireDelay);
        var expires = "expires=" + date.toUTCString();
        var sameSite = options && options.crossSite ? "none" : "strict";
        var domain = options && options.domain ? ";domain=" + options.domain : "";
        var secure = options && options.secure ? ";secure" : "";
        var partitioned = options && options.partitioned ? ";partitioned" : "";
        document.cookie = getCookieName(name, options) + "=" + value + ";" + expires + ";path=/;samesite=" + sameSite + domain + secure + partitioned;
    }
    function cookie_getCookie(name, options) {
        return findCommaSeparatedValue(document.cookie, getCookieName(name, options));
    }
    function deleteCookie(name, options) {
        setCookie(name, "", 0, options);
    }
    function areCookiesAuthorized(options) {
        if (document.cookie === undefined || document.cookie === null) {
            return false;
        }
        try {
            var testCookieName = "gc_cookie_test_".concat(UUID());
            var testCookieValue = "test";
            setCookie(testCookieName, testCookieValue, ONE_MINUTE, options);
            var isCookieCorrectlySet = cookie_getCookie(testCookieName, options) === testCookieValue;
            deleteCookie(testCookieName, options);
            return isCookieCorrectlySet;
        } catch (error) {
            return false;
        }
    }
    var getCurrentSiteCache;
    function getCurrentSite() {
        if (getCurrentSiteCache === undefined) {
            var testCookieName = "gc_site_test_".concat(UUID());
            var testCookieValue = "test";
            var domainLevels = window.location.hostname.split(".");
            var candidateDomain = domainLevels.pop();
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
    var SESSION_TIME_OUT_DELAY = 4 * ONE_HOUR;
    var SESSION_EXPIRATION_DELAY = 15 * ONE_MINUTE;
    var SESSION_STORE_KEY = "_gc_s";
    var SESSION_ENTRY_REGEXP = /^([a-zA-Z]+)=([a-z0-9-]+)$/;
    var SESSION_ENTRY_SEPARATOR = "&";
    var EXPIRED = "1";
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
        return tools_map(objectEntries(session), (function(item) {
            return item[0] + "=" + item[1];
        })).join(SESSION_ENTRY_SEPARATOR);
    }
    function toSessionState(sessionString) {
        var session = {};
        if (isValidSessionString(sessionString)) {
            sessionString.split(SESSION_ENTRY_SEPARATOR).forEach((function(entry) {
                var matches = SESSION_ENTRY_REGEXP.exec(entry);
                if (matches !== null) {
                    var _matches = _slicedToArray(matches, 3), key = _matches[1], value = _matches[2];
                    session[key] = value;
                }
            }));
        }
        return session;
    }
    function isValidSessionString(sessionString) {
        return !!sessionString && (sessionString.indexOf(SESSION_ENTRY_SEPARATOR) !== -1 || SESSION_ENTRY_REGEXP.test(sessionString));
    }
    function selectCookieStrategy(initConfiguration) {
        var cookieOptions = buildCookieOptions(initConfiguration);
        return areCookiesAuthorized(cookieOptions) ? {
            type: "Cookie",
            cookieOptions: cookieOptions
        } : undefined;
    }
    function initCookieStrategy(cookieOptions) {
        var cookieStore = {
            isLockEnabled: isChromium(),
            persistSession: persistSessionCookie(cookieOptions),
            retrieveSession: retrieveSessionCookie(cookieOptions),
            expireSession: function expireSession() {
                return expireSessionCookie(cookieOptions);
            }
        };
        return cookieStore;
    }
    function persistSessionCookie(options) {
        return function(session) {
            setCookie(SESSION_STORE_KEY, toSessionString(session), SESSION_EXPIRATION_DELAY, options);
        };
    }
    function expireSessionCookie(options) {
        setCookie(SESSION_STORE_KEY, toSessionString(getExpiredSessionState()), SESSION_TIME_OUT_DELAY, options);
    }
    function retrieveSessionCookie(options) {
        return function() {
            var sessionString = cookie_getCookie(SESSION_STORE_KEY, options);
            return toSessionState(sessionString);
        };
    }
    function buildCookieOptions(initConfiguration) {
        var cookieOptions = {};
        cookieOptions.secure = !!initConfiguration.useSecureSessionCookie || !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
        cookieOptions.crossSite = !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie;
        cookieOptions.partitioned = !!initConfiguration.usePartitionedCrossSiteSessionCookie;
        if (initConfiguration.trackSessionAcrossSubdomains) {
            cookieOptions.domain = getCurrentSite();
        }
        return cookieOptions;
    }
    var LOCAL_STORAGE_TEST_KEY = "_gc_test_";
    function selectLocalStorageStrategy() {
        try {
            var id = UUID();
            var testKey = "".concat(LOCAL_STORAGE_TEST_KEY).concat(id);
            localStorage.setItem(testKey, id);
            var retrievedId = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return id === retrievedId ? {
                type: "LocalStorage"
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
        var sessionString = localStorage.getItem(SESSION_STORE_KEY);
        return toSessionState(sessionString);
    }
    function expireSessionFromLocalStorage() {
        persistInLocalStorage(getExpiredSessionState());
    }
    var LOCK_RETRY_DELAY = 10;
    var LOCK_MAX_TRIES = 100;
    var bufferedOperations = [];
    var ongoingOperations;
    function processSessionStoreOperations(operations, sessionStoreStrategy) {
        var numberOfRetries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var isLockEnabled = sessionStoreStrategy.isLockEnabled, persistSession = sessionStoreStrategy.persistSession, expireSession = sessionStoreStrategy.expireSession;
        var persistWithLock = function persistWithLock(session) {
            return persistSession(tools_assign({}, session, {
                lock: currentLock
            }));
        };
        var retrieveStore = function retrieveStore() {
            var session = sessionStoreStrategy.retrieveSession();
            var lock = session.lock;
            if (session.lock) {
                delete session.lock;
            }
            return {
                session: session,
                lock: lock
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
            next(sessionStoreStrategy);
            return;
        }
        var currentLock;
        var currentStore = retrieveStore();
        if (isLockEnabled) {
            if (currentStore.lock) {
                retryLater(operations, sessionStoreStrategy, numberOfRetries);
                return;
            }
            currentLock = UUID();
            persistWithLock(currentStore.session);
            currentStore = retrieveStore();
            if (currentStore.lock !== currentLock) {
                retryLater(operations, sessionStoreStrategy, numberOfRetries);
                return;
            }
        }
        var processedSession = operations.process(currentStore.session);
        if (isLockEnabled) {
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
            if (!(processedSession && isSessionInExpiredState(processedSession))) {
                currentStore = retrieveStore();
                if (currentStore.lock !== currentLock) {
                    retryLater(operations, sessionStoreStrategy, numberOfRetries);
                    return;
                }
                persistSession(currentStore.session);
                processedSession = currentStore.session;
            }
        }
        if (operations.after) {
            operations.after(processedSession || currentStore.session);
        }
        next(sessionStoreStrategy);
    }
    function retryLater(operations, sessionStore, currentNumberOfRetries) {
        timer_setTimeout((function() {
            processSessionStoreOperations(operations, sessionStore, currentNumberOfRetries + 1);
        }), LOCK_RETRY_DELAY);
    }
    function next(sessionStore) {
        ongoingOperations = undefined;
        var nextOperations = bufferedOperations.shift();
        if (nextOperations) {
            processSessionStoreOperations(nextOperations, sessionStore);
        }
    }
    var STORAGE_POLL_DELAY = ONE_SECOND;
    function selectSessionStoreStrategyType(initConfiguration) {
        var sessionStoreStrategyType = selectCookieStrategy(initConfiguration);
        if (!sessionStoreStrategyType && initConfiguration.allowFallbackToLocalStorage) {
            sessionStoreStrategyType = selectLocalStorageStrategy();
        }
        return sessionStoreStrategyType;
    }
    function startSessionStore(sessionStoreStrategyType, productKey, computeSessionState) {
        var renewObservable = new Observable;
        var expireObservable = new Observable;
        var sessionStateUpdateObservable = new Observable;
        var sessionStoreStrategy = sessionStoreStrategyType.type === "Cookie" ? initCookieStrategy(sessionStoreStrategyType.cookieOptions) : initLocalStorageStrategy();
        var expireSession = sessionStoreStrategy.expireSession;
        var watchSessionTimeoutId = timer_setInterval(watchSession, STORAGE_POLL_DELAY);
        var sessionCache;
        startSession();
        var _throttle = throttle((function() {
            processSessionStoreOperations({
                process: function process(sessionState) {
                    if (isSessionInNotStartedState(sessionState)) {
                        return;
                    }
                    var synchronizedSession = synchronizeSession(sessionState);
                    expandOrRenewSessionState(synchronizedSession);
                    return synchronizedSession;
                },
                after: function after(sessionState) {
                    if (isSessionStarted(sessionState) && !hasSessionInCache()) {
                        renewSessionInCache(sessionState);
                    }
                    sessionCache = sessionState;
                }
            }, sessionStoreStrategy);
        }), STORAGE_POLL_DELAY), throttledExpandOrRenewSession = _throttle.throttled, cancelExpandOrRenewSession = _throttle.cancel;
        function expandSession() {
            processSessionStoreOperations({
                process: function process(sessionState) {
                    return hasSessionInCache() ? synchronizeSession(sessionState) : undefined;
                }
            }, sessionStoreStrategy);
        }
        function watchSession() {
            processSessionStoreOperations({
                process: function process(sessionState) {
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
                process: function process(sessionState) {
                    if (isSessionInNotStartedState(sessionState)) {
                        return getExpiredSessionState();
                    }
                },
                after: function after(sessionState) {
                    sessionCache = sessionState;
                }
            }, sessionStoreStrategy);
        }
        function expandOrRenewSessionState(sessionState) {
            if (isSessionInNotStartedState(sessionState)) {
                return false;
            }
            var _computeSessionState = computeSessionState(sessionState[productKey]), trackingType = _computeSessionState.trackingType, isTracked = _computeSessionState.isTracked;
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
                process: function process(sessionState) {
                    return tools_assign({}, sessionState, partialSessionState);
                },
                after: synchronizeSession
            }, sessionStoreStrategy);
        }
        return {
            expandOrRenewSession: throttledExpandOrRenewSession,
            expandSession: expandSession,
            getSession: function getSession() {
                return sessionCache;
            },
            renewObservable: renewObservable,
            expireObservable: expireObservable,
            sessionStateUpdateObservable: sessionStateUpdateObservable,
            restartSession: startSession,
            expire: function expire() {
                cancelExpandOrRenewSession();
                expireSession();
                synchronizeSession(getExpiredSessionState());
            },
            stop: function stop() {
                timer_clearInterval(watchSessionTimeoutId);
            },
            updateSessionState: updateSessionState
        };
    }
    var DefaultPrivacyLevel = {
        ALLOW: "allow",
        MASK: "mask",
        MASK_USER_INPUT: "mask-user-input"
    };
    function validateAndBuildConfiguration(initConfiguration) {
        if (initConfiguration.sampleRate !== undefined && !isPercentage(initConfiguration.sampleRate)) {
            display.error("Sample Rate should be a number between 0 and 100");
            return;
        }
        if (initConfiguration.sessionSampleRate !== undefined && !isPercentage(initConfiguration.sessionSampleRate)) {
            display.error("Sample Rate should be a number between 0 and 100");
            return;
        }
        if (initConfiguration.telemetrySampleRate !== undefined && !isPercentage(initConfiguration.telemetrySampleRate)) {
            display.error("Telemetry Sample Rate should be a number between 0 and 100");
            return;
        }
        var sessionSampleRate = isNullUndefinedDefaultValue(initConfiguration.sessionSampleRate, initConfiguration.sampleRate);
        return tools_assign({
            beforeSend: initConfiguration.beforeSend && catchUserErrors_catchUserErrors(initConfiguration.beforeSend, "beforeSend threw an error:"),
            sessionStoreStrategyType: selectSessionStoreStrategyType(initConfiguration),
            sessionSampleRate: isNullUndefinedDefaultValue(sessionSampleRate, 100),
            service: initConfiguration.service,
            version: initConfiguration.version,
            env: initConfiguration.env,
            telemetrySampleRate: isNullUndefinedDefaultValue(initConfiguration.telemetrySampleRate, 100),
            telemetryEnabled: isNullUndefinedDefaultValue(initConfiguration.telemetryEnabled, false),
            silentMultipleInit: !!initConfiguration.silentMultipleInit,
            batchBytesLimit: 16 * ONE_KIBI_BYTE,
            eventRateLimiterThreshold: 3e3,
            maxTelemetryEventsPerPage: 15,
            flushTimeout: 30 * ONE_SECOND,
            batchMessagesLimit: 50,
            messageBytesLimit: 256 * ONE_KIBI_BYTE,
            resourceUrlLimit: 5 * ONE_KIBI_BYTE,
            storeContextsToLocal: !!initConfiguration.storeContextsToLocal,
            storeContextsKey: initConfiguration.storeContextsKey,
            sendContentTypeByJson: !!initConfiguration.sendContentTypeByJson,
            retryMaxSize: isNullUndefinedDefaultValue(initConfiguration.retryMaxSize, -1)
        }, computeTransportConfiguration(initConfiguration));
    }
    function validatePostRequestRequireParamsConfiguration(initConfiguration) {
        if (!initConfiguration.site && !initConfiguration.datakitOrigin && !initConfiguration.datakitUrl) {
            display.error("datakitOrigin or site is not configured, no RUM data will be collected.");
            return false;
        }
        if (initConfiguration.site && !initConfiguration.clientToken) {
            display.error("clientToken is not configured, no RUM data will be collected.");
            return false;
        }
        return true;
    }
    var fetchObservable;
    function initFetchObservable() {
        if (!fetchObservable) {
            fetchObservable = createFetchObservable();
        }
        return fetchObservable;
    }
    function createFetchObservable() {
        return new Observable((function(observable) {
            if (!window.fetch) {
                return;
            }
            var fetchMethod = instrumentMethod(window, "fetch", (function(call) {
                return beforeSend(call, observable);
            }), {
                computeHandlingStack: true
            });
            return fetchMethod.stop;
        }));
    }
    function beforeSend(params, observable) {
        var parameters = params.parameters;
        var onPostCall = params.onPostCall;
        var handlingStack = params.handlingStack;
        var input = parameters[0];
        var init = parameters[1];
        var methodFromParams = init && init.method;
        if (methodFromParams === undefined && input instanceof Request) {
            methodFromParams = input.method;
        }
        var method = methodFromParams !== undefined ? String(methodFromParams).toUpperCase() : "GET";
        var url = input instanceof Request ? input.url : normalizeUrl(String(input));
        var startClocks = clocksNow();
        var context = {
            state: "start",
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
        onPostCall((function(responsePromise) {
            return afterSend(observable, responsePromise, context);
        }));
    }
    function afterSend(observable, responsePromise, startContext) {
        var context = startContext;
        var reportFetch = function reportFetch(partialContext) {
            context.state = "resolve";
            tools_assign(context, partialContext);
            observable.notify(context);
        };
        responsePromise.then(monitor((function(response) {
            var responseType = "";
            try {
                responseType = response.constructor === Response && response.type || "";
            } catch (err) {
                responseType = "";
            }
            reportFetch({
                response: response,
                responseType: responseType,
                status: response.status,
                isAborted: false
            });
        })), monitor((function(error) {
            reportFetch({
                status: 0,
                isAborted: context.init && context.init.signal && context.init.signal.aborted || error instanceof DOMException && error.code === DOMException.ABORT_ERR,
                error: error
            });
        })));
    }
    var xhrObservable;
    var xhrContexts = new WeakMap;
    function initXhrObservable() {
        if (!xhrObservable) {
            xhrObservable = createXhrObservable();
        }
        return xhrObservable;
    }
    function createXhrObservable() {
        return new Observable((function(observable) {
            var openInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "open", openXhr);
            var sendInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "send", (function(call) {
                sendXhr(call, observable);
            }), {
                computeHandlingStack: true
            });
            var abortInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "abort", abortXhr);
            return function() {
                openInstrumentMethod.stop();
                sendInstrumentMethod.stop();
                abortInstrumentMethod.stop();
            };
        }));
    }
    function openXhr(params) {
        var xhr = params.target;
        var method = params.parameters[0];
        var url = params.parameters[1];
        xhrContexts.set(xhr, {
            state: "open",
            method: String(method).toUpperCase(),
            url: normalizeUrl(String(url))
        });
    }
    function sendXhr(params, observable) {
        var xhr = params.target;
        var handlingStack = params.handlingStack;
        var context = xhrContexts.get(xhr);
        if (!context) {
            return;
        }
        var startContext = context;
        startContext.state = "start";
        startContext.startClocks = clocksNow();
        startContext.isAborted = false;
        startContext.xhr = xhr;
        startContext.handlingStack = handlingStack;
        var hasBeenReported = false;
        var stopInstrumentingOnReadyStateChange = instrumentMethod(xhr, "onreadystatechange", (function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                onEnd();
            }
        })).stop;
        var onEnd = function onEnd() {
            unsubscribeLoadEndListener();
            stopInstrumentingOnReadyStateChange();
            if (hasBeenReported) {
                return;
            }
            hasBeenReported = true;
            var completeContext = context;
            completeContext.state = "complete";
            completeContext.duration = tools_elapsed(startContext.startClocks.timeStamp, timeStampNow());
            completeContext.status = xhr.status;
            observable.notify(shallowClone(completeContext));
        };
        var unsubscribeLoadEndListener = addEventListener(xhr, "loadend", onEnd).stop;
        observable.notify(startContext);
    }
    function abortXhr(params) {
        var xhr = params.target;
        var context = xhrContexts.get(xhr);
        if (context) {
            context.isAborted = true;
        }
    }
    var PageExitReason = {
        HIDDEN: "visibility_hidden",
        UNLOADING: "before_unload",
        PAGEHIDE: "page_hide",
        FROZEN: "page_frozen"
    };
    function createPageExitObservable() {
        return new Observable((function(observable) {
            var visibilityChangeListener = addEventListeners(window, [ DOM_EVENT.VISIBILITY_CHANGE, DOM_EVENT.FREEZE ], (function(event) {
                if (event.type === DOM_EVENT.VISIBILITY_CHANGE && document.visibilityState === "hidden") {
                    observable.notify({
                        reason: PageExitReason.HIDDEN
                    });
                } else if (event.type === DOM_EVENT.FREEZE) {
                    observable.notify({
                        reason: PageExitReason.FROZEN
                    });
                }
            }), {
                capture: true
            });
            var beforeUnloadListener = addEventListener(window, DOM_EVENT.BEFORE_UNLOAD, (function() {
                observable.notify({
                    reason: PageExitReason.UNLOADING
                });
            }));
            return function() {
                visibilityChangeListener.stop();
                beforeUnloadListener.stop();
            };
        }));
    }
    function isPageExitReason(reason) {
        return includes(values(PageExitReason), reason);
    }
    function isElementNode(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }
    function runOnReadyState(expectedReadyState, callback) {
        if (document.readyState === expectedReadyState || document.readyState === "complete") {
            callback();
            return {
                stop: tools_noop
            };
        } else {
            var eventName = expectedReadyState === "complete" ? DOM_EVENT.LOAD : DOM_EVENT.DOM_CONTENT_LOADED;
            return addEventListener(window, eventName, callback, {
                once: true
            });
        }
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
    var commonTags = {
        sdk_name: "_gc.sdk_name",
        sdk_version: "_gc.sdk_version",
        app_id: "application.id",
        env: "env",
        service: "service",
        version: "version",
        source: "source",
        userid: "user.id",
        user_email: "user.email",
        user_name: "user.name",
        session_id: "session.id",
        session_type: "session.type",
        session_sampling: "session.is_sampling",
        is_signin: "user.is_signin",
        os: "device.os",
        os_version: "device.os_version",
        os_version_major: "device.os_version_major",
        browser: "device.browser",
        browser_version: "device.browser_version",
        browser_version_major: "device.browser_version_major",
        screen_size: "device.screen_size",
        network_type: "device.network_type",
        time_zone: "device.time_zone",
        device: "device.device",
        view_id: "view.id",
        view_referrer: "view.referrer",
        view_url: "view.url",
        view_host: "view.host",
        view_path: "view.path",
        view_name: "view.name",
        view_path_group: "view.path_group"
    };
    var commonFields = {
        view_url_query: "view.url_query",
        action_id: "action.id",
        action_ids: "action.ids",
        view_in_foreground: "view.in_foreground",
        display: "display",
        session_has_replay: "session.has_replay",
        is_login: "user.is_login",
        page_states: "_gc.page_states",
        session_sample_rate: "_gc.configuration.session_sample_rate",
        session_replay_sample_rate: "_gc.configuration.session_replay_sample_rate",
        session_on_error_sample_rate: "_gc.configuration.session_on_error_sample_rate",
        session_replay_on_error_sample_rate: "_gc.configuration.session_replay_on_error_sample_rate",
        drift: "_gc.drift"
    };
    var dataMap = {
        view: {
            type: RumEventType.VIEW,
            tags: {
                view_loading_type: "view.loading_type",
                view_apdex_level: "view.apdex_level",
                view_privacy_replay_level: "privacy.replay_level"
            },
            fields: {
                sampled_for_replay: "session.sampled_for_replay",
                sampled_for_error_replay: "session.sampled_for_error_replay",
                sampled_for_error_session: "session.sampled_for_error_session",
                session_error_timestamp: "session.error_timestamp_for_session",
                is_active: "view.is_active",
                session_replay_stats: "_gc.replay_stats",
                session_is_active: "session.is_active",
                view_error_count: "view.error.count",
                view_resource_count: "view.resource.count",
                view_long_task_count: "view.long_task.count",
                view_action_count: "view.action.count",
                first_contentful_paint: "view.first_contentful_paint",
                largest_contentful_paint: "view.largest_contentful_paint",
                largest_contentful_paint_element_selector: "view.largest_contentful_paint_element_selector",
                cumulative_layout_shift: "view.cumulative_layout_shift",
                cumulative_layout_shift_time: "view.cumulative_layout_shift_time",
                cumulative_layout_shift_target_selector: "view.cumulative_layout_shift_target_selector",
                first_input_delay: "view.first_input_delay",
                loading_time: "view.loading_time",
                dom_interactive: "view.dom_interactive",
                dom_content_loaded: "view.dom_content_loaded",
                dom_complete: "view.dom_complete",
                load_event: "view.load_event",
                first_input_time: "view.first_input_time",
                first_input_target_selector: "view.first_input_target_selector",
                first_paint_time: "view.fpt",
                interaction_to_next_paint: "view.interaction_to_next_paint",
                interaction_to_next_paint_target_selector: "view.interaction_to_next_paint_target_selector",
                resource_load_time: "view.resource_load_time",
                time_to_interactive: "view.tti",
                dom: "view.dom",
                dom_ready: "view.dom_ready",
                time_spent: "view.time_spent",
                first_byte: "view.first_byte",
                frustration_count: "view.frustration.count",
                custom_timings: "view.custom_timings"
            }
        },
        resource: {
            type: RumEventType.RESOURCE,
            tags: {
                trace_id: "_gc.trace_id",
                span_id: "_gc.span_id",
                resource_id: "resource.id",
                resource_status: "resource.status",
                resource_status_group: "resource.status_group",
                resource_method: "resource.method"
            },
            fields: {
                duration: "resource.duration",
                resource_size: "resource.size",
                resource_url: "resource.url",
                resource_url_host: "resource.url_host",
                resource_url_path: "resource.url_path",
                resource_url_path_group: "resource.url_path_group",
                resource_url_query: "resource.url_query",
                resource_delivery_type: "resource.delivery_type",
                resource_type: "resource.type",
                resource_protocol: "resource.protocol",
                resource_encode_size: "resource.encoded_body_size",
                resource_decode_size: "resource.decoded_body_size",
                resource_transfer_size: "resource.transfer_size",
                resource_render_blocking_status: "resource.render_blocking_status",
                resource_dns: "resource.dns",
                resource_tcp: "resource.tcp",
                resource_ssl: "resource.ssl",
                resource_ttfb: "resource.ttfb",
                resource_trans: "resource.trans",
                resource_redirect: "resource.redirect",
                resource_first_byte: "resource.firstbyte",
                resource_dns_time: "resource.dns_time",
                resource_download_time: "resource.download_time",
                resource_first_byte_time: "resource.first_byte_time",
                resource_connect_time: "resource.connect_time",
                resource_ssl_time: "resource.ssl_time",
                resource_redirect_time: "resource.redirect_time"
            }
        },
        error: {
            type: RumEventType.ERROR,
            tags: {
                error_id: "error.id",
                trace_id: "_gc.trace_id",
                span_id: "_gc.span_id",
                error_source: "error.source",
                error_type: "error.type",
                error_handling: "error.handling"
            },
            fields: {
                error_message: [ "string", "error.message" ],
                error_stack: [ "string", "error.stack" ],
                error_causes: [ "string", "error.causes" ],
                error_handling_stack: [ "string", "error.handling_stack" ]
            }
        },
        long_task: {
            type: RumEventType.LONG_TASK,
            tags: {
                long_task_id: "long_task.id"
            },
            fields: {
                duration: "long_task.duration",
                blocking_duration: "long_task.blocking_duration",
                first_ui_event_timestamp: "long_task.first_ui_event_timestamp",
                render_start: "long_task.render_start",
                style_and_layout_start: "long_task.style_and_layout_start",
                long_task_start_time: "long_task.start_time",
                scripts: [ "string", "long_task.scripts" ]
            }
        },
        action: {
            type: RumEventType.ACTION,
            tags: {
                action_type: "action.type"
            },
            fields: {
                action_name: "action.target.name",
                duration: "action.loading_time",
                action_error_count: "action.error.count",
                action_resource_count: "action.resource.count",
                action_frustration_types: "action.frustration.type",
                action_long_task_count: "action.long_task.count",
                action_target: "_gc.action.target",
                action_position: "_gc.action.position"
            }
        },
        telemetry: {
            type: "telemetry",
            fields: {
                status: "telemetry.status",
                message: [ "string", "telemetry.message" ],
                type: "telemetry.type",
                error_stack: [ "string", "telemetry.error.stack" ],
                error_kind: [ "string", "telemetry.error.kind" ],
                connectivity: [ "string", "telemetry.connectivity" ],
                runtime_env: [ "string", "telemetry.runtime_env" ],
                usage: [ "string", "telemetry.usage" ],
                configuration: [ "string", "telemetry.configuration" ]
            }
        },
        browser_log: {
            type: RumEventType.LOGGER,
            tags: {
                error_source: "error.source",
                error_type: "error.type",
                error_resource_url: "http.url",
                error_resource_url_host: "http.url_host",
                error_resource_url_path: "http.url_path",
                error_resource_url_path_group: "http.url_path_group",
                error_resource_status: "http.status_code",
                error_resource_status_group: "http.status_group",
                error_resource_method: "http.method",
                action_id: "user_action.id",
                service: "service",
                status: "status"
            },
            fields: {
                message: [ "string", "message" ],
                error_message: [ "string", "error.message" ],
                error_stack: [ "string", "error.stack" ]
            }
        }
    };
    var VISIBILITY_CHECK_DELAY = ONE_MINUTE;
    var SESSION_CONTEXT_TIMEOUT_DELAY = SESSION_TIME_OUT_DELAY;
    function startSessionManager(configuration, productKey, computeSessionState) {
        var renewObservable = new Observable;
        var expireObservable = new Observable;
        var sessionStore = startSessionStore(configuration.sessionStoreStrategyType, productKey, computeSessionState);
        var sessionContextHistory = createValueHistory({
            expireDelay: SESSION_CONTEXT_TIMEOUT_DELAY
        });
        sessionStore.renewObservable.subscribe((function() {
            sessionContextHistory.add(buildSessionContext(), tools_relativeNow());
            renewObservable.notify();
        }));
        sessionStore.expireObservable.subscribe((function() {
            expireObservable.notify();
            sessionContextHistory.closeActive(tools_relativeNow());
        }));
        sessionStore.expandOrRenewSession();
        sessionContextHistory.add(buildSessionContext(), clocksOrigin().relative);
        trackActivity((function() {
            sessionStore.expandOrRenewSession();
        }));
        trackVisibility((function() {
            return sessionStore.expandSession();
        }));
        trackResume((function() {
            sessionStore.restartSession();
        }));
        function buildSessionContext() {
            return {
                id: sessionStore.getSession().id,
                trackingType: sessionStore.getSession()[productKey],
                hasError: !!sessionStore.getSession().hasError
            };
        }
        return {
            findSession: function findSession(startTime, options) {
                return sessionContextHistory.find(startTime, options);
            },
            renewObservable: renewObservable,
            expireObservable: expireObservable,
            sessionStateUpdateObservable: sessionStore.sessionStateUpdateObservable,
            expire: sessionStore.expire,
            updateSessionState: sessionStore.updateSessionState
        };
    }
    function trackActivity(expandOrRenewSession) {
        var _addEventListeners = addEventListeners(window, [ DOM_EVENT.CLICK, DOM_EVENT.TOUCH_START, DOM_EVENT.KEY_DOWN, DOM_EVENT.SCROLL ], expandOrRenewSession, {
            capture: true,
            passive: true
        });
        _addEventListeners.stop;
    }
    function trackVisibility(expandSession) {
        var expandSessionWhenVisible = function expandSessionWhenVisible() {
            if (document.visibilityState === "visible") {
                expandSession();
            }
        };
        var _addEventListener = addEventListener(document, DOM_EVENT.VISIBILITY_CHANGE, expandSessionWhenVisible);
        _addEventListener.stop;
        timer_setInterval(expandSessionWhenVisible, VISIBILITY_CHECK_DELAY);
    }
    function trackResume(cb) {
        var _addEventListener2 = addEventListener(window, DOM_EVENT.RESUME, cb, {
            capture: true
        });
        _addEventListener2.stop;
    }
    var MAX_ONGOING_BYTES_COUNT = 80 * ONE_KIBI_BYTE;
    var MAX_ONGOING_REQUESTS = 32;
    var MAX_QUEUE_BYTES_COUNT = 3 * ONE_MEBI_BYTE;
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
                onSuccess: function onSuccess() {
                    return retryQueuedPayloads(RetryReason.AFTER_SUCCESS, state, sendStrategy, endpointUrl, reportError);
                },
                onFailure: function onFailure() {
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
        timer_setTimeout((function() {
            var payload = state.queuedPayloads.first();
            send(payload, state, sendStrategy, {
                onSuccess: function onSuccess() {
                    state.queuedPayloads.dequeue();
                    state.currentBackoffTime = INITIAL_BACKOFF_TIME;
                    retryQueuedPayloads(RetryReason.AFTER_RESUME, state, sendStrategy, endpointUrl, reportError);
                },
                onFailure: function onFailure() {
                    state.currentBackoffTime = Math.min(MAX_BACKOFF_TIME, state.currentBackoffTime * 2);
                    scheduleRetry(state, sendStrategy, endpointUrl, reportError);
                }
            });
        }), state.currentBackoffTime);
    }
    function send(payload, state, sendStrategy, responseData) {
        var onSuccess = responseData.onSuccess;
        var onFailure = responseData.onFailure;
        state.bandwidthMonitor.add(payload);
        sendStrategy(payload, (function(response) {
            state.bandwidthMonitor.remove(payload);
            if (!shouldRetryRequest(response, state, payload)) {
                state.transportStatus = TransportStatus.UP;
                onSuccess();
            } else {
                state.transportStatus = state.bandwidthMonitor.ongoingRequestCount > 0 ? TransportStatus.FAILURE_DETECTED : TransportStatus.DOWN;
                payload.retry = {
                    count: payload.retry ? payload.retry.count + 1 : 1,
                    lastFailureStatus: response.status
                };
                onFailure();
            }
        }));
    }
    function retryQueuedPayloads(reason, state, sendStrategy, endpointUrl, reportError) {
        if (reason === RetryReason.AFTER_SUCCESS && state.queuedPayloads.isFull() && !state.queueFullReported) {
            reportError({
                message: "Reached max " + endpointUrl + " events size queued for upload: " + MAX_QUEUE_BYTES_COUNT / ONE_MEBI_BYTE + "MiB",
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
        return response.type !== "opaque" && (response.status === 0 && !navigator.onLine || response.status === 408 || response.status === 429 || response.status >= 500);
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
            enqueue: function enqueue(payload) {
                if (this.isFull()) {
                    return;
                }
                queue.push(payload);
                this.bytesCount += payload.bytesCount;
            },
            first: function first() {
                return queue[0];
            },
            dequeue: function dequeue() {
                var payload = queue.shift();
                if (payload) {
                    this.bytesCount -= payload.bytesCount;
                }
                return payload;
            },
            size: function size() {
                return queue.length;
            },
            isFull: function isFull() {
                return this.bytesCount >= MAX_QUEUE_BYTES_COUNT;
            }
        };
    }
    function newBandwidthMonitor() {
        return {
            ongoingRequestCount: 0,
            ongoingByteCount: 0,
            canHandle: function canHandle(payload) {
                return this.ongoingRequestCount === 0 || this.ongoingByteCount + payload.bytesCount <= MAX_ONGOING_BYTES_COUNT && this.ongoingRequestCount < MAX_ONGOING_REQUESTS;
            },
            add: function add(payload) {
                this.ongoingRequestCount += 1;
                this.ongoingByteCount += payload.bytesCount;
            },
            remove: function remove(payload) {
                this.ongoingRequestCount -= 1;
                this.ongoingByteCount -= payload.bytesCount;
            }
        };
    }
    function addBatchPrecision(url, encoding) {
        if (!url) return url;
        url = url + (url.indexOf("?") === -1 ? "?" : "&") + "precision=ms";
        if (encoding) {
            url = url + "&encoding=" + encoding;
        }
        return url;
    }
    function createHttpRequest(endpointUrl, bytesLimit, retryMaxSize, reportError) {
        if (retryMaxSize === undefined) {
            retryMaxSize = -1;
        }
        var retryState = newRetryState(retryMaxSize);
        var sendStrategyForRetry = function sendStrategyForRetry(payload, onResponse) {
            return fetchKeepAliveStrategy(endpointUrl, bytesLimit, payload, onResponse);
        };
        return {
            send: function send(payload) {
                sendWithRetryStrategy(payload, retryState, sendStrategyForRetry, endpointUrl, reportError);
            },
            sendOnExit: function sendOnExit(payload) {
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
                    beaconData = new Blob([ data ], {
                        type: payload.type
                    });
                } else {
                    beaconData = data;
                }
                var isQueued = navigator.sendBeacon(url, beaconData);
                if (isQueued) {
                    return;
                }
            } catch (e) {}
        }
        sendXHR(url, payload);
    }
    function fetchKeepAliveStrategy(endpointUrl, bytesLimit, payload, onResponse) {
        var data = payload.data;
        var bytesCount = payload.bytesCount;
        var url = addBatchPrecision(endpointUrl, payload.encoding);
        var canUseKeepAlive = isKeepAliveSupported() && bytesCount < bytesLimit;
        if (canUseKeepAlive) {
            var fetchOption = {
                method: "POST",
                body: data,
                keepalive: true,
                mode: "cors"
            };
            if (payload.type) {
                fetchOption.headers = {
                    "Content-Type": payload.type
                };
            }
            fetch(url, fetchOption).then(monitor((function(response) {
                if (typeof onResponse === "function") {
                    onResponse({
                        status: response.status,
                        type: response.type
                    });
                }
            })), monitor((function() {
                sendXHR(url, payload, onResponse);
            })));
        } else {
            sendXHR(url, payload, onResponse);
        }
    }
    function isKeepAliveSupported() {
        try {
            return window.Request && "keepalive" in new Request("http://a");
        } catch (_unused) {
            return false;
        }
    }
    function sendXHR(url, payload, onResponse) {
        var data = payload.data;
        var request = new XMLHttpRequest;
        request.open("POST", url, true);
        if (data instanceof Blob) {
            request.setRequestHeader("Content-Type", data.type);
        } else if (payload.type) {
            request.setRequestHeader("Content-Type", payload.type);
        }
        addEventListener(request, "loadend", (function() {
            if (typeof onResponse === "function") {
                onResponse({
                    status: request.status
                });
            }
        }), {
            once: true
        });
        request.send(data);
    }
    function escapeRowData(str) {
        if (typeof_typeof(str) === "object" && str) {
            str = jsonStringify_jsonStringify(str);
        } else if (!isString(str)) {
            return str;
        }
        var reg = /[\s=,"]/g;
        return String(str).replace(reg, (function(word) {
            return "\\" + word;
        }));
    }
    function escapeJsonValue(value, isTag) {
        if (typeof_typeof(value) === "object" && value) {
            value = jsonStringify_jsonStringify(value);
        } else if (isTag) {
            value = "" + value;
        }
        return value;
    }
    function escapeFieldValueStr(str) {
        return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    }
    function escapeRowField(value) {
        if (typeof_typeof(value) === "object" && value) {
            return escapeFieldValueStr(jsonStringify_jsonStringify(value));
        } else if (isString(value)) {
            return escapeFieldValueStr(value);
        } else {
            return value;
        }
    }
    var CUSTOM_KEYS = "custom_keys";
    var processedMessageByDataMap = function processedMessageByDataMap(message) {
        if (!message || !message.type) return {
            rowStr: "",
            rowData: undefined
        };
        var rowData = {
            tags: {},
            fields: {}
        };
        var hasFileds = false;
        var rowStr = "";
        tools_each(dataMap, (function(value, key) {
            if (value.type === message.type) {
                rowStr += key + ",";
                rowData.measurement = key;
                var tagsStr = [];
                var tags = extend({}, commonTags, value.tags);
                var filterFileds = [ "date", "type", CUSTOM_KEYS ];
                tools_each(tags, (function(value_path, _key) {
                    var _value = findByPath(message, value_path);
                    filterFileds.push(_key);
                    if (_value || isNumber(_value)) {
                        rowData.tags[_key] = escapeJsonValue(_value, true);
                        tagsStr.push(escapeRowData(_key) + "=" + escapeRowData(_value));
                    }
                }));
                var fieldsStr = [];
                var fields = extend({}, commonFields, value.fields);
                tools_each(fields, (function(_value, _key) {
                    if (isArray(_value) && _value.length === 2) {
                        var value_path = _value[1];
                        var _valueData = findByPath(message, value_path);
                        filterFileds.push(_key);
                        if (_valueData !== undefined && _valueData !== null) {
                            rowData.fields[_key] = escapeJsonValue(_valueData);
                            fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_valueData));
                        }
                    } else if (isString(_value)) {
                        var _valueData = findByPath(message, _value);
                        filterFileds.push(_key);
                        if (_valueData !== undefined && _valueData !== null) {
                            rowData.fields[_key] = escapeJsonValue(_valueData);
                            fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_valueData));
                        }
                    }
                }));
                if (message.context && isObject(message.context) && !isEmptyObject(message.context)) {
                    var _tagKeys = [];
                    tools_each(message.context, (function(_value, _key) {
                        if (filterFileds.indexOf(_key) > -1) return;
                        filterFileds.push(_key);
                        if (_value !== undefined && _value !== null) {
                            _tagKeys.push(_key);
                            rowData.fields[_key] = escapeJsonValue(_value);
                            fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_value));
                        }
                    }));
                    if (_tagKeys.length) {
                        rowData.fields[CUSTOM_KEYS] = escapeJsonValue(_tagKeys);
                        fieldsStr.push(escapeRowData(CUSTOM_KEYS) + "=" + escapeRowField(_tagKeys));
                    }
                }
                if (message.type === RumEventType.LOGGER) {
                    tools_each(message, (function(value, key) {
                        if (filterFileds.indexOf(key) === -1 && value !== undefined && value !== null) {
                            rowData.fields[key] = escapeJsonValue(value);
                            fieldsStr.push(escapeRowData(key) + "=" + escapeRowField(value));
                        }
                    }));
                }
                if (tagsStr.length) {
                    rowStr += tagsStr.join(",");
                }
                if (fieldsStr.length) {
                    rowStr += " ";
                    rowStr += fieldsStr.join(",");
                    hasFileds = true;
                }
                rowStr = rowStr + " " + message.date;
                rowData.time = message.date;
            }
        }));
        return {
            rowStr: hasFileds ? rowStr : "",
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
        var flushSubscription = flushController.flushObservable.subscribe((function(event) {
            flush(event);
        }));
        function getMessageText(messages) {
            var isEmpty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            if (sendContentTypeByJson) {
                if (isEmpty) {
                    return "[" + messages.join(",");
                } else {
                    return "," + messages.join(",");
                }
            } else {
                if (isEmpty) {
                    return messages.join("\n");
                } else {
                    return "\n" + messages.join("\n");
                }
            }
        }
        function push(serializedMessage, estimatedMessageBytesCount, key) {
            flushController.notifyBeforeAddMessage(estimatedMessageBytesCount);
            if (key !== undefined) {
                upsertBuffer[key] = serializedMessage;
                flushController.notifyAfterAddMessage();
            } else {
                encoder.write(getMessageText([ serializedMessage ], encoder.isEmpty()), (function(realMessageBytesCount) {
                    flushController.notifyAfterAddMessage(realMessageBytesCount - estimatedMessageBytesCount);
                }));
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
            var processedMessage = "";
            if (sendContentTypeByJson) {
                processedMessage = jsonStringify_jsonStringify(processedMessageByDataMap(message).rowData);
            } else {
                processedMessage = processedMessageByDataMap(message).rowStr;
            }
            return processedMessage;
        }
        function addOrUpdate(message, key) {
            var serializedMessage = process(message);
            var estimatedMessageBytesCount = encoder.estimateEncodedBytesCount(serializedMessage);
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
            var upsertMessages = values(upsertBuffer).join(sendContentTypeByJson ? "," : "\n");
            upsertBuffer = {};
            var isPageExit = isPageExitReason(event.reason);
            var send = isPageExit ? request.sendOnExit : request.send;
            if (isPageExit && encoder.isAsync) {
                var encoderResult = encoder.finishSync();
                if (encoderResult.outputBytesCount) {
                    send(formatPayloadFromEncoder(encoderResult, sendContentTypeByJson));
                }
                var pendingMessages = [ encoderResult.pendingData, upsertMessages ].filter(Boolean).join("\n");
                if (pendingMessages) {
                    send({
                        data: pendingMessages,
                        bytesCount: computeBytesCount(pendingMessages)
                    });
                }
            } else {
                if (upsertMessages) {
                    var text = getMessageText([ upsertMessages ], encoder.isEmpty());
                    if (sendContentTypeByJson) {
                        text += "]";
                    }
                    encoder.write(text);
                } else {
                    if (sendContentTypeByJson) {
                        encoder.write("]");
                    }
                }
                encoder.finish((function(encoderResult) {
                    send(formatPayloadFromEncoder(encoderResult));
                }));
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
        if (typeof encoderResult.output === "string") {
            data = encoderResult.output;
        } else {
            data = new Blob([ encoderResult.output ], {
                type: "text/plain"
            });
        }
        return {
            data: data,
            type: sendContentTypeByJson ? "application/json;UTF-8" : undefined,
            bytesCount: encoderResult.outputBytesCount,
            encoding: encoderResult.encoding
        };
    }
    function createFlushController(_ref) {
        var messagesLimit = _ref.messagesLimit, bytesLimit = _ref.bytesLimit, durationLimit = _ref.durationLimit, pageExitObservable = _ref.pageExitObservable, sessionExpireObservable = _ref.sessionExpireObservable;
        pageExitObservable.subscribe((function(event) {
            return flush(event.reason);
        }));
        sessionExpireObservable.subscribe((function() {
            return flush("session_expire");
        }));
        var flushObservable = new Observable((function() {
            return function() {
                pageExitSubscription.unsubscribe();
                sessionExpireSubscription.unsubscribe();
            };
        }));
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
                durationLimitTimeoutId = timer_setTimeout((function() {
                    flush("duration_limit");
                }), durationLimit);
            }
        }
        function cancelDurationLimitTimeout() {
            timer_clearTimeout(durationLimitTimeoutId);
            durationLimitTimeoutId = undefined;
        }
        return {
            flushObservable: flushObservable,
            getMessagesCount: function getMessagesCount() {
                return currentMessagesCount;
            },
            notifyBeforeAddMessage: function notifyBeforeAddMessage(estimatedMessageBytesCount) {
                if (currentBytesCount + estimatedMessageBytesCount >= bytesLimit) {
                    flush("bytes_limit");
                }
                currentMessagesCount += 1;
                currentBytesCount += estimatedMessageBytesCount;
                scheduleDurationLimitTimeout();
            },
            notifyAfterAddMessage: function notifyAfterAddMessage(messageBytesCountDiff) {
                if (messageBytesCountDiff === undefined) {
                    messageBytesCountDiff = 0;
                }
                currentBytesCount += messageBytesCountDiff;
                if (currentMessagesCount >= messagesLimit) {
                    flush("messages_limit");
                } else if (currentBytesCount >= bytesLimit) {
                    flush("bytes_limit");
                }
            },
            notifyAfterRemoveMessage: function notifyAfterRemoveMessage(messageBytesCount) {
                currentBytesCount -= messageBytesCount;
                currentMessagesCount -= 1;
                if (currentMessagesCount === 0) {
                    cancelDurationLimitTimeout();
                }
            }
        };
    }
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
            add: function add(message) {
                primaryBatch.add(message);
            },
            upsert: function upsert(message, key) {
                primaryBatch.upsert(message, key);
            },
            stop: function stop() {
                primaryBatch.stop();
            }
        };
    }
    function canUseEventBridge() {
        var _getGlobalObject$loca;
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_getGlobalObject$loca = getGlobalObject().location) === null || _getGlobalObject$loca === void 0 ? void 0 : _getGlobalObject$loca.hostname;
        return false;
    }
    var SYNTHETICS_INJECTS_RUM_COOKIE_NAME = "guance-synthetics-injects-rum";
    function willSyntheticsInjectRum() {
        return Boolean(window._GUANCE_SYNTHETICS_INJECTS_RUM || cookie_getCookie(SYNTHETICS_INJECTS_RUM_COOKIE_NAME));
    }
    function toPrimitive(t, r) {
        if ("object" != typeof_typeof(t) || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var i = e.call(t, r || "default");
            if ("object" != typeof_typeof(i)) return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
    }
    function toPropertyKey(t) {
        var i = toPrimitive(t, "string");
        return "symbol" == typeof_typeof(i) ? i : i + "";
    }
    function _defineProperty(e, r, t) {
        return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t, e;
    }
    function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
            }))), t.push.apply(t, o);
        }
        return t;
    }
    function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? ownKeys(Object(t), !0).forEach((function(r) {
                _defineProperty(e, r, t[r]);
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
            }));
        }
        return e;
    }
    function ensureProperties(context, propertiesConfig, name) {
        var newContext = _objectSpread({}, context);
        for (var _i = 0, _Object$entries = Object.entries(propertiesConfig); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], _Object$entries$_i$ = _Object$entries$_i[1], required = _Object$entries$_i$.required, type = _Object$entries$_i$.type;
            if (type === "string" && key in newContext) {
                newContext[key] = String(newContext[key]);
            }
            if (required && !(key in context)) {
                display.warn("The property ".concat(key, " of ").concat(name, " context is required; context will not be sent to the intake."));
            }
        }
        return newContext;
    }
    function createContextManager() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, customerDataTracker = _ref.customerDataTracker, _ref$propertiesConfig = _ref.propertiesConfig, propertiesConfig = _ref$propertiesConfig === void 0 ? {} : _ref$propertiesConfig;
        var context = {};
        var changeObservable = new Observable;
        var contextManager = {
            getContext: function getContext() {
                return deepClone(context);
            },
            setContext: function setContext(newContext) {
                if (getType(newContext) === "object") {
                    context = sanitize(ensureProperties(newContext, propertiesConfig, name));
                    customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
                } else {
                    contextManager.clearContext();
                }
                changeObservable.notify();
            },
            setContextProperty: function setContextProperty(key, property) {
                context[key] = sanitize(ensureProperties(_defineProperty({}, key, property), propertiesConfig, name)[key]);
                customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
                changeObservable.notify();
            },
            removeContextProperty: function removeContextProperty(key) {
                delete context[key];
                customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.updateCustomerData(context);
                ensureProperties(context, propertiesConfig, name);
                changeObservable.notify();
            },
            clearContext: function clearContext() {
                context = {};
                customerDataTracker === null || customerDataTracker === void 0 || customerDataTracker.resetCustomerData();
                changeObservable.notify();
            },
            changeObservable: changeObservable
        };
        return contextManager;
    }
    var CustomerDataType = {
        FeatureFlag: "feature flag evaluation",
        User: "user",
        GlobalContext: "global context",
        View: "view"
    };
    var CONTEXT_STORE_KEY_PREFIX = "_gc_s";
    var storageListeners = [];
    function storeContextManager(configuration, contextManager, productKey, customerDataType) {
        var storageKey = buildStorageKey(configuration, productKey, customerDataType);
        storageListeners.push(addEventListener(window, DOM_EVENT.STORAGE, (function(params) {
            if (storageKey === params.key) {
                synchronizeWithStorage();
            }
        })));
        contextManager.changeObservable.subscribe(dumpToStorage);
        contextManager.setContext(extend2Lev(getFromStorage(), contextManager.getContext()));
        function synchronizeWithStorage() {
            contextManager.setContext(getFromStorage());
        }
        function dumpToStorage() {
            localStorage.setItem(storageKey, JSON.stringify(contextManager.getContext()));
        }
        function getFromStorage() {
            var rawContext = localStorage.getItem(storageKey);
            return rawContext !== null ? JSON.parse(rawContext) : {};
        }
        return contextManager;
    }
    function buildStorageKey(configuration, productKey, customerDataType) {
        if (configuration.storeContextsKey && isString(configuration.storeContextsKey)) {
            return CONTEXT_STORE_KEY_PREFIX + "_" + productKey + "_" + customerDataType + "_" + configuration.storeContextsKey;
        } else {
            return CONTEXT_STORE_KEY_PREFIX + "_" + productKey + "_" + customerDataType;
        }
    }
    var CUSTOMER_DATA_BYTES_LIMIT = 3 * ONE_KIBI_BYTE;
    var CUSTOMER_COMPRESSED_DATA_BYTES_LIMIT = 16 * ONE_KIBI_BYTE;
    var BYTES_COMPUTATION_THROTTLING_DELAY = 200;
    var CustomerDataCompressionStatus = {
        Unknown: 0,
        Enabled: 1,
        Disabled: 2
    };
    function createCustomerDataTrackerManager() {
        var compressionStatus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CustomerDataCompressionStatus.Disabled;
        var customerDataTrackers = new Map;
        var alreadyWarned = false;
        function checkCustomerDataLimit() {
            var initialBytesCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            if (alreadyWarned || compressionStatus === CustomerDataCompressionStatus.Unknown) {
                return;
            }
            var bytesCountLimit = compressionStatus === CustomerDataCompressionStatus.Disabled ? CUSTOMER_DATA_BYTES_LIMIT : CUSTOMER_COMPRESSED_DATA_BYTES_LIMIT;
            var bytesCount = initialBytesCount;
            customerDataTrackers.forEach((function(tracker) {
                bytesCount += tracker.getBytesCount();
            }));
            if (bytesCount > bytesCountLimit) {
                displayCustomerDataLimitReachedWarning(bytesCountLimit);
                alreadyWarned = true;
            }
        }
        return {
            createDetachedTracker: function createDetachedTracker() {
                var tracker = createCustomerDataTracker((function() {
                    return checkCustomerDataLimit(tracker.getBytesCount());
                }));
                return tracker;
            },
            getOrCreateTracker: function getOrCreateTracker(type) {
                if (!customerDataTrackers.has(type)) {
                    customerDataTrackers.set(type, createCustomerDataTracker(checkCustomerDataLimit));
                }
                return customerDataTrackers.get(type);
            },
            setCompressionStatus: function setCompressionStatus(newCompressionStatus) {
                if (compressionStatus === CustomerDataCompressionStatus.Unknown) {
                    compressionStatus = newCompressionStatus;
                    checkCustomerDataLimit();
                }
            },
            getCompressionStatus: function getCompressionStatus() {
                return compressionStatus;
            },
            stop: function stop() {
                customerDataTrackers.forEach((function(tracker) {
                    return tracker.stop();
                }));
                customerDataTrackers.clear();
            }
        };
    }
    function createCustomerDataTracker(checkCustomerDataLimit) {
        var bytesCountCache = 0;
        var _throttle = throttle((function(context) {
            bytesCountCache = computeBytesCount(jsonStringify_jsonStringify(context));
            checkCustomerDataLimit();
        }), BYTES_COMPUTATION_THROTTLING_DELAY), computeBytesCountThrottled = _throttle.throttled, cancelComputeBytesCount = _throttle.cancel;
        var resetBytesCount = function resetBytesCount() {
            cancelComputeBytesCount();
            bytesCountCache = 0;
        };
        return {
            updateCustomerData: function updateCustomerData(context) {
                if (isEmptyObject(context)) {
                    resetBytesCount();
                } else {
                    computeBytesCountThrottled(context);
                }
            },
            resetCustomerData: resetBytesCount,
            getBytesCount: function getBytesCount() {
                return bytesCountCache;
            },
            stop: function stop() {
                cancelComputeBytesCount();
            }
        };
    }
    function displayCustomerDataLimitReachedWarning(bytesCountLimit) {
        display.warn("Customer data exceeds the recommended ".concat(bytesCountLimit / ONE_KIBI_BYTE, "KiB threshold."));
    }
    function createIdentityEncoder() {
        var output = "";
        var outputBytesCount = 0;
        return {
            isAsync: false,
            isEmpty: function isEmpty() {
                return !output;
            },
            write: function write(data, callback) {
                var additionalEncodedBytesCount = computeBytesCount(data);
                outputBytesCount += additionalEncodedBytesCount;
                output += data;
                if (callback) {
                    callback(additionalEncodedBytesCount);
                }
            },
            finish: function finish(callback) {
                callback(this.finishSync());
            },
            finishSync: function finishSync() {
                var result = {
                    output: output,
                    outputBytesCount: outputBytesCount,
                    rawBytesCount: outputBytesCount,
                    pendingData: ""
                };
                output = "";
                outputBytesCount = 0;
                return result;
            },
            estimateEncodedBytesCount: function estimateEncodedBytesCount(data) {
                return data.length;
            }
        };
    }
    function sanitizeUser(newUser) {
        var user = tools_assign({}, newUser);
        var keys = [ "id", "name", "email" ];
        tools_each(keys, (function(key) {
            if (key in user) {
                user[key] = String(user[key]);
            }
        }));
        return user;
    }
    function checkUser(newUser) {
        var isValid = getType(newUser) === "object";
        if (!isValid) {
            display.error("Unsupported user:", newUser);
        }
        return isValid;
    }
    var PLACEHOLDER = 1;
    function polyfills_WeakSet(initialValues) {
        this.map = new WeakMap;
        if (initialValues) {
            initialValues.forEach((function(value) {
                this.map.set(value, PLACEHOLDER);
            }));
        }
    }
    polyfills_WeakSet.prototype.add = function(value) {
        this.map.set(value, PLACEHOLDER);
        return this;
    };
    polyfills_WeakSet.prototype["delete"] = function(value) {
        return this.map["delete"](value);
    };
    polyfills_WeakSet.prototype.has = function(value) {
        return this.map.has(value);
    };
    function displayAlreadyInitializedError(sdkName, initConfiguration) {
        if (!initConfiguration.silentMultipleInit) {
            display.error(sdkName + " is already initialized.");
        }
    }
    var RUM_SESSION_KEY = "rum";
    var RumSessionPlan = {
        WITHOUT_SESSION_REPLAY: 1,
        WITH_SESSION_REPLAY: 2,
        WITH_ERROR_SESSION_REPLAY: 3
    };
    var RumTrackingType = {
        NOT_TRACKED: "0",
        TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY: "1",
        TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY: "2",
        TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY: "3",
        TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY: "4",
        TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY: "5",
        TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY: "6"
    };
    function startRumSessionManager(configuration, lifeCycle) {
        var sessionManager = startSessionManager(configuration, RUM_SESSION_KEY, (function(rawTrackingType) {
            return computeSessionState(configuration, rawTrackingType);
        }));
        sessionManager.expireObservable.subscribe((function() {
            lifeCycle.notify(LifeCycleEventType.SESSION_EXPIRED);
        }));
        sessionManager.renewObservable.subscribe((function() {
            lifeCycle.notify(LifeCycleEventType.SESSION_RENEWED);
        }));
        sessionManager.sessionStateUpdateObservable.subscribe((function(_ref) {
            var previousState = _ref.previousState, newState = _ref.newState;
            if (!previousState.hasError && newState.hasError) {
                var sessionEntity = sessionManager.findSession();
                if (sessionEntity) {
                    sessionEntity.hasError = true;
                    sessionEntity.ets = newState.ets || timeStampNow();
                }
            }
        }));
        return {
            findTrackedSession: function findTrackedSession(startTime) {
                var session = sessionManager.findSession(startTime);
                if (!session || !isTypeTracked(session.trackingType)) {
                    return;
                }
                var isErrorSession = session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY || session.trackingType === RumTrackingType.TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY;
                var plan = RumSessionPlan.WITHOUT_SESSION_REPLAY;
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
                    sessionReplayAllowed: plan === RumSessionPlan.WITH_SESSION_REPLAY || plan === RumSessionPlan.WITH_ERROR_SESSION_REPLAY
                };
            },
            expire: sessionManager.expire,
            expireObservable: sessionManager.expireObservable,
            sessionStateUpdateObservable: sessionManager.sessionStateUpdateObservable,
            setErrorForSession: function setErrorForSession() {
                return sessionManager.updateSessionState({
                    hasError: "1",
                    ets: timeStampNow()
                });
            }
        };
    }
    function startRumSessionManagerStub() {}
    function computeSessionState(configuration, rawTrackingType) {
        var sessionSampleRate = configuration.sessionSampleRate, sessionOnErrorSampleRate = configuration.sessionOnErrorSampleRate, sessionReplaySampleRate = configuration.sessionReplaySampleRate, sessionReplayOnErrorSampleRate = configuration.sessionReplayOnErrorSampleRate;
        var isSession = performDraw(sessionSampleRate);
        var isErrorSession = performDraw(sessionOnErrorSampleRate);
        var isSessionReplay = performDraw(sessionReplaySampleRate);
        var isErrorSessionReplay = performDraw(sessionReplayOnErrorSampleRate);
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
    var USR_ID_COOKIE_NAME = "_gc_usr_id";
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
    var startCacheUsrCache = function startCacheUsrCache(configuration) {
        if (!configuration.sessionStoreStrategyType) return;
        var usrCacheId;
        if (configuration.sessionStoreStrategyType.type === "Cookie") {
            usrCacheId = initUsrCookie(configuration.sessionStoreStrategyType.cookieOptions);
        } else {
            usrCacheId = initUsrLocalStorage();
        }
        return {
            getId: function getId() {
                return usrCacheId;
            }
        };
    };
    function createDOMMutationObservable() {
        var MutationObserver = getMutationObserverConstructor();
        return new Observable((function(observable) {
            if (!MutationObserver) {
                return;
            }
            var observer = new MutationObserver(monitor((function() {
                return observable.notify();
            })));
            observer.observe(document, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true
            });
            return function() {
                return observer.disconnect();
            };
        }));
    }
    function getMutationObserverConstructor() {
        var constructor;
        var browserWindow = window;
        if (browserWindow.Zone) {
            constructor = getZoneJsOriginalValue(browserWindow, "MutationObserver");
            if (browserWindow.MutationObserver && constructor === browserWindow.MutationObserver) {
                var patchedInstance = new browserWindow.MutationObserver(tools_noop);
                var originalInstance = getZoneJsOriginalValue(patchedInstance, "originalInstance");
                constructor = originalInstance && originalInstance.constructor;
            }
        }
        if (!constructor) {
            constructor = browserWindow.MutationObserver;
        }
        return constructor;
    }
    function createLocationChangeObservable(location) {
        var currentLocation = shallowClone(location);
        return new Observable((function(observable) {
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
            return function() {
                _trackHistory.stop();
                _trackHash.stop();
            };
        }));
    }
    function trackHistory(onHistoryChange) {
        var pushState = instrumentMethod(History.prototype, "pushState", (function(params) {
            var onPostCall = params.onPostCall;
            onPostCall(onHistoryChange);
        }));
        var replaceState = instrumentMethod(History.prototype, "replaceState", (function(params) {
            var onPostCall = params.onPostCall;
            onPostCall(onHistoryChange);
        }));
        var popState = addEventListener(window, DOM_EVENT.POP_STATE, onHistoryChange);
        return {
            stop: function stop() {
                pushState.stop();
                replaceState.stop();
                popState.stop();
            }
        };
    }
    function trackHash(onHashChange) {
        return addEventListener(window, DOM_EVENT.HASH_CHANGE, onHashChange);
    }
    var MAX_PAGE_STATE_ENTRIES = 4e3;
    var MAX_PAGE_STATE_ENTRIES_SELECTABLE = 500;
    var PAGE_STATE_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
    var PageState = {
        ACTIVE: "active",
        PASSIVE: "passive",
        HIDDEN: "hidden",
        FROZEN: "frozen",
        TERMINATED: "terminated"
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
        addPageState(getPageState(), tools_relativeNow());
        var _addEventListeners = addEventListeners(window, [ DOM_EVENT.PAGE_SHOW, DOM_EVENT.FOCUS, DOM_EVENT.BLUR, DOM_EVENT.VISIBILITY_CHANGE, DOM_EVENT.RESUME, DOM_EVENT.FREEZE, DOM_EVENT.PAGE_HIDE ], (function(event) {
            addPageState(computePageState(event), event.timeStamp);
        }), {
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
        var pageStateHistory = {
            findAll: function findAll(eventStartTime, duration) {
                var pageStateEntries = pageStateEntryHistory.findAll(eventStartTime, duration);
                if (pageStateEntries.length === 0) {
                    return;
                }
                var pageStateServerEntries = [];
                var limit = Math.max(0, pageStateEntries.length - maxPageStateEntriesSelectable);
                for (var index = pageStateEntries.length - 1; index >= limit; index--) {
                    var pageState = pageStateEntries[index];
                    var relativeStartTime = tools_elapsed(eventStartTime, pageState.startTime);
                    pageStateServerEntries.push({
                        state: pageState.state,
                        start: toServerDuration(relativeStartTime)
                    });
                }
                return pageStateServerEntries;
            },
            wasInPageStateAt: function wasInPageStateAt(state, startTime) {
                return pageStateHistory.wasInPageStateDuringPeriod(state, startTime, 0);
            },
            wasInPageStateDuringPeriod: function wasInPageStateDuringPeriod(state, startTime, duration) {
                return pageStateEntryHistory.findAll(startTime, duration).some((function(pageState) {
                    return pageState.state === state;
                }));
            },
            addPageState: addPageState,
            stop: function stop() {
                stopEventListeners();
                pageStateEntryHistory.stop();
            }
        };
        return pageStateHistory;
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
        if (document.visibilityState === "hidden") {
            return PageState.HIDDEN;
        }
        if (document.hasFocus()) {
            return PageState.ACTIVE;
        }
        return PageState.PASSIVE;
    }
    function startActionCollection(lifeCycle, domMutationObservable, configuration, pageStateHistory) {
        lifeCycle.subscribe(LifeCycleEventType.AUTO_ACTION_COMPLETED, (function(action) {
            lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processAction(action, pageStateHistory));
        }));
        var actionContexts = {
            findActionId: tools_noop,
            findAllActionId: tools_noop
        };
        return {
            actionContexts: actionContexts,
            addAction: function addAction(action, savedCommonContext) {
                lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, extend({
                    savedCommonContext: savedCommonContext
                }, processAction(action, pageStateHistory)));
            }
        };
    }
    function processAction(action, pageStateHistory) {
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
                loadingTime: 0
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
        return action.type !== ActionType.CUSTOM;
    }
    function startRumBatch(configuration, lifeCycle, telemetryEventObservable, reportError, pageExitObservable, sessionExpireObservable, createEncoder) {
        var batch = startBatchWithReplica(configuration, {
            endpoint: configuration.rumEndpoint,
            encoder: createEncoder(2)
        }, reportError, pageExitObservable, sessionExpireObservable);
        lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_COLLECTED, (function(serverRumEvent) {
            if (serverRumEvent.type === RumEventType.VIEW) {
                batch.upsert(serverRumEvent, serverRumEvent.view.id);
            } else {
                batch.add(serverRumEvent);
            }
        }));
        return batch;
    }
    function assembly_ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
            }))), t.push.apply(t, o);
        }
        return t;
    }
    function assembly_objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? assembly_ownKeys(Object(t), !0).forEach((function(r) {
                _defineProperty(e, r, t[r]);
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : assembly_ownKeys(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
            }));
        }
        return e;
    }
    var SessionType = {
        SYNTHETICS: "synthetics",
        USER: "user"
    };
    var VIEW_MODIFIABLE_FIELD_PATHS = {
        "view.url": "string",
        "view.referrer": "string"
    };
    var USER_CUSTOMIZABLE_FIELD_PATHS = {
        context: "object"
    };
    var ROOT_MODIFIABLE_FIELD_PATHS = {
        service: "string",
        version: "string"
    };
    var modifiableFieldPathsByEvent = {};
    function startRumAssembly(configuration, lifeCycle, sessionManager, userSessionManager, viewContexts, urlContexts, actionContexts, displayContext, getCommonContext, reportError) {
        modifiableFieldPathsByEvent[RumEventType.VIEW] = assembly_objectSpread(assembly_objectSpread({}, USER_CUSTOMIZABLE_FIELD_PATHS), VIEW_MODIFIABLE_FIELD_PATHS);
        modifiableFieldPathsByEvent[RumEventType.ERROR] = tools_assign({
            "error.message": "string",
            "error.stack": "string",
            "error.resource.url": "string"
        }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
        modifiableFieldPathsByEvent[RumEventType.RESOURCE] = tools_assign({
            "resource.url": "string"
        }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
        modifiableFieldPathsByEvent[RumEventType.ACTION] = tools_assign({
            "action.target.name": "string"
        }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS);
        modifiableFieldPathsByEvent[RumEventType.LONG_TASK] = tools_assign({}, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS);
        var eventRateLimiters = {};
        eventRateLimiters[RumEventType.ERROR] = createEventRateLimiter(RumEventType.ERROR, configuration.eventRateLimiterThreshold, reportError);
        eventRateLimiters[RumEventType.ACTION] = createEventRateLimiter(RumEventType.ACTION, configuration.eventRateLimiterThreshold, reportError);
        lifeCycle.subscribe(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, (function(data) {
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
                        type: "web"
                    },
                    application: {
                        id: configuration.applicationId
                    },
                    device: deviceInfo,
                    env: configuration.env || "",
                    service: viewContext.service || configuration.service || "browser",
                    version: viewContext.version || configuration.version || "",
                    source: "browser",
                    date: timeStampNow(),
                    user: {
                        id: userSessionManager.getId(),
                        is_signin: "F",
                        is_login: false
                    },
                    session: {
                        type: getSessionType(),
                        id: session.id
                    },
                    view: {
                        id: viewContext.id,
                        name: viewContext.name || urlContext.path,
                        url: urlContext.url,
                        referrer: urlContext.referrer,
                        host: urlContext.host,
                        path: urlContext.path,
                        pathGroup: urlContext.pathGroup,
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
                if (!("has_replay" in serverRumEvent.session)) {
                    serverRumEvent.session.has_replay = commonContext.hasReplay;
                }
                if (session.errorSessionReplayAllowed) {
                    serverRumEvent.session.has_replay = serverRumEvent.session.has_replay && session.sessionHasError;
                }
                if (serverRumEvent.type === "view") {
                    serverRumEvent.session.sampled_for_error_replay = session.errorSessionReplayAllowed;
                    serverRumEvent.session.sampled_for_error_session = session.isErrorSession;
                    serverRumEvent.session.error_timestamp_for_session = session.sessionErrorTimestamp;
                }
                if (!isEmptyObject(commonContext.context.device)) {
                    serverRumEvent.device = extend2Lev(serverRumEvent.device, commonContext.context.device);
                }
                if (!isEmptyObject(commonContext.user)) {
                    serverRumEvent.user = extend2Lev(serverRumEvent.user, {
                        is_signin: "T",
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
        }));
    }
    function shouldSend(event, beforeSend, domainContext, eventRateLimiters) {
        if (beforeSend) {
            var result = limitModification(event, modifiableFieldPathsByEvent[event.type], (function(event) {
                return beforeSend(event, domainContext);
            }));
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
        return [ RumEventType.ERROR, RumEventType.RESOURCE, RumEventType.LONG_TASK ].indexOf(event.type) !== -1;
    }
    function getSessionType() {
        return window._DATAFLUX_SYNTHETICS_BROWSER === undefined ? SessionType.USER : SessionType.SYNTHETICS;
    }
    var viewportObservable;
    function initViewportObservable() {
        if (!viewportObservable) {
            viewportObservable = createViewportObservable();
        }
        return viewportObservable;
    }
    function createViewportObservable() {
        return new Observable((function(observable) {
            var _throttledUpdateDimension = throttle((function() {
                observable.notify(getViewportDimension());
            }), 200);
            var updateDimension = _throttledUpdateDimension.throttled;
            return addEventListener(window, DOM_EVENT.RESIZE, updateDimension, {
                capture: true,
                passive: true
            }).stop;
        }));
    }
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
    function startDisplayContext() {
        var viewport = getViewportDimension();
        var unsubscribeViewport = initViewportObservable().subscribe((function(viewportDimension) {
            viewport = viewportDimension;
        })).unsubscribe;
        return {
            get: function get() {
                return {
                    viewport: viewport
                };
            },
            stop: unsubscribeViewport
        };
    }
    function startInternalContext(applicationId, sessionManager, viewContexts, actionContexts, urlContexts) {
        return {
            get: function get(startTime) {
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
                            urlQuery: urlContext.urlQuery
                        }
                    };
                }
            }
        };
    }
    var URL_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
    function startUrlContexts(lifeCycle, locationChangeObservable, location) {
        var urlContextHistory = createValueHistory({
            expireDelay: URL_CONTEXT_TIME_OUT_DELAY
        });
        var previousViewUrl;
        lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_CREATED, (function(data) {
            var viewUrl = location.href;
            urlContextHistory.add(buildUrlContext({
                url: viewUrl,
                location: location,
                referrer: !previousViewUrl ? document.referrer : previousViewUrl
            }), data.startClocks.relative);
            previousViewUrl = viewUrl;
        }));
        lifeCycle.subscribe(LifeCycleEventType.AFTER_VIEW_ENDED, (function(data) {
            urlContextHistory.closeActive(data.endClocks.relative);
        }));
        var locationChangeSubscription = locationChangeObservable.subscribe((function(data) {
            var current = urlContextHistory.find();
            if (current) {
                var changeTime = tools_relativeNow();
                urlContextHistory.closeActive(changeTime);
                urlContextHistory.add(buildUrlContext({
                    url: data.newLocation.href,
                    location: data.newLocation,
                    referrer: current.referrer
                }), changeTime);
            }
        }));
        function buildUrlContext(data) {
            var path = data.location.pathname;
            var hash = data.location.hash;
            if (hash && !isHashAnAnchor(hash)) {
                path = "/" + getPathFromHash(hash);
            }
            return {
                url: data.url,
                referrer: data.referrer,
                host: data.location.host,
                path: path,
                pathGroup: replaceNumberCharByPath(path),
                urlQuery: getQueryParamsFromUrl(data.location.href)
            };
        }
        return {
            findUrl: function findUrl(startTime) {
                return urlContextHistory.find(startTime);
            },
            stop: function stop() {
                locationChangeSubscription.unsubscribe();
                urlContextHistory.stop();
            }
        };
    }
    var VIEW_CONTEXT_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
    function startViewContexts(lifeCycle) {
        var viewContextHistory = createValueHistory({
            expireDelay: VIEW_CONTEXT_TIME_OUT_DELAY
        });
        lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_CREATED, (function(view) {
            viewContextHistory.add(buildViewContext(view), view.startClocks.relative);
        }));
        lifeCycle.subscribe(LifeCycleEventType.AFTER_VIEW_ENDED, (function(data) {
            viewContextHistory.closeActive(data.endClocks.relative);
        }));
        lifeCycle.subscribe(LifeCycleEventType.BEFORE_VIEW_UPDATED, (function(viewUpdate) {
            var currentView = viewContextHistory.find(viewUpdate.startClocks.relative);
            if (currentView && viewUpdate.name) {
                currentView.name = viewUpdate.name;
            }
            if (currentView && viewUpdate.context) {
                currentView.context = viewUpdate.context;
            }
        }));
        lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, (function() {
            viewContextHistory.reset();
        }));
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
            findView: function findView(startTime) {
                return viewContextHistory.find(startTime);
            },
            stop: function stop() {
                viewContextHistory.stop();
            }
        };
    }
    function trackConsoleError(errorObservable) {
        var subscription = initConsoleObservable([ ConsoleApiName.error ]).subscribe((function(consoleLog) {
            errorObservable.notify(consoleLog.error);
        }));
        return {
            stop: function stop() {
                subscription.unsubscribe();
            }
        };
    }
    function trackReportError(configuration, errorObservable) {
        var subscription = initReportObservable(configuration, [ RawReportType.intervention ]).subscribe((function(reportError) {
            errorObservable.notify({
                startClocks: clocksNow(),
                message: reportError.message,
                stack: reportError.stack,
                type: reportError.subtype,
                source: errorTools_ErrorSource.REPORT,
                handling: enums_ErrorHandling.UNHANDLED
            });
        }));
        return {
            stop: function stop() {
                subscription.unsubscribe();
            }
        };
    }
    function startErrorCollection(lifeCycle, configuration, sessionManager, pageStateHistory) {
        var errorObservable = new Observable;
        trackConsoleError(errorObservable);
        trackRuntimeError(errorObservable);
        trackReportError(configuration, errorObservable);
        var session = sessionManager.findTrackedSession();
        var hasError = session.isErrorSession && session.sessionHasError;
        if (session.isErrorSession) {
            lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, (function() {
                hasError = false;
            }));
        }
        errorObservable.subscribe((function(error) {
            if (session.isErrorSession && !hasError) {
                sessionManager.setErrorForSession();
                hasError = true;
            }
            lifeCycle.notify(LifeCycleEventType.RAW_ERROR_COLLECTED, {
                error: error
            });
        }));
        return doStartErrorCollection(lifeCycle, pageStateHistory);
    }
    function doStartErrorCollection(lifeCycle, pageStateHistory) {
        lifeCycle.subscribe(LifeCycleEventType.RAW_ERROR_COLLECTED, (function(error) {
            lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, tools_assign({
                customerContext: error.customerContext,
                savedCommonContext: error.savedCommonContext
            }, processError(error.error, pageStateHistory)));
        }));
        return {
            addError: function addError(providedError, savedCommonContext) {
                var error = providedError.error;
                var stackTrace = error instanceof Error ? computeStackTrace(error) : undefined;
                var rawError = computeRawError({
                    stackTrace: stackTrace,
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
                source_type: "browser"
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
    var FAKE_INITIAL_DOCUMENT = "initial_document";
    var RESOURCE_TYPES = [ [ ResourceType.DOCUMENT, function(initiatorType) {
        return FAKE_INITIAL_DOCUMENT === initiatorType;
    } ], [ ResourceType.XHR, function(initiatorType) {
        return "xmlhttprequest" === initiatorType;
    } ], [ ResourceType.FETCH, function(initiatorType) {
        return "fetch" === initiatorType;
    } ], [ ResourceType.BEACON, function(initiatorType) {
        return "beacon" === initiatorType;
    } ], [ ResourceType.CSS, function(_, path) {
        return path.match(/\.css$/i) !== null;
    } ], [ ResourceType.JS, function(_, path) {
        return path.match(/\.js$/i) !== null;
    } ], [ ResourceType.IMAGE, function(initiatorType, path) {
        return includes([ "image", "img", "icon" ], initiatorType) || path.match(/\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i) !== null;
    } ], [ ResourceType.FONT, function(_, path) {
        return path.match(/\.(woff|eot|woff2|ttf)$/i) !== null;
    } ], [ ResourceType.MEDIA, function(initiatorType, path) {
        return includes([ "audio", "video" ], initiatorType) || path.match(/\.(mp3|mp4)$/i) !== null;
    } ] ];
    function computeResourceEntryType(entry) {
        var url = entry.name;
        if (!isValidUrl(url)) {
            return ResourceType.OTHER;
        }
        var path = getPathName(url);
        var type = ResourceType.OTHER;
        tools_each(RESOURCE_TYPES, (function(res) {
            var _type = res[0], isType = res[1];
            if (isType(entry.initiatorType, path)) {
                type = _type;
                return false;
            }
        }));
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
    function computeResourceEntryDeliveryType(entry) {
        return entry.deliveryType === "" ? "other" : entry.deliveryType;
    }
    function computeResourceEntryProtocol(entry) {
        return entry.nextHopProtocol === "" ? undefined : entry.nextHopProtocol;
    }
    function isResourceEntryRequestType(entry) {
        return entry.initiatorType === "xmlhttprequest" || entry.initiatorType === "fetch";
    }
    var resourceUtils_HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
    function getStrSize(candidate) {
        if (!resourceUtils_HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
            return candidate.length;
        }
        if (window.TextEncoder !== undefined) {
            return (new TextEncoder).encode(candidate).length;
        }
        return new Blob([ candidate ]).size;
    }
    function isResourceUrlLimit(name, limitSize) {
        return getStrSize(name) > limitSize;
    }
    function computeResourceEntryDuration(entry) {
        if (entry.duration === 0 && entry.startTime < entry.responseEnd) {
            return msToNs(entry.responseEnd - entry.startTime);
        }
        return msToNs(entry.duration);
    }
    function computePerformanceResourceDetails(entry) {
        if (!hasValidResourceEntryTimings(entry)) {
            return undefined;
        }
        var startTime = entry.startTime, fetchStart = entry.fetchStart, redirectStart = entry.redirectStart, redirectEnd = entry.redirectEnd, domainLookupStart = entry.domainLookupStart, domainLookupEnd = entry.domainLookupEnd, connectStart = entry.connectStart, secureConnectionStart = entry.secureConnectionStart, connectEnd = entry.connectEnd, requestStart = entry.requestStart, responseStart = entry.responseStart, responseEnd = entry.responseEnd;
        var details = {
            firstbyte: msToNs(responseStart - requestStart),
            trans: msToNs(responseEnd - responseStart),
            downloadTime: formatTiming(startTime, responseStart, responseEnd),
            firstByteTime: formatTiming(startTime, requestStart, responseStart)
        };
        if (responseStart > 0 && responseStart <= preferredNow()) {
            details.ttfb = msToNs(responseStart - requestStart);
        }
        if (connectEnd !== fetchStart) {
            details.tcp = msToNs(connectEnd - connectStart);
            details.connectTime = formatTiming(startTime, connectStart, connectEnd);
            if (areInOrder(connectStart, secureConnectionStart, connectEnd)) {
                details.ssl = msToNs(connectEnd - secureConnectionStart);
                details.sslTime = formatTiming(startTime, secureConnectionStart, connectEnd);
            }
        }
        if (domainLookupEnd !== fetchStart) {
            details.dns = msToNs(domainLookupEnd - domainLookupStart);
            details.dnsTime = formatTiming(startTime, domainLookupStart, domainLookupEnd);
        }
        if (hasRedirection(entry)) {
            details.redirect = msToNs(redirectEnd - redirectStart);
            details.redirectTime = formatTiming(startTime, redirectStart, redirectEnd);
        }
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
        if (entry.startTime < entry.responseStart) {
            return {
                size: entry.decodedBodySize,
                encodedBodySize: entry.encodedBodySize,
                decodedBodySize: entry.decodedBodySize,
                transferSize: entry.transferSize
            };
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
    var MAX_ATTRIBUTE_VALUE_CHAR_LENGTH = 24e3;
    function isLongDataUrl(url) {
        if (url.length <= MAX_ATTRIBUTE_VALUE_CHAR_LENGTH) {
            return false;
        } else if (url.substring(0, 5) === "data:") {
            url = url.substring(0, MAX_ATTRIBUTE_VALUE_CHAR_LENGTH);
            return true;
        }
        return false;
    }
    function sanitizeDataUrl(url) {
        return url.match(DATA_URL_REGEX)[0] + "[...]";
    }
    function retrieveFirstInputTiming(configuration, callback) {
        var startTimeStamp = dateNow();
        var timingSent = false;
        var _addEventListeners = addEventListeners(window, [ DOM_EVENT.CLICK, DOM_EVENT.MOUSE_DOWN, DOM_EVENT.KEY_DOWN, DOM_EVENT.TOUCH_START, DOM_EVENT.POINTER_DOWN ], (function(evt) {
            if (!evt.cancelable) {
                return;
            }
            var timing = {
                entryType: "first-input",
                processingStart: tools_relativeNow(),
                processingEnd: tools_relativeNow(),
                startTime: evt.timeStamp,
                duration: 0,
                name: "",
                cancelable: false,
                target: null,
                toJSON: function toJSON() {
                    return {};
                }
            };
            if (evt.type === DOM_EVENT.POINTER_DOWN) {
                sendTimingIfPointerIsNotCancelled(timing);
            } else {
                sendTiming(timing);
            }
        }), {
            passive: true,
            capture: true
        });
        var removeEventListeners = _addEventListeners.stop;
        return {
            stop: removeEventListeners
        };
        function sendTimingIfPointerIsNotCancelled(timing) {
            addEventListeners(window, [ DOM_EVENT.POINTER_UP, DOM_EVENT.POINTER_CANCEL ], (function(event) {
                if (event.type === DOM_EVENT.POINTER_UP) {
                    sendTiming(timing);
                }
            }), {
                once: true
            });
        }
        function sendTiming(timing) {
            if (!timingSent) {
                timingSent = true;
                removeEventListeners();
                var delay = timing.processingStart - timing.startTime;
                if (delay >= 0 && delay < dateNow() - startTimeStamp) {
                    callback(timing);
                }
            }
        }
    }
    var RumPerformanceEntryType = {
        EVENT: "event",
        FIRST_INPUT: "first-input",
        LARGEST_CONTENTFUL_PAINT: "largest-contentful-paint",
        LAYOUT_SHIFT: "layout-shift",
        LONG_TASK: "longtask",
        LONG_ANIMATION_FRAME: "long-animation-frame",
        NAVIGATION: "navigation",
        PAINT: "paint",
        RESOURCE: "resource",
        VISIBILITY_STATE: "visibility-state"
    };
    function createPerformanceObservable(configuration, options) {
        return new Observable((function(observable) {
            if (!window.PerformanceObserver) {
                return;
            }
            var handlePerformanceEntries = function handlePerformanceEntries(entries) {
                var rumPerformanceEntries = filterRumPerformanceEntries(configuration, entries);
                if (rumPerformanceEntries.length > 0) {
                    observable.notify(rumPerformanceEntries);
                }
            };
            var timeoutId;
            var isObserverInitializing = true;
            var observer = new PerformanceObserver(monitor((function(entries) {
                if (isObserverInitializing) {
                    timeoutId = timer_setTimeout((function() {
                        handlePerformanceEntries(entries.getEntries());
                    }));
                } else {
                    handlePerformanceEntries(entries.getEntries());
                }
            })));
            try {
                observer.observe(options);
            } catch (_unused) {
                var fallbackSupportedEntryTypes = [ RumPerformanceEntryType.RESOURCE, RumPerformanceEntryType.NAVIGATION, RumPerformanceEntryType.LONG_TASK, RumPerformanceEntryType.PAINT ];
                if (includes(fallbackSupportedEntryTypes, options.type)) {
                    if (options.buffered) {
                        timeoutId = timer_setTimeout((function() {
                            handlePerformanceEntries(performance.getEntriesByType(options.type));
                        }));
                    }
                    try {
                        observer.observe({
                            entryTypes: [ options.type ]
                        });
                    } catch (_unused2) {
                        return;
                    }
                }
            }
            isObserverInitializing = false;
            manageResourceTimingBufferFull();
            var stopFirstInputTiming;
            if (!supportPerformanceTimingEvent(RumPerformanceEntryType.FIRST_INPUT) && options.type === RumPerformanceEntryType.FIRST_INPUT) {
                var _retrieveFirstInputTiming = retrieveFirstInputTiming(configuration, (function(timing) {
                    handlePerformanceEntries([ timing ]);
                }));
                stopFirstInputTiming = _retrieveFirstInputTiming.stop;
            }
            return function() {
                observer.disconnect();
                if (stopFirstInputTiming) {
                    stopFirstInputTiming();
                }
                timer_clearTimeout(timeoutId);
            };
        }));
    }
    var resourceTimingBufferFullListener;
    function manageResourceTimingBufferFull(configuration) {
        if (!resourceTimingBufferFullListener && supportPerformanceObject() && "addEventListener" in performance) {
            resourceTimingBufferFullListener = addEventListener(performance, "resourcetimingbufferfull", (function() {
                performance.clearResourceTimings();
            }));
        }
        return function() {
            resourceTimingBufferFullListener && resourceTimingBufferFullListener.stop();
        };
    }
    function supportPerformanceObject() {
        return window.performance !== undefined && "getEntries" in performance;
    }
    function supportPerformanceTimingEvent(entryType) {
        return window.PerformanceObserver && PerformanceObserver.supportedEntryTypes !== undefined && PerformanceObserver.supportedEntryTypes.includes(entryType);
    }
    function filterRumPerformanceEntries(configuration, entries) {
        return entries.filter((function(entry) {
            return !isForbiddenResource(configuration, entry);
        }));
    }
    function isForbiddenResource(configuration, entry) {
        return entry.entryType === RumPerformanceEntryType.RESOURCE && (!isAllowedRequestUrl(configuration, entry.name) || !hasValidResourceEntryDuration(entry));
    }
    var TIMING_MAXIMUM_DELAY = 10 * ONE_MINUTE;
    function trackFirstContentfulPaint(configuration, firstHidden, callback) {
        var performanceSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType.PAINT,
            buffered: true
        }).subscribe((function(entries) {
            var fcpEntry = find(entries, (function(entry) {
                return entry.entryType === RumPerformanceEntryType.PAINT && entry.name === "first-contentful-paint" && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < TIMING_MAXIMUM_DELAY;
            }));
            if (fcpEntry) {
                callback(fcpEntry.startTime);
            }
        }));
        return {
            stop: performanceSubscription.unsubscribe
        };
    }
    var DEFAULT_PROGRAMMATIC_ACTION_NAME_ATTRIBUTE = "data-guance-action-name";
    var STABLE_ATTRIBUTES = [ DEFAULT_PROGRAMMATIC_ACTION_NAME_ATTRIBUTE, "data-testid", "data-test", "data-qa", "data-cy", "data-test-id", "data-qa-id", "data-testing", "data-component", "data-element", "data-source-file" ];
    var GLOBALLY_UNIQUE_SELECTOR_GETTERS = [ getStableAttributeSelector, getIDSelector ];
    var UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS = [ getStableAttributeSelector, getClassSelector, getTagNameSelector ];
    function getSelectorFromElement(targetElement, actionNameAttribute) {
        if (!isConnected(targetElement)) {
            return;
        }
        var targetElementSelector;
        var currentElement = targetElement;
        while (currentElement && currentElement.nodeName !== "HTML") {
            var globallyUniqueSelector = findSelector(currentElement, GLOBALLY_UNIQUE_SELECTOR_GETTERS, isSelectorUniqueGlobally, actionNameAttribute, targetElementSelector);
            if (globallyUniqueSelector) {
                return globallyUniqueSelector;
            }
            var uniqueSelectorAmongChildren = findSelector(currentElement, UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS, isSelectorUniqueAmongSiblings, actionNameAttribute, targetElementSelector);
            targetElementSelector = uniqueSelectorAmongChildren || combineSelector(getPositionSelector(currentElement), targetElementSelector);
            currentElement = currentElement.parentElement;
        }
        return targetElementSelector;
    }
    function isGeneratedValue(value) {
        return /[0-9]/.test(value);
    }
    function getIDSelector(element) {
        if (element.id && !isGeneratedValue(element.id)) {
            return "#" + cssEscape(element.id);
        }
    }
    function getClassSelector(element) {
        if (element.tagName === "BODY") {
            return;
        }
        if (element.classList.length > 0) {
            for (var i = 0; i < element.classList.length; i += 1) {
                var className = element.classList[i];
                if (isGeneratedValue(className)) {
                    continue;
                }
                return cssEscape(element.tagName) + "." + cssEscape(className);
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
                return cssEscape(element.tagName) + "[" + attributeName + '="' + cssEscape(element.getAttribute(attributeName)) + '"]';
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
        return tagName + ":nth-of-type(" + elementIndex + ")";
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
    function isSelectorUniqueAmongSiblings(currentElement, currentElementSelector, childSelector) {
        var isSiblingMatching;
        if (childSelector === undefined) {
            isSiblingMatching = function isSiblingMatching(sibling) {
                return sibling.matches(currentElementSelector);
            };
        } else {
            var scopedSelector = supportScopeSelector() ? combineSelector("".concat(currentElementSelector, ":scope"), childSelector) : combineSelector(currentElementSelector, childSelector);
            isSiblingMatching = function isSiblingMatching(sibling) {
                return sibling.querySelector(scopedSelector) !== null;
            };
        }
        var parent = currentElement.parentElement;
        var sibling = parent.firstElementChild;
        while (sibling) {
            if (sibling !== currentElement && isSiblingMatching(sibling)) {
                return false;
            }
            sibling = sibling.nextElementSibling;
        }
        return true;
    }
    function combineSelector(parent, child) {
        return child ? parent + ">" + child : parent;
    }
    var supportScopeSelectorCache;
    function supportScopeSelector() {
        if (supportScopeSelectorCache === undefined) {
            try {
                document.querySelector(":scope");
                supportScopeSelectorCache = true;
            } catch (_unused) {
                supportScopeSelectorCache = false;
            }
        }
        return supportScopeSelectorCache;
    }
    function isConnected(element) {
        if ("isConnected" in element) {
            return element.isConnected;
        }
        return element.ownerDocument.documentElement.contains(element);
    }
    function trackFirstInput(configuration, firstHidden, callback) {
        var performanceFirstInputSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType.FIRST_INPUT,
            buffered: true
        }).subscribe((function(entries) {
            var firstInputEntry = find(entries, (function(entry) {
                return entry.entryType === RumPerformanceEntryType.FIRST_INPUT && entry.startTime < firstHidden.getTimeStamp();
            }));
            if (firstInputEntry) {
                var firstInputDelay = tools_elapsed(firstInputEntry.startTime, firstInputEntry.processingStart);
                var firstInputTargetSelector;
                if (firstInputEntry.target && isElementNode(firstInputEntry.target)) {
                    firstInputTargetSelector = getSelectorFromElement(firstInputEntry.target, configuration.actionNameAttribute);
                }
                callback({
                    delay: firstInputDelay >= 0 ? firstInputDelay : 0,
                    time: firstInputEntry.startTime,
                    targetSelector: firstInputTargetSelector
                });
            }
        }));
        return {
            stop: function stop() {
                performanceFirstInputSubscription.unsubscribe();
            }
        };
    }
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
            initiatorType: "navigation",
            name: window.location.href,
            startTime: 0,
            duration: timings.responseEnd,
            decodedBodySize: 0,
            encodedBodySize: 0,
            transferSize: 0,
            toJSON: function toJSON() {
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
    function trackNavigationTimings(configuration, callback, getNavigationEntryImpl) {
        if (getNavigationEntryImpl === undefined) {
            getNavigationEntryImpl = getNavigationEntry;
        }
        return waitAfterLoadEvent((function() {
            var entry = getNavigationEntryImpl();
            if (!isIncompleteNavigation(entry)) {
                callback(processNavigationEntry(entry));
            }
        }));
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
            firstByte: entry.responseStart >= 0 && entry.responseStart <= tools_relativeNow() ? entry.responseStart : undefined
        };
    }
    function isIncompleteNavigation(entry) {
        return entry.loadEventEnd <= 0;
    }
    function waitAfterLoadEvent(callback) {
        var timeoutId;
        var _runOnReadyState = runOnReadyState("complete", (function() {
            timeoutId = timer_setTimeout((function() {
                callback();
            }));
        }));
        return {
            stop: function stop() {
                _runOnReadyState.stop();
                timer_clearTimeout(timeoutId);
            }
        };
    }
    var LCP_MAXIMUM_DELAY = 10 * ONE_MINUTE;
    function trackLargestContentfulPaint(configuration, firstHidden, eventTarget, callback) {
        var firstInteractionTimestamp = Infinity;
        var _addEventListeners = addEventListeners(eventTarget, [ DOM_EVENT.POINTER_DOWN, DOM_EVENT.KEY_DOWN ], (function(event) {
            firstInteractionTimestamp = event.timeStamp;
        }), {
            capture: true,
            once: true
        });
        var stopEventListener = _addEventListeners.stop;
        var biggestLcpSize = 0;
        var performanceLcpSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType.LARGEST_CONTENTFUL_PAINT,
            buffered: true
        }).subscribe((function(entries) {
            var lcpEntry = findLast(entries, (function(entry) {
                return entry.entryType === RumPerformanceEntryType.LARGEST_CONTENTFUL_PAINT && entry.startTime < firstInteractionTimestamp && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < LCP_MAXIMUM_DELAY && entry.size > biggestLcpSize;
            }));
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
        }));
        return {
            stop: function stop() {
                stopEventListener();
                performanceLcpSubscription.unsubscribe();
            }
        };
    }
    function trackFirstHidden(eventTarget) {
        if (typeof eventTarget === "undefined") {
            eventTarget = window;
        }
        if (document.visibilityState === "hidden") {
            return {
                getTimeStamp: function getTimeStamp() {
                    return 0;
                },
                stop: tools_noop
            };
        }
        if (supportPerformanceTimingEvent(RumPerformanceEntryType.VISIBILITY_STATE)) {
            var firstHiddenEntry = performance.getEntriesByType(RumPerformanceEntryType.VISIBILITY_STATE).find((function(entry) {
                return entry.name === "hidden";
            }));
            if (firstHiddenEntry) {
                return {
                    getTimeStamp: function getTimeStamp() {
                        return firstHiddenEntry.startTime;
                    },
                    stop: tools_noop
                };
            }
        }
        var timeStamp = Infinity;
        var _addEventListeners = addEventListeners(eventTarget, [ DOM_EVENT.PAGE_HIDE, DOM_EVENT.VISIBILITY_CHANGE ], (function(event) {
            if (event.type === DOM_EVENT.PAGE_HIDE || document.visibilityState === "hidden") {
                timeStamp = event.timeStamp;
                _stop();
            }
        }), {
            capture: true
        }), _stop = _addEventListeners.stop;
        return {
            getTimeStamp: function getTimeStamp() {
                return timeStamp;
            },
            stop: function stop() {
                _stop();
            }
        };
    }
    function trackInitialViewMetrics(configuration, setLoadEvent, scheduleViewUpdate) {
        var initialViewMetrics = {};
        var _trackNavigationTimings = trackNavigationTimings(configuration, (function(navigationTimings) {
            setLoadEvent(navigationTimings.loadEvent);
            initialViewMetrics.navigationTimings = navigationTimings;
            scheduleViewUpdate();
        }));
        var firstHidden = trackFirstHidden();
        var stopNavigationTracking = _trackNavigationTimings.stop;
        var _trackFirstContentfulPaint = trackFirstContentfulPaint(configuration, firstHidden, (function(firstContentfulPaint) {
            initialViewMetrics.firstContentfulPaint = firstContentfulPaint;
            scheduleViewUpdate();
        }));
        var stopFCPTracking = _trackFirstContentfulPaint.stop;
        var _trackLargestContentfulPaint = trackLargestContentfulPaint(configuration, firstHidden, window, (function(largestContentfulPaint) {
            initialViewMetrics.largestContentfulPaint = largestContentfulPaint;
            scheduleViewUpdate();
        }));
        var stopLCPTracking = _trackLargestContentfulPaint.stop;
        var _trackFirstInput = trackFirstInput(configuration, firstHidden, (function(firstInput) {
            initialViewMetrics.firstInput = firstInput;
            scheduleViewUpdate();
        }));
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
    var THROTTLE_SCROLL_DURATION = ONE_SECOND;
    function trackScrollMetrics(configuration, viewStart, callback, scrollValues) {
        if (scrollValues === undefined) {
            scrollValues = createScrollValuesObservable();
        }
        var maxScrollDepth = 0;
        var maxScrollHeight = 0;
        var maxScrollHeightTime = 0;
        var subscription = scrollValues.subscribe((function(data) {
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
        }));
        return {
            stop: function stop() {
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
        return new Observable((function(observable) {
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
                return function() {
                    throttledNotify.cancel();
                    resizeObserver.unobserve(observerTarget);
                    eventListener.stop();
                };
            }
        }));
    }
    var PAGE_ACTIVITY_VALIDATION_DELAY = 100;
    var PAGE_ACTIVITY_END_DELAY = 100;
    function waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, pageActivityEndCallback, maxDuration) {
        var pageActivityObservable = createPageActivityObservable(lifeCycle, domMutationObservable, configuration);
        return doWaitPageActivityEnd(pageActivityObservable, pageActivityEndCallback, maxDuration);
    }
    function doWaitPageActivityEnd(pageActivityObservable, pageActivityEndCallback, maxDuration) {
        var pageActivityEndTimeoutId;
        var hasCompleted = false;
        var validationTimeoutId = timer_setTimeout((function() {
            complete({
                hadActivity: false
            });
        }), PAGE_ACTIVITY_VALIDATION_DELAY);
        var maxDurationTimeoutId = maxDuration !== undefined ? timer_setTimeout((function() {
            return complete({
                hadActivity: true,
                end: timeStampNow()
            });
        }), maxDuration) : undefined;
        var pageActivitySubscription = pageActivityObservable.subscribe((function(data) {
            var isBusy = data.isBusy;
            timer_clearTimeout(validationTimeoutId);
            timer_clearTimeout(pageActivityEndTimeoutId);
            var lastChangeTime = timeStampNow();
            if (!isBusy) {
                pageActivityEndTimeoutId = timer_setTimeout((function() {
                    complete({
                        hadActivity: true,
                        end: lastChangeTime
                    });
                }), PAGE_ACTIVITY_END_DELAY);
            }
        }));
        var stop = function stop() {
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
        return new Observable((function(observable) {
            var subscriptions = [];
            var firstRequestIndex;
            var pendingRequestsCount = 0;
            subscriptions.push(domMutationObservable.subscribe((function() {
                notifyPageActivity();
            })), createPerformanceObservable(configuration, {
                type: RumPerformanceEntryType.RESOURCE
            }).subscribe((function(entries) {
                if (some(entries, (function(entry) {
                    return !isExcludedUrl(configuration, entry.name);
                }))) {
                    notifyPageActivity();
                }
            })), lifeCycle.subscribe(LifeCycleEventType.REQUEST_STARTED, (function(startEvent) {
                if (isExcludedUrl(configuration, startEvent.url)) {
                    return;
                }
                if (firstRequestIndex === undefined) {
                    firstRequestIndex = startEvent.requestIndex;
                }
                pendingRequestsCount += 1;
                notifyPageActivity();
            })), lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, (function(request) {
                if (isExcludedUrl(configuration, request.url) || firstRequestIndex === undefined || request.requestIndex < firstRequestIndex) {
                    return;
                }
                pendingRequestsCount -= 1;
                notifyPageActivity();
            })));
            var _trackWindowOpen = trackWindowOpen(notifyPageActivity);
            var stopTrackingWindowOpen = _trackWindowOpen.stop;
            return function() {
                stopTrackingWindowOpen();
                tools_each(subscriptions, (function(s) {
                    s.unsubscribe();
                }));
            };
            function notifyPageActivity() {
                observable.notify({
                    isBusy: pendingRequestsCount > 0
                });
            }
        }));
    }
    function isExcludedUrl(configuration, requestUrl) {
        return matchList(configuration.excludedActivityUrls, requestUrl);
    }
    function trackWindowOpen(callback) {
        return instrumentMethod(window, "open", callback);
    }
    function trackLoadingTime(lifeCycle, domMutationObservable, configuration, loadType, viewStart, callback) {
        var isWaitingForLoadEvent = loadType === ViewLoadingType.INITIAL_LOAD;
        var isWaitingForActivityLoadingTime = true;
        var loadingTimeCandidates = [];
        var firstHidden = trackFirstHidden();
        function invokeCallbackIfAllCandidatesAreReceived() {
            if (!isWaitingForActivityLoadingTime && !isWaitingForLoadEvent && loadingTimeCandidates.length > 0) {
                var loadingTime = Math.max.apply(Math, loadingTimeCandidates);
                if (loadingTime < firstHidden.getTimeStamp()) {
                    callback(loadingTime);
                }
            }
        }
        var _waitPageActivityEnd = waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, (function(event) {
            if (isWaitingForActivityLoadingTime) {
                isWaitingForActivityLoadingTime = false;
                if (event.hadActivity) {
                    loadingTimeCandidates.push(tools_elapsed(viewStart.timeStamp, event.end));
                }
                invokeCallbackIfAllCandidatesAreReceived();
            }
        }));
        var _stop = _waitPageActivityEnd.stop;
        return {
            setLoadEvent: function setLoadEvent(loadEvent) {
                if (isWaitingForLoadEvent) {
                    isWaitingForLoadEvent = false;
                    loadingTimeCandidates.push(loadEvent);
                    invokeCallbackIfAllCandidatesAreReceived();
                }
            },
            stop: function stop() {
                _stop();
                firstHidden.stop();
                if (isWaitingForActivityLoadingTime) {
                    isWaitingForActivityLoadingTime = false;
                    invokeCallbackIfAllCandidatesAreReceived();
                }
            }
        };
    }
    function trackCumulativeLayoutShift(configuration, viewStart, callback) {
        if (!isLayoutShiftSupported()) {
            return {
                stop: tools_noop
            };
        }
        var maxClsValue = 0;
        var maxClsTarget;
        var maxClsStartTime;
        callback({
            value: 0
        });
        var window = slidingSessionWindow();
        var performanceSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType.LAYOUT_SHIFT,
            buffered: true
        }).subscribe((function(entries) {
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
        }));
        return {
            stop: function stop() {
                performanceSubscription.unsubscribe();
            }
        };
    }
    function getTargetFromSource(sources) {
        if (!sources) {
            return;
        }
        var source = find(sources, (function(source) {
            return !!source.node && isElementNode(source.node);
        }));
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
            update: function update(entry) {
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
    function isLayoutShiftSupported() {
        return supportPerformanceTimingEvent(RumPerformanceEntryType.LAYOUT_SHIFT) && "WeakRef" in window;
    }
    var observer;
    var interactionCountEstimate = 0;
    var minKnownInteractionId = Infinity;
    var maxKnownInteractionId = 0;
    function initInteractionCountPolyfill() {
        if ("interactionCount" in performance || observer) {
            return;
        }
        observer = new window.PerformanceObserver(monitor((function(entries) {
            entries.getEntries().forEach((function(e) {
                var entry = e;
                if (entry.interactionId) {
                    minKnownInteractionId = Math.min(minKnownInteractionId, entry.interactionId);
                    maxKnownInteractionId = Math.max(maxKnownInteractionId, entry.interactionId);
                    interactionCountEstimate = (maxKnownInteractionId - minKnownInteractionId) / 7 + 1;
                }
            }));
        })));
        observer.observe({
            type: "event",
            buffered: true,
            durationThreshold: 0
        });
    }
    var getInteractionCount = function getInteractionCount() {
        return observer ? interactionCountEstimate : window.performance.interactionCount || 0;
    };
    var interactionSelectorCache = new Map;
    function getInteractionSelector(relativeTimestamp) {
        var selector = interactionSelectorCache.get(relativeTimestamp);
        interactionSelectorCache["delete"](relativeTimestamp);
        return selector;
    }
    var MAX_INTERACTION_ENTRIES = 10;
    var MAX_INP_VALUE = 1 * ONE_MINUTE;
    function trackInteractionToNextPaint(configuration, viewStart, viewLoadingType) {
        if (!isInteractionToNextPaintSupported()) {
            return {
                getInteractionToNextPaint: function getInteractionToNextPaint() {
                    return undefined;
                },
                setViewEnd: tools_noop,
                stop: tools_noop
            };
        }
        var _trackViewInteractionCount = trackViewInteractionCount(viewLoadingType);
        var getViewInteractionCount = _trackViewInteractionCount.getViewInteractionCount;
        var stopViewInteractionCount = _trackViewInteractionCount.stopViewInteractionCount;
        var viewEnd = Infinity;
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
            durationThreshold: 40,
            buffered: true
        }).subscribe(handleEntries);
        return {
            getInteractionToNextPaint: function getInteractionToNextPaint() {
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
            setViewEnd: function setViewEnd(viewEndTime) {
                viewEnd = viewEndTime;
                stopViewInteractionCount();
            },
            stop: function stop() {
                eventSubscription.unsubscribe();
                firstInputSubscription.unsubscribe();
            }
        };
    }
    function trackLongestInteractions(getViewInteractionCount) {
        var longestInteractions = [];
        function sortAndTrimLongestInteractions() {
            longestInteractions.sort((function(a, b) {
                return b.duration - a.duration;
            })).splice(MAX_INTERACTION_ENTRIES);
        }
        return {
            process: function process(entry) {
                var interactionIndex = longestInteractions.findIndex((function(interaction) {
                    return entry.interactionId === interaction.interactionId;
                }));
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
            estimateP98Interaction: function estimateP98Interaction() {
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
            getViewInteractionCount: function getViewInteractionCount() {
                if (state.stopped) {
                    return state.interactionCount;
                }
                return computeViewInteractionCount();
            },
            stopViewInteractionCount: function stopViewInteractionCount() {
                state = {
                    stopped: true,
                    interactionCount: computeViewInteractionCount()
                };
            }
        };
    }
    function isInteractionToNextPaintSupported() {
        return supportPerformanceTimingEvent("event") && window.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype;
    }
    function trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, viewStart) {
        var commonViewMetrics = {};
        var _trackLoadingTime = trackLoadingTime(lifeCycle, domMutationObservable, configuration, loadingType, viewStart, (function(newLoadingTime) {
            commonViewMetrics.loadingTime = newLoadingTime;
            scheduleViewUpdate();
        }));
        var stopLoadingTimeTracking = _trackLoadingTime.stop;
        var setLoadEvent = _trackLoadingTime.setLoadEvent;
        var _trackScrollMetrics = trackScrollMetrics(configuration, viewStart, (function(newScrollMetrics) {
            commonViewMetrics.scroll = newScrollMetrics;
        }));
        var stopScrollMetricsTracking = _trackScrollMetrics.stop;
        var stopCLSTracking;
        var _trackCumulativeLayoutShift = trackCumulativeLayoutShift(configuration, viewStart.relative, (function(cumulativeLayoutShift) {
            commonViewMetrics.cumulativeLayoutShift = cumulativeLayoutShift;
            scheduleViewUpdate();
        }));
        var stopCLSTracking = _trackCumulativeLayoutShift.stop;
        var _trackInteractionToNextPaint = trackInteractionToNextPaint(configuration, viewStart.relative, loadingType);
        var stopINPTracking = _trackInteractionToNextPaint.stop;
        var getInteractionToNextPaint = _trackInteractionToNextPaint.getInteractionToNextPaint;
        var setViewEnd = _trackInteractionToNextPaint.setViewEnd;
        return {
            stop: function stop() {
                stopLoadingTimeTracking();
                stopCLSTracking();
                stopScrollMetricsTracking();
            },
            stopINPTracking: stopINPTracking,
            setLoadEvent: setLoadEvent,
            setViewEnd: setViewEnd,
            getCommonViewMetrics: function getCommonViewMetrics() {
                commonViewMetrics.interactionToNextPaint = getInteractionToNextPaint();
                return commonViewMetrics;
            }
        };
    }
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
        var subscription = lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_COLLECTED, (function(event) {
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
        }));
        return {
            stop: function stop() {
                subscription.unsubscribe();
            },
            eventCounts: eventCounts
        };
    }
    function trackViewEventCounts(lifeCycle, viewId, onChange) {
        var _trackEventCounts = trackEventCounts({
            lifeCycle: lifeCycle,
            isChildEvent: function isChildEvent(event) {
                return event.view.id === viewId;
            },
            onChange: onChange
        });
        return {
            stop: _trackEventCounts.stop,
            eventCounts: _trackEventCounts.eventCounts
        };
    }
    var THROTTLE_VIEW_UPDATE_PERIOD = 3e3;
    var SESSION_KEEP_ALIVE_INTERVAL = 5 * ONE_MINUTE;
    var KEEP_TRACKING_AFTER_VIEW_DELAY = 5 * ONE_MINUTE;
    function trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, areViewsTrackedAutomatically, initialViewOptions) {
        var activeViews = new Set;
        function startNewView(loadingType, startClocks, viewOptions) {
            var newlyCreatedView = newView(lifeCycle, domMutationObservable, configuration, location, loadingType, startClocks, viewOptions);
            activeViews.add(newlyCreatedView);
            newlyCreatedView.stopObservable.subscribe((function() {
                activeViews["delete"](newlyCreatedView);
            }));
            return newlyCreatedView;
        }
        var currentView = startNewView(ViewLoadingType.INITIAL_LOAD, clocksOrigin(), initialViewOptions);
        startViewLifeCycle();
        var locationChangeSubscription;
        if (areViewsTrackedAutomatically) {
            locationChangeSubscription = renewViewOnLocationChange(locationChangeObservable);
        }
        function startViewLifeCycle() {
            lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, (function() {
                currentView = startNewView(ViewLoadingType.ROUTE_CHANGE, undefined, {
                    name: currentView.name,
                    service: currentView.service,
                    version: currentView.version,
                    context: currentView.contextManager.getContext()
                });
            }));
            lifeCycle.subscribe(LifeCycleEventType.SESSION_EXPIRED, (function() {
                currentView.end({
                    sessionIsActive: false
                });
            }));
        }
        function renewViewOnLocationChange(locationChangeObservable) {
            return locationChangeObservable.subscribe((function(params) {
                var oldLocation = params.oldLocation;
                var newLocation = params.newLocation;
                if (areDifferentLocation(oldLocation, newLocation)) {
                    currentView.end();
                    currentView = startNewView(ViewLoadingType.ROUTE_CHANGE);
                    return;
                }
            }));
        }
        return {
            addTiming: function addTiming(name, time) {
                if (typeof time === "undefined") {
                    time = timeStampNow();
                }
                currentView.addTiming(name, time);
            },
            startView: function startView(options, startClocks) {
                currentView.end({
                    endClocks: startClocks
                });
                currentView = startNewView(ViewLoadingType.ROUTE_CHANGE, startClocks, options);
            },
            setViewContext: function setViewContext(context) {
                currentView.contextManager.setContext(context);
            },
            setViewContextProperty: function setViewContextProperty(key, value) {
                currentView.contextManager.setContextProperty(key, value);
            },
            setViewName: function setViewName(name) {
                currentView.setViewName(name);
            },
            getViewContext: function getViewContext() {
                return currentView.contextManager.getContext();
            },
            stop: function stop() {
                if (locationChangeSubscription) {
                    locationChangeSubscription.unsubscribe();
                }
                currentView.end();
                activeViews.forEach((function(view) {
                    view.stop();
                }));
            }
        };
    }
    function newView(lifeCycle, domMutationObservable, configuration, initialLocation, loadingType, startClocks, viewOptions) {
        if (startClocks === undefined) {
            startClocks = clocksNow();
        }
        var id = UUID();
        var stopObservable = new Observable;
        var customTimings = {};
        var documentVersion = 0;
        var endClocks;
        var location = shallowClone(initialLocation);
        var contextManager = createContextManager();
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
        var _scheduleViewUpdate = throttle(triggerViewUpdate, THROTTLE_VIEW_UPDATE_PERIOD, {
            leading: false
        });
        var throttled = _scheduleViewUpdate.throttled;
        var cancelScheduleViewUpdate = _scheduleViewUpdate.cancel;
        var _trackCommonViewMetrics = trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, startClocks);
        var setLoadEvent = _trackCommonViewMetrics.setLoadEvent;
        var getCommonViewMetrics = _trackCommonViewMetrics.getCommonViewMetrics;
        var stopINPTracking = _trackCommonViewMetrics.stopINPTracking;
        var _trackInitialViewTimings = loadingType === ViewLoadingType.INITIAL_LOAD ? trackInitialViewMetrics(configuration, setLoadEvent, scheduleViewUpdate) : {
            stop: tools_noop,
            initialViewMetrics: {}
        };
        var stopInitialViewMetricsTracking = _trackInitialViewTimings.stop;
        var initialViewMetrics = _trackInitialViewTimings.initialViewMetrics;
        var _trackViewEventCounts = trackViewEventCounts(lifeCycle, id, scheduleViewUpdate);
        var stopEventCountsTracking = _trackViewEventCounts.stop;
        var eventCounts = _trackViewEventCounts.eventCounts;
        var keepAliveIntervalId = timer_setInterval(triggerViewUpdate, SESSION_KEEP_ALIVE_INTERVAL);
        var pageMayExitSubscription = lifeCycle.subscribe(LifeCycleEventType.PAGE_EXITED, (function(pageMayExitEvent) {
            if (pageMayExitEvent.reason === PageExitReason.UNLOADING) {
                triggerViewUpdate();
            }
        }));
        triggerViewUpdate();
        contextManager.changeObservable.subscribe(scheduleViewUpdate);
        function triggerBeforeViewUpdate() {
            lifeCycle.notify(LifeCycleEventType.BEFORE_VIEW_UPDATED, {
                id: id,
                name: name,
                context: contextManager.getContext(),
                startClocks: startClocks
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
            end: function end(options) {
                if (endClocks) {
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
                pageMayExitSubscription.unsubscribe();
                triggerViewUpdate();
                timer_setTimeout((function() {
                    result.stop();
                }), KEEP_TRACKING_AFTER_VIEW_DELAY);
            },
            stop: function stop() {
                stopInitialViewMetricsTracking();
                stopEventCountsTracking();
                stopINPTracking();
                stopObservable.notify();
            },
            addTiming: function addTiming(name, time) {
                if (endClocks) {
                    return;
                }
                var relativeTime = looksLikeRelativeTime(time) ? time : tools_elapsed(startClocks.timeStamp, time);
                customTimings[sanitizeTiming(name)] = relativeTime;
                scheduleViewUpdate();
            },
            setViewName: function setViewName(updatedName) {
                name = updatedName;
                triggerViewUpdate();
            }
        };
        return result;
    }
    function sanitizeTiming(name) {
        var sanitized = name.replace(/[^a-zA-Z0-9-_.@$]/g, "_");
        if (sanitized !== name) {
            console.warn("Invalid timing name: " + name + ", sanitized to: " + sanitized);
        }
        return sanitized;
    }
    function areDifferentLocation(currentLocation, otherLocation) {
        return currentLocation.pathname !== otherLocation.pathname || !isHashAnAnchor(otherLocation.hash) && getPathFromHash(otherLocation.hash) !== getPathFromHash(currentLocation.hash);
    }
    function startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions) {
        lifeCycle.subscribe(LifeCycleEventType.VIEW_UPDATED, (function(view) {
            lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, processViewUpdate(view, configuration, recorderApi, pageStateHistory));
        }));
        return trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, !configuration.trackViewsManually, initialViewOptions);
    }
    function computePerformanceViewDetails(navigationTimings) {
        if (!navigationTimings) {
            return undefined;
        }
        var fetchStart = navigationTimings.fetchStart, responseEnd = navigationTimings.responseEnd, domInteractive = navigationTimings.domInteractive, domContentLoaded = navigationTimings.domContentLoaded, domComplete = navigationTimings.domComplete, loadEventEnd = navigationTimings.loadEventEnd, loadEventStart = navigationTimings.loadEventStart, domContentLoadedEventEnd = navigationTimings.domContentLoadedEventEnd;
        var details = {};
        if (isNumber(responseEnd) && isNumber(fetchStart) && responseEnd !== fetchStart && responseEnd > fetchStart) {
            details.fpt = toServerDuration(responseEnd - fetchStart);
            var apdexLevel = parseInt((responseEnd - fetchStart) / 1e3);
            details.apdexLevel = apdexLevel > 9 ? 9 : apdexLevel;
        }
        if (isNumber(domInteractive) && isNumber(fetchStart) && domInteractive !== fetchStart && domInteractive > fetchStart) {
            details.tti = toServerDuration(domInteractive - fetchStart);
        }
        if (isNumber(domContentLoaded) && isNumber(fetchStart) && domContentLoaded !== fetchStart && domContentLoaded > fetchStart) {
            details.dom_ready = toServerDuration(domContentLoaded - fetchStart);
        }
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
        var pageStates = pageStateHistory.findAll(view.startClocks.relative, view.duration);
        var viewEvent = {
            _gc: {
                document_version: view.documentVersion,
                page_states: pageStates
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
                cumulative_layout_shift: findByPath(view.commonViewMetrics, "cumulativeLayoutShift.value"),
                cumulative_layout_shift_time: findByPath(view.commonViewMetrics, "cumulativeLayoutShift.time"),
                cumulative_layout_shift_target_selector: findByPath(view.commonViewMetrics, "cumulativeLayoutShift.targetSelector"),
                first_byte: toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.firstByte")),
                dom_complete: toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domComplete")),
                dom_content_loaded: toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domContentLoaded")),
                dom_interactive: toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domInteractive")),
                error: {
                    count: view.eventCounts.errorCount
                },
                first_contentful_paint: toServerDuration(findByPath(view.initialViewMetrics, "firstContentfulPaint")),
                first_input_delay: toServerDuration(findByPath(view.initialViewMetrics, "firstInput.delay")),
                first_input_time: toServerDuration(findByPath(view.initialViewMetrics, "firstInput.time")),
                first_input_target_selector: findByPath(view.initialViewMetrics, "firstInput.targetSelector"),
                interaction_to_next_paint: toServerDuration(findByPath(view.commonViewMetrics, "interactionToNextPaint.value")),
                interaction_to_next_paint_target_selector: findByPath(view.commonViewMetrics, "interactionToNextPaint.targetSelector"),
                is_active: view.isActive,
                name: view.name,
                largest_contentful_paint: toServerDuration(findByPath(view.initialViewMetrics, "largestContentfulPaint.value")),
                largest_contentful_paint_element_selector: findByPath(view.initialViewMetrics, "largestContentfulPaint.targetSelector"),
                load_event: toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.loadEvent")),
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
    function isTracingOption(item) {
        var expectedItem = item;
        return getType(expectedItem) === "object" && isMatchOption(expectedItem.match) && isString(expectedItem.traceType);
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
            traceFetch: function traceFetch(context) {
                return injectHeadersIfTracingAllowed();
            },
            traceXhr: function traceXhr(context, xhr) {
                return injectHeadersIfTracingAllowed();
            }
        };
    }
    function injectHeadersIfTracingAllowed(configuration, context, sessionManager, inject) {
        return;
    }
    var nextRequestIndex = 1;
    function startRequestCollection(lifeCycle, configuration, sessionManager) {
        var tracer = startTracer();
        trackXhr(lifeCycle, configuration, tracer);
        trackFetch(lifeCycle, configuration, tracer);
    }
    function trackXhr(lifeCycle, configuration, tracer) {
        var subscription = initXhrObservable().subscribe((function(rawContext) {
            var context = rawContext;
            if (!isAllowedRequestUrl(configuration, context.url)) {
                return;
            }
            switch (context.state) {
              case "start":
                tracer.traceXhr(context, context.xhr);
                context.requestIndex = getNextRequestIndex();
                lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
                    requestIndex: context.requestIndex,
                    url: context.url
                });
                break;

              case "complete":
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
                    handlingStack: context.handlingStack
                });
                break;
            }
        }));
        return {
            stop: function stop() {
                return subscription.unsubscribe();
            }
        };
    }
    function trackFetch(lifeCycle, configuration, tracer) {
        var subscription = initFetchObservable().subscribe((function(rawContext) {
            var context = rawContext;
            if (!isAllowedRequestUrl(configuration, context.url)) {
                return;
            }
            switch (context.state) {
              case "start":
                tracer.traceFetch(context);
                context.requestIndex = getNextRequestIndex();
                lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
                    requestIndex: context.requestIndex,
                    url: context.url
                });
                break;

              case "resolve":
                waitForResponseToComplete(context, (function(duration) {
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
                        type: RequestType.FETCH,
                        url: context.url,
                        response: context.response,
                        init: context.init,
                        input: context.input,
                        isAborted: context.isAborted,
                        handlingStack: context.handlingStack
                    });
                }));
                break;
            }
        }));
        return {
            stop: function stop() {
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
            callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
        } else {
            readBytesFromStream(clonedResponse.body, (function() {
                callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
            }), {
                bytesLimit: Number.POSITIVE_INFINITY,
                collectStreamBody: false
            });
        }
    }
    var alreadyMatchedEntries = new polyfills_WeakSet;
    function matchRequestResourceEntry(request) {
        if (!performance || !("getEntriesByName" in performance)) {
            return;
        }
        var sameNameEntries = performance.getEntriesByName(request.url, "resource");
        if (!sameNameEntries.length || !("toJSON" in sameNameEntries[0])) {
            return;
        }
        var candidates = filter(sameNameEntries, (function(entry) {
            return !alreadyMatchedEntries.has(entry);
        }));
        candidates = filter(candidates, (function(entry) {
            return hasValidResourceEntryDuration(entry) && hasValidResourceEntryTimings(entry);
        }));
        candidates = filter(candidates, (function(entry) {
            return isBetween(entry, request.startClocks.relative, endTime({
                startTime: request.startClocks.relative,
                duration: request.duration
            }));
        }));
        var lastEntry = undefined;
        if (candidates.length > 1) {
            var startTimeDuration = Number.MAX_SAFE_INTEGER;
            candidates.forEach((function(entry) {
                var _startTimeDuration = Math.abs(entry.startTime - request.startClocks.relative);
                if (_startTimeDuration < startTimeDuration) {
                    startTimeDuration = _startTimeDuration;
                    lastEntry = entry;
                }
            }));
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
        var errorMargin = 1;
        return timing.startTime >= start - errorMargin && endTime(timing) <= addDuration(end, errorMargin);
    }
    function retrieveInitialDocumentResourceTiming(configuration, callback) {
        runOnReadyState("interactive", (function() {
            var entry = tools_assign(getNavigationEntry().toJSON(), {
                entryType: RumPerformanceEntryType.RESOURCE,
                initiatorType: FAKE_INITIAL_DOCUMENT,
                toJSON: function toJSON() {
                    return tools_assign({}, entry, {
                        toJSON: undefined
                    });
                }
            });
            callback(entry);
        }));
    }
    function startResourceCollection(lifeCycle, configuration, pageStateHistory, taskQueue, retrieveInitialDocumentResourceTimingImpl) {
        if (taskQueue === undefined) {
            taskQueue = createTaskQueue();
        }
        if (typeof retrieveInitialDocumentResourceTimingImpl === "undefined") {
            retrieveInitialDocumentResourceTimingImpl = retrieveInitialDocumentResourceTiming;
        }
        lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, (function(request) {
            handleResource((function() {
                return processRequest(request, pageStateHistory);
            }));
        }));
        var performanceResourceSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType.RESOURCE,
            buffered: true
        }).subscribe((function(entries) {
            var loop = function loop(entry) {
                if (!isResourceEntryRequestType(entry) && !isResourceUrlLimit(entry.name, configuration.resourceUrlLimit)) {
                    handleResource((function() {
                        return processResourceEntry(entry);
                    }));
                }
            };
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                loop(entry);
            }
        }));
        retrieveInitialDocumentResourceTimingImpl(configuration, (function(timing) {
            handleResource((function() {
                return processResourceEntry(timing);
            }));
        }));
        function handleResource(computeRawEvent) {
            taskQueue.push((function() {
                var rawEvent = computeRawEvent();
                if (rawEvent) {
                    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_COLLECTED, rawEvent);
                }
            }));
        }
        return {
            stop: function stop() {
                performanceResourceSubscription.unsubscribe();
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
                method: "GET",
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
    function discardZeroStatus(statusCode) {
        return statusCode === 0 ? undefined : statusCode;
    }
    function startRum(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, createEncoder) {
        var cleanupTasks = [];
        var lifeCycle = new LifeCycle;
        var reportError = function reportError(error) {
            lifeCycle.notify(LifeCycleEventType.RAW_ERROR_COLLECTED, {
                error: error
            });
        };
        var pageExitObservable = createPageExitObservable();
        pageExitObservable.subscribe((function(event) {
            lifeCycle.notify(LifeCycleEventType.PAGE_EXITED, event);
        }));
        cleanupTasks.push((function() {
            pageExitSubscription.unsubscribe();
        }));
        var session = !canUseEventBridge() ? startRumSessionManager(configuration, lifeCycle) : startRumSessionManagerStub();
        if (!canUseEventBridge()) {
            var batch = startRumBatch(configuration, lifeCycle, "telemetry.observable", reportError, pageExitObservable, session.expireObservable, createEncoder);
            cleanupTasks.push((function() {
                batch.stop();
            }));
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
        var _startViewCollection = startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions), addTiming = _startViewCollection.addTiming, startView = _startViewCollection.startView, setViewName = _startViewCollection.setViewName, setViewContext = _startViewCollection.setViewContext, setViewContextProperty = _startViewCollection.setViewContextProperty, getViewContext = _startViewCollection.getViewContext, stopViewCollection = _startViewCollection.stop;
        cleanupTasks.push(stopViewCollection);
        var _startResourceCollection = startResourceCollection(lifeCycle, configuration, pageStateHistory);
        cleanupTasks.push(_startResourceCollection.stop);
        var _startErrorCollection = startErrorCollection(lifeCycle, configuration, session, pageStateHistory);
        var addError = _startErrorCollection.addError;
        startRequestCollection(lifeCycle, configuration);
        var internalContext = startInternalContext(configuration.applicationId, session, viewContexts, actionContexts, urlContexts);
        return {
            addAction: addAction,
            addError: addError,
            addTiming: addTiming,
            configuration: configuration,
            startView: startView,
            setViewContext: setViewContext,
            setViewContextProperty: setViewContextProperty,
            getViewContext: getViewContext,
            setViewName: setViewName,
            lifeCycle: lifeCycle,
            viewContexts: viewContexts,
            session: session,
            stopSession: function stopSession() {
                session.expire();
            },
            getInternalContext: internalContext.get,
            stop: function stop() {
                cleanupTasks.forEach((function(task) {
                    task();
                }));
            }
        };
    }
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
            stop: function stop() {
                displayContext.stop();
                pageStateHistory.stop();
                urlContexts.stop();
                viewContexts.stop();
            }
        };
    }
    function buildCommonContext(globalContextManager, userContextManager, recorderApi) {
        return {
            context: globalContextManager.getContext(),
            user: userContextManager.getContext(),
            hasReplay: false
        };
    }
    var buildEnv = {
        sdkVersion: "3.2.24",
        sdkName: "df_web_rum_sdk"
    };
    function validateAndBuildRumConfiguration(initConfiguration) {
        if (!initConfiguration.applicationId) {
            display.error("Application ID is not configured, no RUM data will be collected.");
            return;
        }
        var requireParamsValidate = validatePostRequestRequireParamsConfiguration(initConfiguration);
        if (!requireParamsValidate) return;
        if (initConfiguration.sessionOnErrorSampleRate !== undefined && !isPercentage(initConfiguration.sessionOnErrorSampleRate)) {
            display.error("Error Session  Sample Rate should be a number between 0 and 100");
            return;
        }
        if (initConfiguration.sessionReplaySampleRate !== undefined && !isPercentage(initConfiguration.sessionReplaySampleRate)) {
            display.error("Session Replay Sample Rate should be a number between 0 and 100");
            return;
        }
        if (initConfiguration.sessionReplayOnErrorSampleRate !== undefined && !isPercentage(initConfiguration.sessionReplayOnErrorSampleRate)) {
            display.error("Error Session Replay Sample Rate should be a number between 0 and 100");
            return;
        }
        var allowedTracingUrls = validateAndBuildTracingOptions(initConfiguration);
        if (!allowedTracingUrls) {
            return;
        }
        if (initConfiguration.tracingSampleRate !== undefined && !isPercentage(initConfiguration.tracingSampleRate)) {
            display.error("Tracing Sample Rate should be a number between 0 and 100");
            return;
        }
        if (initConfiguration.excludedActivityUrls !== undefined && !isArray(initConfiguration.excludedActivityUrls)) {
            display.error("Excluded Activity Urls should be an array");
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
            injectTraceHeader: initConfiguration.injectTraceHeader && catchUserErrors_catchUserErrors(initConfiguration.injectTraceHeader, "injectTraceHeader threw an error:"),
            generateTraceId: initConfiguration.generateTraceId && catchUserErrors_catchUserErrors(initConfiguration.generateTraceId, "generateTraceId threw an error:"),
            excludedActivityUrls: isNullUndefinedDefaultValue(initConfiguration.excludedActivityUrls, []),
            workerUrl: initConfiguration.workerUrl,
            compressIntakeRequests: !!initConfiguration.compressIntakeRequests,
            trackUserInteractions: trackUserInteractions,
            enableLongAnimationFrame: !!initConfiguration.enableLongAnimationFrame,
            trackViewsManually: !!initConfiguration.trackViewsManually,
            traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType.DDTRACE),
            traceId128Bit: !!initConfiguration.traceId128Bit,
            defaultPrivacyLevel: objectHasValue(DefaultPrivacyLevel, initConfiguration.defaultPrivacyLevel) ? initConfiguration.defaultPrivacyLevel : DefaultPrivacyLevel.MASK_USER_INPUT,
            shouldMaskNode: initConfiguration.shouldMaskNode && catchUserErrors_catchUserErrors(initConfiguration.shouldMaskNode, "shouldMaskNode threw an error:")
        }, baseConfiguration, buildEnv);
    }
    function validateAndBuildTracingOptions(initConfiguration) {
        if (initConfiguration.allowedTracingUrls !== undefined && initConfiguration.allowedTracingOrigins !== undefined) {
            display.warn("Both allowedTracingUrls and allowedTracingOrigins (deprecated) have been defined. The parameter allowedTracingUrls will override allowedTracingOrigins.");
        }
        if (initConfiguration.allowedTracingUrls !== undefined) {
            if (!isArray(initConfiguration.allowedTracingUrls)) {
                display.error("Allowed Tracing URLs should be an array");
                return;
            }
            var tracingOptions = [];
            tools_each(initConfiguration.allowedTracingUrls, (function(option) {
                if (isMatchOption(option)) {
                    tracingOptions.push({
                        match: option,
                        traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType.DDTRACE)
                    });
                } else if (isTracingOption(option)) {
                    tracingOptions.push(option);
                } else {
                    display.warn("Allowed Tracing Urls parameters should be a string, RegExp, function, or an object. Ignoring parameter", option);
                }
            }));
            return tracingOptions;
        }
        return [];
    }
    function createPreStartStrategy(rumPublicApiOptions, getCommonContext, doStartRum) {
        var ignoreInitIfSyntheticsWillInjectRum = rumPublicApiOptions.ignoreInitIfSyntheticsWillInjectRum;
        var bufferApiCalls = createBoundedBuffer();
        var firstStartViewCall;
        var deflateWorker;
        var cachedInitConfiguration;
        var cachedConfiguration;
        function tryStartRum() {
            if (!cachedInitConfiguration || !cachedConfiguration) {
                return;
            }
            var initialViewOptions;
            if (cachedConfiguration.trackViewsManually) {
                if (!firstStartViewCall) {
                    return;
                }
                bufferApiCalls.remove(firstStartViewCall.callback);
                initialViewOptions = firstStartViewCall.options;
            }
            var startRumResult = doStartRum(cachedConfiguration, deflateWorker, initialViewOptions);
            bufferApiCalls.drain(startRumResult);
        }
        function doInit(initConfiguration) {
            cachedInitConfiguration = initConfiguration;
            if (cachedConfiguration) {
                displayAlreadyInitializedError("DATAFLUX_RUM", initConfiguration);
                return;
            }
            var configuration = validateAndBuildRumConfiguration(initConfiguration);
            if (!configuration) {
                return;
            }
            cachedConfiguration = configuration;
            initFetchObservable().subscribe(tools_noop);
            tryStartRum();
        }
        return {
            init: function init(initConfiguration) {
                if (!initConfiguration) {
                    display.error("Missing configuration");
                    return;
                }
                cachedInitConfiguration = initConfiguration;
                if (ignoreInitIfSyntheticsWillInjectRum && willSyntheticsInjectRum()) {
                    return;
                }
                if (initConfiguration.remoteConfiguration) ; else {
                    doInit(initConfiguration);
                }
            },
            getInitConfiguration: function getInitConfiguration() {
                return cachedInitConfiguration;
            },
            getInternalContext: tools_noop,
            stopSession: tools_noop,
            addTiming: function addTiming(name, time) {
                if (time === undefined) {
                    time = timeStampNow();
                }
                bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addTiming(name, time);
                }));
            },
            startView: function startView(options, startClocks) {
                if (startClocks === undefined) {
                    startClocks = clocksNow();
                }
                var callback = function callback(startRumResult) {
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
            setViewName: function setViewName(name) {
                bufferApiCalls.add((function(startRumResult) {
                    return startRumResult.setViewName(name);
                }));
            },
            setViewContext: function setViewContext(context) {
                bufferApiCalls.add((function(startRumResult) {
                    return startRumResult.setViewContext(context);
                }));
            },
            setViewContextProperty: function setViewContextProperty(key, value) {
                bufferApiCalls.add((function(startRumResult) {
                    return startRumResult.setViewContextProperty(key, value);
                }));
            },
            getViewContext: function getViewContext() {},
            addAction: function addAction(action, commonContext) {
                if (commonContext === undefined) {
                    commonContext = getCommonContext();
                }
                bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addAction(action, commonContext);
                }));
            },
            addError: function addError(providedError, commonContext) {
                if (commonContext === undefined) {
                    commonContext = getCommonContext();
                }
                bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addError(providedError, commonContext);
                }));
            }
        };
    }
    var RUM_STORAGE_KEY = "rum";
    function makeRumPublicApi(startRumImpl, recorderApi, options) {
        if (options === undefined) {
            options = {};
        }
        var customerDataTrackerManager = createCustomerDataTrackerManager(CustomerDataCompressionStatus.Unknown);
        var globalContextManager = createContextManager("global", {
            customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType.GlobalContext)
        });
        var userContextManager = createContextManager("user", {
            customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType.User),
            propertiesConfig: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                email: {
                    type: "string"
                }
            }
        });
        function getCommonContext() {
            return buildCommonContext(globalContextManager, userContextManager);
        }
        var strategy = createPreStartStrategy(options, getCommonContext, (function doStartRum(configuration, deflateWorker, initialViewOptions) {
            if (configuration.storeContextsToLocal) {
                storeContextManager(configuration, globalContextManager, RUM_STORAGE_KEY, CustomerDataType.GlobalContext);
                storeContextManager(configuration, userContextManager, RUM_STORAGE_KEY, CustomerDataType.User);
            }
            customerDataTrackerManager.setCompressionStatus(deflateWorker ? CustomerDataCompressionStatus.Enabled : CustomerDataCompressionStatus.Disabled);
            var startRumResult = startRumImpl(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, deflateWorker && options.createDeflateEncoder ? function(streamId) {
                return options.createDeflateEncoder(deflateWorker, streamId);
            } : createIdentityEncoder);
            strategy = createPostStartStrategy(strategy, startRumResult);
            return startRumResult;
        }));
        var startView = monitor((function(options) {
            var sanitizedOptions = typeof_typeof(options) === "object" ? options : {
                name: options
            };
            strategy.startView(sanitizedOptions);
            if (sanitizedOptions.context) {
                customerDataTrackerManager.getOrCreateTracker(CustomerDataType.View).updateCustomerData(sanitizedOptions.context);
            }
        }));
        var rumPublicApi = makePublicApi({
            init: monitor((function(initConfiguration) {
                strategy.init(initConfiguration);
            })),
            setViewName: monitor((function(name) {
                strategy.setViewName(name);
            })),
            setViewContext: monitor((function(context) {
                strategy.setViewContext(context);
            })),
            setViewContextProperty: monitor((function(key, value) {
                strategy.setViewContextProperty(key, value);
            })),
            getViewContext: monitor((function() {
                return strategy.getViewContext();
            })),
            setGlobalContextProperty: monitor((function(key, value) {
                globalContextManager.setContextProperty(key, value);
            })),
            removeGlobalContextProperty: monitor((function(key) {
                return globalContextManager.removeContextProperty(key);
            })),
            getGlobalContext: monitor((function() {
                return globalContextManager.getContext();
            })),
            setGlobalContext: monitor((function(context) {
                globalContextManager.setContext(context);
            })),
            clearGlobalContext: monitor((function() {
                return globalContextManager.clearContext();
            })),
            getInitConfiguration: monitor((function() {
                return deepClone(strategy.initConfiguration);
            })),
            getInternalContext: monitor((function(startTime) {
                return strategy.getInternalContext(startTime);
            })),
            addDebugSession: monitor((function(id) {})),
            clearDebugSession: monitor((function() {})),
            getDebugSession: monitor((function() {})),
            addAction: monitor((function(name, context) {
                var handlingStack = createHandlingStack();
                callMonitored((function() {
                    strategy.addAction({
                        name: sanitize(name),
                        context: sanitize(context),
                        startClocks: clocksNow(),
                        type: ActionType.CUSTOM,
                        handlingStack: handlingStack
                    });
                }));
            })),
            addError: monitor((function(error, context) {
                var handlingStack = createHandlingStack();
                callMonitored((function() {
                    strategy.addError({
                        error: error,
                        handlingStack: handlingStack,
                        context: sanitize(context),
                        startClocks: clocksNow()
                    });
                }));
            })),
            addTiming: monitor((function(name, time) {
                strategy.addTiming(sanitize(name), time);
            })),
            setUser: monitor((function(newUser) {
                if (checkUser(newUser)) {
                    userContextManager.setContext(sanitizeUser(newUser));
                }
            })),
            getUser: monitor((function() {
                return userContextManager.getContext();
            })),
            setUserProperty: monitor((function(key, property) {
                var newUser = {};
                newUser[key] = property;
                var sanitizedProperty = sanitizeUser(newUser)[key];
                userContextManager.setContextProperty(key, sanitizedProperty);
            })),
            removeUserProperty: monitor((function(key) {
                return userContextManager.removeContextProperty(key);
            })),
            clearUser: monitor((function() {
                return userContextManager.clearContext();
            })),
            startView: startView,
            stopSession: monitor((function() {
                strategy.stopSession();
            }))
        });
        return rumPublicApi;
    }
    function createPostStartStrategy(preStartStrategy, startRumResult) {
        return tools_assign({
            init: function init(initConfiguration) {
                displayAlreadyInitializedError("DATAFLUX_RUM", initConfiguration);
            },
            initConfiguration: preStartStrategy.getInitConfiguration()
        }, startRumResult);
    }
    var datafluxRum = makeRumPublicApi(startRum, "recorderApi", {
        startDeflateWorker: null,
        createDeflateEncoder: null
    });
    var __webpack_exports__datafluxRum = __webpack_exports__.E;
    function guancecom(settings) {
        var defaultOptions = {
            traceType: "jaeger",
            trackInteractions: true
        };
        var uniOptions = {
            service: settings.app.service,
            version: settings.app.version,
            env: settings.app.profile
        };
        var sdkOptions = {
            applicationId: settings.id,
            datakitOrigin: settings.endpoint
        };
        var rumOptions = __assign({}, settings.rum);
        if (rumOptions.beforeSend) {
            sdkOptions.beforeSend = rumOptions.beforeSend;
        }
        function isDeny(event) {
            if (event.type === "resource") {
                var origins = rumOptions.denyResourceOrigins;
                for (var i = 0; i < origins.length; i += 1) {
                    if (event.resource.url.indexOf(origins[i]) > 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        if (rumOptions.denyResourceOrigins && rumOptions.denyResourceOrigins.length > 0) {
            if (sdkOptions.beforeSend) {
                var that_1 = sdkOptions.beforeSend;
                sdkOptions.beforeSend = function(event, context) {
                    if (isDeny(event)) {
                        return false;
                    }
                    if (that_1(event, context) === false) {
                        return false;
                    }
                };
            } else {
                sdkOptions.beforeSend = function(event, context) {
                    if (isDeny(event)) {
                        return false;
                    }
                };
            }
        }
        var options = __assign(__assign(__assign(__assign({}, defaultOptions), uniOptions), sdkOptions), settings);
        __webpack_exports__datafluxRum.init(options);
        function transform(event) {
            event.context.page;
            var messageId = event.messageId, anonymousId = event.anonymousId, type = event.type, properties = event.properties, timestamp = event.timestamp;
            return {
                messageId: messageId,
                anonymousId: anonymousId,
                type: type,
                properties: properties,
                timestamp: timestamp
            };
        }
        function addAction(ctx) {
            return __awaiter(this, void 0, void 0, (function() {
                var event;
                return __generator(this, (function(_a) {
                    event = transform(ctx.event);
                    __webpack_exports__datafluxRum.addAction(ctx.event.event, event);
                    return [ 2, Promise.resolve() ];
                }));
            }));
        }
        var guancecom = {
            name: "Guance.com",
            type: "destination",
            version: "3.2.24-7",
            isLoaded: function() {
                return true;
            },
            load: function() {
                return Promise.resolve();
            },
            track: addAction,
            page: function() {
                return Promise.resolve();
            }
        };
        return guancecom;
    }
    return guancecom;
}();
