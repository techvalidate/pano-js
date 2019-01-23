import { Controller } from 'stimulus'
import moment from 'moment'
import Lightpick from 'lightpick'

/*
 * keep validation in sync with survey.rb validation ensure_time_window 
 * @param startDate can be undefined
 * @param endDate can be undefined
 * NOTE: return true for acceptable intermediate state where startDate/endDate is not set. This is different from the submit button disabling.
*/
let isValidRangeSelection = function(startDate = undefined, endDate = undefined) {
  const today = moment(new Date())
  if (startDate && startDate.isValid() && endDate && endDate.isValid()) {
    // startDate (and endDate) must not be before today
    if (!startDate.isAfter(today, 'day')) {
      return false
    }
    // end date must be after or equal to the start date
    if (startDate.isAfter(endDate, 'day')) {
      return false
    }
    // start date and end date should be at least 3 days apart
    if (endDate.isBefore(startDate.clone().add(3, 'days'), 'day')){
      return false
    }
    return true
  }

  if (startDate && startDate.isValid()) {
    if (!startDate.isAfter(today, 'day')) {
      return false
    }
  }

  if (endDate && endDate.isValid()) {
    if (!endDate.isAfter(today, 'day')) {
      return false
    }
  }
  return true
}

let calendar

export default class DatePickerController extends Controller {
  static targets = ['start', 'finish', 'form', 'submit']

  connect() {
    // handle for mysteriously connecting before dom loads when custom element is present
    setTimeout(() => {
      this.setCalendars()
    }, 10)
  }

  disableSubmit() {
    this.submitTarget.classList.add('disabled')
  }

  enableSubmit() {
    this.submitTarget.classList.remove('disabled')
  }

  apply() {
    this.formTarget.submit()
  }

  setCalendars() {
    calendar = new Lightpick({
      field: this.startTarget,
      secondField: this.finishTarget,
      onFieldInputChange: this.onStartInputChange.bind(this),
      onSecondFieldInputChange: this.onEndInputChange.bind(this),
      parentEl: '.calendar-parent',
      format: moment.defaultFormat,
      singleDate: false,
      numberOfMonths: 2,
      numberOfColumns: 2,
      moveCalendarToNewDate: true,
      autoclose: false,
      hideCloseButton: true,
      hideOnBodyClick: false,
      isValidRangeSelection: isValidRangeSelection,
      startDate: moment(new Date(this.startTarget.value)),
      endDate: moment(new Date(this.finishTarget.value)),
    })
    calendar.show() // always have visible
  }

  onStartInputChange(newStartDate, startDate, endDate) {
    if (newStartDate.isValid() && newStartDate.isAfter(moment(new Date()), 'day')) {
        // valid start date
        this.startTarget.parentNode.classList.remove('form-group-error')
      if (endDate.isValid() && isValidRangeSelection(newStartDate, endDate)) {
        this.finishTarget.parentNode.classList.remove('form-group-error')
        setTimeout((() => this.enableSubmit()), 100)
      } else {
        // valid start date but invalid range; mark finish date as invalid
        this.finishTarget.parentNode.classList.add('form-group-error')
        this.disableSubmit()
      }
    } else {
      // invalid start date
      this.startTarget.parentNode.classList.add('form-group-error')
      this.disableSubmit()
    }
    calendar.setStartDate(newStartDate)
  }

  onEndInputChange (newEndDate, startDate, endDate) {
    if (newEndDate.isValid() && newEndDate.isAfter(moment(new Date()), 'day') && isValidRangeSelection(startDate, newEndDate)) {
      // valid end date
      this.finishTarget.parentNode.classList.remove('form-group-error')
      setTimeout((() => this.enableSubmit()), 100)
    } else {
      this.finishTarget.parentNode.classList.add('form-group-error')
      this.disableSubmit()
    }
    calendar.setEndDate(newEndDate)
  }
}
