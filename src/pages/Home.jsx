import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import BalanceDisplay from '../components/BalanceDisplay'
import TokenOperations from '../components/TokenOperations'
import WalletButton from '../components/WalletButton'

export default function Home() {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-solana-purple">Solana Token DApp</h1>
        <WalletButton />
      </header>

      {publicKey ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <BalanceDisplay />
          </div>
          <div className="md:col-span-2">
            <TokenOperations loading={loading} setLoading={setLoading} />
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl mb-4">Connect your wallet to get started</h2>
          <p className="text-solana-green mb-6">
            Use Phantom or Solflare wallet on Solana Devnet
          </p>
          <WalletButton />
        </div>
      )}
    </div>
  )
}