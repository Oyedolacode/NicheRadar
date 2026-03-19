# Deploying NicheRadar

Two services, two platforms, one command each.

---

## 1. Deploy the Server → Railway

### First time setup

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select your repo → choose the `/server` folder as root
3. Railway auto-detects Node.js via `package.json`

### Set environment variables in Railway dashboard

```
ANTHROPIC_API_KEY   = sk-ant-your-key-here
YT_API_KEY          = AIza-your-youtube-key-here
NODE_ENV            = production
ALLOWED_ORIGINS     = https://niche-radar.vercel.app
PORT                = 3001   (Railway sets this automatically)
```

### After deploy

Railway gives you a URL like:
`https://niche-radar-server.up.railway.app`

Test it:
```bash
curl https://niche-radar-server.up.railway.app/health
# → {"status":"ok","env":"production","anthropic":true,"youtube":true}
```

---

## 2. Deploy the Client → Vercel

### First time setup

1. Go to https://vercel.com → New Project → Import from GitHub
2. Select your repo → set **Root Directory** to `client`
3. Framework preset: **Vite** (auto-detected)

### Set environment variables in Vercel dashboard

```
VITE_API_BASE = https://niche-radar-server.up.railway.app
```

⚠️ Must start with `VITE_` — Vercel only exposes these to the browser.

### After deploy

Vercel gives you a URL like:
`https://niche-radar.vercel.app`

---

## 3. Connect them (CORS)

Go back to Railway → update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS = https://niche-radar.vercel.app
```

If you add a custom domain later, append it:
```
ALLOWED_ORIGINS = https://niche-radar.vercel.app,https://www.yourdomain.com
```

Railway auto-restarts on env var changes — no redeploy needed.

---

## Auto-deploy on push

Both Railway and Vercel watch your GitHub repo.
Push to `main` → both redeploy automatically.

```
git push origin main
# → Vercel rebuilds client in ~30s
# → Railway restarts server in ~20s
```

---

## Cost

| Service | Free tier | Paid |
|---------|-----------|------|
| Vercel  | Unlimited hobby projects | $20/mo Pro |
| Railway | $5 credit/month (enough for low traffic) | $5/mo Hobby |

**Total at launch: $0–$5/month**

---

## Troubleshooting

**CORS error in production?**
→ Check `ALLOWED_ORIGINS` in Railway matches your exact Vercel URL (no trailing slash)

**AI calls failing?**
→ Check `/health` endpoint — `"anthropic": true` means key is set correctly

**YouTube quota exceeded?**
→ The server-side cache reduces repeat calls. Get a second API key from a new Google Cloud project.

**Railway sleeping (cold starts)?**
→ Upgrade to $5/month Hobby plan for always-on
