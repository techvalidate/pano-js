// =====================================================
// Click handlers that show and hide modals.
//
// usage: add ,js-modal
//        on click .js-modal, href = dom ID of modal to show.
// =====================================================

UI.click('.modal-bg', function(e, el) {
  const $target = $(e.target);
  const modal = $target.closest('.modal');
  return Modals.close(modal);
});

UI.click('.js-modal', function(e, el) {
  e.preventDefault();
  const href = el.attr('href');

  if (href.indexOf('#') === 0) {
    const data = $(el).data();

    Modals.show($(href), data);
  } else {
    Modals.showAjax(href, null, [$.bindFormValidation]);
  }
});


UI.click('.js-close-modal', function(e, el) {
  const $target = $(e.target);
  const modal = $target.closest('.modal');
  return Modals.close(modal);
});


// =====================================================
//  Modal Methods
// =====================================================

window.Modals = {

  show(modal, data, callbacks) {

    if (modal) {
      $('body').css('overflow', 'hidden');
      // // need to center during the fadeIn animation
      modal.fadeIn({duration: 200});
      Modals.currentModals.push(modal);

      if (callbacks) {
        return Array.from(callbacks).map((callback) =>
          (() => callback(modal))());
      }
    }
  },


  close(modal) {
    if (modal) {
      modal.fadeOut(200);
      Modals.currentModals.pop(modal);

      if (modal.hasClass('js-ajax-modal')) {
        modal.remove();
      }

      return $('body').css('overflow', 'auto');
    }
  },

  currentModals: [],

  showAjax(url, data, callbacks) {

    return $.get(url, function(data, textStatus, jqXHR) {
// this is the success callback. it gets called after normal responses AND redirects.
      if (jqXHR.getResponseHeader('REQUIRES_AUTH') === '1') {
        return window.location = `https://${window.location.hostname}/login`; // send the person to the login page
      } else {
        const htmlResponse = $(data);
        htmlResponse.addClass('js-ajax-modal');
        const id = htmlResponse.attr('id');
        $('body').append(htmlResponse);

        if (id) {
          Modals.show($(`#${id}`));
        }

        if (callbacks && callbacks.length) {
          callbacks.forEach(function(callback) { if (_.isFunction(callback)) { return callback(htmlResponse); } });
        }

        return $('body').css('overflow', 'hidden');
      }

    }).fail(function(jqXHR, textStatus, errorThrown) {

      if (jqXHR.status === 404) {
        alert('Sorry, the requested item could not be found.');
      }

      if (jqXHR.status === 500) {
        return alert('Sorry, an error occurred in processing your request. Please contact support if the error persists.');
      }
    });
  },


  ajaxloadingMessage() {
    return `\
<div class='modal loading'>
  <h2>Loading...</h2>
</div>\
`;
  }
};

//#Override the default confirm dialog by rails
//$.rails.allowAction = (link) ->
//  if link.data("confirm") == undefined
//    return true
//
//  $.rails.showConfirmationDialog(link)
//  return false
//
//#User click confirm button
//$.rails.confirmed = (link) ->
//  link.data("confirm", null)
//  link.trigger("click.rails")
//
//#Display the confirmation dialog
//$.rails.showConfirmationDialog = (link) ->
//  message = link.data("confirm")
//  url = link.attr('href')
//  method = link.data('method')
//
//  vex.dialog.confirm({
//    message: message
//    callback: (value) ->
//      if value && url && method
//        $.ajax({
//          url: url
//          method: method
//          success: (response) ->
//            eval(response)
//        })
//  })
