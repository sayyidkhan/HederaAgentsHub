# Supabase Integration Guide

## ✅ Current Status

Your Supabase integration is **already coded** and ready to use! Here's what's set up:

### Files Configured:
- ✅ `src/services/supabase.ts` - Database service with CRUD operations
- ✅ `src/services/create-agent.ts` - Stores agents in Supabase after Hedera creation
- ✅ `src/core/config/index.ts` - Reads `DATABASE_URL` from environment
- ✅ `supabase-migration.sql` - Database schema ready to run
- ✅ `package.json` - Dependencies installed (`pg`, `@supabase/supabase-js`)

---

## 🚀 Setup Steps

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://cutzxvtrxplurzsshzub.supabase.co
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection Pooling**
4. Copy the **Connection String** (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your actual database password

Your connection string should look like:
```
postgresql://postgres.otptzcllglfqxtwdqtvc:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
```

### Step 2: Update Your .env File

Your `.env` file already has the Supabase variables. Just update the `DATABASE_URL`:

```bash
# Supabase Configuration (for storing agent data)
DATABASE_URL="postgresql://postgres.otptzcllglfqxtwdqtvc:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

# Supabase Configuration (for authentication)
NEXT_PUBLIC_SUPABASE_URL="https://cutzxvtrxplurzsshzub.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1dHp4dnRyeHBsdXJ6c3NoenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDE0NTYsImV4cCI6MjA3NjM3NzQ1Nn0.Sz9pae9iuIBQzrcVzG_BrF4QJatX9Wk0CkBUZYYt-Qc"
```

### Step 3: Run the Database Migration

You have 3 options:

#### Option A: Using the Migration Script (Recommended)
```bash
npm run migrate
```

#### Option B: Using Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase-migration.sql`
5. Paste and click **Run**

#### Option C: Manual Script Execution
```bash
# Mac/Linux
./run-migration.sh

# Windows
run-migration.bat
```

### Step 4: Test the Connection

```bash
npm run test:db
```

This will verify:
- ✅ Database connection works
- ✅ `agents` table exists
- ✅ Can insert/read data

### Step 5: Build and Start Your Server

```bash
npm run build
npm run start
```

---

## 🎯 How It Works

### When You Create an Agent:

1. **Agent is created on Hedera blockchain** (immutable storage)
2. **Agent data is stored in Supabase** (for fast queries)

```typescript
// In src/services/create-agent.ts (lines 76-91)
try {
  await supabaseService.storeAgent({
    agent_id: registeredAgent.agentId,
    name: registeredAgent.name,
    purpose: registeredAgent.purpose,
    capabilities: registeredAgent.capabilities,
    wallet_address: registeredAgent.walletAddress,
    evm_address: evmAddress,
    topic_id: registeredAgent.topicId,
  });
  console.log('✅ Agent data stored in Supabase');
} catch (supabaseError) {
  console.warn('⚠️  Failed to store agent in Supabase');
  // Agent still created on Hedera, just not in database
}
```

### Available Database Operations:

```typescript
import { supabaseService } from './services/supabase';

// Store agent
await supabaseService.storeAgent(agentData);

// Get agent by ID
const agent = await supabaseService.getAgent('agent-id-123');

// Get all agents
const agents = await supabaseService.getAllAgents();

// Update agent
await supabaseService.updateAgent('agent-id-123', { name: 'New Name' });

// Delete agent
await supabaseService.deleteAgent('agent-id-123');
```

---

## 📊 Database Schema

```sql
CREATE TABLE agents (
  id BIGSERIAL PRIMARY KEY,
  agent_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  capabilities TEXT[] NOT NULL,
  wallet_address TEXT NOT NULL,
  evm_address TEXT,
  topic_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔍 Verify Integration

### Test Creating an Agent:

```bash
npm run dev src/test/test-create-agent.ts
```

You should see:
```
✅ Agent created successfully!
   Agent ID: agent-...
   Topic ID: 0.0.7179380
   Agent data stored in Supabase
```

### Check Supabase Dashboard:

1. Go to **Table Editor** in Supabase
2. Select the `agents` table
3. You should see your newly created agent!

---

## 🐛 Troubleshooting

### Error: "Database configuration is missing"
- Make sure `DATABASE_URL` is set in your `.env` file
- Restart your server after updating `.env`

### Error: "relation 'agents' does not exist"
- Run the migration: `npm run migrate`
- Or manually run `supabase-migration.sql` in SQL Editor

### Error: "password authentication failed"
- Double-check your database password in `DATABASE_URL`
- Get the correct password from Supabase Dashboard → Settings → Database

### Agent created on Hedera but not in Supabase
- This is expected behavior (fail-safe)
- Check console for Supabase error message
- Agent is still valid and stored on blockchain

---

## 🎉 You're All Set!

Your Supabase integration is complete. Every agent created will now be:
1. ✅ Stored on Hedera blockchain (immutable)
2. ✅ Stored in Supabase (fast queries)
3. ✅ Accessible via API endpoints

### Next Steps:
- Create agents via API: `POST http://localhost:8080/api/agents/create`
- View agents in Supabase Dashboard
- Query agents using `supabaseService` methods
