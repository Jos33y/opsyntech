import { Link } from 'react-router-dom';
import { formatCurrency, formatRelativeTime } from '../../lib/formatters';

const statusConfig = {
    draft: { label: 'Draft', class: 'is-draft' },
    pending: { label: 'Pending', class: 'is-pending' },
    paid: { label: 'Paid', class: 'is-paid' },
    overdue: { label: 'Overdue', class: 'is-overdue' },
    cancelled: { label: 'Cancelled', class: 'is-cancelled' }
};

export function RecentInvoices({ invoices = [] }) {
    const hasInvoices = invoices && invoices.length > 0;

    return (
        <div className="recent-card">
            <div className="recent-card__header">
                <h3 className="recent-card__title">Recent Invoices</h3>
                {hasInvoices && (
                    <Link to="/invoices" className="recent-card__action">
                        View all
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                )}
            </div>
            <div className="recent-card__body">
                {hasInvoices ? (
                    <div className="recent-list">
                        {invoices.slice(0, 5).map((invoice, index) => {
                            const status = statusConfig[invoice.status] || statusConfig.draft;
                            return (
                                <Link
                                    key={invoice.id}
                                    to={`/invoices/${invoice.id}`}
                                    className="recent-item"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="recent-item__icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                            <path d="M14 2v6h6"/>
                                        </svg>
                                    </div>
                                    <div className="recent-item__info">
                                        <span className="recent-item__number">{invoice.invoice_number}</span>
                                        <span className="recent-item__client">{invoice.client_name || 'No client'}</span>
                                    </div>
                                    <div className="recent-item__meta">
                                        <span className="recent-item__amount">{formatCurrency(invoice.total)}</span>
                                        <span className={`recent-item__status ${status.class}`}>{status.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="recent-empty">
                        <div className="recent-empty__illustration">
                            {/* Custom illustration - stack of papers */}
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <rect x="16" y="20" width="48" height="56" rx="4" fill="rgba(255,107,0,0.08)" stroke="rgba(255,107,0,0.3)" strokeWidth="1.5"/>
                                <rect x="12" y="14" width="48" height="56" rx="4" fill="rgba(255,107,0,0.05)" stroke="rgba(255,107,0,0.2)" strokeWidth="1.5"/>
                                <rect x="8" y="8" width="48" height="56" rx="4" fill="#18181B" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                                <line x1="20" y1="24" x2="44" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="20" y1="32" x2="36" y2="32" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="20" y1="40" x2="40" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="56" cy="56" r="16" fill="#FF6B00"/>
                                <line x1="56" y1="50" x2="56" y2="62" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                <line x1="50" y1="56" x2="62" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h4 className="recent-empty__title">No invoices yet</h4>
                        <p className="recent-empty__text">Create your first invoice to start tracking your revenue and client payments.</p>
                        <Link to="/invoices/new" className="recent-empty__cta">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Create Invoice
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}