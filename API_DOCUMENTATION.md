# HederaAgentsHub API Documentation

## Overview

HederaAgentsHub provides a wallet-based authentication system for creating autonomous AI agents on the Hedera blockchain. Users authenticate with their wallet, then create agents that are permanently linked to their wallet on-chain.

## Base URL

- **Local**: `http://localhost:8080`
- **Production**: `https://your-app.up.railway.app`

## Swagger UI

Interactive API documentation: `http://localhost:8080/api-docs`

---

## Authentication Flow

### 1. User Signs Message with Wallet

```typescript
// Frontend (with HashPack)
const timestamp = Date.now();
const message = `Sign in to HederaAgentsHub\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
const signature = await wallet.signMessage(message);
```

### 2. Authenticate and Get JWT Token

```bash
POST /api/auth/wallet
```

**Request:**
```json
{
  "walletAddress": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5",
  "signature": "0x916a01bd6dc10a2e1201a14a86bb785f...",
  "timestamp": 1762046016658
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "walletAddress": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5"
}
```

### 3. Use JWT Token for Authenticated Requests

Store the token and include it in subsequent requests:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

### Health Check

#### GET /
Get API information

**Response:**
```json
{
  "status": "ok",
  "service": "HederaAgentsHub API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "authenticate": "POST /api/auth/wallet",
    "createAgent": "POST /api/agents/create",
    "getAgentMetadata": "POST /api/agents/metadata"
  }
}
```

#### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-02T01:15:00.000Z"
}
```

---

### Authentication

#### POST /api/auth/wallet
Authenticate user wallet and get JWT token

**Request Body:**
```json
{
  "walletAddress": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5",
  "signature": "0x916a01bd6dc10a2e1201a14a86bb785f4f0803b0d454ea9b685b7f28401624786f5d41690d926ba4d8025c1890dcf2a7caebff595f8e5ea855c98c83929466161b",
  "timestamp": 1762046016658
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHgzQzNlNGI4OTkyRmJCOTA3Zjc1YkQ5MDFDZTEzNmU3YkQxOGNGMkI1IiwiaWF0IjoxNzYyMDQ2MDE2LCJleHAiOjE3NjIxMzI0MTZ9...",
  "expiresIn": 86400,
  "walletAddress": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid signature"
}
```

**Message Format:**
```
Sign in to HederaAgentsHub
Wallet: {walletAddress}
Timestamp: {timestamp}
```

**Security:**
- Signature verified using `ethers.verifyMessage()`
- Timestamp must be within 5 minutes
- JWT token expires in 24 hours

---

### Agents

#### POST /api/agents/create
Create a new agent on Hedera blockchain (Authenticated)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone Shopping Assistant",
  "purpose": "You are an intelligent shopping assistant specialized in helping customers find and purchase iPhones",
  "capabilities": [
    "product-search",
    "price-comparison",
    "payment-processing"
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "agentId": "agent-iphone-shopping-assistant-1762046149217-36ylm",
  "name": "iPhone Shopping Assistant",
  "purpose": "You are an intelligent shopping assistant...",
  "capabilities": [
    "product-search",
    "price-comparison",
    "payment-processing"
  ],
  "walletAddress": "0x020fE7c7DDfD37CEa6080D3c64069CcE6279613C",
  "ownerWallet": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5",
  "evmAddress": "0x98d46dda75A216f94bF9784a6665A4E3821Da3D9",
  "privateKey": "0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4",
  "topicId": "0.0.7179926",
  "transactionId": "0.0.7174687@1762046146.190505450"
}
```

**Error Response (401):**
```json
{
  "error": "Authentication required. Please provide a valid token."
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields: name, purpose, capabilities"
}
```

**What Gets Stored on Blockchain:**
```json
{
  "type": "AGENT_REGISTRATION",
  "agentId": "agent-iphone-shopping-assistant-...",
  "agentWallet": "0x020fE7c7DDfD37CEa6080D3c64069CcE6279613C",
  "ownerWallet": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5",
  "name": "iPhone Shopping Assistant",
  "purpose": "You are an intelligent shopping assistant...",
  "capabilities": ["product-search", "price-comparison", "payment-processing"],
  "metadata": {},
  "timestamp": 1762046149217
}
```

---

#### POST /api/agents/metadata
Get metadata for multiple agents by their IDs

**Request Body:**
```json
{
  "agentIds": [
    "agent-iphone-shopping-assistant-1762046149217-36ylm",
    "agent-test-shopping-assistant-1762046028905-81kvw"
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 2,
  "found": 2,
  "notFound": 0,
  "agents": [
    {
      "agentId": "agent-iphone-shopping-assistant-1762046149217-36ylm",
      "name": "iPhone Shopping Assistant",
      "purpose": "You are an intelligent shopping assistant...",
      "capabilities": ["product-search", "price-comparison"],
      "walletAddress": "0x020fE7c7DDfD37CEa6080D3c64069CcE6279613C",
      "ownerWallet": "0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5",
      "topicId": "0.0.7179926",
      "transactionId": "0.0.7174687@1762046146.190505450",
      "topicUrl": "https://hashscan.io/testnet/topic/0.0.7179926",
      "transactionUrl": "https://hashscan.io/testnet/transaction/0.0.7174687@1762046146.190505450",
      "found": true
    }
  ]
}
```

---

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

## Data Flow

1. **User Authentication**
   - User signs message with wallet (HashPack/MetaMask)
   - API verifies signature
   - API issues JWT token (24h expiry)

2. **Agent Creation**
   - User sends JWT token in Authorization header
   - API extracts `ownerWallet` from JWT
   - API generates autonomous wallet for agent
   - API stores agent + ownership link on Hedera blockchain
   - Returns agent details including `ownerWallet`

3. **Ownership Verification**
   - Query Hedera Mirror Node for topic messages
   - Parse messages to find `ownerWallet` field
   - Verify link between user wallet and agent wallet

## Blockchain Verification

### View on HashScan
```
https://hashscan.io/testnet/topic/{topicId}
```

### Query Mirror Node API
```bash
curl https://testnet.mirrornode.hedera.com/api/v1/topics/{topicId}/messages
```

### Verification Script
```bash
npm run dev src/test/test-verify-link.ts
```

---

## Testing

### Test Authentication
```bash
npm run dev src/test/test-auth.ts
```

### Test Agent Creation
```bash
npm run dev src/test/test-create-agent.ts
```

### Verify Blockchain Link
```bash
npm run dev src/test/test-verify-link.ts
```

---

## Security

- ✅ **Signature Verification** - Cryptographic proof of wallet ownership
- ✅ **Timestamp Validation** - Prevents replay attacks (5 min window)
- ✅ **JWT Tokens** - Stateless authentication (24h expiry)
- ✅ **On-Chain Link** - Immutable ownership stored on blockchain
- ✅ **No Private Keys** - User never shares private key with API

---

## Environment Variables

```bash
# Required
JWT_SECRET=your-secret-key-change-in-production

# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.7174687
HEDERA_PRIVATE_KEY=0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4
HEDERA_NETWORK=testnet
AGENT_REGISTRY_TOPIC_ID=0.0.7179926

# Mirror Node
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Invalid or expired token |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production.

---

## Support

For issues or questions, please refer to:
- Swagger UI: http://localhost:8080/api-docs
- GitHub: [Your Repository]
- Documentation: AUTHENTICATION_GUIDE.md
