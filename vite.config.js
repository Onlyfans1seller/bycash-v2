import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@walletconnect/ethereum-provider',
        '@walletconnect/sign-client',
        '@walletconnect/universal-provider',
        '@walletconnect/modal',
        '@web3modal/base',
        '@web3modal/core',
        '@web3modal/ui',
        '@web3modal/scaffold-utils'
      ]
    }
  },
  optimizeDeps: {
    include: ['@walletconnect/ethereum-provider', '@web3modal/wagmi']
  }
})