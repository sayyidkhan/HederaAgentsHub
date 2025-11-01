# 📁 Folder Structure

**Clean separation of concerns:** Server, Agents, Core modules, and Demos

---

## 🏗️ Project Structure

```
HederaAgentsHub/
├── src/
│   ├── server/              # 🌐 API Server
│   │   ├── index.ts         # Main API server with REST endpoints
│   │   └── routes/          # Route handlers (future)
│   │
│   ├── agents/              # 🤖 Agent Framework
│   │   ├── BaseAgent.ts     # Base class for all agents
│   │   ├── WeatherAgent.ts  # Example: Weather service agent
│   │   ├── DataAnalyzerAgent.ts  # Example: Data analysis agent
│   │   └── index.ts         # Agent exports
│   │
│   ├── core/                # 🔧 Core Modules (Shared)
│   │   ├── erc8004/         # ERC-8004 Protocol
│   │   │   ├── identity.ts  # Identity Registry
│   │   │   ├── reputation.ts # Reputation Registry
│   │   │   ├── validation.ts # Validation Registry
│   │   │   └── abis/        # Contract ABIs
│   │   ├── config/          # Configuration
│   │   │   └── index.ts     # Hedera config, contract addresses
│   │   ├── hedera/          # Hedera utilities
│   │   │   └── client.ts    # Hedera SDK utilities
│   │   └── types/           # TypeScript types
│   │       └── index.ts     # Shared type definitions
│   │
│   └── demos/               # 📚 Demos & Tests
│       ├── agent-demo.ts    # Agent framework demo
│       ├── demo-integrated.ts # ERC-8004 integrated demo
│       ├── demo-erc8004.ts  # ERC-8004 standalone demo
│       ├── test-connection.ts # Hedera connection test
│       ├── test-identity.ts   # Identity tests
│       ├── test-reputation.ts # Reputation tests
│       └── test-validation.ts # Validation tests
│
├── swagger.yaml            # 📖 API Documentation (OpenAPI 3.0)
├── README.md               # Project overview (PRD style)
├── QUICKSTART.md           # How to run
├── TODO.md                 # Task list
└── FOLDER_STRUCTURE.md     # This file

```

---

## 📦 Module Descriptions

### 🌐 `src/server/`
**API Server**
- REST API with Express
- 17 HTTP endpoints
- Swagger UI integration
- CORS enabled

**Files:**
- `index.ts` - Main server entry point

**Run:**
```bash
npm run dev src/server/index.ts
```

**Access:**
- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

---

### 🤖 `src/agents/`
**Agent Framework**
- BaseAgent class with identity, reputation, validation
- Example agents (Weather, DataAnalyzer)
- Autonomous agent-to-agent interactions

**Files:**
- `BaseAgent.ts` - Foundation class for all agents
- `WeatherAgent.ts` - Weather service provider
- `DataAnalyzerAgent.ts` - Data analysis provider
- `index.ts` - Exports

**Usage:**
```typescript
import { WeatherAgent } from './agents';

const agent = new WeatherAgent();
await agent.start();  // Registers and starts
const weather = await agent.getCurrentWeather('Singapore');
```

**Run Demo:**
```bash
npm run dev src/demos/agent-demo.ts
```

---

### 🔧 `src/core/`
**Core Modules (Shared by Server & Agents)**

#### `core/erc8004/`
ERC-8004 protocol implementation:
- `identity.ts` - 7 functions for agent registration
- `reputation.ts` - 8 functions for feedback & trust
- `validation.ts` - 8 functions for validations
- `abis/` - Contract ABIs

#### `core/config/`
Configuration management:
- Hedera credentials
- Contract addresses
- Network settings

#### `core/hedera/`
Hedera SDK utilities:
- Client initialization
- Account operations
- Balance queries

#### `core/types/`
TypeScript type definitions:
- AgentMetadata
- Feedback
- ReputationScore
- etc.

---

### 📚 `src/demos/`
**Demonstrations & Tests**

