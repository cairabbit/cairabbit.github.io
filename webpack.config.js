const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const glob = require('webpack-glob-entry');

const outputPath = './static';

let entries = glob(glob.basePath('client'), './client/ts/**/*[^.][^d].ts', './client/js/**/*.js',
  './codingkids/client/ts/**/*[^.][^d].ts', './codingkids/client/js/**/*.js');

module.exports = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  mode: process.env.NODE_ENV,
  entry: entries,
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: (chunkData) => {
      let name = chunkData.chunk.name;
      name = name.replace(/\\/ig, '/').replace('ts', 'js').replace(/\.\./ig, '')
        .replace(/\/codingkids\/client/ig, '../codingkids/static');
      return name + '.js';
    },
    sourceMapFilename: '[name].js.map'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './',
              name: (file) => {
                const p = path.parse(file);
                let dir = 'css/' + path.relative('Client', p.dir);
                dir = dir.replace('scss', '').replace('ts', '').replace(/\\/ig, '/')
                  .replace(/\/codingkids\/client/ig, '/../codingkids/static/css');
                return dir + '/[name].css';
              }
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'Client')]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'fonts/',
          publicPath: '/fonts/'
        }
      }
    ]
  },
  resolve: {
    alias: {
    },
    extensions: [".js", ".json", ".ts", ".tsx", ".css", ".scss"],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  optimization: {
    minimizer: []
  },
  plugins: [
    new CleanWebpackPlugin()
    //, new CopyPlugin([
    //  { from: 'img/**/*', to: './' }
    //], { context: 'Client/' })
  ],
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
    noInfo: true,
    overlay: {
      warnings: false,
      errors: true
    }//,
    //proxy: {
    //  '*': {
    //    target: 'http://localhost:50500',
    //    changeOrigin: true
    //  }
    //}
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
  module.exports.optimization.minimizer = (module.exports.optimization.minimizer || []).concat([
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true
      },
      sourceMap: true
    })
  ]);
}
