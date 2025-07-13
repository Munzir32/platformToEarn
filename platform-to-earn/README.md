# Platform-to-Earn: Decentralized Task Marketplace

A Web3-powered task marketplace where users can earn ERC-20 tokens by completing tasks. The platform features token-gated access, limited submission slots, and decentralized reward distribution through smart contracts.

## 🚀 Overview

Platform-to-Earn is a decentralized application (dApp) that connects task creators with skilled participants. It leverages blockchain technology to ensure transparent, trustless task completion and reward distribution. The system uses token gating to maintain quality submissions and IPFS for decentralized data storage.

## 🏗️ Architecture

### Frontend (Next.js + React)
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom UI components
- **Web3 Integration**: Wagmi + Viem for Ethereum interactions
- **Wallet Connection**: RainbowKit for multi-wallet support
- **State Management**: React hooks with TanStack Query

### Smart Contract (Solidity)
- **Contract**: `TaskManager.sol` - Core business logic
- **Network**: Ethereum-compatible networks
- **Contract Address**: `0x9fc8cF7cfd2bB1d1bF36E7e30867138516061e09`

### Decentralized Storage (IPFS)
- **Provider**: Pinata for IPFS pinning
- **Storage**: Task details and submission metadata
- **Integration**: Direct IPFS hash storage on-chain

## 🔧 Core Features

### 1. Task Creation & Management
- **Location**: [`app/admin/page.tsx`](./app/admin/page.tsx)
- **Smart Contract Function**: `createTask()` in [`Quest.sol`](../Quest.sol)
- **Implementation**: 
  - Task creators specify token gate requirements
  - ERC-20 rewards are locked in the contract
  - Task metadata is stored on IPFS via [`lib/ipfsUpload.ts`](./lib/ipfsUpload.ts)

```typescript
// Task creation flow
const response = await writeContractAsync({
  address: contract,
  abi: ABI,
  functionName: "createTask",
  args: [tokenGate, rewardToken, rewardAmount, ipfsHash]
})
```

### 2. Token-Gated Access Control
- **Purpose**: Ensure quality submissions through token ownership
- **Implementation**: Smart contract checks token balance before allowing submissions
- **Integration**: [`components/Taskgrid.tsx`](./components/Taskgrid.tsx) displays token requirements

