UI.load(function() {
  // setup powertips options for the tooltips
  const tooltipOptions = {
    placement: 'n',
    smartPlacement: true,
    popupId: 'content-tooltip'
  };

  // instantiate powertips tooltips
  // currently we use our own fork of PowerTips: https://github.com/techvalidate/jquery-powertip
  $('.js-tooltip').powerTip(tooltipOptions);
});
