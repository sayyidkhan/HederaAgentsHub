# HederaAgentsHub - Web3 UI

Next.js app with WalletConnect v2 integration for Hedera blockchain.

## Features

- ✅ WalletConnect v2 integration
- ✅ Support for HashPack, Blade, and other Hedera wallets
- ✅ Display wallet info (Account ID, Network)
- ✅ Sign messages for authentication
- ✅ View account on HashScan
- ✅ Beautiful UI with Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
cd ui-web3
npm install
```

### 2. Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Update `app/page.tsx` line 28 with your Project ID

See `WALLETCONNECT_SETUP.md` for detailed instructions.

### 3. Start Development Server

```bash
npm run dev
```

App will run on: `http://localhost:3030`

### 4. Install a Hedera Wallet

Download one of these wallets:
- **HashPack**: https://www.hashpack.app/
- **Blade**: https://bladewallet.io/
- **Kabila**: https://kabila.app/

### 5. Connect Wallet

1. Open `http://localhost:3030`
2. Click "Connect with WalletConnect"
3. Scan QR code with mobile wallet OR connect with browser extension
4. Approve connection
5. Your wallet is now connected!

## Usage

### Connect Wallet
- Click "Connect HashPack" button
- Approve in HashPack extension
- See your Account ID, Network, and Topic

### Sign Message
- Click "Sign Test Message"
- Approve in HashPack extension
- Check console for signature details

### View on HashScan
- Click "View on HashScan" to see your account on blockchain explorer

## Integration with API

This UI demonstrates wallet connection. To integrate with the HederaAgentsHub API:

1. **Authenticate:**
```typescript
const timestamp = Date.now();
const message = `Sign in to HederaAgentsHub\\nWallet: ${accountId}\\nTimestamp: ${timestamp}`;
const signature = await hashconnect.signMessage(message);

// Send to API
const response = await fetch('http://localhost:8080/api/auth/wallet', {
  method: 'POST',
  body: JSON.stringify({ walletAddress: accountId, signature, timestamp })
});
const { token } = await response.json();
```

2. **Create Agent:**
```typescript
const response = await fetch('http://localhost:8080/api/agents/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Agent',
    purpose: 'Agent purpose',
    capabilities: ['cap1', 'cap2']
  })
});
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HashConnect** - Hedera wallet connection
- **HashPack** - Hedera wallet

## Project Structure

```
ui-web3/
├── app/
│   ├── page.tsx          # Main page with wallet connection
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
└── README.md            # This file
```

## Environment

- **Development**: `http://localhost:3030`
- **API Server**: `http://localhost:8080`
- **Network**: Hedera Testnet

## Troubleshooting

### HashPack not connecting
- Make sure HashPack extension is installed
- Check that you're on Hedera testnet
- Try refreshing the page

### Signature fails
- Make sure wallet is connected
- Check console for errors
- Try disconnecting and reconnecting

## Next Steps

1. ✅ Connect wallet
2. ⏳ Integrate authentication API
3. ⏳ Add agent creation form
4. ⏳ Display user's agents
5. ⏳ Agent management UI

## Links

- HashPack: https://www.hashpack.app/
- Hedera: https://hedera.com/
- HashScan: https://hashscan.io/testnet
- API Docs: http://localhost:8080/api-docs
