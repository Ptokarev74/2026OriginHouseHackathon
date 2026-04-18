import type {
  LiveProvider,
  ProviderDiscoveryResult,
  TinyFishAgentEvent,
  TinyFishFetchResult,
  TinyFishSearchResult,
} from "@/lib/types";

// ── Mock search results ───────────────────────────────────────────────────────

const MOCK_SEARCH_RESULTS: TinyFishSearchResult[] = [
  {
    position: 1,
    site_name: "cms.gov",
    title: "Medicare Physician Compare — Cardiologists near 78701",
    snippet:
      "Find cardiologists who accept Medicare and Medicaid near Austin, TX 78701. Compare ratings, availability, and accepted plans.",
    url: "https://www.medicare.gov/care-compare/results?searchType=Provider&zip=78701&specialty=allopathic%20%26%20osteopathic%20physicians%2Fcardiovascular%20disease",
  },
  {
    position: 2,
    site_name: "healthgrades.com",
    title: "Top Cardiologists in Austin, TX — HealthGrades",
    snippet:
      "Browse cardiologists in Austin, TX accepting Medicaid and new patients. View ratings, insurance information, and office locations.",
    url: "https://www.healthgrades.com/usearch?what=Cardiologist&where=Austin%2C+TX+78701&ss=Medicaid",
  },
  {
    position: 3,
    site_name: "austinheartclinic.com",
    title: "Austin Heart Clinic — Cardiology | Accepting New Patients",
    snippet:
      "Board-certified cardiologists in Austin, TX. Accepting Medicare, Medicaid, and dual-eligible patients. Same-week appointments available.",
    url: "https://austinheartclinic.com/new-patients",
  },
];

// ── Mock fetched page content ─────────────────────────────────────────────────

const MOCK_FETCHED_PAGES: TinyFishFetchResult[] = [
  {
    url: "https://austinheartclinic.com/new-patients",
    final_url: "https://austinheartclinic.com/new-patients",
    title: "Austin Heart Clinic — New Patients",
    description: "Cardiology care for Medicare and Medicaid patients in Austin, TX.",
    language: "en",
    text: `# Austin Heart Clinic

## New Patient Information

Austin Heart Clinic is a board-certified cardiology practice serving the greater Austin area.

**Accepted Insurance:** Medicare, Medicaid, Dual Eligible (Medicare + Medicaid), CHIP, Humana Medicare Advantage, Blue Cross Medicare Advantage

**Accepting new patients:** Yes — same-week appointments available

**Address:** 1240 Red River St, Austin, TX 78701

**Phone:** (512) 555-0181

**Scheduling:** https://austinheartclinic.com/schedule-appointment

**Contact / Referral:** https://austinheartclinic.com/contact

For referrals, please fax records to (512) 555-0182 or use our online referral form.

**Availability:** Next available appointment within 3-5 business days.

**Cost:** Sliding scale available for Medicaid patients. No out-of-pocket cost for most Medicare recipients.

We provide transportation coordination assistance for patients without reliable transportation.
`,
  },
  {
    url: "https://www.healthgrades.com/usearch?what=Cardiologist&where=Austin%2C+TX+78701&ss=Medicaid",
    final_url: "https://www.healthgrades.com/usearch?what=Cardiologist&where=Austin%2C+TX+78701&ss=Medicaid",
    title: "Cardiologists in Austin TX — HealthGrades",
    description: "Compare top cardiologists in Austin accepting Medicaid.",
    language: "en",
    text: `# Cardiologists in Austin, TX Accepting Medicaid

## Capital Cardiology Associates
**Specialty:** Cardiology
**Address:** 3706 South Lamar Blvd, Austin, TX 78704
**Phone:** (512) 555-0294
**Insurance accepted:** Medicaid, Medicare, Dual Eligible
**Accepting new patients:** Yes
**Next available:** 4 days
**Scheduling:** https://www.healthgrades.com/physician/dr-capital-cardiology/appointments
**Contact:** https://www.healthgrades.com/physician/dr-capital-cardiology/contact
**Cost:** Standard Medicaid copay applies.
`,
  },
];

// ── Mock LiveProviders ────────────────────────────────────────────────────────

