import { link, emit, prop, withComponent } from 'skatejs'
import withPreact from '@skatejs/renderer-preact'
import { h } from 'preact'
import style from './date-input.sass'
import { bind, isUndefined } from 'lodash-es'
import boolCoerce from '../core/utils/boolCoerce';
import {
  format as formatFn,
  getDaysInMonth,
  getDate,
  getMonth,
  getYear,
  isDate,
  isValid,
  setDate,
  setMonth,
  setYear
} from 'date-fns'

const clamp = function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function formatState(date, format) {
  if (isDate(date) && isValid(date)) {
    return formatFn(date, format)
  }

  return null
}
export class DateInput extends withComponent(withPreact()) {
  static get is() { return 'date-input' }
  static get props() {
    return {
      format: prop({ attribute: true, default: 'MM/dd/yyyy' }),
      placeholder: prop({attribute: true, default: 'MM/DD/YYYY' }),
      value: prop({ attribute: true }),
      active: prop({attribute: true, coerce: boolCoerce, default: false}),
      tabindex: prop({attribute: true, default: 0})
    }
  }

  state = {
    month: null,
    day: null,
    year: null
  }

  formattedDate(value, format, placeholder) {
    const date = isDate(value) ? value : new Date(value)
    if (isValid(date)) {
      return formatFn(date, format)
    }
    return placeholder ? placeholder : format
  }

  toDate() {
    const date = new Date(this.value)
    return isValid(date) ? date : Date.now()
  }

  get style() {
    return style
  }

  onBlur() {
    if (this.renderRoot.activeElement) return // if active element exists, still editing
    this.active = false
  }

  onEdit(e) {
    this.active = true
    emit(this, 'active')
  }

  onKeyDown(e) {
    const name = e.target.getAttribute('name')
    const target = e.currentTarget
    const value = e.target.value
    const min = 1
    let max

    if (name === 'month') max = 12
    if (name === 'day') max = getDaysInMonth(new Date(value))

    switch(e.key) {
      case 'ArrowUp':
        this.setState(name, clamp(parseInt(value) + 1, min, max))
        break
      case 'ArrowDown':
        this.setState(name, clamp(parseInt(value) - 1, min, max))
        break
      case 'ArrowLeft':
        if(target.previousElementSibling) this.focus(target.previousElementSibling)
        break
      case 'ArrowRight':
       if(target.nextElementSibling) this.focus(target.nextElementSibling)
       break
      case 'Enter':
        this.blur()
        break
    }
  }

  syncValueWithState() {
    const state = this.state
    const setters = [setMonth, setDate, setYear]
    let def = this.toDate()
    // state.month - 1 can range from 0 to 11
    this.value = new Date(state.year || getYear(def), state.month - 1 >= 0 ? state.month - 1 : getMonth(def), state.day || getDate(def))
  }

  syncStateWithValue() {
    if (this.value) {
      this.state.month = getMonth(this.toDate()) + 1
      this.state.day = getDate(this.toDate())
      this.state.year = getYear(this.toDate())
    }
  }

  setState(eventOrName, value) {
    if (value) {
      this.state[eventOrName] = parseInt(value)
    } else {
      const target = eventOrName.target
      const name = target.getAttribute('name')
      this.state[name] = parseInt(target.value)
    }

    this.syncValueWithState()
  }

  focus(eventOrNode) {
    let target
    // If nodetype is defined use the node, otherwise, use the events target
    if(eventOrNode.nodeType) {
      target = eventOrNode
    } else if (eventOrNode){
      target = eventOrNode.target
    }

    target.focus()
    setTimeout((() => target.setSelectionRange(0, target.value.length)), 0)
  }

  connected() {
    const controller = this

    this.addEventListener('focus', bind(this.onEdit, this))
    this.addEventListener('blur', bind(this.onBlur, this))
    this.addEventListener('change', bind(this.syncStateWithValue, this))
    this.addEventListener('keydown', function(evt) {
      if (evt.path[0] === controller && evt.key !== 'Tab') {
        controller.shadowRoot.querySelector('input').focus()
      }
    })
    this.syncStateWithValue()
  }

  updated(prevProps, prevState) {
    super.updated(prevProps, prevState)

    if (this.previousElementSibling && this.previousElementSibling.value !== this.value) {
      this.previousElementSibling.value = this.value
    }

    if (this.active && !prevProps.active) this.focus(this.shadowRoot.querySelector('input'))

    if (prevProps.value !== this.value) emit(this, 'change')
  }
  render({ props, state }) {
    const { active, format, placeholder, value } = props
    const { year } = state
    const formattedDate = this.formattedDate(value, format, placeholder)

    return (
    <div class={'date-input-wrapper ' + (active ? 'editing' : '')}>
      <style>{this.style}</style>
      <div class="date-label">{formattedDate}</div>
      <div class="inputs">
        <input type='text' name='month' value={formatState(new Date(value), 'MM')} maxlength='2' placeholder='MM' onmouseover={bind(this.focus, this)} onchange={bind(this.setState, this)} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='day' value={formatState(new Date(value), 'dd')} maxlength='2' placeholder='DD' onmouseover={bind(this.focus, this)} onchange={bind(this.setState, this)} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='year' value={year} maxlength='4' placeholder='YYYY' onmouseover={bind(this.focus, this)} onchange={bind(this.setState, this)} onkeydown={bind(this.onKeyDown, this)}/>
      </div>
    </div>
    )

  }
}

