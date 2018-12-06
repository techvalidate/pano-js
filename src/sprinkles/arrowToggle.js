import { click } from '../utils/ui'
// click-to-toggle links with arrows

click('.js-arrow-toggle', function(e, el) {
  const target = $(el.data('target'));
  if (target.exists()) {
    el.toggleClass('selected');
    target.slideToggle();
  }
});
