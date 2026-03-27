<!-- Improved README: clearer UI, TOC, badges, and quick-start -->
# Portfolio — Personal Website

[![Built with Vite](https://img.shields.io/badge/built%20with-Vite-blue?logo=vite)](https://vitejs.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue?logo=typescript)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A lightweight, responsive portfolio built with React, TypeScript and Vite. It showcases projects, demos, skills, and contact information using modular components and small demo apps.

![Screenshot placeholder](public/screenshot.png)

## Table of contents

- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project layout](#project-layout)
- [Demos](#demos)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Quick start

Prerequisites: Node.js 16+ and npm (or pnpm/yarn).

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Build for production:

```bash
npm run build
npm run preview
```

The production-ready files will be in the `dist/` directory after `npm run build`.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run preview` — locally preview the built site

## Project layout

- [App.tsx](App.tsx) — root application component
- [index.tsx](index.tsx) — entry + Vite bootstrap
- [vite.config.ts](vite.config.ts) — Vite configuration
- [tsconfig.json](tsconfig.json) — TypeScript settings
- [metadata.json](metadata.json) — site metadata (used for content/SEO)
- [components/](components/) — UI sections and page components
  - [Hero.tsx](components/Hero.tsx)
  - [Navbar.tsx](components/Navbar.tsx)
  - [Portfolio.tsx](components/Portfolio.tsx)
  - [Contact.tsx](components/Contact.tsx)
  - [demos/](components/demos/) — interactive project demos (self-contained folders)
- [types.ts](types.ts) — shared TypeScript types
- [constants.tsx](constants.tsx) — shared constants

## Demos

Open `components/demos/` to explore small interactive demos included in the portfolio (e.g., Sudoku visualizer, ExpensePro). Each demo folder contains its own `README` or comments for demo-specific instructions.

## Deployment

This site is a static site after building. Recommended hosting options:

- Vercel: set the build command to `npm run build` and the output directory to `dist`.
- Netlify: same `npm run build`, publish directory `dist`.

For GitHub Pages, use a CI step to build and publish `dist/` to `gh-pages`.


