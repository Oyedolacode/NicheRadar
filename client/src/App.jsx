import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Toast from './components/Toast'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Explorer = lazy(() => import('./pages/NicheExplorer'))
const AlgoSimulator = lazy(() => import('./pages/AlgoSimulatorV1'))
const TopicMap = lazy(() => import('./pages/TopicMapEngine'))
const ViralPredictor = lazy(() => import('./pages/ViralAI'))
const BatchPipeline = lazy(() => import('./pages/Batch'))
const ViralGaps = lazy(() => import('./pages/ViralGapScanner'))
const SmallWins = lazy(() => import('./pages/SmallWinFinder'))


// ── Production ──
const ContentFactory = lazy(() => import('./pages/Factory'))
const ProductionQueue = lazy(() => import('./pages/Queue'))
const Scheduler = lazy(() => import('./pages/Scheduler'))

// ── New Features ──
const OutlierEngine = lazy(() => import('./pages/OutlierEngine'))
const CompetitorStudio = lazy(() => import('./pages/Competitors'))
const KeywordResearch = lazy(() => import('./pages/KeywordEngine'))
const Bookmarks = lazy(() => import('./pages/BookmarkLab'))
const VideoAnalyzer = lazy(() => import('./pages/VideoAnalyzer'))
const DoThisNext = lazy(() => import('./pages/NextAction'))

// ── Discovery ──
const Trending = lazy(() => import('./pages/Trending'))

const ContentGaps = lazy(() => import('./pages/ContentGapEngine'))

// ── System ──
const Cache = lazy(() => import('./pages/Cache'))

const PageLoader = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: '11px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 24, animation: 'spin 1s linear infinite' }}>📡</div>
      <div style={{ letterSpacing: '2px' }}>CALIBRATING ENGINE...</div>
    </div>
  </div>
)

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
 
            {/* Home */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Intelligence */}
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/simulator" element={<AlgoSimulator />} />
            <Route path="/topic-map" element={<TopicMap />} />
            <Route path="/viral-predictor" element={<ViralPredictor />} />
            <Route path="/batch" element={<BatchPipeline />} />
            <Route path="/viral-gaps" element={<ViralGaps />} />
            <Route path="/small-wins" element={<SmallWins />} />

            {/* Production */}
            <Route path="/factory" element={<ContentFactory />} />
            <Route path="/queue" element={<ProductionQueue />} />
            <Route path="/scheduler" element={<Scheduler />} />

            {/* New Features */}
            <Route path="/outliers" element={<OutlierEngine />} />
            <Route path="/competitors" element={<CompetitorStudio />} />
            <Route path="/keywords" element={<KeywordResearch />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/analyzer" element={<VideoAnalyzer />} />
            <Route path="/do-this-next" element={<DoThisNext />} />

            {/* Discovery */}
            <Route path="/trending" element={<Trending />} />
            <Route path="/content-gaps" element={<ContentGaps />} />

            {/* System */}
            <Route path="/cache" element={<Cache />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/explorer" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toast />
    </div>
  )
}