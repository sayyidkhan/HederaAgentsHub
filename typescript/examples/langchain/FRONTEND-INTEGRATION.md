# Frontend Integration Guide

Your WebSocket server is now running at `ws://localhost:8080`. Here's how to access it from different frontend frameworks and applications.

## 🌐 Server Status

✅ **Running at:** `ws://localhost:8080`

## 📡 Connection Protocol

### Message Format

**Send to Server:**
```json
{
  "type": "query",
  "message": "Your question or command here"
}
```

**Receive from Server:**
```json
{
  "type": "response",        // or "error" or "status"
  "message": "Response text",
  "status": "success",       // or "error" or "processing"
  "data": { ... }            // Optional additional data
}
```

---

## 🔌 Integration Examples

### 1. React (with hooks)

```jsx
import { useState, useEffect, useRef } from 'react';

function HederaAgentChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket('ws://localhost:8080');
    
    ws.current.onopen = () => {
      console.log('Connected to Hedera Agent');
      setConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response' || data.type === 'error') {
        setMessages(prev => [...prev, {
          type: 'agent',
          text: data.message
        }]);
      }
    };
    
    ws.current.onclose = () => {
      console.log('Disconnected');
      setConnected(false);
    };
    
    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    
    // Add user message to UI
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    // Send to WebSocket
    ws.current.send(JSON.stringify({
      type: 'query',
      message: input
    }));
    
    setInput('');
  };

  return (
    <div>
      <div className="status">
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.type}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
        placeholder="Ask the agent..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default HederaAgentChat;
```

### 2. Vue 3 (Composition API)

```vue
<template>
  <div class="hedera-agent">
    <div class="status">{{ connected ? '🟢 Connected' : '🔴 Disconnected' }}</div>
    
    <div class="messages">
      <div v-for="(msg, i) in messages" :key="i" :class="msg.type">
        {{ msg.text }}
      </div>
    </div>
    
    <input 
      v-model="input"
      @keyup.enter="sendMessage"
      placeholder="Ask the agent..."
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const messages = ref([]);
const input = ref('');
const connected = ref(false);
let ws = null;

onMounted(() => {
  ws = new WebSocket('ws://localhost:8080');
  
  ws.onopen = () => {
    console.log('Connected to Hedera Agent');
    connected.value = true;
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'response' || data.type === 'error') {
      messages.value.push({
        type: 'agent',
        text: data.message
      });
    }
  };
  
  ws.onclose = () => {
    connected.value = false;
  };
});

onUnmounted(() => {
  ws?.close();
});

const sendMessage = () => {
  if (!input.value.trim() || !connected.value) return;
  
  messages.value.push({ type: 'user', text: input.value });
  
  ws.send(JSON.stringify({
    type: 'query',
    message: input.value
  }));
  
  input.value = '';
};
</script>
```

### 3. Next.js (App Router)

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function HederaAgent() {
  const [messages, setMessages] = useState<Array<{type: string, text: string}>>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    
    ws.current.onopen = () => {
      setConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response' || data.type === 'error') {
        setMessages(prev => [...prev, {
          type: 'agent',
          text: data.message
        }]);
      }
    };
    
    ws.current.onclose = () => setConnected(false);
    
    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    ws.current?.send(JSON.stringify({
      type: 'query',
      message: input
    }));
    
    setInput('');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border p-2 rounded"
          placeholder="Ask the agent..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
```

### 4. Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Hedera Agent</title>
</head>
<body>
  <div id="status">Connecting...</div>
  <div id="messages"></div>
  <input id="input" placeholder="Ask the agent..." />
  <button id="send">Send</button>

  <script>
    const ws = new WebSocket('ws://localhost:8080');
    const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('input');
    const statusDiv = document.getElementById('status');

    ws.onopen = () => {
      statusDiv.textContent = '🟢 Connected';
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response' || data.type === 'error') {
        const msg = document.createElement('div');
        msg.textContent = data.message;
        msg.className = 'agent-message';
        messagesDiv.appendChild(msg);
      }
    };

    ws.onclose = () => {
      statusDiv.textContent = '🔴 Disconnected';
    };

    function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      const userMsg = document.createElement('div');
      userMsg.textContent = message;
      userMsg.className = 'user-message';
      messagesDiv.appendChild(userMsg);

      ws.send(JSON.stringify({
        type: 'query',
        message: message
      }));

      input.value = '';
    }

    document.getElementById('send').onclick = sendMessage;
    input.onkeypress = (e) => e.key === 'Enter' && sendMessage();
  </script>
</body>
</html>
```

