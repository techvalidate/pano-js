export default function registerControllers(application, controllers) {
  for (let key in controllers) {
    const controller = controllers[key]
    if (typeof controller === 'function') {
      const name = key.match(/^([A-Z])([a-z]+)/)[0].toLowerCase()

      application.register(name, controller)
    } else if (typeof controller === 'object') {
      registerControllers(controller)
    }
  }
}