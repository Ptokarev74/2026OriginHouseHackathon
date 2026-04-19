# Contributors 
Raghav Maddula, Pavel Tokarev, Theo Nguyen, Preston Nguyen

# Notice-to-Rescue

Notice-to-Rescue is a frontend-only Medicaid notice rescue prototype. It is
designed for a narrow, urgent workflow: a patient has received a closure,
termination, renewal, or action-required notice and needs to know the exact
blocker before coverage is interrupted.

The demo reads fictional sample packets or locally pasted text, identifies why
coverage is at risk, explains the blocker in plain English, and prepares the
next steps needed to resolve or escalate the case.

The app does not determine Medicaid eligibility, submit paperwork, contact
agencies, provide legal advice, store real documents, create accounts, or manage
real PHI workflows.

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

## TinyFish Live Guidance

The Rescue Path screen can verify public-web guidance after the local workflow
identifies a blocker. The app calls TinyFish only from a Next.js route handler,
so the API key stays server-side and the browser sends only non-identifying
blocker metadata, not the full notice text.

Create a root `.env` or `.env.local` file:

```bash
TINYFISH_API_KEY="your_tinyfish_api_key"
```

The variable must use `NAME=value` syntax. A raw API key pasted by itself will
not be loaded by Next.js.

The integration uses:

- TinyFish Search API to find fresh public guidance sources.
- TinyFish Fetch API to extract clean Markdown from the selected source URLs.
- No TinyFish automation by default; browser automation is reserved for future
  multi-step website workflows where search and fetch are not enough.

Manual test plan:

1. Run `npm run dev` and open `http://localhost:3000`.
2. Choose a sample case, confirm extracted fields, and run the rescue agent.
3. On Rescue Path, click `Verify Guidance`.
4. Confirm the panel shows loading, then a summary with source links.
5. Temporarily unset `TINYFISH_API_KEY` and confirm the panel shows a safe
   configuration error instead of exposing secrets or stack traces.

## What The Prototype Does

- Presents a Notice-to-Rescue landing page with a dashboard CTA.
- Lets a user choose one of three fictional Medicaid notice packets.
- Supports pasting document text or uploading a `.txt` file locally in the browser.
- Supports local OCR for uploaded PDF, PNG, JPG, and JPEG notice files.
- Extracts editable notice fields before workflow execution.
- Runs deterministic local workflow logic to identify blockers and rescue paths.
- Verifies live public-web guidance with server-side TinyFish Search and Fetch.
- Generates a plain-English explanation, missing-requirements checklist,
  simulated submission packet, escalation packet, and outreach reminder.
- Provides a browser-printable final rescue summary.

## Architecture

- `src/app`: Next.js app router entrypoint, metadata, routes, and global styles.
- `src/components/dashboard`: dashboard shell, context, reasoning trace, and shared UI.
- `src/lib/types`: shared TypeScript notice rescue types.
- `src/lib/domain`: deterministic parsing, blocker assessment, rescue path selection,
  readiness checks, and artifact generation.
- `src/lib/tinyfish`: server-only TinyFish client and live guidance verifier.
- `src/lib/workflow`: `runNoticeToRescueAgent(inputCase)` orchestration and step metadata.
- `src/lib/data`: fictional local Medicaid notice packets.

The central workflow result is `AgentRunResult`, which drives result panels after
the agent runs.

## Local Persistence

- `localStorage` stores demo mode and communication preferences.
- `sessionStorage` stores pasted or uploaded text for the current browser session only.
- No backend, database, auth service, document store, or external API is included.

## Local OCR Uploads

The intake screen accepts `.txt`, `.pdf`, `.png`, `.jpg`, and `.jpeg` files.
Text files are read with the browser `FileReader`. PDF and image files are
processed with Tesseract.js in the browser; PDFs are rendered page-by-page with
pdf.js, then each rendered page is OCR-read locally.

OCR is limited to a hackathon-friendly demo size: files up to 10 MB, text files
up to 1 MB, and PDFs up to 5 pages. The app serves the Tesseract worker,
English traineddata, OCR core, and pdf.js worker from local `public/vendor`
assets and disables Tesseract traineddata caching, so OCR does not require an
external OCR API or persistent document storage.

Known limitations:

- OCR quality depends on scan quality, rotation, handwriting, and image contrast.
- Only English OCR data is bundled.
- Large or complex PDFs may time out; paste text manually if extraction fails.
- OCR only produces editable text, then the same deterministic demo workflow
  parses that text.

This remains demo-only. Do not use real PHI, do not rely on it for eligibility
determinations, and verify case-specific notice details with the appropriate
agency or qualified human reviewer.

## Sample Data

The local dataset includes three fictional Medicaid notice packets:

- Renewal warning with missing proof of income.
- Closure/action-required notice with missing proof of residency.
- Termination/conflicting-income case that routes to escalation.

## What Is Simulated

- Notice parsing and risk-language extraction.
- Exact blocker classification.
- Urgency and readiness status.
- Missing-requirements checklist generation.
- Submission packet and navigator escalation packet generation.
- Reminder and outreach message drafting.

Always verify Medicaid status, deadlines, submission options, appeal rights, and
case-specific instructions directly with the appropriate agency or qualified
human reviewer.
