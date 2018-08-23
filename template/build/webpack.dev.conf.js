var utils = require('./utils')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

// PWA part
const WorkBoxPlugin = require('workbox-webpack-plugin')
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function resolveApp (relativePath) {
  return path.resolve(relativePath)
}

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
  },
  // cheap-source-map is faster for development
  devtool: '#source-map',
  cache: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: resolveApp('favicon.ico'),
      inject: true,
      path: config.dev.staticPath
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      },
      // copy manifest file to output path
      {
        from: path.resolve(__dirname, '../src/manifest.json'),
        to: config.build.assetsRoot
      },
      // copy logo file to output path
      {
        from: path.resolve(__dirname, '../src/assets/wuanlife_256.jpg'),
        to: config.build.assetsRoot
      }
    ]),
    // inject sw file from swSrc to output path
    new WorkBoxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, '../src/service-worker.js')
    }),
    // 通过插件生成sw生成
    new SwRegisterWebpackPlugin({
      version: +new Date()
    }),
    // 通过routes配置，可以实现多页面多骨架屏
    new SkeletonWebpackPlugin({
      webpackConfig: require('./webpack.skeleton.conf'),
      router: {
        mode: 'hash',
        routes: [
          {
            path: '/',
            skeletonId: 'skeleton'
          },
          {
            path: '/detail',
            skeletonId: 'skeleton_detail'
          }
        ]
      }
    }),
    new FriendlyErrorsPlugin()
  ]
})
