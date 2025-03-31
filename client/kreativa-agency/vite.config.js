// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '60db-201-207-235-3.ngrok-free.app' // Agrega aquí tu host de ngrok
    ]
  }
})

