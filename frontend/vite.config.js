import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fix SockJS: define global for browser
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window'
  }
})
