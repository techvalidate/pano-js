(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Pano"] = factory();
	else
		root["Pano"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return webpackJsonpPano([1],{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ui = __webpack_require__(2);

Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ui[key];
    }
  });
});

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.ujsSend = ujsSend;
exports.ujsSuccess = ujsSuccess;
exports.ujsComplete = ujsComplete;
exports.ujsStart = ujsStart;
exports.ujsStop = ujsStop;
exports.ujsError = ujsError;
exports.on = on;
exports.input = input;
exports.change = change;
exports.blur = blur;
exports.focus = focus;
exports.click = click;
exports.submit = submit;
// =====================================================
// UI
//
// This is a collection of functions that make it simpler to write
// callbacks related to DOM events such as:
//
//   * Page Load
//   * Ajax Events
//   * UI input (click, focus, blur, etc.)
//
// =====================================================


// =====================================================
// Page Load
//
// Use this method to wire up behavior on page load.
//
// If Turbolinks is supported, we wire your callback up
// to the turbolinks:load event. If Turbolinks isn't
// supported, we wire your callback up to $(document).ready().

function load(callback) {
  if (typeof Turbolinks !== 'undefined' && Turbolinks !== null && Turbolinks.supported) {
    $(document).on('turbolinks:load', function () {
      callback();
    });
  } else {
    $(function () {
      return callback();
    });
  }
}

// =====================================================
// Ajax Events
//
// The following ujs event handlers deal with a set of events
// specific to rails ujs remote forms
// see: https://github.com/rails/jquery-ujs/wiki

function ujsSend(callback) {
  $(document).ajaxSend(function (event, request, options) {
    return callback(event, request, options);
  });
}

function ujsSuccess(callback) {
  $(document).ajaxSuccess(function (event, xhr, options) {
    return callback(event, xhr, options);
  });
}

function ujsComplete(callback) {
  $(document).ajaxComplete(function (event, xhr, options) {
    return callback(event, xhr, options);
  });
}

function ujsStart(callback) {
  $(document).ajaxStart(function () {
    return callback();
  });
}

function ujsStop(callback) {
  $(document).ajaxStop(function () {
    return callback();
  });
}

function ujsError(callback) {
  $(document).ajaxError(function (event, jqxhr, options, thrownError) {
    return callback(event, jqxhr, options, thrownError);
  });
}

// =====================================================
// General-purpose wrapper for binding delegated events
// on the document object. by binding events to document,
// we avoid having to call this after DOM ready, as well
// as after ajax/turbolinks events complete, etc.
//
// Passes a reference to the event and the event target
// to your callback.

function on(eventName, selector, callback) {
  $(document).on(eventName, selector, function (e) {
    var el = $(e.currentTarget);
    callback(e, el);
  });
}

// =====================================================
// Convenience methods for commonly-used input UI.
//
// All pass a reference to the event and the event target
// to your callback.

function input(selector, callback) {
  on('input', selector, callback);
}

function change(selector, callback) {
  on('change', selector, callback);
}

function blur(selector, callback) {
  on('blur', selector, callback);
}

function focus(selector, callback) {
  on('focus', selector, callback);
}

// Most click handlers want to prevent event bubbling,
// so this click event handler does that unless your
// callback  true.

function click(selector, callback) {
  $(document).on('click touch', selector, function (e) {
    var el = $(e.currentTarget);
    if (callback(e, el) !== true) {
      e.preventDefault();
    }
  });
}

function submit(selector, callback) {
  $(document).on('submit', selector, function (e) {
    var el = $(e.currentTarget);
    if (callback(e, el) !== true) {
      e.preventDefault();
    }
  });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ui = __webpack_require__(1);

Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ui[key];
    }
  });
});

/***/ })

},[42]);
});