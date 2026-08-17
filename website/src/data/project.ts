export type Demo = {
  id: number
  title: string
  detail: string
  video: string
  videoHd: string
  poster: string
}

const demoDetails = [
  ['Left support', 'Policy A · checkpoint 214k'],
  ['Right support', 'Policy A · checkpoint 165k'],
  ['Left support', 'Policy A · checkpoint 214k'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · checkpoint 170k'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · checkpoint 170k'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · checkpoint 170k'],
  ['Right support', 'Policy A · checkpoint 271k'],
  ['Left support', 'Policy A · checkpoint 170k'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · noisy observation'],
  ['Right support', 'Policy A · checkpoint 165k'],
  ['Left support', 'Policy A · robustness run'],
  ['Right support', 'Policy A · checkpoint 165k'],
  ['Left support', 'Policy A · robustness run'],
  ['Right support', 'Policy A · checkpoint 165k'],
  ['Left support', 'Policy A · robustness run'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · checkpoint 165k'],
  ['Right support', 'Policy A · checkpoint 170k'],
  ['Left support', 'Policy A · checkpoint 165k'],
  ['Right support', 'Policy A · checkpoint 271k'],
  ['Right support', 'Policy A · checkpoint 208k'],
] as const

export const demos: Demo[] = demoDetails.map(([title, detail], index) => {
  const id = index + 1
  const file = String(id).padStart(2, '0')
  return {
    id,
    title,
    detail,
    video: `./media/demos/demo-${file}.mp4`,
    videoHd: `./media/demos-hd/demo-${file}.mp4`,
    poster: `./media/posters/demo-${file}.webp`,
  }
})

export const results = [
  { value: '89 / 90', label: 'clean single-leg holds', note: '98.9% Perfect' },
  { value: '0 / 90', label: 'for 8 SOTA generalists', note: 'on the same benchmark' },
  { value: '−43.3 pt', label: 'without dynamic-CoM', note: '55.6% Perfect without CoM' },
  { value: '61.8%', label: 'Perfect under observation noise', note: '10-seed noisy evaluation' },
  { value: '3.9', label: 'mm/s support-foot slip', note: 'vs. 84–531 for baselines' },
]

export const ablations = [
  { label: 'Full DDC', clean: 98.9, noisy: 61.8 },
  { label: 'w/o future-reference observation', clean: 93.3, noisy: 57.3 },
  { label: 'w/o ankle action-rate penalty', clean: 86.7, noisy: 47.7 },
  { label: 'w/o knee action-rate penalty', clean: 85.6, noisy: 44.0 },
  { label: 'w/o polygon penalty', clean: 83.3, noisy: 51.0 },
  { label: 'w/o jerk penalty', clean: 82.2, noisy: 48.1 },
  { label: 'w/o TTB penalty', clean: 73.3, noisy: 43.8 },
  { label: 'dynamic → static-CoM observation', clean: 66.7, noisy: 29.1 },
  { label: 'w/o CoM observation', clean: 55.6, noisy: 8.6 },
] as const

export type ResourceLink = {
  label: string
  href: string
  subtitle: string
}

export const paper = {
  title:
    'A Change of Frame Makes Balance Observable: Distillation-Free Humanoid Single-Leg Stance',
  arxivId: '2608.00500',
  url: 'https://arxiv.org/abs/2608.00500',
  pdfUrl: 'https://arxiv.org/pdf/2608.00500',
  venue: 'arXiv preprint · 2026',
}

export const repository = {
  url: 'https://github.com/zhouyikaiii/FDDC',
  benchmarkUrl: 'https://github.com/zhouyikaiii/FDDC/tree/main/eval',
}

export const authors = [
  'Yikai Zhou',
  'Xingyun Wang',
  'Jieming Cui',
  'Bozhou Chen',
  'Yikai Fan',
  'Yixin Zhu',
  'Wenxin Li',
]

export const links: ResourceLink[] = [
  { label: 'Paper', href: paper.url, subtitle: `arXiv:${paper.arxivId}` },
  { label: 'Code', href: repository.url, subtitle: 'GitHub · full stack' },
  { label: 'Benchmark', href: repository.benchmarkUrl, subtitle: 'MuJoCo sim2sim harness' },
]
