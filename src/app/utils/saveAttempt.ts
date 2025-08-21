
import { supabase } from "@/lib/supabaseClient";

export async function saveAttempt(userId: string, question: {
  type: string;         // np. "flashcard"
  id: string;           // id pytania/słówka
  isCorrect: boolean;
  timeTaken: number;    // w sekundach
  difficulty?: string;  // opcjonalnie A1/B1 itp.
}) {
  const { error } = await supabase.from("question_attempts").insert([{
    user_id: userId,
    question_type: question.type,
    question_id: question.id,
    is_correct: question.isCorrect,
    time_taken: question.timeTaken,
    difficulty: question.difficulty || null,
  }]);

  if (error) console.error("Error saving attempt:", error);
}
