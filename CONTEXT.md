# Coverage-to-Care Rescue Context

## Project

Coverage-to-Care Rescue is now a frontend-only Medicare subscriber workflow
prototype. It presents a patient-facing product experience where a Medicare user
can try fictional sample cases or paste/upload local document text, review
extracted fields, run a deterministic workflow, compare possible provider fits,
and print an informational next-step summary.

This is not a production healthcare system. It does not determine Medicare
eligibility, confirm benefits, charge users, create accounts, store real
documents, book appointments, submit paperwork, send records, or make compliance
claims.

## Current Stack

- Next.js 16.2.4 app router
- React 19.2.4
- TypeScript
- Tailwind CSS v4 through `@tailwindcss/postcss`
- Local JSON sample data
- Frontend workflow logic
- **TinyFish** (Search, Fetch, Agent SSE) — core live-web provider discovery engine
- Next.js API routes for server-side TinyFish calls (key-safe)

## Important Repo Notes

- Read `AGENTS.md` before changing code.
- This project uses `src/app` for the app router.
- Path alias `@/*` maps to `./src/*`.
- Prefer client-side logic and local data for the workflow; use the two API routes
  only for TinyFish (server-side, key must never reach the browser).
- `TINYFISH_API_KEY` must be in `.env.local`. When absent, all TinyFish routes
  fall back to deterministic mock responses marked `🔶 DEMO MODE`.

## Main Files

- `src/app/page.tsx`: root route.
- `src/app/api/tinyfish/discover/route.ts`: POST — TinyFish Search + Fetch pipeline.
- `src/app/api/tinyfish/secure-care/route.ts`: POST streaming SSE — TinyFish Agent run.
- `src/components/CoverageToCareDashboard.tsx`: main dashboard with TinyFish UI.
- `src/components/TinyFishRunLog.tsx`: streaming SSE event log panel.
- `src/components/LiveProviderCard.tsx`: card for a TinyFish-discovered provider.
- `src/lib/tinyfish/search.ts`: TinyFish Search API wrapper.
- `src/lib/tinyfish/fetch.ts`: TinyFish Fetch API wrapper.
- `src/lib/tinyfish/normalize.ts`: page text → LiveProvider objects.
- `src/lib/tinyfish/agent.ts`: TinyFish Agent SSE wrapper.
- `src/lib/tinyfish/mock.ts`: mock boundary (used when API key absent).
- `src/lib/workflow/agent.ts`: local orchestration, `runCoverageToCareAgent`.
- `src/lib/domain/`: parsing, coverage, referral, providers, actions.
- `src/lib/types/index.ts`: all shared TypeScript types.
- `src/lib/data/`: local JSON seed data.
- `.env.example`: environment variable template.
- `readMe.md`: run instructions.

## Workflow

The dashboard lets a user:

1. Start or continue a simulated subscriber session.
2. Choose a fictional sample Medicare case or paste/upload `.txt` document text.
3. Review and edit extracted Medicare fields before running the workflow.
4. Run the local review workflow.
5. See possible Medicare issue signals and verification questions.
6. Compare transparently ranked provider options.
7. See simulated preparation actions and patient next steps.
8. Print a browser-friendly summary.

The central output is `AgentRunResult`, which becomes the single source of truth
after a workflow run.

## Provider Ranking

Providers are filtered by:

- Specialty
- Medicare compatibility
- Maximum distance
- Language preference when present
- Accepting new patients

Ranked score weights:

- Medicare coverage fit: 40
- Specialty match: 20
- Distance: 15
- Availability: 15
- Cost signal: 10

## Simulated Only

- Subscription and pricing status
- Medicare document parsing and possible issue detection
- Provider ranking over fictional local data
- Provider call preparation
- Paperwork packet preparation
- Patient next steps

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

Local dev URL:

```text
http://localhost:3000
```
