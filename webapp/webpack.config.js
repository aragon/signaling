const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const plugins = () => {
  const activePlugins = [
    new HtmlWebpackPlugin({
      title: 'Aragon Signaling',
      favicon: './toolkit/comps/a-header/assets/isotype.svg',
    }),
    new CleanWebpackPlugin(['dist']),
  ]

  if (process.env.NODE_ENV !== 'production') {
    return activePlugins
  }

  return activePlugins.concat([
    new webpack.optimize.UglifyJsPlugin({ parallel: true }),
    new CompressionPlugin(),
  ])
}

module.exports = {
  entry: ['./src/index.js'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [require('postcss-cssnext')()],
        }
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
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
