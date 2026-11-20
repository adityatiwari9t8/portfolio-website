# Aditya’s engineering portfolio

A recruiter should be able to inspect a project, try it, and find Aditya’s reasoning without leaving the page. Keep the visual identity independent of any particular project. Use the Apple reference from the design-md-library for typography and surfaces, and the nine passes from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0) to simplify the presentation.

| Pass | Decision |
| --- | --- |
| Spacing | Align the sections on shared page rails. Give each section a clear boundary and keep its actions close to the related content. |
| Color | Silver-tinted surfaces (#edf0ef) and slate actions (#253745) in light mode. Dark mode layers slate gradients over deep navy (#06141b) with silver accents (#9ba8ab, #ccd0cf). Each page load starts in light mode. Manual theme switches spread outward from the toggle. With reduced motion enabled, the theme changes immediately. |
| Icons | Use small, consistent line icons next to words. Give icon-only controls accessible names. |
| Copy | Describe what each experiment does and distinguish simulated timing from measured comparisons. Keep project limits visible in the detail panel. |
| Type | System display headings and system sans serif for controls and reading text. Use size and weight to separate headings from supporting information. |
| Layout | Center the desktop navigation independently of the brand. Start Selected work below the full-screen hero. Use page scroll to move through projects between angled previews. Use the same scroll-driven project sequence for all visitors. |
| Details | Use high-visibility focus states and short press feedback. Keep contact, résumé, and chatbot reachable from the main page. |
| Visuals | Show the actual interfaces in both themes. New projects supply their own screenshots and descriptions in src/data/projects.ts. |
| Motion | Give the hero's lettering and soft lighting a slight response to the pointer on desktop. Tie the perspective of headings, the portrait, background panels, and certifications to their viewport position so each element retraces its entrance as visitors scroll up. The project deck turns as visitors scroll, and the contact section is static. |

The full-screen landing page centers the name in a single line of silver type on desktop and two lines on phones. Solid text, shallow shadows, and generous line height give it depth while preserving the letter shapes. A short divider separates the name from internship availability. The project and résumé links sit side by side on desktop and stack on phones, with a filled primary button and an outlined résumé button. Soft lighting spreads across the navy or silver backdrop. Selected Work follows on the next screen.

The archived clips in `public/motion` are edited from [A Close-Up Video of a Circuit Board Components](https://www.pexels.com/video/a-close-up-video-of-a-circuit-board-components-2376982/) by Video Kickstarter on Pexels.
