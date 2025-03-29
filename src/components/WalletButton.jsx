import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet()

  useEffect(() => {
    if (publicKey) {
      toast.success(`Connected: ${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`)
    }
  }, [publicKey])

  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/90 !rounded-lg !px-4 !py-2 !text-white" />
    </div>
  )
}