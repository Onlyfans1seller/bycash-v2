import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, bsc, base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// Твой WalletConnect Project ID (обязательно замени на свой свежий!)
const projectId = 'a4746ac803fafe7cecb476f789b0230d' // ← ВСТАВЬ СВОЙ!

const metadata = {
  name: 'ByCash Vault',
  description: 'Claim Airdrop',
  url: 'https://bycashvaultairdropp-production.up.railway.app', // или твой фронт-домен
  icons: ['https://i.postimg.cc/w3FpjdKc/image.png']
}

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, bsc, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
  },
  projectId,
  metadata,
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'dark',
  // можно добавить featuredWalletIds: [...] для приоритета Trust/MetaMask
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)