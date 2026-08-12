import { useEffect, useRef, useState } from 'react'
import { ablations, authors, demos, paper, repository, type Demo } from './data/project'

const youtubeUrl = 'https://youtu.be/ue3DhT5B3mU'

const fddcComparison = ['DDC', 'sim2sim_com_xcom_right_8424_DDC.mp4?v=20260812-2'] as const

const emergentRobustnessBaselines = [
  ['HoloMotion', 'sim2sim_com_xcom_right_8424_HoloMotion.mp4'],
  ['SONIC', 'sim2sim_com_xcom_right_8424_SONIC.mp4'],
  ['MOSAIC', 'sim2sim_com_xcom_right_8424_MOSAIC.mp4'],
  ['Humanoid-GPT', 'sim2sim_com_xcom_right_8424_humanoid_gpt.mp4'],
] as const

const balanceGapBaselines = [
  ['GMT', 'sim2sim_com_xcom_right_8424_GMT.mp4'],
  ['OmniXtreme', 'sim2sim_com_xcom_right_8424_OmniXtreme.mp4'],
  ['ProtoMotions', 'sim2sim_com_xcom_right_8424_protomotions.mp4'],
  ['TWIST', 'sim2sim_com_xcom_right_8424_TWIST.mp4'],
] as const

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5Z" /></svg>
}

function useReducedMotion() {
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

function VideoCard({ demo, onOpen, reducedMotion }: { demo: Demo; onOpen: (demo: Demo) => void; reducedMotion: boolean }) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px' })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])
  return <button className="video-card" ref={cardRef} onClick={() => onOpen(demo)} aria-label={`Play real-robot demo ${demo.id}`}>
    <video src={visible ? demo.video : undefined} poster={demo.poster} muted loop playsInline autoPlay={visible && !reducedMotion} preload="none" />
    <span className="play-badge"><PlayIcon /></span>
    <span className="video-caption">{String(demo.id).padStart(2, '0')} · {demo.title}</span>
  </button>
}

function VideoModal({ demo, onClose }: { demo: Demo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') }
  }, [onClose])
  return <div className="modal" role="dialog" aria-modal="true" aria-label={`Demo ${demo.id}`}>
    <button className="modal-backdrop" aria-label="Close video" onClick={onClose} />
    <div className="modal-panel"><button className="modal-close" aria-label="Close video" onClick={onClose}>×</button><video src={demo.videoHd} poster={demo.poster} controls autoPlay playsInline /><p>Demo {String(demo.id).padStart(2, '0')} · {demo.title}</p></div>
  </div>
}

function AblationChart() {
  const [mode, setMode] = useState<'clean' | 'noisy'>('clean')
  return <section className="content-section ablations" id="ablations">
    <div className="ablation-heading">
      <div>
        <p className="section-kicker">Component analysis</p>
        <h2>What Drives Balance?</h2>
        <p className="section-note">Perfect-success rate on the 90-motion held-out test set. Removing the dynamic-CoM observation causes the largest clean-performance drop.</p>
      </div>
      <div className="metric-toggle" role="group" aria-label="Ablation evaluation condition">
        <button type="button" className={mode === 'clean' ? 'active' : ''} aria-pressed={mode === 'clean'} onClick={() => setMode('clean')}>Clean</button>
        <button type="button" className={mode === 'noisy' ? 'active' : ''} aria-pressed={mode === 'noisy'} onClick={() => setMode('noisy')}>Noisy</button>
      </div>
    </div>
    <p className="ablation-context">{mode === 'clean' ? 'Clean evaluation · K = 1' : 'Observation noise · K = 10 seeds'}</p>
    <div className="ablation-chart">
      {ablations.map((ablation, index) => {
        const value = ablation[mode]
        return <div className={`ablation-row${index === 0 ? ' ablation-full' : ''}`} key={ablation.label}>
          <span className="ablation-label">{ablation.label}</span>
          <div className="ablation-track"><span className="ablation-fill" style={{ width: `${value}%` }} /></div>
          <strong>{value.toFixed(1)}%</strong>
        </div>
      })}
    </div>
    <p className="ablation-footnote">Noisy evaluation perturbs deployable observations only; outcomes are scored from the robot’s true state.</p>
  </section>
}

