/**
 * Google Apps Script backend for maintenance ticket system
 * This code should be pasted into the Google Apps Script editor
 * linked to your Google Sheet.
 */

// Configuração das planilhas
const CONFIG = {
  SHEET_CHAMADOS: "Chamados",
  SHEET_USUARIOS: "Usuarios",
  TOKEN_SECRET: "ManutencaoApp2025Secret" // Segredo para geração de tokens
};

// Manipulador para solicitações web
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

// Função principal para processar solicitações
function handleRequest(e) {
  // Configurar CORS
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  
  // Adicionar headers de CORS
  response.addHeader('Access-Control-Allow-Origin', '*');
  response.addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    // Verificar se é uma solicitação OPTIONS (preflight)
    if (e.parameter.method === 'OPTIONS') {
      return response.setContent(JSON.stringify({ status: 'success' }));
    }
    
    // Roteamento baseado na ação solicitada
    const action = e.parameter.action || '';
    
    // Verificar autenticação (exceto para login)
    if (action !== 'usuarios' && e.parameter.method !== 'OPTIONS') {
      const authHeader = e.parameter.authorization || '';
      if (!verifyAuthToken(authHeader)) {
        return response.setContent(JSON.stringify({
          status: 'error',
          message: 'Não autorizado. Faça login para continuar.'
        }));
      }
    }
    
    let result;
    
    // Processar a ação solicitada
    if (action.includes('chamados')) {
      switch (e.method) {
        case 'GET':
          result = getChamados(e.parameter);
          break;
        case 'POST':
          result = criarChamado(e.postData.contents);
          break;
        case 'PUT':
          result = atualizarChamado(e.postData.contents);
          break;
        default:
          result = { status: 'error', message: 'Método não suportado' };
      }
    } else if (action === 'usuarios') {
      if (e.method === 'POST') {
        result = autenticarUsuario(e.postData.contents);
      } else {
        result = { status: 'error', message: 'Método não suportado para usuários' };
      }
    } else if (action === 'tecnicos') {
      result = getTecnicos();
    } else {
      result = { status: 'error', message: 'Ação não reconhecida' };
    }
    
    // Retornar resultado como JSON
    return response.setContent(JSON.stringify(result));
    
  } catch (error) {
    // Tratar erros
    return response.setContent(JSON.stringify({
      status: 'error',
      message: error.message || 'Ocorreu um erro ao processar a solicitação.'
    }));
  }
}

// Autenticação de usuários
function autenticarUsuario(postData) {
  if (!postData) {
    return { status: 'error', message: 'Dados de autenticação não fornecidos' };
  }
  
  const data = JSON.parse(postData);
  const username = data.username;
  const password = data.password;
  
  if (!username || !password) {
    return { status: 'error', message: 'Usuário e senha são obrigatórios' };
  }
  
  // Acessar planilha de usuários
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_USUARIOS);
  const values = sheet.getDataRange().getValues();
  
  // Procurar usuário
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === username && values[i][1] === password) {
      // Usuário encontrado, gerar token
      const userData = {
        usuario: values[i][0],
        nome: values[i][2] || values[i][0],
        permissao: values[i][3] || 'leitor'
      };
      
      const token = generateAuthToken(userData);
      
      return {
        status: 'success',
        message: 'Autenticação bem-sucedida',
        user: userData,
        token: token
      };
    }
  }
  
  // Usuário não encontrado ou credenciais inválidas
  return { status: 'error', message: 'Usuário ou senha inválidos' };
}

// Gerar token de autenticação
function generateAuthToken(userData) {
  const payload = {
    user: userData.usuario,
    role: userData.permissao,
    exp: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
  };
  
  // Gerar token simples (em produção, usaria JWT adequado)
  const tokenStr = JSON.stringify(payload);
  const encoded = Utilities.base64EncodeWebSafe(tokenStr);
  
  return encoded;
}

