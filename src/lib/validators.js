export function validateEmail(email) {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    return null;
}

export function validatePassword(password) {
    if (!password) return 'Password is required';
    
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    
    return null;
}

export function validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return fieldName + ' is required';
    }
    return null;
}

export function validateNumber(value, fieldName, options = {}) {
    const { min, max, required = true } = options;
    
    if (required && (value === '' || value === null || value === undefined)) {
        return fieldName + ' is required';
    }
    
    if (value === '' || value === null || value === undefined) {
        return null;
    }
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
        return fieldName + ' must be a valid number';
    }
    
    if (min !== undefined && num < min) {
        return fieldName + ' must be at least ' + min;
    }
    
    if (max !== undefined && num > max) {
        return fieldName + ' must be at most ' + max;
    }
    
    return null;
}

export function validatePhone(phone) {
    if (!phone) return null;
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 15) {
        return 'Please enter a valid phone number';
    }
    
    return null;
}

export function validateDate(date, fieldName) {
    if (!date) return fieldName + ' is required';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return 'Please enter a valid date';
    }
    
    return null;
}

export function validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
        return 'End date must be after start date';
    }
    
    return null;
}

export function validateInvoiceItems(items) {
    if (!items || items.length === 0) {
        return 'At least one line item is required';
    }
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (!item.description || !item.description.trim()) {
            return 'Description is required for item ' + (i + 1);
        }
        
        if (!item.quantity || parseFloat(item.quantity) <= 0) {
            return 'Quantity must be greater than 0 for item ' + (i + 1);
        }
        
        if (!item.unit_price || parseFloat(item.unit_price) < 0) {
            return 'Unit price must be 0 or greater for item ' + (i + 1);
        }
    }
    
    return null;
}

export function validateForm(values, rules) {
    const errors = {};
    
    for (const field in rules) {
        const value = values[field];
        const fieldRules = rules[field];
        
        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) {
                errors[field] = error;
                break;
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
