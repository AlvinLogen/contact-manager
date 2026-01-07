const Validator = {
    email: (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },

    phone: (phone) => {
        const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return pattern.test(phone);
    },

    required: (value) => {
        return value !== null && value !== undefined && value.trim() !== '';
    },

    minLength: (value, length) => {
        return value.length >= length;
    },

    maxLength: (value, length) => {
        return value.length <= length;
    },

    validateContact: (contactData) => {
        const errors = {};

        if(!Validator.required(contactData.firstName)){
            errors.firstName = 'First name is required';
        } else if(!Validator.minLength(contactData.firstName, 2)){
            errors.firstName = 'First name must be at least 2 characters';
        }

        if(!Validator.required(contactData.lastName)){
            errors.lastName = 'Last name is required';
        } else if(!Validator.minLength(contactData.lastName, 2)){
            errors.lastName = 'Last name must be at least 2 characters';
        }

        if(!Validator.required(contactData.email)){
            errors.email = 'Email is required';
        } else if (!Validator.email(contactData.email)){
            errors.email = 'Invalid email format';
        }

        if (contactData.phone && !Validator.phone(contactData.phone)){
            errors.phone = 'Invalid phone format';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }
};