### 5. Angular (Component)

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

interface Message {
  type: string;
  text: string;
}

@Component({
  selector: 'app-hedera-agent',
  template: `
    <div class="status">{{ connected ? '🟢 Connected' : '🔴 Disconnected' }}</div>
    
    <div class="messages">
      <div *ngFor="let msg of messages" [class]="msg.type">
        {{ msg.text }}
      </div>
    </div>
    
    <input 
      [(ngModel)]="input"
      (keyup.enter)="sendMessage()"
      placeholder="Ask the agent..."
    />
    <button (click)="sendMessage()">Send</button>
  `
})
export class HederaAgentComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  input = '';
  connected = false;
  private ws!: WebSocket;

  ngOnInit() {
    this.ws = new WebSocket('ws://localhost:8080');
    
    this.ws.onopen = () => {
      this.connected = true;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response' || data.type === 'error') {
        this.messages.push({
          type: 'agent',
          text: data.message
        });
      }
    };
    
    this.ws.onclose = () => {
      this.connected = false;
    };
  }

  sendMessage() {
    if (!this.input.trim() || !this.connected) return;
    
    this.messages.push({ type: 'user', text: this.input });
    
    this.ws.send(JSON.stringify({
      type: 'query',
      message: this.input
    }));
    
    this.input = '';
  }

  ngOnDestroy() {
    this.ws?.close();
  }
}
```

### 6. Mobile (React Native)

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

function HederaAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  let ws = null;

  useEffect(() => {
    // Use your computer's local IP instead of localhost
    ws = new WebSocket('ws://192.168.1.100:8080');
    
    ws.onopen = () => {
      setConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response' || data.type === 'error') {
        setMessages(prev => [...prev, {
          type: 'agent',
          text: data.message
        }]);
      }
    };
    
    return () => ws?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    ws.send(JSON.stringify({
      type: 'query',
      message: input
    }));
    
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>{connected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
      
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, i) => (
          <Text key={i} style={{ marginBottom: 10 }}>
            {msg.type === 'user' ? 'You: ' : 'Agent: '}
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Ask the agent..."
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

export default HederaAgent;
```

---

## 🔧 CORS & Network Configuration

### For Remote Access

If you want to access from a different machine on your network:

1. **Find your local IP:**
   ```bash
   ipconfig  # Windows
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. **Connect using:**
   ```javascript
   new WebSocket('ws://192.168.1.100:8080')
   ```

### For Production

Consider using a reverse proxy (nginx, Apache) or deploying to a cloud service with proper SSL:

```javascript
new WebSocket('wss://your-domain.com/hedera-agent')
```

---

## 🎯 Example Queries

Try these with your frontend:

- `"What's my balance?"`
- `"Create a new token called MyToken with symbol MTK"`
- `"Transfer 10 HBAR to account 0.0.1234"`
- `"Create a topic for announcements"`

---

## 🔒 Security Notes

**Development:**
- Currently accessible only on localhost (127.0.0.1)
- No authentication required

**For Production:**
- Add authentication (API keys, JWT tokens)
- Use WSS (WebSocket Secure) with SSL/TLS
- Implement rate limiting
- Add CORS restrictions
- Use environment-specific URLs

---

## 📱 Testing Tools

### Browser Console
```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onopen = () => ws.send(JSON.stringify({type: 'query', message: "What's my balance?"}));
```

### Postman
- Use WebSocket Request type
- URL: `ws://localhost:8080`
- Send message:
  ```json
  {"type": "query", "message": "What's my balance?"}
  ```
