# Gulsher Assad — Portfolio

Personal portfolio site, live at <https://gulsherassad.github.io/portfolio/>.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) (JavaScript)
- [Motion](https://motion.dev) for animation
- Plain CSS (design tokens in `src/styles/tokens.css`)
- Prettier for formatting

## Run locally

```sh
npm install
npm run dev      # start dev server at http://localhost:5173/portfolio/
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run format   # format with Prettier
```

## Deploys

Every push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `dist/` to GitHub Pages.
Vite's `base` is set to `/portfolio/` to match the Pages URL.

One-time setup: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**.
