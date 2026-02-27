import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useInvoices() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Prevent duplicate fetches
    const fetchedRef = useRef(false);
    const userIdRef = useRef(null);

    // Fetch invoices
    const fetchInvoices = useCallback(async () => {
        if (!user?.id) {
            setInvoices([]);
            setLoading(false);
            return;
        }

        // Prevent refetching for same user on mount
        if (fetchedRef.current && userIdRef.current === user.id) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('invoices')
                .select(`
                    *,
                    clients (
                        id,
                        name,
                        company_name,
                        email
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const transformedData = (data || []).map(invoice => ({
                ...invoice,
                client_name: invoice.clients?.name || invoice.clients?.company_name || null
            }));

            setInvoices(transformedData);
            fetchedRef.current = true;
            userIdRef.current = user.id;
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch on mount - reset ref when user changes
    useEffect(() => {
        if (user?.id !== userIdRef.current) {
            fetchedRef.current = false;
        }
        fetchInvoices();
    }, [user?.id]);

    // Generate invoice number
    const generateInvoiceNumber = useCallback(async (prefix = 'INV') => {
        if (!user?.id) throw new Error('Must be logged in');

        try {
            // Get the count of existing invoices for this user
            const { count, error } = await supabase
                .from('invoices')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (error) throw error;

            // Generate number: PREFIX-YYYYMMDD-XXX
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const sequence = String((count || 0) + 1).padStart(3, '0');

            return `${prefix}-${year}${month}${day}-${sequence}`;
        } catch (err) {
            console.error('Error generating invoice number:', err);
            // Fallback to timestamp-based number
            return `${prefix}-${Date.now()}`;
        }
    }, [user?.id]);

    // Create invoice with items
    const createInvoice = useCallback(async (invoiceData, items = []) => {
        if (!user?.id) throw new Error('Must be logged in');

        // Insert invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert([{ 
                ...invoiceData, 
                user_id: user.id 
            }])
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // Insert line items if provided
        if (items.length > 0) {
            const itemsWithInvoiceId = items.map(item => ({
                invoice_id: invoice.id,
                description: item.description,
                quantity: parseFloat(item.quantity) || 1,
                unit_price: parseFloat(item.unit_price) || 0,
                total: parseFloat(item.total) || 0
            }));

            const { error: itemsError } = await supabase
                .from('invoice_items')
                .insert(itemsWithInvoiceId);

            if (itemsError) {
                console.error('Error inserting items:', itemsError);
            }
        }

        // Reset fetch ref to allow refresh
        fetchedRef.current = false;
        await fetchInvoices();
        
        return invoice;
    }, [user?.id, fetchInvoices]);

    // Update invoice
    const updateInvoice = useCallback(async (id, updates, items = null) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('invoices')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        // Update items if provided
        if (items !== null) {
            // Delete existing items
            await supabase
                .from('invoice_items')
                .delete()
                .eq('invoice_id', id);

            // Insert new items
            if (items.length > 0) {
                const itemsWithInvoiceId = items.map(item => ({
                    invoice_id: id,
                    description: item.description,
                    quantity: parseFloat(item.quantity) || 1,
                    unit_price: parseFloat(item.unit_price) || 0,
                    total: parseFloat(item.total) || 0
                }));

                await supabase
                    .from('invoice_items')
                    .insert(itemsWithInvoiceId);
            }
        }

        fetchedRef.current = false;
        await fetchInvoices();
        return data;
    }, [user?.id, fetchInvoices]);

    // Update invoice status only (optimistic update)
    const updateInvoiceStatus = useCallback(async (id, status) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        // Update local state without refetching
        setInvoices(prev => prev.map(inv => 
            inv.id === id ? { ...inv, status } : inv
        ));

        return data;
    }, [user?.id]);

    // Delete invoice
    const deleteInvoice = useCallback(async (id) => {
        if (!user?.id) throw new Error('Must be logged in');

        // Delete items first
        await supabase
            .from('invoice_items')
            .delete()
            .eq('invoice_id', id);

        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        // Update local state
        setInvoices(prev => prev.filter(inv => inv.id !== id));
    }, [user?.id]);

    // Get single invoice
    const getInvoice = useCallback(async (id) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                clients (*),
                invoice_items (*)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    }, [user?.id]);

    return {
        invoices,
        loading,
        error,
        fetchInvoices,
        generateInvoiceNumber,
        createInvoice,
        updateInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        getInvoice
    };
}