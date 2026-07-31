# Personal Portfolio Website — Ishmael Harry-Deckor

A premium, high-converting, minimal, and technically credible personal portfolio site built using Next.js, Tailwind v4, GSAP, Framer Motion, and React Three Fiber (R3F).

---

## 🚀 Content-Driven Architecture (How to Update Content)

This website has been built with a **strict content-driven architecture**. Future content updates require editing only data files — never touching layout or component code.

### Adding a New Project
1. **Prepare screenshots**: Save two screenshots of the project:
   - Desktop view (1440px wide): `public/projects/[slug]/desktop.png`
   - Mobile view (375px wide): `public/projects/[slug]/mobile.png`
2. **Add data entry**: Edit the [projects.ts](file:///c:/Users/user/Desktop/New%20folder%20%284%29/src/data/projects.ts) file and append a new `Project` object:
   ```typescript
   {
     slug: "your-project-slug",
     name: "Your Project Name",
     url: "https://your-project-live-url.com",
     category: "SaaS Dashboard", // Category filters will update automatically
     summary: "Short one-sentence summary.",
     problem: "What challenge was addressed...",
     approach: "How it was built...",
     outcome: "The final results...",
     techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
     isFeatured: true // Set to true to showcase on the home page
   }
   ```
3. **No other file changes are needed!** The homepage featured grid, full catalog grid, dynamic filters, and individual case study pages `/projects/[slug]` will render automatically.

### Managing Certifications
- Edit [certifications.ts](file:///c:/Users/user/Desktop/New%20folder%20%284%29/src/data/certifications.ts) to add or remove badges. The grids on the Home and About pages adjust dynamically.

### Managing Skills
- Edit [skills.ts](file:///c:/Users/user/Desktop/New%20folder%20%284%29/src/data/skills.ts) to update the visual stack tag strips.

---

## 🛠️ Tech Stack & Design System

- **Framework**: Next.js App Router (React 19, TypeScript)
- **Styling**: Tailwind CSS v4 (Imported via standard custom tokens)
- **Animations**: GSAP (ScrollTrigger & `useGSAP` hook) & Framer Motion (Page and state transitions)
- **3D Particles**: React Three Fiber (R3F) for interactive mesh background
- **Design Tokens**: Configured in [MASTER.md](file:///c:/Users/user/Desktop/New%20folder%20%284%29/design-system/MASTER.md)
  - Base Background: Deep Charcoal (`#050505`)
  - Accent Color: Warm Amber/Gold (`#D4A527`)
  - Typography: Outfit (Display Headlines) + Inter (Body Copy)

---

## 📦 Getting Started

### Installation
Run:
```bash
npm install
```

### Run Locally
Start the development server:
```bash
npm run dev
```

### Production Build
Verify the build compiles cleanly:
```bash
npm run build
```
