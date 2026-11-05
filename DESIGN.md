# Aditya’s engineering portfolio

A recruiter should be able to inspect a project, try it, and find Aditya’s reasoning without leaving the page. Keep the visual identity independent of any particular project. Use the Apple reference from the design-md-library for typography and surfaces, and the nine passes from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0) to simplify the presentation.

| Pass | Decision |
| --- | --- |
| Spacing | Give sections generous margins; keep controls, labels, and their content close together. |
| Color | Porcelain (#f8f9f6) and midnight (#151a17) surfaces, charcoal text (#202522), and pine green (#236448) for actions. Light is the initial theme; restore an explicit choice before paint. |
| Icons | Use small, consistent line icons next to words. Give icon-only controls accessible names. |
| Copy | Describe what each experiment does and distinguish simulated timing from measured comparisons. Keep project limits visible in the detail panel. |
| Type | System display headings and system sans serif for controls and reading text. Use size and weight to separate headings from supporting information. |
| Layout | Center the desktop navigation independently of the brand. Show every project as a calendar leaf that hinges around a fixed top edge with scroll. The list view includes every project and is the default for reduced motion. Derive filters from the catalogue and offer search and progressive loading once it exceeds six entries. |
| Details | Use high-visibility focus states and short press feedback. Keep contact, résumé, and chatbot reachable from the main page. |
| Visuals | Show the actual interfaces in both themes. New projects supply their own screenshots and descriptions in src/data/projects.ts. |
| Motion | Give mouse-driven previews up to two degrees of tilt. Let disclosures and dialogs arrive from a shallow angle. Touch and keyboard users can open everything directly. Honor reduced motion. |

The landing film is a locally optimized edit of [A Close-Up Video of a Circuit Board Components](https://www.pexels.com/video/a-close-up-video-of-a-circuit-board-components-2376982/) by Video Kickstarter on Pexels. The project motion takes inspiration from [Calendar flip by Olivier Blanchette](https://dribbble.com/shots/3351538-Calendar-flip). Serve the locally optimized portrait or landscape clip, pause offscreen, and keep a still frame for visitors with reduced motion. The interaction styles live in src/studio.css; src/components/studio/ProjectPreview.tsx translates pointer position into preview rotation. The playground’s request and sorting animations explain their respective algorithms and run on demand.
