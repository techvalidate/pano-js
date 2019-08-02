const Switchery  = require('switchery')

const settings = {
  color: '#23D385',
};

UI.load(function() {
  // elem = document.querySelector('.js-switch')
  // new Switchery(elem, settings)
  const switches = $('.js-switch');
  switches.each(function() {
    new Switchery(this, settings);
  });
});
