// Settings JavaScript - Settings-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initSettingsNavigation();
    initToggleSwitches();
    initLanguageSelector();
    initThemeSelector();
    initPasswordChange();
    initDangerZone();
});

// Settings navigation
function initSettingsNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // Handle URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetSection = document.getElementById(hash);
        const targetNav = document.querySelector(`.settings-nav-item[href="#${hash}"]`);
        
        if (targetSection && targetNav) {
            navItems.forEach(nav => nav.classList.remove('active'));
            targetNav.classList.add('active');
            
            sections.forEach(section => {
                if (section.id === hash) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    }
}

// Toggle switches
function initToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const toggleContainer = this.closest('.toggle');
            const settingName = this.getAttribute('data-setting');
            
            if (this.checked) {
                toggleContainer.classList.add('active');
            } else {
                toggleContainer.classList.remove('active');
            }
            
            // BACKEND INTEGRATION REQUIRED: Save setting to server
            if (settingName) {
                saveSetting(settingName, this.checked);
            }
        });
    });
}

function saveSetting(name, value) {
    // BACKEND INTEGRATION REQUIRED: AJAX setting save
    if (window.WorkshopSystem) {
        window.WorkshopSystem.ajaxRequest('/api/settings/', {
            method: 'POST',
            body: JSON.stringify({ [name]: value })
        })
        .then(data => {
            console.log('Setting saved:', name, value);
        })
        .catch(error => {
            console.error('Failed to save setting:', error);
            if (window.WorkshopSystem) {
                window.WorkshopSystem.showFlashMessage('Failed to save setting.', 'error');
            }
        });
    }
}

// Language selector
function initLanguageSelector() {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const language = this.getAttribute('data-language') || this.textContent;
            
            // BACKEND INTEGRATION REQUIRED: Save language preference
            saveSetting('language', language);
            
            if (window.WorkshopSystem) {
                window.WorkshopSystem.showFlashMessage(`Language changed to ${language}`, 'success');
            }
        });
    });
}

// Theme selector
function initThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const theme = this.getAttribute('data-theme') || this.textContent.toLowerCase();
            
            // Apply theme immediately
            applyTheme(theme);
            
            // BACKEND INTEGRATION REQUIRED: Save theme preference
            saveSetting('theme', theme);
            
            if (window.WorkshopSystem) {
                window.WorkshopSystem.showFlashMessage(`Theme changed to ${theme}`, 'success');
            }
        });
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}

function applyTheme(theme) {
    // BACKEND INTEGRATION REQUIRED: Apply theme to document
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', theme);
}

// Password change
function initPasswordChange() {
    const changePasswordButtons = document.querySelectorAll('[data-action="change-password"]');
    
    changePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            // BACKEND INTEGRATION REQUIRED: Password change modal
            const currentPassword = prompt('Enter your current password:');
            if (!currentPassword) return;
            
            const newPassword = prompt('Enter your new password:');
            if (!newPassword) return;
            
            const confirmPassword = prompt('Confirm your new password:');
            if (newPassword !== confirmPassword) {
                if (window.WorkshopSystem) {
                    window.WorkshopSystem.showFlashMessage('Passwords do not match.', 'error');
                }
                return;
            }
            
            // BACKEND INTEGRATION REQUIRED: AJAX password change
            changePassword(currentPassword, newPassword);
        });
    });
}

function changePassword(currentPassword, newPassword) {
    // BACKEND INTEGRATION REQUIRED: AJAX password change
    if (window.WorkshopSystem) {
        window.WorkshopSystem.ajaxRequest('/api/settings/password/', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        })
        .then(data => {
            window.WorkshopSystem.showFlashMessage('Password changed successfully!', 'success');
        })
        .catch(error => {
            window.WorkshopSystem.showFlashMessage('Failed to change password.', 'error');
        });
    }
}

// Danger zone actions
function initDangerZone() {
    const deleteAccountButtons = document.querySelectorAll('[data-action="delete-account"]');
    
    deleteAccountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const confirmation = prompt('Type "DELETE" to confirm account deletion:');
            
            if (confirmation === 'DELETE') {
                // BACKEND INTEGRATION REQUIRED: Account deletion
                deleteAccount();
            } else {
                if (window.WorkshopSystem) {
                    window.WorkshopSystem.showFlashMessage('Account deletion cancelled.', 'info');
                }
            }
        });
    });
}

function deleteAccount() {
    // BACKEND INTEGRATION REQUIRED: AJAX account deletion
    if (window.WorkshopSystem) {
        window.WorkshopSystem.ajaxRequest('/api/settings/account/', {
            method: 'DELETE'
        })
        .then(data => {
            window.WorkshopSystem.showFlashMessage('Account deleted successfully.', 'success');
            
            // Redirect to home after short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        })
        .catch(error => {
            window.WorkshopSystem.showFlashMessage('Failed to delete account.', 'error');
        });
    }
}

// Settings form submission
const settingsForms = document.querySelectorAll('.settings-form');
settingsForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // BACKEND INTEGRATION REQUIRED: AJAX form submission
        if (window.WorkshopSystem) {
            window.WorkshopSystem.ajaxRequest('/api/settings/', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(response => {
                window.WorkshopSystem.showFlashMessage('Settings saved successfully!', 'success');
            })
            .catch(error => {
                window.WorkshopSystem.showFlashMessage('Failed to save settings.', 'error');
            });
        }
    });
});

// Export functions
window.SettingsSystem = {
    saveSetting,
    applyTheme,
    changePassword,
    deleteAccount
};
