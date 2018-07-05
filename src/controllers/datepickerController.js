import { Controller } from 'stimulus'
import rome from 'rome'

const moment = rome.moment

// TODO - Fork Rome to fix option issues.
export default class DatePickerController extends Controller {
  static targets = ['startCalendar', 'finishCalendar', 'start', 'finish', 'form', 'submit']

  get startCalendar() {
    return this.startCalendarTarget
  }

  get finishCalendar() {
    return this.finishCalendarTarget
  }

  get startDate() {
    return moment(new Date(this.startTarget.value))
  }

  set startDate(date) {
    if (date.isValid()) {
      this.startTarget.value = date.format('MMM D, YYYY')
      this.startTarget.parentNode.classList.remove('form-group-error')
      this.submitTarget.classList.remove('disabled')
    }
  }

  get finishDate() {
    return moment(new Date(this.finishTarget.value))
  }

  set finishDate(date) {
    if (date.isValid()) {
      this.finishTarget.value = date.format('MMM D, YYYY')
      this.finishTarget.parentNode.classList.remove('form-group-error')
      this.submitTarget.classList.remove('disabled')
    }
  }

  setStartCal(e) {
    const date = moment(new Date(e.target.value), true)
    const cal = rome(this.startCalendar)
    if (date.isValid() && date.isBefore(this.finishDate)) {
      cal.setValue(date)
    } else {
      this.startTarget.parentNode.classList.add('form-group-error')
      this.submitTarget.classList.add('disabled')
    }
  }

  setFinishCal(e) {
    const date = moment(new Date(e.target.value), true)
    const cal = rome(this.finishCalendar)
    if (date.isValid() && date.isBefore(this.finishDate)) {
      cal.setValue(date)
    } else {
      this.finishTarget.parentNode.classList.add('form-group-error')
      this.submitTarget.classList.add('disabled')
    }
  }

  setSelectionRange() {
    const calendars = [this.startCalendar, this.finishCalendar]

    calendars.forEach((calendar, index) => {
      findRangeAndToggle(calendar, this.startDate, this.finishDate, index)
    })
  }

  setCalendars() {
    const controller = this
    this.startDate = this.startDate
    this.finishDate = this.finishDate

    rome(this.startCalendar, {
      dateValidator: rome.val.beforeEq(this.finishCalendar),
      time: false,
      initialValue: this.startDate
    }).on('data', (data) => {
      controller.startDate = moment(data)
      controller.setSelectionRange()
    })

    rome(this.finishCalendar, {
      dateValidator: rome.val.afterEq(this.startCalendar),
      time: false,
      initialValue: this.finishDate
    }).on('data', (data) => {
      controller.finishDate = moment(data)
      this.setCalendars()
      controller.setSelectionRange()
    })
  }

  apply() {
    this.formTarget.submit()
  }

  connect() {
    this.setCalendars()
    this.setSelectionRange()
  }
}

function findRangeAndToggle(calendar, startDate, finishDate, index) {
  calendar.querySelectorAll('.rd-day-body:not(.rd-day-prev-month):not(.rd-day-disabled)').forEach((column, i) => {
    const columnIndex = i + 1
    column.classList.remove('in-range')
    const cal = rome.find(calendar)

    if (index === 0) {
      if (columnIndex > startDate.date()) column.classList.add('in-range')
    } else {
      if (columnIndex < finishDate.date()) column.classList.add('in-range')
    }
  })
}