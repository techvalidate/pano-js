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

export function load(callback) {
  if ((typeof Turbolinks !== 'undefined' && Turbolinks !== null) && Turbolinks.supported) {
    $(document).on('turbolinks:load', () => {
      callback()
    });
  }
  else {
    $(() => callback());
  }
}

// =====================================================
// Ajax Events
//
// The following ujs event handlers deal with a set of events
// specific to rails ujs remote forms
// see: https://github.com/rails/jquery-ujs/wiki

export function ujsSend(callback) {
  $(document).ajaxSend(( event, request, options ) => callback(event, request, options));
}

export function ujsSuccess(callback) {
  $(document).ajaxSuccess((event, xhr, options) => callback(event, xhr, options));
}

export function ujsComplete(callback) {
  $(document).ajaxComplete((event, xhr, options) => callback(event, xhr, options));
}

export function ujsStart(callback) {
  $(document).ajaxStart(() => callback());
}

export function ujsStop(callback) {
  $(document).ajaxStop(() => callback());
}

export function ujsError(callback) {
  $(document).ajaxError((event, jqxhr, options, thrownError) => callback(event, jqxhr, options, thrownError));
}

// =====================================================
// General-purpose wrapper for binding delegated events
// on the document object. by binding events to document,
// we avoid having to call this after DOM ready, as well
// as after ajax/turbolinks events complete, etc.
//
// Passes a reference to the event and the event target
// to your callback.

export function on(eventName, selector, callback) {
  $(document).on(eventName, selector, function(e) {
    const el = $(e.currentTarget);
    callback(e, el);
  });
}

// =====================================================
// Convenience methods for commonly-used input UI.
//
// All pass a reference to the event and the event target
// to your callback.

export function input(selector, callback) {
  on('input', selector, callback);
}

export function change(selector, callback) {
  on('change', selector, callback);
}

export function blur(selector, callback) {
  on('blur', selector, callback);
}

export function focus(selector, callback) {
  on('focus', selector, callback);
}

// Most click handlers want to prevent event bubbling,
// so this click event handler does that unless your
// callback  true.

export function click(selector, callback) {
  $(document).on('click touch', selector, function(e) {
    const el = $(e.currentTarget);
    if (callback(e, el) !== true) {
      e.preventDefault();
    }
  });
}

export function submit(selector, callback) {
  $(document).on('submit', selector, function(e) {
    const el = $(e.currentTarget);
    if (callback(e, el) !== true) {
      e.preventDefault();
    }
  });
}
