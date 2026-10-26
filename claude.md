# CLAUDE.md — FTC News Scraper

> Project context for AI assistants working on this codebase.
> Last updated: 2026-10-23 (via graphify analysis)

## What This Project Is

FTC News Scraper aggregates AI-related news and discussions from Reddit and newsletter sources, then presents them through an interactive web dashboard with real-time wave visualization. It's deployed on Vercel.

**Repository:** `FTC_news_scraper`  
**Stack:** Python 3 (scrapers) + Node.js (server) + Vanilla JS/HTML (frontend)  
**Deployment:** Vercel

---

## Architecture (3-Layer A.N.T.)

```
Aggregation  →  Normalization  →  Presentation
(Reddit/API)    (JSON store)     (Dashboard + Waves)
```

### Layer 1: Aggregation (`tools/`)
| File | Purpose | Entry Point |
|------|---------|-------------|
| `tools/scrapers/reddit_ai.py` | Scrapes AI content from Reddit | `scrape()` |
| `tools/modal_job.py` | Schedules/manages scraping jobs | `scrape_articles()` |
| `tools/scraper_runner.py` | CLI orchestrator for all scrapers | `main()` |

### Layer 2: Storage
- `dashboard/articles.json` — Canonical article data store (read by server, written by scrapers)

### Layer 3: Presentation (`dashboard/`)
| File | Purpose |
|------|---------|
| `index.html` | Dashboard shell template |
| `app.js` | Application logic, data binding |
| `waves.js` | Canvas wave animation engine (god node: `initWaves()`) |
| `styles.css` | Styling |
| `*.png` | Brand logos + source-type placeholders |

### Server
- `server.js` — HTTP server serving dashboard + static assets

### Deployment
- `vercel.json` — Build config (Node.js framework, output dir, routes)

---

## Behavioral Rules (from project constitution)

1. **3-Layer A.N.T. Architecture** — Aggregation → Normalization → Transformation. Respect these boundaries.
2. **LLM logic is probabilistic; business logic is deterministic** — Scraping/fetching must be reliable and reproducible.
3. **Python scripts in `tools/` must be atomic and testable** — Each tool should be independently runnable and verifiable.
4. **Self-annealing loop on error** — System should attempt recovery before failing.

---

## Key Commands

```bash
# Run scraper manually
python tools/scraper_runner.py

# Launch local dashboard
./Launch-Dashboard.bat    # or: node server.js

# Dashboard runs on default port (see server.js)
```

---

## Data Flow

```
Reddit API → reddit_ai.py scrape() → modal_job.py scrape_articles()
    → scraper_runner.py main() → articles.json → server.js
    → browser (index.html + app.js + waves.js)
```

---

## Important Patterns

### Wave Animation System (Community 0)
The `waves.js` file is the most connected module (11 edges from `initWaves()` alone). It manages:
- Canvas-based animated wave visualization
- Mouse/touch interaction (`onMouseMove`, `onTouchMove`)
- Responsive resize handling (`onResize`, `setSize`)
- Line drawing and point animation

**God node:** `initWaves()` — orchestrates all wave functions.

### Scraping Pipeline (Communities 1 & 3)
- `scrape_articles()` is the **bridge node** between Job Scheduler and Reddit Scraper (high betweenness centrality)
- Reddit scraper uses `urllib.request` (no external HTTP library dependency)

### Brand Assets (Community 2)
- Source logos live in `Design Guidlines 2/`
- Dashboard copies in `dashboard/` are derived from source
- Placeholders exist per source type: `placeholder_default.png`, `placeholder_newsletter.png`, `placeholder_reddit.png`

---

## Working With This Codebase

### Adding a New Source
1. Create new scraper in `tools/scrapers/` following `reddit_ai.py` pattern
2. Register it in `tools/modal_job.py` as a new job type
3. Add placeholder image in `dashboard/` if needed
4. Update `articles.json` schema if new fields required

### Modifying the Dashboard
- HTML structure: `dashboard/index.html`
- App logic: `dashboard/app.js`
- Animation: `dashboard/waves.js` (caution — highly interconnected)
- Styles: `dashboard/styles.css`

### Deployment
- Config: `vercel.json`
- Push to main triggers automatic Vercel deployment

---

## Documentation Map

| Document | Content |
|----------|---------|
| `architecture/scraper_sop.md` | Standard operating procedure for scraping |
| `findings.md` | Research findings from scraping analysis |
| `gemini.md` | Gemini API integration notes |
| `progress.md` | Project progress tracker |
| `task_plan.md` | Task planning and roadmap |

---

## Graph Analysis Summary

From the latest graphify run (62 nodes, 68 edges, 11 communities):

- **Most connected:** Wave animation system (`initWaves()` with 11 edges)
- **Key bridge:** `scrape_articles()` connects job scheduler to scraper modules
- **Clean architecture:** No import cycles detected
- **84% extracted edges** (high confidence), 16% inferred
- **Knowledge gap:** Documentation nodes are weakly connected to code — opportunity for better cross-referencing

For full interactive graph: open `graphify-out/graph.html`

---

## Conventions

- Python follows PEP 8
- JavaScript uses ES6+ (no bundler/framework)
- JSON for data interchange
- Markdown for documentation
- Commit messages should reference relevant files/modules
