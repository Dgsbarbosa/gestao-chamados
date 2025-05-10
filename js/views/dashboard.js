/**
 * Dashboard View
 */
const dashboardView = {
  // Keep track of current filters
  currentFilters: {},
  
  // Keep track of tickets data
  ticketsData: [],
  
  // Filter bar instance
  filterBarInstance: null,
  
  /**
   * Render the dashboard view
   * @returns {HTMLElement} - Dashboard view element
   */
  async render() {
    // Create dashboard container
    const dashboardElement = createElement('div', {});
    
    // Add navbar
    dashboardElement.appendChild(navbar.render());
    
    // Create main content container
    const mainContent = createElement('main', { className: 'main-content' });
    const container = createElement('div', { className: 'container' });
    
    // Page header
    container.appendChild(
      createElement('div', { className: 'page-header' }, [
        createElement('h1', { className: 'page-title', textContent: 'Chamados de Manutenção' }),
        createElement('div', {}, [
          createElement('button', {
            className: 'btn btn-primary',
            textContent: 'Novo Chamado',
            onClick: () => navigateTo('/create')
          })
        ])
      ])
    );
    
    // Initialize filter bar
    this.filterBarInstance = filterBar.init({
      initialFilters: this.currentFilters,
      onFilter: this.applyFilters.bind(this)
    });
    
    // Add filter bar
    container.appendChild(this.filterBarInstance.render());
    
    // Loading state
    const loadingElement = createElement('div', { className: 'text-center mt-6' }, [
      createElement('div', { className: 'loader' }),
      createElement('p', { 
        className: 'mt-2',
        textContent: 'Carregando chamados...'
      })
    ]);
    
    container.appendChild(loadingElement);
    
    // Add ticket list container (will be populated later)
    const ticketListContainer = createElement('div', { id: 'ticketListContainer' });
    container.appendChild(ticketListContainer);
    
    // Add main content to dashboard
    mainContent.appendChild(container);
    dashboardElement.appendChild(mainContent);
    
    // Load tickets after rendering
    setTimeout(this.loadTickets.bind(this), 10);
    
    return dashboardElement;
  },
  
  /**
   * Load tickets from API
   */
  async loadTickets() {
    try {
      // Get tickets from API with current filters
      const response = await api.getTickets(this.currentFilters);
      this.ticketsData = response.data || [];
      
      // Update ticket list
      this.updateTicketList();
      
    } catch (error) {
      console.error('Error loading tickets:', error);
      
      // Show error message
      const ticketListContainer = document.getElementById('ticketListContainer');
      if (ticketListContainer) {
        ticketListContainer.innerHTML = '';
        ticketListContainer.appendChild(
          createElement('div', { className: 'alert alert-error' }, [
            createElement('p', { 
              textContent: 'Erro ao carregar chamados. Tente novamente mais tarde.'
            })
          ])
        );
      }
    } finally {
      // Remove loading state
      const loader = document.querySelector('.loader')?.parentElement;
      if (loader) {
        loader.remove();
      }
    }
  },
  
  /**
   * Update the ticket list with current data
   */
  updateTicketList() {
    const ticketListContainer = document.getElementById('ticketListContainer');
    if (!ticketListContainer) return;
    
    // Clear container
    ticketListContainer.innerHTML = '';
    
    // Add ticket list
    ticketListContainer.appendChild(
      ticketList.render(this.ticketsData, this.handleEditTicket)
    );
  },
  
  /**
   * Apply filters to ticket list
   * @param {Object} filters - Filter values
   */
  applyFilters(filters) {
    // Update current filters
    this.currentFilters = filters;
    
    // Update URL with filters
    navigateTo('/dashboard', filters);
    
    // Reload tickets with new filters
    this.loadTickets();
  },
  
  /**
   * Handle edit ticket action
   * @param {string} ticketId - Ticket ID
   */
  handleEditTicket(ticketId) {
    navigateTo('/edit', { id: ticketId });
  }
};