/**
 * HederaAgentsHub API Server
 * Create agents and wallets on the fly
 * Run with: npm run dev src/server/index.ts
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Import Services
import { createAgent, getAgentMetadata } from '../services';
import { authenticateWallet } from '../services/auth';
import { authenticateToken } from '../middleware/auth';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'HederaAgentsHub API',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'HederaAgentsHub API',
    version: '1.0.0',
    description: 'Create agents and wallets on the fly on Hedera blockchain',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      health: 'GET /health',
      swagger: 'GET /api-docs',
      authenticate: 'POST /api/auth/wallet',
      createAgent: 'POST /api/agents/create',
      getAgentMetadata: 'POST /api/agents/metadata',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// AUTHENTICATION ENDPOINT
// ============================================================================

/**
 * POST /api/auth/wallet
 * Authenticate user's wallet with signature verification
 * Returns JWT token for subsequent authenticated requests
 */
app.post('/api/auth/wallet', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, timestamp } = req.body;

    if (!walletAddress || !signature || !timestamp) {
      return res.status(400).json({
        error: 'Missing required fields: walletAddress, signature, timestamp',
      });
    }

    const response = await authenticateWallet({
      walletAddress,
      signature,
      timestamp,
    });

    if (!response.success) {
      return res.status(401).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// AGENT CREATION ENDPOINT
// ============================================================================

/**
 * POST /api/agents/create
 * Create a new agent on Hedera blockchain with wallet
 * Required: name, purpose, capabilities
 * Optional: ownerWallet (can be provided in body for demo mode)
 */
app.post('/api/agents/create', async (req: Request, res: Response) => {
  try {
    const { name, purpose, capabilities, ownerWallet, accountId, privateKey } = req.body;

    // Validate required fields
    if (!name || !purpose || !capabilities) {
      return res.status(400).json({
        error: 'Missing required fields: name, purpose, capabilities',
      });
    }

    if (ownerWallet) {
      console.log(`\n👤 Owner Wallet: ${ownerWallet}`);
    }
    if (accountId) {
      console.log(`🔑 Using Account: ${accountId}`);
    }
    console.log(`📝 Creating agent...\n`);

    const response = await createAgent({
      name,
      purpose,
      capabilities,
      ownerWallet, // Link agent to owner wallet if provided
      accountId, // Use provided account ID
      privateKey, // Use provided private key
    });

    if (!response.success) {
      return res.status(400).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET AGENT METADATA ENDPOINT
// ============================================================================

/**
 * GET /api/agents/metadata
 * Get all agents owned by a wallet address
 * Query: ?walletAddress=0.0.1234567&accountId=0.0.1234567&privateKey=0x...
 */
app.get('/api/agents/metadata', async (req: Request, res: Response) => {
  try {
    const { walletAddress, accountId, privateKey } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({
        error: 'Missing required query parameter: walletAddress',
      });
    }

    console.log(`\n📋 Fetching agents for wallet: ${walletAddress}`);

    // Use provided credentials or fall back to env
    const { getSharedRegistry } = await import('../services/shared-registry');
    const { hederaConfig } = await import('../core/config/index');
    
    const useAccountId = (accountId as string) || hederaConfig.accountId;
    const usePrivateKey = (privateKey as string) || hederaConfig.privateKey;
    
    const registry = await getSharedRegistry(useAccountId, usePrivateKey);
    
    const agents = await registry.getAgentsByOwner(walletAddress);

    console.log(`   Found ${agents.length} agent(s)`);

    res.json({
      success: true,
      walletAddress,
      count: agents.length,
      agents: agents.map(agent => ({
        agentId: agent.agentId,
        name: agent.name,
        purpose: agent.purpose,
        capabilities: agent.capabilities,
        evmAddress: agent.walletAddress, // Agent's wallet address
        topicId: agent.topicId,
        ownerWallet: agent.ownerWallet,
        createdAt: agent.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('❌ Get agents by owner error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/agents/metadata
 * Get metadata for multiple agents by their IDs
 * Request: { agentIds: ["agent-id-1", "agent-id-2"] }
 */
app.post('/api/agents/metadata', async (req: Request, res: Response) => {
  try {
    console.log('\n📋 Metadata Request Received');
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));

    const { agentIds } = req.body;

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return res.status(400).json({
        error: 'Missing required field: agentIds (array of agent IDs)',
      });
    }

    console.log(`   Agent IDs: ${agentIds.length}`);
    agentIds.forEach((id, idx) => console.log(`     [${idx}] ${id}`));

    const response = await getAgentMetadata({
      agentIds,
    });

    if (!response.success) {
      return res.status(400).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    console.error('❌ Metadata endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});


// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('🚀 HederaAgentsHub API Server');
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log('\n✅ Server ready to accept requests!\n');
});

export default app;
