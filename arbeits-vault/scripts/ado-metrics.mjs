#!/usr/bin/env node
// Holt PR-, Build- und Work-Item-Kennzahlen aus Azure DevOps und schreibt
//   metrics/raw/prs-YYYY-MM.json, metrics/raw/workitems-YYYY-MM.json, metrics/YYYY-MM.md
//
// Aufruf:  AZDO_PAT=... node scripts/ado-metrics.mjs [--monat 2026-11] [--config pfad]
// PAT-Rechte: Code (Read), Build (Read), Work Items (Read). Node 18+, keine Abhängigkeiten.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const cfg = {
  apiVersion: "7.1",
  repositories: [],
  scope: "mine",
  namen: false,
  inProgressStates: ["Active", "In Progress", "Committed", "Doing"],
  doneStates: ["Closed", "Done", "Removed"],
  bugTypes: ["Bug"],
  areaPath: "",
  ...JSON.parse(await readFile(arg("--config") ?? join(root, "scripts", "ado.config.json"), "utf8")),
};
const pat = process.env.AZDO_PAT;
if (!pat) fail("Umgebungsvariable AZDO_PAT fehlt (Personal Access Token).");
if (/ORGANISATION|PROJEKT/.test(cfg.baseUrl + cfg.project)) fail("scripts/ado.config.json ausfüllen: baseUrl und project.");

const now = new Date();
const month = arg("--monat") ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
if (!/^\d{4}-\d{2}$/.test(month)) fail("--monat im Format YYYY-MM angeben.");
const [y, m] = month.split("-").map(Number);
const from = new Date(y, m - 1, 1);
const to = new Date(y, m, 1);

function fail(msg) {
  console.error(`Fehler: ${msg}`);
  process.exit(1);
}

// ---------- HTTP ----------

const base = cfg.baseUrl.replace(/\/+$/, "");
const auth = "Basic " + Buffer.from(":" + pat).toString("base64");

