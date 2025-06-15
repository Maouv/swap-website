import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './use-web3';
import { getRouterContract, getERC20Contract } from '@/lib/contracts';
import { WEB3_CONFIG, TOKEN_CONFIG } from '@/lib/web3-config';

export interface SwapState {
  fromToken: 'MON' | 'WMON';
  toToken: 'MON' | 'WMON';
  fromAmount: string;
  toAmount: string;
  fromBalance: string;
  toBalance: string;
  exchangeRate: string;
  isLoading: boolean;
  error: string | null;
}

export function useSwap() {
  const { provider, signer, account, isConnected, isCorrectNetwork } = useWeb3();
  
  const [swapState, setSwapState] = useState<SwapState>({
    fromToken: 'MON',
    toToken: 'WMON',
    fromAmount: '',
    toAmount: '',
    fromBalance: '0.00',
    toBalance: '0.00',
    exchangeRate: '1 MON = 1 WMON',
    isLoading: false,
    error: null
  });

  const updateBalances = useCallback(async () => {
    if (!provider || !account) return;

    try {
      // Get MON balance
      const monBalance = await provider.getBalance(account);
      const monBalanceFormatted = parseFloat(ethers.utils.formatEther(monBalance)).toFixed(4);

      // Get WMON balance
      let wmonBalanceFormatted = '0.00';
      try {
        const wmonContract = getERC20Contract(WEB3_CONFIG.WMON_ADDRESS, provider);
        const wmonBalance = await wmonContract.balanceOf(account);
        wmonBalanceFormatted = parseFloat(ethers.utils.formatEther(wmonBalance)).toFixed(4);
      } catch (error) {
        console.warn('Error fetching WMON balance:', error);
      }

      setSwapState(prev => ({
        ...prev,
        fromBalance: prev.fromToken === 'MON' ? monBalanceFormatted : wmonBalanceFormatted,
        toBalance: prev.toToken === 'MON' ? monBalanceFormatted : wmonBalanceFormatted
      }));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  }, [provider, account, swapState.fromToken, swapState.toToken]);

  const calculateAmountOut = useCallback(async (amountIn: string) => {
    if (!provider || !amountIn || parseFloat(amountIn) === 0) {
      setSwapState(prev => ({ ...prev, toAmount: '', exchangeRate: '1 MON = 1 WMON' }));
      return;
    }

    try {
      setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

      const routerContract = getRouterContract(provider);
      const amountInWei = ethers.utils.parseEther(amountIn);

      // Determine path based on token selection
      let path: string[];
      if (swapState.fromToken === 'MON' && swapState.toToken === 'WMON') {
        // For MON -> WMON, we need to get WETH address from router first
        const wethAddress = await routerContract.WETH();
        path = [wethAddress, WEB3_CONFIG.WMON_ADDRESS];
      } else if (swapState.fromToken === 'WMON' && swapState.toToken === 'MON') {
        const wethAddress = await routerContract.WETH();
        path = [WEB3_CONFIG.WMON_ADDRESS, wethAddress];
      } else {
        // Should not happen with current setup, but fallback
        setSwapState(prev => ({ ...prev, toAmount: amountIn, isLoading: false }));
        return;
      }

      try {
        const amounts = await routerContract.getAmountsOut(amountInWei, path);
        const amountOut = ethers.utils.formatEther(amounts[amounts.length - 1]);
        const rate = parseFloat(amountOut) / parseFloat(amountIn);
        
        setSwapState(prev => ({
          ...prev,
          toAmount: parseFloat(amountOut).toFixed(6),
          exchangeRate: `1 ${prev.fromToken} = ${rate.toFixed(6)} ${prev.toToken}`,
          isLoading: false
        }));
      } catch (routerError) {
        // If router call fails (e.g., no liquidity), show 1:1 for demo
        console.warn('Router call failed, using 1:1 rate:', routerError);
        setSwapState(prev => ({
          ...prev,
          toAmount: amountIn,
          exchangeRate: `1 ${prev.fromToken} = 1 ${prev.toToken}`,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error calculating amount out:', error);
      setSwapState(prev => ({
        ...prev,
        error: 'Failed to calculate output amount',
        isLoading: false
      }));
    }
  }, [provider, swapState.fromToken, swapState.toToken]);

  const executeSwap = useCallback(async () => {
    if (!signer || !isConnected || !isCorrectNetwork || !swapState.fromAmount) {
      throw new Error('Please connect wallet and ensure correct network');
    }

    try {
      setSwapState(prev => ({ ...prev, isLoading: true, error: null }));

      const routerContract = getRouterContract(signer);
      const amountIn = ethers.utils.parseEther(swapState.fromAmount);
      const amountOutMin = ethers.utils.parseEther(
        (parseFloat(swapState.toAmount) * 0.995).toString() // 0.5% slippage
      );
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      let tx;

      if (swapState.fromToken === 'MON' && swapState.toToken === 'WMON') {
        // MON -> WMON (ETH -> Token)
        const wethAddress = await routerContract.WETH();
        const path = [wethAddress, WEB3_CONFIG.WMON_ADDRESS];
        
        tx = await routerContract.swapExactETHForTokens(
          amountOutMin,
          path,
          account,
          deadline,
          { value: amountIn }
        );
      } else if (swapState.fromToken === 'WMON' && swapState.toToken === 'MON') {
        // WMON -> MON (Token -> ETH)
        // First check allowance and approve if necessary
        const wmonContract = getERC20Contract(WEB3_CONFIG.WMON_ADDRESS, signer);
        const allowance = await wmonContract.allowance(account, WEB3_CONFIG.UNISWAP_ROUTER);
        
        if (allowance.lt(amountIn)) {
          const approveTx = await wmonContract.approve(WEB3_CONFIG.UNISWAP_ROUTER, amountIn);
          await approveTx.wait();
        }

        const wethAddress = await routerContract.WETH();
        const path = [WEB3_CONFIG.WMON_ADDRESS, wethAddress];
        
        tx = await routerContract.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          account,
          deadline
        );
      } else {
        throw new Error('Invalid token pair');
      }

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Reset form and update balances
      setSwapState(prev => ({ 
        ...prev, 
        fromAmount: '', 
        toAmount: '', 
        isLoading: false 
      }));
      
      // Update balances after successful swap
      setTimeout(updateBalances, 1000);
      
      return receipt;
    } catch (error) {
      console.error('Swap error:', error);
      setSwapState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Swap failed',
        isLoading: false
      }));
      throw error;
    }
  }, [signer, isConnected, isCorrectNetwork, account, swapState, updateBalances]);

  const swapDirection = useCallback(() => {
    setSwapState(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
      fromBalance: prev.toBalance,
      toBalance: prev.fromBalance
    }));
  }, []);

  const setFromAmount = useCallback((amount: string) => {
    setSwapState(prev => ({ ...prev, fromAmount: amount }));
    calculateAmountOut(amount);
  }, [calculateAmountOut]);

  return {
    swapState,
    updateBalances,
    calculateAmountOut,
    executeSwap,
    swapDirection,
    setFromAmount
  };
}
