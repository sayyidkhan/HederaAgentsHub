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

// Import Agent Services
import { createAgent } from '../services';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
      createAgent: 'POST /api/agents/create',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// AGENT CREATION ENDPOINT
// ============================================================================

/**
 * POST /api/agents/create
 * Create a new agent on Hedera blockchain with wallet
 */
app.post('/api/agents/create', async (req: Request, res: Response) => {
  try {
    const { name, purpose, capabilities, walletAddress, accountId, privateKey, metadata } = req.body;

    if (!name || !purpose || !capabilities || !walletAddress || !accountId || !privateKey) {
      return res.status(400).json({
        error: 'Missing required fields: name, purpose, capabilities, walletAddress, accountId, privateKey',
      });
    }

    const response = await createAgent({
      name,
      purpose,
      capabilities,
      walletAddress,
      accountId,
      privateKey,
      metadata,
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
