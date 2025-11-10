export function initTurnos() {
  const playerNameInput = document.getElementById('playerName');
  const initiativeInput = document.getElementById('initiative');
  const addTurnBtn = document.getElementById('addTurn');
  const turnList = document.getElementById('turnList');
  const resetBtn = document.getElementById('resetTurns');

  // remover spinners de input[type=number]
  const style = document.createElement('style');
  style.textContent = `
    /* Chrome, Edge, Safari */
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `;
  document.head.appendChild(style);

  // Novo botão de controle de rodada
  const nextTurnBtn = document.createElement('button');
  nextTurnBtn.textContent = 'Próximo Turno';
  nextTurnBtn.id = 'nextTurn';
  nextTurnBtn.style.marginTop = '10px';
  turnList.parentElement.appendChild(nextTurnBtn);

  let turnos = [];
  let turnoAtual = 0;

  // Função para desenhar a lista
  function render() {
    turnList.innerHTML = '';

    // Ordena por iniciativa decrescente
    turnos.sort((a, b) => b.initiative - a.initiative);

    turnos.forEach((t, index) => {
      const li = document.createElement('li');
      li.classList.toggle('ativo', index === turnoAtual);
      li.innerHTML = `
        <span>${t.name} (${t.initiative})</span>
        <div class="turno-actions">
          <input type="number" value="${t.initiative}" class="edit-init">
          <button class="remove">❌</button>
        </div>
      `;

      // Editar iniciativa
      li.querySelector('.edit-init').addEventListener('change', (e) => {
        t.initiative = parseInt(e.target.value);
        render();
      });

      // Remover jogador
      li.querySelector('.remove').addEventListener('click', () => {
        turnos.splice(index, 1);
        if (turnoAtual >= turnos.length) turnoAtual = 0;
        render();
      });

      turnList.appendChild(li);
    });
  }

  // Adicionar novo jogador
  addTurnBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const initiative = parseInt(initiativeInput.value);
    if (name && !isNaN(initiative)) {
      turnos.push({ name, initiative });
      playerNameInput.value = '';
      initiativeInput.value = '';
      render();
    }
  });

  // Reiniciar todos os turnos
  resetBtn.addEventListener('click', () => { 
    if (confirm('Deseja apagar todos os turnos?')) {
      turnos = [];
      turnoAtual = 0;
      render();
    }
  });

  // Avançar turno
  nextTurnBtn.addEventListener('click', () => {
    if (turnos.length === 0) return;
    turnoAtual = (turnoAtual + 1) % turnos.length;
    render();
  });

  render();
}
