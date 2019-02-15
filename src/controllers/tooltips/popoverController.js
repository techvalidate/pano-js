import TooltipController from './tooltipController'

export default class extends TooltipController {
  id = 'pano-popover'
  type = 'popover'

  get container() {
    const klass = this.element.getAttribute('data-container-class') || ''
    return `
        <div id="${this.id}" class="popover ${klass}">
        </div>`
  }

  get bodyTemplate() {
    return `
      <div class='popover-body' />
    `
  }

  show() {
    this.setTemplate()
    this.setContent()

    const $element = $(this.hoverTarget)
    const x = $element.offset().left
    const y = $element.offset().top
    const maxWidth = this.data.get('width') || 250
    const style = {
      position: 'absolute',
      'max-width': `${maxWidth}px`,
      'z-index': 1002
    }
    // Replace body content with title text or template content
    if (this.targets.has('template')) {
      this.tooltip
        .html(this.content)
        .css(style)
    } else {
      this.tooltip
        .css(style)
        .find('.tooltip-body')
        .html(this.content)
    }

    this.tooltip.css({
      top: `${y - (this.tooltip.height() / 2) - 18}px`, // targets y position minus combined tip and arrow height
      left: `${x + 32}px` // targets x position and 32px right margin
    })
      .addClass('visible')

    $element.css({ cursor: 'pointer' })
  }

  hide() {
    if (this.keepOpen) return
    this.tooltip.removeClass('visible')
  }

  createTip() {
    super.createTip()

    const controller = this

    this.tooltip.on('mouseenter', function() {
      controller.keepOpen = true
    })

    this.tooltip.on('mouseleave', function() {
      controller.keepOpen = false
      controller.hide()
    })
  }

  bindInteractions() {
    const controller = this
    this.element.addEventListener('mouseover', _.bind(this.show, this))
    this.element.addEventListener('mouseleave', () => {
      _.delay(_.bind(controller.hide, controller), 100)
    })
  }
}
