# 📦 NPM Scripts Reference

Complete guide to all available npm scripts in this project.

---

## 🔨 Build & Development

### `npm run build`
**Description:** Compile TypeScript to JavaScript  
**Command:** `tsc`  
**Output:** Creates `dist/` folder with compiled JavaScript files  
**When to use:** Before deploying or running production code

```bash
npm run build
```

---

### `npm run dev <file>`
**Description:** Run TypeScript files directly without building  
**Command:** `ts-node`  
**When to use:** Development and testing individual files

**Examples:**
```bash
# Run server in dev mode
npm run dev src/server/index.ts

# Test agent creation
npm run dev src/test/test-create-agent.ts

# Test metadata endpoint
npm run dev src/test/test-metadata-endpoint.ts

# Test Supabase connection
npm run dev src/test/test-supabase-connection.ts
```

---

## 🚀 Production

### `npm run start`
**Description:** Start the production server  
**Command:** `node dist/server/index.js`  
**Port:** 8080 (or PORT env variable)  
**Prerequisites:** Must run `npm run build` first

```bash
npm run build
npm run start
```

**Access:**
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/api-docs
- Health Check: http://localhost:8080/health

---

### `npm run restart`
**Description:** Kill server, rebuild, and restart  
**Command:** `npm run kill:8080 && npm run build && npm run start`  
**When to use:** Quick restart after code changes

```bash
npm run restart
```

---

## 🧹 Cleanup

### `npm run clean`
**Description:** Delete the compiled `dist/` folder  
**Command:** `rm -rf dist`  
**When to use:** Clean build artifacts before fresh build

```bash
npm run clean
npm run build
```

---

### `npm run kill:8080`
**Description:** Kill any process running on port 8080  
**Command:** `lsof -ti:8080 | xargs kill -9`  
**When to use:** Server stuck or port already in use

```bash
npm run kill:8080
```

---

## 🧪 Testing

### `npm run test`
**Description:** Run compiled test files  
**Command:** `node --test dist/tests/**/*.test.js`  
**Prerequisites:** Must build first  
**When to use:** Run automated test suite

```bash
npm run build
npm run test
```

---

### `npm run test:watch`
**Description:** Run tests in watch mode  
**Command:** `ts-node --watch`  
**When to use:** Continuous testing during development

```bash
npm run test:watch
```

---

## 🗄️ Database

### `npm run migrate`
**Description:** Run Supabase database migration  
**Command:** `node run-migration.js`  
**What it does:** Creates the `agents` table in Supabase  
**When to use:** First-time setup or schema updates

```bash
npm run migrate
```

**Note:** Requires `DATABASE_URL` in `.env` file

---

### `npm run test:db`
**Description:** Test database connection  
**Command:** `node test-db-connection.js`  
**When to use:** Verify Supabase connection is working

```bash
npm run test:db
```

---

## 🚢 Deployment

### `npm run deploy:env`
**Description:** Deploy environment variables  
**Command:** `node deploy-env.js`  
**When to use:** Update environment variables on Railway

```bash
npm run deploy:env
```

---

### `npm run deploy`
**Description:** Build and deploy to Railway  
**Command:** `npm run build && railway up`  
**Prerequisites:** Railway CLI installed and logged in  
**When to use:** Deploy to production

```bash
npm run deploy
```

**Setup Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
npm run deploy
```

---

## 📋 Quick Reference

| Script | Purpose | Prerequisites |
|--------|---------|---------------|
| `npm run build` | Compile TypeScript | None |
| `npm run dev <file>` | Run TS file directly | None |
| `npm run start` | Start production server | Build first |
| `npm run restart` | Kill, rebuild, restart | None |
| `npm run clean` | Delete dist folder | None |
| `npm run kill:8080` | Kill port 8080 process | None |
| `npm run test` | Run test suite | Build first |
| `npm run test:watch` | Watch mode testing | None |
| `npm run migrate` | Create DB tables | DATABASE_URL set |
| `npm run test:db` | Test DB connection | DATABASE_URL set |
| `npm run deploy:env` | Deploy env vars | Railway CLI |
| `npm run deploy` | Deploy to Railway | Railway CLI |

---

## 🔄 Common Workflows

### Development Workflow
```bash
# 1. Start development server
npm run dev src/server/index.ts

# 2. In another terminal, test endpoints
npm run dev src/test/test-create-agent.ts
```

### Production Workflow
```bash
# 1. Build the project
npm run build

# 2. Start production server
npm run start
```

### Quick Restart Workflow
```bash
# One command to restart everything
npm run restart
```

### Database Setup Workflow
```bash
# 1. Run migration
npm run migrate

# 2. Test connection
npm run test:db

# 3. Test with actual data
npm run dev src/test/test-supabase-connection.ts
```

### Deployment Workflow
```bash
# 1. Test locally
npm run build
npm run start

# 2. Deploy to Railway
npm run deploy
```

---

## 💡 Tips

- **Use `dev` for development:** Faster, no build step needed
- **Use `start` for production:** Optimized, compiled code
- **Use `restart` for quick changes:** Kills old server automatically
- **Use `clean` if build issues:** Fresh start
- **Use `kill:8080` if port stuck:** Frees up the port

---

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
npm run kill:8080
npm run start
```

### Build errors
```bash
npm run clean
npm run build
```

### Server not responding
```bash
npm run restart
```

### Database connection issues
```bash
# Check connection
npm run test:db

# Re-run migration
npm run migrate
```

---

## 📚 Related Documentation

- **Deployment:** See `DEPLOYMENT.md`
- **Supabase Setup:** See `QUICK_SUPABASE_SETUP.md`
- **API Testing:** See `TEST_API.md`
- **Project Structure:** See `FOLDER_STRUCTURE.md`
