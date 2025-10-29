const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

let W = canvas.width;
let H = canvas.height;

let player = { w: 120, h: 14, x: W/2 - 60, y: H - 30, speed: 8 };
let stars = [];
let spawnTimer = 0;
let spawnInterval = 100;
let score = 0;
let lives = 3;
let running = true;

let keys = {};
window.addEventListener('keydown', e=> keys[e.key] = true);
window.addEventListener('keyup', e=> keys[e.key] = false);
canvas.addEventListener('mousemove', e=>{
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  player.x = Math.max(0, Math.min(W - player.w, mx - player.w/2));
});

restartBtn.addEventListener('click', resetGame);

function spawnStar(){
  const size = 12 + Math.random()*12;
  stars.push({
    x: Math.random()*(W - size),
    y: -size,
    r: size/2,
    vy: 0.8 + Math.random()*1.5
  });
}

function update(){
  if(!running) return;
  if(keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
  if(keys['ArrowRight'] || keys['d']) player.x += player.speed;
  player.x = Math.max(0, Math.min(W - player.w, player.x));

  spawnTimer++;
  if(spawnTimer > spawnInterval){
    spawnTimer = 0;
    spawnStar();
    if(spawnInterval > 60) spawnInterval -= 0.3;
  }

  for(let i = stars.length-1; i>=0; i--){
    const s = stars[i];
    s.y += s.vy;
    if(s.y + s.r >= player.y && s.x + s.r > player.x && s.x < player.x + player.w){
      stars.splice(i,1);
      score += Math.round(s.r);
      scoreEl.textContent = score;
      continue;
    }
    if(s.y - s.r > H){
      stars.splice(i,1);
      lives -= 1;
      if(lives <= 0){
        running = false;
        setTimeout(()=> showGameOver(), 200);
      }
    }
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    drawStar(ctx, s.x + s.r, s.y + s.r, s.r, 5);
  }
  ctx.fillStyle = 'rgba(255,209,102,0.95)';
  roundRect(ctx, player.x, player.y, player.w, player.h, 6, true, false);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '14px system-ui';
  ctx.fillText('Життя: ' + lives, 10, 20);
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame(){
  stars = [];
  spawnTimer = 0;
  spawnInterval = 100;
  score = 0;
  lives = 3;
  running = true;
  player.x = W/2 - player.w/2;
  scoreEl.textContent = score;
}

function showGameOver(){
  ctx.fillStyle = 'rgba(2,6,23,0.6)';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#ffd166';
  ctx.font = '32px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('ГРА ЗАКІНЧЕНА', W/2, H/2 - 10);
  ctx.font = '18px system-ui';
  ctx.fillStyle = '#e6eef8';
  ctx.fillText('Натисни "Почати заново", щоб спробувати ще раз', W/2, H/2 + 20);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if (typeof r === 'undefined') r = 5;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function drawStar(ctx, cx, cy, outerRadius, spikes){
  const inner = outerRadius * 0.5;
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for(let i=0;i<spikes;i++){
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x,y);
    rot += step;
    x = cx + Math.cos(rot) * inner;
    y = cy + Math.sin(rot) * inner;
    ctx.lineTo(x,y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,209,102,0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,180,60,0.25)';
  ctx.stroke();
}

resetGame();
loop();