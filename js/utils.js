/**
 * Utility functions for the application
 */

// Format a date to a readable string
function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Create HTML element with attributes and children
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Append children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (child) {
        element.appendChild(document.createTextNode(String(child)));
      }
    });
  } else if (children instanceof Node) {
    element.appendChild(children);
  } else if (children) {
    element.appendChild(document.createTextNode(String(children)));
  }
  
  return element;
}

// Show a notification message
function showNotification(message, type = 'success', duration = 3000) {
  // Remove any existing notification
  const existingNotification = document.getElementById('notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = createElement('div', {
    id: 'notification',
    className: `alert alert-${type}`,
    style: 'position: fixed; top: 20px; right: 20px; z-index: 1000; min-width: 300px; transform: translateX(400px); transition: transform 0.3s ease-out;'
  }, message);
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Hide after duration
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// Validate form inputs
function validateForm(formData, requiredFields = []) {
  const errors = {};
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = 'Este campo é obrigatório';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Get status class based on status value
function getStatusClass(status) {
  const statusOption = config.statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.class : '';
}

// Get status label based on status value
function getStatusLabel(status) {
  const statusOption = config.statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
}

// Get priority label based on priority value
function getPriorityLabel(priority) {
  const priorityOption = config.priorityOptions.find(option => option.value === priority);
  return priorityOption ? priorityOption.label : priority;
}

// Truncate text to a specified length
function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Generate a unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Parse URL query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

// Navigate to a new page with optional query parameters
function navigateTo(path, params = {}) {
  let url = path;
  
  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${path}?${queryString}`;
  }
  
  // Change URL without reloading the page
  window.history.pushState({}, '', url);
  
  // Trigger route change event
  const event = new CustomEvent('routechange', { detail: { path, params } });
  window.dispatchEvent(event);
}