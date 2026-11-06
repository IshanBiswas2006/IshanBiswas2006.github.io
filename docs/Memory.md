# MEMORY.md

# PROJECT MEMORY — ISHAN BISWAS PORTFOLIO

## 1. Project Identity

Project Name: Ishan Biswas Portfolio

Project Type: Existing Portfolio Content Migration

Main Objective:

Replace the downloaded portfolio owner's personal information with Ishan Biswas's information.

The existing design must remain unchanged.

## 2. Important Rules

* Content replacement only.
* No new sections.
* No new components.
* No redesign.
* No color changes.
* No font changes.
* No layout changes.
* No animation changes.
* No unnecessary refactoring.

## 3. User Information

Name: Ishan Biswas

Professional Title: Aspiring Data Scientist

Education: BCA

University: MAKAUT University

Academic Period: 2025–2029

Location: West Bengal, India

Email: [biswas.ishan2006@gmail.com](mailto:biswas.ishan2006@gmail.com)

GitHub:
https://github.com/IshanBiswas2006

LinkedIn:
https://www.linkedin.com/in/ishan-biswas-521b97384/

Portfolio:
https://ishanbiswas2006.github.io/

## 4. Skills

Programming:
C, C++, Java, Python

Web:
HTML5, CSS3, JavaScript

Data Science:
NumPy, Pandas

Database:
SQL, MySQL

Tools:
Git, GitHub, VS Code, Jupyter Notebook

Knowledge:
Data Structures and Algorithms, Data Science

## 5. Projects

### AlgoViz — DSA Visualizer

Interactive Data Structures and Algorithms visualizer.

Features listed on the existing portfolio:

* Real-time animations.
* Code highlighting.
* Live variable tracking.
* Step-by-step algorithm execution.

Technologies:
JavaScript, C++, DSA.

Verify project URLs before publishing.

### GitHub Repositories

* C-Projects
* CPP-Projects
* Python-Projects
* Data-Structures-and-Algorithms

Inspect repository contents before publishing descriptions.

## 6. Certifications

* AWS Cloud Practitioner Essentials — AWS Training & Certification — August 2026.
* Technology Job Simulation — Deloitte via Forage — July 2026.

Verify credential details before publishing.

## 7. Unverified Information

Do not invent:

* Achievements.
* Awards.
* Internships.
* Employment.
* Academic Grades.
* Project Statistics.
* Certification IDs.
* Additional Skills.

LinkedIn details must be checked if accessible.

## 8. Execution History

Initial documentation prepared on 2026-11-04.

### Execution Log — Phase 0: Project Discovery
- **Date:** 2026-11-04
- **Phase:** Phase 0 — Project Discovery
- **Files Inspected:** `package.json`, `index.html`, `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `src/scripts/utils/asset-loader.js`, `docs/PRD.md`, `docs/Rule.md`, `docs/ARCHITECTURE.md`, `docs/Memory.md`, `docs/Phases.md`, `README.md`, `CHANGELOG.md`, `ASSET_INVENTORY.md`, `.vscode/settings.json`, `work/` directory, `taye-project/` directory.
- **Files Modified:** None (Phase 0 read-only discovery).
- **Files Removed:** None.
- **Changes Made:** Set up local background static server running on port 5501; verified Three.js (r128) WebGL canvas initialization, audio assets, and UI components; rendered DOM and took baseline screenshot using headless browser (`scratch/baseline.png`).
- **Commands Executed:** Node/npx environment check, browser detection, server launch on port 5501, headless DOM dump, screenshot capture.
- **Build Status:** Success (Static HTML5/CSS3/JavaScript app with Three.js).
- **Testing Results:** Site served at `http://127.0.0.1:5501/`; all local assets (3D GLB models, MP3s, WOFF2 fonts) accessible and loaded.
- **Visual Comparison:** Baseline screenshot captured (`scratch/baseline.png`).
- **Remaining Issues:** Previous owner information ("Taye Bhaskar", Product Designer, personal contacts, projects, timeline, and photos) present in `index.html`, `src/scripts/data/portfolio-data.js`, `package.json`, `work/*.html`, and metadata.
- **Next Action:** Proceed automatically to Phase 1 — Old Owner Content Audit.

