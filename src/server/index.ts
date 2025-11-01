/**
 * HederaAgentsHub API Server
 * HTTP endpoints for agent operations
 * Run with: npm run dev src/server/index.ts
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { ethers } from 'ethers';
import { hederaConfig } from '../core/config/index';

// Import Agent Services (Hedera Blockchain)
import {
  createAgent,
  getAgentById,
  getAgentByWallet,
  listAllAgents,
  searchAgentsByCapability as searchAgentsByCapabilityService,
} from '../services';

// Import ERC-8004 functions
import {
  registerAgent,
  getAgentMetadata,
  getAgentOwner,
  getAgentCount,
  searchAgentsByCapability,
  agentExists,
} from '../core/erc8004/identity';

import {
  submitFeedback,
  getFeedbackForAgent,
  getReputationSummary,
  calculateTrustScore,
  isTrustworthy,
} from '../core/erc8004/reputation';

import {
  requestValidation,
  submitValidation,
  getValidationScore,
  calculateValidationConfidence,
  isValidated,
} from '../core/erc8004/validation';

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
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      health: 'GET /',
      swagger: 'GET /api-docs',
      identity: 'POST /api/agent/register, GET /api/agent/:id',
      reputation: 'POST /api/feedback, GET /api/reputation/:agentId',
      validation: 'POST /api/validation/request, POST /api/validation/submit',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================================
// HEDERA AGENT ENDPOINTS (Blockchain)
// ============================================================================

/**
 * POST /api/agents/create
 * Create a new agent on Hedera blockchain
 */
app.post('/api/agents/create', async (req: Request, res: Response) => {
  try {
    const { name, purpose, capabilities, walletAddress, metadata } = req.body;

    if (!name || !purpose || !capabilities || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields: name, purpose, capabilities, walletAddress',
      });
    }

    const response = await createAgent({
      name,
      purpose,
      capabilities,
      walletAddress,
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

/**
 * GET /api/agents/:agentId
 * Get agent by ID
 */
app.get('/api/agents/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const response = await getAgentById(agentId);

    if (!response.success) {
      return res.status(404).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agents/wallet/:walletAddress
 * Get agent by wallet address
 */
app.get('/api/agents/wallet/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const response = await getAgentByWallet(walletAddress);

    if (!response.success) {
      return res.status(404).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agents
 * List all agents
 */
app.get('/api/agents', async (req: Request, res: Response) => {
  try {
    const response = await listAllAgents();

    if (!response.success) {
      return res.status(500).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agents/search/:capability
 * Search agents by capability
 */
app.get('/api/agents/search/:capability', async (req: Request, res: Response) => {
  try {
    const { capability } = req.params;
    const response = await searchAgentsByCapabilityService(capability);

    if (!response.success) {
      return res.status(500).json({ error: response.error });
    }

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// IDENTITY ENDPOINTS
// ============================================================================

/**
 * POST /api/agent/register
 * Register a new agent
 */
app.post('/api/agent/register', async (req: Request, res: Response) => {
  try {
    const { name, description, capabilities } = req.body;

    if (!name || !description || !capabilities) {
      return res.status(400).json({
        error: 'Missing required fields: name, description, capabilities',
      });
    }

    const agentId = await registerAgent({
      name,
      description,
      capabilities,
      serviceUrl: '',
      price: 0,
      currency: 'USDC',
    });

    res.json({
      success: true,
      agentId,
      message: 'Agent registered successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agent/:id
 * Get agent metadata
 */
app.get('/api/agent/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const metadata = await getAgentMetadata(id);

    if (!metadata) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({
      success: true,
      agentId: id,
      metadata,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agent/:id/owner
 * Get agent owner
 */
app.get('/api/agent/:id/owner', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = await getAgentOwner(id);

    if (!owner) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({
      success: true,
      agentId: id,
      owner,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agents/search?capability=weather
 * Search agents by capability
 */
app.get('/api/agents/search', async (req: Request, res: Response) => {
  try {
    const { capability } = req.query;

    if (!capability) {
      return res.status(400).json({ error: 'Missing capability parameter' });
    }

    const agents = await searchAgentsByCapability(capability as string);

    res.json({
      success: true,
      capability,
      agents,
      count: agents.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agents/count/:address
 * Get agent count for address
 */
app.get('/api/agents/count/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const count = await getAgentCount(address);

    res.json({
      success: true,
      address,
      count,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// REPUTATION ENDPOINTS
// ============================================================================

/**
 * POST /api/feedback
 * Submit feedback for an agent
 */
app.post('/api/feedback', async (req: Request, res: Response) => {
  try {
    const { agentId, rating, comment, paymentProof } = req.body;

    if (!agentId || !rating || !comment) {
      return res.status(400).json({
        error: 'Missing required fields: agentId, rating, comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    const feedbackId = await submitFeedback(
      agentId,
      rating,
      comment,
      paymentProof
    );

    res.json({
      success: true,
      feedbackId,
      message: 'Feedback submitted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reputation/:agentId
 * Get reputation summary
 */
app.get('/api/reputation/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const summary = await getReputationSummary(agentId);

    if (!summary) {
      return res.status(404).json({ error: 'No reputation data found' });
    }

    res.json({
      success: true,
      agentId,
      reputation: summary,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reputation/:agentId/trust
 * Get trust score
 */
app.get('/api/reputation/:agentId/trust', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const trustScore = await calculateTrustScore(agentId);
    const trustworthy = await isTrustworthy(agentId);

    res.json({
      success: true,
      agentId,
      trustScore,
      trustworthy,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/feedback/:agentId
 * Get all feedback for agent
 */
app.get('/api/feedback/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const feedbackIds = await getFeedbackForAgent(agentId);

    res.json({
      success: true,
      agentId,
      feedbackIds,
      count: feedbackIds.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// VALIDATION ENDPOINTS
// ============================================================================

/**
 * POST /api/validation/request
 * Request validation
 */
app.post('/api/validation/request', async (req: Request, res: Response) => {
  try {
    const { agentId, validationType, description, stake } = req.body;

    if (!agentId || !validationType || !description) {
      return res.status(400).json({
        error: 'Missing required fields: agentId, validationType, description',
      });
    }

    const validationId = await requestValidation(
      agentId,
      validationType,
      description,
      stake || 0
    );

    res.json({
      success: true,
      validationId,
      message: 'Validation requested successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/validation/submit
 * Submit validation result
 */
app.post('/api/validation/submit', async (req: Request, res: Response) => {
  try {
    const { validationId, isValid, evidence } = req.body;

    if (!validationId || isValid === undefined || !evidence) {
      return res.status(400).json({
        error: 'Missing required fields: validationId, isValid, evidence',
      });
    }

    await submitValidation(validationId, isValid, evidence);

    res.json({
      success: true,
      validationId,
      message: 'Validation result submitted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/validation/:agentId/score
 * Get validation score
 */
app.get('/api/validation/:agentId/score', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const score = await getValidationScore(agentId);

    if (!score) {
      return res.status(404).json({ error: 'No validation data found' });
    }

    res.json({
      success: true,
      agentId,
      validationScore: score,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/validation/:agentId/confidence
 * Get validation confidence
 */
app.get('/api/validation/:agentId/confidence', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const confidence = await calculateValidationConfidence(agentId);
    const validated = await isValidated(agentId);

    res.json({
      success: true,
      agentId,
      confidence,
      validated,
    });
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
