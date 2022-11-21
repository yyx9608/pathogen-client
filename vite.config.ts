import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open : true,
    proxy: {
      '/devServer': {
        target: 'http://1486641sd0.iask.in:35485',
        //target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/devServer/, '')
      },
    }

  }
})
