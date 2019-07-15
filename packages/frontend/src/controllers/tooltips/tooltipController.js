import { Controller } from 'stimulus'
import { bind } from 'lodash-es'
import $ from 'jquery'

/**
 * TooltipController
 * - templateTarget - defines template content, defaults to title attribute
 * - hoverTarget    - defines hovering target for tooltip, defaults to controller element
 */
export default class extends Controller {
  static targets = ['hover', 'template']

  id = 'pano-tooltip'
  type = 'tooltip'
  className = 'tooltip'
  keepOpen = 'keep-open' // visible

  get container() {
    return `
        <div id="${this.id}" class="${this.className}">
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

  get title() {
    return this._title
  }

  set title(title) {
    this._title = title
  }

  setContent() {
    if (this.element.hasAttribute('title')) {
      const title = this.element.getAttribute('title')
      this.content = title
      // Add back the title attribute in disconnect(), so the title is present when navigating browser hsitory.
      this.title = title
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

  // override
  resetTip() {
  }

  bindInteractions() {
    this.element.addEventListener('mouseover', bind(this.show, this))
    this.element.addEventListener('mouseout', bind(this.hide, this))
  }

  connect() {
    // Hide any pre-existing tooltips setup by this controller. They may be leftover from browser history changes.
    this.tooltip.removeClass('visible')
    this.tooltip.removeClass(this.keepOpen)

    if (this.tooltip.length) {
      this.resetTip()
    } else {
      this.createTip()
    }

    this.bindInteractions()

    // default hover target to the element
    if (!this.targets.has('hover')) {
      this.element.setAttribute('data-target', `${this.type}.hover`)
    }
  }

  disconnect() {
    // reset the element title navigating back/forward in the browser history will show the inital title
    const title = this.title
    if (this.title) {
      this.element.setAttribute('title', title)
    }
  }
}
