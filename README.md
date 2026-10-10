<div align="center">

# Aditya Tiwari — Portfolio

**B.Tech Computer Science student at IILM University (class of 2029, CGPA 8.79), looking for a software engineering internship.**

Every project runs live inside the page, links to its source, and has a case study on the design decisions, trade-offs and limits.

[**Live site**](https://adityatiwari98.vercel.app) · [GitHub](https://github.com/adityatiwari9t8) · [LinkedIn](https://www.linkedin.com/in/adityatiwari9t8) · [Resume](https://adityatiwari98.vercel.app/resume.pdf)

![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## The projects

Each project has a working demo embedded in the site and a case-study page (problem, what I built, what I learned, limits, stack) at `#/work/<id>`.

| | Project | What it does | Code |
| --- | --- | --- | --- |
| <img src="public/sudoku-dark.webp" width="220" alt="Sudoku Algorithm Visualizer"> | **Sudoku Algorithm Visualizer** | Four search strategies (DFS backtracking, BFS, greedy and MRV) solve the same board step by step, then get compared on steps, backtracks and time. | [Repo](https://github.com/adityatiwari9t8/sudoku-algorithm-visualizer) |
| <img src="public/academic-dark.webp" width="220" alt="Academic Path Intelligence"> | **Academic Path Intelligence** | Turns the skills you already have into an ordered learning roadmap, using a depth-first topological sort so every prerequisite comes first. | [Repo](https://github.com/adityatiwari9t8/academic-path-intelligence) |
| <img src="public/expense-dark.webp" width="220" alt="Expense Insight Pro"> | **Expense Insight Pro** | A five-currency finance dashboard that forecasts the balance 30 days ahead with a least-squares trend line written from scratch. | [Repo](https://github.com/adityatiwari9t8/expense-insight-pro) |

## What's in the site

- **Editorial hero.** My name in large condensed two-tone type over a dotted 3D wave drawn on a `<canvas>` (concentric rings displaced by travelling sine waves, perspective-projected, ~10k points batched by opacity). The wave follows the theme, leans gently toward the mouse, pauses off screen and holds still for reduced motion.
- **Embedded live demos.** Each project opens in a browser-style overlay without leaving the page.
- **Case-study pages** on a tiny hash router (`#/work/<id>`): links are shareable and the Back button closes the page.
- **Keyboard command menu (⌘K / Ctrl+K).** Jump to any section, open a demo or case study, copy the email, open the resume or switch theme.
- **Built for phones too.** A separate small-screen layout (left-aligned headings, tighter spacing, compact hero), a dropdown menu card instead of a full-screen menu, and a contact sheet that slides up from the bottom. The desktop layout is untouched by any of it.
- **Restrained motion.** Scroll reveals, a gentle hover tilt on project cards, cursor-lit borders, and View Transitions for the theme switch and case-study pages. Touch screens get still cards, and everything switches off for visitors who prefer reduced motion.
- **Dark by default, with a light toggle.** The choice is remembered in `localStorage`, and the About portrait has a version toned for each theme.
- **No backend.** The contact form (name, email, message) opens the visitor's email app with everything filled in, offers to copy the message if no app opens, and lists email and LinkedIn for anyone who would rather skip the form.
- **Fonts are bundled** (Roboto Condensed for display, Roboto Mono for labels, Inter for body text), so the site makes no Google Fonts request and looks the same everywhere.
- **Optional visitor analytics.** Cookie-less and off by default (see [Deploying](#deploying)).

## Run it locally

```bash
git clone https://github.com/adityatiwari9t8/portfolio-website.git
cd portfolio-website
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check, then production build into dist/
npm run preview    # serve the production build locally
```

Needs Node 18 or newer.

## How it's organised

```text
src/
├── App.tsx              page layout and section order
├── data/
│   ├── site.ts          name, email, social links, status line, nav order
│   ├── content.ts       hero, about, photos, education, experience, skills, contact text
│   └── projects.ts      the projects and their case studies
├── components/          page sections and effects (DotWave, Tilt, Reveal, ...)
│   └── demos/           the embedded project demos
└── lib/                 router, theme store, scroll and active-section helpers, cursor light, dialog helper, view transitions
public/                  photos, project screenshots and demo videos, resume, social preview image
resume/                  source of the resume PDF
```

All copy and links live in `src/data/`, so updating the site rarely means touching a component.

| To change… | Edit |
| --- | --- |
| Name, email, social links, status line | `src/data/site.ts` |
| Hero, about, education, experience, certificates, skills | `src/data/content.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Resume | `resume/resume.html`, then save it as `public/resume.pdf` (see below) |

### Adding experience, certificates or skills

Every list in `src/data/content.ts` can grow without touching a component:

- **Experience:** add an object to `EXPERIENCE`, newest first. The first three show; the rest sit behind a "Show all" button.
- **Certificates:** add an object to `CERTIFICATIONS`. Give it a `url` (opens in a new tab) or an `image` in `public/certificates/` (opens in a viewer on the page). The first six show; the rest fold away.
- **Skills:** add to any group in `TOOLKIT`, or add a whole new group (`{ label: 'Cloud', items: [...] }`). CS fundamentals live in `EDUCATION.coursework` and show in the education card.
- **Hero text:** `HERO` (role, focus line, the one-line motto and the short intro). The name and status line come from `SITE`, and the section order in the nav comes from `NAV`, both in `src/data/site.ts`.
- **About photos:** `STORY_PHOTOS`. A photo can have a `srcDark` version that is shown in dark mode.

### Adding a project

1. Add a light and a dark screenshot to `public/` (WebP, about 960 px wide), and optionally a short MP4 per theme in `public/demo/`.
2. Copy an object in `PROJECTS` in `src/data/projects.ts` and change its fields.
3. Fill in `study` (problem, what was built, what was learned, limits, stack). It becomes the case-study page.
4. Add `repo` and `live` links if they exist. The buttons appear automatically.

### Updating the resume

Edit `resume/resume.html`, then print it to PDF with Chrome (A4, no headers and footers) and save it as `public/resume.pdf`. From the command line:

```bash
google-chrome --headless --no-pdf-header-footer --print-to-pdf=public/resume.pdf resume/resume.html
```

On macOS, use `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` in place of `google-chrome`.

## Deploying

The site is a plain Vite app, so Vercel needs no extra settings: import the repo, keep the framework preset on **Vite**, and every push to `main` redeploys.

- **Site address.** On Vercel the address is picked up at build time (canonical link, sitemap, absolute preview-image URLs). Anywhere else, set `SITE_URL=https://your-domain.com` before `npm run build`.
- **Analytics (optional).** Enable **Analytics** in the Vercel project, add the environment variable `VITE_ANALYTICS=1` and redeploy.

## Contact

**adityatiwari.connect@gmail.com** · [LinkedIn](https://www.linkedin.com/in/adityatiwari9t8)

Open to software engineering internships and second-year or early-career intern programs, on backend or full-stack teams. Remote, hybrid or on-site, anywhere.
