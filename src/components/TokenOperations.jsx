import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function TokenOperations({ loading, setLoading }) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [decimals, setDecimals] = useState(9)
  const [mintAmount, setMintAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [activeTab, setActiveTab] = useState('create')

  const handleCreateToken = async () => {
    if (!publicKey) return
    if (!tokenName || !tokenSymbol) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const mint = await createMint(
        connection,
        publicKey,
        publicKey,
        null,
        decimals
      )
      toast.success(`Token created: ${mint.toBase58()}`)
      setTokenName('')
      setTokenSymbol('')
    } catch (error) {
      toast.error('Failed to create token')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMintTokens = async () => {
    if (!publicKey) return
    if (!mintAmount) {
      toast.error('Please enter amount')
      return
    }

    try {
      setLoading(true)
      // In a real app, you would select an existing mint
      const mint = Keypair.generate() // Placeholder - replace with actual mint
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint.publicKey,
        publicKey
      )
      
      const signature = await mintTo(
        connection,
        publicKey,
        mint.publicKey,
        tokenAccount.address,
        publicKey,
        Number(mintAmount) * Math.pow(10, decimals)
      )
      
      toast.success(`Tokens minted: ${signature}`)
      setMintAmount('')
    } catch (error) {
      toast.error('Failed to mint tokens')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendTokens = async () => {
    if (!publicKey) return
    if (!recipient || !sendAmount) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      // In a real app, you would select an existing mint
      const mint = Keypair.generate() // Placeholder - replace with actual mint
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint.publicKey,
        publicKey
      )
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint.publicKey,
        recipient
      )

      const transaction = new Transaction().add(
        transfer(
          fromTokenAccount.address,
          toTokenAccount.address,
          publicKey,
          Number(sendAmount) * Math.pow(10, decimals)
        )
      )

      const signature = await sendTransaction(transaction, connection)
      toast.success(`Tokens sent: ${signature}`)
      setRecipient('')
      setSendAmount('')
    } catch (error) {
      toast.error('Failed to send tokens')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-solana-dark border border-solana-purple rounded-lg p-6">
      <div className="flex border-b border-solana-purple/20 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'text-solana-green border-b-2 border-solana-green' : 'text-solana-light/70'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Token
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'mint' ? 'text-solana-green border-b-2 border-solana-green' : 'text-solana-light/70'}`}
          onClick={() => setActiveTab('mint')}
        >
          Mint Tokens
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'send' ? 'text-solana-green border-b-2 border-solana-green' : 'text-solana-light/70'}`}
          onClick={() => setActiveTab('send')}
        >
          Send Tokens
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Token Name</label>
            <input
              type="text"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Token Symbol</label>
            <input
              type="text"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Decimals</label>
            <input
              type="number"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              min="0"
              max="18"
            />
          </div>
          <button
            className="w-full bg-solana-purple hover:bg-solana-purple/90 text-white py-2 px-4 rounded disabled:opacity-50"
            onClick={handleCreateToken}
            disabled={loading || !tokenName || !tokenSymbol}
          >
            {loading ? 'Creating...' : 'Create Token'}
          </button>
        </div>
      )}

      {activeTab === 'mint' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount to Mint</label>
            <input
              type="number"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              min="0"
            />
          </div>
          <button
            className="w-full bg-solana-purple hover:bg-solana-purple/90 text-white py-2 px-4 rounded disabled:opacity-50"
            onClick={handleMintTokens}
            disabled={loading || !mintAmount}
          >
            {loading ? 'Minting...' : 'Mint Tokens'}
          </button>
        </div>
      )}

      {activeTab === 'send' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient Address</label>
            <input
              type="text"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter wallet address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount to Send</label>
            <input
              type="number"
              className="w-full bg-solana-dark border border-solana-purple/30 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-solana-purple"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              min="0"
            />
          </div>
          <button
            className="w-full bg-solana-purple hover:bg-solana-purple/90 text-white py-2 px-4 rounded disabled:opacity-50"
            onClick={handleSendTokens}
            disabled={loading || !recipient || !sendAmount}
          >
            {loading ? 'Sending...' : 'Send Tokens'}
          </button>
        </div>
      )}
    </div>
  )
}