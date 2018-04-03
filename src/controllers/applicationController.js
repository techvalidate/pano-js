import { Controller } from 'stimulus'

export default class extends Controller {
  openModal(e) {
    e.preventDefault();
    const $target = $(e.target)
    const modalId = $target.attr('href')

    if (modalId.indexOf('#') === 0) {
      $(this.element).find(modalId).fadeIn({duration: 200})
    }
  }
}