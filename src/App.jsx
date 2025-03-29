import { WalletProvider } from './context/WalletContext'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-solana-dark text-solana-light">
        <Toaster position="bottom-right" />
        <Home />
      </div>
    </WalletProvider>
  )
}

export default App