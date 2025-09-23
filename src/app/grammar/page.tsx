"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Brain, Clock, MessageSquare, Eye, EyeOff, Star, Sparkles, BookOpen, Lightbulb, CheckCircle } from "lucide-react";

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

const times = [
  {
    name: "Present Simple",
    explanation: "Używamy, gdy mówimy o czymś, co dzieje się zawsze lub regularnie.",
    example: "I eat breakfast every day.",
    hints: ["every day", "always", "usually", "often", "never"],
    difficulty: "easy"
  },
  {
    name: "Present Continuous",
    explanation: "Używamy, gdy coś dzieje się teraz.",
    example: "I am eating breakfast (właśnie teraz).",
    hints: ["now", "at the moment", "currently"],
    difficulty: "easy"
  },
  {
    name: "Past Simple",
    explanation: "Używamy, gdy coś wydarzyło się w przeszłości i już się skończyło.",
    example: "I ate breakfast yesterday.",
    hints: ["yesterday", "last week", "in 2000"],
    difficulty: "easy"
  },
  {
    name: "Past Continuous",
    explanation: "Używamy, gdy coś trwało przez pewien czas w przeszłości.",
    example: "I was eating when you called.",
    hints: ["while", "when"],
    difficulty: "medium"
  },
  {
    name: "Present Perfect",
    explanation: "Używamy, gdy coś się wydarzyło i ma to wpływ na teraz.",
    example: "I have eaten (teraz nie jestem głodny).",
    hints: ["just", "already", "yet", "ever", "never"],
    difficulty: "medium"
  },
  {
    name: "Past Perfect",
    explanation: "Używamy, gdy coś wydarzyło się przed czymś innym w przeszłości.",
    example: "I had eaten before she arrived.",
    hints: ["before", "after", "by the time"],
    difficulty: "hard"
  },
  {
    name: "Future Simple",
    explanation: "Używamy, gdy coś wydarzy się w przyszłości.",
    example: "I will eat breakfast tomorrow.",
    hints: ["tomorrow", "next week", "in 2025"],
    difficulty: "easy"
  },
  {
    name: "Future Continuous",
    explanation: "Używamy, gdy coś będzie się działo w określonym momencie w przyszłości.",
    example: "I will be eating at 8am.",
    hints: ["at this time tomorrow", "when you arrive"],
    difficulty: "hard"
  },
  {
    name: "Future Perfect",
    explanation: "Używamy, gdy coś wydarzy się i zakończy przed jakimś momentem w przyszłości.",
    example: "I will have eaten before 9am.",
    hints: ["by", "by the time"],
    difficulty: "hard"
  },
  {
    name: "Future Perfect Continuous",
    explanation: "Używamy, gdy coś będzie trwało aż do jakiegoś momentu w przyszłości.",
    example: "I will have been eating for an hour by 9am.",
    hints: ["for", "by"],
    difficulty: "hard"
  }
];

const extraSections = [
  {
    name: "Zero Conditional",
    explanation: "Prawdy ogólne – jeśli coś się wydarzy, zawsze ma ten sam rezultat.",
    example: "If you heat water to 100°C, it boils.",
    hints: ["if + Present Simple", "czasowniki w czasie teraźniejszym"],
    difficulty: "medium"
  },
  {
    name: "First Conditional",
    explanation: "Prawdopodobna przyszłość – coś może się wydarzyć, jeśli spełni się warunek.",
    example: "If it rains, I will stay home.",
    hints: ["if + Present Simple", "will + czasownik"],
    difficulty: "medium"
  },
  {
    name: "Second Conditional",
    explanation: "Mało prawdopodobne lub nierealne sytuacje w teraźniejszości/przyszłości.",
    example: "If I were you, I would go.",
    hints: ["if + Past Simple", "would + czasownik"],
    difficulty: "hard"
  },
  {
    name: "Third Conditional",
    explanation: "Coś, co się nie wydarzyło w przeszłości i jakie byłyby tego skutki.",
    example: "If I had studied, I would have passed.",
    hints: ["if + Past Perfect", "would have + III forma"],
    difficulty: "hard"
  },
  {
    name: "Strona bierna (Passive Voice)",
    explanation: "Używana, gdy ważniejsze jest to, co się stało, niż kto to zrobił.",
    example: "The cake was eaten by Tom.",
    hints: ["to be + III forma czasownika"],
    difficulty: "hard"
  },
  {
    name: "Mowa zależna (Reported Speech)",
    explanation: "Opisujemy, co ktoś powiedział, nie cytując go bezpośrednio.",
    example: "She said (that) she was tired.",
    hints: ["czas cofamy o jeden (np. Present Simple → Past Simple)"],
    difficulty: "hard"
  }
];

