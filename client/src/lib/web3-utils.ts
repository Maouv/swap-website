import { WEB3_CONFIG } from "./web3-config";

export async function addMonadNetworkToWallet() {
  if (!window.ethereum) {
    alert("MetaMask tidak tersedia.");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: WEB3_CONFIG.CHAIN_ID_HEX,
        chainName: WEB3_CONFIG.NETWORK_NAME,
        rpcUrls: [WEB3_CONFIG.MONAD_RPC],
        nativeCurrency: WEB3_CONFIG.NATIVE_CURRENCY,
        blockExplorerUrls: [WEB3_CONFIG.BLOCK_EXPLORER]
      }]
    });
  } catch (err) {
    console.error("Gagal menambahkan jaringan Monad:", err);
  }
}
