export function initVida() {
    const charList = document.getElementById('charList');
    const monsterList = document.getElementById('monsterList');
    const addCharacterBtn = document.getElementById('addCharacter');
    const addMonsterBtn = document.getElementById('addMonster');
    const resetLifeBtn = document.getElementById('resetLife');
    const resetAllBtn = document.getElementById('resetAll');
    const saveGroupBtn = document.getElementById('saveGroup');
    const groupList = document.getElementById('groupList');
  
    let personagens = [];
    let monstros = [];
    let gruposSalvos = JSON.parse(localStorage.getItem('grupos')) || {};
  
    function render() {
      const renderList = (list, container, type) => {
        container.innerHTML = '';
        list.forEach((entidade, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${entidade.nome}: ${entidade.vidaAtual}/${entidade.vidaInicial}</span>
            <div>
              <button class="btn" data-action="add">+</button>
              <button class="btn" data-action="sub">-</button>
            </div>
          `;
          li.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
              if (btn.dataset.action === 'add') entidade.vidaAtual++;
              else entidade.vidaAtual--;
              render();
            });
          });
          container.appendChild(li);
        });
      };
      renderList(personagens, charList, 'personagem');
      renderList(monstros, monsterList, 'monstro');
    }
  
    function salvarLocal() {
      localStorage.setItem('grupos', JSON.stringify(gruposSalvos));
    }
  
    function renderGrupos() {
      groupList.innerHTML = '';
      Object.keys(gruposSalvos).forEach(nome => {
        const li = document.createElement('li');
        li.textContent = nome;
        li.addEventListener('click', () => {
          const grupo = gruposSalvos[nome];
          personagens = grupo.personagens;
          monstros = grupo.monstros;
          render();
        });
        groupList.appendChild(li);
      });
    }
  
    function adicionarEntidade(tipo) {
      const nome = prompt(`Nome do ${tipo}:`);
      const vida = parseInt(prompt('Vida máxima:'));
      if (!nome || isNaN(vida)) return;
      const entidade = { nome, vidaInicial: vida, vidaAtual: vida };
      if (tipo === 'personagem') personagens.push(entidade);
      else monstros.push(entidade);
      render();
    }
  
    addCharacterBtn.addEventListener('click', () => adicionarEntidade('personagem'));
    addMonsterBtn.addEventListener('click', () => adicionarEntidade('monstro'));
  
    resetLifeBtn.addEventListener('click', () => {
      personagens.forEach(p => (p.vidaAtual = p.vidaInicial));
      monstros.forEach(m => (m.vidaAtual = m.vidaInicial));
      render();
    });
  
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Apagar tudo?')) {
        personagens = [];
        monstros = [];
        render();
      }
    });
  
    saveGroupBtn.addEventListener('click', () => {
      const nome = prompt('Nome do grupo:');
      if (nome) {
        gruposSalvos[nome] = { personagens, monstros };
        salvarLocal();
        renderGrupos();
      }
    });
  
    render();
    renderGrupos();
  }
  