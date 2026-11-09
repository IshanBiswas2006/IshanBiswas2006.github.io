/**
 * ==========================================================================
 * PORTFOLIO DATA MODULE
 * Structured content for case studies, checkpoints, skills, and about
 * ==========================================================================
 */

/* ================= CONTENT (edit here) ================= */
const ICON = {
  work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  concepts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>',
  about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  resume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/></svg>'
};

const STOPS = [ // f = fraction of the lap where each checkpoint sits (menu order)
  { id: 'work', name: 'Work', kick: 'Checkpoint 1 · Case studies', color: '#e3a33f', f: .08 },
  { id: 'concepts', name: 'Skills', kick: 'Checkpoint 2 · Skills', color: '#e7849f', f: .28 },
  { id: 'resume', name: 'Resume', kick: 'Checkpoint 3 · Experience', color: '#4fa9ae', f: .48 },
  { id: 'about', name: 'About', kick: 'Checkpoint 4 · Who I am', color: '#8b80d1', f: .68 },
  { id: 'contact', name: 'Contact', kick: 'Checkpoint 5 · Say hello', color: '#5b8fd6', f: .88 }
];

const NAME = 'Ishan Biswas';

const LINES = [ // the line under the name rotates through these
  ['Aspiring Data Scientist. Passionate about programming, data science, and problem-solving.'],
  ['BCA student at MAKAUT University, West Bengal.'],
  ['Building practical technology projects and exploring modern technologies.'],
  ['Skilled in C, C++, Java, Python, SQL, and Data Science.']
];

const STUDIES = [
  { id: 'algoviz', n: 'AlgoViz', co: 'Personal project', yr: '2026', tilt: -6, logo: '', thumb: '', url: 'https://github.com/IshanBiswas2006', s: 'Interactive DSA Visualizer · Real-time animations and step-by-step execution', c: '#2f6bff', sec: [] },
  { id: 'netflix-data-engine', n: 'Netflix Data Engine', co: 'Personal project', yr: '2026', tilt: 5, logo: '', thumb: '', url: 'https://github.com/IshanBiswas2006/netflix-data-engine', s: 'Data analytics pipeline · 3NF MySQL modeling · Flask dashboard', c: '#d9587f', sec: [] }
];

const TOOLS = [ // personal projects, shown under Work
  { id: 'data-quality-checker', n: 'Data Quality Checker', co: 'Personal project', yr: '2026', tilt: -5, logo: '', thumb: '', url: 'https://github.com/IshanBiswas2006/Data-Quality-Checker', s: 'Data validation and quality assurance tool', c: '#1d2433' }
];

const CONCEPTS = [];

const cvBlobs = {};
function cvSrc(k) {
  if (cvBlobs[k]) return cvBlobs[k];
  const el = document.getElementById('cv-' + k);
  const bin = atob(el.textContent.trim());
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return cvBlobs[k] = URL.createObjectURL(new Blob([u], { type: 'video/mp4' }));
}

const ABOUT = [
  'Aspiring Data Scientist and BCA student at MAKAUT University, West Bengal.',
  'I am passionate about programming, data science, problem-solving, and building practical technology projects. I continuously develop my programming knowledge through hands-on projects, algorithm practice, and exploring modern technologies.'
];

const TIMELINE = [
  ['Now', 'BCA Student, MAKAUT University <em class="dur">· 2025–2029</em>'],
  ['Certifications', 'AWS Cloud Practitioner Essentials · Aug 2026'],
  ['Simulation', 'Technology Job Simulation, Deloitte via Forage · Jul 2026']
];

const SKILLS = [
  'C', 'C++', 'Java', 'Python', 'HTML5', 'CSS3', 'JavaScript',
  'NumPy', 'Pandas', 'SQL', 'MySQL', 'Git', 'GitHub', 'VS Code',
  'Jupyter Notebook', 'DSA', 'Data Science'
];

const PHOTOS = [
  ['assets/images/photos/ishan-biswas.jpg', 'Photo'],
  ['assets/images/photos/ishan-biswas-2.jpg', 'Photo'],
  ['assets/images/photos/IMG-20251005-WA0010.jpg', 'Photo'],
  ['assets/images/photos/IMG-20251006-WA0063.jpg', 'Photo'],
  ['assets/images/photos/IMG-20251006-WA0069.jpg', 'Photo'],
  ['assets/images/photos/IMG-20251007-WA0175.jpg', 'Photo'],
  ['assets/images/photos/WhatsApp Image 2025-12-24 at 02.19.49.jpeg', 'Photo']
];

const STACK = [ // [name, what for, logo]
  ['VS Code', 'Code editor', 'assets/icons/vscode.svg'],
  ['Jupyter Notebook', 'Data Science', 'assets/icons/jupyter.svg'],
  ['Git', 'Version control', 'assets/icons/git.svg'],
  ['GitHub', 'Collaboration', 'assets/icons/github.svg']
];

const EMAIL = 'biswas.ishan2006@gmail.com',
  PHONE = '+91 70030 90104',
  TEL = '+917003090104',
  RESUME_URL = 'assets/IshanBiswasResume.pdf';

const QR_CALL = '<img src="assets/images/qr-call.png" alt="Scan to call">';

const SOCIALS = [
  ['LinkedIn', 'Ishan Biswas', 'https://www.linkedin.com/in/ishan-biswas-521b97384/', 'assets/icons/linkedin.png'],
  ['GitHub', 'IshanBiswas2006', 'https://github.com/IshanBiswas2006', 'assets/icons/github.png']
];

/* ======================================================= */

// Export to window scope for modular browser architecture
window.PortfolioData = {
  ICON,
  STOPS,
  NAME,
  LINES,
  STUDIES,
  TOOLS,
  CONCEPTS,
  cvBlobs,
  cvSrc,
  ABOUT,
  TIMELINE,
  SKILLS,
  PHOTOS,
  STACK,
  EMAIL,
  RESUME_URL,
  QR_CALL,
  SOCIALS
};