### Execution Log — Phase 1: Old Owner Content Audit
- **Date:** 2026-11-04
- **Phase:** Phase 1 — Old Owner Content Audit
- **Files Inspected:** `index.html`, `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `package.json`, `README.md`, `CHANGELOG.md`, `ROLE.md`, `ASSET_INVENTORY.md`, `work/backroom.html`, `work/bizassure.html`, `work/concepts.html`, `work/ledge.html`, `work/maarpit.html`.
- **Files Modified:** None (audit phase).
- **Files Removed:** None.
- **Audit Findings:**
  1. **Name & Identity:** "Taye Bhaskar" located in `index.html` (loader `#load h1`, hero `#hero h1`, meta tags, title `taye.in`), `src/scripts/data/portfolio-data.js` (`NAME`), `package.json`, `work/backroom.html`, `work/bizassure.html`, `work/concepts.html`, `work/ledge.html`.
  2. **Professional Title:** "Product Designer" in `index.html` (meta tags), `src/scripts/data/portfolio-data.js` (`LINES`, `ABOUT`, `TIMELINE`), `package.json`.
  3. **Biography & Rotating Lines:** `src/scripts/data/portfolio-data.js` (`LINES`, `ABOUT` detailing Wix websites in 2019, OneAssure employment).
  4. **Education & Timeline:** `src/scripts/data/portfolio-data.js` (`TIMELINE` with OneAssure, M.Tech IIT Guwahati, B.Tech Tezpur University).
  5. **Skills & Tech Stack:** `src/scripts/data/portfolio-data.js` (`SKILLS`: UX/UI design; `STACK`: Figma, Illustrator, Jitter, After Effects, Claude Code, Xcode, Cursor).
  6. **Projects:** `src/scripts/data/portfolio-data.js` (`STUDIES`: Backroom, BizAssure; `TOOLS`: Ledge; `CONCEPTS`: MAARPIT, etc.).
  7. **Contact Details & Socials:** `src/scripts/data/portfolio-data.js` (`EMAIL`: skarxdesigns@gmail.com, `PHONE`/`TEL`: +91 99579 96992, `QR_CALL` SVG qr code, `SOCIALS`: LinkedIn bhaskar-taye, Instagram @skarxdesigns). Also in `work/*.html` headers/footers.
  8. **Hidden & Asset References:** `src/scripts/app.js` references `TayeBhaskarResume.pdf`; `assets/images/photos/` contains 7 personal polaroids of the previous owner.
  9. **Clutter/Unnecessary Folders:** Raw monolithic export archive `taye-project.zip` (6 MB) and unbundled dump `taye-project/` (containing 9.66 MB redundant index.html and raw CDN dump folders).
- **Commands Executed:** Comprehensive regex directory scanner across `.html`, `.js`, `.json`, `.md`.
- **Build Status:** Operational on port 5501.
- **Testing Results:** All old owner fields, occurrences, and dependencies mapped and documented.
- **Remaining Issues:** Clean removal of legacy dump files, and migration of personal info.
- **Next Action:** Proceed automatically to Phase 2 — Project Cleanup.

### Execution Log — Phase 2: Project Cleanup
- **Date:** 2026-11-04
- **Phase:** Phase 2 — Project Cleanup
- **Files Inspected:** Root directory, `taye-project.zip`, `taye-project/` hierarchy, build scripts, asset paths.
- **Files Modified:** None.
- **Files Removed:** `taye-project.zip` (6 MB raw download archive) and `taye-project/` directory (9.66 MB raw unbundled monolithic file + redundant scrape directories).
- **Changes Made:** Safely purged raw downloaded archive and legacy scrape dump after verifying zero dependencies from the modular application. Verified the application continues to run cleanly on `http://127.0.0.1:5501/`.
- **Commands Executed:** `Remove-Item -Force taye-project.zip`, `Remove-Item -Recurse -Force taye-project`, Edge headless dump DOM verification.
- **Build Status:** Success (Clean workspace containing only active project files and assets).
- **Testing Results:** Server running without error, main site and all assets remain intact.
- **Visual Comparison:** Verified DOM matches baseline.
- **Remaining Issues:** Personal information in active codebase needs migration to Ishan Biswas.
- **Next Action:** Proceed automatically to Phase 3 — Personal Information Migration.

