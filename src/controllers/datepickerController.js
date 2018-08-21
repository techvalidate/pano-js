import { Controller } from 'stimulus'
import rome from 'rome'

const moment = rome.moment

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
      this.startTarget.value = date.toString()
      this.startTarget.parentNode.classList.remove('form-group-error')
      this.submitTarget.classList.remove('disabled')
    }
  }

  get finishDate() {
    return moment(new Date(this.finishTarget.value))
  }

  set finishDate(date) {
    if (date.isValid()) {
      this.finishTarget.value = date.toString()
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
    if (date.isValid() && date.isAfter(this.startDate)) {
      cal.setValue(date)
    } else {
      this.finishTarget.parentNode.classList.add('form-group-error')
      this.submitTarget.classList.add('disabled')
    }
  }

  setSelectionRange(calendar) {
    const cal = rome.find(calendar)
    const { startDate, finishDate } = this
    const startCalId = rome.find(this.startCalendar).id
    const finishCalId = rome.find(this.finishCalendar).id

    findRangeAndToggle(cal, startDate, finishDate, startCalId, finishCalId)
  }

  setCalendars() {
    this.startDate = this.startDate
    this.finishDate = this.finishDate

    const controller = this
    const { startCalendar, finishCalendar, startDate, finishDate } = controller

    rome(this.startCalendar, {
      dateValidator: function(controller) {
        return function(date) {
          const beforeCloseOn = rome.val.beforeEq(controller.finishDate)(date)
          const atLeast2DaysAfterLaunch = date <= moment(controller.finishDate).subtract(3, 'days')
          return beforeCloseOn && atLeast2DaysAfterLaunch
        }
      }(controller),
      time: false,
      initialValue: this.startDate
    }).on('data', (data) => {
      controller.startDate = moment(data)
      rome(finishCalendar).refresh()
      controller.setSelectionRange(startCalendar)
    })
    .on('afterRefresh', () => {
      // Rome's inline calendars refresh the other bound calendar after
      // new data, so we need to set the selection range again.
      controller.setSelectionRange(startCalendar)

    })
    .on('ready', () => {
      controller.setSelectionRange(startCalendar)
    })

    rome(this.finishCalendar, {
      dateValidator: function(controller) {
        return function(date) {
          const beforeOrOnToday = rome.val.afterEq(new Date())(date)
          const afterLaunchOn = rome.val.afterEq(controller.startDate)(date)
          const lessThan3DaysAfterLaunch = date >= moment(controller.startDate).add(3, 'days')
          return  beforeOrOnToday && afterLaunchOn && lessThan3DaysAfterLaunch
        }
      }(controller),
      time: false,
      initialValue: this.finishDate
    }).on('data', (data) => {
      controller.finishDate = moment(data)
      controller.setSelectionRange(finishCalendar)
      rome(startCalendar).refresh()
    })
    .on('afterRefresh', () => {
      controller.setSelectionRange(finishCalendar)
    })
    .on('ready', () => {
      controller.setSelectionRange(finishCalendar)
    })
  }

  apply() {
    this.formTarget.submit()
  }

  connect() {
    // handle for mysteriously connecting before dom loads when custom element is present
    setTimeout(() => {
      this.setCalendars()
    }, 10)

  }
}


function findRangeAndToggle(calendar, startDate, finishDate, startCalId, finishCalId) {
  // Disable Next and Prev Month buttons if out of range
  toggleForwardBackBtns(calendar, startDate, finishDate, startCalId, finishCalId)

  calendar.associated.querySelectorAll('.rd-day-body:not(.rd-day-prev-month)').forEach((column, i) => {
    const dayNumber = i + 1

    column.classList.remove('in-range')

    // If start and finish calendar are same month limit to the days in range
    if (startDate.month() === finishDate.month()) {
      if (dayNumber >= startDate.date() && dayNumber <= finishDate.date()) {
        column.classList.add('in-range')
      }
      return
    }

    // In case of month-spanning calendars: highlight days greater than start
    // date for start calendar, and opposite for finish calendar

    if (calendar.id === startCalId && dayNumber > startDate.date()) {
      column.classList.add('in-range')
    }

    if (calendar.id === finishCalId && dayNumber < finishDate.date()) {
      column.classList.add('in-range')
    }
  })
}

function toggleForwardBackBtns(calendar, startDate, finishDate, startCalId, finishCalId) {
  const backBtn = calendar.associated.querySelector('.rd-back')
  const nextBtn = calendar.associated.querySelector('.rd-next')

  if (calendar.id === startCalId) {
    if (startDate.month() >= finishDate.month()) {
      nextBtn.classList.add('disabled')
    } else {
      nextBtn.classList.remove('disabled')
    }
  }

  if (calendar.id === finishCalId) {
    if (finishDate.month() <= startDate.month()) {
      backBtn.classList.add('disabled')
    } else {
      backBtn.classList.remove('disabled')
    }
  }
}
