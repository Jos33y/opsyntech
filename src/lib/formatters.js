/**
 * Format currency in Nigerian Naira
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '₦0';
    
    const num = parseFloat(amount);
    if (isNaN(num)) return '₦0';
    
    // Format with commas and 2 decimal places for amounts with decimals
    // No decimals for whole numbers
    const hasDecimals = num % 1 !== 0;
    
    return '₦' + num.toLocaleString('en-NG', {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2
    });
}

/**
 * Format compact currency (e.g., ₦1.2M, ₦500K)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted compact currency string
 */
export function formatCurrencyCompact(amount) {
    if (amount === null || amount === undefined) return '₦0';
    
    const num = parseFloat(amount);
    if (isNaN(num)) return '₦0';
    
    if (num >= 1000000000) {
        return '₦' + (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return '₦' + (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return '₦' + (num / 1000).toFixed(0) + 'K';
    }
    
    return '₦' + num.toLocaleString('en-NG');
}

/**
 * Format date in readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format date with full month name
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateLong(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return formatDate(date);
}

/**
 * Generate invoice number
 * @param {number} count - Current invoice count
 * @returns {string} Invoice number
 */
export function generateInvoiceNumber(count = 0) {
    const year = new Date().getFullYear();
    const num = String(count + 1).padStart(4, '0');
    return `INV-${year}-${num}`;
}

/**
 * Format phone number (Nigerian format)
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
    if (!phone) return '';
    
    // Remove non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format as Nigerian number
    if (digits.length === 11 && digits.startsWith('0')) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 13 && digits.startsWith('234')) {
        return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }
    
    return phone;
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
    if (!name) return '';
    
    return name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}