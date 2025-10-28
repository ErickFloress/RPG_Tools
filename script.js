// ====================== CONTROLE DE TURNOS ======================
let turns = [];

function addTurn() {
  const name = document.getElementById("turn-name").value.trim();
  const init = parseInt(document.getElementById("turn-init").value);

  if (!name || isNaN(init)) return alert("Preencha nome e iniciativa!");

  turns.push({ name, init });
  turns.sort((a, b) => b.init - a.init); // ordem decrescente
  renderTurns();

  document.getElementById("turn-name").value = "";
  document.getElementById("turn-init").value = "";
}

function renderTurns() {
  const list = document.getElementById("turn-list");
  list.innerHTML = "";

  turns.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${t.name}</strong> — Iniciativa: 
        <input type="number" value="${t.init}" onchange="editInit(${i}, this.value)">
      </span>
      <button onclick="removeTurn(${i})">❌</button>
    `;
    list.appendChild(li);
  });
}

function editInit(index, value) {
  turns[index].init = parseInt(value);
  turns.sort((a, b) => b.init - a.init);
  renderTurns();
}

function removeTurn(index) {
  turns.splice(index, 1);
  renderTurns();
}

function resetTurns() {
  if (!confirm("Apagar todos os turnos?")) return;
  turns = [];
  renderTurns();
}

// ====================== CONTROLE DE VIDA ======================
let personagens = [];
let monstros = [];
let grupos = {};
let grupoAtual = null;

function addCharacter(tipo) {
  const nome = prompt(`Nome do ${tipo}:`);
  const vida = parseInt(prompt("Vida inicial:"));
  if (!nome || isNaN(vida)) return;

  const obj = { nome, vida, vidaInicial: vida };
  if (tipo === "personagem") personagens.push(obj);
  else monstros.push(obj);

  renderLives();
  autoSave();
}

function renderLives() {
  const charList = document.getElementById("char-list");
  const monsterList = document.getElementById("monster-list");

  charList.innerHTML = "";
  personagens.forEach((p, i) => {
    charList.innerHTML += `
      <li>
        <strong>${p.nome}</strong> — ${p.vida} HP
        <span class="hp-controls">
          <button onclick="changeLife('personagem', ${i}, -1)">-</button>
          <button onclick="changeLife('personagem', ${i}, 1)">+</button>
        </span>
      </li>`;
  });

  monsterList.innerHTML = "";
  monstros.forEach((m, i) => {
    monsterList.innerHTML += `
      <li>
        <strong>${m.nome}</strong> — ${m.vida} HP
        <span class="hp-controls">
          <button onclick="changeLife('monstro', ${i}, -1)">-</button>
          <button onclick="changeLife('monstro', ${i}, 1)">+</button>
        </span>
      </li>`;
  });
}

function changeLife(tipo, index, delta) {
  if (tipo === "personagem") personagens[index].vida += delta;
  else monstros[index].vida += delta;

  renderLives();
  autoSave();
}

function resetLives() {
  personagens.forEach(p => p.vida = p.vidaInicial);
  monstros.forEach(m => m.vida = m.vidaInicial);
  renderLives();
  autoSave();
}

function resetAllLives() {
  if (!confirm("Apagar todos os personagens e monstros?")) return;
  personagens = [];
  monstros = [];
  grupoAtual = null;
  grupos = {};
  localStorage.removeItem("rpgGrupos");
  renderLives();
  renderGroups();
}

// ====================== GRUPOS ======================
function saveGroup() {
  const nome = prompt("Nome do grupo:");
  if (!nome) return;

  grupos[nome] = {
    personagens: JSON.parse(JSON.stringify(personagens)),
    monstros: JSON.parse(JSON.stringify(monstros))
  };
  grupoAtual = nome;
  localStorage.setItem("rpgGrupos", JSON.stringify(grupos));
  renderGroups();
}

function loadGroup(nome) {
  const g = grupos[nome];
  if (!g) return;
  personagens = JSON.parse(JSON.stringify(g.personagens));
  monstros = JSON.parse(JSON.stringify(g.monstros));
  grupoAtual = nome;
  renderLives();
  autoSave();
}

function renderGroups() {
  const list = document.getElementById("group-list");
  list.innerHTML = "";
  Object.keys(grupos).forEach(nome => {
    const li = document.createElement("li");
    li.textContent = nome;
    li.onclick = () => loadGroup(nome);
    list.appendChild(li);
  });
}

function autoSave() {
  if (!grupoAtual) return;
  grupos[grupoAtual] = {
    personagens: JSON.parse(JSON.stringify(personagens)),
    monstros: JSON.parse(JSON.stringify(monstros))
  };
  localStorage.setItem("rpgGrupos", JSON.stringify(grupos));
}

// ====================== INICIALIZAÇÃO ======================
window.onload = () => {
  const saved = localStorage.getItem("rpgGrupos");
  if (saved) grupos = JSON.parse(saved);
  renderGroups();
};
