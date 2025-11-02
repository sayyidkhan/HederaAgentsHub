# WebSocket Tool Calling Agent

This is a WebSocket server that exposes the Hedera Agent Kit tool calling functionality over WebSocket connections.

## 🚀 Quick Start

### 1. Make sure your `.env` file is configured

```env
ACCOUNT_ID=0.0.7179904
PRIVATE_KEY=0x7e9738ef102bb05573a72563d203945f9c6fb4876ba9442a72caddb36681756a
GROQ_API_KEY=your_groq_api_key_here
WS_PORT=8080  # Optional, defaults to 8080
```

### 2. Start the WebSocket server

```bash
npm run websocket:server
```

You should see:
```
🚀 Initializing Hedera Agent...
✅ Agent initialized successfully!
🌐 WebSocket server running on ws://localhost:8080
📡 Waiting for client connections...
```

### 3. Test with the HTML Client

Open `websocket-client.html` in your browser (double-click the file or use a local server).

The client will automatically connect to `ws://localhost:8080` and you can start chatting with the agent!

## 📡 WebSocket API

### Connection

Connect to: `ws://localhost:8080`

### Message Protocol

#### Send a Query

```json
{
  "type": "query",
  "message": "What's my balance?"
}
```

#### Receive Responses

**Success Response:**
```json
{
  "type": "response",
  "message": "Your account balance is 100 HBAR",
  "status": "success",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "type": "error",
  "message": "Error description",
  "status": "error"
}
```

**Status Update:**
```json
{
  "type": "status",
  "message": "Processing your request...",
  "status": "processing"
}
```

## 🛠️ Example Queries

- "What's my balance?"
- "Create a new token called TestToken with symbol TEST"
- "Transfer 5 HBAR to account 0.0.1234"
- "Create a topic for project updates"

## 🔌 Connect from Code

### JavaScript/Node.js

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected!');
  
  // Send a query
  ws.send(JSON.stringify({
    type: 'query',
    message: "What's my balance?"
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  console.log('Response:', response);
});
```

### Python

```python
import websocket
import json

def on_message(ws, message):
    response = json.loads(message)
    print('Response:', response)

def on_open(ws):
    print('Connected!')
    ws.send(json.dumps({
        'type': 'query',
        'message': "What's my balance?"
    }))

ws = websocket.WebSocketApp('ws://localhost:8080',
                           on_message=on_message,
                           on_open=on_open)
ws.run_forever()
```

## 📝 Features

- ✅ Real-time bidirectional communication
- ✅ Multiple concurrent client connections
- ✅ Full access to all Hedera Agent Kit tools
- ✅ Error handling and status updates
- ✅ Session management per client
- ✅ Autonomous transaction execution

## 🔒 Security Notes

- This is a development server - do not expose to the public internet
- All transactions use your Hedera account credentials from `.env`
- The agent runs in `AUTONOMOUS` mode - it will execute transactions automatically
- Consider adding authentication for production use

## 🐛 Troubleshooting

**Connection refused:**
- Make sure the server is running (`npm run websocket:server`)
- Check that port 8080 is not in use by another application

**Agent errors:**
- Verify your Hedera credentials in `.env` are correct
- Ensure you have a valid Groq API key
- Check that you have sufficient HBAR balance for transactions

**No response:**
- Check the server console for error messages
- Ensure your message format matches the protocol above
