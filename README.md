# HederaAgentsHub

**SingHacks 2025 - Hedera Challenge Submission**

Building an Agent-first Digital Economy using ERC-8004 for trustless agent discovery and x402 for secure on-chain payments on Hedera testnet.

---

## 🎯 Project Goal

Build a working prototype of an agentic system that demonstrates how autonomous agents can:
- **Discover** each other through ERC-8004 registries
- **Establish trust** via reputation and validation mechanisms
- **Execute payments** seamlessly using x402 protocol
- **Interact autonomously** in a decentralized digital economy

**Target Blockchain:** Hedera Testnet (EVM-compatible, Chain ID: 296)

---

## 📚 Core Concepts

### ERC-8004: Trustless Agents

**What it is:** A protocol for discovering and trusting agents across organizational boundaries without pre-existing trust relationships.

**Three Core Registries:**

1. **Identity Registry** (`0x4c74ebd72921d537159ed2053f46c12a7d8e5923`)
   - ERC-721 based on-chain identity for agents
   - Provides portable, censorship-resistant identifiers
   - Resolves to agent registration files with capabilities and metadata

2. **Reputation Registry** (`0xc565edcba77e3abeade40bfd6cf6bf583b3293e0`)
   - Standard interface for posting and fetching feedback signals
   - Enables composable reputation systems
   - Supports both on-chain and off-chain scoring algorithms
   - Can incorporate x402 payment proofs in feedback

3. **Validation Registry** (`0x18df085d85c586e9241e0cd121ca422f571c2da6`)
   - Generic hooks for independent validator checks
   - Supports multiple validation methods (staking, zkML, TEE oracles)
   - Tiered security proportional to value at risk

**Trust Models:**
- **Low-stake:** Reputation-based (e.g., ordering pizza)
- **Medium-stake:** Validation via stake-secured re-execution
- **High-stake:** zkML proofs or TEE oracles (e.g., medical diagnosis)

### x402: Internet-Native Payments

**What it is:** An HTTP-native payment protocol built on blockchain, using the standard `402 Payment Required` HTTP status code.

**Key Features:**
- ⚡ Real-time settlements (~200ms)
- 💰 True micropayments (no minimums, no percentage fees)
- 🔓 Permissionless and gasless for clients
- 🔗 Chain and token agnostic
- 🤖 Perfect for AI agent economies

**Protocol Flow:**
1. Client requests resource → receives `402 Payment Required`
2. Client creates payment payload based on requirements
3. Client sends request with `X-PAYMENT` header
4. Facilitator verifies payment signature
5. Resource server fulfills request
6. Facilitator settles payment on-chain
7. Resource server returns result with `X-PAYMENT-RESPONSE` header

**Components:**
- **Client:** Entity paying for resources
- **Resource Server:** Provides services/APIs
- **Facilitator Server:** Handles verification and settlement (gasless for participants)

### Hedera Integration

**Why Hedera:**
- EVM-compatible (use existing Ethereum tools)
- Low, predictable fees
- Fast finality (3-5 seconds)
- Native tokenization (Hedera Token Service)
- Consensus Service for audit trails
- Environmental sustainability

