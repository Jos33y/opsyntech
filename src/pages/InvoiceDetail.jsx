import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { useProfile } from '../hooks/useProfile';
import { formatCurrency, formatDate } from '../lib/formatters';

const statusConfig = {
    draft: { label: 'Draft', class: 'inv__status--draft' },
    pending: { label: 'Pending', class: 'inv__status--pending' },
    paid: { label: 'Paid', class: 'inv__status--paid' },
    overdue: { label: 'Overdue', class: 'inv__status--overdue' },
    cancelled: { label: 'Cancelled', class: 'inv__status--cancelled' }
};

export default function InvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getInvoice, updateInvoice, deleteInvoice } = useInvoices();
    const { profile } = useProfile();
    
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        try {
            setLoading(true);
            const data = await getInvoice(id);
            setInvoice(data);
        } catch (err) {
            setError('Invoice not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateInvoice(id, { status: newStatus });
            setInvoice(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await deleteInvoice(id);
            navigate('/invoices');
        } catch (err) {
            console.error('Failed to delete invoice:', err);
        }
    };

    const handlePrint = () => {
        // Set document title for PDF filename
        const clientName = client?.name || client?.company_name || 'Client';
        const safeName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
        const originalTitle = document.title;
        document.title = `Invoice_${invoice.invoice_number}_${safeName}`;
        
        window.print();
        
        // Restore original title after print dialog
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    if (loading) {
        return (
            <div className="invoice-detail">
                <div className="invoice-detail__header">
                    <div className="skeleton skeleton--title"></div>
                </div>
                <div className="skeleton skeleton--card" style={{ height: '500px' }}></div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="invoice-detail">
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h2 className="empty-state__title">Invoice not found</h2>
                    <p className="empty-state__text">The invoice you're looking for doesn't exist or has been deleted.</p>
                    <Link to="/invoices" className="btn btn--primary">Back to Invoices</Link>
                </div>
            </div>
        );
    }

    const status = statusConfig[invoice.status] || statusConfig.draft;
    const client = invoice.clients;
    const items = invoice.invoice_items || [];
    const additionalCharges = invoice.additional_charges || [];
    const showBankDetails = invoice.include_bank_details && profile?.bank_name;
    const subtotal = invoice.subtotal || items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

    return (
        <div className="invoice-detail">
            {/* Page Header - Hidden on Print */}
            <div className="invoice-detail__header no-print">
                <div>
                    <Link to="/invoices" className="invoice-detail__back">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Back to Invoices
                    </Link>
                    <h1 className="invoice-detail__title">{invoice.invoice_number}</h1>
                </div>
                <div className="invoice-detail__actions">
                    <button className="btn btn--primary" onClick={handlePrint}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9"/>
                            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                            <rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        Print
                    </button>
                    <Link to={`/invoices/${id}/edit`} className="btn btn--secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                    </Link>
                    <button className="btn btn--secondary" onClick={handleDelete}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            {/* ========== PREMIUM INVOICE ========== */}
            <div className="inv">
                {/* Invoice Header with Dark Background */}
                <div className="inv__header">
                    <div className="inv__header-brand">
                        <div className="inv__brand-logo">
                            <div className="inv__brand-main">
                                <span className="inv__power-o"></span>
                                <span className="inv__brand-text">PSYN</span>
                            </div>
                            <div className="inv__brand-underline"></div>
                            <div className="inv__brand-tagline">TECHNOLOGIES</div>
                        </div>
                    </div>
                    <div className="inv__header-title">
                        <div className="inv__label">INVOICE</div>
                        <div className="inv__number">{invoice.invoice_number}</div>
                    </div>
                </div>

                {/* Status & Amount Bar */}
                <div className="inv__bar">
                    <div className="inv__bar-left">
                        <div className="inv__bar-item">
                            <span className="inv__bar-label">Issue Date</span>
                            <span className="inv__bar-value">{formatDate(invoice.invoice_date)}</span>
                        </div>
                        {invoice.due_date && (
                            <div className="inv__bar-item">
                                <span className="inv__bar-label">Due Date</span>
                                <span className="inv__bar-value inv__bar-value--due">{formatDate(invoice.due_date)}</span>
                            </div>
                        )}
                        <div className="inv__bar-item">
                            <span className="inv__bar-label">Status</span>
                            <span className={`inv__status ${status.class}`}>{status.label}</span>
                        </div>
                    </div>
                    <div className="inv__bar-right">
                        <span className="inv__bar-label">Amount Due</span>
                        <span className="inv__amount">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>

                {/* Parties: From / Bill To */}
                <div className="inv__parties">
                    <div className="inv__party">
                        <div className="inv__party-label">From</div>
                        <div className="inv__party-name">{profile?.company_name || 'Your Business'}</div>
                        <div className="inv__party-info">
                            {profile?.email && <div>{profile.email}</div>}
                            {profile?.phone && <div>{profile.phone}</div>}
                            {profile?.address && <div>{profile.address}</div>}
                        </div>
                    </div>
                    <div className="inv__party">
                        <div className="inv__party-label">Bill To</div>
                        <div className="inv__party-name">{client?.name || client?.company_name || 'Client'}</div>
                        <div className="inv__party-info">
                            {client?.email && <div>{client.email}</div>}
                            {client?.phone && <div>{client.phone}</div>}
                            {client?.address && <div>{client.address}</div>}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="inv__table">
                    <thead>
                        <tr>
                            <th className="inv__th inv__th--desc">Description</th>
                            <th className="inv__th inv__th--qty">Qty</th>
                            <th className="inv__th inv__th--rate">Rate</th>
                            <th className="inv__th inv__th--amount">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map((item, index) => (
                            <tr key={item.id || index}>
                                <td className="inv__td inv__td--desc">{item.description}</td>
                                <td className="inv__td inv__td--qty">{item.quantity}</td>
                                <td className="inv__td inv__td--rate">{formatCurrency(item.unit_price)}</td>
                                <td className="inv__td inv__td--amount">{formatCurrency(item.total)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="inv__td--empty">No items</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="inv__totals">
                    <div className="inv__totals-box">
                        <div className="inv__totals-row">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {additionalCharges.map((charge, index) => (
                            <div key={index} className="inv__totals-row">
                                <span>{charge.label}</span>
                                <span>{formatCurrency(charge.amount)}</span>
                            </div>
                        ))}
                        <div className="inv__totals-row inv__totals-row--total">
                            <span>Total</span>
                            <span>{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                {showBankDetails && (
                    <div className="inv__payment">
                        <div className="inv__payment-header">Payment Information</div>
                        <div className="inv__payment-body">
                            <div className="inv__payment-item">
                                <span className="inv__payment-label">Bank Name</span>
                                <span className="inv__payment-value">{profile.bank_name}</span>
                            </div>
                            <div className="inv__payment-item">
                                <span className="inv__payment-label">Account Name</span>
                                <span className="inv__payment-value">{profile.account_name}</span>
                            </div>
                            <div className="inv__payment-item">
                                <span className="inv__payment-label">Account Number</span>
                                <span className="inv__payment-value inv__payment-value--highlight">{profile.account_number}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {invoice.notes && (
                    <div className="inv__notes">
                        <div className="inv__notes-header">Notes</div>
                        <div className="inv__notes-body">{invoice.notes}</div>
                    </div>
                )}

                {/* Footer */}
                <div className="inv__footer">
                    <div className="inv__footer-message">Thank you for your business!</div>
                    <div className="inv__footer-brand">
                        <span className="inv__footer-power-o"></span>
                        <span className="inv__footer-text">PSYN</span>
                        <span className="inv__footer-tagline">Technologies</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Hidden on Print */}
            <div className="invoice-detail__status-actions no-print">
                <span className="invoice-detail__status-label">Quick Actions:</span>
                <div className="invoice-detail__status-buttons">
                    {invoice.status !== 'paid' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleStatusChange('paid')}>
                            Mark as Paid
                        </button>
                    )}
                    {invoice.status === 'draft' && (
                        <button className="btn btn-sm btn-warning" onClick={() => handleStatusChange('pending')}>
                            Send Invoice
                        </button>
                    )}
                    {invoice.status === 'pending' && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleStatusChange('overdue')}>
                            Mark as Overdue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}