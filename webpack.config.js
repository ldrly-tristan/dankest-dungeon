/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
//const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const webpack = require('webpack');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',

  devtool: isProd ? 'hidden-source-map' : 'source-map',

  context: `${__dirname}/src/`,

  entry: {
    main: './index.ts'
  },

  output: {
    path: `${__dirname}/dist/`,
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js'
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: false,
          emitWarning: false,
          failOnError: true,
          failOnWarning: false
        }
      },
      {
        test: /\.ts$/,
        exclude: [/\/node_modules\//],
        use: ['awesome-typescript-loader', 'source-map-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.scss$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin({}), new TerserWebpackPlugin({})]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      },
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(false),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
      'typeof FEATURE_SOUND': JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      title: 'Dankest Dungeon',
      template: '!!ejs-loader!src/index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1'
      }
    }),
    /*new TypedocWebpackPlugin({
      name: 'Dankest Dungeon',
      mode: 'file',
      out: '../docs'
    }),*/
    isProd
      ? new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[id].contenthash].css'
        })
      : null,
    isProd ? new CleanWebpackPlugin() : null
  ].filter(Boolean),

  devServer: {
    contentBase: `${__dirname}/src/`,
    publicPath: '/',
    host: 'localhost',
    port: 4200,
    compress: true,
    hot: true
  }
};
