// Validation Middleware for Contact Data

const { ValidatorError } = require('./errorHandler');

const validateContact = (req, res, next) => {
    const { firstName, lastName, email, phone } = req.body;
    const errors = [];

    // First Name Validation
    if (!firstName || firstName.trim() === '') {
        errors.push('First name is required');
    } else if (firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
    } else if (firstName.trim().length > 50) {
        errors.push('First name must not exceed 50 characters');
    }

    // Last Name Validation
    if (!lastName || lastName.trim() === '') {
        errors.push('Last name is required');
    } else if (lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
    } else if (lastName.trim().length > 50) {
        errors.push('Last name must not exceed 50 characters');
    }

    // Email Validation
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            errors.push('Invalid email format');
        }
    }

    // Phone Validation
    if (phone && phone.trim() !== '') {
        const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phonePattern.test(phone)) {
            errors.push('Invalid phone format');
        }
    }

    if (errors.length > 0) {
        throw new ValidatorError(errors.join(', '));
    }

    next();
};

// Validate ID Parameter
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);

    if(isNaN(id) || id <= 0){
        throw new ValidatorError('Invalid contact Id');
    }

    req.params.id = id;
    next();
};

module.exports = {
    validateContact, 
    validateId
}