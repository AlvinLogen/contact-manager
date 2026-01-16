const ContactManager = (() => {
    // Private Variables
    const API_BASE_URL = '/api';
    let contacts = [];
    let currentPage = 1;
    let totalPages = 1;
    let currentSearch = '';
    const pageSize = 10;

    // Private Methods
    const handleError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        showNotification(`Error ${error.message || 'Something went wrong.'}`, 'error');
    };

    // Notification System
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove()
            }, 300);
        }, 3000);
    };

    // API Methods
    const api = {
        async getContacts(search = '', page = 1) {
            try {
                const params = new URLSearchParams({
                    page: page,
                    limit: pageSize
                });

                if (search) {
                    params.append('search', search);
                }

                const response = await fetch(`${API_BASE_URL}/contacts?${params}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const result = await response.json();
                return result;

            } catch (error) {
                handleError(error, 'fetching contacts');
                return { data: [], pagination: { page: 1, pages: 1, total: 0 } };
            }
        },

        async getById(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                handleError(error, 'fetching contact');
                return null;
            }
        },

        async createContact(contactData) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to create contact');

                return result;

            } catch (error) {
                handleError(error, 'creating contact');
                throw error;
            }
        },

        async updateContact(id, contactData) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Failed to update contact');

                return result;

            } catch (error) {
                handleError(error, 'updating contact');
                throw error;
            }
        },

        async deleteContact(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.error || 'Failed to delete contact');

                return true;

            } catch (error) {
                handleError(error, 'deleting contact');
                throw error;
            }
        }
    };

    // Public Methods
    function renderContacts() {
        const tbody = document.getElementById('contactsTableBody');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const contactsContainer = document.getElementById('contactsContainer');
        const emptyState = document.getElementById('emptyState');
        
        // Hide loading
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        
        tbody.innerHTML = '';

        if (contacts.length === 0) {
            contactsContainer.style.display = 'none';
            emptyState.style.display = 'block';
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No contacts found</td></tr>';
            return;
        }
        
        // Show contacts table
        contactsContainer.style.display = 'block';
        emptyState.style.display = 'none';

        contacts.forEach(contact => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${escapeHTML(contact.FirstName)}</td>
                <td>${escapeHTML(contact.LastName)}</td>
                <td>${escapeHTML(contact.Email)}</td>
                <td>${contact.Phone ? escapeHTML(contact.Phone) : '-'}</td>
                <td>
                    <button data-action="edit" data-id="${contact.Id}" class="btn btn-secondary">Edit</button>
                    <button data-action="delete" data-id="${contact.Id}" class="btn btn-secondary">Delete</button>
                </td>
            `;
        });
    };

    const updatePaginationUI = () => {
        document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prevPageBtn').disabled = currentPage === 1;
        document.getElementById('nextPageBtn').disabled = currentPage === totalPages;

        const total = contacts.length;
        const showing = total > 0 ? `Showing ${(( currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, total)} of ${total} contacts` : 'No contacts found';
        document.getElementById('paginationInfo').textContent = showing;
        
        // Update contact count badge
        const contactCount = document.getElementById('contactCount');
        if (contactCount) {
            contactCount.textContent = `${total} contact${total !== 1 ? 's' : ''}`;
        }
    }

    const loadContacts = async (search = currentSearch, page = currentPage) => {
        const result = await api.getContacts(search, page);
        contacts = result.data || [];
        currentPage = result.pagination?.page || 1;
        totalPages = result.pagination?.pages || 1;
        currentSearch = search;

        renderContacts();
        updatePaginationUI();
    };

    // Event handlers
    const setupEventListeners = () => {
        // Event delegation for edit/delete buttons
        document.getElementById('contactsTableBody').addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON') {
                const action = target.dataset.action;
                const id = parseInt(target.dataset.id);
                
                if (action === 'edit') {
                    ContactManager.editContact(id);
                } else if (action === 'delete') {
                    ContactManager.deleteContact(id);
                }
            }
        });
        
        // Search Functions
        document.getElementById('searchBtn').addEventListener('click', () => {
            const searchTerm = document.getElementById('searchInput').value;
            currentPage = 1;
            loadContacts(searchTerm, 1);
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            currentPage = 1;
            loadContacts('', 1);
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter'){
                document.getElementById('searchBtn').click();
            }
        });

        // Pagination Functions
        document.getElementById('prevPageBtn').addEventListener('click', () => {
            if(currentPage > 1){
                loadContacts(currentSearch, currentPage - 1);
            }
        });

        document.getElementById('nextPageBtn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                loadContacts(currentSearch, currentPage + 1);
            }
        });

        // Form Submission
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };

            const contactId = document.getElementById('contactId').value;

            try {
                if(contactId){
                    await api.updateContact(contactId, formData);
                    showNotification('Contact updated successfully', 'success');
                } else {
                    await api.createContact(formData);
                    showNotification('Contact created successfully', 'success');
                }

                // Reset form
                document.getElementById('contactForm').reset();
                document.getElementById('contactId').value = '';
                loadContacts(currentSearch, currentPage);

            } catch (error) {
                // Error already handled in api methods
            }
        });
        
        // Cancel button handler
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('contactForm').reset();
                document.getElementById('contactId').value = '';
                document.getElementById('submitBtnText').textContent = 'Add Contact';
                cancelBtn.style.display = 'none';
            });
        }
    };

    function escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, m => map[m]);
    };

    // Public Interface
    return {
        init: async () => {
            await loadContacts();
            setupEventListeners();
        },

        editContact: async (id) => {
            try {
                const result = await api.getById(id);

                if (result && result.success){
                    const contact = result.data;
                    document.getElementById('contactId').value = contact.Id;
                    document.getElementById('firstName').value = contact.FirstName;
                    document.getElementById('lastName').value = contact.LastName;
                    document.getElementById('email').value = contact.Email;
                    document.getElementById('phone').value = contact.Phone || '';
                    
                    // Update UI for edit mode
                    document.getElementById('submitBtnText').textContent = 'Update Contact';
                    const cancelBtn = document.getElementById('cancelBtn');
                    if (cancelBtn) {
                        cancelBtn.style.display = 'inline-block';
                    }
                    
                    // Scroll to form
                    document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
                }

            } catch (error) {
                handleError(error, 'loading contact for edit');
            }
        },

        deleteContact: async (id) => {
            if (!confirm('Are you sure you want to delete this contact?')) {
                return;
            }

            try {
                await api.deleteContact(id);
                showNotification('Contact deleted successfully', 'success');
                loadContacts(currentSearch, currentPage);

            } catch (error) {
                // Error already handled in api method
            }
        },

        refresh: () => loadContacts(currentSearch, currentPage)
    };
})();

document.addEventListener('DOMContentLoaded', ContactManager.init);