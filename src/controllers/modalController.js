import { Controller } from 'stimulus'

export default class extends Controller {
  open(e) {
    e.preventDefault();
    const $target = $(e.target)
    const modalId = $target.attr('href')

    if (modalId.indexOf('#') === 0) {
      const modal = $(this.element).find(modalId)
      modal.fadeIn({duration: 200})
      modal.find('.modal-dialog').addClass('open')
    }
  }
}