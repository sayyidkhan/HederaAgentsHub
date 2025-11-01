# Testing the API Endpoint

## 🚀 Quick Start

### Terminal 1: Start the Server
```bash
npm run build
npm run start
```

You should see:
```
🚀 HederaAgentsHub API Server
📡 Listening on port 8080
🌐 URL: http://localhost:8080
📚 Swagger UI: http://localhost:8080/api-docs
✅ Server ready to accept requests!
```

### Terminal 2: Test the API

#### Option 1: Using cURL
```bash
curl -X POST http://localhost:8080/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "purpose": "You are a test agent",
    "capabilities": ["test-capability"],
    "walletAddress": "0.0.7174687",
    "accountId": "0.0.7174687",
    "privateKey": "0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4",
    "metadata": {
      "version": "1.0.0",
      "model": "gpt-4"
    }
  }'
```

#### Option 2: Using the Test Script
```bash
npm run dev src/demos/test-api-endpoint.ts
```

#### Option 3: Using Swagger UI
1. Open: http://localhost:8080/api-docs
2. Click on `POST /api/agents/create`
3. Click "Try it out"
4. Fill in the request body with:
```json
{
  "name": "Test Agent",
  "purpose": "You are a test agent",
  "capabilities": ["test-capability"],
  "walletAddress": "0.0.7174687",
  "accountId": "0.0.7174687",
  "privateKey": "0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4",
  "metadata": {
    "version": "1.0.0",
    "model": "gpt-4"
  }
}
```
5. Click "Execute"

---

## 📊 Expected Response

```json
{
  "success": true,
  "agentId": "agent-test-agent-1761991234567-abc123",
  "name": "Test Agent",
  "purpose": "You are a test agent",
  "capabilities": ["test-capability"],
  "walletAddress": "0.0.7174687",
  "evmAddress": "0x98d46dda75A216f94bF9784a6665A4E3821Da3D9",
  "privateKey": "0xab9c734fb98648d32634d96e9a1629fe06f676eb7b940b6e877de76ec94275b4",
  "topicId": "0.0.7178395",
  "transactionId": "0.0.7174687@1761991142.149274679"
}
```

---

## ✅ What to Verify

1. ✅ `success: true` - Agent created successfully
2. ✅ `agentId` - Unique agent identifier
3. ✅ `evmAddress` - Derived from private key
4. ✅ `privateKey` - Same as input
5. ✅ `topicId` - Hedera topic where agent is stored
6. ✅ `transactionId` - Blockchain transaction ID

---

## 🔗 View on Blockchain

After creation, view your agent on HashScan:

**Topic:** https://hashscan.io/testnet/topic/{topicId}

**Transaction:** https://hashscan.io/testnet/transaction/{transactionId}

---

## ⚠️ Important Notes

- **Credentials are passed in request body**, not from `.env`
- **One agent per wallet** - walletAddress must be unique
- **Credentials returned in response** - Store them securely
- **Immutable on blockchain** - Agent data cannot be changed
