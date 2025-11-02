# Authentication & Agent Ownership Guide

## Overview

User wallets authenticate and own agents. Agents have their own autonomous wallets but are linked to user wallets on the blockchain.

## Architecture

```
User Wallet (0.0.7174687)
    ↓ authenticates via signature
JWT Token (contains walletAddress)
    ↓ creates agent
Agent Wallet (0.0.8901234) + ownerWallet link stored on blockchain
    ↓ autonomous operations
Hedera Economy
```

## Authentication Flow

### 1. User Signs Message

**Frontend (with HashPack):**
```typescript
import { HashConnect } from 'hashconnect';

// Connect wallet
const hashconnect = new HashConnect();
await hashconnect.init({
  name: "HederaAgentsHub",
  description: "Create AI agents on Hedera"
});
const state = await hashconnect.connect();
const walletAddress = state.pairingData.accountIds[0]; // "0.0.7174687"

// Generate message
const timestamp = Date.now();
const message = `Sign in to HederaAgentsHub\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;

// User signs message (HashPack popup)
const signature = await hashconnect.signMessage(message);
```

### 2. Authenticate with API

```typescript
const response = await fetch('http://localhost:8080/api/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress,
    signature,
    timestamp
  })
});

const { token } = await response.json();
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Store token
localStorage.setItem('authToken', token);
```

### 3. Create Agent (Authenticated)

```typescript
const response = await fetch('http://localhost:8080/api/agents/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← JWT token
  },
  body: JSON.stringify({
    name: "Shopping Assistant",
    purpose: "Help users find and compare products",
    capabilities: ["search", "compare", "recommend"]
  })
});

const agent = await response.json();
```

**Response:**
```json
{
  "success": true,
  "agentId": "agent-shopping-assistant-123",
  "agentWallet": "0.0.8901234",
  "ownerWallet": "0.0.7174687",
  "topicId": "0.0.7178395",
  "transactionId": "0.0.7174687@1730513280.123456789"
}
```

## What Gets Stored on Blockchain

```json
{
  "type": "AGENT_REGISTRATION",
  "agentId": "agent-shopping-assistant-123",
  "agentWallet": "0.0.8901234",
  "ownerWallet": "0.0.7174687",  // ← THE LINK
  "name": "Shopping Assistant",
  "purpose": "Help users find products",
  "capabilities": ["search", "compare"],
  "timestamp": 1730513280000
}
```

## API Endpoints

### POST /api/auth/wallet
Authenticate user's wallet and get JWT token.

**Request:**
```json
{
  "walletAddress": "0.0.7174687",
  "signature": "0x8a7b9c...",
  "timestamp": 1730513280000
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "expiresIn": 86400,
  "walletAddress": "0.0.7174687"
}
```

### POST /api/agents/create
Create agent linked to authenticated user.

**Headers:**
```
Authorization: Bearer eyJhbGci...
```

**Request:**
```json
{
  "name": "Shopping Assistant",
  "purpose": "Help with purchases",
  "capabilities": ["search", "compare"]
}
```

**Response:**
```json
{
  "success": true,
  "agentId": "agent-shopping-assistant-123",
  "agentWallet": "0.0.8901234",
  "ownerWallet": "0.0.7174687",
  "topicId": "0.0.7178395"
}
```

## Security Features

✅ **Signature Verification** - Cryptographic proof of wallet ownership  
✅ **Timestamp Validation** - Prevents replay attacks (5 min window)  
✅ **JWT Tokens** - Stateless authentication (24h expiry)  
✅ **On-Chain Link** - ownerWallet stored immutably on blockchain  
✅ **No Private Keys** - User never shares private key  

## Environment Variables

Add to `.env`:
```bash
JWT_SECRET=your-secret-key-change-in-production
```

## Testing

### 1. Start Server
```bash
npm run build
npm run start
```

### 2. Test Authentication (cURL)
```bash
# Note: You need a real signature from HashPack wallet
curl -X POST http://localhost:8080/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0.0.7174687",
    "signature": "0x...",
    "timestamp": 1730513280000
  }'
```

### 3. Test Agent Creation
```bash
curl -X POST http://localhost:8080/api/agents/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Agent",
    "purpose": "Testing",
    "capabilities": ["test"]
  }'
```

## Next Steps

1. ✅ Accept proposed changes to `hedera-agent-registry.ts`
2. ✅ Build project: `npm run build`
3. ✅ Start server: `npm run start`
4. ✅ Test authentication flow
5. ⏳ Add endpoint to query user's agents: `GET /api/agents/my-agents`
6. ⏳ Add agent control endpoints (fund, withdraw, transfer)

## Files Created/Modified

### New Files:
- `src/services/auth.ts` - Authentication service
- `src/middleware/auth.ts` - JWT middleware
- `AUTHENTICATION_GUIDE.md` - This guide

### Modified Files:
- `src/core/erc8004/hedera-agent-registry.ts` - Added ownerWallet field
- `src/services/create-agent.ts` - Added ownerWallet support
- `src/server/index.ts` - Added auth endpoint + protected create-agent
- `package.json` - Added jsonwebtoken dependency
