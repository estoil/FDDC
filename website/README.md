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

Public links live in `src/data/project.ts` (`paper`, `repository`, `authors`).

### Go live on GitHub Pages

1. Push the `website/` changes to the `main` branch (or run **Deploy FDDC website** manually under Actions).
2. In the GitHub repo: **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.
3. After the workflow succeeds, open the URL shown in the **Deploy FDDC website** run (typically `https://<user>.github.io/<repo>/` or your custom domain).
4. Add the live URL to the FDDC GitHub README and the arXiv “Comments” field so paper and project page cross-link.

### Optional: custom domain

Set **Settings → Pages → Custom domain**, add a DNS `CNAME` (e.g. `fddc.example.org`), and commit a `website/public/CNAME` file if you use a project subdomain.
