import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { useToast } from '../components/common/Toast';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { ContentLoader } from '../components/common/Loader';

export default function InvoiceEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getInvoice, updateInvoice } = useInvoices();
    const { clients } = useClients();
    const toast = useToast();
    
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current) return;
        
        const loadInvoice = async () => {
            try {
                const data = await getInvoice(id);
                setInvoice(data);
                loadedRef.current = true;
            } catch (err) {
                console.error('Failed to load invoice:', err);
                setError('Invoice not found');
                toast.error('Invoice not found');
            } finally {
                setLoading(false);
            }
        };
        
        loadInvoice();
    }, [id]);

    const handleSubmit = async (invoiceData, items) => {
        setSaving(true);
        try {
            await updateInvoice(id, invoiceData, items);
            toast.success('Invoice updated');
            navigate(`/invoices/${id}`);
        } catch (err) {
            console.error('Failed to update invoice:', err);
            toast.error('Failed to update invoice');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/invoices/${id}`);
    };

    if (loading) {
        return <ContentLoader />;
    }

    if (error || !invoice) {
        return (
            <div className="invoice-edit">
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h2 className="empty-state__title">Invoice not found</h2>
                    <p className="empty-state__text">The invoice you're looking for doesn't exist.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/invoices')}>
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="invoice-edit">
            <header className="invoice-edit__header">
                <h1 className="invoice-edit__title">Edit Invoice</h1>
                <p className="invoice-edit__subtitle">{invoice.invoice_number}</p>
            </header>

            <InvoiceForm
                initialData={invoice}
                clients={clients}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={saving}
                submitLabel="Update Invoice"
            />
        </div>
    );
}