**Key Resources:**
- **JSON-RPC Endpoint:** `https://testnet.hashio.io/api`
- **Mirror Node API:** `https://testnet.mirrornode.hedera.com/api/v1/docs/`
- **Explorer:** `https://hashscan.io/testnet/`
- **Payment Token:** USDC (`0.0.429274`)
- **Network:** Testnet (Chain ID: 296)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CLI + Demo Interface                       │
│              (User/Admin Management Layer)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼────────┐            ┌────────▼────────┐
│   Agent A       │            │   Agent B       │
│  (Service 1)    │◄──x402────►│  (Service 2)    │
│                 │  Payment   │                 │
│ ┌─────────────┐ │            │ ┌─────────────┐ │
│ │Hedera Kit   │ │            │ │Hedera Kit   │ │
│ │- Accounts   │ │            │ │- Accounts   │ │
│ │- Tokens     │ │            │ │- Tokens     │ │
│ │- Contracts  │ │            │ │- Contracts  │ │
│ └─────────────┘ │            │ └─────────────┘ │
│                 │            │                 │
│ ┌─────────────┐ │            │ ┌─────────────┐ │
│ │ERC-8004 SDK │ │            │ │ERC-8004 SDK │ │
│ │- Identity   │ │            │ │- Identity   │ │
│ │- Reputation │ │            │ │- Reputation │ │
│ │- Validation │ │            │ │- Validation │ │
│ └─────────────┘ │            │ └─────────────┘ │
│                 │            │                 │
│ ┌─────────────┐ │            │ ┌─────────────┐ │
│ │x402 Server  │ │            │ │x402 Server  │ │
│ │- Payments   │ │            │ │- Payments   │ │
│ │- Validation │ │            │ │- Validation │ │
│ └─────────────┘ │            │ └─────────────┘ │
└────────┬────────┘            └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │   x402 Facilitator (Hosted)   │
         │  - Verify payment signatures  │
         │  - Settle transactions        │
         │  - Gasless for clients        │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │   Hedera Testnet (Chain 296)  │
         │                               │
         │  ┌─────────────────────────┐  │
         │  │ ERC-8004 Contracts      │  │
         │  │ - Identity Registry     │  │
         │  │ - Reputation Registry   │  │
         │  │ - Validation Registry   │  │
         │  └─────────────────────────┘  │
         │                               │
         │  ┌─────────────────────────┐  │
         │  │ Payment Infrastructure  │  │
         │  │ - USDC Token            │  │
         │  │ - Account Management    │  │
         │  │ - Transaction History   │  │
         │  └─────────────────────────┘  │
         │                               │
         │  ┌─────────────────────────┐  │
         │  │ Consensus Service       │  │
         │  │ - Audit Trails          │  │
         │  │ - Event Logging         │  │
         │  └─────────────────────────┘  │
         └───────────────────────────────┘
