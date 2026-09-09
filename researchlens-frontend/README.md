# ResearchLens Frontend

A standalone React frontend for ResearchLens, built to run on mock data
today and plug into your real FastAPI backend with a single-file change.

## The landing page

The hero is a real 3D scene (React Three Fiber / Three.js), not a CSS
approximation — a continuous field of paper-textured meshes drifting
right → center → left across three depth layers, with a cursor-reactive
"lens" effect and two hover zones (left = featured paper, right =
citation network). It's lazy-loaded so the 3D dependency never blocks
the rest of the app's bundle, and it fully respects
`prefers-reduced-motion` (falls back to a static composed scene) and
screen size (fewer papers, no parallax/hover-zones below ~820px).

Source lives in `src/components/Landing3D/`:

| File | Job |
|---|---|
| `paperTextures.js` | Canvas-drawn textures for 8 paper archetypes (journal, ML, stats, medical, math, conference, lit review, thesis) — generated once, cached, reused across instances |
| `paperLayout.js` | Deterministic (seeded) generation of each paper's layer, position, speed, and motion parameters |
| `PaperMesh.jsx` | A single paper — thin box geometry, not a flat plane, so it has a real edge and a darker backside when it tumbles |
| `PapersField.jsx` | The animation driver — moves every paper each frame via direct ref mutation (no React re-renders), handles the intro fade and the cursor-lens sharpening |
| `ParticlesField.jsx` | The faint background dot field |
| `ResearchScene.jsx` | Camera, lighting, fog, and the mouse-parallax group |
| `SceneCanvas.jsx` | The `<Canvas>` wrapper |
| `FeaturedPaperOverlay.jsx` / `CitationNetworkOverlay.jsx` | HTML/SVG overlays for the two hover zones — built as DOM, not WebGL, so the text stays crisp |
| `GhostMetadata.jsx` | The faint corner system-text |

**Scope note:** this implements the core of a much larger brief (the
full spec called for 12 paper archetypes and 5 hover zones with a
multi-section scroll narrative). I built 8 archetypes and 2 hover
zones at real quality rather than a thinner version of everything, and
kept the existing single scroll-to-enter behavior rather than turning
this into a multi-page narrative site.

## Theme

The whole app runs on a golden-white / light-grey palette — a deep
antique gold accent (`#7A5E2A`, not bright yellow-gold — deliberately
dark enough to keep white text readable on top of it), warm
golden-white backgrounds, and light grey-gold hairlines. It's defined
once as CSS variables in `src/index.css` (`--color-lamp`,
`--color-paper`, etc.) and consumed everywhere through Tailwind's
semantic classes (`bg-lamp`, `text-ink`, `bg-paper`...), so the whole
app shell re-themes from a single place. Dark mode (via the sidebar
toggle) pairs a warm charcoal background with a brighter gold accent
for contrast.

The landing page's 3D scene is the one exception — Three.js materials
can't read CSS variables, so its colors are hardcoded hex values
matching the same palette, in `paperTextures.js`, `PaperMesh.jsx`,
`ResearchScene.jsx`, and `ParticlesField.jsx`. The landing page always
renders this golden-white look regardless of the dark-mode toggle
(the toggle only affects the app shell you see after entering) — kept
that way deliberately so the WebGL scene and its DOM overlay text can
never fall out of sync with each other.

## Running it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Everything works immediately —
searching, the Preview Papers tab, Insights (Compare/Trends/Gaps),
history and projects (saved in your browser) — all against realistic
mock data.

## How this maps to your ResearchLens backend

| Frontend piece | Backend endpoint it's built for |
|---|---|
| Search tab | `POST /review/generate` |
| Preview Papers tab | uses `references` returned by `/review/generate` |
| Insights → Trends | `POST /trends/analyze` |
| Insights → Gap score | `POST /gaps/analyze` |
| Insights → Compare topics | **not built on the backend yet** — see below |

## Connecting your real backend

