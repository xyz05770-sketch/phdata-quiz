import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lqzxxwrpplgrjclwudjj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxenh4d3JwcGxncmpjbHd1ZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODU5MzcsImV4cCI6MjA5MzY2MTkzN30.XWrOyT1SAvLTHGDgmyuDPYH7cyH1kxdClIv1VxWKRTc"
);


// Inline SVG logo — no base64, instant render
function PhDataLogo() {
  return (
    <svg height="32" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="phData">
      <rect x="0" y="4" width="18" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="0" y="26" width="18" height="18" rx="2" fill="white" opacity="0.6"/>
      <rect x="22" y="4" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/>
      <rect x="22" y="16" width="18" height="8" rx="1.5" fill="white" opacity="0.75"/>
      <rect x="22" y="28" width="13" height="8" rx="1.5" fill="white" opacity="0.6"/>
      <text x="52" y="34" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="28" fontWeight="300" fill="white" letterSpacing="-0.5">ph<tspan fontWeight="600">Data</tspan></text>
    </svg>
  );
}

// ============================================================
// QUESTIONS DATABASE (70 questions from the doc)
// ============================================================
const ALL_QUESTIONS = [
  // --- Fundamentals & Architecture ---
  {
    q: "A team complains that their dashboards often break when upstream schema changes. What should the data engineer prioritize first?",
    options: ["Increasing warehouse size", "Adding more dashboards", "Introducing clear data contracts and versioned schemas", "Turning off schema evolution"],
    answer: 2,
  },
  {
    q: "A retail company wants consistent, governed metrics across finance and marketing. Which architectural choice helps MOST?",
    options: ["Each team builds its own isolated pipeline and tables", "Centralized semantic layer or metrics store on top of shared, modeled data", "Direct connections from BI tools to raw source systems", "Manual Excel exports for each team"],
    answer: 1,
  },
  {
    q: "Which scenario BEST fits a batch pipeline instead of streaming?",
    options: ["Real-time fraud detection on credit card transactions", "Monitoring clickstream events for second-by-second personalization", "Daily revenue reporting that tolerates a 2-hour delay", "Real-time IoT alerting for equipment failures"],
    answer: 2,
  },
  {
    q: "A data engineer needs to support both ad-hoc exploration and reliable production reporting. Which approach is MOST appropriate?",
    options: ["One giant 'analytics' schema for everything", "Separate curated layer for production + sandbox area for exploration", "Only sandbox area, no constraints", "Only curated area, no experimentation"],
    answer: 1,
  },
  {
    q: "Which pattern BEST reduces tight coupling between operational systems and analytics workloads?",
    options: ["BI tools connecting directly to OLTP databases", "Nightly CSV exports emailed to analysts", "Event or CDC-based ingestion into a dedicated analytical platform", "Running analytical queries on production application databases"],
    answer: 2,
  },
  {
    q: "Which choice MOST clearly differentiates data engineering from data science?",
    options: ["Data engineers design UI mockups; data scientists don't", "Data engineers build and operate data platforms and pipelines; data scientists focus on modeling and analysis", "Data engineers only use SQL; data scientists only use Python", "Data engineers work only on-prem; data scientists only in the cloud"],
    answer: 1,
  },
  {
    q: "A core responsibility of a data engineer when supporting ML teams is to:",
    options: ["Tune model hyperparameters", "Provide stable, scalable feature pipelines and model scoring infrastructure", "Design product roadmaps", "Approve research publications"],
    answer: 1,
  },
  {
    q: "Which is the BEST reason to adopt a layered data architecture (raw → cleaned → modeled)?",
    options: ["To duplicate all data three times", "To allow different levels of quality, validation, and reusability at each stage", "To hide raw data from everyone", "To make lineage impossible to trace"],
    answer: 1,
  },
  {
    q: "You must consolidate data from multiple SaaS tools with different APIs. Which is the MOST robust high-level approach?",
    options: ["Write one-off scripts on analyst laptops", "Use notebooks only, triggered manually", "Build repeatable ingestion pipelines with standardized schemas and orchestration", "Ask each vendor to send spreadsheets"],
    answer: 2,
  },
  {
    q: "A business stakeholder asks for 'real-time' data, but after discussion they accept a 30-minute delay. As a data engineer, what's the BEST next step?",
    options: ["Immediately design a complex streaming system", "Implement a frequent micro-batch (e.g., every 5–15 minutes) and confirm it meets requirements", "Refuse and insist on daily batch", "Ignore latency requirements"],
    answer: 1,
  },
  // --- Storage, Modeling & Warehousing ---
  {
    q: "Which scenario benefits MOST from columnar storage formats like Parquet?",
    options: ["Many single-row inserts and updates from a transactional app", "Analytics queries scanning billions of rows to compute aggregates", "Storing binary image files", "Key-value lookups with millisecond latency"],
    answer: 1,
  },
  {
    q: "A table stores 5 years of event data. Analysts usually query only the last 7 days. Which design is MOST effective?",
    options: ["No partitioning; one large table scan", "Partition by event_date and prune to last 7 days", "Partition by random UUID", "Store each day's data in a separate database"],
    answer: 1,
  },
  {
    q: "You have a wide fact table with many rarely-used columns. To improve performance for common queries, you should:",
    options: ["Force all queries to SELECT *", "Encourage column pruning and create narrower, purpose-built views or marts", "Move all columns into a JSON blob", "Duplicate the table for each analyst"],
    answer: 1,
  },
  {
    q: "In a star schema, which statement is MOST accurate?",
    options: ["Dimension tables typically change more frequently than fact tables", "Fact tables store transactional or aggregate measurements linked to dimensions", "Dimension tables should never have surrogate keys", "Fact tables should contain only text attributes"],
    answer: 1,
  },
  {
    q: "A marketing team needs to compare 'customer lifetime value' across segments. Which data modeling choice helps MOST?",
    options: ["Only raw event logs", "A modeled fact table aggregating customer revenue with dimension tables for segments", "One giant CSV per segment", "A NoSQL document per dashboard"],
    answer: 1,
  },
  {
    q: "Which is a reasonable use of normalization in an analytical model?",
    options: ["To completely remove all joins", "To separate high-cardinality reference data (e.g., products) into its own dimension", "To store each metric in its own table", "To enforce only one table in the entire warehouse"],
    answer: 1,
  },
  {
    q: "SCD Type 2 (Slowly Changing Dimension) is MOST appropriate when you need to:",
    options: ["Keep only the most recent value for attributes", "Track full history of changes to dimension attributes", "Delete history on every change", "Prevent any attribute updates"],
    answer: 1,
  },
  {
    q: "You're designing a table that will be updated incrementally from CDC logs. Which key decision MOST affects correctness?",
    options: ["Choosing the BI tool", "Choosing the primary key and merge strategy for upserts", "Choosing the dashboard color theme", "Choosing the CSV delimiter"],
    answer: 1,
  },
  {
    q: "Which of the following is a clear downside of excessive denormalization?",
    options: ["More complex joins", "Higher risk of data inconsistencies and larger storage footprint", "Inability to query data", "Mandatory use of OLTP engines"],
    answer: 1,
  },
  {
    q: "A fact table has multiple date columns (order_date, ship_date, delivery_date). Which design is MOST flexible for analysis?",
    options: ["Store dates only as text", "Use separate date dimensions and explicit foreign keys for each date role", "Keep only order_date", "Merge all dates into a single 'generic_date' column"],
    answer: 1,
  },
  // --- Pipelines, Orchestration & Testing ---
  {
    q: "A pipeline occasionally fails due to transient network issues. What is the MOST appropriate mitigation?",
    options: ["Disable error handling", "Add retries with exponential backoff and idempotent operations", "Increase batch size indefinitely", "Manually re-run everything each time"],
    answer: 1,
  },
  {
    q: "In Apache Airflow, which design improves maintainability the MOST?",
    options: ["Very long monolithic DAG with hundreds of tasks and hidden dependencies", "Multiple smaller DAGs with clear boundaries and explicit inter-DAG dependencies where needed", "One task per line of code", "No DAGs; only manual runs"],
    answer: 1,
  },
  {
    q: "Which test type is BEST for catching breaking changes to a model's schema early?",
    options: ["Only unit tests on Python helpers", "Data contract tests that assert column presence, types, and key constraints", "Manual spot checks in BI dashboards", "Visual tests on UI components"],
    answer: 1,
  },
  {
    q: "You need to backfill 12 months of data for a new fact table while daily loads continue. What's a solid strategy?",
    options: ["Block all daily loads until backfill completes", "Run backfill jobs partition-by-partition with careful isolation from daily loads", "Load everything into one giant transaction", "Ignore historical data"],
    answer: 1,
  },
  {
    q: "A data engineer wants to minimize duplicated business logic across pipelines. Which approach is BEST?",
    options: ["Copy-paste SQL into every job", "Encapsulate shared logic in reusable views, dbt models, or library functions under version control", "Ask each analyst to maintain their own logic", "Store logic only in dashboards"],
    answer: 1,
  },
  {
    q: "A job is supposed to process exactly one day of data per run but occasionally processes two days. What concept is likely missing?",
    options: ["Logging", "Idempotency and clear input boundaries (e.g., explicit date parameters)", "Large cluster size", "BI semantic layer"],
    answer: 1,
  },
  {
    q: "Which is a good pattern for handling late-arriving corrections in a daily batch pipeline?",
    options: ["Never re-run past dates", "Maintain a 'reprocess window' (e.g., last N days) with merge logic", "Drop all corrected records", "Edit tables manually in the BI tool"],
    answer: 1,
  },
  {
    q: "To support CI/CD for data pipelines, a team should MOST likely:",
    options: ["Commit SQL/scripts directly to production", "Use version control, automated tests, and promotion through dev → test → prod", "Edit code only in production consoles", "Avoid any branching strategy"],
    answer: 1,
  },
  {
    q: "A DAG task that loads data frequently fails due to bad records from a source system. What is the BEST first step?",
    options: ["Ignore failures and continue", "Implement data validation and quarantining of bad records before loading", "Increase cluster size", "Disable alerts"],
    answer: 1,
  },
  {
    q: "Which practice MOST improves observability of a data platform?",
    options: ["Turning off logs for performance", "Centralized logging, metrics, and tracing with clear dashboards and alerts", "Manual ad-hoc checks only", "Keeping logs only on local laptops"],
    answer: 1,
  },
  // --- Data Quality, Governance & Security ---
  {
    q: "A high-value dashboard shows unexpected negative revenue. What should be checked FIRST?",
    options: ["UI theme", "Upstream data quality rules and transformation logic around sign conventions and joins", "Zoom level of charts", "Number of BI licenses"],
    answer: 1,
  },
  {
    q: "Which is an example of a 'preventive' data quality control?",
    options: ["A weekly manual audit", "Constraints and validation rules enforced during ingestion", "A post-hoc email from finance", "A note in documentation"],
    answer: 1,
  },
  {
    q: "Data lineage is MOST useful for:",
    options: ["Choosing colors for charts", "Understanding which upstream tables and jobs feed a broken report", "Improving keyboard shortcuts", "Encrypting passwords"],
    answer: 1,
  },
  {
    q: "To meet least-privilege principles, how should access to production data be managed?",
    options: ["Everyone gets full admin rights", "Role-based access, granting only the permissions needed for each persona", "Use one shared 'admin' account for all users", "Store credentials in public docs"],
    answer: 1,
  },
  {
    q: "A company must delete customer data upon request ('right to be forgotten'). Which design choice helps MOST?",
    options: ["Storing PII only in raw logs", "Clearly separating PII from non-PII and tracking it with strong keys for targeted deletion", "Embedding PII into every derived table", "Storing PII only in dashboards"],
    answer: 1,
  },
  {
    q: "Which is a reasonable policy for handling production schema changes?",
    options: ["Apply changes directly in production with no notice", "Use change management: proposals, impact analysis, testing, and communicated release windows", "Let analysts change production tables freely", "Avoid any schema changes forever"],
    answer: 1,
  },
  {
    q: "A data catalog that is actually used by teams will MOST likely include:",
    options: ["Only physical table names", "Business descriptions, owners, sample queries, and data classifications", "Only technical column types", "Only dashboard screenshots"],
    answer: 1,
  },
  {
    q: "Masked views are MOST appropriate when:",
    options: ["You want to hide sensitive columns (e.g., partial credit card numbers) from most users", "You want to speed up queries", "You want to compress data", "You want to change file formats"],
    answer: 0,
  },
  {
    q: "To prevent inconsistent metric definitions across teams, a data engineer should:",
    options: ["Encourage each team to define metrics in their own dashboard", "Implement a governed metrics layer or shared semantic model", "Store metrics only in spreadsheets", "Hard-code metrics in application code"],
    answer: 1,
  },
  {
    q: "Which is a realistic KPI for a mature data platform's quality and reliability?",
    options: ["Number of tables created per month", "% of critical pipelines meeting SLA and % of tables covered by tests", "Number of BI tools installed", "Total size of documentation"],
    answer: 1,
  },
  // --- Performance, Cost & Scalability ---
  {
    q: "A single long-running query is blocking many others in a shared warehouse. What is the MOST appropriate first action?",
    options: ["Increase UI font size", "Analyze and optimize the query (filters, joins, partitions) and consider workload isolation", "Disable query limits", "Duplicate the query many times"],
    answer: 1,
  },
  {
    q: "A data engineer wants predictable costs while load varies significantly over the day. Which approach helps MOST?",
    options: ["Single fixed large warehouse that never suspends", "Workload-specific warehouses with auto-suspend/auto-resume", "Manual start/stop by engineers", "Only on-prem hardware"],
    answer: 1,
  },
  {
    q: "Which pattern is BEST for running a heavy backfill without impacting critical dashboards?",
    options: ["Run in the same cluster during business hours", "Use a separate compute cluster or workload group with lower priority", "Turn off dashboards", "Block all new queries"],
    answer: 1,
  },
  {
    q: "A query frequently shuffles massive amounts of data during joins. Which modeling change may help MOST?",
    options: ["Removing all indexes", "Using appropriate distribution/cluster keys and reducing skew", "Converting everything to CSV", "Increasing UI contrast"],
    answer: 1,
  },
  {
    q: "Caching is most effective when:",
    options: ["Queries are highly unique each time", "Many users repeatedly access similar aggregates over the same slices of data", "Data changes every second for every row", "Storage is extremely limited"],
    answer: 1,
  },
  {
    q: "You discover that 90% of a dashboard's load time is a single unfiltered, unaggregated query. What's the BEST improvement?",
    options: ["Add more charts", "Add filters and pre-aggregated tables or materialized views for common use cases", "Increase screen resolution", "Rebuild the UI only"],
    answer: 1,
  },
  {
    q: "Why is separating compute from storage attractive in cloud data platforms?",
    options: ["It forces on-prem deployments", "It allows independent scaling of compute for different workloads while keeping a single data copy", "It prevents sharing data", "It removes the need for governance"],
    answer: 1,
  },
  {
    q: "A team wants to reduce cost but keep SLAs for high-priority reports. Which approach is MOST reasonable?",
    options: ["Use the smallest cluster for everything", "Classify workloads and allocate larger, higher-priority resources only for critical pipelines", "Disable all monitoring", "Run everything only during business hours"],
    answer: 1,
  },
  {
    q: "'Concurrency scaling' is primarily intended to:",
    options: ["Improve chart colors", "Handle bursts of simultaneous queries without large performance degradation", "Compress cold data", "Replace security controls"],
    answer: 1,
  },
  // --- Streaming, Real-Time & Advanced Topics ---
  {
    q: "A fraud detection system must react within seconds to new transactions. Which architecture is MOST suitable?",
    options: ["Nightly batch ETL and static models", "Stream ingestion (e.g., Kafka) plus real-time scoring service", "Monthly CSV uploads", "Yearly data warehouse refresh"],
    answer: 1,
  },
  {
    q: "In a streaming pipeline, 'exactly-once semantics' are MOST challenging because:",
    options: ["Events never arrive out of order", "Failures and retries can cause duplicates or missed messages", "Streams never scale", "Storage cannot be replicated"],
    answer: 1,
  },
  {
    q: "Event time vs. processing time matters MOST when:",
    options: ["No late events occur", "Windows and aggregations depend on when the event actually happened, not when it was processed", "All logs are batch-only", "There is no clock skew"],
    answer: 1,
  },
  {
    q: "A common benefit of a schema registry in an event-driven system is that it:",
    options: ["Randomizes schemas per message", "Centralizes and governs message schemas to prevent breaking changes", "Disables serialization", "Eliminates the need for versioning"],
    answer: 1,
  },
  {
    q: "You notice that late-arriving events are changing already-emitted aggregates. Which technique can help?",
    options: ["Disable watermarking", "Use watermarks and 'allowed lateness' windows to control when results are finalized", "Force events to arrive on time", "Ignore late events"],
    answer: 1,
  },
  {
    q: "The main trade-off between micro-batch and true streaming is that micro-batch:",
    options: ["Has lower latency", "Simplifies processing but usually has slightly higher latency", "Cannot run in the cloud", "Cannot be orchestrated"],
    answer: 1,
  },
  {
    q: "A 'feature store' in ML-centric data engineering is primarily used to:",
    options: ["Store UI assets", "Manage and serve reusable, consistent features for training and online inference", "Replace all warehouses", "Only store raw logs"],
    answer: 1,
  },
  {
    q: "Which is a realistic reason to choose a lakehouse approach?",
    options: ["To avoid all governance", "To unify raw and structured data with ACID guarantees and performant SQL analytics", "To force all teams onto JSON only", "To remove data modeling needs"],
    answer: 1,
  },
  {
    q: "A global product logs events from many time zones. To compare behavior across regions, you should MOSTLY:",
    options: ["Store timestamps only as local times", "Normalize timestamps to UTC and track time zone metadata separately", "Ignore time zones", "Convert everything to a random offset"],
    answer: 1,
  },
  {
    q: "A data engineer wants experimentation (A/B tests) to be reliable. Which is MOST critical?",
    options: ["Fancy UI graphs", "Correct, consistent event tracking and exposure logs joining treatments to outcomes", "Only small sample sizes", "Avoid documenting experiment definitions"],
    answer: 1,
  },
  // --- phData-Focused Questions ---
  {
    q: "phData's core data engineering offering focuses on helping customers:",
    options: ["Build only marketing websites", "Design, build, and operationalize modern data products and applications", "Replace all cloud platforms with on-prem servers", "Manage only payroll systems"],
    answer: 1,
  },
  {
    q: "Which combination BEST reflects phData's end-to-end modern data stack services?",
    options: ["Video editing, HR, and legal services", "AI & Machine Learning, Data Migrations, Data Engineering, Analytics & Agentic Activation", "Only hardware procurement", "Only spreadsheet consulting"],
    answer: 1,
  },
  {
    q: "A company wants to move from on-prem to a modern cloud data platform and needs support for architecture, pipeline migration, and optimization. Which phData service set is MOST relevant?",
    options: ["Graphic design and branding only", "Data Migrations + Data Engineering + Advisory", "Printing and events only", "HR analytics only"],
    answer: 1,
  },
  {
    q: "phData is known for its partnership and expertise with which cloud data platform, among others?",
    options: ["Snowflake Data Cloud", "A local desktop database only", "Floppy disk storage", "Browser cookies"],
    answer: 0,
  },
  {
    q: "A customer wants to ensure their data platform is not only built but also reliably operated day-to-day. Which phData capability is MOST aligned with this need?",
    options: ["Elastic Operations", "One-time POC only", "Manual spreadsheet refreshes", "Desktop software installation"],
    answer: 0,
  },
  {
    q: "For a company aiming to scale AI use cases securely on top of their data platform, which phData combination is MOST relevant?",
    options: ["Data Engineering + AI & Machine Learning + Analytics & Agentic Activation", "Printing + HR + Facilities", "Only UI design services", "None; AI is unsupported"],
    answer: 0,
  },
  {
    q: "At an event like the Data Engineering Summit, phData's data engineering story is BEST summarized as:",
    options: ["'We sell only BI tools.'", "'We help organizations turn raw data into reliable, governed data products and AI-ready platforms.'", "'We only provide laptop hardware.'", "'We focus exclusively on consumer apps.'"],
    answer: 1,
  },
  {
    q: "A healthcare customer wants to centralize disparate clinical data and enable secure analytics. Which describes phData's typical value proposition?",
    options: ["Provide only front-end analytics dashboards without data work", "Architect and build a modern, secure data platform (e.g., on Snowflake) plus pipelines and governance for compliant analytics", "Ship raw log files with no structure", "Avoid any data governance requirements"],
    answer: 1,
  },
  {
    q: "phData often relies on automation (the phData Toolkit) primarily to:",
    options: ["Change website fonts", "Accelerate migrations, simplify operations, and improve data application efficiency", "Replace all engineers", "Only generate PDFs"],
    answer: 1,
  },
  {
    q: "When a prospect asks 'Why phData for data engineering?', the MOST accurate answer is:",
    options: ["'Because we build mobile games.'", "'Because we specialize in modern data platforms, pipelines, and AI solutions with proven patterns and tooling.'", "'Because we sell servers.'", "'Because we replace BI tools.'"],
    answer: 1,
  },
];



