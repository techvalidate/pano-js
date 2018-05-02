import { Controller } from 'stimulus'
import Velocity from 'velocity-animate'


export default class extends Controller {
  toggle(e) {
    const target = e.currentTarget
    if (target.classList.contains('item-open')) {
      this.close(target)
    } else {
      this.open(target)
    }
  }

  open(item) {
    item.classList.add('item-open')
    Velocity(item.querySelector('.item-content'), 'slideDown',
    {
      easing: 'easeInOutQuad',
      duration: 200
    })
  }

  close(item) {
    item.classList.remove('item-open')
    Velocity(item.querySelector('.item-content'), 'slideUp', {
      easing: 'easeInOutQuad',
      duration: 200
    })
  }

  connect() {
    const items = this.element.querySelectorAll('li')
    items.forEach((item) => {
      if (item.classList.contains('item-open')) this.open(item)
    })
  }
}
