# Callahan/CI — Website Redesign Handoff

Six-page static site rebuilt with an "engineering journal / schematic" aesthetic: bone + ink palette, cobalt accent, Inter Tight + JetBrains Mono + Instrument Serif. Drop these files straight into the repo at the project root.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page. 3 hero variants toggleable via Tweaks panel (Spec sheet / Terminal / Schematic). Default = Spec. |
| `docs.html` | Documentation page. |
| `changelog.html` | Release notes / changelog. |
| `license.html` | MIT license page. |
| `privacy.html` | Privacy policy. |
| `terms.html` | Terms of service. |
| `assets/tokens.css` | Design tokens (kept for reference; tokens are also inlined in each page so the pages work standalone). |
| `assets/legal-shell.css` | Shared chrome for legal pages (referenced by license/privacy/terms). |
| `assets/logo.svg` | Logo as SVG using `currentColor` + CSS vars (`--logo-fg`, `--logo-accent`). |
| `assets/favicon.svg` | Standalone favicon. |

## Logo

Mark = **pipeline bars** (5 vertical bars, the AI bar tilted in accent color). Wordmark = `callahan/CI` with accent slash. Inline SVG is embedded in every page's nav + footer; no external dependency required.

## Hero variants

Default is variant **A (Spec sheet)** — switchable via the Tweaks panel toggle in the host environment, or by changing `<body data-hero="a|b|c">`.

- **a** — Spec sheet: hero copy + 4-stat grid + datasheet card
- **b** — Terminal: agent-emphasis headline + live shell with the four AI agents
- **c** — Schematic: pipeline diagram

## Notes for implementation

- All CSS is inlined per-page so the pages drop in independently. If you want a shared stylesheet, lift the `<style>` block out of `index.html` into `assets/site.css`.
- Tokens use `oklch()` — modern browsers only. If you need wider support, add hex fallbacks.
- Fonts loaded via Google Fonts (`Inter Tight`, `JetBrains Mono`, `Instrument Serif`). Self-host if you'd rather not hit Google.
- The Tweaks panel + theme toggle JS lives at the bottom of `index.html`.

## What changed vs. the original

- Removed the generic AI-tool aesthetic (purple gradients, big CTA hero, marketing-speak).
- Built a coherent type + color system rooted in technical-document language.
- Made the AI-agent angle concrete: each of the four agents (Architect, Debugger, Reviewer, Analyst) is named and shown doing real work in the terminal hero.
- New logo (pipeline bars) replaces the placeholder "C" tile.
- Six pages now share a unified visual language.
