# DDC project website

Single-page research website for **Deployable Dynamic-CoM (DDC)** and its Unitree G1 real-robot demonstrations.

## Environment

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

Generate lightweight web assets from the original 4K footage:

```powershell
python scripts\prepare_media.py
```

Use `--force` to rebuild existing outputs. The script:

- transcodes the 120-second film to a streaming-friendly 960×720 H.264 file;
- selects 25 balanced left/right DDC clips and creates grid/detail versions;
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

The repository-level GitHub Actions workflow builds `website/` and deploys `website/dist` to GitHub Pages.

1. Push website changes to `main`.
2. In GitHub, open **Settings → Pages → Build and deployment → Source**.
3. Select **GitHub Actions**.
4. Wait for the **Deploy DDC website** workflow to complete.
5. Open the Pages URL, expected for this repository as `https://estoil.github.io/DDC/`.

Public links live in `src/data/project.ts` (`paper`, `repository`, `authors`).

## Promotion checklist

- Add the live website URL to the GitHub repository description.
- Add the live website URL near the top of the DDC README.
- Add the live website URL to the arXiv comments field if editable.
- Share the website with short real-robot clips and direct links to paper/code/benchmark.
