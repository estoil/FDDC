# FDDC project website

An English, single-page research website for **First Deployable Dynamic-CoM** and its Unitree G1 real-robot demonstrations.

## Environment

The project uses Conda for Node.js, Python, and FFmpeg:

```powershell
conda env create --prefix .\.conda --file environment.yml
conda activate .\.conda
npm install
```

If the environment already exists:

```powershell
conda env update --prefix .\.conda --file environment.yml --prune
conda activate .\.conda
```

## Prepare media

The source files remain outside the website. Generate lightweight web assets from the original 4K footage:

```powershell
python scripts\prepare_media.py
```

Use `--force` to rebuild existing outputs. The script:

- transcodes the 120-second film to a streaming-friendly 960×720 H.264 file;
- selects 25 balanced left/right Policy-A clips and creates 640×480 grid plus 1440×1080 detail versions;
- creates WebP posters for lazy loading;
- copies the scalable method overview into the public bundle.

## Develop and verify

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

## Publish

The repository-level GitHub Actions workflow builds `website/` and deploys `website/dist` to GitHub Pages. In the repository settings, choose **GitHub Actions** as the Pages source.

The Vite base path is relative, so the build works for both `username.github.io` and repository subpaths.

## De-anonymization checklist

Public links and author information intentionally remain marked **Coming soon**. Before publication:

1. replace the resource placeholders in `src/data/project.ts`;
2. add author names and affiliations;
3. confirm the final paper title, venue, and citation;
4. add the public paper, code, and benchmark URLs;
5. review all demo labels against the final motion metadata.
