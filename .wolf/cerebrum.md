---
description: learned preferences, project conventions, and Do-Not-Repeat rules
budget_tokens: 2000
---
# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-10-06

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->
- [2026-10-12] Keep video/demo assets and their tooling out of this git repo; they belong in `../fitelle-video`.
- [2026-10-12] Demo video: mobile (1080×1920) only — user does not want a desktop/landscape cut.
- [2026-10-12] Demo video imagery: real photographs (sourced online, free licence), never hand-drawn/SVG stand-ins for garments.
- [2026-10-12] Demo video must show the app's actual screens (e.g. the real public portfolio page layout), not invented layouts.

## Key Learnings

- **Project:** fitelle
- **Description:** This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-sc

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-10-12] Remotion CLI renders hang with the default chrome-headless-shell on this machine; keep `Config.setChromeMode("chrome-for-testing")` in `../fitelle-video/remotion.config.ts`.
- [2026-10-12] User saw the video "flashing/glistening". Avoid in video/: animated blur filters, continuously drifting/scaling/tilted text layers, moving blurred gradient blobs, and JPEG frame capture (use PNG). Devices settle then hold still.
- [2026-10-12] Don't pipe `npx skills add ...` through `head` — truncating output kills the installer before it writes files.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-10-12] Product demo video lives OUTSIDE this repo at `../fitelle-video` (moved 2026-10-12: user does not want video work pushed to GitHub; Remotion skills and .mcp.json moved there too) as a standalone Remotion project (own package.json, React) so it never touches the Vue app's deps or build. Single composition `FitelleDemoMobile` (1080×1920; the landscape cut was dropped at the user's request); scenes in `src/scenes/`, mock content in `src/data.ts`. Photos are Unsplash images in `public/photos` (ids in SOURCES.md there).
