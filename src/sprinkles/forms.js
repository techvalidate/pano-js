import { fire } from 'delegated-events'
require('jquery-ujs')
// =====================================================
// links that submit containing form on click
// =====================================================

UI.click('form .js-submit-on-click', (e, el) => {
  e.preventDefault()
  e.stopPropagation()
  $('#add-key-drivers-form').trigger('submit')
})

UI.click('form .js-submit-on-click-with-propagation', (e, el) => {
  const form = el.closest('form')
  e.preventDefault()
  e.stopPropagation()
  // Fire native submit on form element for RailsUjs to capture
  fire(form[0], 'submit')
})

// =====================================================
// fields that auto-focus on page load
// =====================================================
UI.load(() => $('input.js-focus-on-load').focus())

// =====================================================
// validate all forms with jquery validation plugin.
// =====================================================
UI.load(() => $.bindFormValidation($('body')))

$.bindFormValidation = html =>
  //add form validation
  html.find('form').each(() => {
    const f = $(this)

    if (!f.hasClass('js-novalidate')) {
      return f.validate({
        errorClass: 'error',
        highlight: (el, errorClass, validClass) => {
          $(el).removeClass(validClass).addClass(errorClass)
          $(el).parent().addClass(errorClass)
          $(el).parent().siblings('.form-helper-text').hide()
        },
        unhighlight: (el, errorClass, validClass) => {
          $(el).removeClass(errorClass).addClass(validClass)
          $(el).parent().removeClass(errorClass)
          $(el).parent().siblings('.form-helper-text').show()
        }
      })
    }
  })

// =====================================================
// for custom password validation message display
// =====================================================
$.passwordComplexityValidationMessage = (element) => {
  const value = $(element).val()

  if ((value.length >= 8) && $('.min-chars')) {
    $('.min-chars').addClass('valid')
  } else {
    $('.min-chars').removeClass('valid')
  }

  if (/\d/.test(value) && $('.min-nums')) {
    $('.min-nums').addClass('valid')
  } else {
    $('.min-nums').removeClass('valid')
  }

  if (value.match(/[a-z]/i) && $('.min-letters')) {
    $('.min-letters').addClass('valid')
  } else {
    $('.min-letters').removeClass('valid')
  }
}

// =====================================================
// custom validator rules
// =====================================================

// ======== passwordComplexityMatch ======== #
// custom rule: string contains at least one integer, one alpha character and is at least 8 characters in length
// {data: {rule_passwordComplexityMatch: 'passwordComplexityMatch'}}
$.validator.addMethod('passwordComplexityMatch', value => /[a-z].*[0-9]|[0-9].*[a-z]/i.test(value) && (value.length >= 8)
, '8 characters minimum, 1 number and 1 letter')

// ======== dateRangeValidate ======== #
// custom rule: Validate that the date is before the field specified by the rule attribute
// {data: {rule_dateRangeValidate: 'my_end_date_field'}}
$.validator.addMethod('dateRangeValidate', (value, el) => {
  let isValid = true

  // validate date ranges
  const dtField = $(el).attr('data-rule-dateRangeValidate')
  const compareDate = moment(new Date($(dtField).val()))

  // for date only pickers, we need to set the time to the current
  // time if the selected date is today, for validation purposes.
  // add 20 minutes so the user doesn't get stuck if they allow the page to sit
  const newValue = moment(new Date(value))
  const currentDate = moment(new Date())

  if (($(el).attr('data-datepicker') === 'date-only') && (newValue.diff(currentDate, 'days') === 0)) {
    newValue.set({
      'hour' : currentDate.get('hour'),
      'minute'  : currentDate.get('minute') + 20,
      'second' : currentDate.get('second')
    })
    compareDate.set({
      'hour' : currentDate.get('hour'),
      'minute'  : currentDate.get('minute') + 20,
      'second' : currentDate.get('second')
    })
  }

  if (compareDate) {
    isValid = newValue.isSameOrBefore(compareDate)
  }

  return isValid
}
, 'Start must come before End')

// ======== dateIsInFuture ======== #
// custom rule: Validate that the date is in the future
// {data: {rule_dateIsInFuture: 'dateIsInFuture'}}
$.validator.addMethod('dateIsInFuture', (value, el) => {
  // for date only pickers, we need to set the time to the current
  // time if the selected date is today, for validation purposes.
  // add 20 minutes so the user doesn't get stuck if the allow the page to sit
  const newValue = moment(new Date(value))
  const currentDate = moment(new Date())

  if (($(el).attr('data-datepicker') === 'date-only') && (newValue.diff(currentDate, 'days') === 0)) {
    newValue.set({
      'hour' : currentDate.get('hour'),
      'minute'  : currentDate.get('minute') + 20,
      'second' : currentDate.get('second')
    })
  }
  return newValue.isSameOrAfter(currentDate)
}
, 'Current or future date required')

// ======== customRomeValidators ======== #
// These are executed independently of jquery Validate
// used to validate Rome fields, if needed
// TODO: maybe find a better way to abstract these rules
$.customRomeValidators = (field) => {
  // force jquery validate to check the field to clear any invalid status
  $(field.associated).valid()

  // validate a related field, if needed
  const relatedField = $(field.associated).attr('data-validate-related')
  if (relatedField) {
    return $(relatedField).valid()
  }
}
