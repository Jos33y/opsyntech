import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceCard } from '../components/invoices/InvoiceCard';
import { Button } from '../components/common/Button';
import { Modal, ModalFooter } from '../components/common/Modal';
import { ContentLoader } from '../components/common/Loader';
import { useToast } from '../components/common/Toast';

const STATUS_TABS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'draft', label: 'Draft' }
];

export default function Invoices() {
    const { invoices, loading, fetchInvoices, updateInvoiceStatus, deleteInvoice } = useInvoices();
    const toast = useToast();
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Invoices are fetched in the hook on mount, no need to call again
    // useEffect removed - hook handles initial fetch

    // Filter invoices locally
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
            const matchesSearch = !search || 
                inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
                inv.client_name?.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [invoices, statusFilter, search]);

    // Count by status
    const statusCounts = useMemo(() => {
        const counts = { all: invoices.length };
        STATUS_TABS.slice(1).forEach(tab => {
            counts[tab.value] = invoices.filter(inv => inv.status === tab.value).length;
        });
        return counts;
    }, [invoices]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInvoiceStatus(id, newStatus);
            toast.success('Invoice updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteClick = (id) => setDeleteId(id);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteInvoice(deleteId);
            toast.success('Invoice deleted');
            setDeleteId(null);
        } catch (error) {
            toast.error('Failed to delete invoice');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && invoices.length === 0) {
        return <ContentLoader />;
    }

    return (
        <div className="invoices-page">
            <header className="invoices-page__header">
                <div className="invoices-page__title-group">
                    <h1 className="invoices-page__title">Invoices</h1>
                    <p className="invoices-page__subtitle">
                        {invoices.length} total invoice{invoices.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link to="/invoices/new">
                    <Button>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        New Invoice
                    </Button>
                </Link>
            </header>

            <div className="invoices-filters">
                <div className="invoices-search">
                    <svg className="invoices-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        className="invoices-search__input"
                        placeholder="Search invoices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="invoices-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.value}
                            className={`invoices-tab${statusFilter === tab.value ? ' is-active' : ''}`}
                            onClick={() => setStatusFilter(tab.value)}
                        >
                            {tab.label}
                            {statusCounts[tab.value] > 0 && (
                                <span className="invoices-tab__count">{statusCounts[tab.value]}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="invoices-list">
                {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                        <InvoiceCard
                            key={invoice.id}
                            invoice={invoice}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteClick}
                        />
                    ))
                ) : (
                    <div className="invoices-empty">
                        <div className="invoices-empty__illustration">
                            <svg className="invoices-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        {invoices.length === 0 ? (
                            <>
                                <h2 className="invoices-empty__title">Create your first invoice</h2>
                                <p className="invoices-empty__text">
                                    Start tracking payments by creating an invoice for your clients
                                </p>
                                <Link to="/invoices/new">
                                    <Button>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19"/>
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        New Invoice
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <h2 className="invoices-empty__title">No invoices found</h2>
                                <p className="invoices-empty__text">
                                    Try adjusting your search or filter
                                </p>
                                <Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
                                    Clear Filters
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Invoice" size="sm">
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Are you sure? This cannot be undone.
                </p>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>Delete</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}