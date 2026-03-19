import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'

// ── v5 Pages ──
const Explorer = lazy(() => import('./pages/explorer'))
const Factory = lazy(() => import('./pages/factory'))
const Queue = lazy(() => import('./pages/queue'))
const Scheduler = lazy(() => import('./pages/scheduler'))
const AlgSim = lazy(() => import('./pages/algsim'))
const TopicMap = lazy(() => import('./pages/topicmap'))
const ViralAI = lazy(() => import('./pages/viral_ai'))
const Batch = lazy(() => import('./pages/batch'))
const Viral = lazy(() => import('./pages/viral'))
const Wins = lazy(() => import('./pages/wins'))
const Trending = lazy(() => import('./pages/trending'))
const Gaps = lazy(() => import('./pages/gaps'))
const Cache = lazy(() => import('./pages/cache'))

const PageLoader = () => (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: '11px' }}>
        <div className="v-stack" style={{ alignItems: 'center', gap: '8px' }}>
          <div className="spin" style={{ fontSize: '24px' }}>📡</div>
          <div style={{ letterSpacing: '2px' }}>CALIBRATING ENGINE...</div>
        </div>
    </div>
)

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        {/* Progress Bar (Legacy UI style) */}
        <div className="pbar"><div className="pbf" id="pbf"></div></div>
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/explorer" replace />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/factory" element={<Factory />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/algsim" element={<AlgSim />} />
            <Route path="/topicmap" element={<TopicMap />} />
            <Route path="/viral_ai" element={<ViralAI />} />
            <Route path="/batch" element={<Batch />} />
            <Route path="/viral" element={<Viral />} />
            <Route path="/wins" element={<Wins />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/gaps" element={<Gaps />} />
            <Route path="/cache" element={<Cache />} />
            <Route path="*" element={<Navigate to="/explorer" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Toast />
    </div>
  )
}