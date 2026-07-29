import { useEffect, useRef, useState } from 'react'
import { demos, links, results, type Demo } from './data/project'

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 13 13 3M5 3h8v8" />
  </svg>
)

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 7 8 5-8 5V7Z" />
  </svg>
)

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function DemoTile({
  demo,
  onOpen,
  reducedMotion,
}: {
  demo: Demo
  onOpen: (demo: Demo) => void
  reducedMotion: boolean
}) {
  const containerRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '180px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      className="demo-tile"
      ref={containerRef}
      onClick={() => onOpen(demo)}
      aria-label={`Play demo ${demo.id}: ${demo.title}`}
    >
      <video
        src={active ? demo.video : undefined}
        poster={demo.poster}
        muted
        loop
        playsInline
        autoPlay={active && !reducedMotion}
        preload="none"
      />
      <span className="demo-number">{String(demo.id).padStart(2, '0')}</span>
      <span className="demo-play"><Play /></span>
    </button>
  )
}

function DemoModal({ demo, onClose }: { demo: Demo; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && contentRef.current) {
        const focusable = [...contentRef.current.querySelectorAll<HTMLElement>('button, video')]
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Demo ${demo.id}`}>
      <button className="modal-backdrop" onClick={onClose} aria-label="Close video" />
      <div className="modal-content" ref={contentRef}>
        <button className="modal-close" ref={closeRef} onClick={onClose} aria-label="Close video">×</button>
        <video src={demo.videoHd} poster={demo.poster} controls autoPlay playsInline />
        <div className="modal-caption">
          <span>Demo {String(demo.id).padStart(2, '0')}</span>
          <p>{demo.title} <i>·</i> {demo.detail}</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const closeModal = () => setSelectedDemo(null)

  return (
    <>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="FDDC home">FDDC<span>·</span></a>
        <nav aria-label="Primary navigation">
          <a href="#method">Method</a>
          <a href="#results">Results</a>
          <a href="#demos">Demos</a>
        </nav>
        <a href="#resources" className="header-cta">Resources <Arrow /></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-video-wrap">
            <video
              className="hero-video"
              src="./media/fddc-film.mp4"
              poster="./media/fddc-poster.webp"
              muted
              loop
              autoPlay={!reducedMotion}
              playsInline
              preload="metadata"
            />
            <div className="hero-shade" />
          </div>
          <div className="hero-content">
            <p className="eyebrow">Humanoid balance, solved at the root</p>
            <h1 id="hero-title">Dynamic balance.<br /><em>Directly deployable.</em></h1>
            <p className="hero-copy">
              The first support-relative dynamic-CoM policy for clean humanoid
              single-leg balance—running onboard Unitree G1 without distillation.
            </p>
            <div className="hero-actions">
              <a href="#demos" className="button button-primary"><Play /> Watch real-robot demos</a>
              <a href="#method" className="button button-ghost">Explore the method <Arrow /></a>
            </div>
          </div>
          <div className="hero-meta">
            <span>Unitree G1</span><span>29 DoF</span><span>50 Hz</span><span>No distillation</span>
          </div>
          <a href="#problem" className="scroll-cue" aria-label="Scroll to overview"><span /> Scroll to explore</a>
        </section>

        <section className="section problem" id="problem">
          <div className="section-kicker"><span>01</span> The problem</div>
          <div className="problem-grid">
            <h2>Generalist policies can move.<br />They still cannot <em>stand.</em></h2>
            <div className="problem-copy">
              <p>
                Eight state-of-the-art humanoid generalists achieved zero clean
                single-leg holds on a unified 90-motion benchmark.
              </p>
              <p>
                Most recover by stepping, hopping, or touching down. FDDC changes
                the objective from repairing imbalance to preventing it.
              </p>
            </div>
          </div>
          <div className="comparison">
            <article>
              <span className="comparison-label">Generalist policies</span>
              <strong>Repair</strong>
              <p>React after balance is lost</p>
              <div className="signal signal-bad"><i /><i /><i /><i /><i /></div>
            </article>
            <div className="comparison-divider">vs</div>
            <article className="comparison-highlight">
              <span className="comparison-label">FDDC</span>
              <strong>Prevent</strong>
              <p>Keep the capture point inside the foot</p>
              <div className="signal signal-good"><i /><i /><i /><i /><i /></div>
            </article>
          </div>
        </section>

        <section className="section insight" id="method">
          <div className="section-kicker light"><span>02</span> Core insight</div>
          <div className="insight-heading">
            <h2>Make the essential signal<br /><em>observable.</em></h2>
            <p>
              Capture point is the field&apos;s core dynamic-balance signal—but it
              normally depends on unmeasurable base velocity. Expressing CoM
              relative to the support foot makes that dependency cancel.
            </p>
          </div>
          <section className="deployability-module" aria-labelledby="deployability-title">
            <header className="deployability-header">
              <span className="board-label">From privileged to proprioceptive</span>
              <h3 id="deployability-title">A three-step path to onboard reconstruction</h3>
              <p>The key is support-relative—not a new sensor or a distilled estimator.</p>
            </header>

            <div className="derivation-flow">
              <article className="derivation-step">
                <span className="step-index">01 · Define</span>
                <h4>Capture point</h4>
                <p>Position alone misses momentum. The dynamic signal adds CoM velocity.</p>
                <div className="math-primary">
                  ξ = c + <span className="math-fraction"><i>ċ</i><i>ω₀</i></span>
                </div>
                <small>ω₀ = √(g / h)</small>
              </article>

              <article className="derivation-step cancellation-step">
                <span className="step-index">02 · Cancel</span>
                <h4>Support-relative velocity</h4>
                <p>In the world frame, base velocity enters both terms identically.</p>
                <div className="math-stack">
                  <span>ċ<sub>W</sub> = <del>v<sub>b</sub></del> + κ<sub>c</sub></span>
                  <span>ṡ<sub>W</sub> = <del>v<sub>b</sub></del> + κ<sub>s</sub></span>
                  <strong>ṙ<sub>W</sub> = ċ<sub>W</sub> − ṡ<sub>W</sub> = κ<sub>c</sub> − κ<sub>s</sub></strong>
                </div>
                <small>The shared v<sub>b</sub> term cancels in the difference.</small>
              </article>

              <article className="derivation-step onboard-step">
                <span className="step-index">03 · Reconstruct</span>
                <h4>Base-frame observation</h4>
                <p>Rotate to the torso frame and compute the same state from proprioception.</p>
                <div className="math-compact">
                  <span>r<sub>B</sub> = d<sub>c</sub> − d<sub>s</sub></span>
                  <span>ṙ<sub>B</sub> = ω<sub>B</sub> × (d<sub>c</sub> − d<sub>s</sub>)</span>
                  <span>+ (J<sub>c</sub> − J<sub>s</sub>)q̇</span>
                </div>
                <div className="sensor-list">
                  <span>Encoders</span><span>Gyro</span><span>Gravity</span><span>Model</span>
                </div>
              </article>
            </div>

            <div className="derivation-summary">
              <span>Support-relative capture-point state</span>
              <strong>ξ − s ≈ r + ṙ / ω₀</strong>
              <p>No absolute base position or linear velocity enters the deployed actor.</p>
            </div>
          </section>

          <div className="insight-principles">
            <article>
              <span>01</span>
              <h3>Cancel the hidden state</h3>
              <p>No absolute base position or linear velocity is required onboard.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Observe, don&apos;t only reward</h3>
              <p>Removing dynamic-CoM from the actor costs 40 points of clean success.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Prevent, don&apos;t repair</h3>
              <p>Keep the capture point inside the support polygon before recovery is needed.</p>
            </article>
          </div>

          <div className="observation-strip">
            <span>Deployable actor observation</span>
            <strong>o<sub>bal</sub> = (r<sub>B</sub>, ṙ<sub>B</sub>) ∈ ℝ⁴</strong>
            <p>Joint encoders + torso IMU + robot model</p>
          </div>

          <div className="pipeline">
            {[
              ['01', 'Observe', 'Support-relative dynamic-CoM reconstructed onboard'],
              ['02', 'Train', 'Asymmetric FastSAC with human-science rewards'],
              ['03', 'Select', 'Method-agnostic sim2sim benchmark'],
              ['04', 'Deploy', 'ONNX policy at 50 Hz, without distillation'],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <figure className="method-figure">
            <img src="./media/method-overview.svg" alt="FDDC unified single-leg balance pipeline" loading="lazy" />
            <figcaption>
              <span>Unified pipeline</span>
              From stratified motions to benchmark-selected real-robot deployment.
            </figcaption>
          </figure>
        </section>

        <section className="section results" id="results">
          <div className="section-kicker"><span>03</span> Results</div>
          <div className="results-heading">
            <h2>One signal.<br /><em>A decisive difference.</em></h2>
            <p>Evaluated in a common MuJoCo G1 environment with identical motions, control rate, and scoring.</p>
          </div>
          <div className="result-grid">
            {results.map((result, index) => (
              <article key={result.value} className={index === 0 ? 'primary-result' : ''}>
                <strong>{result.value}</strong>
                <h3>{result.label}</h3>
                <p>{result.note}</p>
              </article>
            ))}
          </div>
          <div className="ablation">
            <div>
              <span className="micro-label">Root-cause evidence</span>
              <h3>Rewarding balance is not enough.<br />The actor must <em>observe</em> it.</h3>
            </div>
            <div className="bars" aria-label="Clean perfect score comparison">
              <div><span>Full FDDC</span><i><b style={{ width: '95.6%' }} /></i><strong>95.6%</strong></div>
              <div><span>Static CoM</span><i><b style={{ width: '64.4%' }} /></i><strong>64.4%</strong></div>
              <div><span>Without CoM</span><i><b style={{ width: '55.6%' }} /></i><strong>55.6%</strong></div>
            </div>
          </div>
        </section>

        <section className="demos-section" id="demos">
          <div className="demos-intro">
            <div>
              <div className="section-kicker light"><span>04</span> Real robot</div>
              <h2>25 poses.<br /><em>One unified policy.</em></h2>
            </div>
            <p>
              Diverse single-leg balance motions executed on Unitree G1.
              Every clip is real hardware. Select any tile to inspect it.
            </p>
          </div>
          <div className="demo-wall">
            {demos.map((demo) => (
              <DemoTile key={demo.id} demo={demo} onOpen={setSelectedDemo} reducedMotion={reducedMotion} />
            ))}
          </div>
          <div className="demo-footnote">
            <span><i /> Real-robot footage</span>
            <span>Unitree G1 · onboard inference · 50 Hz</span>
          </div>
        </section>

        <section className="section benchmark">
          <div className="section-kicker"><span>05</span> Benchmark</div>
          <div className="benchmark-grid">
            <div>
              <h2>A common ground<br />for <em>balance.</em></h2>
              <p>
                A method-agnostic sim2sim benchmark separates the policy from the
                testbed, making checkpoint selection and cross-method comparison reproducible.
              </p>
            </div>
            <div className="benchmark-points">
              <article><span>01</span><div><h3>Same robot</h3><p>Unified MuJoCo G1 dynamics and PD control.</p></div></article>
              <article><span>02</span><div><h3>Same motions</h3><p>90 held-out tests across a stratified 3×3 pose grid.</p></div></article>
              <article><span>03</span><div><h3>Same score</h3><p>Perfect, Marginal, and Failure—mutually exclusive.</p></div></article>
            </div>
          </div>
          <div className="dataset-strip">
            <div><strong>900</strong><span>balance motions</span></div>
            <div><strong>9</strong><span>pose categories</span></div>
            <div><strong>720 / 90 / 90</strong><span>train / val / test</span></div>
            <div><strong>4.98 s</strong><span>per motion</span></div>
          </div>
        </section>

        <section className="resources" id="resources">
          <p className="eyebrow">Root-cause balance</p>
          <h2>Turn balance from a per-task trick<br />into a capability we can <em>measure.</em></h2>
          <div className="resource-links">
            {links.map((link) => (
              <div key={link.label}><span>{link.label}</span><small>{link.status}</small></div>
            ))}
          </div>
          <p className="anonymous-note">Public project information and author details will be added after de-anonymization.</p>
        </section>
      </main>

      <footer>
        <a href="#top" className="wordmark">FDDC<span>·</span></a>
        <p>First Deployable Dynamic-CoM for Humanoid Single-Leg Balance</p>
        <a href="#top">Back to top ↑</a>
      </footer>

      {selectedDemo && <DemoModal demo={selectedDemo} onClose={closeModal} />}
    </>
  )
}

export default App
