!function() {
    "use strict";
    var sdkMap_SDKMap = Map;
    var ConsoleApiName = {
        log: "log",
        debug: "debug",
        info: "info",
        warn: "warn",
        error: "error"
    }, globalConsole = console, originalConsoleMethods = {};
    Object.keys(ConsoleApiName).forEach((function(name) {
        originalConsoleMethods[name] = globalConsole[name] || tools_noop;
    }));
    var onMonitorErrorCollected, PREFIX = "GUANCE Browser SDK:", display = {
        debug: originalConsoleMethods.debug.bind(globalConsole, PREFIX),
        log: originalConsoleMethods.log.bind(globalConsole, PREFIX),
        info: originalConsoleMethods.info.bind(globalConsole, PREFIX),
        warn: originalConsoleMethods.warn.bind(globalConsole, PREFIX),
        error: originalConsoleMethods.error.bind(globalConsole, PREFIX)
    }, debugMode = !1;
    function setDebugMode(newDebugMode) {
        debugMode = newDebugMode;
    }
    function monitor(fn) {
        return function() {
            return monitor_callMonitored(fn, this, arguments);
        };
    }
    function monitor_callMonitored(fn, context, args) {
        try {
            return fn.apply(context, args);
        } catch (e) {
            monitorError(e);
        }
    }
    function monitorError(e) {
        if (displayIfDebugEnabled(e), onMonitorErrorCollected) try {
            onMonitorErrorCollected(e);
        } catch (e) {
            displayIfDebugEnabled(e);
        }
    }
    function displayIfDebugEnabled() {
        try {
            debugMode && display.error.apply(null, [ "[MONITOR]" ].concat([].slice.call(arguments)));
        } catch (_) {}
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
    function getGlobalObject() {
        if ("object" == typeof globalThis) return globalThis;
        Object.defineProperty(Object.prototype, "_gc_temp_", {
            get: function() {
                return this;
            },
            configurable: !0
        });
        var globalObject = _gc_temp_;
        return delete Object.prototype._gc_temp_, "object" != typeof globalObject && (globalObject = "object" == typeof self ? self : "object" == typeof window ? window : {}), 
        globalObject;
    }
    function getZoneJsOriginalValue(target, name) {
        var original, browserWindow = getGlobalObject();
        return browserWindow.Zone && "function" == typeof browserWindow.Zone.__symbol__ && (original = target[browserWindow.Zone.__symbol__(name)]), 
        original || (original = target[name]), original;
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
    function isValidNavigationStart(value) {
        return "number" == typeof value && isFinite(value) && value > 0;
    }
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, slice = ArrayProto.slice, tools_toString = ObjProto.toString, tools_hasOwnProperty = ObjProto.hasOwnProperty, nativeForEach = ArrayProto.forEach, nativeIsArray = Array.isArray, tools_each = function(obj, iterator, context) {
        if (null === obj) return !1;
        if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context); else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) if (i in obj && false === iterator.call(context, obj[i], i, obj)) return !1;
        } else for (var key in obj) if (tools_hasOwnProperty.call(obj, key) && false === iterator.call(context, obj[key], key, obj)) return !1;
    };
    function tools_assign(target) {
        return tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) Object.prototype.hasOwnProperty.call(source, prop) && (target[prop] = source[prop]);
        })), target;
    }
    function shallowClone(object) {
        return tools_assign({}, object);
    }
    var extend = function(obj) {
        return tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) void 0 !== source[prop] && (obj[prop] = source[prop]);
        })), obj;
    }, extend2Lev = function(obj) {
        return tools_each(slice.call(arguments, 1), (function(source) {
            for (var prop in source) void 0 !== source[prop] && (isObject(source[prop]) && isObject(obj[prop]) ? extend(obj[prop], source[prop]) : obj[prop] = source[prop]);
        })), obj;
    }, isArray = nativeIsArray || function(obj) {
        return "[object Array]" === tools_toString.call(obj);
    }, isFunction = function(f) {
        if (!f) return !1;
        try {
            return /^\s*\bfunction\b/.test(f);
        } catch (err) {
            return !1;
        }
    }, toArray = function(iterable) {
        return iterable ? iterable.toArray ? iterable.toArray() : isArray(iterable) ? slice.call(iterable) : (obj = iterable) && tools_hasOwnProperty.call(obj, "callee") ? slice.call(iterable) : values(iterable) : [];
        var obj;
    }, values = function(obj) {
        var results = [];
        return null === obj || tools_each(obj, (function(value) {
            results[results.length] = value;
        })), results;
    }, filter = function(arr, fn, self) {
        if (arr.filter) return arr.filter(fn);
        for (var ret = [], i = 0; i < arr.length; i++) if (tools_hasOwnProperty.call(arr, i)) {
            var val = arr[i];
            fn.call(self, val, i, arr) && ret.push(val);
        }
        return ret;
    }, tools_map = function(arr, fn, self) {
        if (arr.map) return arr.map(fn);
        for (var ret = [], i = 0; i < arr.length; i++) if (tools_hasOwnProperty.call(arr, i)) {
            var val = arr[i];
            ret.push(fn.call(self, val, i, arr));
        }
        return ret;
    }, some = function(arr, fn, self) {
        if (arr.some) return arr.some(fn);
        for (var flag = !1, i = 0; i < arr.length; i++) if (tools_hasOwnProperty.call(arr, i)) {
            var val = arr[i];
            if (fn.call(self, val, i, arr)) {
                flag = !0;
                break;
            }
        }
        return flag;
    }, matchList = function(list, value, useStartsWith) {
        return void 0 === useStartsWith && (useStartsWith = !1), some(list, (function(item) {
            try {
                if ("function" == typeof item) return item(value);
                if (item instanceof RegExp) return item.test(value);
                if ("string" == typeof item) return useStartsWith ? startsWith(value, item) : item === value;
            } catch (e) {
                display.error(e);
            }
            return !1;
        }));
    }, cssEscape = function(str) {
        return str += "", window.CSS && window.CSS.escape ? window.CSS.escape(str) : str.replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, (function(ch, asCodePoint) {
            return asCodePoint ? "\0" === ch ? "�" : ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " " : "\\" + ch;
        }));
    }, isObject = function(obj) {
        return null !== obj && "[object Object]" === tools_toString.call(obj);
    }, isEmptyObject = function(obj) {
        if (isObject(obj)) {
            for (var key in obj) if (tools_hasOwnProperty.call(obj, key)) return !1;
            return !0;
        }
        return !1;
    }, objectEntries = function(object) {
        var res = [];
        return tools_each(object, (function(value, key) {
            res.push([ key, value ]);
        })), res;
    }, isString = function(obj) {
        return "[object String]" === tools_toString.call(obj);
    }, isBoolean = function(obj) {
        return "[object Boolean]" === tools_toString.call(obj);
    }, isNumber = function(obj) {
        return "[object Number]" === tools_toString.call(obj) && /[\d\.]+/.test(String(obj));
    }, throttle = (Date.now, function(fn, wait, options) {
        var needLeadingExecution = !options || void 0 === options.leading || options.leading, needTrailingExecution = !options || void 0 === options.trailing || options.trailing;
        let pendingExecutionWithParameters, pendingTimeoutId, inWaitPeriod = !1;
        var context = this;
        return {
            throttled: function() {
                inWaitPeriod ? pendingExecutionWithParameters = arguments : (needLeadingExecution ? fn.apply(context, arguments) : pendingExecutionWithParameters = arguments, 
                inWaitPeriod = !0, pendingTimeoutId = timer_setTimeout((function() {
                    needTrailingExecution && pendingExecutionWithParameters && fn.apply(context, pendingExecutionWithParameters), 
                    inWaitPeriod = !1, pendingExecutionWithParameters = void 0;
                }), wait));
            },
            cancel: function() {
                timer_clearTimeout(pendingTimeoutId), inWaitPeriod = !1, pendingExecutionWithParameters = void 0;
            }
        };
    });
    function tools_UUID(placeholder) {
        return placeholder ? (parseInt(placeholder, 10) ^ 16 * Math.random() >> parseInt(placeholder, 10) / 4).toString(16) : "".concat(1e7, "-", 1e3, "-", 4e3, "-", 8e3, "-", 1e11).replace(/[018]/g, tools_UUID);
    }
    function tools_replaceNumberCharByPath(path) {
        var pathGroup = "";
        return path && (pathGroup = path.replace(/\/([^\/]*)\d([^\/]*)/g, "/?").replace(/\/$/g, "")), 
        pathGroup || "/";
    }
    var tools_urlParse = function(para) {
        var URLParser = function(a) {
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
            }, this._values = {}, this._regex = null, this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/, 
            void 0 !== a && this._parse(a);
        };
        return URLParser.prototype.setUrl = function(a) {
            this._parse(a);
        }, URLParser.prototype._initValues = function() {
            for (var a in this._fields) this._values[a] = "";
        }, URLParser.prototype.addQueryString = function(queryObj) {
            if ("object" != typeof queryObj) return !1;
            var query = this._values.QueryString || "";
            for (var i in queryObj) query = new RegExp(i + "[^&]+").test(query) ? query.replace(new RegExp(i + "[^&]+"), i + "=" + queryObj[i]) : "&" === query.slice(-1) ? query + i + "=" + queryObj[i] : "" === query ? i + "=" + queryObj[i] : query + "&" + i + "=" + queryObj[i];
            this._values.QueryString = query;
        }, URLParser.prototype.getParse = function() {
            return this._values;
        }, URLParser.prototype.getUrl = function() {
            var url = "";
            return url += this._values.Origin, url += this._values.Path, url += this._values.QueryString ? "?" + this._values.QueryString : "";
        }, URLParser.prototype._parse = function(a) {
            this._initValues();
            var b = this._regex.exec(a);
            if (!b) throw "DPURLParser::_parse -> Invalid URL";
            for (var c in this._fields) void 0 !== b[this._fields[c]] && (this._values[c] = b[this._fields[c]]);
            this._values.Path = this._values.Path || "/", this._values.Hostname = this._values.Host.replace(/:\d+$/, ""), 
            this._values.Origin = this._values.Protocol + "://" + this._values.Hostname + (this._values.Port ? ":" + this._values.Port : "");
        }, new URLParser(para);
    };
    var tools_getQueryParamsFromUrl = function(url) {
        var result = {}, queryString = url.split("?")[1] || "";
        return queryString && (result = getURLSearchParams("?" + queryString)), result;
    }, getURLSearchParams = function(queryString) {
        for (var decodeParam = function(str) {
            return decodeURIComponent(str);
        }, args = {}, pairs = (queryString = queryString || "").substring(1).split("&"), i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
            if (-1 !== pos) {
                var name = pairs[i].substring(0, pos), value = pairs[i].substring(pos + 1);
                name = decodeParam(name), value = decodeParam(value), args[name] = value;
            }
        }
        return args;
    };
    function tools_getType(value) {
        return null === value ? "null" : Array.isArray(value) ? "array" : typeof value;
    }
    function mergeInto(destination, source, circularReferenceChecker) {
        if (void 0 === circularReferenceChecker && (circularReferenceChecker = function() {
            if ("undefined" != typeof WeakSet) {
                var set = new WeakSet;
                return {
                    hasAlreadyBeenSeen: function(value) {
                        var has = set.has(value);
                        return has || set.add(value), has;
                    }
                };
            }
            var array = [];
            return {
                hasAlreadyBeenSeen: function(value) {
                    var has = array.indexOf(value) >= 0;
                    return has || array.push(value), has;
                }
            };
        }()), void 0 === source) return destination;
        if ("object" != typeof source || null === source) return source;
        if (source instanceof Date) return new Date(source.getTime());
        if (source instanceof RegExp) {
            var flags = source.flags || [ source.global ? "g" : "", source.ignoreCase ? "i" : "", source.multiline ? "m" : "", source.sticky ? "y" : "", source.unicode ? "u" : "" ].join("");
            return new RegExp(source.source, flags);
        }
        if (!circularReferenceChecker.hasAlreadyBeenSeen(source)) {
            if (Array.isArray(source)) {
                for (var merged = Array.isArray(destination) ? destination : [], i = 0; i < source.length; ++i) merged[i] = mergeInto(merged[i], source[i], circularReferenceChecker);
                return merged;
            }
            merged = "object" === tools_getType(destination) ? destination : {};
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (merged[key] = mergeInto(merged[key], source[key], circularReferenceChecker));
            return merged;
        }
    }
    function deepClone(value) {
        return mergeInto(void 0, value);
    }
    function getStatusGroup(status) {
        return status ? String(status).substr(0, 1) + String(status).substr(1).replace(/\d*/g, "x") : 0 === status ? void 0 : status;
    }
    function tools_noop() {}
    var navigationStart;
    function performDraw(threshold) {
        return 0 !== threshold && 100 * Math.random() <= threshold;
    }
    function round(num, decimals) {
        return +num.toFixed(decimals);
    }
    function msToNs(duration) {
        return "number" != typeof duration ? duration : round(1e6 * duration, 0);
    }
    function tools_toServerDuration(duration) {
        return isNumber(duration) ? round(1e6 * duration, 0) : duration;
    }
    function getRelativeTime(timestamp) {
        return timestamp - getNavigationStart();
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
        return correctedOrigin > getNavigationStart() ? Math.round(correctedOrigin + relativeTime) : getTimestamp(relativeTime);
    }
    function getNavigationStart() {
        var performanceObject, currentTime, legacyNavigationStart;
        return void 0 === navigationStart && (performanceObject = performance, currentTime = dateNow(), 
        legacyNavigationStart = performanceObject.timing && performanceObject.timing.navigationStart, 
        navigationStart = isValidNavigationStart(legacyNavigationStart) ? legacyNavigationStart : isValidNavigationStart(performanceObject.timeOrigin) ? performanceObject.timeOrigin : Math.round(currentTime - performanceObject.now())), 
        navigationStart;
    }
    var COMMA_SEPARATED_KEY_VALUE = /([\w-]+)\s*=\s*([^;]+)/g;
    function findByPath(source, path) {
        for (var pathArr = path.split("."); pathArr.length; ) {
            var key = pathArr.shift();
            if (!(source && isObject(source) && key in source && tools_hasOwnProperty.call(source, key))) return;
            source = source[key];
        }
        return source;
    }
    function safeTruncate(candidate, length) {
        var lastChar = candidate.charCodeAt(length - 1);
        return lastChar >= 55296 && lastChar <= 56319 ? candidate.slice(0, length + 1) : candidate.slice(0, length);
    }
    function isMatchOption(item) {
        const itemType = tools_getType(item);
        return "string" === itemType || "function" === itemType || item instanceof RegExp;
    }
    function includes(candidate, search) {
        return -1 !== candidate.indexOf(search);
    }
    function find(array, predicate) {
        for (var i = 0; i < array.length; i += 1) {
            var item = array[i];
            if (predicate(item, i, array)) return item;
        }
    }
    function tools_arrayFrom(arrayLike) {
        if (Array.from) return Array.from(arrayLike);
        var array = [];
        if (arrayLike instanceof Set) arrayLike.forEach((function(item) {
            array.push(item);
        })); else for (var i = 0; i < arrayLike.length; i++) array.push(arrayLike[i]);
        return array;
    }
    function isPercentage(value) {
        return isNumber(value) && value >= 0 && value <= 100;
    }
    var browserCache, Browser_IE = 0, Browser_CHROMIUM = 1, Browser_SAFARI = 2, Browser_OTHER = 3;
    function detectBrowserCached() {
        return isNullUndefinedDefaultValue(browserCache, browserCache = function(browserWindow) {
            var _browserWindow, _browserWindow$naviga;
            void 0 === browserWindow && (browserWindow = window || {});
            var userAgent = (null === (_browserWindow = browserWindow) || void 0 === _browserWindow || null === (_browserWindow = _browserWindow.navigator) || void 0 === _browserWindow ? void 0 : _browserWindow.userAgent) || "";
            if (browserWindow.chrome || /HeadlessChrome/.test(userAgent)) return Browser_CHROMIUM;
            if (0 === (null === (_browserWindow$naviga = browserWindow.navigator.vendor) || void 0 === _browserWindow$naviga ? void 0 : _browserWindow$naviga.indexOf("Apple")) || /safari/i.test(userAgent) && !/chrome|android/i.test(userAgent)) return Browser_SAFARI;
            if (browserWindow.document.documentMode) return Browser_IE;
            return Browser_OTHER;
        }());
    }
    function withSnakeCaseKeys(candidate) {
        var result = {};
        return tools_each(candidate, (function(value, key) {
            var word;
            result[(word = key, word.replace(/[A-Z]/g, (function(uppercaseLetter, index) {
                return (0 !== index ? "_" : "") + uppercaseLetter.toLowerCase();
            })).replace(/-/g, "_"))] = deepSnakeCase(value);
        })), result;
    }
    function deepSnakeCase(candidate) {
        return isArray(candidate) ? tools_map(candidate, (function(value) {
            return deepSnakeCase(value);
        })) : "object" == typeof candidate && null !== candidate ? withSnakeCaseKeys(candidate) : candidate;
    }
    function isNullUndefinedDefaultValue(data, defaultValue) {
        return null != data ? data : defaultValue;
    }
    function objectHasValue(object, value) {
        return some((results = [], null === (obj = object) || tools_each(obj, (function(value, key) {
            results[results.length] = key;
        })), results), (function(key) {
            return object[key] === value;
        }));
        var obj, results;
    }
    function startsWith(candidate, search) {
        return candidate.slice(0, search.length) === search;
    }
    function removeItem(array, item) {
        var index = array.indexOf(item);
        index >= 0 && array.splice(index, 1);
    }
    function getPathFromHash(hash) {
        var index = hash.indexOf("?");
        return index < 0 ? hash : hash.slice(0, index);
    }
    function discardNegativeDuration(duration) {
        return isNumber(duration) && duration < 0 ? void 0 : duration;
    }
    function createBoundedBuffer() {
        var buffer = [];
        return {
            add: function(callback) {
                buffer.push(callback) > 500 && buffer.splice(0, 1);
            },
            remove: function(callback) {
                removeItem(buffer, callback);
            },
            drain: function(arg) {
                buffer.forEach((function(callback) {
                    callback(arg);
                })), buffer.length = 0;
            }
        };
    }
    let cleanupHistoriesInterval = null;
    const cleanupTasks = new Set;
    function createValueHistory(params) {
        var expireDelay = params.expireDelay, maxEntries = params.maxEntries, entries = [];
        function clearExpiredValues() {
            for (var oldTimeThreshold = tools_relativeNow() - expireDelay; entries.length > 0 && entries[entries.length - 1].endTime < oldTimeThreshold; ) entries.pop();
        }
        return null === cleanupHistoriesInterval && (cleanupHistoriesInterval = timer_setInterval((function() {
            return clearExpiredValues();
        }), 6e4)), cleanupTasks.add(clearExpiredValues), {
            add: function(value, startTime) {
                var entry = {
                    value: value,
                    startTime: startTime,
                    endTime: Infinity,
                    remove: function() {
                        removeItem(entries, entry);
                    },
                    close: function(endTime) {
                        entry.endTime = endTime;
                    }
                };
                return maxEntries && entries.length >= maxEntries && entries.pop(), entries.unshift(entry), 
                entry;
            },
            find: function(startTime, options) {
                void 0 === startTime && (startTime = Infinity), void 0 === options && (options = {
                    returnInactive: !1
                });
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    if (entry.startTime <= startTime) {
                        if (options.returnInactive || startTime <= entry.endTime) return entry.value;
                        break;
                    }
                }
            },
            closeActive: function(endTime) {
                var latestEntry = entries[0];
                latestEntry && Infinity === latestEntry.endTime && latestEntry.close(endTime);
            },
            findAll: function(startTime, duration) {
                void 0 === startTime && (startTime = Infinity), void 0 === duration && (duration = 0);
                var endTime = addDuration(startTime, duration);
                return entries.filter((function(entry) {
                    return entry.startTime <= endTime && startTime <= entry.endTime;
                })).map((function(entry) {
                    return entry.value;
                }));
            },
            reset: function() {
                entries = [];
            },
            stop: function() {
                cleanupTasks.delete(clearExpiredValues), 0 === cleanupTasks.size && cleanupHistoriesInterval && (timer_clearInterval(cleanupHistoriesInterval), 
                cleanupHistoriesInterval = null);
            }
        };
    }
    function getBrowserWindow() {
        return "undefined" != typeof window ? window : void 0;
    }
    function getNavigator() {
        const browserWindow = getBrowserWindow();
        return browserWindow && void 0 !== browserWindow.navigator ? browserWindow.navigator : {};
    }
    var MethodLibrary = {
        getNetwork: monitor((function() {
            var browserWindow = getBrowserWindow();
            if (!browserWindow || !browserWindow.navigator) return "unknown";
            var connection = browserWindow.navigator.connection || browserWindow.navigator.mozConnection || browserWindow.navigator.webkitConnection, result = "unknown", type = connection ? connection.type || connection.effectiveType : null;
            if (type && "string" == typeof type) switch (type) {
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
            }
            return result;
        })),
        getLanguage: monitor((function(target) {
            var _this = function(target, context) {
                return target || context || {};
            }(target, this);
            return _this.language = function() {
                var navigator = getNavigator(), arr = (navigator.browserLanguage || navigator.language || "").split("-");
                return arr[1] && (arr[1] = arr[1].toUpperCase()), arr.join("_");
            }(), _this.language;
        })),
        getTimeZone: monitor((function() {
            try {
                return (new Intl.DateTimeFormat).resolvedOptions().timeZone;
            } catch (_unused) {
                return;
            }
        }))
    };
    function getDeviceInfo() {
        return {
            screenSize: screen.width + "*" + screen.height,
            networkType: MethodLibrary.getNetwork(),
            timeZone: MethodLibrary.getTimeZone(),
            userAgent: getNavigator().userAgent || ""
        };
    }
    function getDeviceInfoWithHighEntropyValues(callback) {
        callback(getDeviceInfo());
    }
    getDeviceInfo();
    var DOM_EVENT_BEFORE_UNLOAD = "beforeunload", DOM_EVENT_CLICK = "click", DOM_EVENT_KEY_DOWN = "keydown", DOM_EVENT_LOAD = "load", DOM_EVENT_POP_STATE = "popstate", DOM_EVENT_SCROLL = "scroll", DOM_EVENT_TOUCH_START = "touchstart", DOM_EVENT_VISIBILITY_CHANGE = "visibilitychange", DOM_EVENT_PRERENDERING_CHANGE = "prerenderingchange", DOM_EVENT_PAGE_SHOW = "pageshow", DOM_EVENT_FREEZE = "freeze", DOM_EVENT_RESUME = "resume", DOM_EVENT_DOM_CONTENT_LOADED = "DOMContentLoaded", DOM_EVENT_POINTER_DOWN = "pointerdown", DOM_EVENT_POINTER_UP = "pointerup", DOM_EVENT_POINTER_CANCEL = "pointercancel", DOM_EVENT_HASH_CHANGE = "hashchange", DOM_EVENT_PAGE_HIDE = "pagehide", DOM_EVENT_MOUSE_DOWN = "mousedown", DOM_EVENT_FOCUS = "focus", DOM_EVENT_BLUR = "blur", DOM_EVENT_RESIZE = "resize", DOM_EVENT_SECURITY_POLICY_VIOLATION = "securitypolicyviolation", DOM_EVENT_STORAGE = "storage", enums_ResourceType_DOCUMENT = "document", enums_ResourceType_XHR = "xhr", enums_ResourceType_BEACON = "beacon", enums_ResourceType_FETCH = "fetch", enums_ResourceType_CSS = "css", enums_ResourceType_JS = "js", enums_ResourceType_IMAGE = "image", enums_ResourceType_FONT = "font", enums_ResourceType_MEDIA = "media", enums_ResourceType_OTHER = "other", enums_ResourceType_CUSTOM = "custom", ExperimentalFeature_TRACK_WEBSOCKETS = "track_websockets", ActionType_CLICK = "click", ActionType_CUSTOM = "custom", enums_RumEventType = {
        ACTION: "action",
        ERROR: "error",
        LONG_TASK: "long_task",
        VIEW: "view",
        RESOURCE: "resource",
        LOGGER: "logger"
    }, ViewLoadingType_INITIAL_LOAD = "initial_load", ViewLoadingType_ROUTE_CHANGE = "route_change", RequestType = {
        FETCH: enums_ResourceType_FETCH,
        XHR: enums_ResourceType_XHR
    }, TraceType_DDTRACE = "ddtrace", ErrorHandling_HANDLED = "handled", ErrorHandling_UNHANDLED = "unhandled", NonErrorPrefix_UNCAUGHT = "Uncaught", NonErrorPrefix_PROVIDED = "Provided";
    function jsonStringify_jsonStringify(value, replacer, space) {
        if ("object" != typeof value || null === value) return JSON.stringify(value);
        var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype), restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype), restoreValuePrototypeToJson = detachToJsonMethod(Object.getPrototypeOf(value)), restoreValueToJson = detachToJsonMethod(value);
        try {
            return JSON.stringify(value, replacer, space);
        } catch (_unused) {
            return "<error: unable to serialize object>";
        } finally {
            restoreObjectPrototypeToJson(), restoreArrayPrototypeToJson(), restoreValuePrototypeToJson(), 
            restoreValueToJson();
        }
    }
    function detachToJsonMethod(value) {
        const object = value, objectToJson = object.toJSON;
        return objectToJson ? (delete object.toJSON, function() {
            object.toJSON = objectToJson;
        }) : tools_noop;
    }
    function computeStackTrace(ex) {
        var stack = [], stackProperty = tryToGetString(ex, "stack"), exString = String(ex);
        return stackProperty && stackProperty.startsWith(exString) && (stackProperty = stackProperty.slice(exString.length)), 
        stackProperty && tools_each(stackProperty.split("\n"), (function(line) {
            var stackFrame = function(line) {
                var parts = CHROME_LINE_RE.exec(line);
                if (!parts) return;
                var isNative = parts[2] && 0 === parts[2].indexOf("native"), isEval = parts[2] && 0 === parts[2].indexOf("eval"), submatch = CHROME_EVAL_RE.exec(parts[2]);
                isEval && submatch && (parts[2] = submatch[1], parts[3] = submatch[2], parts[4] = submatch[3]);
                return {
                    args: isNative ? [ parts[2] ] : [],
                    column: parts[4] ? +parts[4] : void 0,
                    func: parts[1] || "?",
                    line: parts[3] ? +parts[3] : void 0,
                    url: isNative ? void 0 : parts[2]
                };
            }(line) || function(line) {
                var parts = CHROME_ANONYMOUS_FUNCTION_RE.exec(line);
                if (!parts) return;
                return {
                    args: [],
                    column: parts[3] ? +parts[3] : void 0,
                    func: "?",
                    line: parts[2] ? +parts[2] : void 0,
                    url: parts[1]
                };
            }(line) || function(line) {
                var parts = WINJS_LINE_RE.exec(line);
                if (!parts) return;
                return {
                    args: [],
                    column: parts[4] ? +parts[4] : void 0,
                    func: parts[1] || "?",
                    line: +parts[3],
                    url: parts[2]
                };
            }(line) || function(line) {
                var parts = GECKO_LINE_RE.exec(line);
                if (!parts) return;
                var isEval = parts[3] && parts[3].indexOf(" > eval") > -1, submatch = GECKO_EVAL_RE.exec(parts[3]);
                isEval && submatch && (parts[3] = submatch[1], parts[4] = submatch[2], parts[5] = void 0);
                return {
                    args: parts[2] ? parts[2].split(",") : [],
                    column: parts[5] ? +parts[5] : void 0,
                    func: parts[1] || "?",
                    line: parts[4] ? +parts[4] : void 0,
                    url: parts[3]
                };
            }(line);
            stackFrame && (!stackFrame.func && stackFrame.line && (stackFrame.func = "?"), stack.push(stackFrame));
        })), {
            message: tryToGetString(ex, "message"),
            name: tryToGetString(ex, "name"),
            stack: stack
        };
    }
    var fileUrl = "((?:file|https?|blob|chrome-extension|electron|native|eval|webpack|<anonymous>|\\w+\\.|\\/).*?)", CHROME_LINE_RE = new RegExp("^\\s*at (.*?) ?\\(" + fileUrl + "(?::(\\d+))?(?::(\\d+))?\\)?\\s*$", "i"), CHROME_EVAL_RE = new RegExp("\\((\\S*)(?::(\\d+))(?::(\\d+))\\)");
    var CHROME_ANONYMOUS_FUNCTION_RE = new RegExp("^\\s*at ?" + fileUrl + "(?::(\\d+))?(?::(\\d+))??\\s*$", "i");
    var WINJS_LINE_RE = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    var GECKO_LINE_RE = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|capacitor|\[native).*?|[^@]*bundle|\[wasm code\])(?::(\d+))?(?::(\d+))?\s*$/i, GECKO_EVAL_RE = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    function tryToGetString(candidate, property) {
        if ("object" == typeof candidate && candidate && property in candidate) {
            var value = candidate[property];
            return "string" == typeof value ? value : void 0;
        }
    }
    var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?([\s\S]*)$/;
    function startUnhandledErrorCollection(callback) {
        var _instrumentOnError = function(callback) {
            return instrumentMethod(window, "onerror", (function(params) {
                var stackTrace, parameters = params.parameters, messageObj = parameters[0], url = parameters[1], line = parameters[2], column = parameters[3], errorObj = parameters[4];
                if (errorObj instanceof Error) 0 === (stackTrace = computeStackTrace(errorObj)).stack.length && url && line > 0 && stackTrace.stack.push({
                    func: "?",
                    url: url,
                    line: line,
                    column: column > 0 ? column : void 0
                }); else {
                    var location = {
                        url: url,
                        column: column,
                        line: line
                    }, parse = function(messageObj) {
                        let name, message;
                        if ("[object String]" === {}.toString.call(messageObj)) {
                            var groups = ERROR_TYPES_RE.exec(messageObj);
                            groups && (name = groups[1], message = groups[2]);
                        }
                        return {
                            name: name,
                            message: message
                        };
                    }(messageObj);
                    stackTrace = {
                        name: parse.name,
                        message: parse.message,
                        stack: [ location ]
                    };
                }
                callback(stackTrace, isNullUndefinedDefaultValue(errorObj, messageObj));
            }));
        }(callback), _instrumentUnhandledRejection = function(callback) {
            return instrumentMethod(window, "onunhandledrejection", (function(params) {
                var reason = params.parameters[0].reason || "Empty reason", stack = computeStackTrace(reason);
                callback(stack, reason);
            }));
        }(callback);
        return {
            stop: function() {
                _instrumentOnError.stop(), _instrumentUnhandledRejection.stop();
            }
        };
    }
    var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
    function computeBytesCount(candidate) {
        return HAS_MULTI_BYTES_CHARACTERS.test(candidate) ? void 0 !== window.TextEncoder ? (new TextEncoder).encode(candidate).length : new Blob([ candidate ]).size : candidate.length;
    }
    function sanitize(source, maxCharacterCount) {
        void 0 === maxCharacterCount && (maxCharacterCount = 225280);
        var restoreObjectPrototypeToJson = detachToJsonMethod(Object.prototype), restoreArrayPrototypeToJson = detachToJsonMethod(Array.prototype), containerQueue = [], visitedObjectsWithPath = new WeakMap, sanitizedData = sanitizeProcessor(source, "$", void 0, containerQueue, visitedObjectsWithPath), accumulatedCharacterCount = JSON.stringify(sanitizedData) && JSON.stringify(sanitizedData).length || 0;
        if (!(accumulatedCharacterCount > maxCharacterCount)) {
            for (;containerQueue.length > 0 && accumulatedCharacterCount < maxCharacterCount; ) {
                var containerToProcess = containerQueue.shift(), separatorLength = 0;
                if (Array.isArray(containerToProcess.source)) for (var key = 0; key < containerToProcess.source.length; key++) {
                    if (accumulatedCharacterCount += void 0 !== (targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath)) ? JSON.stringify(targetData).length : 4, 
                    accumulatedCharacterCount += separatorLength, separatorLength = 1, accumulatedCharacterCount > maxCharacterCount) {
                        warnOverCharacterLimit(maxCharacterCount, "truncated", source);
                        break;
                    }
                    containerToProcess.target[key] = targetData;
                } else for (var key in containerToProcess.source) if (Object.prototype.hasOwnProperty.call(containerToProcess.source, key)) {
                    var targetData;
                    if (void 0 !== (targetData = sanitizeProcessor(containerToProcess.source[key], containerToProcess.path, key, containerQueue, visitedObjectsWithPath)) && (accumulatedCharacterCount += JSON.stringify(targetData).length + separatorLength + key.length + 3, 
                    separatorLength = 1), accumulatedCharacterCount > maxCharacterCount) {
                        warnOverCharacterLimit(maxCharacterCount, "truncated", source);
                        break;
                    }
                    containerToProcess.target[key] = targetData;
                }
            }
            return restoreObjectPrototypeToJson(), restoreArrayPrototypeToJson(), sanitizedData;
        }
        warnOverCharacterLimit(maxCharacterCount, "discarded", source);
    }
    function sanitizeProcessor(source, parentPath, key, queue, visitedObjectsWithPath) {
        var sourceToSanitize = function(value) {
            var object = value;
            if (object && "function" == typeof object.toJSON) try {
                return object.toJSON();
            } catch (_unused2) {}
            return value;
        }(source);
        if (!sourceToSanitize || "object" != typeof sourceToSanitize) return function(value) {
            if ("bigint" == typeof value) return "[BigInt] " + value.toString();
            if ("function" == typeof value) return "[Function] " + value.name || 0;
            if ("symbol" == typeof value) return "[Symbol] " + value.description || 0;
            return value;
        }(sourceToSanitize);
        var sanitizedSource = sanitizeObjects(sourceToSanitize);
        if ("[Object]" !== sanitizedSource && "[Array]" !== sanitizedSource && "[Error]" !== sanitizedSource) return sanitizedSource;
        var sourceAsObject = source;
        if (visitedObjectsWithPath.has(sourceAsObject)) return "[Reference seen at " + visitedObjectsWithPath.get(sourceAsObject) + "]";
        var currentPath = void 0 !== key ? parentPath + "." + key : parentPath, target = Array.isArray(sourceToSanitize) ? [] : {};
        return visitedObjectsWithPath.set(sourceAsObject, currentPath), queue.push({
            source: sourceToSanitize,
            target: target,
            path: currentPath
        }), target;
    }
    function sanitizeObjects(value) {
        try {
            if (value instanceof Event) return {
                type: (event = value).type,
                isTrusted: event.isTrusted,
                currentTarget: event.currentTarget ? sanitizeObjects(event.currentTarget) : null,
                target: event.target ? sanitizeObjects(event.target) : null
            };
            if (value instanceof RegExp) return "[RegExp] ".concat(value.toString());
            var match = Object.prototype.toString.call(value).match(/\[object (.*)\]/);
            if (match && match[1]) return "[" + match[1] + "]";
        } catch (_unused) {}
        var event;
        return "[Unserializable]";
    }
    function warnOverCharacterLimit(maxCharacterCount, changeType, source) {
        display.warn("The data provided has been " + changeType + " as it is over the limit of " + maxCharacterCount + " characters:", source);
    }
    var ErrorSource_AGENT = "agent", ErrorSource_CONSOLE = "console", ErrorSource_SOURCE = "source", ErrorSource_CUSTOM = "custom", ErrorSource_REPORT = "report";
    function computeRawError(data) {
        var stackTrace = data.stackTrace, originalError = data.originalError, handlingStack = data.handlingStack, startClocks = data.startClocks, nonErrorPrefix = data.nonErrorPrefix, source = data.source, handling = data.handling, useFallbackStack = void 0 === data.useFallbackStack || data.useFallbackStack, isErrorInstance = isError(originalError);
        return !stackTrace && isErrorInstance && (stackTrace = computeStackTrace(originalError)), 
        {
            startClocks: startClocks,
            source: source,
            handling: handling,
            originalError: originalError,
            message: function(stackTrace, isErrorInstance, nonErrorPrefix, originalError) {
                return stackTrace && stackTrace.message && stackTrace && stackTrace.name ? stackTrace.message : isErrorInstance ? "Empty message" : nonErrorPrefix + " " + jsonStringify_jsonStringify(sanitize(originalError));
            }(stackTrace, isErrorInstance, nonErrorPrefix, originalError),
            stack: stackTrace ? toStackTraceString(stackTrace) : useFallbackStack ? "No stack, consider using an instance of Error" : void 0,
            handlingStack: handlingStack,
            type: stackTrace ? stackTrace.name : void 0,
            causes: isErrorInstance ? flattenErrorCauses(originalError, source) : void 0
        };
    }
    function errorTools_createHandlingStack() {
        var formattedStack, error = new Error;
        if (!error.stack) try {
            throw error;
        } catch (e) {}
        return monitor_callMonitored((function() {
            var stackTrace = computeStackTrace(error);
            stackTrace.stack = stackTrace.stack.slice(2), formattedStack = toStackTraceString(stackTrace);
        })), formattedStack;
    }
    function toStackTraceString(stack) {
        var result = formatErrorMessage(stack);
        return tools_each(stack.stack, (function(frame) {
            var func = "?" === frame.func ? "<anonymous>" : frame.func, args = frame.args && frame.args.length > 0 ? "(" + frame.args.join(", ") + ")" : "", line = frame.line ? ":" + frame.line : "", column = frame.line && frame.column ? ":" + frame.column : "";
            result += "\n  at " + func + args + " @ " + frame.url + line + column;
        })), result;
    }
    function formatErrorMessage(stack) {
        return (stack.name || "Error") + ": " + stack.message;
    }
    function flattenErrorCauses(error, parentSource) {
        for (var currentError = error, causes = []; currentError && currentError.cause instanceof Error && causes.length < 10; ) {
            var stackTrace = computeStackTrace(currentError.cause);
            causes.push({
                message: currentError.cause.message,
                source: parentSource,
                type: stackTrace && stackTrace.name,
                stack: stackTrace && toStackTraceString(stackTrace)
            }), currentError = currentError.cause;
        }
        return causes.length ? causes : void 0;
    }
    function isError(error) {
        return error instanceof Error || "[object Error]" === Object.prototype.toString.call(error);
    }
    function instrumentMethod(targetPrototype, method, onPreCall, opts) {
        var computeHandlingStack = opts && opts.computeHandlingStack, original = targetPrototype[method];
        if ("function" != typeof original) {
            if (!startsWith(method, "on")) return {
                stop: tools_noop
            };
            original = tools_noop;
        }
        var stopped = !1, instrumentation = function() {
            if (stopped) return original.apply(this, arguments);
            var postCallCallback, parameters = tools_arrayFrom(arguments);
            monitor_callMonitored(onPreCall, null, [ {
                target: this,
                parameters: parameters,
                onPostCall: function(callback) {
                    postCallCallback = callback;
                },
                handlingStack: computeHandlingStack ? errorTools_createHandlingStack() : void 0
            } ]);
            var result = original.apply(this, parameters);
            return postCallCallback && monitor_callMonitored(postCallCallback, null, [ result ]), 
            result;
        };
        return targetPrototype[method] = instrumentation, {
            stop: function() {
                stopped = !0, targetPrototype[method] === instrumentation && (targetPrototype[method] = original);
            }
        };
    }
    var _Observable = function(onFirstSubscribe) {
        this.observers = [], this.onLastUnsubscribe = void 0, this.onFirstSubscribe = onFirstSubscribe;
    };
    _Observable.prototype = {
        subscribe: function(f) {
            this.observers.push(f), 1 === this.observers.length && this.onFirstSubscribe && (this.onLastUnsubscribe = this.onFirstSubscribe(this) || void 0);
            var _this = this;
            return {
                unsubscribe: function() {
                    _this.observers = filter(_this.observers, (function(other) {
                        return f !== other;
                    })), !_this.observers.length && _this.onLastUnsubscribe && _this.onLastUnsubscribe();
                }
            };
        },
        notify: function(data) {
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
            return consoleObservablesByApi[api] || (consoleObservablesByApi[api] = function(api) {
                return new Observable((function(observable) {
                    var originalConsoleApi = console[api];
                    return console[api] = function() {
                        var params = [].slice.call(arguments);
                        originalConsoleApi.apply(console, arguments);
                        var handlingStack = errorTools_createHandlingStack();
                        monitor_callMonitored((function() {
                            observable.notify(buildConsoleLog(params, api, handlingStack));
                        }));
                    }, function() {
                        console[api] = originalConsoleApi;
                    };
                }));
            }(api)), consoleObservablesByApi[api];
        }));
        return mergeObservables.apply(this, consoleObservables);
    }
    function buildConsoleLog(params, api, handlingStack) {
        var message = tools_map(params, (function(param) {
            return function(param) {
                if ("string" == typeof param) return sanitize(param);
                if (isError(param)) return formatErrorMessage(computeStackTrace(param));
                return jsonStringify_jsonStringify(sanitize(param), void 0, 2);
            }(param);
        })).join(" ");
        if (api === ConsoleApiName.error) {
            const rawError = computeRawError({
                originalError: find(params, isError),
                startClocks: clocksNow(),
                message: message,
                source: ErrorSource_CONSOLE,
                handling: ErrorHandling_HANDLED,
                handlingStack: handlingStack,
                nonErrorPrefix: NonErrorPrefix_PROVIDED,
                useFallbackStack: !1
            });
            return rawError.message = message, {
                api: api,
                message: message,
                error: rawError,
                handlingStack: handlingStack
            };
        }
        return {
            api: api,
            message: message,
            error: void 0,
            handlingStack: handlingStack
        };
    }
    function addEventListener(eventTarget, event, listener, options) {
        return addEventListeners(eventTarget, [ event ], listener, options);
    }
    function addEventListeners(eventTarget, eventNames, listener, options) {
        var wrappedListener = monitor(options && options.once ? function(event) {
            stop(), listener(event);
        } : listener);
        options = options && options.passive ? {
            capture: options.capture,
            passive: options.passive
        } : options && options.capture, tools_each(eventNames, (function(eventName) {
            withOriginalOrZoneJsPatchedMethod(eventTarget, "addEventListener", (method => method.call(eventTarget, eventName, wrappedListener, options)));
        }));
        var stop = function() {
            tools_each(eventNames, (function(eventName) {
                withOriginalOrZoneJsPatchedMethod(eventTarget, "removeEventListener", (method => method.call(eventTarget, eventName, wrappedListener, options)));
            }));
        };
        return {
            stop: stop
        };
    }
    function withOriginalOrZoneJsPatchedMethod(eventTarget, methodName, cb) {
        const originalMethod = getZoneJsOriginalValue(window.EventTarget && eventTarget instanceof EventTarget ? window.EventTarget.prototype : eventTarget, methodName);
        try {
            cb(originalMethod);
        } catch (error) {
            if (function(error, methodName) {
                return error instanceof Error && (error.message.includes("Illegal invocation") || error.message.includes("'".concat(methodName, "' called on an object that does not implement interface EventTarget.")) || error.message.includes("Can only call EventTarget.".concat(methodName, " on instances of EventTarget")));
            }(error, methodName)) return cb(eventTarget[methodName]);
            throw error;
        }
    }
    var RawReportType_intervention = "intervention", RawReportType_cspViolation = "csp_violation";
    function initReportObservable(configuration, apis) {
        var observables = [];
        includes(apis, RawReportType_cspViolation) && observables.push(new Observable((function(observable) {
            return addEventListener(document, DOM_EVENT_SECURITY_POLICY_VIOLATION, (function(event) {
                observable.notify(function(event) {
                    var message = "'" + event.blockedURI + "' blocked by '" + event.effectiveDirective + "' directive";
                    return buildRawReportError({
                        type: event.effectiveDirective,
                        message: RawReportType_cspViolation + ": " + message,
                        originalError: event,
                        csp: {
                            disposition: event.disposition
                        },
                        stack: buildStack(event.effectiveDirective, event.originalPolicy ? "".concat(message, ' of the policy "').concat(safeTruncate(event.originalPolicy, 100), '"') : "no policy", event.sourceFile, event.lineNumber, event.columnNumber)
                    });
                }(event));
            })).stop;
        })));
        var reportTypes = filter(apis, (function(api) {
            return api !== RawReportType_cspViolation;
        }));
        return reportTypes.length && observables.push(function(reportTypes) {
            return new Observable((function(observable) {
                if (window.ReportingObserver) {
                    var handleReports = monitor((function(reports) {
                        tools_each(reports, (function(report) {
                            observable.notify(function(report) {
                                var body = report.body, type = report.type;
                                return buildRawReportError({
                                    type: body.id,
                                    message: type + ": " + body.message,
                                    originalError: report,
                                    stack: buildStack(body.id, body.message, body.sourceFile, body.lineNumber, body.columnNumber)
                                });
                            }(report));
                        }));
                    })), observer = new window.ReportingObserver(handleReports, {
                        types: reportTypes,
                        buffered: !0
                    });
                    return observer.observe(), function() {
                        observer.disconnect();
                    };
                }
            }));
        }(reportTypes)), mergeObservables.apply(this, observables);
    }
    function buildRawReportError(partial) {
        return tools_assign({
            startClocks: clocksNow(),
            source: ErrorSource_REPORT,
            handling: ErrorHandling_UNHANDLED
        }, partial);
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
    var isURLSupported, LifeCycleEventType_AUTO_ACTION_COMPLETED = "AUTO_ACTION_COMPLETED", LifeCycleEventType_BEFORE_VIEW_CREATED = "BEFORE_VIEW_CREATED", LifeCycleEventType_VIEW_CREATED = "VIEW_CREATED", LifeCycleEventType_VIEW_UPDATED = "VIEW_UPDATED", LifeCycleEventType_BEFORE_VIEW_UPDATED = "BEFORE_VIEW_UPDATED", LifeCycleEventType_VIEW_ENDED = "VIEW_ENDED", LifeCycleEventType_AFTER_VIEW_ENDED = "AFTER_VIEW_ENDED", LifeCycleEventType_SESSION_RENEWED = "SESSION_RENEWED", LifeCycleEventType_SESSION_FORCED = "SESSION_FORCED", LifeCycleEventType_SESSION_EXPIRED = "SESSION_EXPIRED", LifeCycleEventType_PAGE_EXITED = "PAGE_EXITED", LifeCycleEventType_REQUEST_STARTED = "REQUEST_STARTED", LifeCycleEventType_REQUEST_COMPLETED = "REQUEST_COMPLETED", LifeCycleEventType_RAW_RUM_EVENT_COLLECTED = "RAW_RUM_EVENT_COLLECTED", LifeCycleEventType_RUM_EVENT_COLLECTED = "RUM_EVENT_COLLECTED", LifeCycleEventType_RUM_VIEW_FIRST_COLLECTED = "RUM_VIEW_FIRST_COLLECTED", LifeCycleEventType_RUM_VIEW_FORCED_COLLECTED = "RUM_VIEW_FORCED_COLLECTED", LifeCycleEventType_RAW_ERROR_COLLECTED = "RAW_ERROR_COLLECTED";
    function LifeCycle() {
        this.callbacks = {};
    }
    function limitModification(object, modifiableFieldPaths, modifier) {
        const clone = deepClone(object), result = modifier(clone);
        return objectEntries(modifiableFieldPaths).forEach((function(fieldEntry) {
            setValueAtPath(object, clone, fieldEntry[0].split(/\.|(?=\[\])/), fieldEntry[1]);
        })), result;
    }
    function setValueAtPath(object, clone, pathSegments, fieldType) {
        const field = pathSegments[0], restPathSegments = pathSegments.slice(1);
        if ("[]" !== field) {
            if (isValidObject(object) && isValidObject(clone)) return restPathSegments.length > 0 ? setValueAtPath(object[field], clone[field], restPathSegments, fieldType) : void function(object, field, value, fieldType) {
                const newType = tools_getType(value);
                newType === fieldType ? object[field] = sanitize(value) : "object" !== fieldType || "undefined" !== newType && "null" !== newType || (object[field] = {});
            }(object, field, clone[field], fieldType);
        } else Array.isArray(object) && Array.isArray(clone) && object.forEach(((item, i) => setValueAtPath(item, clone[i], restPathSegments, fieldType)));
    }
    function isValidObject(object) {
        return "object" === tools_getType(object);
    }
    function createEventRateLimiter(eventType, limit, onLimitReached) {
        var eventCount = 0, allowNextEvent = !1;
        return {
            isLimitReached: function() {
                if (0 === eventCount && timer_setTimeout((function() {
                    eventCount = 0;
                }), 6e4), (eventCount += 1) <= limit || allowNextEvent) return allowNextEvent = !1, 
                !1;
                if (eventCount === limit + 1) {
                    allowNextEvent = !0;
                    try {
                        onLimitReached({
                            message: "Reached max number of " + eventType + "s by minute: " + limit,
                            source: ErrorSource_AGENT,
                            startClocks: clocksNow()
                        });
                    } finally {
                        allowNextEvent = !1;
                    }
                }
                return !0;
            }
        };
    }
    function normalizeUrl(url) {
        return buildUrl(url, function(element) {
            if (element.origin && "null" !== element.origin) return element.origin;
            var sanitizedHost = element.host.replace(/(:80|:443)$/, "");
            return element.protocol + "//" + sanitizedHost;
        }(window.location)).href;
    }
    function buildUrl(url, base) {
        if (function() {
            if (void 0 !== isURLSupported) return isURLSupported;
            try {
                var url = new URL("http://test/path");
                return isURLSupported = "http://test/path" === url.href;
            } catch (e) {
                isURLSupported = !1;
            }
            return isURLSupported;
        }()) return void 0 !== base ? new URL(url, base) : new URL(url);
        if (void 0 === base && !/:/.test(url)) throw new Error("Invalid URL: " + url);
        var doc = document, anchorElement = doc.createElement("a");
        if (void 0 !== base) {
            var baseElement = (doc = document.implementation.createHTMLDocument("")).createElement("base");
            baseElement.href = base, doc.head.appendChild(baseElement), doc.body.appendChild(anchorElement);
        }
        return anchorElement.href = url, anchorElement;
    }
    function requestIdleCallback(callback, opts) {
        if (window.requestIdleCallback && window.cancelIdleCallback) {
            const id = window.requestIdleCallback(monitor(callback), opts);
            return function() {
                return window.cancelIdleCallback(id);
            };
        }
        return function(callback) {
            const start = dateNow(), timeoutId = timer_setTimeout((function() {
                callback({
                    didTimeout: !1,
                    timeRemaining: function() {
                        return Math.max(0, 50 - (dateNow() - start));
                    }
                });
            }), 0);
            return function() {
                return timer_clearTimeout(timeoutId);
            };
        }(callback);
    }
    LifeCycle.prototype = {
        notify: function(eventType, data) {
            var eventCallbacks = this.callbacks[eventType];
            eventCallbacks && tools_each(eventCallbacks, (function(callback) {
                callback(data);
            }));
        },
        subscribe: function(eventType, callback) {
            this.callbacks[eventType] || (this.callbacks[eventType] = []), this.callbacks[eventType].push(callback);
            var _this = this;
            return {
                unsubscribe: function() {
                    _this.callbacks[eventType] = filter(_this.callbacks[eventType], (function(other) {
                        return other !== callback;
                    }));
                }
            };
        }
    };
    var getCurrentSiteCache, TRIM_REGIX = /^\s+|\s+$/g, typeMap = {
        rum: "/rum",
        log: "/logging",
        sessionReplay: "/rum/replay"
    };
    function getEndPointUrl(configuration, type) {
        var subUrl = typeMap[type];
        if (!subUrl) return "";
        var url = configuration.datakitOrigin || configuration.datakitUrl || configuration.site;
        0 === url.indexOf("/") && (url = location.origin + trim(url));
        var endpoint = url;
        return endpoint = url.lastIndexOf("/") === url.length - 1 ? trim(url) + "v1/write" + subUrl : trim(url) + "/v1/write" + subUrl, 
        configuration.site && configuration.clientToken && (endpoint = endpoint + "?token=" + configuration.clientToken + "&to_headless=true"), 
        endpoint;
    }
    function trim(str) {
        return str.replace(TRIM_REGIX, "");
    }
    function getCookieName(name, options) {
        return "".concat(name, "_").concat(options && options.crossSite ? "cs1" : "cs0", "_").concat(options && options.domain ? "d1" : "d0", "_").concat(options && options.secure ? "sec1" : "sec0", "_").concat(options && options.partitioned ? "part1" : "part0");
    }
    function setCookie(name, value, expireDelay, options) {
        var date = new Date;
        date.setTime(date.getTime() + expireDelay);
        var expires = "expires=" + date.toUTCString(), sameSite = options && options.crossSite ? "none" : "strict", domain = options && options.domain ? ";domain=" + options.domain : "", secure = options && options.secure ? ";secure" : "", partitioned = options && options.partitioned ? ";partitioned" : "";
        document.cookie = getCookieName(name, options) + "=" + value + ";" + expires + ";path=/;samesite=" + sameSite + domain + secure + partitioned;
    }
    function cookie_getCookie(name, options) {
        return function(rawString, name) {
            for (COMMA_SEPARATED_KEY_VALUE.lastIndex = 0; ;) {
                var match = COMMA_SEPARATED_KEY_VALUE.exec(rawString);
                if (!match) break;
                if (match[1] === name) return match[2];
            }
        }(document.cookie, getCookieName(name, options));
    }
    function deleteCookie(name, options) {
        setCookie(name, "", 0, options);
    }
    const SessionPersistence_COOKIE = "cookie", SessionPersistence_LOCAL_STORAGE = "local-storage", SESSION_ENTRY_REGEXP = /^([a-zA-Z]+)=([a-z0-9-]+)$/;
    function isSessionInNotStartedState(session) {
        return isEmptyObject(session);
    }
    function isSessionInExpiredState(session) {
        return void 0 !== session.isExpired || !isActiveSession(session);
    }
    function getSessionExpirationTime(sessionState) {
        if (void 0 !== sessionState.isExpired || isActiveSession(sessionState)) return;
        const sessionTimeOutTime = void 0 === sessionState.created ? 1 / 0 : Number(sessionState.created) + 144e5, inactivityExpirationTime = void 0 === sessionState.expire ? 1 / 0 : Number(sessionState.expire), sessionExpirationTime = Math.min(sessionTimeOutTime, inactivityExpirationTime);
        return isNumber(sessionExpirationTime) ? sessionExpirationTime : void 0;
    }
    function isActiveSession(sessionState) {
        return (void 0 === sessionState.created || dateNow() - Number(sessionState.created) < 144e5) && (void 0 === sessionState.expire || dateNow() < Number(sessionState.expire));
    }
    function expandSessionState(session) {
        session.expire = String(dateNow() + 9e5);
    }
    function toSessionString(session) {
        return tools_map(objectEntries(session), (function(item) {
            return item[0] + "=" + item[1];
        })).join("&");
    }
    function toSessionState(sessionString) {
        const session = {};
        return function(sessionString) {
            return !!sessionString && (-1 !== sessionString.indexOf("&") || SESSION_ENTRY_REGEXP.test(sessionString));
        }(sessionString) && sessionString.split("&").forEach((function(entry) {
            const matches = SESSION_ENTRY_REGEXP.exec(entry);
            if (null !== matches) {
                const key = matches[1], value = matches[2];
                session[key] = value;
            }
        })), session;
    }
    function selectCookieStrategy(initConfiguration) {
        const cookieOptions = function(initConfiguration) {
            const cookieOptions = {};
            cookieOptions.secure = !!initConfiguration.useSecureSessionCookie || !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie, 
            cookieOptions.crossSite = !!initConfiguration.usePartitionedCrossSiteSessionCookie || !!initConfiguration.useCrossSiteSessionCookie, 
            cookieOptions.partitioned = !!initConfiguration.usePartitionedCrossSiteSessionCookie, 
            initConfiguration.trackSessionAcrossSubdomains && (cookieOptions.domain = function() {
                if (void 0 === getCurrentSiteCache) {
                    const testCookieName = "gc_site_test_".concat(tools_UUID()), testCookieValue = "test", domainLevels = window.location.hostname.split(".");
                    let candidateDomain = domainLevels.pop();
                    for (;domainLevels.length && !cookie_getCookie(testCookieName, {
                        domain: candidateDomain
                    }); ) candidateDomain = "".concat(domainLevels.pop(), ".").concat(candidateDomain), 
                    setCookie(testCookieName, testCookieValue, 1e3, {
                        domain: candidateDomain
                    });
                    deleteCookie(testCookieName, {
                        domain: candidateDomain
                    }), getCurrentSiteCache = candidateDomain;
                }
                return getCurrentSiteCache;
            }());
            return cookieOptions;
        }(initConfiguration);
        return function(options) {
            if (void 0 === document.cookie || null === document.cookie) return !1;
            try {
                var testCookieName = "gc_cookie_test_".concat(tools_UUID());
                setCookie(testCookieName, "test", 6e4, options);
                const isCookieCorrectlySet = "test" === cookie_getCookie(testCookieName, options);
                return deleteCookie(testCookieName, options), isCookieCorrectlySet;
            } catch (error) {
                return !1;
            }
        }(cookieOptions) ? {
            type: SessionPersistence_COOKIE,
            cookieOptions: cookieOptions
        } : void 0;
    }
    function initCookieStrategy(cookieOptions) {
        var options;
        return {
            isLockEnabled: detectBrowserCached() === Browser_CHROMIUM,
            persistSession: (options = cookieOptions, function(session) {
                setCookie("_gc_s", toSessionString(session), 9e5, options);
            }),
            retrieveSession: retrieveSessionCookie(cookieOptions),
            expireSession: function() {
                return function(options) {
                    setCookie("_gc_s", toSessionString({
                        isExpired: "1"
                    }), 144e5, options);
                }(cookieOptions);
            }
        };
    }
    function retrieveSessionCookie(options) {
        return function() {
            return toSessionState(cookie_getCookie("_gc_s", options));
        };
    }
    function selectLocalStorageStrategy() {
        try {
            const id = tools_UUID(), testKey = "".concat("_gc_test_").concat(id);
            localStorage.setItem(testKey, id);
            const retrievedId = localStorage.getItem(testKey);
            return localStorage.removeItem(testKey), id === retrievedId ? {
                type: SessionPersistence_LOCAL_STORAGE
            } : void 0;
        } catch (e) {
            return;
        }
    }
    function persistInLocalStorage(sessionState) {
        localStorage.setItem("_gc_s", toSessionString(sessionState));
    }
    function retrieveSessionFromLocalStorage() {
        return toSessionState(localStorage.getItem("_gc_s"));
    }
    function expireSessionFromLocalStorage() {
        persistInLocalStorage({
            isExpired: "1"
        });
    }
    const bufferedOperations = [];
    let ongoingOperations;
    function processSessionStoreOperations(operations, sessionStoreStrategy) {
        let numberOfRetries = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        const isLockEnabled = sessionStoreStrategy.isLockEnabled, persistSession = sessionStoreStrategy.persistSession, expireSession = sessionStoreStrategy.expireSession, persistWithLock = function(session) {
            return persistSession(tools_assign({}, session, {
                lock: currentLock
            }));
        }, retrieveStore = function() {
            const storedSession = sessionStoreStrategy.retrieveSession(), lock = storedSession.lock, session = tools_assign({}, storedSession);
            return delete session.lock, {
                session: session,
                lock: lock && !isLockExpired(lock) ? lock : void 0
            };
        };
        if (ongoingOperations || (ongoingOperations = operations), operations !== ongoingOperations) return void bufferedOperations.push(operations);
        if (isLockEnabled && numberOfRetries >= 100) return void next(sessionStoreStrategy);
        let currentLock, currentStore = retrieveStore();
        if (isLockEnabled) {
            if (currentStore.lock) return void retryLater(operations, sessionStoreStrategy, numberOfRetries);
            if (currentLock = createLock(), persistWithLock(currentStore.session), currentStore = retrieveStore(), 
            currentStore.lock !== currentLock) return void retryLater(operations, sessionStoreStrategy, numberOfRetries);
        }
        let processedSession = operations.process(currentStore.session);
        if (isLockEnabled && (currentStore = retrieveStore(), currentStore.lock !== currentLock)) retryLater(operations, sessionStoreStrategy, numberOfRetries); else {
            if (processedSession && (isSessionInExpiredState(processedSession) ? expireSession() : (expandSessionState(processedSession), 
            isLockEnabled ? persistWithLock(processedSession) : persistSession(processedSession))), 
            isLockEnabled && (!processedSession || !isSessionInExpiredState(processedSession))) {
                if (currentStore = retrieveStore(), currentStore.lock !== currentLock) return void retryLater(operations, sessionStoreStrategy, numberOfRetries);
                persistSession(currentStore.session), processedSession = currentStore.session;
            }
            operations.after && operations.after(processedSession || currentStore.session), 
            next(sessionStoreStrategy);
        }
    }
    function retryLater(operations, sessionStore, currentNumberOfRetries) {
        timer_setTimeout((function() {
            processSessionStoreOperations(operations, sessionStore, currentNumberOfRetries + 1);
        }), 10);
    }
    function next(sessionStore) {
        ongoingOperations = void 0;
        const nextOperations = bufferedOperations.shift();
        nextOperations && processSessionStoreOperations(nextOperations, sessionStore);
    }
    function createLock() {
        return tools_UUID() + "--" + timeStampNow();
    }
    function isLockExpired(lock) {
        const timeStamp = lock.split("--")[1];
        return !timeStamp || tools_elapsed(Number(timeStamp), timeStampNow()) > 1e3;
    }
    function selectSessionStoreStrategyType(initConfiguration) {
        switch (initConfiguration.sessionPersistence) {
          case SessionPersistence_COOKIE:
            return selectCookieStrategy(initConfiguration);

          case SessionPersistence_LOCAL_STORAGE:
            return selectLocalStorageStrategy();

          case void 0:
            {
                let sessionStoreStrategyType = selectCookieStrategy(initConfiguration);
                return !sessionStoreStrategyType && initConfiguration.allowFallbackToLocalStorage && (sessionStoreStrategyType = selectLocalStorageStrategy()), 
                sessionStoreStrategyType;
            }

          default:
            display.error("Invalid session persistence '".concat(String(initConfiguration.sessionPersistence), "'"));
        }
    }
    function startSessionStore(sessionStoreStrategyType, productKey, computeSessionState) {
        const renewObservable = new Observable, expireObservable = new Observable, sessionStateUpdateObservable = new Observable, sessionStoreStrategy = sessionStoreStrategyType.type === SessionPersistence_COOKIE ? initCookieStrategy(sessionStoreStrategyType.cookieOptions) : {
            isLockEnabled: !1,
            persistSession: persistInLocalStorage,
            retrieveSession: retrieveSessionFromLocalStorage,
            expireSession: expireSessionFromLocalStorage
        }, expireSession = sessionStoreStrategy.expireSession, watchSessionTimeoutId = timer_setInterval((function() {
            processSessionStoreOperations({
                process: function(sessionState) {
                    return isSessionInExpiredState(sessionState) ? {
                        isExpired: "1"
                    } : void 0;
                },
                after: synchronizeSession
            }, sessionStoreStrategy);
        }), 1e3);
        let sessionCache;
        startSession();
        const _throttle = throttle((function() {
            processSessionStoreOperations({
                process: function(sessionState) {
                    if (isSessionInNotStartedState(sessionState)) return;
                    const synchronizedSession = synchronizeSession(sessionState);
                    return expandOrRenewSessionState(synchronizedSession), synchronizedSession;
                },
                after: function(sessionState) {
                    isSessionInNotStartedState(sessionState) || hasSessionInCache() || renewSessionInCache(sessionState), 
                    sessionCache = sessionState;
                }
            }, sessionStoreStrategy);
        }), 1e3), throttledExpandOrRenewSession = _throttle.throttled, cancelExpandOrRenewSession = _throttle.cancel;
        function synchronizeSession(sessionState) {
            const storedSessionExpirationTime = getSessionExpirationTime(sessionState);
            return isSessionInExpiredState(sessionState) && (sessionState = {
                isExpired: "1"
            }), hasSessionInCache() && (isSessionInCacheOutdated(sessionState) ? expireSessionInCache(void 0 === storedSessionExpirationTime ? getSessionExpirationTime(sessionCache) : storedSessionExpirationTime) : (sessionStateUpdateObservable.notify({
                previousState: sessionCache,
                newState: sessionState
            }), sessionCache = sessionState)), sessionState;
        }
        function startSession() {
            processSessionStoreOperations({
                process: function(sessionState) {
                    if (isSessionInNotStartedState(sessionState) || isSessionInExpiredState(sessionState)) return {
                        isExpired: "1"
                    };
                },
                after: function(sessionState) {
                    sessionCache = sessionState;
                }
            }, sessionStoreStrategy);
        }
        function expandOrRenewSessionState(sessionState, options) {
            if (isSessionInNotStartedState(sessionState)) return !1;
            const _computeSessionState = computeSessionState(sessionState[productKey]), trackingType = _computeSessionState.trackingType, isTracked = _computeSessionState.isTracked;
            sessionState[productKey] = trackingType, delete sessionState.isExpired, (isTracked || options && options.force) && !sessionState.id && (sessionState.id = tools_UUID(), 
            sessionState.created = String(dateNow())), options && options.force && (sessionState.forcedSession = "1");
        }
        function hasSessionInCache() {
            return void 0 !== sessionCache[productKey];
        }
        function isSessionInCacheOutdated(sessionState) {
            return sessionCache.id !== sessionState.id || sessionCache[productKey] !== sessionState[productKey];
        }
        function expireSessionInCache(sessionExpirationTime) {
            sessionCache = {
                isExpired: "1"
            }, expireObservable.notify(sessionExpirationTime);
        }
        function renewSessionInCache(sessionState) {
            sessionCache = sessionState, renewObservable.notify();
        }
        return {
            expandOrRenewSession: throttledExpandOrRenewSession,
            expandSession: function() {
                processSessionStoreOperations({
                    process: function(sessionState) {
                        return hasSessionInCache() ? synchronizeSession(sessionState) : void 0;
                    }
                }, sessionStoreStrategy);
            },
            getSession: function() {
                return sessionCache;
            },
            renewObservable: renewObservable,
            expireObservable: expireObservable,
            sessionStateUpdateObservable: sessionStateUpdateObservable,
            restartSession: startSession,
            renewSession: function() {
                cancelExpandOrRenewSession(), processSessionStoreOperations({
                    process: function() {
                        const sessionState = {
                            isExpired: "1"
                        };
                        return expandOrRenewSessionState(sessionState), sessionState;
                    },
                    after: function(sessionState) {
                        hasSessionInCache() && expireSessionInCache(), sessionCache = sessionState, renewObservable.notify();
                    }
                }, sessionStoreStrategy);
            },
            forceSession: function(onComplete) {
                let shouldRenew, sessionExpirationTime;
                cancelExpandOrRenewSession(), processSessionStoreOperations({
                    process: function(sessionState) {
                        sessionExpirationTime = getSessionExpirationTime(sessionState);
                        const isInactive = isSessionInNotStartedState(sessionState) || isSessionInExpiredState(sessionState);
                        return shouldRenew = isInactive || hasSessionInCache() && isSessionInCacheOutdated(sessionState), 
                        isInactive && (sessionState = {
                            isExpired: "1"
                        }), expandOrRenewSessionState(sessionState, {
                            force: !0
                        }), sessionState;
                    },
                    after: function(sessionState) {
                        let previousState;
                        !shouldRenew && hasSessionInCache() ? (previousState = sessionCache, sessionCache = sessionState, 
                        sessionStateUpdateObservable.notify({
                            previousState: previousState,
                            newState: sessionState
                        })) : (hasSessionInCache() && expireSessionInCache(void 0 === sessionExpirationTime ? getSessionExpirationTime(sessionCache) : sessionExpirationTime), 
                        renewSessionInCache(sessionState)), onComplete && onComplete(previousState);
                    }
                }, sessionStoreStrategy);
            },
            expire: function() {
                cancelExpandOrRenewSession(), expireSession(), synchronizeSession({
                    isExpired: "1"
                });
            },
            stop: function() {
                timer_clearInterval(watchSessionTimeoutId);
            },
            updateSessionState: function(partialSessionState) {
                processSessionStoreOperations({
                    process: function(sessionState) {
                        return tools_assign({}, sessionState, partialSessionState);
                    },
                    after: synchronizeSession
                }, sessionStoreStrategy);
            }
        };
    }
    var fetchObservable, xhrObservable, DefaultPrivacyLevel = {
        ALLOW: "allow",
        MASK: "mask",
        MASK_USER_INPUT: "mask-user-input"
    };
    function validateAndBuildConfiguration(initConfiguration) {
        if (void 0 === initConfiguration.sampleRate || isPercentage(initConfiguration.sampleRate)) if (void 0 === initConfiguration.sessionSampleRate || isPercentage(initConfiguration.sessionSampleRate)) {
            if (void 0 === initConfiguration.telemetrySampleRate || isPercentage(initConfiguration.telemetrySampleRate)) {
                var sessionSampleRate = isNullUndefinedDefaultValue(initConfiguration.sessionSampleRate, initConfiguration.sampleRate);
                return tools_assign({
                    beforeSend: initConfiguration.beforeSend && catchUserErrors_catchUserErrors(initConfiguration.beforeSend, "beforeSend threw an error:"),
                    sessionStoreStrategyType: selectSessionStoreStrategyType(initConfiguration),
                    isOpenWay: initConfiguration.site && initConfiguration.clientToken,
                    sessionSampleRate: isNullUndefinedDefaultValue(sessionSampleRate, 100),
                    service: initConfiguration.service,
                    version: initConfiguration.version,
                    env: initConfiguration.env,
                    telemetrySampleRate: isNullUndefinedDefaultValue(initConfiguration.telemetrySampleRate, 100),
                    telemetryEnabled: isNullUndefinedDefaultValue(initConfiguration.telemetryEnabled, !1),
                    silentMultipleInit: !!initConfiguration.silentMultipleInit,
                    batchBytesLimit: 16384,
                    eventRateLimiterThreshold: 3e3,
                    maxTelemetryEventsPerPage: 15,
                    flushTimeout: 3e4,
                    batchMessagesLimit: 50,
                    messageBytesLimit: 262144,
                    resourceUrlLimit: 5120,
                    storeContextsToLocal: !!initConfiguration.storeContextsToLocal,
                    storeContextsKey: initConfiguration.storeContextsKey,
                    sendContentTypeByJson: !!initConfiguration.sendContentTypeByJson,
                    retryMaxSize: isNullUndefinedDefaultValue(initConfiguration.retryMaxSize, -1)
                }, function(initConfiguration) {
                    var isIntakeUrl = function(url) {
                        return !1;
                    };
                    "isIntakeUrl" in initConfiguration && isArray(initConfiguration.isIntakeUrl) ? isIntakeUrl = function(url) {
                        return some(initConfiguration.isIntakeUrl, (function(takeUrl) {
                            return 0 === url.indexOf(takeUrl);
                        }));
                    } : "isIntakeUrl" in initConfiguration && isFunction(initConfiguration.isIntakeUrl) && isBoolean(initConfiguration.isIntakeUrl()) && (isIntakeUrl = initConfiguration.isIntakeUrl);
                    var isServerError = function(request) {
                        return !1;
                    };
                    return "isServerError" in initConfiguration && isFunction(initConfiguration.isServerError) && isBoolean(initConfiguration.isServerError()) && (isServerError = initConfiguration.isServerError), 
                    {
                        rumEndpoint: getEndPointUrl(initConfiguration, "rum"),
                        logsEndpoint: getEndPointUrl(initConfiguration, "log"),
                        sessionReplayEndPoint: getEndPointUrl(initConfiguration, "sessionReplay"),
                        isIntakeUrl: isIntakeUrl,
                        isServerError: isServerError
                    };
                }(initConfiguration));
            }
            display.error("Telemetry Sample Rate should be a number between 0 and 100");
        } else display.error("Sample Rate should be a number between 0 and 100"); else display.error("Sample Rate should be a number between 0 and 100");
    }
    function isRequest(input) {
        if ("undefined" == typeof Request || !input || "object" != typeof input) return !1;
        if (input instanceof Request) return !0;
        try {
            return Object.getOwnPropertyDescriptor(Request.prototype, "url").get.call(input), 
            !0;
        } catch (error) {
            return !1;
        }
    }
    function initFetchObservable() {
        return fetchObservable || (fetchObservable = new Observable((function(observable) {
            if (window.fetch) return instrumentMethod(window, "fetch", (function(call) {
                return function(params, observable) {
                    var parameters = params.parameters, onPostCall = params.onPostCall, handlingStack = params.handlingStack, input = parameters[0], init = parameters[1], requestInput = isRequest(input), methodFromParams = init && init.method;
                    void 0 === methodFromParams && requestInput && (methodFromParams = input.method);
                    var method = void 0 !== methodFromParams ? String(methodFromParams).toUpperCase() : "GET", url = requestInput ? input.url : normalizeUrl(String(input)), startClocks = clocksNow(), context = {
                        state: "start",
                        init: init,
                        input: input,
                        method: method,
                        startClocks: startClocks,
                        url: url,
                        handlingStack: handlingStack
                    };
                    observable.notify(context), parameters[0] = context.input, parameters[1] = context.init, 
                    onPostCall((function(responsePromise) {
                        return function(observable, responsePromise, startContext) {
                            var context = startContext, reportFetch = function(partialContext) {
                                context.state = "resolve", tools_assign(context, partialContext), observable.notify(context);
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
                                    isAborted: !1
                                });
                            })), monitor((function(error) {
                                reportFetch({
                                    status: 0,
                                    isAborted: context.init && context.init.signal && context.init.signal.aborted || error instanceof DOMException && error.code === DOMException.ABORT_ERR,
                                    error: error
                                });
                            })));
                        }(observable, responsePromise, context);
                    }));
                }(call, observable);
            }), {
                computeHandlingStack: !0
            }).stop;
        }))), fetchObservable;
    }
    var xhrContexts = new WeakMap;
    function initXhrObservable() {
        return xhrObservable || (xhrObservable = new Observable((function(observable) {
            var openInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "open", openXhr), sendInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "send", (function(call) {
                !function(params, observable) {
                    var xhr = params.target, handlingStack = params.handlingStack, context = xhrContexts.get(xhr);
                    if (context) {
                        var startContext = context;
                        startContext.state = "start", startContext.startClocks = clocksNow(), startContext.isAborted = !1, 
                        startContext.xhr = xhr, startContext.handlingStack = handlingStack;
                        var hasBeenReported = !1, stopInstrumentingOnReadyStateChange = instrumentMethod(xhr, "onreadystatechange", (function() {
                            xhr.readyState === XMLHttpRequest.DONE && onEnd();
                        })).stop, onEnd = function() {
                            if (unsubscribeLoadEndListener(), stopInstrumentingOnReadyStateChange(), !hasBeenReported) {
                                hasBeenReported = !0;
                                var completeContext = context;
                                completeContext.state = "complete", completeContext.duration = tools_elapsed(startContext.startClocks.timeStamp, timeStampNow()), 
                                completeContext.status = xhr.status, observable.notify(shallowClone(completeContext));
                            }
                        }, unsubscribeLoadEndListener = addEventListener(xhr, "loadend", onEnd).stop;
                        observable.notify(startContext);
                    }
                }(call, observable);
            }), {
                computeHandlingStack: !0
            }), setRequestHeaderInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "setRequestHeader", setRequestHeaderXhr), abortInstrumentMethod = instrumentMethod(XMLHttpRequest.prototype, "abort", abortXhr);
            return function() {
                openInstrumentMethod.stop(), sendInstrumentMethod.stop(), abortInstrumentMethod.stop(), 
                setRequestHeaderInstrumentMethod.stop();
            };
        }))), xhrObservable;
    }
    function openXhr(params) {
        var xhr = params.target, method = params.parameters[0], url = params.parameters[1];
        xhrContexts.set(xhr, {
            state: "open",
            method: String(method).toUpperCase(),
            url: normalizeUrl(String(url))
        });
    }
    function setRequestHeaderXhr(params) {
        var xhr = params.target, headerKey = params.parameters[0], headerValue = params.parameters[1], context = xhrContexts.get(xhr);
        if (context && headerKey) {
            var requestHeaderContexts = context.requestHeaderContexts || {};
            requestHeaderContexts[headerKey] = headerValue, context.requestHeaderContexts = requestHeaderContexts;
        }
    }
    function abortXhr(params) {
        var xhr = params.target, context = xhrContexts.get(xhr);
        context && (context.isAborted = !0);
    }
    var PageExitReason = {
        HIDDEN: "visibility_hidden",
        UNLOADING: "before_unload",
        PAGEHIDE: "page_hide",
        FROZEN: "page_frozen"
    };
    function isElementNode(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }
    function isNodeShadowRoot(node) {
        var shadowRoot = node;
        return !!shadowRoot.host && shadowRoot.nodeType === Node.DOCUMENT_FRAGMENT_NODE && isElementNode(shadowRoot.host);
    }
    function runOnReadyState(expectedReadyState, callback) {
        return document.readyState === expectedReadyState || "complete" === document.readyState ? (callback(), 
        {
            stop: tools_noop
        }) : addEventListener(window, "complete" === expectedReadyState ? DOM_EVENT_LOAD : DOM_EVENT_DOM_CONTENT_LOADED, callback, {
            once: !0
        });
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
        session_is_forced: "session.is_forced_session",
        session_sampling: "session.is_sampling",
        is_signin: "user.is_signin",
        os: "device.os",
        os_version: "device.os_version",
        os_version_major: "device.os_version_major",
        browser: "device.browser",
        browser_version: "device.browser_version",
        browser_version_major: "device.browser_version_major",
        b2owser: "device.b2owser",
        b2owser_version: "device.b2owser_version",
        b2owser_version_major: "device.b2owser_version_major",
        webview: "webview.webview",
        webview_version: "webview.webview_version",
        webview_version_major: "webview.webview_version_major",
        screen_size: "device.screen_size",
        network_type: "device.network_type",
        time_zone: "device.time_zone",
        device: "device.device",
        device_vendor: "device.device_vendor",
        device_model: "device.device_model",
        user_agent: "device.user_agent",
        view_id: "view.id",
        view_referrer: "view.referrer",
        view_url: "view.url",
        view_host: "view.host",
        view_path: "view.path",
        view_name: "view.name",
        view_path_group: "view.path_group",
        view_path_name: "view.pathname"
    }, commonFields = {
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
    }, dataMap = {
        view: {
            type: enums_RumEventType.VIEW,
            tags: {
                view_loading_type: "view.loading_type",
                view_navigation_type: "view.navigation_type",
                view_apdex_level: "view.apdex_level",
                view_privacy_replay_level: "privacy.replay_level"
            },
            fields: {
                view_update_time: "_gc.view_update_time",
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
            type: enums_RumEventType.RESOURCE,
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
            type: enums_RumEventType.ERROR,
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
            type: enums_RumEventType.LONG_TASK,
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
            type: enums_RumEventType.ACTION,
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
            type: enums_RumEventType.LOGGER,
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
    [ "connection_id", "handshake_succeeded", "start_time", "end_time", "start_view_id", "end_view_id", "end_view_path", "tracking_end_reason", "close_code", "close_reason", "was_clean", "messages_in.count", "messages_in.size", "messages_out.count", "messages_out.size", "time_to_first_message_in", "time_to_first_message_out", "last_message_in_at", "longest_inbound_silence", "inbound_idle_duration_before_close", "buffered_amount_max", "protocol", "setup_duration" ].forEach((function(path) {
        dataMap.resource.fields["resource_websocket_" + path.replace(".", "_")] = "resource.websocket." + path;
    }));
    let stopCallbacks = [];
    function startSessionManager(configuration, productKey, computeSessionState) {
        const renewObservable = new Observable, expireObservable = new Observable, sessionStore = startSessionStore(configuration.sessionStoreStrategyType, productKey, computeSessionState);
        stopCallbacks.push((function() {
            return sessionStore.stop();
        }));
        const sessionContextHistory = createValueHistory({
            expireDelay: 144e5
        });
        function buildSessionContext() {
            const session = sessionStore.getSession();
            return session ? {
                id: session.id,
                trackingType: session[productKey],
                hasError: !!session.hasError,
                isSessionForced: !!session.forcedSession
            } : {
                id: "invalid",
                trackingType: "0",
                isSessionForced: !1,
                hasError: !1
            };
        }
        return stopCallbacks.push((function() {
            return sessionContextHistory.stop();
        })), sessionStore.renewObservable.subscribe((function() {
            sessionContextHistory.add(buildSessionContext(), tools_relativeNow()), renewObservable.notify();
        })), sessionStore.expireObservable.subscribe((function(sessionExpirationTime) {
            expireObservable.notify(sessionExpirationTime), sessionContextHistory.closeActive(tools_relativeNow());
        })), sessionStore.expandOrRenewSession(), sessionContextHistory.add(buildSessionContext(), clocksOrigin().relative), 
        function(expandOrRenewSession) {
            const stop = addEventListeners(window, [ DOM_EVENT_CLICK, DOM_EVENT_TOUCH_START, DOM_EVENT_KEY_DOWN, DOM_EVENT_SCROLL ], expandOrRenewSession, {
                capture: !0,
                passive: !0
            }).stop;
            stopCallbacks.push(stop);
        }((function() {
            sessionStore.expandOrRenewSession();
        })), function(expandSession) {
            const expandSessionWhenVisible = function() {
                "visible" === document.visibilityState && expandSession();
            }, stop = addEventListener(document, DOM_EVENT_VISIBILITY_CHANGE, expandSessionWhenVisible).stop;
            stopCallbacks.push(stop);
            const visibilityCheckInterval = timer_setInterval(expandSessionWhenVisible, 6e4);
            stopCallbacks.push((function() {
                timer_clearInterval(visibilityCheckInterval);
            }));
        }((function() {
            return sessionStore.expandSession();
        })), function(cb) {
            const stop = addEventListener(window, DOM_EVENT_RESUME, cb, {
                capture: !0
            }).stop;
            stopCallbacks.push(stop);
        }((function() {
            sessionStore.restartSession();
        })), {
            findSession: function(startTime, options) {
                return sessionContextHistory.find(startTime, options);
            },
            expandOrRenewSession: sessionStore.expandOrRenewSession,
            renewSession: sessionStore.renewSession,
            forceSession: sessionStore.forceSession,
            renewObservable: renewObservable,
            expireObservable: expireObservable,
            sessionStateUpdateObservable: sessionStore.sessionStateUpdateObservable,
            expire: sessionStore.expire,
            updateSessionState: sessionStore.updateSessionState
        };
    }
    var TransportStatus_UP = 0, TransportStatus_FAILURE_DETECTED = 1, TransportStatus_DOWN = 2, RetryReason_AFTER_SUCCESS = 0, RetryReason_AFTER_RESUME = 1;
    function sendWithRetryStrategy(payload, state, sendStrategy, endpointUrl, reportError) {
        if (isPayloadValid(payload)) if (state.$rPayloadSequenceByPayload.has(payload) || (state.$rPayloadSequenceByPayload.set(payload, state.$rNextPayloadSequence), 
        state.$rNextPayloadSequence += 1), state.transportStatus === TransportStatus_UP && 0 === state.queuedPayloads.size() && state.bandwidthMonitor.canHandle(payload)) send(payload, state, sendStrategy, {
            $rGeneration: state.$rRetryGeneration,
            onSuccess: function() {
                return retryQueuedPayloads(RetryReason_AFTER_SUCCESS, state, sendStrategy, endpointUrl, reportError);
            },
            onFailure: function() {
                enqueueAfterPruningInvalidPayloads(payload, state, !!payload.$rEnforceOrder, sendStrategy, endpointUrl, reportError) || (state.$rPayloadSequenceByPayload.delete(payload), 
                notifyPermanentDrop(payload, "queue_full"), resumeAfterInvalidPayloadsPruned(!isPayloadValid(payload) && pruneInvalidPayloads(state), state, sendStrategy, endpointUrl, reportError)), 
                scheduleRetry(state, sendStrategy, endpointUrl, reportError);
            }
        }); else {
            if (!enqueueAfterPruningInvalidPayloads(payload, state, !1, sendStrategy, endpointUrl, reportError)) return state.$rPayloadSequenceByPayload.delete(payload), 
            notifyPermanentDrop(payload, "queue_full"), void resumeAfterInvalidPayloadsPruned(!isPayloadValid(payload) && pruneInvalidPayloads(state), state, sendStrategy, endpointUrl, reportError);
            scheduleRetry(state, sendStrategy, endpointUrl, reportError);
        } else state.$rPayloadSequenceByPayload.delete(payload);
    }
    function scheduleRetry(state, sendStrategy, endpointUrl, reportError) {
        if (state.transportStatus === TransportStatus_DOWN && void 0 === state.$rRetryTimeoutId && 0 !== state.queuedPayloads.size()) {
            var retryGeneration = state.$rRetryGeneration;
            state.$rRetryTimeoutId = timer_setTimeout((function() {
                if (state.$rRetryTimeoutId = void 0, retryGeneration === state.$rRetryGeneration && state.transportStatus === TransportStatus_DOWN && 0 !== state.queuedPayloads.size()) {
                    for (var payload; state.queuedPayloads.size() > 0 && !isPayloadValid(payload = state.queuedPayloads.first()); ) state.queuedPayloads.dequeue(), 
                    state.$rPayloadSequenceByPayload.delete(payload), payload = void 0;
                    payload && send(payload, state, sendStrategy, {
                        $rGeneration: retryGeneration,
                        $rPayloadRetainedInQueue: !0,
                        onSuccess: function() {
                            state.queuedPayloads.first() === payload && state.queuedPayloads.dequeue(), state.currentBackoffTime = 1e3, 
                            retryQueuedPayloads(RetryReason_AFTER_RESUME, state, sendStrategy, endpointUrl, reportError);
                        },
                        onFailure: function() {
                            state.currentBackoffTime = Math.min(256e3, 2 * state.currentBackoffTime), scheduleRetry(state, sendStrategy, endpointUrl, reportError);
                        }
                    });
                }
            }), state.currentBackoffTime / 2 + Math.random() * state.currentBackoffTime / 2);
        }
    }
    function send(payload, state, sendStrategy, responseData) {
        var onSuccess = responseData.onSuccess, onFailure = responseData.onFailure, ongoingRequest = {
            payload: payload,
            $rActive: !0,
            $rPayloadRetainedInQueue: responseData.$rPayloadRetainedInQueue
        }, responseHandled = !1;
        function handleResponse(response) {
            if (!responseHandled && !ongoingRequest.$rRetired && (responseHandled = !0, clearOngoingRequestWatchdog(ongoingRequest), 
            state.$rOngoingRequests.delete(ongoingRequest), ongoingRequest.$rActive && (ongoingRequest.$rActive = !1, 
            state.bandwidthMonitor.remove(payload)), responseData.$rGeneration === state.$rRetryGeneration)) if (function(response, state, payload) {
                if (state.retryMaxSize > -1 && payload.retry && payload.retry.count > state.retryMaxSize) return !1;
                if (response.$rForceRetry) return !0;
                if ("opaque" === response.type) return !1;
                if (0 === response.status) return !navigator.onLine || !payload.retry || (payload.retry.$rOnlineNetworkErrorCount || 0) < 3;
                return 408 === response.status || 429 === response.status || response.status >= 500;
            }(response, state, payload)) {
                state.transportStatus = state.bandwidthMonitor.ongoingRequestCount > 0 ? TransportStatus_FAILURE_DETECTED : TransportStatus_DOWN;
                var previousRetry = payload.retry;
                payload.retry = {
                    count: previousRetry ? previousRetry.count + 1 : 1,
                    lastFailureStatus: response.status
                }, 0 === response.status && navigator.onLine && !response.$rForceRetry && (payload.retry.$rOnlineNetworkErrorCount = (previousRetry && previousRetry.$rOnlineNetworkErrorCount || 0) + 1), 
                onFailure();
            } else {
                state.$rPayloadSequenceByPayload.delete(payload);
                var permanentDropReason = function(response, state, payload) {
                    if (state.retryMaxSize > -1 && payload.retry && payload.retry.count > state.retryMaxSize) return "retry_exhausted";
                    if ("opaque" === response.type || response.status >= 200 && response.status < 300) return;
                    return "http_" + response.status;
                }(response, state, payload);
                permanentDropReason && (notifyPermanentDrop(payload, permanentDropReason), isPayloadValid(payload) || pruneInvalidPayloads(state)), 
                state.transportStatus = TransportStatus_UP, onSuccess();
            }
        }
        state.$rOngoingRequests.add(ongoingRequest), state.bandwidthMonitor.add(payload);
        try {
            ongoingRequest.$rAbort = sendStrategy(payload, handleResponse), !payload.$rEnforceOrder || responseHandled || ongoingRequest.$rRetired || (ongoingRequest.$rWatchdogTimeoutId = timer_setTimeout((function() {
                if (ongoingRequest.$rWatchdogTimeoutId = void 0, !responseHandled && !ongoingRequest.$rRetired) {
                    var abort = ongoingRequest.$rAbort;
                    handleResponse({
                        status: 0,
                        $rForceRetry: !0
                    }), abortOngoingRequest(abort);
                }
            }), 3e4));
        } catch (e) {
            handleResponse({
                status: 0,
                $rForceRetry: !0
            });
        }
    }
    function clearOngoingRequestWatchdog(ongoingRequest) {
        void 0 !== ongoingRequest.$rWatchdogTimeoutId && (timer_clearTimeout(ongoingRequest.$rWatchdogTimeoutId), 
        ongoingRequest.$rWatchdogTimeoutId = void 0);
    }
    function abortOngoingRequest(abort) {
        if (abort && "function" == typeof abort.abort) try {
            abort.abort();
        } catch (e) {}
    }
    function retryQueuedPayloads(reason, state, sendStrategy, endpointUrl, reportError) {
        reason === RetryReason_AFTER_SUCCESS && state.queuedPayloads.isFull() && !state.queueFullReported && (reportError({
            message: "Reached max " + endpointUrl + " events size queued for upload: 20MiB",
            source: ErrorSource_AGENT,
            startClocks: clocksNow()
        }), state.queueFullReported = !0);
        var previousQueue = state.queuedPayloads;
        for (state.queuedPayloads = newPayloadQueue(); previousQueue.size() > 0; ) sendWithRetryStrategy(previousQueue.dequeue(), state, sendStrategy, endpointUrl, reportError);
    }
    function notifyPermanentDrop(payload, reason) {
        if (payload && !payload.$rPermanentDropNotified && "function" == typeof payload.$rOnPermanentDrop) {
            payload.$rPermanentDropNotified = !0;
            try {
                payload.$rOnPermanentDrop(reason);
            } catch (e) {}
        }
    }
    function isPayloadValid(payload) {
        if (!payload || "function" != typeof payload.$rIsValid) return !0;
        try {
            return !1 !== payload.$rIsValid();
        } catch (e) {
            return !1;
        }
    }
    function enqueueAfterPruningInvalidPayloads(payload, state, enqueueFirst, sendStrategy, endpointUrl, reportError) {
        var enqueue = enqueueFirst ? "enqueueFirst" : "enqueue";
        if (state.queuedPayloads[enqueue](payload)) return !0;
        var invalidPayloadPruned = pruneInvalidPayloads(state), queued = state.queuedPayloads[enqueue](payload);
        return resumeAfterInvalidPayloadsPruned(invalidPayloadPruned, state, sendStrategy, endpointUrl, reportError), 
        queued;
    }
    function pruneInvalidPayloads(state) {
        for (var invalidPayloadPruned = !1, queuedPayloads = state.queuedPayloads, validQueuedPayloads = []; queuedPayloads.size() > 0; ) {
            var queuedPayload = queuedPayloads.dequeue();
            isPayloadValid(queuedPayload) ? validQueuedPayloads.push(queuedPayload) : (invalidPayloadPruned = !0, 
            state.$rPayloadSequenceByPayload.delete(queuedPayload));
        }
        return state.queuedPayloads = newPayloadQueue(validQueuedPayloads), state.$rOngoingRequests.forEach((function(ongoingRequest) {
            isPayloadValid(ongoingRequest.payload) || (invalidPayloadPruned = !0, ongoingRequest.$rRetired = !0, 
            clearOngoingRequestWatchdog(ongoingRequest), state.$rOngoingRequests.delete(ongoingRequest), 
            ongoingRequest.$rActive && (ongoingRequest.$rActive = !1, state.bandwidthMonitor.remove(ongoingRequest.payload)), 
            state.$rPayloadSequenceByPayload.delete(ongoingRequest.payload), abortOngoingRequest(ongoingRequest.$rAbort));
        })), invalidPayloadPruned;
    }
    function resumeAfterInvalidPayloadsPruned(invalidPayloadPruned, state, sendStrategy, endpointUrl, reportError) {
        !invalidPayloadPruned || state.bandwidthMonitor.ongoingRequestCount > 0 || (void 0 !== state.$rRetryTimeoutId && (timer_clearTimeout(state.$rRetryTimeoutId), 
        state.$rRetryTimeoutId = void 0), state.transportStatus = TransportStatus_UP, state.currentBackoffTime = 1e3, 
        retryQueuedPayloads(RetryReason_AFTER_SUCCESS, state, sendStrategy, endpointUrl, reportError));
    }
    function newPayloadQueue(initialPayloads) {
        for (var queue = initialPayloads || [], head = 0, initialBytesCount = 0, index = 0; index < queue.length; index += 1) initialBytesCount += queue[index].bytesCount;
        return {
            bytesCount: initialBytesCount,
            enqueue: function(payload) {
                return !this.isFull() && (queue.push(payload), this.bytesCount += payload.bytesCount, 
                !0);
            },
            enqueueFirst: function(payload) {
                return !this.isFull() && (head > 0 ? queue[head -= 1] = payload : queue.unshift(payload), 
                this.bytesCount += payload.bytesCount, !0);
            },
            first: function() {
                return queue[head];
            },
            dequeue: function() {
                var payload = queue[head];
                return payload && (queue[head] = void 0, head += 1, this.bytesCount -= payload.bytesCount, 
                head === queue.length && (queue = [], head = 0)), payload;
            },
            size: function() {
                return queue.length - head;
            },
            isFull: function() {
                return this.bytesCount >= 20971520;
            }
        };
    }
    function addBatchPrecision(url, encoding) {
        return url ? (url = url + (-1 === url.indexOf("?") ? "?" : "&") + "precision=ms", 
        encoding && (url = url + "&encoding=" + encoding), url) : url;
    }
    function createHttpRequest(endpointUrl, bytesLimit, retryMaxSize, reportError) {
        void 0 === retryMaxSize && (retryMaxSize = -1);
        var retryState = function(retryMaxSize) {
            return {
                transportStatus: TransportStatus_UP,
                currentBackoffTime: 1e3,
                bandwidthMonitor: {
                    ongoingRequestCount: 0,
                    ongoingOrderedRequestCount: 0,
                    ongoingByteCount: 0,
                    canHandle: function(payload) {
                        return !(this.ongoingOrderedRequestCount > 0 || payload.$rEnforceOrder && this.ongoingRequestCount > 0) && (0 === this.ongoingRequestCount || this.ongoingByteCount + payload.bytesCount <= 81920 && this.ongoingRequestCount < 32);
                    },
                    add: function(payload) {
                        this.ongoingRequestCount += 1, payload.$rEnforceOrder && (this.ongoingOrderedRequestCount += 1), 
                        this.ongoingByteCount += payload.bytesCount;
                    },
                    remove: function(payload) {
                        this.ongoingRequestCount -= 1, payload.$rEnforceOrder && (this.ongoingOrderedRequestCount -= 1), 
                        this.ongoingByteCount -= payload.bytesCount;
                    }
                },
                queuedPayloads: newPayloadQueue(),
                queueFullReported: !1,
                retryMaxSize: retryMaxSize,
                $rRetryGeneration: 0,
                $rRetryTimeoutId: void 0,
                $rOngoingRequests: new Set,
                $rPayloadSequenceByPayload: new sdkMap_SDKMap,
                $rNextPayloadSequence: 0
            };
        }(retryMaxSize), exitAcceptedPayloads = new WeakSet, sendStrategyForRetry = function(payload, onResponse) {
            return function(endpointUrl, payload, onResponse) {
                var url = addBatchPrecision(endpointUrl, payload.encoding);
                return "function" == typeof fetch ? function(url, payload, onResponse) {
                    const controller = "function" == typeof AbortController && new AbortController, fetchOption = {
                        method: "POST",
                        body: payload.data,
                        mode: "cors"
                    }, headers = {
                        "x-client-timestamp": Date.now().toString()
                    };
                    payload.type && (headers["Content-Type"] = payload.type);
                    payload.$rKeepalive && (fetchOption.keepalive = !0);
                    fetchOption.headers = headers, controller && (fetchOption.signal = controller.signal);
                    if (fetch(url, fetchOption).then(monitor((function(response) {
                        "function" == typeof onResponse && onResponse({
                            status: response.status,
                            type: response.type
                        });
                    }))).catch(monitor((function() {
                        "function" == typeof onResponse && onResponse({
                            status: 0
                        });
                    }))), controller) return controller;
                }(url, payload, onResponse) : sendXHR(url, payload, onResponse);
            }(endpointUrl, payload, onResponse);
        }, sendWithRetry = function(payload) {
            sendWithRetryStrategy(payload, retryState, sendStrategyForRetry, endpointUrl, reportError);
        };
        function sendOnExitWithBudget(bytesBudget, currentPayload) {
            var sentBytesCount = 0;
            function trySend(payload) {
                var exitBytesCount = function(payload) {
                    var bytesCount = payload && "number" == typeof payload.$rExitBytesCount ? payload.$rExitBytesCount : payload && payload.bytesCount;
                    return "number" == typeof bytesCount && isFinite(bytesCount) ? Math.max(bytesCount, 0) : 0;
                }(payload);
                return !(sentBytesCount + exitBytesCount > bytesBudget || !trySendBeacon(endpointUrl, bytesLimit, payload)) && (sentBytesCount += exitBytesCount, 
                exitAcceptedPayloads.add(payload), !0);
            }
            return function(state, trySend) {
                var sentPayloads = [];
                if (state.$rOngoingRequests.size > 0) return sentPayloads;
                for (;state.queuedPayloads.size() > 0; ) {
                    var payload = state.queuedPayloads.first();
                    if (isPayloadValid(payload)) {
                        if (!trySend(payload)) break;
                        sentPayloads.push(payload);
                    }
                    state.queuedPayloads.dequeue(), state.$rPayloadSequenceByPayload.delete(payload);
                }
                0 === state.queuedPayloads.size() && (void 0 !== state.$rRetryTimeoutId && (timer_clearTimeout(state.$rRetryTimeoutId), 
                state.$rRetryTimeoutId = void 0), state.transportStatus = TransportStatus_UP, state.currentBackoffTime = 1e3);
            }(retryState, trySend), currentPayload && isPayloadValid(currentPayload) && !exitAcceptedPayloads.has(currentPayload) && !retryState.$rPayloadSequenceByPayload.has(currentPayload) && (!hasPendingRetryPayloads(retryState) && trySend(currentPayload) || sendWithRetry(currentPayload)), 
            sentBytesCount;
        }
        return {
            send: sendWithRetry,
            sendOnExit: function(payload, bytesBudget) {
                return "number" == typeof bytesBudget && isFinite(bytesBudget) && bytesBudget >= 0 ? {
                    $rBytesCount: sendOnExitWithBudget(bytesBudget, payload),
                    $rCurrentPayloadSent: exitAcceptedPayloads.has(payload),
                    $rPending: retryState.$rPayloadSequenceByPayload.has(payload)
                } : payload.$rEnforceOrder && hasPendingRetryPayloads(retryState) ? void sendWithRetry(payload) : void function(endpointUrl, bytesLimit, payload) {
                    trySendBeacon(endpointUrl, bytesLimit, payload) || sendXHR(addBatchPrecision(endpointUrl, payload.encoding), payload);
                }(endpointUrl, bytesLimit, payload);
            },
            $rDrainOnExit: function(bytesBudget) {
                if (!("number" == typeof bytesBudget && isFinite(bytesBudget) && bytesBudget >= 0)) return {
                    $rBytesCount: 0,
                    $rAllPayloadsSent: !1
                };
                var sentBytesCount = sendOnExitWithBudget(bytesBudget), pending = hasPendingRetryPayloads(retryState);
                return {
                    $rBytesCount: sentBytesCount,
                    $rAllPayloadsSent: !pending,
                    $rPending: pending
                };
            },
            $rPendingBytes: function() {
                return pendingBytesCount = (state = retryState).queuedPayloads.bytesCount + state.bandwidthMonitor.ongoingByteCount, 
                state.$rOngoingRequests.forEach((function(ongoingRequest) {
                    ongoingRequest.$rActive && ongoingRequest.$rPayloadRetainedInQueue && (pendingBytesCount -= ongoingRequest.payload.bytesCount);
                })), pendingBytesCount;
                var state, pendingBytesCount;
            }
        };
    }
    function hasPendingRetryPayloads(retryState) {
        return retryState.queuedPayloads.size() > 0 || retryState.$rOngoingRequests.size > 0;
    }
    function trySendBeacon(endpointUrl, bytesLimit, payload) {
        var data = payload.data, bytesCount = payload.bytesCount, url = addBatchPrecision(endpointUrl, payload.encoding);
        if (!!navigator.sendBeacon && bytesCount < bytesLimit) try {
            var beaconData;
            if (beaconData = payload.type ? new Blob([ data ], {
                type: payload.type
            }) : data, navigator.sendBeacon(url, beaconData)) return !0;
        } catch (e) {
            hasReportedBeaconError || (hasReportedBeaconError = !0);
        }
        return !1;
    }
    var hasReportedBeaconError = !1;
    function sendXHR(url, payload, onResponse) {
        const data = payload.data, request = new XMLHttpRequest;
        return request.open("POST", url, !0), data instanceof Blob ? request.setRequestHeader("Content-Type", data.type) : payload.type && request.setRequestHeader("Content-Type", payload.type), 
        request.setRequestHeader("x-client-timestamp", Date.now().toString()), addEventListener(request, "loadend", (function() {
            "function" == typeof onResponse && onResponse({
                status: request.status
            });
        }), {
            once: !0
        }), request.send(data), request;
    }
    function escapeRowData(str) {
        if ("object" == typeof str && str) str = jsonStringify_jsonStringify(str); else if (!isString(str)) return str;
        return String(str).replace(/[\s=,"]/g, (function(word) {
            return "\\" + word;
        }));
    }
    function escapeJsonValue(value, isTag) {
        return "object" == typeof value && value ? value = jsonStringify_jsonStringify(value) : isTag && (value = "" + value), 
        value;
    }
    function escapeFieldValueStr(str) {
        return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    }
    function escapeRowField(value) {
        return "object" == typeof value && value ? escapeFieldValueStr(jsonStringify_jsonStringify(value)) : isString(value) ? escapeFieldValueStr(value) : value;
    }
    var processedMessageByDataMap = function(message) {
        if (!message || !message.type) return {
            rowStr: "",
            rowData: void 0
        };
        var rowData = {
            tags: {},
            fields: {}
        }, hasFileds = !1, rowStr = "";
        return tools_each(dataMap, (function(value, key) {
            if (value.type === message.type) {
                rowStr += key + ",", rowData.measurement = key;
                var tagsStr = [], tags = extend({}, commonTags, value.tags), filterFileds = [ "date", "type", "custom_keys" ];
                tools_each(tags, (function(value_path, _key) {
                    var _value = findByPath(message, value_path);
                    filterFileds.push(_key), (_value || isNumber(_value)) && (rowData.tags[_key] = escapeJsonValue(_value, !0), 
                    tagsStr.push(escapeRowData(_key) + "=" + escapeRowData(_value)));
                }));
                var fieldsStr = [], fields = extend({}, commonFields, value.fields);
                if (tools_each(fields, (function(_value, _key) {
                    if (isArray(_value) && 2 === _value.length) {
                        var value_path = _value[1], _valueData = findByPath(message, value_path);
                        filterFileds.push(_key), null != _valueData && (rowData.fields[_key] = escapeJsonValue(_valueData), 
                        fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_valueData)));
                    } else if (isString(_value)) {
                        _valueData = findByPath(message, _value);
                        filterFileds.push(_key), null != _valueData && (rowData.fields[_key] = escapeJsonValue(_valueData), 
                        fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_valueData)));
                    }
                })), message.context && isObject(message.context) && !isEmptyObject(message.context)) {
                    var _tagKeys = [];
                    tools_each(message.context, (function(_value, _key) {
                        filterFileds.indexOf(_key) > -1 || (filterFileds.push(_key), null != _value && (_tagKeys.push(_key), 
                        rowData.fields[_key] = escapeJsonValue(_value), fieldsStr.push(escapeRowData(_key) + "=" + escapeRowField(_value))));
                    })), _tagKeys.length && (rowData.fields.custom_keys = escapeJsonValue(_tagKeys), 
                    fieldsStr.push(escapeRowData("custom_keys") + "=" + escapeRowField(_tagKeys)));
                }
                message.type === enums_RumEventType.LOGGER && tools_each(message, (function(value, key) {
                    -1 === filterFileds.indexOf(key) && null != value && (rowData.fields[key] = escapeJsonValue(value), 
                    fieldsStr.push(escapeRowData(key) + "=" + escapeRowField(value)));
                })), tagsStr.length && (rowStr += tagsStr.join(",")), fieldsStr.length && (rowStr += " ", 
                rowStr += fieldsStr.join(","), hasFileds = !0), rowStr = rowStr + " " + message.date, 
                rowData.time = message.date;
            }
        })), {
            rowStr: hasFileds ? rowStr : "",
            rowData: hasFileds ? rowData : void 0
        };
    };
    function createBatch(options) {
        var encoder = options.encoder, encoderFallback = options.encoderFallback, request = options.request, bytesLimit = options.bytesLimit, messageBytesLimit = options.messageBytesLimit, sendContentTypeByJson = options.sendContentTypeByJson, flushController = options.flushController, upsertBuffer = {}, upsertMessageBytesCountByKey = {}, upsertRawBytesCountByKey = {}, upsertRawBytesCount = 0, fallbackMessagesBuffer = [], fallbackMessagesBufferBytesCount = 0, rawFallbackBatchActive = !1, pendingRawBatches = [], pendingRawBatchesBytesCount = 0, maxPendingRawBytes = "number" == typeof options.maxPendingRawBytes ? options.maxPendingRawBytes : 4194304, rawJournalLimitReported = !1, currentBatchGeneration = 0, flushSubscription = flushController.flushObservable.subscribe((function(event) {
            !function(event) {
                if (!(fallbackMessagesBuffer.length > 0) && isEmptyObject(upsertBuffer) && 0 === pendingRawBatches.length && (!event || !event.messagesCount) && encoder.isEmpty()) return;
                currentBatchGeneration += 1;
                var flushedEncoder = encoder, upsertMessageValues = values(upsertBuffer), upsertMessages = upsertMessageValues.join(sendContentTypeByJson ? "," : "\n");
                upsertBuffer = {}, upsertMessageBytesCountByKey = {}, upsertRawBytesCountByKey = {}, 
                upsertRawBytesCount = 0;
                var rawFallbackFlush = rawFallbackBatchActive, fallbackMessages = flushedEncoder.isAsync || encoderFallback || rawFallbackFlush ? fallbackMessagesBuffer.concat(upsertMessageValues) : void 0;
                fallbackMessagesBuffer = [], fallbackMessagesBufferBytesCount = 0, rawFallbackBatchActive = !1;
                var isPageExit = (reason = event.reason, includes(values(PageExitReason), reason)), send = isPageExit ? request.sendOnExit : request.send, pendingRawBatch = !isPageExit && flushedEncoder.isAsync ? (messages = fallbackMessages, 
                batch = {
                    messages: messages || [],
                    bytesCount: computeRawMessagesBytesCount(messages),
                    isActive: !0
                }, pendingRawBatches.push(batch), pendingRawBatchesBytesCount += batch.bytesCount, 
                batch) : void 0;
                var messages, batch;
                var reason;
                if (isPageExit && (flushedEncoder.isAsync || pendingRawBatches.length > 0)) {
                    var encoderResult = flushedEncoder.finishSync(), pendingMessages = function() {
                        var messages = [];
                        return pendingRawBatches.forEach((function(batch) {
                            batch.isActive = !1, messages = messages.concat(batch.messages);
                        })), pendingRawBatches = [], pendingRawBatchesBytesCount = 0, messages;
                    }().concat(fallbackMessages || []);
                    encoderResult.error && switchToFallbackEncoder(flushedEncoder, !1), sendMessages(send, pendingMessages, sendContentTypeByJson, bytesLimit);
                } else {
                    if (upsertMessages) {
                        var text = getMessageText([ upsertMessages ], flushedEncoder.isEmpty());
                        sendContentTypeByJson && (text += "]"), flushedEncoder.write(text);
                    } else sendContentTypeByJson && flushedEncoder.write("]");
                    flushedEncoder.finish((function(encoderResult) {
                        if (!pendingRawBatch || function(batch) {
                            if (!batch.isActive) return !1;
                            batch.isActive = !1;
                            var index = pendingRawBatches.indexOf(batch);
                            -1 !== index && pendingRawBatches.splice(index, 1);
                            return pendingRawBatchesBytesCount = Math.max(0, pendingRawBatchesBytesCount - batch.bytesCount), 
                            !0;
                        }(pendingRawBatch)) return encoderResult.error ? (switchToFallbackEncoder(flushedEncoder), 
                        void sendMessages(send, fallbackMessages, sendContentTypeByJson, bytesLimit)) : void (rawFallbackFlush ? sendMessages(send, fallbackMessages, sendContentTypeByJson, bytesLimit) : encoderResult.outputBytesCount ? send(function(encoderResult, sendContentTypeByJson) {
                            var data;
                            data = "string" == typeof encoderResult.output ? encoderResult.output : new Blob([ encoderResult.output ], {
                                type: "text/plain"
                            });
                            return {
                                data: data,
                                type: sendContentTypeByJson ? "application/json;charset=UTF-8" : void 0,
                                bytesCount: encoderResult.outputBytesCount,
                                encoding: encoderResult.encoding
                            };
                        }(encoderResult, sendContentTypeByJson)) : sendMessages(send, fallbackMessages, sendContentTypeByJson, bytesLimit));
                    }));
                }
            }(event);
        }));
        function getMessageText(messages) {
            let isEmpty = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            return sendContentTypeByJson ? isEmpty ? "[" + messages.join(",") : "," + messages.join(",") : isEmpty ? messages.join("\n") : "\n" + messages.join("\n");
        }
        function addOrUpdate(message, key) {
            const serializedMessage = function(message) {
                return sendContentTypeByJson ? jsonStringify_jsonStringify(processedMessageByDataMap(message).rowData) : processedMessageByDataMap(message).rowStr;
            }(message), estimatedMessageBytesCount = encoder.estimateEncodedBytesCount(serializedMessage);
            estimatedMessageBytesCount >= messageBytesLimit ? display.warn("Discarded a message whose size was bigger than the maximum allowed size ".concat(messageBytesLimit, "KB.")) : (function(key) {
                return void 0 !== key && void 0 !== upsertBuffer[key];
            }(key) && function(key, keepDurationLimitTimeout) {
                delete upsertBuffer[key];
                var messageBytesCount = upsertMessageBytesCountByKey[key];
                delete upsertMessageBytesCountByKey[key], upsertRawBytesCount -= upsertRawBytesCountByKey[key] || 0, 
                delete upsertRawBytesCountByKey[key], flushController.notifyAfterRemoveMessage(messageBytesCount, keepDurationLimitTimeout);
            }(key, !0), function(serializedMessage, estimatedMessageBytesCount, key) {
                flushController.notifyBeforeAddMessage(estimatedMessageBytesCount);
                var rawMessageBytesCount = computeBytesCount(serializedMessage) + 1;
                if (encoder.isAsync && encoderFallback && pendingRawBatchesBytesCount + fallbackMessagesBufferBytesCount + upsertRawBytesCount + rawMessageBytesCount > maxPendingRawBytes && (rawJournalLimitReported || (rawJournalLimitReported = !0, 
                display.warn("Session data compression was disabled because its pending raw journal reached the safety limit.")), 
                switchToFallbackEncoder(encoder, !0)), void 0 !== key) upsertBuffer[key] = serializedMessage, 
                upsertMessageBytesCountByKey[key] = estimatedMessageBytesCount, upsertRawBytesCountByKey[key] = rawMessageBytesCount, 
                upsertRawBytesCount += rawMessageBytesCount, flushController.notifyAfterAddMessage(); else {
                    (encoder.isAsync || encoderFallback || rawFallbackBatchActive) && (fallbackMessagesBuffer.push(serializedMessage), 
                    fallbackMessagesBufferBytesCount += rawMessageBytesCount);
                    var writeEncoder = encoder, writeBatchGeneration = currentBatchGeneration;
                    writeEncoder.write(getMessageText([ serializedMessage ], writeEncoder.isEmpty()), (function(realMessageBytesCount, error) {
                        writeBatchGeneration === currentBatchGeneration && flushController.notifyAfterAddMessage(error ? void 0 : realMessageBytesCount - estimatedMessageBytesCount), 
                        error && switchToFallbackEncoder(writeEncoder);
                    }));
                }
            }(serializedMessage, estimatedMessageBytesCount, key));
        }
        function drainPendingRawBatches() {
            var batches = pendingRawBatches;
            pendingRawBatches = [], pendingRawBatchesBytesCount = 0, batches.forEach((function(batch) {
                batch.isActive = !1, sendMessages(request.send, batch.messages, sendContentTypeByJson, bytesLimit);
            }));
        }
        function switchToFallbackEncoder(failedEncoder) {
            let drainPending = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            if (encoderFallback && encoder === failedEncoder) {
                var createFallbackEncoder = encoderFallback;
                encoderFallback = void 0, encoder = createFallbackEncoder(), rawFallbackBatchActive = fallbackMessagesBuffer.length > 0 || !isEmptyObject(upsertBuffer), 
                fallbackMessagesBuffer.length && encoder.write(getMessageText(fallbackMessagesBuffer, encoder.isEmpty())), 
                drainPending && drainPendingRawBatches(), failedEncoder.stop && failedEncoder.stop();
            }
        }
        return {
            flushController: flushController,
            add: addOrUpdate,
            upsert: addOrUpdate,
            stop: flushSubscription.unsubscribe
        };
    }
    function computeRawMessagesBytesCount(messages) {
        return messages && messages.length ? messages.reduce((function(bytesCount, message) {
            return bytesCount + computeBytesCount(message) + 1;
        }), 0) : 0;
    }
    function sendMessages(send, messages, sendContentTypeByJson, bytesLimit) {
        if (messages) {
            var filteredMessages = messages.filter(Boolean);
            if (filteredMessages.length) {
                var messagesBuffer = [], messagesBufferBytesCount = sendContentTypeByJson ? 2 : 0;
                filteredMessages.forEach((function(message) {
                    var separatorBytesCount = messagesBuffer.length ? 1 : 0, messageBytesCount = computeBytesCount(message);
                    messagesBuffer.length && "number" == typeof bytesLimit && messagesBufferBytesCount + separatorBytesCount + messageBytesCount > bytesLimit && (sendMessagesBuffer(send, messagesBuffer, messagesBufferBytesCount, sendContentTypeByJson), 
                    messagesBuffer = [], messagesBufferBytesCount = sendContentTypeByJson ? 2 : 0, separatorBytesCount = 0), 
                    messagesBuffer.push(message), messagesBufferBytesCount += separatorBytesCount + messageBytesCount;
                })), sendMessagesBuffer(send, messagesBuffer, messagesBufferBytesCount, sendContentTypeByJson);
            }
        }
    }
    function sendMessagesBuffer(send, messages, messagesBytesCount, sendContentTypeByJson) {
        var data = sendContentTypeByJson ? "[" + messages.join(",") + "]" : messages.join("\n");
        data && send({
            data: data,
            type: sendContentTypeByJson ? "application/json;charset=UTF-8" : void 0,
            bytesCount: messagesBytesCount
        });
    }
    function createFlushController(_ref) {
        let messagesLimit = _ref.messagesLimit, bytesLimit = _ref.bytesLimit, durationLimit = _ref.durationLimit, pageExitObservable = _ref.pageExitObservable, sessionExpireObservable = _ref.sessionExpireObservable, flushRequestObservable = _ref.flushRequestObservable;
        var durationLimitTimeoutId, pageExitSubscription = pageExitObservable.subscribe((function(event) {
            return flush(event.reason, !0);
        })), sessionExpireSubscription = sessionExpireObservable.subscribe((function() {
            return flush("session_expire");
        })), flushRequestSubscription = flushRequestObservable && flushRequestObservable.subscribe(flush), flushObservable = new Observable((function() {
            return function() {
                pageExitSubscription.unsubscribe(), sessionExpireSubscription.unsubscribe(), flushRequestSubscription && flushRequestSubscription.unsubscribe();
            };
        })), currentBytesCount = 0, currentMessagesCount = 0;
        function flush(flushReason, flushWhenEmpty) {
            if (0 !== currentMessagesCount || flushWhenEmpty) {
                var messagesCount = currentMessagesCount, bytesCount = currentBytesCount;
                currentMessagesCount = 0, currentBytesCount = 0, cancelDurationLimitTimeout(), flushObservable.notify({
                    reason: flushReason,
                    messagesCount: messagesCount,
                    bytesCount: bytesCount
                });
            }
        }
        function cancelDurationLimitTimeout() {
            timer_clearTimeout(durationLimitTimeoutId), durationLimitTimeoutId = void 0;
        }
        return {
            flushObservable: flushObservable,
            getMessagesCount: function() {
                return currentMessagesCount;
            },
            notifyBeforeAddMessage: function(estimatedMessageBytesCount) {
                currentBytesCount + estimatedMessageBytesCount >= bytesLimit && flush("bytes_limit"), 
                currentMessagesCount += 1, currentBytesCount += estimatedMessageBytesCount, void 0 === durationLimitTimeoutId && (durationLimitTimeoutId = timer_setTimeout((function() {
                    flush("duration_limit");
                }), durationLimit));
            },
            notifyAfterAddMessage: function(messageBytesCountDiff) {
                void 0 === messageBytesCountDiff && (messageBytesCountDiff = 0), currentBytesCount += messageBytesCountDiff, 
                currentMessagesCount >= messagesLimit ? flush("messages_limit") : currentBytesCount >= bytesLimit && flush("bytes_limit");
            },
            notifyAfterRemoveMessage: function(messageBytesCount, keepDurationLimitTimeout) {
                currentBytesCount -= messageBytesCount, 0 !== (currentMessagesCount -= 1) || keepDurationLimitTimeout || cancelDurationLimitTimeout();
            }
        };
    }
    function startBatchWithReplica(configuration, primary, reportError, pageExitObservable, sessionExpireObservable, batchFactoryImp) {
        void 0 === batchFactoryImp && (batchFactoryImp = createBatch);
        var primaryBatch = function(configuration, batchConfiguration) {
            return batchFactoryImp({
                encoder: batchConfiguration.encoder,
                encoderFallback: batchConfiguration.encoderFallback,
                request: batchConfiguration.request || createHttpRequest(batchConfiguration.endpoint, configuration.batchBytesLimit, configuration.retryMaxSize, reportError),
                flushController: createFlushController({
                    messagesLimit: configuration.batchMessagesLimit,
                    bytesLimit: configuration.batchBytesLimit,
                    durationLimit: configuration.flushTimeout,
                    pageExitObservable: pageExitObservable,
                    sessionExpireObservable: sessionExpireObservable,
                    flushRequestObservable: batchConfiguration.flushRequestObservable
                }),
                bytesLimit: configuration.batchBytesLimit,
                messageBytesLimit: configuration.messageBytesLimit,
                sendContentTypeByJson: configuration.sendContentTypeByJson
            });
        }(configuration, primary);
        return {
            flushObservable: primaryBatch.flushController.flushObservable,
            add: function(message) {
                primaryBatch.add(message);
            },
            upsert: function(message, key) {
                primaryBatch.upsert(message, key);
            },
            stop: function() {
                primaryBatch.stop();
            }
        };
    }
    function canUseEventBridge() {
        var _getGlobalObject$loca;
        arguments.length > 0 && void 0 !== arguments[0] || null === (_getGlobalObject$loca = getGlobalObject().location) || void 0 === _getGlobalObject$loca || _getGlobalObject$loca.hostname;
        return !1;
    }
    function ensureProperties(context, propertiesConfig, name) {
        const newContext = tools_assign({}, context);
        return Object.entries(propertiesConfig).forEach((function(propertyEntry) {
            const key = propertyEntry[0], propertyConfiguration = propertyEntry[1], required = propertyConfiguration.required;
            "string" === propertyConfiguration.type && key in newContext && (newContext[key] = String(newContext[key])), 
            required && !(key in context) && display.warn("The property ".concat(key, " of ").concat(name, " context is required; context will not be sent to the intake."));
        })), newContext;
    }
    function createContextManager() {
        let name = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", _ref = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, customerDataTracker = _ref.customerDataTracker, _ref$propertiesConfig = _ref.propertiesConfig, propertiesConfig = void 0 === _ref$propertiesConfig ? {} : _ref$propertiesConfig, context = {};
        const changeObservable = new Observable, contextManager = {
            getContext: () => deepClone(context),
            setContext: newContext => {
                "object" === tools_getType(newContext) ? (context = sanitize(ensureProperties(newContext, propertiesConfig, name)), 
                null == customerDataTracker || customerDataTracker.updateCustomerData(context)) : contextManager.clearContext(), 
                changeObservable.notify();
            },
            setContextProperty: (key, property) => {
                const propertyContext = {};
                Object.defineProperty(propertyContext, key, {
                    configurable: !0,
                    enumerable: !0,
                    value: property,
                    writable: !0
                }), context[key] = sanitize(ensureProperties(propertyContext, propertiesConfig, name)[key]), 
                null == customerDataTracker || customerDataTracker.updateCustomerData(context), 
                changeObservable.notify();
            },
            removeContextProperty: key => {
                delete context[key], null == customerDataTracker || customerDataTracker.updateCustomerData(context), 
                ensureProperties(context, propertiesConfig, name), changeObservable.notify();
            },
            clearContext: () => {
                context = {}, null == customerDataTracker || customerDataTracker.resetCustomerData(), 
                changeObservable.notify();
            },
            changeObservable: changeObservable
        };
        return contextManager;
    }
    var CustomerDataType_User = "user", CustomerDataType_GlobalContext = "global context", CustomerDataType_View = "view", storageListeners = [];
    function storeContextManager(configuration, contextManager, productKey, customerDataType) {
        var storageKey = function(configuration, productKey, customerDataType) {
            return configuration.storeContextsKey && isString(configuration.storeContextsKey) ? "_gc_s_" + productKey + "_" + customerDataType + "_" + configuration.storeContextsKey : "_gc_s_" + productKey + "_" + customerDataType;
        }(configuration, productKey, customerDataType);
        function getFromStorage() {
            const rawContext = localStorage.getItem(storageKey);
            return null !== rawContext ? JSON.parse(rawContext) : {};
        }
        return storageListeners.push(addEventListener(window, DOM_EVENT_STORAGE, (function(params) {
            storageKey === params.key && contextManager.setContext(getFromStorage());
        }))), contextManager.changeObservable.subscribe((function() {
            localStorage.setItem(storageKey, JSON.stringify(contextManager.getContext()));
        })), contextManager.setContext(extend2Lev(getFromStorage(), contextManager.getContext())), 
        contextManager;
    }
    const CustomerDataCompressionStatus_Unknown = 0, CustomerDataCompressionStatus_Enabled = 1, CustomerDataCompressionStatus_Disabled = 2;
    function createCustomerDataTracker(checkCustomerDataLimit) {
        let bytesCountCache = 0;
        const _throttle = throttle((context => {
            bytesCountCache = computeBytesCount(jsonStringify_jsonStringify(context)), checkCustomerDataLimit();
        }), 200), computeBytesCountThrottled = _throttle.throttled, cancelComputeBytesCount = _throttle.cancel, resetBytesCount = () => {
            cancelComputeBytesCount(), bytesCountCache = 0;
        };
        return {
            updateCustomerData: context => {
                isEmptyObject(context) ? resetBytesCount() : computeBytesCountThrottled(context);
            },
            resetCustomerData: resetBytesCount,
            getBytesCount: () => bytesCountCache,
            stop: () => {
                cancelComputeBytesCount();
            }
        };
    }
    function displayCustomerDataLimitReachedWarning(bytesCountLimit) {
        display.warn("Customer data exceeds the recommended ".concat(bytesCountLimit / 1024, "KiB threshold."));
    }
    function createIdentityEncoder() {
        var output = "", outputBytesCount = 0;
        return {
            isAsync: !1,
            isEmpty: function() {
                return !output;
            },
            write: function(data, callback) {
                var additionalEncodedBytesCount = computeBytesCount(data);
                outputBytesCount += additionalEncodedBytesCount, output += data, callback && callback(additionalEncodedBytesCount);
            },
            finish: function(callback) {
                callback(this.finishSync());
            },
            finishSync: function() {
                var result = {
                    output: output,
                    outputBytesCount: outputBytesCount,
                    rawBytesCount: outputBytesCount,
                    pendingData: []
                };
                return output = "", outputBytesCount = 0, result;
            },
            estimateEncodedBytesCount: function(data) {
                return "number" == typeof data ? data : data.length;
            }
        };
    }
    function sanitizeUser(newUser) {
        var user = tools_assign({}, newUser);
        return tools_each([ "id", "name", "email" ], (function(key) {
            key in user && (user[key] = String(user[key]));
        })), user;
    }
    function displayAlreadyInitializedError(sdkName, initConfiguration) {
        initConfiguration.silentMultipleInit || display.error(sdkName + " is already initialized.");
    }
    var RumSessionPlan_WITHOUT_SESSION_REPLAY = 1, RumSessionPlan_WITH_SESSION_REPLAY = 2, RumSessionPlan_WITH_ERROR_SESSION_REPLAY = 3;
    var RumTrackingType_NOT_TRACKED = "0", RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY = "1", RumTrackingType_TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY = "2", RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY = "3", RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY = "4", RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY = "5", RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY = "6";
    function startRumSessionManager(configuration, lifeCycle) {
        var sessionManager = startSessionManager(configuration, "rum", (function(rawTrackingType) {
            return function(configuration, rawTrackingType) {
                const sessionSampleRate = configuration.sessionSampleRate, sessionOnErrorSampleRate = configuration.sessionOnErrorSampleRate, sessionReplaySampleRate = configuration.sessionReplaySampleRate, sessionReplayOnErrorSampleRate = configuration.sessionReplayOnErrorSampleRate, isSession = performDraw(sessionSampleRate), isErrorSession = performDraw(sessionOnErrorSampleRate), isSessionReplay = performDraw(sessionReplaySampleRate), isErrorSessionReplay = performDraw(sessionReplayOnErrorSampleRate);
                var trackingType;
                !function(trackingType) {
                    return trackingType === RumTrackingType_NOT_TRACKED || trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY || trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY || trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY || trackingType === RumTrackingType_TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY || trackingType === RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY || trackingType === RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY;
                }(rawTrackingType) ? isErrorSession || isSession ? isSession && isSessionReplay ? trackingType = RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY : isSession && isErrorSessionReplay ? trackingType = RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY : !isSession || isSessionReplay || isErrorSessionReplay ? isErrorSession && isSessionReplay ? trackingType = RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY : isErrorSession && isErrorSessionReplay ? trackingType = RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY : !isErrorSession || isSessionReplay || isErrorSessionReplay || (trackingType = RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY) : trackingType = RumTrackingType_TRACKED_WITH_SESSION_AND_WITHOUT_SESSION_REPLAY : trackingType = RumTrackingType_NOT_TRACKED : trackingType = rawTrackingType;
                return {
                    trackingType: trackingType,
                    isTracked: isTypeTracked(trackingType)
                };
            }(configuration, rawTrackingType);
        }));
        return sessionManager.expireObservable.subscribe((function(sessionExpirationTime) {
            lifeCycle.notify(LifeCycleEventType_SESSION_EXPIRED, sessionExpirationTime);
        })), sessionManager.renewObservable.subscribe((function() {
            lifeCycle.notify(LifeCycleEventType_SESSION_RENEWED);
        })), sessionManager.sessionStateUpdateObservable.subscribe((_ref => {
            let previousState = _ref.previousState, newState = _ref.newState;
            if (!previousState.hasError && newState.hasError) {
                const sessionEntity = sessionManager.findSession();
                sessionEntity && (sessionEntity.hasError = !0, sessionEntity.ets = newState.ets || timeStampNow());
            }
            if (!previousState.forcedSession && newState.forcedSession) {
                const sessionEntity = sessionManager.findSession();
                sessionEntity && (sessionEntity.id = newState.id, sessionEntity.isSessionForced = !0, 
                lifeCycle.notify(LifeCycleEventType_SESSION_FORCED));
            }
        })), {
            findTrackedSession: function(startTime) {
                var session = sessionManager.findSession(startTime);
                if (!session) return;
                if (!isTypeTracked(session.trackingType) && !session.isSessionForced) return;
                const isErrorSession = !session.isSessionForced && (session.trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITHOUT_SESSION_REPLAY || session.trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY || session.trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY);
                let plan = RumSessionPlan_WITHOUT_SESSION_REPLAY;
                return session.isSessionForced || session.trackingType === RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_SESSION_REPLAY || session.trackingType === RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_SESSION_REPLAY ? plan = RumSessionPlan_WITH_SESSION_REPLAY : session.trackingType !== RumTrackingType_TRACKED_WITH_ERROR_SESSION_AND_WITH_ERROR_SESSION_REPLAY && session.trackingType !== RumTrackingType_TRACKED_WITH_SESSION_AND_WITH_ERROR_SESSION_REPLAY || (plan = RumSessionPlan_WITH_ERROR_SESSION_REPLAY), 
                {
                    id: session.id,
                    plan: plan,
                    errorSessionReplayAllowed: plan === RumSessionPlan_WITH_ERROR_SESSION_REPLAY,
                    sessionHasError: session.hasError,
                    isErrorSession: isErrorSession,
                    sessionErrorTimestamp: session.ets,
                    isSessionForced: session.isSessionForced,
                    sessionReplayAllowed: plan === RumSessionPlan_WITH_SESSION_REPLAY || plan === RumSessionPlan_WITH_ERROR_SESSION_REPLAY
                };
            },
            expire: sessionManager.expire,
            keepSessionAlive: sessionManager.expandOrRenewSession,
            startSession: function(options) {
                (function(configuration, options) {
                    if (void 0 === options) return !0;
                    if (!options || "object" != typeof options || void 0 !== options.sessionSampleRate && !isPercentage(options.sessionSampleRate)) return display.error("startSession options should contain a sessionSampleRate between 0 and 100"), 
                    !1;
                    void 0 !== options.sessionSampleRate && (configuration.sessionSampleRate = options.sessionSampleRate);
                    return !0;
                })(configuration, options) && sessionManager.renewSession();
            },
            expireObservable: sessionManager.expireObservable,
            sessionStateUpdateObservable: sessionManager.sessionStateUpdateObservable,
            setErrorForSession: () => sessionManager.updateSessionState({
                hasError: "1",
                ets: timeStampNow()
            }),
            setForcedSession: options => {
                sessionManager.forceSession(options && options.refreshView ? previousState => {
                    previousState && previousState.forcedSession && lifeCycle.notify(LifeCycleEventType_SESSION_FORCED);
                } : void 0);
            }
        };
    }
    function isTypeTracked(rumSessionType) {
        return rumSessionType !== RumTrackingType_NOT_TRACKED;
    }
    var startCacheUsrCache = function(configuration) {
        if (!configuration.sessionStoreStrategyType) return {
            getId: tools_noop
        };
        let usrCacheId;
        return usrCacheId = configuration.sessionStoreStrategyType.type === SessionPersistence_COOKIE ? function(cookieOptions) {
            var usrCacheId = cookie_getCookie("_gc_usr_id", cookieOptions);
            return usrCacheId || setCookie("_gc_usr_id", usrCacheId = tools_UUID(), 5184e6, cookieOptions), 
            usrCacheId;
        }(configuration.sessionStoreStrategyType.cookieOptions) : function() {
            var usrCacheId = localStorage.getItem("_gc_usr_id");
            return usrCacheId || (usrCacheId = tools_UUID(), localStorage.setItem("_gc_usr_id", usrCacheId)), 
            usrCacheId;
        }(), {
            getId: function() {
                return usrCacheId;
            }
        };
    };
    function createDOMMutationObservable() {
        var MutationObserver = function() {
            var constructor, browserWindow = window;
            if (browserWindow.Zone && (constructor = getZoneJsOriginalValue(browserWindow, "MutationObserver"), 
            browserWindow.MutationObserver && constructor === browserWindow.MutationObserver)) {
                var originalInstance = getZoneJsOriginalValue(new browserWindow.MutationObserver(tools_noop), "originalInstance");
                constructor = originalInstance && originalInstance.constructor;
            }
            constructor || (constructor = browserWindow.MutationObserver);
            return constructor;
        }();
        return new Observable((function(observable) {
            if (MutationObserver) {
                var observer = new MutationObserver(monitor((function() {
                    return observable.notify();
                })));
                try {
                    observer.observe(document, {
                        attributes: !0,
                        characterData: !0,
                        childList: !0,
                        subtree: !0
                    });
                } catch (err) {}
                return function() {
                    return observer.disconnect();
                };
            }
        }));
    }
    function createLocationChangeObservable(location) {
        var currentLocation = shallowClone(location);
        return new Observable((function(observable) {
            var onHistoryChange, pushState, replaceState, popState, _trackHistory = (onHistoryChange = onLocationChange, 
            pushState = instrumentMethod(getHistoryInstrumentationTarget("pushState"), "pushState", (function(params) {
                (0, params.onPostCall)((function() {
                    onHistoryChange("push");
                }));
            })), replaceState = instrumentMethod(getHistoryInstrumentationTarget("replaceState"), "replaceState", (function(params) {
                (0, params.onPostCall)((function() {
                    onHistoryChange("replace");
                }));
            })), popState = addEventListener(window, DOM_EVENT_POP_STATE, (function() {
                onHistoryChange("traverse");
            })), {
                stop: function() {
                    pushState.stop(), replaceState.stop(), popState.stop();
                }
            }), _trackHash = function(onHashChange) {
                if (window.navigation && window.navigation.addEventListener) return addEventListener(window.navigation, "currententrychange", (function(event) {
                    onHashChange(event.navigationType);
                }));
                return addEventListener(window, DOM_EVENT_HASH_CHANGE, (function() {
                    onHashChange("push");
                }));
            }(onLocationChange);
            function onLocationChange(navigationType) {
                if (currentLocation.href !== location.href) {
                    var newLocation = shallowClone(location);
                    observable.notify({
                        newLocation: newLocation,
                        oldLocation: currentLocation,
                        navigationType: navigationType
                    }), currentLocation = newLocation;
                }
            }
            return function() {
                _trackHistory.stop(), _trackHash.stop();
            };
        }));
    }
    function getHistoryInstrumentationTarget(methodName) {
        return Object.prototype.hasOwnProperty.call(history, methodName) ? history : History.prototype;
    }
    var RESOURCE_TYPES = [ [ enums_ResourceType_DOCUMENT, function(initiatorType) {
        return "initial_document" === initiatorType;
    } ], [ enums_ResourceType_XHR, function(initiatorType) {
        return "xmlhttprequest" === initiatorType;
    } ], [ enums_ResourceType_FETCH, function(initiatorType) {
        return "fetch" === initiatorType;
    } ], [ enums_ResourceType_BEACON, function(initiatorType) {
        return "beacon" === initiatorType;
    } ], [ enums_ResourceType_CSS, function(_, path) {
        return null !== path.match(/\.css$/i);
    } ], [ enums_ResourceType_JS, function(_, path) {
        return null !== path.match(/\.js$/i);
    } ], [ enums_ResourceType_IMAGE, function(initiatorType, path) {
        return includes([ "image", "img", "icon" ], initiatorType) || null !== path.match(/\.(gif|jpg|jpeg|tiff|png|svg|ico)$/i);
    } ], [ enums_ResourceType_FONT, function(_, path) {
        return null !== path.match(/\.(woff|eot|woff2|ttf)$/i);
    } ], [ enums_ResourceType_MEDIA, function(initiatorType, path) {
        return includes([ "audio", "video" ], initiatorType) || null !== path.match(/\.(mp3|mp4)$/i);
    } ] ];
    function computeResourceEntryType(entry) {
        var url = entry.name;
        if (!function(url) {
            try {
                return !!buildUrl(url);
            } catch (e) {
                return !1;
            }
        }(url)) return enums_ResourceType_OTHER;
        var path = function(url) {
            var pathname = buildUrl(url).pathname;
            return "/" === pathname[0] ? pathname : "/" + pathname;
        }(url), type = enums_ResourceType_OTHER;
        return tools_each(RESOURCE_TYPES, (function(res) {
            var _type = res[0];
            if ((0, res[1])(entry.initiatorType, path)) return type = _type, !1;
        })), type;
    }
    function areInOrder() {
        for (var numbers = toArray(arguments), i = 1; i < numbers.length; i += 1) if (numbers[i - 1] > numbers[i]) return !1;
        return !0;
    }
    function computeResourceEntryDeliveryType(entry) {
        return "" === entry.deliveryType ? "other" : entry.deliveryType;
    }
    function computeResourceEntryProtocol(entry) {
        return "" === entry.nextHopProtocol ? void 0 : entry.nextHopProtocol;
    }
    var resourceUtils_HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;
    function isResourceUrlLimit(name, limitSize) {
        return candidate = name, (resourceUtils_HAS_MULTI_BYTES_CHARACTERS.test(candidate) ? void 0 !== window.TextEncoder ? (new TextEncoder).encode(candidate).length : new Blob([ candidate ]).size : candidate.length) > limitSize;
        var candidate;
    }
    function computeResourceEntryDuration(entry) {
        return 0 === entry.duration && entry.startTime < entry.responseEnd ? msToNs(entry.responseEnd - entry.startTime) : msToNs(entry.duration);
    }
    function computePerformanceResourceDetails(entry) {
        if (hasValidResourceEntryTimings(entry)) {
            var startTime = entry.startTime, fetchStart = entry.fetchStart, redirectStart = entry.redirectStart, redirectEnd = entry.redirectEnd, domainLookupStart = entry.domainLookupStart, domainLookupEnd = entry.domainLookupEnd, connectStart = entry.connectStart, secureConnectionStart = entry.secureConnectionStart, connectEnd = entry.connectEnd, requestStart = entry.requestStart, responseStart = entry.responseStart, responseEnd = entry.responseEnd, details = {
                firstbyte: msToNs(responseStart - requestStart),
                trans: msToNs(responseEnd - responseStart),
                downloadTime: formatTiming(startTime, responseStart, responseEnd),
                firstByteTime: formatTiming(startTime, requestStart, responseStart)
            };
            return responseStart > 0 && responseStart <= tools_relativeNow() && (details.ttfb = msToNs(responseStart - requestStart)), 
            connectEnd !== fetchStart && (details.tcp = msToNs(connectEnd - connectStart), details.connectTime = formatTiming(startTime, connectStart, connectEnd), 
            areInOrder(connectStart, secureConnectionStart, connectEnd) && (details.ssl = msToNs(connectEnd - secureConnectionStart), 
            details.sslTime = formatTiming(startTime, secureConnectionStart, connectEnd))), 
            domainLookupEnd !== fetchStart && (details.dns = msToNs(domainLookupEnd - domainLookupStart), 
            details.dnsTime = formatTiming(startTime, domainLookupStart, domainLookupEnd)), 
            hasRedirection(entry) && (details.redirect = msToNs(redirectEnd - redirectStart), 
            details.redirectTime = formatTiming(startTime, redirectStart, redirectEnd)), entry.renderBlockingStatus && (details.renderBlockingStatus = entry.renderBlockingStatus), 
            details;
        }
    }
    function hasValidResourceEntryDuration(entry) {
        return entry.duration >= 0;
    }
    function hasValidResourceEntryTimings(entry) {
        var areCommonTimingsInOrder = areInOrder(entry.startTime, entry.fetchStart, entry.domainLookupStart, entry.domainLookupEnd, entry.connectStart, entry.connectEnd, entry.requestStart, entry.responseStart, entry.responseEnd), areRedirectionTimingsInOrder = !hasRedirection(entry) || areInOrder(entry.startTime, entry.redirectStart, entry.redirectEnd, entry.fetchStart);
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
        return entry.startTime < entry.responseStart ? {
            size: entry.decodedBodySize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            transferSize: entry.transferSize
        } : {
            size: void 0,
            encodedBodySize: void 0,
            decodedBodySize: void 0,
            transferSize: void 0
        };
    }
    function isAllowedRequestUrl(configuration, url) {
        return url && !function(url, configuration) {
            var notTakeRequest = [ configuration.rumEndpoint ];
            return configuration.logsEndpoint && notTakeRequest.push(configuration.logsEndpoint), 
            configuration.sessionReplayEndPoint && notTakeRequest.push(configuration.sessionReplayEndPoint), 
            some(notTakeRequest, (function(takeUrl) {
                return 0 === url.indexOf(takeUrl);
            })) || configuration.isIntakeUrl(url);
        }(url, configuration);
    }
    var DATA_URL_REGEX = /data:(.+)?(;base64)?,/g;
    function isLongDataUrl(url) {
        return !(url.length <= 24e3) && ("data:" === url.substring(0, 5) && (url = url.substring(0, 24e3), 
        !0));
    }
    function sanitizeDataUrl(url) {
        return url.match(DATA_URL_REGEX)[0] + "[...]";
    }
    function retrieveFirstInputTiming(configuration, callback) {
        var startTimeStamp = dateNow(), timingSent = !1, removeEventListeners = addEventListeners(window, [ DOM_EVENT_CLICK, DOM_EVENT_MOUSE_DOWN, DOM_EVENT_KEY_DOWN, DOM_EVENT_TOUCH_START, DOM_EVENT_POINTER_DOWN ], (function(evt) {
            if (evt.cancelable) {
                var timing = {
                    entryType: "first-input",
                    processingStart: tools_relativeNow(),
                    processingEnd: tools_relativeNow(),
                    startTime: evt.timeStamp,
                    duration: 0,
                    name: "",
                    cancelable: !1,
                    target: null,
                    toJSON: function() {
                        return {};
                    }
                };
                evt.type === DOM_EVENT_POINTER_DOWN ? function(timing) {
                    addEventListeners(window, [ DOM_EVENT_POINTER_UP, DOM_EVENT_POINTER_CANCEL ], (function(event) {
                        event.type === DOM_EVENT_POINTER_UP && sendTiming(timing);
                    }), {
                        once: !0
                    });
                }(timing) : sendTiming(timing);
            }
        }), {
            passive: !0,
            capture: !0
        }).stop;
        return {
            stop: removeEventListeners
        };
        function sendTiming(timing) {
            if (!timingSent) {
                timingSent = !0, removeEventListeners();
                var delay = timing.processingStart - timing.startTime;
                delay >= 0 && delay < dateNow() - startTimeStamp && callback(timing);
            }
        }
    }
    var resourceTimingBufferFullListener, RumPerformanceEntryType_EVENT = "event", RumPerformanceEntryType_FIRST_INPUT = "first-input", RumPerformanceEntryType_LARGEST_CONTENTFUL_PAINT = "largest-contentful-paint", RumPerformanceEntryType_LAYOUT_SHIFT = "layout-shift", RumPerformanceEntryType_LONG_TASK = "longtask", RumPerformanceEntryType_NAVIGATION = "navigation", RumPerformanceEntryType_PAINT = "paint", RumPerformanceEntryType_RESOURCE = "resource", RumPerformanceEntryType_VISIBILITY_STATE = "visibility-state";
    function createPerformanceObservable(configuration, options) {
        return new Observable((function(observable) {
            if (!window.PerformanceObserver) return;
            var timeoutId, handlePerformanceEntries = function(entries) {
                var rumPerformanceEntries = function(configuration, entries) {
                    return entries.filter((function(entry) {
                        return !function(configuration, entry) {
                            return !(entry.entryType !== RumPerformanceEntryType_RESOURCE || isAllowedRequestUrl(configuration, entry.name) && hasValidResourceEntryDuration(entry));
                        }(configuration, entry);
                    }));
                }(configuration, entries);
                rumPerformanceEntries.length > 0 && observable.notify(rumPerformanceEntries);
            }, isObserverInitializing = !0;
            const observer = new PerformanceObserver(monitor((function(entries) {
                isObserverInitializing ? timeoutId = timer_setTimeout((function() {
                    handlePerformanceEntries(entries.getEntries());
                })) : handlePerformanceEntries(entries.getEntries());
            })));
            try {
                observer.observe(options);
            } catch (_unused) {
                if (includes([ RumPerformanceEntryType_RESOURCE, RumPerformanceEntryType_NAVIGATION, RumPerformanceEntryType_LONG_TASK, RumPerformanceEntryType_PAINT ], options.type)) {
                    options.buffered && (timeoutId = timer_setTimeout((function() {
                        handlePerformanceEntries(performance.getEntriesByType(options.type));
                    })));
                    try {
                        observer.observe({
                            entryTypes: [ options.type ]
                        });
                    } catch (_unused2) {
                        return;
                    }
                }
            }
            var stopFirstInputTiming;
            if (isObserverInitializing = !1, function(configuration) {
                !resourceTimingBufferFullListener && void 0 !== window.performance && "getEntries" in performance && "addEventListener" in performance && (resourceTimingBufferFullListener = addEventListener(performance, "resourcetimingbufferfull", (function() {
                    performance.clearResourceTimings();
                })));
            }(), !supportPerformanceTimingEvent(RumPerformanceEntryType_FIRST_INPUT) && options.type === RumPerformanceEntryType_FIRST_INPUT) {
                var _retrieveFirstInputTiming = retrieveFirstInputTiming(0, (function(timing) {
                    handlePerformanceEntries([ timing ]);
                }));
                stopFirstInputTiming = _retrieveFirstInputTiming.stop;
            }
            return function() {
                observer.disconnect(), stopFirstInputTiming && stopFirstInputTiming(), timer_clearTimeout(timeoutId);
            };
        }));
    }
    function supportPerformanceTimingEvent(entryType) {
        return window.PerformanceObserver && void 0 !== PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes(entryType);
    }
    var PageState_ACTIVE = "active", PageState_PASSIVE = "passive", PageState_HIDDEN = "hidden", PageState_FROZEN = "frozen", PageState_TERMINATED = "terminated";
    function startPageStateHistory(maxPageStateEntriesSelectable) {
        void 0 === maxPageStateEntriesSelectable && (maxPageStateEntriesSelectable = 500);
        var currentPageState, pageStateEntryHistory = createValueHistory({
            expireDelay: 144e5,
            maxEntries: 4e3
        });
        if (supportPerformanceTimingEvent(RumPerformanceEntryType_VISIBILITY_STATE)) {
            performance.getEntriesByType(RumPerformanceEntryType_VISIBILITY_STATE).forEach((entry => {
                addPageState("hidden" === entry.name ? PageState_HIDDEN : PageState_ACTIVE, entry.startTime);
            }));
        }
        addPageState(getPageState(), tools_relativeNow());
        var stopEventListeners = addEventListeners(window, [ DOM_EVENT_PAGE_SHOW, DOM_EVENT_FOCUS, DOM_EVENT_BLUR, DOM_EVENT_VISIBILITY_CHANGE, DOM_EVENT_RESUME, DOM_EVENT_FREEZE, DOM_EVENT_PAGE_HIDE ], (function(event) {
            addPageState(function(event) {
                if (event.type === DOM_EVENT_FREEZE) return PageState_FROZEN;
                if (event.type === DOM_EVENT_PAGE_HIDE) return event.persisted ? PageState_FROZEN : PageState_TERMINATED;
                return getPageState();
            }(event), event.timeStamp);
        }), {
            capture: !0
        }).stop;
        function addPageState(nextPageState, startTime) {
            void 0 === startTime && (startTime = tools_relativeNow()), nextPageState !== currentPageState && (currentPageState = nextPageState, 
            pageStateEntryHistory.closeActive(startTime), pageStateEntryHistory.add({
                state: currentPageState,
                startTime: startTime
            }, startTime));
        }
        const pageStateHistory = {
            findAll: function(startTime, duration) {
                return function(pageStateEntries, eventStartTime, maxPageStateEntriesSelectable) {
                    if (0 === pageStateEntries.length) return;
                    return pageStateEntries.slice(-maxPageStateEntriesSelectable).reverse().map((_ref => {
                        let state = _ref.state, startTime = _ref.startTime;
                        return {
                            state: state,
                            start: tools_toServerDuration(tools_elapsed(eventStartTime, startTime))
                        };
                    }));
                }(pageStateEntryHistory.findAll(startTime, duration), startTime, maxPageStateEntriesSelectable);
            },
            wasInPageStateAt: function(state, startTime) {
                return pageStateHistory.wasInPageStateDuringPeriod(state, startTime, 0);
            },
            wasInPageStateDuringPeriod: function(state, startTime, duration) {
                return pageStateEntryHistory.findAll(startTime, duration).some((function(pageState) {
                    return pageState.state === state;
                }));
            },
            addPageState: addPageState,
            stop: function() {
                stopEventListeners(), pageStateEntryHistory.stop();
            }
        };
        return pageStateHistory;
    }
    function getPageState() {
        return "hidden" === document.visibilityState ? PageState_HIDDEN : document.hasFocus() ? PageState_ACTIVE : PageState_PASSIVE;
    }
    function processAction(action, pageStateHistory) {
        var _action$context, autoActionProperties = isAutoAction(action) ? {
            action: {
                error: {
                    count: action.counts.errorCount
                },
                id: action.id,
                loadingTime: discardNegativeDuration(tools_toServerDuration(action.duration)),
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
                loadingTime: (null === (_action$context = action.context) || void 0 === _action$context ? void 0 : _action$context.duration) || 0
            }
        };
        return {
            customerContext: isAutoAction(action) ? void 0 : action.context,
            rawRumEvent: extend2Lev({
                action: {
                    id: tools_UUID(),
                    target: {
                        name: action.name
                    },
                    type: action.type
                },
                date: action.startClocks.timeStamp,
                type: enums_RumEventType.ACTION,
                view: {
                    in_foreground: pageStateHistory.wasInPageStateAt(PageState_ACTIVE, action.startClocks.relative)
                }
            }, autoActionProperties),
            startTime: action.startClocks.relative,
            domainContext: isAutoAction(action) ? {
                event: action.event,
                events: action.events
            } : {}
        };
    }
    function isAutoAction(action) {
        return action.type === ActionType_CLICK;
    }
    var EncoderStreamId_RUM = 2, EncoderStreamId_RUM_INITIAL_VIEW = 3;
    var SessionType_SYNTHETICS = "synthetics", SessionType_USER = "user", VIEW_MODIFIABLE_FIELD_PATHS = {
        "view.url": "string",
        "view.referrer": "string"
    }, USER_CUSTOMIZABLE_FIELD_PATHS = {
        context: "object"
    };
    const ROOT_MODIFIABLE_FIELD_PATHS = {
        service: "string",
        version: "string"
    };
    var viewportObservable, modifiableFieldPathsByEvent = {};
    function shouldSend(event, beforeSend, domainContext, eventRateLimiters) {
        if (beforeSend) {
            var result = limitModification(event, modifiableFieldPathsByEvent[event.type], (function(event) {
                return beforeSend(event, domainContext);
            }));
            if (!1 === result && event.type !== enums_RumEventType.VIEW) return !1;
            !1 === result && display.warn("Can't dismiss view events using beforeSend!");
        }
        var rateLimitReached = !1;
        return eventRateLimiters[event.type] && (rateLimitReached = eventRateLimiters[event.type].isLimitReached()), 
        !rateLimitReached;
    }
    function needToAssembleWithAction(event) {
        return -1 !== [ enums_RumEventType.ERROR, enums_RumEventType.RESOURCE, enums_RumEventType.LONG_TASK ].indexOf(event.type);
    }
    function getSessionType() {
        return void 0 === window._DATAFLUX_SYNTHETICS_BROWSER ? SessionType_USER : SessionType_SYNTHETICS;
    }
    function initViewportObservable() {
        return viewportObservable || (viewportObservable = new Observable((function(observable) {
            var updateDimension = throttle((function() {
                observable.notify(getViewportDimension());
            }), 200).throttled;
            return addEventListener(window, DOM_EVENT_RESIZE, updateDimension, {
                capture: !0,
                passive: !0
            }).stop;
        }))), viewportObservable;
    }
    function getViewportDimension() {
        var visual = window.visualViewport;
        return visual ? {
            width: Number(visual.width * visual.scale),
            height: Number(visual.height * visual.scale)
        } : {
            width: Number(window.innerWidth || 0),
            height: Number(window.innerHeight || 0)
        };
    }
    function startViewContexts(lifeCycle) {
        var viewContextHistory = createValueHistory({
            expireDelay: 144e5
        });
        return lifeCycle.subscribe(LifeCycleEventType_BEFORE_VIEW_CREATED, (function(view) {
            viewContextHistory.add(function(view) {
                return {
                    service: view.service,
                    version: view.version,
                    context: view.context,
                    id: view.id,
                    name: view.name,
                    path: tools_urlParse(view.url || location.href).getParse().Path,
                    startClocks: view.startClocks
                };
            }(view), view.startClocks.relative);
        })), lifeCycle.subscribe(LifeCycleEventType_AFTER_VIEW_ENDED, (function(data) {
            viewContextHistory.closeActive(data.endClocks.relative);
        })), lifeCycle.subscribe(LifeCycleEventType_BEFORE_VIEW_UPDATED, (viewUpdate => {
            const currentView = viewContextHistory.find(viewUpdate.startClocks.relative);
            currentView && viewUpdate.name && (currentView.name = viewUpdate.name), currentView && viewUpdate.context && (currentView.context = viewUpdate.context);
        })), lifeCycle.subscribe(LifeCycleEventType_SESSION_RENEWED, (function() {
            viewContextHistory.reset();
        })), {
            findView: function(startTime, options) {
                return viewContextHistory.find(startTime, options);
            },
            stop: function() {
                viewContextHistory.stop();
            }
        };
    }
    function startErrorCollection(lifeCycle, configuration, sessionManager, pageStateHistory) {
        var errorObservable = new Observable;
        !function(errorObservable) {
            var subscription = initConsoleObservable([ ConsoleApiName.error ]).subscribe((function(consoleLog) {
                errorObservable.notify(consoleLog.error);
            }));
        }(errorObservable), function(errorObservable) {
            startUnhandledErrorCollection((function(stackTrace, originalError) {
                errorObservable.notify(computeRawError({
                    stackTrace: stackTrace,
                    originalError: originalError,
                    startClocks: clocksNow(),
                    nonErrorPrefix: NonErrorPrefix_UNCAUGHT,
                    source: ErrorSource_SOURCE,
                    handling: ErrorHandling_UNHANDLED
                }));
            }));
        }(errorObservable), function(configuration, errorObservable) {
            var subscription = initReportObservable(0, [ RawReportType_cspViolation, RawReportType_intervention ]).subscribe((function(reportError) {
                errorObservable.notify({
                    startClocks: clocksNow(),
                    message: reportError.message,
                    stack: reportError.stack,
                    type: reportError.type,
                    source: ErrorSource_REPORT,
                    handling: ErrorHandling_UNHANDLED
                });
            }));
        }(0, errorObservable);
        let hasError = !1;
        lifeCycle.subscribe(LifeCycleEventType_SESSION_RENEWED, (function() {
            hasError = !1;
        }));
        var markSessionOnError = function() {
            const session = sessionManager.findTrackedSession();
            !function(session) {
                return session && (session.isErrorSession || !0 === session.errorSessionReplayAllowed);
            }(session) || hasError || session.sessionHasError || (sessionManager.setErrorForSession(), 
            hasError = !0);
        };
        errorObservable.subscribe((function(error) {
            markSessionOnError(), lifeCycle.notify(LifeCycleEventType_RAW_ERROR_COLLECTED, {
                error: error
            });
        }));
        var errorCollection = function(lifeCycle, pageStateHistory) {
            return lifeCycle.subscribe(LifeCycleEventType_RAW_ERROR_COLLECTED, (function(error) {
                lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, tools_assign({
                    customerContext: error.customerContext,
                    savedCommonContext: error.savedCommonContext
                }, function(error, pageStateHistory) {
                    return {
                        rawRumEvent: {
                            date: error.startClocks.timeStamp,
                            error: {
                                id: tools_UUID(),
                                message: error.message,
                                source: error.source,
                                stack: error.stack,
                                handling_stack: error.handlingStack,
                                type: error.type,
                                handling: error.handling,
                                causes: error.causes,
                                source_type: "browser"
                            },
                            type: enums_RumEventType.ERROR,
                            view: {
                                in_foreground: pageStateHistory.wasInPageStateAt(PageState_ACTIVE, error.startClocks.relative)
                            }
                        },
                        startTime: error.startClocks.relative,
                        domainContext: {
                            error: error.originalError
                        }
                    };
                }(error.error, pageStateHistory)));
            })), {
                addError: function(providedError, savedCommonContext) {
                    var error = providedError.error, rawError = computeRawError({
                        stackTrace: error instanceof Error ? computeStackTrace(error) : void 0,
                        originalError: error,
                        handlingStack: providedError.handlingStack,
                        startClocks: providedError.startClocks,
                        nonErrorPrefix: NonErrorPrefix_PROVIDED,
                        source: ErrorSource_CUSTOM,
                        handling: ErrorHandling_HANDLED
                    });
                    lifeCycle.notify(LifeCycleEventType_RAW_ERROR_COLLECTED, {
                        customerContext: providedError.context,
                        savedCommonContext: savedCommonContext,
                        error: rawError
                    });
                }
            };
        }(lifeCycle, pageStateHistory);
        return {
            addError: function(providedError, savedCommonContext) {
                markSessionOnError(), errorCollection.addError(providedError, savedCommonContext);
            }
        };
    }
    var supportScopeSelectorCache, STABLE_ATTRIBUTES = [ "data-guance-action-name", "data-testid", "data-test", "data-qa", "data-cy", "data-test-id", "data-qa-id", "data-testing", "data-component", "data-element", "data-source-file" ], GLOBALLY_UNIQUE_SELECTOR_GETTERS = [ getStableAttributeSelector, function(element) {
        if (element.id && !isGeneratedValue(element.id)) return "#" + cssEscape(element.id);
    } ], UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS = [ getStableAttributeSelector, function(element) {
        if ("BODY" === element.tagName) return;
        if (element.classList.length > 0) for (var i = 0; i < element.classList.length; i += 1) {
            var className = element.classList[i];
            if (!isGeneratedValue(className)) return cssEscape(element.tagName) + "." + cssEscape(className);
        }
    }, function(element) {
        return cssEscape(element.tagName);
    } ];
    function getSelectorFromElement(targetElement, actionNameAttribute) {
        if (function(element) {
            if ("isConnected" in element) return element.isConnected;
            return element.ownerDocument.documentElement.contains(element);
        }(targetElement)) {
            for (var subtrees = function(element) {
                var result = [], currentTarget = element;
                for (;currentTarget; ) {
                    var rootNode = "function" == typeof currentTarget.getRootNode ? currentTarget.getRootNode() : currentTarget.ownerDocument;
                    if (result.push({
                        rootNode: rootNode,
                        target: currentTarget
                    }), !isNodeShadowRoot(rootNode)) break;
                    currentTarget = rootNode.host;
                }
                return result.reverse();
            }(targetElement), selectorParts = [], index = 0; index < subtrees.length; index += 1) {
                var subtree = subtrees[index], selector = getSelectorFromElementWithinSubtree(subtree.target, subtree.rootNode, actionNameAttribute);
                if (!selector) return;
                selectorParts.push(selector);
            }
            return selectorParts.join("::shadow ");
        }
    }
    function getSelectorFromElementWithinSubtree(targetElement, rootNode, actionNameAttribute) {
        for (var targetElementSelector, currentElement = targetElement; currentElement && "HTML" !== currentElement.nodeName; ) {
            const globallyUniqueSelector = findSelector(currentElement, rootNode, GLOBALLY_UNIQUE_SELECTOR_GETTERS, isSelectorUniqueWithinRoot, actionNameAttribute, targetElementSelector);
            if (globallyUniqueSelector) return globallyUniqueSelector;
            targetElementSelector = findSelector(currentElement, rootNode, UNIQUE_AMONG_CHILDREN_SELECTOR_GETTERS, isSelectorUniqueAmongSiblings, actionNameAttribute, targetElementSelector) || combineSelector(getPositionSelector(currentElement), targetElementSelector), 
            currentElement = currentElement.parentElement;
        }
        return targetElementSelector;
    }
    function isGeneratedValue(value) {
        return /[0-9]/.test(value);
    }
    function getStableAttributeSelector(element, actionNameAttribute) {
        if (actionNameAttribute && (selector = getAttributeSelector(actionNameAttribute))) return selector;
        for (var i = 0; i < STABLE_ATTRIBUTES.length; i++) {
            var selector;
            if (selector = getAttributeSelector(STABLE_ATTRIBUTES[i])) return selector;
        }
        function getAttributeSelector(attributeName) {
            if (element.hasAttribute(attributeName)) return cssEscape(element.tagName) + "[" + attributeName + '="' + cssEscape(element.getAttribute(attributeName)) + '"]';
        }
    }
    function getPositionSelector(element) {
        for (var parentNode = element.parentNode, sibling = parentNode && parentNode.firstElementChild, elementIndex = 1; sibling && sibling !== element; ) sibling.tagName === element.tagName && (elementIndex += 1), 
        sibling = sibling.nextElementSibling;
        var tagName = cssEscape(element.tagName);
        return /^::/.test(tagName) ? tagName : tagName + ":nth-of-type(" + elementIndex + ")";
    }
    function findSelector(element, rootNode, selectorGetters, predicate, actionNameAttribute, childSelector) {
        for (var i = 0; i < selectorGetters.length; i++) {
            var elementSelector = (0, selectorGetters[i])(element, actionNameAttribute);
            if (elementSelector && predicate(element, rootNode, elementSelector, childSelector)) return combineSelector(elementSelector, childSelector);
        }
    }
    function isSelectorUniqueWithinRoot(element, rootNode, elementSelector, childSelector) {
        return 1 === rootNode.querySelectorAll(combineSelector(elementSelector, childSelector)).length;
    }
    function isSelectorUniqueAmongSiblings(currentElement, rootNode, currentElementSelector, childSelector) {
        let isSiblingMatching;
        if (void 0 === childSelector) isSiblingMatching = sibling => sibling.matches(currentElementSelector); else {
            const scopedSelector = function() {
                if (void 0 === supportScopeSelectorCache) try {
                    document.querySelector(":scope"), supportScopeSelectorCache = !0;
                } catch (_unused) {
                    supportScopeSelectorCache = !1;
                }
                return supportScopeSelectorCache;
            }() ? combineSelector("".concat(currentElementSelector, ":scope"), childSelector) : combineSelector(currentElementSelector, childSelector);
            isSiblingMatching = sibling => null !== sibling.querySelector(scopedSelector);
        }
        let sibling = currentElement.previousElementSibling;
        for (;sibling; ) {
            if (isSiblingMatching(sibling)) return !1;
            sibling = sibling.previousElementSibling;
        }
        for (sibling = currentElement.nextElementSibling; sibling; ) {
            if (isSiblingMatching(sibling)) return !1;
            sibling = sibling.nextElementSibling;
        }
        return !0;
    }
    function combineSelector(parent, child) {
        return child ? parent + ">" + child : parent;
    }
    function getNavigationEntry() {
        if (supportPerformanceTimingEvent(RumPerformanceEntryType_NAVIGATION)) {
            var navigationEntry = performance.getEntriesByType(RumPerformanceEntryType_NAVIGATION)[0];
            if (navigationEntry) return navigationEntry;
        }
        var timings = function() {
            var result = {}, timing = performance.timing;
            for (var key in timing) if (isNumber(timing[key])) {
                var numberKey = key, timingElement = timing[numberKey];
                result[numberKey] = 0 === timingElement ? 0 : getRelativeTime(timingElement);
            }
            return result;
        }(), entry = tools_assign({
            entryType: RumPerformanceEntryType_NAVIGATION,
            initiatorType: "navigation",
            name: window.location.href,
            startTime: 0,
            duration: timings.responseEnd,
            decodedBodySize: 0,
            encodedBodySize: 0,
            transferSize: 0,
            toJSON: function() {
                return tools_assign({}, entry, {
                    toJSON: void 0
                });
            }
        }, timings);
        return entry;
    }
    function trackNavigationTimings(configuration, callback, getNavigationEntryImpl) {
        return void 0 === getNavigationEntryImpl && (getNavigationEntryImpl = getNavigationEntry), 
        function(callback) {
            var timeoutId, _runOnReadyState = runOnReadyState("complete", (function() {
                timeoutId = timer_setTimeout((function() {
                    callback();
                }));
            }));
            return {
                stop: function() {
                    _runOnReadyState.stop(), timer_clearTimeout(timeoutId);
                }
            };
        }((function() {
            var entry = getNavigationEntryImpl();
            (function(entry) {
                return entry.loadEventEnd <= 0;
            })(entry) || callback(function(entry) {
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
                    firstByte: entry.responseStart >= 0 && entry.responseStart <= tools_relativeNow() ? entry.responseStart : void 0
                };
            }(entry));
        }));
    }
    function trackFirstHidden(viewStart, eventTarget) {
        if (void 0 === eventTarget && (eventTarget = window), "hidden" === document.visibilityState && !document.prerendering) return {
            getTimeStamp: () => 0,
            stop: tools_noop
        };
        if (supportPerformanceTimingEvent(RumPerformanceEntryType_VISIBILITY_STATE) && !document.prerendering) {
            const firstHiddenEntry = performance.getEntriesByType(RumPerformanceEntryType_VISIBILITY_STATE).filter((entry => "hidden" === entry.name)).find((entry => entry.startTime >= viewStart.relative));
            if (firstHiddenEntry) return {
                getTimeStamp: () => firstHiddenEntry.startTime,
                stop: tools_noop
            };
        }
        let timeStamp = 1 / 0;
        const stop = addEventListeners(eventTarget, [ DOM_EVENT_PAGE_HIDE, DOM_EVENT_VISIBILITY_CHANGE, DOM_EVENT_PRERENDERING_CHANGE ], (event => {
            event.type !== DOM_EVENT_PAGE_HIDE && "hidden" !== document.visibilityState || (timeStamp = event.timeStamp, 
            stop());
        }), {
            capture: !0
        }).stop;
        return {
            getTimeStamp: function() {
                return timeStamp;
            },
            stop: function() {
                stop();
            }
        };
    }
    function trackInitialViewMetrics(configuration, viewStart, setLoadEvent, scheduleViewUpdate) {
        var initialViewMetrics = {}, _trackNavigationTimings = trackNavigationTimings(0, (function(navigationTimings) {
            setLoadEvent(navigationTimings.loadEvent), initialViewMetrics.navigationTimings = navigationTimings, 
            scheduleViewUpdate();
        })), firstHidden = trackFirstHidden(viewStart), stopNavigationTracking = _trackNavigationTimings.stop, stopFCPTracking = function(configuration, firstHidden, callback) {
            return {
                stop: createPerformanceObservable(configuration, {
                    type: RumPerformanceEntryType_PAINT,
                    buffered: !0
                }).subscribe((function(entries) {
                    var fcpEntry = find(entries, (function(entry) {
                        return entry.entryType === RumPerformanceEntryType_PAINT && "first-contentful-paint" === entry.name && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < 6e5;
                    }));
                    fcpEntry && callback(fcpEntry.startTime);
                })).unsubscribe
            };
        }(configuration, firstHidden, (function(firstContentfulPaint) {
            initialViewMetrics.firstContentfulPaint = firstContentfulPaint, scheduleViewUpdate();
        })).stop, stopLCPTracking = function(configuration, firstHidden, eventTarget, callback) {
            var firstInteractionTimestamp = 1 / 0, stopEventListener = addEventListeners(eventTarget, [ DOM_EVENT_POINTER_DOWN, DOM_EVENT_KEY_DOWN ], (function(event) {
                firstInteractionTimestamp = event.timeStamp;
            }), {
                capture: !0,
                once: !0
            }).stop, biggestLcpSize = 0, performanceLcpSubscription = createPerformanceObservable(configuration, {
                type: RumPerformanceEntryType_LARGEST_CONTENTFUL_PAINT,
                buffered: !0
            }).subscribe((function(entries) {
                var lcpTargetSelector, lcpEntry = function(array, predicate) {
                    for (var i = array.length - 1; i >= 0; i -= 1) {
                        var item = array[i];
                        if (predicate(item, i, array)) return item;
                    }
                }(entries, (function(entry) {
                    return entry.entryType === RumPerformanceEntryType_LARGEST_CONTENTFUL_PAINT && entry.startTime < firstInteractionTimestamp && entry.startTime < firstHidden.getTimeStamp() && entry.startTime < 6e5 && entry.size > biggestLcpSize;
                }));
                lcpEntry && (lcpEntry.element && (lcpTargetSelector = getSelectorFromElement(lcpEntry.element, configuration.actionNameAttribute)), 
                callback({
                    value: lcpEntry.startTime,
                    targetSelector: lcpTargetSelector
                }), biggestLcpSize = lcpEntry.size);
            }));
            return {
                stop: function() {
                    stopEventListener(), performanceLcpSubscription.unsubscribe();
                }
            };
        }(configuration, firstHidden, window, (function(largestContentfulPaint) {
            initialViewMetrics.largestContentfulPaint = largestContentfulPaint, scheduleViewUpdate();
        })).stop, stopFIDTracking = function(configuration, firstHidden, callback) {
            const performanceFirstInputSubscription = createPerformanceObservable(configuration, {
                type: RumPerformanceEntryType_FIRST_INPUT,
                buffered: !0
            }).subscribe((function(entries) {
                var firstInputEntry = find(entries, (function(entry) {
                    return entry.entryType === RumPerformanceEntryType_FIRST_INPUT && entry.startTime < firstHidden.getTimeStamp();
                }));
                if (firstInputEntry) {
                    var firstInputTargetSelector, firstInputDelay = tools_elapsed(firstInputEntry.startTime, firstInputEntry.processingStart);
                    firstInputEntry.target && isElementNode(firstInputEntry.target) && (firstInputTargetSelector = getSelectorFromElement(firstInputEntry.target, configuration.actionNameAttribute)), 
                    callback({
                        delay: firstInputDelay >= 0 ? firstInputDelay : 0,
                        time: firstInputEntry.startTime,
                        targetSelector: firstInputTargetSelector
                    });
                }
            }));
            return {
                stop: function() {
                    performanceFirstInputSubscription.unsubscribe();
                }
            };
        }(configuration, firstHidden, (function(firstInput) {
            initialViewMetrics.firstInput = firstInput, scheduleViewUpdate();
        })).stop;
        return {
            stop: function() {
                stopNavigationTracking(), stopFCPTracking(), stopLCPTracking(), stopFIDTracking(), 
                firstHidden.stop();
            },
            initialViewMetrics: initialViewMetrics
        };
    }
    function trackScrollMetrics(configuration, viewStart, callback, scrollValues) {
        void 0 === scrollValues && (scrollValues = function(configuration, throttleDuration) {
            void 0 === throttleDuration && (throttleDuration = 1e3);
            return new Observable((function(observable) {
                function notify() {
                    var scrollTop, height, scrollHeight, scrollDepth, scrollY, visual;
                    observable.notify((visual = window.visualViewport, scrollY = visual ? visual.pageTop - visual.offsetTop : void 0 !== window.scrollY ? window.scrollY : window.pageYOffset || 0, 
                    scrollTop = Math.round(scrollY), height = getViewportDimension().height, scrollHeight = Math.round((document.scrollingElement || document.documentElement).scrollHeight), 
                    scrollDepth = Math.round(height + scrollTop), {
                        scrollHeight: scrollHeight,
                        scrollDepth: scrollDepth,
                        scrollTop: scrollTop
                    }));
                }
                if (window.ResizeObserver) {
                    var throttledNotify = throttle(notify, throttleDuration, {
                        leading: !1,
                        trailing: !0
                    }), observerTarget = document.scrollingElement || document.documentElement, resizeObserver = new ResizeObserver(monitor(throttledNotify.throttled));
                    observerTarget && resizeObserver.observe(observerTarget);
                    var eventListener = addEventListener(window, DOM_EVENT_SCROLL, throttledNotify.throttled, {
                        passive: !0
                    });
                    return function() {
                        throttledNotify.cancel(), resizeObserver.unobserve(observerTarget), eventListener.stop();
                    };
                }
            }));
        }());
        var maxScrollDepth = 0, maxScrollHeight = 0, maxScrollHeightTime = 0, subscription = scrollValues.subscribe((function(data) {
            var scrollDepth = data.scrollDepth, scrollTop = data.scrollTop, scrollHeight = data.scrollHeight, shouldUpdate = !1;
            if (scrollDepth > maxScrollDepth && (maxScrollDepth = scrollDepth, shouldUpdate = !0), 
            scrollHeight > maxScrollHeight) {
                maxScrollHeight = scrollHeight;
                var now = tools_relativeNow();
                maxScrollHeightTime = tools_elapsed(viewStart.relative, now), shouldUpdate = !0;
            }
            shouldUpdate && callback({
                maxDepth: Math.min(maxScrollDepth, maxScrollHeight),
                maxDepthScrollTop: scrollTop,
                maxScrollHeight: maxScrollHeight,
                maxScrollHeightTime: maxScrollHeightTime
            });
        }));
        return {
            stop: function() {
                return subscription.unsubscribe();
            }
        };
    }
    function waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, pageActivityEndCallback, maxDuration) {
        return function(pageActivityObservable, pageActivityEndCallback, maxDuration) {
            var pageActivityEndTimeoutId, hasCompleted = !1, validationTimeoutId = timer_setTimeout((function() {
                complete({
                    hadActivity: !1
                });
            }), 100), maxDurationTimeoutId = void 0 !== maxDuration ? timer_setTimeout((function() {
                return complete({
                    hadActivity: !0,
                    end: timeStampNow()
                });
            }), maxDuration) : void 0, pageActivitySubscription = pageActivityObservable.subscribe((function(data) {
                var isBusy = data.isBusy;
                timer_clearTimeout(validationTimeoutId), timer_clearTimeout(pageActivityEndTimeoutId);
                var lastChangeTime = timeStampNow();
                isBusy || (pageActivityEndTimeoutId = timer_setTimeout((function() {
                    complete({
                        hadActivity: !0,
                        end: lastChangeTime
                    });
                }), 100));
            })), stop = function() {
                hasCompleted = !0, timer_clearTimeout(validationTimeoutId), timer_clearTimeout(pageActivityEndTimeoutId), 
                timer_clearTimeout(maxDurationTimeoutId), pageActivitySubscription.unsubscribe();
            };
            function complete(event) {
                hasCompleted || (stop && stop(), pageActivityEndCallback(event));
            }
            return {
                stop: stop
            };
        }(function(lifeCycle, domMutationObservable, configuration) {
            return new Observable((function(observable) {
                var firstRequestIndex, subscriptions = [], pendingRequestsCount = 0;
                subscriptions.push(domMutationObservable.subscribe((() => {
                    notifyPageActivity();
                })), createPerformanceObservable(configuration, {
                    type: RumPerformanceEntryType_RESOURCE
                }).subscribe((function(entries) {
                    some(entries, (function(entry) {
                        return !isExcludedUrl(configuration, entry.name);
                    })) && notifyPageActivity();
                })), lifeCycle.subscribe(LifeCycleEventType_REQUEST_STARTED, (function(startEvent) {
                    isExcludedUrl(configuration, startEvent.url) || (void 0 === firstRequestIndex && (firstRequestIndex = startEvent.requestIndex), 
                    pendingRequestsCount += 1, notifyPageActivity());
                })), lifeCycle.subscribe(LifeCycleEventType_REQUEST_COMPLETED, (function(request) {
                    isExcludedUrl(configuration, request.url) || void 0 === firstRequestIndex || request.requestIndex < firstRequestIndex || (pendingRequestsCount -= 1, 
                    notifyPageActivity());
                })));
                var stopTrackingWindowOpen = instrumentMethod(window, "open", notifyPageActivity).stop;
                return function() {
                    stopTrackingWindowOpen(), tools_each(subscriptions, (function(s) {
                        s.unsubscribe();
                    }));
                };
                function notifyPageActivity() {
                    observable.notify({
                        isBusy: pendingRequestsCount > 0
                    });
                }
            }));
        }(lifeCycle, domMutationObservable, configuration), pageActivityEndCallback, maxDuration);
    }
    function isExcludedUrl(configuration, requestUrl) {
        return matchList(configuration.excludedActivityUrls, requestUrl);
    }
    function trackCumulativeLayoutShift(configuration, viewStart, callback) {
        if (!isLayoutShiftSupported()) return {
            stop: tools_noop
        };
        var maxClsTarget, maxClsStartTime, maxClsValue = 0;
        callback({
            value: 0
        });
        var window = function() {
            var startTime, endTime, cumulatedValue = 0, maxValue = 0;
            return {
                update: function(entry) {
                    var isMaxValue;
                    return void 0 === startTime || entry.startTime - endTime >= 1e3 || entry.startTime - startTime >= 25e3 ? (startTime = endTime = entry.startTime, 
                    maxValue = cumulatedValue = entry.value, isMaxValue = !0) : (cumulatedValue += entry.value, 
                    endTime = entry.startTime, (isMaxValue = entry.value > maxValue) && (maxValue = entry.value)), 
                    {
                        cumulatedValue: cumulatedValue,
                        isMaxValue: isMaxValue
                    };
                }
            };
        }(), performanceSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType_LAYOUT_SHIFT,
            buffered: !0
        }).subscribe((function(entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                if (!(entry.hadRecentInput || entry.startTime < viewStart)) {
                    var _update = window.update(entry), cumulatedValue = _update.cumulatedValue;
                    if (_update.isMaxValue) {
                        var target = getTargetFromSource(entry.sources);
                        maxClsTarget = target ? new WeakRef(target) : void 0, maxClsStartTime = tools_elapsed(viewStart, entry.startTime);
                    }
                    if (cumulatedValue > maxClsValue) {
                        maxClsValue = cumulatedValue;
                        target = maxClsTarget && maxClsTarget.deref();
                        callback({
                            value: round(maxClsValue, 4),
                            targetSelector: target && getSelectorFromElement(target, configuration.actionNameAttribute),
                            time: maxClsStartTime
                        });
                    }
                }
            }
        }));
        return {
            stop: function() {
                performanceSubscription.unsubscribe();
            }
        };
    }
    function getTargetFromSource(sources) {
        if (sources) {
            var source = find(sources, (function(source) {
                return !!source.node && isElementNode(source.node);
            }));
            return source && source.node;
        }
    }
    var observer;
    function isLayoutShiftSupported() {
        return supportPerformanceTimingEvent(RumPerformanceEntryType_LAYOUT_SHIFT) && "WeakRef" in window;
    }
    var interactionCountEstimate = 0, minKnownInteractionId = 1 / 0, maxKnownInteractionId = 0;
    var getInteractionCount = function() {
        return observer ? interactionCountEstimate : window.performance.interactionCount || 0;
    };
    const interactionSelectorCache = new sdkMap_SDKMap;
    function trackInteractionToNextPaint(configuration, viewStart, viewLoadingType) {
        if (!(supportPerformanceTimingEvent("event") && window.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype)) return {
            getInteractionToNextPaint: function() {},
            setViewEnd: tools_noop,
            stop: tools_noop
        };
        var _trackViewInteractionCount = function(viewLoadingType) {
            "interactionCount" in performance || observer || (observer = new window.PerformanceObserver(monitor((function(entries) {
                entries.getEntries().forEach((function(e) {
                    const entry = e;
                    entry.interactionId && (minKnownInteractionId = Math.min(minKnownInteractionId, entry.interactionId), 
                    maxKnownInteractionId = Math.max(maxKnownInteractionId, entry.interactionId), interactionCountEstimate = (maxKnownInteractionId - minKnownInteractionId) / 7 + 1);
                }));
            })))).observe({
                type: "event",
                buffered: !0,
                durationThreshold: 0
            });
            var previousInteractionCount = viewLoadingType === ViewLoadingType_INITIAL_LOAD ? 0 : getInteractionCount(), state = {
                stopped: !1
            };
            function computeViewInteractionCount() {
                return getInteractionCount() - previousInteractionCount;
            }
            return {
                getViewInteractionCount: function() {
                    return state.stopped ? state.interactionCount : computeViewInteractionCount();
                },
                stopViewInteractionCount: function() {
                    state = {
                        stopped: !0,
                        interactionCount: computeViewInteractionCount()
                    };
                }
            };
        }(viewLoadingType), getViewInteractionCount = _trackViewInteractionCount.getViewInteractionCount, stopViewInteractionCount = _trackViewInteractionCount.stopViewInteractionCount;
        let viewEnd = 1 / 0;
        var interactionToNextPaintTargetSelector, interactionToNextPaintStartTime, longestInteractions = function(getViewInteractionCount) {
            var longestInteractions = [];
            function sortAndTrimLongestInteractions() {
                longestInteractions.sort((function(a, b) {
                    return b.duration - a.duration;
                })).splice(10);
            }
            return {
                process: function(entry) {
                    var interactionIndex = longestInteractions.findIndex((function(interaction) {
                        return entry.interactionId === interaction.interactionId;
                    })), minLongestInteraction = longestInteractions[longestInteractions.length - 1];
                    -1 !== interactionIndex ? entry.duration > longestInteractions[interactionIndex].duration && (longestInteractions[interactionIndex] = entry, 
                    sortAndTrimLongestInteractions()) : (longestInteractions.length < 10 || entry.duration > minLongestInteraction.duration) && (longestInteractions.push(entry), 
                    sortAndTrimLongestInteractions());
                },
                estimateP98Interaction: function() {
                    var interactionIndex = Math.min(longestInteractions.length - 1, Math.floor(getViewInteractionCount() / 50));
                    return longestInteractions[interactionIndex];
                }
            };
        }(getViewInteractionCount), interactionToNextPaint = -1;
        function handleEntries(entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                entry.interactionId && entry.startTime >= viewStart && entry.startTime <= viewEnd && longestInteractions.process(entry);
            }
            var newInteraction = longestInteractions.estimateP98Interaction();
            newInteraction && newInteraction.duration !== interactionToNextPaint && (interactionToNextPaint = newInteraction.duration, 
            interactionToNextPaintStartTime = tools_elapsed(viewStart, newInteraction.startTime), 
            !(interactionToNextPaintTargetSelector = function(relativeTimestamp) {
                const selector = interactionSelectorCache.get(relativeTimestamp);
                return interactionSelectorCache.delete(relativeTimestamp), selector;
            }(newInteraction.startTime)) && newInteraction.target && isElementNode(newInteraction.target) && (interactionToNextPaintTargetSelector = getSelectorFromElement(newInteraction.target, configuration.actionNameAttribute)));
        }
        var firstInputSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType_FIRST_INPUT,
            buffered: !0
        }).subscribe(handleEntries), eventSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType_EVENT,
            durationThreshold: 40,
            buffered: !0
        }).subscribe(handleEntries);
        return {
            getInteractionToNextPaint: function() {
                return interactionToNextPaint >= 0 ? {
                    value: Math.min(interactionToNextPaint, 6e4),
                    targetSelector: interactionToNextPaintTargetSelector,
                    time: interactionToNextPaintStartTime
                } : getViewInteractionCount() ? {
                    value: 0
                } : void 0;
            },
            setViewEnd: function(viewEndTime) {
                viewEnd = viewEndTime, stopViewInteractionCount();
            },
            stop: function() {
                eventSubscription.unsubscribe(), firstInputSubscription.unsubscribe();
            }
        };
    }
    function trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, viewStart) {
        var commonViewMetrics = {}, _trackLoadingTime = function(lifeCycle, domMutationObservable, configuration, loadType, viewStart, callback) {
            var isWaitingForLoadEvent = loadType === ViewLoadingType_INITIAL_LOAD, isWaitingForActivityLoadingTime = !0, loadingTimeCandidates = [], firstHidden = trackFirstHidden(viewStart);
            function invokeCallbackIfAllCandidatesAreReceived() {
                if (!isWaitingForActivityLoadingTime && !isWaitingForLoadEvent && loadingTimeCandidates.length > 0) {
                    var firstHiddenTime = firstHidden.getTimeStamp() - viewStart.relative, visibleLoadingTimeCandidates = loadingTimeCandidates.filter((function(loadingTime) {
                        return loadingTime < firstHiddenTime;
                    }));
                    if (0 === visibleLoadingTimeCandidates.length) return;
                    var loadingTime = Math.max.apply(Math, visibleLoadingTimeCandidates);
                    callback(loadingTime);
                }
            }
            var stop = waitPageActivityEnd(lifeCycle, domMutationObservable, configuration, (function(event) {
                isWaitingForActivityLoadingTime && (isWaitingForActivityLoadingTime = !1, event.hadActivity && loadingTimeCandidates.push(tools_elapsed(viewStart.timeStamp, event.end)), 
                invokeCallbackIfAllCandidatesAreReceived());
            })).stop;
            return {
                setLoadEvent: function(loadEvent) {
                    isWaitingForLoadEvent && (isWaitingForLoadEvent = !1, loadingTimeCandidates.push(loadEvent), 
                    invokeCallbackIfAllCandidatesAreReceived());
                },
                stop: function() {
                    stop(), firstHidden.stop(), isWaitingForActivityLoadingTime && (isWaitingForActivityLoadingTime = !1, 
                    invokeCallbackIfAllCandidatesAreReceived());
                }
            };
        }(lifeCycle, domMutationObservable, configuration, loadingType, viewStart, (function(newLoadingTime) {
            commonViewMetrics.loadingTime = newLoadingTime, scheduleViewUpdate();
        })), stopLoadingTimeTracking = _trackLoadingTime.stop, setLoadEvent = _trackLoadingTime.setLoadEvent, stopScrollMetricsTracking = trackScrollMetrics(0, viewStart, (function(newScrollMetrics) {
            commonViewMetrics.scroll = newScrollMetrics;
        })).stop, stopCLSTracking = trackCumulativeLayoutShift(configuration, viewStart.relative, (function(cumulativeLayoutShift) {
            commonViewMetrics.cumulativeLayoutShift = cumulativeLayoutShift, scheduleViewUpdate();
        })).stop, _trackInteractionToNextPaint = trackInteractionToNextPaint(configuration, viewStart.relative, loadingType), stopINPTracking = _trackInteractionToNextPaint.stop, getInteractionToNextPaint = _trackInteractionToNextPaint.getInteractionToNextPaint;
        return {
            stop: function() {
                stopLoadingTimeTracking(), stopCLSTracking(), stopScrollMetricsTracking();
            },
            stopINPTracking: stopINPTracking,
            setLoadEvent: setLoadEvent,
            setViewEnd: _trackInteractionToNextPaint.setViewEnd,
            getCommonViewMetrics: function() {
                return commonViewMetrics.interactionToNextPaint = getInteractionToNextPaint(), commonViewMetrics;
            }
        };
    }
    function trackViewEventCounts(lifeCycle, viewId, onChange) {
        var _trackEventCounts = function(data) {
            var lifeCycle = data.lifeCycle, isChildEvent = data.isChildEvent, callback = data.onChange;
            void 0 === callback && (callback = tools_noop);
            var eventCounts = {
                errorCount: 0,
                longTaskCount: 0,
                resourceCount: 0,
                actionCount: 0,
                frustrationCount: 0
            }, subscription = lifeCycle.subscribe(LifeCycleEventType_RUM_EVENT_COLLECTED, (function(event) {
                if (event.type !== enums_RumEventType.VIEW && isChildEvent(event)) switch (event.type) {
                  case enums_RumEventType.ERROR:
                    eventCounts.errorCount += 1, callback();
                    break;

                  case enums_RumEventType.ACTION:
                    event.action.frustration && (eventCounts.frustrationCount += event.action.frustration.type.length), 
                    eventCounts.actionCount += 1, callback();
                    break;

                  case enums_RumEventType.LONG_TASK:
                    eventCounts.longTaskCount += 1, callback();
                    break;

                  case enums_RumEventType.RESOURCE:
                    eventCounts.resourceCount += 1, callback();
                }
            }));
            return {
                stop: function() {
                    subscription.unsubscribe();
                },
                eventCounts: eventCounts
            };
        }({
            lifeCycle: lifeCycle,
            isChildEvent: function(event) {
                return event.view.id === viewId;
            },
            onChange: onChange
        });
        return {
            stop: _trackEventCounts.stop,
            eventCounts: _trackEventCounts.eventCounts
        };
    }
    function trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, areViewsTrackedAutomatically, initialViewOptions, recorderApi) {
        var eventBridgeAvailable = canUseEventBridge(), maxViewDuration = eventBridgeAvailable ? 1 / 0 : 144e5, isWebViewActive = !eventBridgeAvailable || "hidden" !== document.visibilityState && document.hasFocus(), activeViews = new Set;
        function startNewView(loadingType, startClocks, viewOptions, canMatchSoftNavigation, fallbackNavigationType) {
            var newlyCreatedView = function(lifeCycle, domMutationObservable, configuration, initialLocation, loadingType, startClocks, viewOptions, canMatchSoftNavigation, fallbackNavigationType, recorderApi, maxViewDuration) {
                void 0 === startClocks && (startClocks = clocksNow());
                var endClocks, id = tools_UUID(), stopObservable = new Observable, customTimings = {}, documentVersion = 0, location = shallowClone(initialLocation);
                const contextManager = createContextManager();
                var name, service, version, context, sessionIsActive = !0;
                viewOptions && (name = viewOptions.name, service = viewOptions.service, version = viewOptions.version, 
                context = viewOptions.context);
                context && contextManager.setContext(context);
                var viewCreatedEvent = {
                    id: id,
                    name: name,
                    startClocks: startClocks,
                    service: service,
                    version: version,
                    url: viewOptions && viewOptions.url
                };
                lifeCycle.notify(LifeCycleEventType_BEFORE_VIEW_CREATED, viewCreatedEvent), lifeCycle.notify(LifeCycleEventType_VIEW_CREATED, viewCreatedEvent);
                var replayRecordingStateSubscription, _scheduleViewUpdate = throttle(triggerViewUpdate, 3e3, {
                    leading: !1
                }), throttled = _scheduleViewUpdate.throttled, cancelScheduleViewUpdate = _scheduleViewUpdate.cancel, _trackCommonViewMetrics = trackCommonViewMetrics(lifeCycle, domMutationObservable, configuration, scheduleViewUpdate, loadingType, startClocks), setLoadEvent = _trackCommonViewMetrics.setLoadEvent, stopCommonViewMetricsTracking = _trackCommonViewMetrics.stop, getCommonViewMetrics = _trackCommonViewMetrics.getCommonViewMetrics, stopINPTracking = _trackCommonViewMetrics.stopINPTracking, setViewEnd = _trackCommonViewMetrics.setViewEnd, _trackInitialViewTimings = loadingType === ViewLoadingType_INITIAL_LOAD ? trackInitialViewMetrics(configuration, startClocks, setLoadEvent, scheduleViewUpdate) : {
                    stop: tools_noop,
                    initialViewMetrics: {}
                }, stopInitialViewMetricsTracking = _trackInitialViewTimings.stop, initialViewMetrics = _trackInitialViewTimings.initialViewMetrics, navigationType = fallbackNavigationType, _trackViewEventCounts = trackViewEventCounts(lifeCycle, id, scheduleViewUpdate), stopEventCountsTracking = _trackViewEventCounts.stop, eventCounts = _trackViewEventCounts.eventCounts, keepAliveIntervalId = timer_setInterval(triggerViewUpdate, 3e5), replayWasRecording = Boolean(recorderApi && "function" == typeof recorderApi.isRecording && recorderApi.isRecording());
                function updateReplayRecordingState(isRecording) {
                    replayWasRecording !== isRecording && (replayWasRecording = isRecording, void 0 === endClocks && triggerViewUpdate());
                }
                var hasReplayRecordingStateObservable = Boolean(recorderApi && recorderApi.recordingStateObservable && "function" == typeof recorderApi.recordingStateObservable.subscribe);
                hasReplayRecordingStateObservable && (replayRecordingStateSubscription = recorderApi.recordingStateObservable.subscribe(updateReplayRecordingState));
                const pageMayExitSubscription = lifeCycle.subscribe(LifeCycleEventType_PAGE_EXITED, (pageMayExitEvent => {
                    var isReplayRecording = recorderApi && "function" == typeof recorderApi.isRecording && recorderApi.isRecording();
                    (pageMayExitEvent.reason === PageExitReason.UNLOADING && (!isReplayRecording || !hasReplayRecordingStateObservable) || pageMayExitEvent.reason !== PageExitReason.UNLOADING && isReplayRecording) && triggerViewUpdate();
                }));
                function triggerBeforeViewUpdate() {
                    lifeCycle.notify(LifeCycleEventType_BEFORE_VIEW_UPDATED, {
                        id: id,
                        name: name,
                        context: contextManager.getContext(),
                        startClocks: startClocks
                    });
                }
                function scheduleViewUpdate() {
                    triggerBeforeViewUpdate(), throttled();
                }
                function triggerViewUpdate(options) {
                    cancelScheduleViewUpdate(), triggerBeforeViewUpdate(), documentVersion += 1;
                    var currentEnd = void 0 === endClocks ? timeStampNow() : endClocks.timeStamp;
                    lifeCycle.notify(LifeCycleEventType_VIEW_UPDATED, {
                        isForcedSessionUpdate: Boolean(options && options.isForcedSessionUpdate),
                        customTimings: customTimings,
                        documentVersion: documentVersion,
                        id: id,
                        name: name,
                        service: service,
                        version: version,
                        context: contextManager.getContext(),
                        loadingType: loadingType,
                        navigationType: navigationType,
                        location: location,
                        startClocks: startClocks,
                        commonViewMetrics: getCommonViewMetrics(),
                        initialViewMetrics: initialViewMetrics,
                        duration: Math.min(tools_elapsed(startClocks.timeStamp, currentEnd), maxViewDuration),
                        isActive: void 0 === endClocks,
                        sessionIsActive: sessionIsActive,
                        eventCounts: eventCounts
                    });
                }
                triggerViewUpdate(), contextManager.changeObservable.subscribe(scheduleViewUpdate);
                var result = {
                    update: triggerViewUpdate,
                    name: name,
                    service: service,
                    version: version,
                    contextManager: contextManager,
                    startClocks: startClocks,
                    stopObservable: stopObservable,
                    end: function(options) {
                        endClocks || (endClocks = isNullUndefinedDefaultValue(options && options.endClocks, clocksNow()), 
                        sessionIsActive = isNullUndefinedDefaultValue(options && options.sessionIsActive, !0), 
                        lifeCycle.notify(LifeCycleEventType_VIEW_ENDED, {
                            endClocks: endClocks
                        }), lifeCycle.notify(LifeCycleEventType_AFTER_VIEW_ENDED, {
                            endClocks: endClocks
                        }), timer_clearInterval(keepAliveIntervalId), replayRecordingStateSubscription && replayRecordingStateSubscription.unsubscribe(), 
                        setViewEnd(endClocks.relative), stopCommonViewMetricsTracking(), pageMayExitSubscription.unsubscribe(), 
                        triggerViewUpdate(), timer_setTimeout((function() {
                            result.stop();
                        }), 3e5));
                    },
                    stop: function() {
                        stopInitialViewMetricsTracking(), stopEventCountsTracking(), stopINPTracking(), 
                        stopObservable.notify();
                    },
                    addTiming: function(name, time) {
                        if (!endClocks) {
                            var relativeTime = function(time) {
                                return time < 31536e6;
                            }(time) ? time : tools_elapsed(startClocks.timeStamp, time);
                            customTimings[function(name) {
                                var sanitized = name.replace(/[^a-zA-Z0-9-_.@$]/g, "_");
                                sanitized !== name && console.warn("Invalid timing name: " + name + ", sanitized to: " + sanitized);
                                return sanitized;
                            }(name)] = relativeTime, scheduleViewUpdate();
                        }
                    },
                    setViewName(updatedName) {
                        name = updatedName, triggerViewUpdate();
                    },
                    $rSetSoftNavigationMetrics: function(softNavigationType, firstContentfulPaint, largestContentfulPaint) {
                        navigationType = softNavigationType || navigationType, "number" == typeof firstContentfulPaint && (initialViewMetrics.firstContentfulPaint = firstContentfulPaint), 
                        largestContentfulPaint && (initialViewMetrics.largestContentfulPaint = largestContentfulPaint), 
                        scheduleViewUpdate();
                    }
                };
                result.$rLocation = location, canMatchSoftNavigation && (result.$rSoftNavigationStart = startClocks.relative);
                return result;
            }(lifeCycle, domMutationObservable, configuration, location, loadingType, startClocks, viewOptions, canMatchSoftNavigation, fallbackNavigationType, recorderApi, maxViewDuration);
            return activeViews.add(newlyCreatedView), newlyCreatedView.stopObservable.subscribe((function() {
                activeViews.delete(newlyCreatedView), softNavigationView === newlyCreatedView && (softNavigationView = void 0);
            })), isWebViewActive || (newlyCreatedView.end({
                sessionIsActive: !1
            }), newlyCreatedView.stop()), newlyCreatedView;
        }
        var softNavigationView, softNavigationInteractionId, forcedSessionSubscription, pendingNavigation, currentView = startNewView(ViewLoadingType_INITIAL_LOAD, clocksOrigin(), initialViewOptions), softNavigationMetricsTracking = function(callback) {
            if (!window.PerformanceObserver) return tools_noop;
            var observer;
            try {
                (observer = new window.PerformanceObserver(monitor((function(entries) {
                    entries.getEntries().forEach(callback);
                })))).observe({
                    type: "soft-navigation",
                    buffered: !0
                });
            } catch (_unused) {
                return observer && observer.disconnect(), tools_noop;
            }
            try {
                observer.observe({
                    type: "interaction-contentful-paint",
                    buffered: !0
                });
            } catch (_unused2) {}
            return function() {
                observer.disconnect();
            };
        }((function(entry) {
            "soft-navigation" === entry.entryType ? (softNavigationView = function(activeViews, softNavigation) {
                var matchingView, closestStart = 1 / 0;
                return activeViews.forEach((function(view) {
                    var startDelay = view.$rSoftNavigationStart - softNavigation.startTime;
                    startDelay >= -1 && startDelay < closestStart && view.$rLocation.href === softNavigation.name && (matchingView = view, 
                    closestStart = startDelay);
                })), matchingView;
            }(activeViews, entry), softNavigationInteractionId = entry.interactionId, softNavigationView && softNavigationView.$rSetSoftNavigationMetrics(entry.navigationType, entry.duration, getSoftNavigationLcp(configuration, entry.getLargestInteractionContentfulPaint ? entry.getLargestInteractionContentfulPaint() : entry.largestInteractionContentfulPaint))) : softNavigationView && softNavigationInteractionId === entry.interactionId && softNavigationView.$rSetSoftNavigationMetrics(void 0, void 0, getSoftNavigationLcp(configuration, entry));
        })), stopWebViewLifecycleTracking = tools_noop;
        !function() {
            function renewCurrentView() {
                currentView = startNewView(ViewLoadingType_ROUTE_CHANGE, void 0, {
                    name: currentView.name,
                    service: currentView.service,
                    version: currentView.version,
                    context: currentView.contextManager.getContext()
                });
            }
            if (lifeCycle.subscribe(LifeCycleEventType_SESSION_RENEWED, renewCurrentView), forcedSessionSubscription = lifeCycle.subscribe(LifeCycleEventType_SESSION_FORCED, (function() {
                currentView.update({
                    isForcedSessionUpdate: !0
                });
            })), lifeCycle.subscribe(LifeCycleEventType_SESSION_EXPIRED, (function(sessionExpirationTime) {
                var sessionExpirationClocks;
                if ("number" == typeof sessionExpirationTime && sessionExpirationTime >= currentView.startClocks.timeStamp) {
                    sessionExpirationClocks = {
                        relative: tools_elapsed(clocksOrigin().timeStamp, sessionExpirationTime),
                        timeStamp: sessionExpirationTime
                    };
                }
                currentView.end({
                    sessionIsActive: !1,
                    endClocks: sessionExpirationClocks
                });
            })), eventBridgeAvailable) {
                stopWebViewLifecycleTracking = addEventListeners(window, [ "blur", "focus", "resume", "visibilitychange" ], (function(event) {
                    var nextIsActive = "hidden" !== document.visibilityState && "blur" !== event.type;
                    nextIsActive !== isWebViewActive && ((isWebViewActive = nextIsActive) ? renewCurrentView() : (currentView.end({
                        sessionIsActive: !1
                    }), currentView.stop()));
                })).stop;
            }
        }();
        var locationChangeSubscription = function(locationChangeObservable) {
            return locationChangeObservable.subscribe((function(params) {
                var currentLocation, otherLocation, hash, correspondingId, oldLocation = params.oldLocation, newLocation = params.newLocation;
                if (otherLocation = newLocation, (currentLocation = oldLocation).pathname !== otherLocation.pathname || (hash = otherLocation.hash, 
                !((correspondingId = hash.substr(1)) && document.getElementById(correspondingId) || getPathFromHash(otherLocation.hash) === getPathFromHash(currentLocation.hash)))) return areViewsTrackedAutomatically ? (currentView.end(), 
                void (currentView = startNewView(ViewLoadingType_ROUTE_CHANGE, void 0, void 0, !0, params.navigationType))) : void (pendingNavigation = [ newLocation.href, params.navigationType ]);
            }));
        }(locationChangeObservable);
        return {
            addTiming: function(name, time) {
                void 0 === time && (time = timeStampNow()), currentView.addTiming(name, time);
            },
            startView: function(options, startClocks) {
                var fallbackNavigationType;
                pendingNavigation && pendingNavigation[0] === location.href && (fallbackNavigationType = pendingNavigation[1]), 
                pendingNavigation = void 0, currentView.end({
                    endClocks: startClocks
                }), currentView = startNewView(ViewLoadingType_ROUTE_CHANGE, startClocks, options, !0, fallbackNavigationType);
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
            stop: function() {
                locationChangeSubscription && locationChangeSubscription.unsubscribe(), stopWebViewLifecycleTracking(), 
                forcedSessionSubscription.unsubscribe(), softNavigationMetricsTracking(), currentView.end(), 
                activeViews.forEach((function(view) {
                    view.stop();
                }));
            }
        };
    }
    function getSoftNavigationLcp(configuration, entry) {
        var candidate = entry && entry.largestContentfulPaint, renderTime = candidate && (candidate.renderTime || candidate.loadTime);
        if (renderTime) return {
            value: Math.max(renderTime - entry.startTime, 0),
            targetSelector: candidate.element && getSelectorFromElement(candidate.element, configuration.actionNameAttribute)
        };
    }
    function startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions) {
        return lifeCycle.subscribe(LifeCycleEventType_VIEW_UPDATED, (function(view) {
            lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, function(view, configuration, recorderApi, pageStateHistory) {
                var pageStates = pageStateHistory.findAll(view.startClocks.relative, view.duration), viewEvent = {
                    _gc: {
                        document_version: view.documentVersion,
                        page_states: pageStates,
                        view_update_time: view.documentVersion
                    },
                    date: view.startClocks.timeStamp,
                    type: enums_RumEventType.VIEW,
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
                        first_byte: tools_toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.firstByte")),
                        dom_complete: tools_toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domComplete")),
                        dom_content_loaded: tools_toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domContentLoaded")),
                        dom_interactive: tools_toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.domInteractive")),
                        error: {
                            count: view.eventCounts.errorCount
                        },
                        first_contentful_paint: tools_toServerDuration(findByPath(view.initialViewMetrics, "firstContentfulPaint")),
                        first_input_delay: tools_toServerDuration(findByPath(view.initialViewMetrics, "firstInput.delay")),
                        first_input_time: tools_toServerDuration(findByPath(view.initialViewMetrics, "firstInput.time")),
                        first_input_target_selector: findByPath(view.initialViewMetrics, "firstInput.targetSelector"),
                        interaction_to_next_paint: tools_toServerDuration(findByPath(view.commonViewMetrics, "interactionToNextPaint.value")),
                        interaction_to_next_paint_target_selector: findByPath(view.commonViewMetrics, "interactionToNextPaint.targetSelector"),
                        is_active: view.isActive,
                        name: view.name,
                        largest_contentful_paint: tools_toServerDuration(findByPath(view.initialViewMetrics, "largestContentfulPaint.value")),
                        largest_contentful_paint_element_selector: findByPath(view.initialViewMetrics, "largestContentfulPaint.targetSelector"),
                        load_event: tools_toServerDuration(findByPath(view.initialViewMetrics, "navigationTimings.loadEvent")),
                        loading_time: discardNegativeDuration(tools_toServerDuration(view.commonViewMetrics.loadingTime)),
                        loading_type: view.loadingType,
                        navigation_type: view.navigationType,
                        long_task: {
                            count: view.eventCounts.longTaskCount
                        },
                        resource: {
                            count: view.eventCounts.resourceCount
                        },
                        time_spent: tools_toServerDuration(view.duration)
                    },
                    display: view.commonViewMetrics.scroll ? {
                        scroll: {
                            max_depth: view.commonViewMetrics.scroll.maxDepth,
                            max_depth_scroll_top: view.commonViewMetrics.scroll.maxDepthScrollTop,
                            max_scroll_height: view.commonViewMetrics.scroll.maxScrollHeight,
                            max_scroll_height_time: tools_toServerDuration(view.commonViewMetrics.scroll.maxScrollHeightTime)
                        }
                    } : void 0,
                    session: {
                        is_active: !!view.sessionIsActive && void 0
                    },
                    privacy: {
                        replay_level: configuration.defaultPrivacyLevel
                    }
                };
                isEmptyObject(view.customTimings) || (viewEvent.view.custom_timings = (object = view.customTimings, 
                fn = tools_toServerDuration, newObject = {}, tools_each(object, (function(value, key) {
                    newObject[key] = fn(value);
                })), newObject));
                var object, fn, newObject;
                return viewEvent = extend2Lev(viewEvent, {
                    view: computePerformanceViewDetails(view.initialViewMetrics.navigationTimings)
                }), {
                    isForcedSessionUpdate: view.isForcedSessionUpdate,
                    rawRumEvent: viewEvent,
                    startTime: view.startClocks.relative,
                    domainContext: {
                        location: view.location
                    }
                };
            }(view, configuration, 0, pageStateHistory));
        })), trackViews(location, lifeCycle, domMutationObservable, configuration, locationChangeObservable, !configuration.trackViewsManually, initialViewOptions, recorderApi);
    }
    function computePerformanceViewDetails(navigationTimings) {
        if (navigationTimings) {
            var fetchStart = navigationTimings.fetchStart, responseEnd = navigationTimings.responseEnd, domInteractive = navigationTimings.domInteractive, domContentLoaded = navigationTimings.domContentLoaded, domComplete = navigationTimings.domComplete, loadEventEnd = navigationTimings.loadEventEnd, loadEventStart = navigationTimings.loadEventStart, domContentLoadedEventEnd = navigationTimings.domContentLoadedEventEnd, details = {};
            if (isNumber(responseEnd) && isNumber(fetchStart) && responseEnd !== fetchStart && responseEnd > fetchStart) {
                details.fpt = tools_toServerDuration(responseEnd - fetchStart);
                var apdexLevel = parseInt((responseEnd - fetchStart) / 1e3);
                details.apdexLevel = apdexLevel > 9 ? 9 : apdexLevel;
            }
            return isNumber(domInteractive) && isNumber(fetchStart) && domInteractive !== fetchStart && domInteractive > fetchStart && (details.tti = tools_toServerDuration(domInteractive - fetchStart)), 
            isNumber(domContentLoaded) && isNumber(fetchStart) && domContentLoaded !== fetchStart && domContentLoaded > fetchStart && (details.dom_ready = tools_toServerDuration(domContentLoaded - fetchStart)), 
            isNumber(loadEventEnd) && isNumber(fetchStart) && loadEventEnd !== fetchStart && loadEventEnd > fetchStart && (details.load = tools_toServerDuration(loadEventEnd - fetchStart)), 
            isNumber(loadEventStart) && isNumber(domContentLoadedEventEnd) && loadEventStart !== domContentLoadedEventEnd && loadEventStart > domContentLoadedEventEnd && (details.resource_load_time = tools_toServerDuration(loadEventStart - domContentLoadedEventEnd)), 
            isNumber(domComplete) && isNumber(domInteractive) && domComplete !== domInteractive && domComplete > domInteractive && (details.dom = tools_toServerDuration(domComplete - domInteractive)), 
            details;
        }
    }
    function clearTracingIfNeeded(context) {
        0 !== context.status || context.isAborted || (context.traceId = void 0, context.spanId = void 0, 
        context.traceSampled = void 0);
    }
    var nextRequestIndex = 1;
    function startRequestCollection(lifeCycle, configuration, sessionManager) {
        var tracer = {
            clearTracingIfNeeded: clearTracingIfNeeded,
            traceFetch: function(context) {},
            traceXhr: function(context, xhr) {}
        };
        !function(lifeCycle, configuration, tracer) {
            var subscription = initXhrObservable().subscribe((function(rawContext) {
                var context = rawContext;
                if (isAllowedRequestUrl(configuration, context.url)) switch (context.state) {
                  case "start":
                    tracer.traceXhr(context, context.xhr), context.requestIndex = getNextRequestIndex(), 
                    lifeCycle.notify(LifeCycleEventType_REQUEST_STARTED, {
                        requestIndex: context.requestIndex,
                        url: context.url
                    });
                    break;

                  case "complete":
                    tracer.clearTracingIfNeeded(context), lifeCycle.notify(LifeCycleEventType_REQUEST_COMPLETED, {
                        duration: context.duration,
                        method: context.method,
                        requestIndex: context.requestIndex,
                        spanId: context.spanId,
                        startClocks: context.startClocks,
                        status: context.status,
                        traceId: context.traceId,
                        traceSampled: context.traceSampled,
                        visitorId: context.visitorId,
                        type: RequestType.XHR,
                        url: context.url,
                        xhr: context.xhr,
                        isAborted: context.isAborted,
                        requestHeaderContexts: context.requestHeaderContexts,
                        handlingStack: context.handlingStack
                    });
                }
            }));
        }(lifeCycle, configuration, tracer), function(lifeCycle, configuration, tracer) {
            var subscription = initFetchObservable().subscribe((function(rawContext) {
                var context = rawContext;
                if (isAllowedRequestUrl(configuration, context.url)) switch (context.state) {
                  case "start":
                    tracer.traceFetch(context), context.requestIndex = getNextRequestIndex(), lifeCycle.notify(LifeCycleEventType_REQUEST_STARTED, {
                        requestIndex: context.requestIndex,
                        url: context.url
                    });
                    break;

                  case "resolve":
                    !function(context, callback) {
                        var clonedResponse = context.response && function(response) {
                            try {
                                return response.clone();
                            } catch (e) {
                                return;
                            }
                        }(context.response);
                        clonedResponse && clonedResponse.body ? function(stream, callback, options) {
                            var reader = stream.getReader(), chunks = [], readBytesCount = 0;
                            function onDone() {
                                var bytes, limitExceeded;
                                if (reader.cancel().catch(tools_noop), options.collectStreamBody) {
                                    var completeBuffer;
                                    if (1 === chunks.length) completeBuffer = chunks[0]; else {
                                        completeBuffer = new Uint8Array(readBytesCount);
                                        var offset = 0;
                                        tools_each(chunks, (function(chunk) {
                                            completeBuffer.set(chunk, offset), offset += chunk.length;
                                        }));
                                    }
                                    bytes = completeBuffer.slice(0, options.bytesLimit), limitExceeded = completeBuffer.length > options.bytesLimit;
                                }
                                callback(void 0, bytes, limitExceeded);
                            }
                            !function readMore() {
                                reader.read().then(monitor((function(result) {
                                    result.done ? onDone() : (options.collectStreamBody && chunks.push(result.value), 
                                    (readBytesCount += result.value.length) > options.bytesLimit ? onDone() : readMore());
                                })), monitor((function(error) {
                                    callback(error);
                                })));
                            }();
                        }(clonedResponse.body, (function() {
                            callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
                        }), {
                            bytesLimit: Number.POSITIVE_INFINITY,
                            collectStreamBody: !1
                        }) : callback(tools_elapsed(context.startClocks.timeStamp, timeStampNow()));
                    }(context, (function(duration) {
                        var _context$init;
                        tracer.clearTracingIfNeeded(context), lifeCycle.notify(LifeCycleEventType_REQUEST_COMPLETED, {
                            duration: duration,
                            method: context.method,
                            requestIndex: context.requestIndex,
                            responseType: context.responseType,
                            spanId: context.spanId,
                            startClocks: context.startClocks,
                            status: context.status,
                            traceId: context.traceId,
                            traceSampled: context.traceSampled,
                            visitorId: context.visitorId,
                            requestHeaderContexts: (null === (_context$init = context.init) || void 0 === _context$init ? void 0 : _context$init.headers) || (isRequest(context.input) ? context.input.headers : void 0),
                            type: RequestType.FETCH,
                            url: context.url,
                            response: context.response,
                            init: context.init,
                            input: context.input,
                            isAborted: context.isAborted,
                            handlingStack: context.handlingStack
                        });
                    }));
                }
            }));
        }(lifeCycle, configuration, tracer);
    }
    function getNextRequestIndex() {
        var result = nextRequestIndex;
        return nextRequestIndex += 1, result;
    }
    function createRequestResourceEntryMatcher() {
        var alreadyMatchedEntries = new WeakSet;
        return {
            matchRequestResourceEntry: function(request) {
                if (!performance || !("getEntriesByName" in performance)) return;
                var sameNameEntries = performance.getEntriesByName(request.url, "resource");
                if (!sameNameEntries.length || !("toJSON" in sameNameEntries[0])) return;
                var candidates = filter(sameNameEntries, (function(entry) {
                    return !alreadyMatchedEntries.has(entry);
                }));
                let lastEntry;
                if (candidates = filter(candidates, (function(entry) {
                    return hasValidResourceEntryDuration(entry) && hasValidResourceEntryTimings(entry);
                })), (candidates = filter(candidates, (function(entry) {
                    return timing = entry, start = request.startClocks.relative, end = endTime({
                        startTime: request.startClocks.relative,
                        duration: request.duration
                    }), errorMargin = 1, timing.startTime >= start - errorMargin && endTime(timing) <= addDuration(end, errorMargin);
                    var timing, start, end, errorMargin;
                }))).length > 1) {
                    let startTimeDuration = Number.MAX_SAFE_INTEGER;
                    candidates.forEach((entry => {
                        const _startTimeDuration = Math.abs(entry.startTime - request.startClocks.relative);
                        _startTimeDuration < startTimeDuration && (startTimeDuration = _startTimeDuration, 
                        lastEntry = entry);
                    }));
                } else 1 === candidates.length && (lastEntry = candidates[0]);
                return lastEntry ? (alreadyMatchedEntries.add(lastEntry), lastEntry.toJSON()) : void 0;
            }
        };
    }
    function endTime(timing) {
        return addDuration(timing.startTime, timing.duration);
    }
    function retrieveInitialDocumentResourceTiming(configuration, callback) {
        runOnReadyState("interactive", (function() {
            var entry = tools_assign(getNavigationEntry().toJSON(), {
                entryType: RumPerformanceEntryType_RESOURCE,
                initiatorType: "initial_document",
                toJSON: function() {
                    return tools_assign({}, entry, {
                        toJSON: void 0
                    });
                }
            });
            callback(entry);
        }));
    }
    function startResourceCollection(lifeCycle, configuration, pageStateHistory, taskQueue, retrieveInitialDocumentResourceTimingImpl, resourceTrackerManager) {
        void 0 === taskQueue && (taskQueue = function() {
            const pendingTasks = [];
            function run(deadline) {
                let executionTimeRemaining;
                if (deadline.didTimeout) {
                    const start = performance.now();
                    executionTimeRemaining = function() {
                        return 30 - (performance.now() - start);
                    };
                } else executionTimeRemaining = deadline.timeRemaining.bind(deadline);
                for (;executionTimeRemaining() > 0 && pendingTasks.length; ) pendingTasks.shift()();
                pendingTasks.length && scheduleNextRun();
            }
            function scheduleNextRun() {
                requestIdleCallback(run, {
                    timeout: 1e3
                });
            }
            return {
                push: function(task) {
                    1 === pendingTasks.push(task) && scheduleNextRun();
                }
            };
        }()), void 0 === retrieveInitialDocumentResourceTimingImpl && (retrieveInitialDocumentResourceTimingImpl = retrieveInitialDocumentResourceTiming), 
        resourceTrackerManager && resourceTrackerManager.setFlushTrackedResource((function(rawEvent) {
            lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, rawEvent);
        }));
        var requestResourceEntryMatcher = createRequestResourceEntryMatcher();
        lifeCycle.subscribe(LifeCycleEventType_REQUEST_COMPLETED, (function(request) {
            handleResource((function() {
                return function(request, pageStateHistory, requestResourceEntryMatcher) {
                    var matchingTiming = requestResourceEntryMatcher.matchRequestResourceEntry(request), startClocks = matchingTiming ? relativeToClocks(matchingTiming.startTime) : request.startClocks, tracingInfo = function(request) {
                        if (!(request.traceSampled && request.traceId && request.spanId)) return;
                        return {
                            _gc: {
                                spanId: request.spanId,
                                traceId: request.traceId
                            },
                            resource: {
                                id: tools_UUID()
                            }
                        };
                    }(request), type = request.type === RequestType.XHR ? enums_ResourceType_XHR : enums_ResourceType_FETCH, correspondingTimingOverrides = matchingTiming ? computeResourceEntryMetrics(matchingTiming) : void 0, duration = function(pageStateHistory, startClocks, duration) {
                        return pageStateHistory.wasInPageStateDuringPeriod(PageState_FROZEN, startClocks.relative, duration) ? void 0 : tools_toServerDuration(duration);
                    }(pageStateHistory, startClocks, request.duration), urlObj = tools_urlParse(request.url).getParse(), resourceEvent = extend2Lev({
                        date: startClocks.timeStamp,
                        resource: {
                            id: tools_UUID(),
                            type: type,
                            duration: duration,
                            method: request.method,
                            status: request.status,
                            statusGroup: getStatusGroup(request.status),
                            url: isLongDataUrl(request.url) ? sanitizeDataUrl(request.url) : request.url,
                            urlHost: urlObj.Host,
                            urlPath: urlObj.Path,
                            urlPathGroup: tools_replaceNumberCharByPath(urlObj.Path),
                            urlQuery: tools_getQueryParamsFromUrl(request.url),
                            deliveryType: matchingTiming && computeResourceEntryDeliveryType(matchingTiming),
                            protocol: matchingTiming && computeResourceEntryProtocol(matchingTiming)
                        },
                        type: enums_RumEventType.RESOURCE
                    }, tracingInfo, correspondingTimingOverrides);
                    request.visitorId && (resourceEvent.context = {
                        visitor_id: request.visitorId
                    });
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
                            handlingStack: request.handlingStack,
                            resourceTrackerId: getResourceTrackerIdFromRequest(request)
                        }
                    };
                }(request, pageStateHistory, requestResourceEntryMatcher);
            }));
        }));
        var performanceResourceSubscription = createPerformanceObservable(configuration, {
            type: RumPerformanceEntryType_RESOURCE,
            buffered: !0
        }).subscribe((function(entries) {
            for (var loop = function(entry) {
                (function(entry) {
                    return "xmlhttprequest" === entry.initiatorType || "fetch" === entry.initiatorType;
                })(entry) || isResourceUrlLimit(entry.name, configuration.resourceUrlLimit) || handleResource((function() {
                    return processResourceEntry(entry, configuration);
                }));
            }, _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                loop(entries_1[_i]);
            }
        }));
        function handleResource(computeRawEvent) {
            taskQueue.push((function() {
                try {
                    const rawEvent = computeRawEvent();
                    if (rawEvent) {
                        if (resourceTrackerManager && rawEvent.domainContext && rawEvent.domainContext.resourceTrackerId && resourceTrackerManager.trackRequestResource(rawEvent.domainContext.resourceTrackerId, rawEvent)) return;
                        lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, rawEvent);
                    }
                } catch (error) {}
            }));
        }
        return retrieveInitialDocumentResourceTimingImpl(configuration, (function(timing) {
            handleResource((function() {
                return processResourceEntry(timing, configuration);
            }));
        })), {
            stop: function() {
                performanceResourceSubscription.unsubscribe();
            },
            addResource: (resource, savedCommonContext) => {
                handleResource((function() {
                    return extend({
                        savedCommonContext: savedCommonContext
                    }, function(resource) {
                        var resourceEvent = {
                            date: resource.startClocks.timeStamp,
                            resource: {
                                id: tools_UUID(),
                                type: resource.type
                            },
                            type: enums_RumEventType.RESOURCE
                        };
                        return {
                            customerContext: resource.context,
                            startTime: resource.startClocks.relative,
                            rawRumEvent: resourceEvent,
                            domainContext: {
                                resource: resource
                            }
                        };
                    }(resource));
                }));
            }
        };
    }
    function processResourceEntry(entry, configuration) {
        var statusCode, startClocks = relativeToClocks(entry.startTime), tracingInfo = function(entry) {
            return entry.traceId ? {
                _gc: {
                    traceId: entry.traceId
                }
            } : void 0;
        }(entry), type = computeResourceEntryType(entry), entryMetrics = computeResourceEntryMetrics(entry), urlObj = tools_urlParse(entry.name).getParse(), resourceEvent = extend2Lev({
            date: startClocks.timeStamp,
            resource: {
                id: tools_UUID(),
                type: type,
                url: entry.name,
                urlHost: urlObj.Host,
                urlPath: urlObj.Path,
                urlPathGroup: tools_replaceNumberCharByPath(urlObj.Path),
                urlQuery: tools_getQueryParamsFromUrl(entry.name),
                method: "GET",
                status: (statusCode = entry.responseStatus, 0 === statusCode ? void 0 : statusCode),
                statusGroup: getStatusGroup(entry.responseStatus),
                deliveryType: computeResourceEntryDeliveryType(entry),
                protocol: computeResourceEntryProtocol(entry)
            },
            type: enums_RumEventType.RESOURCE
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
    function getResourceTrackerIdFromRequest(request) {
        return function(headers, key) {
            if (!headers || !key) return;
            var normalizedKey = String(key).toLowerCase();
            if ("function" == typeof headers.get) return headers.get(key) || headers.get(normalizedKey) || void 0;
            if (Array.isArray(headers)) {
                for (var i = 0; i < headers.length; i += 1) {
                    var headerEntry = headers[i];
                    if (Array.isArray(headerEntry) && String(headerEntry[0]).toLowerCase() === normalizedKey) return headerEntry[1];
                }
                return;
            }
            for (var headerKey in headers) if (String(headerKey).toLowerCase() === normalizedKey) return headers[headerKey];
        }(request.requestHeaderContexts, "x-rum-resource-id");
    }
    function startRum(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, createEncoder, resourceTrackerManager) {
        var cleanupTasks = [], lifeCycle = new LifeCycle, reportError = function(error) {
            lifeCycle.notify(LifeCycleEventType_RAW_ERROR_COLLECTED, {
                error: error
            });
        }, pageExitObservable = new Observable((function(observable) {
            var visibilityChangeListener = addEventListeners(window, [ DOM_EVENT_VISIBILITY_CHANGE, DOM_EVENT_FREEZE ], (function(event) {
                event.type === DOM_EVENT_VISIBILITY_CHANGE && "hidden" === document.visibilityState ? observable.notify({
                    reason: PageExitReason.HIDDEN
                }) : event.type === DOM_EVENT_FREEZE && observable.notify({
                    reason: PageExitReason.FROZEN
                });
            }), {
                capture: !0
            }), beforeUnloadListener = addEventListener(window, DOM_EVENT_BEFORE_UNLOAD, (function() {
                observable.notify({
                    reason: PageExitReason.UNLOADING,
                    $rOnCancel: function(callback) {
                        timer_setTimeout(callback, 0);
                    }
                });
            }));
            return function() {
                visibilityChangeListener.stop(), beforeUnloadListener.stop();
            };
        })), pageExitSubscription = pageExitObservable.subscribe((function(event) {
            lifeCycle.notify(LifeCycleEventType_PAGE_EXITED, event);
        }));
        cleanupTasks.push((function() {
            pageExitSubscription.unsubscribe();
        }));
        var session = canUseEventBridge() ? void 0 : startRumSessionManager(configuration, lifeCycle);
        if (!canUseEventBridge()) {
            var batch = function(configuration, lifeCycle, telemetryEventObservable, reportError, pageExitObservable, sessionExpireObservable, createEncoder) {
                const rumEncoder = createEncoder(EncoderStreamId_RUM), request = createHttpRequest(configuration.rumEndpoint, configuration.batchBytesLimit, configuration.retryMaxSize, reportError), flushRequestObservable = new Observable;
                let immediateViewBatch, immediateViewEncoder;
                const batch = startBatchWithReplica(configuration, {
                    endpoint: configuration.rumEndpoint,
                    request: request,
                    encoder: rumEncoder,
                    encoderFallback: rumEncoder.isAsync ? createIdentityEncoder : void 0
                }, reportError, pageExitObservable, sessionExpireObservable), rumEventSubscription = lifeCycle.subscribe(LifeCycleEventType_RUM_EVENT_COLLECTED, (function(serverRumEvent) {
                    serverRumEvent.type === enums_RumEventType.VIEW ? batch.upsert(serverRumEvent, serverRumEvent.view.id) : batch.add(serverRumEvent);
                }));
                function sendImmediateView(event, reason) {
                    immediateViewBatch || (immediateViewEncoder = createEncoder(EncoderStreamId_RUM_INITIAL_VIEW), 
                    immediateViewBatch = startBatchWithReplica(configuration, {
                        request: request,
                        encoder: immediateViewEncoder,
                        encoderFallback: immediateViewEncoder.isAsync ? createIdentityEncoder : void 0,
                        flushRequestObservable: flushRequestObservable
                    }, reportError, new Observable, sessionExpireObservable)), immediateViewBatch.upsert(event, event.view.id), 
                    flushRequestObservable.notify(reason);
                }
                const initialViewSubscription = lifeCycle.subscribe(LifeCycleEventType_RUM_VIEW_FIRST_COLLECTED, (event => sendImmediateView(event, "view_created"))), forcedViewSubscription = lifeCycle.subscribe(LifeCycleEventType_RUM_VIEW_FORCED_COLLECTED, (event => sendImmediateView(event, "session_forced")));
                return {
                    flushObservable: batch.flushObservable,
                    add: batch.add,
                    upsert: batch.upsert,
                    stop: function() {
                        rumEventSubscription.unsubscribe(), initialViewSubscription.unsubscribe(), forcedViewSubscription.unsubscribe(), 
                        batch.stop(), immediateViewBatch && (immediateViewBatch.stop(), immediateViewEncoder.stop && immediateViewEncoder.stop());
                    }
                };
            }(configuration, lifeCycle, 0, reportError, pageExitObservable, session.expireObservable, createEncoder);
            cleanupTasks.push((function() {
                batch.stop();
            }));
        }
        var userSession = startCacheUsrCache(configuration), domMutationObservable = createDOMMutationObservable(), locationChangeObservable = createLocationChangeObservable(location), pageStateHistory = startPageStateHistory(), _startRumEventCollection = function(lifeCycle, configuration, location, sessionManager, userSessionManager, pageStateHistory, locationChangeObservable, domMutationObservable, getCommonContext, reportError) {
            var viewContexts = startViewContexts(lifeCycle), urlContexts = function(lifeCycle, locationChangeObservable, location) {
                var previousViewUrl, urlContextHistory = createValueHistory({
                    expireDelay: 144e5
                });
                lifeCycle.subscribe(LifeCycleEventType_BEFORE_VIEW_CREATED, (function(data) {
                    var viewUrl = location.href, viewLocation = location;
                    if (data.url) try {
                        viewUrl = (viewLocation = buildUrl(data.url, location.href)).href;
                    } catch (error) {}
                    urlContextHistory.add(buildUrlContext({
                        url: viewUrl,
                        location: viewLocation,
                        referrer: previousViewUrl || document.referrer
                    }), data.startClocks.relative), previousViewUrl = viewUrl;
                })), lifeCycle.subscribe(LifeCycleEventType_AFTER_VIEW_ENDED, (function(data) {
                    urlContextHistory.closeActive(data.endClocks.relative);
                }));
                var locationChangeSubscription = locationChangeObservable.subscribe((function(data) {
                    var current = urlContextHistory.find();
                    if (current) {
                        var changeTime = tools_relativeNow();
                        urlContextHistory.closeActive(changeTime), urlContextHistory.add(buildUrlContext({
                            url: data.newLocation.href,
                            location: data.newLocation,
                            referrer: current.referrer
                        }, !0), changeTime);
                    }
                }));
                function buildUrlContext(data) {
                    var pathname = data.location.pathname, path = pathname, hash = data.location.hash;
                    return hash && 0 === hash.indexOf("#/") && (path = "/" + getPathFromHash(hash)), 
                    {
                        url: data.url,
                        referrer: data.referrer,
                        host: data.location.host,
                        path: path,
                        pathGroup: tools_replaceNumberCharByPath(path),
                        urlQuery: getLocationQuery(data.location),
                        pathname: pathname
                    };
                }
                function getLocationQuery(location) {
                    var urlQuery = "string" == typeof location.search ? getURLSearchParams(location.search) : tools_getQueryParamsFromUrl(location.href.split("#")[0]), hash = location.hash, hashQueryIndex = hash && 0 === hash.indexOf("#/") ? hash.indexOf("?") : -1;
                    return hashQueryIndex >= 0 && tools_assign(urlQuery, getURLSearchParams(hash.slice(hashQueryIndex))), 
                    urlQuery;
                }
                return {
                    findUrl: function(startTime) {
                        return urlContextHistory.find(startTime);
                    },
                    stop: function() {
                        locationChangeSubscription.unsubscribe(), urlContextHistory.stop();
                    }
                };
            }(lifeCycle, locationChangeObservable, location), _startActionCollection = function(lifeCycle, domMutationObservable, configuration, pageStateHistory) {
                return lifeCycle.subscribe(LifeCycleEventType_AUTO_ACTION_COMPLETED, (function(action) {
                    lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, processAction(action, pageStateHistory));
                })), {
                    actionContexts: {
                        findActionId: tools_noop,
                        findAllActionId: tools_noop
                    },
                    addAction: function(action, savedCommonContext) {
                        lifeCycle.notify(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, extend({
                            savedCommonContext: savedCommonContext
                        }, processAction(action, pageStateHistory)));
                    }
                };
            }(lifeCycle, 0, 0, pageStateHistory), actionContexts = _startActionCollection.actionContexts, addAction = _startActionCollection.addAction, displayContext = (viewport = getViewportDimension(), 
            {
                get: function() {
                    return {
                        viewport: viewport
                    };
                },
                stop: initViewportObservable().subscribe((function(viewportDimension) {
                    viewport = viewportDimension;
                })).unsubscribe
            });
            var viewport;
            return function(configuration, lifeCycle, sessionManager, userSessionManager, viewContexts, urlContexts, actionContexts, displayContext, getCommonContext, reportError) {
                let getDeviceInfoImp = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : getDeviceInfoWithHighEntropyValues;
                modifiableFieldPathsByEvent[enums_RumEventType.VIEW] = tools_assign({}, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS), 
                modifiableFieldPathsByEvent[enums_RumEventType.ERROR] = tools_assign({
                    "error.message": "string",
                    "error.stack": "string",
                    "error.resource.url": "string"
                }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS), 
                modifiableFieldPathsByEvent[enums_RumEventType.RESOURCE] = tools_assign({
                    "resource.url": "string"
                }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS), 
                modifiableFieldPathsByEvent[enums_RumEventType.ACTION] = tools_assign({
                    "action.target.name": "string"
                }, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS, ROOT_MODIFIABLE_FIELD_PATHS), 
                modifiableFieldPathsByEvent[enums_RumEventType.LONG_TASK] = tools_assign({}, USER_CUSTOMIZABLE_FIELD_PATHS, VIEW_MODIFIABLE_FIELD_PATHS);
                var eventRateLimiters = {};
                eventRateLimiters[enums_RumEventType.ERROR] = createEventRateLimiter(enums_RumEventType.ERROR, configuration.eventRateLimiterThreshold, reportError), 
                eventRateLimiters[enums_RumEventType.ACTION] = createEventRateLimiter(enums_RumEventType.ACTION, configuration.eventRateLimiterThreshold, reportError);
                var resolvedDeviceInfo, pendingRawEvents = createBoundedBuffer(), collectedViews = new WeakSet;
                getDeviceInfoImp((function(deviceInfo) {
                    resolvedDeviceInfo = deviceInfo, pendingRawEvents.drain();
                })), lifeCycle.subscribe(LifeCycleEventType_RAW_RUM_EVENT_COLLECTED, (function assemble(data) {
                    if (resolvedDeviceInfo) {
                        var startTime = data.startTime, rawRumEvent = data.rawRumEvent, savedCommonContext = data.savedCommonContext, customerContext = data.customerContext, domainContext = data.domainContext, viewContext = viewContexts.findView(startTime), urlContext = urlContexts.findUrl(startTime), session = sessionManager.findTrackedSession(startTime);
                        if ((!session || !session.isErrorSession || session.sessionHasError) && session && viewContext && urlContext) {
                            var actionId = actionContexts.findActionId(startTime), actionIds = actionContexts.findAllActionId(startTime), commonContext = savedCommonContext || getCommonContext(), rumContext = {
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
                                device: resolvedDeviceInfo,
                                webview: {},
                                env: configuration.env || "",
                                service: viewContext.service || configuration.service || "browser",
                                version: viewContext.version || configuration.version || "",
                                source: "browser",
                                date: timeStampNow(),
                                user: {
                                    id: userSessionManager.getId(),
                                    is_signin: "F",
                                    is_login: !1
                                },
                                session: {
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
                                } : void 0,
                                display: displayContext.get()
                            }, serverRumEvent = withSnakeCaseKeys(extend2Lev(rumContext, viewContext, rawRumEvent)), context = extend2Lev({}, commonContext.context, viewContext.context, customerContext, rawRumEvent.context);
                            if (configuration.visitorId && configuration.visitorId.enabled) {
                                var visitorId = rawRumEvent.type === enums_RumEventType.RESOURCE && rawRumEvent.context && rawRumEvent.context.visitor_id || commonContext.visitorId || savedCommonContext && getCommonContext().visitorId;
                                visitorId && (context.visitor_id = visitorId);
                            }
                            isEmptyObject(context) || (serverRumEvent.context = context), "has_replay" in serverRumEvent.session || (serverRumEvent.session.has_replay = commonContext.hasReplay), 
                            session.errorSessionReplayAllowed && (serverRumEvent.session.has_replay = serverRumEvent.session.has_replay && session.sessionHasError), 
                            "view" === serverRumEvent.type && (serverRumEvent.session.sampled_for_error_replay = session.errorSessionReplayAllowed, 
                            serverRumEvent.session.sampled_for_error_session = session.isErrorSession, serverRumEvent.session.error_timestamp_for_session = session.sessionErrorTimestamp), 
                            isEmptyObject(commonContext.context.device) || (serverRumEvent.device = extend2Lev(serverRumEvent.device, commonContext.context.device)), 
                            isEmptyObject(commonContext.context.webview) || (serverRumEvent.webview = extend2Lev(serverRumEvent.webview, commonContext.context.webview)), 
                            isEmptyObject(commonContext.user) || (serverRumEvent.user = extend2Lev(serverRumEvent.user, {
                                is_signin: "T",
                                is_login: !0
                            }, commonContext.user)), shouldSend(serverRumEvent, configuration.beforeSend, domainContext, eventRateLimiters) && (isEmptyObject(serverRumEvent.context) && delete serverRumEvent.context, 
                            lifeCycle.notify(LifeCycleEventType_RUM_EVENT_COLLECTED, serverRumEvent), serverRumEvent.type === enums_RumEventType.VIEW && (collectedViews.has(viewContext) ? data.isForcedSessionUpdate && lifeCycle.notify(LifeCycleEventType_RUM_VIEW_FORCED_COLLECTED, serverRumEvent) : (collectedViews.add(viewContext), 
                            lifeCycle.notify(LifeCycleEventType_RUM_VIEW_FIRST_COLLECTED, serverRumEvent))));
                        }
                    } else pendingRawEvents.add((function() {
                        assemble(data);
                    }));
                }));
            }(configuration, lifeCycle, sessionManager, userSessionManager, viewContexts, urlContexts, actionContexts, displayContext, getCommonContext, reportError), 
            {
                viewContexts: viewContexts,
                urlContexts: urlContexts,
                pageStateHistory: pageStateHistory,
                addAction: addAction,
                actionContexts: actionContexts,
                stop: function() {
                    displayContext.stop(), pageStateHistory.stop(), urlContexts.stop(), viewContexts.stop();
                }
            };
        }(lifeCycle, configuration, location, session, userSession, pageStateHistory, locationChangeObservable, 0, getCommonContext, reportError), viewContexts = _startRumEventCollection.viewContexts, urlContexts = _startRumEventCollection.urlContexts, actionContexts = _startRumEventCollection.actionContexts, stopRumEventCollection = _startRumEventCollection.stop, addAction = _startRumEventCollection.addAction;
        cleanupTasks.push(stopRumEventCollection);
        const _startViewCollection = startViewCollection(lifeCycle, configuration, location, domMutationObservable, locationChangeObservable, pageStateHistory, recorderApi, initialViewOptions), addTiming = _startViewCollection.addTiming, startView = _startViewCollection.startView, setViewName = _startViewCollection.setViewName, setViewContext = _startViewCollection.setViewContext, setViewContextProperty = _startViewCollection.setViewContextProperty, getViewContext = _startViewCollection.getViewContext, stopViewCollection = _startViewCollection.stop;
        cleanupTasks.push(stopViewCollection);
        const _startResourceCollection = startResourceCollection(lifeCycle, configuration, pageStateHistory, void 0, void 0, resourceTrackerManager);
        var addResource = _startResourceCollection.addResource;
        cleanupTasks.push(_startResourceCollection.stop);
        var addError = startErrorCollection(lifeCycle, 0, session, pageStateHistory).addError;
        startRequestCollection(lifeCycle, configuration);
        var internalContext = function(applicationId, sessionManager, viewContexts, actionContexts, urlContexts) {
            return {
                get: function(startTime) {
                    var viewContext = viewContexts.findView(startTime), urlContext = urlContexts.findUrl(startTime), session = sessionManager.findTrackedSession(startTime);
                    if (session && viewContext && urlContext) {
                        var actionId = actionContexts.findActionId(startTime), actionIds = actionContexts.findAllActionId(startTime);
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
                            } : void 0,
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
        }(configuration.applicationId, session, viewContexts, actionContexts, urlContexts);
        return {
            addResource: addResource,
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
            setForcedSession: function() {
                session.setForcedSession({
                    refreshView: !0
                });
            },
            stopSession: function() {
                session.expire();
            },
            startSession: function(options) {
                session.startSession(options);
            },
            getInternalContext: internalContext.get,
            stop: function() {
                cleanupTasks.forEach((function(task) {
                    task();
                }));
            },
            createResourceTrackerId: function() {
                return resourceTrackerManager.createTrackerId();
            },
            setResourceContext: function(trackerId, context) {
                resourceTrackerManager.setResourceContext(trackerId, context);
            },
            appendResourceContext: function(trackerId, context) {
                resourceTrackerManager.appendResourceContext(trackerId, context);
            },
            finishResource: function(trackerId) {
                resourceTrackerManager.finishResource(trackerId);
            },
            getResource: function(trackerId) {
                return resourceTrackerManager.getResource(trackerId);
            }
        };
    }
    var PLUGIN_METHODS = [ "onInit", "onRumStart", "getConfigurationTelemetry" ];
    function validatePlugins(plugins) {
        if (void 0 === plugins) return !0;
        if (!isArray(plugins)) return display.error("Plugins should be an array"), !1;
        for (var i = 0; i < plugins.length; i += 1) {
            var plugin = plugins[i];
            if (!plugin || "string" !== tools_getType(plugin.name) || 0 === plugin.name.length) return display.error("Plugins should have a non-empty string name"), 
            !1;
            for (var methodIndex = 0; methodIndex < PLUGIN_METHODS.length; methodIndex += 1) {
                var methodName = PLUGIN_METHODS[methodIndex];
                if (void 0 !== plugin[methodName] && "function" !== tools_getType(plugin[methodName])) return display.error("Plugin " + plugin.name + " has an invalid " + methodName + " method"), 
                !1;
            }
        }
        return !0;
    }
    function callPluginsMethod(plugins, methodName, parameter) {
        plugins && tools_each(plugins, (function(plugin) {
            var method = plugin[methodName];
            "function" === tools_getType(method) && catchUserErrors_catchUserErrors((function() {
                return method.call(plugin, parameter);
            }), plugin.name + " plugin " + methodName + " threw an error:")();
        }));
    }
    var buildEnv = {
        sdkVersion: "3.3.21",
        sdkName: "df_web_rum_sdk"
    };
    function getCrypto() {
        return window.crypto || window.msCrypto;
    }
    var VISITOR_ID_PATTERN = /^[ps][0-9a-f]{32}$/;
    function startVisitorId(configuration) {
        if (!configuration.visitorId.enabled) return {
            getId: tools_noop,
            reset: tools_noop,
            stop: tools_noop
        };
        var manager = function(visitorIdConfiguration, options) {
            var browserManager = createBrowserVisitorIdManager(visitorIdConfiguration, options);
            function getBrowserManager() {
                return browserManager || (browserManager = createBrowserVisitorIdManager(visitorIdConfiguration, options)), 
                browserManager;
            }
            return {
                getId: function() {
                    return getBrowserManager().getId();
                },
                reset: function() {
                    getBrowserManager().reset();
                },
                stop: function() {
                    browserManager && browserManager.stop();
                }
            };
        }(configuration.visitorId);
        return {
            getId: manager.getId,
            reset: manager.reset,
            stop: function() {
                manager.stop();
            }
        };
    }
    function createBrowserVisitorIdManager(visitorIdConfiguration, options) {
        void 0 === options && (options = {});
        var getNow = options.getNow || timeStampNow, createIdentifier = options.createIdentifier || createIdentifierValue, localStorage = getStorage(options, "localStorage"), sessionStorage = getStorage(options, "sessionStorage"), ttl = 36e5 * visitorIdConfiguration.ttlHours, currentRecord = loadOrCreateRecord();
        function loadOrCreateRecord() {
            var now = getNow(), persistentRecord = readRecord(localStorage, "p", now, ttl), sessionRecord = readRecord(sessionStorage, "s", now, ttl);
            if (sessionRecord && persistentRecord) {
                var order = compareRecords(sessionRecord, persistentRecord);
                return order > 0 || 0 === order && void 0 === sessionRecord.revision && void 0 === persistentRecord.revision ? sessionRecord : persistentRecord;
            }
            return sessionRecord || persistentRecord ? sessionRecord || persistentRecord : createAndPersistRecord(now);
        }
        function createAndPersistRecord(now) {
            var identifier = createIdentifier(), revision = 0;
            [ currentRecord, readRecord(localStorage, "p", now, ttl), readRecord(sessionStorage, "s", now, ttl) ].forEach((function(record) {
                record && record.createdAt === now && (revision = Math.max(revision, (record.revision || 0) + 1));
            }));
            var storedPersistentRecord = writeRecord(localStorage, {
                id: "p" + identifier,
                createdAt: now,
                revision: revision
            }, "p", now, ttl);
            if (storedPersistentRecord) {
                try {
                    sessionStorage && sessionStorage.removeItem("_gc_visitor_id");
                } catch (error) {}
                return storedPersistentRecord;
            }
            var sessionRecord = {
                id: "s" + identifier,
                createdAt: now,
                revision: revision
            };
            return writeRecord(sessionStorage, sessionRecord, "s", now, ttl) || sessionRecord;
        }
        return {
            getId: function() {
                return function() {
                    var now = getNow();
                    return isValidRecord(currentRecord, void 0, now, ttl) || (currentRecord = loadOrCreateRecord()), 
                    currentRecord;
                }().id;
            },
            reset: function() {
                currentRecord = createAndPersistRecord(getNow());
            },
            stop: (localStorage ? addEventListener(window, DOM_EVENT_STORAGE, (function(event) {
                if ("_gc_visitor_id" === event.key && (!event.storageArea || event.storageArea === localStorage)) {
                    var nextRecord = readRecord(localStorage, "p", getNow(), ttl);
                    nextRecord && currentRecord && compareRecords(nextRecord, currentRecord) < 0 || (currentRecord = nextRecord);
                }
            })) : {
                stop: tools_noop
            }).stop
        };
    }
    function getStorage(options, storageName) {
        if (Object.prototype.hasOwnProperty.call(options, storageName)) return options[storageName];
        try {
            return window[storageName];
        } catch (error) {
            return;
        }
    }
    function readRecord(storage, expectedPrefix, now, ttl) {
        if (storage) try {
            return function(rawRecord, expectedPrefix, now, ttl) {
                if (!rawRecord) return;
                try {
                    var record = JSON.parse(rawRecord);
                    return isValidRecord(record, expectedPrefix, now, ttl) ? record : void 0;
                } catch (error) {
                    return;
                }
            }(storage.getItem("_gc_visitor_id"), expectedPrefix, now, ttl);
        } catch (error) {
            return;
        }
    }
    function writeRecord(storage, record, expectedPrefix, now, ttl) {
        if (storage) {
            try {
                storage.setItem("_gc_visitor_id", JSON.stringify(record));
            } catch (error) {
                return;
            }
            var storedRecord = readRecord(storage, expectedPrefix, now, ttl);
            return storedRecord && storedRecord.id === record.id && 0 === compareRecords(storedRecord, record) ? storedRecord : void 0;
        }
    }
    function isValidRecord(record, expectedPrefix, now, ttl) {
        return !!record && VISITOR_ID_PATTERN.test(record.id) && (!expectedPrefix || record.id.charAt(0) === expectedPrefix) && "number" == typeof record.createdAt && (void 0 === record.revision || "number" == typeof record.revision && isFinite(record.revision) && record.revision >= 0 && Math.floor(record.revision) === record.revision) && record.createdAt <= now && record.createdAt + ttl > now;
    }
    function compareRecords(first, second) {
        return first.createdAt - second.createdAt || (first.revision || 0) - (second.revision || 0);
    }
    function createIdentifierValue() {
        try {
            return function(byteLength) {
                var buffer = new Uint8Array(byteLength);
                getCrypto().getRandomValues(buffer);
                for (var parts = [], i = 0; i < buffer.length; i += 1) {
                    var hex = buffer[i].toString(16);
                    parts.push(1 === hex.length ? "0" + hex : hex);
                }
                return parts.join("");
            }(16);
        } catch (error) {
            return tools_UUID().replace(/-/g, "");
        }
    }
    function validateAndBuildRumConfiguration(initConfiguration) {
        if (initConfiguration.applicationId) {
            if (function(initConfiguration) {
                return initConfiguration.site || initConfiguration.datakitOrigin || initConfiguration.datakitUrl ? !(initConfiguration.site && !initConfiguration.clientToken && (display.error("clientToken is not configured, no RUM data will be collected."), 
                1)) : (display.error("datakitOrigin or site is not configured, no RUM data will be collected."), 
                !1);
            }(initConfiguration)) if (void 0 === initConfiguration.sessionOnErrorSampleRate || isPercentage(initConfiguration.sessionOnErrorSampleRate)) {
                var allowedTracingUrls = function(initConfiguration) {
                    void 0 !== initConfiguration.allowedTracingUrls && void 0 !== initConfiguration.allowedTracingOrigins && display.warn("Both allowedTracingUrls and allowedTracingOrigins (deprecated) have been defined. The parameter allowedTracingUrls will override allowedTracingOrigins.");
                    if (void 0 !== initConfiguration.allowedTracingUrls) {
                        if (!isArray(initConfiguration.allowedTracingUrls)) return void display.error("Allowed Tracing URLs should be an array");
                        var tracingOptions = [];
                        return tools_each(initConfiguration.allowedTracingUrls, (function(option) {
                            var expectedItem;
                            isMatchOption(option) ? tracingOptions.push({
                                match: option,
                                traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType_DDTRACE)
                            }) : "object" === tools_getType(expectedItem = option) && isMatchOption(expectedItem.match) && isString(expectedItem.traceType) ? tracingOptions.push(option) : display.warn("Allowed Tracing Urls parameters should be a string, RegExp, function, or an object. Ignoring parameter", option);
                        })), tracingOptions;
                    }
                    return [];
                }(initConfiguration);
                if (allowedTracingUrls) {
                    var visitorId = function(visitorId) {
                        if (void 0 === visitorId) return {
                            enabled: !1
                        };
                        if ("object" !== tools_getType(visitorId)) return void display.error("Visitor ID configuration should be an object");
                        if (void 0 !== visitorId.enabled && "boolean" != typeof visitorId.enabled) return void display.error("Visitor ID enabled should be a boolean");
                        if (!0 !== visitorId.enabled) return {
                            enabled: !1
                        };
                        if (void 0 !== visitorId.ttlHours && (!isNumber(visitorId.ttlHours) || !isFinite(visitorId.ttlHours) || visitorId.ttlHours <= 0)) return void display.error("Visitor ID TTL should be a positive number of hours");
                        return {
                            enabled: !0,
                            ttlHours: isNullUndefinedDefaultValue(visitorId.ttlHours, 24)
                        };
                    }(initConfiguration.visitorId);
                    if (visitorId) if (void 0 === initConfiguration.tracingSampleRate || isPercentage(initConfiguration.tracingSampleRate)) if (void 0 === initConfiguration.excludedActivityUrls || isArray(initConfiguration.excludedActivityUrls)) {
                        if (validatePlugins(initConfiguration.plugins)) {
                            var baseConfiguration = validateAndBuildConfiguration(initConfiguration);
                            if (baseConfiguration) {
                                var trackUserInteractions = !!isNullUndefinedDefaultValue(initConfiguration.trackUserInteractions, initConfiguration.trackInteractions);
                                return tools_assign({
                                    applicationId: initConfiguration.applicationId,
                                    actionNameAttribute: initConfiguration.actionNameAttribute,
                                    enablePrivacyForActionName: isNullUndefinedDefaultValue(initConfiguration.enablePrivacyForActionName, !1),
                                    sessionReplaySampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionReplaySampleRate, 100),
                                    sessionOnErrorSampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionOnErrorSampleRate, 0),
                                    sessionReplayOnErrorSampleRate: isNullUndefinedDefaultValue(initConfiguration.sessionReplayOnErrorSampleRate, 0),
                                    tracingSampleRate: isNullUndefinedDefaultValue(initConfiguration.tracingSampleRate, 100),
                                    allowTraceHeaderWithoutSession: !!initConfiguration.allowTraceHeaderWithoutSession,
                                    allowedTracingUrls: allowedTracingUrls,
                                    visitorId: visitorId,
                                    injectTraceHeader: initConfiguration.injectTraceHeader && catchUserErrors_catchUserErrors(initConfiguration.injectTraceHeader, "injectTraceHeader threw an error:"),
                                    generateTraceId: initConfiguration.generateTraceId && catchUserErrors_catchUserErrors(initConfiguration.generateTraceId, "generateTraceId threw an error:"),
                                    excludedActivityUrls: isNullUndefinedDefaultValue(initConfiguration.excludedActivityUrls, []),
                                    compressIntakeRequests: !!initConfiguration.compressIntakeRequests,
                                    trackUserInteractions: trackUserInteractions,
                                    trackWebSockets: isArray(initConfiguration.enableExperimentalFeatures) && -1 !== initConfiguration.enableExperimentalFeatures.indexOf(ExperimentalFeature_TRACK_WEBSOCKETS),
                                    enableLongAnimationFrame: !!initConfiguration.enableLongAnimationFrame,
                                    trackViewsManually: !!initConfiguration.trackViewsManually,
                                    plugins: initConfiguration.plugins || [],
                                    traceType: isNullUndefinedDefaultValue(initConfiguration.traceType, TraceType_DDTRACE),
                                    traceId128Bit: !!initConfiguration.traceId128Bit,
                                    defaultPrivacyLevel: objectHasValue(DefaultPrivacyLevel, initConfiguration.defaultPrivacyLevel) ? initConfiguration.defaultPrivacyLevel : DefaultPrivacyLevel.MASK_USER_INPUT,
                                    shouldMaskNode: initConfiguration.shouldMaskNode && catchUserErrors_catchUserErrors(initConfiguration.shouldMaskNode, "shouldMaskNode threw an error:")
                                }, baseConfiguration, buildEnv);
                            }
                        }
                    } else display.error("Excluded Activity Urls should be an array"); else display.error("Tracing Sample Rate should be a number between 0 and 100");
                }
            } else display.error("Error Session  Sample Rate should be a number between 0 and 100");
        } else display.error("Application ID is not configured, no RUM data will be collected.");
    }
    function createPreStartStrategy(rumPublicApiOptions, getCommonContext, doStartRum) {
        var firstStartViewCall, cachedInitConfiguration, cachedConfiguration, hasStarted, initializationPending, ignoreInitIfSyntheticsWillInjectRum = rumPublicApiOptions.ignoreInitIfSyntheticsWillInjectRum, overrideInitConfiguration = rumPublicApiOptions.overrideInitConfiguration, bufferApiCalls = createBoundedBuffer(), resourceTrackerManager = rumPublicApiOptions.resourceTrackerManager;
        function tryStartRum() {
            if (!hasStarted && cachedInitConfiguration && cachedConfiguration) {
                var initialViewOptions;
                if (cachedConfiguration.trackViewsManually) {
                    if (!firstStartViewCall) return;
                    bufferApiCalls.remove(firstStartViewCall.callback), initialViewOptions = firstStartViewCall.options;
                }
                var startRumResult = doStartRum(cachedConfiguration, undefined, initialViewOptions);
                hasStarted = !0, bufferApiCalls.drain(startRumResult);
            }
        }
        return {
            init: function(initConfiguration, publicApi) {
                initConfiguration ? ignoreInitIfSyntheticsWillInjectRum && Boolean(window._GUANCE_SYNTHETICS_INJECTS_RUM || cookie_getCookie("guance-synthetics-injects-rum")) ? cachedInitConfiguration = initConfiguration : initializationPending || cachedConfiguration ? displayAlreadyInitializedError("DATAFLUX_RUM", initConfiguration) : (cachedInitConfiguration = initConfiguration, 
                validatePlugins(initConfiguration.plugins) && (initializationPending = !0, rumPublicApiOptions.onInit && rumPublicApiOptions.onInit(initConfiguration, publicApi), 
                initConfiguration.remoteConfiguration || function(initConfiguration, remoteConfiguration) {
                    if (overrideInitConfiguration && (initConfiguration = overrideInitConfiguration(initConfiguration)), 
                    cachedInitConfiguration = initConfiguration, cachedConfiguration) displayAlreadyInitializedError("DATAFLUX_RUM", initConfiguration); else {
                        var configuration = validateAndBuildRumConfiguration(initConfiguration);
                        configuration ? (rumPublicApiOptions.onConfigurationReady && rumPublicApiOptions.onConfigurationReady(configuration), 
                        cachedConfiguration = configuration, initializationPending = !1, initFetchObservable().subscribe(tools_noop), 
                        tryStartRum()) : initializationPending = !1;
                    }
                }(initConfiguration))) : display.error("Missing configuration");
            },
            getInitConfiguration: function() {
                return cachedInitConfiguration;
            },
            getInternalContext: tools_noop,
            stopSession: tools_noop,
            startSession: function(options) {
                bufferApiCalls.add((startRumResult => startRumResult.startSession(options)));
            },
            setForcedSession: function() {
                bufferApiCalls.add((startRumResult => startRumResult.setForcedSession()));
            },
            addTiming: function(name, time) {
                void 0 === time && (time = timeStampNow()), bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addTiming(name, time);
                }));
            },
            startView: function(options, startClocks) {
                void 0 === startClocks && (startClocks = clocksNow());
                const callback = function(startRumResult) {
                    startRumResult.startView(options, startClocks);
                };
                bufferApiCalls.add(callback), firstStartViewCall || (firstStartViewCall = {
                    options: options,
                    callback: callback
                }, tryStartRum());
            },
            setViewName(name) {
                bufferApiCalls.add((startRumResult => startRumResult.setViewName(name)));
            },
            setViewContext(context) {
                bufferApiCalls.add((startRumResult => startRumResult.setViewContext(context)));
            },
            setViewContextProperty(key, value) {
                bufferApiCalls.add((startRumResult => startRumResult.setViewContextProperty(key, value)));
            },
            getViewContext: () => {},
            addTypeAction: function(action, type, commonContext) {
                void 0 === commonContext && (commonContext = getCommonContext()), bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addTypeAction(action, type, commonContext);
                }));
            },
            addAction: function(action, commonContext) {
                void 0 === commonContext && (commonContext = getCommonContext()), bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addAction(action, commonContext);
                }));
            },
            addResource: function(resource, commonContext) {
                void 0 === commonContext && (commonContext = getCommonContext()), bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addResource(resource, commonContext);
                }));
            },
            addError: function(providedError, commonContext) {
                void 0 === commonContext && (commonContext = getCommonContext()), bufferApiCalls.add((function(startRumResult) {
                    startRumResult.addError(providedError, commonContext);
                }));
            },
            createResourceTrackerId: function() {
                return resourceTrackerManager.createTrackerId();
            },
            setResourceContext: function(trackerId, context) {
                resourceTrackerManager.setResourceContext(trackerId, context);
            },
            appendResourceContext: function(trackerId, context) {
                resourceTrackerManager.appendResourceContext(trackerId, context);
            },
            finishResource: function(trackerId) {
                resourceTrackerManager.finishResource(trackerId);
            },
            getResource: function(trackerId) {
                return resourceTrackerManager.getResource(trackerId);
            }
        };
    }
    function createResourceTrackerManager() {
        var flushTrackedResource, trackers = new sdkMap_SDKMap;
        return {
            createTrackerId: function() {
                var trackerId = tools_UUID();
                return function(trackerId) {
                    var tracker = trackers.get(trackerId);
                    tracker || (tracker = {
                        id: trackerId,
                        status: "created",
                        context: {},
                        finished: !1,
                        flushed: !1,
                        requestHeaderMatched: !1
                    }, trackers.set(trackerId, tracker), tracker.orphanTimeoutId = setTimeout((function() {
                        tracker.status = "cleared", trackers.delete(tracker.id);
                    }), 3e5));
                }(trackerId), trackerId;
            },
            setResourceContext: function(trackerId, context) {
                var tracker = trackers.get(trackerId);
                tracker && (isTrackerImmutable(tracker) || (tracker.context = tools_assign({}, context || {})));
            },
            appendResourceContext: function(trackerId, context) {
                var tracker = trackers.get(trackerId);
                tracker && (isTrackerImmutable(tracker) || (tracker.context = tools_assign(tracker.context, context || {})));
            },
            finishResource: function(trackerId) {
                var tracker = trackers.get(trackerId);
                tracker && (tracker.finished = !0, "request_collected" === tracker.status ? flushTracker(tracker, "flushed") : "created" === tracker.status && (tracker.status = "finished"));
            },
            getResource: function(trackerId) {
                var tracker = trackers.get(trackerId);
                if (tracker) return function(tracker) {
                    return {
                        trackerId: tracker.id,
                        status: tracker.status,
                        context: deepClone(tracker.context),
                        resource: tracker.resource ? tools_assign({}, tracker.resource) : void 0,
                        rawRumEvent: tracker.rawResourceEvent ? cloneDebugRawRumEvent(tracker.rawResourceEvent) : void 0
                    };
                }(tracker);
            },
            trackRequestResource: function(trackerId, rawEvent) {
                var tracker = trackers.get(trackerId);
                return !!tracker && (!tracker.requestHeaderMatched && !tracker.flushed && (clearTrackerTimeout(tracker), 
                tracker.requestHeaderMatched = !0, tracker.rawResourceEvent = rawEvent.rawRumEvent, 
                tracker.startTime = rawEvent.startTime, tracker.domainContext = rawEvent.domainContext, 
                tracker.resource = function(rawRumEvent) {
                    var resource = rawRumEvent && rawRumEvent.resource;
                    if (!resource) return;
                    return {
                        type: resource.type,
                        url: resource.url,
                        method: resource.method,
                        status: resource.status
                    };
                }(rawEvent.rawRumEvent), tracker.status = "request_collected", tracker.finished ? flushTracker(tracker, "flushed") : tracker.timeoutId = setTimeout((function() {
                    tracker.timeoutId = void 0, "request_collected" === tracker.status && flushTracker(tracker, "timeout_flushed");
                }), 3e4), !0));
            },
            setFlushTrackedResource: function(handler) {
                flushTrackedResource = handler;
            },
            getTrackerIdFromRequestHeaders: function(requestHeaders) {
                return function(headers, key) {
                    if (!headers || !key) return;
                    var normalizedKey = String(key).toLowerCase();
                    if ("function" == typeof headers.get) return headers.get(key) || headers.get(normalizedKey) || void 0;
                    if (Array.isArray(headers)) {
                        for (var i = 0; i < headers.length; i += 1) {
                            var entry = headers[i];
                            if (Array.isArray(entry) && String(entry[0]).toLowerCase() === normalizedKey) return entry[1];
                        }
                        return;
                    }
                    for (var headerKey in headers) if (String(headerKey).toLowerCase() === normalizedKey) return headers[headerKey];
                }(requestHeaders, "x-rum-resource-id");
            }
        };
        function flushTracker(tracker, status) {
            if (!tracker.flushed && tracker.rawResourceEvent) if (clearTrackerTimeout(tracker), 
            tracker.flushed = !0, tracker.status = status, flushTrackedResource) try {
                flushTrackedResource({
                    startTime: tracker.startTime,
                    rawRumEvent: tracker.rawResourceEvent,
                    customerContext: tools_assign({}, tracker.context),
                    domainContext: tracker.domainContext
                });
            } catch (error) {} finally {
                scheduleTrackerClear(tracker);
            } else scheduleTrackerClear(tracker); else tracker.status = status;
        }
        function scheduleTrackerClear(tracker) {
            clearTrackerTimeout(tracker), tracker.clearTimeoutId = setTimeout((function() {
                tracker.status = "cleared", trackers.delete(tracker.id);
            }), 6e4);
        }
    }
    function clearTrackerTimeout(tracker) {
        tracker.timeoutId && (clearTimeout(tracker.timeoutId), tracker.timeoutId = void 0), 
        tracker.orphanTimeoutId && (clearTimeout(tracker.orphanTimeoutId), tracker.orphanTimeoutId = void 0), 
        tracker.clearTimeoutId && (clearTimeout(tracker.clearTimeoutId), tracker.clearTimeoutId = void 0);
    }
    function isTrackerImmutable(tracker) {
        return "flushed" === tracker.status || "timeout_flushed" === tracker.status || "cleared" === tracker.status;
    }
    function cloneDebugRawRumEvent(rawRumEvent) {
        var clonedEvent = {};
        for (var key in rawRumEvent) Object.prototype.hasOwnProperty.call(rawRumEvent, key) && (clonedEvent[key] = cloneDebugObject(rawRumEvent[key], 8));
        return clonedEvent;
    }
    function cloneDebugObject(value, depth) {
        if (!value || "object" != typeof value || depth < 0) return value;
        if (Array.isArray(value)) {
            for (var clonedArray = [], i = 0; i < value.length; i += 1) clonedArray.push(cloneDebugObject(value[i], depth - 1));
            return clonedArray;
        }
        var clonedObject = {};
        for (var key in value) Object.prototype.hasOwnProperty.call(value, key) && (clonedObject[key] = cloneDebugObject(value[key], depth - 1));
        return clonedObject;
    }
    function makeRumPublicApi(startRumImpl, recorderApi, options) {
        void 0 === options && (options = {});
        var startVisitorIdImpl = options.startVisitorId || startVisitorId;
        const customerDataTrackerManager = function() {
            let compressionStatus = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : CustomerDataCompressionStatus_Disabled;
            const customerDataTrackers = new sdkMap_SDKMap;
            let alreadyWarned = !1;
            function checkCustomerDataLimit() {
                if (alreadyWarned || compressionStatus === CustomerDataCompressionStatus_Unknown) return;
                const bytesCountLimit = compressionStatus === CustomerDataCompressionStatus_Disabled ? 3072 : 16384;
                let bytesCount = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                customerDataTrackers.forEach((tracker => {
                    bytesCount += tracker.getBytesCount();
                })), bytesCount > bytesCountLimit && (displayCustomerDataLimitReachedWarning(bytesCountLimit), 
                alreadyWarned = !0);
            }
            return {
                createDetachedTracker: () => {
                    const tracker = createCustomerDataTracker((() => checkCustomerDataLimit(tracker.getBytesCount())));
                    return tracker;
                },
                getOrCreateTracker: type => (customerDataTrackers.has(type) || customerDataTrackers.set(type, createCustomerDataTracker(checkCustomerDataLimit)), 
                customerDataTrackers.get(type)),
                setCompressionStatus: newCompressionStatus => {
                    compressionStatus === CustomerDataCompressionStatus_Unknown && (compressionStatus = newCompressionStatus, 
                    checkCustomerDataLimit());
                },
                getCompressionStatus: () => compressionStatus,
                stop: () => {
                    customerDataTrackers.forEach((tracker => tracker.stop())), customerDataTrackers.clear();
                }
            };
        }(CustomerDataCompressionStatus_Unknown), resourceTrackerManager = createResourceTrackerManager(), globalContextManager = createContextManager("global", {
            customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType_GlobalContext)
        }), userContextManager = createContextManager("user", {
            customerDataTracker: customerDataTrackerManager.getOrCreateTracker(CustomerDataType_User),
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
        var visitorId = {
            getId: tools_noop,
            reset: tools_noop,
            stop: tools_noop
        };
        function getCommonContext() {
            var commonContext = function(globalContextManager, userContextManager, recorderApi) {
                return {
                    context: globalContextManager.getContext(),
                    user: userContextManager.getContext(),
                    hasReplay: !1
                };
            }(globalContextManager, userContextManager), currentVisitorId = visitorId.getId();
            return currentVisitorId && (commonContext.context.visitor_id = currentVisitorId, 
            commonContext.visitorId = currentVisitorId), commonContext;
        }
        let strategy;
        function addPluginError(providedError) {
            monitor_callMonitored((function() {
                providedError = providedError || {}, strategy.addError(tools_assign({}, providedError, {
                    context: sanitize(providedError.context)
                }), getCommonContext()), addTelemetryUsage({
                    feature: "add-error"
                });
            }));
        }
        strategy = createPreStartStrategy(tools_assign({}, options, {
            resourceTrackerManager: resourceTrackerManager,
            onInit: function(initConfiguration, publicApi) {
                callPluginsMethod(initConfiguration.plugins, "onInit", {
                    addError: addPluginError,
                    publicApi: publicApi,
                    rum: publicApi,
                    initConfiguration: initConfiguration
                });
            },
            onConfigurationReady: function(configuration) {
                visitorId.stop(), visitorId = startVisitorIdImpl(configuration);
            }
        }), getCommonContext, (function(configuration, compressionWorker, initialViewOptions) {
            configuration.storeContextsToLocal && (storeContextManager(configuration, globalContextManager, "rum", CustomerDataType_GlobalContext), 
            storeContextManager(configuration, userContextManager, "rum", CustomerDataType_User)), 
            customerDataTrackerManager.setCompressionStatus(compressionWorker ? CustomerDataCompressionStatus_Enabled : CustomerDataCompressionStatus_Disabled);
            var startRumResult = startRumImpl(configuration, recorderApi, customerDataTrackerManager, getCommonContext, initialViewOptions, compressionWorker && options.createCompressionEncoder ? function(streamId) {
                return options.createCompressionEncoder(compressionWorker, streamId);
            } : createIdentityEncoder, resourceTrackerManager);
            return strategy = function(preStartStrategy, startRumResult) {
                return tools_assign({
                    init: function(initConfiguration) {
                        displayAlreadyInitializedError("DATAFLUX_RUM", initConfiguration);
                    },
                    initConfiguration: preStartStrategy.getInitConfiguration()
                }, startRumResult);
            }(strategy, startRumResult), callPluginsMethod(configuration.plugins, "onRumStart", {
                addError: addPluginError,
                publicApi: rumPublicApi,
                rum: rumPublicApi
            }), startRumResult;
        }));
        const startView = monitor((function(options) {
            const sanitizedOptions = "object" == typeof options ? options : {
                name: options
            };
            strategy.startView(sanitizedOptions), sanitizedOptions.context && customerDataTrackerManager.getOrCreateTracker(CustomerDataType_View).updateCustomerData(sanitizedOptions.context);
        }));
        var stub, publicApi, rumPublicApi = (stub = tools_assign({
            init: monitor((function(initConfiguration) {
                strategy.init(initConfiguration, rumPublicApi);
            })),
            setViewName: monitor((name => {
                strategy.setViewName(name);
            })),
            setViewContext: monitor((context => {
                strategy.setViewContext(context);
            })),
            setViewContextProperty: monitor(((key, value) => {
                strategy.setViewContextProperty(key, value);
            })),
            getViewContext: monitor((() => strategy.getViewContext())),
            setGlobalContextProperty: monitor((function(key, value) {
                globalContextManager.setContextProperty(key, value);
            })),
            removeGlobalContextProperty: monitor((function(key) {
                return globalContextManager.removeContextProperty(key);
            })),
            getGlobalContext: monitor((function() {
                return context = globalContextManager.getContext(), (currentVisitorId = visitorId.getId()) && (context.visitor_id = currentVisitorId), 
                context;
                var context, currentVisitorId;
            })),
            setGlobalContext: monitor((function(context) {
                globalContextManager.setContext(context);
            })),
            clearGlobalContext: monitor((function() {
                return globalContextManager.clearContext();
            })),
            resetVisitorId: monitor((function() {
                visitorId.reset(), addTelemetryUsage({
                    feature: "reset-visitor-id"
                });
            })),
            getInitConfiguration: monitor((function() {
                return deepClone(strategy.initConfiguration);
            })),
            getInternalContext: monitor((function(startTime) {
                return strategy.getInternalContext(startTime);
            })),
            addResource: monitor((function(context) {
                const handlingStack = errorTools_createHandlingStack();
                monitor_callMonitored((function() {
                    strategy.addResource({
                        context: sanitize(context),
                        startClocks: clocksNow(),
                        type: enums_ResourceType_CUSTOM,
                        handlingStack: handlingStack
                    });
                }));
            })),
            addTypeAction: monitor((function(name, type, context) {
                const handlingStack = errorTools_createHandlingStack();
                monitor_callMonitored((function() {
                    const sourceType = sanitize(type);
                    strategy.addAction({
                        name: sanitize(name),
                        context: sanitize(context),
                        startClocks: clocksNow(),
                        type: "string" === tools_getType(sourceType) ? sourceType : ActionType_CUSTOM,
                        handlingStack: handlingStack
                    });
                }));
            })),
            addAction: monitor((function(name, context) {
                const handlingStack = errorTools_createHandlingStack();
                monitor_callMonitored((function() {
                    strategy.addAction({
                        name: sanitize(name),
                        context: sanitize(context),
                        startClocks: clocksNow(),
                        type: ActionType_CUSTOM,
                        handlingStack: handlingStack
                    });
                }));
            })),
            addError: monitor((function(error, context) {
                var handlingStack = errorTools_createHandlingStack();
                monitor_callMonitored((function() {
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
                (function(newUser) {
                    var isValid = "object" === tools_getType(newUser);
                    return isValid || display.error("Unsupported user:", newUser), isValid;
                })(newUser) && userContextManager.setContext(sanitizeUser(newUser));
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
            })),
            startSession: monitor((function(options) {
                strategy.startSession(options), addTelemetryUsage({
                    feature: "start-session",
                    sessionSampleRate: options && options.sessionSampleRate
                });
            })),
            setForcedSession: monitor((function() {
                strategy.setForcedSession(), addTelemetryUsage({
                    feature: "set-forced-session"
                });
            })),
            createResourceTrackerId: monitor((function() {
                return resourceTrackerManager.createTrackerId();
            })),
            setResourceContext: monitor((function(trackerId, context) {
                return resourceTrackerManager.setResourceContext(trackerId, sanitize(context));
            })),
            appendResourceContext: monitor((function(trackerId, context) {
                return resourceTrackerManager.appendResourceContext(trackerId, sanitize(context));
            })),
            finishResource: monitor((function(trackerId) {
                return resourceTrackerManager.finishResource(trackerId);
            })),
            getResource: monitor((function(trackerId) {
                return resourceTrackerManager.getResource(trackerId);
            }))
        }, {}), publicApi = tools_assign({
            onReady: function(callback) {
                callback();
            }
        }, stub), Object.defineProperty(publicApi, "_setDebug", {
            get: function() {
                return setDebugMode;
            },
            enumerable: !1
        }), publicApi);
        return rumPublicApi;
    }
    !function(createRecorderApi, options) {
        var datafluxRum;
        try {
            datafluxRum = makeRumPublicApi(startRum, createRecorderApi(), options);
        } catch (error) {
            datafluxRum = function(withReplay) {
                function noop() {}
                var api = {};
                return [ "init", "setViewName", "setViewContext", "setViewContextProperty", "addRumGlobalContext", "setGlobalContextProperty", "removeRumGlobalContext", "removeGlobalContextProperty", "setRumGlobalContext", "setGlobalContext", "clearGlobalContext", "resetVisitorId", "getInitConfiguration", "getInternalContext", "addDebugSession", "clearDebugSession", "getDebugSession", "addResource", "addTypeAction", "addAction", "addError", "addTiming", "setUser", "setUserProperty", "removeUserProperty", "removeUser", "clearUser", "startView", "stopSession", "startSession", "setForcedSession", "setResourceContext", "appendResourceContext", "finishResource", "getResource" ].forEach((function(name) {
                    api[name] = noop;
                })), api.getGlobalContext = api.getRumGlobalContext = api.getViewContext = api.getUser = function() {
                    return {};
                }, api.createResourceTrackerId = function() {
                    return "";
                }, api.getRemoteConfiguration = noop, api.onReady = function(callback) {
                    callback();
                }, api;
            }(!options || options.makeRecorderPublicApi), monitorError(error);
        }
        monitor_callMonitored((function() {
            var global, name, api, existingGlobalVariable;
            global = getGlobalObject(), api = datafluxRum, existingGlobalVariable = global[name = "DATAFLUX_RUM"], 
            global[name] = api, existingGlobalVariable && existingGlobalVariable.q && tools_each(existingGlobalVariable.q, (function(fn) {
                catchUserErrors_catchUserErrors(fn, "onReady callback threw an error:")();
            }));
        }));
    }((function() {
        return function() {};
    }), {});
}();