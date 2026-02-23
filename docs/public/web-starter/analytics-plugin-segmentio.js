var AnalyticsPluginSegmentio = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var dist = {};

    var facade = {};

    var clone$1 = {};

    Object.defineProperty(clone$1, "__esModule", { value: true });
    clone$1.clone = void 0;
    function clone(properties) {
        if (Object.prototype.toString.call(properties) === '[object Object]') {
            var temp = {};
            for (var key in properties) {
                temp[key] = clone(properties[key]);
            }
            return temp;
        }
        else if (Array.isArray(properties)) {
            return properties.map(clone);
        }
        else {
            return properties;
        }
    }
    clone$1.clone = clone;

    var isEnabled = {};

    Object.defineProperty(isEnabled, "__esModule", { value: true });
    var disabled = {
        Salesforce: true,
    };
    function default_1(integration) {
        return !disabled[integration];
    }
    isEnabled.default = default_1;

    var lib$2 = {};

    /**
     * Matcher, slightly modified from:
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     */

    var matcher$3 = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

    /**
     * Convert an ISO date string to a date. Fallback to native `Date.parse`.
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     *
     * @param {String} iso
     * @return {Date}
     */

    lib$2.parse = function(iso) {
      var numericKeys = [1, 5, 6, 7, 11, 12];
      var arr = matcher$3.exec(iso);
      var offset = 0;

      // fallback to native parsing
      if (!arr) {
        return new Date(iso);
      }

      /* eslint-disable no-cond-assign */
      // remove undefined values
      for (var i = 0, val; val = numericKeys[i]; i++) {
        arr[val] = parseInt(arr[val], 10) || 0;
      }
      /* eslint-enable no-cond-assign */

      // allow undefined days and months
      arr[2] = parseInt(arr[2], 10) || 1;
      arr[3] = parseInt(arr[3], 10) || 1;

      // month is 0-11
      arr[2]--;

      // allow abitrary sub-second precision
      arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

      // apply timezone if one exists
      if (arr[4] === ' ') {
        offset = new Date().getTimezoneOffset();
      } else if (arr[9] !== 'Z' && arr[10]) {
        offset = arr[11] * 60 + arr[12];
        if (arr[10] === '+') {
          offset = 0 - offset;
        }
      }

      var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
      return new Date(millis);
    };


    /**
     * Checks whether a `string` is an ISO date string. `strict` mode requires that
     * the date string at least have a year, month and date.
     *
     * @param {String} string
     * @param {Boolean} strict
     * @return {Boolean}
     */

    lib$2.is = function(string, strict) {
      if (typeof string !== 'string') {
        return false;
      }
      if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
        return false;
      }
      return matcher$3.test(string);
    };

    var milliseconds$1 = {};

    /**
     * Matcher.
     */

    var matcher$2 = /\d{13}/;

    /**
     * Check whether a string is a millisecond date string.
     *
     * @param {string} string
     * @return {boolean}
     */
    milliseconds$1.is = function (string) {
      return matcher$2.test(string);
    };

    /**
     * Convert a millisecond string to a date.
     *
     * @param {string} millis
     * @return {Date}
     */
    milliseconds$1.parse = function (millis) {
      millis = parseInt(millis, 10);
      return new Date(millis);
    };

    var seconds$1 = {};

    /**
     * Matcher.
     */

    var matcher$1 = /\d{10}/;

    /**
     * Check whether a string is a second date string.
     *
     * @param {string} string
     * @return {Boolean}
     */
    seconds$1.is = function (string) {
      return matcher$1.test(string);
    };

    /**
     * Convert a second string to a date.
     *
     * @param {string} seconds
     * @return {Date}
     */
    seconds$1.parse = function (seconds) {
      var millis = parseInt(seconds, 10) * 1000;
      return new Date(millis);
    };

    var isodate$1 = lib$2;
    var milliseconds = milliseconds$1;
    var seconds = seconds$1;

    var objProto = Object.prototype;
    var toStr = objProto.toString;

    function isDate(value) {
      return toStr.call(value) === "[object Date]";
    }

    function isNumber(value) {
      return toStr.call(value) === "[object Number]";
    }

    /**
     * Returns a new Javascript Date object, allowing a variety of extra input types
     * over the native Date constructor.
     *
     * @param {Date|string|number} val
     */
    var lib$1 = function newDate(val) {
      if (isDate(val)) return val;
      if (isNumber(val)) return new Date(toMs(val));

      // date strings
      if (isodate$1.is(val)) {
        return isodate$1.parse(val);
      }
      if (milliseconds.is(val)) {
        return milliseconds.parse(val);
      }
      if (seconds.is(val)) {
        return seconds.parse(val);
      }

      // fallback to Date.parse
      return new Date(val);
    };

    /**
     * If the number passed val is seconds from the epoch, turn it into milliseconds.
     * Milliseconds would be greater than 31557600000 (December 31, 1970).
     *
     * @param {number} num
     */
    function toMs(num) {
      if (num < 31557600000) return num * 1000;
      return num;
    }

    var analytics_jsObjCase = {exports: {}};

    (function (module) {


    /**
     * Module exports, export
     */

    module.exports = multiple(find);
    module.exports.find = module.exports;


    /**
     * Export the replacement function, return the modified object
     */

    module.exports.replace = function (obj, key, val, options) {
      multiple(replace).call(this, obj, key, val, options);
      return obj;
    };


    /**
     * Export the delete function, return the modified object
     */

    module.exports.del = function (obj, key, options) {
      multiple(del).call(this, obj, key, null, options);
      return obj;
    };


    /**
     * Compose applying the function to a nested key
     */

    function multiple (fn) {
      return function (obj, path, val, options) {
        var normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
        path = normalize(path);

        var key;
        var finished = false;

        while (!finished) loop();

        function loop() {
          for (key in obj) {
            var normalizedKey = normalize(key);
            if (0 === path.indexOf(normalizedKey)) {
              var temp = path.substr(normalizedKey.length);
              if (temp.charAt(0) === '.' || temp.length === 0) {
                path = temp.substr(1);
                var child = obj[key];

                // we're at the end and there is nothing.
                if (null == child) {
                  finished = true;
                  return;
                }

                // we're at the end and there is something.
                if (!path.length) {
                  finished = true;
                  return;
                }

                // step into child
                obj = child;

                // but we're done here
                return;
              }
            }
          }

          key = undefined;
          // if we found no matching properties
          // on the current object, there's no match.
          finished = true;
        }

        if (!key) return;
        if (null == obj) return obj;

        // the `obj` and `key` is one above the leaf object and key, so
        // start object: { a: { 'b.c': 10 } }
        // end object: { 'b.c': 10 }
        // end key: 'b.c'
        // this way, you can do `obj[key]` and get `10`.
        return fn(obj, key, val);
      };
    }


    /**
     * Find an object by its key
     *
     * find({ first_name : 'Calvin' }, 'firstName')
     */

    function find (obj, key) {
      if (obj.hasOwnProperty(key)) return obj[key];
    }


    /**
     * Delete a value for a given key
     *
     * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
     */

    function del (obj, key) {
      if (obj.hasOwnProperty(key)) delete obj[key];
      return obj;
    }


    /**
     * Replace an objects existing value with a new one
     *
     * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
     */

    function replace (obj, key, val) {
      if (obj.hasOwnProperty(key)) obj[key] = val;
      return obj;
    }

    /**
     * Normalize a `dot.separated.path`.
     *
     * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
     *
     * @param {String} path
     * @return {String}
     */

    function defaultNormalize(path) {
      return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
    }

    /**
     * Check if a value is a function.
     *
     * @param {*} val
     * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
     */

    function isFunction(val) {
      return typeof val === 'function';
    }
    }(analytics_jsObjCase));

    var isodate = lib$2;

    /**
     * Expose `traverse`.
     */
    var lib = traverse;

    /**
     * Recursively traverse an object or array, and convert
     * all ISO date strings parse into Date objects.
     *
     * @param {Object} input - object, array, or string to convert
     * @param {Boolean} strict - only convert strings with year, month, and date
     * @return {Object}
     */
    function traverse(input, strict) {
      if (strict === undefined) strict = true;
      if (input && typeof input === 'object') {
        return traverseObject(input, strict);
      } else if (Array.isArray(input)) {
        return traverseArray(input, strict);
      } else if (isodate.is(input, strict)) {
        return isodate.parse(input);
      }
      return input;
    }

    /**
     * Object traverser helper function.
     *
     * @param {Object} obj - object to traverse
     * @param {Boolean} strict - only convert strings with year, month, and date
     * @return {Object}
     */
    function traverseObject(obj, strict) {
      Object.keys(obj).forEach(function(key) {
        obj[key] = traverse(obj[key], strict);
      });
      return obj;
    }

    /**
     * Array traverser helper function
     *
     * @param {Array} arr - array to traverse
     * @param {Boolean} strict - only convert strings with year, month, and date
     * @return {Array}
     */
    function traverseArray(arr, strict) {
      arr.forEach(function(value, index) {
        arr[index] = traverse(value, strict);
      });
      return arr;
    }

    var __importDefault$5 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(facade, "__esModule", { value: true });
    facade.Facade = void 0;
    var clone_1 = clone$1;
    var is_enabled_1 = __importDefault$5(isEnabled);
    var new_date_1$1 = __importDefault$5(lib$1);
    var analytics_js_obj_case_1$1 = __importDefault$5(analytics_jsObjCase.exports);
    var analytics_js_isodate_traverse_1 = __importDefault$5(lib);
    function Facade(obj, opts) {
        opts = opts || {};
        this.raw = clone_1.clone(obj);
        if (!("clone" in opts))
            opts.clone = true;
        if (opts.clone)
            obj = clone_1.clone(obj);
        if (!("traverse" in opts))
            opts.traverse = true;
        if (!("timestamp" in obj))
            obj.timestamp = new Date();
        else
            obj.timestamp = new_date_1$1.default(obj.timestamp);
        if (opts.traverse)
            analytics_js_isodate_traverse_1.default(obj);
        this.opts = opts;
        this.obj = obj;
    }
    facade.Facade = Facade;
    var f = Facade.prototype;
    f.proxy = function (field) {
        var fields = field.split(".");
        field = fields.shift();
        var obj = this[field] || this.field(field);
        if (!obj)
            return obj;
        if (typeof obj === "function")
            obj = obj.call(this) || {};
        if (fields.length === 0)
            return this.opts.clone ? transform(obj) : obj;
        obj = analytics_js_obj_case_1$1.default(obj, fields.join("."));
        return this.opts.clone ? transform(obj) : obj;
    };
    f.field = function (field) {
        var obj = this.obj[field];
        return this.opts.clone ? transform(obj) : obj;
    };
    Facade.proxy = function (field) {
        return function () {
            return this.proxy(field);
        };
    };
    Facade.field = function (field) {
        return function () {
            return this.field(field);
        };
    };
    Facade.multi = function (path) {
        return function () {
            var multi = this.proxy(path + "s");
            if (Array.isArray(multi))
                return multi;
            var one = this.proxy(path);
            if (one)
                one = [this.opts.clone ? clone_1.clone(one) : one];
            return one || [];
        };
    };
    Facade.one = function (path) {
        return function () {
            var one = this.proxy(path);
            if (one)
                return one;
            var multi = this.proxy(path + "s");
            if (Array.isArray(multi))
                return multi[0];
        };
    };
    f.json = function () {
        var ret = this.opts.clone ? clone_1.clone(this.obj) : this.obj;
        if (this.type)
            ret.type = this.type();
        return ret;
    };
    f.rawEvent = function () {
        return this.raw;
    };
    f.options = function (integration) {
        var obj = this.obj.options || this.obj.context || {};
        var options = this.opts.clone ? clone_1.clone(obj) : obj;
        if (!integration)
            return options;
        if (!this.enabled(integration))
            return;
        var integrations = this.integrations();
        var value = integrations[integration] || analytics_js_obj_case_1$1.default(integrations, integration);
        if (typeof value !== "object")
            value = analytics_js_obj_case_1$1.default(this.options(), integration);
        return typeof value === "object" ? value : {};
    };
    f.context = f.options;
    f.enabled = function (integration) {
        var allEnabled = this.proxy("options.providers.all");
        if (typeof allEnabled !== "boolean")
            allEnabled = this.proxy("options.all");
        if (typeof allEnabled !== "boolean")
            allEnabled = this.proxy("integrations.all");
        if (typeof allEnabled !== "boolean")
            allEnabled = true;
        var enabled = allEnabled && is_enabled_1.default(integration);
        var options = this.integrations();
        if (options.providers && options.providers.hasOwnProperty(integration)) {
            enabled = options.providers[integration];
        }
        if (options.hasOwnProperty(integration)) {
            var settings = options[integration];
            if (typeof settings === "boolean") {
                enabled = settings;
            }
            else {
                enabled = true;
            }
        }
        return !!enabled;
    };
    f.integrations = function () {
        return (this.obj.integrations || this.proxy("options.providers") || this.options());
    };
    f.active = function () {
        var active = this.proxy("options.active");
        if (active === null || active === undefined)
            active = true;
        return active;
    };
    f.anonymousId = function () {
        return this.field("anonymousId") || this.field("sessionId");
    };
    f.sessionId = f.anonymousId;
    f.groupId = Facade.proxy("options.groupId");
    f.traits = function (aliases) {
        var ret = this.proxy("options.traits") || {};
        var id = this.userId();
        aliases = aliases || {};
        if (id)
            ret.id = id;
        for (var alias in aliases) {
            var value = this[alias] == null
                ? this.proxy("options.traits." + alias)
                : this[alias]();
            if (value == null)
                continue;
            ret[aliases[alias]] = value;
            delete ret[alias];
        }
        return ret;
    };
    f.library = function () {
        var library = this.proxy("options.library");
        if (!library)
            return { name: "unknown", version: null };
        if (typeof library === "string")
            return { name: library, version: null };
        return library;
    };
    f.device = function () {
        var device = this.proxy("context.device");
        if (typeof device !== "object" || device === null) {
            device = {};
        }
        var library = this.library().name;
        if (device.type)
            return device;
        if (library.indexOf("ios") > -1)
            device.type = "ios";
        if (library.indexOf("android") > -1)
            device.type = "android";
        return device;
    };
    f.userAgent = Facade.proxy("context.userAgent");
    f.timezone = Facade.proxy("context.timezone");
    f.timestamp = Facade.field("timestamp");
    f.channel = Facade.field("channel");
    f.ip = Facade.proxy("context.ip");
    f.userId = Facade.field("userId");
    function transform(obj) {
        return clone_1.clone(obj);
    }

    var identify = {};

    var inherits_browser = {exports: {}};

    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      // old school shim for old browsers
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }

    var isEmail$1 = {};

    Object.defineProperty(isEmail$1, "__esModule", { value: true });
    var matcher = /.+\@.+\..+/;
    function isEmail(string) {
        return matcher.test(string);
    }
    isEmail$1.default = isEmail;

    var __importDefault$4 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(identify, "__esModule", { value: true });
    identify.Identify = void 0;
    var facade_1$3 = facade;
    var analytics_js_obj_case_1 = __importDefault$4(analytics_jsObjCase.exports);
    var inherits_1$4 = __importDefault$4(inherits_browser.exports);
    var is_email_1$2 = __importDefault$4(isEmail$1);
    var new_date_1 = __importDefault$4(lib$1);
    var trim = function (str) { return str.trim(); };
    function Identify(dictionary, opts) {
        facade_1$3.Facade.call(this, dictionary, opts);
    }
    identify.Identify = Identify;
    inherits_1$4.default(Identify, facade_1$3.Facade);
    var i = Identify.prototype;
    i.action = function () {
        return "identify";
    };
    i.type = i.action;
    i.traits = function (aliases) {
        var ret = this.field("traits") || {};
        var id = this.userId();
        aliases = aliases || {};
        if (id)
            ret.id = id;
        for (var alias in aliases) {
            var value = this[alias] == null ? this.proxy("traits." + alias) : this[alias]();
            if (value == null)
                continue;
            ret[aliases[alias]] = value;
            if (alias !== aliases[alias])
                delete ret[alias];
        }
        return ret;
    };
    i.email = function () {
        var email = this.proxy("traits.email");
        if (email)
            return email;
        var userId = this.userId();
        if (is_email_1$2.default(userId))
            return userId;
    };
    i.created = function () {
        var created = this.proxy("traits.created") || this.proxy("traits.createdAt");
        if (created)
            return new_date_1.default(created);
    };
    i.name = function () {
        var name = this.proxy("traits.name");
        if (typeof name === "string") {
            return trim(name);
        }
        var firstName = this.firstName();
        var lastName = this.lastName();
        if (firstName && lastName) {
            return trim(firstName + " " + lastName);
        }
    };
    i.uid = function () {
        return this.userId() || this.username() || this.email();
    };
    i.description = function () {
        return this.proxy("traits.description") || this.proxy("traits.background");
    };
    i.avatar = function () {
        var traits = this.traits();
        return (analytics_js_obj_case_1.default(traits, "avatar") || analytics_js_obj_case_1.default(traits, "photoUrl") || analytics_js_obj_case_1.default(traits, "avatarUrl"));
    };
    i.username = facade_1$3.Facade.proxy("traits.username");

    var track = {};

    var __importDefault$3 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(track, "__esModule", { value: true });
    track.Track = void 0;
    var inherits_1$3 = __importDefault$3(inherits_browser.exports);
    var facade_1$2 = facade;
    var identify_1 = identify;
    var is_email_1$1 = __importDefault$3(isEmail$1);
    function Track(dictionary, opts) {
        facade_1$2.Facade.call(this, dictionary, opts);
    }
    track.Track = Track;
    inherits_1$3.default(Track, facade_1$2.Facade);
    var t = Track.prototype;
    t.action = function () {
        return "track";
    };
    t.type = t.action;
    t.event = facade_1$2.Facade.field("event");
    t.value = facade_1$2.Facade.proxy("properties.value");
    t.category = facade_1$2.Facade.proxy("properties.category");
    t.id = facade_1$2.Facade.proxy("properties.id");
    t.name = facade_1$2.Facade.proxy("properties.name");
    t.description = facade_1$2.Facade.proxy("properties.description");
    t.plan = facade_1$2.Facade.proxy("properties.plan");
    t.referrer = function () {
        return (this.proxy("context.referrer.url") ||
            this.proxy("context.page.referrer") ||
            this.proxy("properties.referrer"));
    };
    t.query = facade_1$2.Facade.proxy("options.query");
    t.properties = function (aliases) {
        var ret = this.field("properties") || {};
        aliases = aliases || {};
        for (var alias in aliases) {
            var value = this[alias] == null ? this.proxy("properties." + alias) : this[alias]();
            if (value == null)
                continue;
            ret[aliases[alias]] = value;
            delete ret[alias];
        }
        return ret;
    };
    t.username = function () {
        return (this.proxy("traits.username") ||
            this.proxy("properties.username") ||
            this.userId() ||
            this.sessionId());
    };
    t.email = function () {
        var email = this.proxy("traits.email") ||
            this.proxy("properties.email") ||
            this.proxy("options.traits.email");
        if (email)
            return email;
        var userId = this.userId();
        if (is_email_1$1.default(userId))
            return userId;
    };
    t.revenue = function () {
        var revenue = this.proxy("properties.revenue");
        var event = this.event();
        var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;
        if (!revenue && event && event.match(orderCompletedRegExp)) {
            revenue = this.proxy("properties.total");
        }
        return currency(revenue);
    };
    t.identify = function () {
        var json = this.json();
        json.traits = this.traits();
        return new identify_1.Identify(json, this.opts);
    };
    function currency(val) {
        if (!val)
            return;
        if (typeof val === "number") {
            return val;
        }
        if (typeof val !== "string") {
            return;
        }
        val = val.replace(/\$/g, "");
        val = parseFloat(val);
        if (!isNaN(val)) {
            return val;
        }
    }

    var page = {};

    var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(page, "__esModule", { value: true });
    page.Page = void 0;
    var inherits_1$2 = __importDefault$2(inherits_browser.exports);
    var facade_1$1 = facade;
    var track_1$1 = track;
    var is_email_1 = __importDefault$2(isEmail$1);
    function Page(dictionary, opts) {
        facade_1$1.Facade.call(this, dictionary, opts);
    }
    page.Page = Page;
    inherits_1$2.default(Page, facade_1$1.Facade);
    var p = Page.prototype;
    p.action = function () {
        return "page";
    };
    p.type = p.action;
    p.category = facade_1$1.Facade.field("category");
    p.name = facade_1$1.Facade.field("name");
    p.title = facade_1$1.Facade.proxy("properties.title");
    p.path = facade_1$1.Facade.proxy("properties.path");
    p.url = facade_1$1.Facade.proxy("properties.url");
    p.referrer = function () {
        return (this.proxy("context.referrer.url") ||
            this.proxy("context.page.referrer") ||
            this.proxy("properties.referrer"));
    };
    p.properties = function (aliases) {
        var props = this.field("properties") || {};
        var category = this.category();
        var name = this.name();
        aliases = aliases || {};
        if (category)
            props.category = category;
        if (name)
            props.name = name;
        for (var alias in aliases) {
            var value = this[alias] == null ? this.proxy("properties." + alias) : this[alias]();
            if (value == null)
                continue;
            props[aliases[alias]] = value;
            if (alias !== aliases[alias])
                delete props[alias];
        }
        return props;
    };
    p.email = function () {
        var email = this.proxy("context.traits.email") || this.proxy("properties.email");
        if (email)
            return email;
        var userId = this.userId();
        if (is_email_1.default(userId))
            return userId;
    };
    p.fullName = function () {
        var category = this.category();
        var name = this.name();
        return name && category ? category + " " + name : name;
    };
    p.event = function (name) {
        return name ? "Viewed " + name + " Page" : "Loaded a Page";
    };
    p.track = function (name) {
        var json = this.json();
        json.event = this.event(name);
        json.timestamp = this.timestamp();
        json.properties = this.properties();
        return new track_1$1.Track(json, this.opts);
    };

    var screen = {};

    var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(screen, "__esModule", { value: true });
    screen.Screen = void 0;
    var inherits_1$1 = __importDefault$1(inherits_browser.exports);
    var page_1 = page;
    var track_1 = track;
    function Screen(dictionary, opts) {
        page_1.Page.call(this, dictionary, opts);
    }
    screen.Screen = Screen;
    inherits_1$1.default(Screen, page_1.Page);
    Screen.prototype.action = function () {
        return "screen";
    };
    Screen.prototype.type = Screen.prototype.action;
    Screen.prototype.event = function (name) {
        return name ? "Viewed " + name + " Screen" : "Loaded a Screen";
    };
    Screen.prototype.track = function (name) {
        var json = this.json();
        json.event = this.event(name);
        json.timestamp = this.timestamp();
        json.properties = this.properties();
        return new track_1.Track(json, this.opts);
    };

    var _delete = {};

    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(_delete, "__esModule", { value: true });
    _delete.Delete = void 0;
    var inherits_1 = __importDefault(inherits_browser.exports);
    var facade_1 = facade;
    function Delete(dictionary, opts) {
        facade_1.Facade.call(this, dictionary, opts);
    }
    _delete.Delete = Delete;
    inherits_1.default(Delete, facade_1.Facade);
    Delete.prototype.type = function () {
        return "delete";
    };

    (function (exports) {
    var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Delete = exports.Screen = exports.Page = exports.Track = exports.Identify = exports.Facade = void 0;
    var facade_1 = facade;
    Object.defineProperty(exports, "Facade", { enumerable: true, get: function () { return facade_1.Facade; } });
    var identify_1 = identify;
    Object.defineProperty(exports, "Identify", { enumerable: true, get: function () { return identify_1.Identify; } });
    var track_1 = track;
    Object.defineProperty(exports, "Track", { enumerable: true, get: function () { return track_1.Track; } });
    var page_1 = page;
    Object.defineProperty(exports, "Page", { enumerable: true, get: function () { return page_1.Page; } });
    var screen_1 = screen;
    Object.defineProperty(exports, "Screen", { enumerable: true, get: function () { return screen_1.Screen; } });
    var delete_1 = _delete;
    Object.defineProperty(exports, "Delete", { enumerable: true, get: function () { return delete_1.Delete; } });
    exports.default = __assign(__assign({}, facade_1.Facade), { Identify: identify_1.Identify,
        Track: track_1.Track,
        Page: page_1.Page,
        Screen: screen_1.Screen,
        Delete: delete_1.Delete });

    }(dist));

    function toFacade(evt, options) {
        var fcd = new dist.Facade(evt, options);
        if (evt.type === 'track') {
            fcd = new dist.Track(evt, options);
        }
        if (evt.type === 'identify') {
            fcd = new dist.Identify(evt, options);
        }
        if (evt.type === 'page') {
            fcd = new dist.Page(evt, options);
        }
        // if (evt.type === 'alias') {
        //   fcd = new Alias(evt, options)
        // }
        // if (evt.type === 'group') {
        //   fcd = new Group(evt, options)
        // }
        // if (evt.type === 'screen') {
        //   fcd = new Screen(evt, options)
        // }
        Object.defineProperty(fcd, 'obj', {
            value: evt,
            writable: true,
        });
        return fcd;
    }

    // import { fetch } from '../../lib/fetch'
    function standard (config) {
        function dispatch(url, body) {
            return fetch(url, {
                keepalive: config === null || config === void 0 ? void 0 : config.keepalive,
                headers: { 'Content-Type': 'text/plain' },
                method: 'post',
                body: JSON.stringify(body),
            });
        }
        return {
            dispatch: dispatch,
        };
    }

    function normalize(
    // analytics: Analytics,
    json, settings) {
        // const user = analytics.user()
        delete json.options;
        json.writeKey = (settings === null || settings === void 0 ? void 0 : settings.apiKey) || (settings === null || settings === void 0 ? void 0 : settings.token);
        // json.userId = json.userId || user.id()
        // json.anonymousId = json.anonymousId || user.anonymousId()
        json.sentAt = new Date();
        // const failed = analytics.queue.failedInitializations || []
        // if (failed.length > 0) {
        //   json._metadata = { failedInitializations: failed }
        // }
        // const bundled: string[] = []
        // const unbundled: string[] = []
        // for (const key in integrations) {
        //   const integration = integrations[key]
        //   if (key === 'Segment.io') {
        //     bundled.push(key)
        //   }
        //   if (integration.bundlingStatus === 'bundled') {
        //     bundled.push(key)
        //   }
        //   if (integration.bundlingStatus === 'unbundled') {
        //     unbundled.push(key)
        //   }
        // }
        // // This will make sure that the disabled cloud mode destinations will be
        // // included in the unbundled list.
        // for (const settingsUnbundled of settings?.unbundledIntegrations || []) {
        //   if (!unbundled.includes(settingsUnbundled)) {
        //     unbundled.push(settingsUnbundled)
        //   }
        // }
        // const configIds = settings?.maybeBundledConfigIds ?? {}
        // const bundledConfigIds: string[] = []
        // bundled.sort().forEach((name) => {
        //   ;(configIds[name] ?? []).forEach((id) => {
        //     bundledConfigIds.push(id)
        //   })
        // })
        // if (settings?.addBundledMetadata !== false) {
        //   json._metadata = {
        //     ...json._metadata,
        //     bundled: bundled.sort(),
        //     unbundled: unbundled.sort(),
        //     bundledIds: bundledConfigIds,
        //   }
        // }
        return json;
    }

    var SEGMENT_API_HOST = 'api.segment.io/v1';

    // type JSON = ReturnType<Facade['json']>
    // function onAlias(analytics: Analytics, json: JSON): JSON {
    //   // const user = analytics.user()
    //   // json.previousId =
    //   //   json.previousId ?? json.from ?? user.id() ?? user.anonymousId()
    //   // json.userId = json.userId ?? json.to
    //   // delete json.from
    //   // delete json.to
    //   return json
    // }
    function segmentio(settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            function send(ctx) {
                return __awaiter(this, void 0, void 0, function () {
                    var path, json;
                    return __generator(this, function (_a) {
                        path = ctx.event.type.charAt(0);
                        json = toFacade(ctx.event).json();
                        if (ctx.event.type === 'track') {
                            delete json.traits;
                        }
                        //     if (ctx.event.type === 'alias') {
                        //       json = onAlias(analytics, json)
                        //     }
                        return [2 /*return*/, client
                                .dispatch("".concat(remote, "/").concat(path), 
                            // @ts-ignore
                            normalize(json, settings))
                                .then(function () { return ctx; })
                            // .catch(() => {
                            //   buffer.pushWithBackoff(ctx)
                            //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            //   scheduleFlush(flushing, buffer, segmentio, scheduleFlush)
                            //   return ctx
                            // })
                            // .finally(() => {
                            //   inflightEvents.delete(ctx)
                            // })
                        ];
                    });
                });
            }
            var apiHost, protocol, remote, client, segmentio;
            return __generator(this, function (_c) {
                apiHost = (_a = settings === null || settings === void 0 ? void 0 : settings.apiHost) !== null && _a !== void 0 ? _a : SEGMENT_API_HOST;
                protocol = (_b = settings === null || settings === void 0 ? void 0 : settings.protocol) !== null && _b !== void 0 ? _b : 'https';
                remote = "".concat(protocol, "://").concat(apiHost);
                client = standard();
                segmentio = {
                    name: 'Segment.io',
                    type: 'destination',
                    version: '0.1.0',
                    isLoaded: function () { return true; },
                    load: function () {
                        // console.log(ctx, analytics);
                        var uniOptions = { app: settings.app, rum: settings.rum };
                        var sdkOptions = {
                            apiHost: settings.endpoint,
                            apiKey: settings.token,
                        };
                        console.log(uniOptions, sdkOptions);
                        return Promise.resolve();
                    },
                    track: send,
                    // identify: send,
                    page: send,
                    // alias: send,
                    // group: send,
                    // screen: send,
                };
                // Buffer may already have items if they were previously stored in localStorage.
                // Start flushing them immediately.
                // if (buffer.todo) {
                //   scheduleFlush(flushing, buffer, segmentio, scheduleFlush)
                // }
                return [2 /*return*/, segmentio];
            });
        });
    }

    return segmentio;

})();
