// Requests JavaScript - Request-specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initRequestFilters();
    initStatusUpdates();
    initLoadMore();
    initRequestActions();
});

// Request filters
function initRequestFilters() {
    const filterSelects = document.querySelectorAll('.requests-filters select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Build query parameters
            const params = new URLSearchParams();
            
            filterSelects.forEach(s => {
                if (s.value) {
                    params.set(s.name || s.id, s.value);
                }
            });
            
            // Navigate to filtered URL
            const currentUrl = new URL(window.location);
            currentUrl.search = params.toString();
            
            window.location.href = currentUrl.toString();
        });
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterSelects.forEach(select => {
                select.value = '';
            });
            
            // Navigate to base URL
            const currentUrl = new URL(window.location);
            currentUrl.search = '';
            
            window.location.href = currentUrl.toString();
        });
    }
}

// Status updates
function initStatusUpdates() {
    const statusButtons = document.querySelectorAll('[data-request-id][data-status]');
    
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            const newStatus = this.getAttribute('data-status');
            
            if (confirm(`Are you sure you want to update request #${requestId} to ${newStatus}?`)) {
                updateRequestStatus(requestId, newStatus, this);
            }
        });
    });
}

function updateRequestStatus(requestId, newStatus, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<span class="spinner spinner-sm"></span> Updating...';
    
    // BACKEND INTEGRATION REQUIRED: AJAX status update
    // For now, simulate the update
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        if (window.WorkshopSystem) {
            window.WorkshopSystem.showFlashMessage(`Request #${requestId} updated to ${newStatus}`, 'success');
        }
        
        // Refresh page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 1000);
}

// Load more functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.disabled = true;
            this.innerHTML = '<span class="spinner spinner-sm"></span> Loading...';
            
            // BACKEND INTEGRATION REQUIRED: AJAX load more
            // For now, simulate loading
            setTimeout(() => {
                this.disabled = false;
                this.textContent = originalText;
                
                if (window.WorkshopSystem) {
                    window.WorkshopSystem.showFlashMessage('No more requests to load.', 'info');
                }
            }, 1000);
        });
    }
}

// Request actions (cancel, etc.)
function initRequestActions() {
    const cancelButtons = document.querySelectorAll('[data-action="cancel"]');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            
            if (confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
                cancelRequest(requestId, this);
            }
        });
    });
}

function cancelRequest(requestId, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<span class="spinner spinner-sm"></span> Cancelling...';
    
    // BACKEND INTEGRATION REQUIRED: AJAX cancel request
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        if (window.WorkshopSystem) {
            window.WorkshopSystem.showFlashMessage(`Request #${requestId} cancelled`, 'success');
        }
        
        // Refresh page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 1000);
}

// Request search
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.trim();
            
            if (searchTerm.length >= 2) {
                // BACKEND INTEGRATION REQUIRED: AJAX search
                console.log('Searching for:', searchTerm);
            }
        }, 300);
    });
}

// Request sorting
const sortSelect = document.getElementById('sortFilter');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sort', sortValue);
        
        window.location.href = currentUrl.toString();
    });
}

// Export functions
window.RequestSystem = {
    updateRequestStatus,
    cancelRequest
};
