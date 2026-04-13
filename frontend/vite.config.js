import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/fichas': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
    // Solo en desarrollo local — en producción usa VITE_API_URL
  },
})
