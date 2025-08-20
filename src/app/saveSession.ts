import { supabase } from "@/lib/supabaseClient";

export interface LearningSessionParams {
  user_id: string;
  activity_type: 'irregular_verbs' | 'flashcards' | 'word_match' | 'grammar_tasks';
  difficulty_level?: string;
  time_spent: number;
  correct_answers?: number;
  total_answers?: number;
  score?: number;
  details?: any;
}

export interface SessionTracker {
  startTime: number;
  correctAnswers: number;
  totalAnswers: number;
  details: any;
}

export const startLearningSession = (): SessionTracker => {
  return {
    startTime: Date.now(),
    correctAnswers: 0,
    totalAnswers: 0,
    details: {}
  };
};

export const endLearningSession = async (
  session: SessionTracker, 
  params: Omit<LearningSessionParams, 'time_spent' | 'correct_answers' | 'total_answers'>
) => {
  const timeSpent = Math.floor((Date.now() - session.startTime) / 1000); // w sekundach
  
  try {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert([{
        ...params,
        time_spent: timeSpent,
        correct_answers: session.correctAnswers,
        total_answers: session.totalAnswers,
        details: session.details
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving learning session:', error);
    return null;
  }
};

export const updateStreak = async (userId: string) => {
  try {
    // Sprawdź czy użytkownik już ma streak dzisiaj
    const today = new Date().toDateString();
    const { data: existingStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .gte('last_activity_date', new Date().toISOString().split('T')[0])
      .single();

    if (!existingStreak) {
      // Pobierz ostatni streak
      const { data: currentStreak } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      const newStreak = (currentStreak?.current_streak || 0) + 1;
      
      // Aktualizuj lub twórz nowy streak
      const { data, error } = await supabase
        .from('streaks')
        .upsert({
          user_id: userId,
          current_streak: newStreak,
          last_activity_date: new Date().toISOString(),
          longest_streak: Math.max(newStreak, currentStreak?.longest_streak || 0)
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};