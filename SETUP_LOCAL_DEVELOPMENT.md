# Local Development Setup

Complete guide to run the full Hedera Agents Hub locally with UI and Backend connected.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL client (optional, for database migrations)
- Supabase account and database (for agent storage)

---

## 🔧 Backend Setup (Port 8080)

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Hedera Credentials
HEDERA_ACCOUNT_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_PRIVATE_KEY="YOUR_PRIVATE_KEY"
HEDERA_NETWORK="testnet"

# ERC-8004 Contract Addresses (Hedera Testnet)
IDENTITY_REGISTRY="0x4c74ebd72921d537159ed2053f46c12a7d8e5923"
REPUTATION_REGISTRY="0xc565edcba77e3abeade40bfd6cf6bf583b3293e0"
VALIDATION_REGISTRY="0x18df085d85c586e9241e0cd121ca422f571c2da6"

# Supabase Configuration
DATABASE_URL="postgresql://postgres.xxxx:your-password@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migration (Optional)

If you want to store agents in Supabase:

```bash
npm run migrate
```

### 4. Build and Start Backend

```bash
npm run build
npm start
```

The backend will be available at:
- 🌐 API: http://localhost:8080
- 📚 Swagger UI: http://localhost:8080/api-docs

---

## 🎨 Frontend Setup (Port 3000)

### 1. Navigate to UI Directory

```bash
cd ui
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure API Endpoint (Optional)

The UI connects to `http://localhost:8080` by default. 

If you need to change it, create `ui/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production deployment:
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### 4. Start Frontend

```bash
pnpm dev
# or
npm run dev
```

The frontend will be available at:
- 🌐 UI: http://localhost:3000

---

## 🧪 Test the Integration

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
# From root directory
npm run build
npm start
```

**Terminal 2 - Frontend:**
```bash
# From ui directory
cd ui
pnpm dev
```

### 2. Create an Agent via UI

1. Open http://localhost:3000
2. Navigate to "Create Agent" or "My Agents"
3. Click "Create New Agent"
4. Fill in the form:
   - **Name:** "Test Shopping Agent"
   - **Purpose:** "Help customers find and purchase products"
   - **Capabilities:** Select at least one capability
5. Click "Create Agent"

The agent will be:
- ✅ Created on Hedera blockchain
- ✅ Stored in Supabase database
- ✅ Displayed in your UI

### 3. Verify Agent Creation

Check the backend logs for:
```
✅ Agent created successfully!
   Agent ID: agent-xxxxx
   Topic ID: 0.0.xxxxx
   Agent data stored in Supabase
```

Check the UI for the new agent in your agents list.

---

## 🔍 API Testing

### Using cURL

```bash
curl -X POST http://localhost:8080/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "purpose": "You are a helpful shopping assistant",
    "capabilities": ["price-comparison", "payment-processing"]
  }'
```

### Using Swagger UI

1. Open http://localhost:8080/api-docs
2. Click on `POST /api/agents/create`
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Kill the process using port 8080
npm run kill:8080

# Or manually on Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Database connection error:**
- Verify DATABASE_URL in `.env` is correct
- Check Supabase project is active
- Test connection: `npm run migrate`

**Hedera API errors:**
- Verify HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY
- Check you have testnet HBAR in your account
- Ensure network is set to "testnet"

### Frontend Issues

**API connection failed:**
- Ensure backend is running on port 8080
- Check NEXT_PUBLIC_API_URL in `.env.local` (if set)
- Check browser console for CORS errors

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

---

## 📦 Production Deployment

### Backend (Railway/Heroku)

Set environment variables:
```
HEDERA_ACCOUNT_ID
HEDERA_PRIVATE_KEY
DATABASE_URL
PORT (will be set automatically)
```

Deploy:
```bash
npm run deploy
```

### Frontend (Vercel/Netlify)

Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
```

Deploy via Git push or CLI.

---

## 🎯 Quick Commands Reference

```bash
# Backend
npm run build          # Build TypeScript
npm start             # Start production server
npm run kill:8080     # Kill port 8080
npm run migrate       # Run database migration

# Frontend (from ui/ directory)
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Full Restart
npm run restart       # Backend: kill, build, start
```

---

## 📚 Additional Resources

- [Hedera Testnet Portal](https://portal.hedera.com)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [API Documentation](http://localhost:8080/api-docs)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)

---

**Happy Building! 🚀**
