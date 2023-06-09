const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      // 配置跨域
      '/api': {
        target: `http://localhost:2201/chat`, //请求后台接口
        // target: `http://60.205.4.143/chatApi`, //请求后台接口
        changeOrigin: true, // 允许跨域
        ws: true,
        pathRewrite: {
          '^/api': '' // 重写请求
        }
      }
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/'
}