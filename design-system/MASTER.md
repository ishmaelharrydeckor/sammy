# Master Design System — Boutique Creative/Tech Agency One-Pager

This document defines the core styling, typography, spacing, depth, and motion guidelines for the boutique creative/tech agency one-pager portfolio piece.

---

## 1. Aesthetic Direction
- **Vibe**: Extremely minimal, confident, and highly structured.
- **Inspiration**: A smaller, more experimental hybrid of Vercel and Linear's marketing sites.
- **Theme Paradigm**: Deep Dark Mode (Charcoal / graphite / zinc, elegant glow only when justified).

---

## 2. Color Palette (Restrained Neon Emerald)
Designed specifically for a sleek dark mode with one deliberate, restrained neon accent color.

| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Background (Base)** | `--background` | `#040405` (Deepest Black-Charcoal) | Page background |
| **Background (Surface)**| `--surface` | `#0B0B0C` (Card / Section Surface) | Cards, inputs, sections |
| **Background (Muted)**  | `--surface-muted` | `#121214` | Borders, subtle highlights |
| **Foreground (Primary)**| `--foreground` | `#FFFFFF` (Pure white) | Primary headlines, body copy |
| **Foreground (Muted)**  | `--foreground-muted`| `#8E8E93` (System Grey) | Sub-headlines, descriptions |
| **Accent (Primary)**    | `--accent` | `#10B981` (Neon Emerald) | Interactive focus, CTAs, tags |
| **Accent (Glow)**       | `--accent-glow` | `rgba(16, 185, 129, 0.12)` | Glowing highlights, soft borders |

---

## 3. Typography
- **Headlines / Display**: Clash Display or Syne
  - *Rules*: Tight letter-spacing (`tracking-tight` or `-0.03em`) on large headlines. Fewer font sizes with bigger jumps between them (e.g., `text-5xl` to `text-8xl`).
- **Body / Interface**: Inter
  - *Rules*: Highly legible, standard tracking, neutral zinc/grey coloring.

```css
/* Typography variables */
--font-display: var(--font-clash), sans-serif;
--font-sans: var(--font-inter), sans-serif;
```

---

## 4. Spacing & Layout
- **Whitespace**: Generous and deliberate. Sections should have double the default padding to feel spacious and expensive.
  - Desktop sections: `py-36` or `py-48` (144px - 192px).
  - Mobile sections: `py-24` (96px).
- **Grid Layouts**:
  - Tight grid of 3-4 offerings/projects: 3-column desktop (`grid-cols-3`), 1-column mobile (`grid-cols-1`). Gap size: `gap-12` (48px).

---

## 5. Depth, Borders & Glassmorphism
- **Borders**: Avoid default heavy shadows. Use subtle 1px borders for structure.
  - Card borders: `border border-zinc-900 hover:border-emerald-500/20 transition-all duration-300`
- **Glassmorphism**: Use backdrop-blur (`backdrop-blur-md bg-black/60`) strictly for the main navigation header and the CTA hero overlay. Keep other surfaces solid for high contrast.

---

## 6. Motion & Interaction Guidelines
- **Scroll Animations**: GSAP ScrollTrigger.
  - *Entry*: Subtle fade-ups of 8px to 16px. Never use large slide transitions.
  - *Stagger*: Lists and grids must stagger entry by `50ms` per item.
- **Hover States**: Every interactive element needs a micro-interaction.
  - Buttons: Subtle scaling (`hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]`).
  - Cards: Soft border color shift.
- **Signature Interactive Moment**:
  - A React Three Fiber (R3F) interactive floating 3D crystalline prism scene in the hero section, responding to mouse position (displacement) and scroll.

---

## 7. Tailwind CSS v4 Theme Integration
To hook this system into Tailwind v4, add these variable assignments to `src/app/globals.css`:

```css
@theme {
  --color-background: #040405;
  --color-surface: #0b0b0c;
  --color-surface-muted: #121214;
  --color-foreground: #ffffff;
  --color-foreground-muted: #8e8e93;
  
  --color-accent: #10b981;
  --color-accent-glow: rgba(16, 185, 129, 0.12);
  
  --font-sans: var(--font-inter), sans-serif;
  --font-display: var(--font-clash), sans-serif;
}
```