export const MOCK_PROVIDERS: LiveProvider[] = [
  {
    provider_name: "Austin Heart Clinic",
    specialty: "Cardiology",
    address: "1240 Red River St, Austin, TX 78701",
    phone: "(512) 555-0181",
    insurance_acceptance:
      "Medicare, Medicaid, Dual Eligible (Medicare + Medicaid), CHIP, Humana Medicare Advantage",
    scheduling_url: "https://austinheartclinic.com/schedule-appointment",
    contact_url: "https://austinheartclinic.com/contact",
    availability_hint: "Same-week appointments available — next available within 3-5 business days",
    price_hint: "Sliding scale available for Medicaid. No out-of-pocket for most Medicare recipients.",
    source_url: "https://austinheartclinic.com/new-patients",
    source: "mock",
  },
  {
    provider_name: "Capital Cardiology Associates",
    specialty: "Cardiology",
    address: "3706 South Lamar Blvd, Austin, TX 78704",
    phone: "(512) 555-0294",
    insurance_acceptance: "Medicaid, Medicare, Dual Eligible",
    scheduling_url:
      "https://www.healthgrades.com/physician/dr-capital-cardiology/appointments",
    contact_url: "https://www.healthgrades.com/physician/dr-capital-cardiology/contact",
    availability_hint: "Next available: 4 days",
    price_hint: "Standard Medicaid copay applies.",
    source_url:
      "https://www.healthgrades.com/usearch?what=Cardiologist&where=Austin%2C+TX+78701&ss=Medicaid",
    source: "mock",
  },
];

// ── Mock agent SSE events ─────────────────────────────────────────────────────

export const MOCK_AGENT_EVENTS: TinyFishAgentEvent[] = [
  {
    type: "STARTED",
    run_id: "mock-run-001",
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose: "Navigating to Austin Heart Clinic new patient contact page",
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose: "Page loaded — locating new patient request form",
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose: 'Filling field: Patient type = "New patient"',
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose: 'Filling field: Reason for visit = "Cardiology follow-up referral"',
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose: 'Filling field: Insurance = "Medicaid / Dual Eligible"',
  },
  {
    type: "PROGRESS",
    run_id: "mock-run-001",
    purpose:
      "Safe-stop triggered — form is filled but NOT submitted per task instructions",
  },
  {
    type: "COMPLETE",
    run_id: "mock-run-001",
    status: "COMPLETED",
    result: {
      provider: "Austin Heart Clinic",
      fields_found: ["Patient type", "Reason for visit", "Insurance", "Notes"],
      fields_filled: ["Patient type", "Reason for visit", "Insurance"],
      stopped_before_submit: true,
    },
  },
];

// ── Public mock functions ─────────────────────────────────────────────────────

/** Returns mock search results — deterministic, tagged source: "mock". */
export function getMockSearchResults(): TinyFishSearchResult[] {
  return MOCK_SEARCH_RESULTS;
}

/** Returns mock fetched pages. */
export function getMockFetchedPages(): TinyFishFetchResult[] {
  return MOCK_FETCHED_PAGES;
}

/** Returns mock discovery result for the discover route. */
export function getMockDiscoveryResult(): ProviderDiscoveryResult {
  return {
    providers: MOCK_PROVIDERS,
    mode: "mock",
    searchUrls: MOCK_SEARCH_RESULTS.map((r) => r.url),
    log: [
      "🔶 DEMO MODE — TinyFish live calls disabled (no API key present)",
      "🔍 Mock search: 3 provider URLs discovered",
      "📄 Mock fetch: 2 pages extracted and normalized",
      "✅ 2 mock live providers ready",
    ],
  };
}

/** Returns a ReadableStream that emits mock SSE events with realistic delays. */
export function getMockAgentStream(): ReadableStream<string> {
  const events = MOCK_AGENT_EVENTS;
  let index = 0;

  return new ReadableStream<string>({
    async pull(controller) {
      if (index >= events.length) {
        controller.close();
        return;
      }
      const event = events[index++];
      // Simulate realistic per-event delay (300-700ms)
      await new Promise((r) => setTimeout(r, index === 1 ? 100 : 600));
      controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
    },
  });
}

// ProviderDiscoveryResult is defined in @/lib/types — import it from there.
