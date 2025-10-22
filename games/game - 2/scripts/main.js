const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let playerX = 80;
let playerY = HEIGHT - 80;
const size = 40;
let velY = 0;
const gravity = 0.9;
const jumpImpulse = -15;

let obstacles = [];
let gameTick = 0;
let spawnInterval = 90;
let onGround = true;
let gameOver = false;
let score = 0;

class Obstacle {
  constructor(x, baseY, w, h, speed) {
    this.x = x;
    this.baseY = baseY;
    this.w = w;
    this.h = h;
    this.speed = speed;
  }
  update() {
    this.x -= this.speed;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.baseY);
    ctx.lineTo(this.x + this.w / 2, this.baseY - this.h);
    ctx.lineTo(this.x + this.w, this.baseY);
    ctx.closePath();
    ctx.fillStyle = "#dc5050";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
  getBounds() {
    return {x: this.x, y: this.baseY - this.h, w: this.w, h: this.h};
  }
}

function rectIntersectsTriangle(rect, tri) {
  const triBox = tri.getBounds();
  return !(
    rect.x > triBox.x + triBox.w ||
    rect.x + rect.w < triBox.x ||
    rect.y > triBox.y + triBox.h ||
    rect.y + rect.h < triBox.y
  );
}

function restart() {
  obstacles = [];
  gameTick = 0;
  spawnInterval = 90;
  playerY = HEIGHT - 40;
  velY = 0;
  onGround = true;
  gameOver = false;
  score = 0;
}

function update() {
  if (!gameOver) {
    gameTick++;

    velY += gravity * 0.6;
    playerY += velY;
    if (playerY >= HEIGHT - 40) {
      playerY = HEIGHT - 40;
      velY = 0;
      onGround = true;
    } else {
      onGround = false;
    }

    if (gameTick % spawnInterval === 0) {
      const w = 30 + Math.random() * 40;
      const h = 30 + Math.random() * 60;
      const speed = 6 + Math.random() * 3;
      obstacles.push(new Obstacle(WIDTH + 20, HEIGHT - 40, w, h, speed));
      if (spawnInterval > 40 && gameTick % 600 === 0) spawnInterval--;
    }

    obstacles = obstacles.filter(o => o.x + o.w > -50);
    obstacles.forEach(o => o.update());

    const playerRect = {x: playerX, y: playerY - size, w: size, h: size};
    for (let o of obstacles) {
      if (rectIntersectsTriangle(playerRect, o)) {
        gameOver = true;
        break;
      }
    }

    if (gameTick % 6 === 0) score++;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#3c3c3c";
  ctx.fillRect(0, HEIGHT - 40, WIDTH, 40);

  ctx.fillStyle = "#00c896";
  ctx.fillRect(playerX, playerY - size, size, size);

  obstacles.forEach(o => o.draw());

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (gameOver) {
    const msg = "GAME OVER - press R to restart";
    ctx.font = "28px Arial";
    const textWidth = ctx.measureText(msg).width;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect((WIDTH - textWidth) / 2 - 12, HEIGHT / 2 - 40, textWidth + 24, 60);
    ctx.fillStyle = "white";
    ctx.fillText(msg, (WIDTH - textWidth) / 2, HEIGHT / 2);
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && onGround && !gameOver) {
    velY = jumpImpulse;
    onGround = false;
  } else if (e.code === "KeyR" && gameOver) {
    restart();
  }
});

update();
