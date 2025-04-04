import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Messenger-typescript-frontend/', // Replace with your GitHub repository name
    define: {
    global: "window", // Add this line to fix the "global is not defined" error
  },
})




