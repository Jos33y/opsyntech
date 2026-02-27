import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useClients() {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Prevent duplicate fetches
    const fetchedRef = useRef(false);
    const userIdRef = useRef(null);

    // Fetch clients
    const fetchClients = useCallback(async () => {
        if (!user?.id) {
            setClients([]);
            setLoading(false);
            return;
        }

        // Prevent refetching for same user
        if (fetchedRef.current && userIdRef.current === user.id) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', user.id)
                .order('name', { ascending: true });

            if (fetchError) throw fetchError;

            setClients(data || []);
            fetchedRef.current = true;
            userIdRef.current = user.id;
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch on mount
    useEffect(() => {
        if (user?.id !== userIdRef.current) {
            fetchedRef.current = false;
        }
        fetchClients();
    }, [user?.id]);

    // Search clients locally
    const searchClients = useCallback((query) => {
        if (!query?.trim()) return clients;
        
        const searchTerm = query.toLowerCase();
        return clients.filter(client => 
            client.name?.toLowerCase().includes(searchTerm) ||
            client.company_name?.toLowerCase().includes(searchTerm) ||
            client.email?.toLowerCase().includes(searchTerm) ||
            client.phone?.includes(searchTerm)
        );
    }, [clients]);

    // Create client
    const createClient = useCallback(async (clientData) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('clients')
            .insert([{ ...clientData, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        
        // Update local state
        setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        return data;
    }, [user?.id]);

    // Update client
    const updateClient = useCallback(async (id, updates) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        
        // Update local state
        setClients(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name)));
        return data;
    }, [user?.id]);

    // Delete client
    const deleteClient = useCallback(async (id) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        
        // Update local state
        setClients(prev => prev.filter(c => c.id !== id));
    }, [user?.id]);

    // Get single client
    const getClient = useCallback(async (id) => {
        if (!user?.id) throw new Error('Must be logged in');

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    }, [user?.id]);

    return {
        clients,
        loading,
        error,
        fetchClients,
        searchClients,
        createClient,
        updateClient,
        deleteClient,
        getClient
    };
}