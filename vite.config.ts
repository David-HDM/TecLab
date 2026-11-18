import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirige cualquier petición que empiece por /api hacia tu backend
      '/api': {
        target: 'http://localhost:5000', // La URL de tu backend
        changeOrigin: true,
        // No es necesario reescribir la ruta porque el backend también espera /api
      },
    },
  },
})