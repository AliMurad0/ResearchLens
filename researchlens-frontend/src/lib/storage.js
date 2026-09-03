/**
 * Thin wrapper around localStorage. This is a standalone app (not a
 * Claude Artifact), so real browser storage is appropriate here and
 * is what makes search history/projects survive a page refresh.
 */

const HISTORY_KEY = "researchlens.history";
const PROJECTS_KEY = "researchlens.projects";

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private browsing, quota) -- fail silently,
    // the app still works within the session
  }
}

export function getHistory() {
  return safeRead(HISTORY_KEY, []);
}

export function addToHistory(entry) {
  const history = getHistory();
  const next = [
    { id: crypto.randomUUID(), createdAt: Date.now(), ...entry },
    ...history.filter((h) => h.topic !== entry.topic),
  ].slice(0, 30);
  safeWrite(HISTORY_KEY, next);
  return next;
}

export function removeFromHistory(id) {
  const next = getHistory().filter((h) => h.id !== id);
  safeWrite(HISTORY_KEY, next);
  return next;
}

export function getProjects() {
  return safeRead(PROJECTS_KEY, []);
}

export function createProject(name) {
  const projects = getProjects();
  const next = [...projects, { id: crypto.randomUUID(), name, historyIds: [] }];
  safeWrite(PROJECTS_KEY, next);
  return next;
}

export function addHistoryToProject(projectId, historyId) {
  const projects = getProjects();
  const next = projects.map((p) =>
    p.id === projectId && !p.historyIds.includes(historyId)
      ? { ...p, historyIds: [...p.historyIds, historyId] }
      : p
  );
  safeWrite(PROJECTS_KEY, next);
  return next;
}

export function deleteProject(projectId) {
  const next = getProjects().filter((p) => p.id !== projectId);
  safeWrite(PROJECTS_KEY, next);
  return next;
}