This is now wired up for real — `USE_MOCK_DATA` in `src/lib/api.js` is
`false` by default, so `generateReview`, `getTrends`, and `getGaps`
call your actual FastAPI backend.

1. Start your backend (`uvicorn main:app --reload`, from `backend/`) —
   runs on `http://localhost:8000` by default.
2. `npm run dev` here.
3. That's it. CORS is already open on the backend
   (`allow_origins=["*"]`), no extra config needed.

Want to work on the UI without the backend running? Flip
`USE_MOCK_DATA` to `true` at the top of `src/lib/api.js` — everything
falls back to the same realistic mock data used during development.
`compareTopics` always uses mock data regardless of this flag, since
that endpoint doesn't exist on the backend yet (see below).

## What's fully real right now (not mock, works as-is)

- Search history and projects — saved to `localStorage`, survive a
  refresh
- Citation formatting (APA/MLA/BibTeX) and copy-to-clipboard — pure
  string formatting from paper metadata, handles both bare DOIs and
  the full-URL DOIs OpenAlex actually returns
- DOI links on every paper — open the real source; papers with no DOI
  (common for preprints/older work) render as non-clickable instead of
  a broken link
- In-text citation → source jump between Search and Preview Papers —
  works on any review text with `(Author, Year)` citations
- **Export report → PDF** — generates a real, paginated PDF client-side
  with `jsPDF` (title, headings, wrapped body text, formatted
  references). Markdown export is also available from the same menu.
- **Dark / light theme toggle** — click the sun/moon icon on the
  landing page or in the sidebar. Preference is saved to
  `localStorage` and respects system preference on first visit.
- Gap Score's cluster diagram (`GapConstellation`) — a real SVG plot
  built from the same `/gaps/analyze` response, not a placeholder.
- **Search, Trends, and Gap Score all hit the real backend now** — see
  above.

## What still needs backend work

- **Structured extraction table UI** — the backend now returns
  `extraction` (methodology/dataset/key finding/limitation per paper)
  and `extraction_completeness` on every `/review/generate` response,
  but there's no frontend view for it yet. That's the next thing to
  build — a List/Table toggle on Preview Papers.
- **Year range / min. citations filters** — the UI is built and wired
  into the request, but the backend's `/review/generate` and
  `/trends/analyze` endpoints don't accept them yet. OpenAlex supports
  both as query filters, so this is a small addition to
  `papers/fetcher.py`, not a redesign.
- **Compare Topics** — this is a genuinely new endpoint. The frontend
  expects a response shaped like:
  ```json
  {
    "topic_a": "...", "topic_b": "...",
    "papers_a": 34, "papers_b": 41,
    "shared_themes": ["..."],
    "distinct_to_a": ["..."],
    "distinct_to_b": ["..."],
    "bridging_opportunity": "...",
    "overlap_score": 0.34
  }
  ```
  The clustering math from your `gaps` module (density, recency,
  centroid distance) reuses directly for this — the new part is the
  written synthesis (`shared_themes`, `bridging_opportunity`), which
  needs an LLM call structured like `review/generator.py`, fed
  excerpts from both topics' retrieved papers.
- **Export as .docx** — PDF export works fully client-side today. Your
  backend already has `review/exporter.py` for real docx generation;
  wiring a "PDF from backend" or "Word" option in is a small addition
  to `src/lib/exportReport.js` if you want the export to go through
  your server instead.

## Project structure


```
src/
  lib/           mock data, api.js (the one file to edit), citation
                 formatting, citation-text parsing, localStorage helpers
  hooks/         useHistory — history + projects state
  components/
    Landing/     hero screen + the CSS 3D ribbon animation
    Shell/       sidebar, sticky tab bar, app shell
    Search/      topic input, filters, loading state, review renderer
    Preview/     paper list, hover-preview card, citation block
    Insights/    compare topics, trends, gap score
    icons/       the app's custom icon set
```