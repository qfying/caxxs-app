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
      '/openapi': {
        // target: 'http://172.30.232.95:23081',
        // target: 'http://192.168.137.24:8000',
        target: 'http://10.110.163.79:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  define: {
    'process.env': process.env,
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
