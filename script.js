// ===== Data: AI Task Mapping =====
const tasks = [
  {
    id: "HD-101",
    title: "Ticket submission form (title, description, category, priority)",
    reason: "Well-scoped UI component with a known contract. Easy to verify visually and with component tests.",
    tag: "ai"
  },
  {
    id: "HD-102",
    title: "Status transition guard (Open → In Progress → Resolved → Closed)",
    reason: "Logic is mechanical once the state model is approved, but the model itself came from a human decision — AI drafts, human verifies against Day 1/2 rules.",
    tag: "partial"
  },
  {
    id: "HD-103",
    title: "Ownership / assignment rules (auto vs. manual)",
    reason: "Still an open question from Day 1. AI must not invent a business rule the team hasn't decided on.",
    tag: "human"
  },
  {
    id: "HD-104",
    title: "Manager dashboard aggregation queries",
    reason: "AI can draft the query shape, but performance and correctness against real ticket volume need human validation.",
    tag: "partial"
  },
  {
    id: "HD-105",
    title: "Notification trigger on status change",
    reason: "Boilerplate integration work with a clear, testable contract (event in, notification out).",
    tag: "ai"
  },
  {
    id: "HD-106",
    title: "Authentication & permission boundaries",
    reason: "Security-critical. Mistakes are costly and hard to detect from output alone — kept human-led with restricted AI access.",
    tag: "human"
  },
  {
    id: "HD-107",
    title: "Unit tests for ticket CRUD endpoints",
    reason: "Strong AI fit for coverage breadth; every generated test is still run and read before being trusted.",
    tag: "ai"
  },
  {
    id: "HD-108",
    title: "Debug: resolved tickets reappearing as Open",
    reason: "AI helps interpret logs and diffs, but root-cause and fix decisions stay human — see the debugging example below.",
    tag: "partial"
  },
  {
    id: "HD-109",
    title: "Knowledge base / self-service structure",
    reason: "Explicitly deferred and unclear in Day 1's open questions. Not a task to hand to AI until scope is decided.",
    tag: "human"
  },
  {
    id: "HD-110",
    title: "Docstrings / inline documentation for existing modules",
    reason: "Low-risk, high-leverage for AI — output is descriptive, not decision-making, and cheap to verify by reading.",
    tag: "ai"
  }
];

const tagLabel = { ai: "AI-SUPPORTED", human: "HUMAN-LED", partial: "PARTIAL" };

function renderTickets() {
  const list = document.getElementById("ticketList");
  list.innerHTML = tasks.map(t => `
    <article class="ticket-card">
      <span class="ticket-card-id">${t.id}</span>
      <div class="ticket-card-body">
        <h4>${t.title}</h4>
        <p>${t.reason}</p>
      </div>
      <div class="ticket-card-tag">
        <span class="tag tag-${t.tag}">${tagLabel[t.tag]}</span>
      </div>
    </article>
  `).join("");
}

// ===== Data: Submission checklist =====
const checklistItems = [
  "AI is not applied blindly to every task",
  "Each AI-supported task has a stated reason",
  "Context and access levels are defined per task",
  "The coding workflow includes a planning step before implementation",
  "AI output is reviewed before acceptance, not accepted on confidence",
  "Debugging includes evidence — reproduction, diff, logs — not only guesses",
  "Verification is visible (tests, runtime checks, diff walkthrough)",
  "Tool update checking is included with named trusted sources",
  "Day 1 and Day 2 scope boundaries are preserved, not restarted",
  "The walkthrough explains reasoning, not just screens"
];

function renderChecklist() {
  const list = document.getElementById("checklistList");
  list.innerHTML = checklistItems.map(item => `<li>${item}</li>`).join("");
}

// ===== Mobile nav toggle =====
function setupMobileNav() {
  const toggle = document.getElementById("sidebarToggle");
  const nav = document.getElementById("sidebarNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// ===== Scroll-spy active nav state =====
function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(sec => observer.observe(sec));
}

document.addEventListener("DOMContentLoaded", () => {
  renderTickets();
  renderChecklist();
  setupMobileNav();
  setupScrollSpy();
});
