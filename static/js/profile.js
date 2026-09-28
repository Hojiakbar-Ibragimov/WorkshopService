// Profile JavaScript - Profile-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initAvatarUpload();
    initProfileTabs();
    initProfileEdit();
    initLocationSet();
});

// Avatar upload
function initAvatarUpload() {
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImage = document.querySelector('.profile-avatar-image');
    const avatarPlaceholder = document.querySelector('.avatar');
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    if (window.WorkshopSystem) {
                        window.WorkshopSystem.showFlashMessage('Please select an image file.', 'error');
                    }
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    if (window.WorkshopSystem) {
                        window.WorkshopSystem.showFlashMessage('Image must be less than 5MB.', 'error');
                    }
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (avatarImage) {
                        avatarImage.src = e.target.result;
                    } else if (avatarPlaceholder) {
                        // Replace placeholder with image
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = 'Profile Avatar';
                        img.className = 'profile-avatar-image';
                        avatarPlaceholder.parentNode.replaceChild(img, avatarPlaceholder);
                    }
                    
                    // BACKEND INTEGRATION REQUIRED: Upload avatar to server
                    uploadAvatar(file);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function uploadAvatar(file) {
    // BACKEND INTEGRATION REQUIRED: AJAX avatar upload
    const formData = new FormData();
    formData.append('avatar', file);
    
    if (window.WorkshopSystem) {
        window.WorkshopSystem.ajaxRequest('/api/profile/avatar/', {
            method: 'POST',
            body: formData
        })
        .then(data => {
            window.WorkshopSystem.showFlashMessage('Avatar updated successfully!', 'success');
        })
        .catch(error => {
            window.WorkshopSystem.showFlashMessage('Failed to update avatar.', 'error');
        });
    }
}

// Profile tabs
function initProfileTabs() {
    const tabButtons = document.querySelectorAll('.profile-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            const tabContents = document.querySelectorAll('.profile-tab-content');
            
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
}

// Profile edit mode
function initProfileEdit() {
    const editButtons = document.querySelectorAll('[data-action="edit-profile"]');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.profile-section');
            const editForm = section.querySelector('.profile-edit-form');
            const displayContent = section.querySelector('.profile-display-content');
            
            if (editForm && displayContent) {
                displayContent.style.display = 'none';
                editForm.style.display = 'block';
                this.style.display = 'none';
            }
        });
    });
    
    // Cancel edit buttons
    const cancelButtons = document.querySelectorAll('[data-action="cancel-edit"]');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.profile-section');
            const editForm = section.querySelector('.profile-edit-form');
            const displayContent = section.querySelector('.profile-display-content');
            const editButton = section.querySelector('[data-action="edit-profile"]');
            
            if (editForm && displayContent) {
                displayContent.style.display = 'block';
                editForm.style.display = 'none';
                editButton.style.display = 'inline-flex';
            }
        });
    });
}

// Location setting
function initLocationSet() {
    const setLocationButtons = document.querySelectorAll('[data-action="set-location"]');
    
    setLocationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // BACKEND INTEGRATION REQUIRED: Location picker modal
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        console.log('Location:', lat, lng);
                        
                        if (window.WorkshopSystem) {
                            window.WorkshopSystem.showFlashMessage('Location detected. Please confirm your address.', 'info');
                        }
                        
                        // BACKEND INTEGRATION REQUIRED: Reverse geocoding to get address
                    },
                    function(error) {
                        if (window.WorkshopSystem) {
                            window.WorkshopSystem.showFlashMessage('Could not get your location. Please enter it manually.', 'error');
                        }
                    }
                );
            } else {
                if (window.WorkshopSystem) {
                    window.WorkshopSystem.showFlashMessage('Geolocation is not supported by your browser.', 'error');
                }
            }
        });
    });
}

// Phone verification
const addPhoneButtons = document.querySelectorAll('[data-action="add-phone"]');
addPhoneButtons.forEach(button => {
    button.addEventListener('click', function() {
        // BACKEND INTEGRATION REQUIRED: Phone verification modal
        const phoneNumber = prompt('Enter your phone number:');
        
        if (phoneNumber) {
            console.log('Phone number:', phoneNumber);
            
            if (window.WorkshopSystem) {
                window.WorkshopSystem.showFlashMessage('Verification code sent to your phone.', 'info');
            }
            
            // BACKEND INTEGRATION REQUIRED: Send verification code
        }
    });
});

// Export functions
window.ProfileSystem = {
    uploadAvatar
};
