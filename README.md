# Aditya Tiwari | Main portfolio (companies, recruiters, GitHub)

The version to share with companies and recruiters.
React + TypeScript + Vite + Tailwind. Layout inspired by the "Portfolio For Designers" shot on Dribbble.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Where things live

| Want to change...                         | Edit this file                 |
| ----------------------------------------- | ------------------------------ |
| Name, email, social links, status badge   | `src/data/site.ts`             |
| Hero text, "looking for" line, story, education, tools, "right now" list | `src/data/content.ts` |
| Story polaroids (add a second real photo) | `STORY_PHOTOS` in `content.ts` |
| Projects and their case studies           | `src/data/projects.ts`         |
| Photo / resume                            | `public/img.webp`, `public/resume.pdf` |

## Add a new project

1. Put a light and a dark screenshot in `public/` (WebP, about 960 px wide keeps the page fast).
2. Open `src/data/projects.ts`, copy one object in `PROJECTS`, change the fields.
3. Fill in `study` (problem, what you built, what you learned, stack). It becomes the case-study page at `#/work/<id>`.
4. Add `repo` (GitHub link) and `live` (deployed URL) if you have them. The "Source" and "Live site" buttons appear automatically.

Only write what is true and what you can explain in an interview. No invented numbers.

The **Work** section (and its nav link) is hidden while `PROJECTS` is empty and appears automatically with the first project.

## The planned projects

`docs/PROJECTS.md` is the full build specification. The plan is three portfolio projects, built in this order: **SeatLock** (a concurrency-safe ticket-booking platform, released in stages), **TinyTensor** (a deep-learning library from scratch) and **CiteRAG** (retrieval-augmented Q&A with a rigorous evaluation harness).
Two more (a group-expenses app and a C++ Redis-compatible server) are documented there as optional later work. Every project is built in its full version, including extras, not just a first release.
The spec covers scope, architecture, phases, tests, deployment, interview questions, the `projects.ts` entry for each project, and a GitHub and launch checklist.
Each project is added here only when it is finished, using the handoff folder it produces (`docs/handoff/<project-id>/`) and the prompts in the portfolio-site kit.
`CLAUDE.md` holds the working rules for Claude Code in this repository.

## Address, sharing preview and search

- Favicon and the LinkedIn / WhatsApp preview image (`public/og.jpg`, 1200x630) are included.
- On Vercel the site address is picked up automatically at build time (canonical link, sitemap, absolute preview URLs).
  Anywhere else, set `SITE_URL=https://your-domain.com` before `npm run build`.
- `public/404.html` is the page shown for unknown addresses on Vercel.

## Visitor analytics (optional)

Privacy-friendly and cookie-less. It is off by default so nothing breaks. To switch it on: open the Vercel project,
enable **Analytics**, then add the environment variable `VITE_ANALYTICS=1` and redeploy.

## Fonts

Inter and Instrument Serif are bundled with the site (no Google Fonts request), so it renders the same everywhere.

## Contact form

There is no backend. "Compose email" opens the visitor's email app addressed to the email in `src/data/site.ts`,
and there is a "copy email" button for people without a mail app.

## Before you deploy: confirm these are true for you

- `HERO.lookingFor` in `content.ts` (role type and location).
- `NOW` in `content.ts` ("Right now" list).
- The email in `site.ts` (currently adityatiwari.connect@gmail.com).
- Replace the second Polaroid (a project screenshot) with a real photo if you have one.

## Deploy

Push this folder to its own GitHub repo and import it in Vercel (framework: Vite). No extra settings.
