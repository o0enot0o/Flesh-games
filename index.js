document.querySelector('.play-btn').addEventListener('click', () => {
  document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('.game-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`Ви відкрили гру: ${btn.getAttribute('aria-label') || btn.textContent}`);
  });
});

document.getElementById('comment-submit').addEventListener('click', () => {
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!name || !text) return;

  const commentList = document.getElementById('comments-list');
  const newComment = document.createElement('div');
  newComment.classList.add('comment-item');
  newComment.innerHTML = `<strong>${name}:</strong> <p>${text}</p>`;
  commentList.prepend(newComment);

  document.getElementById('comment-name').value = '';
  document.getElementById('comment-text').value = '';
});
