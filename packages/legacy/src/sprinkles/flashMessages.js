// click on flash messages to dismiss them
UI.click('.flash', (e, msg) => hideFlashMessage(msg));

// after a while, flash notice messages fade out automatically
UI.load(function() {
  const msg = $('.flash-notice');
  if (msg.length) {
    setTimeout((() => hideFlashMessage(msg)), 5000);
  }
});

const hideFlashMessage = function(msg) {
  msg.addClass('hiding');
  setTimeout((() => msg.remove()), 200);
};

// delete all flash messages from the DOM prior to turbolinks caching the page.
if ((typeof Turbolinks !== 'undefined' && Turbolinks !== null) && Turbolinks.supported) {
  document.addEventListener('turbolinks:before-cache', () => $('.flash').remove());
}
