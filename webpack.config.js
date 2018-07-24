require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

  entry: [
    'babel-polyfill',
    './src/main.js',
  ],

  output: {
    publicPath: '/',
    filename: './main.js',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      ARCGIS_USER: JSON.stringify(process.env.ARCGIS_USER),
      ARCGIS_PASSWORD: JSON.stringify(process.env.ARCGIS_PASSWORD),
      ARCGIS_MAP_ID: JSON.stringify(process.env.ARCGIS_MAP_ID),
    }),

    new HtmlWebpackPlugin({
      template: './index.html',
      filename: './index.html',
      hash: true,
    }),
  ],
};
