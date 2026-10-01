// Authentication JavaScript - Authentication-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initPasswordStrength();
    initFormValidation();
    initSocialAuth();
    initRememberMe();
});

// Password strength indicator
function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"][data-strength]');
    
    passwordInputs.forEach(input => {
        let strengthMeter = input.parentElement.querySelector('.password-strength');
        
        if (!strengthMeter) {
            strengthMeter = document.createElement('div');
            strengthMeter.className = 'password-strength';
            strengthMeter.innerHTML = `
                <div class="password-strength-bar">
                    <div class="password-strength-fill"></div>
                </div>
                <div class="password-strength-text"></div>
            `;
            input.parentElement.appendChild(strengthMeter);
        }
        
        const fill = strengthMeter.querySelector('.password-strength-fill');
        const text = strengthMeter.querySelector('.password-strength-text');
        
        input.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update fill
            fill.className = 'password-strength-fill';
            if (strength.score === 0) {
                fill.style.width = '0%';
            } else if (strength.score === 1) {
                fill.classList.add('weak');
                fill.style.width = '33%';
            } else if (strength.score === 2) {
                fill.classList.add('fair');
                fill.style.width = '66%';
            } else {
                fill.classList.add('strong');
                fill.style.width = '100%';
            }
            
            // Update text
            text.textContent = strength.message;
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let message = '';
    
    if (!password) {
        return { score: 0, message: '' };
    }
    
    // Length check
    if (password.length >= 8) {
        score++;
    }
    
    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score++;
    }
    
    if (/\d/.test(password)) {
        score++;
    }
    
    if (/[^a-zA-Z0-9]/.test(password)) {
        score++;
    }
    
    // Determine message
    if (score <= 1) {
        message = 'Weak';
    } else if (score <= 2) {
        message = 'Fair';
    } else {
        message = 'Strong';
    }
    
    return { score, message };
}

// Form validation
function initFormValidation() {
    const authForms = document.querySelectorAll('.auth-form');
    
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('form-input--error');
                    
                    // Remove error class on input
                    field.addEventListener('input', function() {
                        this.classList.remove('form-input--error');
                    }, { once: true });
                }
            });
            
            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    isValid = false;
                    field.classList.add('form-input--error');
                    
                    field.addEventListener('input', function() {
                        this.classList.remove('form-input--error');
                    }, { once: true });
                }
            });
            
            // Password confirmation
            const passwordFields = form.querySelectorAll('input[type="password"]');
            if (passwordFields.length >= 2) {
                const password = passwordFields[0].value;
                const confirmPassword = passwordFields[1].value;
                
                if (password !== confirmPassword) {
                    isValid = false;
                    passwordFields[1].classList.add('form-input--error');
                    
                    if (window.WorkshopSystem) {
                        window.WorkshopSystem.showFlashMessage('Passwords do not match.', 'error');
                    }
                }
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Social authentication (placeholder)
function initSocialAuth() {
    const socialButtons = document.querySelectorAll('.auth-social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.getAttribute('data-provider');
            
            // BACKEND INTEGRATION REQUIRED: Social authentication
            console.log('Social auth with:', provider);
            
            if (window.WorkshopSystem) {
                window.WorkshopSystem.showFlashMessage('Social authentication not yet implemented.', 'info');
            }
        });
    });
}

// Remember me functionality
function initRememberMe() {
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    
    if (rememberCheckbox) {
        // Check if user was previously remembered
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const usernameField = document.querySelector('input[name="username"]');
            if (usernameField) {
                usernameField.value = rememberedUser;
                rememberCheckbox.checked = true;
            }
        }
        
        // Save/remember user preference
        const form = rememberCheckbox.closest('form');
        if (form) {
            form.addEventListener('submit', function() {
                const usernameField = form.querySelector('input[name="username"]');
                
                if (rememberCheckbox.checked && usernameField) {
                    localStorage.setItem('rememberedUser', usernameField.value);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
            });
        }
    }
}

// Login form enhancement
const loginForm = document.querySelector('.auth-form[action*="login"]');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<span class="spinner spinner-sm"></span> Signing in...';
            
            // Re-enable after 30 seconds (fallback)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 30000);
        }
    });
}

// Signup form enhancement
const signupForm = document.querySelector('.auth-form[action*="signup"]');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<span class="spinner spinner-sm"></span> Creating account...';
            
            // Re-enable after 30 seconds (fallback)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 30000);
        }
    });
}

// Username availability check (debounced)
const usernameFields = document.querySelectorAll('input[name="username"]');
usernameFields.forEach(field => {
    let checkTimeout;
    
    field.addEventListener('input', function() {
        clearTimeout(checkTimeout);
        
        const username = this.value.trim();
        
        if (username.length >= 3) {
            checkTimeout = setTimeout(() => {
                checkUsernameAvailability(username);
            }, 500);
        }
    });
});

function checkUsernameAvailability(username) {
    // BACKEND INTEGRATION REQUIRED: AJAX username check
    console.log('Checking username availability:', username);
    
    // Placeholder implementation
    if (window.WorkshopSystem) {
        // This would be replaced with actual AJAX call
        // window.WorkshopSystem.ajaxRequest(`/api/auth/check-username/?username=${username}`)
        //     .then(data => {
        //         if (data.available) {
        //             // Show available indicator
        //         } else {
        //             // Show unavailable indicator
        //         }
        //     });
    }
}

// Export functions
window.AuthSystem = {
    calculatePasswordStrength,
    isValidEmail,
    checkUsernameAvailability
};
