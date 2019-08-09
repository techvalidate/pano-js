const webpack = require('webpack')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  let plugins = [
    new MomentLocalesPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      UI: 'UI'
    })
  ]


  console.warn( 'Current mode is set to ' + argv.mode)
  /**
   * WEBPACK CONFIG
   */
  return {
    context: path.resolve(__dirname),
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? '' : 'eval-source-map',

    entry: {
      pano: './index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve('./'),
      library: 'Pano',
      libraryTarget: 'umd'
    },

    plugins,

    optimization: {
      minimizer: isProd ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            cache: true,
            parallel: true,
            beautify: false,
            compress: {
              conditionals: true,
              unused: true,
              comparisons: true,
              sequences: true,
              dead_code: true,
              evaluate: true,
              join_vars: true,
              if_return: true
            },
            output: {
              comments: false
            },
          },
          sourceMap: true
        })
      ] : []
    },

    module: {
      rules: [
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: '$'
            },
            {
              loader: 'expose-loader',
              options: 'jQuery'
            }, {
              loader: 'expose-loader',
              options: 'jquery'

          }
          ]
        },
        {
          test: require.resolve('moment'),
          use: [{
            loader: 'expose-loader',
            options: 'moment'
          }]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          loaders: ["style-loader","css-loader"]
        }
      ]
    },
    resolve: {
      alias: {
        'sticky-kit': 'sticky-kit/dist/sticky-kit',
        UI: path.resolve('./src/utils/ui'),
        jquery: "jquery/src/jquery"
      }
    }
  }
}