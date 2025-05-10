# Sistema de Gestão de Chamados - EQS Engenharia (Alpha)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Alpha](https://img.shields.io/badge/Status-Alpha-lightgrey)](https://en.wikipedia.org/wiki/Software_release_life_cycle#Alpha)

**Uma Solução Enxuta e Eficaz para Otimizar a Visualização dos Chamados de Manutenção**

Este projeto fornece um sistema fundamental para gerenciar chamados de manutenção dentro da EQS Engenharia. Ele foi projetado para ser um ponto de partida prático, aproveitando a acessibilidade e flexibilidade do Google Sheets para armazenamento de dados. Embora simples em sua arquitetura central, oferece funcionalidades essenciais com uma interface de usuário limpa e intuitiva.

## Funcionalidades Principais

- **Autenticação de Usuário:** Sistema de login seguro para proteger os dados dos chamados.
- **Gerenciamento de chamados:** Visualizar, filtrar, pesquisar e editar chamados de manutenção.
- **Exibição Dinâmica de Dados:** Atualizações em tempo real das informações dos chamados.
- **Filtragem e Ordenação:** Localize chamados eficientemente por status, prioridade e outros critérios.
- **Funcionalidade de Busca:** Encontre chamados rapidamente com base no código ou descrição.
- **Edição Administrativa:** Usuários autorizados podem modificar os detalhes dos chamados diretamente.
- **Design Responsivo:** Funciona perfeitamente em vários tamanhos de tela.

## Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Google Apps Script (para manipulação de dados e API)
- **Armazenamento de Dados:** Google Sheets

## Considerações Importantes (Transparência é Fundamental)

- **Google Sheets como Backend:** Este é um protótipo/MVP. Embora o Google Sheets ofereça desenvolvimento rápido e facilidade de uso, pode ter limitações em escalabilidade e desempenho para conjuntos de dados muito grandes ou cenários de alto tráfego.
- **Status Alpha:** Este projeto está em seus estágios iniciais. Espere possíveis bugs e áreas para melhoria. Contribuições e feedback são muito bem-vindos!

## Configurando e Usando o Sistema

### 1. Configuração do Google Sheets

- Crie uma nova planilha do Google Sheets para armazenar os dados dos seus chamados.
- A planilha **deve** ter cabeçalhos específicos correspondentes aos campos de dados (por exemplo, `id`, `codigo`, `descricao`, `status`, `prioridade`, `polo`, `data_criacao`). Consulte a seção **Estrutura de Dados** abaixo para obter detalhes.
- Abra o Editor de Script dentro do Google Sheets (`Extensões` > `Apps Script`).
- Copie e cole o código do Google Apps Script (fornecido separadamente) no editor.
- **Crucial:** Implante o script como um aplicativo da web. Você precisará:
  - Ir para "Implantar" -> "Nova implantação".
  - Selecionar "Aplicativo da Web" como o tipo.
  - Definir "Executar como" para "Eu (seu endereço de e-mail)".
  - Definir "Quem tem acesso" para "Qualquer pessoa com o link".
  - Clicar em "Implantar".
  - **Copiar o URL do aplicativo da web**. Este será o seu `API_URL`.
- No `script.js`, substitua o espaço reservado `API_URL` pelo URL que você copiou.

### 2. Alimentando Dados para o Google Sheet

- **Entrada Direta:** Inserir manualmente os dados dos chamados diretamente nas linhas do Google Sheet.
- **Importações Automatizadas:** Utilizar Google Apps Script para importar dados de outros sistemas (ex: CSV, bancos de dados).
- **Chamadas de API (Avançado):** Com scripts adicionais, é possível criar endpoints de API para adicionar/atualizar dados programaticamente.

### 3. Executando o Aplicativo

- Abra o arquivo `index.html` em um navegador da web.
- Os usuários podem fazer login com suas credenciais.
- O sistema exibirá e permitirá a interação com os dados dos chamados do Google Sheet.

## Estrutura de Dados (Cabeçalhos do Google Sheet)

A planilha do Google Sheet **deve** ter os seguintes cabeçalhos de coluna (case-sensitive recomendado):

- `id`: Identificador exclusivo (pode ser gerado automaticamente).
- `codigo`: Código ou número do ticket.
- `descricao`: Descrição detalhada do problema.
- `status`: Status do ticket (ex: "Aberto", "Em andamento", "Resolvido", "Fechado").
- `prioridade`: Prioridade do ticket (ex: "Baixa", "Média", "Alta", "Crítica").
- `polo`: Localização ou departamento.
- `data_criacao`: Data em que o ticket foi criado (formato: AAAA-MM-DD ou similar).
- _Outros campos personalizados, conforme necessário..._

## Aprimoramentos Futuros (A Visão)

Este projeto estabelece as bases para um sistema mais robusto. Melhorias potenciais incluem:

- **Integração de Banco de Dados:** Migração para banco dedicado (PostgreSQL, MySQL) para melhor desempenho.
- **Recursos Avançados:** Atribuição de chamados, notificações, relatórios e SLAs.
- **Segurança Aprimorada:** Autenticação/autorização mais robustas.
- **Expansão da API:** API mais completa para integração com outras ferramentas.

## Equipe

- **Douglas Barbosa** – Desenvolvedor Líder

## Agradecimentos

- EQS Engenharia pela oportunidade de desenvolver esta solução.
- Google por fornecer a plataforma Apps Script.

## Licença

Este projeto é licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).

## Aviso Legal

Esta é uma versão alfa. Use por sua conta e risco. Os desenvolvedores não se responsabilizam por perda de dados ou problemas decorrentes do uso deste software.
