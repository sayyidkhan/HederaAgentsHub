# Supabase Integration Setup

This guide will help you set up Supabase to store agent data from the Hedera Agents Hub.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- A Supabase project created

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details and create the project
4. Wait for the project to be provisioned

## Step 2: Set Up Database Table

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-migration.sql` from the root of this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the migration
5. Verify the `agents` table was created by going to the **Table Editor**

## Step 3: Get Your Supabase Database Connection URL

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to **Connection Pooling** section
3. Copy the **Connection string** for **Transaction Mode**
4. The URL should look like:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Note:** We use the connection pooler (port 6543) instead of direct connection (port 5432) for better performance and connection management.

## Step 4: Configure Environment Variables

Add the following environment variable to your `.env` file in the root of the project:

```env
# Supabase Configuration
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxx:your-password@aws-0-region.pooler.supabase.com:6543/postgres
```

Replace the values with your actual Supabase database connection string from Step 3.

## Step 5: Test the Integration

1. Start your server:
   ```bash
   npm run build
   npm start
   ```

2. Create an agent via the API:
   ```bash
   curl -X POST http://localhost:8080/api/agents/create \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Agent",
       "purpose": "Test agent for Supabase integration",
       "capabilities": ["price-comparison", "payment-processing"]
     }'
   ```

3. Check your Supabase dashboard → **Table Editor** → **agents** table to see the stored agent data

## Database Schema

The `agents` table has the following structure:

| Column          | Type        | Description                                      |
|-----------------|-------------|--------------------------------------------------|
| id              | BIGSERIAL   | Auto-incrementing primary key                    |
| agent_id        | TEXT        | Unique Hedera agent identifier                   |
| name            | TEXT        | Agent name                                       |
| purpose         | TEXT        | Agent purpose/description                        |
| capabilities    | TEXT[]      | Array of agent capabilities                      |
| wallet_address  | TEXT        | Generated wallet address for the agent           |
| evm_address     | TEXT        | EVM compatible address                           |
| topic_id        | TEXT        | Hedera Consensus Service topic ID                |
| created_at      | TIMESTAMP   | Timestamp when agent was created                 |
| updated_at      | TIMESTAMP   | Timestamp when agent was last updated            |

## API Usage

The Supabase service provides the following methods:

### Store Agent
```typescript
await supabaseService.storeAgent({
  agent_id: 'agent-123',
  name: 'My Agent',
  purpose: 'Agent purpose',
  capabilities: ['cap1', 'cap2'],
  wallet_address: '0x...',
  evm_address: '0x...',
  topic_id: '0.0.123456'
});
```

### Get Agent
```typescript
const agent = await supabaseService.getAgent('agent-123');
```

### Get All Agents
```typescript
const agents = await supabaseService.getAllAgents();
```

### Update Agent
```typescript
await supabaseService.updateAgent('agent-123', {
  name: 'Updated Name'
});
```

### Delete Agent
```typescript
await supabaseService.deleteAgent('agent-123');
```

## Troubleshooting

### Error: "Database configuration is missing"
- Make sure you've added `DATABASE_URL` to your `.env` file
- Restart your server after adding the environment variable
- Verify the connection string format is correct

### Error: "relation 'agents' does not exist"
- Run the SQL migration from `supabase-migration.sql` in the Supabase SQL Editor
- Verify the table was created in the Table Editor

### Error: "Connection timeout" or "ECONNREFUSED"
- Check your internet connection
- Verify the DATABASE_URL is correct
- Make sure you're using the connection pooler (port 6543), not direct connection (port 5432)
- Check if your Supabase project is active and not paused

### Agent created on Hedera but not in Supabase
- Check your DATABASE_URL is correct
- Check the server logs for detailed error messages
- Verify your database password is correct
- Test the connection using a PostgreSQL client like `psql` or DBeaver

## Connection Details

This service uses:
- **PostgreSQL driver:** `pg` (node-postgres)
- **Connection pooling:** Enabled (max 20 connections)
- **SSL:** Required for Supabase connections
- **Idle timeout:** 30 seconds
- **Connection timeout:** 2 seconds

## Security Notes

- The `.env` file is gitignored and should never be committed
- Keep your `DATABASE_URL` and database password secure
- Use connection pooling URL (port 6543) for better security and performance
- Row Level Security (RLS) is enabled on the agents table for added protection
- SSL is enforced for all Supabase connections

## Next Steps

- Set up authentication to associate agents with users
- Add more tables for transactions, capabilities, etc.
- Configure real-time subscriptions to listen for agent updates
- Set up Supabase storage for agent avatars or documents
