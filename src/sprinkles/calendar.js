import rome from 'rome'

UI.click('[show-calendar-modal]', function(e, el) {
  e.preventDefault();
  e.stopPropagation();
  const href = el.attr('href');

  if (href.indexOf('#') === 0) {
    const data = $(el).data();

    Modals.show($(href), data);
    bindCalendars($('#rangestart'), $('#rangeend'), data);
  }
});


const bindCalendars = function(rangeStart, rangeEnd, data) {
  const startCalEl = '.rangestart-value .value';
  const startCalInput = '#hidden_start_on';
  const endCalEl = '.rangeend-value .value';
  const endCalInput = '#hidden_finish_on';
  const startDate = data['startOn'];
  const finishDate = data['finishOn'];

  const setDateValue = function(el, input, date) {
    const formattedDate= rome.moment(date).format('MMM D, YYYY');
    $(el).text(formattedDate);
    if (input) {
      return $(input).val(date);
    }
  };

  const startCal = rome(rangeStart[0], {
    dateValidator: rome.val.beforeEq(rangeEnd[0]),
    initialValue: startDate,
    time: false
  })
  .on('data', value => setDateValue(startCalEl, startCalInput, value));

  const endCal = rome(rangeEnd[0], {
    dateValidator: rome.val.afterEq(rangeStart[0]),
    time: false,
    initialValue: finishDate
  }).on('data', value => setDateValue(endCalEl, endCalInput, value));

  $('.custom_range_form')
  .on('ajax:complete', () => Modals.close(_.last(Modals.currentModals)))
  .on('ajax:error', function() {
    Modals.close(_.last(Modals.currentModals));
    alert("Sorry, an error occurred in processing your request. Please contact support if the error persists.");
  });

  startCal.refresh();
  endCal.refresh();
  setDateValue(startCalEl, null, startCal.getDate());
  setDateValue(endCalEl, null, endCal.getDate());
};
