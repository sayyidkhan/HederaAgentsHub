-- Create agents table in Supabase
-- Run this SQL in your Supabase SQL Editor to create the agents table

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

-- Create index on agent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Allow read access to all authenticated users" ON agents
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create policy to allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON agents
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create policy to allow update for authenticated users
CREATE POLICY "Allow update for authenticated users" ON agents
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on UPDATE
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE agents IS 'Stores Hedera agent information';
COMMENT ON COLUMN agents.agent_id IS 'Unique identifier for the agent on Hedera blockchain';
COMMENT ON COLUMN agents.wallet_address IS 'Generated wallet address for the agent';
COMMENT ON COLUMN agents.evm_address IS 'EVM compatible address';
COMMENT ON COLUMN agents.topic_id IS 'Hedera Consensus Service topic ID for agent registry';
