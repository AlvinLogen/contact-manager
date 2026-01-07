const ContactManager = (() => {
    // Private Variables
    const API_BASE_URL = '/api';
    let contacts = [];
    let isEditMode = null;
    let currentPage = 1;
    const pageSize = 10;

    const contactForm = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const editIdInput = document.getElementById('editId');
    const submitBtnText = document.getElementById('submitBtnText');
    const cancelBtn = document.getElementById('cancelBtn');

    // Display Elements
    const contactsList = document.getElementById('contactsList');
    const contactCount = document.getElementById('contactCount');
    const statusMessage = document.getElementById('statusMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const emptyState = document.getElementById('emptyState');
    const contactsContainer = document.getElementById('contactsContainer');

    // Private Methods
    const handleError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        showNotification(`Error ${error.message || 'Something went wrong.'}`, 'error');
    };

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
        },3000);
    };

    // API Methods
    const api = {
        async getAll() {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                handleError(error, 'fetching contacts');
                return null;
            }
        },

        async getById(id){
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                handleError(error, 'fetching contact');
                return null;
            }
        },

        async create(contactData) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                handleError(error, 'creating contact');
                throw error;
            }
        },

        async update(id, contactData) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                handleError(error, 'updating contact');
                throw error;
            }
        },

        async delete(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return true;
            } catch (error) {
                handleError(error, 'deleting contact');
                throw error;
            }
        }
    };

    // Public Methods
    async function loadContacts() {
        try {
            showLoading();

            const response = await fetch(`${API_BASE_URL}/contacts`);
            const data = await response.json();

            if(!data.success){
                throw new Error(data.error || 'Failed to load contacts');
            }

            contacts = data.data;
            renderContacts();
            updateContactCount();

        } catch (error) {
            console.error('Error loading contacts:', error);
            showStatusMessage('Failed to load contacts. Please refresh the page.', error);
        } finally {
            showLoading(false);
        }
    };

    async function createContact(contactData) {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            const data = await response.json();

            if(!data.success){
                throw new Error(data.error || 'Failed to create contact');
            }

            showStatusMessage('Contact added successfully!', 'success');
            loadContacts();
            resetForm();

        } catch (error) {
            console.error('Error creating contact:', error);
            showStatusMessage(error.message, 'error');
        }
    };

    function editContact(id){
        const contact = contacts.find(c => c.Id === id);
        if(!contact) return;

        firstNameInput.value = contact.FirstName;
        lastNameInput.value = contact.LastName;
        emailInput.value = contact.Email;
        phoneInput.value = contact.Phone || '';
        editIdInput.value = contact.Id;

        isEditMode = true;
        submitBtnText.textContent = 'Update Contact';
        cancelBtn.style.display = 'inline-block';

        contactForm.scrollIntoView({ behavior: 'smooth'});

        firstNameInput.focus();
    };

    async function updateContact(id, contactData) {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            const data = await response.json();

            if(!data.success){
                throw new Error(data.error || 'Failed to update contact');
            }

            showStatusMessage('Contact updated successfully', 'success');
            loadContacts();
            resetForm();
        } catch (error) {
            console.error('Error updating contact', error);
            showStatusMessage(error.message, 'error');
        }
    };


    async function deleteContact(id) {
        const contact = contacts.find(c => c.Id === id);
        if(!contact) return;

        const confirmMessage = `Are you sure you want to delete ${contact.FirstName} ${contact.LastName}?`;
        if(!confirm(confirmMessage)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if(!data.success){
                throw new Error(data.error || 'Failed to delete contact');
            }

            showStatusMessage('Contact delete successfully', 'success');
            loadContacts();

        } catch (error) {
            console.error('Error deleting contact', error);
            showStatusMessage(error.message, 'error')
        }
    };

    function renderContacts() {
        contactsList.innerHTML = '';
        if (contacts.length === 0){
            emptyState.style.display = 'block';
            contactsContainer.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        contactsContainer.style.display = 'block';

        contacts.forEach(contact => {
            const row = createContactRow(contact);
            contactsList.appendChild(row);
        });
    };

    function createContactRow(contact){
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <div class="contact-name">
                    ${escapeHTML(contact.FirstName)} ${escapeHTML(contact.LastName)}
                </div>
            </td>
            <td>${escapeHTML(contact.Email)}</td>
            <td>${contact.Phone ? escapeHTML(contact.Phone) : '-'}</td>
            <td class="contact-actions">
                <button
                    class="btn btn-sm btn-edit"
                    onclick="ContactManager.editContact(${contact.Id})"
                    aria-label="Edit ${escapeHTML(contact.Firstname)} ${escapeHTML(contact.LastName)}"
                >Edit
                </button>
                <button 
                    class="btn btn-sm btn-delete"
                    onclick="ContactManager.deleteContact(${contact.Id})"
                    aria-label="Delete ${escapeHTML(contact.Firstname)} ${escapeHTML(contact.LastName)}"
                >Delete
                </button>
            </td>
        `;

        return row;
    };

    function updateContactCount(){
        const count = contacts.length;
        contactCount.textContent = `${count} contact${count !== 1 ? 's' : ''}`;
    }

    function showLoading(show){
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    function showStatusMessage(message, type){
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        setTimeout(() => {
            hideStatusMessage();
        }, 5000);
    }

    function hideStatusMessage(){
        statusMessage.style.display = 'none';
    }

    function escapeHTML(text){
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        const contactData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim() || null
        }

        if(!contactData.firstName || !contactData.lastName || !contactData.email){
            showStatusMessage('Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            if(isEditMode){
                const editId = parseInt(editIdInput.value);
                await updateContact(editId, contactData);
            } else {
                await createContact(contactData);
            }
        } finally {
            submitBtn.disabled = false;
        }
    };

    // Reset form to initial state
    function resetForm() {
        contactForm.reset();
        editIdInput.value = '';
        isEditMode = false;
        submitBtnText.textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
        hideStatusMessage();
    };

    // Event listeners
    function setupEventListeners() {
        contactForm.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', resetForm);
    }

    // Public Interface
    return {
        init: async () => {
            await loadContacts();
            setupEventListeners();
        },
        refresh: loadContacts,
        editContact: editContact,
        deleteContact: deleteContact,
    };

})();

document.addEventListener('DOMContentLoaded', ContactManager.init);