// Firebase config - user fills this in
const FIREBASE_CONFIG_PLACEHOLDER = `
// PASTE YOUR FIREBASE CONFIG HERE
// Get it from: Firebase Console → Project Settings → Your apps
// Example:
// const app = initializeApp({
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   ...
// });
`;

// ============================================================
// SUPABASE DB
// ============================================================
const DB = {
  async getLeaderboard() {
    try {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .order("time", { ascending: true });
      return data || [];
    } catch { return []; }
  },
  async addEntry(entry) {
    await supabase.from("leaderboard").upsert(entry, { onConflict: "phone" });
    return await DB.getLeaderboard();
  },
  async checkDuplicate(phone, email) {
    const { data } = await supabase
      .from("leaderboard")
      .select("phone, email")
      .or(`phone.eq.${phone},email.ilike.${email}`);
    const phoneMatch = data?.some(e => e.phone === phone) || false;
    const emailMatch = data?.some(e => e.email.toLowerCase() === email.toLowerCase()) || false;
    return { phoneMatch, emailMatch };
  }
};

// ============================================================
// UTILS
// ============================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  return shuffle(ALL_QUESTIONS).slice(0, 3);
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | quiz | score | luckyDraw | leaderboard
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [ldForm, setLdForm] = useState({ name: "", phone: "+91", email: "" });
  const [ldError, setLdError] = useState("");
  const [ldLoading, setLdLoading] = useState(false);
  const [ldSubmitted, setLdSubmitted] = useState(false);
  // Load leaderboard on mount + realtime subscription
  useEffect(() => {
    DB.getLeaderboard().then(setLeaderboard);

    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, () => {
        DB.getLeaderboard().then(setLeaderboard);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  function startQuiz() {
    const qs = pickQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setStartTime(Date.now());
    setScreen("quiz");
  }

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].answer) {
      setScore(s => s + 1);
    }
  }

  function nextQuestion() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setTimeTaken(Math.round((Date.now() - startTime) / 1000));
      setScreen("score");
    }
  }

  async function handleLDSubmit() {
    setLdError("");
    const { name, phone, email } = ldForm;
    if (!name.trim()) { setLdError("Please enter your name."); return; }
    const phoneClean = phone.trim();
    const phoneRe = /^\+91[6-9]\d{9}$/;
    if (!phoneRe.test(phoneClean)) { setLdError("Enter a valid Indian mobile number (+91XXXXXXXXXX)."); return; }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setLdError("Enter a valid email address."); return; }

    setLdLoading(true);
    const { phoneMatch, emailMatch } = await DB.checkDuplicate(phoneClean, email.trim());
    if (phoneMatch && emailMatch) {
      setLdError("This phone number and email are already registered. Only one lucky draw entry per person!");
      setLdLoading(false);
      return;
    }
    if (phoneMatch) {
      setLdError("This phone number is already registered in the lucky draw.");
      setLdLoading(false);
      return;
    }
    if (emailMatch) {
      setLdError("This email address is already registered in the lucky draw.");
      setLdLoading(false);
      return;
    }
    const entry = { name: name.trim(), phone: phoneClean, email: email.trim(), score, time: timeTaken, ts: Date.now() };
    const lb = await DB.addEntry(entry);
    setLeaderboard(lb);
    setLdLoading(false);
    setLdSubmitted(true);
  }

  // ============================================================
  // STYLES
  // ============================================================
  const S = {
    root: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a14 0%, #111128 60%, #0a0a1e 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#f0f0f8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 0 60px",
    },
    header: {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logo: { height: "36px", filter: "brightness(0) invert(1)" },
    headerTitle: { fontSize: "15px", color: "rgba(255,255,255,0.5)", fontWeight: 400, letterSpacing: "0.05em" },
    card: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "40px",
      width: "100%",
      maxWidth: "600px",
      marginTop: "40px",
    },
    h1: { fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 8px" },
    h2: { fontSize: "22px", fontWeight: 600, color: "#fff", margin: "0 0 16px" },
    sub: { color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" },
    btn: {
      background: "linear-gradient(135deg, #5B5BD6, #8B5CF6)",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "14px 32px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      width: "100%",
      marginTop: "8px",
      transition: "opacity 0.2s",
    },
    btnSecondary: {
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "12px",
      padding: "12px 32px",
      fontSize: "15px",
      fontWeight: 500,
      cursor: "pointer",
      width: "100%",
      marginTop: "8px",
    },
    qNum: { fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "12px", letterSpacing: "0.04em" },
    qText: { fontSize: "17px", fontWeight: 500, lineHeight: 1.6, color: "#eef", marginBottom: "24px" },
    optionBase: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "14px 18px",
      marginBottom: "10px",
      borderRadius: "12px",
      border: "1.5px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.04)",
      color: "#e0e0f5",
      fontSize: "15px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "2px",
      marginBottom: "28px",
      overflow: "hidden",
    },
    input: {
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1.5px solid rgba(255,255,255,0.15)",
      borderRadius: "10px",
      padding: "12px 16px",
      color: "#fff",
      fontSize: "15px",
      marginBottom: "14px",
      boxSizing: "border-box",
      outline: "none",
    },
    label: { fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block" },
    error: { background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff8080", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "14px" },
    badge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, marginBottom: "16px" },
  };

  // Option state styles
  function optionStyle(idx) {
    const base = { ...S.optionBase };
    if (!answered) return base;
    const isCorrect = idx === questions[currentQ].answer;
    const isSelected = idx === selected;
    if (isCorrect) return { ...base, background: "rgba(34,197,94,0.15)", border: "1.5px solid #22c55e", color: "#86efac" };
    if (isSelected && !isCorrect) return { ...base, background: "rgba(239,68,68,0.15)", border: "1.5px solid #ef4444", color: "#fca5a5" };
    return { ...base, opacity: 0.5 };
  }

  const medals = ["🥇", "🥈", "🥉"];

  // ============================================================
  // SCREENS
  // ============================================================

  if (screen === "welcome") return (
    <div style={S.root}>
      <div style={S.header}>
        <PhDataLogo />
        <span style={S.headerTitle}>Data Engineering Summit 2026</span>
      </div>
      <div style={{ ...S.card, textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "8px" }}>🧠</div>
        <h1 style={{ ...S.h1, fontSize: "32px" }}>Data Engineering Quiz</h1>
        <p style={S.sub}>
          Test your data engineering knowledge! Answer 3 random questions, see your score, and enter the <strong style={{ color: "#a78bfa" }}>Lucky Draw</strong> for a chance to win.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
          {[["3", "Questions"], ["📊", "Live Leaderboard"], ["🎁", "Lucky Draw"]].map(([a, b]) => (
            <div key={b} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 20px", minWidth: "100px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>{a}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{b}</div>
            </div>
          ))}
        </div>
        <button style={S.btn} onClick={startQuiz}>Start Quiz →</button>
        <button style={S.btnSecondary} onClick={() => setScreen("leaderboard")}>View Leaderboard</button>
      </div>
    </div>
  );

  if (screen === "quiz") {
    const q = questions[currentQ];
    const prog = ((currentQ) / questions.length) * 100;
    return (
      <div style={S.root}>
        <div style={S.header}>
          <PhDataLogo />
          <span style={S.headerTitle}>Quiz</span>
        </div>
        <div style={S.card}>
          <div style={S.progressBar}>
            <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg,#5B5BD6,#8B5CF6)", borderRadius: "2px", transition: "width 0.4s" }} />
          </div>
          <div style={S.qNum}>Question {currentQ + 1} of {questions.length}</div>
          <div style={S.qText}>{q.q}</div>
          {q.options.map((opt, idx) => (
            <button key={idx} style={optionStyle(idx)} onClick={() => handleSelect(idx)}>
              <span style={{ marginRight: "10px", opacity: 0.6 }}>{["A","B","C","D"][idx]}.</span>
              {opt}
            </button>
          ))}
          {answered && (
            <div style={{ marginTop: "20px", padding: "14px 18px", borderRadius: "12px", background: selected === q.answer ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${selected === q.answer ? "#22c55e" : "#ef4444"}` }}>
              <div style={{ fontWeight: 600, color: selected === q.answer ? "#86efac" : "#fca5a5", marginBottom: "4px" }}>
                {selected === q.answer ? "✅ Correct!" : "❌ Incorrect"}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                Correct answer: <strong style={{ color: "#86efac" }}>{q.options[q.answer]}</strong>
              </div>
            </div>
          )}
          {answered && (
            <button style={{ ...S.btn, marginTop: "20px" }} onClick={nextQuestion}>
              {currentQ < questions.length - 1 ? "Next Question →" : "See My Score →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === "score") {
    const pct = Math.round((score / questions.length) * 100);
    const msgs = ["Better luck next time!", "Good effort!", "Well done! 🎉"];
    const colors = ["#f87171", "#fbbf24", "#34d399"];
    const msg = msgs[score] || msgs[2];
    const color = colors[score] || colors[2];
    return (
      <div style={S.root}>
        <div style={S.header}>
          <PhDataLogo />
          <span style={S.headerTitle}>Your Score</span>
        </div>
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: "72px", marginBottom: "4px" }}>{["😅", "🙂", "🏆"][score] || "🏆"}</div>
          <h1 style={{ ...S.h1, fontSize: "48px", color }}>{score}/{questions.length}</h1>
          <p style={{ ...S.sub, fontSize: "18px" }}>{msg}</p>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px", marginBottom: "28px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>Time taken</div>
            <div style={{ fontSize: "22px", fontWeight: 600 }}>{timeTaken}s</div>
          </div>
          <button style={S.btn} onClick={() => setScreen("luckyDraw")}>Enter Lucky Draw 🎁</button>
          <button style={S.btnSecondary} onClick={() => setScreen("leaderboard")}>View Leaderboard</button>
        </div>
      </div>
    );
  }

  if (screen === "luckyDraw") return (
    <div style={S.root}>
      <div style={S.header}>
        <PhDataLogo />
        <span style={S.headerTitle}>Lucky Draw</span>
      </div>
      <div style={S.card}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "42px" }}>🎁</div>
          <h2 style={{ ...S.h2, fontSize: "26px" }}>Enter the Lucky Draw</h2>
          <p style={{ ...S.sub, margin: 0 }}>You scored <strong style={{ color: "#a78bfa" }}>{score}/{questions.length}</strong>. Enter your details for a chance to win! One entry per person.</p>
        </div>
        {ldSubmitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
            <h2 style={{ ...S.h2 }}>You're in!</h2>
            <p style={{ ...S.sub }}>Good luck, {ldForm.name.split(" ")[0]}! We'll reach out if you win.</p>
            <button style={S.btn} onClick={() => setScreen("leaderboard")}>View Leaderboard 🏆</button>
          </div>
        ) : (
          <>
            {ldError && <div style={S.error}>{ldError}</div>}
            <label style={S.label}>Full Name *</label>
            <input style={S.input} placeholder="Your full name" value={ldForm.name} onChange={e => setLdForm(f => ({ ...f, name: e.target.value }))} />
            <label style={S.label}>Phone Number * (India +91)</label>
            <input style={S.input} placeholder="+91XXXXXXXXXX" value={ldForm.phone} onChange={e => setLdForm(f => ({ ...f, phone: e.target.value }))} />
            <label style={S.label}>Email Address *</label>
            <input style={S.input} placeholder="you@example.com" value={ldForm.email} onChange={e => setLdForm(f => ({ ...f, email: e.target.value }))} />
            <button style={{ ...S.btn, opacity: ldLoading ? 0.6 : 1 }} onClick={handleLDSubmit} disabled={ldLoading}>
              {ldLoading ? "Submitting…" : "Submit Entry 🎁"}
            </button>
            <button style={S.btnSecondary} onClick={() => setScreen("leaderboard")}>Skip — View Leaderboard</button>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "leaderboard") return (
    <div style={S.root}>
      <div style={S.header}>
        <PhDataLogo />
        <span style={S.headerTitle}>Live Leaderboard</span>
      </div>
      <div style={S.card}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "42px" }}>🏆</div>
          <h2 style={{ ...S.h2, fontSize: "26px" }}>Leaderboard</h2>
          <p style={{ ...S.sub, margin: 0 }}>Live rankings — updates every few seconds</p>
        </div>
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px 0" }}>
            No entries yet. Be the first! 🚀
          </div>
        ) : (
          <div>
            {leaderboard.slice(0, 20).map((e, i) => (
              <div key={e.phone + i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "12px", marginBottom: "8px", background: i === 0 ? "rgba(251,191,36,0.1)" : i === 1 ? "rgba(200,200,200,0.08)" : i === 2 ? "rgba(180,120,60,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${i < 3 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}` }}>
                <div style={{ width: "32px", textAlign: "center", fontSize: i < 3 ? "22px" : "15px", fontWeight: 700, color: i < 3 ? undefined : "rgba(255,255,255,0.4)" }}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{e.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{e.time}s</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: ["#fbbf24","#d1d5db","#cd7f32"][i] || "#a78bfa" }}>{e.score}/3</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button style={{ ...S.btn, marginTop: "24px" }} onClick={() => setScreen("welcome")}>Home</button>
      </div>
    </div>
  );

  return null;
}