import { useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useApiKeysStore } from '../store/apiKeys';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useSupabase(): SupabaseClient | null {
  const userAnonKey = useApiKeysStore((s) => s.keys.supabase.anonKey);

  return useMemo(() => {
    const anonKey = userAnonKey || envAnonKey;
    if (!envUrl || !anonKey) return null;
    return createClient(envUrl, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }, [userAnonKey]);
}
