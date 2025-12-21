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
    contactCount: document.getElementById('contactCount'),
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
    const contact = contacts.find(c => c.Id === id);
    if(!contact) return;

    // Delete contact
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
}

// ============================================
// Form Handling
// ============================================

//Handle form submission
/**
* @param {Event} event
*/
async function handleFormSubmit(event) {
    event.preventDefault();

    const contactData = {
        firstName: elements.firstNameInput.value.trim(),
        lastName: elements.lastNameInput.value.trim(),
        email: elements.emailInput.value.trim(),
        phone: elements.phoneInput.value.trim() || null
    }

    if(!contactData.firstName || !contactData.lastName || !contactData.email){
        showStatusMessage('Please fill in all required fields', 'error');
        return;
    }

    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
        if(isEditMode){
            const editId = parseInt(elements.editIdInput.value);
            await updateContact(editId, contactData);
        } else {
            await createContact(contactData);
        }
    } finally {
        submitBtn.disabled = false;
    }
}

// Populate form for editing a contact
/**
* @param {number} id
*/
function editContact(Id){
    const contact = contacts.find(c => c.Id === id);
    if(!contact) return;

    // Populate form fields
    elements.firstNameInput.value = contact.FirstName;
    elements.lastNameInput.value = contact.LastName;
    elements.emailInput.value = contact.Email;
    elements.phoneInput.value = contact.Phone || '';
    elements.editIdInput.value = contact.Id;

    // Swith to edit mode
    isEditMode = true;
    elements.submitBtnText.textContent = 'Update Contact';
    elements.cancelBtn.style.display = 'inline-block';

    // Scroll to form
    elements.contactForm.scrollIntoView({ behavior: 'smooth'});

    // Focus on first input
    elements.firstNameInput.focus();
}

// Reset form to initial state
function resetForm() {
    elements.contactForm.reset();
    elements.editIdInput.value = '';
    isEditMode = false;
    elements.submitBtnText.textContent = 'Add Contact';
    elements.cancelBtn.style.display = 'none';
    hideStatusMessage();
}

// ============================================
// UI Rendering Functions
// ============================================
/**
 * Render all contacts in the table
 */

function renderContacts() {
    // Clear existing content
    elements.contactsList.innerHTML = '';

    // Handle empty state
    if (contacts.length === 0){
        elements.emptyState.style.display = 'block';
        elements.contactsContainer.style.display = 'none';
        return;
    }

    elements.emptyState.style.display = 'none';
    elements.contactsContainer.style.display = 'block';

    // Render each contact
    contacts.forEach(contact => {
        const row = createContactRow(contact);
        elements.contactsList.appendChild(row);
    });
}

/**
 * Create a table row for a contact
 * @param {Object} contact - Contact data
 * @returns {HTMLTableRowElement} Table row element
 */

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
                onclick="editContact(${contact.Id})"
                aria-label="Edit ${escapeHTML(contact.Firstname)} ${escapeHTML(contact.LastName)}"
            >Edit
            </button>
            <button 
                class="btn btn-sm btn-delete"
                onclick="deleteContact(${contact.Id})"
                aria-label="Delete ${escapeHTML(contact.Firstname)} ${escapeHTML(contact.LastName)}"
            >Delete
            </button>
        </td>
    `;

    return row;
}

// Update contact count display
function updateContactCount(){
    const count = contacts.length;
    elements.contactCount.textContent = `${count} contact${count !== 1 ? 's' : ''}`;
}

// ============================================
// UI Helper Functions
// ============================================

/**
 * Show or hide loading indicator
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show){
    elements.loadingIndicator.style.display = show ? 'block' : 'none';
}

/**
 * Display a status message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showStatusMessage(message, type){
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
    elements.statusMessage.style.display = 'block';

    // auto-hide after 5 seconds
    setTimeout(() => {
        hideStatusMessage();
    }, 5000);
}

/**
 * Hide status message
 */
function hideStatusMessage(){
    elements.statusMessage.style.display = 'none';
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Make functions globally available for inline handlers
// ============================================

window.editContact = editContact;
window.deleteContact = deleteContact;