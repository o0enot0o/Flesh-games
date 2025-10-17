// Bottle Flip — script.js
const bottleEl = document.getElementById('bottle');
const stage = document.getElementById('stage');
const powerEl = document.getElementById('power');
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('msg');
const resetBtn = document.getElementById('resetBtn');
const mobileCharge = document.getElementById('mobileCharge');
const particlesContainer = document.getElementById('particles');

let charging = false;
let charge = 0;
let score = 0;

let y = 0, vy = 0, angle = 0, angularV = 0;
let isFlying = false;

const groundHeight = 86; // px, matches CSS

function setScore(v){ score = v; scoreEl.textContent = score; }

function resetBottle(){
  isFlying = false; y = 0; vy = 0; angle = 0; angularV = 0;
  charging = false; charge = 0; powerEl.style.width = '0%';
  bottleEl.style.bottom = groundHeight + 'px';
  bottleEl.style.transform = `translateX(-50%) rotate(0deg)`;
  bottleEl.classList.add('idle');
  msgEl.textContent = 'Удерживай и отпусти, чтобы бросить!';
}

resetBottle();

function updateRender(){
  bottleEl.style.bottom = groundHeight + y + 'px';
  bottleEl.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

let last = performance.now();
function loop(t){
  const dt = Math.min(0.05, (t - last)/1000); last = t;
  if(isFlying){
    const g = 1500; // gravity px/s^2
    vy -= g * dt;
    y += vy * dt;
    angularV *= Math.pow(0.98, dt * 60); // damping
    angle += angularV * dt;

    // collision with ground
    if(y <= 0){
      if(vy < -80){
        vy = -vy * 0.22;
        y = 0;
        angularV *= 0.6;
      } else {
        y = 0; vy = 0; isFlying = false;
        evaluateLanding();
      }
    }
    updateRender();
  } else if(charging){
    charge = Math.min(1, charge + dt * 0.9);
    powerEl.style.width = Math.round(charge * 100) + '%';
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function evaluateLanding(){
  bottleEl.classList.add('idle');
  const normalized = ((angle % 360) + 360) % 360;
  const nearUpright = Math.min(Math.abs(normalized - 0), Math.abs(normalized - 360));
  const tolerance = 22;
  if(nearUpright <= tolerance){
    setScore(score + 1);
    msgEl.textContent = '🎉 Отлично! +1';
    spawnParticles(true);
  } else {
    msgEl.textContent = '😢 Промах, попробуй ещё!';
    spawnParticles(false);
  }
  // gentle settle
  bottleEl.style.transition = 'transform .5s cubic-bezier(.2,.9,.2,1)';
  angle = Math.round(angle/5) * 5;
  updateRender();
  setTimeout(()=> { bottleEl.style.transition = ''; msgEl.textContent = 'Удерживай и отпусти, чтобы бросить!'; }, 900);
}

// input handling
let pointerStartY = null;
let pointerStartTime = null;

function startCharge(clientY){
  if(isFlying) return;
  charging = true; charge = 0; powerEl.style.width = '0%';
  pointerStartY = clientY; pointerStartTime = performance.now();
  msgEl.textContent = 'Заряжается...';
  bottleEl.classList.remove('idle');
}

function endCharge(clientY){
  if(!charging) return;
  charging = false;
  const dt = Math.max(0.05, (performance.now() - pointerStartTime)/1000);
  const dy = (pointerStartY !== null) ? (pointerStartY - clientY) : 0;
  const swipeForce = Math.max(0, Math.min(1, dy / 220));
  const finalPower = Math.min(1, Math.max(charge, swipeForce));
  doFlip(finalPower);
  pointerStartY = null; pointerStartTime = null;
  powerEl.style.width = '0%';
}

function doFlip(power){
  isFlying = true;
  bottleEl.classList.remove('idle');
  const upVel = 650 + power * 1300; // px/s
  const spin = 320 + power * 1100; // deg/s
  angularV = spin * (Math.random() > 0.5 ? 1 : -1) + (Math.random() - 0.5) * 60;
  vy = upVel;
  msgEl.textContent = '🚀 В полёте...';
}

// events (mouse + touch + keyboard)
stage.addEventListener('mousedown', e => { e.preventDefault(); startCharge(e.clientY); });
window.addEventListener('mouseup', e => { endCharge(e.clientY); });

stage.addEventListener('touchstart', e => { startCharge(e.touches[0].clientY); }, {passive: true});
window.addEventListener('touchend', e => {
  // touchend has changedTouches
  let y = 0;
  if(e.changedTouches && e.changedTouches[0]) y = e.changedTouches[0].clientY;
  endCharge(y);
});

mobileCharge.addEventListener('touchstart', e => { e.preventDefault(); startCharge(e.touches[0].clientY); });
mobileCharge.addEventListener('touchend', e => { e.preventDefault(); endCharge(0); });

window.addEventListener('keydown', e => { if(e.code === 'Space') { e.preventDefault(); doFlip(0.55); } });

resetBtn.addEventListener('click', () => { setScore(0); resetBottle(); });

// simple particles effect
function spawnParticles(success){
  const colors = success ? ['#60a5fa','#3b82f6','#93c5fd'] : ['#f97373','#fb7185','#fca5a5'];
  const count = success ? 14 : 8;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    particlesContainer.appendChild(p);
    const size = Math.random() * 8 + 6;
    p.style.position = 'absolute';
    p.style.left = (window.innerWidth/2 + (Math.random()-0.5)*160) + 'px';
    p.style.top = (stage.getBoundingClientRect().top + stage.clientHeight*0.25 + Math.random()*120) + 'px';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.borderRadius = '50%';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.opacity = '0.95';
    const angleR = (Math.random()*Math.PI*2);
    const speed = 160 + Math.random()*240;
    const vx = Math.cos(angleR) * speed;
    const vyP = Math.sin(angleR) * speed - 120;
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vyP}px) scale(0.6)`, opacity: 0 }
    ], {
      duration: 700 + Math.random()*500,
      easing: 'cubic-bezier(.2,.8,.2,1)'
    });
    setTimeout(()=> p.remove(), 1400);
  }
}
