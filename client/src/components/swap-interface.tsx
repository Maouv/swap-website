import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TokenSelector } from './token-selector';
import { useSwap } from '@/hooks/use-swap';
import { useWeb3 } from '@/hooks/use-web3';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown } from 'lucide-react';

export function SwapInterface() {
  const { isConnected, isCorrectNetwork } = useWeb3();
  const { swapState, updateBalances, executeSwap, swapDirection, setFromAmount } = useSwap();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      updateBalances();
    }
  }, [isConnected, isCorrectNetwork, updateBalances]);

  const handleSwap = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Monad Testnet",
        variant: "destructive",
      });
      return;
    }

    if (!swapState.fromAmount || parseFloat(swapState.fromAmount) === 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to swap",
        variant: "destructive",
      });
      return;
    }

    try {
      await executeSwap();
      toast({
        title: "Swap Successful",
        description: `Successfully swapped ${swapState.fromAmount} ${swapState.fromToken} for ${swapState.toAmount} ${swapState.toToken}`,
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Failed to execute swap",
        variant: "destructive",
      });
    }
  };

  const isSwapDisabled = !isConnected || !isCorrectNetwork || !swapState.fromAmount || swapState.isLoading;

  return (
    <div className="dotted-border rounded-lg p-4 mb-6 bg-ledgr-card">
      {/* Swap Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-courier">~/Swap</span>
        </div>
        <button className="text-2xl hover:text-ledgr-purple transition-colors font-courier">+</button>
      </div>

      {/* Network Selection */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400 font-courier">
        <svg className="w-4 h-4 text-ledgr-purple" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span>Monad</span>
      </div>

      <div className="dotted-separator mb-4"></div>

      {/* From Token */}
      <div className="space-y-0">
        <TokenSelector
          token={swapState.fromToken}
          amount={swapState.fromAmount}
          balance={swapState.fromBalance}
          onAmountChange={setFromAmount}
        />

        <div className="dotted-separator"></div>

        {/* Swap Direction Button */}
        <div className="flex justify-center py-2">
          <button 
            className="p-2 hover:bg-ledgr-border rounded-lg transition-colors"
            onClick={swapDirection}
            disabled={swapState.isLoading}
          >
            <ArrowUpDown className="w-6 h-6" />
          </button>
        </div>

        <div className="dotted-separator"></div>

        {/* To Token */}
        <TokenSelector
          token={swapState.toToken}
          amount={swapState.toAmount}
          balance={swapState.toBalance}
          readOnly
        />
      </div>

      <div className="dotted-separator my-4"></div>

      {/* Status Message */}
      <div className="text-sm text-gray-400 mb-4 font-courier">
        {swapState.error ? (
          <span className="text-red-400">{swapState.error}</span>
        ) : swapState.isLoading ? (
          <span className="text-yellow-400">Processing...</span>
        ) : (
          "P.S monad just tesnet"
        )}
      </div>

      {/* Swap Button */}
      <Button 
        onClick={handleSwap}
        disabled={isSwapDisabled}
        className="w-full bg-white text-black hover:bg-gray-200 font-courier-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {swapState.isLoading ? 'SWAPPING...' : 'SWAP'}
      </Button>
    </div>
  );
}
