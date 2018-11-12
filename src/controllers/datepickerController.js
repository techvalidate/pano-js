import { Controller } from 'stimulus'
import rome from 'rome'

const moment = rome.moment

// finish calendar display, stored as {'year': x, 'month': y} where y = 0 for January
let confirmedDisplayDate = undefined // last value confirmed to be the correct displayed date
let temporaryDisplayDate = undefined // value assigned by data events triggered by calendar navigation or date input. Value is cleared by a back/next event following a data event
// When a back/next event is fired, the order of events is: 1. data event, 2. setSelectionRange(), 3. back/next, 4. setSelectionRange()

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
    const controller = this
    if (date.isValid()) {
      this.startTarget.value = date.toString()
      this.startTarget.parentNode.classList.remove('form-group-error')

      setTimeout((() => controller.enableSubmit()), 100)
    }
  }

  get finishDate() {
    return moment(new Date(this.finishTarget.value))
  }

  set finishDate(date) {
    const controller = this
    if (date.isValid()) {
      this.finishTarget.value = date.toString()
      this.finishTarget.parentNode.classList.remove('form-group-error')

      setTimeout((() => controller.enableSubmit()), 100)
    }
  }


  setStartCal(e) {
    const date = moment(new Date(e.target.value), true)
    const cal = rome(this.startCalendar)
    if (date.isValid() && date.isBefore(this.finishDate)) {
      cal.setValue(date)
    } else {
      this.startTarget.parentNode.classList.add('form-group-error')
      this.disableSubmit()
    }
  }

  setFinishCal(e) {
    const date = moment(new Date(e.target.value), true)
    const cal = rome(this.finishCalendar)
    if (date.isValid() && date.isAfter(this.startDate)) {
      cal.setValue(date)
    } else {
      this.finishTarget.parentNode.classList.add('form-group-error')
      this.disableSubmit()
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
    confirmedDisplayDate = convertToYearMonthMap(moment(this.finishDate))

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
    }).on('data', (data) => { // start and finish dates have been adjusted to be valid
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
    }).on('data', (data) => { // start and finish dates have been adjusted to be valid
      const yearMonthData = convertToYearMonthMap(moment(data))
      if (temporaryDisplayDate == undefined) {
        // temporaryDisplayDate must have been cleared by a back/next event
        temporaryDisplayDate = yearMonthData
      } else {
        // we received two data events in a row, indicating the first was not triggered by a back/next. Therefore, it must have been triggered by a date input change, so it is confirmed that the calendar display reflected that date.
        confirmedDisplayDate = temporaryDisplayDate
        temporaryDisplayDate = yearMonthData
      }
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
    .on('back', (month) => {
      confirmedDisplayDate = decrementOneMonth(confirmedDisplayDate)
      temporaryDisplayDate = undefined
      controller.setSelectionRange(finishCalendar)
      rome(startCalendar).refresh()
    })
    .on('next', (month) => {
      confirmedDisplayDate = incrementOneMonth(confirmedDisplayDate)
      temporaryDisplayDate = undefined
      controller.setSelectionRange(finishCalendar)
      rome(startCalendar).refresh()
    })
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

  connect() {
    // handle for mysteriously connecting before dom loads when custom element is present
    setTimeout(() => {
      this.setCalendars()
    }, 10)

  }
}

// NOTE: startDate and finishDate already pass the dateValidator criteria, and may be different from the calendar month displayed.
function findRangeAndToggle(calendar, startDate, finishDate, startCalId, finishCalId) {
  const finishDisplayMonthYearMap = temporaryDisplayDate == undefined ? confirmedDisplayDate : temporaryDisplayDate

  // Disable Next and Prev Month buttons if out of range
  toggleForwardBackBtns(calendar, startDate, finishDate, startCalId, finishCalId)
  calendar.associated.querySelectorAll('.rd-day-body:not(.rd-day-prev-month)').forEach((column, i) => {
    const dayNumber = i + 1

    column.classList.remove('in-range')

    // finish date month === finish calendar month
    if (compareMonths(finishDate.year(), finishDate.month(), finishDisplayMonthYearMap.year, finishDisplayMonthYearMap.month) === 0) {
      
      // start date month === finish date month === finish calendar month
      // highlight inbetween dates within the month
      if (compareMonths(startDate.year(), startDate.month(), finishDate.year(), finishDate.month()) === 0) {
        if (dayNumber >= startDate.date() && dayNumber <= finishDate.date()) {
          column.classList.add('in-range')
        }
        return
      }

      // start date month < (finish date month === finish calendar month)
      // (because the finish date cannot be before the start date)
      if (calendar.id === startCalId && dayNumber > startDate.date()) {
        // Highlight days after the start date for start calendar
        column.classList.add('in-range')
      }
      if (calendar.id === finishCalId && dayNumber < finishDate.date()) {
        // Highlight days before the finish date for finish calendar
          column.classList.add('in-range')
      }
      return
    } else {
      // finish calendar month < finish date month
      // finish calendar month cannot be after the finish date month

      // (start date month === finish calendar month) < finish date month
      // current finish calendar contains the start date but not finish date; highlight everything after the start date
      if (compareMonths(startDate.year(), startDate.month(), finishDisplayMonthYearMap.year, finishDisplayMonthYearMap.month) === 0) {
        if (dayNumber >= startDate.date()) {
          column.classList.add('in-range')
        }
        return
      }

      // start date month < finish calendar month < finish date month
      if (compareMonths(startDate.year(), startDate.month(), finishDisplayMonthYearMap.year, finishDisplayMonthYearMap.month) === 1) {
        if (calendar.id === startCalId && dayNumber > startDate.date()) {
        // Highlight days after the start date for start calendar
        column.classList.add('in-range')
        }
        if (calendar.id === finishCalId) {
          // Highlight all dates in finish calendar
          column.classList.add('in-range')
        }
        return
      }

      // finish calendar month < (start date month === finish date month)
      if (compareMonths(startDate.year(), startDate.month(), finishDate.year(), finishDate.month) === 0) {
        if (calendar.id === startCalId && dayNumber >= startDate.date() && dayNumber <= finishDate.date()) {
          // Highlight days between start and finish dates in start calendar
          column.classList.add('in-range')
        }
        // highlight none of the dates in the finish calendar
        return
      }

      // finish calendar month < start date month < finish date month
      // assume finish calendar month cannot be after the finish date month
      if (calendar.id === startCalId && dayNumber > startDate.date()) {
        // Highlight days after the start date for start calendar
        column.classList.add('in-range')
        return
      }
      // highlight none of the dates in the finish calendar
    }
  })
}

function toggleForwardBackBtns(calendar, startDate, finishDate, startCalId, finishCalId) {
  const finishDisplayMonthYearMap = temporaryDisplayDate == undefined ? confirmedDisplayDate : temporaryDisplayDate

  if (calendar.id === startCalId) {
    const nextBtn = calendar.associated.querySelector('.rd-next')
    // User can't scroll past the selected finish date, but can scroll past the finish calendar display month
    const shouldDisableForwardButton = shouldDisableCalendarScrolling(startDate.year(), startDate.month(), finishDate.year(), finishDate.month())
    if (shouldDisableForwardButton) {
      nextBtn.classList.add('disabled')
    } else {
      nextBtn.classList.remove('disabled')
    }
  }

  if (calendar.id === finishCalId) {
    const backBtn = calendar.associated.querySelector('.rd-back')
    // User can't scroll before the selected start date
    const shouldDisableBackButton = shouldDisableCalendarScrolling(startDate.year(), startDate.month(), finishDisplayMonthYearMap.year, finishDisplayMonthYearMap.month)
    if (shouldDisableBackButton) {
      backBtn.classList.add('disabled')
    } else {
      backBtn.classList.remove('disabled')
    }
  }
}

/* return 0 if equal, 1 if date1 is after date2, and -1 if date1 is before date2 */
function compareMonths(date1Year, date1Month, date2Year, date2Month) {
  if (date1Year < date2Year) {
    return 1
  } else if (date1Year > date2Year) {
    return -1
  }
  // same years
  if (date1Month < date2Month) {
    return 1
  } else if (date1Month > date2Month) {
    return -1
  } else {
    // same year and month
    return 0
  }
}

// Disable Next and Prev Month buttons if dates are out of range
function shouldDisableCalendarScrolling(startYear, startMonth, finishYear, finishMonth) {
  const comparedMonths = compareMonths(startYear, startMonth, finishYear, finishMonth)
  if (comparedMonths === 0 || comparedMonths === -1) {
    // start and finish are equal or start is after finish
    return true
  }
  return false
}

function convertToYearMonthMap(momentDate) {
  return {'year': momentDate.year(), 'month': momentDate.month()}
}

function incrementOneMonth(yearMonthMap) {
  let year = yearMonthMap.year
  let month = yearMonthMap.month
  if (month === 11) {
    return {'year': year + 1, 'month': 0}
  }
  return {'year': year, 'month': month + 1}
}

function decrementOneMonth(yearMonthMap) {
  let year = yearMonthMap.year
  let month = yearMonthMap.month
  if (month === 0) {
    return {'year': year - 1, 'month': 11}
  }
  return {'year': year, 'month': month - 1}
}
