<div align="center">

# Aditya Tiwari — Portfolio

**Computer Science student at IILM University, looking for a software or web-development internship.**

Three projects, each with a live demo you can open right inside the page, and a case study explaining the thinking behind it.

[**Live site**](https://portfolio-website-pi-lac.vercel.app) · [GitHub](https://github.com/adityatiwari9t8) · [LinkedIn](https://www.linkedin.com/in/adityatiwari9t8) · [LeetCode](https://leetcode.com/Aditya_Tiwari_98/)

![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## The projects

Every project has a working demo embedded in the site, plus a case study (problem, what was built, trade-offs, stack) at `#/work/<id>`.

| | Project | What it does | Code |
| --- | --- | --- | --- |
| <img src="public/academic-dark.webp" width="220" alt="Academic Path Intelligence"> | **Academic Path Intelligence** | Pick the skills you want to learn and it maps their prerequisites into a personalised learning roadmap. | [Repo](https://github.com/adityatiwari9t8/academic-path-intelligence) |
| <img src="public/expense-dark.webp" width="220" alt="Expense Insight Pro"> | **Expense Insight Pro** | A multi-currency expense dashboard with a 30-day balance forecast that moves as you add transactions. | [Repo](https://github.com/adityatiwari9t8/expense-insight-pro) |
| <img src="public/sudoku-dark.webp" width="220" alt="Sudoku Algorithm Visualizer"> | **Sudoku Algorithm Visualizer** | Watch DFS, BFS, greedy and MRV solve the same board, then compare steps, backtracks and time. | [Repo](https://github.com/adityatiwari9t8/sudoku-algorithm-visualizer) |

## What's in the site

- **Embedded live demos.** Each project opens in a browser-style overlay without leaving the page.
- **Case-study pages** on a tiny hash router (`#/work/<id>`): links are shareable and the Back button closes the page.
- **Interaction, in plain CSS and a little JavaScript.** Pointer-driven 3D tilt on cards, cursor-lit borders, scroll-linked section lift, word-by-word headline reveals and View Transitions between pages. On touch devices the same effects follow scrolling instead of the pointer. All of it switches off for visitors who prefer reduced motion.
- **Dark by default, with a light toggle.**
- **No backend.** The contact button opens the visitor's email app, and there is a copy-email button for people without one.
- **Fonts are bundled** (Inter and Instrument Serif), so the site makes no Google Fonts request and looks the same everywhere.
- **Optional visitor analytics.** Cookie-less and off by default (see below).

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
│   ├── site.ts          name, email, social links, status badge
│   ├── content.ts       hero, story, education, experience, skills, call-to-action text
│   └── projects.ts      the projects and their case studies
├── components/          sections, effects (Tilt, SectionLift, Reveal, ...)
│   └── demos/           the three embedded project demos
└── lib/                 router, scroll bus, cursor light, dialog helper
public/                  photos, project screenshots and demo videos, resume, social preview
resume/                  source of the resume PDF
```

All copy and links live in `src/data/`, so updating the site rarely means touching a component.

| To change… | Edit |
| --- | --- |
| Name, email, social links | `src/data/site.ts` |
| Hero, story, education, experience, certifications, skills | `src/data/content.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Photo | `public/img.webp` |
| Resume | edit `resume/resume.html`, open it in Chrome, Print → Save as PDF (A4, no headers) to `public/resume.pdf` |

### Adding experience, certificates or skills

Every list in `src/data/content.ts` can grow without touching a component:

- **Experience:** add an object to `EXPERIENCE`, newest first. The first three show; the rest sit behind a "Show all" button.
- **Certificates:** add an object to `CERTIFICATIONS`. Give it a `url` (opens in a new tab) or an `image` in `public/certificates/` (opens in a viewer on the page). The first six show; the rest fold away.
- **Skills:** add to any group in `TOOLKIT`, or add a whole new group (`{ label: 'Tools', items: [...] }`). Skills that appear in a project's `stack` get a green dot automatically.
- **Quick facts under the hero:** the project count and latest role update themselves from `PROJECTS` and `EXPERIENCE`.

### Adding a project

1. Add a light and a dark screenshot to `public/` (WebP, about 960 px wide).
2. Copy an object in `PROJECTS` in `src/data/projects.ts` and change its fields.
3. Fill in `study` (problem, what was built, what was learned, stack). It becomes the case-study page.
4. Add `repo` and `live` links if they exist. The buttons appear automatically.

## Deploying

The site is a plain Vite app, so Vercel needs no extra settings: import the repo, keep the framework preset on **Vite**, and every push to `main` redeploys.

- **Site address.** On Vercel the address is picked up at build time (canonical link, sitemap, absolute preview URLs). Anywhere else, set `SITE_URL=https://your-domain.com` before `npm run build`.
- **Analytics (optional).** Enable **Analytics** in the Vercel project, add the environment variable `VITE_ANALYTICS=1` and redeploy.

## Contact

**adityatiwari.connect@gmail.com** — I'm open to software and web-development internships (remote, hybrid or on-site, anywhere) and to team projects.


