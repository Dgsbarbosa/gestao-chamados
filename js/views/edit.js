/**
 * Edit Ticket View
 */
const editTicketView = {
  // Ticket ID to edit
  ticketId: null,
  
  // Form instance
  formInstance: null,
  
  // Loaded ticket data
  ticketData: null,
  
  /**
   * Render the edit ticket view
   * @returns {HTMLElement} - Edit ticket view element
   */
  render() {
    // Get ticket ID from URL
    const params = getQueryParams();
    this.ticketId = params.id;
    
    // Create container
    const editElement = createElement('div', {});
    
    // Add navbar
    editElement.appendChild(navbar.render());
    
    // Create main content container
    const mainContent = createElement('main', { className: 'main-content' });
    const container = createElement('div', { className: 'container' });
    
    // Check if we have a ticket ID
    if (!this.ticketId) {
      container.appendChild(
        createElement('div', { className: 'alert alert-error' }, [
          createElement('p', { 
            textContent: 'ID do chamado não especificado. Volte para a lista de chamados e tente novamente.'
          }),
          createElement('div', { className: 'mt-4' }, [
            createElement('button', {
              className: 'btn btn-primary',
              textContent: 'Voltar para Dashboard',
              onClick: () => navigateTo('/dashboard')
            })
          ])
        ])
      );
    } else {
      // Loading state
      container.appendChild(
        createElement('div', { className: 'text-center mt-6', id: 'loadingIndicator' }, [
          createElement('div', { className: 'loader' }),
          createElement('p', { 
            className: 'mt-2',
            textContent: 'Carregando chamado...'
          })
        ])
      );
      
      // Form container (will be populated after loading)
      container.appendChild(
        createElement('div', { id: 'editFormContainer' })
      );
      
      // Load ticket data after rendering
      setTimeout(this.loadTicket.bind(this), 10);
    }
    
    // Add main content to view
    mainContent.appendChild(container);
    editElement.appendChild(mainContent);
    
    return editElement;
  },
  
  /**
   * Load ticket data from API
   */
  async loadTicket() {
    try {
      // Get ticket from API
      const response = await api.getTicket(this.ticketId);
      this.ticketData = response.data;
      
      // Initialize form with ticket data
      this.formInstance = ticketForm.init({
        mode: 'edit',
        initialData: this.ticketData,
        onSubmit: this.handleUpdateTicket.bind(this),
        onCancel: () => navigateTo('/dashboard')
      });
      
      // Remove loading indicator
      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      // Render form
      const formContainer = document.getElementById('editFormContainer');
      if (formContainer) {
        formContainer.appendChild(this.formInstance.render());
      }
      
    } catch (error) {
      console.error('Error loading ticket:', error);
      
      // Show error message
      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      const formContainer = document.getElementById('editFormContainer');
      if (formContainer) {
        formContainer.appendChild(
          createElement('div', { className: 'alert alert-error' }, [
            createElement('p', { 
              textContent: 'Erro ao carregar chamado. Tente novamente mais tarde.'
            }),
            createElement('div', { className: 'mt-4' }, [
              createElement('button', {
                className: 'btn btn-primary',
                textContent: 'Voltar para Dashboard',
                onClick: () => navigateTo('/dashboard')
              })
            ])
          ])
        );
      }
    }
  },
  
  /**
   * Handle update ticket submission
   * @param {Object} ticketData - Updated ticket form data
   */
  async handleUpdateTicket(ticketData) {
    try {
      // Submit update to API
      await api.updateTicket(this.ticketId, ticketData);
      
      // Show success message
      showNotification('Chamado atualizado com sucesso!', 'success');
      
      // Redirect to dashboard
      navigateTo('/dashboard');
      
    } catch (error) {
      console.error('Error updating ticket:', error);
      
      // Show error notification
      showNotification(
        error.message || 'Erro ao atualizar chamado. Tente novamente.',
        'error'
      );
      
      // Rethrow to let form handle error state
      throw error;
    }
  }
};