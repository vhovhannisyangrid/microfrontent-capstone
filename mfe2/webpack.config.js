const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'development',
  devServer: {
    port: 3002,
    static: path.join(__dirname, 'dist'),
  },
  output: {
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe2',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './App.js',
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};