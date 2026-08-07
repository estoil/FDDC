import { useEffect, useRef, useState } from 'react'
import { authors, demos, paper, repository, type Demo } from './data/project'

const youtubeUrl = 'https://youtu.be/ue3DhT5B3mU'

const simulationVideos = [
  ['FDDC', 'sim2sim_com_xcom_right_8424_FDDC.mp4'],
  ['GMT', 'sim2sim_com_xcom_right_8424_GMT.mp4'],
  ['HoloMotion', 'sim2sim_com_xcom_right_8424_HoloMotion.mp4'],
  ['Humanoid-GPT', 'sim2sim_com_xcom_right_8424_humanoid_gpt.mp4'],
  ['MOSAIC', 'sim2sim_com_xcom_right_8424_MOSAIC.mp4'],
  ['OmniXtreme', 'sim2sim_com_xcom_right_8424_OmniXtreme.mp4'],
  ['ProtoMotions', 'sim2sim_com_xcom_right_8424_protomotions.mp4'],
  ['SONIC', 'sim2sim_com_xcom_right_8424_SONIC.mp4'],
  ['TWIST', 'sim2sim_com_xcom_right_8424_TWIST.mp4'],
] as const

function PdfIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M8.5 16.5h7M8.5 13.5h7" /></svg>
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.48.09.65-.2.65-.46v-1.68c-2.65.58-3.2-1.12-3.2-1.12-.43-1.1-1.06-1.39-1.06-1.39-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.86 1.46 2.25 1.04 2.8.8.09-.61.34-1.04.61-1.28-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.62.97a9.1 9.1 0 0 1 4.77 0c1.81-1.23 2.61-.97 2.61-.97.52 1.31.19 2.28.1 2.52.61.66.97 1.51.97 2.55 0 3.67-2.23 4.48-4.36 4.71.34.3.65.89.65 1.8v2.67c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z" /></svg>
}

function VideoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="m10 9 5 3-5 3Z" /></svg>
}

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

function App() {
  const reducedMotion = useReducedMotion()
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)
  return <>
    <main>
      <section className="project-hero" id="top">
        <div className="hero-background" aria-hidden="true"><video src="./media/hero-video.mp4" poster="./media/fddc-poster.webp" muted loop autoPlay={!reducedMotion} playsInline preload="metadata" /><div /></div>
        <nav className="resource-links" aria-label="Project resources">
          <a href={paper.url} target="_blank" rel="noreferrer"><PdfIcon /><span>arXiv</span></a>
          <a href={youtubeUrl} target="_blank" rel="noreferrer"><VideoIcon /><span>Video</span></a>
          <a href={repository.url} target="_blank" rel="noreferrer"><GitHubIcon /><span>Code</span></a>
        </nav>
        <div className="project-header">
          <p className="project-mark">FDDC</p>
          <h1>First Deployable<br />Dynamic-CoM</h1>
          <p className="hero-subtitle">A Unified Policy and Method-Agnostic Benchmark<br />for Humanoid Single-Leg Balance</p>
          <p className="authors">{authors.join(' · ')}</p>
          <p className="venue">arXiv:2608.00500 · August 2026</p>
        </div>
      </section>

      <section className="content-section comparison-section">
        <h2>Simulation Comparisons</h2>
        <p className="section-note">The same sim2sim single-leg balance setting, shown for FDDC and eight comparison policies.</p>
        <div className="comparison-grid">{simulationVideos.map(([name, file]) => <article key={name} className={name === 'FDDC' ? 'comparison-card featured-comparison' : 'comparison-card'}><video src={`./media/sim2sim/${file}`} muted loop playsInline controls preload="metadata" /><h3>{name}</h3></article>)}</div>
      </section>

      <section className="content-section videos" id="videos">
        <h2>Real-Robot Demonstrations</h2>
        <p className="section-note">25 single-leg balance motions, executed by one unified policy on Unitree G1. Select a clip to play it with controls.</p>
        <div className="video-grid">{demos.map((demo) => <VideoCard key={demo.id} demo={demo} onOpen={setSelectedDemo} reducedMotion={reducedMotion} />)}</div>
      </section>

      <section className="content-section abstract" id="abstract">
        <h2>Abstract</h2>
        <p>Unified humanoid policies handle agile whole-body motion, yet stumble on a simple demand: staying balanced on one leg. FDDC puts a support-relative dynamic-CoM observation directly into the actor, where it is reconstructed from encoders and IMU alone. Trained with a privileged critic and no distillation, FDDC holds a clean single-leg stance on 86 of 90 held-out motions across nine pose classes and transfers to a real Unitree G1.</p>
        <div className="evaluation-panel">
          <div><span>Benchmark & evaluation</span><h3>A shared testbed for clean single-leg balance.</h3><p>FDDC releases a method-agnostic, reproducible sim2sim benchmark. Every policy is evaluated in a common MuJoCo G1 environment with the same motions, control rate, and outcome tiers: Perfect, Marginal, or Failure.</p></div>
          <dl><div><dt>900</dt><dd>stratified motions</dd></div><div><dt>720 / 90 / 90</dt><dd>train / validation / test</dd></div><div><dt>90</dt><dd>held-out test motions</dd></div><div><dt>86 / 90</dt><dd>FDDC clean holds</dd></div></dl>
        </div>
      </section>

      <figure className="overview-figure"><img src="./media/figures/fddc-overview.png" alt="FDDC training, benchmarking, and real-robot deployment overview" /><figcaption>FDDC trains a deployable actor with a support-relative dynamic-CoM observation, evaluates it in a method-agnostic sim2sim benchmark, and deploys it directly on Unitree G1.</figcaption></figure>

    </main>
    <footer><span>FDDC · First Deployable Dynamic-CoM</span><a href="#top">Back to top</a></footer>
    {selectedDemo && <VideoModal demo={selectedDemo} onClose={() => setSelectedDemo(null)} />}
  </>
}

export default App