async function api(path, { query = {}, body, project = true } = {}) {
  const url = new URL(`${base}/${project ? encodeURIComponent(cfg.project) + "/" : ""}_apis/${path}`);
  for (const [k, v] of Object.entries({ ...query, "api-version": cfg.apiVersion })) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: auth, Accept: "application/json", ...(body && { "Content-Type": "application/json" }) },
    body: body && JSON.stringify(body),
  });
  const isJson = (res.headers.get("content-type") ?? "").includes("json");
  if (!res.ok || !isJson) {
    const hint = res.status === 203 || res.status === 401 ? " (PAT ungültig, abgelaufen oder ohne die nötigen Rechte?)" : "";
    fail(`${res.status} bei ${url.pathname}${hint}\n${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

// ---------- Helfer ----------

const hours = (a, b) => (a && b ? (new Date(b) - new Date(a)) / 36e5 : null);
const round = (n, d = 1) => (n == null ? null : Math.round(n * 10 ** d) / 10 ** d);
const quantile = (xs, q) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (pos - lo);
};
const median = (xs) => quantile(xs, 0.5);
const sum = (xs) => xs.reduce((a, b) => a + (b ?? 0), 0);
const dur = (h) => (h == null ? "–" : h < 48 ? `${round(h)} h` : `${round(h / 24)} d`);
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/[[\]]/g, "");
const wiqlDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

let me;
function person(identity) {
  if (!identity?.id) return "unbekannt";
  if (identity.id === me.id) return "ich";
  if (cfg.namen) return identity.displayName ?? identity.id;
  return "P-" + createHash("sha256").update(identity.id).digest("hex").slice(0, 5);
}
const VOTE = { 10: "✔", 5: "✔~", 0: "–", "-5": "⏳", "-10": "✖" };

// ---------- Pull Requests ----------

async function listPrs(criteria) {
  const out = [];
  for (let skip = 0; skip < 5000; skip += 100) {
    const r = await api("git/pullrequests", {
      query: {
        "searchCriteria.status": "completed",
        "searchCriteria.queryTimeRangeType": "closed",
        "searchCriteria.minTime": from.toISOString(),
        "searchCriteria.maxTime": to.toISOString(),
        ...criteria,
        $top: 100,
        $skip: skip,
      },
    });
    out.push(...r.value);
    if (r.value.length < 100) break;
  }
  return out;
}

function analyseThreads(threads, pr) {
  const votes = [];
  let comments = 0;
  let commentThreads = 0;
  for (const t of threads) {
    if (t.isDeleted) continue;
    if (t.properties?.CodeReviewThreadType?.$value === "VoteUpdate") {
      const key = t.properties.CodeReviewVotedByIdentity?.$value;
      const who = t.identities?.[key] ?? t.comments?.[0]?.author;
      votes.push({ at: t.publishedDate, vote: Number(t.properties.CodeReviewVoteResult?.$value), id: who?.id });
      continue;
    }
    const human = (t.comments ?? []).filter((c) => c.commentType === "text" && !c.isDeleted);
    if (!human.length) continue;
    commentThreads++;
    comments += human.length;
  }
  votes.sort((a, b) => new Date(a.at) - new Date(b.at));
  const approvals = votes.filter((v) => v.vote >= 5 && v.id !== pr.createdBy.id);
  const firstApproval = approvals[0]?.at ?? null;

  // "Alle Approves": Zeitpunkt, an dem der letzte der am Ende zustimmenden Reviewer zugestimmt hat.
  const finalApprovers = (pr.reviewers ?? []).filter((r) => !r.isContainer && r.vote >= 5);
  const lastPerApprover = finalApprovers.map((r) => approvals.filter((v) => v.id === r.id).at(-1)?.at);
  const allApproved =
    finalApprovers.length && lastPerApprover.every(Boolean)
      ? lastPerApprover.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
      : null;
  return { comments, commentThreads, firstApproval, allApproved, approvers: finalApprovers.length };
}

async function prRecord(pr) {
  const repo = pr.repository.id;
  const [threads, builds] = await Promise.all([
    api(`git/repositories/${repo}/pullRequests/${pr.pullRequestId}/threads`),
    api("build/builds", {
      query: {
        branchName: `refs/pull/${pr.pullRequestId}/merge`,
        reasonFilter: "pullRequest",
        repositoryId: repo,
        repositoryType: "TfsGit",
        $top: 500,
      },
    }),
  ]);
  const t = analyseThreads(threads.value, pr);
  const runs = builds.value.map((b) => ({
    pipeline: b.definition?.name,
    result: b.result ?? b.status,
    queued: b.queueTime,
    minutes: round((hours(b.startTime, b.finishTime) ?? 0) * 60),
    waitMinutes: round((hours(b.queueTime, b.startTime) ?? 0) * 60),
  }));
  const reviewers = (pr.reviewers ?? []).filter((r) => !r.isContainer);
  return {
    id: pr.pullRequestId,
    title: pr.title,
    repo: pr.repository.name,
    target: pr.targetRefName?.replace("refs/heads/", ""),
    author: person(pr.createdBy),
    role: pr.createdBy.id === me.id ? "Autor" : "Reviewer",
    reviewers: reviewers.map((r) => ({ who: person(r), vote: r.vote, required: !!r.isRequired })),
    created: pr.creationDate,
    closed: pr.closedDate,
    leadHours: round(hours(pr.creationDate, pr.closedDate)),
    firstApprovalHours: round(hours(pr.creationDate, t.firstApproval)),
    allApprovedHours: round(hours(pr.creationDate, t.allApproved)),
    approvers: t.approvers,
    comments: t.comments,
    commentThreads: t.commentThreads,
    builds: {
      runs: runs.length,
      failed: runs.filter((r) => r.result === "failed").length,
      canceled: runs.filter((r) => r.result === "canceled").length,
      totalMinutes: round(sum(runs.map((r) => r.minutes))),
      medianMinutes: round(median(runs.map((r) => r.minutes))),
      details: runs,
    },
  };
}

// ---------- Work Items ----------

async function wiql(where) {
  const area = cfg.areaPath ? ` AND [System.AreaPath] UNDER '${cfg.areaPath.replace(/'/g, "''")}'` : "";
  const r = await api("wit/wiql", {
    body: { query: `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = @project AND ${where}${area}` },
  });
  return r.workItems.map((w) => w.id);
}