```

---

## 🔧 Technical Stack

### Core Dependencies
- **@hashgraph/sdk** - Native Hedera SDK for account/token management
- **hedera-agent-kit** - Official Hedera Agent Kit for agentic workflows
- **ethers** or **viem** - EVM contract interactions
- **@langchain/core** - Optional AI agent framework integration
- **commander** - CLI framework
- **typescript** - Type safety and modern JavaScript features

### Smart Contract Integration
- **ERC-8004 ABIs** - For identity, reputation, and validation registries
- **ERC-20 ABI** - For USDC token interactions
- **Contract addresses** - Deployed on Hedera testnet

### x402 Integration
- **Facilitator Client** - Verify and settle payments
- **Payment Headers** - Standard x402 HTTP headers
- **Signature Verification** - EIP-191 or EIP-712 standards

---

## 📦 Project Structure

```
HederaAgentsHub/
├── src/
│   ├── agents/                  # Agent implementations
│   │   ├── base-agent.ts       # Base class for all agents
│   │   ├── weather-agent.ts    # Example: Weather service
│   │   └── calculator-agent.ts # Example: Calculation service
│   │
│   ├── erc8004/                # ERC-8004 SDK
│   │   ├── identity.ts         # Identity Registry interactions
│   │   ├── reputation.ts       # Reputation Registry interactions
│   │   ├── validation.ts       # Validation Registry interactions
│   │   └── types.ts            # TypeScript types/interfaces
│   │
│   ├── x402/                   # x402 Payment Integration
│   │   ├── client.ts           # Payment client for agents
│   │   ├── server.ts           # Payment server middleware
│   │   ├── facilitator.ts      # Facilitator client wrapper
│   │   └── types.ts            # Payment types
│   │
│   ├── hedera/                 # Hedera-specific utilities
│   │   ├── client.ts           # Hedera client setup
│   │   ├── accounts.ts         # Account management
│   │   └── tokens.ts           # Token operations
│   │
│   └── cli/                    # CLI Tool
│       ├── index.ts            # CLI entry point
│       ├── commands/           # Command implementations
│       │   ├── register.ts
│       │   ├── discover.ts
│       │   ├── call.ts
│       │   ├── feedback.ts
│       │   └── reputation.ts
│       └── utils.ts
│
├── contracts/                  # Smart contract ABIs
│   ├── IdentityRegistry.json
│   ├── ReputationRegistry.json
│   ├── ValidationRegistry.json
│   └── ERC20.json
│
├── examples/                   # Demo scenarios
│   ├── simple-transaction.ts  # Basic A2A payment
│   └── marketplace.ts         # Multi-agent marketplace
│
├── tests/                     # Test suites
│   ├── erc8004.test.ts
│   ├── x402.test.ts
│   └── integration.test.ts
│
├── docs/                      # Documentation
│   ├── SETUP.md              # Setup instructions
│   ├── API.md                # API documentation
│   └── DEMO.md               # Demo walkthrough
│
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── README.md                 # This file
```

---

## 🎯 Key Features to Implement

### 1. ERC-8004 Integration
- ✅ Agent registration with metadata
- ✅ Agent discovery by capability
- ✅ Submit and query reputation feedback
- ✅ Request and verify validations
- ✅ Calculate trust scores
- ✅ Query agent metadata (URIs, capabilities)

### 2. x402 Payment Flow
- ✅ HTTP-native payment requests
- ✅ Payment signature generation
- ✅ Facilitator verification
- ✅ On-chain settlement
- ✅ Payment proof generation
- ✅ Multi-currency support (USDC, HBAR)

### 3. Agent Services
- ✅ Service registration and discovery
- ✅ Capability advertisement
- ✅ Request/response handling
- ✅ Payment verification before service
- ✅ Automatic feedback submission
- ✅ Error handling and retries

### 4. Autonomous A2A Transactions
- ✅ Agent discovers another agent
- ✅ Checks reputation/trust score
- ✅ Makes payment via x402
- ✅ Receives service
- ✅ Submits feedback to ERC-8004
- ✅ Full audit trail

### 5. CLI Tool
```bash
# Agent Management
hedera-agent register --name "MyAgent" --service-url "http://..." --price 0.01
hedera-agent list
hedera-agent info --agent-id 1

# Discovery
hedera-agent discover --capability "weather"
hedera-agent search --min-reputation 4.5

# Transactions
hedera-agent call --agent-id 1 --input "data" --amount 0.01
hedera-agent history --agent-id 1

# Reputation
hedera-agent reputation --agent-id 1
hedera-agent feedback --agent-id 1 --rating 5 --comment "Great service"
```

---

## 🔑 Key Resources & References

### Official Documentation
- **ERC-8004 Spec:** https://eips.ethereum.org/EIPS/eip-8004
- **ERC-8004 Contracts:** https://github.com/erc-8004/erc-8004-contracts
- **x402 Protocol:** https://github.com/coinbase/x402
- **x402 Hedera:** https://github.com/hedera-dev/x402-hedera
- **Hedera Agent Kit:** https://github.com/hashgraph/hedera-agent-kit-js
- **Hedera Docs:** https://docs.hedera.com/

### Hedera Testnet Resources
- **Portal (Account Creation):** https://portal.hedera.com/
- **Faucet (Free HBAR):** https://portal.hedera.com/faucet
- **Playground (Code Testing):** https://portal.hedera.com/playground
- **Explorer:** https://hashscan.io/testnet/
- **Mirror Node API:** https://testnet.mirrornode.hedera.com/api/v1/docs/
- **JSON-RPC:** https://testnet.hashio.io/api

### Deployed Contracts (Hedera Testnet)
- **IdentityRegistry:** `0x4c74ebd72921d537159ed2053f46c12a7d8e5923`
- **ReputationRegistry:** `0xc565edcba77e3abeade40bfd6cf6bf583b3293e0`
- **ValidationRegistry:** `0x18df085d85c586e9241e0cd121ca422f571c2da6`
- **USDC Token:** `0.0.429274`

### x402 Infrastructure
- **Hosted Facilitator:** https://x402-hedera-production.up.railway.app/
- **USDC Faucet:** https://faucet.circle.com/

### Challenge Reference
- **SingHacks 2025 Challenge:** https://github.com/SingHacks-2025/hedera

---

## 📖 Documentation

- **README.md** - This file (full project documentation)
- **QUICKSTART.md** - Quick start guide for local development
- **SETUP_COMPLETE.md** - Setup completion checklist
- **PROGRESS.md** - Detailed progress report and statistics

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- Git
- Basic understanding of blockchain concepts
- Hedera testnet account (we'll create one)

### Setup Steps

1. **Create Hedera Testnet Account**
   - Visit: https://portal.hedera.com/
   - Sign up and create account
   - Note your Account ID (0.0.xxxxx) and Private Key
   - Get free testnet HBAR from faucet

2. **Associate USDC Token**
   - Use Hedera Portal Playground script (provided in docs)
   - Token ID: `0.0.429274`
   - Get testnet USDC from Circle faucet

3. **Clone and Install**
   ```bash
   git clone https://github.com/[your-repo]/HederaAgentsHub.git
   cd HederaAgentsHub
   npm install
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Run Demo**
   ```bash
   npm run demo
   ```

