"use client"
import React, { useState, useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import Navbar from '@/components/Navbar';

import { tasks } from "@/components/words/tasks";
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
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300">
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

  // Gamifikacja - osiągnięcia
  const achievementTypes = {
    first_success: { name: "Pierwszy sukces!", icon: "🎯" },
    streak_5: { name: "Na fali!", icon: "🔥" },
    streak_10: { name: "Niepokonany!", icon: "⚡" },
    perfectionist: { name: "Perfekcjonista!", icon: "👑" }
  };

  useEffect(() => {
    setShuffledTasks(shuffleArray(tasks));
  }, []);

  useEffect(() => {
    setVisibleTasks(20);
  }, [activeLevel]);

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
    const correctAnswers = Object.values(selectedAnswers).filter(
      (answer, index) => tasks[index] && answer === tasks[index].answer
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

  const handleAnswer = (taskId, selected, event) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || selectedAnswers[taskId]) return;
    
    const isCorrect = selected === task.answer;
    
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
  };

  const filteredTasks = activeLevel === "Wszystkie" 
    ? shuffledTasks 
    : shuffledTasks.filter(task => task.level === activeLevel);

  const tasksToShow = filteredTasks.slice(0, visibleTasks);

  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([taskId, answer]) => {
      const task = tasks.find(t => t.id === parseInt(taskId));
      return task && answer === task.answer;
    }
  ).length;

  const totalAnswered = Object.keys(selectedAnswers).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Gradient overlay animowany */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      
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
        {/* Header z statystykami */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Zadania Angielski ✨
          </h1>
          
          {/* Paski postępu */}
          <div className="max-w-2xl mx-auto mb-6 space-y-4">
            {/* XP Bar */}
            <div className="text-center">
              <div className="flex justify-between text-sm mb-2">
                <span>Poziom {level}</span>
                <span>{totalXP % 100}/100 XP</span>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${(totalXP % 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Energy Bar */}
            <div className="text-center">
              <div className="flex justify-between text-sm mb-2">
                <span>Energia</span>
                <span>{energy}/100</span>
              </div>
              <div className="bg-gray-700 rounded-full overflow-hidden h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    energy > 60 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    energy > 30 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Statystyki */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{correctAnswers}</div>
              <div className="text-xs text-gray-400">Poprawne</div>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{accuracy}%</div>
              <div className="text-xs text-gray-400">Celność</div>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-gray-400">Seria</div>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{level}</div>
              <div className="text-xs text-gray-400">Poziom</div>
            </div>
          </div>

          {/* Streak indicator */}
          {streak > 0 && (
            <div className="inline-flex items-center bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30 mb-6">
              <Flame className="w-4 h-4 text-orange-300 mr-2" />
              <span className="text-orange-300 font-bold">
                {streak} z rzędu! {streak >= 5 && '🔥'} {streak >= 10 && '⚡'} {streak >= 15 && '💫'}
              </span>
            </div>
          )}
        </div>

        {/* Filtry poziomów */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {levels.map((levelName) => (
            <button
              key={levelName}
              onClick={() => setActiveLevel(levelName)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 font-medium ${
                activeLevel === levelName
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20'
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
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15 animate-fade-in"
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
                  
                  <div className="flex items-center text-purple-400">
                    <Brain className="w-5 h-5 mr-2" />
                    <span className="text-sm">#{task.id}</span>
                  </div>
                </div>

                <p className="text-white text-lg mb-6 font-medium">
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
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white scale-105 shadow-lg shadow-green-500/30'
                              : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white'
                            : option === task.answer && selected !== option
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/30'
                            : 'bg-black/20 border-white/10 text-gray-400'
                          : 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:border-white/30 cursor-pointer'
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
                    <p className="text-white/90 text-sm">
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
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
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
  );
}