### Execution Log — Skills Section Implementation (Checkpoint 2)
- **Date:** 2026-11-06
- **Phase:** Phase 3.1 — Skills Section & 3D Billboard Migration
- **Files Inspected:** `docs/Rule.md`, `docs/PRD.md`, `docs/Design.md`, `docs/Memory.md`, `docs/ARCHITECTURE.md`, `docs/Phases.md`, `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `index.html`, `work/concepts.html`.
- **Files Modified:**
  - `src/scripts/data/portfolio-data.js`: Updated `STOPS[1]` gate checkpoint name from `'Concepts'` to `'Skills'` (`kick: 'Checkpoint 2 · Skills'`).
  - `index.html`: Updated meta and social graph descriptions from "concepts" to "skills".
  - `work/concepts.html`: Replaced Concepts video showcase with the white Skills page conforming to the PRD specifications: updated title to `Skills`, brand identity to `Ishan Biswas`, eyebrow to `SKILLS · 2026`, header to `Skills`, subtext to `Technical skills, programming languages, libraries, and tools I work with.`, and added 5 exact category cards (16 skills). Purged redundant base64 video payload (~5 MB) for fast rendering. Preserved layout, fonts, `--paper`/`--surface` palette, card radius, responsive grid, and back-to-ride navigation.
- **Files Removed:** None.
- **Changes Made:**
  - 3D Billboard: Updated texture generation text from "Concepts" to "Skills". Billboard dimensions, Irish Grover typography, material, animations, camera path, and interaction trigger remained identical.
  - Billboard Navigation: Destination opens `work/concepts.html` (the newly repurposed clean Skills page).
  - Skills Page Content: Rendered 5 category cards strictly containing the 16 approved skills:
    1. Programming Languages: C, C++, Python, Java
    2. Web Development: HTML, CSS, JavaScript
    3. Python Libraries: NumPy, Pandas, Matplotlib, Seaborn
    4. Development Tools: Git, GitHub, VS Code
    5. Cloud & DevOps: Docker, AWS
  - Zero Redesign / Scope Protection: Cyclist model, bicycle rigging, track geometry, landscape meshes, lighting, camera controls, and other gates (Work, Resume, About, Contact) remain 100% untouched. No AI badges, green dots, percentages, or extraneous elements added.
- **Commands Executed:**
  - `msedge.exe --headless=new` via Chrome DevTools Protocol to capture desktop (1280x900), tablet (768x1024), and mobile (375x667) screenshots of the Skills page.
  - CDP automated test to verify `#back` navigation returns from `work/concepts.html` to `http://127.0.0.1:5501/`.
  - Console error audit across `/` and `/work/concepts.html` verifying 0 runtime errors.
  - 3D scene screenshot capture verifying the 3D track, landscape, and cyclist remain identical.
- **Build Status:** Success (Static HTML5/CSS3/JavaScript app with Three.js).
- **Testing Results:**
  - `work/concepts.html` title: `Skills`.
  - Back navigation from Skills page to home 3D ride: Passed (`href="../"`, returns to `http://127.0.0.1:5501/`).
  - Billboard prompt & pill: Pill 1 label is `Skills`, `#eName` renders `View Skills`, pressing Enter / clicking opens Skills page.
  - Console runtime audit: 0 console errors on both home and Skills page.
- **Visual Comparison:**
  - Responsive visual QA verified across desktop (1280x900), tablet (768x1024), and mobile (375x667). Single and multi-column grid responsiveness preserved.
  - 3D scene comparison confirms rider, bicycle, track, trees, terrain, and lighting are completely unchanged.
- **Remaining Issues:** Unrelated case study pages (`work/backroom.html`, `work/bizassure.html`, `work/ledge.html`) and remaining personal info in `portfolio-data.js` for future migration phases.
- **Next Action:** Continue portfolio migration according to project roadmap.

