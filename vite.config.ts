import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/openapi/v0': {
        // target: 'http://172.30.232.95:23081',
        // target: 'http://192.168.137.24:8000',
        target: 'http://10.110.163.79:8787',
        changeOrigin: true,
        secure: false,
      },
      '/openapi/v2': {
        target: 'http://172.30.232.95:22080',
        // target: 'http://192.168.137.24:8000',
        // target: 'http://10.110.163.79:8787',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        // 自定义一个路径，用于匹配 WebSocket 请求
        target: 'ws://10.110.163.79:21095',
        ws: true, // 开启 WebSocket 代理
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ws/, ''), // 可根据需要重写路径
      },
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __HMR_CONFIG_NAME__: JSON.stringify('vite')
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
