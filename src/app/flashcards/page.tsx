"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Category, Word } from "@/components/words/flashcards_words";
import {
  LANGUAGE_DATASETS,
  LANGUAGE_OPTIONS,
  type LearningLanguage,
} from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, Mic, Volume2, RotateCcw, CheckCircle2, XCircle, Trophy, Brain, Clock, Target, Star, Zap, Flame, Award, TrendingUp, Battery, Crown, Sparkles, Globe } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { addPoints } from "../utils/addPoints";
import type { User } from "@supabase/supabase-js";

// Definicje typów dla Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
  emma: Document;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare class SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface Achievement {
  name: string;
  description: string;
  icon: string;
}

export default function FlashcardGame() {
  const { language, setLanguage } = useLanguage();
  const languageCategories = useMemo(
    () => LANGUAGE_DATASETS[language] ?? LANGUAGE_DATASETS.en,
    [language]
  );
  const [category, setCategory] = useState(
    () => languageCategories[0]?.name ?? ""
  );
  const [level, setLevel] = useState("easy");
  const [direction, setDirection] = useState<
    "native-to-target" | "target-to-native"
  >("native-to-target");
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState<Word[]>([]);
  const [current, setCurrent] = useState<Word>({ id: -1, pl: "", en: "", level: "" });
  const [score, setScore] = useState(0);
  const [feedbackState, setFeedbackState] = useState<"correct" | "incorrect" | "">("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  const targetLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === language),
    [language]
  );
  const targetRecognitionLocale =
    targetLanguageOption?.recognitionLocale ?? "en-US";
  const targetSpeechLocale = targetLanguageOption?.speechLocale ?? "en-US";
  const targetLabel = targetLanguageOption?.label ?? "Angielski";
  const targetShortLabel = targetLanguageOption?.shortLabel ?? "EN";

  useEffect(() => {
    if (languageCategories[0]?.name) {
      setCategory(languageCategories[0].name);
    }
  }, [languageCategories]);
  
  // Dopaminowe elementy
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [level_xp, setLevelXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [badges, setBadges] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Supabase state
  const [user, setUser] = useState<User | null>(null);

  // Achievements system
  const achievements = [
    { id: 'first_correct', name: 'Pierwszy sukces!', description: 'Odpowiedz poprawnie po raz pierwszy', icon: '🎯', unlocked: false },
    { id: 'streak_5', name: 'Na fali!', description: 'Osiągnij 5 poprawnych odpowiedzi z rzędu', icon: '🔥', unlocked: false },
    { id: 'streak_10', name: 'Niepokonany!', description: 'Osiągnij 10 poprawnych odpowiedzi z rzędu', icon: '⚡', unlocked: false },
    { id: 'speed_demon', name: 'Demon prędkości', description: 'Odpowiedz w mniej niż 3 sekundy', icon: '💨', unlocked: false },
    { id: 'perfectionist', name: 'Perfekcjonista', description: 'Ukończ kategorię bez błędu', icon: '👑', unlocked: false },
  ];

  // Get user session
  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && isMounted) {
        setUser(session.user);
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Particle system for celebrations
  const createParticles = (type: 'success' | 'celebration' = 'success') => {
    const newParticles: Particle[] = [];
    const colors =
      type === 'success'
        ? ['var(--chart-success-1)', 'var(--chart-success-2)', 'var(--chart-success-3)']
        : ['var(--chart-warning-1)', 'var(--chart-warning-2)', 'var(--chart-warning-3)'];
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
        y: Math.random() * 200 + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: { x: (Math.random() - 0.5) * 10, y: Math.random() * -15 - 5 }
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  // XP and level calculations
  const getRequiredXP = (level: number) => level * 100;
  const addXP = (amount: number) => {
    const newXP = level_xp + amount;
    const requiredXP = getRequiredXP(userLevel);
    
    if (newXP >= requiredXP) {
      setUserLevel(prev => prev + 1);
      setLevelXp(newXP - requiredXP);
      setShowAchievement({
        name: `Level ${userLevel + 1}!`,
        description: 'Awansowałeś na wyższy poziom!',
        icon: '🆙'
      });
    } else {
      setLevelXp(newXP);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.lang =
          direction === "native-to-target" ? targetRecognitionLocale : "pl-PL";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };
      }
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [direction, targetRecognitionLocale]);

  const speak = (text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true);
        recognitionRef.current.lang =
          direction === "native-to-target"
            ? targetRecognitionLocale
            : "pl-PL";
        recognitionRef.current.start();
      } catch (err) {
        console.error("Cannot start recognition:", err);
        setIsListening(false);
      }
    }
  };

  const playPrompt = () => {
    const prompt =
      direction === "native-to-target" ? current.pl : current.en;
    const lang =
      direction === "native-to-target" ? "pl-PL" : targetSpeechLocale;
    speak(prompt, lang);
  };

  const getWords = (): Word[] => {
    const selectedCategory = languageCategories.find(
      (c) => c.name === category
    );
    if (!selectedCategory) return [];
    return selectedCategory.words.filter((word) => word.level === level);
  };

  const getAvailableLevels = (): string[] => {
    const selectedCategory = languageCategories.find(
      (c) => c.name === category
    );
    if (!selectedCategory) return [];
    const levels = new Set(selectedCategory.words.map((word) => word.level));
    return Array.from(levels);
  };

  const getRandomWord = (words: Word[]): Word => {
    if (words.length === 0) return { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const loadProgress = () => {
    setLoading(true);
    
    const levels = getAvailableLevels();
    setAvailableLevels(levels);
    
    let currentLevel = level;
    if (levels.length > 0 && !levels.includes(level)) {
      currentLevel = levels[0];
      setLevel(currentLevel);
    }

    const words = getWords().filter(word => word.level === currentLevel);
    const randomWord = words.length > 0 ? getRandomWord(words) : { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    
    setRemaining(words);
    setCurrent(randomWord);
    setScore(0);
    setTotalTimeSpent(0);
    setSessionStartTime(Date.now());
    setLoading(false);
  };

  useEffect(() => {
    if (current.id !== -1) {
      setInput("");
      setFeedbackState("");
      setCorrectAnswer("");
    } else {
      loadProgress();
    }
  }, [direction, language]);

  useEffect(() => {
    loadProgress();
  }, [category, level, language]);

  const handleSubmit = () => {
    if (current.id === -1) return;

    const wordToCheck = remaining.find((w) => w.id === current.id) || current;
    const correct =
      direction === "native-to-target"
        ? wordToCheck.en.toLowerCase().trim()
        : wordToCheck.pl.toLowerCase().trim();
    const userAnswer = input.trim().toLowerCase();
    const isCorrect = userAnswer === correct;

    let updatedList = remaining;

    if (isCorrect) {
      setFeedbackState("correct");
      updatedList = remaining.filter((word) => word.id !== wordToCheck.id);
      setScore((prev) => prev + 1);
      setTotalScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setCombo(prev => prev + 1);
      
      // XP system
      let xpGained = 10;
      if (streak >= 4) xpGained += 5; // Bonus za streak
      if (combo >= 5) xpGained += 10; // Combo bonus
      
      addXP(xpGained);

      // Add points to the database if user is logged in
      if (user) {
        addPoints(user.id, xpGained);
      }
      
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
      
      // Show streak bonus
      if ((streak + 1) % 5 === 0) {
        setShowStreakBonus(true);
        setTimeout(() => setShowStreakBonus(false), 2000);
      }
      
    } else {
      setFeedbackState("incorrect");
      setCorrectAnswer(correct);
      setStreak(0);
      setCombo(0);
      setEnergy(prev => Math.max(0, prev - 10));
    }

    // Update max streak
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }

    if (updatedList.length === 0) {
      // Perfect completion bonus
      if (streak === getWords().length) {
        setShowAchievement({
          name: 'Perfekcjonista!',
          description: 'Ukończyłeś kategorię bez błędu!',
          icon: '👑'
        });
        addXP(50);
      }
      
      setTimeout(() => {
        setCurrent({ id: -1, pl: "Koniec!", en: "The End!", level: "" });
        setFeedbackState("");
        setCorrectAnswer("");
        setInput("");
        setRemaining([]);
        setTotalTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
        createParticles('celebration');
      }, 1000);
      return;
    }

    const delay = isCorrect ? 1000 : 3000;

    setTimeout(() => {
      const next = getRandomWord(updatedList);
      setCurrent(next);
      setFeedbackState("");
      setCorrectAnswer("");
      setInput("");
      setRemaining(updatedList);
    }, delay);
  };

  const resetGame = () => {
    const newWords = getWords();
    const randomWord = newWords.length > 0 ? getRandomWord(newWords) : { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    setRemaining(newWords);
    setCurrent(randomWord);
    setInput("");
    setScore(0);
    setStreak(0);
    setCombo(0);
    setFeedbackState("");
    setCorrectAnswer("");
    setTotalTimeSpent(0);
    setSessionStartTime(Date.now());
    setEnergy(100);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Hide achievement after 3 seconds
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  if (loading) {
    return (
      <div className="axon-design min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] text-[var(--foreground)] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium">Ładowanie postępów...</p>
      </div>
    );
  }

  const progressPercentage = getWords().length > 0 ? (score / getWords().length) * 100 : 0;
  const xpPercentage = (level_xp / getRequiredXP(userLevel)) * 100;
  const energyColor = energy > 60 ? 'from-green-400 to-green-600' : energy > 30 ? 'from-yellow-400 to-yellow-600' : 'from-red-400 to-red-600';

  const feedbackClasses: Record<string, string> = {
    correct: "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20",
    default: "border-[color:var(--border-translucent-strong)]",
    "": "border-[color:var(--border-translucent-strong)]"
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

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-[var(--foreground)] px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{showAchievement.icon}</div>
              <div>
                <div className="font-bold text-lg">{showAchievement.name}</div>
                <div className="text-sm opacity-90">{showAchievement.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Bonus Popup */}
      
      {showStreakBonus && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 animate-pulse">
          <div className="bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] text-[var(--foreground)] px-4 py-2 rounded-lg font-bold">
            🔥 STREAK BONUS! +15 XP
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-24 lg:pb-12 relative">
        


        {/* Progress Bar */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="space-y-6 lg:pr-4">


            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-6 sm:p-10">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-br from-[var(--overlay-light-strong)] to-[var(--overlay-light-faint)] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[color:var(--border-translucent-strong)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1d4ed8]/15 via-[#1e3a8a]/15 to-transparent animate-pulse"></div>

                  <div className="relative z-10 space-y-3">
                    <h2 className="text-3xl sm:text-5xl font-bold text-[var(--foreground)] animate-pulse">
                      {direction === "native-to-target" ? current.pl : current.en}
                    </h2>
                    <p className="text-base sm:text-lg text-[var(--muted-foreground)]">
                      {direction === "native-to-target"
                        ? `Przetłumacz na ${targetLabel.toLowerCase()}`
                        : "Przetłumacz na polski"}
                    </p>

                    {streak > 0 && (
                      <div className="inline-flex items-center bg-[var(--overlay-light)] backdrop-blur-sm px-4 py-2 rounded-full border border-[color:var(--border-translucent)]">
                        <Flame className="w-4 h-4 text-[var(--icon-orange)] mr-2" />
                        <span className="text-[var(--foreground)] font-bold">{streak} z rzędu!</span>
                      </div>
                    )}

                    <button
                      onClick={playPrompt}
                      disabled={current.id === -1}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:from-[var(--cta-gradient-hover-from)] hover:to-[var(--cta-gradient-hover-to)] hover:shadow-xl disabled:from-white/10 disabled:to-white/5 disabled:text-[var(--muted-foreground)]"
                    >
                      <Volume2 className="w-5 h-5" />
                      Odsłuchaj
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-4 left-0 right-0 z-30 -mx-4 sm:mx-0 sm:static sm:bottom-auto">
              <div className="rounded-2xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-dark)]/90 backdrop-blur-lg px-4 py-4 shadow-xl supports-[padding:max(0px,env(safe-area-inset-bottom))]:pb-[calc(1rem+env(safe-area-inset-bottom))] sm:bg-[var(--overlay-light)] sm:px-6 sm:py-6 sm:shadow-2xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className={`w-full rounded-xl border-2 px-4 py-3 text-base font-medium transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[var(--focus-ring-strong)] sm:px-6 sm:py-4 sm:text-lg ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] placeholder-[#94a3b8] border-[color:var(--border-translucent-strong)]`}
                    placeholder="Wpisz tłumaczenie..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={current.id === -1}
                  />

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <button
                      onClick={startListening}
                      disabled={isListening || current.id === -1}
                      className={`flex h-14 w-full items-center justify-center rounded-xl border border-[color:var(--border-translucent-strong)] font-medium transition-all duration-300 sm:h-auto sm:w-auto sm:px-5 sm:py-4 ${
                        isListening
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-[var(--foreground)] shadow-lg shadow-red-500/30"
                          : "bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)]"
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={current.id === -1}
                      className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] px-6 py-3 text-base font-semibold text-[var(--foreground)] transition-all duration-300 hover:from-[var(--cta-gradient-hover-from)] hover:to-[var(--cta-gradient-hover-to)] hover:shadow-xl disabled:from-white/10 disabled:to-white/5 disabled:text-[var(--muted-foreground)] sm:h-auto sm:w-auto sm:px-8 sm:py-4"
                    >
                      {input ? (
                        <span className="flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Sprawdź
                        </span>
                      ) : (
                        "Dalej"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {correctAnswer && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/15 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center">
                  <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-300 font-medium">Niepoprawnie</span>
                </div>
                <p className="text-red-200 sm:text-red-300">
                  Poprawna odpowiedź: <span className="font-bold text-[var(--foreground)]">{correctAnswer}</span>
                </p>
              </div>
            )}

            {feedbackState === "correct" && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/15 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Poprawnie!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 font-bold">+10 XP</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)]/40 p-4 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/30">
                    <Trophy className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[var(--foreground)]">{score}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Poprawne</div>
                </div>

                <div className="rounded-xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)]/40 p-4 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/30">
                    <Target className="w-6 h-6 text-sky-300" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[var(--foreground)]">{getWords().length - score}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Pozostało</div>
                </div>

                <div className="rounded-xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)]/40 p-4 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/30">
                    <Clock className="w-6 h-6 text-amber-300" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[var(--foreground)]">
                    {Math.floor((Date.now() - sessionStartTime) / 60000)}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">Minut</div>
                </div>

                <div className="rounded-xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)]/40 p-4 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--cta-gradient-from)]/25 to-[var(--cta-gradient-to)]/25">
                    <TrendingUp className="w-6 h-6 text-[var(--icon-purple)]" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-[var(--foreground)]">{streak}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Streak</div>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)]/40 px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--overlay-light-strong)] hover:shadow-lg sm:w-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {current.id === -1 && current.pl === "Koniec!" && (
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-translucent)] bg-gradient-to-br from-[var(--cta-gradient-from)]/20 via-[var(--cta-gradient-to)]/20 to-emerald-500/10 p-6 text-center backdrop-blur-sm sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--cta-gradient-from)]/15 via-[var(--cta-gradient-to)]/15 to-emerald-400/10 animate-pulse"></div>
                <div className="relative z-10 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Gratulacje!</h2>
                  <p className="text-base sm:text-lg text-[var(--muted-foreground)]">Ukończyłeś wszystkie fiszki w tej kategorii!</p>
                  <div className="text-xl font-bold text-[var(--icon-yellow)]">+50 XP Bonus!</div>
                </div>
              </div>
           
          )}
        </div>

        {/* Settings Cards */}
        <div className="grid gap-6">

          {/* Language Selection */}


          <aside className="mt-8 space-y-6 lg:mt-0 lg:pl-2 lg:sticky lg:top-24">


            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-5">
              <h3 className="mb-4 flex items-center text-base font-semibold text-[var(--foreground)] sm:text-lg">
                <Brain className="w-5 h-5 mr-2 text-[var(--icon-blue)]" />
                Kategoria
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {languageCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                      category === cat.name
                        ? "bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] text-[var(--foreground)] shadow-lg shadow-[rgba(29,78,216,0.35)]"
                        : "bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-strong)] border border-[color:var(--border-translucent-strong)]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-5">
                <h3 className="mb-4 flex items-center text-base font-semibold text-[var(--foreground)] sm:text-lg">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Poziom
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((lvl) => {
                    const isAvailable = availableLevels.includes(lvl);
                    const isSelected = level === lvl;
                    const levelLabels: Record<string, string> = { easy: "Łatwy", medium: "Średni", hard: "Trudny" };
                    const levelColors: Record<string, string> = {
                      easy: "from-green-400 to-green-600",
                      medium: "from-amber-400 to-amber-600",
                      hard: "from-red-400 to-red-600"
                    };

                    return (
                      <button
                        key={lvl}
                        onClick={() => isAvailable && setLevel(lvl)}
                        disabled={!isAvailable}
                        className={`rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                          isSelected
                            ? `bg-gradient-to-r ${levelColors[lvl]} text-[var(--foreground)] shadow-lg`
                            : isAvailable
                            ? "bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-strong)] border border-[color:var(--border-translucent-strong)]"
                            : "bg-[var(--overlay-dark)] text-[var(--muted-foreground)] opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="text-lg">
                          {lvl === 'easy' ? '●' : lvl === 'medium' ? '●●' : '●●●'}
                        </div>
                        {levelLabels[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-5">
                <h3 className="mb-4 flex items-center text-base font-semibold text-[var(--foreground)] sm:text-lg">
                  <ChevronRight className="w-5 h-5 mr-2 text-[var(--icon-purple)]" />
                  Kierunek
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDirection("native-to-target")}
                    className={`rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                      direction === "native-to-target"
                        ? "bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] text-[var(--foreground)] shadow-lg shadow-[rgba(29,78,216,0.35)]"
                        : "bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-strong)] border border-[color:var(--border-translucent-strong)]"
                    }`}
                  >
                    <div className="text-lg">PL → {targetShortLabel}</div>
                    <div className="text-xs text-[var(--muted-foreground)] sm:text-sm">Polski → {targetLabel}</div>
                  </button>
                  <button
                    onClick={() => setDirection("target-to-native")}
                    className={`rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                      direction === "target-to-native"
                        ? "bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] text-[var(--foreground)] shadow-lg shadow-[rgba(29,78,216,0.35)]"
                        : "bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-strong)] border border-[color:var(--border-translucent-strong)]"
                    }`}
                  >
                    <div className="text-lg">{targetShortLabel} → PL</div>
                    <div className="text-xs text-[var(--muted-foreground)] sm:text-sm">{targetLabel} → Polski</div>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div></div>
    </>
  );
}
