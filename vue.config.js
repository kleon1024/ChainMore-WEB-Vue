const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const sourceMap = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: false,
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
  },
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      axios: 'axios',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'highlight.js': 'hljs',
      moment: 'moment',
      d3: 'd3',
      marked: 'marked',
      vuetify: 'Vuetify',
      // 'vue-toasted': 'Toasted'
    }

    config.plugins.push(new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.json$|\.css/,
      threshold: 10240,
      minRatio: 0.8
    }));

    config.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    };

    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    } else {
      config.mode = 'development'
    }

    Object.assign(config, {
      resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
        alias: {
          vue$: 'vue/dist/vue.js',
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          utils: path.resolve(__dirname, './src/utils'),
          api: path.resolve(__dirname, './src/api'),
          views: path.resolve(__dirname, './src/views'),
          assets: path.resolve(__dirname, './src/assets'),
          com: path.resolve(__dirname, './src/components'),
          store: path.resolve(__dirname, './src/store'),
          directives: path.resolve(__dirname, './src/directives'),
          plugins: path.resolve(__dirname, './src/plugins')
        }
      }
    })
  },
  productionSourceMap: sourceMap,
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {},
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/v1/': {
        target: 'http://localhost:6789',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
