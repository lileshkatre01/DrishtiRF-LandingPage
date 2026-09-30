# DrishtiRF — Landing Page

> **SIGNAL·IQ** · Automated Off-Air RF Signal Intelligence & Parameter Extraction  
> SIH 2026 · Problem Statement PS #26147 · NTRO

---

## 🚀 Deploy to Vercel (3 Steps)

### Option A — GitHub + Vercel (Recommended)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: DrishtiRF landing page"
   git remote add origin https://github.com/YOUR_USERNAME/DrishtiRF-LandingPage.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo.

3. Vercel auto-detects Vite. Just click **Deploy**.
   - Your site will be live at: `https://drishtirf.vercel.app` *(after setting custom name in Vercel dashboard)*

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 🛠 Local Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → ./dist/
npm run preview   # Preview production build locally
```

---

## 📁 Project Structure

```
DrishtiRF-LandingPage/
├── public/
│   └── favicon.svg          # DrishtiRF crosshair icon
├── src/
│   ├── App.tsx              # Full landing page (all sections)
│   ├── App.css              # Dark SIGINT theme styles
│   ├── index.css            # Global CSS variables & reset
│   └── main.tsx             # React entry point
├── index.html               # HTML shell + meta tags + fonts
├── vercel.json              # Vercel SPA routing config
├── vite.config.ts           # Vite config
└── package.json
```

---

## 🔗 Live URL

**Target**: `https://drishtirf.vercel.app`

---

*Built for SIH 2026 PS #26147 (NTRO) — Government of India*
