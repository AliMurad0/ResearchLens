/**
 * ============================================================
 *  THIS IS THE FILE THAT CONNECTS TO YOUR BACKEND.
 * ============================================================
 *
 * Set USE_MOCK_DATA to true any time you want to work on the UI
 * without the backend running -- every function falls back to the
 * same realistic mock data used during initial development.
 */

import {
  MOCK_PAPERS,
  MOCK_REVIEW_TEXT,
  MOCK_TRENDS,
  MOCK_GAPS,
  mockCompareTopics,
} from "./mockData";

export const BACKEND_URL =
import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const USE_MOCK_DATA = false;

const NETWORK_DELAY_MS = 900;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postJSON(path, body) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "Request failed";
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      // response wasn't JSON -- keep the generic message
    }
    throw new Error(detail);
  }
  return res.json();
}

/**
 * @param {string} topic
 * @param {{ maxResults: number, fastMode: boolean, yearRange: [number, number], minCitations: number }} filters
 * @param {(stage: string) => void} onProgress
 */
export async function generateReview(topic, filters, onProgress) {
  if (USE_MOCK_DATA) {
    onProgress?.(`Scanning ${filters.maxResults} papers on "${topic}"...`);
    await delay(NETWORK_DELAY_MS);
    onProgress?.(`Analyzing top ${Math.min(12, filters.maxResults)} sources...`);
    await delay(NETWORK_DELAY_MS);
    onProgress?.("Writing literature review...");
    await delay(NETWORK_DELAY_MS * 1.4);

    return {
      topic,
      review_text: MOCK_REVIEW_TEXT,
      references: MOCK_PAPERS,
      sources_used: MOCK_PAPERS.length,
      papers_scanned: filters.maxResults,
      extraction: [],
      extraction_completeness: 0,
    };
  }

  // NOTE: yearRange and minCitations aren't sent -- the backend doesn't
  // accept them yet (see README). They're visible in the UI but don't
  // affect results until that's added server-side.
  onProgress?.(`Scanning ${filters.maxResults} papers on "${topic}"...`);
  // A single request can't report real progress mid-flight, so this is
  // a staged message shown while the one request is in flight, not a
  // literal step-by-step status from the server.
  const progressTimer = setTimeout(
    () => onProgress?.("Writing literature review..."),
    NETWORK_DELAY_MS * 2
  );

  try {
    const data = await postJSON("/review/generate", {
      topic,
      max_results: filters.maxResults,
      fast_mode: filters.fastMode,
    });
    // Backend returns snake_case fields matching this shape already:
    // { topic, review_text, references, sources_used, papers_scanned,
    //   extraction, extraction_completeness, tokens_used, docx_filename, pdf_filename }
    return data;
  } finally {
    clearTimeout(progressTimer);
  }
}

export async function getTrends(topic) {
  if (USE_MOCK_DATA) {
    await delay(NETWORK_DELAY_MS);
    return { ...MOCK_TRENDS, topic };
  }
  return postJSON("/trends/analyze", { topic, max_papers: 50 });
}

export async function getGaps(topic, maxResults = 40) {
  if (USE_MOCK_DATA) {
    await delay(NETWORK_DELAY_MS * 1.2);
    return { ...MOCK_GAPS, topic };
  }
  return postJSON("/gaps/analyze", { topic, max_results: maxResults });
}

/**
 * NOT YET BUILT ON THE BACKEND -- always mock for now. See README.md
 * for what a /compare/analyze endpoint would need to return.
 */
export async function compareTopics(topicA, topicB) {
  await delay(NETWORK_DELAY_MS * 1.3);
  return mockCompareTopics(topicA, topicB);
}
