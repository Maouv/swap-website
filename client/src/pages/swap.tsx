import { WalletConnection } from '@/components/wallet-connection';
import { SwapInterface } from '@/components/swap-interface';
import { Web3Provider } from '@/hooks/use-web3';

function SwapPageContent() {
  return (
    <div className="min-h-screen bg-ledgr-dark text-white font-courier">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-courier-bold">Ledgr.</h1>
        <WalletConnection />
      </header>

      <main className="max-w-md mx-auto px-6">
        {/* App Description */}
        <div className="text-center mb-8">
          <div className="dotted-separator mb-6"></div>
          <h2 className="text-lg mb-2 font-courier">Your trades.</h2>
          <p className="text-lg font-courier">One clear view.</p>
          <div className="dotted-separator mt-6"></div>
        </div>

        {/* Swap Interface */}
        <SwapInterface />

        {/* Transaction History */}
        <div className="dotted-border rounded-lg p-4 bg-ledgr-card">
          <h3 className="font-courier-bold mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            <div className="text-center text-gray-500 text-sm py-4 font-courier">
              No transactions yet
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8 font-courier">
        <div className="dotted-separator max-w-md mx-auto mb-4"></div>
        <p>Monad Testnet • Powered by Uniswap V2</p>
      </footer>
    </div>
  );
}

export default function SwapPage() {
  return (
    <Web3Provider>
      <SwapPageContent />
    </Web3Provider>
  );
}
