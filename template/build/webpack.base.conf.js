var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// PWA part
const WorkBoxPlugin = require('workbox-webpack-plugin')
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var src = path.resolve(__dirname, '../src')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV !== 'development' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': resolve('src'),
      'filters': resolve('src/filters'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'api': path.resolve(__dirname, '../src/api'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'vendor': path.resolve(__dirname, '../src/vendor'),
      'static': path.resolve(__dirname, '../static')
    }
  },
  externals: {
  },
  plugins: [
    // 以service-worker.js文件为模板，注入生成service-worker.js
    new WorkBoxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, '../src/service-worker.js')
    }),
    // 通过插件注入生成sw注册脚本
    new SwRegisterWebpackPlugin({
      version: +new Date()
    }),
    // 骨架屏
    new SkeletonWebpackPlugin({
      webpackConfig: require('./webpack.skeleton.conf'),
      router: {
        mode: 'hash',
        routes: [
          {
            path: '*',
            skeletonId: 'skeleton'
          }
        ]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')]
        // options: {
        //     formatter: require('eslint-friendly-formatter')
        // }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 注入全局mixin
  // sassResources: path.join(__dirname, '../src/styles/mixin.scss'),
  // sassLoader: {
  //     data:  path.join(__dirname, '../src/styles/index.scss')
  // },
}
