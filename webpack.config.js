const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
module.exports = [{
  name: 'es5',
  entry: {
   'pano.es5': './es5.js'
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
        test: require.resolve('moment'),
        use: [{
          loader: 'expose-loader',
          options: 'moment'
        }]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader:"file-loader",
        query:{
          name:'[name].[ext]',
          outputPath:'images/'
          //the images will be emmited to public/assets/images/ folder
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
      UI: path.resolve('./src/utils/ui')
    }
  }
}, {
  name: 'es6',
  entry: {
    'pano.es6': './es6.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./'),
    library: 'Pano',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [{
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
    },{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    }
  }]}
}]