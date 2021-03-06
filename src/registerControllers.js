import { identifierForContextKey } from '@stimulus/webpack-helpers'
/**
 * registerControllers - A helper function to register imported classes with your stimulus application.
 * @param {function} application - your stimulus application instance.
 * @param {hash} controllers - should be a hash with {ControllerName}Controller as the key and the class as the value.
 */
function registerControllers(application, controllers) {
  for (let key in controllers) {
    const controller = controllers[key]
    if (typeof controller === 'function') {

      // Take first part of controller name (i.e., Modal in ModalController) and format it to lowercase.
      const name = key.match(/(^([A-Z][a-z]+)(.+))(?:Controller)$/)[1].toLowerCase()
      application.register(name, controller)
    } else if (typeof controller === 'object') {
      registerControllers(application, controller)
    }
  }
}

export default registerControllers