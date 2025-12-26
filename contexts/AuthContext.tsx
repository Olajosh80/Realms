'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    role: 'admin' | 'user';
    full_name?: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUserProfile = async (userId: string) => {
        try {
            const { data: profileData, error } = await supabase
                .from('user_profiles')
                .select('id, role, full_name, email')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                // Log detailed error information
                console.warn('[AuthContext] Error loading profile:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });

                // Set profile to null but don't block - user is still authenticated
                // The middleware will handle admin access control
                setProfile(null);
                return;
            }

            if (!profileData) {
                console.warn('[AuthContext] No profile found for user:', userId);
                // User exists but has no profile - they may need to complete registration
                setProfile(null);
                return;
            }

            setProfile(profileData);
            console.log('[AuthContext] Profile loaded:', { id: profileData.id, role: profileData.role });
        } catch (err) {
            console.error('[AuthContext] Exception loading profile:', err);
            setProfile(null);
        }
    };

    const refreshAuth = async () => {
        try {
            setIsLoading(true);
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            setUser(currentUser);

            if (currentUser) {
                await loadUserProfile(currentUser.id);
            } else {
                setProfile(null);
            }
        } catch (err) {
            console.error('[AuthContext] Error refreshing auth:', err);
            setUser(null);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize auth state on mount
    useEffect(() => {
        refreshAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[AuthContext] Auth state changed:', event);

                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    await loadUserProfile(currentUser.id);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
        } catch (err) {
            console.error('[AuthContext] Error signing out:', err);
        }
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                isLoading,
                isAdmin,
                signOut,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
