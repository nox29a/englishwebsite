
import { supabase } from "@/lib/supabaseClient";

type QuestionAttempt = {
  type: string;
  id: number | string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty?: string;
  skillTags?: string[];
  prompt?: string;
  expectedAnswer?: string;
  userAnswer?: string;
  metadata?: Record<string, unknown>;
  lessonId?: string;
  templateId?: string;
  source?: string;
  mistakeTaxonomyId?: string;
  mistakeSeverity?: "low" | "medium" | "high";
  mistakeNote?: string;
};

export async function saveAttempt(userId: string, question: QuestionAttempt) {
  const now = new Date();
  const sessionStart = new Date(now.getTime() - Math.max(1, question.timeTaken) * 1000);

  const sessionPayload = {
    user_id: userId,
    lesson_id: question.lessonId ?? null,
    started_at: sessionStart.toISOString(),
    ended_at: now.toISOString(),
    source: question.source ?? question.type,
  };

  const { data: sessionData, error: sessionError } = await supabase
    .from("exercise_sessions")
    .insert([sessionPayload])
    .select("id")
    .single();

  if (sessionError || !sessionData) {
    console.error("Error creating exercise session:", sessionError?.message);
    return;
  }

  const attemptPayload = {
    session_id: sessionData.id,
    user_id: userId,
    template_id: question.templateId ?? null,
    skill_tags: question.skillTags?.length ? question.skillTags : [question.type],
    started_at: sessionStart.toISOString(),
    completed_at: now.toISOString(),
    total_questions: 1,
    correct_answers: question.isCorrect ? 1 : 0,
    incorrect_answers: question.isCorrect ? 0 : 1,
    skipped_answers: 0,
    score: question.isCorrect ? 100 : 0,
    mastery: question.isCorrect ? 100 : 0,
    metadata: {
      difficulty: question.difficulty ?? null,
      question_id: question.id,
      source: question.source ?? question.type,
      recorded_at: now.toISOString(),
      ...question.metadata,
    },
  };

  const { data: attemptData, error: attemptError } = await supabase
    .from("exercise_attempts")
    .insert([attemptPayload])
    .select("id")
    .single();

  if (attemptError || !attemptData) {
    console.error("Error creating exercise attempt:", attemptError?.message);
    return;
  }

  const answerPayload = {
    attempt_id: attemptData.id,
    user_id: userId,
    question_identifier: `${question.type}:${question.id}`,
    prompt: question.prompt ?? null,
    expected_answer: question.expectedAnswer ?? null,
    user_answer: question.userAnswer ?? null,
    is_correct: question.isCorrect,
    latency_ms: Math.round(question.timeTaken * 1000),
    skill_tag: question.skillTags?.[0] ?? question.type,
  };

  const { data: answerData, error: answerError } = await supabase
    .from("answer_events")
    .insert([answerPayload])
    .select("id")
    .single();

  if (answerError) {
    console.error("Error saving answer event:", answerError.message);
    return;
  }

  if (!question.isCorrect) {
    if (question.mistakeTaxonomyId && answerData?.id) {
      const { error: mistakeError } = await supabase.from("mistakes").insert([
        {
          answer_event_id: answerData.id,
          taxonomy_id: question.mistakeTaxonomyId,
          user_id: userId,
          severity: question.mistakeSeverity ?? "medium",
          note: question.mistakeNote ?? null,
        },
      ]);

      if (mistakeError) {
        console.error("Error recording mistake:", mistakeError.message);
      }
    } else {
      // TODO: Map domain-specific błędy do identyfikatorów taxonomy w bazie
    }
  }
}
