import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['cv.favoratti.com', 'localhost'],
    hmr: {
      // Allow the HMR client to reach back through the proxy
      protocol: 'wss',
      clientPort: 443
    }
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['cv.favoratti.com', 'localhost']
  }
})
