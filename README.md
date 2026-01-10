# Shield - Portfolio Insurance

A decentralized options platform built on Base that enables cryptocurrency holders to protect their ETH and BTC portfolios through simplified put option purchases.

## Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base network configured in your wallet

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finoptions-test
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect project ID (optional, defaults to "demo"):
```
NEXT_PUBLIC_WALLET_CONNECT_ID=your_project_id_here
```

Get a free project ID at [WalletConnect Cloud](https://cloud.walletconnect.com).

## Running the Project

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
├── constants/       # Contract addresses and ABIs
└── types/           # TypeScript type definitions
```

## Key Features

- **Portfolio Protection**: Buy put options to protect ETH/BTC positions
- **Order Book**: Browse and fill pre-signed orders from market makers
- **Request for Quote**: Submit custom option requests
- **Payoff Visualization**: Interactive charts showing potential outcomes

## Network

This application runs on **Base Mainnet** (Chain ID: 8453). Ensure your wallet is connected to Base before interacting with the application.

## Documentation

See the `docs/` directory for detailed documentation:
- `PROJECT-EXPLAINED.md` - Product overview
- `ARCHITECTURE.md` - System architecture
- `TECHNICAL-DEEP-DIVE.md` - Technical implementation details
- `PRODUCT-DOCUMENT.md` - Product documentation

## License

Private project

