# 🚀 Quick Start Guide

Get HederaAgentsHub running locally in 5 minutes.

## Prerequisites

- Node.js 18+
- npm or pnpm
- Your Hedera testnet credentials (Account ID + Private Key)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@hashgraph/sdk` - Hedera blockchain SDK
- `ethers` - Ethereum/EVM interactions
- `dotenv` - Environment variable management
- `commander` - CLI framework
- TypeScript and dev tools

### 2. Configure Environment

Copy the example file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Hedera account details:

```env
HEDERA_ACCOUNT_ID="0.0.7174687"
HEDERA_PRIVATE_KEY="0xab9c734f98648d32634d96e9a1629fe06f676eb7..."
```

**Get these from:** https://portal.hedera.com/dashboard

### 3. Test Connection

Run the connection test to verify everything works:

```bash
npm run dev src/test-connection.ts
```

You should see:
```
✅ Configuration valid
✅ Hedera client initialized
💰 HBAR Balance: 1000 HBAR
✅ All tests passed! You're ready to build.
```

### 4. Build TypeScript

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

## Project Structure

```
src/
├── config/           # Configuration management
├── hedera/           # Hedera SDK utilities
├── types/            # TypeScript type definitions
├── erc8004/          # ERC-8004 integration (coming soon)
├── x402/             # x402 payment integration (coming soon)
├── agents/           # Agent implementations (coming soon)
└── cli/              # CLI commands (coming soon)
```

## Available Commands

```bash
# Development
npm run dev src/test-connection.ts    # Test connection
npm run build                          # Build TypeScript
npm run clean                          # Clean build artifacts

# Testing (when tests are added)
npm run test                           # Run tests
```

## Next Steps

1. ✅ **Connection verified** - You can now interact with Hedera
2. 📝 **Build ERC-8004 SDK** - Implement agent registry interactions
3. 💳 **Add x402 Payments** - Implement payment flows
4. 🤖 **Create Agents** - Build your first agent service
5. 🛠️ **CLI Tool** - Add command-line interface

## Troubleshooting

### Missing environment variables
```
⚠️  Missing environment variables: HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY
```
**Solution:** Make sure `.env` file exists and has your credentials.

### Module not found errors
```
Cannot find module '@hashgraph/sdk'
```
**Solution:** Run `npm install` again.

### Connection failed
```
❌ Connection test failed
```
**Solution:** 
- Verify your Account ID and Private Key are correct
- Check that your account has HBAR balance (should have 1000 from faucet)
- Ensure you're using the testnet network

## Resources

- **Hedera Portal:** https://portal.hedera.com/
- **Hedera Docs:** https://docs.hedera.com/
- **HashScan Explorer:** https://hashscan.io/testnet/
- **ERC-8004 Spec:** https://eips.ethereum.org/EIPS/eip-8004

## Next Phase: Building ERC-8004 Integration

Once you've verified the connection, we'll build:

1. **IdentityManager** - Register and query agents
2. **ReputationManager** - Submit and fetch feedback
3. **ValidationManager** - Request validations

See `README.md` for full architecture details.
