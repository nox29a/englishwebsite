"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Categories } from "@/components/words/flashcards_words";
import { ChevronRight, Mic, Volume2, RotateCcw, CheckCircle2, XCircle, Trophy, Brain, Clock, Target, Star, Zap, Flame, Award, TrendingUp, Battery, Crown, Sparkles } from 'lucide-react';

// Definicje typów
interface Word {
  id: number;
  pl: string;
  en: string;
  level: string;
}

interface Category {
  name: string;
  words: Word[];
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
  const [category, setCategory] = useState(Categories[0].name);
  const [level, setLevel] = useState("easy");
  const [direction, setDirection] = useState<"pl-en" | "en-pl">("pl-en");
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

  // Achievements system
  const achievements = [
    { id: 'first_correct', name: 'Pierwszy sukces!', description: 'Odpowiedz poprawnie po raz pierwszy', icon: '🎯', unlocked: false },
    { id: 'streak_5', name: 'Na fali!', description: 'Osiągnij 5 poprawnych odpowiedzi z rzędu', icon: '🔥', unlocked: false },
    { id: 'streak_10', name: 'Niepokonany!', description: 'Osiągnij 10 poprawnych odpowiedzi z rzędu', icon: '⚡', unlocked: false },
    { id: 'speed_demon', name: 'Demon prędkości', description: 'Odpowiedz w mniej niż 3 sekundy', icon: '💨', unlocked: false },
    { id: 'perfectionist', name: 'Perfekcjonista', description: 'Ukończ kategorię bez błędu', icon: '👑', unlocked: false },
  ];