| File | Description | Run |
|------|-------------|-----|
| `agent-demo.ts` | Agent framework demo | `npm run dev src/demos/agent-demo.ts` |
| `demo-integrated.ts` | ERC-8004 integrated | `npm run dev src/demos/demo-integrated.ts` |
| `test-connection.ts` | Hedera connection | `npm run dev src/demos/test-connection.ts` |
| `test-identity.ts` | Identity tests | `npm run dev src/demos/test-identity.ts` |
| `test-reputation.ts` | Reputation tests | `npm run dev src/demos/test-reputation.ts` |
| `test-validation.ts` | Validation tests | `npm run dev src/demos/test-validation.ts` |

---

## 🔗 Import Paths

### From Server:
```typescript
// Core modules
import { hederaConfig } from '../core/config/index';
import { registerAgent } from '../core/erc8004/identity';
```

### From Agents:
```typescript
// Core modules
import { hederaConfig } from '../core/config/index';
import { registerAgent } from '../core/erc8004/identity';

// Other agents
import { WeatherAgent } from './WeatherAgent';
```

### From Demos:
```typescript
// Core modules
import { hederaConfig } from '../core/config/index';
import { registerAgent } from '../core/erc8004/identity';

// Agents
import { WeatherAgent } from '../agents';
```

---

## 🎯 Separation of Concerns

### Server (`src/server/`)
- **Purpose:** HTTP API endpoints
- **Responsibilities:** Route handling, request/response, Swagger UI
- **Uses:** Core modules for business logic
- **Doesn't:** Implement business logic directly

### Agents (`src/agents/`)
- **Purpose:** Autonomous agent framework
- **Responsibilities:** Agent behavior, service provision, A2A interactions
- **Uses:** Core modules for identity/reputation/validation
- **Doesn't:** Handle HTTP requests

### Core (`src/core/`)
- **Purpose:** Shared business logic
- **Responsibilities:** ERC-8004 protocol, Hedera SDK, config, types
- **Uses:** Nothing (lowest level)
- **Used by:** Server, Agents, Demos

### Demos (`src/demos/`)
- **Purpose:** Examples and testing
- **Responsibilities:** Demonstrate features, test functionality
- **Uses:** Everything
- **Doesn't:** Get used by anything

---

## 🚀 Running Components

### 1. Start API Server
```bash
npm run dev src/server/index.ts

# Access:
# http://localhost:3000
# http://localhost:3000/api-docs (Swagger)
```

### 2. Run Agent Demo
```bash
npm run dev src/demos/agent-demo.ts

# Shows:
# - Agent registration
# - Service provision
# - Feedback submission
# - Validation workflow
```

### 3. Test ERC-8004
```bash
npm run dev src/demos/demo-integrated.ts

# Tests all 23 ERC-8004 functions
```

### 4. Test Connection
```bash
npm run dev src/demos/test-connection.ts

# Verifies Hedera connection
```

---

## 📊 Build Output

```bash
npm run build

# Creates dist/ folder:
dist/
├── server/
│   └── index.js
├── agents/
│   ├── BaseAgent.js
│   ├── WeatherAgent.js
│   └── DataAnalyzerAgent.js
├── core/
│   ├── erc8004/
│   ├── config/
│   ├── hedera/
│   └── types/
└── demos/
```

---

## ✨ Benefits of This Structure

✅ **Clean Separation** - Server, Agents, Core are independent  
✅ **Reusable Core** - Shared by all components  
✅ **Easy Testing** - Demos isolated from production code  
✅ **Scalable** - Add agents/routes without affecting others  
✅ **Clear Imports** - Know exactly where code comes from  
✅ **Maintainable** - Each folder has single responsibility  

---

## 🎯 Next Steps

### Add New Agent:
```bash
# 1. Create file
touch src/agents/MyAgent.ts

# 2. Extend BaseAgent
# 3. Export from src/agents/index.ts
# 4. Use in demos or server
```

### Add New Endpoint:
```bash
# 1. Add to src/server/index.ts
# 2. Update swagger.yaml
# 3. Test with Swagger UI
```

### Add Core Module:
```bash
# 1. Create in src/core/
# 2. Import in agents/server as needed
# 3. Shared across all components
```

---

## 📖 Documentation

- **README.md** - Project overview & PRD
- **QUICKSTART.md** - How to run
- **TODO.md** - Task list
- **FOLDER_STRUCTURE.md** - This file
- **swagger.yaml** - API documentation

---

**Your project is now well-organized and ready to scale!** 🚀
