/**
 * Configuration settings for the application
 */
const config = {
  // API endpoints, replace with your actual Google Apps Script web app URL
  apiEndpoint: 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID/exec',
  
  // Local storage keys
  storageKeys: {
    authToken: 'manutenção_auth_token',
    userData: 'manutenção_user_data',
    theme: 'manutenção_theme'
  },
  
  // Status options for tickets
  statusOptions: [
    { value: 'pendente', label: 'Pendente', class: 'status-pending' },
    { value: 'em_andamento', label: 'Em Andamento', class: 'status-in-progress' },
    { value: 'concluido', label: 'Concluído', class: 'status-completed' },
    { value: 'urgente', label: 'Urgente', class: 'status-urgent' }
  ],
  
  // Priority options for tickets
  priorityOptions: [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' }
  ],
  
  // Default pagination settings
  pagination: {
    itemsPerPage: 10
  },
  
  // App version
  version: '1.0.0'
};