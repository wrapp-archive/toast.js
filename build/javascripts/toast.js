(function() {
  var $, isEmpty, shallowCopy, tc;

  isEmpty = function(object) {
    var k;
    if (object == null) {
      return true;
    }
    for (k in object) {
      return false;
    }
    return true;
  };

  shallowCopy = function(object) {
    var key, o, value;
    o = {};
    for (key in object) {
      value = object[key];
      o[key] = value;
    }
    return o;
  };

  window.TransitionCallbacks = (function() {
    var _this = this;

    TransitionCallbacks.VERSION = '1.0.1';

    TransitionCallbacks.timeout = 3000;

    TransitionCallbacks.clearAll = false;

    TransitionCallbacks.transition = (function() {
      var key, map, style, value;
      style = (document.body || document.documentElement).style;
      map = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        MsTransition: 'MSTransitionEnd',
        OTransition: 'oTransitionEnd',
        transition: 'TransitionEnd'
      };
      for (key in map) {
        value = map[key];
        if (key in style) {
          return {
            end: value
          };
        }
      }
      return false;
    })();

    TransitionCallbacks._transitionCallbacks = {};

    TransitionCallbacks.addCallback = function(element, options, callback) {
      var c, timeout, _base,
        _this = this;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options || (options = {});
      }
      if (typeof (element != null ? element.get : void 0) === 'function') {
        element = element.get(0);
      }
      if (!element) {
        throw new TransitionCallbacks.NoElementGiven;
      }
      if (!callback) {
        throw new TransitionCallbacks.NoCallbackGiven;
      }
      timeout = this._getTimeout(options);
      this._clearOldCallbacks(element, callback, options);
      (_base = this._transitionCallbacks)[element] || (_base[element] = {});
      c = this._transitionCallbacks[element][callback] = {};
      c.callback = function() {
        if (!(_this._transitionCallbacks[element][callback] != null) || c.cancelled) {
          return;
        }
        c.cancel();
        return callback.call(element);
      };
      c.cancel = function() {
        c.cancelled = true;
        delete _this._transitionCallbacks[element][callback];
        if (_this.transition) {
          if (typeof element.removeEventListener === "function") {
            element.removeEventListener(_this.transition.end, c, false);
          }
        }
        return clearTimeout(c.timeout);
      };
      if (this.transition && typeof element.addEventListener === 'function') {
        element.addEventListener(this.transition.end, c.callback, false);
        if (timeout !== false) {
          c.timeout = setTimeout(c.callback, timeout);
        }
      } else {
        c.callback();
      }
    };

    TransitionCallbacks._getTimeout = function(options) {
      if (options.timeout != null) {
        return options.timeout;
      } else if (this.timeout != null) {
        return this.timeout;
      } else {
        return TransitionCallbacks.timeout;
      }
    };

    TransitionCallbacks._clearOldCallbacks = function(element, callback, options) {
      var clearAll;
      clearAll = options.clearAll != null ? options.clearAll : this.clearAll != null ? this.clearAll : TransitionCallbacks.clearAll;
      if (clearAll) {
        return this.cancelCallback(element);
      } else {
        return this.cancelCallback(element, callback);
      }
    };

    TransitionCallbacks.cancelCallback = function(element, callback) {
      var callbacks, key, value;
      if (typeof (element != null ? element.get : void 0) === 'function') {
        element = element.get(0);
      }
      if (!this._transitionCallbacks[element]) {
        return false;
      }
      if (callback != null) {
        if (this._transitionCallbacks[element][callback]) {
          this._transitionCallbacks[element][callback].cancel();
        } else {
          return false;
        }
      } else {
        callbacks = shallowCopy(this._transitionCallbacks[element]);
        for (key in callbacks) {
          value = callbacks[key];
          value.cancel();
        }
      }
      return true;
    };

    TransitionCallbacks.cancelAllCallbacks = function() {
      var element, _results;
      _results = [];
      for (element in this._transitionCallbacks) {
        _results.push(this.cancelCallback(element));
      }
      return _results;
    };

    TransitionCallbacks.isCallbackPending = function(element, callback) {
      var c;
      if (!(c = this._transitionCallbacks[element])) {
        return false;
      }
      if (callback != null) {
        return callback in c;
      } else {
        return !isEmpty(c);
      }
    };

    function TransitionCallbacks(options) {
      if (options == null) {
        options = {};
      }
      if (options.timeout != null) {
        this.timeout = options.timeout;
      }
      if (options.clearAll != null) {
        this.clearAll = options.clearAll;
      }
      this._transitionCallbacks = {};
    }

    TransitionCallbacks.prototype.transition = TransitionCallbacks.transition;

    TransitionCallbacks.prototype.addCallback = TransitionCallbacks.addCallback;

    TransitionCallbacks.prototype._getTimeout = TransitionCallbacks._getTimeout;

    TransitionCallbacks.prototype._clearOldCallbacks = TransitionCallbacks._clearOldCallbacks;

    TransitionCallbacks.prototype.cancelCallback = TransitionCallbacks.cancelCallback;

    TransitionCallbacks.prototype.cancelAllCallbacks = TransitionCallbacks.cancelAllCallbacks;

    TransitionCallbacks.prototype.hasCallbackPending = TransitionCallbacks.hasCallbackPending;

    return TransitionCallbacks;

  }).call(this);

  TransitionCallbacks.NoCallbackGiven = (function() {

    NoCallbackGiven.prototype = Error.prototype;

    function NoCallbackGiven() {
      this.name = 'NoCallbackGiven';
    }

    return NoCallbackGiven;

  })();

  TransitionCallbacks.NoElementGiven = (function() {

    NoElementGiven.prototype = Error.prototype;

    function NoElementGiven() {
      this.name = 'NoElementGiven';
    }

    return NoElementGiven;

  })();

  if (($ = window.jQuery)) {
    $.support.transition = TransitionCallbacks.transition;
    tc = new TransitionCallbacks();
    $.fn.addTransitionCallback = function(options, callback) {
      if (this.length > 0) {
        tc.addCallback(this.get(0), options, callback);
      }
      return this;
    };
    $.fn.cancelTransitionCallback = function(callback) {
      var element, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        element = this[_i];
        tc.cancelCallback(element, callback);
      }
      return this;
    };
    $.fn.hasTransitionCallbackPending = function(callback) {
      var pending;
      pending = false;
      this.each(function(index, element) {
        pending && (pending = tc.hasCallbackPending(callback));
        return !pending;
      });
      return pending;
    };
    $.cancelAllTransitionCallbacks = function() {
      return tc.cancelAllCallbacks();
    };
  }

}).call(this);
(function() {
  var DEFAULT_DURATION, DURATION_MAP, OPTIONS,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  DEFAULT_DURATION = 'medium';

  DURATION_MAP = {
    'short': 2000,
    'medium': 4000,
    'long': 6000
  };

  OPTIONS = ['duration', 'content', 'id', 'className', 'animate', 'allowHTML'];

  window.Toast = (function() {

    Toast.VERSION = '1.0.3';

    function Toast(options) {
      if (options == null) {
        options = {};
      }
      this._remove = __bind(this._remove, this);

      this.hide = __bind(this.hide, this);

      this._setupHideTimer = __bind(this._setupHideTimer, this);

      this._addClass = __bind(this._addClass, this);

      this._showElement = __bind(this._showElement, this);

      this.isShowing = __bind(this.isShowing, this);

      this._addElementClasses = __bind(this._addElementClasses, this);

      this._shouldAnimate = __bind(this._shouldAnimate, this);

      this._option = __bind(this._option, this);

      this._addContent = __bind(this._addContent, this);

      this._clearTimeout = __bind(this._clearTimeout, this);

      this._removeClass = __bind(this._removeClass, this);

      this._hasClass = __bind(this._hasClass, this);

      this.show = __bind(this.show, this);

      this._addElementId = __bind(this._addElementId, this);

      this._createElement = __bind(this._createElement, this);

      this._setupDefaultOptions = __bind(this._setupDefaultOptions, this);

      this.tc = new TransitionCallbacks({
        clearAll: true,
        timeout: 500
      });
      this._setupDefaultOptions(options)._createElement()._addElementId();
    }

    Toast.prototype._setupDefaultOptions = function(options) {
      var opt, _i, _len;
      for (_i = 0, _len = OPTIONS.length; _i < _len; _i++) {
        opt = OPTIONS[_i];
        this[opt] = options[opt];
      }
      this.duration = options.duration || DEFAULT_DURATION;
      this.animate = this.animate !== false;
      return this;
    };

    Toast.prototype._createElement = function() {
      this.element = document.createElement('div');
      return this;
    };

    Toast.prototype._addElementId = function() {
      if (this.id) {
        this.element.id = this.id;
      }
      return this;
    };

    Toast.prototype.show = function(options) {
      if (options == null) {
        options = {};
      }
      if (this._hasClass('bounce')) {
        return;
      }
      this._temporaryOptions = options;
      this._removeClass('hide')._clearTimeout()._addContent()._addElementClasses()._showElement()._setupHideTimer();
      return this;
    };

    Toast.prototype._hasClass = function(className) {
      return Toast._classRegexp(className).test(this.element.className);
    };

    Toast._classRegexp = function(className) {
      var _base;
      Toast._classRegexpLookup || (Toast._classRegexpLookup = {});
      return (_base = Toast._classRegexpLookup)[className] || (_base[className] = new RegExp("(^| )" + className + "($| )"));
    };

    Toast.prototype._removeClass = function() {
      var className, classNames, regexp, _i, _len;
      classNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = classNames.length; _i < _len; _i++) {
        className = classNames[_i];
        regexp = Toast._classRegexp(className);
        this.element.className = this.element.className.replace(regexp, '');
      }
      return this;
    };

    Toast.prototype._clearTimeout = function() {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = void 0;
      return this;
    };

    Toast.prototype._addContent = function(content) {
      var key;
      if (content == null) {
        content = this._option('content');
      }
      if (typeof content === 'function') {
        return this._addContent(content);
      }
      key = this._option('allowHTML') === true ? 'innerHTML' : this.element.innerText != null ? 'innerText' : 'textContent';
      this.element[key] = content;
      return this;
    };

    Toast.prototype._option = function(name) {
      if (name in this._temporaryOptions) {
        return this._temporaryOptions[name];
      } else {
        return this[name];
      }
    };

    Toast.prototype._shouldAnimate = function() {
      return this._option('animate') !== false;
    };

    Toast.prototype._addElementClasses = function() {
      if (!this.isShowing()) {
        this.element.className = 'toast';
        if (this._shouldAnimate()) {
          this._addClass('animate');
        }
        if (this._option('className')) {
          this._addClass(this.className);
        }
      }
      return this;
    };

    Toast.prototype.isShowing = function() {
      return (this._hasClass('shown') || this._hasClass('show')) && !this._hasClass('hide');
    };

    Toast.prototype._showElement = function() {
      var height, width;
      document.body.appendChild(this.element);
      width = this.element.offsetWidth;
      height = this.element.offsetHeight;
      this.element.style.marginLeft = parseInt(-width / 2, 10) + 'px';
      this.element.style.marginTop = parseInt(-height / 2, 10) + 'px';
      this.element.style.left = '50%';
      this.element.style.top = '50%';
      this._addClass('bounce');
      if (!this.isShowing()) {
        this._addClass('show');
      }
      return this;
    };

    Toast.prototype._addClass = function() {
      var className, classNames, _i, _len;
      classNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = classNames.length; _i < _len; _i++) {
        className = classNames[_i];
        if (!this._hasClass(className)) {
          if (this.element.className) {
            this.element.className += ' ';
          }
          this.element.className += className;
        }
      }
      return this;
    };

    Toast.prototype._setupHideTimer = function() {
      var duration,
        _this = this;
      duration = this._option('duration');
      if (duration in DURATION_MAP) {
        duration = DURATION_MAP[duration];
      }
      this.tc.addCallback(this.element, function() {
        if (duration !== 'infinite') {
          _this.hideTimeout = setTimeout(function() {
            return _this.hide();
          }, duration);
        }
        return _this._removeClass('show', 'bounce')._addClass('shown');
      });
      return this;
    };

    Toast.prototype.hide = function(options) {
      if (options == null) {
        options = {};
      }
      this._temporaryOptions = options;
      this._clearTimeout();
      if (this._shouldAnimate()) {
        this._addClass('hide');
        this.tc.addCallback(this.element, this._remove);
      } else {
        this._remove();
      }
      return this;
    };

    Toast.prototype._remove = function() {
      var _ref;
      if ((_ref = this.element.parentNode) != null) {
        _ref.removeChild(this.element);
      }
      this._removeClass('hide', 'shown');
      return this;
    };

    return Toast;

  }).call(this);

}).call(this);
