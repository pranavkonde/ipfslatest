# Deployment Guide

This guide will help you deploy the IPFS File Storage dApp to different networks.

## Prerequisites

1. **Private Key**: You need a private key with RBTC for gas fees
2. **Pinata Account**: Set up at [pinata.cloud](https://pinata.cloud/)
3. **Environment Variables**: Configure your `.env.local` file

## Step 1: Set Up Environment Variables

Create a `.env` file in the `contracts` directory:

```bash
# For deployment
PRIVATE_KEY=your_private_key_here

# For verification (optional)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Step 2: Deploy Smart Contract

### Local Development (Anvil)

```bash
cd contracts

# Start local node
anvil

# In another terminal, deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast
```

### Rootstock Testnet

```bash
cd contracts

# Deploy to Rootstock Testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://public-node.testnet.rsk.co \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Rootstock Mainnet

```bash
cd contracts

# Deploy to Rootstock Mainnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://public-node.rsk.co \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## Step 3: Update Frontend Configuration

After deployment, update the contract addresses:

1. **Update `frontend/src/lib/contracts.ts`**:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     localhost: '0x...', // Your deployed address
     hardhat: '0x...',   // Your deployed address
     sepolia: '0x...',   // Your deployed address
     rootstock: '0x...', // Your deployed address
     'rootstock-testnet': '0x...', // Your deployed address
   } as const;
   ```

2. **Update `frontend/.env.local`**:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS_LOCALHOST=0x...
   NEXT_PUBLIC_CONTRACT_ADDRESS_HARDHAT=0x...
   NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=0x...
   NEXT_PUBLIC_CONTRACT_ADDRESS_ROOTSTOCK=0x...
   NEXT_PUBLIC_CONTRACT_ADDRESS_ROOTSTOCK_TESTNET=0x...
   ```

## Step 4: Set Up Pinata

1. Go to [Pinata.cloud](https://pinata.cloud/)
2. Create an account
3. Go to API Keys and create a new key
4. Update your `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_PINATA_API_KEY=your_api_key
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
   ```

## Step 5: Start the Frontend

```bash
cd frontend
npm run dev
```

## Network-Specific Instructions

### Rootstock Testnet

- **RPC URL**: `https://public-node.testnet.rsk.co`
- **Chain ID**: 31
- **Currency**: tRBTC (Test Smart Bitcoin)
- **Explorer**: [explorer.testnet.rsk.co](https://explorer.testnet.rsk.co)

### Rootstock Mainnet

- **RPC URL**: `https://public-node.rsk.co`
- **Chain ID**: 30
- **Currency**: RBTC (Smart Bitcoin)
- **Explorer**: [explorer.rsk.co](https://explorer.rsk.co)

## Getting Testnet RBTC

For Rootstock Testnet, you can get testnet RBTC from:
- [Rootstock Faucet](https://faucet.rsk.co/)

## Verification

To verify your contract on the block explorer:

```bash
forge verify-contract \
  --chain-id 31 \
  --num-of-optimizations 200 \
  --watch \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  <CONTRACT_ADDRESS> \
  src/FileStorage.sol:FileStorage
```

## Troubleshooting

### Common Issues

1. **"Insufficient funds"**
   - Make sure you have enough RBTC for gas fees

2. **"Invalid private key"**
   - Check your private key format (should start with 0x)

3. **"Contract verification failed"**
   - Make sure the contract was compiled with the same settings
   - Check that the constructor arguments are correct

4. **"RPC error"**
   - Check your RPC URL
   - Ensure you're connected to the internet

### Getting Help

- Check the deployment logs for error messages
- Verify your environment variables
- Ensure you have the latest version of Foundry
- Check network status on [Rootstock status page](https://status.rsk.co/)

## Security Notes

- **Never commit private keys** to version control
- **Use environment variables** for sensitive data
- **Test on testnet first** before deploying to mainnet
- **Keep your private keys secure** and never share them

