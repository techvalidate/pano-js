import ModalController from './modalController'

export default class extends ModalController {
  connect() {
    super.connect()
    const controller = this

    this.element.classList.add('open')

    $(window).on('resize', _.bind(this.setHeight, this))

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

    if ($footer.exists()) {
      $content.css({ 'max-height': `${($(window).height() - navHeight) - $footer.outerHeight() }px` })
    }
  }
}
