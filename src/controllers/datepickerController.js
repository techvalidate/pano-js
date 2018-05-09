import { Controller } from 'stimulus'
import rome from 'rome'

export default class DatePickerController extends Controller {
  static targets = ['startCalendar', 'finishCalendar', 'start', 'finish', 'form']

  get startCalendar() {
    return this.startCalendarTarget
  }
  get finishCalendar() {
    return this.finishCalendarTarget
  }
  get startDate() {
    return rome.moment(new Date(this.startTarget.value))
  }
  set startDate(date) {
    this.startTarget.value = rome.moment(date).format('MMM D, YYYY')
  }
  get finishDate() {
    return rome.moment(new Date(this.finishTarget.value))
  }
  set finishDate(date) {
    this.finishTarget.value = rome.moment(date).format('MMM D, YYYY')
  }

  setSelectionRange() {
    const startDay = this.startDate.date()
    const finishDay = this.finishDate.date()
    const calendars = [this.startCalendar, this.finishCalendar]

    calendars.forEach((calendar, index) => {
      findRangeAndToggle(calendar, startDay, finishDay, index)
    })
  }

  apply() {

  }

  connect() {
    const controller = this
    this.startDate = this.startDate
    this.finishDate = this.finishDate

    rome(this.startCalendar, {
      dateValidator: rome.val.beforeEq(this.finishDate),
      time: false,
      initialValue: this.startDate
    }).on('data', (data) => {
      controller.startDate = data
      controller.setSelectionRange()
    })
    rome(this.finishCalendar, {
      dateValidator: rome.val.afterEq(this.startDate),
      time: false,
      initialValue: this.finishDate
    }).on('data', (data) => {
      controller.finishDate = data
      controller.setSelectionRange()
    })


    this.setSelectionRange()
  }
}

function findRangeAndToggle(calendar, startDay, finishDay, index) {
  calendar.querySelectorAll('.rd-day-body:not(.rd-day-prev-month):not(.rd-day-disabled)').forEach((column, i) => {
    const columnIndex = i + 1
    column.classList.remove('in-range')

    if (index === 0) {
      if (columnIndex > startDay) column.classList.add('in-range')
    } else {
      if (columnIndex < finishDay) column.classList.add('in-range')
    }
  })
}