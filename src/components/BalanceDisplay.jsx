import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function BalanceDisplay() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) return

    const fetchBalance = async () => {
      try {
        setLoading(true)
        const lamports = await connection.getBalance(publicKey)
        setBalance(lamports / LAMPORTS_PER_SOL)
      } catch (error) {
        toast.error('Failed to fetch balance')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [publicKey, connection])

  return (
    <div className="bg-solana-dark border border-solana-purple rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-solana-purple/20 rounded"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-solana-green">SOL</span>
            <span className="font-mono">{balance.toFixed(4)}</span>
          </div>
          <div className="pt-4">
            <h3 className="text-sm font-medium text-solana-purple mb-2">Your Tokens</h3>
            <div className="text-center py-4 text-sm text-solana-light/70">
              No tokens found
            </div>
          </div>
        </div>
      )}
    </div>
  )
}