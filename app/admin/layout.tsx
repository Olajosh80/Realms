"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/admin/Sidebar/Sidebar';
import Topbar from '@/app/admin/Topbar/topbar';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) {
          router.replace(`/signin?returnTo=${encodeURIComponent('/admin')}`);
          return;
        }

        // fetch user profile to check role
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        // Debug logging (check browser console)
        console.log('[Admin Layout] User ID:', user.id);
        console.log('[Admin Layout] Profile:', profile);
        console.log('[Admin Layout] Error:', error);

        if (error) {
          console.error('[Admin Layout] Profile fetch error:', error);
          router.replace(`/signin?returnTo=${encodeURIComponent('/admin')}`);
          return;
        }

        if (!profile || profile.role !== 'admin') {
          console.warn('[Admin Layout] Access denied - Profile:', profile, 'Expected role: admin');
          router.replace(`/signin?returnTo=${encodeURIComponent('/admin')}`);
          return;
        }

        console.log('[Admin Layout] Access granted - Admin user confirmed');
      } catch (err) {
        console.error('Admin auth check failed', err);
        router.replace('/signin');
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Checking permissions...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
