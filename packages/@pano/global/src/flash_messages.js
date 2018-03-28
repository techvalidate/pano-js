import { click as onClick, load as onLoad } from './ui'
// click on flash messages to dismiss them
onClick('.flash', (e, msg) => hideFlashMessage(msg));

// after a while, flash notice messages fade out automatically
onLoad(function() {
  const msg = $('.flash-notice');
  if (msg.exists()) {
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
