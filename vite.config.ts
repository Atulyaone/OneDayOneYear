import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

// Keep the proxy in step with the API's own PORT so a second copy of the
// project can run on 8788 without pointing submissions at the first copy.
const apiPort = process.env.API_PORT ?? process.env.PORT ?? '8787'

const apiProxy = {
  '/api': {
    target: `http://127.0.0.1:${apiPort}`,
    changeOrigin: false,
  },
}

export default defineConfig({
  plugins: [react(), svgr()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
