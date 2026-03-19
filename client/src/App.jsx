import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Toast from './components/Toast'

// ── 5 Core Sections ──
const Dashboard = lazy(() => import('./pages/dashboard'))
const Opportunities = lazy(() => import('./pages/opportunities'))
const Ideas = lazy(() => import('./pages/ideas'))
const Production = lazy(() => import('./pages/production'))
const Analytics = lazy(() => import('./pages/analytics'))
const Competitors = lazy(() => import('./pages/competitors'))

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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/production" element={<Production />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/competitors" element={<Competitors />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Toast />
    </div>
  )
}