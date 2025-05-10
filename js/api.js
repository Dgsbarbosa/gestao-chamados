/**
 * API service for interacting with the Google Apps Script backend
 */
const api = {
  /**
   * Base fetch function with common options
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} - Fetch promise
   */
  async fetch(endpoint, options = {}) {
    const url = `${config.apiEndpoint}?action=${endpoint}`;
    
    // Get authentication token if available
    const authToken = localStorage.getItem(config.storageKeys.authToken);
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...options.headers
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors'
      });
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  
  /**
   * Authenticate user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} - Authentication result
   */
  async login(username, password) {
    const response = await this.fetch('usuarios', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (response.token) {
      // Store auth token and user data
      localStorage.setItem(config.storageKeys.authToken, response.token);
      localStorage.setItem(config.storageKeys.userData, JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * Get user data from stored information
   * @returns {Object|null} - User data or null if not authenticated
   */
  getUserData() {
    const userData = localStorage.getItem(config.storageKeys.userData);
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem(config.storageKeys.authToken);
  },
  
  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem(config.storageKeys.authToken);
    localStorage.removeItem(config.storageKeys.userData);
  },
  
  /**
   * Get tickets with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Tickets data
   */
  async getTickets(filters = {}) {
    // Convert filters to query string
    const queryParams = new URLSearchParams(filters).toString();
    
    return this.fetch(`chamados${queryParams ? '&' + queryParams : ''}`);
  },
  
  /**
   * Get a single ticket by ID
   * @param {string} id - Ticket ID
   * @returns {Promise} - Ticket data
   */
  async getTicket(id) {
    return this.fetch(`chamados&id=${id}`);
  },
  
  /**
   * Create a new ticket
   * @param {Object} ticketData - Ticket data
   * @returns {Promise} - Result
   */
  async createTicket(ticketData) {
    return this.fetch('chamados', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },
  
  /**
   * Update an existing ticket
   * @param {string} id - Ticket ID
   * @param {Object} ticketData - Updated ticket data
   * @returns {Promise} - Result
   */
  async updateTicket(id, ticketData) {
    return this.fetch('chamados', {
      method: 'PUT',
      body: JSON.stringify({ id, ...ticketData })
    });
  },
  
  /**
   * Get available technicians
   * @returns {Promise} - Technicians data
   */
  async getTechnicians() {
    return this.fetch('tecnicos');
  }
};