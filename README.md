# IPFS File Storage dApp on Rootstock

A decentralized file storage application that allows users to upload files to IPFS and store the resulting IPFS hash on the Rootstock blockchain. Built with Foundry for smart contracts and Next.js with Viem, Wagmi, and RainbowKit for the frontend.

## 🚀 Features

- **Decentralized Storage**: Files are stored on IPFS (InterPlanetary File System)
- **Blockchain Integration**: IPFS hashes are stored on Rootstock blockchain for immutability
- **User-Friendly Interface**: Modern, responsive web interface built with Next.js
- **Wallet Integration**: Connect with various wallets using RainbowKit
- **File Management**: Upload, view, and delete files with full blockchain integration
- **Progress Tracking**: Real-time upload progress and transaction status
- **Multi-Network Support**: Supports Rootstock Mainnet, Testnet, and local development

## 🏗️ Architecture

### Smart Contracts (Foundry)
- **FileStorage.sol**: Main contract for storing IPFS hashes and file metadata
- **Features**:
  - Upload files with IPFS hash, filename, and size
  - Delete files (only by owner)
  - Query user files and file details
  - Prevent duplicate IPFS hash uploads
  - Events for file uploads and deletions

### Frontend (Next.js)
- **Components**:
  - `FileUpload`: Handles file selection and upload to IPFS + blockchain
  - `FileList`: Displays user's uploaded files with management options
- **Libraries**:
  - **Wagmi**: React hooks for Ethereum
  - **RainbowKit**: Wallet connection UI
  - **Viem**: TypeScript interface for Ethereum
  - **Pinata**: IPFS pinning service

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Foundry (for smart contract development)
- Pinata account (for IPFS storage)
- Wallet with RBTC for gas fees

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ipfslatest
```

### 2. Set Up Smart Contracts

```bash
cd contracts

# Install dependencies (if needed)
forge install

# Compile contracts
forge build

# Run tests
forge test
```

### 3. Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` in the frontend directory:

```env
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# WalletConnect Project ID (optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here

# Contract Addresses (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS_LOCALHOST=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS_HARDHAT=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=
NEXT_PUBLIC_CONTRACT_ADDRESS_ROOTSTOCK=
NEXT_PUBLIC_CONTRACT_ADDRESS_ROOTSTOCK_TESTNET=
```

## 🚀 Getting Started

### 1. Set Up Pinata Account

1. Go to [Pinata.cloud](https://pinata.cloud/)
2. Create an account and verify your email
3. Go to API Keys section and create a new key
4. Copy the API Key and Secret Key to your `.env.local` file

### 2. Deploy Smart Contract

#### Local Development (Hardhat Network)

```bash
cd contracts

# Start local node (in another terminal)
anvil

# Deploy to local network
forge create src/FileStorage.sol:FileStorage --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### Rootstock Testnet

```bash
# Deploy to Rootstock Testnet
forge create src/FileStorage.sol:FileStorage \
  --rpc-url https://public-node.testnet.rsk.co \
  --private-key YOUR_PRIVATE_KEY \
  --verify
```

#### Rootstock Mainnet

```bash
# Deploy to Rootstock Mainnet
forge create src/FileStorage.sol:FileStorage \
  --rpc-url https://public-node.rsk.co \
  --private-key YOUR_PRIVATE_KEY \
  --verify
```

### 3. Update Contract Addresses

After deployment, update the contract addresses in your `.env.local` file and in `src/lib/contracts.ts`.

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage

### Uploading Files

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Select File**: Choose a file from your device (max 100MB)
3. **Upload**: Click "Upload to IPFS & Blockchain"
4. **Confirm**: Confirm the transaction in your wallet
5. **Wait**: Wait for the transaction to be confirmed

### Managing Files

- **View Files**: All your uploaded files appear in the "Your Files" section
- **View on IPFS**: Click "View" to open the file in IPFS
- **Copy Hash**: Click "Copy" next to the IPFS hash
- **Delete**: Click "Delete" to remove the file (only you can delete your files)

## 🔧 Development

### Smart Contract Development

```bash
cd contracts

# Compile
forge build

# Test
forge test

# Test with gas report
forge test --gas-report

# Coverage
forge coverage
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Adding New Features

1. **Smart Contract**: Add new functions to `FileStorage.sol`
2. **Frontend**: Update ABI in `src/lib/contracts.ts`
3. **Components**: Create new React components as needed
4. **Testing**: Add tests for new functionality

## 🌐 Network Configuration

### Supported Networks

- **Hardhat**: Local development (Chain ID: 31337)
- **Sepolia**: Ethereum testnet (Chain ID: 11155111)
- **Rootstock Testnet**: RSK testnet (Chain ID: 31)
- **Rootstock Mainnet**: RSK mainnet (Chain ID: 30)
- **Ethereum Mainnet**: (Chain ID: 1)

### Adding New Networks

1. Update `src/lib/wagmi.ts` with new chain configuration
2. Add contract address to `src/lib/contracts.ts`
3. Update environment variables

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **API Keys**: Keep Pinata API keys secure
- **File Validation**: Files are validated before upload
- **Access Control**: Only file owners can delete their files
- **Gas Limits**: Be aware of gas costs on different networks

## 🐛 Troubleshooting

### Common Issues

1. **"Pinata API keys are not configured"**
   - Make sure you've set up your Pinata account and added the keys to `.env.local`

2. **"Transaction failed"**
   - Check if you have enough RBTC for gas fees
   - Ensure you're connected to the correct network

3. **"File upload failed"**
   - Check your internet connection
   - Verify Pinata API keys are correct
   - Ensure file size is under 100MB

4. **"Contract not found"**
   - Make sure you've deployed the contract
   - Verify the contract address in your configuration

### Getting Help

- Check the console for error messages
- Verify your environment variables
- Ensure all dependencies are installed
- Check network connectivity

## 📚 Learn More

- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Rootstock Documentation](https://developers.rsk.co/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Foundry](https://getfoundry.sh/) for smart contract development
- [Next.js](https://nextjs.org/) for the frontend framework
- [Wagmi](https://wagmi.sh/) for Ethereum integration
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection
- [Pinata](https://pinata.cloud/) for IPFS services
- [Rootstock](https://www.rsk.co/) for the blockchain platform

