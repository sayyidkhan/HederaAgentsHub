import { WebSocketServer, WebSocket } from 'ws';
import { AgentMode, HederaLangchainToolkit } from 'hedera-agent-kit';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { Client, PrivateKey } from '@hashgraph/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

// Message types
interface ClientMessage {
  type: 'query';
  message: string;
  sessionId?: string;
}

interface ServerResponse {
  type: 'response' | 'error' | 'status';
  message: string;
  status: 'success' | 'error' | 'processing';
  data?: any;
}

// Initialize the agent once
let agentExecutor: AgentExecutor;

async function initializeAgent(): Promise<void> {
  console.log('🚀 Initializing Hedera Agent...');

  // Initialize Groq LLM
  const llm = new ChatGroq({ 
    model: 'llama-3.3-70b-versatile',
    temperature: 0
  });

  // Hedera client setup
  const client = Client.forTestnet().setOperator(
    process.env.ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!)
  );

  // Create Hedera toolkit
  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      tools: [], // empty array loads all tools
      context: {
        mode: AgentMode.AUTONOMOUS,
      },
      plugins: [],
    },
  });

  // Create prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful Hedera blockchain assistant. You can help users with their Hedera accounts, tokens, and transactions.'],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  // Get tools
  const tools = hederaAgentToolkit.getTools();

  // Create agent
  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  // Create executor
  agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  console.log('✅ Agent initialized successfully!');
}

// Handle client messages
async function handleMessage(ws: WebSocket, data: string): Promise<void> {
  try {
    const clientMessage: ClientMessage = JSON.parse(data);

    if (clientMessage.type !== 'query') {
      sendResponse(ws, {
        type: 'error',
        message: 'Invalid message type',
        status: 'error',
      });
      return;
    }

    // Send processing status
    sendResponse(ws, {
      type: 'status',
      message: 'Processing your request...',
      status: 'processing',
    });

    // Execute agent query
    const result = await agentExecutor.invoke({
      input: clientMessage.message,
    });

    // Send success response
    sendResponse(ws, {
      type: 'response',
      message: result.output,
      status: 'success',
      data: result,
    });

  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse(ws, {
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 'error',
    });
  }
}

// Send response to client
function sendResponse(ws: WebSocket, response: ServerResponse): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(response));
  }
}

// Start WebSocket server
async function startServer(): Promise<void> {
  // Initialize the agent first
  await initializeAgent();

  const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
  const wss = new WebSocketServer({ port: PORT });

  console.log(`🌐 WebSocket server running on ws://localhost:${PORT}`);
  console.log('📡 Waiting for client connections...\n');

  wss.on('connection', (ws: WebSocket) => {
    const clientId = Math.random().toString(36).substring(7);
    console.log(`✅ Client connected: ${clientId}`);

    // Send welcome message
    sendResponse(ws, {
      type: 'status',
      message: 'Connected to Hedera Agent WebSocket Server',
      status: 'success',
      data: { clientId },
    });

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      const message = data.toString();
      console.log(`📨 Received from ${clientId}:`, message);
      handleMessage(ws, message);
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log(`❌ Client disconnected: ${clientId}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`⚠️  Error with client ${clientId}:`, error);
    });
  });

  // Handle server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