### Environment Variables
```env
# Hedera Credentials
HEDERA_ACCOUNT_ID="0.0.xxxxx"
HEDERA_PRIVATE_KEY="302e..."
HEDERA_NETWORK="testnet"

# ERC-8004 Contract Addresses
IDENTITY_REGISTRY="0x4c74ebd72921d537159ed2053f46c12a7d8e5923"
REPUTATION_REGISTRY="0xc565edcba77e3abeade40bfd6cf6bf583b3293e0"
VALIDATION_REGISTRY="0x18df085d85c586e9241e0cd121ca422f571c2da6"

# Payment Configuration
USDC_TOKEN_ID="0.0.429274"
FACILITATOR_URL="https://x402-hedera-production.up.railway.app"

# Network Configuration
JSON_RPC_URL="https://testnet.hashio.io/api"
MIRROR_NODE_URL="https://testnet.mirrornode.hedera.com/api/v1"
CHAIN_ID="296"
```

---

## 🎬 Demo Scenario

**Autonomous Agent Marketplace**

1. **Agent A (Weather Service)** registers in ERC-8004
   - Advertises weather data capability
   - Sets price: 0.01 USDC per query
   - Initial reputation: 0

2. **Agent B (Data Analyzer)** registers in ERC-8004
   - Advertises data analysis capability
   - Needs weather data for analysis

3. **Discovery Phase**
   - Agent B searches ERC-8004 for "weather" capability
   - Finds Agent A
   - Checks Agent A's reputation (low but acceptable for small payment)

4. **Transaction Phase**
   - Agent B makes x402 payment request to Agent A
   - Agent A verifies payment via facilitator
   - Agent A provides weather data
   - Payment settles on-chain automatically

5. **Reputation Phase**
   - Agent B submits positive feedback to ERC-8004 ReputationRegistry
   - Includes x402 payment proof as evidence
   - Agent A's reputation score increases

6. **Trust Building**
   - Over time, Agent A builds reputation
   - Can charge higher prices
   - Attracts more agent customers
   - Demonstrates working decentralized agent economy

---

## 📊 Current Status & Progress

### ✅ Completed
- **Phase 0: Foundation** - 100% Complete
  - Hedera testnet account created
  - Project structure initialized
  - All dependencies installed
  - Connection verified

- **Phase 1: ERC-8004 SDK** - 100% Complete
  - IdentityManager fully implemented (7 functions)
  - ReputationManager fully implemented (8 functions)
  - ValidationManager fully implemented (8 functions + 5 validation methods)
  - All test scripts created and passing

