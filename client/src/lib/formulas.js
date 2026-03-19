/**
 * lib/formulas.js
 * ─────────────────────────────────────────
 * All scoring formulas extracted from the
 * v5 monolith. Pure functions — no side
 * effects, no DOM, easy to unit test.
 */

// ── View Velocity ──────────────────────────
// views per hour since publish
export const velocity = (views, publishedAt) =>
  views / Math.max(1, (Date.now() - new Date(publishedAt)) / 3_600_000)

// ── Engagement Rate ────────────────────────
// (likes + comments) / views
export const engRate = (likes, comments, views) =>
  views > 0 ? ((+likes || 0) + (+comments || 0)) / views : 0

// ── Creator Success ────────────────────────
// avg views per subscriber — algorithm trust signal
export const creatorSuccess = (views, subs) =>
  views / Math.max(subs, 1)

// ── Channel Power ──────────────────────────
// subs / views — inverse of creator success
// low = small channel punching above weight
export const chanPower = (subs, views) =>
  subs / Math.max(views, 1)

// ── Trend Score ────────────────────────────
// 0–10 based on recency-weighted velocity
// rows = [{ vel, pub }]
export const trendScore = (rows) => {
  if (!rows.length) return 5
  const avg = rows.reduce((a, b) => a + b.vel, 0) / rows.length
  const recent = rows.filter(r =>
    Date.now() - new Date(r.pub) < 7 * 86_400_000
  ).length / rows.length
  return Math.min(10, Math.log10(avg + 1) * 1.8 + recent * 3 + 1.2)
}

// ── Opportunity Score ──────────────────────
// Core v2 formula: (vel × (1+eng×10) × trend) ÷ sat
export const oppScore = (vel, eng, trend, sat) =>
  Math.min(10,
    Math.log10((vel * (1 + eng * 10) * trend) / Math.max(sat, 1) + 1) * 2.85
  )

// ── Viral Gap Score ────────────────────────
// raw = (vel × trend) / sat — log-compressed to 0–10
export const viralGap = (vel, trend, sat) => {
  const raw = (vel * trend) / Math.max(sat, 1)
  return Math.min(10, Math.log10(raw + 1) * 3)
}

// ── Viral Probability ─────────────────────
// 6-feature weighted model (0–1)
export const viralProbability = ({ avgVel, avgEng, avgCs, trend, vg, sat }) => {
  const velScore = Math.min(1, Math.log10(avgVel + 1) / 3)
  const engScore = Math.min(1, avgEng * 40)
  const csScore  = Math.min(1, Math.log10((avgCs || 1) + 1) / 2)
  const tScore   = trend / 10
  const gScore   = vg / 10
  const satScore = Math.max(0, 1 - sat / 50)

  return Math.min(0.99, Math.max(0.01,
    velScore * 0.25 +
    engScore * 0.20 +
    csScore  * 0.20 +
    tScore   * 0.15 +
    gScore   * 0.15 +
    satScore * 0.05
  ))
}

// ── Channel Authority (Simulator) ─────────
export const channelAuthority = (subs, uploadFreq) =>
  Math.min(1, Math.log10(subs + 1) / 6) * 0.7 +
  Math.min(1, uploadFreq / 3) * 0.3

// ── Competition Factor (Simulator) ────────
export const compFactor = (sat) => {
  if (sat <= 5)  return { factor: 1.4, label: 'Very Low', cls: 'massive' }
  if (sat <= 12) return { factor: 1.1, label: 'Low',      cls: 'strong'  }
  if (sat <= 25) return { factor: 0.85,label: 'Medium',   cls: 'moderate'}
  return               { factor: 0.6, label: 'High',      cls: 'saturated'}
}

// ── Score Classification ───────────────────
export const scoreInfo = (score) => {
  if (score >= 8) return { cls: 'massive',   label: 'MASSIVE',   color: 'var(--accent)', desc: '🚀 Goldmine. High demand, low supply.' }
  if (score >= 6) return { cls: 'strong',    label: 'STRONG',    color: 'var(--green)',  desc: '📈 Strong signal. Algorithm is distributing.' }
  if (score >= 3) return { cls: 'moderate',  label: 'MODERATE',  color: 'var(--yellow)', desc: '⚖️ Moderate. Unique angle can break through.' }
  return               { cls: 'saturated', label: 'SATURATED', color: 'var(--red)',    desc: '🔴 Crowded. Find a sub-niche or different format.' }
}

// ── Formatters ─────────────────────────────
export const fmt  = (n) =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' :
  n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' :
  String(Math.round(n || 0))

export const fmtP = (n) => (n * 100).toFixed(2) + '%'

export const esc  = (s) =>
  (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;')

export const bdg  = (s) =>
  s >= 8 ? 's8' : s >= 6 ? 's6' : s >= 3 ? 's3' : 's0'

export const compLevel = (sat) =>
  sat <= 8  ? { label: 'LOW', cls: 'strong'   } :
  sat <= 20 ? { label: 'MED', cls: 'moderate' } :
              { label: 'HIGH', cls: 'saturated' }

export const trendDir = (trend) =>
  trend >= 7 ? { label: 'Rising',  dir: 'up' } :
  trend >= 4 ? { label: 'Stable',  dir: 'st' } :
               { label: 'Falling', dir: 'dn' }
