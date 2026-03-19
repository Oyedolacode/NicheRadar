/* ─────────────────────────────────────────
   NicheRadar v5 Utility Engine
   Restored from niche-radar (3).html
───────────────────────────────────────── */

export const YT_KEY = import.meta.env.VITE_YT_API_KEY;
export const BASE = 'https://www.googleapis.com/youtube/v3';
export const TTL = 86400000;

// ── Cache System ──
export const cSet = (k, v) => {
  try {
    localStorage.setItem('nr5_' + k, JSON.stringify({ v, t: Date.now() }));
  } catch (e) {
    console.error('Cache set error:', e);
  }
};

export const cGet = (k) => {
  try {
    const d = localStorage.getItem('nr5_' + k);
    if (!d) return null;
    const p = JSON.parse(d);
    if (Date.now() - p.t > TTL) {
      localStorage.removeItem('nr5_' + k);
      return null;
    }
    return p.v;
  } catch (e) {
    return null;
  }
};

export const cKeys = () => {
  try {
    return Object.keys(localStorage).filter(k => k.startsWith('nr5_'));
  } catch (e) {
    return [];
  }
};

// ── Math Logic ──
export const velocity = (v, pub) => v / Math.max(1, (Date.now() - new Date(pub)) / 36e5);
export const engRate = (l, c, v) => v > 0 ? ((+l || 0) + (+c || 0)) / v : 0;
export const creatorSuc = (views, subs) => views / Math.max(subs, 1);
export const chanPower = (subs, views) => subs / Math.max(views, 1);

export const trendScore = (rows) => {
  if (!rows.length) return 5;
  const avg = rows.reduce((a, b) => a + b.vel, 0) / rows.length;
  const rec = rows.filter(r => (Date.now() - new Date(r.pub)) < 7 * 864e5).length / rows.length;
  return Math.min(10, Math.log10(avg + 1) * 1.8 + rec * 3 + 1.2);
};

export const oppScore = (vel, eng, trend, sat) => {
  return Math.min(10, Math.log10((vel * (1 + eng * 10) * trend) / Math.max(sat, 1) + 1) * 2.85);
};

export const viralGap = (vel, trend, sat) => {
  return (vel * trend) / Math.max(sat, 1);
};

// ── Formatting ──
export const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(Math.round(n || 0));
export const fmtP = n => (n * 100).toFixed(2) + '%';
export const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── API Core ──
export async function ytGet(ep, params, ck) {
  if (ck) {
    const h = cGet(ck);
    if (h) return h;
  }
  const url = BASE + '/' + ep + '?' + new URLSearchParams({ ...params, key: YT_KEY });
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    if (ck) cSet(ck, d);
    return d;
  } catch (ex) {
    console.error('API Error:', ex);
    throw ex;
  }
}

// ── High Level Fetchers ──
export async function searchVids(q, n = 40) {
  const after = new Date(Date.now() - 30 * 864e5).toISOString();
  return ytGet('search', { part: 'snippet', q, type: 'video', order: 'relevance', publishedAfter: after, maxResults: n, regionCode: 'US' }, 's_' + q + '_' + n);
}

export async function vidStats(ids) {
  if (!ids.length) return { items: [] };
  return ytGet('videos', { part: 'statistics,snippet', id: ids.join(',') }, 'vs_' + ids.slice(0, 4).join('_'));
}

export async function chanStats(ids) {
  const u = [...new Set(ids)].slice(0, 50);
  if (!u.length) return { items: [] };
  return ytGet('channels', { part: 'statistics', id: u.join(',') }, 'cs_' + u.slice(0, 3).join('_'));
}

export async function fetchAndEnrich(kw) {
  const sD = await searchVids(kw, 40);
  const items = sD.items || [];
  if (!items.length) return { kw, enriched: [], sat: 0, trend: 0, avgVel: 0, avgEng: 0, avgCs: 0, opp: 0, vg: 0, vgRaw: 0 };
  
  const vids = items.map(i => i.id?.videoId).filter(Boolean);
  const chans = items.map(i => i.snippet?.channelId).filter(Boolean);
  
  const [vD, cD] = await Promise.all([vidStats(vids), chanStats(chans)]);
  const cMap = {};
  (cD.items || []).forEach(c => cMap[c.id] = +c.statistics?.subscriberCount || 0);
  
  const enriched = (vD.items || []).map(v => {
    const views = +v.statistics?.viewCount || 0, likes = +v.statistics?.likeCount || 0, cmts = +v.statistics?.commentCount || 0;
    const subs = cMap[v.snippet?.channelId] || 0, pub = v.snippet?.publishedAt;
    const vel = velocity(views, pub), eng = engRate(likes, cmts, views);
    return { id: v.id, title: v.snippet?.title, chan: v.snippet?.channelTitle, chanId: v.snippet?.channelId, thumb: v.snippet?.thumbnails?.medium?.url, views, likes, cmts, subs, pub, vel, eng, cs: creatorSuc(views, subs), cp: chanPower(subs, views), url: 'https://youtube.com/watch?v=' + v.id };
  }).filter(v => v.views > 0);
  
  const sat = enriched.length;
  const trend = trendScore(enriched.map(v => ({ vel: v.vel, pub: v.pub })));
  const avgVel = enriched.reduce((a, b) => a + b.vel, 0) / Math.max(enriched.length, 1);
  const avgEng = enriched.reduce((a, b) => a + b.eng, 0) / Math.max(enriched.length, 1);
  const avgCs = enriched.reduce((a, b) => a + b.cs, 0) / Math.max(enriched.length, 1);
  const opp = oppScore(avgVel, avgEng, trend, sat);
  const vgRaw = viralGap(avgVel, trend, sat);
  const vg = Math.min(10, Math.log10(vgRaw + 1) * 3);
  
  enriched.sort((a, b) => b.vel - a.vel);
  return { kw, enriched, sat, trend, avgVel, avgEng, avgCs, opp, vg, vgRaw };
}

// ── Prediction & Labels ──
export function scoreInfo(s) {
  if (s >= 8) return { cls: 'massive', label: 'MASSIVE', color: 'var(--accent)', desc: '🚀 Goldmine. High demand, low supply, small creators winning.' };
  if (s >= 6) return { cls: 'strong', label: 'STRONG', color: 'var(--green)', desc: '📈 Strong signal. Algorithm actively distributing in this niche.' };
  if (s >= 3) return { cls: 'moderate', label: 'MODERATE', color: 'var(--yellow)', desc: '⚖️ Moderate. Differentiated content can still break through.' };
  return { cls: 'saturated', label: 'SATURATED', color: 'var(--red)', desc: '🔴 Crowded. Find a unique sub-niche or different format.' };
}

export function compLevel(sat) {
  if (sat <= 8) return { label: 'LOW', cls: 'strong' };
  if (sat <= 20) return { label: 'MED', cls: 'moderate' };
  return { label: 'HIGH', cls: 'saturated' };
}

export function trendDir(trend) {
  if (trend >= 7) return { label: 'Rising', dir: 'up' };
  if (trend >= 4) return { label: 'Stable', dir: 'st' };
  return { label: 'Falling', dir: 'dn' };
}
