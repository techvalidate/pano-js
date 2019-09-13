const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglify-js-plugin')
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
  devtool: 'eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      rome: 'rome',
      UI: 'UI'
    }),

  ],

  optimization: {
    minimizer: [
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
        sourceMap: true,
      })
    ]
  },

  module: {
    noParse: /switchery/,
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
        test: /\.(jpe?g|png|gif)$/i,
        loader:"file-loader",
        query:{
          name:'[name].[ext]',
          outputPath:'images/'
          //the images will be emitted to public/assets/images/ folder
          //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png);
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
      UI: path.resolve('./src/utils/ui')
    }
  }
}
