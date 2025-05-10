/**
 * Navbar component
 */
const navbar = {
  /**
   * Render the navbar
   * @returns {HTMLElement} - Navbar element
   */
  render() {
    // Get current user data
    const user = auth.getCurrentUser();
    if (!user) return null;
    
    // Create navbar container
    const navbarElement = createElement('nav', { className: 'navbar' }, [
      createElement('div', { className: 'container navbar-container' }, [
        // Brand/logo
        createElement('a', { className: 'navbar-brand', href: '#', onClick: (e) => {
          e.preventDefault();
          navigateTo('/dashboard');
        }}, [
          createElement('h1', { textContent: 'ManutençãoApp' })
        ]),
        
        // Navigation items
        createElement('ul', { className: 'navbar-nav' }, [
          createElement('li', {}, [
            createElement('a', { 
              className: 'nav-link',
              href: '#',
              textContent: 'Dashboard',
              onClick: (e) => {
                e.preventDefault();
                navigateTo('/dashboard');
              }
            })
          ]),
          createElement('li', {}, [
            createElement('a', { 
              className: 'nav-link',
              href: '#',
              textContent: 'Novo Chamado',
              onClick: (e) => {
                e.preventDefault();
                navigateTo('/create');
              }
            })
          ]),
          
          // User menu
          createElement('li', { className: 'user-menu' }, [
            // User info trigger
            createElement('div', { 
              className: 'user-info',
              onClick: () => this.toggleUserMenu()
            }, [
              createElement('div', { className: 'user-details' }, [
                createElement('div', { className: 'user-name', textContent: user.nome || user.usuario }),
                createElement('div', { className: 'user-role', textContent: user.permissao === 'editor' ? 'Editor' : 'Leitor' })
              ])
            ]),
            
            // Dropdown menu
            createElement('div', { 
              className: 'dropdown-menu',
              id: 'userDropdown'
            }, [
              createElement('a', { 
                className: 'dropdown-item',
                href: '#',
                textContent: 'Sair',
                onClick: (e) => {
                  e.preventDefault();
                  auth.logout();
                }
              })
            ])
          ])
        ])
      ])
    ]);
    
    return navbarElement;
  },
  
  /**
   * Toggle user dropdown menu
   */
  toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
      
      // Add click outside listener to close menu
      if (dropdown.classList.contains('show')) {
        setTimeout(() => {
          document.addEventListener('click', this.closeUserMenu);
        }, 10);
      }
    }
  },
  
  /**
   * Close user dropdown menu when clicking outside
   * @param {Event} event - Click event
   */
  closeUserMenu(event) {
    const dropdown = document.getElementById('userDropdown');
    const userMenu = document.querySelector('.user-menu');
    
    if (dropdown && userMenu && !userMenu.contains(event.target)) {
      dropdown.classList.remove('show');
      document.removeEventListener('click', navbar.closeUserMenu);
    }
  }
};