### 📁 Project Structure (Current)
```
src/
├── config/                    # Configuration management ✅
├── hedera/                    # Hedera SDK utilities ✅
├── types/                     # TypeScript type definitions ✅
├── erc8004/                   # ERC-8004 Integration ✅
│   ├── identity.ts           # IdentityManager ✅
│   ├── reputation.ts         # ReputationManager ✅
│   ├── validation.ts         # ValidationManager ✅
│   └── abis/                 # Contract ABIs ✅
│       ├── IdentityRegistry.json
│       ├── ReputationRegistry.json
│       └── ValidationRegistry.json
├── test-connection.ts        # Connection test ✅
├── test-identity.ts          # IdentityManager test ✅
├── test-reputation.ts        # ReputationManager test ✅
├── test-validation.ts        # ValidationManager test ✅
├── x402/                     # x402 Integration (Coming)
├── agents/                   # Agent Framework (Coming)
└── cli/                      # CLI Tool (Coming)
```

## 📊 Success Metrics

### Technical Completeness
- [x] All ERC-8004 registries integrated ✅
- [ ] Full x402 payment flow working
- [ ] Agent-to-agent transactions successful
- [x] Reputation system functioning ✅
- [ ] CLI tool operational

### Demo Quality
- [ ] Clear end-to-end demonstration
- [ ] Multiple agents interacting
- [ ] Visible trust building over time
- [ ] Payment verification working
- [ ] Audit trail accessible

### Code Quality
- [ ] TypeScript with proper types
- [ ] Error handling and retries
- [ ] Unit tests for core functions
- [ ] Integration tests for flows
- [ ] Documentation for all modules

### Innovation
- [ ] Novel use cases demonstrated
- [ ] Unique agent capabilities
- [ ] Creative trust mechanisms
- [ ] Interesting marketplace dynamics

---

## 📚 ERC-8004 API Reference

### IdentityManager (`src/erc8004/identity.ts`)
```typescript
// Register new agent
const agentId = await registerAgent(metadata: AgentMetadata): Promise<string>

// Get agent information
const metadata = await getAgentMetadata(agentId: string): Promise<AgentMetadata | null>

// Get agent owner
const owner = await getAgentOwner(agentId: string): Promise<string | null>

// Count agents by owner
const count = await getAgentCount(address: string): Promise<number>

// Update agent metadata
await updateAgentMetadata(agentId: string, metadata: AgentMetadata): Promise<void>

// Search agents by capability
const agents = await searchAgentsByCapability(capability: string): Promise<Agent[]>

// Verify agent exists
const exists = await agentExists(agentId: string): Promise<boolean>
```

### ReputationManager (`src/erc8004/reputation.ts`)
```typescript
// Submit feedback for agent
const feedbackId = await submitFeedback(
  agentId: string,
  rating: number,        // 1-5
  comment: string,
  paymentProof?: string
): Promise<string>

// Get all feedback for agent
const feedbackIds = await getFeedbackForAgent(agentId: string): Promise<string[]>

// Get feedback details
const feedback = await getFeedback(feedbackId: string): Promise<Feedback | null>

// Get reputation summary
const summary = await getReputationSummary(agentId: string): Promise<ReputationScore | null>

// Calculate trust score (0-100)
const trustScore = await calculateTrustScore(agentId: string): Promise<number>

// Check if agent is trustworthy
const isTrusted = await isTrustworthy(agentId: string, minScore?: number): Promise<boolean>

// Revoke feedback
await revokeFeedback(feedbackId: string): Promise<void>

// Respond to feedback
await respondToFeedback(feedbackId: string, response: string): Promise<void>
```

