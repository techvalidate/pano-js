$.behavior = function(target, refineSelector) {
  if (refineSelector) {
    $(`[data-behavior~=${target}]:${refineSelector}`);
  } else {
    $(`[data-behavior~=${target}]`);
  }
};

$.registerBehavior = function(dataBehavior, event, callback) {
  callback();
  $.behavior(dataBehavior).on(event, () => callback());
};

$.fn.extend({
  disable: function() {
    this.each(function() {
      $(this).addClass('disabled').prop('disabled', true);
    });
  },

  enable: function() {
    this.each(function() {
      $(this).removeClass('disabled').prop('disabled', false);
    });
  },

  exists: function() {
    return this.length > 0
  },

  isBlank: function() {
    return this.val() === '';
  },

  uncheck: function() {
    this.each(function() {
      $(this).prop('checked', false).removeClass('checked');
    }); // the checked class is for ie8
  }
})

$.fn.exists = function() {
  return this.length > 0
}

