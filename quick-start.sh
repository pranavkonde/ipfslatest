#!/bin/bash

# IPFS File Storage dApp - Quick Start Script
# This script helps you get started quickly with the dApp

echo "🚀 IPFS File Storage dApp - Quick Start"
echo "======================================"
echo ""

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        echo "   Visit: $2"
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "🔍 Checking prerequisites..."
check_command "node" "https://nodejs.org/"
check_command "npm" "https://nodejs.org/"
check_command "forge" "https://book.getfoundry.sh/getting-started/installation"

echo ""
echo "📦 Setting up smart contracts..."

# Set up contracts
cd contracts
echo "Installing Foundry dependencies..."
forge install

echo "Building contracts..."
forge build

echo "Running tests..."
forge test

echo ""
echo "📦 Setting up frontend..."

# Set up frontend
cd ../frontend
echo "Installing npm dependencies..."
npm install

echo "Creating environment file..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "✅ Created .env.local file"
    echo "⚠️  Please update .env.local with your Pinata API keys"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get Pinata API keys from https://pinata.cloud/"
echo "2. Update frontend/.env.local with your API keys"
echo "3. Deploy the smart contract (see DEPLOYMENT.md)"
echo "4. Update contract addresses in the frontend"
echo "5. Run 'npm run dev' in the frontend directory"
echo ""
echo "📚 For detailed instructions, see README.md and DEPLOYMENT.md"
echo ""
echo "Happy coding! 🎊"

