const webpack = require('webpack')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const UglifyJsPlugin = require('uglify-js-plugin')
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

  /**
   * WEBPACK CONFIG
   */
  return {
    context: path.resolve(__dirname),

    entry: {
      pano: './index.js'
    },
    devtool: 'sourcemap',
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
              warnings: false,
              conditionals: true,
              unused: true,
              comparisons: true,
              sequences: true,
              dead_code: true,
              evaluate: true,
              join_vars: true,
              if_return: true,
            },
            output: {
              comments: false,
            },
          },
          sourceMap: false,
        })
      ] : []
    },

    // devtool: isProd ? false : 'cheap-module-eval-source-map',
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