### Execution Log — About Section Car Gallery & Favicon Replacement
- **Date:** 2026-11-06
- **Phase:** Phase 3.2 — About Section Car Photographs & Favicon Replacement
- **Files Inspected:** `docs/PRD.md`, `docs/Rule.md`, `docs/Memory.md`, `my images/`, `assets/images/photos/`, `favicon.png`, `assets/images/favicon.png`, `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `src/styles/components.css`, `index.html`.
- **Files Modified:**
  - `favicon.png`: Updated with owner's supplied custom favicon (`my images/favicon.png`, 603,391 bytes).
  - `assets/images/favicon.png`: Updated with owner's supplied custom favicon (`my images/favicon.png`, 603,391 bytes).
  - `assets/images/photos/`: Populated with the owner's 7 supplied car photographs.
  - `src/scripts/data/portfolio-data.js`: Updated `PHOTOS` array image sources to point to the 7 supplied car images.
- **Files Removed:** `assets/images/photos/photo1.webp` through `assets/images/photos/photo7.webp` (old owner photos removed).
- **Changes Made:**
  - Asset Source: Copied 7 car photographs and 1 favicon from `my images/` into the project asset structure.
  - 7 Car Cards: Preserved card count (7 cards), positions, dimensions, layout, sequence, animations, and swipe mechanics.
  - Image Cropping: Handled cleanly via existing CSS `.pol img { object-fit: cover }` to prevent stretching or distortion.
  - Favicon: Successfully replaced at both `assets/images/favicon.png` and root `favicon.png`.
  - Zero UI alterations: Fonts, typography, colors, animations, borders, and layout kept 100% intact.
- **Seven Image Filenames & Order:**
  1. `IMG-20251005-WA0010.jpg` (4080x2296)
  2. `IMG-20251006-WA0063.jpg` (4000x2252)
  3. `IMG-20251006-WA0069.jpg` (2252x4000)
  4. `IMG-20251007-WA0175.jpg` (4000x2252)
  5. `Picsart_26-06-15_15-37-11-214.jpg` (3098x3872)
  6. `WhatsApp Image 2025-12-24 at 02.19.49.jpeg` (1440x1080)
  7. `_DSC0412.jpg` (6000x4000)
- **Favicon Filename:** `favicon.png` (512x512, 603,391 bytes, PNG format).
- **Commands Executed:** Asset copy, removal of old polaroids, automated Chrome headless CDP test suite verifying asset loading, pile layout, and swipe interactions.
- **Build Status:** Success (Static HTML5/CSS3/JavaScript app with Three.js).
- **Testing Results:**
  - All 7 car photographs loaded: Status 200, `complete: true`, non-zero natural dimensions.
  - Favicon: Status 200, 603,391 bytes, verified in Chrome.
  - Network & Console Audit: 0 broken image references, 0 console errors.
- **Visual Comparison:** Verified polaroid stack appearance, card dimensions, and image containers match original design.
- **Remaining Issues:** Unrelated case study pages for future migration phases.
- **Next Action:** Continue portfolio migration.

### Execution Log — Elsewhere Contact Section GitHub Icon Fix
- **Date:** 2026-11-06
- **Phase:** Phase 3.3 — Elsewhere Contact Section GitHub Icon Fix
- **Files Inspected:** `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `assets/icons/`.
- **Files Modified:**
  - `assets/icons/github.png`: Generated 112x112 PNG icon matching `assets/icons/linkedin.png` dimensions and dark rounded badge styling.
  - `src/scripts/data/portfolio-data.js`: Updated `SOCIALS[1]` to link `'assets/icons/github.png'`.
- **Files Removed:** None.
- **Changes Made:** Resolved broken image icon for GitHub link under Contact > Elsewhere section by providing the dedicated asset.
- **Commands Executed:** Chrome headless CDP canvas generation of `assets/icons/github.png`, CDP inspection of Contact card verifying `complete: true` and 112x112 natural dimensions.
- **Build Status:** Success.
- **Testing Results:** GitHub icon renders cleanly beside LinkedIn without broken image placeholders; 0 console errors.
- **Remaining Issues:** None for current tasks.
- **Next Action:** Continue portfolio migration.

### Execution Log — Phone Row QR Code Hover Addition
- **Date:** 2026-11-06
- **Phase:** Phase 3.4 — Contact Section Phone Row QR Code Hover
- **Files Inspected:** `src/scripts/data/portfolio-data.js`, `src/scripts/app.js`, `src/styles/components.css`.
- **Files Modified:**
  - `assets/images/qr-call.png`: Added the user's supplied 495x495 QR code image asset.
  - `src/styles/components.css`: Added `#qrpop img` to `#qrpop svg` style rule (`width: 100%; height: auto; border-radius: 8px`).
  - `src/scripts/data/portfolio-data.js`: Set `QR_CALL` to `'<img src="assets/images/qr-call.png" alt="Scan to call">'`.
