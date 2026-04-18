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
- Frontend-only workflow logic

## Important Repo Notes

- Read `AGENTS.md` before changing code.
- This project uses `src/app` for the app router.
- Path alias `@/*` maps to `./src/*`.
- Prefer client-side logic and local data; do not add a backend unless a future
  task explicitly requires it.

## Main Files

- `src/app/page.tsx`: root route, passes sample cases and providers into the UI.
- `src/components/CoverageToCareDashboard.tsx`: patient-facing product, mock
  subscription, intake, upload/paste flow, extraction review, results, and print
  summary.
- `src/lib/workflow/agent.ts`: orchestration entrypoint, including
  `runCoverageToCareAgent`.
- `src/lib/domain/`: parsing, Medicare signal assessment, referral assessment,
  provider ranking, and simulated actions.
- `src/lib/types/index.ts`: shared domain and workflow types.
- `src/lib/data/`: local JSON data and adapters.
- `readMe.md`: run instructions and project overview.

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
