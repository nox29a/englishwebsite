"use client"
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import Navbar from '@/components/Navbar';

import { TASK_BANKS } from "@/components/words/tasks";
import { LANGUAGE_OPTIONS } from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";
import { addPoints } from "../utils/addPoints";
import { saveAttempt } from "../utils/saveAttempt";

import { Trophy, Zap, Target, Star, Award, ChevronRight, Brain, Flame } from "lucide-react";

const levels = ["Wszystkie", "Łatwy", "Średni", "Trudny"];


// Funkcja do mieszania tablicy
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Komponent Achievement Popup
const AchievementPopup = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-[var(--foreground)] px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <div className="font-bold">{achievement.name}</div>
            <div className="text-sm opacity-90">+50 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponent cząsteczek
const ParticleEffect = ({ x, y, color, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{ left: x, top: y }}
    >
      <div
        className={`w-2 h-2 ${color} rounded-full`}
        style={{
          animation: 'particle-float 3s ease-out forwards'
        }}
      />
      <style jsx>{`
        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-50px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function ZadaniaPage() {
  const { language } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [activeLevel, setActiveLevel] = useState("Wszystkie");
  const [shuffledTasks, setShuffledTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState(20);
  const [achievements, setAchievements] = useState([]);
  const [particles, setParticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [energy, setEnergy] = useState(100);
  const [user, setUser] = useState(null);

  const lastAnswerTimestampRef = useRef(Date.now());

  const activeTasks = TASK_BANKS[language] || TASK_BANKS.en;
  const currentLanguageOption = LANGUAGE_OPTIONS.find(option => option.code === language);
  const targetLabel = currentLanguageOption?.label || "Angielski";

  // Gamifikacja - osiągnięcia
  const achievementTypes = {
    first_success: { name: "Pierwszy sukces!", icon: "🎯" },
    streak_5: { name: "Na fali!", icon: "🔥" },
    streak_10: { name: "Niepokonany!", icon: "⚡" },
    perfectionist: { name: "Perfekcjonista!", icon: "👑" }
  };

  useEffect(() => {
    setShuffledTasks(shuffleArray(activeTasks));
    setSelectedAnswers({});
    setActiveLevel("Wszystkie");
    setVisibleTasks(Math.min(20, activeTasks.length));
    setStreak(0);
  }, [language]);

  useEffect(() => {
    setVisibleTasks(Math.min(20, activeTasks.length));
  }, [activeLevel, language]);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user && isMounted) {
        setUser(user);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Funkcja do dodania cząsteczek
  const addParticles = (event, isCorrect) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const colors = isCorrect 
      ? ['bg-green-400', 'bg-green-500', 'bg-green-600']
      : ['bg-red-400', 'bg-red-500', 'bg-red-600'];

    for (let i = 0; i < 6; i++) {
      const particle = {
        id: Date.now() + i,
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
        y: rect.top + rect.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setParticles(prev => [...prev, particle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }, 3000);
    }
  };

  // Funkcja do sprawdzania osiągnięć
  const checkAchievements = (isCorrect, taskId) => {
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([id, answer]) => {
        const task = activeTasks.find(t => t.id === Number(id));
        return task && answer === task.answer;
      }
    ).length;

    if (correctAnswers === 1 && !achievements.some(a => a.type === 'first_success')) {
      const achievement = { ...achievementTypes.first_success, type: 'first_success' };
      setAchievements(prev => [...prev, achievement]);
    }

    if (streak === 5 && !achievements.some(a => a.type === 'streak_5')) {
      const achievement = { ...achievementTypes.streak_5, type: 'streak_5' };
      setAchievements(prev => [...prev, achievement]);
    }

    if (streak === 10 && !achievements.some(a => a.type === 'streak_10')) {
      const achievement = { ...achievementTypes.streak_10, type: 'streak_10' };
      setAchievements(prev => [...prev, achievement]);
    }
  };

  const handleAnswer = async (taskId, selected, event) => {
    const task = activeTasks.find(t => t.id === taskId);
    if (!task || selectedAnswers[taskId]) return;

    const isCorrect = selected === task.answer;
    const now = Date.now();
    const timeTaken = Math.max(0.5, (now - lastAnswerTimestampRef.current) / 1000);
    lastAnswerTimestampRef.current = now;

    setSelectedAnswers(prev => ({ ...prev, [taskId]: selected }));

    // Animacje cząsteczek
    addParticles(event, isCorrect);

    if (isCorrect) {
      // Aktualizuj streak
      setStreak(prev => prev + 1);
      
      // Dodaj XP
      const baseXP = 10;
      const streakBonus = Math.floor(streak / 5) * 5;
      const xpGain = baseXP + streakBonus;
      setTotalXP(prev => prev + xpGain);
      
      // Sprawdź poziom
      const newLevel = Math.floor(totalXP / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }

      // Sprawdź osiągnięcia
      checkAchievements(isCorrect, taskId);
    } else {
      setStreak(0);
      setEnergy(prev => Math.max(0, prev - 10));
    }

    if (user) {
      await saveAttempt(user.id, {
        type: "grammar_exercise",
        id: taskId,
        isCorrect,
        timeTaken,
        difficulty: task.level,
        skillTags: ["exercises", task.level.toLowerCase(), language],
        prompt: task.question,
        expectedAnswer: task.answer,
        userAnswer: selected,
        metadata: {
          explanation: task.explanation,
          options: task.options,
          language,
        },
        source: "grammar_exercises",
      });
    }
  };

  const filteredTasks = activeLevel === "Wszystkie"
    ? shuffledTasks
    : shuffledTasks.filter(task => task.level === activeLevel);

  const tasksToShow = filteredTasks.slice(0, visibleTasks);

  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([taskId, answer]) => {
      const task = activeTasks.find(t => t.id === parseInt(taskId));
      return task && answer === task.answer;
    }
  ).length;

  const totalAnswered = Object.keys(selectedAnswers).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <>
    <Navbar />
    
    <div className="axon-design min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] text-[var(--foreground)] relative overflow-hidden">
      {/* Gradient overlay animowany */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d4ed8]/15 via-[#1e3a8a]/15 to-transparent animate-pulse" />
      
      {/* Achievement Popups */}
      {achievements.map((achievement, index) => (
        <AchievementPopup
          key={`${achievement.type}-${index}`}
          achievement={achievement}
          onClose={() => setAchievements(prev => prev.filter((_, i) => i !== index))}
        />
      ))}

      {/* Particle Effects */}
      {particles.map(particle => (
        <ParticleEffect
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
          onComplete={() => setParticles(prev => prev.filter(p => p.id !== particle.id))}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 py-6 relative">


        {/* Filtry poziomów */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {levels.map((levelName) => (
            <button
              key={levelName}
              onClick={() => setActiveLevel(levelName)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 font-medium ${
                activeLevel === levelName
                  ? 'bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] text-[var(--foreground)] shadow-lg shadow-[rgba(29,78,216,0.35)]'
                  : 'bg-[var(--overlay-light)] backdrop-blur-sm hover:bg-[var(--overlay-light-strong)] text-[var(--foreground)] border border-[color:var(--border-translucent-strong)]'
              }`}
            >
              {levelName}
            </button>
          ))}
        </div>

        {/* Zadania */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {tasksToShow.map((task) => {
            const selected = selectedAnswers[task.id];
            const isCorrect = selected === task.answer;
            const isAnswered = selected !== undefined;

            return (
              <div
                key={task.id}
                className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl shadow-2xl border border-[color:var(--border-translucent-strong)] p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-[var(--overlay-light-soft)] animate-fade-in"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      task.level === 'Łatwy' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      task.level === 'Średni' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}>
                      {task.level}
                    </div>
                    {isAnswered && isCorrect && (
                      <div className="flex items-center text-green-400">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span className="text-sm font-bold">+{10 + Math.floor(streak / 5) * 5} XP</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-[var(--icon-purple)]">
                    <Brain className="w-5 h-5 mr-2" />
                    <span className="text-sm">#{task.id}</span>
                  </div>
                </div>

                <p className="text-[var(--foreground)] text-lg mb-6 font-medium">
                  {task.question}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {task.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={(e) => !isAnswered && handleAnswer(task.id, option, e)}
                      disabled={isAnswered}
                      className={`p-4 rounded-xl font-medium transition-all duration-300 border-2 transform ${
                        isAnswered
                          ? selected === option
                            ? isCorrect
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-[var(--foreground)] scale-105 shadow-lg shadow-green-500/30'
                              : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-[var(--foreground)]'
                            : option === task.answer && selected !== option
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-[var(--foreground)] shadow-lg shadow-green-500/30'
                          : 'bg-[var(--overlay-dark)] border-[color:var(--border-translucent)] text-[var(--muted-foreground)]'
                          : 'bg-[var(--overlay-light)] backdrop-blur-sm border-[color:var(--border-translucent-strong)] text-[var(--foreground)] hover:bg-[var(--overlay-light-strong)] hover:scale-105 hover:border-[color:var(--border-translucent-bold)] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && selected === option && (
                          <span className="ml-2">
                            {isCorrect ? '✅' : '❌'}
                          </span>
                        )}
                        {isAnswered && option === task.answer && selected !== option && (
                          <span className="ml-2">✅</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {isAnswered && (
                  <div className={`p-4 backdrop-blur-sm border rounded-xl ${
                    isCorrect 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-red-500/20 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <Trophy className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 text-red-400">❌</div>
                      )}
                      <span className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                        {isCorrect ? 'Doskonale!' : `Poprawna odpowiedź: ${task.answer}`}
                      </span>
                    </div>
                    <p className="text-[var(--foreground)] opacity-90 text-sm">
                      💡 {task.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredTasks.length > visibleTasks && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleTasks(prev => prev + 20)}
              className="px-8 py-4 bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] hover:from-[var(--cta-gradient-hover-from)] hover:to-[var(--cta-gradient-hover-to)] text-[var(--foreground)] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <span>Pokaż więcej zadań</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
    </>
  );
}