### ValidationManager (`src/erc8004/validation.ts`)
```typescript
// Request validation
const validationId = await requestValidation(
  agentId: string,
  validationType: string,  // "stake-re-execution", "zkml-proof", etc.
  description: string,
  stake?: number
): Promise<string>

// Submit validation result
await submitValidation(
  validationId: string,
  isValid: boolean,
  evidence: string
): Promise<void>

// Get validation details
const validation = await getValidation(validationId: string): Promise<Validation | null>

// Get all validations for agent
const validationIds = await getValidationsForAgent(agentId: string): Promise<string[]>

// Get validation score
const score = await getValidationScore(agentId: string): Promise<ValidationScore | null>

// Calculate confidence (0-100)
const confidence = await calculateValidationConfidence(agentId: string): Promise<number>

// Check if agent is validated
const isValid = await isValidated(agentId: string, minConfidence?: number): Promise<boolean>

// Cancel validation
await cancelValidation(validationId: string): Promise<void>

// Get supported validation types
const types = getSupportedValidationTypes(): string[]

// Validate type
const isValidType = isValidValidationType(type: string): boolean
```

---

## 🛣️ Implementation Roadmap

### Phase 0: Foundation ✅ COMPLETED
- [x] Research and document learnings ✅
- [x] Get Hedera testnet credentials ✅
- [x] Setup project structure ✅
- [x] Install dependencies ✅
- [x] Create test connection script ✅

### Phase 1: ERC-8004 SDK ✅ COMPLETED
- [x] Implement IdentityManager ✅
  - `registerAgent()` - Register agents with metadata
  - `getAgentMetadata()` - Retrieve agent information
  - `getAgentOwner()` - Get agent owner address
  - `getAgentCount()` - Count agents by owner
  - `updateAgentMetadata()` - Update agent info
  - `agentExists()` - Verify agent exists
  - `searchAgentsByCapability()` - Search agents by capability

- [x] Implement ReputationManager ✅
  - `submitFeedback()` - Submit 1-5 star ratings
  - `getFeedbackForAgent()` - Get all feedback for agent
  - `getFeedback()` - Get detailed feedback
  - `getReputationSummary()` - Get reputation statistics
  - `calculateTrustScore()` - Calculate 0-100 trust score
  - `isTrustworthy()` - Check trust threshold
  - `revokeFeedback()` - Remove feedback
  - `respondToFeedback()` - Agent can respond

- [x] Implement ValidationManager ✅
  - `requestValidation()` - Request independent validations
  - `submitValidation()` - Submit validation results
  - `getValidation()` - Get validation details
  - `getValidationsForAgent()` - Get all validations
  - `getValidationScore()` - Get validation statistics
  - `calculateValidationConfidence()` - Calculate 0-100 confidence
  - `isValidated()` - Check validation threshold
  - `cancelValidation()` - Cancel pending validation
  - Support for 5 validation methods (stake-re-execution, zkml, tee-oracle, trusted-judge, multi-sig)

- [x] Write test scripts ✅
  - `test-connection.ts` - Verify Hedera setup
  - `test-identity.ts` - Test IdentityManager
  - `test-reputation.ts` - Test ReputationManager
  - `test-validation.ts` - Test ValidationManager

### Phase 2: x402 Integration (Days 2-3)
- [ ] Implement payment client
- [ ] Implement payment server
- [ ] Integrate with facilitator
- [ ] Test payment flows

### Phase 3: Agent Framework (Days 3-4)
- [ ] Create BaseAgent class
- [ ] Implement example agents
- [ ] Add service discovery
- [ ] Add capability matching

### Phase 4: A2A Transactions (Days 4-5)
- [ ] Implement agent-to-agent discovery
- [ ] Add autonomous payment flow
- [ ] Add feedback loop
- [ ] Test complete cycle

### Phase 5: CLI & Demo (Days 5-6)
- [ ] Build CLI commands
- [ ] Create demo scenarios
- [ ] Add visualization/logging
- [ ] Write documentation

### Phase 6: Polish & Present (Day 7)
- [ ] Final testing
- [ ] Bug fixes
- [ ] Demo video
- [ ] Presentation preparation

---

## 🤝 Contributing

This is a hackathon project for SingHacks 2025. 

---

## 📄 License

MIT

---

## 👥 Team

[Your team information here]

---

## 🙏 Acknowledgments

- **Hedera Team** for the agent kit and x402 implementation
- **ERC-8004 Team** for the trustless agent protocol
- **Coinbase** for the x402 standard
- **SingHacks 2025** for hosting the challenge