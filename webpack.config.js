const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { productName } = require('./package.json')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    './src',
  ],

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-import'), require('postcss-cssnext'),
        ],
      },
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({ title: productName, template: 'src/index.ejs' }),
    new webpack.ExternalsPlugin('commonjs', []),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    loaders: [
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: path.resolve('./src'),
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
}
