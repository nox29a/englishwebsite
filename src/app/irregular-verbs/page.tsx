"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { verbs } from "@/components/words/irreagular_verbs";
import { saveAttempt } from "../utils/saveAttempt";
import { addPoints } from "../utils/addPoints";
import { Mic, Trophy, Clock, Target, CheckCircle2, XCircle, Flame, Star, Crown, Sparkles, Zap, Brain } from "lucide-react";

interface Verb {
  index: number;
  base: string;
  past: string;
  participle: string;
  translation: string;
}

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

export default function IrregularVerbsTrainer() {
  const getRandomVerb = (list: Verb[]) =>
    list[Math.floor(Math.random() * list.length)];

  const [remainingVerbs, setRemainingVerbs] = useState<Verb[]>([...verbs]);
  const [currentVerb, setCurrentVerb] = useState<Verb>(getRandomVerb(verbs));
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
  
  // Dopaminowe elementy
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [feedbackState, setFeedbackState] = useState("");

  // Particle system for celebrations
  const createParticles = (type = 'success') => {
    const newParticles: Particle[] = [];
    const colors = type === 'success' ? ['#10B981', '#34D399', '#6EE7B7'] : ['#F59E0B', '#FBBF24', '#FCD34D'];
    
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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return;
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
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setter(transcript);
    };
  };

  const loadProgress = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();

    if (!profileError && profileData) {
      setFirstName(profileData.first_name);
    }

    const { data, error } = await supabase
      .from("irregular_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProgressId(data.id);
      const remainingVerbObjects = verbs.filter((verb) =>
        data.remaining_verbs.includes(verb.index)
      );

      const verbsToUse =
        remainingVerbObjects.length > 0 ? remainingVerbObjects : [...verbs];
      setRemainingVerbs(verbsToUse);
      setCurrentVerb(getRandomVerb(verbsToUse));
      setCorrectAnswers(data.correct_answers || 0);
      setTotalAnswers(data.total_answers || 0);
      setTimeSpent(data.time_spent || 0);
    } else {
      setCurrentVerb(getRandomVerb(verbs));
    }
  };

  const saveProgress = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingData } = await supabase
      .from("irregular_progress")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const progressData = {
      user_id: user.id,
      remaining_verbs: remainingVerbs.map((verb) => verb.index),
      correct_answers: correctAnswers,
      total_answers: totalAnswers,
      time_spent: timeSpent + sessionTime,
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      await supabase
        .from("irregular_progress")
        .update(progressData)
        .eq("id", existingData.id);
      setProgressId(existingData.id);
    } else {
      const { data, error } = await supabase
        .from("irregular_progress")
        .insert(progressData)
        .select()
        .single();

      if (data) {
        setProgressId(data.id);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadUserData();
      await loadProgress();
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      saveProgress();
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [remainingVerbs, correctAnswers, totalAnswers, timeSpent, sessionTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, [remainingVerbs, correctAnswers, totalAnswers, timeSpent, sessionTime]);

  // Hide achievement after 3 seconds
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  const resetTrainer = async () => {
    const freshVerbs = [...verbs];
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

    await saveProgress();
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
    const timeTaken = sessionTime; // lub inny sposób mierzenia czasu odpowiedzi

    setTotalAnswers((prev) => prev + 1);

    // Pobierz użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Zapisz próbę
      await saveAttempt(user.id, {
        type: "irregular_verb",
        id: currentVerb.index,
        isCorrect,
        timeTaken,
      });

      // Jeśli odpowiedź poprawna, dodaj punkty
      if (isCorrect) {
        await addPoints(user.id, 4);
      }
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showAnswer || answeredCorrectly) {
        nextVerb();
      } else {
        checkAnswers();
      }
    } else if (e.key === " ") {
      e.preventDefault();
      setShowAnswer(true);
    }
    // ⚠️ nie przechwytujemy Taba — zostaje domyślne przechodzenie
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
  const progressPercentage = verbs.length > 0 ? ((verbs.length - remainingVerbs.length) / verbs.length) * 100 : 0;

  const feedbackClasses: Record<string, string> = {
    correct: "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20",
    default: "border-white/20"
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        
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
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300">
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

        <div className="max-w-4xl mx-auto px-4 py-6 relative">
          
          {/* Top Stats Bar */}
          <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                {firstName && (
                  <div className="flex items-center space-x-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-white font-bold">Cześć, {firstName}!</div>
                      <div className="text-gray-300 text-sm">Mistrz czasowników</div>
                    </div>
                  </div>
                )}

                {/* Streak */}
                {streak > 0 && (
                  <div className="flex items-center space-x-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <div>
                      <div className="text-white font-bold">{streak} streak</div>
                      <div className="text-gray-300 text-sm">Z rzędu!</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-white text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">{correctAnswers}</div>
                  <div className="text-gray-400">Poprawne</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{remainingVerbs.length}</div>
                  <div className="text-gray-400">Pozostało</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{formatTime(totalTimeSpent)}</div>
                  <div className="text-gray-400">Czas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-4 mb-2 overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Postęp: {verbs.length - remainingVerbs.length}/{verbs.length}</span>
              <span>Dokładność: {getAccuracy()}%</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
            
            {/* Translation Display */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Tłumaczenie</h2>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {currentVerb.translation}
                  </h3>
                  
                  {/* Streak indicator */}
                  {streak > 0 && (
                    <div className="mt-3 inline-flex items-center bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30">
                      <Flame className="w-4 h-4 text-orange-400 mr-2" />
                      <span className="text-orange-300 font-bold">{streak} z rzędu!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-6 mb-6">
              {/* Base Form */}
              <div className="space-y-2">
                <label className="text-gray-300 font-medium">Forma podstawowa (Base)</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={baseInputRef}
                    value={inputBase}
                    onChange={(e) => setInputBase(e.target.value)}
                    placeholder="Wpisz formę podstawową..."
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-white/10 backdrop-blur-sm text-white placeholder-gray-400`}
                  />
                  <button
                    onClick={() => startRecognition(setInputBase)}
                    className="px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Past Simple */}
              <div className="space-y-2">
                <label className="text-gray-300 font-medium">Czas przeszły (Past Simple)</label>
                <div className="flex items-center gap-3">
                  <input
                    value={inputPast}
                    onChange={(e) => setInputPast(e.target.value)}
                    placeholder="Wpisz czas przeszły..."
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-white/10 backdrop-blur-sm text-white placeholder-gray-400`}
                  />
                  <button
                    onClick={() => startRecognition(setInputPast)}
                    className="px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Past Participle */}
              <div className="space-y-2">
                <label className="text-gray-300 font-medium">Imiesłów bierny (Past Participle)</label>
                <div className="flex items-center gap-3">
                  <input
                    value={inputParticiple}
                    onChange={(e) => setInputParticiple(e.target.value)}
                    placeholder="Wpisz imiesłów bierny..."
                    className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium ${
                      feedbackClasses[feedbackState] || feedbackClasses.default
                    } bg-white/10 backdrop-blur-sm text-white placeholder-gray-400`}
                  />
                  <button
                    onClick={() => startRecognition(setInputParticiple)}
                    className="px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 transform hover:scale-110"
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
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
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
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105"
              >
                Następny
              </button>

              <button
                onClick={() => {
                  if (!showAnswer && !answeredCorrectly) {
                    setTotalAnswers((prev) => prev + 1);
                  }
                  setShowAnswer(true);
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105"
              >
                Pokaż odpowiedź
              </button>

              <button
                onClick={resetTrainer}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
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
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h4 className="text-white font-bold mb-3 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  Poprawne odpowiedzi:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                  <div>
                    <span className="text-gray-400">Base:</span>
                    <div className="font-bold text-white text-lg">{currentVerb.base}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Past:</span>
                    <div className="font-bold text-white text-lg">{currentVerb.past}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Participle:</span>
                    <div className="font-bold text-white text-lg">{currentVerb.participle}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 items-center justify-center mt-8">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-sm rounded-xl mb-2 border border-green-500/30 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{correctAnswers}</div>
                <div className="text-xs text-gray-400">Poprawne</div>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm rounded-xl mb-2 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{getAccuracy()}%</div>
                <div className="text-xs text-gray-400">Dokładność</div>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/20 backdrop-blur-sm rounded-xl mb-2 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{Math.floor(totalTimeSpent / 60)}</div>
                <div className="text-xs text-gray-400">Minut</div>
              </div>

              {streak > 0 && (
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400/20 to-orange-600/20 backdrop-blur-sm rounded-xl mb-2 border border-orange-500/30 group-hover:scale-110 transition-transform">
                    <Flame className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{streak}</div>
                  <div className="text-xs text-gray-400">Streak</div>
                </div>
              )}
            </div>

            {/* Completion Message */}
            {remainingVerbs.length === 0 && (
              <div className="mt-8 text-center p-8 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-blue-400/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Gratulacje!
                  </h2>
                  <p className="text-gray-300 text-lg">Ukończyłeś wszystkie czasowniki nieregularne!</p>
                  <div className="mt-4 text-2xl font-bold text-yellow-400">
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