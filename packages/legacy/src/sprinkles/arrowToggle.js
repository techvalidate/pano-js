// click-to-toggle links with arrows

UI.click('.js-arrow-toggle', function(e, el) {
  const target = $(el.data('target'));
  if (target.exists()) {
    el.toggleClass('selected');
    target.slideToggle();
  }
});
