'use client';

import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseConfig } from './supabase/config';

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


