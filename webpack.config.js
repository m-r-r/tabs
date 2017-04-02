const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV !== 'production';
const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, 'build');
const publicDir = path.join(__dirname, 'public');
const entry = [path.join(srcDir, 'main.js')];

if (!isProd) {
  entry.unshift('react-hot-loader/patch');
}

const babelOptions = {
  cacheDirectory: !isProd,
};

const config = {
    bail: isProd,
    devtool: isProd ? false : 'cheap-module-source-map',

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
          use: [
            isProd ? null : 'react-hot-loader/webpack', 
            'babel-loader?' + JSON.stringify(babelOptions),
          ].filter(v => v !== null)
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
      isProd && new webpack.optimize.UglifyJsPlugin({
        comments: false, // remove comments
        compress: {
          properties: true,
          dead_code: true,
          drop_debugger: true,
          unsafe: true,
          conditionals: true,
          comparisons: true,
          booleans: true,
          evaluate: true,
          loops: true,
          unused: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          collapse_vars: true,
          reduce_vars: true,
          warnings: false,
          pure_getters: true,
          drop_console: true,
          keep_fargs: false,
          keep_fnames: false,
          passes: 3,
        },
        sourceMaps: false,
      })
    ].filter(p => !!p),
};

if (!isProd) {
  config.devServer = {
    contentBase: publicDir,
    watchContentBase: true,
    hot: true,
    inline: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  }
}

module.exports = config;