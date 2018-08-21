import 'whatwg-fetch' // fetch polyfill
import { Controller } from 'stimulus'
import Velocity from 'velocity-animate'
export default class extends Controller {
  open(e) {
    const $target = $(e.currentTarget)
    const modalUri = $target.attr('href') || $target.data('modal')

    e.preventDefault();

    if (modalUri.indexOf('#') === 0) {
      const modal = $(this.element).find(modalUri)
      this.show(modal)
    } else {
      this.getModal(modalUri)
    }
  }

  show(modal) {
    let openTimeout

    Velocity(modal, 'fadeIn', {duration: 200})
    $('body').css('overflow', 'hidden');

    clearTimeout(openTimeout)
    openTimeout = setTimeout((() => $(modal).addClass('open')), 300)
  }

  close() {
    let removeTimeout
    const modal = document.querySelector('.modal')

    document.querySelector('body').style.overflow = 'auto'

    Velocity(modal, 'fadeOut', {duration: 200})

    clearTimeout(removeTimeout)

    removeTimeout = setTimeout((() =>  {
      if (modal.classList.contains('js-ajax-modal')) modal.remove()
    }), 300)
  }

  getModal(url) {
    const controller = this
    fetch(url, {
      credentials: 'same-origin',
      redirect: 'follow'
    })
      .then((response) => {

        if(response.ok) return response.text()

        if (response.status === 404) throw new Error('Sorry, the requested item could not be found.')

        throw new Error('Sorry, an error occurred in processing your request. Please contact support if the error persists.')
      }).then((html) => {
        const $htmlResponse = $(html)
        const id = $htmlResponse.attr('id')

        $htmlResponse.addClass('js-ajax-modal')
        $('body').append($htmlResponse)

        controller.show($(`#${id}`))
        $('body').css('overflow', 'hidden');
      }).catch((err) => {
        alert(err.message)
      })
  }
}