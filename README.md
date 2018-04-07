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
To unlink run `yarn unlink pano-js` and then run `yarn` again to reinstall from github.

