const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV !== 'production';
const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, 'build');
const publicDir = path.join(__dirname, 'public');
const entry = [path.join(srcDir, 'main.js')];

if (!isProd) {
  entry.unshift('react-dev-utils/webpackHotDevClient');
}

const babelOptions = {
  cacheDirectory: !isProd,
  plugins: isProd ? [] : 'react-hot-loader/babel',
};

const config = {
    bail: isProd,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',

    entry: entry,

    output: {
      path: buildDir,
      filename: 'static/js/bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
    },
    module: {
      rules: [
        {parser: { requireEnsure: false}}, 
        {
          test: /\.jsx?$/,
          include: srcDir,
          loader: 'babel-loader',
          options: babelOptions,
        }
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(publicDir, 'index.html'),
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }),
    ],
};

if (!isProd) {
  config.devServer = {
    contentBase: publicDir,
    watchContentBase: true,
    hot: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  }
}

module.exports = config;