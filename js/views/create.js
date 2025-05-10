/**
 * Create Ticket View
 */
const createTicketView = {
  // Form instance
  formInstance: null,
  
  /**
   * Render the create ticket view
   * @returns {HTMLElement} - Create ticket view element
   */
  render() {
    // Create container
    const createElement = createElement('div', {});
    
    // Add navbar
    createElement.appendChild(navbar.render());
    
    // Create main content container
    const mainContent = createElement('main', { className: 'main-content' });
    const container = createElement('div', { className: 'container' });
    
    // Initialize form
    this.formInstance = ticketForm.init({
      mode: 'create',
      initialData: {
        status: 'pendente',
        prioridade: 'media'
      },
      onSubmit: this.handleCreateTicket.bind(this),
      onCancel: () => navigateTo('/dashboard')
    });
    
    // Add form to container
    container.appendChild(this.formInstance.render());
    
    // Add main content to view
    mainContent.appendChild(container);
    createElement.appendChild(mainContent);
    
    return createElement;
  },
  
  /**
   * Handle create ticket submission
   * @param {Object} ticketData - Ticket form data
   */
  async handleCreateTicket(ticketData) {
    try {
      // Add timestamp
      const data = {
        ...ticketData,
        data: new Date().toISOString()
      };
      
      // Submit to API
      await api.createTicket(data);
      
      // Show success message
      showNotification('Chamado criado com sucesso!', 'success');
      
      // Redirect to dashboard
      navigateTo('/dashboard');
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      
      // Show error message
      showNotification(
        error.message || 'Erro ao criar chamado. Tente novamente.',
        'error'
      );
      
      // Rethrow to let form handle error state
      throw error;
    }
  }
};