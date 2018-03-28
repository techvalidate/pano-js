import { click as onClick } from './ui'

// handle clicks on elements with data-behavior='clickable'.
// these elements need a data-href attribute.

// there is a hack to allow clicks on links inside 'clickable'
// elements to be handled normally.

onClick('[data-behavior~=clickable]', function(e, el) {
  // el is the 'clickable' element, clicked_element is the thing
  // that actually got clicked, which could be a child
  const clicked_element = $(e.target);
  if (clicked_element.is('a') || (clicked_element.parents('a').length !== 0)) {
    e.stopPropagation();
    return true;
  }
  const href = $(el).data('href');
  if (href) window.location.href = href;
});
