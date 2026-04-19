# Notice-to-Rescue Context

## Project

Notice-to-Rescue is a hackathon-quality, frontend-only Medicaid notice rescue
workflow. It focuses on one urgent patient moment: a Medicaid patient has
received a closure, termination, renewal, or action-required notice and needs to
understand the exact blocker before coverage is interrupted.

The product reads fictional sample packets or locally pasted notice text,
identifies the blocker putting coverage at risk, determines whether the case is
document-ready or needs escalation, and prepares simulated next-step artifacts.

This is not a production healthcare, legal, or eligibility system. It does not
determine Medicaid eligibility, submit paperwork, contact agencies, store real
documents, provide legal advice, schedule care, or manage real PHI workflows.

## Current Stack

- Next.js 16.2.4 app router
- React 19.2.4
- TypeScript
- Tailwind CSS v4 through `@tailwindcss/postcss`
- Lucide React icons
- Local JSON sample data
- Frontend-first deterministic workflow logic
- Optional TinyFish-backed public-web guidance endpoint for fresh source checks

## Important Repo Notes

- Read `AGENTS.md` before changing code.
- This project uses `src/app` for the app router.
- Path alias `@/*` maps to `./src/*`.
- Prefer client-side logic and local data. The only current server route is the
  TinyFish guidance proxy at `src/app/api/tinyfish/guidance/route.ts`.
- Do not add persistent storage, PHI handling, real submission workflows, or a
  broader backend unless a future task explicitly requires it.

## Main Files

- `src/app/page.tsx`: Landing route with Notice-to-Rescue pitch and dashboard CTA.
- `src/app/dashboard/layout.tsx`: Dashboard shell wrapping `DashboardContext` and the reasoning trace.
- `src/app/dashboard/*/page.tsx`: Multi-step demo journey from intake to final status.
- `src/components/dashboard/*`: Shared UI, context, app shell, and reasoning trace.
- `src/components/landing/*`: Landing page sections, copy, and header components.
- `src/app/api/tinyfish/guidance/route.ts`: Optional live guidance API route that
  verifies blocker guidance against public sources.
- `src/lib/workflow/agent.ts`: Orchestration entrypoint, including `runNoticeToRescueAgent`.
- `src/lib/domain/`: Local parsing, blocker assessment, rescue path, readiness, and artifact generation.
- `src/lib/tinyfish/`: TinyFish request/response helpers for live public-source verification.
- `src/lib/types/index.ts`: Shared notice rescue domain and workflow types.
- `src/lib/data/sampleCases.json`: Three fictional Medicaid notice packets.
- `readMe.md`: Run instructions and project overview.

## Workflow

The dashboard lets a user:

1. Choose a fictional notice packet or paste/upload local `.txt` notice text.
2. Review and edit extracted notice fields.
3. Run the local rescue agent.
4. See notice type, deadline, risk language, exact blocker, status, and next action.
5. Optionally verify live public-web guidance for the identified blocker.
6. Review generated packet artifacts.
7. Print a case summary for follow-up outside the prototype.

The central output is `AgentRunResult`, which becomes the single source of truth
after a workflow run.

## Dashboard UX Notes

- `AppShell` owns the dashboard chrome, sidebar navigation, and reasoning trace rail.
- The shell uses a wide responsive grid with a dominant main content column and a
  narrower sticky reasoning trace on desktop.
- Dashboard pages should preserve the existing card language: slate/white
  surfaces, emerald action states, rounded `lg` cards, and Lucide icons.
- The Rescue Path page is the primary decision screen. Keep the metric cards,
  Decision, Live Guidance, Findings, and Required Rescue Steps hierarchy intact.
- On tablet and mobile, the reasoning trace stacks below the main content and
  action buttons should remain full-width or comfortably tappable.

## Client State

- `DashboardContext` stores sample/upload mode and communication preferences in
  `localStorage`.
- Pasted/uploaded notice text is stored in `sessionStorage` for the browser
  session only.
- `.txt` uploads are read locally in the browser. PDF parsing is intentionally
  unsupported; users are directed to paste PDF text instead.
- `triggerNextStep` only logs simulated workflow events to the browser console.

## Live Guidance

- The Rescue Path page can call `verifyLiveGuidance`, which posts a
  `LiveGuidanceRequest` to `/api/tinyfish/guidance`.
- Live guidance is optional supporting context, not an eligibility decision or
  source of truth.
- If TinyFish or public-source lookup fails, the local deterministic rescue
  workflow should still remain usable.

## Case Statuses

- notice received
- blocker identified
- awaiting documents
- ready to submit
- escalation needed
- rescue in progress
- resolved

## Simulated Only

- Medicaid notice parsing and blocker detection
- Urgency classification
- Missing-requirements checklist generation
- Submission packet preparation
- Navigator escalation packet preparation
- Patient reminder draft generation
- Public-source guidance summaries and caveats

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
