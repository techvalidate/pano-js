import { Controller } from 'stimulus'

export default class extends Controller {
  close() {
    const $element = $(this.element)
    $('body').css({ overflow: 'auto' })
    $element.fadeOut(() => {
      if ($element.hasClass('js-ajax-modal')) $element.remove()
    })
  }

  connect() {
    $(this.element).find('form').on('ajax:success', _.bind(this.close, this))
  }
}