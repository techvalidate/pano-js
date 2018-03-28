
// =====================================================
// Show a loading spinner overlay inline when the spinner event is received
// =====================================================

//----------------------------------------
// Show/Hide events for spinner
$(document).on('inline-spinner:show', (evt, el) => showInlineSpinner(el));

$(document).on('inline-spinner:hide', (evt, el) => hideInlineSpinner(el));

//----------------------------------------
// Show the inline spinner
const showInlineSpinner = function(el) {
  const transitionSupport = $.isCSSFeatureSupported('transition');
  // IE hack for frozen spinner during submit.
  if (!transitionSupport) {
    UI.load(function() {});
    createFallbackInlineSpinner(el);
    unfreezeIEInlineAnimation(el);
  }

  $(el + ' #inline-progress').addClass('visible');
};

//----------------------------------------
// Hide the inline spinner
const hideInlineSpinner = el => $(el + ' #inline-progress').removeClass('visible');

//----------------------------------------
// IE spinner fix for frozen spinners
const unfreezeIEInlineAnimation = function(el) {
  $(el + ' .fallback-spinner').innerHTML = '';
  $(el + ' .fallback-spinner').css('display', '');
  $(el + ' .fallback-spinner').css('background', $(el + ' .fallback-spinner').css('background'));
};

//----------------------------------------
// Creates a fallback spinner for unsupported browsers
const createFallbackInlineSpinner = function(el) {
  const transitionSupport = $.isCSSFeatureSupported('transition');

  if (!transitionSupport) {
    $(el + ' inline-progress').remove();
    const fallbackSpinner = '<div class="fallback-spinner"></div>';
    $(el + ' inline-progress').append(fallbackSpinner);
  }
};
