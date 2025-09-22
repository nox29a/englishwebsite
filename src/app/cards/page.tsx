"use client"

import { useState, useEffect } from 'react';
import { Categories } from "@/components/words/flashcards_words";
import Navbar from "@/components/Navbar";
import { Check, X, Eye, EyeOff, Brain, Trophy, Star, Sparkles, Flame, Crown } from 'lucide-react';

interface Flashcard {
  id: number;
  en: string;
  pl: string;
  level: string;
}

export default function Flashcards() {
  const [selectedCategory, setSelectedCategory] = useState<string>(Categories[0]?.name || '');
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [direction, setDirection] = useState<string>('enToPl');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [hideKnown, setHideKnown] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [streak, setStreak] = useState(0);
  const [totalSeen, setTotalSeen] = useState(0);
  const [showAchievement, setShowAchievement] = useState(null);
  const [particles, setParticles] = useState([]);

  // Particle system for celebrations
  const createParticles = (x, y, type = 'success') => {
    const newParticles = [];
    const colors = type === 'success' ? ['#10B981', '#34D399', '#6EE7B7'] : ['#F59E0B', '#FBBF24', '#FCD34D'];
    
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

  // Funkcja do tasowania kart z typami TypeScript
  const shuffleArray = (array: Flashcard[]): Flashcard[] => {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Ładowanie i tasowanie kart przy zmianie kategorii lub trudności
  useEffect(() => {
    const category = Categories.find(cat => cat.name === selectedCategory);
    if (!category) return;
    
    let selectedWords: Flashcard[] = category.words.filter((word: any) => word.level === difficulty);
    
    setCards(shuffleArray(selectedWords));
    setFlippedCards({});
    setVisibleCount(20);
  }, [difficulty, selectedCategory]);

  // Funkcja do ładowania kolejnych fiszek
  const loadMoreCards = (): void => {
    setVisibleCount(prevCount => prevCount + 20);
  };

  // Obsługa odwracania karty
  const handleCardClick = (index: number): void => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    if (!flippedCards[index]) {
      setTotalSeen(prev => prev + 1);
    }
  };

  // Obsługa zaznaczania jako znane
  const handleKnownToggle = (cardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    setKnownCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
        setStreak(0);
      } else {
        newSet.add(cardId);
        const newStreak = streak + 1;
        setStreak(newStreak);
        createParticles(x, y, 'success');
        
        // Achievement for streak
        if (newStreak === 10) {
          setShowAchievement({
            name: 'Szybka nauka!',
            description: '10 słów opanowanych z rzędu!',
            icon: '🔥'
          });
        } else if (newStreak === 25) {
          setShowAchievement({
            name: 'Mistrz fiszek!',
            description: '25 słów opanowanych z rzędu!',
            icon: '🏆'
          });
        }
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

  // Filtrowanie kart
  const filteredCards = hideKnown 
    ? cards.filter(card => !knownCards.has(card.id))
    : cards;

  const getAvailableLevels = () => {
    const category = Categories.find(cat => cat.name === selectedCategory);
    if (!category) return [];
    const levels = [...new Set(category.words.map((word: any) => word.level))];
    return levels;
  };

  const knownCount = knownCards.size;
  const progressPercentage = cards.length > 0 ? (knownCount / cards.length) * 100 : 0;

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

        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
              <Brain className="w-12 h-12 mr-4 text-purple-400" />
              Fiszki do nauki
            </h1>
            <p className="text-gray-300 text-xl">Naucz się nowych słów w interaktywny sposób!</p>
          </div>

          {/* Top Stats Bar */}
          <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="text-white font-bold">{knownCount} opanowanych</div>
                    <div className="text-gray-300 text-sm">z {cards.length} słów</div>
                  </div>
                </div>

                {streak > 0 && (
                  <div className="flex items-center space-x-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <div>
                      <div className="text-white font-bold">{streak} streak</div>
                      <div className="text-gray-300 text-sm">Z rzędu!</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-white font-bold">{totalSeen}</div>
                    <div className="text-gray-300 text-sm">Przejrzanych</div>
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
              <span>Postęp: {Math.round(progressPercentage)}%</span>
              <span>{cards.length - knownCount} pozostało do nauki</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            
            {/* Category Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategoria:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full py-2 px-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Categories.map(category => (
                  <option key={category.name} value={category.name} className="bg-gray-800 text-white">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">Poziom:</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full py-2 px-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {getAvailableLevels().map(level => (
                  <option key={level} value={level} className="bg-gray-800 text-white">
                    {level === 'easy' ? 'Łatwy' : level === 'medium' ? 'Średni' : 'Trudny'}
                  </option>
                ))}
              </select>
            </div>

            {/* Direction Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">Kierunek:</label>
              <select 
                value={direction} 
                onChange={(e) => setDirection(e.target.value)}
                className="block w-full py-2 px-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="enToPl" className="bg-gray-800 text-white">🇬🇧 → 🇵🇱</option>
                <option value="plToEn" className="bg-gray-800 text-white">🇵🇱 → 🇬🇧</option>
              </select>
            </div>

            {/* Hide Known Toggle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filtr:</label>
              <button
                onClick={() => setHideKnown(!hideKnown)}
                className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  hideKnown
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                {hideKnown ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {hideKnown ? 'Ukryj znane' : 'Pokaż wszystkie'}
              </button>
            </div>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.slice(0, visibleCount).map((card: Flashcard, index: number) => {
              const isKnown = knownCards.has(card.id);
              const isFlipped = flippedCards[index];
              
              return (
                <div 
                  key={`${card.id}-${index}`}
                  className="card-container h-64 cursor-pointer group"
                  onClick={() => handleCardClick(index)}
                >
                  <div className={`card relative w-full h-full transition-all duration-500 ${isFlipped ? 'is-flipped' : ''}`}>
                    
                    {/* Front of Card */}
                    <div className={`card-face card-front absolute inset-0 rounded-xl shadow-2xl p-4 flex flex-col border transition-all duration-300 ${
                      isKnown 
                        ? 'bg-gradient-to-br from-green-800/40 to-green-900/40 border-green-500/50' 
                        : 'bg-white/10 backdrop-blur-lg border-white/20 group-hover:bg-white/15'
                    }`}>
                      
                      {/* Known Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                          difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                          difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {difficulty === 'easy' ? 'Łatwy' : difficulty === 'medium' ? 'Średni' : 'Trudny'}
                        </div>
                        
                        <button
                          onClick={(e) => handleKnownToggle(card.id, e)}
                          className={`p-1 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isKnown 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-white/20 text-gray-400 hover:bg-white/30'
                          }`}
                        >
                          {isKnown ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-purple-300 mb-2 uppercase tracking-wider font-medium">
                          {direction === 'enToPl' ? 'English' : 'Polski'}
                        </div>
                        <p className="text-xl font-bold text-white mb-2 leading-tight">
                          {direction === 'enToPl' ? card.en : card.pl}
                        </p>
                      </div>

                      <div className="text-xs text-gray-400 text-center">
                        Kliknij aby obrócić
                      </div>
                    </div>
                    
                    {/* Back of Card */}
                    <div className={`card-face card-back absolute inset-0 rounded-xl shadow-2xl p-4 flex flex-col border transition-all duration-300 ${
                      isKnown 
                        ? 'bg-gradient-to-br from-green-800/40 to-green-900/40 border-green-500/50' 
                        : 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50'
                    }`}>
                      
                      {/* Known Badge - Back */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-1">
                          {isKnown && (
                            <div className="flex items-center">
                              <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-xs text-yellow-300 font-medium">Opanowane!</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => handleKnownToggle(card.id, e)}
                          className={`p-1 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isKnown 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-white/20 text-gray-400 hover:bg-white/30'
                          }`}
                        >
                          {isKnown ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-blue-300 mb-2 uppercase tracking-wider font-medium">
                          {direction === 'enToPl' ? 'Polski' : 'English'}
                        </div>
                        <p className="text-xl font-bold text-white mb-2 leading-tight">
                          {direction === 'enToPl' ? card.pl : card.en}
                        </p>
                      </div>

                      <div className="text-xs text-blue-300 text-center">
                        Kliknij aby obrócić
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredCards.length && (
            <div className="flex justify-center mt-10">
              <button 
                onClick={loadMoreCards}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Pokaż więcej ({filteredCards.length - visibleCount} pozostałych)
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">Brak fiszek do wyświetlenia</h3>
              <p className="text-gray-300">
                {hideKnown ? 'Wszystkie fiszki zostały opanowane! Gratulacje!' : 'Wybierz inną kategorię lub poziom trudności.'}
              </p>
            </div>
          )}

        </div>

        <style jsx>{`
          .card-container {
            perspective: 1000px;
          }
          
          .card {
            transform-style: preserve-3d;
            position: relative;
          }
          
          .card-face {
            backface-visibility: hidden;
            transition: transform 0.5s ease-in-out;
          }
          
          .card-front {
            transform: rotateY(0deg);
          }
          
          .card-back {
            transform: rotateY(180deg);
          }
          
          .is-flipped .card-front {
            transform: rotateY(-180deg);
          }
          
          .is-flipped .card-back {
            transform: rotateY(0deg);
          }
        `}</style>
      </div>
    </>
  );
}