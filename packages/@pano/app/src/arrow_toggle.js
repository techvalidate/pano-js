import { click as onClick } from '@pano/global/ui'
// click-to-toggle links with arrows

onClick('.js-arrow-toggle', function(e, el) {
  const target = $(el.data('target'));
  if (target.exists()) {
    el.toggleClass('selected');
    target.slideToggle();
  }
});
