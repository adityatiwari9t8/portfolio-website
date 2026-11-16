# Aditya’s engineering portfolio

A recruiter should be able to inspect a project, try it, and find Aditya’s reasoning without leaving the page. Keep the visual identity independent of any particular project. Use the Apple reference from the design-md-library for typography and surfaces, and the nine passes from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0) to simplify the presentation.

| Pass | Decision |
| --- | --- |
| Spacing | Align the sections on shared page rails. Give each section a clear boundary and keep its actions close to the related content. |
| Color | Mist white (#f6f3f9) and plum actions (#6a3b8b) in light mode. Deep plum (#1c1224) and soft lavender actions (#dcbaf4) in dark mode. Use the active theme across the full page and apply the visitor’s saved preference before it paints. |
| Icons | Use small, consistent line icons next to words. Give icon-only controls accessible names. |
| Copy | Describe what each experiment does and distinguish simulated timing from measured comparisons. Keep project limits visible in the detail panel. |
| Type | System display headings and system sans serif for controls and reading text. Use size and weight to separate headings from supporting information. |
| Layout | Center the desktop navigation independently of the brand. Start Selected work below the full-screen hero. Use page scroll to move through projects between angled previews. Use the same scroll-driven project sequence for all visitors. |
| Details | Use high-visibility focus states and short press feedback. Keep contact, résumé, and chatbot reachable from the main page. |
| Visuals | Show the actual interfaces in both themes. New projects supply their own screenshots and descriptions in src/data/projects.ts. |
| Motion | Reveal headings and content as they enter the viewport, with a shallow tilt for cards and the playground grid. Move the project previews with native scrolling. Touch and keyboard users can open each case study directly. |

The landing page draws lavender contours across the full viewport. The field drifts while visible and responds to pointer position and native scrolling. With reduced motion enabled, the field responds to input and otherwise holds still. The phone layout places the hero copy over a fade into the page background. The 3D showcase tracks native page scroll. The project screens sit directly on the page surface. The pathfinding playground lets visitors edit a grid and compare the cells explored by A* and breadth-first search.

The archived clips in `public/motion` are edited from [A Close-Up Video of a Circuit Board Components](https://www.pexels.com/video/a-close-up-video-of-a-circuit-board-components-2376982/) by Video Kickstarter on Pexels.
