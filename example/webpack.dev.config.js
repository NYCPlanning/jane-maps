const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin('css/bundle.css');

module.exports = {
  entry: './index',
  output: {
    path: path.join(__dirname, '/'),
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'node_modules'),
    ],
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve)
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve)
        },
      },
      {
        test: /\.css$/,
        use: extractSass.extract({
          loader: [{
            loader: 'css-loader',
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
    ]
  },
  plugins: [
    extractSass,
  ],
};
