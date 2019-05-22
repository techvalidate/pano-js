import { Controller } from 'stimulus'

/**
 * TooltipController
 * - templateTarget - defines template content, defaults to title attribute
 * - hoverTarget    - defines hovering target for tooltip, defaults to controller element
 */
export default class extends Controller {
  static targets = ['hover', 'template']

  id = 'pano-tooltip'
  type = 'tooltip'

  get container() {
    return `
        <div id="${this.id}" class="tooltip">
        </div>`
  }

  get bodyTemplate() {
    return `
      <div class='tooltip-body' />
    `
  }

  get content() {
    return this._content
  }

  set content(content) {
    this._content = content
  }

  get tooltip() {
    return $(`#${this.id}`)
  }

  setContent() {
    if (this.element.hasAttribute('title')) {
      this.content = this.element.getAttribute('title')
      this.element.removeAttribute('title')
    }

    if (this.targets.has('template')) {
      this.content =  $(this.templateTarget).html()
    }
  }

  show() {
    this.setTemplate()
    this.setContent()

    const $element = $(this.hoverTarget)
    const x = $element.offset().left
    const y = $element.offset().top
    const centerX = x + ($element.width() / 2)
    const maxWidth = 250
    const style = {
      position: 'absolute',
      'max-width': `${maxWidth}px`,
      'z-index': 1002,
      'pointer-events': 'none'
    }

    if(this.data.get('type')) {
      this.tooltip.addClass(`${this.data.get('type')}`)
    }

    // Replace body content with title text or template content
    if (this.targets.has('template')) {
      this.tooltip
        .css(style)
        .find('.tooltip-body')
        .html(this.content)
    } else {
      this.tooltip
        .css(style)
        .find('.tooltip-body')
        .html(this.content)
    }

    this.tooltip.css({
      top: `${y - (this.tooltip.outerHeight()) - 15}px`, // targets y position minus combined tip and arrow height
      left: `${centerX - (this.tooltip.outerWidth() / 2)}px` // targets x position minus half the combined tip and arrow width
    })
      .addClass('visible')

    $element.css({ cursor: 'pointer' })
  }

  hide() {
    this.tooltip.removeClass('visible')
    if(this.data.get('type')) {
      this.tooltip.removeClass(`${this.data.get('type')}`)
    }
  }

  setTemplate() {
    this.tooltip.html(this.bodyTemplate)
  }

  createTip() {
    $('body').append(this.container)
    this.setTemplate()
  }

  bindInteractions() {
    this.element.addEventListener('mouseover', _.bind(this.show, this))
    this.element.addEventListener('mouseout', _.bind(this.hide, this))
  }

  connect() {
    const controller = this
    if (!this.tooltip.exists()) {
      this.createTip()
    }

    this.bindInteractions()

    // default hover target to the element
    if (!this.targets.has('hover')) {
      this.element.setAttribute('data-target', `${this.type}.hover`)
    }
  }
}
