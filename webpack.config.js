var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpack = require('webpack');
module.exports = {
  context: __dirname + '/app',
  entry: {
    app: './app.js',
    vendor: ['angular']
  },
  
  output: {
    path: __dirname + '/dist',
    filename: 'app.bundle.js',
    sourceMapFilename: "[file].map"
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    
    new ExtractTextPlugin("[name].styles.css"),
    new HtmlWebpackPlugin({     
      template: './index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inject: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    
    new webpack.optimize.UglifyJsPlugin({ minimize: true,sourceMap: true}),

  ],
  devtool: "eval-source-map",
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.html$/, use: 'html-loader'},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract([ 'css-loader' ])}
    ]
  }
};