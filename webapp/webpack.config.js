const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const uiWebpackBase = require('@aragon/ui/webpack-base')

const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = () => {
  const base = [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' },
    }),
    new HtmlWebpackPlugin({
      title: 'Aragon Signaling',
      favicon: './favicon.svg',
    }),
    new CleanWebpackPlugin(['dist']),
  ]

  if (!PRODUCTION) {
    return base
  }

  // Production plugins
  const production = [
    new webpack.optimize.UglifyJsPlugin({ parallel: true }),
    new CompressionPlugin(),
    new ExtractTextPlugin('styles.css'),
  ]

  return base.concat(production)
}

module.exports = uiWebpackBase(webpack, __dirname, {
  entry: ['./src/index.js'],
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      comps: path.resolve(__dirname, 'src/comps/'),
    },
  },
  plugins: plugins(),
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
})
