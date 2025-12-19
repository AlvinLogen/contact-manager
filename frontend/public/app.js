//Configuration 
const API_BASE_URL = '/api';

// DOM Elements - Cache for Performance
const elements = {
    // Form Elements
    contactForm: document.getElementById('contactForm'),
    firstNameInput: document.getElementById('firstName'),
    lastNameInput: document.getElementById('lastName'),
    emailInput: document.getElementById('email'),
    phoneInput: document.getElementById('phone'),
    editIdInput: document.getElementById('editId'),
    submitBtnText: document.getElementById('submitBtnText'),
    cancelBtn: document.getElementById('cancelBtn'),

    // Display Elements
    contactsList: document.getElementById('contactsList'),
    contactCount: document.getElementById('contactsCount'),
    statusMessage: document.getElementById('statusMessage'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    emptyState: document.getElementById('emptyState'),
    contactsContainer: document.getElementById('contactsContainer')
}

// State Management
let contacts = [];
let isEditMode = false;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact Manager Initialized');

    setupEventListeners();
    loadContacts();
});

// Event listeners
function setupEventListeners() {
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    elements.cancelBtn.addEventListener('click', resetForm);
}

// ============================================
// API Functions
// ============================================

// Fetch all contacts from the API
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
}

// Create a new Contact
/**
 * @param {Object} contactData - Contact information
 */
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
}

// Update an existing Contact
/**
 * @param {number} id - Contact ID
 * @param {Object} contactData - Updated contact information
 *  */

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
}

// Delete a contact
/**
 * @param {number} id - Contact ID
 */

async function deleteContact(id) {
    // Confirm before deleting
    const contact = contacts.find(c => c.id === id);
    if(!contact) return;

    // Delete contact
    const confirmMessage = `Are you sure you want to delete ${contact.Firstname} ${contact.LastName}?`;
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
}


// ============================================
// Form Handling
// ============================================



// ============================================
// UI Rendering Functions
// ============================================



// ============================================
// UI Helper Functions
// ============================================



// ============================================
// Make functions globally available for inline handlers
// ============================================