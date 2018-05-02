import { Controller } from 'stimulus'
import Velocity from 'velocity-animate'


export default class extends Controller {
  toggle(e) {
    const target = e.currentTarget
    if (target.classList.contains('item-open')) {
      Velocity(target.querySelector('.item-content'), 'slideUp', {
        easing: 'easeInOutQuad',
        duration: 200,
        complete: function(){
          target.classList.remove('item-open')
        }
      })

    } else {
      target.classList.add('item-open')
      Velocity(target.querySelector('.item-content'), 'slideDown',
      {
        easing: 'easeInOutQuad',
        duration: 200
      })
    }
  }
}
