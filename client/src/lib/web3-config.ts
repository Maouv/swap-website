export const WEB3_CONFIG = {
  MONAD_RPC: 'https://monad-testnet.g.alchemy.com/v2/-CDU78Z7dYxq9ij97oyHhIGNtBHs1g-R',
  UNISWAP_ROUTER: '0xfb8e1c3b833f9e67a71c859a132cf783b645e436',
  UNISWAP_FACTORY: '0x733e88f248b742db6c14c0b1713af5ad7fdd59d0',
  WMON_ADDRESS: '0x760afe86e5de5fa0ee542fc7b7b713e1c5425701',
  CHAIN_ID: 41144, // Monad testnet chain ID
  CHAIN_ID_HEX: '0xA0B8',
  NETWORK_NAME: 'Monad Testnet',
  NATIVE_CURRENCY: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18
  },
  BLOCK_EXPLORER: 'https://explorer.monad.xyz/'
};

export const TOKEN_CONFIG = {
  MON: {
    symbol: 'MON',
    name: 'Monad',
    decimals: 18,
    address: 'native'
  },
  WMON: {
    symbol: 'WMON',
    name: 'Wrapped Mon',
    decimals: 18,
    address: WEB3_CONFIG.WMON_ADDRESS
  }
};
