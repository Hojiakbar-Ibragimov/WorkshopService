// Forms JavaScript - Form-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggles();
    initFormValidation();
    initFileUploads();
    initCharacterCounters();
    initAutoResize();
});

// Password visibility toggles
function initPasswordToggles() {
    const passwordContainers = document.querySelectorAll('.password-toggle');
    
    passwordContainers.forEach(container => {
        const input = container.querySelector('.password-toggle-input');
        const button = container.querySelector('.password-toggle-button');
        
        if (input && button) {
            button.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Update icon
                const eyeOpen = button.querySelector('.eye-open');
                const eyeClosed = button.querySelector('.eye-closed');
                
                if (eyeOpen && eyeClosed) {
                    if (type === 'text') {
                        eyeOpen.style.display = 'none';
                        eyeClosed.style.display = 'block';
                    } else {
                        eyeOpen.style.display = 'block';
                        eyeClosed.style.display = 'none';
                    }
                }
            });
        }
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
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
            
            if (!isValid) {
                e.preventDefault();
                
                if (window.WorkshopSystem) {
                    window.WorkshopSystem.showFlashMessage('Please fix the errors before submitting.', 'error');
                }
            }
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// File uploads
function initFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const files = e.target.files;
            const fileList = this.parentElement.querySelector('.file-list') || 
                           this.parentElement.parentElement.querySelector('.file-list');
            
            if (fileList && files.length > 0) {
                fileList.innerHTML = '';
                
                Array.from(files).forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 12px;
                        background: var(--color-background-secondary);
                        border-radius: 4px;
                        font-size: 14px;
                    `;
                    
                    const fileSize = (file.size / 1024).toFixed(1);
                    
                    fileItem.innerHTML = `
                        <svg style="width: 16px; height: 16px; color: var(--color-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        <span>${file.name}</span>
                        <span style="color: var(--color-text-tertiary); margin-left: auto;">${fileSize} KB</span>
                    `;
                    
                    fileList.appendChild(fileItem);
                });
            }
        });
    });
}

// Character counters
function initCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[data-max-length]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('data-max-length'));
        let counter = textarea.parentElement.querySelector('.character-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                font-size: 12px;
                color: var(--color-text-tertiary);
                text-align: right;
                margin-top: 4px;
            `;
            textarea.parentElement.appendChild(counter);
        }
        
        function updateCounter() {
            const currentLength = textarea.value.length;
            const remaining = maxLength - currentLength;
            
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (remaining < 0) {
                counter.style.color = 'var(--color-error)';
                textarea.classList.add('form-textarea--error');
            } else if (remaining < 50) {
                counter.style.color = 'var(--color-warning)';
                textarea.classList.remove('form-textarea--error');
            } else {
                counter.style.color = 'var(--color-text-tertiary)';
                textarea.classList.remove('form-textarea--error');
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
}

// Auto-resize textareas
function initAutoResize() {
    const textareas = document.querySelectorAll('textarea[data-auto-resize]');
    
    textareas.forEach(textarea => {
        function resize() {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
        
        textarea.addEventListener('input', resize);
        resize();
    });
}

// Form field focus effects
const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Copy to clipboard functionality
document.addEventListener('click', function(e) {
    const copyButton = e.target.closest('[data-copy]');
    
    if (copyButton) {
        const textToCopy = copyButton.getAttribute('data-copy');
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
});
