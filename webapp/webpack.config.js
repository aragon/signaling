const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = () => {

  const base = [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' },
    }),
    new HtmlWebpackPlugin({
      title: 'Aragon Signaling',
      favicon: './toolkit/comps/a-header/assets/isotype.svg',
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

module.exports = {
  entry: ['./src/index.js'],
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [require('postcss-cssnext')()],
          extractCSS: PRODUCTION,
        },
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      comps: path.resolve(__dirname, 'src/comps/'),
      toolkit: path.resolve(__dirname, 'toolkit/'),
    },
  },
  plugins: plugins(),
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
