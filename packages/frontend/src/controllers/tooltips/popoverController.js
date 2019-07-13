import TooltipController from './tooltipController'
import { delay, bind } from 'lodash-es'
import $ from 'jquery'

export default class extends TooltipController {
  id = 'pano-popover'
  type = 'popover'
  className = 'popover'
  keepOpen = 'keep-open'

  get container() {
    const klass = this.element.getAttribute('data-container-class') || ''
    return `
        <div id="${this.id}" class="${this.className} ${klass}">
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
    this.tooltip.removeClass('visible')
  }

  createTip() {
    super.createTip()
    this.bindTipInteractions()
  }

  bindTipInteractions() {
    const controller = this
    this.tooltip.on('mouseenter', function() {
      controller.tooltip.addClass(controller.keepOpen)
    })

    this.tooltip.on('mouseleave', function() {
      controller.tooltip.removeClass(controller.keepOpen)
      controller.hide()
    })
  }

  unbindTipInteractions() {
    this.tooltip.off('mouseenter')
    this.tooltip.off('mouseleave')
  }

  resetTip() {
    this.unbindTipInteractions()
    this.bindTipInteractions()
  }

  bindInteractions() {
    const controller = this
    this.element.addEventListener('mouseover', bind(this.show, this))
    this.element.addEventListener('mouseleave', () => {
      delay(bind(controller.hide, controller), 100)
    })
  }
}
