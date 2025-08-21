'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {

  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})


export const getWordMatchProgress = async (userId: string, difficulty: string) => {
  return supabase
    .from('word_match_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('difficulty', difficulty)
    .single();
};

export const updateWordMatchProgress = async (
  progressId: string,
  progressData: any
) => {
  return supabase
    .from('word_match_progress')
    .update(progressData)
    .eq('id', progressId);
};

export const createWordMatchProgress = async (progressData: any) => {
  return supabase
    .from('word_match_progress')
    .insert(progressData)
    .select()
    .single();
};

