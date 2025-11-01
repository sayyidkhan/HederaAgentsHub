# HederaHub

A modern Next.js landing page for **HederaHub** — a platform where AI agents autonomously buy and sell using ERC-8004 and x402 on the Hedera blockchain.

## 🎨 Design Principles

- **Primary color:** `#021058` (deep navy blue)
- **Secondary background:** `#F9F9F9` (light gray)
- **Cards:** `#FFFFFF` (white)
- **Font:** Inter (loaded via next/font/google)
- **Style:** Clean, minimal, futuristic with rounded cards and soft shadows

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Language:** TypeScript

## 📁 Project Structure

```
hederahub/
├── app/
│   ├── layout.tsx                # Global layout (Navbar + Footer)
│   ├── page.tsx                  # Main landing page
│   ├── docs/page.tsx             # Documentation page (placeholder)
│   ├── marketplace/page.tsx      # Dynamic marketplace with agent listings
├── components/
│   ├── Hero.tsx                  # Hero section with CTA
│   ├── DemoFlow.tsx              # Static timeline (legacy)
│   ├── DemoFlowInteractive.tsx   # ✨ Interactive expandable timeline
│   ├── HowItWorks.tsx            # Static tech cards (legacy)
│   ├── HowItWorksTabs.tsx        # ✨ Tabbed interface with code examples
│   ├── AgentMarketplace.tsx      # ✨ Filterable agent directory
│   ├── StatsCounter.tsx          # ✨ Animated statistics counters
│   ├── CTASection.tsx            # Call-to-action footer
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer links
├── public/
│   ├── hederahub-flow.svg        # Visual infographic
├── styles/
│   ├── globals.css               # Tailwind base styles + custom utilities
├── tailwind.config.js            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## ✨ Dynamic Features

### Interactive Demo Timeline (`DemoFlowInteractive.tsx`)
- **Expandable steps** — Click any step to view detailed transaction info
- **Simulate button** — Animate progress through all 9 steps
- **Transaction hashes** — Mock Hedera tx links (ready for real API integration)
- **Timestamps** — Show when each step occurred
- **Completion tracking** — Visual checkmarks for completed steps

### Agent Marketplace (`AgentMarketplace.tsx`)
- **Real-time filtering** — By agent type (buyer/seller) and category
- **Search functionality** — Find agents by name or specialty
- **Live status indicators** — Online/offline badges
- **Trust scores & ratings** — ERC-8004 registry data (mock)
- **6 pre-populated agents** — Ready to replace with API data

### Animated Stats Counter (`StatsCounter.tsx`)
- **Count-up animations** — Numbers animate on scroll into view
- **4 key metrics** — Active agents, transactions, trust score, response time
- **Spring physics** — Smooth easing with Framer Motion
- **Scroll trigger** — Only animates once when visible

### Tabbed How It Works (`HowItWorksTabs.tsx`)
- **3 interactive tabs** — ERC-8004, x402, Hedera
- **Code examples** — Syntax-highlighted integration samples
- **Feature lists** — Key capabilities for each protocol
- **Smooth transitions** — AnimatePresence for tab switching

## 🌐 Page Sections

### 1️⃣ **Navbar**
- Logo: "HederaHub" with star icon
- Buttons: "Launch Demo", "Explore Agents"
- Fixed top bar with backdrop blur

### 2️⃣ **Hero Section**
- Headline: "Autonomous Commerce on the Agentic Web"
- Subtext: "Where AI agents discover, trust, and transact on Hedera."
- CTA buttons + animated background with network visualization
- Visual: `/public/hederahub-flow.svg`

### 3️⃣ **Featured Demo: iPhone Marketplace**
- Vertical timeline with 8 steps:
  1. Search → Buyer searches for "iPhone retailer"
  2. Discovery → Finds Seller (95% trust)
  3. Negotiation → Price agreed (999 SGD)
  4. Payment → Executes via x402
  5. Verification → Seller verifies payment
  6. Fulfillment → Supplier ships iPhone
  7. Receipt → Buyer receives proof
  8. Rating → Both agents rate each other
- Animated scroll-reveal for each step

### 4️⃣ **How It Works**
- Three cards explaining the tech stack:
  - **ERC-8004:** Agent Discovery & Trust
  - **x402 Protocol:** Secure Payments
  - **Hedera:** Consensus & Verification
- Each card has hover effects (scale + glow)

### 5️⃣ **CTA Section**
- Headline: "Build the Future of Autonomous Commerce"
- Subtext: "Join the next generation of decentralized agent economies."
- Buttons: "Try HederaHub", "View Documentation"
- Gradient navy background

### 6️⃣ **Footer**
- Copyright notice
- Links: Privacy, Terms, GitHub, Twitter

## 🔗 Future Integration Points

Comments in the code indicate where to connect:

- **`DemoFlowInteractive.tsx`**: Replace mock step data with live Hedera transaction stream
- **`AgentMarketplace.tsx`**: Connect to ERC-8004 registry API for real agent listings
- **`StatsCounter.tsx`**: Fetch real-time platform metrics from Hedera analytics API
- **`HowItWorksTabs.tsx`**: Pull live network stats (TPS, fees, consensus time)
- **`/app/docs/page.tsx`**: Render MDX documentation from `/content` or CMS

### Example API Integration

```typescript
// In DemoFlowInteractive.tsx
const fetchLiveSteps = async () => {
  const res = await fetch('/api/hedera/transactions?demo=iphone');
  const data = await res.json();
  setSteps(data.steps);
};

// In AgentMarketplace.tsx
const fetchAgents = async () => {
  const res = await fetch('/api/erc8004/agents');
  const data = await res.json();
  setAgents(data.agents);
};
```

## ⚙️ Animations

- **Framer Motion** powers:
  - Hero text fade + upward motion
  - Timeline items staggered reveal on scroll
  - CTA section fade-in from bottom
  - Button hover pulses and glowing effects

## 📝 Notes

- All lint warnings about `@tailwind` directives and missing types are **expected before `npm install`** — they resolve once dependencies are installed.
- The `/public/hederahub-flow.svg` is a placeholder network visualization. Replace with your custom infographic if needed.
- Responsive design is mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`).

## 📄 License

© 2025 HederaHub. All rights reserved.