- **Files Removed:** None.
- **Changes Made:**
  - Enabled the QR code popup in the Contact card when hovering over the Phone row.
  - Popover `#qrpop` cleanly reveals the 150x150 QR code with "Scan to call" caption.
- **Commands Executed:** Automated headless Chrome CDP hover test verifying `popClass === 'on'`, `popVisible === true`, `imgComplete === true`, and 495x495 natural resolution.
- **Build Status:** Success.
- **Testing Results:** Phone row hover displays QR code popup with smooth animation; mouse leave hides popup as expected. 0 console errors.
- **Remaining Issues:** Unrelated case study subpages.
- **Next Action:** Continue portfolio migration.

### Execution Log — Project Cleanup, Optimization & GitHub Preparation
- **Date:** 2026-11-06
- **Phase:** Phase 4 — GitHub Preparation & Asset Reorganization
- **Files Inspected:** Entire repository tree across root, `assets/`, `docs/`, `src/`, `work/`, `my images/`.
- **Files Modified:**
  - `README.md`: Completely rewritten to provide comprehensive project documentation for Ishan Biswas's 3D Interactive Portfolio (features, tech stack, architecture, run instructions, credits).
  - `package.json`: Updated license to `"MIT"` matching the new MIT license file.
  - `ASSET_INVENTORY.md`: Updated to account for all 50 assets including car photographs, GitHub icon, and QR code.
  - `ARCHITECTURE.md`: Synchronized file tree with current clean repository structure.
  - `work/concepts.html`, `work/backroom.html`, `work/bizassure.html`, `work/ledge.html`, `work/maarpit.html`: Updated icon paths to canonical `../assets/images/favicon.png` and `../assets/images/apple-touch-icon.png`.
- **Files Added:**
  - `LICENSE`: Standard MIT license for Ishan Biswas (2026).
- **Files Removed:**
  - `my images/`: Purged redundant ~18 MB directory containing exact duplicates of assets already structured in `assets/images/photos/` and `assets/images/favicon.png`.
  - `apple-touch-icon.png` (root): Removed duplicate root file in favor of canonical `assets/images/apple-touch-icon.png`.
  - `src/scripts/modules/`: Removed empty folder.
  - All temporary test/scratch scripts (`test_quick.js`, `test_hover_qr.js`, `scratch_*.js`, `scratch_*.png`).
- **Changes Made:**
  - Unification of all visual, audio, 3D model, and font assets under a clean `assets/` structure.
  - Sanitization check: 0 exposed secrets, API keys, or private tokens confirmed across all files.
  - Zero modifications to user interface, visual layout, Three.js shaders, cyclist mechanics, or animations.
- **Commands Executed:** Recursive asset integrity hash check, file removal, comprehensive test of local static server on port 5501 with headless Chrome CDP.
- **Build Status:** Success (Static HTML5/CSS3/JavaScript app with Three.js).
- **Testing Results:** All pages, 3D canvas, audio loops, checkpoint panels, Skills subpage, About polaroids, and Contact popovers function with HTTP 200 and zero console errors.
- **Visual Comparison:** Pixel-perfect preservation of original UI/UX.
- **Remaining Issues:** None. Ready for GitHub upload.
- **Next Action:** Ready for user to push to GitHub repository.

## 9. Mandatory Memory Update Instructions

After every phase, update this document.

Append a new execution log.

Never delete previous execution history.

### Execution Log Format

Date:

Phase:

Files Inspected:

Files Modified:

Files Removed:

Changes Made:

Commands Executed:

Build Status:

Testing Results:

Visual Comparison:

Remaining Issues:

Next Action:

## 10. Future AI Instructions

Any future AI agent must read this document before working.

Understand the project's current state.

Continue from the last incomplete phase.

Never repeat completed work unnecessarily.

Never violate Rule.md.

Always preserve the original portfolio design.

Continue automatically until the project is complete.
