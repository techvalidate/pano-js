import ModalController from './modalController'
import { bind } from 'lodash-es'
import $ from 'jquery'

export default class extends ModalController {
  connect() {
    super.connect()
    const controller = this

    this.element.classList.add('open')

    $(window).on('resize', bind(this.setHeight, this))

    setTimeout(() => {
      controller.setHeight()
    }, 300)
  }

  close() {
    this.element.classList.remove('open')
    super.close()
  }

  setHeight() {
    const $footer = $(this.element).find('.modal-footer')
    const $content = $(this.element).find('.modal-content')
    const navHeight = 48

    if ($footer.length) {
      $content.css({ 'max-height': `${($(window).height() - navHeight) - $footer.outerHeight() }px` })
    }
  }
}
