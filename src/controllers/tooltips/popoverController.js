import TooltipController from './tooltipController'

export default class extends TooltipController {
  id = 'pano-popover'
  type = 'popover'

  get container() {
    return `
        <div id="${this.id}" class="popover">
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
    const maxWidth = 250
    const style = {
      position: 'absolute',
      'max-width': `${maxWidth}px`,
      'z-index': 1002,
      'pointer-events': 'none'
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
}