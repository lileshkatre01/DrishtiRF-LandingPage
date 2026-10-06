import { useEffect, useRef, useState } from 'react'
import './App.css'
import logoPng from './assets/logo.png'

/* ─── Animated Spectrum Canvas ─── */
function SpectrumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const draw = () => {
      ctx.clearRect(0, 0, W(), H())

      // Grid lines
      ctx.strokeStyle = 'rgba(0,212,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < W(); x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H()); ctx.stroke()
      }
      for (let y = 0; y < H(); y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W(), y); ctx.stroke()
      }

      // PSD curve
      const grad = ctx.createLinearGradient(0, 0, 0, H())
      grad.addColorStop(0, 'rgba(0,212,255,0.9)')
      grad.addColorStop(0.5, 'rgba(0,102,255,0.5)')
      grad.addColorStop(1, 'rgba(0,212,255,0.0)')

      ctx.beginPath()
      ctx.moveTo(0, H())
      const pts = 300
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * W()
        const freq = (i / pts) * Math.PI * 6
        let y = H() * 0.82
          - Math.sin(freq + t * 0.6) * H() * 0.08
          - Math.abs(Math.sin(freq * 0.5 + t * 0.3)) * H() * 0.06
          - (i > 110 && i < 160 ? Math.exp(-Math.pow((i - 135) / 18, 2)) * H() * 0.45 : 0)
          - (i > 195 && i < 230 ? Math.exp(-Math.pow((i - 212) / 10, 2)) * H() * 0.28 : 0)
          - (i > 60 && i < 85 ? Math.exp(-Math.pow((i - 72) / 8, 2)) * H() * 0.18 : 0)
          - Math.sin(t * 0.4 + i * 0.08) * 3
        ctx.lineTo(x, y)
      }
      ctx.lineTo(W(), H())
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Top line glow
      ctx.beginPath()
      ctx.moveTo(0, H())
      for (let i = 0; i <= pts; i++) {
        const x = (i / pts) * W()
        const freq = (i / pts) * Math.PI * 6
        let y = H() * 0.82
          - Math.sin(freq + t * 0.6) * H() * 0.08
          - Math.abs(Math.sin(freq * 0.5 + t * 0.3)) * H() * 0.06
          - (i > 110 && i < 160 ? Math.exp(-Math.pow((i - 135) / 18, 2)) * H() * 0.45 : 0)
          - (i > 195 && i < 230 ? Math.exp(-Math.pow((i - 212) / 10, 2)) * H() * 0.28 : 0)
          - (i > 60 && i < 85 ? Math.exp(-Math.pow((i - 72) / 8, 2)) * H() * 0.18 : 0)
          - Math.sin(t * 0.4 + i * 0.08) * 3
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(0,212,255,0.7)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      t += 0.012
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="spectrum-canvas" />
}

/* ─── Animated Constellation Canvas ─── */
function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animId: number
    let t = 0

    canvas.width = 200; canvas.height = 200

    const points16qam = [
      [-3,-3],[-1,-3],[1,-3],[3,-3],
      [-3,-1],[-1,-1],[1,-1],[3,-1],
      [-3, 1],[-1, 1],[1, 1],[3, 1],
      [-3, 3],[-1, 3],[1, 3],[3, 3],
    ]

    const draw = () => {
      ctx.clearRect(0, 0, 200, 200)
      const cx = 100, cy = 100, scale = 22

      // Axes
      ctx.strokeStyle = 'rgba(0,212,255,0.15)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, 190); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(190, cy); ctx.stroke()

      // Points with noise
      points16qam.forEach(([px, py]) => {
        const nx = cx + px * scale + (Math.random() - 0.5) * 6
        const ny = cy + py * scale + (Math.random() - 0.5) * 6
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 5)
        grd.addColorStop(0, 'rgba(0,212,255,0.9)')
        grd.addColorStop(1, 'rgba(0,212,255,0)')
        ctx.beginPath()
        ctx.arc(nx, ny, 4, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Center dot
        ctx.beginPath()
        ctx.arc(cx + px * scale, cy + py * scale, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.3)'
        ctx.fill()
      })

      t += 0.03
      animId = setTimeout(() => requestAnimationFrame(draw), 80)
    }

    draw()
    return () => {
      clearTimeout(animId)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="constellation-wrapper">
      <canvas ref={canvasRef} className="constellation-canvas" />
      <span className="constellation-label">16-QAM</span>
    </div>
  )
}