function App() {
  const reducedMotion = useReducedMotion()
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)
  return <>
    <main>
      <section className="project-hero" id="top">
        <div className="hero-background" aria-hidden="true"><video src="./media/hero-video-v2.mp4" muted loop autoPlay={!reducedMotion} playsInline preload="auto" onLoadedMetadata={(event) => { event.currentTarget.currentTime = 0 }} /><div /></div>
        <nav className="resource-links" aria-label="Project resources">
          <a href={paper.url} target="_blank" rel="noreferrer"><img className="resource-icon" src="./media/icons/arxiv.svg" alt="" /><span>arXiv</span></a>
          <a href={youtubeUrl} target="_blank" rel="noreferrer"><img className="resource-icon" src="./media/icons/youtube.svg" alt="" /><span>Video</span></a>
          <a href={repository.url} target="_blank" rel="noreferrer"><img className="resource-icon" src="./media/icons/github.svg" alt="" /><span>Code</span></a>
        </nav>
        <div className="project-header">
          <p className="project-mark">DDC</p>
          <h1>Capture Point<br />in the Loop</h1>
          <p className="hero-subtitle">On-Board Balance Observation for Humanoid Single-Leg Balance</p>
          <p className="authors">{authors.map((author, index) => <span key={author}>{author}{(author === 'Yixin Zhu' || author === 'Wenxin Li') && <sup>*</sup>}{index < authors.length - 1 && ' · '}</span>)}</p>
          <p className="affiliation">Peking University</p>
          <p className="correspondence">- Corresponding authors: yixin.zhu@pku.edu.cn · lwx@pku.edu.cn</p>
          <p className="venue">arXiv:2608.00500 · August 2026</p>
        </div>
      </section>

      <section className="content-section comparison-section">
        <h2>Simulation Comparisons</h2>
        <p className="section-note">The same sim2sim single-leg balance setting, shown for DDC and eight comparison policies.</p>
        <article className="comparison-card comparison-ours"><video src={`./media/sim2sim/${fddcComparison[1]}`} muted loop playsInline controls preload="metadata" /><h3>{fddcComparison[0]} · Our Proposed Method</h3></article>
        <section className="baseline-group">
          <p className="comparison-caption">Strong generalist policies exhibit emergent single-leg robustness, but do not consistently sustain clean balance.</p>
          <div className="baseline-grid">{emergentRobustnessBaselines.map(([name, file]) => <article key={name} className="comparison-card"><video src={`./media/sim2sim/${file}`} muted loop playsInline controls preload="metadata" /><h3>{name}</h3></article>)}</div>
        </section>
        <section className="baseline-group">
          <p className="comparison-caption">Current general policies remain well short of reliable single-leg balance.</p>
          <div className="baseline-grid">{balanceGapBaselines.map(([name, file]) => <article key={name} className="comparison-card"><video src={`./media/sim2sim/${file}`} muted loop playsInline controls preload="metadata" /><h3>{name}</h3></article>)}</div>
        </section>
      </section>

      <section className="content-section videos" id="videos">
        <h2>Real-Robot Demonstrations</h2>
        <p className="section-note">25 single-leg balance motions, executed by one unified policy on Unitree G1. Select a clip to play it with controls.</p>
        <div className="video-grid">{demos.map((demo) => <VideoCard key={demo.id} demo={demo} onOpen={setSelectedDemo} reducedMotion={reducedMotion} />)}</div>
      </section>

      <section className="content-section abstract" id="abstract">
        <h2>Abstract</h2>
        <p>Unified humanoid policies handle agile whole-body motion, yet stumble on a simple demand: staying balanced on one leg. On our single-leg-balance benchmark, eight released state-of-the-art general policies hold a clean single-leg stance on 0 of 90 test motions; they stay up only by stepping or hopping, recovering from imbalance rather than preventing it. Prevention needs the capture point (xCoM), the center of mass (CoM) extrapolated by its velocity, which has never driven a learned hardware policy because it requires a base linear velocity that no on-board sensor measures directly. A change of frame makes it observable: expressed relative to the support foot, that velocity cancels exactly, leaving an observation reconstructible from encoders and IMU alone. We put this first deployable dynamic-CoM observation directly into the actor that runs on hardware, and pair it with a reward library translated term by term from human postural control, under one principle: prevention over repair. Trained by asymmetric FastSAC with a privileged critic and no distillation, the resulting policy, DDC (Deployable Dynamic-CoM), holds clean single-leg balance on 89 of 90 held-out motions across nine stratified pose classes and transfers to a real Unitree G1; in ablation, the dynamic-CoM observation is the single largest driver: removing it alone costs 43 points of clean single-leg balance. We release the full stack with the first method-agnostic, reproducible sim2sim benchmark for humanoid single-leg balance, scoring each policy in a simulator distinct from its training one, a step toward turning balance from a per-task trick into a capability the field can measure.</p>
        <div className="evaluation-panel">
          <div><span>Benchmark & evaluation</span><h3>A shared testbed for clean single-leg balance.</h3><p>DDC releases a method-agnostic, reproducible sim2sim benchmark. Every policy is evaluated in a common MuJoCo G1 environment with the same motions, control rate, and outcome tiers: Perfect, Marginal, or Failure.</p></div>
          <dl><div><dt>900</dt><dd>stratified motions</dd></div><div><dt>720 / 90 / 90</dt><dd>train / validation / test</dd></div><div><dt>98.9%</dt><dd>Perfect · clean</dd></div><div><dt>61.8%</dt><dd>Perfect · noisy</dd></div></dl>
        </div>
      </section>

      <figure className="overview-figure"><img src="./media/figures/ddc-overview.png" alt="DDC training, benchmarking, and real-robot deployment overview" /><figcaption>DDC trains a deployable actor with a support-relative dynamic-CoM observation, evaluates it in a method-agnostic sim2sim benchmark, and deploys it directly on Unitree G1.</figcaption></figure>

      <AblationChart />

    </main>
    <footer><span>DDC · Deployable Dynamic-CoM</span><a href="#top">Back to top</a></footer>
    {selectedDemo && <VideoModal demo={selectedDemo} onClose={() => setSelectedDemo(null)} />}
  </>
}

export default App
