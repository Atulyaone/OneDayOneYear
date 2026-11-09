# One Day, One Year — Figma Design Templates

This directory contains the production-grade, Figma-ready vector SVG design templates and components for the **One Day, One Year** interactive historical archive project.

Each template has been created at 1:1 vector precision matching the official Figma project designs, complete with semantic layer hierarchies, editable typography, vector iconography, and design tokens.

---

## 📁 Template Files

| File | Canvas Dimensions | Description |
|---|---|---|
| [`01-dispatch-special-report.svg`](./01-dispatch-special-report.svg) | `1440 × 2950 px` | **Special Report / Vol. I** — Vintage broadsheet dispatch covering the Apollo 11 moon landing, archivist appointment, cartographic projections, lunar descent trajectory, and telemetry specifications. |
| [`02-the-archive-opens.svg`](./02-the-archive-opens.svg) | `1440 × 2850 px` | **The Archive Opens** — Cinematic hero opening stage featuring the 3D perspective newspaper centerpiece and the designated `"Scroll space"` canvas scrubbing indicator. |
| [`03-this-day-in-tech-timeline.svg`](./03-this-day-in-tech-timeline.svg) | `1440 × 2950 px` | **This Day in Technology** — 10 September interactive timeline spanning 2015–2022 with alternating discipline nodes, category pills, telemetry box, and featured 2020 AI milestone card. |
| [`04-oneday-oneyear-homepage.svg`](./04-oneday-oneyear-homepage.svg) | `1440 × 3300 px` | **Master Platform Homepage** — Comprehensive landing experience including the circular compass date selector widget, five historical moments carousel, 1969 NASA mission control feature story, celestial orbit visualization, and "Ask the Historian" interface. |
| [`figma-canvas-all-templates.svg`](./figma-canvas-all-templates.svg) | `6500 × 3700 px` | **Master Multi-Artboard Canvas** — All 4 design screens laid out side-by-side with Artboard labels, providing an instant multi-frame Figma workspace with one single import. |
| [`index.html`](./index.html) | — | **Interactive Visual Showcase** — In-browser viewer allowing you to preview, zoom, inspect, and download any template or component. |

---

## 🧩 Reusable Component Library (`components/`)

- [`component-date-picker-widget.svg`](./components/component-date-picker-widget.svg): Interactive circular compass dial date selector with radial tick marks, active date pill, and month cycler (`540 × 500 px`).
- [`component-celestial-orbit-map.svg`](./components/component-celestial-orbit-map.svg): Nested planetary ellipses with glowing gold starlight nodes (`650 × 340 px`).

---

## 🚀 How to Import into Figma

Importing these vector templates into Figma is seamless:

### Option A: Drag & Drop (Recommended)
1. Open any existing or new file in **Figma** (or [figma.com](https://figma.com)).
2. Drag and drop `figma-canvas-all-templates.svg` (or any individual `.svg` file) from your file explorer directly onto the Figma canvas.
3. Figma will immediately generate native vector **Frames** with named layers (`Header`, `Hero`, `Timeline_Events`, `Cards`, `Footer`), editable text layers, vector paths, and gradient fills.

### Option B: File Import in Figma
1. In Figma, click the main menu (top-left) → **File** → **Place Image / Vector...** (or press `Ctrl+Shift+K` on Windows / `Cmd+Shift+K` on macOS).
2. Select the desired `.svg` template and click on your canvas to place it.

### Option C: Right-Click Copy as SVG
1. Open any SVG in your browser or code editor.
2. Copy the SVG code or file and paste (`Ctrl+V` / `Cmd+V`) directly into Figma.

---

## 🎨 Design System Tokens

### Color Palette

#### Broadsheet Archive Theme (Template 01)
- Parchment Background: `#E8DEC9` / `#DFD2BD`
- Broadsheet Ink: `#1C1814`
- Secondary Ink: `#2B2620`
- Border Rules: `#2B2620` / `#9A8C74`
- Figma Component Highlight: `#18A0FB`
- Accent Crimson: `#8A2B18`

#### Dark Obsidian & Gold Theme (Templates 02 & 04)
- Canvas Background: `#080809` / `#09090C`
- Card Fill: `#111116` / `#161620`
- Antique Gold Accent: `#D4AF37` / `#C5A878`
- Soft Gold Text: `#F0ECE1` / `#EED7A1`
- Muted Body Text: `#A8A096` / `#7A7A88`

#### High-Contrast Tech Obsidian Theme (Template 03)
- Background: `#0A0A0D`
- Card Fill: `#141419`
- Crimson Accent: `#E63946` / `#FF3B30`
- Pure White Headline: `#FFFFFF`
- Muted Technical Gray: `#8E8E93` / `#5A5A62`

### Typography Stack
- **Serif Headlines & Titles**: `'Cinzel'`, `'Playfair Display'`, `'Georgia'`, `serif`
- **Body & Editorial Copy**: `'Playfair Display'`, `'Georgia'`, `serif`
- **User Interface & Controls**: `'Inter'`, `-apple-system`, `sans-serif`
- **Technical Telemetry & Records**: `'IBM Plex Mono'`, `'Courier New'`, `monospace`
- **Handwritten / Design Annotations**: `'Caveat'`, `'cursive'`

---

## 🔗 Related External Templates
- The initial Figma Community inspiration template link is preserved in [`Figma Design Temp-1`](../Figma%20Design%20Temp-1).

