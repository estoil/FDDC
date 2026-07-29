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
          <section className="insight-derivation" aria-labelledby="derivation-title">
            <header className="derivation-header">
              <span className="board-label">From balance theory to onboard state</span>
              <h3 id="derivation-title">One signal, expressed in a deployable frame.</h3>
              <p>
                The construction preserves the dynamic balance state while removing
                the absolute base linear velocity unavailable on hardware.
              </p>
            </header>

            <article className="derivation-chapter signal-chapter">
              <div className="chapter-intro">
                <span className="step-index">01 · Define the state</span>
                <h4>Capture point adds momentum to CoM position.</h4>
                <p>
                  Under the linear inverted-pendulum approximation, balance depends
                  on where the CoM is and where its velocity is carrying it.
                </p>
              </div>
              <div className="signal-equations">
                <div className="equation-hero" aria-label="xi equals c plus c dot over omega zero">
                  <span>ξ</span><i>=</i><span>c</span><i>+</i>
                  <span className="math-fraction"><b>ċ</b><b>ω₀</b></span>
                </div>
                <div className="equation-secondary">
                  <span>ω₀ ≜ √(g / h)</span>
                  <small>LIP natural frequency</small>
                </div>
              </div>
              <dl className="symbol-key">
                <div><dt>c, ċ</dt><dd>CoM position and velocity</dd></div>
                <div><dt>h</dt><dd>effective CoM height</dd></div>
                <div><dt>g</dt><dd>gravitational acceleration</dd></div>
                <div><dt>ξ</dt><dd>capture point / xCoM</dd></div>
              </dl>
              <div className="relative-state">
                <span>Relative to support center s</span>
                <strong>r ≜ c − s</strong>
                <strong>ξ − s ≈ r + ṙ / ω₀</strong>
              </div>
            </article>

            <article className="derivation-chapter cancel-chapter">
              <div className="chapter-intro">
                <span className="step-index">02 · Remove the hidden state</span>
                <h4>Subtract support motion in the world frame.</h4>
                <p>
                  CoM and support center share the same translating base. Expanding
                  both velocities exposes the identical term that disappears.
                </p>
              </div>
              <div className="proof-panel">
                <div className="proof-line">
                  <span className="proof-name">CoM</span>
                  <span>ċ<sub>W</sub> = <del>v<sub>b</sub><sup>W</sup></del> + ω<sub>W</sub> × (R d<sub>c</sub>) + R J<sub>c</sub> q̇</span>
                </div>
                <div className="proof-line">
                  <span className="proof-name">Support</span>
                  <span>ṡ<sub>W</sub> = <del>v<sub>b</sub><sup>W</sup></del> + ω<sub>W</sub> × (R d<sub>s</sub>) + R J<sub>s</sub> q̇</span>
                </div>
                <div className="proof-operator"><span>subtract</span><i>↓</i></div>
                <div className="proof-line proof-result">
                  <span className="proof-name">Relative</span>
                  <strong>
                    ṙ<sub>W</sub> = ω<sub>W</sub> × R(d<sub>c</sub> − d<sub>s</sub>)
                    + R(J<sub>c</sub> − J<sub>s</sub>)q̇
                  </strong>
                </div>
              </div>
              <aside className="cancellation-note">
                <span>What cancels—and why</span>
                <p>
                  The base translation v<sub>b</sub><sup>W</sup> appears with the
                  same sign in ċ<sub>W</sub> and ṡ<sub>W</sub>. Their difference
                  removes it identically; no velocity estimator is introduced.
                </p>
              </aside>
            </article>

            <article className="derivation-chapter reconstruct-chapter">
              <div className="chapter-intro">
                <span className="step-index">03 · Reconstruct onboard</span>
                <h4>Express the result in the torso frame.</h4>
                <p>
                  The deployable form contains only proprioceptive measurements and
                  quantities computed from the robot&apos;s kinematic and mass model.
                </p>
              </div>
              <div className="onboard-equations">
                <span>r<sub>B</sub> = d<sub>c</sub> − d<sub>s</sub></span>
                <strong>
                  ṙ<sub>B</sub> = ω<sub>B</sub> × (d<sub>c</sub> − d<sub>s</sub>)
                  + (J<sub>c</sub> − J<sub>s</sub>)q̇
                </strong>
              </div>
              <div className="input-map">
                <div><span>Joint encoders</span><strong>q, q̇</strong><p>Configuration and joint velocity.</p></div>
                <div><span>Torso gyroscope</span><strong>ω<sub>B</sub></strong><p>Base angular velocity.</p></div>
                <div><span>Projected gravity</span><strong>xy plane</strong><p>Gravity-aligned horizontal projection.</p></div>
                <div><span>Robot model</span><strong>d, J, m</strong><p>CoM/support kinematics and mass weighting.</p></div>
              </div>
              <div className="actor-output">
                <span>Actor receives horizontal components</span>
                <strong>o<sub>bal</sub> = ([r<sub>B</sub>]<sub>xy</sub>, [ṙ<sub>B</sub>]<sub>xy</sub>) ∈ ℝ⁴</strong>
                <p>Direct deployment · no teacher–student distillation</p>
              </div>
            </article>
          </section>

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
