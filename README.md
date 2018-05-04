# Pano JS

## Installation
In your package.json:

`"pano-js": "git+ssh://git@github.com:techvalidate/pano-js"`

## Build
- `yarn build`
- `yarn watch`

## Usage
In your webpack application.js pack:
```javascript
require('pano-js')

// ...or

import 'pano-js'
```

#### Modules
```javascript
  import Pano from 'pano-js'

  const FlyoutModal = Pano.Controllers.Modals.Flyout
  const UI = Pano.UI

  //...or
  import { Controllers, UI} from 'pano-js'

  const FlyoutModal = Controllers.Modals.Flyout

  UI.click('.btn' ...)

```

## Dependencies
- jQuery v3.2.1


## Loading Pano-JS Stimulus controllers in your application ##
Stimulus typically uses require contexts to load the controllers in your application. Pano-JS comes a collection of common controllers for modals, popovers, etc. You'll want to load them differently. The stimulus `application` will allow you to register controllers manually.

Pano-JS exports a helper function called [`registerControllers`](https://github.com/techvalidate/pano-js/blob/master/src/registerControllers.js) that takes your application instance and the imported `Controllers` hash, and will register them auto-magically.

```javascript
import { Application } from 'stimulus'
import { definitionsFromContext } from 'stimulus/webpack-helpers'
import { Controllers, registerControllers } from 'pano-js'

const application = Application.start()
const context = require.context('../guide/controllers', true, /\.js$/)

// Load all Pano-JS controllers
registerControllers(application, Controllers)
// Load all application controllers
application.load(definitionsFromContext(context))


```

## Development
You can use `yarn link` to easily make updates to Pano-JS and see real time updates in your application.

1) Run `yarn link` in the `pano-js` repo to set up the link
2) Run `yarn link pano-js` in your application, this sets up the symlink in your node_modules folder.
3) Run yarn webpack -w to have webpack watch changes in `pano-js`
4) Run webpack-dev-server in your application
**Tip**: When using webpacker, make sure to set watchOptions in your environment.js to allow webpack to detect changes in your `pano-js`folder
   ```javascript
    const config = environment.toWebpackConfig()
    config.watchOptions = { ignored: [/node_modules([\\]+|\/)+(?!\pano-js)/]}
   ```
**Another Tip**: When you're in the pano test_app, to watch for changes run bin/webpack -w, rather than bin/webpack-dev-server. This will not reload your browser, but you can use another gem like Guard.

To unlink run `yarn unlink pano-js` and then run `yarn` again to reinstall from github.

