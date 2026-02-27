import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../../lib/formatters';

export function InvoiceCard({ invoice, onDelete, onStatusChange }) {
    const navigate = useNavigate();

    const handleMarkPaid = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onStatusChange?.(invoice.id, 'paid');
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/invoices/${invoice.id}/edit`);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(invoice.id);
    };

    return (
        <Link to={`/invoices/${invoice.id}`} className={`invoice-card invoice-card--${invoice.status}`}>
            <div className="invoice-card__inner">
                <div className="invoice-card__main">
                    <div className="invoice-card__header">
                        <span className="invoice-card__number">{invoice.invoice_number}</span>
                        <StatusBadge status={invoice.status} />
                    </div>
                    <div className="invoice-card__client">
                        {invoice.client_name || invoice.clients?.name || 'No client'}
                    </div>
                    <div className="invoice-card__meta">
                        <span className="invoice-card__date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {formatDate(invoice.invoice_date)}
                        </span>
                        {invoice.due_date && (
                            <span className="invoice-card__due">Due {formatDate(invoice.due_date)}</span>
                        )}
                    </div>
                </div>

                <div className="invoice-card__right">
                    <span className="invoice-card__amount">{formatCurrency(invoice.total)}</span>
                    
                    <div className="invoice-card__actions">
                        {invoice.status === 'pending' && (
                            <button className="invoice-card__action invoice-card__action--success" onClick={handleMarkPaid} title="Mark Paid">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </button>
                        )}
                        <button className="invoice-card__action" onClick={handleEdit} title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button className="invoice-card__action invoice-card__action--danger" onClick={handleDelete} title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}