const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
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
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      comps: path.resolve(__dirname, 'src/comps/'),
      toolkit: path.resolve(__dirname, 'toolkit/'),
    },
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Aragon Signaling',
    favicon: './toolkit/comps/a-header/assets/isotype.svg'
  })],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
