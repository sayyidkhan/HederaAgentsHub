// Simple Node.js test client for the WebSocket server
const WebSocket = require('ws');

console.log('🧪 Testing WebSocket Connection to Hedera Agent...\n');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server\n');
  
  // Test 1: Get account balance
  console.log('📤 Test 1: Requesting account balance...');
  ws.send(JSON.stringify({
    type: 'query',
    message: "What's my balance?"
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  
  console.log('📥 Received response:');
  console.log(`   Type: ${response.type}`);
  console.log(`   Status: ${response.status}`);
  console.log(`   Message: ${response.message}`);
  
  if (response.data) {
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));
  }
  console.log('');
  
  // Close after receiving response
  if (response.type === 'response' || response.type === 'error') {
    console.log('✅ Test completed successfully!');
    console.log('Closing connection...\n');
    ws.close();
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  console.log('\n⚠️  Make sure the server is running:');
  console.log('   npm run websocket:server\n');
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
  process.exit(0);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏱️  Timeout - no response received');
  ws.close();
  process.exit(1);
}, 30000);
