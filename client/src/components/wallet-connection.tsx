import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/use-web3';
import { useToast } from '@/hooks/use-toast';

export function WalletConnection() {
  const { account, isConnected, isCorrectNetwork, connectWallet, switchNetwork } = useWeb3();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork();
      toast({
        title: "Network Switched",
        description: "Successfully switched to Monad Testnet",
      });
    } catch (error) {
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Monad Testnet",
        variant: "destructive",
      });
    }
  };

  if (isConnected && !isCorrectNetwork) {
    return (
      <Button 
        onClick={handleSwitchNetwork}
        className="bg-yellow-500 text-black hover:bg-yellow-600 font-courier-bold px-6 py-2"
      >
        Switch Network
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <Button 
        className="bg-green-500 text-white hover:bg-green-600 font-courier-bold px-6 py-2"
        disabled
      >
        {`${account.slice(0, 6)}...${account.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      className="bg-white text-black hover:bg-gray-200 font-courier-bold px-6 py-2"
    >
      Connect
    </Button>
  );
}
