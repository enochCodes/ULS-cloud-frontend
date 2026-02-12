This is the ULS Cloud frontend (Next.js). CRM screens now use dedicated service clients for the Core API and CRM API.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API integration

Set these env vars (e.g. in `.env.local`) before running the app so requests hit the correct backends:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1          # core auth + platform
NEXT_PUBLIC_CRM_API_URL=http://localhost:8081/api/v1       # CRM service (customers, orders, audit)
```

The shared HTTP client lives in `src/services/http/client.ts` with auth-aware interceptors. CRM domain services are under `src/services/crm/` (customers, orders, settings, communications, audit) and the auth client is under `src/services/core/auth.ts`.
