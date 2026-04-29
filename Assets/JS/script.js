const SKILLS = {
  "Programming Languages": [
    { name: "C",          logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/c.svg" },
    { name: "C++",        logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/c++.svg" },
    { name: "Java",       logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/java.svg" },
    { name: "OOP",        logo: "https://cdn.simpleicons.org/abstractmetatransactions/2563eb" },
    { name: "HTML",       logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" },
    { name: "CSS",        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" },
    { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/F0DB4F" },
    { name: "MySQL",      logo: "https://cdn.simpleicons.org/mysql/00618A" },
  ],
  "Core Areas": [
    { name: "DSA",             logo: "https://cdn.simpleicons.org/thealgorithms/2563eb" },
    { name: "Data Science",    logo: "https://cdn.simpleicons.org/anaconda/44A833" },
    { name: "Problem Solving", logo: "https://cdn.simpleicons.org/leetcode/FFA116" },
    { name: "Logical Thinking",logo: "https://cdn.simpleicons.org/brain/7c3aed" },
  ],
  "Tools & Environment": [
    { name: "VS Code", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" },
    { name: "GitHub",  logo: "https://cdn.simpleicons.org/github/181616" },
    { name: "Git",     logo: "https://cdn.simpleicons.org/git/F05032", learning: true },
  ],
};

(function buildSkills() {
  const grid = document.getElementById('skills-grid');

  Object.entries(SKILLS).forEach(([groupName, items]) => {
    const group = document.createElement('div');
    group.className = 'skill-group fade-in';

    const title = document.createElement('div');
    title.className = 'skill-group-title';
    title.textContent = groupName;
    group.appendChild(title);

    const tags = document.createElement('div');
    tags.className = 'skill-tags';

    items.forEach(skill => {
      if (skill.learning) {
        const pill = document.createElement('span');
        pill.className = 'skill-tag-text';
        pill.title = skill.name + ' (Currently Learning)';
        pill.innerHTML = `<span class="learn-dot"></span>${skill.name} <em style="font-size:.7rem;opacity:.7">(Learning)</em>`;
        tags.appendChild(pill);
      } else {
        const card = document.createElement('div');
        card.className = 'skill-tag';
        card.title = skill.name;

        const img = document.createElement('img');
        img.src = skill.logo;
        img.alt = skill.name;
        img.width = 32;
        img.height = 32;
        img.onerror = function() {
          this.style.display = 'none';
          const fb = document.createElement('span');
          fb.style.cssText = 'font-size:1.6rem;line-height:1';
          fb.textContent = '📦';
          card.insertBefore(fb, card.firstChild);
        };

        const label = document.createElement('span');
        label.className = 'skill-tag-label';
        label.textContent = skill.name;

        card.appendChild(img);
        card.appendChild(label);
        tags.appendChild(card);
      }
    });

    group.appendChild(tags);
    grid.appendChild(group);
  });
})();

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
