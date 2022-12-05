import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({command, mode})=>{
  const config = loadEnv(mode,'./');
  return {
    base : './',
    build : {
  
    },
    plugins: [vue()],
    server: {
      open : true,
      proxy: {
        '/devServer': {
          //target: 'http://1486641sd0.iask.in:35485',
          //target: 'http://localhost:8080',
          target : config.VITE_BASIC_API,
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/devServer/, ''),
        },
        'ws://': {//捕获API的标志，如果API中有这个字符串，那么就开始匹配代理，
          //target : 'ws://localhost:8080/',//代理的api地址，就是要跨域的地址
          //target : 'ws://1486641sd0.iask.in:35485/',//代理的api地址，就是要跨域的地址
          target : config.VITE_BASIC_API,
          changeOrigin : true,// 这个参数可以让target参数是域名
          ws : true,//是否启用websockets，用不到可设为false,
          secure : true,
        },
      }
    }
  }
})
