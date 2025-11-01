# 🔗 Where to Find Your Agents on Hedera Blockchain

## 📍 Agent Storage Architecture

Your agents are stored using **Hedera Consensus Service (HCS)** - a distributed ledger service. Here's how it works:

```
┌─────────────────────────────────────────────────────────┐
│         Your Hedera Account (0.0.7174687)              │
│                                                         │
│  • Holds your HBAR balance                             │
│  • Owns the Agent Registry Topic                       │
│  • Pays for transactions                               │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Creates & Owns
                         ▼
┌─────────────────────────────────────────────────────────┐
│    Agent Registry Topic (0.0.7177753)                  │
│                                                         │
│  • Stores all agent registrations                      │
│  • Immutable audit trail                               │
│  • Consensus-verified messages                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Message 1: iPhone Shopping Assistant            │   │
│  │ ├─ Agent ID: agent-iphone-shopping-...          │   │
│  │ ├─ Name: iPhone Shopping Assistant              │   │
│  │ ├─ Purpose: "You are an intelligent..."         │   │
│  │ ├─ Capabilities: [product-search, ...]          │   │
│  │ └─ TX: 0.0.7174687@1761988275.068866452         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Message 2: iPhone Retailer Pro                   │   │
│  │ ├─ Agent ID: agent-iphone-retailer-pro-...      │   │
│  │ ├─ Name: iPhone Retailer Pro                    │   │
│  │ ├─ Purpose: "You are an authorized..."          │   │
│  │ ├─ Capabilities: [inventory-management, ...]    │   │
│  │ └─ TX: 0.0.7174687@1761988276.168727116         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Message 3: Agent Update                          │   │
│  │ ├─ Type: AGENT_UPDATE                            │   │
│  │ ├─ Agent ID: agent-iphone-shopping-...          │   │
│  │ ├─ Updates: {purpose: "...", metadata: {...}}   │   │
│  │ └─ TX: 0.0.7174687@1761988280.909827447         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 How to View Your Agents on Blockchain

### **Step 1: View the Registry Topic**

**URL:** https://hashscan.io/testnet/topic/0.0.7177753

This shows:
- ✅ Topic ID
- ✅ Admin account (your account)
- ✅ All messages (agent registrations)
- ✅ Consensus timestamps
- ✅ Transaction history

**What you'll see:**
```
Topic 0.0.7177753
├─ Admin: 0.0.7174687
├─ Messages: 3
├─ Created: 2025-11-01
└─ Messages:
   ├─ Message 1: {"type":"AGENT_REGISTRATION","agentId":"agent-iphone-shopping-..."}
   ├─ Message 2: {"type":"AGENT_REGISTRATION","agentId":"agent-iphone-retailer-..."}
   └─ Message 3: {"type":"AGENT_UPDATE","agentId":"agent-iphone-shopping-..."}
```

---

### **Step 2: View Individual Transactions**

Each agent registration creates a transaction. You can view them:

**Agent 1 Transaction:**
```
https://hashscan.io/testnet/transaction/0.0.7174687@1761988275.068866452
```

**Agent 2 Transaction:**
```
https://hashscan.io/testnet/transaction/0.0.7174687@1761988276.168727116
```

**What you'll see:**
- Transaction ID
- Timestamp
- Status (SUCCESS)
- Amount (fee paid)
- Message submitted to topic

---

### **Step 3: View Your Account**

**URL:** https://hashscan.io/testnet/account/0.0.7174687

This shows:
- ✅ Your HBAR balance
- ✅ All transactions you've made
- ✅ Topics you own
- ✅ Transaction history

**Look for:**
- "Topic Created" transactions (Agent Registry Topic)
- "Topic Message Submitted" transactions (Agent registrations)

---

## 📊 Complete Flow

```
1. You create an agent with name and purpose
   ↓
2. Agent Registry Topic is created (0.0.7177753)
   ↓
3. Agent data is submitted as a message to the topic
   ↓
4. Hedera Consensus Service verifies the message
   ↓
5. Message is added to the immutable ledger
   ↓
6. You can view it on HashScan Explorer
```

---

## 🎯 Three Ways to View Your Agents

### **Method 1: View the Registry Topic (Recommended)**
Shows all agents in one place:
```
https://hashscan.io/testnet/topic/0.0.7177753
```

### **Method 2: View Individual Transactions**
Shows each agent registration separately:
```
https://hashscan.io/testnet/transaction/0.0.7174687@1761988275.068866452
```

### **Method 3: View Your Account**
Shows all your activity including agent creation:
```
https://hashscan.io/testnet/account/0.0.7174687
```

---

## 💾 What's Stored on Blockchain

Each agent registration includes:

```json
{
  "type": "AGENT_REGISTRATION",
  "agentId": "agent-iphone-shopping-assistant-1761988280088-2mlbri",
  "name": "iPhone Shopping Assistant",
  "purpose": "You are an intelligent shopping assistant...",
  "capabilities": [
    "product-search",
    "price-comparison",
    "seller-verification",
    "payment-processing",
    "order-tracking",
    "customer-support"
  ],
  "owner": "0.0.7174687",
  "metadata": {
    "version": "1.0.0",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000,
    "category": "e-commerce",
    "language": "en"
  },
  "timestamp": 1761988280088
}
```

---

## ✅ Key Points

- **Agents are NOT stored on your account** - they're stored in a **Topic**
- **Topics are like message queues** - they store immutable messages
- **Each message is consensus-verified** - by Hedera's network
- **All data is public** - anyone can view it on HashScan
- **Fully auditable** - complete history of all changes

---

## 🔗 Your Agent URLs

**Registry Topic (View all agents):**
```
https://hashscan.io/testnet/topic/0.0.7177753
```

**Your Account (View all activity):**
```
https://hashscan.io/testnet/account/0.0.7174687
```

**Agent 1 Registration:**
```
https://hashscan.io/testnet/transaction/0.0.7174687@1761988275.068866452
```

**Agent 2 Registration:**
```
https://hashscan.io/testnet/transaction/0.0.7174687@1761988276.168727116
```

---

## 🎉 Summary

Your agents are **permanently stored on Hedera blockchain** in a **Topic** with:
- ✅ Immutable records
- ✅ Consensus verification
- ✅ Public accessibility
- ✅ Complete audit trail
- ✅ Timestamped messages

**View them anytime on HashScan!** 🚀
