/**
 * Ticket Form Component
 */
const ticketForm = {
  /**
   * Initialize the form
   * @param {Object} options - Form options
   * @returns {Object} - Form controller
   */
  init(options = {}) {
    // Default options
    const defaultOptions = {
      mode: 'create', // 'create' or 'edit'
      initialData: {}, // Initial form data
      onSubmit: async (data) => {}, // Submit handler
      onCancel: () => navigateTo('/dashboard') // Cancel handler
    };
    
    // Merge options
    const formOptions = { ...defaultOptions, ...options };
    
    // Form element reference
    let formElement = null;
    
    // Form fields with validation rules
    const fields = {
      solicitante: { required: true },
      setor: { required: true },
      descricao: { required: true },
      prioridade: { required: true },
      tecnico: { required: false },
      status: { required: true }
    };
    
    // Form state
    let formState = {
      data: { ...formOptions.initialData },
      errors: {},
      isSubmitting: false,
      submitError: null,
      isSuccess: false
    };
    
    /**
     * Render the form
     * @returns {HTMLElement} - Form element
     */
    const render = () => {
      const isEditMode = formOptions.mode === 'edit';
      
      formElement = createElement('div', { className: 'form-container' }, [
        createElement('div', { className: 'form-card' }, [
          // Form title
          createElement('h2', { className: 'form-title' }, [
            isEditMode ? 'Editar Chamado' : 'Novo Chamado',
            createElement('div', { 
              className: 'form-subtitle',
              textContent: isEditMode 
                ? 'Atualize as informações do chamado abaixo'
                : 'Preencha o formulário para criar um novo chamado de manutenção'
            })
          ]),
          
          // Form fields
          createElement('form', { 
            id: 'ticketForm',
            onSubmit: handleSubmit
          }, [
            // Form grid
            createElement('div', { className: 'form-grid' }, [
              // Solicitante
              createFormGroup('solicitante', 'Nome do Solicitante', {
                type: 'text',
                placeholder: 'Digite o nome completo do solicitante',
                required: true,
                value: formState.data.solicitante || ''
              }),
              
              // Setor
              createFormGroup('setor', 'Setor', {
                type: 'text',
                placeholder: 'Departamento/Setor',
                required: true,
                value: formState.data.setor || ''
              }),
              
              // Descrição (full width)
              createElement('div', { className: 'form-group full-width' }, [
                createElement('label', { 
                  htmlFor: 'descricao',
                  className: 'required-label',
                  textContent: 'Descrição do Problema'
                }),
                createElement('textarea', {
                  id: 'descricao',
                  name: 'descricao',
                  placeholder: 'Descreva detalhadamente o problema',
                  required: true,
                  value: formState.data.descricao || '',
                  onChange: handleChange
                }),
                formState.errors.descricao ? 
                  createElement('div', { 
                    className: 'error-feedback',
                    textContent: formState.errors.descricao
                  }) : null
              ]),
              
              // Prioridade
              createElement('div', { className: 'form-group' }, [
                createElement('label', { 
                  className: 'required-label',
                  textContent: 'Prioridade'
                }),
                createElement('div', { className: 'priority-options' }, [
                  // Baixa
                  createElement('div', { className: 'priority-option' }, [
                    createElement('input', {
                      type: 'radio',
                      id: 'prioridade-baixa',
                      name: 'prioridade',
                      value: 'baixa',
                      checked: formState.data.prioridade === 'baixa',
                      onChange: handleChange
                    }),
                    createElement('label', {
                      htmlFor: 'prioridade-baixa',
                      textContent: 'Baixa'
                    })
                  ]),
                  
                  // Média
                  createElement('div', { className: 'priority-option' }, [
                    createElement('input', {
                      type: 'radio',
                      id: 'prioridade-media',
                      name: 'prioridade',
                      value: 'media',
                      checked: formState.data.prioridade === 'media',
                      onChange: handleChange
                    }),
                    createElement('label', {
                      htmlFor: 'prioridade-media',
                      textContent: 'Média'
                    })
                  ]),
                  
                  // Alta
                  createElement('div', { className: 'priority-option' }, [
                    createElement('input', {
                      type: 'radio',
                      id: 'prioridade-alta',
                      name: 'prioridade',
                      value: 'alta',
                      checked: formState.data.prioridade === 'alta',
                      onChange: handleChange
                    }),
                    createElement('label', {
                      htmlFor: 'prioridade-alta',
                      textContent: 'Alta'
                    })
                  ]),
                  
                  // Urgente
                  createElement('div', { className: 'priority-option' }, [
                    createElement('input', {
                      type: 'radio',
                      id: 'prioridade-urgente',
                      name: 'prioridade',
                      value: 'urgente',
                      checked: formState.data.prioridade === 'urgente',
                      onChange: handleChange
                    }),
                    createElement('label', {
                      htmlFor: 'prioridade-urgente',
                      textContent: 'Urgente'
                    })
                  ])
                ]),
                formState.errors.prioridade ? 
                  createElement('div', { 
                    className: 'error-feedback',
                    textContent: formState.errors.prioridade
                  }) : null
              ]),
              
              // Técnico
              createElement('div', { className: 'form-group' }, [
                createElement('label', { 
                  htmlFor: 'tecnico',
                  textContent: 'Técnico Responsável'
                }),
                createElement('input', {
                  type: 'text',
                  id: 'tecnico',
                  name: 'tecnico',
                  placeholder: 'Nome do técnico (opcional)',
                  value: formState.data.tecnico || '',
                  onChange: handleChange
                })
              ]),
              
              // Status
              createElement('div', { className: 'form-group' }, [
                createElement('label', { 
                  htmlFor: 'status',
                  className: 'required-label',
                  textContent: 'Status'
                }),
                createElement('select', {
                  id: 'status',
                  name: 'status',
                  required: true,
                  onChange: handleChange
                }, [
                  ...config.statusOptions.map(option => 
                    createElement('option', {
                      value: option.value,
                      textContent: option.label,
                      selected: formState.data.status === option.value
                    })
                  )
                ]),
                formState.errors.status ? 
                  createElement('div', { 
                    className: 'error-feedback',
                    textContent: formState.errors.status
                  }) : null
              ])
            ]),
            
            // Form actions
            createElement('div', { className: 'form-actions' }, [
              createElement('button', {
                type: 'button',
                className: 'btn btn-secondary',
                textContent: 'Cancelar',
                onClick: formOptions.onCancel
              }),
              createElement('button', {
                type: 'submit',
                className: 'btn btn-primary',
                disabled: formState.isSubmitting,
                textContent: formState.isSubmitting 
                  ? 'Salvando...' 
                  : (isEditMode ? 'Atualizar' : 'Criar Chamado')
              })
            ]),
            
            // Submit error
            formState.submitError ? 
              createElement('div', { 
                className: 'alert alert-error mt-4',
                textContent: formState.submitError
              }) : null
          ])
        ])
      ]);
      
      return formElement;
    };
    
    /**
     * Create a form group with label and input
     * @param {string} name - Field name
     * @param {string} label - Field label
     * @param {Object} inputProps - Input properties
     * @returns {HTMLElement} - Form group element
     */
    const createFormGroup = (name, label, inputProps) => {
      return createElement('div', { className: 'form-group' }, [
        createElement('label', { 
          htmlFor: name,
          className: fields[name].required ? 'required-label' : '',
          textContent: label
        }),
        createElement('input', {
          id: name,
          name: name,
          ...inputProps,
          onChange: handleChange
        }),
        formState.errors[name] ? 
          createElement('div', { 
            className: 'error-feedback',
            textContent: formState.errors[name]
          }) : null
      ]);
    };
    
    /**
     * Handle input change
     * @param {Event} e - Change event
     */
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      // Update form data
      let newValue = value;
      if (type === 'checkbox') {
        newValue = checked;
      } else if (type === 'radio') {
        newValue = value;
      }
      
      formState.data = {
        ...formState.data,
        [name]: newValue
      };
      
      // Clear error for this field
      if (formState.errors[name]) {
        formState.errors = {
          ...formState.errors,
          [name]: null
        };
      }
    };
    
    /**
     * Validate form data
     * @returns {boolean} - Validation result
     */
    const validateForm = () => {
      const errors = {};
      
      // Check required fields
      Object.entries(fields).forEach(([name, field]) => {
        if (field.required && (!formState.data[name] || formState.data[name].trim() === '')) {
          errors[name] = 'Este campo é obrigatório';
        }
      });
      
      // Update form state with errors
      formState.errors = errors;
      
      // Return validation result
      return Object.keys(errors).length === 0;
    };
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      try {
        // Set submitting state
        formState.isSubmitting = true;
        formState.submitError = null;
        
        // Call onSubmit handler
        await formOptions.onSubmit(formState.data);
        
        // Set success state
        formState.isSuccess = true;
        
      } catch (error) {
        // Set error state
        formState.submitError = error.message || 'Ocorreu um erro ao salvar o chamado.';
        
      } finally {
        // Reset submitting state
        formState.isSubmitting = false;
      }
    };
    
    /**
     * Update form data
     * @param {Object} newData - New form data
     */
    const updateData = (newData) => {
      formState.data = {
        ...formState.data,
        ...newData
      };
    };
    
    // Return form controller
    return {
      render,
      updateData,
      getFormData: () => formState.data
    };
  }
};