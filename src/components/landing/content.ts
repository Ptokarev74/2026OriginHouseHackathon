import { copyLanguage, type AppLanguage, type CopyLanguage } from "@/lib/i18n/types";

type LandingContent = {
    header: {
      homeLabel: string;
      subtitle: string;
      nav: Array<{ href: string; label: string }>;
      startDemo: string;
    };
    hero: {
      title: string;
      copy: string;
      secondaryCopy: string;
      startDemo: string;
      seeExample: string;
    };
    trustPills: string[];
    benefitStrip: string[];
    reassuranceItems: Array<{ title: string; copy: string }>;
    sectionHeadings: {
      why: { eyebrow: string; title: string; copy: string };
      common: { eyebrow: string; title: string; copy: string };
      reviews: { eyebrow: string; title: string; copy: string; limit: string };
      leaveWith: { eyebrow: string; title: string; copy: string };
      how: { eyebrow: string; title: string; copy: string };
      faq: { eyebrow: string; title: string; copy: string };
      finalCta: {
        eyebrow: string;
        title: string;
        copy: string;
        startDemo: string;
        reviewLimits: string;
        bullets: string[];
      };
      trust: { eyebrow: string; title: string; copy: string; limits: string[] };
    };
    matterItems: Array<{ title: string; copy: string }>;
    commonSituations: Array<{ title: string; copy: string }>;
    reviewTypes: Array<{ title: string; examples: string }>;
    leaveWithItems: string[];
    workflowSteps: Array<{ step: string; title: string; copy: string }>;
    faqs: Array<{ question: string; answer: string }>;
    heroPreview: {
      ariaLabel: string;
      badge: string;
      eyebrow: string;
      title: string;
      copy: string;
      packet: string;
      readyQuestionTitle: string;
      readyQuestion: string;
      checklistTitle: string;
      rows: Array<{ label: string; value: string }>;
      checklist: string[];
    };
    exampleOutput: {
      eyebrow: string;
      title: string;
      copy: string;
      flaggedTitle: string;
      flaggedCopy: string;
      detailsTitle: string;
      detailsCopy: string;
      questionsTitle: string;
      questions: string[];
    };
};

