# 🦄 Monad Swap DApp

A simple token swap interface built on **Monad Testnet**, powered by **Uniswap V2** smart contracts. Supports swapping between `MON` and `WMON`.

## 🚀 Features

* Connect wallet (MetaMask)
* Auto-switch to Monad Testnet (Chain ID: `10143`)
* Token swap between `MON` and `WMON`
* Dynamic token logos
* Gasless, testnet only

## 🔧 Tech Stack

* React + TypeScript
* TailwindCSS for UI
* Vite for dev/build tooling
* ethers.js for Web3 integration

## 📦 Installation

```bash
npm install
```

## 💻 Development

```bash
npm run dev
```

Runs both the Vite frontend and Express backend.

## 🛠 Build

```bash
npm run build
```

## 🪙 Token Config

Stored in `src/lib/web3-config.ts`:

```ts
MON: native token
WMON: wrapped MON token
```

## 🌐 Network

| Name           | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| Chain ID       | 10143                                                          |
| Chain ID Hex   | 0x27af                                                         |
| RPC URL        | [https://testnet-rpc.monad.xyz](https://testnet-rpc.monad.xyz) |
| Block Explorer | [https://explorer.monad.xyz](https://explorer.monad.xyz)       |

## 📫 Contact Me

* 🐦 Twitter: [@Production35060](https://x.com/Production35060?t=bwnL4TIGIoFtChu4tWZucQ&s=09)
* ✈️ Telegram: [@mauuu\_123](https://t.me/mauuu_123)
* 💬 Discord: `mauuu_123`

---

Made with ❤️ by \[mauuu\_123]
