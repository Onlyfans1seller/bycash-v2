import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@walletconnect/ethereum-provider', '@walletconnect/sign-client', '@walletconnect/universal-provider']
    }
  }
})