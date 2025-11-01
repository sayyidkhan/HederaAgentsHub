# Hedera Hub UI

> **Next.js 14 Frontend** for the Hedera Agents Hub marketplace with mock data/services.

## 🎯 Features

- **Marketplace Feed**: Browse listings with category filters and search
- **Sell Flow**: Create sell orders with photo upload and item details
- **Buy Flow**: Create buy orders with agent registration
- **Order Tracking**: Real-time agent process stepper with 7 steps
- **Profile**: User profile with transaction history and agent trust score
- **Dark/Light Mode**: Theme switching with next-themes
- **Responsive**: Mobile-first design with Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## 📁 Structure

```
app/
├── page.tsx                    # Home / Marketplace feed
├── sell/page.tsx               # Create sell order
├── buy/page.tsx                # Create buy order
├── orders/[id]/page.tsx        # Order detail with agent stepper
├── profile/[id]/page.tsx       # User profile
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── header-nav.tsx          # Top navigation
│   ├── listing-card.tsx        # Product card
│   ├── agent-process-stepper.tsx  # 7-step wizard
│   ├── hcs-timeline.tsx        # Event timeline
│   ├── invoice-card.tsx        # Payment invoice
│   └── hashscan-link.tsx       # Blockchain explorer link
└── lib/
    ├── api.ts                  # Mock API layer
    ├── mockDb.ts               # In-memory data
    ├── process.ts              # Mock agent simulation
    ├── store.ts                # Zustand state management
    ├── types.ts                # TypeScript types
    └── utils.ts                # Helper functions
```

## 🔌 Connecting Real APIs

Replace the mock API calls in `app/lib/api.ts` with real backend endpoints:

```typescript
// Before (Mock)
export async function listListings() {
  await sleep(300);
  return mockListings;
}

// After (Real API)
export async function listListings(filters?: ListingFilters) {
  const params = new URLSearchParams(filters as any);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTORY_SVC_URL}/listings?${params}`
  );
  return response.json();
}
```

### Backend Services to Connect:

- **Directory Service** (`http://localhost:3001`)
  - `/agents` - List agents
  - `/agents/register` - Register new agent
  - `/reputation/:id` - Get reputation

- **Gateway x402** (`http://localhost:3002`)
  - `/invoices` - Create invoice
  - `/pay/:id` - Execute payment
  - `/pay/:id/verify` - Verify payment

- **HCS Logger** (`http://localhost:3003`)
  - `/events` - Post HCS event
  - `/stream/:topicId` - SSE event stream

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` and `app/globals.css`:

```css
:root {
  --primary: 250 85% 60%;  /* Indigo blue */
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  /* ... */
}
```

### Add New Components

Use shadcn/ui CLI to add more components:

```bash
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add toast
```

## 📊 State Management

The app uses Zustand for global state:

```typescript
import { useOrderStore } from '@/lib/store';

function MyComponent() {
  const { ordersById, setSteps } = useOrderStore();
  
  // Access order state
  const order = ordersById['ORD-123'];
  
  // Update steps
  setSteps('ORD-123', newSteps);
}
```

## 🧪 Testing

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build for production (checks for errors)
pnpm build
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build
docker build -t hedera-hub-ui .

# Run
docker run -p 3000:3000 hedera-hub-ui
```

## 📝 Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DIRECTORY_SVC_URL=http://localhost:3001
NEXT_PUBLIC_GATEWAY_X402_URL=http://localhost:3002
NEXT_PUBLIC_HCS_LOGGER_URL=http://localhost:3003
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HASHSCAN_BASE=https://hashscan.io/testnet
```

## 🎬 Demo Flow

1. Visit `/` - Browse marketplace
2. Click "Sell Item" - Create sell order
3. Submit form - Redirects to `/orders/[id]`
4. Watch agent stepper animate through 7 steps
5. Click "Pay Now" when invoice appears
6. View payment confirmation and HashScan link
7. Check HCS timeline for all events
8. Visit `/profile/user-1` to see transaction history

## 🤝 Contributing

See [main README](../../README.md) for contribution guidelines.

## 📄 License

MIT

