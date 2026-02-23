var AnalyticsPluginSendbeacon = (function () {
  'use strict';

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
  function _objectSpread2(e) {
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
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  var version = "0.1.0";

  function _url(endpoint, query) {
    var esc = encodeURIComponent;
    var keys = Object.keys(query);
    var url = endpoint;
    if (keys.length > 0) {
      url += '?' + keys.map(function (k) {
        // eslint-disable-line prefer-template
        var value = query[k];
        if (value === null || value === '') {
          return '';
        } else {
          return esc(k) + '=' + esc(value); // eslint-disable-line prefer-template
        }
      }).join('&');
    }
    return url;
  }

  function sendBeacon(endpoint) {
    var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var form = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!navigator.sendBeacon) return false;
    if (!Blob) return false;
    if (!URLSearchParams) return false;
    var url = _url(endpoint, query);
    var payload = new URLSearchParams(form).toString();

    // https://github.com/w3c/beacon/issues/10
    // https://stackoverflow.com/a/56646623/707580
    // 即使不考虑关于跨域的复杂配置，仅从性能出发也应该使用简单请求，从而少发送一次 OPTIONS
    var data = new Blob([payload], {
      type: 'application/x-www-form-urlencoded'
    }); // eslint-disable-line array-bracket-spacing

    return navigator.sendBeacon(url, data);
  }

  function Plugin(analytics, settings, integrations) {
    this.analytics = analytics;
    this.settings = settings;
    this.integrations = integrations;
    return this;
  }
  Plugin.prototype.load = function () {
    console.log(this.settings, this.settings.app, this.settings.rum);
    return Promise.resolve();
  };
  Plugin.prototype.isLoaded = function () {
    return true;
  };
  Plugin.prototype.send = function (ctx) {
    var _ctx$event = ctx.event,
      messageId = _ctx$event.messageId,
      type = _ctx$event.type;
      _ctx$event.timestamp;
      _ctx$event.context;
      var properties = _ctx$event.properties; // eslint-disable-line
    // console.log(timestamp);
    // console.log(context);
    // console.log(properties);
    sendBeacon(this.settings.endpoint, {
      type: type
    }, _objectSpread2({
      messageId: messageId
    }, properties));
  };
  function factory(settings) {
    var plugin = new Plugin(null, settings, null);
    return {
      name: 'SendBeacon',
      version: version,
      type: 'destination',
      load: plugin.load.bind(plugin),
      isLoaded: plugin.isLoaded.bind(plugin),
      page: plugin.send.bind(plugin),
      track: plugin.send.bind(plugin),
      identify: plugin.send.bind(plugin)
    };
  }

  return factory;

})();
