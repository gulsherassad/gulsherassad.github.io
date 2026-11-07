# Gulsher Assad — Portfolio

Personal portfolio site, live at <https://gulsherassad.github.io/>.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) (JavaScript)
- [Motion](https://motion.dev) for animation
- Plain CSS (design tokens in `src/styles/tokens.css`)
- Prettier for formatting

## Run locally

```sh
npm install
npm run dev      # start dev server at http://localhost:5173/
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # lint with oxlint
npm run format   # format with Prettier
```

## Asset scripts

Run these after changing the source images or the site's headline; commit the
generated files in `public/`.

```sh
npm run images   # convert public/projects/*.png to WebP (max 1600px wide), deleting the PNGs
npm run og       # render the 1200×630 social preview to public/og.png
npm run favicon  # regenerate the favicons in public/
```

After adding or replacing a screenshot, update its `width` and `height` in
`src/data/projects.js` to the new file's real pixel size.

## Deploys

Every push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `dist/` to GitHub Pages.
The repo is named `gulsherassad.github.io`, so Pages serves it from the
domain root and Vite's `base` is `/`.

One-time setup: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**.
