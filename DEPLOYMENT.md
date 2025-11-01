# 🚂 Railway Deployment Guide

Quick guide to deploy HederaAgentsHub to Railway.

---

## Prerequisites

- Railway CLI installed: `npm install -g @railway/cli`
- Railway account: https://railway.app
- `.env` file configured locally

---

## 🚀 Initial Deployment

### 1. Login to Railway
```bash
railway login
```

### 2. Initialize Project
```bash
railway init
```
- Select workspace
- Enter project name (e.g., HederaHub)

### 3. Deploy Code
```bash
railway up
```

Wait for build to complete (~2-3 minutes).

### 4. Link Service
```bash
railway link
```
- Select your project
- Select production environment
- Select service

### 5. Set Environment Variables
```bash
npm run deploy:env
```

If errors occur, set manually:
```bash
railway variables --set "CHAIN_ID=296"
railway variables --set "USDC_TOKEN_ID=0.0.429274"
```

### 6. Get Your URL
```bash
railway domain
```

Example: `https://hederahub-production.up.railway.app`

---

## ✅ Verify Deployment

### Test Health Endpoint
```bash
curl https://your-domain.up.railway.app/health
```

### Open Swagger UI
```
https://your-domain.up.railway.app/api-docs
```

### View Logs
```bash
railway logs
```

---

## 🔄 Redeploy After Changes

### Option 1: Auto-deploy (Recommended)
```bash
git add .
git commit -m "your changes"
git push
```
Railway auto-deploys from GitHub.

### Option 2: Manual deploy
```bash
railway up
```

---

## 📋 Environment Variables

Required variables (12 total):

```env
HEDERA_ACCOUNT_ID=0.0.7174687
HEDERA_PRIVATE_KEY=0x...
HEDERA_NETWORK=testnet
IDENTITY_REGISTRY=0x4c74ebd...
REPUTATION_REGISTRY=0xc565edc...
VALIDATION_REGISTRY=0x18df085...
USDC_TOKEN_ID=0.0.429274
FACILITATOR_URL=https://x402-hedera-production.up.railway.app
JSON_RPC_URL=https://testnet.hashio.io/api
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1
CHAIN_ID=296
NODE_ENV=production
```

### Set via Dashboard
1. Go to https://railway.com
2. Select project → service
3. Click "Variables" tab
4. Add variables
5. Click "Deploy"

---

## 🛠️ Useful Commands

| Command | Description |
|---------|-------------|
| `railway login` | Login to Railway |
| `railway link` | Link to project |
| `railway up` | Deploy code |
| `railway logs` | View logs |
| `railway variables` | View all variables |
| `railway domain` | Get/create domain |
| `railway status` | Check deployment |
| `railway open` | Open in browser |

---

## 🐛 Troubleshooting

### Build Failed
```bash
railway logs --build
```
Check for TypeScript errors or missing dependencies.

### Deployment Failed
```bash
railway logs
```
Check for runtime errors or missing env variables.

### Variables Not Set
Use dashboard instead of CLI:
- Go to project → Variables tab
- Add manually
- Redeploy

### Port Issues
Railway uses `PORT` env variable (auto-set).
Server listens on `process.env.PORT || 3000`.

---

## 💰 Cost

- **Free tier:** $5 credits
- **Usage:** ~$0.50-$1/month for this app
- **After trial:** $1/month minimum

---

## 🔗 Your Deployment

**URL:** `https://hederahub-production.up.railway.app`

**Endpoints:**
- API: `https://hederahub-production.up.railway.app`
- Health: `https://hederahub-production.up.railway.app/health`
- Swagger: `https://hederahub-production.up.railway.app/api-docs`

---

## 📦 Project Files

- `railway.json` - Railway configuration
- `.railwayignore` - Ignore patterns
- `deploy-env.js` - Auto-deploy env vars
- `package.json` - Build & start scripts

---

**That's it!** 🎉

For updates, just `git push` and Railway auto-deploys.
