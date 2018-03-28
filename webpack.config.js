const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
module.exports = {
  entry: {
   pano: './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./'),
    library: 'Pano',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      UI: 'UI'
    }),

  ],
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
            loader: 'expose-loader',
            options: '$'
        },
        {
          loader: 'expose-loader',
          options: 'jQuery'
      }, {
          loader: 'expose-loader',
          options: 'jquery'
      }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'sticky-kit': 'sticky-kit/dist/sticky-kit',
      UI: path.resolve('./src/utils/ui')
    }
  }
}