"use client"

import { useState, useEffect, useMemo } from 'react';
import type { Category, Word } from "@/components/words/flashcards_words";
import {
  LANGUAGE_DATASETS,
  LANGUAGE_OPTIONS,
} from "@/components/words/language_packs";
import Navbar from "@/components/Navbar";
import { Check, X, Eye, EyeOff, Brain, Trophy, Star, Sparkles, Flame, Crown } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

type Direction = "targetToNative" | "nativeToTarget";
type Flashcard = Word;

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

export default function Flashcards() {
  const { language } = useLanguage();
  const languageCategories = useMemo<Category[]>(
    () => LANGUAGE_DATASETS[language] ?? [],
    [language]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => languageCategories[0]?.name || ''
  );
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [direction, setDirection] = useState<Direction>('targetToNative');
  const [cards, setCards] = useState<Word[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [hideKnown, setHideKnown] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [streak, setStreak] = useState<number>(0);
  const [totalSeen, setTotalSeen] = useState<number>(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Particle system for celebrations
  const createParticles = (x: number, y: number, type: 'success' | 'warning' = 'success'): void => {
    const colors =
      type === 'success'
        ? ['var(--chart-success-1)', 'var(--chart-success-2)', 'var(--chart-success-3)']
        : ['var(--chart-warning-1)', 'var(--chart-warning-2)', 'var(--chart-warning-3)'];
    
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

  // Funkcja do tasowania kart z typami TypeScript
  const shuffleArray = (array: Word[]): Word[] => {
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
    const category = languageCategories.find(cat => cat.name === selectedCategory);
    if (!category) {
      setCards([]);
      return;
    }

    const selectedWords: Word[] = category.words.filter((word) => word.level === difficulty);

    setCards(shuffleArray(selectedWords));
    setFlippedCards({});
    setVisibleCount(20);
  }, [difficulty, selectedCategory, languageCategories]);

  useEffect(() => {
    const defaultCategory = languageCategories[0]?.name || '';
    setSelectedCategory(current => {
      if (!current) {
        return defaultCategory;
      }

      const exists = languageCategories.some(cat => cat.name === current);
      return exists ? current : defaultCategory;
    });
    setKnownCards(new Set());
    setFlippedCards({});
    setVisibleCount(20);
    setStreak(0);
    setTotalSeen(0);
  }, [languageCategories]);

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
  const handleKnownToggle = (cardId: number, event: React.MouseEvent): void => {
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

  const getAvailableLevels = (): string[] => {
    const category = languageCategories.find(cat => cat.name === selectedCategory);
    if (!category) return [];
    const levels = [...new Set(category.words.map((word) => word.level))];
    return levels;
  };

  const knownCount = knownCards.size;
  const progressPercentage = cards.length > 0 ? (knownCount / cards.length) * 100 : 0;

  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find(option => option.code === language),
    [language]
  );

  const targetLanguageLabel = currentLanguageOption?.label ?? 'Język docelowy';
  const targetLanguageFlag = currentLanguageOption?.flag ?? '🏳️';

  // Reszta kodu pozostaje bez zmian...
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
            <div className="bg-gradient-to-r from-[var(--achievement-gradient-from)] to-[var(--achievement-gradient-to)] text-[var(--foreground)] px-6 py-4 rounded-xl shadow-2xl border-2 border-[color:var(--achievement-border)]">
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
          



          {/* Progress Bar */}

          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            
            {/* Category Selection */}
            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl p-4 border border-[color:var(--border-translucent-strong)]">
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Kategoria:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full py-2 px-3 border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-strong)]"
              >
                {languageCategories.map(category => (
                  <option key={category.name} value={category.name} className="bg-[var(--select-option-bg)] text-[var(--foreground)]">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl p-4 border border-[color:var(--border-translucent-strong)]">
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Poziom:</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full py-2 px-3 border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-strong)]"
              >
                {getAvailableLevels().map(level => (
                  <option key={level} value={level} className="bg-[var(--select-option-bg)] text-[var(--foreground)]">
                    {level === 'easy' ? 'Łatwy' : level === 'medium' ? 'Średni' : 'Trudny'}
                  </option>
                ))}
              </select>
            </div>

            {/* Direction Selection */}
            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl p-4 border border-[color:var(--border-translucent-strong)]">
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Kierunek:</label>
              <select 
                value={direction}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="block w-full py-2 px-3 border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-strong)]"
              >
                <option value="targetToNative" className="bg-[var(--select-option-bg)] text-[var(--foreground)]">{`${targetLanguageFlag} → 🇵🇱`}</option>
                <option value="nativeToTarget" className="bg-[var(--select-option-bg)] text-[var(--foreground)]">{`🇵🇱 → ${targetLanguageFlag}`}</option>
              </select>
            </div>

            {/* Hide Known Toggle */}
            <div className="bg-[var(--overlay-light)] backdrop-blur-lg rounded-xl p-4 border border-[color:var(--border-translucent-strong)]">
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Filtr:</label>
              <button
                onClick={() => setHideKnown(!hideKnown)}
                className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  hideKnown
                    ? 'bg-gradient-to-r from-[var(--toggle-gradient-from)] to-[var(--toggle-gradient-to)] text-[var(--foreground)]'
                    : 'bg-[var(--overlay-light-strong)] text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-hover)]'
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
                        ? 'bg-gradient-to-br from-[var(--card-known-gradient-from)] to-[var(--card-known-gradient-to)] border-[color:var(--card-known-border)]' 
                        : 'bg-[var(--overlay-light)] backdrop-blur-lg border-[color:var(--border-translucent-strong)] group-hover:bg-[var(--overlay-light-soft)]'
                    }`}>
                      
                      {/* Known Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                          difficulty === 'easy' ? 'bg-[var(--badge-easy-bg)] text-[var(--badge-easy-text)]' :
                          difficulty === 'medium' ? 'bg-[var(--badge-medium-bg)] text-[var(--badge-medium-text)]' :
                          'bg-[var(--badge-hard-bg)] text-[var(--badge-hard-text)]'
                        }`}>
                          {difficulty === 'easy' ? 'Łatwy' : difficulty === 'medium' ? 'Średni' : 'Trudny'}
                        </div>
                        
                        <button
                          onClick={(e) => handleKnownToggle(card.id, e)}
                          className={`p-1 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isKnown 
                              ? 'bg-[var(--success-solid)] text-[var(--foreground)] shadow-lg shadow-[0_10px_25px_var(--shadow-success)]' 
                              : 'bg-[var(--overlay-light-strong)] text-[var(--text-soft)] hover:bg-[var(--overlay-light-hover)]'
                          }`}
                        >
                          {isKnown ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-[var(--label-purple)] mb-2 uppercase tracking-wider font-medium">
                          {direction === 'targetToNative' ? targetLanguageLabel : 'Polski'}
                        </div>
                        <p className="text-xl font-bold text-[var(--foreground)] mb-2 leading-tight card-text">
                          {direction === 'targetToNative' ? card.en : card.pl}
                        </p>
                      </div>

                      <div className="text-xs text-[var(--text-soft)] text-center">
                        Kliknij aby obrócić
                      </div>
                    </div>
                    
                    {/* Back of Card */}
                    <div className={`card-face card-back absolute inset-0 rounded-xl shadow-2xl p-4 flex flex-col border transition-all duration-300 ${
                      isKnown 
                        ? 'bg-gradient-to-br from-[var(--card-known-gradient-from)] to-[var(--card-known-gradient-to)] border-[color:var(--card-known-border)]' 
                        : 'bg-gradient-to-br from-[var(--card-default-gradient-from)] to-[var(--card-default-gradient-to)] border-[color:var(--card-default-border)]'
                    }`}>
                      
                      {/* Known Badge - Back */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-1">
                          {isKnown && (
                            <div className="flex items-center">
                              <Sparkles className="w-4 h-4 text-[var(--icon-yellow)] mr-1" />
                              <span className="text-xs text-[var(--achievement-border)] font-medium">Opanowane!</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => handleKnownToggle(card.id, e)}
                          className={`p-1 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isKnown 
                              ? 'bg-[var(--success-solid)] text-[var(--foreground)] shadow-lg shadow-[0_10px_25px_var(--shadow-success)]' 
                              : 'bg-[var(--overlay-light-strong)] text-[var(--text-soft)] hover:bg-[var(--overlay-light-hover)]'
                          }`}
                        >
                          {isKnown ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-[var(--label-blue)] mb-2 uppercase tracking-wider font-medium">
                          {direction === 'targetToNative' ? 'Polski' : targetLanguageLabel}
                        </div>
                        <p className="text-xl font-bold text-[var(--foreground)] mb-2 leading-tight card-text">
                          {direction === 'targetToNative' ? card.pl : card.en}
                        </p>
                      </div>

                      <div className="text-xs text-[var(--label-blue)] text-center">
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
                className="px-8 py-3 bg-gradient-to-r from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)] hover:from-[var(--cta-gradient-hover-from)] hover:to-[var(--cta-gradient-hover-to)] text-[var(--foreground)] font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Pokaż więcej 
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Brak fiszek do wyświetlenia</h3>
              <p className="text-[var(--muted-foreground)]">
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
            overflow: hidden;
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

          .card-text {
            overflow-wrap: anywhere;
            word-break: break-word;
          }
        `}</style>
      </div>
    </>
  );
}
