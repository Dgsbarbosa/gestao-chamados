/**
 * Login View
 */
const loginView = {
  /**
   * Render the login view
   * @returns {HTMLElement} - Login view element
   */
  render() {
    // Create login container
    const loginElement = createElement('div', { className: 'login-container' }, [
      createElement('div', { className: 'login-card' }, [
        // Logo/header
        createElement('div', { className: 'login-logo' }, [
          createElement('h1', { textContent: 'ManutençãoApp' }),
          createElement('p', { textContent: 'Sistema de Gestão de Chamados de Manutenção' })
        ]),
        
        // Login form
        createElement('form', { 
          id: 'loginForm',
          className: 'login-form',
          onSubmit: this.handleLogin
        }, [
          // Error message (hidden by default)
          createElement('div', { 
            id: 'loginError',
            className: 'error-message hidden'
          }),
          
          // Username field
          createElement('div', { className: 'form-group' }, [
            createElement('label', { 
              htmlFor: 'username',
              textContent: 'Usuário'
            }),
            createElement('input', {
              type: 'text',
              id: 'username',
              name: 'username',
              className: 'form-control',
              placeholder: 'Digite seu nome de usuário',
              required: true
            })
          ]),
          
          // Password field
          createElement('div', { className: 'form-group' }, [
            createElement('label', { 
              htmlFor: 'password',
              textContent: 'Senha'
            }),
            createElement('input', {
              type: 'password',
              id: 'password',
              name: 'password',
              className: 'form-control',
              placeholder: 'Digite sua senha',
              required: true
            })
          ]),
          
          // Submit button
          createElement('button', {
            type: 'submit',
            className: 'login-btn',
            id: 'loginButton',
            textContent: 'Entrar'
          })
        ]),
        
        // Footer
        createElement('div', { className: 'login-footer' }, [
          createElement('p', { 
            textContent: 'Sistema integrado com Google Sheets como Backend'
          })
        ])
      ])
    ]);
    
    return loginElement;
  },
  
  /**
   * Handle login form submission
   * @param {Event} e - Submit event
   */
  async handleLogin(e) {
    e.preventDefault();
    
    // Get form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Error element
    const errorElement = document.getElementById('loginError');
    
    // Button element
    const loginButton = document.getElementById('loginButton');
    
    // Hide any previous errors
    errorElement.classList.add('hidden');
    errorElement.textContent = '';
    
    // Disable button while processing
    loginButton.disabled = true;
    loginButton.textContent = 'Entrando...';
    
    try {
      // Attempt to log in
      await auth.login(username, password);
      
      // Login success is handled by auth.login (redirects to dashboard)
      
    } catch (error) {
      // Show error message
      errorElement.textContent = error.message || 'Usuário ou senha inválidos.';
      errorElement.classList.remove('hidden');
      
    } finally {
      // Re-enable button
      loginButton.disabled = false;
      loginButton.textContent = 'Entrar';
    }
  }
};