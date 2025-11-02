# Deploy to Railway

## 🚀 Quick Start

### **Step 1: Install Railway CLI**

```bash
npm i -g @railway/cli
```

### **Step 2: Login to Railway**

```bash
railway login
```

This will open your browser to authenticate with Railway.

### **Step 3: Create a New Project**

```bash
railway init
```

Follow the prompts to create a new project.

### **Step 4: Set Environment Variables**

```bash
railway variables set HEDERA_ACCOUNT_ID="0.0.7174687"
railway variables set HEDERA_PRIVATE_KEY="0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4"
railway variables set HEDERA_NETWORK="testnet"
railway variables set IDENTITY_REGISTRY="0x4c74ebd72921d537159ed2053f46c12a7d8e5923"
railway variables set REPUTATION_REGISTRY="0xc565edcba77e3abeade40bfd6cf6bf583b3293e0"
railway variables set VALIDATION_REGISTRY="0x18df085d85c586e9241e0cd121ca422f571c2da6"
railway variables set USDC_TOKEN_ID="0.0.429274"
railway variables set FACILITATOR_URL="https://x402-hedera-production.up.railway.app"
railway variables set JSON_RPC_URL="https://testnet.hashio.io/api"
railway variables set MIRROR_NODE_URL="https://testnet.mirrornode.hedera.com/api/v1"
railway variables set CHAIN_ID="296"
```

### **Step 5: Deploy**

```bash
railway up
```

Or use the npm script:

```bash
npm run deploy
```

---

## 📊 Deployment Configuration

**File:** `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🔐 Environment Variables

**Required Variables:**

```
HEDERA_ACCOUNT_ID=0.0.7174687
HEDERA_PRIVATE_KEY=0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4
HEDERA_NETWORK=testnet
IDENTITY_REGISTRY=0x4c74ebd72921d537159ed2053f46c12a7d8e5923
REPUTATION_REGISTRY=0xc565edcba77e3abeade40bfd6cf6bf583b3293e0
VALIDATION_REGISTRY=0x18df085d85c586e9241e0cd121ca422f571c2da6
USDC_TOKEN_ID=0.0.429274
FACILITATOR_URL=https://x402-hedera-production.up.railway.app
JSON_RPC_URL=https://testnet.hashio.io/api
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1
CHAIN_ID=296
```

---

## ✅ Verify Deployment

After deployment, Railway will provide you with a URL like:

```
https://your-project.railway.app
```

Test the API:

```bash
curl https://your-project.railway.app/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-11-01T06:00:00.000Z"
}
```

---

## 📚 API Documentation

Once deployed, access Swagger UI:

```
https://your-project.railway.app/api-docs
```

---

## 🔍 View Logs

```bash
railway logs
```

---

## 🛑 Stop Deployment

```bash
railway down
```

---

## 💡 Tips

1. **Keep private keys secure** - Use Railway's environment variables, never commit to git
2. **Monitor logs** - Check `railway logs` for any errors
3. **Test locally first** - Run `npm run dev src/server/index.ts` before deploying
4. **Use staging** - Deploy to a staging environment first

---

## 🎉 You're Live!

Your HederaAgentsHub API is now running on Railway! 🚀
