# Portfolio Website

A personal portfolio website built with React, TypeScript and Vite. This repository contains the source for a fast, responsive portfolio that highlights projects, experience, and contact information.

## Demo

- Local: run the dev server (see Getting Started).
- Deployable to Vercel / Netlify / any static host.

## Features

- Clean, responsive UI showcasing projects and skills.
- Modular React components under `components/`.
- Small, fast Vite-powered development workflow.

## Tech Stack

- React + TypeScript
- Vite
- Plain CSS

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or pnpm/yarn)

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Open http://localhost:5173 (or the address printed by Vite) to view the site.

### Build (production)

```bash
npm run build
npm run preview
```

This produces a static build in `dist/` which you can deploy to any static hosting provider.

## Project Structure

- [App.tsx](App.tsx) — Top-level app component.
- [index.tsx](index.tsx) — App entry + Vite bootstrapping.
- [vite.config.ts](vite.config.ts) — Vite configuration.
- [tsconfig.json](tsconfig.json) — TypeScript settings.
- [metadata.json](metadata.json) — Site metadata (used for content/SEO).
- [components/](components/) — UI components and page sections:
  - [Hero.tsx](components/Hero.tsx)
  - [Navbar.tsx](components/Navbar.tsx)
  - [Portfolio.tsx](components/Portfolio.tsx)
  - [Contact.tsx](components/Contact.tsx)
  - [demos/](components/demos/) — interactive project demos (each demo has its own folder).

## Development Notes

- Types are in [types.ts](types.ts); shared constants live in `constants.tsx`.
- Demos are self-contained under `components/demos/` (see each demo's `README`-style files inside for demo-specific instructions).

## Deployment

This is a static site after building. Recommended hosts:

- Vercel: connect the repository, set the build command to `npm run build` and the output directory to `dist`.
- Netlify: same build command and publish directory.


