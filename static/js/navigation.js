// Navigation JavaScript - Navigation-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initActiveNavLinks();
    initSmoothScrolling();
    initBackButtons();
});

// Highlight active navigation links
function initActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link, .bottom-nav-item');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Exact match or parent path match
        if (currentPath === linkPath || currentPath.startsWith(linkPath + '/')) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back button functionality
function initBackButtons() {
    const backButtons = document.querySelectorAll('[data-back]');
    
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const fallback = this.getAttribute('data-back');
            
            if (document.referrer && document.referrer !== window.location.href) {
                window.history.back();
            } else if (fallback) {
                window.location.href = fallback;
            } else {
                window.location.href = '/';
            }
        });
    });
}

// Mobile navigation scroll handling
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navbarToggle = document.getElementById('navbarToggle');
        const mobileMenu = document.querySelector('.navbar-menu-mobile');
        
        if (navbarToggle && mobileMenu && mobileMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
        
        // Close modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.remove();
        });
    }
});

// Add throttle function if not already defined
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