// Verificar token de autenticação
function verifyAuthToken(authHeader) {
  if (!authHeader) return false;
  
  // Extrair o token do header
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Decodificar token
    const decoded = Utilities.base64DecodeWebSafe(token);
    const payload = JSON.parse(decoded);
    
    // Verificar expiração
    if (payload.exp < new Date().getTime()) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

// Obter chamados com filtros opcionais
function getChamados(params) {
  // Acessar planilha de chamados
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_CHAMADOS);
  const values = sheet.getDataRange().getValues();
  
  // Cabeçalhos (primeira linha)
  const headers = values[0];
  
  // Converter dados em objetos
  let chamados = [];
  for (let i = 1; i < values.length; i++) {
    const chamado = {};
    for (let j = 0; j < headers.length; j++) {
      chamado[headers[j]] = values[i][j];
    }
    chamado.id = i; // Usar o índice da linha como ID
    chamados.push(chamado);
  }
  
  // Aplicar filtros se fornecidos
  if (params) {
    // Filtrar por status
    if (params.status) {
      chamados = chamados.filter(c => c.status === params.status);
    }
    
    // Filtrar por prioridade
    if (params.prioridade) {
      chamados = chamados.filter(c => c.prioridade === params.prioridade);
    }
    
    // Filtrar por técnico
    if (params.tecnico) {
      chamados = chamados.filter(c => 
        c.tecnico && c.tecnico.toLowerCase().includes(params.tecnico.toLowerCase())
      );
    }
    
    // Busca geral
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      chamados = chamados.filter(c => 
        (c.solicitante && c.solicitante.toLowerCase().includes(searchTerm)) ||
        (c.setor && c.setor.toLowerCase().includes(searchTerm)) ||
        (c.descricao && c.descricao.toLowerCase().includes(searchTerm)) ||
        (c.tecnico && c.tecnico.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filtrar por ID específico
    if (params.id) {
      chamados = chamados.filter(c => c.id.toString() === params.id);
    }
  }
  
  return {
    status: 'success',
    data: chamados
  };
}

// Criar um novo chamado
function criarChamado(postData) {
  if (!postData) {
    return { status: 'error', message: 'Dados do chamado não fornecidos' };
  }
  
  const data = JSON.parse(postData);
  
  // Validar campos obrigatórios
  if (!data.solicitante || !data.setor || !data.descricao || !data.status || !data.prioridade) {
    return { status: 'error', message: 'Campos obrigatórios não preenchidos' };
  }
  
  // Acessar planilha de chamados
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_CHAMADOS);
  
  // Obter cabeçalhos
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Criar novo registro
  const newRow = [];
  headers.forEach(header => {
    newRow.push(data[header] || '');
  });
  
  // Adicionar linha à planilha
  sheet.appendRow(newRow);
  
  return {
    status: 'success',
    message: 'Chamado criado com sucesso',
    data: { id: sheet.getLastRow() }
  };
}

// Atualizar um chamado existente
function atualizarChamado(postData) {
  if (!postData) {
    return { status: 'error', message: 'Dados do chamado não fornecidos' };
  }
  
  const data = JSON.parse(postData);
  
  // Validar ID do chamado
  if (!data.id) {
    return { status: 'error', message: 'ID do chamado não fornecido' };
  }
  
  // Validar campos obrigatórios
  if (!data.solicitante || !data.setor || !data.descricao || !data.status || !data.prioridade) {
    return { status: 'error', message: 'Campos obrigatórios não preenchidos' };
  }
  
  // Acessar planilha de chamados
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_CHAMADOS);
  
  // Obter cabeçalhos
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Verificar se o chamado existe
  const rowIndex = parseInt(data.id);
  if (rowIndex <= 1 || rowIndex > sheet.getLastRow()) {
    return { status: 'error', message: 'Chamado não encontrado' };
  }
  
  // Atualizar cada campo
  headers.forEach((header, i) => {
    if (data[header] !== undefined) {
      sheet.getRange(rowIndex, i + 1).setValue(data[header]);
    }
  });
  
  return {
    status: 'success',
    message: 'Chamado atualizado com sucesso'
  };
}

// Obter lista de técnicos
function getTecnicos() {
  // Em uma implementação completa, isso buscaria técnicos de uma planilha separada
  // Por simplicidade, retornamos uma lista fixa
  return {
    status: 'success',
    data: [
      { id: 1, nome: 'Carlos Silva' },
      { id: 2, nome: 'Ana Paula' },
      { id: 3, nome: 'Roberto Torres' },
      { id: 4, nome: 'Juliana Mendes' }
    ]
  };
}