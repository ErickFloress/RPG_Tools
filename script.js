let data = JSON.parse(
  localStorage.getItem("rpgData") || '{"turns":[],"playerMonsters":[]}'
);
let currentTurn = 0;
const save = () => localStorage.setItem("rpgData", JSON.stringify(data));

function goHome() {
  document.getElementById("main").style.display = "none";
  document.getElementById("screen-initial").style.display = "block";
}

function goTo(mode) {
  document.getElementById("screen-initial").style.display = "none";
  document.getElementById("main").style.display = "grid";
  document.getElementById("view-mestre").style.display =
    mode === "mestre" ? "block" : "none";
  document.getElementById("view-jogador").style.display =
    mode === "jogador" ? "block" : "none";
  document.getElementById("view-title").innerText = mode.toUpperCase();
  render();
}

function addParticipant() {
  const name = document.getElementById("p-name").value.trim();
  const type = document.getElementById("p-type").value;
  const init = parseInt(document.getElementById("p-init").value) || 0;
  const hp = parseInt(document.getElementById("p-hp").value) || 0;
  if (!name) return alert("Informe um nome!");

  data.turns.push({ name, type, init, hp, currentHp: hp });
  save();
  render();
}

function removeParticipant(i) {
  data.turns.splice(i, 1);
  save();
  render();
}

function sortInitiative() {
  data.turns.sort((a, b) => b.init - a.init);
  save();
  render();
}

function nextTurn() {
  if (data.turns.length === 0) return;
  currentTurn = (currentTurn + 1) % data.turns.length;
  render();
}

function clearTurnIndicator() {
  currentTurn = 0;
  render();
}

function adjustHp(i, delta) {
  data.turns[i].currentHp = Math.max(0, data.turns[i].currentHp + delta);
  save();
  render();
}

function applyBulkDamage() {
  const val = parseInt(document.getElementById("bulk-damage").value) || 0;
  const target = document.getElementById("bulk-target").value;
  data.turns.forEach((p) => {
    if (target === "all" || p.type === target) {
      p.currentHp = Math.max(0, p.currentHp - val);
    }
  });
  save();
  render();
}

function healAll() {
  data.turns.forEach((p) => (p.currentHp = p.hp));
  save();
  render();
}

function addPlayerMonster() {
  const name = document.getElementById("m-name").value.trim();
  if (!name) return alert("Informe o nome do monstro!");
  data.playerMonsters.push({ name, total: 0 });
  save();
  render();
}

function damageMonster(i, val) {
  data.playerMonsters[i].total += val;
  save();
  render();
}

function removeMonster(i) {
  data.playerMonsters.splice(i, 1);
  save();
  render();
}

function resetAll() {
  if (confirm("Deseja realmente apagar todos os dados?")) {
    localStorage.removeItem("rpgData");
    data = { turns: [], playerMonsters: [] };
    render();
  }
}

function render() {
  const turnList = document.getElementById("turn-list");
  const hpList = document.getElementById("hp-list");
  const turnListPlayer = document.getElementById("turn-list-player");
  const playerMonsters = document.getElementById("player-monsters");

  turnList.innerHTML = data.turns
    .map(
      (p, i) => `
    <div class="entity ${i === currentTurn ? "current" : ""}">
      <div class="left">
        <div class="badge">${p.init}</div>
        <div>
          <div>${p.name}</div>
          <div class="muted">${p.type}</div>
        </div>
      </div>
      <div class="controls">
        <button class="btn" onclick="removeParticipant(${i})">✖</button>
      </div>
    </div>`
    )
    .join("");

  hpList.innerHTML = data.turns
    .map(
      (p, i) => `
    <div class="entity">
      <div>${p.name}</div>
      <div>${p.currentHp}/${p.hp}</div>
      <div class="controls">
        <button class="btn" onclick="adjustHp(${i},-1)">-</button>
        <button class="btn" onclick="adjustHp(${i},1)">+</button>
      </div>
    </div>`
    )
    .join("");

  turnListPlayer.innerHTML = turnList.innerHTML;
  playerMonsters.innerHTML = data.playerMonsters
    .map(
      (m, i) => `
    <div class="entity">
      <div>${m.name}</div>
      <div>${m.total} dmg</div>
      <div class="controls">
        <button class="btn" onclick="damageMonster(${i},1)">+1</button>
        <button class="btn" onclick="damageMonster(${i},5)">+5</button>
        <button class="btn" onclick="removeMonster(${i})">✖</button>
      </div>
    </div>`
    )
    .join("");

  document.getElementById("count-total").innerText = data.turns.length;
}

render();
