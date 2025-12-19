# Jooav-erp FE

JOOAV - A modern Inventory management application built with **Next.js (v15+)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

The project follows best practices for scalability, testing, theming, and environment-based configuration, with support for **staging** and **production** deployments.

---

## 🛠 Tech Stack

**Frontend**
- Next.js (v15+)
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui
- Lucide Icons

**State & Data**
- React Query (server state)
- Redux Toolkit (local/UI state)
- Axios (API client with interceptors)

**Forms & Validation**
- React Hook Form
- Zod

**Testing**
- Jest (unit & integration tests)
- React Testing Library
- jsdom
- Playwright (E2E)

**Deployment**
- Vercel

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Install dependencies
```bash
npm install
npm run dev

```
### The app will be available at:
http://localhost:3000

##Figma file: https://www.figma.com/design/JyCiUdPJ211qm8002nGxHg/JooavERP%E2%80%94Design?node-id=73-2&t=TIPqkE03iaqvAA0h-1

## Environment Variables

This project uses environment variables for configuration.

### Required Variables

| Variable | Description | Example |
|--------|------------|--------|
| NEXT_PUBLIC_API_BASE_URL | Backend API base URL | http://localhost:4000 |
| NEXT_PUBLIC_ENV | App environment (dev/staging/prod) | dev |

### Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Restart the dev server


src/
├─ app/                # Next.js App Router (routes, layouts)
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css      # Tailwind + design tokens
│  └─ providers.tsx    # Global providers (theme, state, query)
│
├─ components/
│  ├─ ui/              # shadcn/ui base components
│  └─ shared/          # Reusable app components
│
├─ features/           # Feature-based modules
│  ├─ auth/
│  ├─ users/
│  └─ cart/
|
├─ hooks/           # Reusable hooks
│  ├─ auth/
│  ├─ users/
│  └─ cart/
|
├─ interfaces/    # interfaces
│  ├─ auth/
│  ├─ users/
│  └─ cart/
|
├─ redux/           # State management
│  ├─ slices/
│     ├─ authSlice.ts
│  ├─ hooks.ts/
│  ├─ store.ts/
│  └─ 
|
├─ schema/           # Form validations with zod
│  ├─ auth/
│  ├─ users/
│  └─ cart/
|
├─ types/           # Data types
│  ├─ auth/
│  ├─ users/
│  └─ cart/
│
├─ lib/
│  ├─ axios.ts         # Axios instance & interceptors
│  ├─ store.ts         # Redux store
│  └─ queryClient.ts  # React Query client
│
├─ tests/
│  ├─ unit/            # Unit tests
│  └─ integration/    # Integration tests
│
└─ utils/
   └─ helpers.ts     # Reusable functions



## 🧪 Testing

### Unit & Integration Tests (Jest)

```bash
npm run test
```

