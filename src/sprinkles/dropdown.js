// ----------------------------------------
// Extra behavior for jq-dropdowns. main
// behavior is in jquery.dropdown.min.js
// ----------------------------------------

// auto-focus search field in dropdown when dropdown is shown
UI.load(function() {
  const dropdowns = $('.jq-dropdown');
  dropdowns.on('show', function(e, dropdownData) {

    const dropdown = $(e.currentTarget);
    const link = $(`[data-jq-dropdown='#${dropdown.attr('id')}']`);

    const searchField = dropdown.find('.menu-search-field');
    if (searchField.exists()) { searchField.focus(); }

    if (dropdown.hasClass('jq-dropdown-anchor-left')) {
      const dropdownWidth = dropdown.children().first().width();
      const linkWidth = link.outerWidth();
      const left = parseInt(dropdown.css('left'));
      const offset = (left - dropdownWidth) + linkWidth;

      dropdown.css('left', `${offset}px`);
    }
  });
});

// search within dropdown items
UI.on('keyup', '.jq-dropdown .menu-search-field', function(e, el) {
  const input = el;
  const options = input.parent().siblings('li');
  const selection = __guard__(input.val(), x => x.toLowerCase());
  if (selection) {
    options.each(function() {
      const text = $(this).find('.item-text').text().toLowerCase();
      if (text.indexOf(selection) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } else {
    options.show();
  }
});

// close the dropdown whenever you click a link
UI.click('.jq-dropdown li a', function(e, el) {
  el.closest('.jq-dropdown').hide();
  return true;
});

// FIXME - check need for input.val()?, if not needed remove this function, replace line 34 with input.val().toLowerCase()
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}