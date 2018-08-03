import { Controller } from 'stimulus'
import Velocity from 'velocity-animate'

export default class extends Controller {
  close() {
    const $element = $(this.element)
    $('body').css({ overflow: 'auto' })
    $element.fadeOut(() => {
      if ($element.hasClass('js-ajax-modal')) $element.remove()
    })
  }

  open() {
    $('body').css({ overflow: 'hidden' })
    Velocity(this.element, 'fadeIn', {duration: 300})
  }

  connect() {
    $(this.element).find('form').on('ajax:success', _.bind(this.close, this))
    if (this.data.get('autoload') == 'true') {
      this.open()
    }
  }
}