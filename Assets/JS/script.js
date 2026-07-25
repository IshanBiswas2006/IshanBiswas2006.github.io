document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor Tooltip on Hover
  const follower = document.getElementById('cursor-follower');
  const followerText = follower.querySelector('.cursor-text');

  document.querySelectorAll('[data-tooltip]').forEach(item => {
    item.addEventListener('mouseenter', () => {
      followerText.textContent = item.getAttribute('data-tooltip');
      follower.classList.add('active');
    });

    item.addEventListener('mousemove', (e) => {
      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    });

    item.addEventListener('mouseleave', () => {
      follower.classList.remove('active');
    });
  });

  // 2. Horizontal Scroll Dragging & Smooth Slow Auto-Motion
  const slider = document.getElementById('slider-track');
  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScrollDirection = 1;
  let autoScrollSpeed = 0.6; // Slow movement pace
  let isHovered = false;

  if (slider) {
    // Continuous Slow Auto-Scroll Functionality
    function slowAutoMove() {
      if (!isDown && !isHovered) {
        slider.scrollLeft += autoScrollSpeed * autoScrollDirection;

        // Bounce back smoothly when reaching borders
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 5) {
          autoScrollDirection = -1;
        } else if (slider.scrollLeft <= 5) {
          autoScrollDirection = 1;
        }
      }
      requestAnimationFrame(slowAutoMove);
    }
    requestAnimationFrame(slowAutoMove);

    slider.addEventListener('mouseenter', () => { isHovered = true; });
    slider.addEventListener('mouseleave', () => {
      isHovered = false;
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // 3. Dynamic Urgency Label Update
  const urgencySlider = document.getElementById('urgency-slider');
  const urgentText = document.getElementById('urgent-text');
  const urgencyLabels = ['Whenever', 'Sometime soon', 'ASAP'];

  if (urgencySlider && urgentText) {
    urgencySlider.addEventListener('input', (e) => {
      urgentText.textContent = urgencyLabels[e.target.value - 1];
    });
  }

  // 4. Contact Modal Controls
  const modal = document.getElementById('contact-modal');
  const openBtns = [
    document.getElementById('partner-pill'),
    document.getElementById('nav-contact-btn'),
    document.getElementById('footer-trigger-modal')
  ];
  const closeBtn = document.getElementById('modal-close-btn');

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => modal.classList.add('active'));
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 5. Form Chip Toggle
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
});