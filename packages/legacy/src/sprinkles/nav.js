import 'sticky-kit'
// ===================================================
// show/hide the mobile dropdown menu
// ===================================================

// TODO: BAD CODE -- MAKE MORE DRY, OR USE JQ-DROPDOWN

const mobileNavBgClickHandler = function(event) {
  // have to use vanilla js to use the .contains method
  const dropdown = document.getElementById('mobile-nav');
  const trigger = document.getElementById('mobile-nav-trigger');
  if (!dropdown.contains(event.target) && !trigger.contains(event.target)) {
    hideMobileNav();
  }
};

const showMobileNav = function() {
  $('#mobile-nav-trigger').addClass('open');
  $('#mobile-nav').addClass('visible');
  document.addEventListener('click', mobileNavBgClickHandler);
};

const hideMobileNav = function() {
  $('#mobile-nav-trigger').removeClass('open');
  $('#mobile-nav').removeClass('visible');
  document.removeEventListener('click', mobileNavBgClickHandler);
};

// open/close the menu when the menu trigger is clicked
UI.click('#mobile-nav-trigger', function(e, el) {
  if ($('#mobile-nav').hasClass('visible')) {
    hideMobileNav();
  } else {
    showMobileNav();
  }
});

// ===================================================
// show/hide the dropdown menu for the current user
// ===================================================

// TODO: BAD CODE -- MAKE MORE DRY, OR USE JQ-DROPDOWN

const userDropdownBgClickHandler = function(event) {
  // have to use vanilla js to use the .contains method
  const dropdown = document.getElementById('cur-user-dropdown');
  const trigger = document.getElementById('cur-user-dropdown-trigger');
  if (!dropdown.contains(event.target) && !trigger.contains(event.target)) {
    hideCurUserDropdown();
  }
};

const showCurUserDropdown = function() {
  $('#cur-user-dropdown-trigger').addClass('open');
  $('#cur-user-dropdown').addClass('visible');
  document.addEventListener('click', userDropdownBgClickHandler);
};

var hideCurUserDropdown = function() {
  $('#cur-user-dropdown-trigger').removeClass('open');
  $('#cur-user-dropdown').removeClass('visible');
  document.removeEventListener('click', userDropdownBgClickHandler);
};

// open/close the menu when the menu trigger is clicked
UI.click('#cur-user-dropdown-trigger', function(e, el) {
  if ($('#cur-user-dropdown').hasClass('visible')) {
    hideCurUserDropdown();
  } else {
    showCurUserDropdown();
  }
});

// ===================================================
// sticky version of subnavs
// ===================================================

UI.load(() => $("#subnav.sticky-subnav").stick_in_parent({bottoming: false, offset_top: $('#nav').height()}));
