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
  { value: '86 / 90', label: 'clean single-leg holds', note: '95.6% Perfect' },
  { value: '0 / 90', label: 'for 8 SOTA generalists', note: 'on the same benchmark' },
  { value: '−40 pt', label: 'without dynamic-CoM', note: 'the largest single ablation' },
  { value: '3.9', label: 'mm/s support-foot slip', note: 'vs. 84–578 for baselines' },
]

export type ResourceLink = {
  label: string
  href: string
  subtitle: string
}

export const paper = {
  title:
    'First Deployable Dynamic-CoM: A Unified Policy and Method-Agnostic Benchmark for Humanoid Single-Leg Balance',
  arxivId: '2608.00500',
  url: 'https://arxiv.org/abs/2608.00500',
  pdfUrl: 'https://arxiv.org/pdf/2608.00500',
  venue: 'arXiv preprint · 2026',
}

export const repository = {
  url: 'https://github.com/zhouyikai888/FDDC',
  benchmarkUrl: 'https://github.com/zhouyikai888/FDDC/tree/main/eval',
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
