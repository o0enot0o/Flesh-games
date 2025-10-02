let scoreBlock;
let score = 0;
let isPaused = false; 

const config = {
  step: 0,
  maxStep: 6,
  sizeCell: 16,
  sizeBerry: 16 / 4
};

const snake = {
  x: 160,
  y: 160,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3
};

let berry = {
  x: 0,
  y: 0
};

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore();

// Іконка паузи
const pauseIcon = document.createElement('div');
pauseIcon.textContent = '⏸️'; 
pauseIcon.style.position = 'absolute';
pauseIcon.style.top = '50%';
pauseIcon.style.left = '50%';
pauseIcon.style.transform = 'translate(-50%, -50%)';
pauseIcon.style.fontSize = '40px';
pauseIcon.style.color = '#30C8D9'; 
pauseIcon.style.display = 'none'; 

document.body.appendChild(pauseIcon);


function startGameLoop() {
  if (isPaused) return; 

  requestAnimationFrame(gameLoop);

  if (++config.step < config.maxStep) {
    return;
  }
  config.step = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

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

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach(function (el, index) {
    context.fillStyle = index === 0 ? "#30C8D9" : "#0583F2";
    context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

    if (el.x === berry.x && el.y === berry.y) {
      snake.maxTails++;
      incScore();
      randomPositionBerry();
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) {
        refreshGame();
      }
    }
  });
}

function collisionBorder() {
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}

function refreshGame() {
  score = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  randomPositionBerry();
}

function drawBerry() {
  context.beginPath();
  context.fillStyle = "#FA0556"; 
  context.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  context.fill();
}

function randomPositionBerry() {
  berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
  berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function incScore() {
  score++;
  drawScore();
}

function drawScore() {
  scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


document.addEventListener("keydown", function (e) {
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

  
  if (e.code === "Escape") {
    togglePause(); 
  }
});

function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    
    pauseIcon.style.display = 'block';
  } else {
    
    pauseIcon.style.display = 'none';
  }
  
  if (!isPaused) {
    startGameLoop();
  }
}