  // Particle system for celebrations
  const createParticles = (type: 'success' | 'celebration' = 'success') => {
    const newParticles: Particle[] = [];
    const colors = type === 'success' ? ['#10B981', '#34D399', '#6EE7B7'] : ['#F59E0B', '#FBBF24', '#FCD34D'];
    
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
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (e: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };
      }
    }
  }, [direction]);

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
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.start();
      } catch (err) {
        console.error("Cannot start recognition:", err);
        setIsListening(false);
      }
    }
  };

  const playPrompt = () => {
    const prompt = direction === "pl-en" ? current.pl : current.en;
    const lang = direction === "pl-en" ? "pl-PL" : "en-US";
    speak(prompt, lang);
  };

  const getWords = (): Word[] => {
    const selectedCategory = Categories.find(c => c.name === category);
    if (!selectedCategory) return [];
    return selectedCategory.words.filter(word => word.level === level);
  };

  const getAvailableLevels = (): string[] => {
    const selectedCategory = Categories.find(c => c.name === category);
    if (!selectedCategory) return [];
    const levels = new Set(selectedCategory.words.map(word => word.level));
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
  }, [direction]);

  useEffect(() => {
    loadProgress();
  }, [category, level]);

  const handleSubmit = () => {
    if (current.id === -1) return;

    const wordToCheck = remaining.find((w) => w.id === current.id) || current;
    const correct = direction === "pl-en" ? wordToCheck.en.toLowerCase().trim() : wordToCheck.pl.toLowerCase().trim();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium">Ładowanie postępów...</p>
      </div>
    );
  }

  const progressPercentage = getWords().length > 0 ? (score / getWords().length) * 100 : 0;
  const xpPercentage = (level_xp / getRequiredXP(userLevel)) * 100;
  const energyColor = energy > 60 ? 'from-green-400 to-green-600' : energy > 30 ? 'from-yellow-400 to-yellow-600' : 'from-red-400 to-red-600';

  const feedbackClasses = {
    correct: "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20",
    default: "border-gray-300 dark:border-gray-700"
  };

  return (
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

      {/* Streak Bonus Popup */}
      {showStreakBonus && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 animate-pulse">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold">
            🔥 STREAK BONUS! +15 XP
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 relative">
        
        {/* Top Stats Bar */}
        <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              {/* Level */}
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">Level {userLevel}</div>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="text-white font-bold">{streak} streak</div>
                  <div className="text-gray-300 text-sm">Max: {maxStreak}</div>
                </div>
              </div>

              {/* Total Score */}
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-white font-bold">{totalScore}</div>
                  <div className="text-gray-300 text-sm">Razem</div>
                </div>
              </div>
            </div>

            {/* Energy Bar */}
            <div className="flex items-center space-x-2">
              <Battery className="w-6 h-6 text-green-400" />
              <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${energyColor} transition-all duration-500`}
                  style={{ width: `${energy}%` }}
                />
              </div>
              <span className="text-white text-sm font-bold">{energy}%</span>
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
            <span>Postęp: {score}/{getWords().length}</span>
            <span className="flex items-center gap-2">
              {combo > 0 && <span className="text-purple-400 font-bold">COMBO x{combo}</span>}
              <span>{Math.floor((Date.now() - sessionStartTime) / 60000)} min</span>
            </span>
          </div>
        </div>

        {/* Main Game Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
          
          {/* Word Display */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-pulse">
                  {direction === "pl-en" ? current.pl : current.en}
                </h2>
                <p className="text-gray-300 text-lg">
                  {direction === "pl-en" ? "Przetłumacz na angielski" : "Przetłumacz na polski"}
                </p>
                
                {/* Streak indicator */}
                {streak > 0 && (
                  <div className="mt-3 inline-flex items-center bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30">
                    <Flame className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-orange-300 font-bold">{streak} z rzędu!</span>
                  </div>
                )}
                
                {/* Audio Button */}
                <button
                  onClick={playPrompt}
                  disabled={current.id === -1}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Odsłuchaj
                </button>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className={`flex-1 px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium ${
                  feedbackClasses[feedbackState] || feedbackClasses.default
                } bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20`}
                placeholder="Wpisz tłumaczenie..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={current.id === -1}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={startListening}
                  disabled={isListening || current.id === -1}
                  className={`px-4 py-4 rounded-xl font-medium transition-all duration-300 flex items-center transform hover:scale-105 ${
                    isListening 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30" 
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={current.id === -1}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {input ? (
                    <span className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Sprawdź
                    </span>
                  ) : (
                    "Dalej"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {correctAnswer && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
              <div className="flex items-center mb-2">
                <XCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300 font-medium">Niepoprawnie</span>
              </div>
              <p className="text-red-300">
                Poprawna odpowiedź: <span className="font-bold text-white">{correctAnswer}</span>
              </p>
            </div>
          )}

          {feedbackState === "correct" && (
            <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-300 font-medium">Poprawnie!</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 font-bold">+10 XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stats */}
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex gap-6">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-sm rounded-xl mb-2 border border-green-500/30 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-xs text-gray-400">Poprawne</div>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm rounded-xl mb-2 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{getWords().length - score}</div>
                <div className="text-xs text-gray-400">Pozostało</div>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/20 backdrop-blur-sm rounded-xl mb-2 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.floor((Date.now() - sessionStartTime) / 60000)}
                </div>
                <div className="text-xs text-gray-400">Minut</div>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400/20 to-purple-600/20 backdrop-blur-sm rounded-xl mb-2 border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>

            <button 
              onClick={resetGame} 
              className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>

          {/* Completion Message */}
          {current.id === -1 && current.pl === "Koniec!" && (
            <div className="mt-8 text-center p-8 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl border border-yellow-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-green-400/10 to-blue-400/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Gratulacje!
                </h2>
                <p className="text-gray-300 text-lg">Ukończyłeś wszystkie fiszki w tej kategorii!</p>
                <div className="mt-4 text-2xl font-bold text-yellow-400">
                  +50 XP Bonus!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Cards */}
        <div className="grid gap-6">
          
          {/* Category Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-blue-400" />
              Kategoria
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    category === cat.name
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level & Direction */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Level Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-green-400" />
                Poziom
              </h3>
              <div className="grid grid-cols-3 gap-3">
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
                      className={`p-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? `bg-gradient-to-r ${levelColors[lvl]} text-white shadow-lg`
                          : isAvailable
                          ? "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20"
                          : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-xl mb-2">
                        {lvl === 'easy' ? '●' : lvl === 'medium' ? '●●' : '●●●'}
                      </div>
                      {levelLabels[lvl]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direction Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ChevronRight className="w-6 h-6 mr-2 text-violet-400" />
                Kierunek
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDirection("pl-en")}
                  className={`p-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    direction === "pl-en"
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="text-xl mb-2">🇵🇱 → 🇬🇧</div>
                  PL → EN
                </button>
                <button
                  onClick={() => setDirection("en-pl")}
                  className={`p-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    direction === "en-pl"
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="text-xl mb-2">🇬🇧 → 🇵🇱</div>
                  EN → PL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}