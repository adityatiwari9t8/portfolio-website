# Portfolio design direction

A minimal, product-focused portfolio for Aditya Tiwari. The user preferred the earlier clean design over the serif editorial experiment. Keep the direction restrained and contemporary.

## Reference

The Apple spec in design-md-library is the primary reference: neutral surfaces, confident sans-serif typography, clear hierarchy, quiet navigation, and space around real product imagery. This is an independent interpretation for a personal engineering portfolio.

## Visual system

- White canvas `#ffffff`; alternating sections `#f5f5f7`.
- Primary text `#1d1d1f`; secondary text `#646469`; hairlines `#e0e0e0`.
- Action blue `#0066cc`; focus blue `#0071e3`. Use color sparingly for interactions.
- Dark mode: black canvas, `#121214` sections, `#1d1d1f` surfaces, `#f5f5f7` text, and `#2997ff` links.
- Native system sans-serif with self-hosted Inter fallback. Headings use weight 600; body uses 400. No display serif or italic headlines.
- The hero uses a wide, left-aligned headline, scaling from 30px on small phones to 92px on desktop. Section headings are 34–44px. Body copy uses 17px with generous leading.
- Content width is 1120px. Section spacing is 96px on desktop, 80px on tablets, and 64px on phones. Mobile gutters are 20px.
- Actions use quiet 8px utility shapes with minimum 44px targets. Primary actions use ink; supporting links remain restrained. Project cards use 16px corners and portraits use 18px corners; inline project imagery uses 8px corners.
- No decorative gradients, floating widgets, cursor effects, noisy backgrounds, or shadows on interface chrome. Only project imagery receives soft elevation.

## Composition

1. A role-first introduction: “Software engineering. From first principles.” A broad, left-aligned headline sits above a concise introduction and work/résumé actions. Availability stays understated. Keep the hero free of portraits, puzzle widgets, and decorative illustrations.
2. Selected projects: one substantial featured entry followed by an expandable gallery of supporting entries. Supporting entries lead with the product image. Show real product screenshots, short descriptions, case-study links, live demos, and source code.
3. Current work: a clearly labelled in-progress backend project.
4. About: a dark section with a real portrait and a specific account of how Aditya learns.
5. Background: education, experience, and tools presented as readable lists. Certificates expand on demand.
6. Contact: a split layout pairs a confident invitation with a clear internship request, email, and résumé.

Do not put the rejected Sudoku field-note panel or another interactive illustration in the homepage hero. Interactive demos stay inside project experiences. Avoid numbered editorial labels and extra philosophy blocks.

## Writing

Write clearly in the first person. Explain what a project does before its implementation. Keep actual decisions, observations, and limitations in the case studies. Never invent clients, user numbers, benchmark results, or experience. Label unfinished work. Avoid inflated claims and generic skill percentages.

The current demo projects are an interim collection. General homepage copy must not depend on their count, topics, or demo availability. Keep project-specific claims within the corresponding entries. Do not describe planned end-to-end projects as completed, or call the current work placeholders in public-facing copy.

## Behavior

Support small phones, tablets, desktop, and both themes. Respect reduced motion. Preserve visible keyboard focus, semantic headings, descriptive links, dialog focus management, and Escape dismissal. Demos and case studies remain independently usable.
