import { load, click, ujsSuccess } from '../utils/ui'
import 'sticky-kit/dist/sticky-kit.js'

const updateFilters = function() {
  if ($('#filter-bar').exists()) {
    $("#filter-bar").stick_in_parent({parent: '#main', offset_top: 88});
    return $(document.body).trigger("sticky_kit:recalc");
  }
};

load(() => updateFilters());

click('#show-filters-btn', function(e, el) {
  $('#filters').toggleClass('show');
  return updateFilters();
});

ujsSuccess(() => updateFilters());