async function workItemRecord(id, fields) {
  const updates = [];
  for (let skip = 0; ; skip += 200) {
    const r = await api(`wit/workItems/${id}/updates`, { query: { $top: 200, $skip: skip }, project: false });
    updates.push(...r.value);
    if (r.value.length < 200) break;
  }
  let state = null;
  let since = null;
  let inProgressHours = 0;
  let starts = 0;
  const active = (s) => cfg.inProgressStates.includes(s);
  for (const u of updates) {
    const change = u.fields?.["System.State"];
    if (!change) continue;
    const at = u.fields["System.ChangedDate"]?.newValue ?? u.revisedDate;
    if (active(state)) inProgressHours += hours(since, at);
    if (active(change.newValue) && !active(state)) starts++;
    state = change.newValue;
    since = at;
  }
  if (active(state)) inProgressHours += hours(since, new Date());
  return {
    id,
    type: fields["System.WorkItemType"],
    title: fields["System.Title"],
    state: fields["System.State"],
    created: fields["System.CreatedDate"],
    closed: fields["Microsoft.VSTS.Common.ClosedDate"] ?? null,
    inProgressHours: round(inProgressHours),
    starts,
  };
}

async function loadWorkItems() {
  const ids = await wiql(`[System.AssignedTo] = @Me AND [System.ChangedDate] >= '${wiqlDate(from)}'`);
  const fields = {};
  for (let i = 0; i < ids.length; i += 200) {
    const r = await api("wit/workitemsbatch", {
      project: false,
      body: {
        ids: ids.slice(i, i + 200),
        fields: ["System.Title", "System.WorkItemType", "System.State", "System.CreatedDate", "Microsoft.VSTS.Common.ClosedDate"],
      },
    });
    for (const w of r.value) fields[w.id] = w.fields;
  }
  return pool(ids, 5, (id) => workItemRecord(id, fields[id]));
}

async function loadBugCounts() {
  const types = cfg.bugTypes.map((t) => `'${t.replace(/'/g, "''")}'`).join(", ");
  const done = cfg.doneStates.map((s) => `'${s.replace(/'/g, "''")}'`).join(", ");
  const range = (f) => `[${f}] >= '${wiqlDate(from)}' AND [${f}] < '${wiqlDate(to)}'`;
  const [created, closed, open] = await Promise.all([
    wiql(`[System.WorkItemType] IN (${types}) AND ${range("System.CreatedDate")}`),
    wiql(`[System.WorkItemType] IN (${types}) AND ${range("Microsoft.VSTS.Common.ClosedDate")}`),
    wiql(`[System.WorkItemType] IN (${types}) AND [System.State] NOT IN (${done})`),
  ]);
  return { created: created.length, closed: closed.length, openNow: open.length };
}

// ---------- Ablauf ----------

me = (await api("connectionData", { project: false, query: { "api-version": cfg.apiVersion + "-preview" } })).authenticatedUser;
console.log(`Angemeldet als ${me.providerDisplayName ?? me.id}, Zeitraum ${month}, Umfang "${cfg.scope}"`);

const lists =
  cfg.scope === "all"
    ? [await listPrs({})]
    : await Promise.all([listPrs({ "searchCriteria.creatorId": me.id }), listPrs({ "searchCriteria.reviewerId": me.id })]);
const seen = new Set();
const prList = lists
  .flat()
  .filter((p) => !seen.has(p.pullRequestId) && seen.add(p.pullRequestId))
  .filter((p) => new Date(p.closedDate) >= from && new Date(p.closedDate) < to)
  .filter((p) => !cfg.repositories.length || cfg.repositories.includes(p.repository.name));

console.log(`${prList.length} abgeschlossene PRs, lade Threads und Builds …`);
const prs = (await pool(prList, 5, prRecord)).sort((a, b) => new Date(a.closed) - new Date(b.closed));

console.log("Lade Work Items …");
const workItems = await loadWorkItems();
const bugs = await loadBugCounts();

// ---------- Ausgabe ----------

const rawDir = join(root, "metrics", "raw");
await mkdir(rawDir, { recursive: true });
await writeFile(join(rawDir, `prs-${month}.json`), JSON.stringify(prs, null, 2));
await writeFile(join(rawDir, `workitems-${month}.json`), JSON.stringify({ workItems, bugs }, null, 2));

