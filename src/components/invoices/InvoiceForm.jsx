import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { LineItemRow } from './LineItemRow';
import { formatCurrency } from '../../lib/formatters';

const emptyLineItem = { description: '', quantity: 1, unit_price: 0, total: 0 };
const emptyCharge = { label: '', amount: 0 };

// Icon style to force sizing
const iconBoxStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    flexShrink: 0
};

const iconStyle = {
    width: '18px',
    height: '18px'
};

export function InvoiceForm({ 
    initialData = {}, 
    clients = [], 
    onSubmit, 
    onCancel, 
    loading = false,
    submitLabel = 'Save Invoice'
}) {
    const { profile } = useProfile();
    
    const [formData, setFormData] = useState({
        invoice_number: '',
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'draft',
        notes: '',
        include_bank_details: false
    });
    
    const [items, setItems] = useState([{ ...emptyLineItem }]);
    const [additionalCharges, setAdditionalCharges] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                invoice_number: initialData.invoice_number || prev.invoice_number,
                client_id: initialData.client_id || '',
                invoice_date: initialData.invoice_date || prev.invoice_date,
                due_date: initialData.due_date || '',
                status: initialData.status || 'draft',
                notes: initialData.notes || '',
                include_bank_details: initialData.include_bank_details || false
            }));
            
            if (initialData.invoice_items?.length > 0) {
                setItems(initialData.invoice_items.map(item => ({
                    id: item.id,
                    description: item.description || '',
                    quantity: item.quantity || 1,
                    unit_price: item.unit_price || 0,
                    total: item.total || 0
                })));
            }

            if (initialData.additional_charges?.length > 0) {
                setAdditionalCharges(initialData.additional_charges);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleItemChange = (index, updatedItem) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = updatedItem;
            return newItems;
        });
    };

    const handleAddItem = () => setItems(prev => [...prev, { ...emptyLineItem }]);
    const handleRemoveItem = (index) => items.length > 1 && setItems(prev => prev.filter((_, i) => i !== index));

    const handleAddCharge = () => setAdditionalCharges(prev => [...prev, { ...emptyCharge }]);
    const handleChargeChange = (index, field, value) => {
        setAdditionalCharges(prev => {
            const newCharges = [...prev];
            newCharges[index] = { ...newCharges[index], [field]: value };
            return newCharges;
        });
    };
    const handleRemoveCharge = (index) => setAdditionalCharges(prev => prev.filter((_, i) => i !== index));

    const calculateSubtotal = () => items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const calculateChargesTotal = () => additionalCharges.reduce((sum, charge) => sum + (parseFloat(charge.amount) || 0), 0);
    const calculateTotal = () => calculateSubtotal() + calculateChargesTotal();

    const handleSubmit = (e) => {
        e.preventDefault();
        const invoiceData = { 
            ...formData, 
            subtotal: calculateSubtotal(), 
            total: calculateTotal(),
            additional_charges: additionalCharges.filter(c => c.label?.trim())
        };
        const validItems = items.filter(item => item.description?.trim());
        onSubmit(invoiceData, validItems);
    };

    const hasBankDetails = profile?.bank_name && profile?.account_name && profile?.account_number;

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const clientOptions = [
        { value: '', label: 'Select a client' },
        ...clients.map(c => ({ value: c.id, label: c.name || c.company_name }))
    ];

    return (
        <form className="invoice-form" onSubmit={handleSubmit}>
            {/* Invoice Details */}
            <section className="invoice-form__section invoice-form__section--details">
                <header className="invoice-form__section-header">
                    <div className="invoice-form__section-icon" style={iconBoxStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                    </div>
                    <h2 className="invoice-form__section-title">Invoice Details</h2>
                </header>
                <div className="invoice-form__section-body">
                    <div className="invoice-form__grid">
                        <Input label="Invoice Number" name="invoice_number" value={formData.invoice_number} onChange={handleChange} required />
                        <Select label="Client" name="client_id" value={formData.client_id} onChange={handleChange} options={clientOptions} />
                    </div>
                    <div className="invoice-form__grid invoice-form__grid--3" style={{ marginTop: 'var(--space-4)' }}>
                        <Input label="Invoice Date" type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} required />
                        <Input label="Due Date" type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
                        <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} />
                    </div>
                </div>
            </section>

            {/* Line Items */}
            <section className="invoice-form__section invoice-form__section--items">
                <header className="invoice-form__section-header">
                    <div className="invoice-form__section-icon" style={iconBoxStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6"/>
                            <line x1="8" y1="12" x2="21" y2="12"/>
                            <line x1="8" y1="18" x2="21" y2="18"/>
                            <line x1="3" y1="6" x2="3.01" y2="6"/>
                            <line x1="3" y1="12" x2="3.01" y2="12"/>
                            <line x1="3" y1="18" x2="3.01" y2="18"/>
                        </svg>
                    </div>
                    <h2 className="invoice-form__section-title">Line Items</h2>
                </header>
                <div className="invoice-form__section-body">
                    <div className="line-items">
                        <div className="line-items__header">
                            <span>Description</span>
                            <span>Qty</span>
                            <span>Unit Price</span>
                            <span>Total</span>
                            <span></span>
                        </div>
                        <div className="line-items__rows">
                            {items.map((item, index) => (
                                <LineItemRow
                                    key={index}
                                    item={item}
                                    index={index}
                                    onChange={handleItemChange}
                                    onRemove={handleRemoveItem}
                                    canRemove={items.length > 1}
                                />
                            ))}
                        </div>
                        <button type="button" className="line-items__add" onClick={handleAddItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add Line Item
                        </button>
                    </div>

                    {/* Additional Charges */}
                    <div className="additional-charges">
                        <div className="additional-charges__header">
                            <span className="additional-charges__title">Additional Charges</span>
                            <button type="button" className="additional-charges__add" onClick={handleAddCharge}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Add Charge
                            </button>
                        </div>
                        
                        {additionalCharges.length > 0 ? (
                            <div className="additional-charges__list">
                                {additionalCharges.map((charge, index) => (
                                    <div key={index} className="additional-charge">
                                        <Input
                                            placeholder="e.g. Logistics, Installation, Delivery"
                                            value={charge.label || ''}
                                            onChange={(e) => handleChargeChange(index, 'label', e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            value={charge.amount || ''}
                                            onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                                            min="0"
                                            step="0.01"
                                        />
                                        <button type="button" className="additional-charge__remove" onClick={() => handleRemoveCharge(index)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"/>
                                                <line x1="6" y1="6" x2="18" y2="18"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="additional-charges__empty">
                                No additional charges — click "Add Charge" for logistics, installation, etc.
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="invoice-form__totals">
                        <div className="invoice-form__totals-row">
                            <span className="invoice-form__totals-label">Subtotal</span>
                            <span className="invoice-form__totals-value">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {additionalCharges.filter(c => c.label && c.amount > 0).map((charge, i) => (
                            <div key={i} className="invoice-form__totals-row">
                                <span className="invoice-form__totals-label">{charge.label}</span>
                                <span className="invoice-form__totals-value">{formatCurrency(charge.amount)}</span>
                            </div>
                        ))}
                        <div className="invoice-form__totals-row invoice-form__totals-row--total">
                            <span className="invoice-form__totals-label">Total</span>
                            <span className="invoice-form__totals-value">{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Options */}
            <section className="invoice-form__section invoice-form__section--payment">
                <header className="invoice-form__section-header">
                    <div className="invoice-form__section-icon" style={iconBoxStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                    </div>
                    <h2 className="invoice-form__section-title">Payment Options</h2>
                </header>
                <div className="invoice-form__section-body">
                    <div className="invoice-form__toggle-wrapper">
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="include_bank_details"
                                checked={formData.include_bank_details}
                                onChange={handleChange}
                                disabled={!hasBankDetails}
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">Include bank details for payment</span>
                        </label>
                        
                        {!hasBankDetails && (
                            <p className="invoice-form__toggle-hint">
                                <Link to="/settings">Add your bank details in Settings</Link> to enable this option
                            </p>
                        )}
                        
                        {hasBankDetails && formData.include_bank_details && (
                            <div className="invoice-form__bank-preview">
                                <div className="invoice-form__bank-item">
                                    <span className="invoice-form__bank-label">Bank</span>
                                    <span className="invoice-form__bank-value">{profile.bank_name}</span>
                                </div>
                                <div className="invoice-form__bank-item">
                                    <span className="invoice-form__bank-label">Account Name</span>
                                    <span className="invoice-form__bank-value">{profile.account_name}</span>
                                </div>
                                <div className="invoice-form__bank-item">
                                    <span className="invoice-form__bank-label">Account Number</span>
                                    <span className="invoice-form__bank-value">{profile.account_number}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Notes */}
            <section className="invoice-form__section invoice-form__section--notes">
                <header className="invoice-form__section-header">
                    <div className="invoice-form__section-icon" style={iconBoxStyle}>
                        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                    </div>
                    <h2 className="invoice-form__section-title">Additional Notes</h2>
                </header>
                <div className="invoice-form__section-body">
                    <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Payment terms, thank you message, special instructions..."
                        rows={4}
                    />
                </div>
            </section>

            {/* Actions */}
            <div className="invoice-form__actions">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={loading}>{submitLabel}</Button>
            </div>
        </form>
    );
}