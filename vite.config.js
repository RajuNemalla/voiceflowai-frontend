import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Vite config for Replit compatibility
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // allow all network connections
    port: 3000,          // Replit exposes this port
    allowedHosts: [
      'localhost',
      '.replit.dev',     // ✅ allow all replit.dev subdomains
      'repl.co'          // ✅ also allow repl.co previews
    ]
  }
})
