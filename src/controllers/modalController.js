import { Controller } from 'stimulus'

export default class extends Controller {
  open(e) {
    e.preventDefault();

    const $target = $(e.target)
    const modalId = $target.attr('href')

    if (modalId.indexOf('#') === 0) {
      const modal = $(this.element).find(modalId)
      this.show(modal)
    } else {
      this.getModal()
    }
  }

  show(modal) {
    let openTimeout
    modal.fadeIn({duration: 200})
    $('body').css('overflow', 'hidden');

    clearTimeout(openTimeout)
    openTimeout = setTimeout((() => modal.addClass('open')), 300)
  }

  getModal(url) {

    $.get(url, function(data, textStatus, jqXHR) {
      // this is the success callback. it gets called after normal responses AND redirects.
      if (jqXHR.getResponseHeader('REQUIRES_AUTH') === '1') {
        window.location = `https://${window.location.hostname}/login`; // send the person to the login page
      } else {

        const htmlResponse = $(data);
        htmlResponse.addClass('js-ajax-modal');
        const id = htmlResponse.attr('id');

        $('body').append(htmlResponse);

        if (id) {
          this.show($(`#${id}`));
        }

        $('body').css('overflow', 'hidden');
      }

    }).fail(function(jqXHR, textStatus, errorThrown) {

      if (jqXHR.status === 404) {
        alert('Sorry, the requested item could not be found.');
      }

      if (jqXHR.status === 500) {
        return alert('Sorry, an error occurred in processing your request. Please contact support if the error persists.');
      }
    });
  }
}