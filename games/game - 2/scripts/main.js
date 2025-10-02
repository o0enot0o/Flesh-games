document.addEventListener('DOMContentLoaded', () => {
  const earth = document.getElementById('earth');
  const projectile = document.getElementById('projectile');

  function getCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  let earthCenter = getCenter(earth);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const projectileSpeed = 3;
  const laserSpeed = 6;

  let projX, projY;
  let vectorX, vectorY;
  let moving = false;
  let gameOver = false;
  let meteorHP = 1;

  function spawnProjectile() {
    if (gameOver) return;

    const size = Math.floor(Math.random() * 71) + 30;
    projectile.style.width = size + 'px';
    projectile.style.height = size + 'px';

    meteorHP = Math.ceil(size / 25);

    projectile.style.display = 'block';

    const sides = ['top', 'bottom', 'left', 'right'];
    const side = sides[Math.floor(Math.random() * sides.length)];

    switch (side) {
      case 'top':
        projX = Math.random() * windowWidth;
        projY = -size;
        break;
      case 'bottom':
        projX = Math.random() * windowWidth;
        projY = windowHeight + size;
        break;
      case 'left':
        projX = -size;
        projY = Math.random() * windowHeight;
        break;
      case 'right':
        projX = windowWidth + size;
        projY = Math.random() * windowHeight;
        break;
    }

    vectorX = earthCenter.x - projX;
    vectorY = earthCenter.y - projY;
    const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    vectorX /= length;
    vectorY /= length;

    projectile.style.left = (projX - size / 2) + 'px';
    projectile.style.top = (projY - size / 2) + 'px';

    moving = true;
    requestAnimationFrame(moveProjectile);
  }

  function moveProjectile() {
    if (!moving) return;

    projX += vectorX * projectileSpeed;
    projY += vectorY * projectileSpeed;

    const size = projectile.offsetWidth;
    projectile.style.left = (projX - size / 2) + 'px';
    projectile.style.top = (projY - size / 2) + 'px';

    const projCenter = getCenter(projectile);
    const distX = projCenter.x - earthCenter.x;
    const distY = projCenter.y - earthCenter.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < (earth.offsetWidth / 2)) {
      earth.style.display = 'none';
      projectile.style.display = 'none';
      moving = false;
      gameOver = true;
      alert('Земля знищена!');
      return;
    }

    requestAnimationFrame(moveProjectile);
  }

  function fireLaser(toX, toY) {
    const laser = document.createElement('div');
    laser.classList.add('laser-shot');
    document.body.appendChild(laser);

    let pos = { x: earthCenter.x, y: earthCenter.y };
    let dx = toX - earthCenter.x;
    let dy = toY - earthCenter.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    function moveLaser() {
      pos.x += dx * laserSpeed;
      pos.y += dy * laserSpeed;

      laser.style.left = (pos.x - 4) + 'px';
      laser.style.top = (pos.y - 4) + 'px';

      if (
        pos.x < 0 || pos.x > windowWidth ||
        pos.y < 0 || pos.y > windowHeight
      ) {
        laser.remove();
        return;
      }

      const projRect = projectile.getBoundingClientRect();
      if (
        projectile.style.display !== 'none' &&
        pos.x > projRect.left &&
        pos.x < projRect.right &&
        pos.y > projRect.top &&
        pos.y < projRect.bottom
      ) {
        meteorHP--;

        if (meteorHP <= 0) {
          projectile.style.display = 'none';
          moving = false;
          createFragments(projX, projY, Math.floor(Math.random() * 3) + 2);

          setTimeout(() => {
            if (!gameOver) spawnProjectile();
          }, 3000);
        }

        laser.remove();
        return;
      }

      requestAnimationFrame(moveLaser);
    }

    moveLaser();
  }

  function createFragments(originX, originY, count) {
    for (let i = 0; i < count; i++) {
      const frag = document.createElement('div');
      frag.classList.add('fragment');
      document.body.appendChild(frag);

      frag.style.left = originX + 'px';
      frag.style.top = originY + 'px';

      const baseAngle = 90;
      const offset = (Math.random() * 60) - 30;
      const angle = (baseAngle + offset) * (Math.PI / 180);
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      let pos = { x: originX, y: originY };
      const speed = 2 + Math.random() * 1.5;

      function moveFrag() {
        pos.x += dx * speed;
        pos.y += dy * speed;
        frag.style.left = pos.x + 'px';
        frag.style.top = pos.y + 'px';

        if (
          pos.x < -20 || pos.x > window.innerWidth + 20 ||
          pos.y < -20 || pos.y > window.innerHeight + 20
        ) {
          frag.remove();
          return;
        }

        requestAnimationFrame(moveFrag);
      }

      moveFrag();
    }
  }

  document.addEventListener('click', (e) => {
    if (gameOver) return;
    fireLaser(e.clientX, e.clientY);
  });

  spawnProjectile();
});
