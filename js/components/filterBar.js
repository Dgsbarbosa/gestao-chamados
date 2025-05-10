/**
 * Filter Bar Component
 */
const filterBar = {
  /**
   * Initialize filter bar
   * @param {Object} options - Filter options
   * @returns {Object} - Filter bar controller
   */
  init(options = {}) {
    // Default options
    const defaultOptions = {
      onFilter: () => {}, // Filter handler
      initialFilters: {}, // Initial filter values
      showSearchField: true // Whether to show search field
    };
    
    // Merge options
    const filterOptions = { ...defaultOptions, ...options };
    
    // Current filter values
    let filters = { ...filterOptions.initialFilters };
    
    /**
     * Render the filter bar
     * @returns {HTMLElement} - Filter bar element
     */
    const render = () => {
      const filterBarElement = createElement('div', { className: 'filter-bar' }, [
        // Status filter
        createElement('div', { className: 'filter-group' }, [
          createElement('label', { 
            className: 'filter-label',
            htmlFor: 'filter-status',
            textContent: 'Status'
          }),
          createElement('select', {
            id: 'filter-status',
            className: 'filter-select',
            name: 'status',
            onChange: handleFilterChange
          }, [
            createElement('option', { value: '', textContent: 'Todos' }),
            ...config.statusOptions.map(option => 
              createElement('option', {
                value: option.value,
                textContent: option.label,
                selected: filters.status === option.value
              })
            )
          ])
        ]),
        
        // Priority filter
        createElement('div', { className: 'filter-group' }, [
          createElement('label', { 
            className: 'filter-label',
            htmlFor: 'filter-priority',
            textContent: 'Prioridade'
          }),
          createElement('select', {
            id: 'filter-priority',
            className: 'filter-select',
            name: 'prioridade',
            onChange: handleFilterChange
          }, [
            createElement('option', { value: '', textContent: 'Todas' }),
            ...config.priorityOptions.map(option => 
              createElement('option', {
                value: option.value,
                textContent: option.label,
                selected: filters.prioridade === option.value
              })
            )
          ])
        ]),
        
        // Technician filter
        createElement('div', { className: 'filter-group' }, [
          createElement('label', { 
            className: 'filter-label',
            htmlFor: 'filter-technician',
            textContent: 'Técnico'
          }),
          createElement('input', {
            type: 'text',
            id: 'filter-technician',
            className: 'filter-select',
            name: 'tecnico',
            placeholder: 'Nome do técnico',
            value: filters.tecnico || '',
            onChange: handleFilterChange
          })
        ]),
        
        // Search field (conditional)
        ...(filterOptions.showSearchField ? [
          createElement('div', { className: 'filter-group' }, [
            createElement('label', { 
              className: 'filter-label',
              htmlFor: 'filter-search',
              textContent: 'Buscar'
            }),
            createElement('input', {
              type: 'text',
              id: 'filter-search',
              className: 'filter-select',
              name: 'search',
              placeholder: 'Buscar chamados...',
              value: filters.search || '',
              onChange: handleFilterChange
            })
          ])
        ] : []),
        
        // Apply filters button
        createElement('button', {
          className: 'btn btn-primary filter-btn',
          textContent: 'Aplicar Filtros',
          onClick: applyFilters
        })
      ]);
      
      return filterBarElement;
    };
    
    /**
     * Handle filter change
     * @param {Event} e - Change event
     */
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      
      // Update filters
      filters = {
        ...filters,
        [name]: value
      };
    };
    
    /**
     * Apply current filters
     */
    const applyFilters = () => {
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      // Call filter handler
      filterOptions.onFilter(activeFilters);
    };
    
    /**
     * Update filters
     * @param {Object} newFilters - New filter values
     */
    const updateFilters = (newFilters) => {
      filters = {
        ...filters,
        ...newFilters
      };
    };
    
    /**
     * Reset all filters
     */
    const resetFilters = () => {
      filters = {};
      applyFilters();
    };
    
    // Return controller
    return {
      render,
      updateFilters,
      resetFilters,
      getFilters: () => filters
    };
  }
};