# HederaAgentsHub - Agent-first Digital Economy

**SingHacks 2025 | Hedera Challenge Submission**

A working prototype of an agentic system using ERC-8004 for trustless agent discovery and x402 for secure on-chain payments on Hedera testnet.

🚀 Backend: https://hederahub-production.up.railway.app

---

## 🎯 Product Vision

Build an autonomous agent ecosystem where AI agents can:
- **Discover** other agents through decentralized registries
- **Establish trust** via reputation and validation mechanisms  
- **Execute payments** seamlessly using HTTP-native protocols
- **Interact autonomously** without human intermediaries

**Goal:** Demonstrate a self-sustaining digital economy for AI agents on Hedera testnet.

---

## 🏗️ System Architecture

### Core Components

#### 1. ERC-8004 Protocol Integration
Three on-chain registries deployed on Hedera testnet:

- **Identity Registry** (`0x4c74ebd...5923`)
  - ERC-721 based agent NFTs
  - Stores agent capabilities and metadata
  - Portable, censorship-resistant identifiers

- **Reputation Registry** (`0xc565edc...3e0`)
  - Feedback and rating system (1-5 stars)
  - Trust score calculation with confidence bonuses
  - x402 payment proof integration

- **Validation Registry** (`0x18df085...2da6`)
  - Independent validation requests
  - 5 validation methods (stake-re-execution, zkML, TEE, trusted-judge, multi-sig)
  - Confidence scoring system

#### 2. x402 Payment Protocol
- HTTP-native payment standard
- Real-time, gasless micropayments
- Hosted facilitator: `https://x402-hedera-production.up.railway.app`

#### 3. Agent Framework
- BaseAgent class for autonomous agents
- Service registration and discovery
- Automatic reputation management

---

## 🔧 Technical Stack

**Blockchain:**
- Hedera Testnet (Chain ID: 296)
- JSON-RPC: `https://testnet.hashio.io/api`
- Mirror Node: `https://testnet.mirrornode.hedera.com/api/v1`

**Backend:**
- Node.js 18+
- TypeScript 5.3
- ethers.js 6.10.0
- @hashgraph/sdk 2.64.5

**Contracts:**
- Already deployed on Hedera testnet
- EVM-compatible smart contracts
- ERC-721 standard for agent identities

---

## 📊 Current Status

### ✅ Completed (Phase 1)

**ERC-8004 Integration:**
- ✅ IdentityManager (7 functions)
- ✅ ReputationManager (8 functions)  
- ✅ ValidationManager (8 functions)
- ✅ All 23 functions implemented and tested

**Infrastructure:**
- ✅ Hedera testnet connection verified
- ✅ TypeScript project setup
- ✅ Test suite passing
- ✅ Demo implementations working

### 🚧 In Progress (Phase 2)

**x402 Integration:**
- [ ] Payment client
- [ ] Payment server
- [ ] Facilitator integration
- [ ] Payment verification

**Agent Framework:**
- [ ] BaseAgent class
- [ ] Service registration
- [ ] Autonomous operations
- [ ] Capability matching

### 📋 Planned (Phase 3)

- [ ] CLI tool
- [ ] Demo scenarios
- [ ] A2A transaction examples
- [ ] Documentation & guides

---

## 💡 Key Features

### Trust Scoring
```
Trust Score = (averageRating / 5) × 100

Confidence Bonuses:
- +5% for 10+ reviews
- +5% for 50+ reviews
- Max: 100%
```

### Validation Confidence
```
Confidence = (passedValidations / totalValidations) × 100
```

### Tiered Security Model
- **Low-stake (<$100):** Reputation-based, 50% minimum trust
- **Medium-stake ($100-$1000):** Reputation + validation, 80% confidence
- **High-stake (>$1000):** Multi-sig validation, 95% confidence

---

## 🎯 Use Cases

### 1. Weather Data Service
- Agent provides real-time weather data
- Consumers pay per query via x402
- Reputation builds through feedback
- Validation ensures data accuracy

### 2. Data Analysis Service  
- Agent processes and analyzes data
- Payment linked to task completion
- Trust established through validations
- Autonomous agent-to-agent transactions

### 3. Decentralized Agent Marketplace
- Agents discover each other by capability
- Trust scores guide selection
- Payments executed seamlessly
- Self-sustaining digital economy

---

## 🏆 SingHacks 2025 Criteria

### Technical Completeness
- ✅ All ERC-8004 registries integrated
- ✅ Reputation system functioning
- 🚧 Full x402 payment flow (in progress)
- 🚧 Agent-to-agent transactions (in progress)

### Code Quality
- ✅ TypeScript with full type safety
- ✅ Modular architecture
- ✅ Comprehensive error handling
- ✅ Well-documented functions

### Innovation
- ✅ Novel agent discovery mechanism
- ✅ Tiered security model
- ✅ Trust score with confidence bonuses
- ✅ Payment-linked reputation

### Demo Quality
- ✅ Clear demonstrations
- ✅ Multiple working examples
- ✅ Visible trust building
- 🚧 End-to-end A2A transactions (in progress)

---

## 📁 Project Structure

```
HederaAgentsHub/
├── src/
│   ├── erc8004/          # ERC-8004 Integration
│   │   ├── identity.ts   # Agent registration & discovery
│   │   ├── reputation.ts # Feedback & trust scoring
│   │   └── validation.ts # Independent validations
│   ├── x402/             # Payment integration (coming)
│   ├── agents/           # Agent framework (coming)
│   ├── config/           # Configuration
│   ├── hedera/           # Hedera SDK utilities
│   └── types/            # TypeScript definitions
├── README.md             # This file (PRD)
└── QUICKSTART.md         # How to run
```

---

## 🤝 Team

- **Nasrulhaq Khan** - Full-stack developer
- Building for SingHacks 2025 Hedera Challenge

---

## 📄 License

MIT

---

## 🔗 Resources

- **ERC-8004 Spec:** https://github.com/CoopHive/EIPs/tree/erc-8004
- **x402 Protocol:** https://www.coinbase.com/cloud/discover/dev-foundations/x402
- **Hedera Docs:** https://docs.hedera.com
- **Challenge Info:** https://github.com/SingHacks-2025/hedera

---

## 🚀 Quick Links

- **How to Run:** See [QUICKSTART.md](./QUICKSTART.md)
- **Hedera Explorer:** https://hashscan.io/testnet/
- **x402 Facilitator:** https://x402-hedera-production.up.railway.app/
- **USDC Faucet:** https://faucet.circle.com/

---

Built with ❤️ for SingHacks 2025
