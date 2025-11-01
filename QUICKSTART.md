# 🚀 Quick Start Guide

Get HederaAgentsHub running in 5 minutes.

---

## Prerequisites

- Node.js 18+
- Hedera testnet account

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Hedera credentials:

```env
HEDERA_ACCOUNT_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
HEDERA_NETWORK="testnet"
```

---

## 3. Test Connection

```bash
npm run dev src/test-connection.ts
```

Expected output:
```
✅ Configuration valid
✅ Hedera client initialized
✅ Balance query successful
✅ All contract addresses configured
```

---

## 4. Run Demo

```bash
npm run dev src/demo-integrated.ts
```

This demonstrates:
- ✅ Agent registration
- ✅ Feedback submission
- ✅ Trust score calculation
- ✅ Validation requests
- ✅ Confidence scoring

---

## 5. Test Individual Components

### Test Identity Manager
```bash
npm run dev src/test-identity.ts
```

### Test Reputation Manager
```bash
npm run dev src/test-reputation.ts
```

### Test Validation Manager
```bash
npm run dev src/test-validation.ts
```

---

## 6. Build for Production

```bash
npm run build
```

---

## 🎯 What's Next?

- Build agents using the framework
- Integrate x402 payments
- Create custom demos

---

## 🐛 Troubleshooting

### Connection fails
- Check internet connection
- Verify Hedera account is active
- Ensure private key is correct

### Build errors
```bash
npm run clean
npm install
npm run build
```

### Missing .env
```bash
cp .env.example .env
# Edit .env with your credentials
```

---

## 📚 Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript |
| `npm run dev <file>` | Run TypeScript file |
| `npm run clean` | Clean build artifacts |

---

## 🔗 Useful Links

- **Get Hedera Account:** https://portal.hedera.com
- **Get Testnet HBAR:** https://portal.hedera.com (1000 HBAR free)
- **Hedera Explorer:** https://hashscan.io/testnet/
- **x402 Facilitator:** https://x402-hedera-production.up.railway.app/

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Connection test passed
- [ ] Demo runs successfully

---

That's it! You're ready to build agents. 🚀
