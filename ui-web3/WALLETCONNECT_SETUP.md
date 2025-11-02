# WalletConnect Setup Guide

## Get Your WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign up or log in
3. Create a new project
4. Copy your **Project ID**

## Update the Code

In `app/page.tsx`, replace `'wc:YOUR_PROJECT_ID'` with your actual project ID:

```typescript
const connector = new DAppConnector(
  metadata,
  HederaChainId.Testnet,
  'wc:YOUR_ACTUAL_PROJECT_ID_HERE', // ← Replace this
  undefined,
  undefined
);
```

## Supported Wallets

WalletConnect v2 supports:
- **HashPack** - https://www.hashpack.app/
- **Blade Wallet** - https://bladewallet.io/
- **Kabila Wallet** - https://kabila.app/
- Any other Hedera wallet with WalletConnect support

## How It Works

1. User clicks "Connect with WalletConnect"
2. WalletConnect modal opens with QR code
3. User scans QR with mobile wallet OR connects with browser extension
4. Wallet approves connection
5. App receives account ID and can request signatures

## Testing

1. Install HashPack wallet extension
2. Run the app: `npm run dev`
3. Click "Connect with WalletConnect"
4. Approve connection in HashPack
5. See your account ID displayed!

## Integration with API

Once connected, you can:

### 1. Sign Authentication Message

```typescript
const timestamp = Date.now();
const message = `Sign in to HederaAgentsHub\nWallet: ${accountId}\nTimestamp: ${timestamp}`;

// Request signature from wallet
const result = await dAppConnector.signMessage({
  signerAccountId: accountId,
  message: message
});

const signature = result.signature;
```

### 2. Authenticate with API

```typescript
const response = await fetch('http://localhost:8080/api/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: accountId,
    signature: signature,
    timestamp: timestamp
  })
});

const { token } = await response.json();
```

### 3. Create Agent

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

## Troubleshooting

### "Initializing..." never finishes
- Check console for errors
- Make sure you have a valid Project ID
- Check internet connection

### Modal doesn't open
- Make sure WalletConnect dependencies are installed
- Check browser console for errors
- Try refreshing the page

### Wallet doesn't connect
- Make sure wallet is on Hedera Testnet
- Try disconnecting and reconnecting
- Check wallet extension is up to date

## Resources

- WalletConnect Docs: https://docs.walletconnect.com/
- Hedera WalletConnect: https://github.com/hashgraph/hedera-wallet-connect
- HashPack: https://www.hashpack.app/
- API Docs: http://localhost:8080/api-docs
