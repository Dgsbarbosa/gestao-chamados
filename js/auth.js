/**
 * Authentication service
 */
const auth = {
  /**
   * Check if the user is already authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return api.isAuthenticated();
  },
  
  /**
   * Get the current user's data
   * @returns {Object|null} - User data or null if not authenticated
   */
  getCurrentUser() {
    return api.getUserData();
  },
  
  /**
   * Check if current user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} - Whether user has permission
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Check if user has the specified permission
    // In this system, we have 'leitor' and 'editor' roles
    if (permission === 'edit') {
      return user.permissao === 'editor';
    }
    
    // All authenticated users have read permission
    if (permission === 'read') {
      return true;
    }
    
    return false;
  },
  
  /**
   * Log in a user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} - Result with user data and token
   */
  async login(username, password) {
    try {
      const result = await api.login(username, password);
      
      // Redirect to dashboard after successful login
      if (result.token) {
        navigateTo('/dashboard');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout() {
    api.logout();
    navigateTo('/login');
  },
  
  /**
   * Initialize authentication - check token and redirect if needed
   */
  init() {
    const isLoginPage = window.location.pathname === '/login' || 
                         window.location.pathname === '/';
    
    // If on login page but already authenticated, redirect to dashboard
    if (isLoginPage && this.isAuthenticated()) {
      navigateTo('/dashboard');
      return;
    }
    
    // If on protected page but not authenticated, redirect to login
    if (!isLoginPage && !this.isAuthenticated()) {
      navigateTo('/login');
      return;
    }
  }
};