/**
 * Main application entry point
 */
(function() {
  // App element
  const appElement = document.getElementById('app');
  
  // Current route
  let currentRoute = '/login';
  
  // Route handlers
  const routes = {
    '/': () => loginView.render(),
    '/login': () => loginView.render(),
    '/dashboard': () => dashboardView.render(),
    '/create': () => createTicketView.render(),
    '/edit': () => editTicketView.render()
  };
  
  /**
   * Render the current route
   */
  function renderRoute() {
    // Extract path from URL
    const path = window.location.pathname || '/';
    
    // Find route handler for path or use login as fallback
    const route = Object.keys(routes).find(route => 
      route === path || (route === '/' && path === '')
    ) || '/login';
    
    // Update current route
    currentRoute = route;
    
    // Check authentication
    auth.init();
    
    // Get route handler
    const routeHandler = routes[currentRoute];
    
    // Clear app element
    appElement.innerHTML = '';
    
    // Render route content
    if (routeHandler) {
      const content = routeHandler();
      if (content) {
        appElement.appendChild(content);
      }
    }
  }
  
  /**
   * Handle route changes
   */
  function handleRouteChange() {
    renderRoute();
  }
  
  // Listen for route change events
  window.addEventListener('routechange', handleRouteChange);
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', handleRouteChange);
  
  // Initial route rendering
  renderRoute();
})();