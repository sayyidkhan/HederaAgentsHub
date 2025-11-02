# ✅ Quick Supabase Setup (2 Minutes)

## Step 1: Create the `agents` Table

1. **Go to your Supabase Dashboard:**
   https://cutzxvtrxplurzsshzub.supabase.co

2. **Click "SQL Editor"** in the left sidebar

3. **Click "New Query"**

4. **Copy and paste this SQL:**

```sql
-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id BIGSERIAL PRIMARY KEY,
  agent_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  wallet_address TEXT NOT NULL,
  evm_address TEXT,
  topic_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development)
CREATE POLICY "Allow all operations" ON agents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

5. **Click "Run"** (or press Cmd+Enter)

6. **You should see:** ✅ Success. No rows returned

---

## Step 2: Test the Connection

```bash
npm run dev src/test/test-supabase-connection.ts
```

You should see:
```
✅ Connection successful!
   Found 0 agent(s) in database
✅ Supabase Integration Test PASSED!
```

---

## Step 3: Create Your First Agent

```bash
npm run build
npm run start
```

Then in another terminal:
```bash
npm run dev src/test/test-create-agent.ts
```

---

## ✨ Done!

Your Supabase is now connected using:
- ✅ Supabase URL (no password needed!)
- ✅ Supabase Anon Key (already in your .env)
- ✅ Simple JavaScript client (no PostgreSQL connection)

### Verify in Supabase Dashboard:
1. Go to **Table Editor**
2. Select **agents** table
3. See your newly created agents!

---

## 🎯 What Changed

**Before:** Used PostgreSQL connection (needed database password)
**Now:** Uses Supabase JavaScript client (just needs URL + anon key)

**Benefits:**
- ✅ No password needed
- ✅ Easier authentication
- ✅ Better error messages
- ✅ Works with Row Level Security
- ✅ Simpler code

---

## 🐛 Troubleshooting

### Error: "Could not find the table 'public.agents'"
**Fix:** Run the SQL in Supabase SQL Editor (Step 1 above)

### Error: "Supabase configuration is missing"
**Fix:** Check your `.env` file has:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://cutzxvtrxplurzsshzub.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
```

### Still not working?
1. Restart your server: `npm run restart`
2. Check Supabase project is active
3. Verify table exists in Table Editor
