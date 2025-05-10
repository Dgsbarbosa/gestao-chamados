# Sistema de Gestão de Chamados de Manutenção

Um sistema profissional para gerenciar chamados de manutenção, utilizando HTML, CSS e JavaScript puro no frontend, integrado ao Google Sheets como backend através do Google Apps Script.

## Características

- **Interface Responsiva**: Design otimizado para desktop, tablet e dispositivos móveis
- **Autenticação Simples**: Controle de acesso baseado em usuários cadastrados no Google Sheets
- **Permissões**: Níveis de acesso diferenciados para leitores e editores
- **CRUD Completo**: Criação, leitura, atualização e listagem de chamados de manutenção
- **Filtros Avançados**: Busca por status, prioridade, técnico e termos gerais
- **Zero Dependências Externas**: Desenvolvido com vanilla JavaScript, sem frameworks

## Estrutura do Projeto

```
/
├── css/
│   ├── styles.css       # Estilos globais
│   ├── login.css        # Estilos da página de login
│   ├── dashboard.css    # Estilos do painel principal
│   └── forms.css        # Estilos dos formulários
├── js/
│   ├── config.js        # Configurações gerais
│   ├── utils.js         # Funções utilitárias
│   ├── api.js           # Serviço de API para Google Apps Script
│   ├── auth.js          # Gerenciamento de autenticação
│   ├── components/      # Componentes reutilizáveis
│   │   ├── navbar.js
│   │   ├── ticketList.js
│   │   ├── ticketForm.js
│   │   └── filterBar.js
│   ├── views/           # Visualizações principais
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── create.js
│   │   └── edit.js
│   └── app.js           # Aplicação principal e roteamento
├── google-apps-script.js # Código para o backend do Google Apps Script
├── index.html           # Ponto de entrada da aplicação
└── README.md            # Documentação
```

## Configuração do Backend (Google Sheets)

1. Crie uma nova planilha no Google Sheets com duas abas:
   - **Chamados**: Para armazenar os registros de chamados
   - **Usuarios**: Para armazenar informações de autenticação

2. Configure as colunas:
   - **Chamados**: solicitante, setor, descricao, prioridade, tecnico, status, data
   - **Usuarios**: usuario, senha, nome, permissao

3. Abra o editor de scripts do Google Apps Script:
   - Menu "Extensões" > "Apps Script"
   - Cole o código do arquivo `google-apps-script.js` no editor
   - Salve e implante como aplicativo web
   - Configure para "Executar como: Eu" e "Quem tem acesso: Qualquer pessoa"

4. Copie a URL do aplicativo web e atualize a configuração em `js/config.js`

## Uso

1. Faça login com as credenciais cadastradas na planilha
2. Navegue pelo painel para visualizar chamados existentes
3. Use os filtros para localizar chamados específicos
4. Crie novos chamados através do botão "Novo Chamado"
5. Edite chamados existentes se tiver permissão de editor

## Publicação no Vercel

Para publicar este projeto no Vercel:

1. Faça upload do código para um repositório Git
2. Conecte o repositório ao Vercel
3. Configure o diretório raiz como diretório de publicação
4. Defina o comando de build como `echo "No build required"`
5. Implante o projeto

---

Desenvolvido com ❤️ para gerenciamento eficiente de chamados de manutenção.