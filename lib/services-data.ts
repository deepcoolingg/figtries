// No "use client" — safe to import in both server and client modules.

export interface ServiceCapability {
  title: string;
  description: string;
  bullets: string[];
}

export interface ServiceOutcome {
  label: string;
  description: string;
}

export interface ServiceSectionIntro {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  shortDescription: string;
  accentBg: string;
  image: string;
  secondaryImage?: string; 
  secondaryAccentBg?: string;
  hero: ServiceSectionIntro;
  capabilitiesIntro: ServiceSectionIntro;
  capabilities: ServiceCapability[];
  outcomesHeading: string;
  outcomes: ServiceOutcome[];
  faqs: ServiceFAQ[];
}

export const servicesData: ServiceData[] = [
  {
    slug: "data-intelligence",
    name: "Data & Intelligence",
    shortDescription:
      "Turn scattered data into clear, actionable insight. We structure your data and deliver analytics that support faster, better decisions.",
    accentBg: "#ece7f5",
    image: "/aboutus/data.png",
    secondaryImage: "/services/data-2.png", 

    hero: {
      title: "Data & Intelligence",
      description:
        "The Infrastructure Layer for Structured and Scalable Decision Making",
    },

    capabilitiesIntro: {
      title: "Where Data Becomes Operational",
      description:
        "Turn every data source into a decision. No lag. No guesswork. Just the infrastructure your operations actually run on.",
    },

    outcomesHeading: "What Fundamentally Changes When Your Data Works.",

    outcomes: [
      {
        label: "Faster Decisions",
        description:
          "Stop searching. Start acting on insight that's already there.",
      },
      {
        label: "Total Visibility",
        description:
          "One coherent view of everything, no matter where the data lives.",
      },
      {
        label: "Numbers You Trust",
        description:
          "Governed, quality-assured data your entire organisation can rely on.",
      },
    ],

    capabilities: [
      {
        title: "Data Pipeline Architecture",
        description:
          "We map every source, databases, APIs, legacy spreadsheets, and engineer the pipelines that unify them into a single, reliable layer. ETL and ELT flows handle real-time streams and batch jobs with proper error handling, so failures surface immediately. Storage is architected for how your team actually queries: lakes, warehouses, or hybrid, chosen for performance, not convention. Built to stay stable as your data doubles.",
        bullets: [],
      },
      {
        title: "Business Intelligence",
        description:
          "We build dashboards around how your team thinks, not how the database is structured. Starting from your stakeholders, we define the metrics that drive decisions, then surface them in fast, reliable, self-service tools. Whether we deploy Metabase, Looker, or a custom solution depends on your stack. Every view connects multiple sources, loads fast, and answers the questions people are actually asking.",
        bullets: [],
      },
      {
        title: "Data Governance & Quality",
        description:
          "Insight built on bad data is worse than no insight at all. We implement validation rules, anomaly detection, and full lineage tracking, so any number traces back to its source. Access controls, compliance workflows, schema versioning, and a living data catalogue ensure your team knows exactly what data exists, where it lives, and what it means. Trust in your numbers becomes systematic, not person dependent.",
        bullets: [],
      },
    ],

    faqs: [
      {
        question: "How long does a typical data infrastructure project take?",
        answer:
          "A typical data project runs 8–14 weeks depending on scope. This includes discovery, architecture design, pipeline development, and dashboard deployment. We phase the work so you see value incrementally, not just at the end.",
      },
      {
        question: "What tools and platforms do you work with?",
        answer:
          "We're platform agnostic and choose tools based on your needs. Common stacks include PostgreSQL, BigQuery, Snowflake, dbt, Airflow, and Metabase or Looker for visualization. We work with what fits your team and budget.",
      },
      {
        question: "Do we need to replace our existing systems?",
        answer:
          "Rarely. We work with your existing data sources and systems, building integration layers that connect everything into a unified analytics layer. The goal is to enhance what you have, not rip and replace.",
      },
      {
        question: "How do you ensure data quality and governance?",
        answer:
          "We implement automated validation rules, anomaly detection, and lineage tracking from day one. Every data point can be traced back to its source, and quality issues are flagged before they reach your reports.",
      },
      {
        question: "What if our data is messy and inconsistent?",
        answer:
          "That's exactly why companies come to us. Messy data is the starting point, not a blocker. We audit, clean, standardise, and structure your data as part of the pipeline architecture process.",
      },
    ],
  },

  {
    slug: "artificial-intelligence",
    name: "AI & Machine Learning",
    shortDescription:
      "Apply AI and machine learning to real problems. We build systems that automate workflows and improve decision accuracy at scale.",
    accentBg: "#dff0ff",
    image: "/aboutus/ai.png",
    secondaryImage: "/services/ai-2.png",

    hero: {
      title: "AI & Machine Learning",
      description: "Embed intelligence into how your operations think and adapt in real time.",
    },

    capabilitiesIntro: {
      title: "Where Machines Learn Your Business",
      description: "The Models We Build don't Live in a Separate Tool. They Live Inside The Decisions Your Business Runs on Every Day.",
    },
    outcomesHeading:
      "What Becomes Possible When Intelligence Is Built In.",

    outcomes: [
      {
        label: "Smart Flows",
        description:
          "Repetitive processes handled accurately, at scale, without human bottlenecks.",
      },
      {
        label: "Sharper Predictions",
        description:
          "Models trained on your data, monitored in production, retrained when they drift.",
      },
      {
        label: "Reclaimed Capacity",
        description:
          "Your team's time redirected from routine tasks to high-value work.",
      },
    ],

    capabilities: [
      {
        title: "Machine Learning Models",
        description:
          "We build from your actual data and not off-the-shelf solutions rebranded as custom. Every model starts with the decision you're trying to improve. We select the right approach for the problem and handle the full lifecycle: preparation, training, evaluation, deployment, and monitoring that triggers retraining before performance degrades. Every model ships with plain-language documentation because a model your team can't explain is one they won't use.",
        bullets: [],
      },
      {
        title: "Intelligent Automation",
        description:
          "If your team is still doing work that software should handle, that's where we start. We identify the bottlenecks and replace manual steps with reliable, scalable processes by extracting structured data from documents, routing approvals by content, or building decision pipelines that combine business rules with ML predictions. Everything integrates into what you already use. No new tools to adopt. Just your team freed for work that requires human judgement.",
        bullets: [],
      },
      {
        title: "Language & Document Intelligence",
        description:
          "Most business knowledge is trapped in unstructured text. We build systems that extract meaning from contracts, emails, reports, and support tickets then make it actionable. Entity recognition, semantic search, document classification, and question-answering across large collections. Fine-tuned on your domain so the output reflects your industry's context, not generic inference that misses what actually matters.",
        bullets: [],
      },
    ],

    faqs: [
      {
        question: "How much data do we need to get started with AI?",
        answer:
          "It depends on the problem. Some automation tasks need minimal training data, while predictive models require more. We assess your data readiness during discovery and recommend the right approach, even if that means starting with rule based systems before graduating to ML.",
      },
      {
        question: "What types of AI/ML problems can you solve?",
        answer:
          "We focus on applied AI classification, prediction, anomaly detection, document extraction, recommendation engines, and process automation. If AI can measurably improve a decision or workflow in your business, we can build it.",
      },
      {
        question: "How do you handle model deployment and monitoring?",
        answer:
          "Every model we build ships with production monitoring to be tracking prediction accuracy, data drift, and performance metrics. We set up automated retraining pipelines so your models stay accurate without manual intervention.",
      },
      {
        question: "Can AI work with our existing tools and systems?",
        answer:
          "Yes. We integrate AI capabilities into your existing workflows such CRM, ERP, internal platforms, email systems. The goal is to enhance your current tools, not force your team onto new ones.",
      },
      {
        question: "What's the realistic ROI on implementing AI?",
        answer:
          "We only recommend AI where it creates measurable value. Typical outcomes include 40–70% reduction in manual processing time, improved prediction accuracy, and capacity recovered for high value work. We define success metrics before building anything.",
      },
    ],
  },

  {
    slug: "system-architecture",
    name: "System Architecture",
    shortDescription:
      "Build systems that stay reliable as you grow. We design strong backend and integration architecture built for stability and scalability.",
    accentBg: "#ebefe8",
    image: "/aboutus/system.png",
    secondaryImage: "/services/system-2.png",

    hero: {
      title: "System Architecture",
      description: "The infrastructure underneath every decision your system will ever make.",
    },

    capabilitiesIntro: {
      title: "Architecture Built to Outlast The Pressure Your Business Creates.",
      description: "Backend systems built to handle growth, change, and complexity without losing stability.",
    },

    outcomesHeading:
      "How Solid Infrastructure Compounds Over Time.",

    outcomes: [
      {
        label: "Systems That Scale",
        description:
          "Architecture that grows with your business, without structural rewrites.",
      },
      {
        label: "Clean Integration",
        description:
          "Reliable connections between services, systems, and third party tools.",
      },
      {
        label: "Maintainable Core",
        description:
          "Codebases your team can extend and own with confidence, long after handoff.",
      },
    ],

    capabilities: [
      {
        title: "System Design & Architecture",
        description:
          "We start with where your system is going over the next 12 to 24 months, not just what it needs today. From there we make the structural decisions that matter: monolith, modular monolith, or microservices that chosen by your team size, traffic patterns, and deployment reality. We define service boundaries, plan for realistic load, and document every decision with the reasoning behind it so future developers understand not just what was built but why. Built to evolve. Not to be replaced.",
        bullets: [],
      },
      {
        title: "API & Integration Layer",
        description:
          "Your API layer is where services talk and where third-party systems connect. We design for longevity: clean contracts, proper versioning, and documentation that stays current. RESTful, GraphQL, or event-driven. We choose the pattern that fits then build it with authentication, rate limiting, and error handling from day one. Third-party integrations get the same rigour: retry logic and abstraction layers that ensure a change in one vendor's system never ripples through your entire codebase.",
        bullets: [],
      },
      {
        title: "Database & Infrastructure",
        description:
          "We design storage and cloud infrastructure around your actual requirements. Consistency, performance, and cost. Not defaults or what someone used at their last company. Right database for the job. Schemas and indexing built for your real query patterns. Caching where it meaningfully moves the needle. Cloud deployments across AWS, GCP, or Azure with proper networking, security, and cost management. Backups, monitoring, and alerting in place before anything goes wrong.",
        bullets: [],
      },
    ],

    faqs: [
      {
        question: "Should we use microservices or stick with a monolith?",
        answer:
          "It depends on your team size, deployment needs, and growth trajectory. We often recommend starting with a well-structured modular monolith and extracting services only when the complexity justifies it. Architecture decisions should be driven by your reality, not industry trends.",
      },
      {
        question: "How do you handle migrations from legacy systems?",
        answer:
          "Carefully and incrementally. We design migration strategies that minimise risk that running old and new systems in parallel, migrating data in phases, and validating at every step. No big-bang cutovers unless absolutely necessary.",
      },
      {
        question: "What cloud platforms do you work with?",
        answer:
          "We work across AWS, GCP, and Azure, choosing based on your existing infrastructure, team expertise, and cost requirements. We're not locked into any vendor and will recommend what actually fits your situation.",
      },
      {
        question: "How long does an architecture review typically take?",
        answer:
          "An initial architecture assessment takes 2–3 weeks. This covers your current system, identifies constraints and risks, and produces a clear roadmap. Full architecture design and implementation varies by scope that typically 10–20 weeks.",
      },
      {
        question: "How do you ensure the system remains maintainable after handoff?",
        answer:
          "Every architectural decision is documented with full rationale. We produce comprehensive documentation, clear code standards, and knowledge transfer sessions. Your team should be able to extend and maintain the system with confidence.",
      },
    ],
  },
];