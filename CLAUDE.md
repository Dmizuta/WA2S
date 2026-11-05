# CLAUDE.md

Project context for Claude Code. **Keep this file updated**: whenever a change affects architecture, data, routes, deployment, or known issues, update the relevant section and add an entry to the [Changelog](#changelog).

## What this is

**WA2S** is the website for **2A Sports**, a Brazilian sports-uniform brand (Instagram `@2a.sports`). The site is a marketing landing page plus a **"Monte o seu" (build your own) uniform customizer**. Customers pick a category, model and art, recolor the layers on a canvas, and then (planned) upload a logo and ask for a quote ("Orçamento") over WhatsApp.

- UI language: **Portuguese (pt-BR)**. Code comments are mostly English.
- Frontend only. There is no backend, database, auth or API.
- Repo: https://github.com/Dmizuta/WA2S (branch `main`)
- Hosting: **Vercel**. Every push to `main` auto-deploys to Production through the GitHub integration.

## Stack

| Piece | Version / notes |
|---|---|
| Vite | 7 (`vite.config.js` uses only `@vitejs/plugin-react`) |
| React | 19 (**StrictMode is disabled on purpose** in `src/main.jsx` because double-mounting breaks Fabric.js) |
| React Router | 7 (`BrowserRouter`) |
| Canvas | `fabric-pure-browser` **v5**, imported as `import { fabric } from "fabric-pure-browser"`. It uses the v5 **callback** API (`fabric.Image.fromURL(url, cb, opts)`), not the v6 promise API |
| Styling | Tailwind CSS **v4** through `@tailwindcss/postcss` (`@import "tailwindcss"` in `index.css`), mixed with hand-written CSS classes in `src/index.css` and `src/components/HeaderFooter.css`. `tailwind.config.js` is v3-style and is ignored by v4 |
| Language | Plain JS/JSX (no TypeScript) |
| Lint | ESLint 9 flat config (`eslint.config.js`) |

## Commands

```bash
npm install
npm run dev      # Vite dev server
npm run build    # outputs dist/
npm run preview  # serve the build
npm run lint
```

There are no tests.

## Deployment

- Vercel project under `dmizutas-projects`. Production deploys come from pushes to `main`.
- `vercel.json` rewrites every path to `/` so client-side routes work on refresh.
- To check whether production matches local, compare `git rev-parse HEAD` with the latest Production deployment SHA:
  `gh api repos/Dmizuta/WA2S/deployments --jq '.[0] | {sha, environment, created_at}'`
- The Vercel CLI is not installed locally.

## Routes (`src/App.jsx`)

| Path | Page | Purpose |
|---|---|---|
| `/` | `pages/Home.jsx` | Header + Hero + Contact + Footer. Scrolls to `#contact` when it gets `location.state.scrollToContact` or the `#contact` hash |
| `/monte-seu` | `pages/MonteSeu.jsx` | Step 1: category grid (from `data/products.js`). On click it saves `{category, categoryKey}` to `localStorage.finalProduct` and goes to `/monte-fabric` |
| `/monte-fabric` | `pages/MonteFabric.jsx` | **Main customizer.** Reads `localStorage.finalProduct`. Left column: model and art dropdowns. Center: `CanvasEditor`. Right column: Orçamento button, logo upload, WhatsApp button |
| `/canvas` | `pages/Canvas.jsx` | Dev/test page: `CanvasEditor` with no props |
| `/tint-test` | `pages/TintTest.jsx` | Dev sandbox for multiply-tint masks (standalone Fabric canvas) |

## Data model

Two separate data files describe the same four categories: `fardamento`, `camisa`, `agasalho` and `blusa`.

- **`src/data/products.js`**: category cards for `/monte-seu` (`name` and `img` from `/images/categories/`). Its `subcategories` field is unused and points to images that don't exist.
- **`src/data/fabricData.js`**: what the customizer uses. Its shape is:
  ```js
  fabricData[categoryKey] = {
    models: [{ id, name, img }],          // img = base garment PNG in /images/models/
    arts: { [modelId]: [{ id, name, layers?: [png, png, ...] }] }
  }
  ```
  Model IDs are `fard1/2`, `cam1/2`, `aga1/2` and `blu1/2`. Only **`aga1`** has real art layer PNGs (`public/images/arts/agasalho/aga1/art{1..3}/layer{1,2}.png`). `aga2` points to files that don't exist yet. Every other model has 10 placeholder arts with no `layers`, so only the base image is drawn.

### Adding a new art

1. Put the transparent PNG layers (same canvas size as the model's base PNG, aligned to it) in `public/images/arts/<category>/<modelId>/<artN>/layerK.png`.
2. Add `{ id, name, layers: [...] }` to `fabricData[category].arts[modelId]`.
3. Base and layers are center-aligned in a group, so all images should have the same dimensions.

## CanvasEditor (`src/components/CanvasEditor.jsx`), the core of the app

Props: `model` (model ID) and `art` (art ID). `MonteFabric` also passes `baseImage`, which is ignored.

- **Init effect**: creates the `fabric.Canvas`. The canvas is square and sized to the wrapper by a `ResizeObserver` (wrapper is `aspect-square`, `md:w-[700px]`, `max-h-[80vh]`). Until the user moves, scales or rotates something (`userHasAdjustedRef`), resizing re-fits and re-centers the group.
- **Load effect** (`[model, art]`): clears the canvas, looks up the model in `fabricData`, and loads the base PNG plus the art layers. It then wraps them in **one `fabric.Group`** (`modelGroupRef`) so they move and scale together. The layer order is `[base, layer1, layer2, ...]`.
- **Tint effect** (`[colors]`): applies a `BlendColor` **multiply** filter to each group item (base alpha 0.9, layers alpha 0.8) and then calls `group.addWithUpdate()`. Colors are `{base, layer1, layer2}`, and each one has an `<input type="color">`.
- **Size slider**: 50–300%, multiplied by the auto-fit `__baseScale`. **Reset position** re-fits and re-centers the group.
- `addLogoFromURL(url)` is already written for a free-moving logo object (`logoRef`), but **nothing calls it yet**. `UploadLogo` is a bare `<input type="file">` and isn't wired up.
- Custom properties are stored on Fabric objects: `__natW`, `__natH`, `__baseScale` and `__kind`.

## Other components

- `Header.jsx`: brand "2A Sports", links to Início and Monte o seu, plus a Contact link with eased scroll. Styled by `HeaderFooter.css`.
- `Hero.jsx`: full-screen hero (`/hero-bg.jpg`) with a CTA to `/monte-seu`.
- `Contact.jsx`: WhatsApp (`wa.me/5511972657867` with a prefilled message) and Instagram buttons.
- `Footer.jsx`, `ModelSelector.jsx`, `ArtList.jsx` (both dropdowns), `UploadLogo.jsx` (stub).
- **Unused/leftover**: `Navbar.jsx`, `ProductCard.jsx`, `CategorySelector.jsx`, `ColorPalette.jsx`, `LayerSelector.jsx`, `App.css` and `assets/react.svg`. `public/images/test/` and `public/images/tint-test/` are dev assets.

## Known issues / TODO

- **Not implemented yet**: the logo upload doesn't reach the canvas, and the Orçamento and WhatsApp buttons in `/monte-fabric` do nothing (no handlers). Exporting the design and building the quote message are pending.
- `MonteFabric` header shows `${product.category} – ${product.model}`, but `product.model` is never set, so it renders "undefined".
- The `aga2` art layer files are missing from `public/`.
- `TintTest.jsx` loads `mask2.png` and `mask3.png`, but the files are named `maska2/maskb2/maska3/maskb3.png`.
- The `/images/fallback.png` image used in `MonteSeu` doesn't exist.
- The tint effect assumes at most 2 art layers (`items[1]`, `items[2]`).
- Changing model or art also clears any logo (`logoRef` is reset in the load effect).
- `index.css` has duplicated or overriding rules for `.card`, `.grid`, `.color-circle` and `.funnel-step`.
- `README.md` is still the default Vite template.

## Conventions

- Commit messages look like `feat: <short description>`.
- Work happens directly on `main`, and pushing deploys to production. Branch first for anything risky.
- Use Fabric v5 APIs only. Don't upgrade to `fabric` v6 without migrating all the callback-style code.
- Don't re-enable React StrictMode unless the Fabric init and cleanup survive a double mount.

## Changelog

Newest first. Add an entry for every meaningful change.

- **2026-11-05**: Added CLAUDE.md. Local `main` = `origin/main` = Vercel Production at `e80cd54`.
- **2026-01-04**: `e80cd54` image size fix (last production deploy).
- **2025-12**: Canvas image size controls (size slider, 50–300%).
- **2025-11**: CanvasEditor with grouped base and art layers, model and art filters, responsiveness, contact link.
- **2025-10-06/08**: Initial structure, new layout, "Monte o seu" funnel.
