import { useCallback, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';

type StreakRow = { current_streak: number; best_streak: number; last_date: string | null };

export function useStreak() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [streak, setStreak] = useState<StreakRow | null>(null);
  const supabase = createSupabaseBrowserClient();
  
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
      const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        }
      };
  
      getUser();
    }, []);  
const fetchStreak = useCallback(async () => {
  try {
    setLoading(true);
    const { data, error: supabaseError } = await supabase
      .from('streaks')
      .select('current_streak,best_streak,last_date')
      .single(); // <-- zamiast .single()

    if (supabaseError) throw supabaseError;
    setStreak(data); // data może być null, wtedy oznacza brak wpisu
  } catch (err) {
    setError(err as Error);
    console.error('Failed to fetch streak:', err);
  } finally {
    setLoading(false);
  }
}, [supabase]);




  const markToday = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase.rpc('update_streak');
      
      if (supabaseError) throw supabaseError;
      
      // Najpierw odświeżamy dane z bazy
      await fetchStreak();
      
      // Alternatywnie, jeśli RPC zwraca aktualne dane:
      if (data) {
        const result = Array.isArray(data) ? data[0] : data;
        setStreak({
          current_streak: result.current_streak,
          best_streak: result.best_streak,
          last_date: result.last_date,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to mark today:', err);
      throw err; // Pozwól komponentowi nadrzędnemu obsłużyć błąd
    } finally {
      setLoading(false);
    }
  }, [supabase, fetchStreak]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return { loading, streak, error, refresh: fetchStreak, markToday };
}