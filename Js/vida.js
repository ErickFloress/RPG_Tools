export function initVida() {
    const charList = document.getElementById('charList');
    const monsterList = document.getElementById('monsterList');
    const addEntityBtn = document.getElementById('addEntity');
    const nameInput = document.getElementById('entityName');
    const lifeInput = document.getElementById('entityLife');
    const monsterCheck = document.getElementById('isMonster');
    const resetLifeBtn = document.getElementById('resetLife');
    const resetAllBtn = document.getElementById('resetAll');
  
    let personagens = [];
    let monstros = [];
  
    function render() {
      const renderList = (list, container) => {
        container.innerHTML = '';
        list.forEach((entidade, index) => {
          const li = document.createElement('li');
          li.classList.add('vida-item');
          li.innerHTML = `
            <span class="vida-nome">${entidade.nome}: ${entidade.vidaAtual}/${entidade.vidaInicial}</span>
            <div class="vida-actions">
              <button class="btn" data-action="add">+</button>
              <button class="btn" data-action="sub">-</button>
              <button class="btn" data-action="set">❤️</button>
              <button class="btn remove" data-action="remove">❌</button>
            </div>
          `;
  
          li.querySelectorAll('button').forEach((btn) => {
            btn.addEventListener('click', () => {
              const action = btn.dataset.action;
              if (action === 'add') entidade.vidaAtual++;
              else if (action === 'sub') entidade.vidaAtual--;
              else if (action === 'set') {
                const valor = parseInt(prompt('Digite o valor para alterar a vida (ex: 25 ou -25):'));
                if (!isNaN(valor)) entidade.vidaAtual += valor;
              } else if (action === 'remove') {
                list.splice(index, 1);
              }
  
              if (entidade.vidaAtual < 0) entidade.vidaAtual = 0;
              if (entidade.vidaAtual > entidade.vidaInicial) entidade.vidaAtual = entidade.vidaInicial;
              render();
            });
          });
  
          container.appendChild(li);
        });
      };
  
      renderList(personagens, charList);
      renderList(monstros, monsterList);
    }
  
    function adicionarEntidade() {
      const nome = nameInput.value.trim();
      const vida = parseInt(lifeInput.value);
      const isMonster = monsterCheck.checked;
  
      if (!nome || isNaN(vida)) return alert('Preencha nome e vida corretamente.');
  
      const entidade = { nome, vidaInicial: vida, vidaAtual: vida };
      if (isMonster) monstros.push(entidade);
      else personagens.push(entidade);
  
      nameInput.value = '';
      lifeInput.value = '';
      monsterCheck.checked = false;
      render();
    }
  
    addEntityBtn.addEventListener('click', adicionarEntidade);
  
    resetLifeBtn.addEventListener('click', () => {
      personagens.forEach((p) => (p.vidaAtual = p.vidaInicial));
      monstros.forEach((m) => (m.vidaAtual = m.vidaInicial));
      render();
    });
  
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Apagar todos os personagens e monstros?')) {
        personagens = [];
        monstros = [];
        render();
      }
    });
  
    render();
  }
