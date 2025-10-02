document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 60;
        const duration = 800;
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percent = Math.min(progress / duration, 1);

          const ease = percent < 0.5
            ? 4 * percent * percent * percent
            : 1 - Math.pow(-2 * percent + 2, 3) / 2;

          window.scrollTo(0, startPosition + distance * ease);

          if (progress < duration) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const aboutBar = document.querySelector('.about-bar');
  const aboutModal = document.querySelector('.about-modal');


  aboutBar.addEventListener('click', () => {
    aboutModal.classList.add('active');
  });

  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.remove('active');
    }
  });
});