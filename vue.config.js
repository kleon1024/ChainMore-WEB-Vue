module.exports = {
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
