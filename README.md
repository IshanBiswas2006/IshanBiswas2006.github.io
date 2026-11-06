<div align="center">

# Ishan Biswas — 3D Interactive Portfolio

**Ride a bicycle around a 3D stadium to explore my work, skills, resume, story and contact details.**

[![Live Site](https://img.shields.io/badge/Live-ishanbiswas2006.github.io-blue?style=for-the-badge)](https://ishanbiswas2006.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-990000?logo=webgl&logoColor=white)

</div>

---

## About

A gamified portfolio for **Ishan Biswas**, an aspiring Data Scientist and BCA student at MAKAUT University (2025–2029). Instead of scrolling a page, visitors pedal a cyclist along a 3D track. Each checkpoint on the track opens a section of the portfolio:

| Checkpoint | What you get |
|---|---|
| **Work** | Project cards linking to individual case studies |
| **Skills** | Languages, web tech, data science libraries, tools and cloud |
| **Resume** | Education and experience summary |
| **About** | A draggable polaroid photo stack |
| **Contact** | Copy-to-clipboard email and phone, scan-to-call QR, GitHub and LinkedIn |

## Features

- **3D stadium track** built with Three.js, with a rigged cyclist (animated pedals), floodlights, terrain and procedurally placed trees.
- **Multiple ways to move:** mouse wheel, keyboard, touch gestures, or jump straight to a section with the navigation pills.
- **Day / night mode** with floodlights and layered ambient audio (birds, wind, wheel spin, bell).
- **Polaroid photo stack** with tilt, depth ordering and swipe / drag to cycle photos.
- **Scan-to-call QR** popover on hover in the Contact section.
- **Responsive** layout and camera for desktop, tablet and mobile.
- **Self-hosted fonts and assets** for fast, offline-friendly loading, with loader fallbacks for models and audio.

## Controls

| Input | Action |
|---|---|
| `W` / `↑` | Ride forward |
| `Shift` + `W` | Sprint |
| `S` / `↓` | Ride backward |
| `E` | Ring the bell |
| Mouse wheel / touch drag | Ride along the track |
| Navigation pills | Jump to a checkpoint |

## Project Structure

```
├── index.html                    # Entry point and 3D canvas viewport
├── package.json                  # Metadata and start script
├── LICENSE                       # MIT
├── README.md
├── favicon.png
│
├── assets/
│   ├── audio/                    # birds, day, night, horn, wheel (.mp3)
│   ├── fonts/                    # Irish Grover, Nunito (.woff2) + fonts.css
│   ├── icons/                    # Tool and platform icons
│   ├── images/                   # og-image, QR code, logos, photos, thumbnails
│   └── models/                   # rider.glb, track.glb, tree1–4.glb
│
├── src/
│   ├── scripts/
│   │   ├── app.js                # Engine, render loop, controls, UI
│   │   ├── data/
│   │   │   └── portfolio-data.js # Checkpoints, projects, bio, skills
│   │   ├── utils/
│   │   │   └── asset-loader.js   # Model and audio loader with fallback
│   │   └── vendor/
│   │       ├── three.min.js      # Three.js r128
│   │       └── GLTFLoader.js
│   └── styles/
│       ├── main.css              # Master stylesheet
│       ├── variables.css         # Design tokens
│       ├── global.css            # Resets and canvas layout
│       ├── typography.css
│       ├── components.css        # Pills, cards, polaroids, popovers
│       ├── animations.css
│       └── responsive.css
│
└── work/                         # Standalone subpages
    ├── concepts.html             # Skills showcase
    ├── backroom.html             # Case study
    ├── bizassure.html            # Case study
    ├── ledge.html                # Case study
    └── maarpit.html              # Case study
```

## Run Locally

A local HTTP server is required so the browser can load `.glb` models and `.mp3` audio without CORS issues.

```bash
# Node
npx serve . -l 5501

# or Python
python -m http.server 5501
```

Then open <http://localhost:5501>.

With VS Code, install **Live Server** and click **Go Live**.

## Customize

- **Content:** edit `src/scripts/data/portfolio-data.js` (checkpoints, projects, bio, skills).
- **Look and feel:** change tokens in `src/styles/variables.css`.
- **New case study:** add an HTML page in `work/` and link it from the project data.
- **3D assets:** replace files in `assets/models/` keeping the same file names.

## Tech Stack

- **Core:** HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JavaScript (ES6+)
- **3D:** Three.js r128, GLTFLoader, ACES Filmic tone mapping, PCF soft shadows, eased camera
- **Audio:** Web Audio API with gain-node mixing
- **Fonts:** Irish Grover, Nunito (self-hosted WOFF2)
- **Hosting:** GitHub Pages, mirrored on Vercel

## Contact

- Website: <https://ishanbiswas2006.github.io/>
- GitHub: [@IshanBiswas2006](https://github.com/IshanBiswas2006)

## License

Released under the [MIT License](LICENSE).