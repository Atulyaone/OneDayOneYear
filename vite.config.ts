import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8787',
    changeOrigin: false,
  },
}

export default defineConfig({
  plugins: [react(), svgr()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
