"use client";

import { useState, useEffect, useRef, useMemo, type KeyboardEvent } from "react";

import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { VERB_SETS, type Verb } from "@/components/words/irreagular_verbs";
import {
  LANGUAGE_OPTIONS,
  SUPPORTED_LANGUAGES,
  type LearningLanguage,
} from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";
import { addPoints } from "../utils/addPoints";
import { saveAttempt } from "../utils/saveAttempt";
import { Mic, Trophy, Clock, Target, CheckCircle2, XCircle, Flame, Star, Crown, Sparkles, Zap, Brain } from "lucide-react";

interface Achievement {
  name: string;
  description: string;
  icon: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

const VERB_FIELD_LABELS: Record<
  LearningLanguage,
  { base: string; past: string; participle: string }
> = {
  en: {
    base: "Forma podstawowa (Infinitive)",
    past: "Czas przeszły (Past Simple)",
    participle: "Imiesłów bierny (Past Participle)",
  },
  de: {
    base: "Infinitiv",
    past: "Präteritum",
    participle: "Partizip II",
  },
  es: {
    base: "Infinitivo",
    past: "Pretérito indefinido",
    participle: "Participio",
  },
};

const VERB_PLACEHOLDERS: Record<
  LearningLanguage,
  { base: string; past: string; participle: string }
> = {
  en: {
    base: "Wpisz formę podstawową...",
    past: "Wpisz formę past simple...",
    participle: "Wpisz past participle...",
  },
  de: {
    base: "Wpisz formę infinitiv...",
    past: "Wpisz formę Präteritum...",
    participle: "Wpisz Partizip II...",
  },
  es: {
    base: "Wpisz formę infinitivo...",
    past: "Wpisz pretérito indefinido...",
    participle: "Wpisz participio...",
  },
};

export default function IrregularVerbsTrainer() {
  const getRandomVerb = (list: Verb[]) =>
    list[Math.floor(Math.random() * list.length)] ?? list[0];

  const { language: selectedLanguage } = useLanguage();
  const activeLanguage = useMemo<LearningLanguage>(() => {
    const matchesSupportedLanguage = SUPPORTED_LANGUAGES.some(
      (supportedLanguage) => supportedLanguage === selectedLanguage
    );

    return matchesSupportedLanguage ? selectedLanguage : "en";
  }, [selectedLanguage]);
  const verbList = useMemo(
    () => VERB_SETS[activeLanguage] ?? VERB_SETS.en,
    [activeLanguage]
  );
  const [remainingVerbs, setRemainingVerbs] = useState<Verb[]>(() => [
    ...verbList,
  ]);
  const [currentVerb, setCurrentVerb] = useState<Verb>(() => {
    const fallbackVerb = verbList[0] ?? VERB_SETS.en[0];

    return (
      fallbackVerb ?? {
        index: -1,
        base: "",
        past: "",
        participle: "",
        translation: "",
      }
    );
  });
  const [inputBase, setInputBase] = useState("");
  const [inputPast, setInputPast] = useState("");
  const [inputParticiple, setInputParticiple] = useState("");
  const baseInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dopaminowe elementy
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [feedbackState, setFeedbackState] = useState("");
  const lastAnswerTimestampRef = useRef<number>(Date.now());

  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === activeLanguage),
    [activeLanguage]
  );
  const recognitionLocale = currentLanguageOption?.recognitionLocale ?? "en-US";
  const targetLabel = currentLanguageOption?.label ?? "Angielski";
  const fieldLabels = VERB_FIELD_LABELS[activeLanguage];
  const placeholders = VERB_PLACEHOLDERS[activeLanguage];

  // Particle system for celebrations
  const createParticles = (type = 'success') => {
    const newParticles: Particle[] = [];
    const colors =
      type === 'success'
        ? ['var(--chart-success-1)', 'var(--chart-success-2)', 'var(--chart-success-3)']
        : ['var(--chart-warning-1)', 'var(--chart-warning-2)', 'var(--chart-warning-3)'];
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * 200 + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: { x: (Math.random() - 0.5) * 10, y: Math.random() * -15 - 5 }
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const loadUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (authError) {
          console.error("Authentication error:", authError);
        }
        setIsAuthenticated(false);
        setUserId(null);
        setFirstName(null);
        return;
      }

      setIsAuthenticated(true);
      setUserId(user.id);
    } catch (error) {
      console.error("Unexpected authentication error:", error);
      setIsAuthenticated(false);
      setUserId(null);
      setFirstName(null);
    }
  };

  const startRecognition = (setter: (val: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = recognitionLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setter(transcript);
    };
  };

  const loadProgress = async (id: string) => {
    if (activeLanguage !== "en" || !isAuthenticated) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", id)
        .single();

      if (!profileError && profileData) {
        setFirstName(profileData.first_name);
      }

    const { data, error } = await supabase
      .from("exercise_attempts")
      .select("id, metadata, correct_answers, total_questions, completed_at")
      .eq("user_id", id)
      .eq("metadata->>progress_type", "irregular_verbs_state")
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Błąd ładowania postępu czasowników:", error.message);
    }

    if (data) {
      setProgressId(data.id);
      const metadata = (data.metadata as Record<string, any>) ?? {};
      const storedRemaining = Array.isArray(metadata.remaining_verbs)
        ? metadata.remaining_verbs
        : [];
      const remainingVerbObjects = VERB_SETS.en.filter((verb) =>
        storedRemaining.includes(verb.index)
      );

      const verbsToUse =
        remainingVerbObjects.length > 0
          ? remainingVerbObjects
          : [...VERB_SETS.en];
      setRemainingVerbs(verbsToUse);
      setCurrentVerb(getRandomVerb(verbsToUse));
      setCorrectAnswers(data.correct_answers || 0);
      setTotalAnswers(data.total_questions || 0);
      setTimeSpent(Number(metadata.time_spent) || 0);
    } else {
      setProgressId(null);
      setRemainingVerbs([...VERB_SETS.en]);
      setCurrentVerb(getRandomVerb(VERB_SETS.en));
      setCorrectAnswers(0);
      setTotalAnswers(0);
      setTimeSpent(0);
    }
    } catch (loadError) {
      console.error(
        "Nieoczekiwany błąd podczas ładowania postępu czasowników:",
        loadError
      );
    }
  };

  const saveProgress = async (id: string) => {
    if (activeLanguage !== "en" || !isAuthenticated) return;

    const metadata = {
      progress_type: "irregular_verbs_state",
      remaining_verbs: remainingVerbs.map((verb) => verb.index),
      time_spent: timeSpent + sessionTime,
      last_updated: new Date().toISOString(),
    };

    if (progressId) {
      const { error: updateError } = await supabase
        .from("exercise_attempts")
        .update({
          metadata,
          correct_answers: correctAnswers,
          incorrect_answers: Math.max(totalAnswers - correctAnswers, 0),
          total_questions: totalAnswers,
          completed_at: new Date().toISOString(),
        })
        .eq("id", progressId);

      if (updateError) {
        console.error("Błąd aktualizacji postępu czasowników:", updateError.message);
      }
    } else {
      const now = new Date();
      const sessionStart = new Date(now.getTime() - Math.max(1, sessionTime) * 1000);

      const { data: sessionData, error: sessionError } = await supabase
        .from("exercise_sessions")
        .insert([
          {
            user_id: id,
            started_at: sessionStart.toISOString(),
            ended_at: now.toISOString(),
            source: "irregular_verbs",
          },
        ])
        .select("id")
        .single();

      if (sessionError || !sessionData) {
        console.error("Błąd zapisu sesji czasowników:", sessionError?.message);
        return;
      }

      const { data: attemptData, error: insertError } = await supabase
        .from("exercise_attempts")
        .insert([
          {
            session_id: sessionData.id,
            user_id: id,
            skill_tags: ["irregular_verbs", "progress_state"],
            started_at: sessionStart.toISOString(),
            completed_at: now.toISOString(),
            total_questions: totalAnswers,
            correct_answers: correctAnswers,
            incorrect_answers: Math.max(totalAnswers - correctAnswers, 0),
            metadata,
          },
        ])
        .select("id")
        .single();

      if (insertError) {
        console.error("Błąd zapisu postępu czasowników:", insertError.message);
        return;
      }

      if (attemptData) {
        setProgressId(attemptData.id);
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (activeLanguage === "en" && isAuthenticated && userId) {
      loadProgress(userId);
    }
  }, [activeLanguage, isAuthenticated, userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeLanguage !== "en" || !isAuthenticated || !userId) return;
    const timerId = window.setTimeout(() => {
      saveProgress(userId);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    activeLanguage,
    isAuthenticated,
    userId,
    remainingVerbs,
    correctAnswers,
    totalAnswers,
    timeSpent,
    sessionTime,
  ]);

  useEffect(() => {
    if (activeLanguage !== "en" || !isAuthenticated || !userId) return;
    const interval = setInterval(() => {
      saveProgress(userId);
    }, 5000);

    return () => clearInterval(interval);
  }, [
    activeLanguage,
    isAuthenticated,
    userId,
    remainingVerbs,
    correctAnswers,
    totalAnswers,
    timeSpent,
    sessionTime,
  ]);

  // Hide achievement after 3 seconds
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  useEffect(() => {
    const freshVerbs = [...verbList];
    const randomVerb = getRandomVerb(freshVerbs);
    setRemainingVerbs(freshVerbs);
    setCurrentVerb(randomVerb);
    setInputBase("");
    setInputPast("");
    setInputParticiple("");
    setResult("");
    setShowAnswer(false);
    setAnsweredCorrectly(false);
    setTotalAnswers(0);
    setCorrectAnswers(0);
    setSessionTime(0);
    setTimeSpent(0);
    setStreak(0);
    setFeedbackState("");
  }, [activeLanguage, verbList]);

  const resetTrainer = async () => {
    const freshVerbs = [...verbList];
    const randomVerb = getRandomVerb(freshVerbs);
    setRemainingVerbs(freshVerbs);
    setCurrentVerb(randomVerb);
    setInputBase("");
    setInputPast("");
    setInputParticiple("");
    setResult("");
    setShowAnswer(false);
    setAnsweredCorrectly(false);
    setTotalAnswers(0);
    setCorrectAnswers(0);
    setSessionTime(0);
    setTimeSpent(0);
    setStreak(0);
    setFeedbackState("");

    if (activeLanguage === "en" && isAuthenticated && userId) {
      await saveProgress(userId);
    }
  };

  const checkAnswers = async () => {
    const isBaseCorrect =
      inputBase.trim().toLowerCase() === currentVerb.base.toLowerCase();
    const isPastCorrect =
      inputPast.trim().toLowerCase() === currentVerb.past.toLowerCase();
    const isParticipleCorrect =
      inputParticiple.trim().toLowerCase() ===
      currentVerb.participle.toLowerCase();

    const isCorrect = isBaseCorrect && isPastCorrect && isParticipleCorrect;
    
    // Zapisz czas odpowiedzi
    const now = Date.now();
    const timeTaken = Math.max(0.5, (now - lastAnswerTimestampRef.current) / 1000);
    lastAnswerTimestampRef.current = now;

    setTotalAnswers((prev) => prev + 1);

    if (isAuthenticated && userId && isCorrect) {
      try {
        await addPoints(userId, 4);
      } catch (error) {
        console.error("Error while adding points:", error);
      }
    }

    if (isAuthenticated && userId) {
      const expectedAnswer = `${currentVerb.base} | ${currentVerb.past} | ${currentVerb.participle}`;
      const userCombinedAnswer = `${inputBase.trim()} | ${inputPast.trim()} | ${inputParticiple.trim()}`;

      await saveAttempt(userId, {
        type: "irregular_verbs",
        id: currentVerb.index,
        isCorrect,
        timeTaken,
        difficulty: "core",
        skillTags: ["irregular_verbs", activeLanguage],
        prompt: `Podaj formy dla czasownika "${currentVerb.translation}"`,
        expectedAnswer,
        userAnswer: userCombinedAnswer,
        metadata: {
          language: activeLanguage,
          verb: currentVerb,
          attempts: totalAnswers + 1,
        },
        source: "irregular_verbs_trainer",
        mistakeNote: isCorrect
          ? undefined
          : `Poprawne formy: ${expectedAnswer}. Użytkownik podał: ${userCombinedAnswer}`,
      });
    }

    if (isCorrect) {
      setResult("✅ Wszystko poprawnie!");
      setCorrectAnswers((prev) => prev + 1);
      setAnsweredCorrectly(true);
      setFeedbackState("correct");
      setStreak(prev => prev + 1);
      createParticles('success');

      // Check for streak achievements
      if (streak + 1 === 5) {
        setShowAchievement({
          name: 'Na fali!',
          description: '5 poprawnych odpowiedzi z rzędu!',
          icon: '🔥'
        });
      } else if (streak + 1 === 10) {
        setShowAchievement({
          name: 'Niepokonany!',
          description: '10 poprawnych odpowiedzi z rzędu!',
          icon: '⚡'
        });
      }

      setRemainingVerbs((prev) =>
        prev.filter((v) => v.base !== currentVerb.base)
      );
    } else {
      setResult("❌ Błąd. Spróbuj ponownie lub pokaż odpowiedź.");
      setFeedbackState("incorrect");
      setStreak(0);
    }
  };

  const revealAnswer = () => {
    if (!showAnswer && !answeredCorrectly) {
      setTotalAnswers((prev) => prev + 1);
    }
    setShowAnswer(true);
  };

  const nextVerb = () => {
    if (remainingVerbs.length === 0) {
      setResult("🎉 Wszystkie czasowniki zostały rozwiązane!");
      createParticles('celebration');
      setShowAchievement({
        name: 'Mistrz czasowników!',
        description: 'Ukończyłeś wszystkie czasowniki!',
        icon: '👑'
      });
      return;
    }

    const randomVerb = getRandomVerb(remainingVerbs);
    setCurrentVerb(randomVerb);
    setInputBase("");
    setInputPast("");
    setInputParticiple("");
    setResult("");
    setShowAnswer(false);
    setAnsweredCorrectly(false);
    setFeedbackState("");

    setTimeout(() => {
      baseInputRef.current?.focus();
    }, 0);
  };

  // 🔑 Obsługa klawiatury
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (showAnswer || answeredCorrectly) {
        nextVerb();
      } else {
        checkAnswers();
      }
      return;
    }

    if (
      event.key === " " &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      revealAnswer();
    }
  };

  const getAccuracy = () => {
    if (totalAnswers === 0) return 0;
    return Math.round((correctAnswers / totalAnswers) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalTimeSpent = timeSpent + sessionTime;
  const totalVerbs = verbList.length;
  const masteredCount = totalVerbs - remainingVerbs.length;
  const progressPercentage =
    totalVerbs > 0 ? (masteredCount / totalVerbs) * 100 : 0;

  const feedbackClasses: Record<string, string> = {
    correct: "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20",
    default: "border-[color:var(--border-translucent-strong)]"
  };

  return (
    <>
      <Navbar />
      <div className="axon-design min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] relative overflow-hidden">
        
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute animate-ping"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                borderRadius: '50%'
              }}
            />
          ))}
        </div>



        <div className="max-w-4xl mx-auto px-4 py-6 relative">


          {/* Main Card */}
          <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-8 mb-6">
            
            {/* Translation Display */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-[var(--overlay-light-strong)] to-[var(--overlay-light-faint)] backdrop-blur-sm rounded-2xl p-8 border border-[color:var(--border-translucent-strong)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1d4ed8]/15 via-[#1e3a8a]/15 to-transparent animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">


                  </div>
                  <h3 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                    {currentVerb.translation}
                  </h3>
                  
                  {/* Streak indicator */}
                  {streak > 0 && (
                    <div className="mt-3 inline-flex items-center bg-[var(--overlay-light)] backdrop-blur-sm px-4 py-2 rounded-full border border-[color:var(--border-translucent)]">
                      <Flame className="w-4 h-4 text-[var(--icon-orange)] mr-2" />
                      <span className="text-[var(--foreground)] font-bold">{streak} z rzędu!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6 mb-6">
              {/* Base Form */}
              <div className="space-y-2">
                <label className="text-[var(--muted-foreground)] font-medium">{fieldLabels.base}</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={baseInputRef}
                    value={inputBase}
                    onChange={(e) => setInputBase(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholders.base}
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[var(--focus-ring-strong)] focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] placeholder-[#94a3b8]`}
                  />
                  <button
                    onClick={() => startRecognition(setInputBase)}
                    tabIndex={-1}
                    className="px-4 py-4 rounded-xl bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] border border-[color:var(--border-translucent-strong)] transition-all duration-300 transform hover:scale-110"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Past Simple */}
              <div className="space-y-2">
                <label className="text-[var(--muted-foreground)] font-medium">{fieldLabels.past}</label>
                <div className="flex items-center gap-3">
                  <input
                    value={inputPast}
                    onChange={(e) => setInputPast(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholders.past}
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[var(--focus-ring-strong)] focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] placeholder-[#94a3b8]`}
                  />
                  <button
                    onClick={() => startRecognition(setInputPast)}
                    tabIndex={-1}
                    className="px-4 py-4 rounded-xl bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] border border-[color:var(--border-translucent-strong)] transition-all duration-300 transform hover:scale-110"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Past Participle */}
              <div className="space-y-2">
                <label className="text-[var(--muted-foreground)] font-medium">{fieldLabels.participle}</label>
                <div className="flex items-center gap-3">
                  <input
                    value={inputParticiple}
                    onChange={(e) => setInputParticiple(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholders.participle}
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[var(--focus-ring-strong)] focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] placeholder-[#94a3b8]`}
                  />
                  <button
                    onClick={() => startRecognition(setInputParticiple)}
                    tabIndex={-1}
                    className="px-4 py-4 rounded-xl bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] border border-[color:var(--border-translucent-strong)] transition-all duration-300 transform hover:scale-110"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => {
                  if (showAnswer || answeredCorrectly) nextVerb();
                  else checkAnswers();
                }}
                className="px-8 py-3 bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] hover:from-[var(--cta-gradient-hover-from)] hover:to-[var(--cta-gradient-hover-to)] text-[var(--foreground)] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                {(showAnswer || answeredCorrectly) ? 'Następny' : 'Sprawdź'}
              </button>

              <button
                onClick={() => {
                  if (!answeredCorrectly && !showAnswer) {
                    setTotalAnswers((prev) => prev + 1);
                  }
                  nextVerb();
                }}
                className="px-6 py-3 bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] rounded-xl transition-all duration-300 border border-[color:var(--border-translucent-strong)] transform hover:scale-105"
              >
                Następny
              </button>

              <button
                onClick={revealAnswer}
                className="px-6 py-3 bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] rounded-xl transition-all duration-300 border border-[color:var(--border-translucent-strong)] transform hover:scale-105"
              >
                Pokaż odpowiedź
              </button>

              <button
                onClick={resetTrainer}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-[var(--foreground)] rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Resetuj
              </button>
            </div>

            {/* Feedback */}
            {result && (
              <div className={`mb-6 p-4 backdrop-blur-sm border rounded-xl ${
                feedbackState === 'correct' 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {feedbackState === 'correct' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <span className={`font-medium ${
                      feedbackState === 'correct' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {result}
                    </span>
                  </div>
                  {feedbackState === 'correct' && (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-bold">+4 pkt</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Answer Display */}
            {showAnswer && (
              <div className="p-6 bg-[var(--overlay-light-faint)] backdrop-blur-sm rounded-xl border border-[color:var(--border-translucent)]">
                <h4 className="text-[var(--foreground)] font-bold mb-3 flex items-center">
                  <Star className="w-5 h-5 text-[var(--icon-yellow)] mr-2" />
                  Poprawne odpowiedzi:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[var(--muted-foreground)]">
                  <div>
                    <span className="text-[var(--muted-foreground)]">{fieldLabels.base}:</span>
                    <div className="font-bold text-[var(--foreground)] text-lg">{currentVerb.base}</div>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">{fieldLabels.past}:</span>
                    <div className="font-bold text-[var(--foreground)] text-lg">{currentVerb.past}</div>
                  </div>
                  <div>
                    <span className="text-[var(--muted-foreground)]">{fieldLabels.participle}:</span>
                    <div className="font-bold text-[var(--foreground)] text-lg">{currentVerb.participle}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 items-center justify-center mt-8">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 backdrop-blur-sm rounded-xl mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-emerald-300" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{correctAnswers}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Poprawne</div>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sky-400/20 to-sky-600/20 backdrop-blur-sm rounded-xl mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-sky-300" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{getAccuracy()}%</div>
                <div className="text-xs text-[var(--muted-foreground)]">Dokładność</div>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-sm rounded-xl mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-amber-300" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{Math.floor(totalTimeSpent / 60)}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Minut</div>
              </div>

              {streak > 0 && (
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[var(--cta-gradient-from)]/20 to-[var(--cta-gradient-to)]/20 backdrop-blur-sm rounded-xl mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                    <Flame className="w-7 h-7 text-[var(--icon-orange)]" />
                  </div>
                  <div className="text-2xl font-bold text-[var(--foreground)]">{streak}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Streak</div>
                </div>
              )}
            </div>

            {/* Completion Message */}
            {remainingVerbs.length === 0 && (
              <div className="mt-8 text-center p-8 bg-gradient-to-br from-[var(--cta-gradient-from)]/20 via-[var(--cta-gradient-to)]/20 to-emerald-500/10 backdrop-blur-sm rounded-2xl border border-[color:var(--border-translucent)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--cta-gradient-from)]/15 via-[var(--cta-gradient-to)]/15 to-emerald-400/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                    Gratulacje!
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-lg">Ukończyłeś wszystkie czasowniki nieregularne!</p>
                  <div className="mt-4 text-2xl font-bold text-[var(--icon-yellow)]">
                    Jesteś mistrzem czasowników! 👑
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}