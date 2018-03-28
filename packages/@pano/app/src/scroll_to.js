import { click as onClick } from '@pano/global/ui'

onClick('.scroll-to-self', (e, el) => $('html, body').animate({ scrollTop: el.offset().top }, 300));

onClick('.scroll-to-target', function(e, el) {
  const target = $(el.data('scroll-target'));
  const offset = el.data('scroll-offset') || 0;
  $('html, body').animate({ scrollTop: target.offset().top - offset }, 300);
});


onClick('.scroll-to-top', (e, el) => $('html, body').animate({ scrollTop: 0 }, 300));
