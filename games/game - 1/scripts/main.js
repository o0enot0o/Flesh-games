let score = 0;
let isPaused = false;

const config = {
  step: 0,
  maxStep: 6,
  sizeCell: 16,
  sizeBerry: 4
};

const snake = {
  x: 0,
  y: 0,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3
};

let berry = { x: 0, y: 0 };

let canvas = document.querySelector("#game-canvas");
let ctx = canvas.getContext("2d");
let scoreBlock = document.querySelector(".score-count");
let highScoreBlock = document.getElementById("highscore-count");

let cols = 0;
let rows = 0;

let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;
highScoreBlock.textContent = highScore;

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;

  cols = Math.floor(canvas.width / config.sizeCell);
  rows = Math.floor(canvas.height / config.sizeCell);

 
  snake.x = Math.floor(cols / 2) * config.sizeCell;
  snake.y = Math.floor(rows / 2) * config.sizeCell;

  randomPositionBerry();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


const pauseIcon = document.createElement("div");
pauseIcon.textContent = "⏸️";
pauseIcon.style.position = "absolute";
pauseIcon.style.top = "50%";
pauseIcon.style.left = "50%";
pauseIcon.style.transform = "translate(-50%, -50%)";
pauseIcon.style.fontSize = "40px";
pauseIcon.style.color = "#30C8D9";
pauseIcon.style.display = "none";
document.body.appendChild(pauseIcon);


function startGameLoop() {
  if (isPaused) return;

  requestAnimationFrame(gameLoop);

  if (++config.step < config.maxStep) return;
  config.step = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBerry();
  drawSnake();
}

function gameLoop() {
  startGameLoop();
}

requestAnimationFrame(gameLoop);

function drawSnake() {
  snake.x += snake.dx;
  snake.y += snake.dy;

  collisionBorder();

  snake.tails.unshift({ x: snake.x, y: snake.y });
  if (snake.tails.length > snake.maxTails) snake.tails.pop();

  snake.tails.forEach((el, index) => {
    ctx.fillStyle = index === 0 ? "#30C8D9" : "#0583F2";
    ctx.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

 
    if (el.x === berry.x && el.y === berry.y) {
      snake.maxTails++;
      incScore();
      randomPositionBerry();
    }

   
    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) refreshGame();
    }
  });
}


function collisionBorder() {
  if (snake.x < 0) snake.x = (cols - 1) * config.sizeCell;
  else if (snake.x >= cols * config.sizeCell) snake.x = 0;

  if (snake.y < 0) snake.y = (rows - 1) * config.sizeCell;
  else if (snake.y >= rows * config.sizeCell) snake.y = 0;
}

function refreshGame() {
  score = 0;
  drawScore();

  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  snake.x = Math.floor(cols / 2) * config.sizeCell;
  snake.y = Math.floor(rows / 2) * config.sizeCell;

  randomPositionBerry();
}

function drawBerry() {
  ctx.fillStyle = "#FA0556";
  ctx.beginPath();
  ctx.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function randomPositionBerry() {
  berry.x = getRandomInt(0, cols) * config.sizeCell;
  berry.y = getRandomInt(0, rows) * config.sizeCell;
}

function incScore() {
  score++;
  drawScore();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    drawHighScore();
  }
}

function drawScore() {
  scoreBlock.textContent = score;
}

function drawHighScore() {
  highScoreBlock.textContent = highScore;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener("keydown", (e) => {
  const goingUp = snake.dy === -config.sizeCell;
  const goingDown = snake.dy === config.sizeCell;
  const goingLeft = snake.dx === -config.sizeCell;
  const goingRight = snake.dx === config.sizeCell;

  if (e.code === "KeyW" && !goingDown) {
    snake.dy = -config.sizeCell;
    snake.dx = 0;
  } else if (e.code === "KeyS" && !goingUp) {
    snake.dy = config.sizeCell;
    snake.dx = 0;
  } else if (e.code === "KeyA" && !goingRight) {
    snake.dx = -config.sizeCell;
    snake.dy = 0;
  } else if (e.code === "KeyD" && !goingLeft) {
    snake.dx = config.sizeCell;
    snake.dy = 0;
  }

  if (e.code === "Escape") togglePause();
});

function togglePause() {
  isPaused = !isPaused;
  pauseIcon.style.display = isPaused ? "block" : "none";
  if (!isPaused) startGameLoop();
}