export default function SciagaPage() {
  const [masteredItems, setMasteredItems] = useState(new Set());
  const [showMastered, setShowMastered] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // Particle system for celebrations
  const createParticles = (x: number, y: number, type: 'success' | 'warning' = 'success'): void => {
    const colors = type === 'success' ? ['#10B981', '#34D399', '#6EE7B7'] : ['#F59E0B', '#FBBF24', '#FCD34D'];
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: Math.random(),
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        velocity: { x: (Math.random() - 0.5) * 8, y: Math.random() * -10 - 3 }
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  };

const toggleMastered = (itemName: string, event: React.MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation();

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  setMasteredItems(prev => {
    const newSet = new Set(prev);
    if (newSet.has(itemName)) {
      newSet.delete(itemName);
    } else {
      newSet.add(itemName);
      createParticles(x, y);
      // achievements...
    }
    return newSet;
  });
};

  // Hide achievement after 3 seconds
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  const allItems = [...times, ...extraSections];
  
  const filteredTimes = times.filter(item => {
    const difficultyMatch = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    const masteredMatch = showMastered || !masteredItems.has(item.name);
    return difficultyMatch && masteredMatch;
  });

  const filteredExtras = extraSections.filter(item => {
    const difficultyMatch = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    const masteredMatch = showMastered || !masteredItems.has(item.name);
    return difficultyMatch && masteredMatch;
  });

  const masteredCount = masteredItems.size;
  const totalCount = allItems.length;
  const progressPercentage = (masteredCount / totalCount) * 100;

type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return 'from-green-400 to-green-600';
    case 'medium': return 'from-amber-400 to-amber-600';
    case 'hard': return 'from-red-400 to-red-600';
    default: return 'from-blue-400 to-blue-600'; // np. dla "all"
  }
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
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <BookOpen className="w-12 h-12 mr-4 text-purple-400" />
              Ściąga z angielskiego
            </h1>
            <p className="text-gray-300 text-xl">Opanuj gramatykę angielską krok po kroku</p>
          </div>

          {/* Stats Bar */}
          <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="text-white font-bold">{masteredCount} opanowanych</div>
                    <div className="text-gray-300 text-sm">z {totalCount} zagadnień</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-bold">{Math.round(progressPercentage)}%</div>
                    <div className="text-gray-300 text-sm">Postęp</div>
                  </div>
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
              <span>Twój postęp w nauce gramatyki</span>
              <span>{totalCount - masteredCount} pozostało</span>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            
            {/* Difficulty Filter */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Poziom trudności:
              </label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="block w-full py-2 px-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all" className="bg-gray-800 text-white">Wszystkie poziomy</option>
                <option value="easy" className="bg-gray-800 text-white">Łatwy</option>
                <option value="medium" className="bg-gray-800 text-white">Średni</option>
                <option value="hard" className="bg-gray-800 text-white">Trudny</option>
              </select>
            </div>

            {/* Show/Hide Mastered */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {showMastered ? <Eye className="w-4 h-4 inline mr-2" /> : <EyeOff className="w-4 h-4 inline mr-2" />}
                Filtr:
              </label>
              <button
                onClick={() => setShowMastered(!showMastered)}
                className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  !showMastered
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                {!showMastered ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {!showMastered ? 'Ukryj opanowane' : 'Pokaż wszystkie'}
              </button>
            </div>
          </div>

          {/* Tenses Section */}
          {filteredTimes.length > 0 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Clock className="w-8 h-8 mr-3 text-blue-400" />
                  Czasy gramatyczne
                </h2>
                <p className="text-gray-400">Opanuj wszystkie czasy angielskie</p>
              </div>

              <div className="grid gap-6 mb-16">
                {filteredTimes.map((time) => {
                  const isMastered = masteredItems.has(time.name);
                  return (
                    <div
                      key={time.name}
                      className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 transform hover:scale-[1.02] p-6 ${
                        isMastered 
                          ? 'border-green-500/50 bg-green-900/20' 
                          : 'border-white/20 hover:bg-white/15'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(time.difficulty)} text-white`}>
                            {time.difficulty === 'easy' ? 'Łatwy' : time.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                          </div>
                          <h3 className="text-xl font-bold text-white">{time.name}</h3>
                        </div>
                        
                        <button
                          onClick={(e) => toggleMastered(time.name, e)}
                          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isMastered 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-white/20 text-gray-400 hover:bg-white/30'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {time.explanation}
                      </p>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-300 font-medium text-sm">Przykład:</span>
                        </div>
                        <p className="text-white font-medium">{time.example}</p>
                      </div>
                      
                      {time.hints && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-300 font-medium text-sm">Słowa kluczowe:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {time.hints.map((hint, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                {hint}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isMastered && (
                        <div className="mt-4 flex items-center text-green-300 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Opanowane!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Grammar Sections */}
          {filteredExtras.length > 0 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 mr-3 text-purple-400" />
                  Inne ważne zagadnienia
                </h2>
                <p className="text-gray-400">Dodatkowe konstrukcje gramatyczne</p>
              </div>

              <div className="grid gap-6">
                {filteredExtras.map((section) => {
                  const isMastered = masteredItems.has(section.name);
                  return (
                    <div
                      key={section.name}
                      className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 transform hover:scale-[1.02] p-6 ${
                        isMastered 
                          ? 'border-green-500/50 bg-green-900/20' 
                          : 'border-white/20 hover:bg-white/15'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(section.difficulty)} text-white`}>
                            {section.difficulty === 'easy' ? 'Łatwy' : section.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                          </div>
                          <h3 className="text-xl font-bold text-white">{section.name}</h3>
                        </div>
                        
                        <button
                          onClick={(e) => toggleMastered(section.name, e)}
                          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isMastered 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-white/20 text-gray-400 hover:bg-white/30'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {section.explanation}
                      </p>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-300 font-medium text-sm">Przykład:</span>
                        </div>
                        <p className="text-white font-medium">{section.example}</p>
                      </div>
                      
                      {section.hints && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Lightbulb className="w-4 h-4 text-purple-400 mr-2" />
                            <span className="text-purple-300 font-medium text-sm">Wskazówki:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {section.hints.map((hint, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                {hint}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isMastered && (
                        <div className="mt-4 flex items-center text-green-300 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Opanowane!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty State */}
          {filteredTimes.length === 0 && filteredExtras.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">Brak zagadnień do wyświetlenia</h3>
              <p className="text-gray-300">
                {!showMastered ? 'Gratulacje! Opanowałeś wszystkie zagadnienia w tym filtrze!' : 'Spróbuj zmienić filtr poziom trudności.'}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}