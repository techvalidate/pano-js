
//#################################################
// Date Picker
// "rome" is a customizeable datepicker plugin
// https://bevacqua.github.io/rome/
// Usage:
// `data-datepicker=true` can be added to any input to instaniate a date or time picker
// `data-datepicker=date-only` will show a date picker without the timepicker
// `data-datepicker=time-only` will only show the timepicker
//##################################################
UI.load(function() {
  let datepickers = $('[data-datepicker]');

  // iterate over the elements in the DOM that are candidates for the datepicker
  datepickers.each(function(i, datepicker) {
    const attr = $(datepicker).attr('data-datepicker');
    let initialVal = null;

    if ($(datepicker).val().length) {
      initialVal = moment(new Date($(datepicker).val())).format('MM/DD/YYYY h:mm A');
    }

    // * OUR * date picker default options
    const options = {
      inputFormat: 'MM/DD/YYYY h:mm A',
      weekdayFormat: 'min',
      dayFormat: 'D',
      timeFormat: 'h:mm A',
      // momentJS is used here to parse a date format from the server data that is compatible with Rome DatePicker
      initialValue: initialVal,
      required: $(datepicker).hasClass('required')
    };

    // depending on the value of the data-datepicker attribute, set the date picker options. Default to datetime if data-datepicker value isn't specified
    switch (attr) {
      case 'date-only':
        options.time = false;
        options.inputFormat = 'MM/DD/YYYY';

        if ($(datepicker).val().length) {
          initialVal = moment($(datepicker).val()).format('MM/DD/YYYY');
        }

        options.initialValue = initialVal;
        break;
      case 'time-only':
        options.date = false;

        if ($(datepicker).val().length) {
          initialVal = moment($(datepicker).val()).format('h:mm A');
        }

        options.initialValue = initialVal;
        // rename classes for the date picker when using timeonly format so we can properly style the timepicker
        options.styles = {
          "container": "rd-timeonly-container",
          "time": "rd-timeonly-time",
          "timeList": "rd-timeonly-time-list",
        };
        break;
    }

    // add in date validators if needed
    if  ($(datepicker).attr('data-rule-dateRangeValidate')) {
      options.dateValidator = function(date) {
        const endDateField = $($(this.associated).attr('data-rule-dateRangeValidate'))[0];
        let isValid = true;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (moment(date).isBefore(yesterday)) {
          isValid = false;
        } else if ($(endDateField).val().length) {
          if (moment(date).isAfter($(endDateField).val())) {
            isValid = false;
          }
        }

        return isValid;
      };
    } else if ($(datepicker).attr('data-rome-validate-start')) {
      const compareField = $($(datepicker).attr('data-rome-validate-start'))[0];
      options.dateValidator = rome.val.afterEq(compareField);
      options.min = new Date();
    }


    // instantiate the date picker
    const romePicker = rome(datepicker, options);
    romePicker.refresh();

    return romePicker.on('data', function(evt) {
      return $.customRomeValidators(this);
    });
  });

  // =================================== #
  // HANDLERS
  // =================================== #

  // when a form is submitted that has a datepicker, we need to convert the dates back to a format Ruby can use.
  return $('form').submit(function(evt) {
    datepickers = $('[data-datepicker]');

    return _.each(datepickers, function(datepicker) {
      if ($(datepicker).val().length) {
        return $(datepicker).val(moment($(datepicker).val()));
      }
    });
  });
});
