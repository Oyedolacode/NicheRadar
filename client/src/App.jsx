import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Toast from './components/Toast'

// ── Lazy load every page ──
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
const CompetitorStudio = lazy(() => import('./pages/competitorstudio'))
const KeywordResearch = lazy(() => import('./pages/keywordresearch'))
const Bookmarks = lazy(() => import('./pages/bookmarks'))
const VideoAnalyzer = lazy(() => import('./pages/videoanalyzer'))
const DoThisNext = lazy(() => import('./pages/dothisnext'))
const WinningChannelFinder = lazy(() => import('./pages/winningchannelfinder'))
const CloneFactory = lazy(() => import('./pages/clonefactory'))

const PageLoader = () => (
    <div className="v-stack" style={{ padding: 'var(--s12)', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: '12px' }}>
        <div className="spin" style={{ fontSize: 32, marginBottom: 'var(--s4)' }}>📡</div>
        <div style={{ fontWeight: 800, letterSpacing: 3, color: 'var(--accent)' }}>RADAR SCANNING...</div>
    </div>
)

export default function App() {
  return (
    <div className="app-container" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Topbar />
        
        <main style={{ marginTop: 'calc(var(--topbar-h) + 48px)', padding: '0 24px 48px 0' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/explorer" replace />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/simulator" element={<AlgoSimulator />} />
              <Route path="/topic-map" element={<TopicMap />} />
              <Route path="/viral-predictor" element={<ViralPredictor />} />
              <Route path="/batch" element={<BatchPipeline />} />
              <Route path="/viral-gaps" element={<ViralGaps />} />
              <Route path="/small-wins" element={<SmallWins />} />
              <Route path="/factory" element={<ContentFactory />} />
              <Route path="/clone-factory" element={<CloneFactory />} />
              <Route path="/queue" element={<ProductionQueue />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/competitors" element={<CompetitorStudio />} />
              <Route path="/keywords" element={<KeywordResearch />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/analyzer" element={<VideoAnalyzer />} />
              <Route path="/do-this-next" element={<DoThisNext />} />
              <Route path="/winning-channels" element={<WinningChannelFinder />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/content-gaps" element={<ContentGaps />} />
              <Route path="/cache" element={<Cache />} />
              <Route path="*" element={<Navigate to="/explorer" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toast />
    </div>
  )
}