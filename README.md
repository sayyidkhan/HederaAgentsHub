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

### ✅ Completed (Phase 2)

**x402 Integration:**
- ✅ Payment client (X402Client)
- ✅ Payment server (X402Server)
- ✅ Facilitator integration (X402Facilitator)
- ✅ Payment verification (PaymentValidator)
- ✅ Payment tracking and helpers
- ✅ Full payment flow demo

**Agent Framework:**
- ✅ BaseAgent class
- ✅ Service registration
- ✅ Autonomous operations
- ✅ Capability matching
- ✅ WeatherAgent & DataAnalyzerAgent examples

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

### 1. iPhone Marketplace (Featured Demo)
**Complete autonomous agent-to-agent commerce flow**

---

### 🛒 Buyer Agent Flow

**Objective:** Purchase iPhone at ≤ 1000 SGD

**Step 1: Find Sellers using ERC-8004**
- Search for agents with "iPhone" capability
- Query Identity Registry for matching agents
- Retrieve agent metadata and capabilities
- Get list of iPhone retailers

**Step 2: Check Price & Reputation**
- Fetch price from each seller's metadata
- Get reputation score from Reputation Registry
- Compare prices across sellers
- Filter sellers by trust score (min 50%)

**Step 3: Validate Price Within Budget**
- Check if seller price ≤ 1000 SGD
- Apply budget constraints
- Select best seller (highest trust + lowest price)
- Log price comparison

**Step 4: Establish Contract**
- Verify seller credentials
- Check validation history
- Create purchase agreement
- Lock in price and terms

**Step 5: Handshake & Payment**
- Confirm contract with seller
- Generate x402 payment proof
- Sign payment with private key
- Send payment to seller's address
- Submit to x402 facilitator

**Expected Output:**
```
✅ Seller found: Apple Retailer Pro
✅ Price: 999 SGD (within budget)
✅ Trust Score: 95%
✅ Payment sent: x402_123456789
✅ Awaiting fulfillment...
```

---

### 🏪 Seller Agent Flow

**Objective:** Sell iPhone and fulfill order

**Step 1: Agent Receives Payment**
- Detect incoming payment via x402
- Parse payment proof
- Verify signature
- Validate payment amount matches price
- Check payment not expired/duplicate

**Step 2: Verify Payment**
- Extract buyer information
- Confirm product requested (iPhone)
- Validate payment proof structure
- Mark payment as received
- Log transaction details

**Step 3: Contact Supplier**
- Extract delivery information from payment metadata
- Send fulfillment request to supplier API
- Include buyer details (simulated email)
- Request shipment tracking
- Await supplier confirmation

**Step 4: Generate Receipt**
- Create digital receipt with:
  - Transaction ID
  - Product details (iPhone)
  - Price (999 SGD)
  - Payment proof
  - Timestamp
  - Delivery estimate

**Step 5: Send Receipt to Customer**
- Format receipt as JSON/PDF
- Send via email (simulated)
- Include tracking information
- Provide seller contact info
- Log receipt delivery

**Step 6: Update Reputation**
- Wait for buyer feedback
- Record transaction in reputation system
- Build trust score from successful sale
- Increment total sales counter

**Expected Output:**
```
✅ Payment received: 999 SGD
✅ Payment verified from: Smart Buyer
✅ Supplier contacted: Order #12345
✅ Receipt generated: RCP_123456789
✅ Receipt sent to: buyer@email.com
✅ Awaiting buyer feedback...
```

---

### 📊 Complete Transaction Flow

```
┌─────────────┐                           ┌─────────────┐
│ Buyer Agent │                           │Seller Agent │
└──────┬──────┘                           └──────┬──────┘
       │                                         │
       │ 1. Search "iPhone" via ERC-8004        │
       ├────────────────────────────────────────►
       │                                         │
       │ 2. Return sellers (price, trust)       │
       ◄────────────────────────────────────────┤
       │                                         │
       │ 3. Check price ≤ 1000 SGD              │
       │                                         │
       │ 4. Select best seller (95% trust)      │
       │                                         │
       │ 5. Send payment (999 SGD via x402)     │
       ├────────────────────────────────────────►
       │                                         │
       │                              6. Verify payment
       │                              7. Contact supplier
       │                              8. Generate receipt
       │                                         │
       │ 9. Receive receipt via email           │
       ◄────────────────────────────────────────┤
       │                                         │
       │ 10. Submit 5-star feedback             │
       ├────────────────────────────────────────►
       │                                         │
       │                              11. Reputation +1
       │                              12. Trust score +2%
       │                                         │
```

---

### 🔑 Key Features Demonstrated

✅ **ERC-8004 Agent Discovery** - Find sellers by capability  
✅ **Reputation-Based Selection** - Choose trustworthy sellers  
✅ **Budget Constraints** - Automated price validation  
✅ **x402 Payments** - HTTP-native payment protocol  
✅ **Payment Verification** - Cryptographic proof validation  
✅ **Autonomous Fulfillment** - Supplier integration  
✅ **Digital Receipts** - Verifiable transaction records  
✅ **Feedback Loop** - Reputation building from transactions  

### 2. Weather Data Service
- Agent provides real-time weather data
- Consumers pay per query via x402
- Reputation builds through feedback
- Validation ensures data accuracy

### 3. Data Analysis Service  
- Agent processes and analyzes data
- Payment linked to task completion
- Trust established through validations
- Autonomous agent-to-agent transactions

### 4. Decentralized Agent Marketplace
- Agents discover each other by capability
- Trust scores guide selection
- Payments executed seamlessly
- Self-sustaining digital economy

---

## 🏆 SingHacks 2025 Criteria

### Technical Completeness
- ✅ All ERC-8004 registries integrated
- ✅ Reputation system functioning
- ✅ Full x402 payment flow implemented
- ✅ Agent-to-agent transactions working
- ✅ Payment verification & facilitator integration

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
│   ├── server/           # API Server
│   │   └── index.ts      # REST endpoints + Swagger UI
│   ├── agents/           # Agent Framework
│   │   ├── BaseAgent.ts  # Base agent class
│   │   ├── WeatherAgent.ts    # Example agent
│   │   └── DataAnalyzerAgent.ts  # Example agent
│   ├── core/             # Core Modules
│   │   ├── erc8004/      # ERC-8004 Integration
│   │   │   ├── identity.ts   # Agent registration
│   │   │   ├── reputation.ts # Trust scoring
│   │   │   └── validation.ts # Validations
│   │   ├── x402/         # Payment Integration
│   │   │   ├── client.ts     # Payment client
│   │   │   ├── server.ts     # Payment server
│   │   │   ├── facilitator.ts # Facilitator
│   │   │   └── verification.ts # Validators
│   │   ├── config/       # Configuration
│   │   ├── hedera/       # Hedera SDK utilities
│   │   └── types/        # TypeScript definitions
│   └── demos/            # Demos & Tests
├── README.md             # This file (PRD)
├── QUICKSTART.md         # How to run locally
└── DEPLOYMENT.md         # How to deploy
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
