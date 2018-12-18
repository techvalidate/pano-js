import { emit, prop } from 'skatejs'
import Element, { h } from '@skatejs/element-preact'
import { props } from '@skatejs/element'
import linkState from 'linkState'
import style from './date-input.sass'
import { bind, isString } from 'lodash-es'
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

function boolCoerce(bool) {
  if (isString(bool)) {
    return bool === 'true';
  } else {
    return bool;
  }
};

function formatState(date, format) {
  if (isDate(date) && isValid(date)) {
    console.log(date, formatFn(date, format))
    return formatFn(date, format)
  }

  return null
}

export default class DateInput extends Element {
  static is = 'date-input'
  static props = {
      format: { ...props.string, ...{ attributes: true, default: 'MM/dd/yyyy' }},
      placeholder: { ...props.string, ...{ attributes: true, default: 'MM/DD/YYYY' }},
      value: { ...props.string, ...{ attributes: true }},
      active: { ...props.boolean, ...{ attributes: true}},
      tabindex: {...props.number, ...{ attributes: true, default: 0 }}
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
    return style.toString()
  }

  onBlur() {
    if (this.renderRoot.activeElement) return // if active element exists, still editing
    this.active = false
    const stateToDate = new Date(Object.values(this.state))
    if (isDate(stateToDate) && isValid(stateToDate)) this.syncValueWithState()
  }

  onEdit() {
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
    let def = this.toDate()
    // state.month - 1 can range from 0 to 11
    this.value = new Date(state.year || getYear(def), state.month - 1 >= 0 ? state.month - 1 : getMonth(def), state.day || getDate(def))
    emit(this, 'change')
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
      this.forceUpdate()
    } else {
      const target = eventOrName.target
      const name = target.getAttribute('name')
      this.state[name] = parseInt(target.value)
    }
  }

  focus(eventOrNode) {
    if (!eventOrNode) return
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

  connectedCallback() {
    super.connectedCallback()
    const controller = this

    this.addEventListener('focus', bind(this.onEdit, this))
    this.addEventListener('blur', bind(this.onBlur, this))
    this.addEventListener('keydown', function(evt) {
      if (evt.path[0] === controller && evt.key !== 'Tab') {
        controller.shadowRoot.querySelector('input').focus()
      }
    })
    this.syncStateWithValue()
  }

  updated(props) {
    // Set hidden input's value to the current value if different.
    if (this.previousElementSibling && this.previousElementSibling.value !== this.value) {
      this.previousElementSibling.value = this.value
    }

    // Focus on first input as long as the component was previously inactive
    if (this.active && props.active === false) this.focus(this.shadowRoot.querySelector('input'))
  }

  render() {
    const { active, format, placeholder, value } = this
    const formattedDate = this.formattedDate(value, format, placeholder)
    return (
    <div class={'date-input-wrapper ' + (active ? 'editing' : '')}>
      <style>{this.style}</style>
      <div class="date-label">{formattedDate}</div>
      <div class="inputs">
        <input type='text' name='month' value={this.state.month} maxlength='2' placeholder='MM' onmouseover={bind(this.focus, this)} onchange={bind(this.setState, this)} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='day' value={this.state.day} maxlength='2' placeholder='DD' onmouseover={bind(this.focus, this)} onchange={bind(this.setState, this)} onkeydown={bind(this.onKeyDown, this)}/>/
        <input type='text' name='year' value={this.state.year} maxlength='4' placeholder='YYYY' onmouseover={bind(this.focus, this)} onchange={linkState(this, 'year')} onkeydown={bind(this.onKeyDown, this)}/>
      </div>
    </div>
    )

  }
}
