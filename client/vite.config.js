import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ESTO ES LO QUE ARREGLA EL ERROR:
  optimizeDeps: {
    include: ['@apollo/client', 'graphql'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})