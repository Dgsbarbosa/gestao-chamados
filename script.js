/**
 * Sistema de Gestão de Chamados - EQS Engenharia
 * ----------------------------------------------
 * Este script contém todas as funções necessárias para o
 * funcionamento do sistema de gestão de chamados,
 * incluindo autenticação, carregamento de dados, filtragem,
 * busca e edição de chamados.
 */

// Configuração da API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwu-uWuqdhHvaeilDR7FIPnP3mnhGGE054zzxVu4tbI1Icyi65L9ol_0GVCvngpj6V76w/exec";

// Variáveis globais
let chamadosData = []; // Dados originais dos chamados
let chamadosFiltrados = []; // Dados filtrados para exibição
let colunas = []; // Colunas da tabela
let isAdmin = false; // Flag para controle de permissões
let usuarioAtual = ""; // Nome do usuário logado
let ordenacao = { coluna: "", direcao: "asc" }; // Estado da ordenação
let senhaAtual = null;

function formatarDataBrasileira(data) {
  if (!data) return "";
  
  const d = new Date(data);
  if (isNaN(d)) return data; // Se não for uma data válida, retorna como está

  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

/**
 * Realiza a autenticação do usuário
 */
async function login() {
  // Exibe o indicador de carregamento
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = "";

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  // Validação simples
  if (!usuario || !senha) {
    errorEl.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    // Altera o texto do botão para indicar carregamento
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';
    loginBtn.disabled = true;

    // Realiza a autenticação
    const res = await fetch(`${API_URL}?acao=login&usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`);
    const data = await res.json();

    // Restaura o botão
    loginBtn.innerHTML = originalText;
    loginBtn.disabled = false;

    // Verifica se a autenticação falhou
    if (data.error) {
      errorEl.textContent = data.error;
      return;
    }

    // Armazena informações do usuário
    usuarioAtual = usuario; // o e-mail usado no login
    senhaAtual = senha;     // a senha original
    nomeUsuario = data.nome || usuario; // nome completo do usuário (opcional)
    // Atualiza a interface
    document.getElementById('user-name').textContent = usuarioAtual;
    document.getElementById('admin-badge').style.display = isAdmin ? 'inline-flex' : 'none';

    // Mostra a aplicação principal e esconde o login
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';

    // Carrega os dados dos chamados
    await carregarChamados();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    errorEl.textContent = "Erro de conexão. Tente novamente mais tarde.";
    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerHTML = 'Entrar <i class="fas fa-sign-in-alt"></i>';
    loginBtn.disabled = false;
  }
}

/**
 * Realiza o logout do usuário
 */
function logout() {
  // Limpa os dados e reseta o estado da aplicação
  chamadosData = [];
  chamadosFiltrados = [];
  isAdmin = false;
  usuarioAtual = "";

  // Reseta os filtros
  resetarFiltros();

  // Limpa os campos de login
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
  document.getElementById('login-error').textContent = '';

  // Esconde a aplicação e mostra o login
  document.getElementById('app-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'flex';
}

/**
 * Carrega os dados dos chamados do servidor
 */
async function carregarChamados() {
  try {
    // Mostra o indicador de carregamento
    document.getElementById('loading-indicator').style.display = 'flex';
    document.getElementById('no-data-message').style.display = 'none';

    // Realiza a requisição para obter os chamados

    const res = await fetch(`${API_URL}?acao=listarChamados&usuario=${usuarioAtual}&senha=${senhaAtual}`);

    const data = await res.json();

    // Verifica se houve erro
    if (data.error) {
      alert(`Erro ao carregar chamados: ${data.error}`);
      document.getElementById('loading-indicator').style.display = 'none';
      return;
    }

    // Armazena os dados obtidos
    chamadosData = data.chamados || [];
    chamadosFiltrados = [...chamadosData];

    // Se não houver dados, exibe a mensagem
    if (chamadosData.length === 0) {
      document.getElementById('no-data-message').style.display = 'block';
      document.getElementById('loading-indicator').style.display = 'none';
      return;
    }

    // Obtém as colunas da tabela (baseado no primeiro registro)
    if (chamadosData.length > 0) {
      colunas = Object.keys(chamadosData[0]);
    }

    // Prepara os filtros
    prepararFiltros();

    // Renderiza a tabela com os dados
    renderizarTabela();

    // Esconde o indicador de carregamento
    document.getElementById('loading-indicator').style.display = 'none';

  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    alert("Erro de conexão ao carregar os chamados. Tente novamente mais tarde.");
    document.getElementById('loading-indicator').style.display = 'none';
  }
}

/**
 * Prepara os filtros com base nos dados carregados
 */
function prepararFiltros() {
  // Extrai valores únicos para os filtros
  const status = [...new Set(chamadosData.map(c => c.status || '').filter(Boolean))];
  const polos = [...new Set(chamadosData.map(c => c.polo || '').filter(Boolean))];
  const prioridades = [...new Set(chamadosData.map(c => c.prioridade || '').filter(Boolean))];

  // Função auxiliar para preencher os selects
  const preencherSelect = (id, valores) => {
    const select = document.getElementById(id);
    const valorAtual = select.value; // Preserva o valor selecionado, se houver

    // Limpa as opções, mantendo apenas a primeira (Todos)
    select.innerHTML = '<option value="">Todos</option>';

    // Adiciona as novas opções
    valores.forEach(valor => {
      const option = document.createElement('option');
      option.value = valor;
      option.textContent = valor;
      select.appendChild(option);
    });

    // Restaura o valor selecionado
    if (valorAtual && valores.includes(valorAtual)) {
      select.value = valorAtual;
    }
  };

  // Preenche os selects com os valores únicos
  preencherSelect('filter-status', status);
  preencherSelect('filter-polo', polos);
  preencherSelect('filter-prioridade', prioridades);
}

/**
 * Renderiza a tabela com os dados filtrados
 */
function renderizarTabela() {
  const tabela = document.getElementById('tabela-chamados');
  const thead = tabela.querySelector('thead tr');
  const tbody = tabela.querySelector('tbody');

  // Limpa a tabela
  thead.innerHTML = '';
  tbody.innerHTML = '';

  // Adiciona os cabeçalhos
  colunas.forEach(coluna => {
    const th = document.createElement('th');
    th.textContent = formatarColuna(coluna);

    // Adiciona classe se esta coluna estiver ordenada
    if (ordenacao.coluna === coluna) {
      th.classList.add('sorted');
      if (ordenacao.direcao === 'desc') {
        th.classList.add('desc');
      }
    }

    // Adiciona o evento de clique para ordenação
    th.addEventListener('click', () => ordenarTabela(coluna));

    thead.appendChild(th);
  });

  // Adiciona os dados
  chamadosFiltrados.forEach(chamado => {
    const tr = document.createElement('tr');

    // Se for admin, adiciona o evento de clique para edição
    if (isAdmin) {
      tr.addEventListener('click', () => abrirModalEdicao(chamado));
    }

    // Adiciona as células com os valores
    colunas.forEach(coluna => {
      const td = document.createElement('td');
      const valor = chamado[coluna] || '';

      
      // Formata células especiais
      if (coluna === 'status') {
        const statusNormalizado = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
        const statusClass = `status status-${statusNormalizado.toLowerCase().replace(/\s+/g, '-')}`;

        td.innerHTML = `<span class="${statusClass}">${valor}</span>`;
      } else if (coluna === 'prioridade') {
        const prioridadeClass = `prioridade prioridade-${valor.toLowerCase().replace(/\s+/g, '-')}`;
        td.innerHTML = `<span class="${prioridadeClass}">${valor}</span>`;
      } else {
        if (coluna.includes('data')) {
  td.textContent = formatarDataBrasileira(valor);
} else {
  td.textContent = valor;
}

      }

      // Se for admin, marca como editável (exceto campos especiais)
      if (isAdmin && !['id', 'codigo', 'data_criacao'].includes(coluna)) {
        td.classList.add('editable');
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // Exibe mensagem se não houver dados após a filtragem
  if (chamadosFiltrados.length === 0) {
    document.getElementById('no-data-message').style.display = 'block';
  } else {
    document.getElementById('no-data-message').style.display = 'none';
  }
}

/**
 * Formata o nome da coluna para exibição
 */
function formatarColuna(coluna) {
  // Substitui underscores por espaços e capitaliza
  return coluna
    .replace(/_/g, ' ')
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

/**
 * Aplica os filtros na tabela
 */
function aplicarFiltros() {
  // Obtém os valores dos filtros
  const status = document.getElementById('filter-status').value;
  const polo = document.getElementById('filter-polo').value;
  const prioridade = document.getElementById('filter-prioridade').value;
  const dataInicio = document.getElementById('filter-data-inicio').value;
  const dataFim = document.getElementById('filter-data-fim').value;

  // Filtra os dados
  chamadosFiltrados = chamadosData.filter(chamado => {
    // Filtra por status
    if (status && chamado.status !== status) return false;

    // Filtra por polo
    if (polo && chamado.polo !== polo) return false;

    // Filtra por prioridade
    if (prioridade && chamado.prioridade !== prioridade) return false;

    // Filtra por data
    if (dataInicio || dataFim) {
      // Verifica se a coluna 'data_criacao' existe
      if (!chamado.data_criacao) return true;

      const dataChamado = new Date(chamado.data_criacao);

      // Filtra pela data de início
      if (dataInicio) {
        const dataInicioObj = new Date(dataInicio);
        if (dataChamado < dataInicioObj) return false;
      }

      // Filtra pela data de fim
      if (dataFim) {
        const dataFimObj = new Date(dataFim);
        dataFimObj.setHours(23, 59, 59); // Final do dia
        if (dataChamado > dataFimObj) return false;
      }
    }

    return true;
  });

  // Aplica a ordenação atual, se existir
  if (ordenacao.coluna) {
    ordenarPor(ordenacao.coluna, ordenacao.direcao);
  }

  // Atualiza a tabela
  renderizarTabela();
}

/**
 * Aplica a busca de texto
 */
function aplicarBusca() {
  // Obtém o texto da busca
  const termoBusca = document.getElementById('search-input').value.toLowerCase().trim();

  // Se o termo estiver vazio, apenas aplica os outros filtros
  if (!termoBusca) {
    aplicarFiltros();
    return;
  }

  // Aplica os outros filtros primeiro
  aplicarFiltros();

  // Filtra pelo termo de busca
  chamadosFiltrados = chamadosFiltrados.filter(chamado => {
    // Busca no código
    if (chamado.codigo && chamado.codigo.toString().toLowerCase().includes(termoBusca)) {
      return true;
    }

    // Busca na descrição
    if (chamado.descricao && chamado.descricao.toLowerCase().includes(termoBusca)) {
      return true;
    }

    return false;
  });

  // Atualiza a tabela
  renderizarTabela();
}

/**
 * Reseta todos os filtros
 */
function resetarFiltros() {
  // Limpa os campos de filtro
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-polo').value = '';
  document.getElementById('filter-prioridade').value = '';
  document.getElementById('filter-data-inicio').value = '';
  document.getElementById('filter-data-fim').value = '';
  document.getElementById('search-input').value = '';

  // Restaura todos os dados
  chamadosFiltrados = [...chamadosData];

  // Limpa a ordenação
  ordenacao = { coluna: '', direcao: 'asc' };

  // Atualiza a tabela
  renderizarTabela();
}

/**
 * Ordena a tabela pela coluna clicada
 */
function ordenarTabela(coluna) {
  // Alterna a direção se a mesma coluna for clicada
  if (ordenacao.coluna === coluna) {
    ordenacao.direcao = ordenacao.direcao === 'asc' ? 'desc' : 'asc';
  } else {
    ordenacao.coluna = coluna;
    ordenacao.direcao = 'asc';
  }

  // Aplica a ordenação
  ordenarPor(coluna, ordenacao.direcao);

  // Atualiza a tabela
  renderizarTabela();
}

/**
 * Ordena os dados por uma coluna específica
 */
function ordenarPor(coluna, direcao) {
  chamadosFiltrados.sort((a, b) => {
    const valorA = a[coluna] || '';
    const valorB = b[coluna] || '';

    // Compara baseado no tipo
    let comparacao = 0;

    // Se forem datas
    if (coluna.includes('data')) {
      comparacao = new Date(valorA) - new Date(valorB);
    }
    // Se forem números
    else if (!isNaN(valorA) && !isNaN(valorB)) {
      comparacao = Number(valorA) - Number(valorB);
    }
    // Se forem strings
    else {
      comparacao = String(valorA).localeCompare(String(valorB));
    }

    // Inverte se a direção for decrescente
    return direcao === 'asc' ? comparacao : -comparacao;
  });
}

/**
 * Abre o modal de edição para um chamado
 */
function abrirModalEdicao(chamado) {
  // Verifica se o usuário tem permissão
  if (!isAdmin) return;

  const modal = document.getElementById('edit-modal');
  const form = document.getElementById('edit-form');

  // Limpa o formulário
  form.innerHTML = '';

  // Cria os campos do formulário
  colunas.forEach(coluna => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    // Para descrição, usa o espaço inteiro
    if (coluna === 'descricao') {
      formGroup.className += ' full-width';
    }

    const label = document.createElement('label');
    label.textContent = formatarColuna(coluna);
    label.setAttribute('for', `edit-${coluna}`);

    let input;

    // Campos especiais
    if (coluna === 'descricao') {
      input = document.createElement('textarea');
    } else if (coluna === 'status') {
      input = document.createElement('select');
      ['Aberto', 'Em andamento', 'Resolvido', 'Fechado'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        input.appendChild(option);
      });
    } else if (coluna === 'prioridade') {
      input = document.createElement('select');
      ['Baixa', 'Media', 'Alta', 'Critica'].forEach(prioridade => {
        const option = document.createElement('option');
        option.value = prioridade;
        option.textContent = prioridade;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }

    // Configura o input
    input.id = `edit-${coluna}`;
    input.name = coluna;
    input.value = chamado[coluna] || '';

    // Campos não editáveis
    if (['id', 'codigo', 'data_criacao'].includes(coluna)) {
      input.readOnly = true;
    }

    // Adiciona ao form
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  // Armazena o ID do chamado no formulário
  form.dataset.chamadoId = chamado.id || chamado.codigo;

  // Exibe o modal
  modal.style.display = 'flex';
}

/**
 * Fecha o modal de edição
 */
function fecharModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

/**
 * Salva as alterações feitas no modal de edição
 */
async function salvarEdicao() {
  try {
    const form = document.getElementById('edit-form');
    const chamadoId = form.dataset.chamadoId;

    // Coleta os dados do formulário
    const dadosEditados = {};
    colunas.forEach(coluna => {
      const input = document.getElementById(`edit-${coluna}`);
      if (input && !input.readOnly) {
        dadosEditados[coluna] = input.value;
      }
    });

    // Adiciona o ID do chamado
    dadosEditados.id = chamadoId;

    // Altera o texto do botão para indicar salvamento
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    saveBtn.disabled = true;

    // Envia para o servidor
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        acao: 'atualizarChamado',
        chamado: dadosEditados
      })
    });

    const data = await res.json();

    // Restaura o botão
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;

    // Verifica se houve erro
    if (data.error) {
      alert(`Erro ao salvar: ${data.error}`);
      return;
    }

    // Atualiza os dados locais
    const index = chamadosData.findIndex(c => (c.id || c.codigo) == chamadoId);
    if (index !== -1) {
      chamadosData[index] = { ...chamadosData[index], ...dadosEditados };

      // Atualiza também nos dados filtrados
      const indexFiltrado = chamadosFiltrados.findIndex(c => (c.id || c.codigo) == chamadoId);
      if (indexFiltrado !== -1) {
        chamadosFiltrados[indexFiltrado] = { ...chamadosFiltrados[indexFiltrado], ...dadosEditados };
      }
    }

    // Fecha o modal
    fecharModal();

    // Atualiza a tabela
    renderizarTabela();

    // Exibe mensagem de sucesso
    alert("Chamado atualizado com sucesso!");

  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    alert("Erro de conexão ao salvar as alterações. Tente novamente mais tarde.");
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Configura o evento de tecla Enter no login
  document.getElementById('senha').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      login();
    }
  });

  // Configura o evento de tecla Enter na busca
  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      aplicarBusca();
    }
  });

  // Fecha o modal ao clicar fora
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
      fecharModal();
    }
  });
});