const mine = prs.filter((p) => p.role === "Autor");
const stats = (set) => ({
  n: set.length,
  lead: median(set.map((p) => p.leadHours)),
  leadP90: quantile(set.map((p) => p.leadHours), 0.9),
  first: median(set.map((p) => p.firstApprovalHours)),
  all: median(set.map((p) => p.allApprovedHours)),
  comments: median(set.map((p) => p.comments)),
  runs: median(set.map((p) => p.builds.runs)),
  failed: sum(set.map((p) => p.builds.failed)),
  totalRuns: sum(set.map((p) => p.builds.runs)),
  buildMinutes: sum(set.map((p) => p.builds.totalMinutes)),
});
const row = (label, s) =>
  `| ${label} | ${s.n} | ${dur(s.lead)} | ${dur(s.leadP90)} | ${dur(s.first)} | ${dur(s.all)} | ${s.comments ?? "–"} | ${s.runs ?? "–"} | ${
    s.totalRuns ? Math.round((s.failed / s.totalRuns) * 100) + " %" : "–"
  } | ${round(s.buildMinutes / 60)} h |`;

let md = `---\ntype: metric\nmonat: "[[${month}]]"\nstand: ${now.toISOString().slice(0, 10)}\nprs: ${prs.length}\n---\n\n`;
md += `Erzeugt von \`scripts/ado-metrics.mjs\`. Nicht von Hand bearbeiten. Rohdaten: \`metrics/raw/\`.\n\n`;
md += `## Pull Requests (abgeschlossen in ${month})\n\n`;
md += `| | Anzahl | Durchlauf Median | Durchlauf P90 | bis 1. Approve | bis alle Approves | Kommentare Median | Build-Läufe Median | fehlgeschlagen | Build-Zeit gesamt |\n|---|---|---|---|---|---|---|---|---|---|\n`;
md += row("Meine PRs", stats(mine)) + "\n" + row("Alle im Umfang", stats(prs)) + "\n\n";
md += `Zeiten ab Erstellung des PR, Draft-Phasen eingeschlossen. Reviewer: ✔ Approve, ✔~ mit Anmerkungen, ⏳ wartet auf Autor, ✖ abgelehnt, – kein Votum.\n\n`;
md += `| PR | Titel | Repo | Rolle | Autor | Reviewer | Durchlauf | 1. Approve | alle Approves | Kommentare | Builds (fehlg.) | Build-Zeit |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const p of prs) {
  const rev = p.reviewers.map((r) => `${cell(r.who)} ${VOTE[r.vote] ?? r.vote}`).join(", ") || "–";
  md += `| ${p.id} | ${cell(p.title)} | ${cell(p.repo)} | ${p.role} | ${cell(p.author)} | ${rev} | ${dur(p.leadHours)} | ${dur(p.firstApprovalHours)} | ${dur(p.allApprovedHours)} | ${p.comments} | ${p.builds.runs} (${p.builds.failed}) | ${p.builds.totalMinutes} min |\n`;
}
if (!prs.length) md += `| – | keine | | | | | | | | | | |\n`;

md += `\n## Meine Work Items (geändert seit ${wiqlDate(from)})\n\n`;
const byType = {};
for (const w of workItems) (byType[w.type] ??= []).push(w);
md += `| Typ | Anzahl | in Bearbeitung Median | davon abgeschlossen |\n|---|---|---|---|\n`;
for (const [type, items] of Object.entries(byType)) {
  md += `| ${cell(type)} | ${items.length} | ${dur(median(items.map((w) => w.inProgressHours || null)))} | ${items.filter((w) => cfg.doneStates.includes(w.state)).length} |\n`;
}
md += `\n"In Bearbeitung" = Summe der Zeit in den Status ${cfg.inProgressStates.join(", ")}, Wochenenden eingeschlossen.\n\n`;
md += `| ID | Typ | Titel | Status | in Bearbeitung | Anläufe |\n|---|---|---|---|---|---|\n`;
for (const w of workItems.sort((a, b) => (b.inProgressHours ?? 0) - (a.inProgressHours ?? 0))) {
  md += `| ${w.id} | ${cell(w.type)} | ${cell(w.title)} | ${cell(w.state)} | ${dur(w.inProgressHours || null)} | ${w.starts} |\n`;
}
md += `\n## Bugs im Projekt${cfg.areaPath ? ` (${cfg.areaPath})` : ""}\n\n`;
md += `- Neu in ${month}: **${bugs.created}**\n- Geschlossen in ${month}: **${bugs.closed}**\n- Aktuell offen: **${bugs.openNow}**\n`;

await writeFile(join(root, "metrics", `${month}.md`), md);
console.log(`Fertig: metrics/${month}.md, ${prs.length} PRs, ${workItems.length} Work Items`);
