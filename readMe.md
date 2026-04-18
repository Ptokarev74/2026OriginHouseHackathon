# Coverage-to-Care Rescue

Coverage-to-Care Rescue is a hackathon-quality, frontend-only Medicare paperwork
review prototype. It is framed as a direct-to-consumer subscription-style product
that helps Medicare users organize letters, notices, referral documents, and
discharge notes so they can spot possible coverage or access issues and prepare
questions before care is disrupted.

The app does not determine Medicare eligibility, benefits, plan status, provider
participation, or appointment availability. It does not create accounts, charge a
card, store real documents, book appointments, submit paperwork, or send medical
records.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
npm run lint
npm run build
npm run start
```

## What The Prototype Does

- Presents a Medicare-focused landing page with simulated subscription entry.
- Lets a user continue as a mock subscriber using localStorage only.
- Supports two intake paths:
  - Try a fictional sample Medicare case.
  - Paste document text or upload a `.txt` file locally in the browser.
- Gracefully declines PDF parsing and asks the user to paste text instead.
- Extracts editable Medicare-related fields before workflow execution.
- Runs deterministic local workflow logic for possible issue flags, provider-fit
  ranking, simulated preparation steps, and patient-friendly next steps.
- Provides a browser-printable summary for the user to bring to a call or visit.

## Architecture

- `src/app`: Next.js app router entrypoint, metadata, and global Tailwind/print
  styles.
- `src/components`: patient-facing product UI, mock subscriber flow, intake,
  extraction review, workflow result panels, and print summary.
- `src/lib/types`: shared TypeScript domain and workflow types.
- `src/lib/domain`: deterministic parsing, Medicare signal assessment, referral
  normalization, provider filtering/ranking, and simulated patient actions.
- `src/lib/workflow`: `runCoverageToCareAgent(inputCase)` orchestration and
  workflow step metadata.
- `src/lib/data`: fictional local Medicare cases, notices, referral notes, and
  provider data.

The central workflow result is still `AgentRunResult`, which drives all result
panels after a run.

## Local Persistence

- `localStorage` stores mock subscriber status, selected intake mode, and last
  preferences.
- `sessionStorage` stores pasted or uploaded text for the current browser
  session only.
- No backend, database, auth provider, billing service, or document store is
  included.

## What Is Simulated

- Subscription status and pricing.
- Medicare document parsing and issue detection.
- Provider ranking over a fictional local JSON dataset.
- Provider call preparation.
- Paperwork packet preparation.
- Patient next-step recommendations.

Always verify Medicare status, plan participation, provider acceptance, costs,
deadlines, and appointment availability directly with Medicare, the plan, or the
provider office.

## Sample Data

The local dataset includes:

- 3 fictional Medicare-related cases.
- 3 fictional plan or Medicare notices.
- 3 fictional referral or discharge notes.
- 15 fictional providers with accepted insurance, specialty, distance,
  availability, cost level, languages, telehealth, and accepting-new-patients
  status.

## Provider Ranking

Eligible providers are filtered by specialty, Medicare compatibility, maximum
distance, language preference when present, and accepting-new-patients status.

Ranked providers use a transparent 100-point score:

- Medicare coverage fit: 40
- Specialty match: 20
- Distance: 15
- Availability: 15
- Cost signal: 10
