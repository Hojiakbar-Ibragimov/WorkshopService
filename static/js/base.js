// Base JavaScript - Core functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initFlashMessages();
    initForms();
});

// Navbar functionality
function initNavbar() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Check if mobile menu exists
    if (navbarToggle && navbarMenu) {
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.querySelector('.navbar-menu-mobile');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'navbar-menu-mobile';
            
            // Clone menu items
            const menuItems = navbarMenu.querySelectorAll('.navbar-link');
            menuItems.forEach(item => {
                const clonedItem = item.cloneNode(true);
                mobileMenu.appendChild(clonedItem);
            });
            
            navbarMenu.parentNode.appendChild(mobileMenu);
        }
        
        // Toggle mobile menu
        navbarToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.navbar-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                navbarToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Flash messages functionality
function initFlashMessages() {
    const flashMessages = document.querySelector('.flash-messages');
    if (flashMessages) {
        const closeButtons = flashMessages.querySelectorAll('.flash-message-close');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const message = this.closest('.flash-message');
                message.style.opacity = '0';
                message.style.transform = 'translateX(100%)';
                
                setTimeout(() => {
                    message.remove();
                    
                    // Remove container if no messages left
                    if (flashMessages.children.length === 0) {
                        flashMessages.remove();
                    }
                }, 300);
            });
        });
        
        // Auto-remove messages after 5 seconds
        const messages = flashMessages.querySelectorAll('.flash-message');
        messages.forEach((message, index) => {
            setTimeout(() => {
                if (message.parentNode) {
                    message.style.opacity = '0';
                    message.style.transform = 'translateX(100%)';
                    
                    setTimeout(() => {
                        message.remove();
                        
                        if (flashMessages.children.length === 0) {
                            flashMessages.remove();
                        }
                    }, 300);
                }
            }, 5000 + (index * 500));
        });
    }
}

// Form enhancements
function initForms() {
    // Add loading states to forms
    const forms = document.querySelectorAll('form[data-loading]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<span class="spinner spinner-sm"></span> Processing...';
                
                // Re-enable after 30 seconds (fallback)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 30000);
            }
        });
    });
    
    // Add confirmation to destructive actions
    const destructiveButtons = document.querySelectorAll('[data-confirm]');
    destructiveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm');
            if (message && !confirm(message)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// AJAX helper (for future use)
function ajaxRequest(url, options = {}) {
    const defaults = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        }
    };
    
    const config = { ...defaults, ...options };
    
    return fetch(url, config)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('AJAX request failed:', error);
            throw error;
        });
}

function getCsrfToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfToken ? csrfToken.value : '';
}

// Show flash message (for dynamic content)
function showFlashMessage(message, type = 'info') {
    let flashMessages = document.querySelector('.flash-messages');
    
    if (!flashMessages) {
        flashMessages = document.createElement('div');
        flashMessages.className = 'flash-messages';
        document.body.appendChild(flashMessages);
    }
    
    const flashMessage = document.createElement('div');
    flashMessage.className = `flash-message flash-message--${type}`;
    flashMessage.innerHTML = `
        <span class="flash-message-text">${message}</span>
        <button class="flash-message-close" aria-label="Close message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    flashMessages.appendChild(flashMessage);
    
    // Initialize close button
    const closeButton = flashMessage.querySelector('.flash-message-close');
    closeButton.addEventListener('click', function() {
        flashMessage.style.opacity = '0';
        flashMessage.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            flashMessage.remove();
            
            if (flashMessages.children.length === 0) {
                flashMessages.remove();
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (flashMessage.parentNode) {
            flashMessage.style.opacity = '0';
            flashMessage.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                flashMessage.remove();
                
                if (flashMessages.children.length === 0) {
                    flashMessages.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Export functions for use in other scripts
window.WorkshopSystem = {
    debounce,
    throttle,
    ajaxRequest,
    showFlashMessage,
    getCsrfToken
};
