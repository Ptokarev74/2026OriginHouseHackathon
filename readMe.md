Product concept
Coverage-to-Care Rescue
 An agent that notices a patient is at risk of a Medicaid coverage lapse, prepares the renewal/rescue steps, then finds and books a provider who actually accepts the patient’s insurance, so the patient does not fall through the gap between coverage and care.
This is a good 24-hour wedge because it joins two real workflows that are still messy: Medicaid renewal operations and provider access. Medicaid renewals are rule-driven and time-sensitive, states must attempt an ex parte renewal first and request only the needed information if that is not enough, and CMS says that beginning with renewals initiated in January 2026, states must initiate and complete renewals timely under federal rules. On the access side, CMS requires public Provider Directory APIs for Medicare Advantage, Medicaid fee-for-service, Medicaid managed care, CHIP fee-for-service, and CHIP managed care, and Medicare already offers Care Compare for provider search. CMS’s updated hospital price-transparency requirements are also in force for 2026, with enforcement of new and revised requirements beginning April 1, 2026.
The sharp framing
Do not pitch it as “an AI that helps with insurance and referrals.”
Pitch it as:
“When a low-income patient is at risk of losing coverage and needs follow-up care, our agent rescues the coverage steps, searches the right provider networks, ranks viable options, and closes the referral.”
That sounds specific and agentic.
Best target user
Use one primary persona:
A Medicaid or dual-eligible patient leaving the ED or PCP with a specialist referral, while their renewal is due or their coverage status is uncertain.
That keeps the story coherent. It also lets you include providers that take Medicare in the search layer, especially for dual-eligible patients or Medicare Advantage patients, without pretending Medicare has the same renewal flow as Medicaid. The renewal-rescue portion is mainly a Medicaid/CHIP workflow.
Problem statement
Patients often face two linked failures:
They are missing paperwork or are near a coverage lapse.
Even if they still need care, they do not know which provider actually takes their plan.
So care gets delayed not because the referral is clinically unclear, but because the operational path is broken.
What the product actually does
Input
A sample packet containing:
renewal notice or coverage-risk flag
referral order or discharge summary
insurance type
ZIP code
patient preferences like distance or language
Agent loop
The agent should do this end to end:
Read coverage documents
extract renewal due date
detect missing documents
classify coverage type
Decide the next coverage step
if ex parte renewal looks likely, mark low friction
if documentation is missing, generate a checklist
if coverage looks at risk, label the case urgent
Read the referral
extract specialty
extract urgency
detect whether imaging, PCP follow-up, or specialist care is needed
Search viable providers
Medicare providers from Care Compare
plan/network providers from public Provider Directory APIs
normalize identities with NPI/NPPES if you use it
Rank providers
accepts insurance
specialty match
distance
earliest slot
optional price signal
Take actions
prepare renewal packet/checklist
choose provider
draft record-transfer request
create booking request or simulated booking
generate transportation/reminder plan
Verify completion
show status as “coverage rescue in progress,” “provider found,” “appointment secured,” or “needs escalation”
That qualifies as agentic because it reads data, makes decisions, uses external tools, takes multi-step actions, and checks whether the workflow is finished.
What to build in 24 hours
Keep the MVP narrow.
MVP promise
“Given a renewal notice and a referral, our agent outputs the correct next coverage step, finds providers that accept the patient’s insurance, ranks them, and books the best option in a demo flow.”
That is enough.
MVP features
upload or choose a sample patient case
document parser for renewal notice + referral
coverage-risk classifier
provider search aggregator
ranking engine
one-click “run agent”
final case dashboard
Do not build
real eligibility adjudication
real payer submission to a state system
full production scheduling integrations
legal advice engine
Say clearly that it is a navigation and workflow automation tool, not a benefits determination system.
Suggested tech stack
Front end
Next.js or React
clean case dashboard with step status
Agent orchestration
LangGraph, Temporal, or a simple state machine
use explicit steps, not a vague chatbot loop
Document extraction
OCR only if needed
otherwise parse structured PDFs or plain text
LLM for field extraction into JSON
Search/data
Medicare Care Compare data/search for Medicare-facing provider lookup
public Provider Directory APIs for MA/Medicaid/CHIP networks
optional hospital price-transparency files if you want a cost-aware tie-breaker
Messaging/actions
Gmail/SMTP mock
Twilio mock SMS
calendar invite mock
simulated “book appointment” endpoint if real booking is too hard
Real vs mocked integrations
For a hackathon, judges do not need every backend to be real. They need the loop to be believable.
Make real if possible
document parsing
provider search
ranking logic
dashboard state transitions
Safe to mock
renewal submission
provider scheduling
records fax/transfer
transportation booking
Present those as “connected via simulated partner APIs for the demo.”
The ranking logic
Keep it simple and visible.
Example weighted score:
insurance match: 40%
specialty match: 20%
distance: 15%
availability: 15%
price signal: 10%
Show the judge why Provider A beat Provider B.
That makes the system feel like a product, not a magic trick.
Demo scenario
Use one polished case.
Sample patient
62-year-old dual-eligible or Medicaid patient
cardiology referral after ED discharge
renewal due soon
no car
needs provider within 15 miles
What happens on stage
Upload renewal letter and discharge/referral note.
Agent extracts missing documentation and urgency.
Agent says: “Coverage at risk within 14 days; cardiology follow-up needed within 7 days.”
Agent searches Medicare and network-compatible providers.
Agent ranks three viable options.
Agent chooses one based on insurance acceptance, distance, and earliest availability.
Agent drafts renewal checklist, sends record-transfer request, and simulates booking.
Final screen says: Care secured; next task: upload proof of income by Tuesday.
That is a strong live demo.
Three-minute pitch structure
1. Problem
“Patients do not just lose coverage. They lose access to care because coverage confusion and referral friction happen at the same time.”
2. Product
“Coverage-to-Care Rescue is an autonomous agent that turns a renewal notice and referral into a real next step.”
3. Agent behavior
“It reads the documents, determines what is missing, searches real provider sources, ranks viable providers, and closes the loop with booking and follow-up.”
4. Why now
“CMS has made more provider directory and interoperability infrastructure available, and Medicaid renewals are again a major operational workflow states must process timely starting in 2026.”
5. Outcome
“Instead of giving people information, we secure care.”
What makes it stand out
The novelty is not the model. It is the workflow boundary.
Most healthcare demos stop at:
“here is some advice”
“here is a list of providers”
“here is a summary of your document”
Yours should end at:
provider selected
coverage step identified
appointment booked
case status closed
That is much stronger.
Good team split for overnight build
Person 1
Front end and dashboard
Person 2
Document extraction and agent state machine
Person 3
Provider search, ranking, and mock booking APIs
If you only have two people, combine front end with orchestration and keep integrations minimal.
Stretch goals if time remains
transportation risk flag
bilingual patient instructions
cost-aware tie-breaker from price-transparency data
escalation path when no provider accepts the plan nearby
Strong one-line title options
Coverage-to-Care Rescue
BridgeCare
Renew & Refer
AccessBridge
CloseTheGap Health
Best final recommendation
For the hackathon, pitch this as:
“Coverage-to-Care Rescue: an autonomous agent for Medicaid and Medicare-adjacent patients that rescues coverage steps and closes specialist referrals.”
That is specific, useful, and demoable.



