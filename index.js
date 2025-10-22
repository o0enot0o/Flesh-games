document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        let targetPosition;

        if(this.getAttribute('href') === '#games') {
          const rect = target.getBoundingClientRect();
          targetPosition = window.pageYOffset + rect.top - (window.innerHeight/2) + (rect.height/2);
        } else {
          targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 60;
        }

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
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

  const playBtn = document.querySelector('.play-btn');
  const gamesSection = document.querySelector('#games');

  playBtn.addEventListener('click', () => {
    const rect = gamesSection.getBoundingClientRect();
    const targetPosition = window.pageYOffset + rect.top - (window.innerHeight/2) + (rect.height/2);
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });

  
  const commentList = document.getElementById('comments-list');
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  const submitBtn = document.getElementById('comment-submit');

  function addComment() {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if(!name || !text) return;

    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    commentItem.innerHTML = `<strong>${name}:</strong> ${text}`;

    commentList.prepend(commentItem);

    textInput.value = '';
  }

  submitBtn.addEventListener('click', addComment);

  nameInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      addComment();
    }
  });

  textInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  });

  const game1Button = document.querySelector('button[aria-label="Гра 1"]');
  if (game1Button) {
    game1Button.addEventListener("click", () => {
      window.open("games/game%20-%201/index.html", "_blank");
    });
  }
  const game3Button = document.querySelector('button[aria-label="Гра 3"]');
  if (game3Button) {
    game3Button.addEventListener("click", () => {
      window.open("games/game%20-%203/index.html", "_blank");
    });
  }
  const game5Button = document.querySelector('button[aria-label="Гра 5"]');
  if (game5Button) {
    game5Button.addEventListener("click", () => {
      window.open("games/game%20-%205/index.html", "_blank");
    });
  }
});
