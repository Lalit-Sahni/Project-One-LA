Project-One-LA — Token-driven landing page (editor-ready)

This repository implements a themeable landing page using CSS design tokens so future editors can change one token (e.g., the primary color) and have the entire site update consistently.

## Quick start

  - npm: `npm run dev`

## Major Features

### 🎯 Interactive Timeline Section
- **Horizontal scrolling timeline** with GSAP ScrollTrigger integration
- **Dynamic parallax effects** - navbar moves up and description fades when scrolling
- **Click-to-navigate functionality** - click any timeline tab to smoothly scroll to that card
- **Equal-height cards** with JavaScript-based height calculation
- **Responsive design** with mobile-optimized layouts

### 📋 Rules & Regulations Section
- **Tabbed interface** similar to Competition Overview
- **Four comprehensive tabs**: Eligibility, Format, Submission, Judging
- **Token-driven styling** maintaining design consistency
- **Professional content layout** with checkmark bullet points

### 🎨 Enhanced Visual Design
- **Improved timeline card alignment** using CSS Grid and Flexbox
- **Consistent spacing** with 80px bottom padding for better content flow
- **Smooth animations** and transitions throughout
- **Professional typography** and visual hierarchy

## Project structure (key files)

- `styles/tokens.css` — single source of truth for theme tokens
  - Palette tokens: `--color-primary`, `--color-primary-600/500/400/50`, `--color-primary-foreground`
  - Semantic tokens: `--accent-600/500/400/50`, `--accent-foreground`, `--accent-gradient`
  - Surfaces & typography: `--surface`, `--surface-muted`, `--surface-border`, `--text-color`, `--muted-text`
  - Dark theme via `html[data-theme="dark"]`

- `styles/main.css` — global styles; imports `tokens.css` first, then component CSS
- `styles/button.css` — component styles consuming tokens only (no hard-coded colors)
- `styles/timeline.css` — timeline section with parallax effects and responsive design
- `scripts/main.js` — main application logic with GSAP ScrollTrigger and timeline interactions
- `scripts/tokens.js` — tiny runtime API for future editor integrations
- `sections/` — modular HTML sections (hero, overview, timeline, rules)
- `data/timeline.json` — timeline data structure for dynamic content
- `vite.config.js` — dev server config (port: 3000, auto-find available port)

## Changing the theme (now)

Change the base primary once and let derived colors update automatically:

```css
/* styles/tokens.css */
:root {
  --color-primary: #3b82f6; /* change just this */
}
```

If the browser supports `color-mix(in oklch, ...)`, the scale (`-600/-500/-400/-50`) is derived from `--color-primary`; otherwise, static fallbacks are used. Components should prefer semantic tokens like `--accent-500`.

## Runtime API (for later editor integration)

```js
// Update base hue at runtime
window.ThemeTokens.updateTokens({ '--color-primary': '#A855F7' });

// Toggle dark mode
window.ThemeTokens.setTheme('dark');
```

Persisting changes (CMS, JSON, etc.) is editor-specific. The contract: update CSS variables on `:root`, do not edit component CSS.

## Component guidelines

- Use tokens only; never hard-code colors in components
- Prefer semantic tokens (`--accent-*`) to decouple components from a specific palette
- Add new roles (e.g., success/warning) to `tokens.css` first, then consume them


```bash
corepack enable && corepack prepare yarn@4.3.1 --activate
printf "nodeLinker: node-modules\n" > .yarnrc.yml
yarn install
yarn dev
```

Alternatively, change the port in `vite.config.js`.

## Technical Implementation

### Timeline Parallax System
- **GSAP ScrollTrigger** for smooth horizontal scrolling and parallax effects
- **Dynamic navbar positioning** - moves up 20px when entering timeline section
- **Content fade transitions** - description fades out during parallax
- **Card scaling** - 5% scale increase for better space utilization

### Interactive Navigation
- **Click-to-scroll functionality** with smooth native scrolling
- **Active tab management** with visual state updates
- **ScrollTrigger integration** for accurate positioning
- **Responsive calculations** for different screen sizes

### Content Management
- **JSON-driven timeline data** in `data/timeline.json`
- **Dynamic content generation** with JavaScript templating
- **Equal-height card system** with JavaScript height calculation
- **Modular section architecture** for easy content updates

## Next steps

- Add a theme editor UI that maps form inputs to `ThemeTokens.updateTokens`
- Optionally persist token overrides (e.g., JSON in localStorage or a CMS)
- Implement additional interactive features for timeline cards
- Add more comprehensive mobile touch gestures

## License

MIT

