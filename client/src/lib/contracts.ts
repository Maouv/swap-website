import { ethers } from 'ethers';
import { WEB3_CONFIG } from './web3-config';

// Uniswap V2 Router ABI (minimal)
export const UNISWAP_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function WETH() external pure returns (address)'
];

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function totalSupply() view returns (uint256)'
];

// Uniswap V2 Factory ABI (minimal)
export const UNISWAP_FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function createPair(address tokenA, address tokenB) external returns (address pair)'
];

export function getRouterContract(provider: ethers.providers.Provider | ethers.Signer) {
  return new ethers.Contract(WEB3_CONFIG.UNISWAP_ROUTER, UNISWAP_ROUTER_ABI, provider);
}

export function getFactoryContract(provider: ethers.providers.Provider | ethers.Signer) {
  return new ethers.Contract(WEB3_CONFIG.UNISWAP_FACTORY, UNISWAP_FACTORY_ABI, provider);
}

export function getERC20Contract(address: string, provider: ethers.providers.Provider | ethers.Signer) {
  return new ethers.Contract(address, ERC20_ABI, provider);
}
