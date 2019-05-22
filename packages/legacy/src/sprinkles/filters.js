import 'sticky-kit'

const updateFilters = function() {
  if ($('#filter-bar').length) {
    $("#filter-bar").stick_in_parent({parent: '#main', offset_top: 88});
    return $(document.body).trigger("sticky_kit:recalc");
  }
};

UI.load(() => updateFilters());

UI.click('#show-filters-btn', function(e, el) {
  $('#filters').toggleClass('show');
  return updateFilters();
});

UI.ujsSuccess(() => updateFilters());
