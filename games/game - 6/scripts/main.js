let coins = 0;
let perClick = 1;
let autoClickers = 0;
let autoCost = 50;
let upgradeCost = 100;
let prestigeMult = 1;
let lifetime = 0;

function updateDisplay() {
  document.getElementById('money').textContent = format(coins);
  document.getElementById('perClick').textContent = format(perClick);
  document.getElementById('perSec').textContent = format(autoClickers);
  document.getElementById('shards').textContent = (prestigeMult - 1).toFixed(2);
  document.getElementById('lifetime').textContent = format(lifetime);
  document.getElementById('autoCost').textContent = format(autoCost);
  document.getElementById('upgradeCost').textContent = format(upgradeCost);
  document.getElementById('prestigeMult').textContent = 'x' + prestigeMult.toFixed(2);
}

function clickCoin() {
  coins += perClick * prestigeMult;
  lifetime += perClick * prestigeMult;
  updateDisplay();
}

function buyAutoClick() {
  if (coins >= autoCost) {
    coins -= autoCost;
    autoClickers++;
    autoCost = Math.floor(autoCost * 1.5);
    updateDisplay();
  }
}

function buyUpgrade() {
  if (coins >= upgradeCost) {
    coins -= upgradeCost;
    perClick++;
    upgradeCost = Math.floor(upgradeCost * 1.6);
    updateDisplay();
  }
}

function prestige() {
  if (lifetime < 1000) {
    alert("Сначала заработай хотя бы 1000 монет!");
    return;
  }
  const gain = Math.floor(Math.sqrt(lifetime / 1000));
  prestigeMult += gain * 0.1;
  coins = 0;
  perClick = 1;
  autoClickers = 0;
  autoCost = 50;
  upgradeCost = 100;
  lifetime = 0;
  alert(`Престиж совершен! +${gain * 10}% дохода навсегда.`);
  updateDisplay();
}

function format(n) {
  if (n < 1000) return Math.floor(n);
  const units = ['K', 'M', 'B', 'T'];
  let u = -1;
  while (n >= 1000 && u < units.length - 1) {
    n /= 1000;
    u++;
  }
  return n.toFixed(1) + units[u];
}

setInterval(() => {
  coins += autoClickers * prestigeMult;
  lifetime += autoClickers * prestigeMult;
  updateDisplay();
}, 1000);

document.getElementById('clickBtn').addEventListener('click', clickCoin);
document.getElementById('buyAutoClick').addEventListener('click', buyAutoClick);
document.getElementById('buyUpgrade').addEventListener('click', buyUpgrade);
document.getElementById('prestigeBtn').addEventListener('click', prestige);

updateDisplay();
