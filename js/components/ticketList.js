/**
 * Ticket List Component
 */
const ticketList = {
  /**
   * Render the ticket list
   * @param {Array} tickets - List of tickets
   * @param {Function} onEdit - Edit handler
   * @returns {HTMLElement} - Ticket list container
   */
  render(tickets = [], onEdit = null) {
    // Check if there are any tickets
    if (!tickets || tickets.length === 0) {
      return this.renderEmptyState();
    }
    
    // Create ticket list container
    const container = createElement('div', { className: 'ticket-list' });
    
    // Add each ticket as a card
    tickets.forEach(ticket => {
      container.appendChild(this.renderTicketCard(ticket, onEdit));
    });
    
    return container;
  },
  
  /**
   * Render a single ticket card
   * @param {Object} ticket - Ticket data
   * @param {Function} onEdit - Edit handler
   * @returns {HTMLElement} - Ticket card element
   */
  renderTicketCard(ticket, onEdit) {
    // Determine if user can edit tickets
    const canEdit = auth.hasPermission('edit');
    
    // Create the ticket card
    return createElement('div', { className: 'ticket-card' }, [
      // Header with ID and status
      createElement('div', { className: 'ticket-header' }, [
        createElement('div', {}, [
          createElement('div', { className: 'ticket-id', textContent: `#${ticket.id}` }),
          createElement('h3', { className: 'ticket-title', textContent: ticket.solicitante || 'Sem título' })
        ]),
        createElement('span', { 
          className: `status-badge ${getStatusClass(ticket.status)}`,
          textContent: getStatusLabel(ticket.status)
        })
      ]),
      
      // Ticket metadata
      createElement('div', { className: 'ticket-meta' }, [
        createElement('div', { className: 'meta-item' }, [
          createElement('span', { className: 'meta-label', textContent: 'Setor:' }),
          createElement('span', { className: 'meta-value', textContent: ticket.setor || '-' })
        ]),
        createElement('div', { className: 'meta-item' }, [
          createElement('span', { className: 'meta-label', textContent: 'Prioridade:' }),
          createElement('span', { className: 'meta-value', textContent: getPriorityLabel(ticket.prioridade) })
        ]),
        createElement('div', { className: 'meta-item' }, [
          createElement('span', { className: 'meta-label', textContent: 'Técnico:' }),
          createElement('span', { className: 'meta-value', textContent: ticket.tecnico || '-' })
        ])
      ]),
      
      // Ticket description
      createElement('div', { 
        className: 'ticket-description',
        textContent: ticket.descricao || 'Sem descrição'
      }),
      
      // Footer with date and actions
      createElement('div', { className: 'ticket-footer' }, [
        createElement('div', { 
          className: 'ticket-date',
          textContent: formatDate(ticket.data)
        }),
        
        // Actions
        createElement('div', { className: 'ticket-actions' }, [
          // Edit button - only show if user has edit permission
          ...(canEdit ? [
            createElement('button', {
              className: 'btn btn-primary btn-sm',
              textContent: 'Editar',
              onClick: () => {
                if (onEdit) {
                  onEdit(ticket.id);
                } else {
                  navigateTo('/edit', { id: ticket.id });
                }
              }
            })
          ] : [])
        ])
      ])
    ]);
  },
  
  /**
   * Render empty state when no tickets are available
   * @returns {HTMLElement} - Empty state element
   */
  renderEmptyState() {
    return createElement('div', { className: 'no-tickets' }, [
      createElement('h3', { textContent: 'Nenhum chamado encontrado' }),
      createElement('p', { textContent: 'Não há chamados correspondentes aos filtros aplicados.' }),
      createElement('button', {
        className: 'btn btn-primary',
        textContent: 'Criar Novo Chamado',
        onClick: () => navigateTo('/create')
      })
    ]);
  }
};