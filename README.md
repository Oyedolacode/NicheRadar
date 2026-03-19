# NicheRadar v6 — Architecture

## Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, HMR, tree-shaking |
| State | Zustand | Simple global store, no boilerplate |
| Styling | CSS Modules + design tokens | Scoped styles, no class collisions |
| Backend | Node + Express | Thin proxy — solves CORS permanently |
| Persistence | localStorage (light) + server (heavy) | Bookmarks, saved niches, queue |
| AI | Anthropic via server proxy | API key never touches the browser |

## Monorepo Layout

```
niche-radar/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Shared UI primitives
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dial.jsx        # Animated score dial
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TopBar.jsx
│   │   ├── pages/              # One file per feature page
│   │   │   ├── Explorer.jsx        ✅ done → migrate
│   │   │   ├── AlgoSimulator.jsx   ✅ done → migrate
│   │   │   ├── TopicMap.jsx        ✅ done → migrate
│   │   │   ├── ViralPredictor.jsx  ✅ done → migrate
│   │   │   ├── BatchPipeline.jsx   ✅ done → migrate
│   │   │   ├── ViralGaps.jsx       ✅ done → migrate
│   │   │   ├── SmallWins.jsx       ✅ done → migrate
│   │   │   ├── ContentFactory.jsx  ✅ done → migrate
│   │   │   ├── ProductionQueue.jsx ✅ done → migrate
│   │   │   ├── Scheduler.jsx       ✅ done → migrate
│   │   │   ├── CompetitorStudio.jsx  ❌ build new
│   │   │   ├── KeywordResearch.jsx   ❌ build new
│   │   │   ├── Bookmarks.jsx         ❌ build new
│   │   │   ├── VideoAnalyzer.jsx     ❌ build new
│   │   │   └── DoThisNext.jsx        ❌ build new
│   │   ├── hooks/              # Shared data-fetching logic
│   │   │   ├── useYouTube.js       # All YT API calls
│   │   │   ├── useNicheScore.js    # Scoring formulas
│   │   │   ├── useCache.js         # localStorage cache
│   │   │   └── useAI.js            # Calls /api/ai proxy
│   │   ├── store/              # Zustand global state
│   │   │   ├── useAppStore.js      # Nav, quota, toasts
│   │   │   ├── useBookmarkStore.js # Saved ideas/niches
│   │   │   └── useQueueStore.js    # Kanban + scheduler
│   │   ├── lib/                # Pure utility functions
│   │   │   ├── formulas.js         # oppScore, viralGap, etc.
│   │   │   ├── generators.js       # Content factory generators
│   │   │   ├── titleScorer.js      # CTR scoring logic
│   │   │   └── formatters.js       # fmt(), fmtP(), esc()
│   │   ├── styles/
│   │   │   ├── tokens.css          # All CSS variables
│   │   │   └── global.css          # Reset + base styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ai.js           # POST /api/ai → Anthropic
│   │   │   ├── youtube.js      # GET /api/youtube/* → YT API
│   │   │   └── data.js         # GET/POST /api/bookmarks, /api/queue
│   │   ├── services/
│   │   │   ├── anthropic.js    # Anthropic SDK wrapper
│   │   │   ├── youtube.js      # YT API wrapper + caching
│   │   │   └── storage.js      # File-based JSON store
│   │   ├── middleware/
│   │   │   ├── rateLimit.js
│   │   │   └── errorHandler.js
│   │   └── index.js            # Express app entry
│   ├── data/                   # JSON persistence (gitignored)
│   │   ├── bookmarks.json
│   │   └── queue.json
│   └── package.json
│
├── .env.example
├── .gitignore
└── package.json                # Root — workspace scripts
```

## Data Flow

```
User action
    │
    ▼
React Page (pages/)
    │
    ├── reads/writes → Zustand Store (store/)
    │
    ├── calls → Custom Hook (hooks/)
    │               │
    │               ├── YouTube data → GET /api/youtube/*
    │               │                       │
    │               │                       └── server/services/youtube.js
    │               │                               └── YT Data API v3
    │               │
    │               └── AI generation → POST /api/ai
    │                                       │
    │                                       └── server/services/anthropic.js
    │                                               └── Anthropic API
    │
    └── renders → Shared Components (components/)
```

## Migration Strategy

Run both versions in parallel. Migrate one page at a time:

1. **Week 1** — Scaffold + migrate Explorer, formulas, cache
2. **Week 2** — Migrate remaining ✅ pages
3. **Week 3** — Build 5 new ❌ features in the clean structure
4. **Week 4** — Polish, mobile, error states, deploy

## Environment Variables

```bash
# server/.env
ANTHROPIC_API_KEY=sk-ant-...
YT_API_KEY=AIza...
PORT=3001
NODE_ENV=development

# client/.env
VITE_API_BASE=http://localhost:3001
```
