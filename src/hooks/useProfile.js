import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Prevent multiple fetches
    const fetchedRef = useRef(false);
    const userIdRef = useRef(null);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setProfile(null);
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
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle(); // Use maybeSingle instead of single to avoid error when no row exists

            if (fetchError) {
                console.error('Profile fetch error:', fetchError);
                setError(fetchError.message);
                setProfile(null);
            } else {
                setProfile(data);
                fetchedRef.current = true;
                userIdRef.current = user.id;
            }
        } catch (err) {
            console.error('Profile fetch exception:', err);
            setError(err.message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch only when user changes
    useEffect(() => {
        // Reset refs when user changes
        if (user?.id !== userIdRef.current) {
            fetchedRef.current = false;
        }
        
        fetchProfile();
    }, [user?.id]); // Only depend on user.id, not the whole fetchProfile function

    const updateProfile = useCallback(async (updates) => {
        if (!user?.id) {
            throw new Error('Must be logged in');
        }

        const { data, error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...updates,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            })
            .select()
            .maybeSingle();

        if (updateError) {
            throw updateError;
        }

        setProfile(data);
        return data;
    }, [user?.id]);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile
    };
}