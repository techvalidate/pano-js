import { link, emit, prop, withComponent } from 'skatejs'
import withPreact from '@skatejs/renderer-preact'
import { h } from 'preact';
import moment from 'moment'


const bind = _.bind
const clamp = function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export default class extends withComponent(withPreact()) {
  static get is() { return 'date-input' }
  static get props() {
    return {
      format: prop({ attribute: true, default: 'MM/DD/YYYY' }),
      value: prop({ attribute: true }),
      date: prop({ attribute: false }),
      editing: prop({attribute: false, default: false}),
      day: prop({ attribute: false }),
      month: prop({ type: 'number', attribute: false }),
      year: prop({ attribute: false }),
      tabindex: prop({attribute: true, default: 0})
    }
  }

  constructor() {
    super()
    this.addEventListener('focus', bind(this.onEdit, this))
    this.addEventListener('blur', bind(this.onBlur, this))
    this.addEventListener('change', bind(this.updateValue, this))
  }

 formattedDate(value, format) {
    return moment(value).format(format)
  }

  get style() {
    return `
      :host {
        position: relative
        display: inline-block;
        box-size: border-box;
        text-align: left;
        padding: 0
      }
      .date-input-wrapper {
        padding: 0 8px;
      }
      .editing.date-input-wrapper {
        padding: 0 4px;
        color: #9da5aa
      }
      .editing .inputs {
      display: block
      }
      .editing .date-label {
      display: none
      }
      .date-input-wrapper {
        outline: none
      }
      .inputs {
        display: none;
      }
      input {
        border: 0;
        background: none;
        outline: none;
        font-size: 14px;
        line-height: 35px;
        color: #333e48;
        max-width: 28px;
        text-align: center
      }
      input:focus {
        border-bottom: 1px solid #00BF6F;
      }
      input::selection {
        background: rgba(0, 191, 111, 0.5);
      }
      input[name='year'] {
        max-width: 38px;
      }
    `
  }

  onBlur() {
    if (this.renderRoot.activeElement) return // if active element exists, still editing
    this.editing = false
    emit(this, 'change')
  }

  onEdit(e) {
    this.editing = true
  }

  onKeyDown(e) {
    const name = e.target.getAttribute('name')
    const value = e.target.value
    const min = 1
    let max

    if (name === 'month') max = 12
    if (name === 'day') max = moment(value).daysInMonth()

    switch(e.key) {
      case 'ArrowUp':
        this[name] = clamp(parseInt(value) + 1, min, max)
        break
      case 'ArrowDown':
        this[name] = clamp(parseInt(value) - 1, min, max)
        break
      case 'ArrowLeft':
        if(e.currentTarget.previousElementSibling) this.focus(e.currentTarget.previousElementSibling)
        break
      case 'ArrowRight':
       if(e.currentTarget.nextElementSibling) this.focus(e.currentTarget.nextElementSibling)
       break
    }
  }
  updateValue(e) {
    this.value = moment(this.value).set({month: this.month - 1, date: this.day, year: this.year}).toString()
    if (this.nextSibling.getAttribute('type') === 'hidden') {
      this.nextSibling.value = this.value
    }
  }

  focus(eventOrNode) {
    let target

    // If nodetype is defined use the node, otherwise, use the events target
    if(eventOrNode.nodeType) {
      target = eventOrNode
    } else {
      target = eventOrNode.target
    }

    target.focus()
    setTimeout((() => target.setSelectionRange(0, target.value.length)), 0)
  }

  connected() {
    this.month = moment(this.value).format('MM')
    this.day = moment(this.value).format('DD')
    this.year = moment(this.value).year()
  }

  render({ month, day, year, editing, value, format }) {
    const formattedDate= this.formattedDate(value, format)
    return (
    <div class={'date-input-wrapper ' + (editing ? 'editing' : '')}>
      <style>{this.style}</style>
      <div class="date-label">{formattedDate}</div>
      <div class="inputs">
        <input type='text' name='month' value={month} valuemaxlength='2' placeholder='MM' onmouseover={bind(this.focus, this)} onchange={link(this, 'month')} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='day' value={day} maxlength='2' placeholder='DD' onmouseover={bind(this.focus, this)} onchange={link(this, 'day')} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='year' value={year} maxlength='4' placeholder='YYYY' onmouseover={bind(this.focus, this)} onchange={link(this, 'year') } onkeydown={bind(this.onKeyDown, this)}/>
      </div>
    </div>
    )

  }
}

