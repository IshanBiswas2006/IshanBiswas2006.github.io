# Ishan Biswas — 3D Interactive Portfolio

An interactive 3D portfolio website for **Ishan Biswas**, Aspiring Data Scientist. Visitors ride through a gamified 3D stadium track where a cyclist navigates through distinct checkpoints: **Work**, **Skills**, **Resume**, **About**, and **Contact**.

---

## 🌟 Overview

* **Developer:** Ishan Biswas
* **Role:** Aspiring Data Scientist · BCA Student, MAKAUT University (2025–2029)
* **Live Site:** [https://ishanbiswas2006.github.io/](https://ishanbiswas2006.github.io/)
* **Technologies:** Pure HTML5, CSS3, JavaScript (ES6+), Three.js (r128), Web Audio API, WebGL.
* **Architecture:** Modular static site with separated design token stylesheets, structured JavaScript modules, local 3D assets (`.glb`), interactive audio layers (`.mp3`), and local web fonts (`.woff2`).

---

## ✨ Main Features

* **Interactive 3D Stadium Track:** Custom WebGL canvas powered by Three.js (r128) featuring a cyclist with real-time pedal rigging, stadium floodlights, terrain meshes, and procedural tree planting.
* **Checkpoint Navigation:** Ride forward/backward along the track using mouse wheel, keyboard (`W`/`↑` to ride, `Shift`+`W` to sprint, `S`/`↓` to reverse, `E` to ring bell), or jump directly using navigation pills.
* **Interactive Skills Showcase:** Dedicated responsive Skills page detailing programming languages (C, C++, Java, Python), web technologies, Python data science libraries (NumPy, Pandas, Matplotlib, Seaborn), development tools (Git, GitHub, VS Code), and cloud platforms (AWS, Docker).
* **Interactive Polaroid Photo Stack:** Realistic polaroid pile in the About section with tilt, depth ordering, and smooth swipe/drag interactions to cycle through personal photographs.
* **Day / Night Lighting & Ambience:** Toggle between daytime illumination and night-time floodlights with accompanying ambient audio layers (birds, wind, wheel spin, bell Easter egg).
* **Contact & Scan-to-Call QR Code:** Direct copy actions for email and phone, an interactive QR code popover on hover to scan and call directly, and social links to GitHub and LinkedIn.
* **Fully Responsive:** Custom layout optimizations for desktop, tablet, and mobile with touch gestures and responsive camera adjustments.

---

## 📁 Project Folder Structure

```text
├── index.html                   # Main entry point and 3D canvas viewport
├── package.json                 # Project metadata & start script
├── LICENSE                      # MIT License
├── README.md                    # Project documentation
├── favicon.png                  # Root browser tab favicon
│
├── assets/                      # Structured visual, audio, 3D, and font assets
│   ├── audio/                   # Interactive audio layers & sound effects
│   │   ├── birds.mp3
│   │   ├── day.mp3
│   │   ├── horn.mp3
│   │   ├── night.mp3
│   │   └── wheel.mp3
│   ├── fonts/                   # Local typography (WOFF2) & font declarations
│   │   ├── irish-grover.woff2
│   │   ├── nunito-*.woff2
│   │   └── fonts.css
│   ├── icons/                   # Tool & platform icons (GitHub, LinkedIn, Figma, etc.)
│   │   ├── github.png
│   │   ├── linkedin.png
│   │   └── ...
│   ├── images/                  # Project graphics, cards, photos, and QR codes
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.png
│   │   ├── og-image.jpg
│   │   ├── qr-call.png
│   │   ├── logos/               # Project and company badges
│   │   ├── photos/              # Personal photographs for About polaroid stack
│   │   └── thumbnails/          # Project cover cards
│   └── models/                  # 3D glTF/GLB models (cyclist, track, trees)
│       ├── rider.glb
│       ├── track.glb
│       └── tree1.glb ... tree4.glb
│
├── src/                         # Application source code
│   ├── scripts/
│   │   ├── app.js               # Core engine, physics, 3D render loop, and UI controls
│   │   ├── data/
│   │   │   └── portfolio-data.js# Content data (checkpoints, projects, bio, skills)
│   │   ├── utils/
│   │   │   └── asset-loader.js  # Binary model & audio loading utility with fallback
│   │   └── vendor/
│   │       ├── three.min.js     # Three.js (r128) library
│   │       └── GLTFLoader.js    # Three.js GLTF model parser
│   └── styles/
│       ├── main.css             # Unified master stylesheet
│       ├── variables.css        # Design tokens, color palette, dimensions
│       ├── global.css           # Base styles, canvas layout, resets
│       ├── typography.css       # Heading styles and typography
│       ├── components.css       # Navigation pills, cards, polaroid pile, popovers
│       ├── animations.css       # Keyframe animations and transitions
│       └── responsive.css       # Mobile & tablet media queries
│
├── work/                        # Standalone subpages & case studies
│   ├── concepts.html            # Skills showcase page
│   ├── backroom.html            # Case study subpage
│   ├── bizassure.html           # Case study subpage
│   ├── ledge.html               # Case study subpage
│   └── maarpit.html             # Case study subpage
│
└── docs/                        # Project records and migration documentation
    ├── Memory.md                # Project execution logs and history
    ├── PRD.md                   # Product requirements documentation
    └── Rule.md                  # Development rules and asset guidelines
```

---

## 🚀 Running Locally

The site requires a local HTTP server to load WebGL models (`.glb`) and Web Audio buffers (`.mp3`) without browser CORS restrictions.

### Option 1: Node.js (npx serve)
```bash
npx serve . -l 5501
```
Open `http://localhost:5501` in your browser.

### Option 2: Python HTTP Server
```bash
python -m http.server 5501
```
Open `http://localhost:5501` in your browser.

### Option 3: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension if not already installed.
3. Click **Go Live** on the bottom status bar (opens port `5501`/`5502`).

---

## 🛠️ Technologies Used

* **Core:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript (ES6+).
* **3D Graphics:** [Three.js (r128)](https://threejs.org/) with `GLTFLoader`, ACESFilmic tone mapping, PCFSoftShadowMap shadows, custom camera easing.
* **Audio:** Web Audio API with procedural gain nodes and multi-channel soundscape mixing.
* **Fonts:** Irish Grover, Nunito (self-hosted WOFF2 for fast offline loading).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Credits & Acknowledgments

* Design inspiration and original 3D track concept by [Taye Bhaskar](https://taye.in/).
* 3D rendering and mathematics powered by the open-source [Three.js](https://threejs.org/) community.
