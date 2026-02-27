import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { useProfile } from '../hooks/useProfile';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { ContentLoader } from '../components/common/Loader';
import { useToast } from '../components/common/Toast';

export default function InvoiceCreate() {
    const navigate = useNavigate();
    const { generateInvoiceNumber, createInvoice } = useInvoices();
    const { clients, loading: clientsLoading } = useClients();
    const { profile, loading: profileLoading } = useProfile();
    const toast = useToast();

    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Prevent double initialization
    const initRef = useRef(false);

    useEffect(() => {
        // Wait for profile to load and only init once
        if (profileLoading || initRef.current) return;
        
        const init = async () => {
            initRef.current = true;
            
            try {
                const prefix = profile?.invoice_prefix || 'INV';
                const invoiceNumber = await generateInvoiceNumber(prefix);
                
                const today = new Date();
                const dueDate = new Date();
                dueDate.setDate(today.getDate() + (profile?.default_due_days || 7));

                // Format dates as YYYY-MM-DD for input[type="date"]
                const formatDateForInput = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                setInitialData({
                    invoice_number: invoiceNumber,
                    invoice_date: formatDateForInput(today),
                    due_date: formatDateForInput(dueDate),
                    notes: profile?.default_notes || ''
                });
            } catch (error) {
                console.error('Init error:', error);
                // Still set some default data so the form can work
                const today = new Date();
                const dueDate = new Date();
                dueDate.setDate(today.getDate() + 7);
                
                setInitialData({
                    invoice_number: `INV-${Date.now()}`,
                    invoice_date: today.toISOString().split('T')[0],
                    due_date: dueDate.toISOString().split('T')[0],
                    notes: ''
                });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [profileLoading, profile, generateInvoiceNumber]);

    const handleSubmit = async (formData, items) => {
        setSubmitting(true);
        try {
            const invoice = await createInvoice(formData, items);
            toast.success('Invoice created');
            navigate('/invoices/' + invoice.id);
        } catch (error) {
            console.error('Create error:', error);
            toast.error('Failed to create invoice');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/invoices');
    };

    if (loading || clientsLoading || profileLoading) {
        return <ContentLoader />;
    }

    return (
        <div className="invoice-create">
            <header className="invoice-create__header">
                <h1 className="invoice-create__title">New Invoice</h1>
            </header>
            <InvoiceForm
                initialData={initialData}
                clients={clients}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={submitting}
                submitLabel="Create Invoice"
            />
        </div>
    );
}