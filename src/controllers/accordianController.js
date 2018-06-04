import { Controller } from 'stimulus'
import Velocity from 'velocity-animate'


export default class extends Controller {
  toggle(e) {
    const target = e.currentTarget
    const item = target.parentNode
    if (item.classList.contains('item-open')) {
      this.close(item)
    } else {
      this.open(item)
    }
  }

  open(item) {
    item.classList.add('item-open')
    Velocity(item.querySelector('.item-content'), 'slideDown',
    {
      easing: 'easeInOutQuad',
      duration: 300
    })
  }

  close(item) {
    item.classList.remove('item-open')
    Velocity(item.querySelector('.item-content'), 'slideUp', {
      easing: 'easeInOutQuad',
      duration: 300
    })
  }

  connect() {
    const items = this.element.querySelectorAll('li')
    items.forEach((item) => {
      if (item.classList.contains('item-open')) this.open(item)
    })
  }
}