export const landingContent: Record<CopyLanguage, LandingContent> = {
  en: {
    header: {
      homeLabel: "Notice-to-Rescue home",
      subtitle: "Medicaid notice agent",
      nav: [
        { href: "#why-it-matters", label: "Why it matters" },
        { href: "#common-situations", label: "Notice moments" },
        { href: "#what-it-reviews", label: "What it reviews" },
        { href: "#how-it-works", label: "How it works" },
        { href: "#trust-limits", label: "Trust & limits" },
      ],
      startDemo: "Start demo",
    },
    hero: {
      title:
        "Rescue Medicaid coverage before a confusing notice becomes an interruption.",
      copy:
        "Notice-to-Rescue reads fictional Medicaid notice packets or local pasted text, finds the exact coverage blocker, and turns dense agency language into a clear rescue path.",
      secondaryCopy:
        "It prepares next-step artifacts for the demo flow, while leaving official eligibility decisions, submissions, and legal guidance to the appropriate agency or qualified reviewer.",
      startDemo: "Start rescue demo",
      seeExample: "See example output",
    },
    trustPills: [
      "Plain-English Medicaid notice guidance",
      "Blocker and readiness check",
      "Frontend-only demo",
    ],
    benefitStrip: [
      "Read renewal and closure notices",
      "Identify exact coverage blockers",
      "Prepare packets and escalation notes",
    ],
    reassuranceItems: [
      {
        title: "Plain-English notice review",
        copy:
          "Summaries explain what a Medicaid notice appears to request, not official eligibility decisions.",
      },
      {
        title: "Blocker-focused workflow",
        copy:
          "The demo centers on the missing requirement, deadline, and readiness status for the next step.",
      },
      {
        title: "Simulated only",
        copy:
          "This frontend demo does not contact agencies, submit paperwork, store real documents, or manage PHI.",
      },
    ],
    sectionHeadings: {
      why: {
        eyebrow: "Why this matters",
        title: "Small notice details can put coverage at risk.",
        copy:
          "Medicaid action notices often arrive with tight deadlines and dense wording. Notice-to-Rescue is designed for the urgent moment when someone needs to understand the exact blocker and what to do next.",
      },
      common: {
        eyebrow: "Common situations",
        title: "Built for the notice moments people actually bring.",
        copy:
          "The prototype works best when there is a Medicaid notice in front of you and a concrete coverage-risk question to resolve.",
      },
      reviews: {
        eyebrow: "What it reviews",
        title: "Bring the paperwork that explains the risk.",
        copy:
          "Notice-to-Rescue looks for useful context in the document and organizes it into a focused, reviewable case summary.",
        limit:
          "It can help prepare a response path. It cannot confirm eligibility, submit documents, contact an agency, or provide legal advice.",
      },
      leaveWith: {
        eyebrow: "What you leave with",
        title: "A clearer path from notice to next action.",
        copy:
          "The goal is not to replace an official answer. It is to help you understand the blocker, see whether the case is document-ready, and know when escalation may be needed.",
      },
      how: {
        eyebrow: "How Notice-to-Rescue works",
        title: "From confusing notice to prepared next step.",
        copy:
          "A short workflow keeps the review focused on blocker detection, readiness, and the next rescue action.",
      },
      faq: {
        eyebrow: "FAQ",
        title: "Clear answers about what the demo can and cannot do.",
        copy:
          "Notice-to-Rescue is intentionally careful: useful for preparation, limited when an official answer or human judgment is required.",
      },
      finalCta: {
        eyebrow: "Try the demo",
        title:
          "Start with one Medicaid notice and leave with a clearer rescue path.",
        copy:
          "Use Notice-to-Rescue to identify the blocker, check whether the case is ready, and prepare simulated next-step artifacts for the prototype workflow.",
        startDemo: "Start rescue demo",
        reviewLimits: "Review demo limits",
        bullets: [
          "Guidance only, not an official Medicaid determination",
          "No agency contact or document submission is made",
          "Designed for preparation before human review or follow-up",
        ],
      },
      trust: {
        eyebrow: "Trust & limits",
        title: "Informational guidance, not an official decision.",
        copy:
          "Notice-to-Rescue is a Medicaid notice rescue demo for explaining risk language and preparing simulated follow-up artifacts. It does not determine eligibility, submit paperwork, contact agencies, provide legal advice, store real documents, or manage real PHI workflows.",
        limits: [
          "Always confirm status, deadlines, submission options, and appeal rights with the agency or a qualified reviewer.",
          "Do not use this demo for emergencies, legal decisions, or real case management workflows.",
          "Do not enter real sensitive health information or real documents into this frontend demo.",
          "Use generated artifacts as preparation prompts, not as final answers or agency submissions.",
        ],
      },
    },
    matterItems: [
      {
        title: "Coverage can close quickly",
        copy:
          "A renewal or action-required notice may give a short window before benefits are interrupted.",
      },
      {
        title: "The blocker is often buried",
        copy:
          "The key missing item may be a proof of income, residency document, or clarification hidden in dense text.",
      },
      {
        title: "Deadlines need attention",
        copy:
          "The difference between ready to submit and escalation needed can depend on a single response date.",
      },
      {
        title: "Conflicting records happen",
        copy:
          "A notice and status letter may point to different facts, making human review important before action.",
      },
      {
        title: "Packets need to be complete",
        copy:
          "A response is stronger when the notice, verification, case details, and confirmation plan are organized.",
      },
      {
        title: "Escalation should be clear",
        copy:
          "Notice-to-Rescue helps distinguish routine document gathering from cases that need a navigator or advocate.",
      },
    ],
    commonSituations: [
      {
        title: "A renewal warning arrived",
        copy:
          "The notice says Medicaid may close unless proof of income or another verification is submitted.",
      },
      {
        title: "An action-required notice is unclear",
        copy:
          "The letter names a response date, but the exact document needed is easy to miss.",
      },
      {
        title: "A termination notice has already passed",
        copy:
          "Coverage appears scheduled to end, so the case may need appeal or reinstatement review.",
      },
      {
        title: "Two documents conflict",
        copy:
          "A case status letter and notice do not agree on income, residency, or eligibility details.",
      },
      {
        title: "A patient has partial paperwork",
        copy:
          "Some verification is ready, but the packet may still be missing a required item or confirmation step.",
      },
      {
        title: "Someone pasted local notice text",
        copy:
          "The prototype can review fictional sample packets or browser-local pasted text for the demo flow.",
      },
    ],
    reviewTypes: [
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
        examples:
          "Coverage may close, case will close, failure to respond, deadline passed",
      },
      {
        title: "Submission instructions",
        examples:
          "Where to send documents, what to include, confirmation reminders",
      },
      {
        title: "Escalation signals",
        examples: "Low-confidence extraction, conflicting records, overdue cases",
      },
    ],
    leaveWithItems: [
      "Plain-English explanation of the notice",
      "Exact blocker putting coverage at risk",
      "Deadline, urgency, and readiness status",
      "Missing-requirements checklist",
      "Simulated submission or escalation packet",
      "Printable follow-up summary for outside review",
    ],
    workflowSteps: [
      {
        step: "01",
        title: "Choose or paste a notice",
        copy:
          "Start with a fictional Medicaid notice packet or paste local text into the browser-only demo.",
      },
      {
        step: "02",
        title: "Review extracted fields",
        copy:
          "Confirm the notice type, deadline, Medicaid program, risk language, and requested documents.",
      },
      {
        step: "03",
        title: "Run the rescue agent",
        copy:
          "The local workflow identifies the exact blocker, urgency, rescue path, and document readiness.",
      },
      {
        step: "04",
        title: "Prepare the next action",
        copy:
          "Leave with simulated packet artifacts, escalation notes, and a printable summary for follow-up.",
      },
    ],
    faqs: [
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
    ],
    heroPreview: {
      ariaLabel: "Sample Notice-to-Rescue review preview",
      badge: "Packet-ready review",
      eyebrow: "Sample output",
      title: "Medicaid renewal notice review",
      copy: "Plain-English review for a missing income verification blocker.",
      packet: "Demo packet",
      readyQuestionTitle: "Ready-to-ask question",
      readyQuestion:
        "What exact proof of income is acceptable, and how can I confirm the packet was received before the response deadline?",
      checklistTitle: "Next-step checklist",
      rows: [
        {
          label: "Notice summary",
          value:
            "Renewal notice says Medicaid may close unless proof of income is received.",
        },
        {
          label: "Exact blocker",
          value:
            "Missing income verification is preventing the case from being document-ready.",
        },
        {
          label: "What to verify",
          value:
            "Deadline, acceptable proof, submission channel, and confirmation number.",
        },
        {
          label: "Rescue path",
          value:
            "Gather verification, prepare packet, and escalate if the deadline is missed.",
        },
      ],
      checklist: [
        "Attach the original notice",
        "Match documents to the patient and case",
        "Save proof of submission or confirmation",
      ],
    },
    exampleOutput: {
      eyebrow: "Example summary",
      title: "Prepared rescue notes",
      copy:
        "The notice appears to warn that Medicaid may close unless income verification is submitted before the listed response date.",
      flaggedTitle: "Flagged detail",
      flaggedCopy:
        "Missing proof of income is the blocker. Confirm acceptable documents before sending the packet.",
      detailsTitle: "Details to verify",
      detailsCopy:
        "Deadline, case identifier, submission channel, required proof, and confirmation method.",
      questionsTitle: "Questions to ask",
      questions: [
        "Which proof of income documents will satisfy this notice?",
        "How should the packet be submitted for this Medicaid case?",
        "What confirmation number or receipt should be saved?",
      ],
    },
  },
  so: {
    header: {
      homeLabel: "Bogga hore ee Notice-to-Rescue",
      subtitle: "Wakiilka ogeysiisyada Medicaid",
      nav: [
        { href: "#why-it-matters", label: "Sababta ay muhiim u tahay" },
        { href: "#common-situations", label: "Xilliyada ogeysiiska" },
        { href: "#what-it-reviews", label: "Waxa uu eego" },
        { href: "#how-it-works", label: "Sida uu u shaqeeyo" },
        { href: "#trust-limits", label: "Kalsooni iyo xad" },
      ],
      startDemo: "Bilow demo",
    },
    hero: {
      title:
        "Badbaadi caymiska Medicaid ka hor inta ogeysiis wareer leh uusan noqon hakad.",
      copy:
        "Notice-to-Rescue wuxuu akhriyaa xirmooyin ogeysiisyo Medicaid oo tusaale ah ama qoraal gudaha lagu dhajiyay, wuxuu helaa xannibaadda caymiska ee saxda ah, wuxuuna luqadda adag ee hay'adda u beddelaa waddo badbaadin oo cad.",
      secondaryCopy:
        "Wuxuu diyaariyaa waxyaabaha tallaabada xigta ee socodka demo-ga, isagoo go'aannada rasmiga ah ee u-qalmitaanka, gudbinta, iyo hagidda sharci uga tagaya hay'adda ku habboon ama qof dib-u-eegis u qalma.",
      startDemo: "Bilow demo badbaadin",
      seeExample: "Arag tusaale natiijo",
    },
    trustPills: [
      "Hagid cad oo ku saabsan ogeysiisyada Medicaid",
      "Hubinta xannibaadda iyo diyaar ahaanshaha",
      "Demo frontend oo keliya",
    ],
    benefitStrip: [
      "Akhri ogeysiisyada cusboonaysiinta iyo xiritaanka",
      "Aqoonso xannibaadaha caymiska ee saxda ah",
      "Diyaari xirmooyin iyo qoraallo kor-u-qaadis",
    ],
    reassuranceItems: [
      {
        title: "Dib-u-eegis ogeysiis oo luqad cad ah",
        copy:
          "Soo koobiddu waxay sharxaysaa waxa ogeysiiska Medicaid u muuqdo inuu codsanayo, ma aha go'aanno rasmi ah oo u-qalmitaan.",
      },
      {
        title: "Socod diiradda saaraya xannibaadda",
        copy:
          "Demo-gu wuxuu diiradda saaraa shuruudda maqan, waqtiga kama dambaysta ah, iyo heerka diyaar ahaanshaha tallaabada xigta.",
      },
      {
        title: "Kaliya mid la matalay",
        copy:
          "Demo-gan frontend ma la xiriiro hay'ado, ma gudbiyo waraaqo, ma kaydiyo dukumiintiyo dhab ah, mana maamulo PHI.",
      },
    ],
    sectionHeadings: {
      why: {
        eyebrow: "Sababta ay muhiim u tahay",
        title: "Faahfaahin yar oo ogeysiis ah waxay halis gelin kartaa caymiska.",
        copy:
          "Ogeysiisyada ficilka Medicaid badanaa waxay yimaadaan iyadoo waqtigu kooban yahay iyo qoraal adag. Notice-to-Rescue waxaa loogu talagalay daqiiqadda degdegga ah ee qof u baahan yahay inuu fahmo xannibaadda saxda ah iyo waxa xiga ee la sameeyo.",
      },
      common: {
        eyebrow: "Xaaladaha caadiga ah",
        title: "Waxaa loo dhisay xilliyada ogeysiiska ee dadka dhab ahaantii keenaan.",
        copy:
          "Nooca tijaabada wuxuu si fiican u shaqeeyaa marka ogeysiis Medicaid hortaada yaallo oo aad hayso su'aal caymis-haliseed oo gaar ah oo la xallinayo.",
      },
      reviews: {
        eyebrow: "Waxa uu eego",
        title: "Keen waraaqaha sharxaya halista.",
        copy:
          "Notice-to-Rescue wuxuu dukumiintiga ka raadiyaa macluumaad faa'iido leh wuxuuna u habeeyaa soo koobid kiis oo diiradda leh oo dib loo eegi karo.",
        limit:
          "Wuxuu kaa caawin karaa diyaarinta waddo jawaab. Ma xaqiijin karo u-qalmitaan, ma gudbin karo dukumiintiyo, ma la xiriiri karo hay'ad, mana bixin karo talo sharci.",
      },
      leaveWith: {
        eyebrow: "Waxa aad la baxdo",
        title: "Waddo ka cad laga bilaabo ogeysiiska ilaa tallaabada xigta.",
        copy:
          "Ujeeddadu ma aha in la beddelo jawaab rasmi ah. Waa in lagaa caawiyo fahamka xannibaadda, in la arko haddii kiisku dukumiinti ahaan diyaar yahay, iyo in la ogaado goorta kor-u-qaadis loo baahan karo.",
      },
      how: {
        eyebrow: "Sida Notice-to-Rescue u shaqeeyo",
        title: "Ogeysiis wareer leh ilaa tallaabo xigta oo diyaarsan.",
        copy:
          "Socod gaaban ayaa dib-u-eegista ku haya ogaanshaha xannibaadda, diyaar ahaanshaha, iyo tallaabada badbaadinta ee xigta.",
      },
      faq: {
        eyebrow: "Su'aalo",
        title: "Jawaabo cad oo ku saabsan waxa demo-gu sameyn karo iyo waxa uusan sameyn karin.",
        copy:
          "Notice-to-Rescue si taxaddar leh ayaa loo sameeyay: wuxuu waxtar u leeyahay diyaarinta, balse wuu xaddidan yahay marka jawaab rasmi ah ama qiimeyn bini'aadan loo baahan yahay.",
      },
      finalCta: {
        eyebrow: "Tijaabi demo-ga",
        title:
          "Ku bilow hal ogeysiis Medicaid oo la bax waddo badbaadin oo ka cad.",
        copy:
          "Isticmaal Notice-to-Rescue si aad u aqoonsato xannibaadda, u hubiso in kiisku diyaar yahay, una diyaariso waxyaabo la matalay oo tallaabada xigta ah.",
        startDemo: "Bilow demo badbaadin",
        reviewLimits: "Eeg xadidaadaha demo-ga",
        bullets: [
          "Hagid keliya, ma aha go'aan rasmi ah oo Medicaid",
          "Lama sameeyo xiriir hay'ad ama gudbin dukumiinti",
          "Waxaa loogu talagalay diyaarinta ka hor dib-u-eegis bini'aadan ama dabagal",
        ],
      },
      trust: {
        eyebrow: "Kalsooni iyo xad",
        title: "Hagid macluumaad ah, ma aha go'aan rasmi ah.",
        copy:
          "Notice-to-Rescue waa demo badbaadin ogeysiis Medicaid ah oo sharxaya luqadda halista isla markaana diyaariya waxyaabo dabagal oo la matalay. Ma go'aamiyo u-qalmitaan, ma gudbiyo waraaqo, ma la xiriiro hay'ado, ma bixiyo talo sharci, ma kaydiyo dukumiintiyo dhab ah, mana maamulo socod PHI oo dhab ah.",
        limits: [
          "Mar walba ka xaqiiji xaaladda, waqtiyada kama dambaysta ah, ikhtiyaarrada gudbinta, iyo xuquuqda racfaanka hay'adda ama qof dib-u-eegis u qalma.",
          "Ha u isticmaalin demo-gan xaalado degdeg ah, go'aanno sharci, ama maareyn kiis oo dhab ah.",
          "Ha gelin macluumaad caafimaad oo xasaasi ah ama dukumiintiyo dhab ah demo-gan frontend.",
          "U isticmaal waxyaabaha la soo saaro sidii tilmaamo diyaarinta ah, ma aha jawaabo kama dambays ah ama gudbin hay'ad.",
        ],
      },
    },
    matterItems: [
      {
        title: "Caymisku si degdeg ah ayuu u xirmi karaa",
        copy:
          "Ogeysiis cusboonaysiin ama ficil loo baahan yahay wuxuu bixin karaa waqti gaaban ka hor inta faa'iidooyinka la joojin.",
      },
      {
        title: "Xannibaaddu badanaa way qarsoon tahay",
        copy:
          "Waxa muhiimka ah ee maqan wuxuu noqon karaa caddeyn dakhli, dukumiinti deggenaansho, ama faahfaahin ku qarsoon qoraal adag.",
      },
      {
        title: "Waqtiyada kama dambaysta ah waxay u baahan yihiin feejignaan",
        copy:
          "Farqiga u dhexeeya diyaar u ah gudbin iyo kor-u-qaadis loo baahan yahay wuxuu ku xirnaan karaa hal taariikh jawaab.",
      },
      {
        title: "Diiwaanno is khilaafsan way dhici karaan",
        copy:
          "Ogeysiis iyo warqad xaalad kiis waxay tilmaami karaan xaqiiqooyin kala duwan, taasoo ka dhigaysa dib-u-eegis bini'aadan muhiim ka hor ficil.",
      },
      {
        title: "Xirmooyinku waa inay dhammaystirnaadaan",
        copy:
          "Jawaabtu way xoog badan tahay marka ogeysiiska, caddeynta, faahfaahinta kiiska, iyo qorshaha xaqiijintu habaysan yihiin.",
      },
      {
        title: "Kor-u-qaadistu waa inay caddahay",
        copy:
          "Notice-to-Rescue wuxuu kala saaraa ururinta dukumiintiyada caadiga ah iyo kiisaska u baahan hagaha ama u-doodaha.",
      },
    ],
    commonSituations: [
      {
        title: "Digniin cusboonaysiin ayaa timid",
        copy:
          "Ogeysiisku wuxuu sheegayaa in Medicaid xirmi karto haddii aan la gudbin caddeyn dakhli ama caddeyn kale.",
      },
      {
        title: "Ogeysiis ficil loo baahan yahay ma cadda",
        copy:
          "Warqaddu waxay sheegaysaa taariikh jawaab, laakiin dukumiintiga saxda ah ee loo baahan yahay si fudud ayaa loo seegi karaa.",
      },
      {
        title: "Ogeysiis joojin ah wuu dhaafay",
        copy:
          "Caymisku wuxuu u muuqdaa inuu dhammaanayo, sidaas darteed kiisku wuxuu u baahan karaa racfaan ama dib-u-soo-celin.",
      },
      {
        title: "Laba dukumiinti ayaa is khilaafsan",
        copy:
          "Warqadda xaaladda kiiska iyo ogeysiisku iskuma raacsana dakhli, deggenaansho, ama faahfaahinta u-qalmitaanka.",
      },
      {
        title: "Qofku wuxuu haystaa waraaqo qayb ahaan ah",
        copy:
          "Qaar ka mid ah caddeynta way diyaar tahay, laakiin xirmadu weli waxay seegi kartaa shuruud ama tallaabo xaqiijin.",
      },
      {
        title: "Qof ayaa dhajiyay qoraalka ogeysiiska gudaha",
        copy:
          "Nooca tijaabada wuxuu dib u eegi karaa xirmooyin tusaale ah ama qoraal browser-ka gudihiisa lagu dhajiyay.",
      },
    ],
    reviewTypes: [
      {
        title: "Ogeysiisyada cusboonaysiinta Medicaid",
        examples:
          "Digniino cusboonaysiin, codsiyo caddeyn maqan, waqtiyo kama dambays ah",
      },
      {
        title: "Warqadaha xiritaanka iyo joojinta",
        examples:
          "Taariikho dhammaadka caymiska, digniino xiritaan, luqad taariikh dhaaftay",
      },
      {
        title: "Ogeysiisyada ficil loo baahan yahay",
        examples:
          "Caddeyn dakhli, caddeyn deggenaansho, liisaska dukumiintiyada la codsaday",
      },
      {
        title: "Warqadaha xaaladda kiiska",
        examples:
          "Cusboonaysiinta hay'adda, faahfaahin is khilaafsan, calaamadaha u-qalmitaanka",
      },
      {
        title: "Caddeymo taageero ah",
        examples:
          "Jeegag mushahar, warqado shaqo-bixiye, heshiisyo kirayn, biilasha adeegga, boosto rasmi ah",
      },
      {
        title: "Luqadda halista iyo degdegga",
        examples:
          "Caymisku wuu xirmi karaa, kiisku wuu xirmayaa, jawaab la'aan, taariikh dhaaftay",
      },
      {
        title: "Tilmaamaha gudbinta",
        examples:
          "Meesha dukumiintiyada loo diro, waxa lagu daro, xasuusin xaqiijin",
      },
      {
        title: "Calaamadaha kor-u-qaadista",
        examples:
          "Soo saarid kalsooni hoose leh, diiwaanno is khilaafsan, kiisas waqtigoodii dhaafay",
      },
    ],
    leaveWithItems: [
      "Sharaxaad ogeysiis oo luqad cad ah",
      "Xannibaadda saxda ah ee caymiska halis gelinaysa",
      "Waqtiga kama dambaysta ah, degdegga, iyo heerka diyaar ahaanshaha",
      "Liiska shuruudaha maqan",
      "Xirmo gudbin ama kor-u-qaadis oo la matalay",
      "Soo koobid la daabici karo oo dib-u-eegis dibadda ah",
    ],
    workflowSteps: [
      {
        step: "01",
        title: "Dooro ama dhaji ogeysiis",
        copy:
          "Ku bilow xirmo ogeysiis Medicaid oo tusaale ah ama ku dhaji qoraal gudaha demo-ga browser-ka keliya.",
      },
      {
        step: "02",
        title: "Dib u eeg meelaha la soo saaray",
        copy:
          "Xaqiiji nooca ogeysiiska, waqtiga kama dambaysta ah, barnaamijka Medicaid, luqadda halista, iyo dukumiintiyada la codsaday.",
      },
      {
        step: "03",
        title: "Socodsii wakiilka badbaadinta",
        copy:
          "Socodka gudaha wuxuu aqoonsadaa xannibaadda saxda ah, degdegga, waddada badbaadinta, iyo diyaar ahaanshaha dukumiintiyada.",
      },
      {
        step: "04",
        title: "Diyaari tallaabada xigta",
        copy:
          "La bax waxyaabo xirmo oo la matalay, qoraallo kor-u-qaadis, iyo soo koobid daabacan oo dabagal ah.",
      },
    ],
    faqs: [
      {
        question: "Tani ma go'aamisaa in qof Medicaid u qalmo?",
        answer:
          "Maya. Notice-to-Rescue wuxuu sharxayaa luqadda ogeysiiska wuxuuna diyaariyaa tallaabooyinka xiga, laakiin ma go'aamiyo u-qalmitaanka Medicaid, xaaladda caymiska, ama xuquuqda racfaanka.",
      },
      {
        question: "Tani ma u gudbin kartaa dukumiintiyo hay'ad?",
        answer:
          "Maya. Demo-gu wuxuu diyaarin karaa waxyaabo xirmo oo la matalay, laakiin ma gudbiyo waraaqo, ma la xiriiro hay'ado, ma abuuro koontooyin, mana kaydiyo xaqiijino.",
      },
      {
        question: "Dukumiintiyo noocee ah ayaan ku eegi karaa nooca tijaabada?",
        answer:
          "Demo-gu wuxuu ku habboon yahay ogeysiisyo cusboonaysiin Medicaid oo tusaale ah, ogeysiisyo xiritaan ama joojin, warqado ficil loo baahan yahay, warqado xaalad kiis, iyo qoraal ogeysiis gudaha lagu dhajiyay.",
      },
      {
        question: "Ma kaydiyaa dukumiintiyo dhab ah ama PHI?",
        answer:
          "Maya. Mashruucu waa frontend oo keliya. Wuxuu isticmaalaa xog tusaale ah iyo qoraal browser-ka gudihiisa ah, mana aha socod PHI oo dhab ah.",
      },
      {
        question: "Tani ma talo sharci ama talo hay'ad baa?",
        answer:
          "Maya. Waa hagid macluumaad oo loogu talagalay nooc tijaabo hackathon ah. Mar walba ka xaqiiji waqtiyada kama dambaysta ah, ikhtiyaarrada gudbinta, xuquuqda racfaanka, iyo xaaladda hay'adda ama qof dib-u-eegis u qalma.",
      },
      {
        question: "Maxaa dhici kara marka kor-u-qaadis la calaamadiyo?",
        answer:
          "Isticmaal soo koobidda la soo saaray si aad ugu wargeliso hage, u-doodaha, shaqaale kiis, ama qof kale oo dib-u-eegis u qalma ka hor intaadan ku tiirsanaan xirmada.",
      },
    ],
    heroPreview: {
      ariaLabel: "Muuqaal tusaale ah oo dib-u-eegista Notice-to-Rescue",
      badge: "Dib-u-eegis xirmo diyaar ah",
      eyebrow: "Natiijo tusaale ah",
      title: "Dib-u-eegista ogeysiiska cusboonaysiinta Medicaid",
      copy: "Dib-u-eegis luqad cad ah oo ku saabsan xannibaad caddeyn dakhli maqan.",
      packet: "Xirmo demo",
      readyQuestionTitle: "Su'aal diyaar u ah in la weydiiyo",
      readyQuestion:
        "Caddeynta dakhliga ee saxda ah ee la aqbali karo waa maxay, sideense u xaqiijin karaa in xirmada la helay ka hor waqtiga jawaabta?",
      checklistTitle: "Liiska tallaabooyinka xiga",
      rows: [
        {
          label: "Soo koobidda ogeysiiska",
          value:
            "Ogeysiiska cusboonaysiintu wuxuu sheegayaa in Medicaid xirmi karto haddii aan la helin caddeyn dakhli.",
        },
        {
          label: "Xannibaadda saxda ah",
          value:
            "Caddeynta dakhliga ee maqan ayaa ka hor istaagaysa kiiska inuu dukumiinti ahaan diyaar noqdo.",
        },
        {
          label: "Waxa la xaqiijinayo",
          value:
            "Waqtiga kama dambaysta ah, caddeynta la aqbali karo, kanaalka gudbinta, iyo lambarka xaqiijinta.",
        },
        {
          label: "Waddada badbaadinta",
          value:
            "Ururi caddeynta, diyaari xirmada, oo kor u qaad haddii waqtigu dhaafo.",
        },
      ],
      checklist: [
        "Ku dar ogeysiiska asalka ah",
        "Ku xir dukumiintiyada qofka iyo kiiska",
        "Kaydi caddeynta gudbinta ama xaqiijinta",
      ],
    },
    exampleOutput: {
      eyebrow: "Soo koobid tusaale ah",
      title: "Qoraallo badbaadin oo diyaarsan",
      copy:
        "Ogeysiisku wuxuu u muuqdaa inuu digniin ka bixinayo in Medicaid xirmi karto haddii caddeynta dakhliga aan la gudbin ka hor taariikhda jawaabta ee ku qoran.",
      flaggedTitle: "Faahfaahin la calaamadiyay",
      flaggedCopy:
        "Caddeynta dakhliga ee maqan waa xannibaadda. Xaqiiji dukumiintiyada la aqbali karo ka hor intaadan dirin xirmada.",
      detailsTitle: "Faahfaahinta la xaqiijinayo",
      detailsCopy:
        "Waqtiga kama dambaysta ah, aqoonsiga kiiska, kanaalka gudbinta, caddeynta loo baahan yahay, iyo habka xaqiijinta.",
      questionsTitle: "Su'aalaha la weydiinayo",
      questions: [
        "Dukumiintiyada caddeynta dakhliga ee ogeysiiskan buuxin kara waa kuwee?",
        "Sidee loo gudbinayaa xirmada kiiskan Medicaid?",
        "Lambarkee xaqiijin ama rasiid ah ayaa la kaydinayaa?",
      ],
    },
  },
  es: {
    header: {
      homeLabel: "Inicio de Notice-to-Rescue",
      subtitle: "Agente para avisos de Medicaid",
      nav: [
        { href: "#why-it-matters", label: "Por que importa" },
        { href: "#common-situations", label: "Momentos del aviso" },
        { href: "#what-it-reviews", label: "Que revisa" },
        { href: "#how-it-works", label: "Como funciona" },
        { href: "#trust-limits", label: "Confianza y limites" },
      ],
      startDemo: "Iniciar demo",
    },
    hero: {
      title:
        "Protege la cobertura de Medicaid antes de que un aviso confuso se vuelva una interrupcion.",
      copy:
        "Notice-to-Rescue lee paquetes ficticios de avisos de Medicaid o texto pegado localmente, encuentra el bloqueo exacto de cobertura y convierte lenguaje denso de la agencia en una ruta clara de rescate.",
      secondaryCopy:
        "Prepara artefactos de siguiente paso para el flujo de demo, mientras deja las decisiones oficiales de elegibilidad, envios y orientacion legal a la agencia apropiada o a una persona revisora calificada.",
      startDemo: "Iniciar rescate",
      seeExample: "Ver ejemplo",
    },
    trustPills: [
      "Guia clara para avisos de Medicaid",
      "Revision de bloqueo y preparacion",
      "Demo solo del frontend",
    ],
    benefitStrip: [
      "Lee avisos de renovacion y cierre",
      "Identifica bloqueos exactos de cobertura",
      "Prepara paquetes y notas de escalamiento",
    ],
    reassuranceItems: [
      {
        title: "Revision del aviso en lenguaje claro",
        copy:
          "Los resumenes explican lo que un aviso de Medicaid parece pedir, no decisiones oficiales de elegibilidad.",
      },
      {
        title: "Flujo centrado en el bloqueo",
        copy:
          "La demo se centra en el requisito faltante, la fecha limite y el estado de preparacion para el siguiente paso.",
      },
      {
        title: "Solo simulado",
        copy:
          "Esta demo frontend no contacta agencias, no envia documentos, no guarda documentos reales ni maneja PHI.",
      },
    ],
    sectionHeadings: {
      why: {
        eyebrow: "Por que importa",
        title: "Detalles pequeños del aviso pueden poner la cobertura en riesgo.",
        copy:
          "Los avisos de accion de Medicaid suelen llegar con fechas limite cortas y lenguaje denso. Notice-to-Rescue esta disenado para el momento urgente en que alguien necesita entender el bloqueo exacto y que hacer despues.",
      },
      common: {
        eyebrow: "Situaciones comunes",
        title: "Hecho para los momentos de aviso que las personas realmente traen.",
        copy:
          "El prototipo funciona mejor cuando tienes un aviso de Medicaid enfrente y una pregunta concreta de riesgo de cobertura que resolver.",
      },
      reviews: {
        eyebrow: "Que revisa",
        title: "Trae el papeleo que explica el riesgo.",
        copy:
          "Notice-to-Rescue busca contexto util en el documento y lo organiza en un resumen de caso enfocado y revisable.",
        limit:
          "Puede ayudar a preparar una ruta de respuesta. No puede confirmar elegibilidad, enviar documentos, contactar una agencia ni dar asesoria legal.",
      },
      leaveWith: {
        eyebrow: "Lo que obtienes",
        title: "Una ruta mas clara desde el aviso hasta la siguiente accion.",
        copy:
          "La meta no es reemplazar una respuesta oficial. Es ayudarte a entender el bloqueo, ver si el caso esta listo con documentos y saber cuando puede hacer falta escalar.",
      },
      how: {
        eyebrow: "Como funciona Notice-to-Rescue",
        title: "Del aviso confuso al siguiente paso preparado.",
        copy:
          "Un flujo corto mantiene la revision enfocada en detectar bloqueos, preparacion y la siguiente accion de rescate.",
      },
      faq: {
        eyebrow: "Preguntas",
        title: "Respuestas claras sobre lo que la demo puede y no puede hacer.",
        copy:
          "Notice-to-Rescue es intencionalmente cuidadoso: util para preparacion, limitado cuando se requiere una respuesta oficial o juicio humano.",
      },
      finalCta: {
        eyebrow: "Prueba la demo",
        title:
          "Empieza con un aviso de Medicaid y sal con una ruta de rescate mas clara.",
        copy:
          "Usa Notice-to-Rescue para identificar el bloqueo, revisar si el caso esta listo y preparar artefactos simulados de siguiente paso para el flujo del prototipo.",
        startDemo: "Iniciar rescate",
        reviewLimits: "Revisar limites",
        bullets: [
          "Guia solamente, no una determinacion oficial de Medicaid",
          "No se contacta a agencias ni se envian documentos",
          "Disenado para preparacion antes de revision humana o seguimiento",
        ],
      },
      trust: {
        eyebrow: "Confianza y limites",
        title: "Guia informativa, no una decision oficial.",
        copy:
          "Notice-to-Rescue es una demo de rescate de avisos de Medicaid para explicar lenguaje de riesgo y preparar artefactos simulados de seguimiento. No determina elegibilidad, no envia papeleo, no contacta agencias, no da asesoria legal, no guarda documentos reales ni maneja flujos reales de PHI.",
        limits: [
          "Confirma siempre el estado, fechas limite, opciones de envio y derechos de apelacion con la agencia o una persona revisora calificada.",
          "No uses esta demo para emergencias, decisiones legales ni gestion real de casos.",
          "No ingreses informacion real sensible de salud ni documentos reales en esta demo frontend.",
          "Usa los artefactos generados como pautas de preparacion, no como respuestas finales ni envios a una agencia.",
        ],
      },
    },
    matterItems: [
      {
        title: "La cobertura puede cerrarse rapido",
        copy:
          "Un aviso de renovacion o accion requerida puede dar una ventana corta antes de que los beneficios se interrumpan.",
      },
      {
        title: "El bloqueo suele estar escondido",
        copy:
          "El elemento clave faltante puede ser prueba de ingresos, documento de residencia o una aclaracion oculta en texto denso.",
      },
      {
        title: "Las fechas limite requieren atencion",
        copy:
          "La diferencia entre listo para enviar y escalamiento necesario puede depender de una sola fecha de respuesta.",
      },
      {
        title: "Puede haber registros en conflicto",
        copy:
          "Un aviso y una carta de estado pueden apuntar a hechos diferentes, por lo que la revision humana es importante antes de actuar.",
      },
      {
        title: "Los paquetes deben estar completos",
        copy:
          "Una respuesta es mas fuerte cuando el aviso, la verificacion, los detalles del caso y el plan de confirmacion estan organizados.",
      },
      {
        title: "El escalamiento debe ser claro",
        copy:
          "Notice-to-Rescue ayuda a distinguir la recopilacion rutinaria de documentos de casos que necesitan una persona navegadora o defensora.",
      },
    ],
    commonSituations: [
      {
        title: "Llego una advertencia de renovacion",
        copy:
          "El aviso dice que Medicaid puede cerrarse si no se envia prueba de ingresos u otra verificacion.",
      },
      {
        title: "Un aviso de accion requerida no es claro",
        copy:
          "La carta nombra una fecha de respuesta, pero el documento exacto necesario es facil de pasar por alto.",
      },
      {
        title: "Un aviso de terminacion ya paso",
        copy:
          "La cobertura parece programada para terminar, asi que el caso puede necesitar revision de apelacion o reinstalacion.",
      },
      {
        title: "Dos documentos se contradicen",
        copy:
          "Una carta de estado del caso y el aviso no coinciden sobre ingresos, residencia o detalles de elegibilidad.",
      },
      {
        title: "Una persona tiene papeleo parcial",
        copy:
          "Alguna verificacion esta lista, pero al paquete aun puede faltarle un requisito o paso de confirmacion.",
      },
      {
        title: "Alguien pego texto local del aviso",
        copy:
          "El prototipo puede revisar paquetes ficticios de muestra o texto pegado localmente en el navegador para el flujo de demo.",
      },
    ],
    reviewTypes: [
      {
        title: "Avisos de renovacion de Medicaid",
        examples:
          "Advertencias de renovacion, solicitudes de verificacion faltante, fechas limite de accion",
      },
      {
        title: "Cartas de cierre y terminacion",
        examples:
          "Fechas de fin de cobertura, advertencias de cierre, lenguaje de fecha vencida",
      },
      {
        title: "Avisos de accion requerida",
        examples:
          "Prueba de ingresos, prueba de residencia, listas de documentos solicitados",
      },
      {
        title: "Cartas de estado del caso",
        examples:
          "Actualizaciones de agencia, detalles en conflicto, senales de elegibilidad",
      },
      {
        title: "Verificacion de apoyo",
        examples:
          "Talones de pago, cartas de empleador, contratos de alquiler, facturas de servicios, correo oficial",
      },
      {
        title: "Lenguaje de riesgo y urgencia",
        examples:
          "La cobertura puede cerrarse, el caso se cerrara, falta de respuesta, fecha vencida",
      },
      {
        title: "Instrucciones de envio",
        examples:
          "Donde enviar documentos, que incluir, recordatorios de confirmacion",
      },
      {
        title: "Senales de escalamiento",
        examples:
          "Extraccion de baja confianza, registros en conflicto, casos vencidos",
      },
    ],
    leaveWithItems: [
      "Explicacion del aviso en lenguaje claro",
      "Bloqueo exacto que pone la cobertura en riesgo",
      "Fecha limite, urgencia y estado de preparacion",
      "Lista de requisitos faltantes",
      "Paquete simulado de envio o escalamiento",
      "Resumen imprimible de seguimiento para revision externa",
    ],
    workflowSteps: [
      {
        step: "01",
        title: "Elige o pega un aviso",
        copy:
          "Empieza con un paquete ficticio de aviso de Medicaid o pega texto local en la demo solo del navegador.",
      },
      {
        step: "02",
        title: "Revisa campos extraidos",
        copy:
          "Confirma el tipo de aviso, fecha limite, programa de Medicaid, lenguaje de riesgo y documentos solicitados.",
      },
      {
        step: "03",
        title: "Ejecuta el agente de rescate",
        copy:
          "El flujo local identifica el bloqueo exacto, la urgencia, la ruta de rescate y la preparacion de documentos.",
      },
      {
        step: "04",
        title: "Prepara la siguiente accion",
        copy:
          "Sal con artefactos simulados de paquete, notas de escalamiento y un resumen imprimible para seguimiento.",
      },
    ],
    faqs: [
      {
        question: "Esto decide si alguien es elegible para Medicaid?",
        answer:
          "No. Notice-to-Rescue explica el lenguaje del aviso y prepara siguientes pasos, pero no determina elegibilidad de Medicaid, estado de cobertura ni derechos de apelacion.",
      },
      {
        question: "Puede enviar documentos a una agencia?",
        answer:
          "No. La demo puede preparar artefactos simulados de paquete, pero no envia papeleo, no contacta agencias, no crea cuentas ni guarda confirmaciones.",
      },
      {
        question: "Que documentos puedo revisar en el prototipo?",
        answer:
          "La demo es adecuada para avisos ficticios de renovacion de Medicaid, avisos de cierre o terminacion, cartas de accion requerida, cartas de estado del caso y texto local pegado del aviso.",
      },
      {
        question: "Guarda documentos reales o PHI?",
        answer:
          "No. El proyecto es solo frontend. Usa datos de muestra y texto local del navegador para el prototipo, y no es un flujo real de PHI.",
      },
      {
        question: "Es asesoria legal o de una agencia?",
        answer:
          "No. Es guia informativa para un prototipo de hackathon. Verifica siempre fechas limite, opciones de envio, derechos de apelacion y estado con la agencia o una persona revisora calificada.",
      },
      {
        question: "Que debe pasar cuando se marca escalamiento?",
        answer:
          "Usa el resumen generado para informar a una persona navegadora, defensora, trabajadora de caso u otra revisora calificada antes de depender del paquete.",
      },
    ],
    heroPreview: {
      ariaLabel: "Vista previa de revision de Notice-to-Rescue",
      badge: "Revision lista para paquete",
      eyebrow: "Salida de muestra",
      title: "Revision de aviso de renovacion de Medicaid",
      copy:
        "Revision en lenguaje claro para un bloqueo por verificacion de ingresos faltante.",
      packet: "Paquete demo",
      readyQuestionTitle: "Pregunta lista para hacer",
      readyQuestion:
        "Que prueba exacta de ingresos es aceptable, y como puedo confirmar que el paquete fue recibido antes de la fecha limite de respuesta?",
      checklistTitle: "Lista de siguientes pasos",
      rows: [
        {
          label: "Resumen del aviso",
          value:
            "El aviso de renovacion dice que Medicaid puede cerrarse si no se recibe prueba de ingresos.",
        },
        {
          label: "Bloqueo exacto",
          value:
            "La verificacion de ingresos faltante impide que el caso este listo con documentos.",
        },
        {
          label: "Que verificar",
          value:
            "Fecha limite, prueba aceptable, canal de envio y numero de confirmacion.",
        },
        {
          label: "Ruta de rescate",
          value:
            "Reunir verificacion, preparar el paquete y escalar si se paso la fecha limite.",
        },
      ],
      checklist: [
        "Adjuntar el aviso original",
        "Relacionar documentos con la persona y el caso",
        "Guardar prueba de envio o confirmacion",
      ],
    },
    exampleOutput: {
      eyebrow: "Resumen de ejemplo",
      title: "Notas de rescate preparadas",
      copy:
        "El aviso parece advertir que Medicaid puede cerrarse si no se envia verificacion de ingresos antes de la fecha de respuesta indicada.",
      flaggedTitle: "Detalle marcado",
      flaggedCopy:
        "La prueba de ingresos faltante es el bloqueo. Confirma documentos aceptables antes de enviar el paquete.",
      detailsTitle: "Detalles para verificar",
      detailsCopy:
        "Fecha limite, identificador del caso, canal de envio, prueba requerida y metodo de confirmacion.",
      questionsTitle: "Preguntas para hacer",
      questions: [
        "Que documentos de prueba de ingresos satisfacen este aviso?",
        "Como se debe enviar el paquete para este caso de Medicaid?",
        "Que numero de confirmacion o recibo se debe guardar?",
      ],
    },
  },
};

export function getLandingContent(language: AppLanguage) {
  return landingContent[copyLanguage(language)];
}