### 3. Limited Submission System
- **Limit**: Maximum 3 submissions per task
- **Smart Contract**: [`Quest.sol:submitToTask()`](../Quest.sol#L67-L78)
- **Frontend**: Real-time status updates in task cards

### 4. Decentralized Data Storage
- **IPFS Integration**: [`lib/pinata.ts`](./lib/pinata.ts)
- **Data Fetching**: [`lib/IpfsDataFetch.ts`](./lib/IpfsDataFetch.ts)
- **Usage**: Task details, submission metadata, and creator information

### 5. Reward Distribution
- **Smart Contract**: [`Quest.sol:pickWinner()`](../Quest.sol#L80-L92)
- **Process**: Winner selection triggers automatic ERC-20 transfer
- **Admin Interface**: [`components/Manage.tsx`](./components/Manage.tsx)

## 🛠️ Technical Implementation

### Smart Contract Integration

The frontend integrates with the smart contract through several key files:

1. **Contract Configuration**: [`contract/index.ts`](./contract/index.ts)
   ```typescript
   export const contract = "0x9fc8cF7cfd2bB1d1bF36E7e30867138516061e09"
   ```

2. **ABI Definition**: [`contract/ABI.json`](./contract/ABI.json)
   - Complete contract interface for frontend interaction

3. **Wagmi Configuration**: [`wagmi.ts`](./wagmi.ts)
   - Web3 provider setup and configuration

### IPFS Integration

The platform uses IPFS for decentralized data storage:

1. **Upload Functions**: [`lib/ipfsUpload.ts`](./lib/ipfsUpload.ts)
   ```typescript
   export async function PlatformIPFS({
     title, description, tokenSymbol
   }: TaskFormState) {
     const metadataJson = { title, description, tokenSymbol };
     return await pinJsonWithPinata(metadataJson);
   }
   ```

2. **Pinata Integration**: [`lib/pinata.ts`](./lib/pinata.ts)
   - Handles file and JSON uploads to IPFS
   - Requires `NEXT_PUBLIC_PINATA_JWT` environment variable

3. **Data Fetching**: [`lib/IpfsDataFetch.ts`](./lib/IpfsDataFetch.ts)
   - Retrieves and parses IPFS-stored metadata

### Key Components

1. **Task Grid**: [`components/Taskgrid.tsx`](./components/Taskgrid.tsx)
   - Displays individual task cards with real-time blockchain data
   - Integrates creator reputation system

2. **Task Management**: [`components/Manage.tsx`](./components/Manage.tsx)
   - Admin interface for task creators
   - Winner selection and reward distribution

3. **Creator Reputation**: [`hooks/useCreatorReputation.ts`](./hooks/useCreatorReputation.ts)
   - Tracks and displays creator performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm or npm
- MetaMask or compatible Web3 wallet
- Pinata account for IPFS storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd platform-to-earn
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Connect your Web3 wallet
   - Start creating or participating in tasks

### Smart Contract Deployment

1. **Deploy the contract** using your preferred Ethereum development framework
2. **Update the contract address** in [`contract/index.ts`](./contract/index.ts)
3. **Verify the contract** on Etherscan or similar block explorer

## 📁 Project Structure

```
platform-to-earn/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── tasks/             # Task browsing
│   └── task/[id]/         # Individual task pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Taskgrid.tsx      # Task display component
│   └── Manage.tsx        # Task management
├── contract/             # Smart contract integration
│   ├── ABI.json         # Contract interface
│   └── index.ts         # Contract configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   ├── ipfsUpload.ts    # IPFS upload utilities
│   ├── pinata.ts        # Pinata integration
│   └── IpfsDataFetch.ts # IPFS data retrieval
└── wagmi.ts            # Web3 configuration
```

## 🔗 Key Integrations

### Blockchain Integration
- **Contract Address**: `0x9fc8cF7cfd2bB1d1bF36E7e30867138516061e09`
- **Network**: Ethereum mainnet and testnets
- **Functions**: Task creation, submission, winner selection

### Real-Time Market Intelligence & Token Analytics
- **Provider**: Nodit API
- **Features**: Real-time token pricing, USD value conversion, market volatility
- **Integration**: [`lib/tokenPricing.ts`](./lib/tokenPricing.ts)
- **Usage**: Task reward valuation, market context for users

```typescript
// Get real-time token prices
const getTokenPrices = async (contractAddresses: string[]) => {
  const response = await fetch('https://web3.nodit.io/v1/ethereum/mainnet/token/getTokenPricesByContracts', {
    method: 'POST',
    headers: { 
      'X-API-KEY': process.env.NEXT_PUBLIC_NODIT_API_KEY,
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ 
      contractAddresses,
      currency: "USD"
    })
  })
  return response.json()
}
```

### IPFS Integration
- **Provider**: Pinata
- **Storage**: Task metadata, submission details
- **Access**: Direct IPFS hash retrieval

### Web3 Wallet Integration
- **Provider**: RainbowKit
- **Supported**: MetaMask, WalletConnect, Coinbase Wallet
- **Features**: Account connection, transaction signing

## 🎯 Future Features

The platform is designed for extensibility with planned features including:

- **Achievement System**: Badges and milestones
- **Leaderboards**: Top performers and creators
- **Social Profiles**: User portfolios and connections
- **NFT Gating**: Advanced access control with NFTs
- **Governance**: DAO-style platform management

See [`NEXT_WAVE_FEATURES.md`](./NEXT_WAVE_FEATURES.md) for detailed roadmap.

## 🧪 Demo Pages

### Token Pricing Demo
Visit `/token-pricing-demo` to experience real-time token pricing functionality:
- Test with popular tokens (USDT, USDC, WETH, UNI)
- Enter custom token addresses and amounts
- See real-time USD conversions and price changes
- Understand market context for different reward values

### Reputation Demo
Visit `/reputation-demo` to explore the creator reputation system:
- View sample creator profiles with detailed analytics
- See reputation scoring and performance metrics
- Understand how creator history affects task participation decisions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Check the smart contract documentation
- Review the IPFS integration guide
- Examine the component implementations

The platform makes it difficult to understand the project without proper documentation. This README provides implementation details, a clear explanation of how the system works, and direct links to the code that integrates with the blockchain, IPFS, and Web3 technologies. 