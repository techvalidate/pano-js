const webpack = require('webpack')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const UglifyJsPlugin = require('uglify-js-plugin')
const path = require('path')

const entries = {
  frontend: './src/index.js'
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  let plugins = [
    new MomentLocalesPlugin(),
  ]

  /**
   * WEBPACK CONFIG
   */
  return {
    context: path.resolve(__dirname),

    entry: entries,

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      globalObject: 'typeof self !== \'undefined\' ? self : this',
      library: 'pano',
      libraryTarget: 'umd',
    },

    plugins,

    optimization: {
      minimizer: isProd ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            cache: true,
            parallel: true,
            beautify: false,
            output: {
              comments: false,
            },
          },
          sourceMap: false,
        })
      ] : []
    },

    devtool: isProd ? false : 'cheap-module-eval-source-map',
    module: {
      rules: [
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
    }
  }
}

// module.exports = {
//   entry: {
//    pano: './index.js'
//   },
//   output: {
//     filename: '[name].js',
//     path: path.resolve('./'),
//     library: 'Pano',
//     libraryTarget: 'umd'
//   },
//   devtool: 'source-map',
//   plugins: [
//     new MomentLocalesPlugin(),
//     new webpack.ProvidePlugin({
//       _: 'lodash',
//       $: 'jquery',
//       jQuery: 'jquery',
//       jquery: 'jquery',
//       UI: 'UI'
//     }),

//   ],
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader'
//         }
//       },
//       {
//         test: /\.(jpe?g|png|gif)$/i,
//         loader:"file-loader",
//         query:{
//           name:'[name].[ext]',
//           outputPath:'images/'
//           //the images will be emmited to public/assets/images/ folder
//           //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png);
//         }
//       },
//       {
//         test: /\.css$/,
//         loaders: ["style-loader","css-loader"]
//       }
//     ]
//   }
// }
