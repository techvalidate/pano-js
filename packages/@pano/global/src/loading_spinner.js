import * as UI from './ui'

// =====================================================
// Show a loading spinner overlay on successful form
// submission and during AJAX events.
// =====================================================

//----------------------------------------
// Form submit callback

// Spinner won't be shown in Safari on submit, due to the way JavaScript is handled on POST
// TODO: find a better workaround than click handling and event.preventDefault() on submit.
UI.submit('form', function(e, el) {
  if ($(el).valid() && !$(el).data('remote')) {
    showLoadingSpinner();
    return true;
  }
}); // let the form submission go through

//----------------------------------------
// Ajax Events

UI.on('ajax:send', document, (e, el) => showLoadingSpinner());

//----------------------------------------
// Times we need to hide the spinner

$(document).ajaxStop(() => hideLoadingSpinner());

// this is for a firefox "feature"
$(window).on('unload', e => hideLoadingSpinner());

// prevents spinner from showing when back button is used, since Safari would otherwise cache the spinner state
$(window).bind('pageshow', function(evt) {
  if (evt.originalEvent.persisted) {
    return hideLoadingSpinner();
  }
});

UI.load(function() {
  // handle browsers that don't use transitions. Ahem, IE8/9
  createFallbackLoadingSpinner();

  // This gets around a Safari issue where the loading
  // spinner sometimes stays there after a page is
  // restored from the turbolinks cache.
  return hideLoadingSpinner();
});

//----------------------------------------
// Utility methods

// stuff to avoid race condition
let timeoutPending = false;
let spinnerHiddenDuringTimeout = false;

const showLoadingSpinner = function() {
  const transitionSupport = $.isCSSFeatureSupported('transition');

  // IE hack for frozen spinner during submit.
  if (!transitionSupport) {
    unfreezeIELoadingAnimation();
  }

  timeoutPending = true;
  return setTimeout((function() {
    if (!spinnerHiddenDuringTimeout) {
      $('#loading-overlay-container').removeClass('hidden').addClass('visible');
      setTimeout((() => $('#loading-overlay').addClass('visible')), 1);
      timeoutPending = false;
      return spinnerHiddenDuringTimeout = false;
    }
  }), 200); // the delay is so if things are really fast you won't see the spinner at all.
};

const hideLoadingSpinner = function() {
  $('#loading-overlay-container').addClass('hidden');
  $('#loading-overlay').removeClass('visible');

  if (timeoutPending) { return spinnerHiddenDuringTimeout = true; }
};

const unfreezeIELoadingAnimation =  function() {
  $('#loading-overlay-container .fallback-spinner').innerHTML = '';
  $('#loading-overlay-container .fallback-spinner').css('display', '');
  return $('#loading-overlay-container .fallback-spinner').css('background', $('#loading-overlay-container .fallback-spinner').css('background'));
};

const createFallbackLoadingSpinner = function() {
  const transitionSupport = $.isCSSFeatureSupported('transition');

  if (!transitionSupport) {
    $('.loading-spinner').remove();
    const fallbackSpinner = '<div class="fallback-spinner"></div>';
    return $('#loading-overlay').append(fallbackSpinner);
  }
};
