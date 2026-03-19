import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/Topbar'
import Toast from './components/Toast'

// ── Lazy load every page (smaller initial bundle) ──
const Explorer = lazy(() => import('./pages/explorer'))
const AlgoSimulator = lazy(() => import('./pages/algosimulator'))
const TopicMap = lazy(() => import('./pages/topicmap'))
const ViralPredictor = lazy(() => import('./pages/viralpredictor'))
const BatchPipeline = lazy(() => import('./pages/batchpipeline'))
const ViralGaps = lazy(() => import('./pages/viralgaps'))
const SmallWins = lazy(() => import('./pages/smallwins'))
const ContentFactory = lazy(() => import('./pages/contentfactory'))
const ProductionQueue = lazy(() => import('./pages/productionqueue'))
const Scheduler = lazy(() => import('./pages/scheduler'))
const Trending = lazy(() => import('./pages/trending'))
const ContentGaps = lazy(() => import('./pages/contentgaps'))
const Cache = lazy(() => import('./pages/cache'))
// New features
const CompetitorStudio = lazy(() => import('./pages/competitorstudio'))
const KeywordResearch = lazy(() => import('./pages/keywordresearch'))
const Bookmarks = lazy(() => import('./pages/bookmarks'))
const VideoAnalyzer = lazy(() => import('./pages/videoanalyzer'))
const DoThisNext = lazy(() => import('./pages/dothisnext'))
const WinningChannelFinder = lazy(() => import('./pages/winningchannelfinder'))
const CloneFactory = lazy(() => import('./pages/clonefactory'))

// ── Loading fallback ──
const PageLoader = () => (
    <div className="v-stack" style={{ padding: 'var(--s12)', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: '13px' }}>
        <div className="spin" style={{ fontSize: 32, marginBottom: 'var(--s4)' }}>📡</div>
        <div style={{ fontWeight: 700, letterSpacing: 2 }}>RADAR SCANNING…</div>
    </div>
)

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Sidebar />
      <div className="main-content" style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <TopBar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/explorer" replace />} />
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
            <Route path="/clone-factory" element={<CloneFactory />} />
            <Route path="/queue" element={<ProductionQueue />} />
            <Route path="/scheduler" element={<Scheduler />} />
            {/* New features */}
            <Route path="/competitors" element={<CompetitorStudio />} />
            <Route path="/keywords" element={<KeywordResearch />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/analyzer" element={<VideoAnalyzer />} />
            <Route path="/do-this-next" element={<DoThisNext />} />
            <Route path="/winning-channels" element={<WinningChannelFinder />} />
            {/* Discovery */}
            <Route path="/trending" element={<Trending />} />
            <Route path="/content-gaps" element={<ContentGaps />} />
            {/* System */}
            <Route path="/cache" element={<Cache />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/explorer" replace />} />
          </Routes>
        </Suspense>
      </div>
      <Toast />
    </div>
  )
}