/* ─── Scanning line component ─── */
function ScanLine() {
  return <div className="scan-line" />
}

/* ─── Stat Counter ─── */
function StatCounter({ value, label, unit = '' }: { value: string; label: string; unit?: string }) {
  return (
    <div className="stat-item">
      <div className="stat-value">
        {value}<span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon, title, description, tag
}: { icon: string; title: string; description: string; tag?: string }) {
  return (
    <div className="feature-card">
      {tag && <span className="feature-tag">{tag}</span>}
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  )
}

/* ─── Tier Badge ─── */
function TierBadge({ tier, label, desc, color }: { tier: string; label: string; desc: string; color: string }) {
  return (
    <div className={`tier-badge tier-${color}`}>
      <div className="tier-letter">{tier}</div>
      <div className="tier-info">
        <div className="tier-label">{label}</div>
        <div className="tier-desc">{desc}</div>
      </div>
    </div>
  )
}

/* ─── Main App ─── */
export default function App() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('drishtirf.vercel.app').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <div className="logo-icon" style={{ overflow: 'hidden', padding: 0 }}>
              <img src={logoPng} alt="DrishtiRF Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="logo-text">
              <span className="logo-name">DrishtiRF</span>
              <span className="logo-tag">SIGNAL·IQ</span>
            </div>
          </div>

          <div className="navbar-badges">
            <a href="#download" className="nav-download-btn">
              <span>↓</span> Download v1.2.0
            </a>
          </div>
        </div>
      </nav>

      {/* ── DEPARTMENT BANNER ── */}
      <div className="dept-banner">
        <div className="dept-banner-inner">
          <div className="dept-item">
            <div className="dept-logo ntro-logo">
              <span className="dept-logo-text">NTRO</span>
            </div>
            <div className="dept-info">
              <div className="dept-name">National Technical Research Organisation</div>
              <div className="dept-sub">Government of India · PMO</div>
            </div>
          </div>
          <div className="dept-divider" />
          <div className="dept-item">
            <div className="dept-logo sih-logo">
              <span className="dept-logo-text">SIH</span>
            </div>
            <div className="dept-info">
              <div className="dept-name">Smart India Hackathon 2026</div>
              <div className="dept-sub">Problem Statement PS #26147</div>
            </div>
          </div>
          <div className="dept-divider" />
          <div className="dept-item">
            <div className="dept-logo mic-logo">
              <span className="dept-logo-text">MIC</span>
            </div>
            <div className="dept-info">
              <div className="dept-name">Ministry of Education</div>
              <div className="dept-sub">Innovation Cell · AICTE</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <ScanLine />
        <div className="hero-bg-grid" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            SIH 2026 · PS #26147 · NTRO · Classified SIGINT Toolchain
          </div>

          <h1 className="hero-title">
            <span className="hero-title-pre">Automated Off-Air</span>
            <span className="hero-title-main">RF Signal Intelligence</span>
            <span className="hero-title-accent">&amp; Parameter Extraction</span>
          </h1>

          <p className="hero-subtitle">
            DrishtiRF automatically estimates spectrum parameters, classifies modulation types,
            performs joint FEC decoding, and delivers explainable 3-tier confidence scoring —
            with <strong>zero prior metadata</strong> and <strong>live 60 FPS signal replay</strong>.
          </p>

          <div className="hero-cta-group">
            <a href="#download" className="cta-primary">
              <span className="cta-icon">⬇</span>
              Download Desktop Software
              <span className="cta-version">v1.2.0 · Windows / Linux</span>
            </a>
            <a href="#features" className="cta-secondary">
              Explore Features →
            </a>
          </div>

          <div className="hero-formats">
            <span className="format-label">Supported Formats:</span>
            <code>.IQ</code>
            <code>.WAV</code>
            <code>.SigMF</code>
            <code>float32</code>
            <code>int16</code>
            <code>complex64</code>
          </div>
        </div>

        {/* Spectrum Visualization */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-header">
              <div className="visual-dots">
                <span style={{background:'#ff5f57'}} />
                <span style={{background:'#febc2e'}} />
                <span style={{background:'#28c840'}} />
              </div>
              <div className="visual-title">
                <span className="v-mono">drishtiRF</span>
                <span className="v-mono v-dim"> — spectrum_analyzer.py</span>
              </div>
              <div className="visual-status">
                <span className="pulse-dot" />
                <span>LIVE</span>
              </div>
            </div>

            <div className="spectrum-container">
              <div className="spectrum-labels">
                <span>0 dBm</span>
                <span>−20</span>
                <span>−40</span>
                <span>−60</span>
                <span>−80</span>
              </div>
              <SpectrumCanvas />
              <div className="spectrum-freq-labels">
                <span>−Fs/2</span>
                <span>0 Hz</span>
                <span>+Fs/2</span>
              </div>
            </div>

            <div className="visual-stats-row">
              <div className="v-stat"><span className="v-stat-val cyan">2.4 MHz</span><span className="v-stat-lbl">Sample Rate</span></div>
              <div className="v-stat"><span className="v-stat-val green">+18.3 dB</span><span className="v-stat-lbl">SNR</span></div>
              <div className="v-stat"><span className="v-stat-val amber">16-QAM</span><span className="v-stat-lbl">Modulation</span></div>
              <div className="v-stat"><span className="v-stat-val cyan">±1.2 kHz</span><span className="v-stat-lbl">CFO</span></div>
            </div>
          </div>

          <ConstellationCanvas />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        <div className="stats-inner">
          <StatCounter value="6" label="Processing Stages" />
          <div className="stat-div" />
          <StatCounter value="6" label="Modulation Types" />
          <div className="stat-div" />
          <StatCounter value="3" label="FEC Decoders" />
          <div className="stat-div" />
          <StatCounter value="3" label="Confidence Tiers" />
          <div className="stat-div" />
          <StatCounter value="100" label="Air-Gap Capable" unit="%" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Core Capabilities</div>
            <h2 className="section-title">Everything a SIGINT Analyst Needs</h2>
            <p className="section-sub">
              A complete automated signal processing pipeline —
              from raw RF bytes to explainable decoded payloads.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon="◈"
              title="Automated Parameter Extraction"
              description="Instant blind estimation of sample rate, bandwidth (−3 dB, −10 dB, 99% power), SNR, and carrier frequency offset — with zero prior metadata required."
              tag="Core"
            />
            <FeatureCard
              icon="⬡"
              title="Automatic Modulation Classification"
              description="Hybrid decision-tree + ML feature classifier covering BPSK, QPSK, 8PSK, 16-QAM, 2FSK, and 4FSK with per-class confidence breakdown."
              tag="AMC"
            />
            <FeatureCard
              icon="⊞"
              title="Joint De-Interleaving & FEC"
              description="Novel algebraic search engine simultaneously scans matrix de-interleaving depth/span and FEC parameters using zero-syndrome checks — no brute-force."
              tag="Novel"
            />
            <FeatureCard
              icon="◎"
              title="3-Tier Explainable AI"
              description="Tier A: Verified FEC + preamble sync. Tier B: Recovered modulation & symbol rate. Tier C: Spectral fallback. Natural language justification for every decision."
              tag="XAI"
            />
            <FeatureCard
              icon="⬚"
              title="Full Demodulation Pipeline"
              description="Carrier recovery, Gardner/Mueller-Müller symbol timing synchronization, IQ constellation generation, eye diagram synthesis, and soft/hard bit decisions."
            />
            <FeatureCard
              icon="▣"
              title="Frame & Payload Recovery"
              description="Sliding-window preamble matching (0x1ACFFC1D, 0xEB90), bitstream alignment, packet framing, header extraction, and hex payload dump."
            />
          </div>
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section className="pipeline" id="pipeline">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Processing Pipeline</div>
            <h2 className="section-title">6-Stage Automated Analysis</h2>
          </div>

          <div className="pipeline-flow">
            {[
              { n: '01', title: 'Ingestion', desc: '.IQ / .WAV / .SigMF parsing, power normalisation, DC offset removal' },
              { n: '02', title: 'Spectral Analysis', desc: 'Welch PSD, waterfall, bandwidth estimation, SNR & carrier offset' },
              { n: '03', title: 'Mod. Classification', desc: 'Hybrid AMC — BPSK, QPSK, 8PSK, 16QAM, 2FSK, 4FSK' },
              { n: '04', title: 'Demodulation', desc: 'Carrier recovery, timing sync, constellation & eye diagram' },
              { n: '05', title: 'Joint FEC Search', desc: 'Algebraic de-interleaving + Viterbi / Hamming / Reed-Solomon' },
              { n: '06', title: 'Confidence & XAI', desc: 'Tier A/B/C scoring with NL explainability & payload export' },
            ].map((s, i) => (
              <div className="pipeline-step" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-body">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
                {i < 5 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONFIDENCE TIERS ── */}
      <section className="tiers-section">
        <div className="section-inner tiers-inner">
          <div className="tiers-left">
            <div className="section-tag">Explainable AI</div>
            <h2 className="section-title">3-Tier Confidence System</h2>
            <p className="section-sub">
              Every analysis produces a confidence tier with automatic
              natural-language justification so analysts always understand
              the reasoning behind each conclusion.
            </p>

            <div className="tiers-list">
              <TierBadge
                tier="A"
                label="High Confidence · Payload Recovered"
                desc="Zero-syndrome FEC decoding confirmed + preamble synchronization verified"
                color="green"
              />
              <TierBadge
                tier="B"
                label="Medium Confidence · Bitstream Recovered"
                desc="Modulation, symbol rate & demodulated bits recovered — no FEC confirmation"
                color="amber"
              />
              <TierBadge
                tier="C"
                label="Low Confidence · Spectral Only"
                desc="Spectral parameters estimated under low SNR — demodulation not possible"
                color="red"
              />
            </div>
          </div>

          <div className="tiers-right">
            <div className="explain-card">
              <div className="explain-header">
                <span className="e-mono">explain.py</span>
                <span className="tier-pill green">TIER A</span>
              </div>
              <div className="explain-body">
                <div className="explain-line">
                  <span className="e-key">modulation</span>
                  <span className="e-eq">=</span>
                  <span className="e-val cyan">"16-QAM"</span>
                </div>
                <div className="explain-line">
                  <span className="e-key">symbol_rate</span>
                  <span className="e-eq">=</span>
                  <span className="e-val cyan">125000</span>
                  <span className="e-unit">sps</span>
                </div>
                <div className="explain-line">
                  <span className="e-key">fec_type</span>
                  <span className="e-eq">=</span>
                  <span className="e-val green">"Reed-Solomon(255,223)"</span>
                </div>
                <div className="explain-line">
                  <span className="e-key">syndrome</span>
                  <span className="e-eq">=</span>
                  <span className="e-val green">0x000000</span>
                </div>
                <div className="explain-line">
                  <span className="e-key">preamble</span>
                  <span className="e-eq">=</span>
                  <span className="e-val cyan">"0x1ACFFC1D"</span>
                </div>
                <div className="explain-line">
                  <span className="e-key">confidence</span>
                  <span className="e-eq">=</span>
                  <span className="e-val green">0.97</span>
                </div>
                <div className="explain-divider" />
                <div className="explain-nl">
                  <span className="e-hash">#</span>
                  Signal classified as 16-QAM with 97% confidence.
                  RS(255,223) decoder reports zero syndrome — payload
                  integrity verified. Preamble 0x1ACFFC1D matched at
                  offset 0 with SNR +18.3 dB.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH SPECS ── */}
      <section className="specs-section" id="specs">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Technical Specifications</div>
            <h2 className="section-title">Under the Hood</h2>
          </div>

          <div className="specs-grid">
            <div className="spec-group">
              <div className="spec-group-title">Signal Formats</div>
              {['.IQ (raw binary float32)', '.WAV (16-bit PCM)', '.SigMF (metadata-annotated)', 'complex64, int16, float32'].map(s => (
                <div className="spec-row" key={s}><span className="spec-check">✓</span><span>{s}</span></div>
              ))}
            </div>
            <div className="spec-group">
              <div className="spec-group-title">Modulation Types</div>
              {['BPSK · QPSK · 8-PSK', '16-QAM', '2-FSK · 4-FSK', 'IQ Constellation & Eye Diagram'].map(s => (
                <div className="spec-row" key={s}><span className="spec-check">✓</span><span>{s}</span></div>
              ))}
            </div>
            <div className="spec-group">
              <div className="spec-group-title">FEC Decoders</div>
              {['Convolutional (Viterbi)', 'Hamming Codes', 'Reed-Solomon (255,223)', 'Zero-syndrome algebraic check'].map(s => (
                <div className="spec-row" key={s}><span className="spec-check">✓</span><span>{s}</span></div>
              ))}
            </div>
            <div className="spec-group">
              <div className="spec-group-title">System Requirements</div>
              {['Windows 10/11 · Linux (Debian/Ubuntu)', 'Python 3.10+ (bundled)', '4 GB RAM minimum', '100% Air-gap / Offline capable'].map(s => (
                <div className="spec-row" key={s}><span className="spec-check">✓</span><span>{s}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
      <section className="download-section" id="download">
        <div className="download-inner">
          <div className="download-glow" />
          <div className="section-tag" style={{marginBottom:'1.5rem'}}>Standalone Desktop Software</div>
          <h2 className="download-title">Deploy DrishtiRF Today</h2>
          <p className="download-sub">
            Single-click installer. No internet required. Runs fully offline and air-gapped.
            Bundles the complete DSP engine, SQLite database, and SIGINT dashboard.
          </p>

          <div className="download-cards">
            <div className="dl-card featured">
              <div className="dl-os">
                <span className="dl-os-icon">⊞</span>
                <span>Windows</span>
              </div>
              <div className="dl-filename">DrishtiRF-Setup.exe</div>
              <div className="dl-size">74 MB · Windows 10/11 x64 · v1.2.0</div>
              <a
                className="dl-btn primary"
                href="https://github.com/lileshkatre01/DrishtiRF/releases/download/v1.2.0/DrishtiRF-Setup.exe"
                download
              >
                ⬇ &nbsp;Download .exe (v1.2.0)
              </a>
            </div>

            <div className="dl-card">
              <div className="dl-os">
                <span className="dl-os-icon">🐧</span>
                <span>Linux</span>
              </div>
              <div className="dl-filename">DrishtiRF-v1.2-linux.zip</div>
              <div className="dl-size">Coming soon · Ubuntu 20.04+ / Debian</div>
              <a
                className="dl-btn secondary"
                href="https://github.com/lileshkatre01/DrishtiRF/releases/tag/v1.2.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⬇ &nbsp;View Release (v1.2.0)
              </a>
            </div>

            <div className="dl-card">
              <div className="dl-os">
                <span className="dl-os-icon">⌥</span>
                <span>Source</span>
              </div>
              <div className="dl-filename">DrishtiRF-v1.0-src</div>
              <div className="dl-size">Python 3.10+ · React 19 · FastAPI</div>
              <a
                className="dl-btn secondary"
                href="https://github.com/lileshkatre01/DrishtiRF"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⬇ &nbsp;View on GitHub
              </a>
            </div>
          </div>

          <div className="install-note">
            <code>
              <span className="i-comment"># Quick start after extraction</span><br />
              <span className="i-cmd">./DrishtiRF.exe</span>
              <span className="i-dim"> &nbsp;# Launches local server + SIGINT dashboard automatically</span>
            </code>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo-row">
            <div className="footer-brand">
              <img src={logoPng} alt="DrishtiRF Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '10px' }} />
              <div>
                <div className="footer-name">DrishtiRF</div>
                <div className="footer-tagline">SIGNAL·IQ · Automated RF Intelligence</div>
              </div>
            </div>

            <div className="footer-dept-logos">
              <div className="footer-dept-badge ntro">NTRO</div>
              <div className="footer-dept-badge sih">SIH 2026</div>
              <div className="footer-dept-badge mic">MoE · AICTE</div>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-bottom">
            <div className="footer-links">
              <span className="footer-link" onClick={handleCopy} style={{cursor:'pointer'}}>
                {copied ? '✓ Copied!' : '⎘ drishtirf.vercel.app'}
              </span>
            </div>
            <div className="footer-meta">
              SIH 2026 · PS #26147 · NTRO · Government of India ·&nbsp;
              Built with FastAPI + React 19 + Tailwind
            </div>
            <div className="footer-copy">
              © 2026 DrishtiRF Team · All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
