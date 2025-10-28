// -----------------------------
// CONTROLE DE VIDA COM GRUPOS
// -----------------------------
let characters = [];
let groups = JSON.parse(localStorage.getItem("rpgGroups") || "{}");

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'vida') renderGroups();
}

function addCharacter() {
  const name = document.getElementById('char-name').value.trim();
  const hp = parseInt(document.getElementById('char-hp').value);

  if (!name || isNaN(hp)) return alert("Preencha nome e HP.");

  characters.push({ name, hp, baseHp: hp });
  document.getElementById('char-name').value = '';
  document.getElementById('char-hp').value = '';
  renderCharacters();
}

function renderCharacters() {
  const list = document.getElementById('life-list');
  list.innerHTML = '';
  characters.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'character';
    div.innerHTML = `
      <strong>${c.name}</strong>
      <div class="hp-controls">
        <button onclick="changeHp(${i}, -1)">-</button>
        <span>${c.hp} HP</span>
        <button onclick="changeHp(${i}, 1)">+</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function changeHp(index, delta) {
  characters[index].hp += delta;
  renderCharacters();
}

function resetHp() {
  characters.forEach(c => c.hp = c.baseHp);
  renderCharacters();
}

function resetAll() {
  if (confirm("Tem certeza que deseja apagar todos os personagens?")) {
    characters = [];
    renderCharacters();
  }
}

// -----------------------------
// SALVAMENTO DE GRUPOS
// -----------------------------
function saveGroup() {
  const name = document.getElementById('group-name').value.trim();
  if (!name) return alert("Digite um nome para o grupo.");
  if (characters.length === 0) return alert("Adicione personagens antes de salvar.");

  groups[name] = characters;
  localStorage.setItem("rpgGroups", JSON.stringify(groups));
  renderGroups();
  alert(`Grupo "${name}" salvo com sucesso!`);
}

function renderGroups() {
  const container = document.getElementById('group-list');
  container.innerHTML = '';

  Object.keys(groups).forEach(g => {
    const div = document.createElement('div');
    div.className = 'group-item';
    div.textContent = g;
    div.onclick = () => loadGroup(g);
    container.appendChild(div);
  });
}

function loadGroup(groupName) {
  characters = groups[groupName].map(c => ({ ...c }));
  renderCharacters();
  alert(`Grupo "${groupName}" carregado!`);
}

// -----------------------------
// CONTROLE DE TURNOS (sem mudança ainda)
// -----------------------------
let turnCharacters = [];
let currentTurnIndex = 0;

function addTurnCharacter() {
  const name = document.getElementById('turn-name').value.trim();
  const initiative = parseInt(document.getElementById('turn-init').value);

  if (!name || isNaN(initiative)) return alert("Preencha nome e iniciativa.");

  turnCharacters.push({ name, initiative });
  document.getElementById('turn-name').value = '';
  document.getElementById('turn-init').value = '';
  renderTurnCharacters();
}

function renderTurnCharacters() {
  const list = document.getElementById('turn-list');
  list.innerHTML = '';
  turnCharacters.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'turn-character' + (i === currentTurnIndex ? ' active' : '');
    div.innerHTML = `<strong>${c.name}</strong> <span>Iniciativa: ${c.initiative}</span>`;
    list.appendChild(div);
  });
}

function startTurnOrder() {
  if (turnCharacters.length === 0) return alert("Adicione pelo menos um personagem!");
  turnCharacters.sort((a, b) => b.initiative - a.initiative);
  currentTurnIndex = 0;
  updateCurrentTurn();
  renderTurnCharacters();
}

function nextTurn() {
  if (turnCharacters.length === 0) return;
  currentTurnIndex = (currentTurnIndex + 1) % turnCharacters.length;
  updateCurrentTurn();
  renderTurnCharacters();
}

function previousTurn() {
  if (turnCharacters.length === 0) return;
  currentTurnIndex = (currentTurnIndex - 1 + turnCharacters.length) % turnCharacters.length;
  updateCurrentTurn();
  renderTurnCharacters();
}

function updateCurrentTurn() {
  const current = turnCharacters[currentTurnIndex];
  document.getElementById('current-turn').textContent = `Turno atual: ${current.name}`;
}
