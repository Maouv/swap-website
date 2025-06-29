import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WEB3_CONFIG } from '@/lib/web3-config';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3State | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const isCorrectNetwork = chainId === WEB3_CONFIG.CHAIN_ID;

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum!);
      const accounts = await web3Provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        
        setProvider(web3Provider);
        setSigner(signer);
        setAccount(accounts[0].address);
        setChainId(Number(network.chainId));
        setIsConnected(true);

        // Switch to Monad testnet if not already connected
        if (Number(network.chainId) !== WEB3_CONFIG.CHAIN_ID) {
          await switchNetwork();
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: WEB3_CONFIG.CHAIN_ID_HEX }]
      });
    } catch (switchError: any) {
      // Network not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: WEB3_CONFIG.CHAIN_ID_HEX,
              chainName: WEB3_CONFIG.NETWORK_NAME,
              nativeCurrency: WEB3_CONFIG.NATIVE_CURRENCY,
              rpcUrls: [WEB3_CONFIG.MONAD_RPC],
              blockExplorerUrls: [WEB3_CONFIG.BLOCK_EXPLORER]
            }]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  };

  // Check if already connected on load
  useEffect(() => {
    if (window.ethereum) {
      const checkConnection = async () => {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum!);
          const accounts = await web3Provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await web3Provider.getSigner();
            const network = await web3Provider.getNetwork();
            
            setProvider(web3Provider);
            setSigner(signer);
            setAccount(accounts[0].address);
            setChainId(Number(network.chainId));
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value: Web3State = {
    provider,
    signer,
    account,
    chainId,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    switchNetwork,
    disconnect
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
