export const trustPills = [
  "Plain-English Medicaid notice guidance",
  "Blocker and readiness check",
  "Frontend-only demo",
];

export const benefitStrip = [
  "Read renewal and closure notices",
  "Identify exact coverage blockers",
  "Prepare packets and escalation notes",
];

export const reassuranceItems = [
  {
    title: "Plain-English notice review",
    copy: "Summaries explain what a Medicaid notice appears to request, not official eligibility decisions.",
  },
  {
    title: "Blocker-focused workflow",
    copy: "The demo centers on the missing requirement, deadline, and readiness status for the next step.",
  },
  {
    title: "Simulated only",
    copy: "This frontend demo does not contact agencies, submit paperwork, store real documents, or manage PHI.",
  },
];

export const matterItems = [
  {
    title: "Coverage can close quickly",
    copy: "A renewal or action-required notice may give a short window before benefits are interrupted.",
  },
  {
    title: "The blocker is often buried",
    copy: "The key missing item may be a proof of income, residency document, or clarification hidden in dense text.",
  },
  {
    title: "Deadlines need attention",
    copy: "The difference between ready to submit and escalation needed can depend on a single response date.",
  },
  {
    title: "Conflicting records happen",
    copy: "A notice and status letter may point to different facts, making human review important before action.",
  },
  {
    title: "Packets need to be complete",
    copy: "A response is stronger when the notice, verification, case details, and confirmation plan are organized.",
  },
  {
    title: "Escalation should be clear",
    copy: "Notice-to-Rescue helps distinguish routine document gathering from cases that need a navigator or advocate.",
  },
];

export const commonSituations = [
  {
    title: "A renewal warning arrived",
    copy: "The notice says Medicaid may close unless proof of income or another verification is submitted.",
  },
  {
    title: "An action-required notice is unclear",
    copy: "The letter names a response date, but the exact document needed is easy to miss.",
  },
  {
    title: "A termination notice has already passed",
    copy: "Coverage appears scheduled to end, so the case may need appeal or reinstatement review.",
  },
  {
    title: "Two documents conflict",
    copy: "A case status letter and notice do not agree on income, residency, or eligibility details.",
  },
  {
    title: "A patient has partial paperwork",
    copy: "Some verification is ready, but the packet may still be missing a required item or confirmation step.",
  },
  {
    title: "Someone pasted local notice text",
    copy: "The prototype can review fictional sample packets or browser-local pasted text for the demo flow.",
  },
];

export const reviewTypes = [
  {
    title: "Medicaid renewal notices",
    examples: "Renewal warnings, missing-verification requests, action deadlines",
  },
  {
    title: "Closure and termination letters",
    examples: "Coverage end dates, closure warnings, deadline-passed language",
  },
  {
    title: "Action-required notices",
    examples: "Proof of income, proof of residency, requested document lists",
  },
  {
    title: "Case status letters",
    examples: "Agency status updates, conflicting details, eligibility flags",
  },
  {
    title: "Supporting verification",
    examples: "Pay stubs, employer letters, leases, utility bills, official mail",
  },
  {
    title: "Risk and urgency language",
    examples: "Coverage may close, case will close, failure to respond, deadline passed",
  },
  {
    title: "Submission instructions",
    examples: "Where to send documents, what to include, confirmation reminders",
  },
  {
    title: "Escalation signals",
    examples: "Low-confidence extraction, conflicting records, overdue cases",
  },
];

export const leaveWithItems = [
  "Plain-English explanation of the notice",
  "Exact blocker putting coverage at risk",
  "Deadline, urgency, and readiness status",
  "Missing-requirements checklist",
  "Simulated submission or escalation packet",
  "Printable follow-up summary for outside review",
];

export const workflowSteps = [
  {
    step: "01",
    title: "Choose or paste a notice",
    copy: "Start with a fictional Medicaid notice packet or paste local text into the browser-only demo.",
  },
  {
    step: "02",
    title: "Review extracted fields",
    copy: "Confirm the notice type, deadline, Medicaid program, risk language, and requested documents.",
  },
  {
    step: "03",
    title: "Run the rescue agent",
    copy: "The local workflow identifies the exact blocker, urgency, rescue path, and document readiness.",
  },
  {
    step: "04",
    title: "Prepare the next action",
    copy: "Leave with simulated packet artifacts, escalation notes, and a printable summary for follow-up.",
  },
];

export const faqs = [
  {
    question: "Does this decide whether someone is eligible for Medicaid?",
    answer:
      "No. Notice-to-Rescue explains notice language and prepares next steps, but it does not determine Medicaid eligibility, coverage status, or appeal rights.",
  },
  {
    question: "Can this submit documents to an agency?",
    answer:
      "No. The demo can prepare simulated packet artifacts, but it does not submit paperwork, contact agencies, create accounts, or save confirmations.",
  },
  {
    question: "What documents can I review in the prototype?",
    answer:
      "The demo is suited for fictional Medicaid renewal notices, closure or termination notices, action-required letters, case status letters, and local pasted notice text.",
  },
  {
    question: "Does this store real documents or PHI?",
    answer:
      "No. The project is frontend-only. It uses sample data and browser-local text for the prototype, and it is not a real PHI workflow.",
  },
  {
    question: "Is this legal or agency advice?",
    answer:
      "No. It is informational guidance for a hackathon prototype. Always verify deadlines, submission options, appeal rights, and status with the agency or a qualified human reviewer.",
  },
  {
    question: "What should happen when escalation is flagged?",
    answer:
      "Use the generated summary to brief a navigator, advocate, case worker, or other qualified reviewer before relying on the packet.",
  },
];

export const heroPreviewRows = [
  {
    label: "Notice summary",
    value: "Renewal notice says Medicaid may close unless proof of income is received.",
  },
  {
    label: "Exact blocker",
    value: "Missing income verification is preventing the case from being document-ready.",
  },
  {
    label: "What to verify",
    value: "Deadline, acceptable proof, submission channel, and confirmation number.",
  },
  {
    label: "Rescue path",
    value: "Gather verification, prepare packet, and escalate if the deadline is missed.",
  },
];

export const previewChecklist = [
  "Attach the original notice",
  "Match documents to the patient and case",
  "Save proof of submission or confirmation",
];
